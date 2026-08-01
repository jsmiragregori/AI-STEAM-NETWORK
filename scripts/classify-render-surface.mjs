// VAN-1.2 — clasificación documentada de las interpolaciones sin escapar.
//
// VAN-0.1 midió CUÁNTAS son (126). Esta subtarea decide QUÉ ES CADA UNA, que
// es lo que condiciona la migración de VAN-1.3 en adelante: escapar a ciegas
// rompería el HTML que algunas expresiones producen a propósito.
//
// La clasificación es **derivada, no escrita a mano**. Una lista manual de 126
// entradas envejece en silencio en cuanto alguien mueve una línea; por eso se
// calcula a partir del mismo escáner léxico del inventario (se reutilizan sus
// funciones exportadas: un solo lexer, sin un segundo que pueda divergir).
//
// Categorías, en el orden en que se aplican:
//
//   HELPER_QUE_ESCAPA   La interpolación entrega el valor a un helper de la
//                       allowlist revisada, que escapa internamente. El punto
//                       de salida ya está cubierto: no se toca.
//   COMPOSICION_CADENA  No está dentro de una plantilla HTML: se está armando
//                       una cadena que después se escapa aguas abajo. No es un
//                       punto de salida al DOM.
//   ESTRUCTURAL         La expresión COMPONE HTML (contiene plantillas
//                       anidadas o es una IIFE que devuelve marcado).
//                       Escaparla destruiría el marcado; el texto editorial
//                       real sale por sus interpolaciones hijas, contadas
//                       aparte.
//   URL                 Cae dentro de un atributo href/src: no basta escapar,
//                       necesita allowlist de esquemas (VAN-2).
//   ATRIBUTO            Cae dentro de cualquier otro valor de atributo:
//                       escapar es necesario pero las comillas mandan.
//   TEXTO_PLANO         Cae en el texto de un elemento. Escapar y ya.
//   HTML_INTENCIONAL    Contenido editorial que debe seguir produciendo HTML,
//                       y por tanto exige saneado con allowlist (VAN-1.7),
//                       no escapado.
//
// Uso: node scripts/classify-render-surface.mjs [--json]

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import {
  INVENTORY_JS_ROOT,
  INVENTORY_ROOT,
  classifyInterpolation,
  collectJsFiles,
  extractInterpolations,
  lineOf,
  redactNestedSpans,
} from './inventory-render-surface.mjs';

export const CATEGORIES = [
  'TEXTO_PLANO',
  'ATRIBUTO',
  'URL',
  'HTML_INTENCIONAL',
  'ESTRUCTURAL',
  'HELPER_QUE_ESCAPA',
  'COMPOSICION_CADENA',
];

// Allowlist revisada a mano en VAN-1.2: helpers que escapan TODOS los campos
// de texto que reciben. Ampliarla exige volver a leer el helper: es una
// afirmación sobre su cuerpo, no sobre su nombre.
//
// renderCardMiniMeta (marketplace.js): aplica esc() a label, value,
// secondaryValue y tertiaryValue. El único campo crudo es htmlValue, que la
// clasificación trata aparte porque quien lo construye ya escapa su texto.
export const ESCAPING_HELPERS = new Set(['renderCardMiniMeta']);

// Campos de un helper de la allowlist que NO se escapan y por tanto no pueden
// considerarse cubiertos por él.
export const RAW_HELPER_FIELDS = new Set(['htmlValue']);

function topLevelCallee(directText) {
  const match = directText.trim().match(/^([A-Za-z_$][\w$]*)\s*\(/);
  return match ? match[1] : null;
}

function looksLikeIife(directText) {
  return /^\(\s*\(\s*\)\s*=>/.test(directText.trim()) || /^\(\s*function\b/.test(directText.trim());
}

// ¿La expresión compone marcado, en vez de emitir una cadena de texto?
// Señal fiable en estas vistas: contiene un literal de plantilla propio (la
// interpolación hija ya se contabiliza por separado) o es una IIFE que
// devuelve HTML.
function composesMarkup(rawExpr) {
  if (looksLikeIife(rawExpr)) return true;
  return rawExpr.includes('`') && /<[a-zA-Z/]/.test(rawExpr);
}

// Contexto HTML de la salida, a partir del texto literal de la plantilla que
// precede a la interpolación. Si el último '<' va después del último '>',
// seguimos dentro de una etiqueta abierta: la salida cae en un atributo.
export function htmlContextOf(precedingLiteral) {
  const lastOpen = precedingLiteral.lastIndexOf('<');
  const lastClose = precedingLiteral.lastIndexOf('>');
  if (lastOpen <= lastClose) return { context: 'element-text', attribute: null };
  const tagText = precedingLiteral.slice(lastOpen);
  // Último nombre de atributo cuyo valor sigue abierto.
  const attrMatch = [...tagText.matchAll(/([a-zA-Z-]+)\s*=\s*["']/g)].pop();
  const attribute = attrMatch ? attrMatch[1].toLowerCase() : null;
  return { context: 'attribute', attribute };
}

const URL_ATTRIBUTES = new Set(['href', 'src', 'action', 'formaction', 'poster', 'data']);

export function categorize(entry) {
  const { rawExpr, directText, precedingLiteral, enclosingTemplate } = entry;

  const callee = topLevelCallee(directText);
  if (callee && ESCAPING_HELPERS.has(callee)) {
    const usesRawField = [...RAW_HELPER_FIELDS].some((field) => new RegExp(`\\b${field}\\s*:`).test(directText));
    if (!usesRawField) {
      return { category: 'HELPER_QUE_ESCAPA', reason: `${callee}() escapa los campos de texto que recibe` };
    }
    return { category: 'ESTRUCTURAL', reason: `${callee}() recibe un campo htmlValue crudo, construido aparte` };
  }

  if (!/<[a-zA-Z/]/.test(enclosingTemplate)) {
    return { category: 'COMPOSICION_CADENA', reason: 'la plantilla que la contiene no emite HTML' };
  }

  if (composesMarkup(rawExpr)) {
    return { category: 'ESTRUCTURAL', reason: 'la expresión compone marcado; el texto sale por sus hijas' };
  }

  const { context, attribute } = htmlContextOf(precedingLiteral);
  if (context === 'attribute') {
    if (attribute && URL_ATTRIBUTES.has(attribute)) {
      return { category: 'URL', reason: `valor del atributo ${attribute}` };
    }
    return { category: 'ATRIBUTO', reason: `valor del atributo ${attribute || '(sin nombre reconocido)'}` };
  }

  return { category: 'TEXTO_PLANO', reason: 'texto de elemento' };
}

// Candidatas a **salida editorial indirecta**: interpolaciones que emiten un
// identificador simple (`${text}`, `${pbTitle}`) en el texto de un elemento.
// El inventario no las ve porque no contienen `pickLang`, pero varias de ellas
// sí llevan contenido editorial que pasó antes por una variable.
//
// Es un TECHO GRUESO, no una cifra de riesgo: incluye contadores,
// identificadores, clases CSS y variables ya escapadas. Se publica para que la
// afirmación «las 126 son un suelo» tenga un número reproducible detrás, y para
// que el triaje por vista de VAN-1.3 en adelante sepa cuánto tiene delante.
// Deuda V6.
function isSimpleIdentifierExpression(expr) {
  const trimmed = expr.trim();
  if (/pickLang/.test(trimmed)) return false;
  if (/[`<]/.test(trimmed)) return false;
  return /^[A-Za-z_$][\w$]*(?:\??\.[A-Za-z_$][\w$]*)*$/.test(trimmed);
}

export async function generateClassification() {
  const files = (await collectJsFiles(INVENTORY_JS_ROOT)).sort();
  const entries = [];
  const indirectCandidatesByFile = {};
  let indirectCandidates = 0;

  for (const filePath of files) {
    const relativePath = path.relative(INVENTORY_ROOT, filePath).replace(/\\/g, '/');
    const source = await readFile(filePath, 'utf8');
    const interpolations = extractInterpolations(source);

    for (const current of interpolations) {
      const enclosingTemplate = source.slice(
        current.templateStart,
        current.templateEnd > 0 ? current.templateEnd : current.end,
      );
      const emitsHtml = /<[a-zA-Z/]/.test(enclosingTemplate);

      if (
        emitsHtml
        && isSimpleIdentifierExpression(current.expr)
        && htmlContextOf(current.precedingLiteral).context === 'element-text'
      ) {
        indirectCandidates++;
        indirectCandidatesByFile[relativePath] = (indirectCandidatesByFile[relativePath] || 0) + 1;
      }

      const nestedSpans = interpolations.filter(
        (other) => other !== current && other.start >= current.start && other.end <= current.end,
      );
      const directText = redactNestedSpans(current.expr, current.start, nestedSpans);
      const classification = classifyInterpolation(directText);
      if (!classification || classification.escaped) continue;

      const entry = {
        file: relativePath,
        line: lineOf(source, current.start),
        rawExpr: current.expr,
        directText,
        precedingLiteral: current.precedingLiteral,
        enclosingTemplate,
      };
      const verdict = categorize(entry);
      entries.push({
        file: entry.file,
        line: entry.line,
        expression: directText.trim().replace(/\s+/g, ' ').slice(0, 240),
        category: verdict.category,
        reason: verdict.reason,
      });
    }
  }

  const byCategory = Object.fromEntries(
    CATEGORIES.map((category) => [category, entries.filter((e) => e.category === category).length]),
  );
  const byFile = {};
  for (const entry of entries) {
    byFile[entry.file] ??= Object.fromEntries(CATEGORIES.map((category) => [category, 0]));
    byFile[entry.file][entry.category]++;
  }

  return {
    total: entries.length,
    byCategory,
    byFile,
    entries,
    indirectOutputCandidates: { total: indirectCandidates, byFile: indirectCandidatesByFile },
  };
}

async function main() {
  const report = await generateClassification();

  if (process.argv.includes('--json')) {
    console.log(JSON.stringify(report, null, 2));
    return;
  }

  console.log('== Clasificación de interpolaciones sin escapar — VAN-1.2 ==');
  console.log(`Total clasificadas: ${report.total}`);
  console.log('\n-- Por categoría --');
  for (const category of CATEGORIES) console.log(`  ${category.padEnd(20)} ${report.byCategory[category]}`);
  console.log('\n-- Por fichero --');
  for (const [file, counts] of Object.entries(report.byFile)) {
    const detail = CATEGORIES.filter((c) => counts[c]).map((c) => `${c}=${counts[c]}`).join(' ');
    console.log(`  ${file}: ${detail}`);
  }
  console.log(`\n-- Salidas editoriales indirectas (techo grueso, deuda V6): ${report.indirectOutputCandidates.total} --`);
  for (const [file, count] of Object.entries(report.indirectOutputCandidates.byFile)) {
    console.log(`  ${file}: ${count}`);
  }
}

const invokedPath = process.argv[1] ? pathToFileURL(path.resolve(process.argv[1])).href : null;
if (invokedPath === import.meta.url) {
  main().catch((error) => {
    console.error(`Classification failed: ${error.message}`);
    process.exitCode = 1;
  });
}
