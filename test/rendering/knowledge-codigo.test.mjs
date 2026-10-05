// C14 — La card de Conocimiento muestra el código propio (OER y plantillas) y el buscador encuentra por él.
//
// Los datos generados aún no llevan `code` (los regenera C20), así que la prueba lo inyecta EN MEMORIA.
// No escribe nada. El código de Conocimiento no tiene modos (eso es de Formación): siempre el propio.

import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const almacen = new Map();
let lang = 'es';
globalThis.localStorage = {
  getItem: (k) => (k === 'language' ? lang : (almacen.has(k) ? almacen.get(k) : null)),
  setItem: (k, v) => almacen.set(k, String(v)),
  removeItem: (k) => almacen.delete(k),
};
globalThis.document = {
  documentElement: {},
  getElementById() { return null; },
  querySelector() { return null; },
  querySelectorAll() { return []; },
};
globalThis.window = { location: { hash: '' }, addEventListener() {}, scrollTo() {} };

const { KNOWLEDGE_CONFIG } = await import('../../assets/data/knowledge.js');
const { setState } = await import('../../assets/js/state.js');
const vistas = await import('../../assets/js/views/index.js');

const OER = () => KNOWLEDGE_CONFIG.oerResourcesBlock.resources;
const TPL = () => KNOWLEDGE_CONFIG.templatesBlock.templates;
const ETIQUETA = { es: 'Código AI-STEAM', en: 'AI-STEAM code', va: 'Codi AI-STEAM' };

function conCodigo(items, valor, fn) {
  const originales = items.map((c) => [c, c.code, Object.prototype.hasOwnProperty.call(c, 'code')]);
  for (const [c] of originales) {
    if (valor === undefined) delete c.code;
    else c.code = valor;
  }
  try {
    return fn();
  } finally {
    for (const [c, previo, tenia] of originales) {
      if (tenia) c.code = previo;
      else delete c.code;
    }
  }
}

function pintar(idioma = 'es', { oerSearch = '', tplSearch = '', oerFilters = null, tplFilters = null, tab = 'oer' } = {}) {
  lang = idioma;
  almacen.delete('oerFilters');
  almacen.delete('tmplFilters');
  if (oerFilters) almacen.set('oerFilters', JSON.stringify(oerFilters));
  if (tplFilters) almacen.set('tmplFilters', JSON.stringify(tplFilters));
  setState('knowledgeTab', tab);
  setState('knowledgeSearch', oerSearch);
  setState('templatesSearch', tplSearch);
  return vistas.conocimiento.render();
}

function seccion(html, gridId, finId) {
  const inicio = html.indexOf(`id="${gridId}"`);
  const fin = finId ? html.indexOf(`id="${finId}"`) : html.length;
  return html.slice(inicio, fin === -1 ? undefined : fin);
}

const cards = (html) => html.split('<div class="rd-card-mp rd-card-mp-hover').slice(1);
const ceja = (card) => /<div class="rd-card-mp-ceja">([\s\S]*?)<\/div>/.exec(card)?.[1] ?? '';
const lineasCodigo = (card) => [...ceja(card).matchAll(/<p class="rd-card-mp-code">([\s\S]*?)<\/p>/g)].map((m) => m[1]);
const sinMarcas = (html) => html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();

test('hay OER y plantillas visibles con las que probar', () => {
  assert.ok(OER().length >= 2);
  assert.ok(TPL().length >= 1);
});

test('cada OER pinta su código en la ceja, encima del título', () => {
  const items = OER();
  items.forEach((r, i) => { r.code = `OER-2026-${String(i + 1).padStart(3, '0')}`; });
  try {
    const html = seccion(pintar(), 'oer-grid', 'tmpl-grid');
    const lista = cards(html);
    assert.ok(lista.length > 0);
    for (const card of lista) {
      const linea = lineasCodigo(card);
      assert.equal(linea.length, 1);
      assert.match(sinMarcas(linea[0]), /^Código AI-STEAM: OER-2026-\d{3}$/);
      assert.ok(ceja(card).indexOf('rd-card-mp-code') < ceja(card).indexOf('rd-card-mp-title'), 'el código va ENCIMA del título');
    }
  } finally {
    for (const r of items) delete r.code;
  }
});

test('el código pintado es el del elemento', () => {
  const items = OER();
  items.forEach((r, i) => { r.code = `OER-2026-1${String(i).padStart(2, '0')}`; });
  try {
    const esperados = new Set(items.map((r) => r.code));
    for (const card of cards(seccion(pintar(), 'oer-grid', 'tmpl-grid'))) {
      const codigo = /(OER-2026-\d{3,})<\/p>/.exec(lineasCodigo(card)[0] + '</p>')?.[1];
      assert.ok(esperados.has(codigo), codigo);
    }
  } finally {
    for (const r of items) delete r.code;
  }
});

test('cada plantilla pinta su código (TPL) en la ceja', () => {
  const items = TPL();
  items.forEach((x, i) => { x.code = `TPL-2026-${String(i + 1).padStart(3, '0')}`; });
  try {
    const lista = cards(seccion(pintar('es', { tab: 'plantillas' }), 'tmpl-grid'));
    assert.ok(lista.length > 0);
    for (const card of lista) {
      const linea = lineasCodigo(card);
      assert.equal(linea.length, 1);
      assert.match(sinMarcas(linea[0]), /^Código AI-STEAM: TPL-2026-\d{3}$/);
    }
  } finally {
    for (const x of items) delete x.code;
  }
});

for (const idioma of ['es', 'en', 'va']) {
  test(`la etiqueta accesible del código está en ${idioma} y el código se lee entero`, () => {
    const items = OER();
    items.forEach((r, i) => { r.code = `OER-2026-${String(i + 1).padStart(3, '0')}`; });
    try {
      for (const card of cards(seccion(pintar(idioma), 'oer-grid', 'tmpl-grid'))) {
        const linea = lineasCodigo(card)[0];
        assert.ok(linea.includes('<span class="sr-only">'));
        assert.ok(sinMarcas(linea).startsWith(`${ETIQUETA[idioma]}: `), `${idioma}: ${sinMarcas(linea)}`);
      }
    } finally {
      for (const r of items) delete r.code;
    }
  });
}

test('el buscador de OER encuentra por código', () => {
  const items = OER();
  const objetivo = items[2];
  items.forEach((r, i) => { r.code = `OER-2026-2${String(i).padStart(2, '0')}`; });
  try {
    const html = seccion(pintar('es', { oerSearch: objetivo.code }), 'oer-grid', 'tmpl-grid');
    const lista = cards(html);
    assert.equal(lista.length, 1);
    assert.ok(lineasCodigo(lista[0])[0].includes(objetivo.code), 'debe quedar la card del recurso buscado');
  } finally {
    for (const r of items) delete r.code;
  }
});

test('el buscador de plantillas encuentra por código', () => {
  const items = TPL();
  const objetivo = items[items.length - 1];
  items.forEach((x, i) => { x.code = `TPL-2026-3${String(i).padStart(2, '0')}`; });
  try {
    const lista = cards(seccion(pintar('es', { tplSearch: objetivo.code, tab: 'plantillas' }), 'tmpl-grid'));
    assert.equal(lista.length, 1);
  } finally {
    for (const x of items) delete x.code;
  }
});

test('la búsqueda por código convive con los filtros actuales', () => {
  const items = OER();
  const objetivo = items.find((r) => (r.sectorIds || []).length > 0) || items[0];
  items.forEach((r, i) => { r.code = `OER-2026-4${String(i).padStart(2, '0')}`; });
  try {
    const sector = objetivo.sectorIds[0];
    const html = seccion(pintar('es', {
      oerSearch: 'OER-2026-4',
      oerFilters: { typeId: null, sectors: [sector], levels: [], validationStatus: null },
    }), 'oer-grid', 'tmpl-grid');
    const lista = cards(html);
    const esperados = items.filter((r) => (r.sectorIds || []).includes(sector)).length;
    assert.ok(lista.length > 0);
    assert.equal(lista.length, Math.min(esperados, 9)); // primera página
    // sin la búsqueda, el mismo filtro devuelve el mismo conjunto
    const sinBusqueda = cards(seccion(pintar('es', {
      oerFilters: { typeId: null, sectors: [sector], levels: [], validationStatus: null },
    }), 'oer-grid', 'tmpl-grid'));
    assert.equal(lista.length, sinBusqueda.length);
  } finally {
    for (const r of items) delete r.code;
  }
});

test('sin código no se pinta línea ni aparece «undefined»', () => {
  conCodigo(OER(), undefined, () => {
    const html = seccion(pintar(), 'oer-grid', 'tmpl-grid');
    assert.ok(!html.includes('rd-card-mp-code'));
    assert.ok(!sinMarcas(html).includes('undefined'));
  });
  const items = OER();
  conCodigo(items, 'OER-2026-500', () => {
    assert.ok(cards(seccion(pintar(), 'oer-grid', 'tmpl-grid')).every((c) => lineasCodigo(c).length === 1));
  });
});

test('el código se escapa y no se interpreta', () => {
  const hostil = 'OER-2026-001"><img src=x onerror=alert(1)>&\'';
  conCodigo(OER(), hostil, () => {
    const html = seccion(pintar(), 'oer-grid', 'tmpl-grid');
    assert.ok(!html.includes('<img src=x'), 'la etiqueta inyectada llegó sin escapar');
    assert.ok(!html.includes('onerror=alert(1)>'), 'el atributo inyectado llegó sin escapar');
    assert.ok(html.includes('&lt;img src=x onerror=alert(1)&gt;'), 'el código debería verse como texto');
    assert.doesNotMatch(html, /&amp;(?:amp|lt|gt|quot|#39);/, 'no debe escaparse dos veces');
  });
});

test('las descargas y enlaces de las cards no cambian por mostrar el código', () => {
  const items = OER();
  const conUrl = items.find((r) => r.url);
  conCodigo(items, 'OER-2026-600', () => {
    const html = seccion(pintar(), 'oer-grid', 'tmpl-grid');
    assert.ok(html.includes(`href="${conUrl.url}"`), 'el enlace del recurso sigue igual');
    assert.ok(/Descargar|Ver/.test(html)); // el rótulo de descarga/ver se conserva
  });
});

test('el código no se traduce: idéntico en ES/EN/VA', () => {
  const items = OER();
  conCodigo(items, 'OER-2026-700', () => {
    const codigos = ['es', 'en', 'va'].map((idioma) => /(OER-2026-700)/.exec(seccion(pintar(idioma), 'oer-grid', 'tmpl-grid'))?.[1]);
    assert.deepEqual(codigos, ['OER-2026-700', 'OER-2026-700', 'OER-2026-700']);
  });
});

test('la etiqueta local no toca translations.js (no hace falta cms:ui)', async () => {
  const fuente = await readFile(new URL('../../assets/data/translations.js', import.meta.url), 'utf8');
  assert.ok(!/Código AI-STEAM|AI-STEAM code|Codi AI-STEAM/.test(fuente));
  const vista = await readFile(new URL('../../assets/js/views/knowledge.js', import.meta.url), 'utf8');
  assert.match(vista, /codeLineHtml|CODE_LABEL/);
});
