import assert from 'node:assert/strict';
import test from 'node:test';

import { VIEWS } from '../../assets/js/router.js';
import {
  MAX_HASH_LENGTH,
  VIEW_SLUGS,
  formatViewRoute,
  parseViewRoute,
} from '../../assets/js/utils/view-route.js';

// Tabla de §3.1 del PLAN_DEEPLINK_VANILLA_2026-09-04, aprobada y congelada por
// Salva el 2026-09-07. Se replica aquí a mano, a propósito: si alguien edita la
// del módulo, esta prueba lo detecta. No importar la del módulo para compararla
// consigo misma.
const SLUGS = {
  'inicio':       { es: 'inicio',                en: 'home',                  va: 'inici' },
  'red':          { es: 'la-red',                en: 'network',               va: 'la-xarxa' },
  'sectores':     { es: 'sectores',              en: 'sectors',               va: 'sectors' },
  'banco-retos':  { es: 'comunidad-de-practica', en: 'community-of-practice', va: 'comunitat-de-practica' },
  'formacion':    { es: 'formacion',             en: 'training',              va: 'formacio' },
  'conocimiento': { es: 'conocimiento',          en: 'knowledge',             va: 'coneixement' },
  'gobernanza':   { es: 'gobernanza',            en: 'governance',            va: 'governanca' },
};

const LANGS = ['es', 'en', 'va'];

// TDD-1
test('TDD-1: reconoce los identificadores internos de las siete vistas', () => {
  for (const view of VIEWS) {
    assert.deepEqual(parseViewRoute(`#${view}`), { view }, view);
  }
});

// TDD-2
test('TDD-2: la ausencia de hash no es un error, es "sin ruta"', () => {
  for (const value of ['', '#', '   ', undefined, null]) {
    assert.equal(parseViewRoute(value), null, String(value));
  }
});

// TDD-3 (T5)
test('TDD-3: una vista inexistente falla cerrado, sin modo permisivo', () => {
  for (const value of ['#administracion', '#admin', '#noticias', '#news', '#marketplace']) {
    assert.equal(parseViewRoute(value), null, value);
  }
});

// TDD-4 (T3)
test('TDD-4: esquemas activos y redirecciones abiertas no resuelven a ninguna vista', () => {
  for (const value of [
    '#javascript:alert(1)',
    '#//evil.example',
    '#https://evil.example',
    '#http://evil.example/sectores',
    '#data:text/html,<script>',
    '#es//evil.example',
  ]) {
    assert.equal(parseViewRoute(value), null, value);
  }
});

// TDD-5 (T2)
test('TDD-5: los nombres heredados de Object no son vistas y el prototipo queda intacto', () => {
  const canary = Object.prototype.toString;
  for (const value of ['#__proto__', '#constructor', '#prototype', '#toString', '#hasOwnProperty',
                       '#es/__proto__', '#__proto__/sectores']) {
    assert.equal(parseViewRoute(value), null, value);
  }
  assert.equal(Object.prototype.toString, canary);
  assert.equal(Object.prototype.polluted, undefined);
  assert.equal({}.polluted, undefined);
});

// TDD-6 (T4)
test('TDD-6: recorridos, nulos y codificación no abren camino a una vista', () => {
  for (const value of [
    '#sectores/../red',
    '#../sectores',
    '#sectores%00',
    '#%3Cscript%3E',
    '#sect%6Fres',      // sobra la codificación: la comparación es exacta
    '#%2573ectores',    // sobre-codificación
    '#es/sectores%20',
    '#es%2Fsectores',   // la barra codificada no equivale a la barra
    '#%',               // decodeURIComponent lanzaría: debe capturarse
    '#%E0%A4%A',
  ]) {
    assert.equal(parseViewRoute(value), null, value);
  }
});

// TDD-7 (T1)
test('TDD-7: el marcado HTML nunca resuelve a una vista', () => {
  for (const value of ['#<img src=x onerror=1>', '#"><script>', '#es/<svg onload=1>',
                       '#sectores"><script>alert(1)</script>']) {
    assert.equal(parseViewRoute(value), null, value);
  }
});

// TDD-8 (T6)
test('TDD-8: la longitud está acotada antes de procesar', () => {
  assert.equal(parseViewRoute(`#${'a'.repeat(10000)}`), null);
  assert.equal(parseViewRoute(`#es/${'a'.repeat(10000)}`), null);
  // El umbral acordado deja holgura sobre el slug canónico más largo y corta
  // muy por debajo de lo que cuesta procesar.
  assert.ok(MAX_HASH_LENGTH >= 64 && MAX_HASH_LENGTH <= 256, `umbral: ${MAX_HASH_LENGTH}`);
  const masLargo = Math.max(
    ...Object.values(SLUGS).flatMap(fila => LANGS.map(l => `#${l}/${fila[l]}`.length)),
  );
  assert.ok(masLargo < MAX_HASH_LENGTH, `el slug más largo (${masLargo}) debe caber`);
  // Y justo por debajo del umbral sigue resolviendo lo válido.
  assert.deepEqual(parseViewRoute('#es/sectores'), { view: 'sectores', lang: 'es' });
});

// TDD-9 (DA-DL-7)
test('TDD-9: la comparación es exacta y sensible a mayúsculas', () => {
  for (const value of ['#SECTORES', '#Sectores', '#ES/Sectores', '#es/Sectores', '#ES/sectores',
                       '#Inicio', '#La-Red']) {
    assert.equal(parseViewRoute(value), null, value);
  }
});

// TDD-10 (DA-DL-5)
test('TDD-10: los 21 slugs canónicos resuelven a su vista y a su idioma', () => {
  let comprobados = 0;
  for (const [view, fila] of Object.entries(SLUGS)) {
    for (const lang of LANGS) {
      assert.deepEqual(parseViewRoute(`#${lang}/${fila[lang]}`), { view, lang }, `${lang}/${fila[lang]}`);
      comprobados += 1;
    }
  }
  assert.equal(comprobados, 21);
});

// TDD-10b (§3.1)
test('TDD-10b: el prefijo de idioma desambigua el slug que EN y VA comparten', () => {
  // «Sectors» es idéntico en inglés y en valenciano. Es exactamente el caso que
  // obliga a que el idioma vaya delante y siempre (DA-DL-6): sin prefijo, el
  // enlace que motiva todo el encargo sería el ambiguo.
  assert.deepEqual(parseViewRoute('#en/sectors'), { view: 'sectores', lang: 'en' });
  assert.deepEqual(parseViewRoute('#va/sectors'), { view: 'sectores', lang: 'va' });
  assert.notDeepEqual(parseViewRoute('#en/sectors'), parseViewRoute('#va/sectors'));
  assert.notDeepEqual(parseViewRoute('#va/sectors'), parseViewRoute('#es/sectores'));
});

// TDD-10c (DA-DL-6b)
test('TDD-10c: los alias sin idioma resuelven la vista y no inventan idioma', () => {
  for (const [alias, view] of [
    ['#sectores', 'sectores'],
    ['#sectors', 'sectores'],       // compartido por EN y VA: como alias basta con la vista
    ['#la-xarxa', 'red'],
    ['#network', 'red'],
    ['#comunidad-de-practica', 'banco-retos'],
    ['#banco-retos', 'banco-retos'],   // identificador interno, tolerado como entrada
    ['#formacio', 'formacion'],
  ]) {
    const r = parseViewRoute(alias);
    assert.deepEqual(r, { view }, alias);
    assert.ok(!('lang' in r), `${alias} no debe traer idioma`);
  }
});

// TDD-10d
test('TDD-10d: idioma desconocido o cruzado con el slug de otro idioma no resuelve', () => {
  for (const value of ['#xx/sectores', '#ca/sectores', '#es-ES/sectores', '#/sectores', '#es/',
                       '#en/sectores', '#va/formacion', '#es/training']) {
    assert.equal(parseViewRoute(value), null, value);
  }
});

// TDD-11 (DA-DL-2, T7)
test('TDD-11: formatViewRoute no serializa estado interno de navegación', () => {
  const salida = formatViewRoute('formacion', 'es', { sectorIds: [1, 2], source: 'sectors', tab: 'x' });
  assert.equal(salida, '#es/formacion');
  for (const rastro of ['sectorIds', 'source', 'tab', '1', '2', '?', '&', '=']) {
    assert.ok(!salida.includes(rastro), `no debe aparecer "${rastro}"`);
  }
});

// TDD-12
test('TDD-12: ida y vuelta para las 21 combinaciones', () => {
  for (const view of Object.keys(SLUGS)) {
    for (const lang of LANGS) {
      assert.deepEqual(parseViewRoute(formatViewRoute(view, lang)), { view, lang }, `${view}/${lang}`);
    }
  }
});

// TDD-12b
test('TDD-12b: los 21 pares (idioma, slug) son únicos', () => {
  const vistos = new Set();
  for (const fila of Object.values(VIEW_SLUGS)) {
    for (const lang of LANGS) {
      const par = `${lang}/${fila[lang]}`;
      assert.ok(!vistos.has(par), `slug duplicado dentro del mismo idioma: ${par}`);
      vistos.add(par);
    }
  }
  assert.equal(vistos.size, 21);
});

// TDD-12c
test('TDD-12c: la tabla cubre exactamente VIEWS × {es,en,va} y coincide con §3.1', () => {
  assert.deepEqual(Object.keys(VIEW_SLUGS).sort(), [...VIEWS].sort());
  for (const view of VIEWS) {
    assert.deepEqual(Object.keys(VIEW_SLUGS[view]).sort(), [...LANGS].sort(), view);
    for (const lang of LANGS) {
      assert.equal(VIEW_SLUGS[view][lang], SLUGS[view][lang], `${view}.${lang}`);
    }
  }
});

// TDD-13
test('TDD-13: el módulo es puro y no deja estado observable', () => {
  const vistasAntes = JSON.stringify(VIEWS);
  const tablaAntes = JSON.stringify(VIEW_SLUGS);
  for (let i = 0; i < 1000; i += 1) {
    parseViewRoute('#es/sectores');
    parseViewRoute('#basura');
    formatViewRoute('red', 'va');
  }
  assert.equal(JSON.stringify(VIEWS), vistasAntes);
  assert.equal(JSON.stringify(VIEW_SLUGS), tablaAntes);
  assert.deepEqual(parseViewRoute('#es/sectores'), { view: 'sectores', lang: 'es' });
});
