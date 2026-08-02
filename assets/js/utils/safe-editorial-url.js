/**
 * Devuelve una URL editorial permitida o null si no puede usarse en href.
 *
 * La política es positiva: http:, https:, mailto: y rutas relativas. No
 * normaliza ni escapa para HTML; quien la interpole debe aplicar escapeHtml().
 */
const ALLOWED_PROTOCOLS = new Set(['http:', 'https:', 'mailto:']);

export function getSafeEditorialUrl(value) {
  const url = String(value ?? '').trim();
  if (!url || /[\u0000-\u001F\u007F\\]/.test(url)) return null;

  // Una URL protocol-relative hereda el esquema y el host no queda auditado.
  if (url.startsWith('//')) return null;

  // Fragmentos, consultas y rutas (incluidas las relativas sin ./) no tienen
  // esquema. Un ':' antes de /?# los convierte en un esquema y se valida abajo.
  if (!/^[a-zA-Z][a-zA-Z\d+.-]*:/.test(url)) return url;

  try {
    const parsed = new URL(url);
    return ALLOWED_PROTOCOLS.has(parsed.protocol) ? url : null;
  } catch {
    return null;
  }
}
