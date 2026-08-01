/**
 * Escapa un valor para insertarlo como texto o como valor de atributo HTML.
 *
 * No es un sanitizador de HTML intencional: ese contenido debe pasar por una
 * allowlist específica antes de llegar al DOM.
 */
export function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
