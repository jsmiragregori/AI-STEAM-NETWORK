import { getLanguage, getStoredLanguage } from './i18n.js';
import { formatViewRoute, planLanguageSwitch, resolveInitialRoute } from './utils/view-route.js';

export const VIEWS = ['inicio', 'red', 'sectores', 'banco-retos', 'formacion', 'conocimiento', 'gobernanza'];

let activeView = 'inicio';
let viewParams = {};

export function getActiveView() { return activeView; }
export function getViewParams() { return viewParams; }

export function navigateTo(view, params = {}) {
  if (!VIEWS.includes(view)) {
    console.warn(`View "${view}" no existe`);
    return;
  }
  activeView = view;
  viewParams = params;
  window.scrollTo(0, 0);
  // La URL lleva solo la vista y el idioma. `params` es estado interno y no se
  // serializa nunca (DA-DL-2): formatViewRoute lo ignora por construcción. Si
  // no hubiera enlace posible, se apila sin URL como se hacía antes.
  history.pushState({ appView: view }, '', formatViewRoute(view, getLanguage()) || undefined);
  import('./main.js').then(m => m.renderApp());
}

// Restaura una vista desde el historial del navegador (popstate) SIN apilar una
// nueva entrada. La usa el listener global de main.js para back/forward.
export function syncView(view) {
  if (!VIEWS.includes(view)) return;
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
  return resolveInitialRoute(window.location.hash, { storedLang: getStoredLanguage() });
}

/**
 * Fija la vista sin apilar historial ni renderizar. La usa main.js al arrancar
 * y al detectar un hashchange; quien llama decide cuándo pintar, que es lo que
 * garantiza un solo render por navegación (§6.4).
 */
export function setActiveView(view) {
  if (!VIEWS.includes(view)) return;
  activeView = view;
  viewParams = {};
}

/**
 * Reescribe la URL tras un cambio de idioma, sin moverse de vista y sin apilar
 * una entrada (contrato 5). Si no hay enlace posible, deja la URL como está.
 */
export function syncRouteLanguage(lang) {
  const plan = planLanguageSwitch(activeView, lang);
  if (!plan) return;
  history.replaceState({ appView: activeView }, '', plan.hash);
}
