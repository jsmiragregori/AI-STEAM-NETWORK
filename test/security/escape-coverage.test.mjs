import assert from 'node:assert/strict';
import test from 'node:test';

import { classifyEmission, fileContext, generateEscapeCoverage } from '../../scripts/escape-coverage.mjs';

// CS-22 — Toda interpolación de una plantilla HTML emite algo escapado, un
// literal del código o un fragmento compuesto por el propio código. Un dato
// sin esc() hace fallar la prueba, venga de donde venga (no solo de pickLang).

test('ninguna plantilla HTML emite un dato sin escapar', async () => {
  const { unescaped } = await generateEscapeCoverage();
  assert.deepEqual(unescaped, [], `datos sin esc():\n${unescaped.join('\n')}`);
});

// Si el detector se vuelve permisivo, la prueba de arriba seguiría en verde
// sin proteger nada. Estas comprueban que sabe fallar y que no confunde.

const kind = (expr, source = '') => classifyEmission(expr, fileContext(source));

test('el detector marca como dato lo que llega de fuera', () => {
  for (const expr of [
    'item.title',
    "item.title || ''",
    "flag ? item.title : 'x'",
    'labels[id]',
    'pickLang(block.title)',
    'formatDate(doc.date)',
    'items.map(i => i.name).join(\'\')',
    'cond && item.title',
  ]) assert.equal(kind(expr), 'dato', expr);
});

test('el detector acepta lo escapado, lo literal y los fragmentos del código', () => {
  for (const expr of [
    'esc(item.title)',
    "esc(item.title || '')",
    "flag ? 'a' : 'b'",
    'idx + 1',
    'list.length',
    '`<b>x</b>`',
    'items.map(i => `<li>${esc(i)}</li>`).join(\'\')',
    'cond ? `<p>x</p>` : \'\'',
  ]) assert.notEqual(kind(expr), 'dato', expr);
});

test('el detector sigue una variable hasta sus asignaciones', () => {
  const source = [
    'const seguro = esc(item.title);',
    'let html = "";',
    'html += `<li>x</li>`;',
    'let mezcla = "";',
    'mezcla += item.title;',
  ].join('\n');
  assert.notEqual(kind('seguro', source), 'dato');
  assert.notEqual(kind('html', source), 'dato');
  // Basta una asignación de un dato para que la variable sea dato.
  assert.equal(kind('mezcla', source), 'dato');
});

test('una función cuenta como fragmento solo si todo lo que devuelve lo es', () => {
  const source = [
    'function bien(x) { return `<b>${esc(x)}</b>`; }',
    'function mal(x) { if (!x) return ""; return x.title; }',
    'function recursiva(x) { if (Array.isArray(x)) return x.map(y => recursiva(y)).join(""); return `<i>${esc(x)}</i>`; }',
  ].join('\n');
  assert.equal(kind('bien(a)', source), 'fragmento');
  assert.equal(kind('mal(a)', source), 'dato');
  assert.equal(kind('recursiva(a)', source), 'fragmento');
});

test('un array de fragmentos y un mapa de fragmentos no son datos', () => {
  const source = [
    'const badges = [];',
    'badges.push(`<span>${esc(a)}</span>`);',
    'const sucio = [];',
    'sucio.push(item.title);',
    'const mapa = { uno: `<p>x</p>`, dos: pinta() };',
    'function pinta() { return `<b>y</b>`; }',
    'const mezcla = { uno: `<p>x</p>`, dos: item.title };',
  ].join('\n');
  const at = source.length;
  const ctx = { ...fileContext(source), at };
  assert.notEqual(classifyEmission("badges.join('')", ctx), 'dato');
  assert.equal(classifyEmission("sucio.join('')", ctx), 'dato');
  assert.notEqual(classifyEmission('mapa[k]', ctx), 'dato');
  assert.equal(classifyEmission('mezcla[k]', ctx), 'dato');
});

// Reglas que dan algo por seguro: cada una con su caso a favor y en contra.
const conFuente = (source, expr) => {
  const at = source.lastIndexOf(expr);
  return classifyEmission(expr, { ...fileContext(source), at });
};

test('un parámetro vale lo que le pasen todas las llamadas', () => {
  const bien = [
    'function panel(itemsHtml) { return `<div>${itemsHtml}</div>`; }',
    'panel(`<li>x</li>`);',
    'panel(lista.map(i => `<li>${esc(i)}</li>`).join(""));',
  ].join('\n');
  assert.notEqual(conFuente(bien, 'itemsHtml'), 'dato');
  const mal = bien + '\npanel(item.title);';
  assert.equal(conFuente(mal, 'itemsHtml'), 'dato', 'basta una llamada con un dato');
});

test('una propiedad …Html vale lo que le asignen todos los objetos', () => {
  const bien = 'const a = { htmlValue: `<p>x</p>` };\nconst b = `${item.htmlValue}`;';
  assert.notEqual(conFuente(bien, 'item.htmlValue'), 'dato');
  const mal = 'const a = { htmlValue: `<p>x</p>` };\nconst c = { htmlValue: item.title };\nconst b = `${item.htmlValue}`;';
  assert.equal(conFuente(mal, 'item.htmlValue'), 'dato');
});

test('una función en línea vale lo que devuelve, sin los return de sus callbacks', () => {
  assert.notEqual(kind('(() => { const x = lista.filter(i => { return i.ok; }); return `<p>x</p>`; })()'), 'dato');
  assert.equal(kind('(() => { return item.title; })()'), 'dato');
});

test('.filter entre .map y .join no cambia lo que se emite', () => {
  assert.notEqual(kind("xs.map(x => `<b>${esc(x)}</b>`).filter(Boolean).join('')"), 'dato');
  assert.equal(kind("xs.map(x => x.name).filter(Boolean).join('')"), 'dato');
});

test('esc(x).replace solo es seguro si lo que inserta es un literal del código', () => {
  assert.equal(kind("esc(t).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')"), 'escapada');
  assert.equal(kind('esc(t).replace(/x/g, item.title)'), 'dato');
});
