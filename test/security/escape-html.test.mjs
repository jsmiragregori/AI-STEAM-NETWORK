import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import { escapeHtml } from '../../assets/js/utils/escape-html.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const VIEWS_DIR = path.join(ROOT, 'assets/js/views');
const EXPECTED_IMPORTERS = new Set(['governance.js', 'home.js', 'marketplace.js', 'network.js', 'sectors.js', 'training.js']);

test('escapeHtml escapa los cinco caracteres significativos y normaliza valores vacíos', () => {
  assert.equal(escapeHtml('&<>"\''), '&amp;&lt;&gt;&quot;&#39;');
  assert.equal(escapeHtml(null), '');
  assert.equal(escapeHtml(undefined), '');
  assert.equal(escapeHtml(0), '0');
  assert.equal(escapeHtml(false), 'false');
  assert.equal(escapeHtml('&amp;'), '&amp;amp;', 'una entidad de entrada también es contenido no confiable');
});

test('las vistas reutilizan el módulo común y no definen copias locales de esc', async () => {
  const viewNames = (await readdir(VIEWS_DIR)).filter((name) => name.endsWith('.js')).sort();
  const importers = new Set();

  for (const viewName of viewNames) {
    const source = await readFile(path.join(VIEWS_DIR, viewName), 'utf8');
    assert.doesNotMatch(source, /\bfunction\s+esc\s*\(|\b(?:const|let|var)\s+esc\s*=/, `${viewName} contiene una copia local de esc`);
    if (/import\s*\{\s*escapeHtml\s+as\s+esc\s*\}\s*from\s*['"]\.\.\/utils\/escape-html\.js['"]/.test(source)) {
      importers.add(viewName);
    }
  }

  assert.deepEqual(importers, EXPECTED_IMPORTERS);
});
