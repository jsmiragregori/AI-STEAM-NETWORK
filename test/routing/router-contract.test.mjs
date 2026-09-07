import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import { VIEWS } from '../../assets/js/router.js';
import {
  DEFAULT_LANG,
  DEFAULT_VIEW,
  planLanguageSwitch,
  resolveInitialRoute,
} from '../../assets/js/utils/view-route.js';

const ROOT = new URL('../../', import.meta.url);
const leer = ruta => readFile(new URL(ruta, ROOT), 'utf8');

// ---------------------------------------------------------------------------
// Alcance de este fichero, decidido al implementar DL-4 y previsto por el plan
// (§6.3, nota final):
//
// `navigateTo` toca `window`, `history` y carga `main.js` por import dinámico.
// Probarla de verdad exigiría o bien un navegador, o bien simular medio DOM, o
// bien abrir una costura de inyección en el router solo para las pruebas. Las
// tres cosas cuestan más de lo que valen y la tercera empeora el código de
// producción.
//
// Por eso el comportamiento que decide qué pasa —qué vista, qué idioma, qué
// operación de historial— se implementó en funciones PURAS de view-route.js, y
// es ahí donde se prueba de verdad (TDD-21..23). Lo que queda en el router es
// cableado fino, y sobre él se comprueba lo que sí se puede comprobar sin
// navegador: su forma (TDD-17..20). La prueba de que el cableado funciona es
// DL-5, la manual guiada, que es parada obligatoria.
// ---------------------------------------------------------------------------

// TDD-17
test('TDD-17: VIEWS conserva los siete identificadores y su orden', () => {
  assert.deepEqual(VIEWS, [
    'inicio', 'red', 'sectores', 'banco-retos', 'formacion', 'conocimiento', 'gobernanza',
  ]);
  assert.ok(Object.isFrozen(VIEWS) || Array.isArray(VIEWS));
});

// TDD-18
test('TDD-18: navigateTo mantiene su firma (view, params) y sigue rechazando lo que no es vista', async () => {
  const fuente = await leer('assets/js/router.js');

  assert.match(fuente, /export function navigateTo\(view, params = \{\}\) \{/);

  // La guarda es lo primero que hace, antes de mutar estado o tocar el historial.
  const cuerpo = fuente.slice(fuente.indexOf('export function navigateTo'));
  const guarda = cuerpo.indexOf('VIEWS.includes(view)');
  const mutacion = cuerpo.indexOf('activeView = view');
  assert.ok(guarda !== -1, 'navigateTo debe seguir validando contra VIEWS');
  assert.ok(guarda < mutacion, 'la validación va antes de mutar el estado');

  // Sobre array, no acceso a propiedad de objeto: un identificador heredado como
  // "constructor" no puede colarse como vista (amenaza T2).
  assert.ok(!/VIEW_MAP\[view\]|views\[view\]/.test(cuerpo));
});

// TDD-19
test('TDD-19: los parámetros de navegación siguen guardándose y no viajan a la URL', async () => {
  const fuente = await leer('assets/js/router.js');
  const cuerpo = fuente.slice(fuente.indexOf('export function navigateTo'), fuente.indexOf('export function syncView'));

  // Sectores → Formación con sectorIds sigue dependiendo de esto.
  assert.match(cuerpo, /viewParams = params/);

  // Y `params` no puede acabar en la URL: el enlace transporta solo la vista
  // (DA-DL-2). La URL se construye con formatViewRoute, que ignora params.
  const lineaUrl = cuerpo.split('\n').find(l => l.includes('pushState'));
  assert.ok(lineaUrl, 'navigateTo debe seguir apilando una entrada de historial');
  assert.ok(!/params/.test(lineaUrl), `params no puede llegar a la URL: ${lineaUrl.trim()}`);
  assert.match(cuerpo, /formatViewRoute\(/);
});

// TDD-20
test('TDD-20: una vista restaurada por historial sigue sin parámetros', async () => {
  const fuente = await leer('assets/js/router.js');
  const cuerpo = fuente.slice(fuente.indexOf('export function syncView'));

  assert.match(cuerpo, /viewParams = \{\}/);
  // syncView restaura, no navega: no puede apilar una entrada nueva.
  assert.ok(!/pushState/.test(cuerpo), 'syncView no debe apilar historial');
});

// TDD-21 (contrato 5)
test('TDD-21: cambiar de idioma reescribe la URL sin apilar historial', () => {
  const plan = planLanguageSwitch('sectores', 'va');
  assert.deepEqual(plan, { hash: '#va/sectors', replace: true });

  // Desde #es/sectores a valenciano: misma vista, enlace del otro idioma.
  assert.equal(planLanguageSwitch('sectores', 'es').hash, '#es/sectores');
  assert.equal(planLanguageSwitch('sectores', 'en').hash, '#en/sectors');

  // Nunca apila: cambiar de idioma no es navegar.
  for (const view of VIEWS) {
    for (const lang of ['es', 'en', 'va']) {
      assert.equal(planLanguageSwitch(view, lang).replace, true, `${view}/${lang}`);
    }
  }

  // Idioma imposible: no se inventa URL, se deja como está.
  assert.equal(planLanguageSwitch('sectores', 'xx'), null);
  assert.equal(planLanguageSwitch('no-existe', 'es'), null);
});

// TDD-22 (DA-DL-6)
test('TDD-22: el idioma del enlace manda sobre la preferencia guardada', () => {
  assert.deepEqual(
    resolveInitialRoute('#en/sectors', { storedLang: 'es' }),
    { view: 'sectores', lang: 'en', langFromLink: true, recognised: true },
  );
  assert.deepEqual(
    resolveInitialRoute('#va/sectors', { storedLang: 'es' }),
    { view: 'sectores', lang: 'va', langFromLink: true, recognised: true },
  );

  // `langFromLink` es lo que le dice al llamante que debe persistir el idioma,
  // igual que hace el conmutador: el visitante no queda atrapado en un idioma
  // que no eligió, pero tampoco ve la página en otro distinto al del enlace.
  const alias = resolveInitialRoute('#sectores', { storedLang: 'va' });
  assert.deepEqual(alias, { view: 'sectores', lang: 'va', langFromLink: false, recognised: true });
});

// TDD-23 (contrato 3)
test('TDD-23: un hash inválido abre Inicio sin tocar el idioma', () => {
  for (const basura of ['#basura', '#<script>', '#es/basura', '#xx/sectores', '#__proto__', '']) {
    assert.deepEqual(
      resolveInitialRoute(basura, { storedLang: 'va' }),
      { view: DEFAULT_VIEW, lang: 'va', langFromLink: false, recognised: false },
      basura,
    );
  }

  // Sin preferencia guardada, el idioma por defecto del sitio.
  assert.equal(resolveInitialRoute('#basura', {}).lang, DEFAULT_LANG);
  assert.equal(resolveInitialRoute('#basura', { storedLang: 'zz' }).lang, DEFAULT_LANG);
  assert.equal(resolveInitialRoute(null, {}).view, DEFAULT_VIEW);
});

// TDD-24 (§6.4) — la regresión más probable de todo el plan
test('TDD-24: un solo render por navegación', async () => {
  const router = await leer('assets/js/router.js');
  const main = await leer('assets/js/main.js');

  // pushState NO dispara hashchange, pero editar la barra de direcciones SÍ. Si
  // ambos listeners renderizaran sin comparar, una misma navegación pintaría dos
  // veces. El listener de hashchange debe comprobar antes si algo cambió.
  const bloque = main.slice(main.indexOf("'hashchange'"));
  assert.ok(main.includes("'hashchange'"), 'falta el listener de hashchange');
  assert.match(bloque, /getActiveView\(\)/, 'hashchange debe comparar con la vista activa antes de renderizar');

  // Y hay exactamente un listener de cada clase: no se duplican al re-renderizar.
  assert.equal((main.match(/addEventListener\('hashchange'/g) || []).length, 1);
  assert.equal((main.match(/addEventListener\('popstate'/g) || []).length, 1);

  // El router no escucha eventos: los listeners viven en un solo sitio.
  assert.ok(!/addEventListener/.test(router), 'los listeners globales viven en main.js');
});
