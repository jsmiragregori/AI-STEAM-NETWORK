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

function splitTopLevel(text, sep) {
  const parts = [];
  let last = 0;
  scan(text, (i, c) => { if (c === sep) { parts.push(text.slice(last, i)); last = i + 1; } return true; });
  parts.push(text.slice(last));
  return parts;
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
  // `x += dato` emite ese dato. Solo en código: `aria-disabled="true"` dentro de
  // una plantilla no es una asignación. Se guarda la posición para resolver cada
  // uso con la declaración más cercana anterior (dos funciones pueden reutilizar
  // el mismo nombre para cosas distintas).
  const code = codeMask(source);
  const declarations = new Map();
  const assignment = /(?:\b(?:const|let|var)\s+|(?<![\w$.\-]))([A-Za-z_$][\w$]*)\s*(\+?=)(?![=>])\s*/g;
  for (const m of source.matchAll(assignment)) {
    if (!code[m.index]) continue;
    const start = m.index + m[0].length;
    const expr = source.slice(start, declarationEnd(source, start)).trim();
    const declares = /^(?:const|let|var)\b/.test(m[0]);
    if (!declarations.has(m[1])) declarations.set(m[1], []);
    declarations.get(m[1]).push({ pos: m.index, expr, append: m[2] === '+=', declares });
  }
  const producers = new Set();
  for (const m of source.matchAll(/\bfunction\s+([A-Za-z_$][\w$]*)\s*\([^)]*\)\s*\{/g)) {
    if (!code[m.index]) continue;
    const open = m.index + m[0].length - 1;
    const returns = ownReturns(source, open, code);
    if (returns.length) producers.add({ name: m[1], returns });
  }
  // Funciones flecha asignadas a una constante: `const f = (x) => expr` o
  // `const f = (x) => { ... return ...; }`.
  for (const [name, entries] of declarations) {
    if (entries.length !== 1) continue;
    const { pos, expr } = entries[0];
    const arrow = expr.match(/^(?:\([^)]*\)|[A-Za-z_$][\w$]*)\s*=>\s*/);
    if (!arrow) continue;
    const bodyAt = source.indexOf(expr, pos) + arrow[0].length;
    if (source[bodyAt] === '{') {
      const returns = ownReturns(source, bodyAt, code);
      if (returns.length) producers.add({ name, returns });
    } else {
      producers.add({ name, returns: [{ pos, expr: expr.slice(arrow[0].length) }] });
    }
  }
  // Una función produce HTML si TODO lo que devuelve es fragmento, literal o
  // escapado. Punto fijo MÁXIMO: se parte de suponer que todas producen HTML y
  // se descartan las que devuelven un dato, hasta que nada cambia. Así una
  // función recursiva (renderBadge dentro de su propio .map) se resuelve bien.
  // Funciones con nombre y sus parámetros, para resolver un parámetro mirando
  // qué le pasan las llamadas del fichero.
  const functions = [];
  for (const m of source.matchAll(/\bfunction\s+([A-Za-z_$][\w$]*)\s*\(([^)]*)\)\s*\{/g)) {
    if (!code[m.index]) continue;
    const open = m.index + m[0].length - 1;
    functions.push({ name: m[1], params: paramNames(m[2]), start: open, end: blockEnd(source, open) });
  }
  const ctx = { source, code, functions, declarations, producers: new Set([...producers].map((p) => p.name)), pending: producers };
  let changed = true;
  while (changed) {
    changed = false;
    for (const p of producers) {
      if (!ctx.producers.has(p.name)) continue;
      if (p.returns.some((r) => classifyEmission(r.expr, { ...ctx, at: r.pos }) === 'dato')) { ctx.producers.delete(p.name); changed = true; }
    }
  }
  return ctx;
}

function blockEnd(source, open) {
  let depth = 0;
  for (let k = open; k < source.length; k++) {
    const c = source[k];
    if (c === "'" || c === '"' || c === '`') { k = skipString(source, k); continue; }
    if (c === '{') depth++;
    else if (c === '}') { depth--; if (depth === 0) return k; }
  }
  return source.length;
}

// Nombres de los parámetros: `a, b = 1, { x } = {}` → ['a', 'b', null].
function paramNames(list) {
  return splitTopLevel(list, ',').map((p) => {
    const m = p.trim().match(/^([A-Za-z_$][\w$]*)/);
    return m ? m[1] : null;
  });
}

// Posición absoluta de un trozo de texto que forma parte de la expresión en `ctx.at`.
function locate(ctx, snippet) {
  if (!ctx.source) return -1;
  // El trozo puede estar antes del uso (en una declaración) o después (dentro
  // de la propia expresión): la aparición más cercana a `at`.
  const at = ctx.at ?? 0;
  let best = -1;
  for (let k = ctx.source.indexOf(snippet); k >= 0; k = ctx.source.indexOf(snippet, k + 1)) {
    if (best < 0 || Math.abs(k - at) < Math.abs(best - at)) best = k;
  }
  return best;
}

// Un parámetro: lo que le pasen TODAS las llamadas del fichero en su posición.
function classifyParam(name, ctx, seen) {
  if (!ctx.functions || ctx.at === undefined) return null;
  const fn = ctx.functions
    .filter((f) => f.start < ctx.at && ctx.at < f.end)
    .sort((a, b) => b.start - a.start)[0];
  if (!fn) return null;
  const index = fn.params.indexOf(name);
  if (index < 0) return null;
  const key = `${fn.name}#${index}`;
  if (seen.has(key)) return 'literal'; // recursión: lo decide el resto de llamadas
  const inner = new Set(seen).add(key);
  const kinds = [];
  for (const m of ctx.source.matchAll(new RegExp(`(?<![\\w$.])${fn.name}\\s*\\(`, 'g'))) {
    if (!ctx.code[m.index]) continue;
    if (/function\s+$/.test(ctx.source.slice(Math.max(0, m.index - 12), m.index))) continue;
    const open = m.index + m[0].length - 1;
    const args = splitTopLevel(ctx.source.slice(open + 1, closingParen(ctx.source, open)), ',');
    const arg = (args[index] || '').trim();
    if (!arg) { kinds.push('literal'); continue; }
    kinds.push(classifyEmission(arg, { ...ctx, at: m.index }, inner));
  }
  return kinds.length ? worst(kinds) : null;
}

// objeto.propHtml: lo que valga esa propiedad en TODOS los objetos del fichero.
function classifyHtmlProperty(prop, ctx, seen) {
  if (!ctx.source) return null;
  const key = `.${prop}`;
  if (seen.has(key)) return 'literal';
  const inner = new Set(seen).add(key);
  const kinds = [];
  for (const m of ctx.source.matchAll(new RegExp(`(?<![\\w$.])${prop}\\s*:\\s*`, 'g'))) {
    if (!ctx.code[m.index]) continue;
    const start = m.index + m[0].length;
    const value = ctx.source.slice(start, declarationEnd(ctx.source, start)).trim();
    kinds.push(classifyEmission(value, { ...ctx, at: start }, inner));
  }
  return kinds.length ? worst(kinds) : null;
}

// Lo que devuelve un cuerpo de función en línea (callback o IIFE), con cada
// return resuelto en su propia posición.
function classifyBlock(blockText, ctx, seen) {
  const abs = locate(ctx, blockText);
  if (abs >= 0) {
    const returns = ownReturns(ctx.source, abs, ctx.code);
    if (!returns.length) return dato(blockText, ctx);
    return worst(returns.map((r) => classifyEmission(r.expr, { ...ctx, at: r.pos }, seen)));
  }
  // Dentro de una interpolación el texto llega redactado (las plantillas
  // anidadas en blanco) y no está tal cual en el fuente: se analiza el propio
  // texto. Sus plantillas anidadas se clasifican aparte, como interpolaciones.
  const returns = ownReturns(blockText, 0, codeMask(blockText));
  if (!returns.length) return dato(blockText, ctx);
  return worst(returns.map((r) => classifyEmission(r.expr, ctx, seen)));
}

// Los `return` de un cuerpo `{...}` que empieza en `open`, SIN los de las
// funciones anidadas (un `.filter(x => { return ... })` no es lo que devuelve
// la función de fuera).
function ownReturns(source, open, code) {
  let depth = 0;
  let end = open;
  for (; end < source.length; end++) {
    const c = source[end];
    if (c === "'" || c === '"' || c === '`') { end = skipString(source, end); continue; }
    if (c === '{') depth++;
    else if (c === '}') { depth--; if (depth === 0) break; }
  }
  // Rangos de las funciones anidadas: `=> {` y `function (...) {`.
  const nested = [];
  const re = /=>\s*\{|\bfunction\b[^{(]*\([^)]*\)\s*\{/g;
  re.lastIndex = open + 1;
  let m;
  while ((m = re.exec(source)) && m.index < end) {
    if (!code[m.index]) continue;
    const start = m.index + m[0].length - 1;
    let d = 0;
    let k = start;
    for (; k < end; k++) {
      const c = source[k];
      if (c === "'" || c === '"' || c === '`') { k = skipString(source, k); continue; }
      if (c === '{') d++;
      else if (c === '}') { d--; if (d === 0) break; }
    }
    nested.push([start, k]);
  }
  const returns = [];
  const body = source.slice(0, end);
  const rr = /\breturn\s+/g;
  rr.lastIndex = open;
  let r;
  while ((r = rr.exec(body))) {
    if (!code[r.index]) continue;
    if (nested.some(([a, b]) => r.index > a && r.index < b)) continue;
    const start = r.index + r[0].length;
    returns.push({ pos: r.index, expr: source.slice(start, declarationEnd(source, start)).trim() });
  }
  return returns;
}

// Marca qué posiciones del fichero son código (true) y cuáles texto de una
// cadena o de una plantilla (false). Dentro de ${...} vuelve a ser código.
export function codeMask(source) {
  const mask = new Array(source.length).fill(true);
  let i = 0;
  function template() {
    mask[i] = false; i++; // backtick
    while (i < source.length && source[i] !== '`') {
      if (source[i] === BACKSLASH) { mask[i] = false; mask[i + 1] = false; i += 2; continue; }
      if (source[i] === '$' && source[i + 1] === '{') { i += 2; code(1); continue; }
      mask[i] = false; i++;
    }
    mask[i] = false; i++;
  }
  function quoted() {
    const q = source[i];
    mask[i] = false; i++;
    while (i < source.length && source[i] !== q && source[i] !== '\n') {
      if (source[i] === BACKSLASH) { mask[i] = false; i++; }
      mask[i] = false; i++;
    }
    mask[i] = false; i++;
  }
  function code(depth) {
    while (i < source.length) {
      const c = source[i];
      if (c === '/' && source[i + 1] === '/') { while (i < source.length && source[i] !== '\n') { mask[i] = false; i++; } continue; }
      if (c === '/' && source[i + 1] === '*') { while (i < source.length && !(source[i] === '*' && source[i + 1] === '/')) { mask[i] = false; i++; } i += 2; continue; }
      if (c === '`') { template(); continue; }
      if (c === "'" || c === '"') { quoted(); continue; }
      if (c === '{') depth++;
      if (c === '}') { depth--; if (depth === 0) { i++; return; } }
      i++;
    }
  }
  code(Infinity);
  return mask;
}

// Asignaciones que valen en la posición `at`: la última declaración anterior
// y los `x = ` / `x += ` que la siguen hasta `at`. Sin posición (pruebas
// unitarias), todas.
function resolve(ctx, name, at) {
  const entries = ctx.declarations.get(name);
  if (!entries) return null;
  if (at === undefined) return entries.map((e) => e.expr);
  const before = entries.filter((e) => e.pos < at);
  if (!before.length) return null;
  let from = before.length - 1;
  while (from > 0 && !before[from].declares) from--;
  return before.slice(from).map((e) => e.expr);
}

// ── Clasificación de lo que se emite ──

// Hoja que hace que algo sea dato; con ctx.trace, se anota (para revisar a mano).
const dato = (t, ctx) => { if (ctx.trace) ctx.trace.push(t); return 'dato'; };

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

  // lista.join('') de un array local: emite lo que se le metió, en su
  // inicializador `[...]` y en cada `lista.push(...)` anterior al uso.
  const arrayJoin = t.match(/^([A-Za-z_$][\w$]*)(?:\.(?:slice|filter)\([^()]*\))*\.join\s*\(\s*(?:''|""|``)\s*\)$/);
  if (arrayJoin && ctx.source) {
    const name = arrayJoin[1];
    const inits = resolve(ctx, name, ctx.at) || [];
    // Un array creado con .map(...) emite lo que emite su callback.
    if (inits.length && inits.every((e) => /\.map\s*\(/.test(e) && e.endsWith(')'))) {
      return worst(inits.map((e) => classifyEmission(`${e}.join('')`, ctx, seen)));
    }
    // `[...].filter(Boolean)`: el filtro quita elementos, no los cambia.
    for (let n = 0; n < inits.length; n++) {
      const lit = inits[n].match(/^(\[[\s\S]*\])(?:\s*\.filter\([^()]*\))+$/);
      if (lit) inits[n] = lit[1];
    }
    const pushed = [];
    for (const m of ctx.source.matchAll(new RegExp(`\\b${name}\\.push\\(`, 'g'))) {
      if (ctx.at !== undefined && m.index > ctx.at) continue;
      const open = m.index + m[0].length - 1;
      pushed.push(ctx.source.slice(open + 1, closingParen(ctx.source, open)));
    }
    const elements = inits.flatMap((e) => (/^\[\s*\]$/.test(e) ? [] : splitTopLevel(e.slice(1, -1), ',').filter((x) => x.trim())));
    if (!inits.every((e) => e.startsWith('['))) return dato(t, ctx);
    return worst([...elements, ...pushed].map((e) => classifyEmission(e, ctx, seen)).concat('literal'));
  }

  // mapa[clave] de un objeto local `{ a: X, b: Y }`: emite alguno de sus valores.
  const indexed = t.match(/^([A-Za-z_$][\w$]*)\s*\[[^\]]*\]$/);
  if (indexed) {
    const inits = resolve(ctx, indexed[1], ctx.at);
    // Un elemento de un array local: lo que emitan sus elementos.
    if (inits && inits.length && inits.every((e) => (/\.map\s*\(/.test(e) && e.endsWith(')')) || e.startsWith('['))) {
      return classifyEmission(`${indexed[1]}.join('')`, ctx, seen);
    }
    if (inits && inits.length === 1 && inits[0].startsWith('{')) {
      const values = [];
      scan(inits[0].slice(1, -1), () => true);
      for (const entry of splitTopLevel(inits[0].slice(1, -1), ',')) {
        const colon = entry.indexOf(':');
        if (entry.trim()) values.push(colon >= 0 ? entry.slice(colon + 1) : entry);
      }
      return worst(values.map((v) => classifyEmission(v, ctx, seen)));
    }
  }

  const call = t.match(/^([A-Za-z_$][\w$]*)\s*\(/);
  if (call && closingParen(t, call[0].length - 1) === t.length - 1) {
    if (ESCAPERS.test(call[1])) return 'escapada';
    if (ctx.producers.has(call[1])) return 'fragmento';
    return dato(t, ctx);
  }
  if (t[0] === "'" || t[0] === '"') return skipString(t, 0) === t.length - 1 ? 'literal' : 'dato';
  if (t[0] === '`' && skipString(t, 0) === t.length - 1) return 'fragmento';
  if (/^(?:true|false|null|undefined|-?\d+(?:\.\d+)?)$/.test(t)) return 'literal';
  // esc(x).replace(/…/g, '<strong>$1</strong>')…: escapa primero y solo inserta
  // marcado escrito en el código (las capturas $1 son del texto ya escapado).
  const escChain = t.match(/^([A-Za-z_$][\w$]*)\s*\(/);
  if (escChain && ESCAPERS.test(escChain[1])) {
    let rest = t.slice(closingParen(t, escChain[0].length - 1) + 1).trim();
    let ok = rest.length > 0;
    while (ok && rest) {
      const rep = rest.match(/^\.replace(?:All)?\s*\(/);
      if (!rep) { ok = false; break; }
      const close = closingParen(rest, rep[0].length - 1);
      const args = splitTopLevel(rest.slice(rep[0].length, close), ',');
      const replacement = (args[1] || '').trim();
      if (!/^'(?:[^'\\]|\\.)*'$|^"(?:[^"\\]|\\.)*"$/.test(replacement)) { ok = false; break; }
      rest = rest.slice(close + 1).trim();
    }
    if (ok) return 'escapada';
  }

  // lista.map(x => EXPR).join(sep) emite lo que emita EXPR para cada elemento;
  // el separador es un literal del código.
  const joined = t.match(/\.join\s*\(\s*(?:'[^'<]*'|"[^"<]*"|`[^`$<]*`)\s*\)$/);
  // El .map que llega hasta ese .join (no uno anidado en su callback); entre
  // los dos solo puede haber .filter(...), que quita elementos pero no los cambia.
  let mapAt = -1;
  if (joined) {
    const joinAt = t.length - joined[0].length;
    for (let k = t.indexOf('.map('); k >= 0; k = t.indexOf('.map(', k + 1)) {
      const close = closingParen(t, k + 4);
      if (close > 0 && /^(?:\.filter\([^()]*\))*$/.test(t.slice(close + 1, joinAt))) { mapAt = k; break; }
    }
  }
  if (joined && mapAt > 0) {
    const close = closingParen(t, mapAt + 4);
    const callback = t.slice(mapAt + 5, close);
    const arrow = callback.match(/^\s*(?:\([^)]*\)|[A-Za-z_$][\w$]*)\s*=>\s*/);
    if (arrow) {
      const body = callback.slice(arrow[0].length).trim();
      if (body.startsWith('{')) return classifyBlock(body, ctx, seen);
      return classifyEmission(body, ctx, seen);
    }
    return dato(t, ctx);
  }

  // (() => { ...; return `...`; })(): lo que devuelve la función en línea.
  const iife = t.match(/^\(\s*\(\s*\)\s*=>\s*\{/);
  if (iife && /\}\s*\)\s*\(\s*\)$/.test(t)) {
    return classifyBlock(t.slice(iife[0].length - 1, t.lastIndexOf('}') + 1), ctx, seen);
  }

  // objeto.algoHtml: una propiedad que transporta HTML; se mira qué le asigna
  // cada objeto del fichero.
  const htmlProp = t.match(/^[A-Za-z_$][\w$]*(?:\?\.|\.)((?:[A-Za-z_$][\w$]*)?[hH]tml[\w$]*)$/);
  if (htmlProp) {
    const kind = classifyHtmlProperty(htmlProp[1], ctx, seen);
    if (kind) return kind === 'dato' ? dato(t, ctx) : kind;
  }
  // Aritmética: identificadores, números, .length y operadores, con algún número o .length
  const sinLength = t.replace(/\.length\b/g, '');
  if (/^[\w$.\s+\-*/%()]+$/.test(t) && (/\d/.test(t) || /\.length\b/.test(t)) && !/\./.test(sinLength.replace(/\d\.\d/g, ''))) return 'literal';

  if (/^[A-Za-z_$][\w$]*$/.test(t)) {
    const exprs = resolve(ctx, t, ctx.at);
    if (exprs && !seen.has(t)) {
      const inner = new Set(seen).add(t);
      return worst(exprs.map((e) => classifyEmission(e, ctx, inner)));
    }
    // Sin asignación antes del uso: si es un parámetro, lo que le pasen las llamadas.
    const param = classifyParam(t, ctx, seen);
    if (param) return param === 'dato' ? dato(t, ctx) : param;
    return dato(t, ctx);
  }
  return dato(t, ctx);
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
      // Una plantilla que es argumento de esc() se escapa entera: su contenido es texto.
      const insideEscaper = all.some((outer) =>
        outer !== cur && outer.start <= cur.templateStart && cur.templateEnd <= outer.end
        && /^\s*(?:esc|escAttr|escapeHtml)\s*\(/.test(outer.expr));
      if (insideEscaper) continue;
      const nested = all.filter((o) => o !== cur && o.start >= cur.start && o.end <= cur.end);
      const direct = redactNestedSpans(cur.expr, cur.start, nested);
      const kind = classifyEmission(direct, { ...ctx, at: cur.start });
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
