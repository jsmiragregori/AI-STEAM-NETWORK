// F5 (D9) — el render de la aplicación se registra una vez, sin importar
// `main.js` dinámicamente desde sus propias dependencias.
//
// Por qué: `index.html` carga `main.js?v=<huella>`; los tres imports dinámicos
// de `main.js` (i18n, router y sectors) resolverían a `main.js` sin huella,
// es decir a OTRO módulo distinto: listeners duplicados y dos evaluaciones del
// sitio. El registro conserva el comportamiento (re-render tras un clic) sin
// crear esa segunda instancia ni un ciclo en el grafo de módulos.

import assert from 'node:assert/strict';
import test from 'node:test';

import { registrarRenderApp, solicitarRenderApp } from '../../assets/js/utils/app-render.js';

test('sin registro no hay render: no se inventa ningún efecto', () => {
  registrarRenderApp(null);
  assert.equal(solicitarRenderApp(), false);
});

test('registrar una función y solicitarla la ejecuta exactamente una vez', () => {
  let veces = 0;
  registrarRenderApp(() => { veces += 1; });
  assert.equal(solicitarRenderApp(), true);
  assert.equal(solicitarRenderApp(), true);
  assert.equal(veces, 2);
  registrarRenderApp(null);
  assert.equal(solicitarRenderApp(), false);
});

test('registrar algo que no es función deja el registro vacío', () => {
  registrarRenderApp('no soy una función');
  assert.equal(solicitarRenderApp(), false);
  registrarRenderApp(null);
});
