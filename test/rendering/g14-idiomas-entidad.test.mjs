// G14 — reglas de idioma en la vista pública.
//
// QA-073: la entidad promotora del pie de card comparte la regla estricta del
// brief y la recompensa: sin texto en el idioma activo no se pinta, no se cae
// al español. QA-036: la cabecera no ofrece botones de idiomas que el sitio no
// aplica ni códigos repetidos.

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
const { HEADER_CONFIG } = await import('../../assets/data/header.js');
const { setState } = await import('../../assets/js/state.js');
const { applyLanguage } = await import('../../assets/js/i18n.js');
const vistas = await import('../../assets/js/views/index.js');
const { renderHeader } = await import('../../assets/js/components/header.js');

const { items, itemsByTab } = elementosDePrueba();
MARKETPLACE_CONFIG.items = items;
MARKETPLACE_CONFIG.itemsByTab = itemsByTab;

function pintar(tab, idioma) {
  lang = idioma;
  applyLanguage(idioma);
  almacen.set(`mpCommunityFilters:${tab}`, JSON.stringify({ search: '', values: {} }));
  setState(`marketplacePageSize:${tab}`, 'all');
  setState(`marketplacePage:${tab}`, 0);
  setState('marketplaceTab', tab);
  return vistas.bancoRetos.render();
}

function cardDe(html, code) {
  const cards = html.split('<article class="rd-card-mp ').slice(1).map((trozo) => trozo.split('</article>')[0]);
  const card = cards.find((trozo) => trozo.includes(`${code}</p>`));
  assert.ok(card, `no se encontró la card ${code}`);
  return card;
}

test('QA-073: la entidad promotora no cae al español; brief y recompensa siguen su idioma', () => {
  const reto = MARKETPLACE_CONFIG.itemsByTab.challenges[0];
  reto.ownership.requester.publicLabel = { es: 'Entidad solo en español G14' };
  reto.detail.briefTitle = { es: 'Brief ES G14', en: 'English brief G14', va: 'Brief VA G14' };
  reto.detail.reward = { es: 'Recompensa ES G14', en: 'English reward G14', va: 'Recompensa VA G14' };

  const en = cardDe(pintar('challenges', 'en'), reto.code);
  assert.ok(en.includes('English brief G14'), 'el brief debe salir en inglés');
  assert.ok(en.includes('English reward G14'), 'la recompensa debe salir en inglés');
  assert.ok(!en.includes('Entidad solo en español G14'), 'la entidad no debe caer al español');

  const es = cardDe(pintar('challenges', 'es'), reto.code);
  assert.ok(es.includes('Entidad solo en español G14'), 'en español la entidad sí se pinta');
});

test('QA-036: la cabecera no pinta idiomas no soportados ni repetidos', () => {
  const originales = HEADER_CONFIG.languages;
  HEADER_CONFIG.languages = [
    { code: 'es', label: 'ES', bcp47: 'es' },
    { code: 'en', label: 'EN', bcp47: 'en' },
    { code: 'va', label: 'VA', bcp47: 'ca-valencia' },
    { code: 'fr', label: 'FR', bcp47: 'fr' },
    { code: 'en', label: 'EN2', bcp47: 'en' },
  ];
  try {
    const html = renderHeader();
    assert.ok(!html.includes('data-lang="fr"'), 'no debe aparecer el botón FR');
    assert.equal((html.match(/data-lang="en"/g) || []).length, 1, 'no debe repetirse EN');
  } finally {
    HEADER_CONFIG.languages = originales;
  }
});
