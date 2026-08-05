import { getSafeEditorialUrl } from './safe-editorial-url.js';

/**
 * Resuelve la acción de adhesión.
 *
 * La URL de Microsoft Forms es editorial y alimenta dos salidas: el `href` del
 * botón y el `src` del iframe embebido. Se valida aquí, en el único punto por
 * el que pasan ambas, y no en cada vista. Si la URL no supera la allowlist se
 * devuelve `unsafe`: la vista pinta la etiqueta sin enlace ni iframe, en vez de
 * un enlace ejecutable o un hueco.
 */
export function resolveMembershipAction(config = {}, context = 'network') {
  const formVisible = config.formVisible ?? config.membershipFormVisible;
  if (formVisible === false) return { kind: 'hidden' };

  const formMode = config.formMode || 'demo';
  if (formMode !== 'microsoftForms') return { kind: 'internal' };

  const microsoftForms = config.microsoftForms || {};
  const url = String(microsoftForms.url || '').trim();
  if (!url) return { kind: 'hidden' };

  const safeUrl = getSafeEditorialUrl(url);
  if (!safeUrl) return { kind: 'unsafe' };

  if ((microsoftForms.presentation || 'newTab') === 'newTab') {
    return { kind: 'external', url: safeUrl };
  }

  return context === 'network'
    ? { kind: 'embed', url: safeUrl }
    : { kind: 'internal' };
}
