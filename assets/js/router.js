import { getLanguage, getStoredLanguage } from './i18n.js';
import { formatViewRoute, planLanguageSwitch, resolveInitialRoute } from './utils/view-route.js';
import { TABLA_SLUGS, ALIAS_SLUGS } from './slug-table.js';

export const VIEWS = ['inicio', 'red', 'sectores', 'banco-retos', 'formacion', 'conocimiento', 'gobernanza'];

/**
 * Vistas secundarias: las páginas legales (LG-6, DA-LG-6).
 *
 * Van en una lista APARTE, no dentro de `VIEWS`. `VIEWS` es el contrato del
 * menú principal —siete entradas, y TDD-17 lo fija— y estas páginas viven en el
 * pie. Separarlas deja ese contrato intacto y hace explícito, para quien lea
 * esto dentro de un año, que no son navegación principal.
 *
 * Enrutan igual que cualquier otra vista: tienen slug en los tres idiomas y se
 * enlazan con el mismo `#idioma/slug`.
 */
export const SECONDARY_VIEWS = ['aviso-legal', 'privacidad', 'cookies', 'accesibilidad', 'mapa-web'];

let activeView = 'inicio';
let viewParams = {};

export function getActiveView() { return activeView; }
export function getViewParams() { return viewParams; }

export function navigateTo(view, params = {}) {
  if (!VIEWS.includes(view) && !SECONDARY_VIEWS.includes(view)) {
    console.warn(`View "${view}" no existe`);
    return;
  }
  activeView = view;
  viewParams = params;
  window.scrollTo(0, 0);
  // La URL lleva solo la vista y el idioma. `params` es estado interno y no se
  // serializa nunca (DA-DL-2): formatViewRoute lo ignora por construcción. Si
  // no hubiera enlace posible, se apila sin URL como se hacía antes.
  history.pushState({ appView: view }, '', formatViewRoute(view, getLanguage(), undefined, TABLA_SLUGS) || undefined);
  import('./main.js').then(m => m.renderApp());
}

// Restaura una vista desde el historial del navegador (popstate) SIN apilar una
// nueva entrada. La usa el listener global de main.js para back/forward.
export function syncView(view) {
  if (!VIEWS.includes(view) && !SECONDARY_VIEWS.includes(view)) return;
  activeView = view;
  viewParams = {};
  window.scrollTo(0, 0);
  import('./main.js').then(m => m.renderApp());
}

// --- Enlaces directos por slug (DL-4) --------------------------------------
//
// La lectura del hash vive AQUÍ y solo aquí, junto a utils/view-route.js. Es
// entrada no confiable y `test/security/hash-containment.test.mjs` falla si
// aparece en cualquier otro fichero: una vista que necesite la ruta la recibe
// ya resuelta.

/** Lee el hash actual y lo resuelve. Nunca devuelve `null` (DA-DL-3). */
export function readRoute() {
  return resolveInitialRoute(window.location.hash, { storedLang: getStoredLanguage() }, TABLA_SLUGS, ALIAS_SLUGS);
}

/**
 * ¿El hash apunta a un elemento de la propia página en vez de a una vista?
 *
 * Existe por un fallo encontrado al evaluar accesibilidad (LG-10): el enlace
 * «Saltar al contenido principal» es `href="#main-root"`, y para el router eso
 * era una ruta no reconocida, así que respondía abriendo Inicio. Es decir, quien
 * navegaba por teclado no podía usar el salto sin perder la página en la que
 * estaba. El salto al contenido es justamente la ayuda de quien más la necesita.
 *
 * La comprobación es segura: solo pregunta si existe un elemento con ese id en
 * nuestro propio DOM. No interpola el valor, ni lo usa para construir una URL.
 */
export function isInPageAnchor() {
  const crudo = window.location.hash.slice(1);
  // Un ancla interna nunca lleva barra: `#es/sectores` es una ruta, no un id.
  if (!crudo || crudo.includes('/')) return false;
  try {
    return Boolean(document.getElementById(decodeURIComponent(crudo)));
  } catch {
    return false; // id mal codificado: no es nuestro
  }
}

/**
 * Fija la vista sin apilar historial ni renderizar. La usa main.js al arrancar
 * y al detectar un hashchange; quien llama decide cuándo pintar, que es lo que
 * garantiza un solo render por navegación (§6.4).
 */
export function setActiveView(view) {
  if (!VIEWS.includes(view) && !SECONDARY_VIEWS.includes(view)) return;
  activeView = view;
  viewParams = {};
}

/**
 * Reescribe la URL tras un cambio de idioma, sin moverse de vista y sin apilar
 * una entrada (contrato 5). Si no hay enlace posible, deja la URL como está.
 */
export function syncRouteLanguage(lang) {
  const plan = planLanguageSwitch(activeView, lang, TABLA_SLUGS);
  if (!plan) return;
  history.replaceState({ appView: activeView }, '', plan.hash);
}
