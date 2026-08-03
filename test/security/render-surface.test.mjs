import assert from 'node:assert/strict';
import test from 'node:test';

import { generateInventory } from '../../scripts/inventory-render-surface.mjs';

const EXPECTED_PER_FILE = [
  { file: 'assets/js/views/governance.js', unescaped: 1, escaped: 101 },
  { file: 'assets/js/views/knowledge.js', unescaped: 0, escaped: 9 },
  { file: 'assets/js/views/marketplace.js', unescaped: 5, escaped: 12 },
  { file: 'assets/js/views/news.js', unescaped: 4, escaped: 0 },
  // VAN-2.2: 10 y no 9 porque el rótulo del CTA del hero aparece ahora también
  // en la rama <span> de fallo cerrado. Es la misma salida, protegida dos veces.
  { file: 'assets/js/views/training.js', unescaped: 1, escaped: 10 },
];

const EXPECTED_ESC_VIEWS = [
  'assets/js/views/governance.js',
  'assets/js/views/home.js',
  'assets/js/views/knowledge.js',
  'assets/js/views/marketplace.js',
  'assets/js/views/network.js',
  'assets/js/views/sectors.js',
  'assets/js/views/training.js',
];

test('el inventario de render reproduce la línea base VAN-0.1', async () => {
  const report = await generateInventory();

  assert.equal(report.scannedFiles, 20);
  assert.equal(report.pickLangInterpolations.unescaped, 11);
  assert.equal(report.pickLangInterpolations.escaped, 132);
  assert.deepEqual(
    report.pickLangInterpolations.perFile.map(({ file, unescaped, escaped }) => ({ file, unescaped, escaped })),
    EXPECTED_PER_FILE,
  );

  assert.equal(report.viewsTotal, 9);
  assert.deepEqual(report.viewsDefiningEsc, []);
  assert.deepEqual(report.viewsImportingEscapeHtml, EXPECTED_ESC_VIEWS);
  assert.equal(report.dynamicHrefs.editorialCount, 21);
  // VAN-2.2: los 21 pasan por getSafeEditorialUrl(). El invariante que importa
  // es que no quede ninguno sin validar, no que sigan siendo 21: si alguien
  // añade el enlace 22 sin cablearlo, esta lista deja de estar vacía.
  assert.deepEqual(report.dynamicHrefs.editorialUnvalidated, []);
  assert.equal(report.dynamicHrefs.editorialSchemeValidated, 21);
  assert.equal(report.dynamicHrefs.nonEditorialCount, 2);
  assert.equal(report.dynamicHrefs.total, 23);
  assert.equal(report.blankTargetsWithoutNoopener.total, 16);
  assert.deepEqual(report.blankTargetsWithoutNoopener.unsafe, []);

  const sinkCounts = Object.fromEntries(
    [...new Set(report.dangerousSinks.map(({ sink }) => sink))]
      .sort()
      .map((sink) => [sink, report.dangerousSinks.filter((hit) => hit.sink === sink).length]),
  );
  assert.deepEqual(sinkCounts, {
    'innerHTML assignment': 23,
    insertAdjacentHTML: 1,
  });

  assert.deepEqual(await generateInventory(), report, 'el inventario debe ser determinista');
});
