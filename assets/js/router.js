export const VIEWS = ['inicio', 'red', 'sectores', 'banco-retos', 'formacion', 'conocimiento', 'gobernanza', 'actualidad'];

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
  import('./main.js').then(m => m.renderApp());
}
