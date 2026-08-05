import assert from 'node:assert/strict';
import test from 'node:test';

import {
  generateInventory,
  findBlankTargets,
  findWindowOpenCalls,
  enclosingTagSpan,
} from '../../scripts/inventory-render-surface.mjs';

// VAN-2.3 — no regresión de rel="noopener".
//
// El invariante NO es «siguen siendo 20». Es «ninguno abre pestaña nueva sin
// noopener». Fijar el total como guarda tendría el efecto contrario al buscado:
// al añadir el enlace 21, correcto y con su rel, la prueba fallaría igualmente,
// y la reacción natural sería subir el número —momento en el que un enlace
// inseguro pasa sin que nadie lo mire—. El total se comprueba aparte, como
// línea base informativa.

test('ningún destino de pestaña nueva se emite sin rel="noopener"', async () => {
  const report = await generateInventory();
  assert.deepEqual(
    report.blankTargetsWithoutNoopener.unsafe,
    [],
    'un target _blank (literal o calculado) sin rel="noopener" expone window.opener',
  );
});

test('ningún window.open() se abre sin noopener', async () => {
  const report = await generateInventory();
  assert.deepEqual(report.windowOpenCalls.filter((call) => !call.safe), []);
});

test('línea base informativa de destinos de pestaña nueva', async () => {
  const report = await generateInventory();
  const { total, literalCount, dynamicCount } = report.blankTargetsWithoutNoopener;
  assert.equal(literalCount, 17);
  assert.equal(dynamicCount, 4);
  assert.equal(total, 21);
  assert.equal(report.windowOpenCalls.length, 0);
});

// Si el detector se vuelve permisivo, el invariante de arriba seguiría en verde
// sin proteger nada. Estas pruebas comprueban que sabe fallar.

test('el detector marca un target="_blank" literal sin rel', () => {
  const hits = findBlankTargets('const h = `<a href="x" target="_blank">t</a>`;', 'f.js');
  assert.equal(hits.unsafe.length, 1);
  assert.equal(hits.unsafe[0].kind, 'literal');
});

test('el detector marca un target calculado sin rel', () => {
  // El punto ciego que VAN-2.3 cierra: sin la cadena `_blank` en el código, la
  // medición anterior no veía este caso y la guarda seguía en verde.
  const hits = findBlankTargets('const h = `<a target="${destino}">t</a>`;', 'f.js');
  assert.equal(hits.unsafe.length, 1);
  assert.equal(hits.unsafe[0].kind, 'dynamic');
});

test('el detector acepta el rel emitido de forma condicional', () => {
  const source = 'const h = `<a target="${t}" ${t === \'_blank\' ? \'rel="noopener noreferrer"\' : \'\'}>t</a>`;';
  assert.deepEqual(findBlankTargets(source, 'f.js').unsafe, []);
});

test('el detector acepta el rel de una interpolación hermana en un fragmento', () => {
  const source = 'const attrs = `${t ? ` target="${t}"` : \'\'}${t === \'_blank\' ? \' rel="noopener noreferrer"\' : \'\'}`;';
  assert.deepEqual(findBlankTargets(source, 'f.js').unsafe, []);
});

test('el rel de una etiqueta vecina no excusa a la insegura', () => {
  const source = 'const h = `<a target="_blank">a</a> <a href="#" rel="noopener">b</a>`;';
  const hits = findBlankTargets(source, 'f.js');
  assert.equal(hits.unsafe.length, 1, 'la región de comprobación es la etiqueta, no el literal entero');
});

test('target="_self" no cuenta ni exige rel', () => {
  assert.equal(findBlankTargets('<a target="_self">x</a>', 'f.js').total, 0);
});

test('un > dentro de una interpolación no corta la etiqueta antes de tiempo', () => {
  const source = 'const h = `<a data-x="${a > b ? 1 : 2}" target="_blank" rel="noopener">t</a>`;';
  assert.deepEqual(findBlankTargets(source, 'f.js').unsafe, [], 'el rel está tras el ${...} y debe verse');
  const span = enclosingTagSpan(source, source.indexOf('target='));
  assert.ok(span && source.slice(span.start, span.end).includes('rel="noopener"'));
});

test('window.open sin noopener se marca y con noopener no', () => {
  assert.equal(findWindowOpenCalls('window.open(url);', 'f.js')[0].safe, false);
  assert.equal(findWindowOpenCalls('window.open(url, "_blank", "noopener,noreferrer");', 'f.js')[0].safe, true);
});
