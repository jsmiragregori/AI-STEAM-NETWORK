// Estado vacío de las secciones públicas que hoy no tienen contenido: cursos (Formación), recursos OER y
// plantillas (Conocimiento), documentación (Gobernanza) y elementos de Marketplace (comunidad de práctica).
//
// Cada prueba vacía la colección EN MEMORIA y comprueba que la vista pinta cero cards, que aparece el
// mensaje vacío de configuración y que no sale «undefined», «null» ni «[object». El mensaje se lee de la
// configuración en tiempo de ejecución: si el equipo editorial cambia el texto, la prueba sigue valiendo.
// Cada grupo tiene además un control con elementos sintéticos, para que el caso vacío no pase en falso.

import assert from 'node:assert/strict';
import test from 'node:test';

import { cursosDePrueba } from '../fixtures/cursos-de-prueba.mjs';
import { plantillasDePrueba, recursosOerDePrueba } from '../fixtures/conocimiento-de-prueba.mjs';
import { documentosDePrueba } from '../fixtures/documentos-de-prueba.mjs';
import { elementosDePrueba } from '../fixtures/marketplace-de-prueba.mjs';

let lang = 'es';
const almacen = new Map();
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

const { TRAINING_CONFIG } = await import('../../assets/data/training.js');
const { KNOWLEDGE_CONFIG } = await import('../../assets/data/knowledge.js');
const { GOVERNANCE_CONFIG } = await import('../../assets/data/governance.js');
const { MARKETPLACE_CONFIG } = await import('../../assets/data/marketplace.js');
const { setState } = await import('../../assets/js/state.js');
const { applyLanguage } = await import('../../assets/js/i18n.js');
const { escapeHtml } = await import('../../assets/js/utils/escape-html.js');
const vistas = await import('../../assets/js/views/index.js');

const IDIOMAS = ['es', 'en', 'va'];
const TABS_MARKETPLACE = MARKETPLACE_CONFIG.tabs.map((t) => t.id);

/** Sustituye el contenido de una lista en sitio (conserva su identidad) mientras dura fn y la restaura. */
function conLista(lista, valores, fn) {
  const previos = lista.splice(0, lista.length, ...valores);
  try {
    return fn();
  } finally {
    lista.splice(0, lista.length, ...previos);
  }
}

/** El texto que la vista pinta para un mensaje multilingüe: el del idioma, y si no, el español (como pickLang). */
const mensajeDe = (campo, idioma) => (campo && (campo[idioma] || campo.es)) || '';

function sinBasura(html, contexto) {
  assert.ok(!/undefined|\bnull\b|\[object/.test(html), `${contexto}: aparece undefined, null o [object`);
}

const cards = (html) => html.split('<div class="rd-card-mp rd-card-mp-hover').slice(1);
const cardsMarketplace = (html) => html.split('<article class="rd-card-mp ').slice(1);

// ── Formación: cursos ───────────────────────────────────────────────────────

function pintarFormacion(tab, idioma) {
  lang = idioma;
  applyLanguage(idioma);
  almacen.delete(`trainingFilters_${tab}`);
  setState('trainingTab', tab);
  setState('trainingPage', 0);
  return vistas.formacion.render();
}

for (const tab of ['fp', 'teacher', 'master']) {
  for (const idioma of IDIOMAS) {
    test(`Formación ${tab} sin cursos: cero cards, mensaje vacío de configuración (${idioma}), sin basura`, () => {
      const bloque = TRAINING_CONFIG.coursesBlock;
      conLista(bloque.courses, [], () => {
        const html = pintarFormacion(tab, idioma);
        assert.equal(cards(html).length, 0, 'sin cursos no debe haber cards');
        const mensaje = mensajeDe(bloque.emptyMessage, idioma);
        if (mensaje) assert.ok(html.includes(escapeHtml(mensaje)), 'falta el mensaje vacío');
        sinBasura(html, `Formación ${tab}/${idioma}`);
      });
    });
  }
}

test('Formación con cursos sintéticos: control, cada pestaña pinta sus cards', () => {
  const bloque = TRAINING_CONFIG.coursesBlock;
  conLista(bloque.courses, cursosDePrueba(bloque), () => {
    for (const tab of ['fp', 'teacher', 'master']) {
      assert.ok(cards(pintarFormacion(tab, 'es')).length > 0, `${tab}: sin cards con cursos`);
    }
  });
});

// ── Conocimiento: OER y plantillas ──────────────────────────────────────────

function pintarConocimiento(tab, idioma) {
  lang = idioma;
  applyLanguage(idioma);
  almacen.delete('oerFilters');
  almacen.delete('tmplFilters');
  setState('knowledgeTab', tab);
  setState('knowledgeSearch', '');
  setState('templatesSearch', '');
  setState('oerPage', 0);
  setState('templatesPage', 0);
  return vistas.conocimiento.render();
}

for (const idioma of IDIOMAS) {
  test(`Conocimiento OER sin recursos: cero cards, mensaje vacío de configuración (${idioma}), sin basura`, () => {
    const oer = KNOWLEDGE_CONFIG.oerResourcesBlock;
    const plantillas = KNOWLEDGE_CONFIG.templatesBlock;
    conLista(oer.resources, [], () => conLista(plantillas.templates, [], () => {
      const html = pintarConocimiento('oer', idioma);
      assert.equal(cards(html).length, 0, 'sin recursos no debe haber cards');
      const mensaje = mensajeDe(oer.emptyMessage, idioma);
      if (mensaje) assert.ok(html.includes(escapeHtml(mensaje)), 'falta el mensaje vacío de OER');
      sinBasura(html, `OER/${idioma}`);
    }));
  });

  test(`Conocimiento plantillas sin plantillas: cero cards, mensaje vacío de configuración (${idioma}), sin basura`, () => {
    const oer = KNOWLEDGE_CONFIG.oerResourcesBlock;
    const plantillas = KNOWLEDGE_CONFIG.templatesBlock;
    conLista(oer.resources, [], () => conLista(plantillas.templates, [], () => {
      const html = pintarConocimiento('plantillas', idioma);
      assert.equal(cards(html).length, 0, 'sin plantillas no debe haber cards');
      const mensaje = mensajeDe(plantillas.emptyMessage, idioma);
      if (mensaje) assert.ok(html.includes(escapeHtml(mensaje)), 'falta el mensaje vacío de plantillas');
      sinBasura(html, `Plantillas/${idioma}`);
    }));
  });
}

test('Conocimiento con recursos y plantillas sintéticos: control, cada pestaña pinta sus cards', () => {
  const oer = KNOWLEDGE_CONFIG.oerResourcesBlock;
  const plantillas = KNOWLEDGE_CONFIG.templatesBlock;
  conLista(oer.resources, recursosOerDePrueba(oer), () => conLista(plantillas.templates, plantillasDePrueba(plantillas), () => {
    assert.ok(cards(pintarConocimiento('oer', 'es')).length > 0, 'OER: sin cards con recursos');
    assert.ok(cards(pintarConocimiento('plantillas', 'es')).length > 0, 'plantillas: sin cards con plantillas');
  }));
});

// ── Gobernanza: documentación ───────────────────────────────────────────────

function pintarGobernanza(idioma) {
  lang = idioma;
  applyLanguage(idioma);
  busqueda = '';
  setState('governanceTab', 'documentos');
  return vistas.gobernanza.render();
}

for (const idioma of IDIOMAS) {
  test(`Gobernanza sin documentos: cero cards, mensaje vacío de configuración (${idioma}), sin basura`, () => {
    const bloque = GOVERNANCE_CONFIG.documentationBlock;
    conLista(bloque.docs, [], () => {
      const html = pintarGobernanza(idioma);
      assert.equal(cards(html).length, 0, 'sin documentos no debe haber cards');
      const mensaje = mensajeDe(bloque.noDocsMessage, idioma);
      if (mensaje) assert.ok(html.includes(escapeHtml(mensaje)), 'falta el mensaje de «sin documentos»');
      sinBasura(html, `Gobernanza/${idioma}`);
    });
  });
}

test('Gobernanza con documentos sintéticos: control, aparecen sus cards', () => {
  const bloque = GOVERNANCE_CONFIG.documentationBlock;
  conLista(bloque.docs, documentosDePrueba(), () => {
    assert.equal(cards(pintarGobernanza('es')).length, 2);
  });
});

// ── Marketplace: comunidad de práctica (las cinco pestañas sin elementos) ──

function pintarMarketplace(tab, idioma) {
  lang = idioma;
  applyLanguage(idioma);
  almacen.set(`mpCommunityFilters:${tab}`, JSON.stringify({ search: '', values: {} }));
  setState(`marketplacePageSize:${tab}`, 'all');
  setState(`marketplacePage:${tab}`, 0);
  setState('marketplaceTab', tab);
  return vistas.bancoRetos.render();
}

/** Deja sin elementos el catálogo y cada pestaña mientras dura fn, y restaura las referencias originales. */
function sinElementosMarketplace(fn) {
  const previosItems = MARKETPLACE_CONFIG.items;
  const previosPorPestana = MARKETPLACE_CONFIG.itemsByTab;
  MARKETPLACE_CONFIG.items = [];
  MARKETPLACE_CONFIG.itemsByTab = Object.fromEntries(TABS_MARKETPLACE.map((tab) => [tab, []]));
  try {
    return fn();
  } finally {
    MARKETPLACE_CONFIG.items = previosItems;
    MARKETPLACE_CONFIG.itemsByTab = previosPorPestana;
  }
}

for (const tab of TABS_MARKETPLACE) {
  for (const idioma of IDIOMAS) {
    test(`Marketplace ${tab} sin elementos: cero cards, estado vacío de configuración (${idioma}), sin basura`, () => {
      sinElementosMarketplace(() => {
        const html = pintarMarketplace(tab, idioma);
        assert.equal(cardsMarketplace(html).length, 0, 'sin elementos no debe haber cards');
        const pestana = MARKETPLACE_CONFIG.tabs.find((t) => t.id === tab);
        const titulo = mensajeDe(pestana?.emptyState?.title, idioma);
        const mensaje = mensajeDe(pestana?.emptyState?.message, idioma);
        if (titulo) assert.ok(html.includes(escapeHtml(titulo)), 'falta el título del estado vacío');
        if (mensaje) assert.ok(html.includes(escapeHtml(mensaje)), 'falta el mensaje del estado vacío');
        sinBasura(html, `Marketplace ${tab}/${idioma}`);
      });
    });
  }
}

test('Marketplace con elementos sintéticos: cada pestaña pinta cards en los tres idiomas', () => {
  const { items, itemsByTab } = elementosDePrueba();
  const previosItems = MARKETPLACE_CONFIG.items;
  const previosPorPestana = MARKETPLACE_CONFIG.itemsByTab;
  MARKETPLACE_CONFIG.items = items;
  MARKETPLACE_CONFIG.itemsByTab = itemsByTab;
  try {
    for (const idioma of IDIOMAS) {
      for (const tab of TABS_MARKETPLACE) {
        const html = pintarMarketplace(tab, idioma);
        const config = MARKETPLACE_CONFIG.tabs.find((entry) => entry.id === tab);
        const title = mensajeDe(config?.emptyState?.title, idioma);
        const message = mensajeDe(config?.emptyState?.message, idioma);
        assert.ok(cardsMarketplace(html).length > 0, `${tab}/${idioma}: sin cards con elementos`);
        if (title) assert.ok(!html.includes(escapeHtml(title)), `${tab}/${idioma}: aparece el título vacío con cards`);
        if (message) assert.ok(!html.includes(escapeHtml(message)), `${tab}/${idioma}: aparece el mensaje vacío con cards`);
      }
    }
  } finally {
    MARKETPLACE_CONFIG.items = previosItems;
    MARKETPLACE_CONFIG.itemsByTab = previosPorPestana;
  }
});
