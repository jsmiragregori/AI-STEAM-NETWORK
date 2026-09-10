// El favicon es una copia local: el sitio no pide nada a dominios ajenos.
//
// Los iconos son los de AI-SECRETT (`aisecrett.eu`), el proyecto del que esta
// red forma parte, **copiados aquí a propósito**. Enlazarlos desde su dominio
// habría sido más cómodo y habría metido tres problemas: una petición a un
// tercero desde cada visita —con lo que eso dice a ese tercero sobre quién nos
// visita—, un icono que desaparece si aquella web cambia de tema o de ruta, y
// una excepción en la política de no depender de dominios externos que el resto
// del sitio cumple sin fisuras (`verify:vendor`).
//
// Esa última no es hipotética: al descargarlos, **dos de las cuatro rutas que
// declara `aisecrett.eu` respondían 404** —`favicon.svg` y `favicon-96x96.png`
// devolvían una página de error con `Content-Type: text/html`—. Si el sitio los
// hubiera enlazado en remoto, habría pedido en cada visita dos ficheros que no
// existen. Se conservan solo los dos que sí: `favicon.ico` y el `apple-touch`.

import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

/** Firmas reales, para que un fichero corrupto o sustituido no pase por bueno. */
const ICONOS = [
  { fichero: 'assets/images/favicon/favicon.ico', magia: [0x00, 0x00, 0x01, 0x00] },
  { fichero: 'assets/images/favicon/apple-touch-icon.png', magia: [0x89, 0x50, 0x4e, 0x47] },
];

test('los iconos declarados existen y son imágenes de verdad', async () => {
  for (const { fichero, magia } of ICONOS) {
    const info = await stat(path.join(ROOT, fichero));
    assert.ok(info.size > 1000, `${fichero} es sospechosamente pequeño`);

    // Comprobar la firma y no la extensión: los dos que se descartaron tenían
    // extensión de imagen y contenido HTML.
    const bytes = await readFile(path.join(ROOT, fichero));
    assert.deepEqual(
      [...bytes.subarray(0, magia.length)], magia,
      `${fichero} no tiene la firma binaria que le corresponde`,
    );
  }
});

test('index.html enlaza los iconos por ruta local, nunca a un dominio externo', async () => {
  const html = await readFile(path.join(ROOT, 'index.html'), 'utf8');

  const enlaces = [...html.matchAll(/<link[^>]*rel="(icon|apple-touch-icon)"[^>]*>/g)]
    .map((m) => m[0]);
  assert.equal(enlaces.length, ICONOS.length, 'deben declararse los dos iconos');

  for (const enlace of enlaces) {
    const href = /href="([^"]+)"/.exec(enlace)?.[1];
    assert.ok(href, `sin href: ${enlace}`);
    assert.ok(
      href.startsWith('./assets/'),
      `el icono se carga de fuera y no puede: ${href}`,
    );
    assert.ok(!/^https?:|^\/\//.test(href), `ruta absoluta a un dominio: ${href}`);
  }

  // Que ningún icono apunte al dominio de origen, ni siquiera por descuido.
  assert.ok(!html.includes('aisecrett.eu/wp-content'), 'no se enlaza el original remoto');
});

test('cada icono declarado en el HTML existe en el disco', async () => {
  const html = await readFile(path.join(ROOT, 'index.html'), 'utf8');
  for (const m of html.matchAll(/<link[^>]*rel="(?:icon|apple-touch-icon)"[^>]*href="([^"]+)"/g)) {
    const relativo = m[1].replace(/^\.\//, '');
    await stat(path.join(ROOT, relativo)); // lanza si falta
  }
});
