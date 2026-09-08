import { sanitizeWithAllowlist } from './sanitize-editorial-html.js';

/**
 * Etiquetas admitidas en un documento legal (DA-LG-4).
 *
 * Es la MISMA lista que aplica el loader en el build
 * (`ALLOWED_LEGAL_TAGS` en `AI-STEAM-CONTENT/scripts/loaders/legal.js`), y esa
 * duplicación es intencionada: son dos capas independientes de la misma
 * política (TL1). Si el loader se rompiera, o alguien editase a mano
 * `assets/data/legal.js`, esta segunda capa sigue en pie. Si algún día se
 * amplía una, hay que ampliar la otra a la vez.
 *
 * Sin `h1`: el título de la página ya lo es, y dos `h1` rompen la estructura
 * para quien navega con lector de pantalla. Sin `table` ni `img`: no hacen
 * falta en estos textos, y cada etiqueta admitida es superficie que defender.
 */
export const ALLOWED_LEGAL_TAGS = new Set([
  'h2', 'h3', 'p', 'ul', 'ol', 'li', 'strong', 'em', 'a', 'blockquote',
]);

/**
 * Sanea el HTML de un documento legal antes de pintarlo.
 *
 * Distinta de `sanitizeEditorialHtml` solo en la allowlist: un texto legal
 * necesita encabezados y párrafos, que el contenido editorial no usa. Ampliar
 * la allowlist editorial habría cambiado el trato de las 130 interpolaciones ya
 * protegidas, y ninguna de ellas lo pedía.
 *
 * El tratamiento de enlaces y atributos es el común: solo sobrevive un `href`
 * validado por `getSafeEditorialUrl`, y ningún otro atributo.
 */
export function sanitizeLegalHtml(value) {
  return sanitizeWithAllowlist(value, ALLOWED_LEGAL_TAGS);
}
