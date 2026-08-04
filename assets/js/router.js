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
  history.pushState({ appView: view }, '');
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
