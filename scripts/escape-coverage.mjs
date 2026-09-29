// CS-22 — Cobertura de escapado: TODA interpolación de las vistas.
//
// El inventario de VAN-0.1 solo mira las interpolaciones que llaman a
// pickLang(), y por eso no veía `${item.title}`. Aquí se clasifica cada
// `${...}` de un literal de plantilla por lo que EMITE (no por su condición):
//
//   escapada   esc(), escAttr(), escapeHtml(), sanitize*Html(), encodeURIComponent()
//   literal    cadena, número o booleano escrito en el código; aritmética
//   fragmento  HTML compuesto por el propio código: una plantilla anidada, un
//              .map(... => `...`).join(''), una función del mismo fichero que
//              devuelve una plantilla, o una variable declarada así. Sus propias
//              interpolaciones se clasifican aparte, así que no escapan al control.
//   dato       todo lo demás. Debe pasar por esc() (sobre un número o un nombre
//              de icono no cambia nada; sobre un texto editorial, evita un XSS).
//
// Los operadores se recorren: en `c ? A : B` se clasifican A y B; en
// `a || b` y `a ?? b`, los dos; en `a && b`, b. Una variable local se sigue
// hasta su declaración (`const x = esc(...)` es escapada), para no pedir
// esc() sobre algo ya escapado: eso lo pintaría dos veces (`&amp;amp;`).
//
// Uso: node scripts/escape-coverage.mjs [--json]

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import {
  collectJsFiles,
  extractInterpolations,
  redactNestedSpans,
  lineOf,
  INVENTORY_JS_ROOT,
  INVENTORY_ROOT,
} from './inventory-render-surface.mjs';

const ESCAPERS = /^(?:esc|escAttr|escapeHtml|sanitizeEditorialHtml|sanitizeLegalHtml|encodeURIComponent)$/;
const BACKSLASH = String.fromCharCode(92);

// Salta una cadena o plantilla que empieza en `i` (comilla incluida) y devuelve
// el índice de su comilla de cierre. Las plantillas pueden llevar ${...} con
// otras plantillas dentro: se recorren con su propia profundidad.
function skipString(text, i) {
  const q = text[i];
  i++;
  while (i < text.length && text[i] !== q) {
    if (text[i] === BACKSLASH) { i += 2; continue; }
    if (q === '`' && text[i] === '$' && text[i + 1] === '{') {
      i += 2;
      let depth = 1;
      while (i < text.length && depth > 0) {
        const c = text[i];
        if (c === "'" || c === '"' || c === '`') { i = skipString(text, i) + 1; continue; }
        if (c === '{') depth++;
        else if (c === '}') depth--;
        i++;
      }
      continue;
    }
    i++;
  }
  return i;
}

// Recorre `text` y llama a onTopLevel(i, c) para cada carácter fuera de
// cadenas, plantillas y paréntesis. Si devuelve false, se detiene.
function scan(text, onTopLevel) {
  let depth = 0;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === "'" || c === '"' || c === '`') { i = skipString(text, i); continue; }
    if (c === '(' || c === '[' || c === '{') { depth++; continue; }
    if (c === ')' || c === ']' || c === '}') { depth--; continue; }
    if (depth === 0 && onTopLevel(i, c) === false) return;
  }
}

function closingParen(text, openIndex) {
  let depth = 0;
  for (let i = openIndex; i < text.length; i++) {
    const c = text[i];
    if (c === "'" || c === '"' || c === '`') { i = skipString(text, i); continue; }
    if (c === '(') depth++;
    else if (c === ')') { depth--; if (depth === 0) return i; }
  }
  return -1;
}

function stripParens(text) {
  let t = text.trim();
  while (t.startsWith('(') && closingParen(t, 0) === t.length - 1) t = t.slice(1, -1).trim();
  return t;
}

const isTernaryMark = (text, i) => text[i] === '?' && text[i + 1] !== '.' && text[i + 1] !== '?' && text[i - 1] !== '?';

function splitTernary(text) {
  let q = -1;
  scan(text, (i) => { if (isTernaryMark(text, i)) { q = i; return false; } return true; });
  if (q < 0) return null;
  let nested = 0;
  let colon = -1;
  const rest = text.slice(q + 1);
  scan(rest, (i, c) => {
    if (isTernaryMark(rest, i)) nested++;
    else if (c === ':') { if (nested === 0) { colon = q + 1 + i; return false; } nested--; }
    return true;
  });
  if (colon < 0) return null;
  return [text.slice(q + 1, colon), text.slice(colon + 1)];
}

function splitBinary(text, op) {
  const parts = [];
  let last = 0;
  scan(text, (i) => {
    if (text.startsWith(op, i)) { parts.push(text.slice(last, i)); last = i + op.length; }
    return true;
  });
  if (!parts.length) return null;
  parts.push(text.slice(last));
  return parts;
}

// ── Contexto por fichero: declaraciones locales y funciones que devuelven HTML ──

function declarationEnd(source, start) {
  let depth = 0;
  let end = start;
  for (; end < source.length; end++) {
    const c = source[end];
    if (c === "'" || c === '"' || c === '`') { end = skipString(source, end); continue; }
    if ('([{'.includes(c)) depth++;
    else if (')]}'.includes(c)) { if (depth === 0) break; depth--; }
    else if ((c === ';' || c === ',') && depth === 0) break;
    else if (c === '\n' && depth === 0 && !/[=+\-*/?:|&,(]\s*$/.test(source.slice(start, end))) {
      // Una línea que continúa con un operador sigue siendo la misma expresión.
      const next = source.slice(end + 1).match(/^\s*(\S)/);
      if (!next || !'?:|&+.'.includes(next[1])) break;
    }
  }
  return end;
}

export function fileContext(source) {
  // Toda asignación cuenta, no solo la declaración: `let x = ''` seguido de
  // `x += dato` emite ese dato, y `x = otroValor` más abajo también.
  const declarations = new Map();
  const assignment = /(?:\b(?:const|let|var)\s+|(?<![\w$.]))([A-Za-z_$][\w$]*)\s*(\+?=)(?![=>])\s*/g;
  for (const m of source.matchAll(assignment)) {
    const start = m.index + m[0].length;
    const expr = source.slice(start, declarationEnd(source, start)).trim();
    if (!declarations.has(m[1])) declarations.set(m[1], []);
    declarations.get(m[1]).push(expr);
  }
  const producers = new Set();
  for (const m of source.matchAll(/\bfunction\s+([A-Za-z_$][\w$]*)\s*\([^)]*\)\s*\{/g)) {
    const open = m.index + m[0].length - 1;
    let depth = 0;
    let k = open;
    for (; k < source.length; k++) {
      const c = source[k];
      if (c === "'" || c === '"' || c === '`') { k = skipString(source, k); continue; }
      if (c === '{') depth++;
      else if (c === '}') { depth--; if (depth === 0) break; }
    }
    const body = source.slice(open, k);
    const returns = [];
    for (const r of body.matchAll(/\breturn\s+/g)) {
      const start = r.index + r[0].length;
      returns.push(body.slice(start, declarationEnd(body, start)).trim());
    }
    if (returns.length) producers.add({ name: m[1], returns });
  }
  // Funciones flecha asignadas a una constante: `const f = (x) => ...`.
  for (const [name, exprs] of declarations) {
    if (exprs.length === 1) {
      const arrow = exprs[0].match(/^(?:\([^)]*\)|[A-Za-z_$][\w$]*)\s*=>\s*/);
      if (arrow) producers.add({ name, returns: [exprs[0].slice(arrow[0].length)] });
    }
  }
  // Una función produce HTML si TODO lo que devuelve es fragmento, literal o
  // escapado. Punto fijo MÁXIMO: se parte de suponer que todas producen HTML y
  // se descartan las que devuelven un dato, hasta que nada cambia. Así una
  // función recursiva (renderBadge dentro de su propio .map) se resuelve bien.
  const ctx = { declarations, producers: new Set([...producers].map((p) => p.name)), pending: producers };
  let changed = true;
  while (changed) {
    changed = false;
    for (const p of producers) {
      if (!ctx.producers.has(p.name)) continue;
      if (p.returns.some((r) => classifyEmission(r, ctx) === 'dato')) { ctx.producers.delete(p.name); changed = true; }
    }
  }
  return ctx;
}

// ── Clasificación de lo que se emite ──

const RANK = { escapada: 0, literal: 0, fragmento: 0, dato: 1 };
const worst = (kinds) => kinds.reduce((a, b) => (RANK[b] > RANK[a] ? b : a), 'literal');

export function classifyEmission(text, ctx = { declarations: new Map(), producers: new Set() }, seen = new Set()) {
  const t = stripParens(text);
  if (!t) return 'literal';

  const tern = splitTernary(t);
  if (tern) return worst(tern.map((part) => classifyEmission(part, ctx, seen)));
  for (const op of ['||', '??']) {
    const parts = splitBinary(t, op);
    if (parts) return worst(parts.map((p) => classifyEmission(p, ctx, seen)));
  }
  const and = splitBinary(t, '&&');
  if (and) return classifyEmission(and[and.length - 1], ctx, seen);

  const call = t.match(/^([A-Za-z_$][\w$]*)\s*\(/);
  if (call && closingParen(t, call[0].length - 1) === t.length - 1) {
    if (ESCAPERS.test(call[1])) return 'escapada';
    if (ctx.producers.has(call[1])) return 'fragmento';
    return 'dato';
  }
  if (t[0] === "'" || t[0] === '"') return skipString(t, 0) === t.length - 1 ? 'literal' : 'dato';
  if (t[0] === '`' && skipString(t, 0) === t.length - 1) return 'fragmento';
  if (/^(?:true|false|null|undefined|-?\d+(?:\.\d+)?)$/.test(t)) return 'literal';
  // lista.map(x => EXPR).join('') emite lo que emita EXPR para cada elemento.
  const joined = t.match(/\.join\s*\(\s*(?:''|""|``)\s*\)$/);
  const mapAt = t.lastIndexOf('.map(');
  if (joined && mapAt > 0) {
    const close = closingParen(t, mapAt + 4);
    const callback = t.slice(mapAt + 5, close);
    const arrow = callback.match(/^\s*(?:\([^)]*\)|[A-Za-z_$][\w$]*)\s*=>\s*/);
    if (arrow) {
      let body = callback.slice(arrow[0].length).trim();
      if (body.startsWith('{')) {
        const rets = [...body.matchAll(/\breturn\s+/g)].map((r) => body.slice(r.index + r[0].length, declarationEnd(body, r.index + r[0].length)).trim());
        return rets.length ? worst(rets.map((r) => classifyEmission(r, ctx, seen))) : 'dato';
      }
      return classifyEmission(body, ctx, seen);
    }
    return 'dato';
  }
  // Aritmética: identificadores, números, .length y operadores, con algún número o .length
  const sinLength = t.replace(/\.length\b/g, '');
  if (/^[\w$.\s+\-*/%()]+$/.test(t) && (/\d/.test(t) || /\.length\b/.test(t)) && !/\./.test(sinLength.replace(/\d\.\d/g, ''))) return 'literal';

  if (/^[A-Za-z_$][\w$]*$/.test(t)) {
    const exprs = ctx.declarations.get(t);
    if (exprs && !seen.has(t)) {
      const inner = new Set(seen).add(t);
      return worst(exprs.map((e) => classifyEmission(e, ctx, inner)));
    }
    return 'dato';
  }
  return 'dato';
}

// ── Informe ──

// El texto propio de la plantilla (sin sus interpolaciones) contiene una
// etiqueta o un comentario HTML.
export function isMarkupTemplate(source, interpolation) {
  const template = source.slice(interpolation.templateStart, interpolation.templateEnd);
  let literal = '';
  for (let i = 0; i < template.length; i++) {
    if (template[i] === '$' && template[i + 1] === '{') {
      let depth = 1;
      i += 2;
      while (i < template.length && depth > 0) {
        const c = template[i];
        if (c === "'" || c === '"' || c === '`') { i = skipString(template, i) + 1; continue; }
        if (c === '{') depth++;
        else if (c === '}') depth--;
        i++;
      }
      i--;
      continue;
    }
    literal += template[i];
  }
  return /<[a-zA-Z!/]/.test(literal);
}

export async function generateEscapeCoverage() {
  const files = (await collectJsFiles(INVENTORY_JS_ROOT)).sort();
  const unescaped = [];
  const counts = { escapada: 0, literal: 0, fragmento: 0, dato: 0 };
  for (const file of files) {
    const rel = path.relative(INVENTORY_ROOT, file).split(path.sep).join('/');
    const source = await readFile(file, 'utf8');
    const ctx = fileContext(source);
    const all = extractInterpolations(source);
    for (const cur of all) {
      // Solo plantillas que construyen marcado. Una ruta (`#${lang}/${slug}`),
      // una clave de almacenamiento o un selector no son HTML: escaparlos no
      // protege nada y cambiaría su valor.
      // Una plantilla anidada dentro de otra que es marcado también lo es.
      const inMarkup = isMarkupTemplate(source, cur) || all.some((outer) =>
        outer !== cur && outer.start <= cur.templateStart && cur.templateEnd <= outer.end && isMarkupTemplate(source, outer));
      if (!inMarkup) continue;
      const nested = all.filter((o) => o !== cur && o.start >= cur.start && o.end <= cur.end);
      const direct = redactNestedSpans(cur.expr, cur.start, nested);
      const kind = classifyEmission(direct, ctx);
      counts[kind]++;
      if (kind === 'dato') unescaped.push(`${rel}:${lineOf(source, cur.start)}: ${direct.trim().replace(/\s+/g, ' ').slice(0, 100)}`);
    }
  }
  return { counts, unescaped };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const report = await generateEscapeCoverage();
  if (process.argv.includes('--json')) console.log(JSON.stringify(report, null, 2));
  else {
    console.log(report.counts);
    for (const line of report.unescaped) console.log(line);
  }
}
