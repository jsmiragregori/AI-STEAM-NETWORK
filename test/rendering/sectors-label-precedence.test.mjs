// QA-033 — Precedencia de la etiqueta de la evidencia destacada en la ficha de Sectores:
// la etiqueta específica del sector tiene prioridad; si falta o está vacía, se usa la
// genérica de Traducciones UI (clave sectors.exampleChallengeLabel). Sin cambio de
// comportamiento: esta prueba fija el que ya existe.
//
// La ficha y la genérica son fixtures propias. La genérica se inyecta en el objeto de
// traducciones y se restaura al terminar, así que no depende del texto editorial.

import assert from 'node:assert/strict';
import test from 'node:test';

globalThis.localStorage = { getItem(k) { return k === 'language' ? 'es' : null; }, setItem() {}, removeItem() {} };
globalThis.document = {
  documentElement: {},
  getElementById() { return null; },
  querySelector() { return null; },
  querySelectorAll() { return []; },
};
globalThis.window = { location: { hash: '' }, addEventListener() {}, scrollTo() {} };

const { SECTORS_CONFIG } = await import('../../assets/data/sectors.js');
const { translations } = await import('../../assets/data/translations.js');
const { setState } = await import('../../assets/js/state.js');
const vistas = await import('../../assets/js/views/index.js');

const L = (es) => ({ es, en: `${es} EN`, va: `${es} VA` });
const GENERICA = 'ETIQUETA-GENERICA-PRUEBA';
const ESPECIFICA = 'ETIQUETA-ESPECIFICA-PRUEBA';

function fichaDePrueba(exampleChallengeLabel) {
  return {
    id: 'fixture-sector',
    visible: true,
    name: L('Sector de prueba'),
    description: L('Descripción de prueba'),
    keywords: { es: [], en: [], va: [] },
    sections: {},
    stakeholderTypes: { es: [], en: [], va: [] },
    fpSkills: { es: [], en: [], va: [] },
    masterTopics: { es: [], en: [], va: [] },
    teacherRelevance: L('Relevancia de prueba'),
    stakeholderContribution: L('Aportación de prueba'),
    transferRouteIntro: L(''),
    transferChain: [],
    relatedContent: [],
    emptyFlags: {},
    featuredPartnerDetails: [],
    exampleChallenge: L('Evidencia de prueba'),
    exampleChallengeLabel,
    stats: { initiatives: 0, stakeholders: 0, courses: 0 },
    statsList: [],
    navigationTargets: {},
  };
}

// Extrae el título de la tarjeta de evidencia: el h4 que precede al texto de la evidencia.
function tituloDeEvidencia(html) {
  const m = html.match(/<h4 class="text-xl font-extrabold text-eu-purple">([^<]*)<\/h4>\s*<\/div>\s*<p class="mt-5 text-base italic/);
  assert.ok(m, 'no se pintó la tarjeta de evidencia');
  return m[1];
}

function renderConFicha(exampleChallengeLabel) {
  const prevCards = SECTORS_CONFIG.cardsBlock;
  const original = translations.es.sectors;
  const existed = Object.prototype.hasOwnProperty.call(translations.es, 'sectors');
  translations.es.sectors = { ...(original || {}), exampleChallengeLabel: GENERICA };
  SECTORS_CONFIG.cardsBlock = [fichaDePrueba(exampleChallengeLabel)];
  setState('expandedSector', 'fixture-sector');
  try {
    return vistas.sectores.render();
  } finally {
    SECTORS_CONFIG.cardsBlock = prevCards;
    setState('expandedSector', null);
    if (existed) translations.es.sectors = original;
    else delete translations.es.sectors;
  }
}

test('etiqueta específica presente: gana sobre la genérica', () => {
  const html = renderConFicha(L(ESPECIFICA));
  assert.equal(tituloDeEvidencia(html), ESPECIFICA);
  assert.ok(!html.includes(GENERICA), 'la genérica no debe aparecer si hay específica');
});

test('etiqueta específica ausente: se usa la genérica de Traducciones UI', () => {
  const html = renderConFicha(undefined);
  assert.equal(tituloDeEvidencia(html), GENERICA);
});

test('etiqueta específica nula: se usa la genérica', () => {
  const html = renderConFicha(null);
  assert.equal(tituloDeEvidencia(html), GENERICA);
});

test('etiqueta específica vacía en el idioma activo: se usa la genérica', () => {
  const html = renderConFicha({ es: '', en: 'English only', va: '' });
  assert.equal(tituloDeEvidencia(html), GENERICA);
});
