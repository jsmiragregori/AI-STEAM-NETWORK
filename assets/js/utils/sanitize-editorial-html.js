import { escapeHtml as esc } from './escape-html.js';
import { getSafeEditorialUrl } from './safe-editorial-url.js';

const ALLOWED_TAGS = new Set(['strong', 'em', 'a', 'ul', 'ol', 'li']);

function decodeHtmlEntities(value) {
  return String(value)
    .replaceAll('&amp;', '&')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replace(/&#(x[\da-f]+|\d+);/gi, (_, entity) => {
      const codePoint = entity[0].toLowerCase() === 'x'
        ? Number.parseInt(entity.slice(1), 16)
        : Number.parseInt(entity, 10);
      return Number.isSafeInteger(codePoint) ? String.fromCodePoint(codePoint) : '';
    });
}

function findTagEnd(source, start) {
  let quote = null;
  for (let index = start; index < source.length; index++) {
    const char = source[index];
    if (quote) {
      if (char === quote) quote = null;
    } else if (char === '"' || char === "'") {
      quote = char;
    } else if (char === '>') {
      return index;
    }
  }
  return -1;
}

function attributesOf(source) {
  const attributes = new Map();
  const pattern = /([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
  for (const match of source.matchAll(pattern)) {
    const name = match[1].toLowerCase();
    if (!attributes.has(name)) attributes.set(name, match[2] ?? match[3] ?? match[4] ?? '');
  }
  return attributes;
}

function openingTag(name, attributeSource) {
  if (name !== 'a') return `<${name}>`;

  const attributes = attributesOf(attributeSource);
  const href = getSafeEditorialUrl(decodeHtmlEntities(attributes.get('href') || ''));
  if (!href) return '';

  // El editor no controla atributos salvo el destino seguro del enlace.
  return attributes.get('target') === '_blank'
    ? `<a href="${esc(href)}" target="_blank" rel="noopener noreferrer">`
    : `<a href="${esc(href)}">`;
}

/**
 * Conserva el subconjunto editorial permitido y escapa todo lo demás.
 *
 * Etiquetas permitidas: strong, em, ul, ol, li y a. En a solo sobrevive un
 * href validado por la política común; target=_blank fuerza rel seguro.
 */
export function sanitizeEditorialHtml(value) {
  return sanitizeWithAllowlist(value, ALLOWED_TAGS);
}

/**
 * El motor de saneado, con la allowlist por parámetro.
 *
 * Se abrió en LG-6, cuando las páginas legales necesitaron conservar
 * encabezados y párrafos que el contenido editorial no usa (DA-LG-4). La
 * alternativa era copiar estas ochenta líneas en un segundo fichero, y duplicar
 * código de seguridad es la forma más segura de que un día solo se arregle una
 * de las dos copias.
 *
 * Lo que NO cambia con la allowlist: el escapado de todo lo que no está en
 * ella, el descarte de atributos y la política de URL de los enlaces. Quien
 * llame solo decide QUÉ etiquetas sobreviven, nunca cómo se tratan.
 *
 * @param {unknown} value
 * @param {Set<string>} allowed Etiquetas permitidas, en minúsculas.
 */
export function sanitizeWithAllowlist(value, allowed) {
  const source = String(value ?? '');
  const output = [];
  const stack = [];
  let cursor = 0;

  while (cursor < source.length) {
    const start = source.indexOf('<', cursor);
    if (start === -1) {
      output.push(esc(source.slice(cursor)));
      break;
    }
    output.push(esc(source.slice(cursor, start)));

    if (source.startsWith('<!--', start)) {
      const commentEnd = source.indexOf('-->', start + 4);
      cursor = commentEnd === -1 ? source.length : commentEnd + 3;
      continue;
    }

    const end = findTagEnd(source, start + 1);
    if (end === -1) {
      output.push(esc(source.slice(start)));
      break;
    }

    const raw = source.slice(start + 1, end);
    const match = raw.match(/^\s*(\/)?\s*([A-Za-z][\w:-]*)([\s\S]*?)\/?\s*$/);
    if (!match) {
      output.push(esc(source.slice(start, end + 1)));
      cursor = end + 1;
      continue;
    }

    const [, closing, rawName, attributeSource] = match;
    const name = rawName.toLowerCase();
    if (!allowed.has(name)) {
      cursor = end + 1;
      continue;
    }

    if (closing) {
      const open = stack.pop();
      if (open?.name === name && open.emitted) output.push(`</${name}>`);
    } else {
      const tag = openingTag(name, attributeSource);
      stack.push({ name, emitted: Boolean(tag) });
      output.push(tag);
    }
    cursor = end + 1;
  }

  return output.join('');
}
