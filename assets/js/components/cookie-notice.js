// Aviso informativo sobre almacenamiento local (LG-8).
//
// Sustituye al banner de consentimiento. El anterior pedía permiso -y solo
// ofrecía «Aceptar»- para algo que está EXENTO de consentimiento: el artículo
// 22.2 de la LSSI no lo exige cuando el almacenamiento es estrictamente
// necesario para prestar un servicio que la persona ha pedido, y elegir un
// idioma o aplicar un filtro es exactamente eso. Un botón único de «Aceptar» no
// recoge un consentimiento válido, porque no hay forma de negarse.
//
// Además, el texto anterior decía «utilizamos cookies técnicas», y es falso:
// este sitio no instala ninguna cookie. Medido en LG-0 y declarado así en la
// política, que es la razón de que este aviso exista: informar de lo que sí se
// guarda, no pedir permiso para lo que no hace falta.
//
// No bloquea: es una banda al pie, no una capa que tape el sitio. No atrapa el
// foco, no bloquea el desplazamiento y no exige respuesta para seguir leyendo.

import { getLanguage, t } from '../i18n.js';
import { getState, setState } from '../state.js';
import { escapeHtml as esc } from '../utils/escape-html.js';
import { formatViewRoute } from '../utils/view-route.js';

/**
 * Clave de la preferencia. Se conserva el nombre histórico -`cookies-accepted`-
 * a propósito: la política de cookies publicada la enumera con ese nombre y la
 * describe como «si ya ha cerrado el aviso informativo». Renombrarla dejaría el
 * documento diciendo algo falso y volvería a mostrar el aviso a quien ya lo
 * había cerrado, a cambio de nada.
 */
const CLAVE = 'cookies-accepted';

/** Guarda la preferencia sin tumbar el clic si el navegador no deja escribir. */
function recordarDescartado() {
  try {
    localStorage.setItem(CLAVE, 'true');
  } catch {
    // Navegador con el almacenamiento bloqueado: el aviso volverá a salir en la
    // próxima visita, que es molesto pero inofensivo. Lo que no puede pasar es
    // que el clic lance y el aviso se quede ahí sin cerrarse.
  }
}

export function renderCookieNotice() {
  if (getState('cookieNoticeDismissed')) return '';

  const href = formatViewRoute('cookies', getLanguage());
  const enlace = href
    ? ` <a href="${esc(href)}" class="underline underline-offset-2 hover:text-eu-yellow">${esc(t('cookieNotice.more'))}</a>.`
    : '';

  return `
    <aside id="cookie-notice" role="region" aria-label="${esc(t('cookieNotice.title'))}"
           class="fixed bottom-0 left-0 right-0 bg-[rgba(0,0,0,0.88)] text-white text-sm px-4 sm:px-6 py-3 flex flex-col sm:flex-row sm:items-center gap-3 z-40">
      <p class="flex-1">${esc(t('cookieNotice.text'))}${enlace}</p>
      <button id="cookie-notice-dismiss" type="button" title="${esc(t('cookieNotice.close'))}"
              class="bg-eu-blue text-white border-none px-4 py-1.5 rounded font-semibold cursor-pointer hover:bg-eu-purple whitespace-nowrap transition-colors self-start sm:self-auto">
        ${esc(t('cookieNotice.dismiss'))}
      </button>
    </aside>
  `;
}

export function mountCookieNotice() {
  document.getElementById('cookie-notice-dismiss')?.addEventListener('click', () => {
    setState('cookieNoticeDismissed', true);
    recordarDescartado();
    document.getElementById('cookie-notice')?.remove();
  });
}
