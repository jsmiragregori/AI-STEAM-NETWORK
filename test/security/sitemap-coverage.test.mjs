// SM — el mapa web no puede quedarse corto (TDD-S6, DA-SM-5).
//
// Es la lección de LG-9 aplicada aquí. Un mapa web es una declaración sobre qué
// tiene el sitio: si mañana se añade una sección y nadie toca el mapa, el mapa
// pasa a mentir por omisión, y nadie se entera hasta que alguien lo lee
// buscando algo que sí existe. Esta prueba convierte esa coherencia en algo que
// el arnés vigila solo.
//
// Ocultar una entrada es una decisión legítima -`actualidad` está retirada del
// runtime-, pero tiene que ser explícita: figurar en el fichero con
// `visible=false`. Lo que no vale es no figurar.

import assert from 'node:assert/strict';
import test from 'node:test';

globalThis.localStorage = { getItem() { return 'es'; }, setItem() {} };
globalThis.document = { documentElement: {} };

const { SECONDARY_VIEWS, VIEWS } = await import('../../assets/js/router.js');
const { SITEMAP_CONFIG } = await import('../../assets/data/sitemap.js');

/** Toda vista alcanzable del sitio, salvo el propio mapa (DA-SM-6). */
function vistasDelSitio() {
  return [...VIEWS, ...SECONDARY_VIEWS].filter(v => v !== 'mapa-web');
}

test('TDD-S6: toda vista del sitio está en el mapa, visible u oculta a propósito', () => {
  const declaradas = new Set(SITEMAP_CONFIG.declaradas);
  const faltan = vistasDelSitio().filter(v => !declaradas.has(v));

  assert.deepEqual(
    faltan, [],
    'Hay secciones del sitio que el mapa web no menciona. Añádelas a '
    + 'content/navigation/sitemap.csv -con visible=false si no deben salir-, o el mapa se queda '
    + 'anunciando un sitio que ya no es este. Faltan: ' + faltan.join(', '),
  );
});

test('TDD-S6: el mapa no anuncia vistas que no existen', () => {
  const delSitio = new Set([...VIEWS, ...SECONDARY_VIEWS]);
  const sobran = SITEMAP_CONFIG.declaradas.filter(v => !delSitio.has(v));

  assert.deepEqual(
    sobran, [],
    'El mapa declara vistas que el router no conoce. O se retiran del CSV, o el enlace no '
    + 'llevará a ninguna parte: ' + sobran.join(', '),
  );
});

test('TDD-S6: lo que se pinta es un subconjunto de lo declarado, y está ordenado', () => {
  const pintadas = SITEMAP_CONFIG.grupos.flatMap(g => g.entradas.map(e => e.view));
  const declaradas = new Set(SITEMAP_CONFIG.declaradas);

  for (const view of pintadas) assert.ok(declaradas.has(view), `${view} se pinta sin estar declarada`);
  // Sin repeticiones: una sección aparece una vez, o el índice confunde.
  assert.equal(new Set(pintadas).size, pintadas.length, 'hay una vista repetida en el mapa');
  // Y las ocultas no se pintan.
  assert.ok(!pintadas.includes('actualidad'), 'actualidad está retirada del runtime: no se anuncia');
});
