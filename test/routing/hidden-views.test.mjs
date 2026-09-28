// Una vista que el menú oculta no se abre por enlace directo: se va a Inicio.
//
// La lista de vistas ocultas llega en `NAV_CONFIG.hidden`, que es un dato
// generado en un montaje NFS: puede faltar o venir corrupto. Por eso la decisión
// está en funciones puras de view-route.js y es de fallo cerrado hacia el sitio
// de siempre: ante cualquier duda, ninguna vista oculta. El dato solo puede
// ocultar vistas del menú principal; nunca Inicio ni las páginas del pie.
//
// Como en router-contract.test.mjs, `navigateTo` no se ejecuta aquí (necesita
// navegador); se comprueba que pasa por la función pura antes de cambiar estado.

import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import {
  DEFAULT_VIEW,
  construirVistasOcultas,
  resolverVistaPermitida,
} from '../../assets/js/utils/view-route.js';

const ROOT = new URL('../../', import.meta.url);

test('construirVistasOcultas: solo vistas del menú principal, nunca Inicio', () => {
  const nav = { hidden: ['gobernanza', 'actualidad', 'inicio', 'privacidad', 'mapa-web', 'constructor', 5, null, 'red'] };
  assert.deepEqual([...construirVistasOcultas(nav)], ['gobernanza', 'red']);
});

test('construirVistasOcultas: ante un dato ausente o corrupto, ninguna', () => {
  for (const nav of [undefined, null, {}, { hidden: 'gobernanza' }, { hidden: { 0: 'red' } }, 'x']) {
    assert.deepEqual([...construirVistasOcultas(nav)], [], JSON.stringify(nav));
  }
});

test('construirVistasOcultas: el resultado no se puede modificar', () => {
  assert.ok(Object.isFrozen(construirVistasOcultas({ hidden: ['red'] })));
});

test('resolverVistaPermitida: una vista oculta lleva a Inicio; el resto, igual', () => {
  const ocultas = construirVistasOcultas({ hidden: ['gobernanza'] });
  assert.equal(resolverVistaPermitida('gobernanza', ocultas), DEFAULT_VIEW);
  assert.equal(resolverVistaPermitida('red', ocultas), 'red');
  assert.equal(resolverVistaPermitida('privacidad', ocultas), 'privacidad');
  assert.equal(resolverVistaPermitida('inicio', ocultas), 'inicio');
});

test('el router consulta las vistas ocultas antes de cambiar de vista', async () => {
  const fuente = await readFile(new URL('assets/js/router.js', ROOT), 'utf8');
  for (const funcion of ['navigateTo', 'syncView', 'setActiveView']) {
    const inicio = fuente.indexOf(`export function ${funcion}(`);
    assert.ok(inicio !== -1, `falta ${funcion}`);
    const cuerpo = fuente.slice(inicio, fuente.indexOf('\n}', inicio));
    const consulta = cuerpo.indexOf('resolverVistaPermitida(');
    const mutacion = cuerpo.indexOf('activeView = ');
    assert.ok(consulta !== -1, `${funcion} no consulta las vistas ocultas`);
    const enLaAsignacion = cuerpo.includes('activeView = resolverVistaPermitida(');
    assert.ok(enLaAsignacion || consulta < mutacion, `${funcion} debe consultar antes de cambiar la vista`);
  }
  const lectura = fuente.slice(fuente.indexOf('export function readRoute('));
  assert.match(lectura.slice(0, lectura.indexOf('\n}')), /resolverVistaPermitida\(/, 'readRoute no consulta las vistas ocultas');
});

test('un enlace directo a una vista oculta abre Inicio en el mismo idioma', async () => {
  globalThis.localStorage = { getItem() { return null; }, setItem() {} };
  globalThis.document = { documentElement: {} };
  globalThis.window = { location: { hash: '#en/governance' } };

  // El dato se modifica ANTES de cargar la tabla, que se resuelve una sola vez.
  const { NAV_CONFIG } = await import('../../assets/data/navigation.js');
  NAV_CONFIG.hidden = ['gobernanza'];
  const { readRoute } = await import('../../assets/js/router.js');

  const ruta = readRoute();
  assert.equal(ruta.view, 'inicio');
  assert.equal(ruta.lang, 'en', 'se respeta el idioma del enlace');
  assert.equal(ruta.recognised, false, 'se trata como una ruta no reconocida');
  window.location.hash = '#en/network';
  assert.equal(readRoute().view, 'red', 'las vistas no ocultas siguen abriéndose');
  window.location.hash = '#en/privacy-policy';
  assert.equal(readRoute().view, 'privacidad', 'las páginas del pie siguen enlazables');
});
