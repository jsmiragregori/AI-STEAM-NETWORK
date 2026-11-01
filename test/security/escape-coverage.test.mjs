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
    '4 + 1',
    'list.length',
    '`<b>x</b>`',
    'items.map(i => `<li>${esc(i)}</li>`).join(\'\')',
    'cond ? `<p>x</p>` : \'\'',
  ]) assert.notEqual(kind(expr), 'dato', expr);
});

// G13: renderSdgs devuelve `inner + moreChip`. Los dos operandos son HTML
// compuesto por el código y los valores editoriales de sus chips pasan por
// esc(); el detector debe comprobar cada operando para no aceptar por accidente
// expresiones como `dato + 1` (la antigua regla aritmética las daba por literales).
test('la concatenación solo es segura cuando todos sus operandos lo son', () => {
  const source = [
    'function renderSdgs(items, showMoreIndicator) {',
    '  const inner = items.map(sdg => `<span>${esc(sdg.label)}</span>`).join("");',
    '  const moreChip = showMoreIndicator ? `<span>+3</span>` : "";',
    '  return inner + moreChip;',
    '}',
    'function renderWithUnsafeData() {',
    '  const inner = `<span>seguro</span>`;',
    '  const moreChip = `<span>+3</span>`;',
    '  return (inner + moreChip) + item.title;',
    '}',
    'function renderWithPrecedence(enabled) {',
    '  const inner = `<span>seguro</span>`;',
    '  const moreChip = `<span>+3</span>`;',
    '  return enabled ? (inner + moreChip) : ((inner + "") + item.title);',
    '}',
  ].join('\n');
  const ctx = fileContext(source);

  assert.equal(classifyEmission('renderSdgs(sdgs, true)', ctx), 'fragmento');
  assert.equal(classifyEmission('renderWithUnsafeData()', ctx), 'dato');
  assert.equal(classifyEmission('renderWithPrecedence(true)', ctx), 'dato');
  assert.equal(kind('dato + 1'), 'dato');
  assert.equal(kind('item.title + 1'), 'dato');
  assert.equal(kind('++dato'), 'dato');
  assert.equal(kind('dato++'), 'dato');
  assert.equal(kind('4 + (1 + 2)'), 'literal');
  assert.equal(kind('esc(dato + 1)'), 'escapada');

  const indexed = 'const chips = items.map((item, idx) => `<span>${idx + 1}</span>`).join("");';
  assert.equal(
    classifyEmission('idx + 1', { ...fileContext(indexed), at: indexed.indexOf('idx + 1') }),
    'dato',
    'el detector no prueba que el receiver sea Array.prototype.map',
  );
  const customMap = 'const collection = { map(callback) { return callback("fragmento", item.title); } }; collection.map((item, idx) => `<span>${idx + 1}</span>`);';
  assert.equal(
    classifyEmission('idx + 1', { ...fileContext(customMap), at: customMap.indexOf('idx + 1') }),
    'dato',
    'un método map propio puede entregar un valor no numérico como segundo argumento',
  );
  const shadowed = 'items.map((item, idx) => { const local = (idx) => `<span>${idx + 1}</span>`; return local(item.label); }).join("");';
  assert.equal(
    classifyEmission('idx + 1', { ...fileContext(shadowed), at: shadowed.indexOf('idx + 1') }),
    'dato',
    'un callback anidado puede sombrear el índice de map con dato externo',
  );

  const paged = 'const safePage = Math.min(rawPage, Math.max(0, totalPages - 1)); const label = `${safePage + 1}`;';
  assert.equal(
    classifyEmission('safePage + 1', { ...fileContext(paged), at: paged.indexOf('safePage + 1') }),
    'dato',
    'el detector no asume que Math sea el objeto global sin sombra ni mutación',
  );
  assert.equal(kind('Number(dato) + 1'), 'dato', 'Number también puede estar sombreado o reasignado');
  const shadowedBuiltins = 'function render(Number, Math) { return Number(dato) + Math.min(1, 2); }';
  assert.equal(
    classifyEmission('Number(dato) + Math.min(1, 2)', { ...fileContext(shadowedBuiltins), at: shadowedBuiltins.indexOf('return') }),
    'dato',
  );
  const reassignedBuiltins = 'Number = custom; Math.min = custom; const value = Number(dato) + Math.min(1, 2);';
  assert.equal(
    classifyEmission('Number(dato) + Math.min(1, 2)', { ...fileContext(reassignedBuiltins), at: reassignedBuiltins.lastIndexOf('Number') }),
    'dato',
  );
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
