/**
 * S6 — Selector puro del resumen breve (`summary`) para el idioma activo.
 *
 * No valida el mapa completo, no normaliza y no trunca: eso corresponde al
 * backend y a los loaders (fases S1–S5). Aquí solo se lee la propiedad propia
 * del idioma activo si es una cadena no vacía después de comprobar separadores
 * con `trim()`; cualquier otra forma devuelve `''`.
 *
 * `trim()` solo comprueba vacío; se devuelve el string recibido tal cual para
 * preservar el texto interior (sin recorte ni conversión).
 */
export function getResourceSummary(summary, lang) {
  if (!['es', 'en', 'va'].includes(lang)) return '';
  if (summary === null || typeof summary !== 'object' || Array.isArray(summary)) return '';
  if (!Object.prototype.hasOwnProperty.call(summary, lang)) return '';
  const text = summary[lang];
  if (typeof text !== 'string' || text.trim() === '') return '';
  return text;
}
