import { renderHeader, mountHeader } from './components/header.js';
import { renderFooter, mountFooter } from './components/footer.js';
import { renderCookieBanner, mountCookieBanner } from './components/cookie-banner.js';
import { getActiveView, syncView } from './router.js';
import { getLanguage } from './i18n.js';
import * as views from './views/index.js';

const LANG_BCP47 = { es: 'es', en: 'en', va: 'ca-valencia' };
function syncHtmlLang() {
  const lang = getLanguage();
  document.documentElement.lang = LANG_BCP47[lang] || lang;
}

// 'banco-retos' contiene guión — mapeamos al nombre JS válido
const VIEW_MAP = {
  'inicio': views.inicio,
  'red': views.red,
  'sectores': views.sectores,
  'banco-retos': views.bancoRetos,
  'formacion': views.formacion,
  'conocimiento': views.conocimiento,
  'gobernanza': views.gobernanza,
};

export function renderApp() {
  const activeView = getActiveView();
  const view = VIEW_MAP[activeView];

  document.getElementById('header-root').innerHTML = renderHeader();
  document.getElementById('main-root').innerHTML = view?.render?.() ?? '<p class="p-8 text-gray-400">Vista no encontrada</p>';
  document.getElementById('footer-root').innerHTML = renderFooter();

  // Cookie banner: insertar solo si no existe ya
  if (!document.getElementById('cookie-banner')) {
    const bannerHtml = renderCookieBanner();
    if (bannerHtml) {
      document.body.insertAdjacentHTML('beforeend', bannerHtml);
      mountCookieBanner();
    }
  }

  mountHeader();
  mountFooter();
  view?.mount?.();

  if (window.lucide) window.lucide.createIcons();
}

// Back/forward del navegador entre vistas de nivel superior. Los detalles
// por-vista (p.ej. Actualidad) apilan sus propias entradas sin `appView` y las
// gestiona su propio listener; aquí solo actuamos si cambia la vista activa.
window.addEventListener('popstate', (e) => {
  const view = e.state?.appView;
  if (view && view !== getActiveView()) syncView(view);
});

document.addEventListener('DOMContentLoaded', () => {
  syncHtmlLang();
  renderApp();
  // Entrada base del historial = vista inicial (Inicio), para que "atrás"
  // desde la primera navegación vuelva a la landing.
  history.replaceState({ appView: getActiveView() }, '');
});
