import assert from 'node:assert/strict';
import test from 'node:test';

import { generateInventory } from '../../scripts/inventory-render-surface.mjs';

const EXPECTED_PER_FILE = [
  { file: 'assets/js/views/governance.js', unescaped: 102, escaped: 0 },
  { file: 'assets/js/views/knowledge.js', unescaped: 9, escaped: 0 },
  { file: 'assets/js/views/marketplace.js', unescaped: 5, escaped: 12 },
  { file: 'assets/js/views/news.js', unescaped: 4, escaped: 0 },
  { file: 'assets/js/views/training.js', unescaped: 6, escaped: 4 },
];

const EXPECTED_ESC_VIEWS = [
  'assets/js/views/marketplace.js',
  'assets/js/views/network.js',
  'assets/js/views/sectors.js',
  'assets/js/views/training.js',
];

test('el inventario de render reproduce la línea base VAN-0.1', async () => {
  const report = await generateInventory();

  assert.equal(report.scannedFiles, 17);
  assert.equal(report.pickLangInterpolations.unescaped, 126);
  assert.equal(report.pickLangInterpolations.escaped, 16);
  assert.deepEqual(
    report.pickLangInterpolations.perFile.map(({ file, unescaped, escaped }) => ({ file, unescaped, escaped })),
    EXPECTED_PER_FILE,
  );

  assert.equal(report.viewsTotal, 9);
  assert.deepEqual(report.viewsDefiningEsc, EXPECTED_ESC_VIEWS);
  assert.equal(report.dynamicHrefs.editorialCount, 21);
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
