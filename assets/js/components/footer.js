import { getLanguage, t } from '../i18n.js';
import { escapeHtml as esc } from '../utils/escape-html.js';
import { formatViewRoute } from '../utils/view-route.js';

/**
 * Los enlaces del pie: los cuatro documentos legales y el mapa web (LG-7, SM-5).
 *
 * El destino NO se escribe aquí: se pide al enrutador con `formatViewRoute`,
 * que construye el enlace desde la tabla de slugs congelada. Escribir
 * `#es/aviso-legal` a mano en el pie sobreviviría a cualquier cambio de slug
 * sin enterarse, y el pie es justo el sitio donde un enlace roto pasa años sin
 * que nadie lo note.
 */
const ENLACES_LEGALES = [
  { view: 'aviso-legal',   clave: 'footer.legalNotice' },
  { view: 'privacidad',    clave: 'footer.privacy' },
  { view: 'cookies',       clave: 'footer.cookies' },
  { view: 'accesibilidad', clave: 'footer.accessibility' },
  // El mapa web (SM-5). Cierra P-33: hasta ahora este rótulo estaba aquí sin
  // destino, porque la página no existía.
  { view: 'mapa-web',      clave: 'footer.sitemap' },
];

const CLASES_ENLACE = 'rd-footer-link font-medium underline underline-offset-2';
const CLASES_ROTULO = 'rd-footer-label font-medium';

/**
 * Pinta los enlaces legales en el idioma activo.
 *
 * Falla cerrado: si una vista no resolviera a enlace —hoy no puede pasar, la
 * tabla las cubre las tres idiomas—, se pinta el rótulo como texto y no un
 * `href` vacío, que apunta a la página actual y engaña a quien lo pulsa.
 */
function renderEnlacesLegales() {
  const lang = getLanguage();

  return ENLACES_LEGALES.map(({ view, clave }) => {
    const href = formatViewRoute(view, lang);
    const rotulo = esc(t(clave));
    return href
      ? `<a href="${esc(href)}" class="${CLASES_ENLACE}">${rotulo}</a>`
      : `<span class="${CLASES_ROTULO}">${rotulo}</span>`;
  }).join('\n            ');
}

export function renderFooter() {
  return `
    <footer class="rd-footer border-t-4 border-eu-blue mt-auto">
      <div class="rd-footer-inner px-4 sm:px-6 py-4">
        <img src="assets/images/co-funder-blue.svg" width="300" height="116"
          alt="${esc(t('footer.fundedBy'))} ${esc(t('footer.europeanUnion'))} — Digital Europe Programme (DIGITAL-2024-ADVANCED-DIGITAL-07)"
          class="rd-footer-funding-mark" loading="lazy" decoding="async" />
        <div class="rd-footer-meta">
          <div class="text-xs sm:text-sm">
            ${esc(t('footer.orgName'))}<br/>${esc(t('footer.orgUnit'))}
          </div>
          <nav aria-label="${esc(t('footer.legalNav'))}" class="flex flex-wrap gap-3 sm:gap-6 text-xs sm:text-sm">
            ${renderEnlacesLegales()}
          </nav>
        </div>
      </div>
    </footer>
  `;
}

export function mountFooter() {
  // Footer estático, sin event listeners: los enlaces son enlaces de verdad y
  // los resuelve el router al cambiar el hash.
}
