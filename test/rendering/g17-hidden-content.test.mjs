// G17 / QA-051 y QA-113 — la ausencia deliberada no deja restos en la vista:
// un Hero oculto no pinta cabecera ni datos de respaldo, una etiqueta retirada
// del diccionario no cae al ID técnico y la pestaña LbD oculta desaparece.

import assert from 'node:assert/strict';
import test from 'node:test';

import { elementosDePrueba } from '../fixtures/marketplace-de-prueba.mjs';

let lang = 'es';
const almacen = new Map();
globalThis.localStorage = {
  getItem: (k) => (k === 'language' ? lang : (almacen.has(k) ? almacen.get(k) : null)),
  setItem: (k, v) => { almacen.set(k, String(v)); },
  removeItem: (k) => { almacen.delete(k); },
};
globalThis.document = {
  documentElement: {},
  getElementById() { return null; },
  querySelector() { return null; },
  querySelectorAll() { return []; },
};
globalThis.window = { location: { hash: '' }, addEventListener() {}, scrollTo() {} };

const { MARKETPLACE_CONFIG } = await import('../../assets/data/marketplace.js');
const { GOVERNANCE_CONFIG } = await import('../../assets/data/governance.js');
const { setState } = await import('../../assets/js/state.js');
const { applyLanguage, t } = await import('../../assets/js/i18n.js');
const vistas = await import('../../assets/js/views/index.js');

function pintarMarketplace(tab = 'challenges') {
  applyLanguage('es');
  almacen.set(`mpCommunityFilters:${tab}`, JSON.stringify({ search: '', values: {} }));
  setState(`marketplacePageSize:${tab}`, 'all');
  setState(`marketplacePage:${tab}`, 0);
  setState('marketplaceTab', tab);
  return vistas.bancoRetos.render();
}

function conConfig(claves, fn) {
  const original = {};
  for (const clave of claves) original[clave] = MARKETPLACE_CONFIG[clave];
  try {
    return fn();
  } finally {
    for (const clave of claves) MARKETPLACE_CONFIG[clave] = original[clave];
  }
}

test('QA-051: un Hero oculto no pinta etiqueta, título, descripción ni cifras y conserva pestañas y listado', () => {
  const { items, itemsByTab } = elementosDePrueba();
  conConfig(['heroBlock', 'publicSectionName', 'items', 'itemsByTab'], () => {
    MARKETPLACE_CONFIG.items = items;
    MARKETPLACE_CONFIG.itemsByTab = itemsByTab;
    MARKETPLACE_CONFIG.heroBlock = { visible: false };
    MARKETPLACE_CONFIG.publicSectionName = {
      nav: { es: 'G17-HERO-ETIQUETA', en: 'G17-HERO-LABEL', va: 'G17-HERO-ETIQUETA' },
      title: { es: 'G17-HERO-RESPALDO', en: 'G17-HERO-FALLBACK', va: 'G17-HERO-RESPALDO' },
    };

    let html;
    assert.doesNotThrow(() => { html = pintarMarketplace('challenges'); });
    assert.equal(html.includes('rd-hero-gradient'), false, 'no debe quedar la cabecera degradada');
    assert.equal(html.includes('>G17-HERO-ETIQUETA<'), false, 'no debe quedar la etiqueta de la cabecera');
    assert.equal(html.includes('G17-HERO-RESPALDO'), false, 'no debe quedar el título de respaldo');
    assert.ok(html.includes('data-mp-tab="challenges"'), 'las pestañas siguen visibles');
    assert.ok(html.includes('CHA-2026-001'), 'el listado sigue visible');
  });
});

test('QA-113: una etiqueta retirada no pinta chip ni ID técnico y el reto sigue apareciendo', () => {
  const { items, itemsByTab } = elementosDePrueba();
  const reto = items.find(item => item.type === 'challenge');
  reto.classification.contributionTypes = ['ideas'];

  conConfig(['labels', 'contributionTypeLabels', 'items', 'itemsByTab'], () => {
    MARKETPLACE_CONFIG.items = items;
    MARKETPLACE_CONFIG.itemsByTab = itemsByTab;
    const etiquetas = [
      { id: 'ideas', visible: true, label: { es: 'Ideas', en: 'Ideas', va: 'Idees' } },
      { id: 'contextual-data', visible: true, label: { es: 'Datos de contexto', en: 'Contextual data', va: 'Dades de context' } },
    ];
    MARKETPLACE_CONFIG.labels = { ...MARKETPLACE_CONFIG.labels, contributionTypes: etiquetas };
    MARKETPLACE_CONFIG.contributionTypeLabels = etiquetas;

    const conEtiqueta = pintarMarketplace('challenges');
    assert.ok(conEtiqueta.includes('>Ideas<'), 'la etiqueta visible se pinta como chip');

    MARKETPLACE_CONFIG.labels = {
      ...MARKETPLACE_CONFIG.labels,
      contributionTypes: etiquetas.filter(item => item.id !== 'ideas'),
    };
    MARKETPLACE_CONFIG.contributionTypeLabels = etiquetas.filter(item => item.id !== 'ideas');

    let html;
    assert.doesNotThrow(() => { html = pintarMarketplace('challenges'); });
    assert.ok(html.includes('CHA-2026-001'), 'el reto que usaba la etiqueta sigue apareciendo');
    assert.equal(html.includes('>ideas<'), false, 'no debe pintarse el ID técnico como chip');
    assert.equal(html.includes('>Ideas<'), false, 'no debe pintarse la etiqueta retirada');

    MARKETPLACE_CONFIG.labels = { ...MARKETPLACE_CONFIG.labels, contributionTypes: etiquetas };
    MARKETPLACE_CONFIG.contributionTypeLabels = etiquetas;
    assert.ok(pintarMarketplace('challenges').includes('>Ideas<'), 'al reactivar la etiqueta vuelve el chip');
  });
});

test('QA-051 LbD: un bloque oculto retira su pestaña y no pinta títulos de respaldo', () => {
  const original = GOVERNANCE_CONFIG.lbdBlock;
  const govT = t('governance') || {};
  const fallbacks = [
    govT.tabContent_lbd?.cycleTitle,
    govT.tabContent_lbd?.operatingFlow?.title,
    govT.tabContent_lbd?.scalabilityTitle,
  ].filter(Boolean);
  try {
    GOVERNANCE_CONFIG.lbdBlock = { visible: false };
    setState('governanceTab', 'lbd');
    let html;
    assert.doesNotThrow(() => { html = vistas.gobernanza.render(); });
    assert.equal(html.includes('data-gov-tab="lbd"'), false, 'la pestaña LbD no se pinta');
    assert.ok(html.includes('data-gov-tab="estructura"'), 'el resto de pestañas sigue disponible');
    for (const fallback of fallbacks) {
      assert.equal(html.includes(fallback), false, `no debe quedar el respaldo: ${fallback}`);
    }
  } finally {
    GOVERNANCE_CONFIG.lbdBlock = original;
  }
});
