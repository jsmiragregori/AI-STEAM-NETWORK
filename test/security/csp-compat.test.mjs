import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

// CS-18 — el sitio debe funcionar con la CSP forzada que aplicará Sistemas:
//   default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';
//   img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none';
//   base-uri 'self'; form-action 'self'; frame-ancestors 'none'
//
// `script-src 'self'` sin 'unsafe-inline' ni 'unsafe-eval' bloquea en silencio
// —sin error visible, solo en la consola— los manejadores en línea
// (`onclick=`…), las URL `javascript:`, `eval`, `new Function`, los temporizadores
// con texto y los <script> sin `src`. Esta guarda impide que vuelvan.
// Los atributos `style=` sí se admiten: la política lleva 'unsafe-inline' en estilos.

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const JS_ROOT = path.join(ROOT, 'assets/js');
// Bibliotecas de terceros vendorizadas: se ratifican aparte (verify:vendor).
const THIRD_PARTY = path.join(JS_ROOT, 'lib');

const RULES = [
  { id: 'manejador en línea', re: /\son[a-z]+\s*=\s*["'`]/gi },
  { id: 'URL javascript:', re: /javascript:/gi },
  { id: 'eval', re: /(^|[^\w.$])eval\s*\(/g },
  { id: 'new Function', re: /new\s+Function\s*\(/g },
  { id: 'temporizador con texto', re: /set(?:Timeout|Interval)\s*\(\s*["'`]/g },
];

export function findCspViolations(source, file) {
  const hits = [];
  for (const { id, re } of RULES) {
    for (const match of source.matchAll(re)) {
      const line = source.slice(0, match.index).split('\n').length;
      hits.push(`${file}:${line}: ${id}`);
    }
  }
  return hits;
}

export function findInlineScripts(html, file) {
  const hits = [];
  for (const match of html.matchAll(/<script\b([^>]*)>/gi)) {
    if (!/\bsrc\s*=/.test(match[1]) && !/type\s*=\s*["']application\/(ld\+)?json["']/i.test(match[1])) {
      const line = html.slice(0, match.index).split('\n').length;
      hits.push(`${file}:${line}: <script> en línea`);
    }
  }
  return hits;
}

async function ownScripts(dir = JS_ROOT) {
  const files = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (full === THIRD_PARTY) continue;
    if (entry.isDirectory()) files.push(...(await ownScripts(full)));
    else if (entry.name.endsWith('.js') || entry.name.endsWith('.mjs')) files.push(full);
  }
  return files;
}

test('el código propio no usa nada que la CSP forzada bloquee', async () => {
  const files = await ownScripts();
  assert.ok(files.length > 20, 'el recorrido no encuentra los scripts del sitio');
  const hits = [];
  for (const file of files) {
    hits.push(...findCspViolations(await readFile(file, 'utf8'), path.relative(ROOT, file)));
  }
  assert.deepEqual(hits, []);
});

test('index.html no lleva scripts ni manejadores en línea', async () => {
  const html = await readFile(path.join(ROOT, 'index.html'), 'utf8');
  assert.deepEqual([...findInlineScripts(html, 'index.html'), ...findCspViolations(html, 'index.html')], []);
});

// Si el detector se vuelve permisivo, las dos pruebas de arriba seguirían en
// verde sin proteger nada. Estas comprueban que sabe fallar.

test('el detector ve cada forma bloqueada', () => {
  const casos = [
    '<button onmouseover="x()">',
    "`<a onclick='go()'>`",
    '<a href="javascript:void(0)">',
    'eval(texto)',
    'const f = new Function("a", "return a")',
    'setTimeout("paso()", 10)',
  ];
  for (const caso of casos) assert.equal(findCspViolations(caso, 'f.js').length, 1, caso);
});

test('el detector no confunde nombres parecidos', () => {
  const limpios = [
    'loopingFunction(loop, 10)',
    'element.addEventListener("mouseover", onEnter)',
    'retrieval(x); obj.evaluate(y)',
    'setTimeout(() => paso(), 10)',
    'const data = { onboarding: true }',
  ];
  for (const caso of limpios) assert.deepEqual(findCspViolations(caso, 'f.js'), [], caso);
});

test('el detector de index.html distingue scripts externos y en línea', () => {
  assert.equal(findInlineScripts('<script>alert(1)</script>', 'i.html').length, 1);
  assert.deepEqual(findInlineScripts('<script type="module" src="./a.js"></script>', 'i.html'), []);
});
