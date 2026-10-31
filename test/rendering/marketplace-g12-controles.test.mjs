// G12 — controles mínimos con efecto público en las cards de Comunidad.
//
// Valida que el indicador de descargables de Validaciones y Mentorías responde
// a `presentation.card.showDownloadsIndicator`, que la card de Mentorías pinta
// las especialidades de todos los mentores (incluidos los adicionales) y que
// Casos y Pilotos no ganan un indicador que su card no pinta.
//
// Los datos se inyectan en memoria ítem a ítem y se restauran siempre; la
// prueba no escribe nada.

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

const { items: elementosDePartida, itemsByTab: porPestana } = elementosDePrueba();
MARKETPLACE_CONFIG.items = elementosDePartida;
MARKETPLACE_CONFIG.itemsByTab = porPestana;

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
  const encontrada = cards(html).find((card) => card.includes(code));
  assert.ok(encontrada, `no se encontró la card ${code}`);
  return encontrada;
}

function itemDe(tab, id) {
  const item = MARKETPLACE_CONFIG.itemsByTab[tab].find((i) => i.id === id);
  assert.ok(item, `no existe el elemento ${id} en ${tab}`);
  return item;
}

/** Cambia claves de un item mientras dura `fn` y las restaura siempre. */
function conItem(item, cambios, fn) {
  const previos = new Map(Object.keys(cambios).map((clave) => [clave, item[clave]]));
  Object.assign(item, cambios);
  try {
    return fn();
  } finally {
    for (const [clave, valor] of previos) {
      if (valor === undefined) delete item[clave];
      else item[clave] = valor;
    }
  }
}

const VALIDACION = 'validation-de-prueba-1';
const MENTORIA = 'mentoring-de-prueba-1';

function prepararValidacion(item, indicador) {
  return {
    validation: {
      objectTitle: { es: 'Objeto validado', en: 'Validated object', va: 'Objecte validat' },
      validationEnvironment: [],
    },
    presentation: { card: { showDecision: true, showDownloadsIndicator: indicador } },
    ownership: { proposer: { name: 'Entidad proponente' } },
    hasDownloads: true,
    downloadCount: 1,
    downloads: { enabled: true, items: [{ id: 'dl-1' }] },
  };
}

function prepararMentoria(item, indicador) {
  return {
    mentoringOffer: {
      purpose: { es: 'Propósito de prueba', en: 'Test purpose', va: 'Propòsit de prova' },
      format: { sessions: [], availability: { es: 'Disponible', en: 'Available', va: 'Disponible' } },
    },
    mentors: {
      items: [
        { id: 'mentor-1', name: 'Mentora principal', specialties: ['responsible-ai'] },
        { id: 'mentor-2', name: 'Mentor adicional', specialties: ['Especialidad adicional'] },
      ],
    },
    presentation: {
      card: {
        showPurpose: true, showProvider: true, showSpecialties: true,
        showAvailability: true, showDownloadsIndicator: indicador,
      },
    },
    ownership: { mentoringTeam: { name: { es: 'Equipo mentor', en: 'Mentoring team', va: 'Equip mentor' } } },
    hasDownloads: true,
    downloadCount: 1,
    cardDownloads: [{ id: 'dl-1', showOnCard: true }],
    downloads: { enabled: true, items: [{ id: 'dl-1' }] },
  };
}

test('G12 Validaciones muestra u oculta «1 descargable» según el flag de card', () => {
  const item = itemDe('validations', VALIDACION);
  const sinIndicador = conItem(item, prepararValidacion(item, false), () => cardDe(pintar('validations'), item.code));
  assert.ok(!/descargable/i.test(sinIndicador), 'con el flag apagado no debe aparecer el indicador');

  const conIndicador = conItem(item, prepararValidacion(item, true), () => cardDe(pintar('validations'), item.code));
  assert.ok(/1 descargable/i.test(conIndicador), 'con el flag encendido debe aparecer «1 descargable»');
});

test('G12 Mentorías muestra u oculta el indicador y pinta las especialidades adicionales', () => {
  const item = itemDe('mentorings', MENTORIA);
  const sinIndicador = conItem(item, prepararMentoria(item, false), () => cardDe(pintar('mentorings'), item.code));
  assert.ok(!/descargable/i.test(sinIndicador), 'con el flag apagado no debe aparecer el indicador');
  assert.ok(sinIndicador.includes('Especialidad adicional'), 'debe pintar la especialidad del mentor adicional');

  const conIndicador = conItem(item, prepararMentoria(item, true), () => cardDe(pintar('mentorings'), item.code));
  assert.ok(/1 descargable/i.test(conIndicador), 'con el flag encendido debe aparecer «1 descargable»');
  assert.ok(conIndicador.includes('Especialidad adicional'), 'debe conservar la especialidad adicional');
});

test('G12 Casos y Pilotos no pintan un indicador de descargables', () => {
  for (const [tab, id] of [['cases', 'case-de-prueba-1'], ['pilots', 'pilot-de-prueba-1']]) {
    const item = itemDe(tab, id);
    const card = conItem(item, {
      presentation: { card: { showDownloadsIndicator: true } },
      hasDownloads: true,
      downloadCount: 1,
      downloads: { enabled: true, items: [{ id: 'dl-1' }] },
    }, () => cardDe(pintar(tab), item.code));
    assert.ok(!/descargable/i.test(card), `${tab}: la card no debe mostrar el indicador`);
  }
});
