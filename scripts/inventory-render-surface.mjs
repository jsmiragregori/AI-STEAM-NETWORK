// VAN-0.1 — inventario reproducible de la superficie de render.
//
// Recorre assets/js/ (excepto assets/js/lib, que es código vendorizado) y
// mide con un escáner léxico de literales de plantilla (no un grep de línea)
// la superficie relevante para XSS almacenado:
//
//   - interpolaciones ${...} que llaman a pickLang(...), separadas en
//     protegidas (esc(...) o sanitizeEditorialHtml(...)) y sin proteger;
//   - vistas que definen su propio esc();
//   - href="${...}" dinámicos, separando las vistas editoriales del resto;
//   - target="_blank" sin rel="noopener";
//   - sinks peligrosos: eval, new Function, document.write,
//     insertAdjacentHTML, location.search/hash, URLSearchParams;
//
// Uso: node scripts/inventory-render-surface.mjs [--json]

import { readFile, readdir } from 'node:fs/promises';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const JS_ROOT = path.join(ROOT, 'assets/js');
const EXCLUDED_DIRS = new Set(['lib']); // código vendorizado, fuera del alcance de VAN-1/VAN-2

export const INVENTORY_ROOT = ROOT;
export const INVENTORY_JS_ROOT = JS_ROOT;

export async function collectJsFiles(directory) {
  const output = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (EXCLUDED_DIRS.has(entry.name)) continue;
      output.push(...await collectJsFiles(path.join(directory, entry.name)));
      continue;
    }
    if (entry.isFile() && entry.name.endsWith('.js')) output.push(path.join(directory, entry.name));
  }
  return output;
}

// --- Tokenizador mínimo de literales de plantilla -------------------------
//
// Extrae, de un fuente JS, todas las interpolaciones ${...}: respeta
// comentarios, cadenas, regexp y literales de plantilla anidados (p. ej.
// `${cond ? \`a\` : \`b\`}`). Un grep de línea no puede distinguir esto de
// forma fiable; por eso VAN-0.1 exige un escáner, no una lista a mano
// (lección de SEC-6.1.1 citada en el plan).

export function extractInterpolations(source) {
  const interpolations = []; // { expr, start, end, templateStart, templateEnd, precedingLiteral }
  let i = 0;
  const n = source.length;

  function skipLineComment() { while (i < n && source[i] !== '\n') i++; }
  function skipBlockComment() { i += 2; while (i < n && !(source[i] === '*' && source[i + 1] === '/')) i++; i += 2; }
  function skipQuotedString(quote) {
    i++; // opening quote
    while (i < n && source[i] !== quote) {
      if (source[i] === '\\') i++;
      i++;
    }
    i++; // closing quote
  }
  function skipRegexLiteral() {
    i++; // slash de apertura
    let inClass = false;
    while (i < n) {
      if (source[i] === '\\') { i += 2; continue; }
      if (source[i] === '[') { inClass = true; i++; continue; }
      if (source[i] === ']' && inClass) { inClass = false; i++; continue; }
      if (source[i] === '/' && !inClass) {
        i++;
        while (/[a-z]/i.test(source[i] || '')) i++;
        return;
      }
      i++;
    }
  }

  // Consume a template literal starting at the backtick; return nothing but
  // record every top-level ${...} found (recursing into nested templates).
  //
  // Además del propio rango de la interpolación se registra su **contexto de
  // plantilla**, que `VAN-1.2` necesita para clasificar sin volver a escanear
  // con un segundo lexer que podría divergir de este:
  //
  //   - `templateStart` / `templateEnd`: el literal que la contiene;
  //   - `precedingLiteral`: el texto literal de esa plantilla que aparece
  //     ANTES de la interpolación, excluyendo las interpolaciones hermanas.
  //     Con él se decide si la salida cae dentro de una etiqueta (contexto de
  //     atributo) o en el texto de un elemento.
  //
  // Son campos aditivos: no cambian qué se cuenta ni cuántas hay.
  function skipTemplateLiteral() {
    const templateStart = i;
    const ownInterpolations = [];
    let literalText = '';
    i++; // opening backtick
    while (i < n) {
      const ch = source[i];
      if (ch === '\\') { literalText += source.slice(i, i + 2); i += 2; continue; }
      if (ch === '`') {
        i++;
        for (const entry of ownInterpolations) entry.templateEnd = i;
        return;
      }
      if (ch === '$' && source[i + 1] === '{') {
        i += 2;
        const exprStart = i;
        let depth = 1;
        while (i < n && depth > 0) {
          const c = source[i];
          if (c === '{') { depth++; i++; }
          else if (c === '}') { depth--; if (depth === 0) break; i++; }
          else if (c === '`') { skipTemplateLiteral(); }
          else if (c === '"' || c === "'") { skipQuotedString(c); }
          else if (c === '/' && source[i + 1] === '/') { skipLineComment(); }
          else if (c === '/' && source[i + 1] === '*') { skipBlockComment(); }
          else if (c === '/' && looksLikeRegexStart(source, i)) { skipRegexLiteral(); }
          else { i++; }
        }
        const exprEnd = i;
        const entry = {
          expr: source.slice(exprStart, exprEnd),
          start: exprStart,
          end: exprEnd,
          templateStart,
          templateEnd: -1,
          precedingLiteral: literalText,
        };
        interpolations.push(entry);
        ownInterpolations.push(entry);
        i++; // closing }
        continue;
      }
      literalText += ch;
      i++;
    }
    for (const entry of ownInterpolations) entry.templateEnd = i;
  }

  while (i < n) {
    const ch = source[i];
    if (ch === '/' && source[i + 1] === '/') { skipLineComment(); continue; }
    if (ch === '/' && source[i + 1] === '*') { skipBlockComment(); continue; }
    if (ch === '"' || ch === "'") { skipQuotedString(ch); continue; }
    if (ch === '`') { skipTemplateLiteral(); continue; }
    i++;
  }
  return interpolations;
}

function looksLikeRegexStart(source, index) {
  let previous = index - 1;
  while (previous >= 0 && /\s/.test(source[previous])) previous--;
  if (previous < 0) return true;
  // Después de un valor terminado, `/` es división. Después de puntuación
  // que abre/continúa una expresión, inicia un literal de regexp.
  return !/[\w$\])}'"`]/.test(source[previous]);
}

function skipRegexLiteralAt(source, index) {
  let i = index + 1;
  let inClass = false;
  while (i < source.length) {
    if (source[i] === '\\') { i += 2; continue; }
    if (source[i] === '[') { inClass = true; i++; continue; }
    if (source[i] === ']' && inClass) { inClass = false; i++; continue; }
    if (source[i] === '/' && !inClass) {
      i++;
      while (/[a-z]/i.test(source[i] || '')) i++;
      return i;
    }
    i++;
  }
  return i;
}

// Variantes funcionales (índice explícito de entrada/salida) de los mismos
// saltos léxicos, reutilizadas por findDynamicHrefs para distinguir texto
// de plantilla (que sí puede cerrar un atributo) de código JS dentro de
// ${...} (que no debe, aunque contenga comillas propias).
function skipQuotedStringAt(source, index) {
  let i = index + 1; // comilla de apertura
  while (i < source.length && source[i] !== source[index]) {
    if (source[i] === '\\') i++;
    i++;
  }
  return i + 1; // comilla de cierre
}

function skipInterpolationExprAt(source, index) {
  // index apunta justo después de "${"; devuelve el índice tras la "}" de cierre.
  let i = index;
  let depth = 1;
  while (i < source.length && depth > 0) {
    const c = source[i];
    if (c === '{') { depth++; i++; }
    else if (c === '}') { depth--; i++; }
    else if (c === '`') { i = skipTemplateLiteralAt(source, i); }
    else if (c === '"' || c === "'") { i = skipQuotedStringAt(source, i); }
    else if (c === '/' && source[i + 1] === '/') { while (i < source.length && source[i] !== '\n') i++; }
    else if (c === '/' && source[i + 1] === '*') { i += 2; while (i < source.length && !(source[i] === '*' && source[i + 1] === '/')) i++; i += 2; }
    else if (c === '/' && looksLikeRegexStart(source, i)) { i = skipRegexLiteralAt(source, i); }
    else { i++; }
  }
  return i;
}

function skipTemplateLiteralAt(source, index) {
  let i = index + 1; // backtick de apertura
  while (i < source.length) {
    const ch = source[i];
    if (ch === '\\') { i += 2; continue; }
    if (ch === '`') return i + 1;
    if (ch === '$' && source[i + 1] === '{') { i = skipInterpolationExprAt(source, i + 2); continue; }
    i++;
  }
  return i;
}

export function lineOf(source, index) {
  let line = 1;
  for (let k = 0; k < index; k++) if (source[k] === '\n') line++;
  return line;
}

// --- Clasificación de interpolaciones editoriales --------------------------

// Una interpolación que envuelve un literal de plantilla anidado
// (`${cond ? \`${a}\` : \`${b}\`}`) contiene, como texto, las
// interpolaciones hijas completas. Si se clasifica el texto crudo de la
// interpolación exterior se cuenta dos veces cada pickLang() interior: una
// vez como parte del texto exterior y otra vez cuando se clasifica la
// interpolación hija por separado. Por eso, antes de clasificar, se redacta
// (se sustituye por espacios) el rango de cada interpolación anidada,
// dejando solo el texto que pertenece de verdad al nivel exterior.
export function redactNestedSpans(expr, exprStart, nestedSpans) {
  const chars = expr.split('');
  for (const span of nestedSpans) {
    const relStart = span.start - exprStart;
    const relEnd = span.end - exprStart;
    for (let k = Math.max(0, relStart); k < Math.min(chars.length, relEnd); k++) chars[k] = ' ';
  }
  return chars.join('');
}

export function classifyInterpolation(directText) {
  const trimmed = directText.trim();
  if (!/\bpickLang\s*\(/.test(trimmed)) return null;
  // La salida está protegida por esc() para texto plano o por el sanitizador
  // de allowlist para HTML editorial. Cualquier otra forma cuenta como no
  // protegida: el criterio es arquitectónico, no una búsqueda textual.
  const escaped = /^(?:esc|sanitizeEditorialHtml)\s*\(/.test(trimmed);
  return { escaped };
}

// --- href="${...}" -----------------------------------------------------
//
// El valor del atributo puede contener más que una interpolación pura
// (p. ej. `href="${detail.cta_link || '#'}"`, con una comilla simple
// dentro de la expresión). Un regex que exige que TODO el valor sea
// exactamente `${...}` subcuenta esos casos porque la comilla interior
// rompe el emparejamiento. Aquí se escanea carácter a carácter: solo se
// deja de comparar contra la comilla de cierre mientras se está DENTRO de
// una expresión ${...} (código JS, donde una comilla puede pertenecer a un
// literal de cadena de la propia expresión); en cuanto la expresión
// termina, el texto vuelve a ser plantilla literal y una comilla ahí sí
// cierra el atributo, sin importar que ese fragmento de plantilla esté a
// su vez anidado dentro de una interpolación ancestro.
function findDynamicHrefs(source, relativePath) {
  const results = [];
  const attrRe = /href\s*=\s*(["'])/g;
  let match;
  while ((match = attrRe.exec(source))) {
    const quote = match[1];
    const valueStart = match.index + match[0].length;
    let i = valueStart;
    let closeIndex = -1;
    while (i < source.length) {
      const c = source[i];
      if (c === quote) { closeIndex = i; break; }
      if (c === '\n') break; // los atributos no cruzan de línea en estas vistas
      if (c === '$' && source[i + 1] === '{') { i = skipInterpolationExprAt(source, i + 2); continue; }
      i++;
    }
    if (closeIndex === -1) continue;
    const value = source.slice(valueStart, closeIndex);
    if (value.includes('${')) {
      results.push({ file: relativePath, line: lineOf(source, match.index), snippet: `href=${quote}${value}${quote}` });
    }
  }
  return results;
}

// --- Validación de esquema en href dinámicos (VAN-2.2) -------------------
//
// Un href está protegido cuando su valor es exactamente una interpolación
// `${esc(ID)}` cuyo ID procede de `getSafeEditorialUrl()`. La comprobación es
// sobre la procedencia del valor, no sobre que aparezca la cadena
// "getSafeEditorialUrl" en el fichero: eso es la lección de SEC-7.1.3.
//
// `membershipAction.url` se acepta porque `resolveMembershipAction()` valida
// en origen y solo devuelve `external`/`embed` con una URL ya filtrada. Es una
// afirmación sobre el cuerpo de ese helper, igual que ESCAPING_HELPERS: si
// alguien la cambia, hay que revisarla aquí.
export function collectValidatedUrlIdentifiers(source) {
  const ids = new Set();
  // `[^;]` en vez de `[^;\n]`: una declaración puede ocupar varias líneas
  // (un ternario formateado), pero nunca cruza un `;`.
  const declRe = /(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*[^;]*?getSafeEditorialUrl\s*\(/g;
  let match;
  while ((match = declRe.exec(source))) ids.add(match[1]);
  if (/\bresolveMembershipAction\s*\(/.test(source)) ids.add('membershipAction.url');
  return ids;
}

export function isHrefSchemeValidated(snippet, validatedIds) {
  const value = snippet.replace(/^href=(["'])/, '').replace(/(["'])$/, '');
  const pure = /^\$\{\s*(?:esc|escapeHtml)\s*\(\s*([A-Za-z_$][\w$.]*)\s*\)\s*\}$/.exec(value);
  if (!pure) return false;
  return validatedIds.has(pure[1]);
}

// --- target="_blank" sin rel="noopener" ---------------------------------

function findUnsafeBlankTargets(source, relativePath) {
  const results = [];
  // Aproxima la etiqueta completa buscando hacia atrás/adelante desde
  // target="_blank" hasta el `<` y `>` más cercanos en la misma plantilla.
  const targetRe = /target\s*=\s*["']_blank["']/g;
  let match;
  while ((match = targetRe.exec(source))) {
    const tagStart = source.lastIndexOf('<', match.index);
    const tagEnd = source.indexOf('>', match.index);
    const tag = tagStart >= 0 && tagEnd >= 0 ? source.slice(tagStart, tagEnd + 1) : source.slice(match.index, match.index + 120);
    const hasNoopener = /rel\s*=\s*["'][^"']*noopener[^"']*["']/.test(tag);
    if (!hasNoopener) results.push({ file: relativePath, line: lineOf(source, match.index), snippet: tag.slice(0, 160) });
  }
  return { total: [...source.matchAll(targetRe)].length, unsafe: results };
}

// --- Sinks peligrosos ------------------------------------------------------

const DANGEROUS_SINK_PATTERNS = [
  { name: 'eval', pattern: /\beval\s*\(/g },
  { name: 'new Function', pattern: /new\s+Function\s*\(/g },
  { name: 'document.write', pattern: /document\.write(?:ln)?\s*\(/g },
  { name: 'insertAdjacentHTML', pattern: /\.insertAdjacentHTML\s*\(/g },
  { name: 'innerHTML assignment', pattern: /\.innerHTML\s*=/g },
  { name: 'location.search', pattern: /location\.search/g },
  { name: 'location.hash', pattern: /location\.hash/g },
  { name: 'URLSearchParams', pattern: /URLSearchParams/g },
];

function findDangerousSinks(source, relativePath) {
  const hits = [];
  for (const { name, pattern } of DANGEROUS_SINK_PATTERNS) {
    let match;
    const re = new RegExp(pattern.source, pattern.flags);
    while ((match = re.exec(source))) hits.push({ file: relativePath, line: lineOf(source, match.index), sink: name });
  }
  return hits;
}

// --- Programa principal --------------------------------------------------

function runSelfTests() {
  const lexicalFixture = [
    '// `${pickLang(commented)}`',
    'const quoted = "`${pickLang(quoted)}`";',
    'const html = `${pickLang(a)} ${flag ? pickLang(b) : ""} ${(value).replace(/"/g, "")}`;',
    'const nested = `${flag ? `<b>${pickLang(c)}</b>` : ""}`;',
  ].join('\n');
  const all = extractInterpolations(lexicalFixture);
  const classified = all.map((current) => {
    const nested = all.filter((other) => other !== current && other.start >= current.start && other.end <= current.end);
    return classifyInterpolation(redactNestedSpans(current.expr, current.start, nested));
  }).filter(Boolean);
  assert.equal(classified.length, 3, 'debe encontrar tres interpolaciones pickLang reales');
  assert.equal(classified.filter((item) => item.escaped).length, 0);

  const hrefFixture = 'const html = `<a href="${value || \'#\'}">x</a>`;';
  assert.equal(findDynamicHrefs(hrefFixture, 'fixture.js').length, 1, 'una comilla dentro de ${...} no cierra href');
  assert.equal(findUnsafeBlankTargets('<a target="_blank" rel="noreferrer noopener">', 'fixture.js').unsafe.length, 0);
  assert.equal(findUnsafeBlankTargets('<a target="_blank">', 'fixture.js').unsafe.length, 1);
  console.log('Self-test del inventario: OK');
}

export async function generateInventory() {
  const files = (await collectJsFiles(JS_ROOT)).sort();
  const perFile = [];
  let totalUnescaped = 0;
  let totalEscaped = 0;
  const filesDefiningEsc = [];
  const filesImportingEscapeHtml = [];
  const dynamicHrefs = [];
  const blankTargetTotal = { total: 0, unsafe: [] };
  const dangerousSinks = [];

  for (const filePath of files) {
    const relativePath = path.relative(ROOT, filePath).replace(/\\/g, '/');
    const source = await readFile(filePath, 'utf8');

    if (/\bfunction\s+esc\s*\(|\bconst\s+esc\s*=/.test(source)) filesDefiningEsc.push(relativePath);
    if (/import\s*\{\s*escapeHtml\s+as\s+esc\s*\}\s*from\s*['"]\.\.\/utils\/escape-html\.js['"]/.test(source)) {
      filesImportingEscapeHtml.push(relativePath);
    }

    const interpolations = extractInterpolations(source);
    let fileUnescaped = 0;
    let fileEscaped = 0;
    const interpolationDetails = [];
    for (const current of interpolations) {
      const nestedSpans = interpolations.filter(
        (other) => other !== current && other.start >= current.start && other.end <= current.end,
      );
      const directText = redactNestedSpans(current.expr, current.start, nestedSpans);
      const classification = classifyInterpolation(directText);
      if (!classification) continue;
      interpolationDetails.push({
        line: lineOf(source, current.start),
        escaped: classification.escaped,
        expression: directText.trim().replace(/\s+/g, ' ').slice(0, 240),
      });
      if (classification.escaped) fileEscaped++;
      else fileUnescaped++;
    }
    totalUnescaped += fileUnescaped;
    totalEscaped += fileEscaped;

    // Las utilidades pueden construir marcado seguro como implementación
    // interna; esta métrica describe las plantillas que el sitio renderiza.
    const isRuntimeTemplate = relativePath.startsWith('assets/js/views/')
      || relativePath === 'assets/js/components/header.js';
    if (isRuntimeTemplate) {
      const validatedIds = collectValidatedUrlIdentifiers(source);
      for (const hit of findDynamicHrefs(source, relativePath)) {
        dynamicHrefs.push({ ...hit, schemeValidated: isHrefSchemeValidated(hit.snippet, validatedIds) });
      }

      const blank = findUnsafeBlankTargets(source, relativePath);
      blankTargetTotal.total += blank.total;
      blankTargetTotal.unsafe.push(...blank.unsafe);
    }

    dangerousSinks.push(...findDangerousSinks(source, relativePath));

    if (fileUnescaped || fileEscaped) {
      perFile.push({ file: relativePath, unescaped: fileUnescaped, escaped: fileEscaped, interpolationDetails });
    }
  }

  const viewsDir = path.join(JS_ROOT, 'views');
  const viewFiles = (await readdir(viewsDir)).filter((name) => name.endsWith('.js'));
  const editorialDynamicHrefs = dynamicHrefs.filter((hit) => hit.file.startsWith('assets/js/views/'));
  const nonEditorialDynamicHrefs = dynamicHrefs.filter((hit) => !hit.file.startsWith('assets/js/views/'));

  return {
    scannedFiles: files.length,
    pickLangInterpolations: { unescaped: totalUnescaped, escaped: totalEscaped, perFile },
    viewsTotal: viewFiles.length,
    viewsDefiningEsc: filesDefiningEsc.filter((f) => f.startsWith('assets/js/views/')),
    viewsImportingEscapeHtml: filesImportingEscapeHtml.filter((f) => f.startsWith('assets/js/views/')),
    dynamicHrefs: {
      editorialCount: editorialDynamicHrefs.length,
      editorial: editorialDynamicHrefs,
      editorialSchemeValidated: editorialDynamicHrefs.filter((hit) => hit.schemeValidated).length,
      editorialUnvalidated: editorialDynamicHrefs.filter((hit) => !hit.schemeValidated),
      nonEditorialCount: nonEditorialDynamicHrefs.length,
      nonEditorial: nonEditorialDynamicHrefs,
      total: dynamicHrefs.length,
    },
    blankTargetsWithoutNoopener: blankTargetTotal,
    dangerousSinks,
  };
}

async function main() {
  if (process.argv.includes('--self-test')) {
    runSelfTests();
    return;
  }

  const report = await generateInventory();

  if (process.argv.includes('--json')) {
    console.log(JSON.stringify(report, null, 2));
    return;
  }

  console.log('== Inventario de superficie de render — VAN-0.1 ==');
  console.log(`Ficheros JS escaneados (excluyendo assets/js/lib): ${report.scannedFiles}`);
  console.log(`Interpolaciones pickLang() sin escapar: ${report.pickLangInterpolations.unescaped}`);
  console.log(`Interpolaciones pickLang() con esc(): ${report.pickLangInterpolations.escaped}`);
  console.log(`Vistas con copia local de esc(): ${report.viewsDefiningEsc.length} de ${report.viewsTotal}`);
  console.log(`Vistas que importan escapeHtml como esc: ${report.viewsImportingEscapeHtml.length} de ${report.viewsTotal} (${report.viewsImportingEscapeHtml.join(', ')})`);
  console.log(`href="\${...}" editoriales dinámicos: ${report.dynamicHrefs.editorialCount} (con esquema validado: ${report.dynamicHrefs.editorialSchemeValidated})`);
  for (const hit of report.dynamicHrefs.editorialUnvalidated) console.log(`  - SIN VALIDAR ${hit.file}:${hit.line}`);
  console.log(`href="\${...}" no editoriales: ${report.dynamicHrefs.nonEditorialCount}`);
  console.log(`target="_blank" sin rel="noopener": ${report.blankTargetsWithoutNoopener.unsafe.length} de ${report.blankTargetsWithoutNoopener.total}`);
  console.log(`Sinks peligrosos (eval/new Function/document.write/insertAdjacentHTML/innerHTML=/location.search|hash/URLSearchParams): ${report.dangerousSinks.length}`);
  for (const hit of report.dangerousSinks) console.log(`  - ${hit.file}:${hit.line} ${hit.sink}`);
  console.log('\n-- Detalle por fichero (pickLang) --');
  for (const entry of report.pickLangInterpolations.perFile) {
    console.log(`  ${entry.file}: sin escapar=${entry.unescaped} escapadas=${entry.escaped}`);
  }
}

const invokedPath = process.argv[1] ? pathToFileURL(path.resolve(process.argv[1])).href : null;
if (invokedPath === import.meta.url) {
  main().catch((error) => {
    console.error(`Inventory failed: ${error.message}`);
    process.exitCode = 1;
  });
}
