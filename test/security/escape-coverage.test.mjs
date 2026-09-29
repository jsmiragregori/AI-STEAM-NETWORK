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
