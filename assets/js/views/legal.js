// Vista de las páginas legales (LG-6).
//
// Cuatro documentos —aviso legal, privacidad, cookies y accesibilidad— con una
// sola vista: cambian el texto y el título, no la forma. El HTML ya viene
// convertido y saneado del build (DA-LG-2: markdown en el build, nunca en el
// navegador), y aquí se sanea OTRA VEZ contra la allowlist legal antes de
// pintarlo. Son dos capas independientes de la misma política (TL1): si alguien
// editara a mano `assets/data/legal.js`, esta segunda seguiría en pie.
//
// La vista no lee el hash ni decide la ruta: la vista activa se la fija el
// router y el idioma, i18n. Es lo que mantiene la lectura del hash contenida en
// un solo fichero (test/security/hash-containment.test.mjs).

import { getLanguage, t } from '../i18n.js';
import { LEGAL_CONFIG } from '../../data/legal.js';
import { escapeHtml as esc } from '../utils/escape-html.js';
import { sanitizeLegalHtml } from '../utils/sanitize-legal-html.js';

/** Etiqueta de idioma para formatear la fecha. `va` no es un BCP-47 válido. */
const LANG_FECHA = { es: 'es-ES', en: 'en-GB', va: 'ca-ES-valencia' };

/**
 * Fecha en el formato del idioma activo. Ante cualquier duda, la fecha tal cual
 * viene: en un documento legal es preferible un `2026-09-07` seco a una fecha
 * mal formada o a ninguna.
 */
function formatearFecha(iso, lang) {
  if (typeof iso !== 'string' || iso === '') return '';
  try {
    const fecha = new Date(`${iso}T00:00:00Z`);
    if (Number.isNaN(fecha.getTime())) return iso;
    return fecha.toLocaleDateString(LANG_FECHA[lang] || 'es-ES', {
      day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
    });
  } catch {
    return iso;
  }
}

/**
 * Pinta un documento legal en el idioma activo.
 *
 * @param {string} documento Identificador: 'aviso-legal', 'privacidad', …
 */
function renderDocumento(documento) {
  const lang = getLanguage();
  const doc = LEGAL_CONFIG?.documentos?.[documento]?.[lang];

  // El build falla si falta un idioma (DA-LG-7), así que esto no debería pasar
  // nunca. Si pasa, se dice y no se pinta un documento a medias.
  if (!doc) {
    return `
      <section class="rd-section max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <p class="text-lg text-gray-600">${esc(t('legal.unavailable'))}</p>
      </section>
    `;
  }

  const fecha = formatearFecha(doc.fecha, lang);
  // Versión y fecha son requisito, no adorno (DA-LG-8): ante una reclamación
  // hay que poder decir qué texto estaba publicado y desde cuándo.
  const sello = [
    doc.version ? `${esc(t('legal.version'))} ${esc(doc.version)}` : '',
    fecha ? `${esc(t('legal.updated'))} ${esc(fecha)}` : '',
  ].filter(Boolean).join(' · ');

  return `
    <section class="rd-section max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <h1 class="rd-legal-title">${esc(doc.titulo)}</h1>
      ${sello ? `<p class="rd-legal-stamp">${sello}</p>` : ''}
      <div class="rd-legal-prose">${sanitizeLegalHtml(doc.html)}</div>
    </section>
  `;
}

/**
 * Construye el módulo de vista de un documento. Las cuatro vistas legales son
 * el mismo código con un identificador distinto; escribirlas cuatro veces solo
 * garantizaría que un día se arreglara una y no las otras.
 *
 * @param {string} documento
 * @returns {{render: () => string}}
 */
export function crearVistaLegal(documento) {
  return { render: () => renderDocumento(documento) };
}
