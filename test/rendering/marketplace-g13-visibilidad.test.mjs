// G13 / QA-057, QA-075 y QA-081 - la vista respeta la visibilidad por tipo y
// recorta los ODS de Casos a 3 con un indicador estático «+N».
//
// Los datos son los fixtures sintéticos de Marketplace; no se toca contenido real.

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
const { setState } = await import('../../assets/js/state.js');
const { applyLanguage } = await import('../../assets/js/i18n.js');
const vistas = await import('../../assets/js/views/index.js');

const CODIGO_CASO = 'CAS-2026-001';
const TABS = {
  challenge: 'challenges',
  case: 'cases',
  pilot: 'pilots',
  validation: 'validations',
  mentoring: 'mentorings',
};
const CODIGOS = {
  challenge: 'CHA-2026-001',
  case: CODIGO_CASO,
  pilot: 'PIL-2026-001',
  validation: 'VAL-2026-001',
  mentoring: 'MEN-2026-001',
};
const REVISIONES = ['challenge', 'case', 'pilot', 'validation', 'mentoring'];
const ENTIDADES = ['challenge', 'case', 'pilot', 'validation'];

function preparar() {
  const { items, itemsByTab } = elementosDePrueba();
  MARKETPLACE_CONFIG.items = items;
  MARKETPLACE_CONFIG.itemsByTab = itemsByTab;
  MARKETPLACE_CONFIG.cardChipVisibility = {};
  const caso = items.find((item) => item.type === 'case');
  // La cadena de transferencia repite el nombre del editor; para aislar el pie de
  // card se desactiva esa cadena en las pruebas de entidad.
  caso.presentation = { card: { showActors: false } };
  items.find((item) => item.type === 'pilot').ownership.lead = {
    name: { es: 'Entidad Piloto', en: 'Pilot Entity', va: 'Entitat Pilot' },
  };
  items.find((item) => item.type === 'validation').ownership.proposer = {
    name: { es: 'Entidad Validacion', en: 'Validation Entity', va: 'Entitat Validacio' },
  };
  return { items, caso };
}

function pintar(tab, idioma = 'es') {
  lang = idioma;
  applyLanguage(idioma);
  almacen.set(`mpCommunityFilters:${tab}`, JSON.stringify({ search: '', values: {} }));
  setState(`marketplacePageSize:${tab}`, 'all');
  setState(`marketplacePage:${tab}`, 0);
  setState('marketplaceTab', tab);
  return vistas.bancoRetos.render();
}

function cards(html) {
  return html.split('<article class="rd-card-mp ').slice(1).map((trozo) => trozo.split('</article>')[0]);
}

function cardDe(html, code) {
  const card = cards(html).find((c) => c.includes(`>${code}</p>`));
  assert.ok(card, `no se encontró la card ${code}`);
  return card;
}

test('Casos muestra como máximo 3 ODS y un «+N» solo si hay más', () => {
  const { caso } = preparar();
  MARKETPLACE_CONFIG.cardChipVisibility = { ch_case_sdgs: true };
  const esperado = [
    [0, 0, null],
    [1, 1, null],
    [3, 3, null],
    [4, 3, 1],
    [6, 3, 3],
  ];
  for (const [n, chips, mas] of esperado) {
    caso.classification.sdgs = Array.from({ length: n }, (_, i) => String(i + 3));
    const card = cardDe(pintar('cases'), CODIGO_CASO);
    const pintados = (card.match(/>ODS \d+</g) || []).length;
    const indicador = card.match(/>\+(\d+)</);
    assert.equal(pintados, chips, `${n} ODS: chips`);
    assert.equal(indicador ? Number(indicador[1]) : null, mas, `${n} ODS: +N`);
    if (n === 0) assert.ok(!card.includes('>ODS '), '0 ODS: no aparece la sección');
  }
});

test('el indicador +N tiene etiqueta accesible y los pies se ven en ES/EN/VA', () => {
  const { caso } = preparar();
  caso.classification.sdgs = ['3', '4', '8', '10', '11', '17'];
  MARKETPLACE_CONFIG.cardChipVisibility = { ch_case_sdgs: true };
  const textos = {
    es: ['+3', '3 ODS más', 'ODS 3', 'Revisado', 'Editor de prueba'],
    en: ['+3', '3 more SDGs', 'SDG 3', 'Revisado', 'Editor de prueba'],
    va: ['+3', '3 ODS més', 'ODS 3', 'Revisado', 'Editor de prueba'],
  };
  for (const [idioma, esperados] of Object.entries(textos)) {
    const card = cardDe(pintar('cases', idioma), CODIGO_CASO);
    for (const texto of esperados) {
      assert.ok(card.includes(texto), `${idioma}: falta ${texto}`);
    }
  }
});

test('la fecha y la entidad se controlan por tipo en el HTML', () => {
  preparar();
  const ccv = { ch_reviewDate: false, ch_entity: false };
  for (const tipo of REVISIONES) ccv[`ch_reviewDate_${tipo}`] = true;
  for (const tipo of ENTIDADES) ccv[`ch_entity_${tipo}`] = true;
  MARKETPLACE_CONFIG.cardChipVisibility = ccv;

  const entidad = {
    challenge: 'Solicitante',
    case: 'Editor de prueba',
    pilot: 'Entidad Piloto',
    validation: 'Entidad Validacion',
    mentoring: null,
  };
  for (const [tipo, tab] of Object.entries(TABS)) {
    const card = cardDe(pintar(tab), CODIGOS[tipo]);
    assert.ok(card.includes('Revisado'), `${tipo}: falta la fecha`);
    if (entidad[tipo]) assert.ok(card.includes(entidad[tipo]), `${tipo}: falta la entidad`);
  }

  ccv.ch_reviewDate_case = false;
  ccv.ch_entity_case = false;
  const caso = cardDe(pintar('cases'), CODIGOS.case);
  assert.ok(!caso.includes('Revisado'), 'caso: la fecha debería estar oculta');
  assert.ok(!caso.includes('Editor de prueba'), 'caso: la entidad debería estar oculta');
  const reto = cardDe(pintar('challenges'), CODIGOS.challenge);
  assert.ok(reto.includes('Revisado'), 'reto: la fecha sigue visible');
  assert.ok(reto.includes('Solicitante'), 'reto: la entidad sigue visible');
});

test('si falta la clave nueva, la vista usa la antigua', () => {
  const { caso } = preparar();
  caso.classification.sdgs = ['3'];
  MARKETPLACE_CONFIG.cardChipVisibility = { ch_reviewDate: false, ch_entity: false };
  const oculto = cardDe(pintar('cases'), CODIGO_CASO);
  assert.ok(!oculto.includes('Revisado'), 'legacy false: fecha oculta');
  assert.ok(!oculto.includes('Editor de prueba'), 'legacy false: entidad oculta');

  MARKETPLACE_CONFIG.cardChipVisibility = { ch_reviewDate: true, ch_entity: true };
  const visible = cardDe(pintar('cases'), CODIGO_CASO);
  assert.ok(visible.includes('Revisado'), 'legacy true: fecha visible');
  assert.ok(visible.includes('Editor de prueba'), 'legacy true: entidad visible');
});
