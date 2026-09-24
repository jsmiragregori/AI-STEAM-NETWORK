// El sitio no muestra ningún aviso de cookies (decisión de Salva, 2026-09-24).
//
// LG-8 había sustituido el banner de consentimiento por un aviso informativo.
// Se retira también: el sitio no instala cookies y lo que guarda en el
// navegador lo explica la política de cookies, enlazada desde el pie. Esta
// guarda impide que el aviso vuelva por descuido.

import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import test from 'node:test';

const ROOT = new URL('../../', import.meta.url);

test('no existe el componente del aviso de cookies', async () => {
  await assert.rejects(
    access(new URL('assets/js/components/cookie-notice.js', ROOT)),
    'el aviso de cookies se retiró: no se vuelve a crear el componente',
  );
});

test('el arranque no inserta ningún aviso ni banner de cookies', async () => {
  const main = await readFile(new URL('assets/js/main.js', ROOT), 'utf8');
  assert.ok(!/cookie-notice|CookieNotice|cookie-banner|CookieBanner/.test(main));

  const index = await readFile(new URL('index.html', ROOT), 'utf8');
  assert.ok(!/cookie-notice|cookie-banner/i.test(index));
});
