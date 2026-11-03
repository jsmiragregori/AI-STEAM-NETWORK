// G16 — Visibilidad y controles conectados de Sectores.
//
// QA-064: «Sección visible» oculta el bloque completo de tarjetas y mantiene
//         Hero y CTA.
// QA-066: los iconos Lucide de estadísticas son opcionales y se pintan de
//         forma segura.
// QA-067: «Descripción visible» oculta solo la descripción breve de la
//         cabecera de la tarjeta.
//
// Las fixtures son propias; no se fijan textos ni cifras del contenido real.

import assert from 'node:assert/strict';
import test from 'node:test';

globalThis.localStorage = {
  getItem(k) { return k === 'language' ? 'es' : null; },
  setItem() {},
  removeItem() {},
};
globalThis.document = {
  documentElement: {},
  getElementById() { return null; },
  querySelector() { return null; },
  querySelectorAll() { return []; },
};
globalThis.window = { location: { hash: '' }, addEventListener() {}, scrollTo() {} };

const { SECTORS_CONFIG } = await import('../../assets/data/sectors.js');
const { setState } = await import('../../assets/js/state.js');
const vistas = await import('../../assets/js/views/index.js');

const L = (es) => ({ es, en: `${es} EN`, va: `${es} VA` });

function heroFixture({ stats } = {}) {
  return {
    visible: true,
    title: L('HERO-FIXTURE'),
    description: L('HERO-DESC-FIXTURE'),
    stats: stats || [
      { id: 'visibleSectors', icon: 'rocket-hero', value: '7', label: L('HERO-STAT-FIXTURE') },
    ],
  };
}

function cardFixture({
  description = 'DESCRIPCION-FIXTURE',
  keywordsDescription = true,
  keywords = ['KW-FIXTURE'],
  statsList,
} = {}) {
  return {
    id: 'fixture-sector',
    visible: true,
    name: L('SECTOR-FIXTURE'),
    description: L(description),
    sections: { keywordsDescription, keywords: true },
    keywords: { es: keywords, en: keywords, va: keywords },
    stats: { initiatives: 4, stakeholders: 2, courses: 3 },
    statsList: statsList || [
      { id: 'initiatives', icon: 'rocket-card', value: 4, label: L('INICIATIVAS-FIXTURE') },
      { id: 'stakeholders', icon: 'users-card', value: 2, label: L('MIEMBROS-FIXTURE') },
      { id: 'courses', icon: 'book-card', value: 3, label: L('CURSOS-FIXTURE') },
    ],
    navigationTargets: {
      marketplace: { enabled: true },
      training: { enabled: true },
      network: { enabled: true },
    },
    transferChain: [],
    relatedContent: [],
    emptyFlags: {},
  };
}

function ctaFixture() {
  return {
    visible: true,
    title: L('CTA-FIXTURE'),
    description: L('CTA-DESC-FIXTURE'),
    buttonVisible: false,
    buttonLabel: L('CTA-BTN-FIXTURE'),
  };
}

function renderCon({ hero = heroFixture(), cards = { visible: true, sectors: [cardFixture()] }, cta = ctaFixture() } = {}) {
  const anterior = {
    hero: SECTORS_CONFIG.heroBlock,
    cards: SECTORS_CONFIG.cardsBlock,
    cta: SECTORS_CONFIG.ctaBlock,
  };
  SECTORS_CONFIG.heroBlock = hero;
  SECTORS_CONFIG.cardsBlock = cards;
  SECTORS_CONFIG.ctaBlock = cta;
  setState('expandedSector', null);
  try {
    return vistas.sectores.render();
  } finally {
    SECTORS_CONFIG.heroBlock = anterior.hero;
    SECTORS_CONFIG.cardsBlock = anterior.cards;
    SECTORS_CONFIG.ctaBlock = anterior.cta;
    setState('expandedSector', null);
  }
}

test('QA-064: con la sección oculta desaparecen las tarjetas y permanecen Hero y CTA', () => {
  const html = renderCon({ cards: { visible: false, sectors: [cardFixture()] } });

  assert.ok(html.includes('HERO-FIXTURE'), 'el hero permanece');
  assert.ok(html.includes('CTA-FIXTURE'), 'el CTA permanece');
  assert.ok(!html.includes('data-toggle="fixture-sector"'), 'no se pinta ninguna tarjeta');
  assert.ok(!html.includes('SECTOR-FIXTURE'), 'no viaja el contenido de las tarjetas');
  assert.ok(!html.includes('<section class="px-6 py-20">'), 'no queda la sección vacía de tarjetas');
});

test('QA-064: con la sección visible se pinta la tarjeta', () => {
  const html = renderCon({ cards: { visible: true, sectors: [cardFixture()] } });

  assert.ok(html.includes('data-toggle="fixture-sector"'));
  assert.ok(html.includes('SECTOR-FIXTURE'));
  assert.ok(html.includes('HERO-FIXTURE'));
  assert.ok(html.includes('CTA-FIXTURE'));
});

test('QA-064: la forma antigua (array) sigue siendo compatible', () => {
  const html = renderCon({ cards: [cardFixture()] });

  assert.ok(html.includes('data-toggle="fixture-sector"'));
});

test('QA-066: el icono del Hero y el de la tarjeta se pintan', () => {
  const html = renderCon();

  assert.ok(html.includes('data-lucide="rocket-hero"'), 'icono del hero');
  assert.ok(html.includes('data-lucide="rocket-card"'), 'icono de la estadística de tarjeta');
  assert.ok(html.includes('HERO-STAT-FIXTURE'));
  assert.ok(html.includes('INICIATIVAS-FIXTURE'));
});

test('QA-066: sin icono se muestran valor y etiqueta, sin iconos inventados', () => {
  const hero = heroFixture({
    stats: [{ id: 'visibleSectors', value: '7', label: L('HERO-SIN-ICONO') }],
  });
  const card = cardFixture({
    statsList: [{ id: 'initiatives', value: 4, label: L('TARJETA-SIN-ICONO') }],
  });
  const html = renderCon({ hero, cards: { visible: true, sectors: [card] } });

  assert.ok(html.includes('HERO-SIN-ICONO'));
  assert.ok(html.includes('TARJETA-SIN-ICONO'));
  assert.ok(!html.includes('data-lucide="undefined"'));
  assert.ok(!html.includes('data-lucide="null"'));
  assert.doesNotMatch(html, />undefined</);
  assert.doesNotMatch(html, />null</);
});

test('QA-066: el nombre del icono se escapa como atributo', () => {
  const hero = heroFixture({
    stats: [{ id: 'visibleSectors', icon: 'x" onload="alert(1)', value: '7', label: L('HERO-XSS') }],
  });
  const html = renderCon({ hero });

  assert.ok(html.includes('&quot;'), 'las comillas se escapan');
  assert.ok(!html.includes('onload="alert(1)"'), 'no se inyecta un atributo ejecutable');
});

test('QA-067: la descripción oculta no se pinta, pero el título y las etiquetas permanecen', () => {
  const html = renderCon({
    cards: { visible: true, sectors: [cardFixture({ keywordsDescription: false })] },
  });

  assert.ok(!html.includes('DESCRIPCION-FIXTURE'), 'la descripción breve desaparece');
  assert.ok(html.includes('SECTOR-FIXTURE'), 'el título permanece');
  assert.ok(html.includes('KW-FIXTURE'), 'las etiquetas permanecen');
});

test('QA-067: la descripción visible se pinta', () => {
  const html = renderCon({
    cards: { visible: true, sectors: [cardFixture({ keywordsDescription: true })] },
  });

  assert.ok(html.includes('DESCRIPCION-FIXTURE'));
});
