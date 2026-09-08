// Vista del mapa web (SM-4).
//
// Un índice de todo lo que tiene el sitio, agrupado y en orden. Existe para
// quien no encuentra algo en el menú, para quien navega con lector de pantalla
// y prefiere una lista a un desplegable, y porque el pie llevaba meses
// anunciándolo sin que existiera.
//
// Lo que esta vista NO hace, y es deliberado (DA-SM-2 y DA-SM-3): no conoce
// ninguna URL ni ningún rótulo. Los destinos se los pide al enrutador y los
// nombres, a las traducciones que ya usan el menú y el pie. Lo único que
// aporta el CMS es la selección, el grupo y el orden.

import { getLanguage, t } from '../i18n.js';
import { SITEMAP_CONFIG } from '../../data/sitemap.js';
import { escapeHtml as esc } from '../utils/escape-html.js';
import { formatViewRoute } from '../utils/view-route.js';

/**
 * Una entrada del mapa. Falla cerrado: si la vista no resolviera a enlace, no
 * se pinta nada en lugar de un enlace vacío, que apunta a la página actual.
 */
function renderEntrada(entrada, lang) {
  const href = formatViewRoute(entrada.view, lang);
  if (!href) return '';

  return `
    <li>
      <a href="${esc(href)}" class="rd-sitemap-link">${esc(t(entrada.labelKey))}</a>
    </li>
  `;
}

function renderGrupo(grupo, lang) {
  const entradas = grupo.entradas.map(e => renderEntrada(e, lang)).join('');
  if (!entradas.trim()) return '';

  return `
    <section class="mb-10">
      <h2 class="rd-sitemap-group">${esc(t(grupo.clave))}</h2>
      <ul class="rd-sitemap-list">${entradas}</ul>
    </section>
  `;
}

export function render() {
  const lang = getLanguage();
  const grupos = (SITEMAP_CONFIG?.grupos || []).map(g => renderGrupo(g, lang)).join('');

  return `
    <section class="rd-section max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <h1 class="rd-legal-title">${esc(t('sitemap.title'))}</h1>
      <p class="rd-legal-stamp">${esc(t('sitemap.intro'))}</p>
      <div class="mt-10">${grupos}</div>
    </section>
  `;
}
