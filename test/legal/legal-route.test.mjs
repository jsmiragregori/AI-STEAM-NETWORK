// LG-6 — rutas y vista de las páginas legales.
//
// Pruebas primero, como en LG-3 y en todo el deep linking. Cubren TDD-L9, L10 y
// L12 del plan (PLAN_LEGAL_VANILLA_2026-09-07, §6.2 y §6.3).
//
// Lo que se prueba aquí es lo que se puede probar sin navegador: la resolución
// de rutas —funciones puras— y la FORMA de la vista, mediante lectura estática.
// Que el cableado pinta de verdad es la parada manual LG-11.

import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import { SECONDARY_VIEWS, VIEWS } from '../../assets/js/router.js';
import {
  LANGS,
  LEGAL_VIEW_SLUGS,
  VIEW_SLUGS,
  formatViewRoute,
  parseViewRoute,
} from '../../assets/js/utils/view-route.js';

const ROOT = new URL('../../', import.meta.url);
const leer = ruta => readFile(new URL(ruta, ROOT), 'utf8');

// Copia literal de §3.1 del plan, escrita a mano a propósito: si alguien edita
// la tabla del módulo, esta prueba lo dice en lugar de adaptarse en silencio.
const SLUGS_LEGALES = {
  'aviso-legal':   { es: 'aviso-legal',            en: 'legal-notice',   va: 'avis-legal' },
  'privacidad':    { es: 'politica-de-privacidad', en: 'privacy-policy', va: 'politica-de-privacitat' },
  'cookies':       { es: 'politica-de-cookies',    en: 'cookie-policy',  va: 'politica-de-cookies' },
  'accesibilidad': { es: 'accesibilidad',          en: 'accessibility',  va: 'accessibilitat' },
};

// Los 21 de siempre, tal y como los fijó DL-1a. Se repiten aquí para que esta
// prueba detecte por sí sola cualquier movimiento en los slugs antiguos.
const SLUGS_PREVIOS = {
  'inicio':       { es: 'inicio',                en: 'home',                  va: 'inici' },
  'red':          { es: 'la-red',                en: 'network',               va: 'la-xarxa' },
  'sectores':     { es: 'sectores',              en: 'sectors',               va: 'sectors' },
  'banco-retos':  { es: 'comunidad-de-practica', en: 'community-of-practice', va: 'comunitat-de-practica' },
  'formacion':    { es: 'formacion',             en: 'training',              va: 'formacio' },
  'conocimiento': { es: 'conocimiento',          en: 'knowledge',             va: 'coneixement' },
  'gobernanza':   { es: 'gobernanza',            en: 'governance',            va: 'governanca' },
};

// TDD-L9
test('TDD-L9: los 12 slugs legales resuelven a su documento y a su idioma', () => {
  for (const [view, fila] of Object.entries(SLUGS_LEGALES)) {
    for (const lang of LANGS) {
      const hash = `#${lang}/${fila[lang]}`;
      assert.deepEqual(parseViewRoute(hash), { view, lang }, hash);
      // Y el enlace que el sitio genera es exactamente ese: ida y vuelta.
      assert.equal(formatViewRoute(view, lang), hash, `${view}/${lang}`);
    }
  }
});

// TDD-L9 (segunda mitad: no romper lo ya repartido)
test('TDD-L9: los 21 slugs previos siguen resolviendo igual', () => {
  for (const [view, fila] of Object.entries(SLUGS_PREVIOS)) {
    for (const lang of LANGS) {
      const hash = `#${lang}/${fila[lang]}`;
      assert.deepEqual(parseViewRoute(hash), { view, lang }, hash);
      assert.equal(formatViewRoute(view, lang), hash, `${view}/${lang}`);
    }
  }
  // La tabla de las siete vistas del menú no se ha tocado al añadir las legales.
  assert.deepEqual(Object.keys(VIEW_SLUGS).sort(), [...VIEWS].sort());
});

test('TDD-L9: los 33 pares (idioma, slug) son únicos', () => {
  const vistos = new Set();
  for (const fila of [...Object.values(VIEW_SLUGS), ...Object.values(LEGAL_VIEW_SLUGS)]) {
    for (const lang of LANGS) {
      const par = `${lang}/${fila[lang]}`;
      assert.ok(!vistos.has(par), `slug duplicado dentro del mismo idioma: ${par}`);
      vistos.add(par);
    }
  }
  assert.equal(vistos.size, 33);
});

test('TDD-L9: un slug legal de otro idioma no resuelve, y la basura tampoco', () => {
  // Cruzado: el prefijo manda, igual que en el deep linking (DA-DL-6).
  assert.equal(parseViewRoute('#en/aviso-legal'), null);
  assert.equal(parseViewRoute('#es/privacy-policy'), null);
  // Ni el identificador inventado, ni rutas de más de dos segmentos.
  assert.equal(parseViewRoute('#es/legal'), null);
  assert.equal(parseViewRoute('#es/aviso-legal/extra'), null);
  assert.equal(formatViewRoute('aviso-legal', 'xx'), null);
  assert.equal(formatViewRoute('legal', 'es'), null);
});

// TDD-L10 (DA-LG-6)
test('TDD-L10: las páginas legales no entran en el menú principal', () => {
  assert.deepEqual(VIEWS, [
    'inicio', 'red', 'sectores', 'banco-retos', 'formacion', 'conocimiento', 'gobernanza',
  ]);
  assert.equal(VIEWS.length, 7);

  assert.deepEqual(SECONDARY_VIEWS, ['aviso-legal', 'privacidad', 'cookies', 'accesibilidad']);
  // Conjuntos disjuntos: ninguna vista legal puede colarse en el contrato del menú.
  for (const view of SECONDARY_VIEWS) assert.ok(!VIEWS.includes(view), view);
});

test('TDD-L10: el router acepta las vistas secundarias sin ampliar VIEWS', async () => {
  const fuente = await leer('assets/js/router.js');
  // La guarda sigue nombrando VIEWS —el contrato de TDD-18— y añade la
  // secundaria de forma explícita, en vez de sustituir la lista por otra mayor.
  assert.match(fuente, /VIEWS\.includes\(view\)/);
  assert.match(fuente, /SECONDARY_VIEWS\.includes\(view\)/);
});

// TDD-L12
test('TDD-L12: la vista legal no define su propio escapado ni pinta HTML sin sanear', async () => {
  const fuente = await leer('assets/js/views/legal.js');

  // Escapado: el común, importado. Nada de una copia local que se quede vieja.
  assert.match(fuente, /import \{ escapeHtml as esc \} from '\.\.\/utils\/escape-html\.js'/);
  assert.ok(!/function esc\s*\(/.test(fuente), 'la vista no puede definir su propio esc()');

  // Segunda capa de saneado al pintar (TL1): el HTML del build no se interpola
  // nunca crudo.
  assert.match(fuente, /import \{ sanitizeLegalHtml \} from '\.\.\/utils\/sanitize-legal-html\.js'/);
  const interpolacionesHtml = fuente.match(/\$\{[^}]*\.html[^}]*\}/g) || [];
  assert.ok(interpolacionesHtml.length > 0, 'la vista debe pintar el HTML del documento');
  for (const expresion of interpolacionesHtml) {
    assert.match(expresion, /sanitizeLegalHtml\(/, `HTML sin sanear: ${expresion}`);
  }

  // La vista no escribe en el DOM por su cuenta: devuelve cadena, como las demás.
  assert.ok(!/innerHTML|insertAdjacentHTML|document\.write/.test(fuente));
  // Y no lee el hash: la ruta le llega resuelta (contención de DL-3).
  assert.ok(!/location\.hash/.test(fuente));
});

test('TDD-L12: el saneado de pintado usa la allowlist legal, no la editorial', async () => {
  const { sanitizeLegalHtml } = await import('../../assets/js/utils/sanitize-legal-html.js');

  // Un documento legal necesita encabezados y párrafos; el editorial no los tiene.
  assert.equal(sanitizeLegalHtml('<h2>Titular</h2><p>Texto</p>'), '<h2>Titular</h2><p>Texto</p>');
  assert.equal(sanitizeLegalHtml('<ul><li>uno</li></ul>'), '<ul><li>uno</li></ul>');
  // Lo de fuera de la allowlist se degrada a texto, conservando el contenido.
  assert.equal(sanitizeLegalHtml('<h1>Doble título</h1>'), 'Doble título');
  assert.equal(sanitizeLegalHtml('<table><tr><td>x</td></tr></table>'), 'x');
  assert.equal(sanitizeLegalHtml('<img src=x onerror=alert(1)>'), '');
  // Enlaces: la misma política de URL que el resto del sitio.
  assert.equal(sanitizeLegalHtml('<a href="https://ceice.gva.es">GVA</a>'), '<a href="https://ceice.gva.es">GVA</a>');
  assert.equal(sanitizeLegalHtml('<a href="javascript:alert(1)">No</a>'), 'No');
  assert.equal(sanitizeLegalHtml('<a href="mailto:dpd@gva.es">DPD</a>'), '<a href="mailto:dpd@gva.es">DPD</a>');
});
