import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('las traducciones generadas no publican etiquetas UI huérfanas de Actualidad', async () => {
  const { translations } = await import('../../assets/data/translations.js');

  for (const lang of ['es', 'en', 'va']) {
    assert.deepEqual(translations[lang]?.news, {}, `${lang}: solo queda el namespace vacío de limpieza histórica`);
  }
});

test('las traducciones no vuelven a convertirse en consumidor de Actualidad', async () => {
  const main = await readFile(new URL('../../assets/js/main.js', import.meta.url), 'utf8');
  const index = await readFile(new URL('../../assets/js/views/index.js', import.meta.url), 'utf8');

  assert.doesNotMatch(main, /views\.actualidad|views\/news\.js/);
  assert.doesNotMatch(index, /news\.js|actualidad/);
});
