// SM — el mapa web: ruta, vista y rótulos.
//
// Pruebas antes que código (TDD-S1, S2, S4, S5, S7 del plan
// PLAN_SITEMAP_2026-09-08). Lo que se comprueba aquí es lo que se puede
// comprobar sin navegador: que los slugs resuelvan, que el mapa no entre en el
// menú principal, la forma de la vista y que sus rótulos sean EXACTAMENTE los
// que ya usan el menú y el pie.

import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

globalThis.localStorage = { getItem() { return 'es'; }, setItem() {} };
globalThis.document = { documentElement: {} };

const { SECONDARY_VIEWS, VIEWS } = await import('../../assets/js/router.js');
const {
  LANGS,
  SECONDARY_VIEW_SLUGS,
  VIEW_SLUGS,
  formatViewRoute,
  parseViewRoute,
} = await import('../../assets/js/utils/view-route.js');
const { SITEMAP_CONFIG } = await import('../../assets/data/sitemap.js');
const { translations } = await import('../../assets/data/translations.js');

const ROOT = new URL('../../', import.meta.url);
const leer = ruta => readFile(new URL(ruta, ROOT), 'utf8');

// Copia a mano de §3 del plan, aprobada por Salva el 2026-09-08.
const SLUGS_MAPA = { es: 'mapa-web', en: 'sitemap', va: 'mapa-web' };

// TDD-S1
test('TDD-S1: los 3 slugs del mapa resuelven, y los 33 anteriores siguen igual', () => {
  for (const lang of LANGS) {
    const hash = `#${lang}/${SLUGS_MAPA[lang]}`;
    assert.deepEqual(parseViewRoute(hash), { view: 'mapa-web', lang }, hash);
    assert.equal(formatViewRoute('mapa-web', lang), hash, lang);
  }

  // Los 33 de antes: se recorren desde las tablas, y su total se fija aquí para
  // que quitar uno no pase inadvertido.
  let previos = 0;
  for (const tabla of [VIEW_SLUGS, SECONDARY_VIEW_SLUGS]) {
    for (const [view, fila] of Object.entries(tabla)) {
      if (view === 'mapa-web') continue;
      for (const lang of LANGS) {
        assert.deepEqual(parseViewRoute(`#${lang}/${fila[lang]}`), { view, lang }, `${view}/${lang}`);
        previos += 1;
      }
    }
  }
  assert.equal(previos, 33, 'los 33 slugs anteriores siguen ahí');
});

// TDD-S2
test('TDD-S2: el mapa es vista secundaria, no entra en el menú', () => {
  assert.deepEqual(VIEWS, [
    'inicio', 'red', 'sectores', 'banco-retos', 'formacion', 'conocimiento', 'gobernanza',
  ]);
  assert.ok(SECONDARY_VIEWS.includes('mapa-web'));
  assert.ok(!VIEWS.includes('mapa-web'));
});

// TDD-S4
test('TDD-S4: la vista del mapa no define su escapado ni escribe en el DOM', async () => {
  const fuente = await leer('assets/js/views/sitemap.js');

  assert.match(fuente, /import \{ escapeHtml as esc \} from '\.\.\/utils\/escape-html\.js'/);
  assert.ok(!/function esc\s*\(/.test(fuente), 'la vista no puede definir su propio esc()');
  assert.ok(!/innerHTML|insertAdjacentHTML|document\.write/.test(fuente));
  assert.ok(!/location\.hash/.test(fuente), 'la ruta le llega resuelta');

  // Los destinos los construye el enrutador, nunca se escriben a mano.
  const codigo = fuente.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
  assert.match(codigo, /formatViewRoute\(/);
  assert.ok(!/#(es|en|va)\//.test(codigo), 'ningún slug escrito a mano');
});

// TDD-S5 (DA-SM-3)
test('TDD-S5: los rótulos del mapa son los del menú y los del pie, no otros', () => {
  const entradas = SITEMAP_CONFIG.grupos.flatMap(g => g.entradas);
  assert.ok(entradas.length > 0, 'el mapa no puede salir vacío');

  for (const { view, labelKey } of entradas) {
    // La clave existe en los tres idiomas y no es un texto suelto del CSV.
    for (const lang of LANGS) {
      const valor = labelKey.split('.').reduce((o, k) => o?.[k], translations[lang]);
      assert.ok(valor && valor.trim() !== '', `${view}: falta ${labelKey} en ${lang}`);
    }
    // Y es una clave del menú o del pie, que son las fuentes admitidas.
    assert.match(labelKey, /^(nav|footer)\./, `${view}: ${labelKey} no viene del menú ni del pie`);
  }
});

// TDD-S7 (DA-SM-6)
test('TDD-S7: el mapa no se lista a sí mismo', () => {
  const vistas = SITEMAP_CONFIG.grupos.flatMap(g => g.entradas.map(e => e.view));
  assert.ok(!vistas.includes('mapa-web'), 'un índice que se incluye en su propio índice es ruido');
});

test('TDD-S7: cada entrada del mapa resuelve a un enlace real en los tres idiomas', () => {
  for (const { view } of SITEMAP_CONFIG.grupos.flatMap(g => g.entradas)) {
    for (const lang of LANGS) {
      assert.ok(formatViewRoute(view, lang), `${view}/${lang} no produce enlace`);
    }
  }
});
