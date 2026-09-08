import { renderHeader, mountHeader } from './components/header.js';
import { renderFooter, mountFooter } from './components/footer.js';
import { renderCookieNotice, mountCookieNotice } from './components/cookie-notice.js';
import { getActiveView, isInPageAnchor, readRoute, setActiveView, syncView } from './router.js';
import { applyLanguage, getLanguage } from './i18n.js';
import * as views from './views/index.js';
import { formatViewRoute, planHashChange } from './utils/view-route.js';

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
  // Secundarias: páginas legales (LG-6). Se pintan igual que cualquier otra
  // vista; lo único que no hacen es aparecer en el menú principal.
  'aviso-legal': views.avisoLegal,
  'privacidad': views.privacidad,
  'cookies': views.cookies,
  'accesibilidad': views.accesibilidad,
};

export function renderApp() {
  const activeView = getActiveView();
  const view = VIEW_MAP[activeView];

  document.getElementById('header-root').innerHTML = renderHeader();
  document.getElementById('main-root').innerHTML = view?.render?.() ?? '<p class="p-8 text-gray-400">Vista no encontrada</p>';
  document.getElementById('footer-root').innerHTML = renderFooter();

  // Aviso de cookies (LG-8): informativo, no de consentimiento. Se inserta solo
  // si no está ya puesto; una vez cerrado, renderCookieNotice devuelve ''.
  if (!document.getElementById('cookie-notice')) {
    const avisoHtml = renderCookieNotice();
    if (avisoHtml) {
      document.body.insertAdjacentHTML('beforeend', avisoHtml);
      mountCookieNotice();
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

// Enlaces directos por slug (DL-4). Editar el hash a mano en la barra de
// direcciones SÍ dispara `hashchange`; `pushState` con hash NO. Por eso este
// listener solo actúa si cambia algo de verdad —la vista o el idioma—: sin esa
// comparación, una misma navegación se pintaría dos veces (§6.4).
window.addEventListener('hashchange', () => {
  // Un ancla dentro de la página —el salto al contenido principal— no es una
  // navegación: el navegador ya la resuelve desplazándose. Si el router actuara,
  // se llevaría a Inicio a quien solo quería saltar la cabecera.
  if (isInPageAnchor()) return;

  const ruta = readRoute();
  // Se comparan vista E idioma. Comparar solo la vista dejaba sin efecto el
  // caso que encontró Salva en DL-5: editar el hash a mano para pasar de
  // `#es/sectores` a `#va/sectors` cambia el idioma sin cambiar de sección, y
  // la página se quedaba en el idioma anterior hasta forzar una recarga.
  const plan = planHashChange(ruta, { view: getActiveView(), lang: getLanguage() });
  // Atrás/adelante entre dos entradas con hash distinto dispara popstate Y
  // hashchange. Sea cual sea el orden en que lleguen, solo pinta el primero: el
  // que actúa fija `activeView` de forma síncrona, y el segundo encuentra la
  // vista ya puesta y se retira aquí mismo. El listener de popstate hace la
  // misma comprobación, y por eso la pareja es segura en ambos sentidos.
  if (!plan.render) return;
  if (plan.changeLang) applyLanguage(plan.lang);
  setActiveView(plan.view);
  window.scrollTo(0, 0);
  // Se normaliza a la forma canónica: si se llegó por un alias, la barra de
  // direcciones acaba mostrando el enlace que sí se genera.
  history.replaceState({ appView: plan.view }, '', formatViewRoute(plan.view, plan.lang) || undefined);
  renderApp();
});

document.addEventListener('DOMContentLoaded', () => {
  // El enlace decide antes de pintar: aplicar el idioma después obligaría a un
  // segundo render (§6.4). Una ruta irreconocible devuelve Inicio y deja el
  // idioma del visitante intacto, así que esto es seguro para una visita normal.
  const ruta = readRoute();
  if (ruta.langFromLink) applyLanguage(ruta.lang);
  setActiveView(ruta.view);

  syncHtmlLang();
  renderApp();
  // Entrada base del historial = la vista con la que se ha abierto, para que
  // "atrás" desde la primera navegación vuelva aquí. Se normaliza la URL a la
  // forma canónica: un alias tolerado se reescribe al enlace que sí se genera.
  history.replaceState({ appView: getActiveView() }, '', formatViewRoute(getActiveView(), getLanguage()) || undefined);
});
