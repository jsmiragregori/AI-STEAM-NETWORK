import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import test from 'node:test';

const read = relativePath => readFile(new URL(`../../${relativePath}`, import.meta.url), 'utf8');

test('Actualidad no conserva vista ni datos generados activos', async () => {
  const [router, main, viewIndex, header] = await Promise.all([
    read('assets/js/router.js'),
    read('assets/js/main.js'),
    read('assets/js/views/index.js'),
    read('assets/js/components/header.js'),
  ]);

  assert.doesNotMatch(router, /['"]actualidad['"]/);
  assert.doesNotMatch(main, /views\.actualidad|['"]actualidad['"]\s*:/);
  assert.doesNotMatch(viewIndex, /(?:from\s+['"]\.\/news\.js['"]|\bactualidad\b)/);
  assert.match(header, /NAV_CONFIG\.items\.filter\(item\s*=>\s*VIEWS\.includes\(item\.id\)\)/);
  await assert.rejects(access(new URL('../../assets/js/views/news.js', import.meta.url)));
  await assert.rejects(access(new URL('../../assets/data/news.js', import.meta.url)));
});

test('una navegación programática a Actualidad sigue fallando cerrada', async () => {
  const { VIEWS } = await import('../../assets/js/router.js');
  assert.equal(VIEWS.includes('actualidad'), false);
});
