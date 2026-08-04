import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const read = relativePath => readFile(new URL(`../../${relativePath}`, import.meta.url), 'utf8');

test('News queda conservada pero fuera del router y del grafo de módulos del runtime', async () => {
  const [router, main, viewIndex, header, newsView, newsData] = await Promise.all([
    read('assets/js/router.js'),
    read('assets/js/main.js'),
    read('assets/js/views/index.js'),
    read('assets/js/components/header.js'),
    read('assets/js/views/news.js'),
    read('assets/data/news.js'),
  ]);

  assert.doesNotMatch(router, /['"]actualidad['"]/);
  assert.doesNotMatch(main, /views\.actualidad|['"]actualidad['"]\s*:/);
  assert.doesNotMatch(viewIndex, /(?:from\s+['"]\.\/news\.js['"]|\bactualidad\b)/);
  assert.match(header, /NAV_CONFIG\.items\.filter\(item\s*=>\s*VIEWS\.includes\(item\.id\)\)/);
  assert.match(newsView, /export function render\(/);
  assert.match(newsData, /export const NEWS_CONFIG/);
});

test('una navegación programática a News falla cerrada', async () => {
  const { VIEWS } = await import('../../assets/js/router.js');
  assert.equal(VIEWS.includes('actualidad'), false);
});
