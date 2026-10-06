// C15 — La card de Gobernanza muestra el código (DOC) y el buscador encuentra por él.
//
// Los datos generados aún no llevan `code` (los regenera C20), así que la prueba lo inyecta EN MEMORIA.
// No escribe nada. Se conservan accesos, visibilidad (lo oculto no llega al generado), adjuntos y descargas.

import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const almacen = new Map();
let lang = 'es';
let busqueda = '';
globalThis.localStorage = {
  getItem: (k) => (k === 'language' ? lang : (almacen.has(k) ? almacen.get(k) : null)),
  setItem: (k, v) => almacen.set(k, String(v)),
  removeItem: (k) => almacen.delete(k),
};
globalThis.document = {
  documentElement: {},
  getElementById: (id) => (id === 'gov-doc-search' ? { value: busqueda } : null),
  querySelector() { return null; },
  querySelectorAll() { return []; },
};
globalThis.window = { location: { hash: '' }, addEventListener() {}, scrollTo() {} };

const { GOVERNANCE_CONFIG } = await import('../../assets/data/governance.js');
const { setState } = await import('../../assets/js/state.js');
const vistas = await import('../../assets/js/views/index.js');

const DOCS = () => GOVERNANCE_CONFIG.documentationBlock.docs;
const ETIQUETA = { es: 'Código AiSTEAM', en: 'AiSTEAM code', va: 'Codi AiSTEAM' };

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

function pintar(idioma = 'es', termino = '') {
  lang = idioma;
  busqueda = termino;
  setState('governanceTab', 'documentos');
  return vistas.gobernanza.render();
}

const docsSection = (html) => {
  const inicio = html.indexOf('id="gov-docs-results"');
  return html.slice(inicio);
};
const cards = (html) => html.split('<div class="rd-card-mp rd-card-mp-hover').slice(1);
const ceja = (card) => /<div class="rd-card-mp-ceja">([\s\S]*?)<\/div>/.exec(card)?.[1] ?? '';
const lineasCodigo = (card) => [...ceja(card).matchAll(/<p class="rd-card-mp-code">([\s\S]*?)<\/p>/g)].map((m) => m[1]);
const sinMarcas = (html) => html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();

test('hay documentos con los que probar', () => {
  assert.ok(DOCS().length > 0);
});

test('cada documento pinta su código en la ceja, encima del título', () => {
  const items = DOCS();
  items.forEach((d, i) => { d.code = `DOC-2026-${String(i + 1).padStart(3, '0')}`; });
  try {
    const lista = cards(docsSection(pintar()));
    assert.ok(lista.length > 0);
    for (const card of lista) {
      const linea = lineasCodigo(card);
      assert.equal(linea.length, 1);
      assert.match(sinMarcas(linea[0]), /^Código AiSTEAM: DOC-2026-\d{3}$/);
      assert.ok(ceja(card).indexOf('rd-card-mp-code') < ceja(card).indexOf('rd-card-mp-title'), 'el código va ENCIMA del título');
    }
  } finally {
    for (const d of items) delete d.code;
  }
});

for (const idioma of ['es', 'en', 'va']) {
  test(`la etiqueta accesible del código está en ${idioma} y el código se lee entero`, () => {
    const items = DOCS();
    items.forEach((d, i) => { d.code = `DOC-2026-${String(i + 1).padStart(3, '0')}`; });
    try {
      for (const card of cards(docsSection(pintar(idioma)))) {
        const linea = lineasCodigo(card)[0];
        assert.ok(linea.includes('<span class="sr-only">'));
        assert.ok(sinMarcas(linea).startsWith(`${ETIQUETA[idioma]}: `), `${idioma}: ${sinMarcas(linea)}`);
      }
    } finally {
      for (const d of items) delete d.code;
    }
  });
}

test('el buscador encuentra por código', () => {
  const items = DOCS();
  const objetivo = items[1];
  items.forEach((d, i) => { d.code = `DOC-2026-2${String(i).padStart(2, '0')}`; });
  try {
    const lista = cards(docsSection(pintar('es', objetivo.code)));
    assert.equal(lista.length, 1);
    assert.ok(lineasCodigo(lista[0])[0].includes(objetivo.code));
  } finally {
    for (const d of items) delete d.code;
  }
});

test('la búsqueda por id y por título sigue funcionando (control)', () => {
  const items = DOCS();
  items.forEach((d, i) => { d.code = `DOC-2026-3${String(i).padStart(2, '0')}`; });
  try {
    assert.equal(cards(docsSection(pintar('es', 'consortium-agreement'))).length, 1);
    assert.ok(cards(docsSection(pintar('es', 'Consorcio'))).length >= 1);
  } finally {
    for (const d of items) delete d.code;
  }
});

test('sin código no se pinta línea ni aparece «undefined»', () => {
  conCodigo(DOCS(), undefined, () => {
    const html = docsSection(pintar());
    assert.ok(!html.includes('rd-card-mp-code'));
    assert.ok(!sinMarcas(html).includes('undefined'));
  });
  conCodigo(DOCS(), 'DOC-2026-900', () => {
    assert.ok(cards(docsSection(pintar())).every((c) => lineasCodigo(c).length === 1));
  });
});

test('el código se escapa y no se interpreta', () => {
  const hostil = 'DOC-2026-001"><img src=x onerror=alert(1)>&\'';
  conCodigo(DOCS(), hostil, () => {
    const html = docsSection(pintar());
    assert.ok(!html.includes('<img src=x'), 'la etiqueta inyectada llegó sin escapar');
    assert.ok(!html.includes('onerror=alert(1)>'), 'el atributo inyectado llegó sin escapar');
    assert.ok(html.includes('&lt;img src=x onerror=alert(1)&gt;'), 'el código debería verse como texto');
    assert.doesNotMatch(html, /&amp;(?:amp|lt|gt|quot|#39);/, 'no debe escaparse dos veces');
  });
});

test('el acceso y la visibilidad de cada documento se conservan', () => {
  const partner = DOCS().find((d) => d.access === 'partners');
  const publico = DOCS().find((d) => d.access === 'public');
  conCodigo(DOCS(), 'DOC-2026-901', () => {
    const html = docsSection(pintar());
    assert.ok(html.includes('data-lucide="lock"'), 'el acceso de socios conserva su candado');
    assert.ok(html.includes('data-lucide="globe"'), 'el acceso público conserva su globo');
    assert.ok(partner && publico);
  });
});

test('el adjunto descargable y el enlace externo se conservan con el código', () => {
  const conArchivo = DOCS().find((d) => d.filePublicPath);
  const conEnlace = DOCS().find((d) => d.url && d.external);
  conCodigo(DOCS(), 'DOC-2026-902', () => {
    const html = docsSection(pintar());
    assert.ok(html.includes(`href="${conArchivo.filePublicPath}" download`), 'el adjunto sigue siendo descarga directa');
    assert.ok(html.includes(`href="${conEnlace.url}"`), 'el enlace externo sigue igual');
    assert.ok(/target="_blank" rel="noopener noreferrer"/.test(html), 'el enlace externo conserva noopener');
    assert.ok(/Descargar|Ver|Download|Veure/.test(html));
  });
});

test('la etiqueta local no toca translations.js (no hace falta cms:ui)', async () => {
  const fuente = await readFile(new URL('../../assets/data/translations.js', import.meta.url), 'utf8');
  assert.ok(!/Código AiSTEAM|AiSTEAM code|Codi AiSTEAM/.test(fuente));
  const vista = await readFile(new URL('../../assets/js/views/governance.js', import.meta.url), 'utf8');
  assert.match(vista, /GOV_CODE_LABEL|govCodeLineHtml/);
});
