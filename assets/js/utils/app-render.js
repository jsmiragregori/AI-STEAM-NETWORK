/**
 * Registro del render de la aplicación.
 *
 * Lo necesitan quien cambia el idioma, el router y el acordeón de Sectores
 * después de pintar, y no pueden importar `main.js` sin crear un ciclo (main
 * los importa a ellos). El import dinámico de `main.js` que había aquí se
 * retiró en F5: `index.html` carga `main.js?v=<huella>` y el import dinámico
 * resolvía a `main.js` sin huella —otra URL, otro módulo evaluado por segunda
 * vez, con listeners duplicados—. Con el registro, `main.js` se registra una
 * vez al arrancar y los demás solo piden el render.
 */
let renderApp = null;

/** Registra la función de render de la aplicación (o la retira con `null`). */
export function registrarRenderApp(fn) {
  renderApp = typeof fn === 'function' ? fn : null;
}

/** Ejecuta el render registrado. Devuelve `false` si aún no hay ninguno. */
export function solicitarRenderApp() {
  if (!renderApp) return false;
  renderApp();
  return true;
}
