import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import { INVENTORY_JS_ROOT, collectJsFiles } from '../../scripts/inventory-render-surface.mjs';

const ROOT = new URL('../../', import.meta.url);

// El hash de la barra de direcciones es entrada NO confiable: la escribe quien
// redacta el enlace y la abre quien lo recibe sin mirarla. Estas guardas son
// estáticas —al estilo de no-security-dossier y global-components— y no
// comprueban comportamiento, sino que el valor no pueda circular: mientras solo
// lo lean dos ficheros conocidos y ninguno lo lleve a un sink de HTML, no hay
// camino de XSS reflejado por el que preocuparse en las nueve vistas.

/** Los dos únicos ficheros autorizados a leer el hash (DA-DL-4). */
const AUTORIZADOS = [
  'assets/js/router.js',
  'assets/js/utils/view-route.js',
];

/** Formas de llegar al hash. `hash` a secas daría falsos positivos (p. ej. `hashMap`). */
const LECTURAS_DE_HASH = [
  /\blocation\s*\.\s*hash\b/,
  /\bwindow\s*\.\s*location\s*\.\s*hash\b/,
  /\bdocument\s*\.\s*location\s*\.\s*hash\b/,
  /\blocation\s*\[\s*['"`]hash['"`]\s*\]/,
];

function rutaRelativa(absoluta) {
  return absoluta.replace(/\\/g, '/').split('/assets/js/')[1];
}

async function ficherosDeAplicacion() {
  const ficheros = await collectJsFiles(INVENTORY_JS_ROOT);
  return ficheros.map(f => ({ ruta: `assets/js/${rutaRelativa(f)}`, absoluta: f }));
}

// TDD-14
test('TDD-14: el hash solo se lee desde el router y desde el módulo de rutas', async () => {
  const infractores = [];

  for (const { ruta, absoluta } of await ficherosDeAplicacion()) {
    const fuente = await readFile(absoluta, 'utf8');
    if (!LECTURAS_DE_HASH.some(patron => patron.test(fuente))) continue;
    if (AUTORIZADOS.includes(ruta)) continue;
    infractores.push(ruta);
  }

  // Invariante sobre lista y no sobre número: el fallo nombra el fichero.
  assert.deepEqual(
    infractores,
    [],
    'El hash es entrada no confiable y debe quedarse en el router. Si una vista ' +
      'necesita saber la ruta, que se la pase el router ya resuelta.',
  );
});

// TDD-15
test('TDD-15: donde se lee el hash, su valor no alcanza ningún sink de HTML', async () => {
  const SINKS = [
    /\.innerHTML\s*=/,
    /\.outerHTML\s*=/,
    /\binsertAdjacentHTML\s*\(/,
    /\bdocument\s*\.\s*write(?:ln)?\s*\(/,
    /\beval\s*\(/,
    /\bnew\s+Function\s*\(/,
  ];

  const hallazgos = [];
  for (const ruta of AUTORIZADOS) {
    const fuente = await readFile(new URL(ruta, ROOT), 'utf8');
    for (const sink of SINKS) {
      if (sink.test(fuente)) hallazgos.push(`${ruta}: ${sink.source}`);
    }
  }

  assert.deepEqual(
    hallazgos,
    [],
    'Un fichero que lee el hash no puede además escribir HTML: entre ambas cosas ' +
      'está el XSS reflejado. Renderizar es trabajo de las vistas, con esc().',
  );
});

// TDD-16
test('TDD-16: el módulo de rutas es puro — sin imports y sin acceso al navegador', async () => {
  const fuente = await readFile(new URL('assets/js/utils/view-route.js', ROOT), 'utf8');

  // Sin comentarios: las explicaciones del módulo citan `window` y `location`
  // en prosa, y esta guarda mira el código, no lo que se cuenta sobre él.
  const codigo = fuente
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/^[ \t]*\/\/.*$/gm, ' ');

  for (const prohibido of [
    /\bimport\b/,          // ni estático ni dinámico: no depende de nadie
    /\brequire\s*\(/,
    /\bwindow\b/,
    /\bdocument\b/,
    /\blocation\b/,
    /\bhistory\b/,
    /\blocalStorage\b/,
    /\bfetch\s*\(/,
  ]) {
    assert.equal(
      prohibido.test(codigo),
      false,
      `view-route.js no debe contener ${prohibido.source}: es puro y por eso es ` +
        'testable sin navegador (DA-DL-4).',
    );
  }

  // Y lo que sí debe exportar, para que la guarda no pase por estar vacío el fichero.
  for (const exportado of ['parseViewRoute', 'formatViewRoute', 'VIEW_SLUGS', 'MAX_HASH_LENGTH']) {
    assert.ok(new RegExp(`export\\s+(?:const|function)\\s+${exportado}\\b`).test(codigo), exportado);
  }
});
