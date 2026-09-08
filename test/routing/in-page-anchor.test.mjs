import assert from 'node:assert/strict';
import test from 'node:test';

// TDD-L17 (LG-10) — el salto al contenido principal no puede navegar.
//
// Encontrado al evaluar accesibilidad. `index.html` incluye el enlace «Saltar al
// contenido principal» con href="#main-root", que es la ayuda estándar para
// quien navega por teclado o con lector de pantalla. Los enlaces directos por
// slug lo rompieron: para el router, `#main-root` era una ruta no reconocida, y
// respondía como corresponde a una ruta no reconocida, abriendo Inicio. Quien
// más necesita ese salto era justamente quien perdía la página.
//
// El módulo se prueba con dobles mínimos en vez de un navegador: `isInPageAnchor`
// solo necesita `location.hash` y `document.getElementById`.

const IDS_REALES = new Set(['main-root', 'header-root', 'footer-root', 'cookie-banner']);

function conEntorno(hash, ejecutar) {
  const ventanaPrevia = globalThis.window;
  const documentoPrevio = globalThis.document;
  globalThis.window = { location: { hash } };
  globalThis.document = { getElementById: id => (IDS_REALES.has(id) ? { id } : null) };
  try {
    return ejecutar();
  } finally {
    globalThis.window = ventanaPrevia;
    globalThis.document = documentoPrevio;
  }
}

const { isInPageAnchor } = await import('../../assets/js/router.js');

test('TDD-L17: un ancla a un elemento de la página se reconoce como tal', () => {
  for (const hash of ['#main-root', '#header-root', '#footer-root', '#cookie-banner']) {
    assert.equal(conEntorno(hash, isInPageAnchor), true, hash);
  }
});

test('TDD-L17b: una ruta de sección NO se confunde con un ancla', () => {
  // Lo que hace de frontera es la barra: una ruta siempre la lleva.
  for (const hash of ['#es/sectores', '#va/sectors', '#en/home', '#es/main-root']) {
    assert.equal(conEntorno(hash, isInPageAnchor), false, hash);
  }
});

test('TDD-L17c: un id que no existe no es un ancla, y el router sigue mandando', () => {
  // Esto es lo que conserva el fallo cerrado: un hash inventado no se convierte
  // en «ancla» por no llevar barra. Si el elemento no está, no hay salto.
  for (const hash of ['#basura', '#sectores', '#__proto__', '#no-existe', '', '#']) {
    assert.equal(conEntorno(hash, isInPageAnchor), false, JSON.stringify(hash));
  }
});

test('TDD-L17d: no se rompe con entradas mal formadas', () => {
  for (const hash of ['#%', '#%E0%A4%A', '#<script>', '#a'.repeat(500)]) {
    assert.doesNotThrow(() => conEntorno(hash, isInPageAnchor), hash);
    assert.equal(conEntorno(hash, isInPageAnchor), false, hash);
  }
});

test('TDD-L17e: el listener consulta el ancla ANTES de resolver la ruta', async () => {
  const { readFile } = await import('node:fs/promises');
  const main = await readFile(new URL('../../assets/js/main.js', import.meta.url), 'utf8');

  const bloque = main.slice(main.indexOf("addEventListener('hashchange'"));
  const guarda = bloque.indexOf('isInPageAnchor()');
  const ruta = bloque.indexOf('readRoute()');

  assert.ok(guarda !== -1, 'el listener debe consultar isInPageAnchor');
  assert.ok(guarda < ruta, 'la guarda del ancla va antes de resolver la ruta');
});
