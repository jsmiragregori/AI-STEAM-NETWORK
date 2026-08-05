import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  collectValidatedUrlIdentifiers,
  isHrefSchemeValidated,
} from '../../scripts/inventory-render-surface.mjs';

const VIEWS_DIR = path.resolve(fileURLToPath(new URL('../../assets/js/views', import.meta.url)));

async function readViews() {
  const names = (await readdir(VIEWS_DIR)).filter((name) => name.endsWith('.js'));
  return Promise.all(
    names.map(async (name) => ({ name, source: await readFile(path.join(VIEWS_DIR, name), 'utf8') })),
  );
}

test('toda vista con href dinámico importa el validador de URL', async () => {
  for (const { name, source } of await readViews()) {
    if (!/href\s*=\s*"\$\{/.test(source)) continue;
    assert.match(
      source,
      /import\s*\{\s*getSafeEditorialUrl\s*\}\s*from\s*['"]\.\.\/utils\/safe-editorial-url\.js['"]/,
      `${name} pinta href dinámicos y debe importar getSafeEditorialUrl`,
    );
  }
});

test('las vistas que resuelven la adhesión tratan el estado unsafe', async () => {
  for (const { name, source } of await readViews()) {
    if (!/\bresolveMembershipAction\s*\(/.test(source)) continue;
    assert.match(
      source,
      /kind\s*===\s*'unsafe'/,
      `${name} debe degradar la acción de adhesión rechazada en vez de ignorarla`,
    );
  }
});

// El detector del inventario es el que sostiene la línea base de 21/21. Si se
// vuelve permisivo, la línea base seguiría en verde sin proteger nada.
test('el detector de href validados distingue procedencia, no la mera presencia del helper', () => {
  const source = [
    "import { getSafeEditorialUrl } from '../utils/safe-editorial-url.js';",
    'const safeUrl = getSafeEditorialUrl(item.url);',
    "const ternario = item.url ? getSafeEditorialUrl(item.url) : 'https://ejemplo.org/';",
    'const crudo = item.url;',
  ].join('\n');
  const ids = collectValidatedUrlIdentifiers(source);

  assert.ok(isHrefSchemeValidated('href="${esc(safeUrl)}"', ids));
  assert.ok(isHrefSchemeValidated('href="${escapeHtml(ternario)}"', ids));
  assert.ok(!isHrefSchemeValidated('href="${esc(crudo)}"', ids), 'un identificador sin validar no pasa');
  assert.ok(!isHrefSchemeValidated('href="${safeUrl}"', ids), 'validar no exime de escapar');
  assert.ok(
    !isHrefSchemeValidated('href="${esc(item.url || \'#\')}"', ids),
    'una expresión compuesta no se da por validada',
  );
});

test('un fichero sin declaraciones validadas no aporta identificadores', () => {
  assert.equal(collectValidatedUrlIdentifiers('const a = 1;').size, 0);
});
