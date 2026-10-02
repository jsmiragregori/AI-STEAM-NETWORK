// F5.1/F5.2 del plan de códigos: la card muestra el código público del elemento.
//
// El código sale en `renderCardShell`, el único punto por el que pasan las cinco cards, en una línea
// propia DENTRO de la ceja y ENCIMA del título. Es dato que viene del YAML y va a innerHTML, así que
// sale por esc(); y su etiqueta accesible vive en el mapa UI_TEXT local de la vista, sin tocar
// translations.js (no hace falta `cms:ui`).
//
// Los datos generados todavía no llevan `code` (los regenera la Fase 7), así que la prueba lo inyecta
// EN MEMORIA, ítem a ítem, antes de pintar. No escribe nada.

import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

let lang = 'es';
globalThis.localStorage = { getItem: (k) => (k === 'language' ? lang : null), setItem() {}, removeItem() {} };
globalThis.document = {
  documentElement: {},
  getElementById() { return null; },
  querySelector() { return null; },
  querySelectorAll() { return []; },
};
globalThis.window = { location: { hash: '' }, addEventListener() {}, scrollTo() {} };

const { MARKETPLACE_CONFIG } = await import('../../assets/data/marketplace.js');
const { setState } = await import('../../assets/js/state.js');
const vistas = await import('../../assets/js/views/index.js');

const PREFIJO = { challenge: 'CHA', case: 'CAS', mentoring: 'MEN', pilot: 'PIL', validation: 'VAL' };
const TABS = ['challenges', 'cases', 'mentorings', 'pilots', 'validations'];
const ETIQUETA = { es: 'Código', en: 'Code', va: 'Codi' };

// Un código distinto para cada ítem, en cada una de las listas que la vista puede leer.
let numero = 0;
const codigoDe = new Map();
for (const lista of [MARKETPLACE_CONFIG.items, ...Object.values(MARKETPLACE_CONFIG.itemsByTab)]) {
  for (const item of lista) {
    if (!codigoDe.has(item.id)) {
      numero += 1;
      codigoDe.set(item.id, `${PREFIJO[item.type]}-2026-${String(numero).padStart(3, '0')}`);
    }
    item.code = codigoDe.get(item.id);
  }
}

function pintar(tab, idioma = 'es') {
  lang = idioma;
  setState('marketplaceTab', tab);
  return vistas.bancoRetos.render();
}

/** Las cards del HTML, de `<article class="rd-card-mp` a su cierre. */
function cards(html) {
  return html.split('<article class="rd-card-mp ').slice(1).map((trozo) => trozo.split('</article>')[0]);
}

const ceja = (card) => /<div class="rd-card-mp-ceja">([\s\S]*?)<\/div>/.exec(card)?.[1] ?? '';
const lineaDelCodigo = (card) => /<p class="rd-card-mp-code">([\s\S]*?)<\/p>/.exec(card)?.[1];
const sinMarcas = (html) => html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();

test('hay datos de las cinco pestañas con los que probar', () => {
  assert.deepEqual([...MARKETPLACE_CONFIG.tabs.map((t) => t.id)].sort(), [...TABS].sort());
  for (const tab of TABS) assert.ok(MARKETPLACE_CONFIG.itemsByTab[tab].length > 0, tab);
});

for (const tab of TABS) {
  test(`F5.1 ${tab}: todas las cards pintan su código en la ceja, encima del título`, () => {
    const lista = cards(pintar(tab));
    assert.ok(lista.length > 0, 'la pestaña no pintó ninguna card');
    for (const card of lista) {
      const cejaHtml = ceja(card);
      const linea = lineaDelCodigo(cejaHtml);
      assert.ok(linea, `una card de ${tab} no lleva línea de código en la ceja`);
      assert.match(sinMarcas(linea), /^[A-Z]{3}-2026-\d{3}$|^Código: [A-Z]{3}-2026-\d{3}$/);
      assert.ok(
        cejaHtml.indexOf('rd-card-mp-code') < cejaHtml.indexOf('rd-card-mp-title'),
        'el código va ENCIMA del título',
      );
      assert.equal(card.split('rd-card-mp-code').length - 1, 1, 'el código sale una sola vez por card');
    }
  });

  test(`F5.1 ${tab}: el código pintado es el del elemento y lleva el prefijo de su tipo`, () => {
    const esperados = new Set(MARKETPLACE_CONFIG.itemsByTab[tab].map((i) => i.code));
    const prefijo = PREFIJO[MARKETPLACE_CONFIG.itemsByTab[tab][0].type];
    for (const card of cards(pintar(tab))) {
      const codigo = /([A-Z]{3}-\d{4}-\d{3,})<\/p>/.exec(lineaDelCodigo(ceja(card)) + '</p>')?.[1];
      assert.ok(esperados.has(codigo), `${codigo} no es de ningún elemento de ${tab}`);
      assert.ok(codigo.startsWith(`${prefijo}-`), `${codigo} no lleva el prefijo ${prefijo}`);
    }
  });
}

for (const idioma of ['es', 'en', 'va']) {
  test(`F5.1 la etiqueta accesible está en ${idioma} y el código se lee entero`, () => {
    for (const tab of TABS) {
      for (const card of cards(pintar(tab, idioma))) {
        const linea = lineaDelCodigo(ceja(card));
        assert.ok(linea, `${tab}/${idioma}: sin línea de código`);
        assert.match(linea, /<span class="sr-only">/);
        assert.ok(sinMarcas(linea).startsWith(`${ETIQUETA[idioma]}: `), `${tab}/${idioma}: ${sinMarcas(linea)}`);
      }
    }
  });
}

/**
 * Cambia el código de TODOS los ítems de una pestaña mientras dura `fn` (la primera página solo
 * enseña seis, y no hay que adivinar cuáles) y lo restaura siempre.
 */
function conCodigo(tab, valor, fn) {
  const originales = MARKETPLACE_CONFIG.itemsByTab[tab].map((item) => [item, item.code]);
  for (const [item] of originales) {
    if (valor === undefined) delete item.code;
    else item.code = valor;
  }
  try {
    return fn();
  } finally {
    for (const [item, codigo] of originales) item.code = codigo;
  }
}

test('F5.1 el código sale por esc(): una carga hostil se pinta como texto', () => {
  const hostil = 'CHA-2026-001"><img src=x onerror=alert(1)>&\'';
  conCodigo('challenges', hostil, () => {
    const html = pintar('challenges');
    assert.ok(!html.includes('<img src=x'), 'la etiqueta inyectada llegó sin escapar');
    assert.ok(!html.includes('onerror=alert(1)>'), 'el atributo inyectado llegó sin escapar');
    assert.ok(html.includes('&lt;img src=x onerror=alert(1)&gt;'), 'el código debería verse como texto');
    assert.ok(html.includes('&quot;'), 'la comilla debería ir escapada');
    assert.doesNotMatch(html, /&amp;(?:amp|lt|gt|quot|#39);/, 'no debe escaparse dos veces');
  });
});

test('F5.1 un elemento sin código no pinta línea vacía ni la palabra «undefined»', () => {
  assert.ok(cards(pintar('cases')).every((card) => lineaDelCodigo(ceja(card))), 'control: con código sí hay línea');
  conCodigo('cases', undefined, () => {
    const lista = cards(pintar('cases'));
    assert.ok(lista.length > 0);
    for (const card of lista) {
      assert.ok(!lineaDelCodigo(ceja(card)), 'sin código no debe haber línea de código');
      assert.ok(!card.includes('rd-card-mp-code'));
      assert.ok(!card.includes('undefined'), 'no debe aparecer «undefined»');
    }
  });
});

test('F5.1 un código vacío o solo de espacios tampoco pinta línea', () => {
  assert.ok(cards(pintar('cases')).every((card) => lineaDelCodigo(ceja(card))), 'control: con código sí hay línea');
  for (const vacio of ['', '   ', null]) {
    conCodigo('cases', vacio, () => {
      for (const card of cards(pintar('cases'))) assert.ok(!card.includes('rd-card-mp-code'), JSON.stringify(vacio));
    });
  }
});

test('F5.1 un código no cadena (un número del YAML) no rompe el render', () => {
  conCodigo('pilots', 42, () => {
    const html = pintar('pilots');
    assert.ok(html.includes('42'));
    assert.ok(!html.includes('[object'));
  });
});

test('F5.1 el código sigue siendo el que se pinta tras volver a una pestaña ya vista', () => {
  const a = cards(pintar('mentorings')).map((c) => lineaDelCodigo(ceja(c)));
  pintar('cases');
  const b = cards(pintar('mentorings')).map((c) => lineaDelCodigo(ceja(c)));
  assert.ok(a.length > 0 && a.every(Boolean), 'control: todas las cards llevan línea de código');
  assert.deepEqual(a, b);
});

test('F5.1 la etiqueta accesible no se añade a translations.js (no hace falta cms:ui)', async () => {
  const fuente = await readFile(new URL('../../assets/data/translations.js', import.meta.url), 'utf8');
  assert.ok(!/rd-card-mp-code|codigoPublico|publicCode/i.test(fuente));
  const vista = await readFile(new URL('../../assets/js/views/marketplace.js', import.meta.url), 'utf8');
  assert.match(vista, /^\s*publicCode: \{\s*$/m);
});
