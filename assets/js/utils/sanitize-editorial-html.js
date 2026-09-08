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

/**
 * Descodifica texto que YA viene escapado como HTML, para poder volver a
 * escaparlo sin duplicar entidades.
 *
 * Distinta de `decodeHtmlEntities`, que se usa para leer un `href` y no
 * necesita `&lt;` ni `&gt;`: aquí sí hacen falta, porque son justamente las que
 * el build emite cuando el texto legal contiene un signo de menor o mayor.
 *
 * `&amp;` se descodifica LA ÚLTIMA, y no es un detalle de estilo: al revés,
 * `&amp;lt;` se convertiría primero en `&lt;` y después en `<`, es decir, una
 * entidad doblemente escapada acabaría siendo marcado. En este orden, no.
 */
function decodeEscapedHtmlText(value) {
  return String(value)
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replaceAll('&amp;', '&');
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
  if (attributes.get('target') === '_blank') {
    return `<a href="${esc(href)}" target="_blank" rel="noopener noreferrer">`;
  }
  // Un `rel` ya presente se conserva, pero SOLO si es exactamente el valor
  // seguro: no es un atributo que el origen pueda rellenar a su gusto, sino un
  // valor único que se reconoce o se descarta. Lo necesita el HTML legal, donde
  // el build lo pone en todos los enlaces —también en los de la misma pestaña,
  // porque `noreferrer` evita anunciar de dónde viene quien lee una política de
  // privacidad—. Sin esto, esta capa se lo quitaba y las dos capas dejaban de
  // producir lo mismo.
  return attributes.get('rel') === 'noopener noreferrer'
    ? `<a href="${esc(href)}" rel="noopener noreferrer">`
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
 * @param {{sourceIsHtml?: boolean}} [opciones] `sourceIsHtml` dice que el texto
 *   de la entrada YA viene escapado como HTML, no en crudo. Con él, cada trozo
 *   de texto se descodifica una vez antes de volver a escaparlo, y el resultado
 *   es idéntico a la entrada en vez de escaparla dos veces.
 */
export function sanitizeWithAllowlist(value, allowed, { sourceIsHtml = false } = {}) {
  const source = String(value ?? '');
  // Descodificar y volver a escapar NO abre nada: la salida de `texto()` está
  // escapada siempre. `&lt;script&gt;` se descodifica a `<script>` y se vuelve
  // a escapar a `&lt;script&gt;`, que es texto, no marcado.
  const texto = sourceIsHtml ? (trozo) => esc(decodeEscapedHtmlText(trozo)) : esc;
  const output = [];
  const stack = [];
  let cursor = 0;

  while (cursor < source.length) {
    const start = source.indexOf('<', cursor);
    if (start === -1) {
      output.push(texto(source.slice(cursor)));
      break;
    }
    output.push(texto(source.slice(cursor, start)));

    if (source.startsWith('<!--', start)) {
      const commentEnd = source.indexOf('-->', start + 4);
      cursor = commentEnd === -1 ? source.length : commentEnd + 3;
      continue;
    }

    const end = findTagEnd(source, start + 1);
    if (end === -1) {
      output.push(texto(source.slice(start)));
      break;
    }

    const raw = source.slice(start + 1, end);
    const match = raw.match(/^\s*(\/)?\s*([A-Za-z][\w:-]*)([\s\S]*?)\/?\s*$/);
    if (!match) {
      output.push(texto(source.slice(start, end + 1)));
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
