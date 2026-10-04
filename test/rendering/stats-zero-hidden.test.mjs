// F3 bis (P-66, 2026-10-04) — Contrato de la regla común de estadísticas a
// cero: helper puro, render por vista, overrides, ocultación editorial y
// transición 0 → positivo → 0. La caja a cero no existe en el DOM (sin número,
// etiqueta, foco ni hueco) y el dato no se modifica. La ausencia
// (null/undefined/'') no es cero y conserva el comportamiento previo.

import assert from 'node:assert/strict';
import test from 'node:test';

import { filterVisibleStats, isZeroStatValue } from '../../assets/js/utils/stat-visibility.js';

globalThis.localStorage = { getItem(k) { return k === 'language' ? 'es' : null; }, setItem() {}, removeItem() {} };
globalThis.document = {
  documentElement: {},
  getElementById() { return null; },
  querySelector() { return null; },
  querySelectorAll() { return []; },
};
globalThis.window = { location: { hash: '' }, addEventListener() {}, scrollTo() {} };

const { HOME_CONFIG } = await import('../../assets/data/home.js');
const { NETWORK_CONFIG } = await import('../../assets/data/network.js');
const { SECTORS_CONFIG } = await import('../../assets/data/sectors.js');
const { MARKETPLACE_CONFIG } = await import('../../assets/data/marketplace.js');
const { TRAINING_CONFIG } = await import('../../assets/data/training.js');
const { KNOWLEDGE_CONFIG } = await import('../../assets/data/knowledge.js');
const { GOVERNANCE_CONFIG } = await import('../../assets/data/governance.js');
const { NEWS_CONFIG } = await import('../../assets/data/news.js');

const vistas = await import('../../assets/js/views/index.js');
const newsView = await import('../../assets/js/views/news.js');

const L = (es) => ({ es, en: `${es} EN`, va: `${es} VA` });

// ── Helper puro ───────────────────────────────────────────────────────────────

test('isZeroStatValue: solo el cero numérico o su cadena numérica', () => {
  for (const cero of [0, -0, '0', ' 0 ', '0.0', '0e0', '00', '-0']) {
    assert.equal(isZeroStatValue(cero), true, `debería ser cero: ${JSON.stringify(cero)}`);
  }
  for (const noCero of [1, -1, 0.5, '0+', '0,0', '', '   ', null, undefined, false, NaN, 'x', '10']) {
    assert.equal(isZeroStatValue(noCero), false, `no debería ser cero: ${JSON.stringify(noCero)}`);
  }
});

test('filterVisibleStats: oculta cero y visible:false; conserva lo demás sin mutar la lista', () => {
  const stats = [
    { id: 'a', value: 0 },
    { id: 'b', value: ' 0 ' },
    { id: 'c', value: 3 },
    { id: 'd', value: 5, visible: false },
    { id: 'e', value: undefined },
    { id: 'f', value: null },
    { id: 'g', value: '' },
    { id: 'h', value: false },
    { id: 'i', value: '0+' },
  ];
  assert.deepEqual(filterVisibleStats(stats).map((s) => s.id), ['c', 'e', 'f', 'g', 'h', 'i']);
  assert.equal(stats.length, 9, 'la lista de entrada no se muta');
  assert.deepEqual(filterVisibleStats(null), []);
  assert.deepEqual(filterVisibleStats(undefined), []);
});

// ── Render por vista: mezcla, ocultación editorial y transición ──────────────

const HERO_VIEWS = [
  ['inicio', HOME_CONFIG, () => vistas.inicio.render()],
  ['red', NETWORK_CONFIG, () => vistas.red.render()],
  ['sectores', SECTORS_CONFIG, () => vistas.sectores.render()],
  ['bancoRetos', MARKETPLACE_CONFIG, () => vistas.bancoRetos.render()],
  ['formacion', TRAINING_CONFIG, () => vistas.formacion.render()],
  ['conocimiento', KNOWLEDGE_CONFIG, () => vistas.conocimiento.render()],
  ['gobernanza', GOVERNANCE_CONFIG, () => vistas.gobernanza.render()],
  ['noticias', NEWS_CONFIG, () => newsView.render()],
];

const VALORES = {
  inicio: (html) => [...html.matchAll(/<div class="text-4xl font-extrabold text-white leading-none mb-2">([^<]*)<\/div>/g)].map((m) => m[1]),
  red: (html) => [...html.matchAll(/<p class="text-3xl font-extrabold text-white leading-none">([^<]*)<\/p>/g)].map((m) => m[1]),
  sectores: (html) => [...html.matchAll(/<p class="text-4xl font-extrabold text-white">([^<]*)<\/p>/g)].map((m) => m[1]),
  bancoRetos: (html) => [...html.matchAll(/<p class="text-4xl font-extrabold leading-none text-white">([^<]*)<\/p>/g)].map((m) => m[1]),
  formacion: (html) => [...html.matchAll(/<p class="text-4xl font-extrabold text-white">([^<]*)<\/p>/g)].map((m) => m[1]),
  conocimiento: (html) => [...html.matchAll(/<p class="text-3xl font-extrabold text-white leading-none">([^<]*)<\/p>/g)].map((m) => m[1]),
  gobernanza: (html) => [...html.matchAll(/<p class="text-3xl font-extrabold text-white leading-tight">([^<]*)<\/p>/g)].map((m) => m[1]),
  noticias: (html) => [...html.matchAll(/<p class="text-3xl font-extrabold text-white leading-none">([^<]*)<\/p>/g)].map((m) => m[1]),
};

function conHeroStats(config, stats, fn) {
  const prev = config.heroBlock.stats;
  config.heroBlock.stats = stats;
  try {
    return fn();
  } finally {
    config.heroBlock.stats = prev;
  }
}

for (const [nombre, config, render] of HERO_VIEWS) {
  test(`${nombre}: la mezcla pinta solo los elegibles, en orden, sin tocar datos`, () => {
    const stats = [
      { id: 'x1', value: 0, icon: 'zap', label: L('ETIQUETA-CERO') },
      { id: 'x2', value: 7, icon: 'zap', label: L('ETIQUETA-SIETE') },
      { id: 'x3', value: ' 0 ', icon: 'zap', label: L('ETIQUETA-CERO-TEXTO') },
      { id: 'x4', value: 13, icon: 'zap', label: L('ETIQUETA-TRECE') },
    ];
    const html = conHeroStats(config, stats, render);
    assert.deepEqual(VALORES[nombre](html), ['7', '13'], `${nombre}: cifras visibles`);
    assert.ok(html.includes('ETIQUETA-SIETE'), `${nombre}: falta la etiqueta del positivo`);
    assert.ok(html.includes('ETIQUETA-TRECE'), `${nombre}: falta la etiqueta del positivo`);
    assert.ok(!html.includes('ETIQUETA-CERO'), `${nombre}: se coló una etiqueta a cero`);
    assert.deepEqual(stats.map((s) => s.value), [0, 7, ' 0 ', 13], `${nombre}: los datos se alteraron`);
  });

  test(`${nombre}: transición 0 → positivo → 0 sin cambiar flags`, () => {
    const stat = { id: 't', value: 0, icon: 'zap', label: L('TRANSICION') };
    assert.deepEqual(VALORES[nombre](conHeroStats(config, [stat], render)), [], `${nombre}: con cero no hay caja`);
    stat.value = 9;
    assert.deepEqual(VALORES[nombre](conHeroStats(config, [stat], render)), ['9'], `${nombre}: reaparece con el positivo`);
    stat.value = 0;
    assert.deepEqual(VALORES[nombre](conHeroStats(config, [stat], render)), [], `${nombre}: vuelve a desaparecer`);
    assert.deepEqual(stat, { id: 't', value: 0, icon: 'zap', label: L('TRANSICION') }, `${nombre}: ningún flag cambió`);
  });

  test(`${nombre}: una estadística oculta por el editor no reaparece aunque sea positiva`, () => {
    const stats = [
      { id: 'oculta', value: 99, visible: false, icon: 'zap', label: L('OCULTA-EDITOR') },
      { id: 'visible', value: 4, icon: 'zap', label: L('VISIBLE') },
    ];
    const html = conHeroStats(config, stats, render);
    assert.deepEqual(VALORES[nombre](html), ['4'], `${nombre}: solo el visible`);
    assert.ok(!html.includes('OCULTA-EDITOR'), `${nombre}: la oculta por el editor apareció`);
  });
}

test('inicio: sin cajas a cero desaparece la rejilla; con mezcla no hay hueco y el impar ocupa la fila', () => {
  const stats = [
    { id: 'a', value: 0, icon: 'zap', label: L('A') },
    { id: 'b', value: 4, icon: 'zap', label: L('B') },
    { id: 'c', value: 9, icon: 'zap', label: L('C') },
    { id: 'd', value: 0, icon: 'zap', label: L('D') },
    { id: 'e', value: 7, icon: 'zap', label: L('E') },
    { id: 'f', value: 0, icon: 'zap', label: L('F') },
  ];
  const html = conHeroStats(HOME_CONFIG, stats, () => vistas.inicio.render());
  assert.deepEqual(VALORES.inicio(html), ['4', '9', '7']);
  assert.equal((html.match(/grid-column:1 \/ -1/g) || []).length, 1, 'el último impar ocupa la fila completa');
  assert.ok(html.includes('grid grid-cols-2 gap-5'), 'la rejilla sigue para los visibles');
});

test('sectores: el hero ausente no pinta rejilla y la cifra cero de la cadena tampoco', () => {
  const stats = [
    { id: 'visibleSectors', icon: 'Layers', value: '0', label: L('CERO') },
    { id: 'initiatives', icon: 'Zap', value: '0+', label: L('CERO DECORADO') },
    { id: 'sectorizedStakeholders', icon: 'Users', value: ' 0 ', label: L('CERO ESPACIOS') },
    { id: 'sectorLinkedCourses', icon: 'BookOpen', value: '7', label: L('SIETE') },
  ];
  const html = conHeroStats(SECTORS_CONFIG, stats, () => vistas.sectores.render());
  assert.deepEqual(VALORES.sectores(html), ['0+', '7'], 'solo los no cero del contrato');
  assert.ok(!html.includes('>CERO<'), 'una etiqueta a cero se coló');
  assert.ok(html.includes('rd-hero-stats-grid'), 'quedan visibles: la rejilla sigue');
});

// ── Overrides ─────────────────────────────────────────────────────────────────

test('inicio: override positivo con cálculo cero permanece visible', () => {
  const stats = [{ id: 'stakeholders', value: 7, manualOverride: true, computedValue: 0, icon: 'users', label: L('OVERRIDE+') }];
  const html = conHeroStats(HOME_CONFIG, stats, () => vistas.inicio.render());
  assert.deepEqual(VALORES.inicio(html), ['7']);
});

test('inicio: override cero con cálculo positivo se oculta y los datos no se alteran', () => {
  const stats = [{ id: 'stakeholders', value: 0, manualOverride: true, computedValue: 5, icon: 'users', label: L('OVERRIDE0') }];
  const html = conHeroStats(HOME_CONFIG, stats, () => vistas.inicio.render());
  assert.deepEqual(VALORES.inicio(html), []);
  assert.equal(stats[0].computedValue, 5);
  assert.equal(stats[0].value, 0);
});

test('bancoRetos: el valor efectivo manda sobre realValue (override positivo, cero y ausente)', () => {
  const stats = [
    { id: 'mentorings', visible: true, value: 5, realValue: 0, valueOverride: 5, label: L('OVERRIDE+') },
    { id: 'challenges', visible: true, value: 0, realValue: 8, valueOverride: 0, label: L('OVERRIDE0') },
    { id: 'pilots', visible: true, value: 3, realValue: 3, valueOverride: null, label: L('SIN-OVERRIDE') },
  ];
  const html = conHeroStats(MARKETPLACE_CONFIG, stats, () => vistas.bancoRetos.render());
  assert.deepEqual(VALORES.bancoRetos(html), ['5', '3']);
});

// ── Fichas de Sectores ────────────────────────────────────────────────────────

function conCardStats(card, statsList, fn) {
  const prev = card.statsList;
  card.statsList = statsList;
  try {
    return fn();
  } finally {
    card.statsList = prev;
  }
}

function articleDe(html, id) {
  const marca = html.indexOf(`data-toggle="${id}"`);
  assert.ok(marca > 0, `no se encontró la ficha ${id}`);
  const apertura = html.lastIndexOf('<article', marca);
  const cierre = html.indexOf('</article>', marca);
  return html.slice(apertura, cierre);
}

function botonesDe(article) {
  return [...article.matchAll(/<span class="block text-3xl font-extrabold[^"]*">([^<]*)<\/span>/g)].map((m) => m[1]);
}

test('ficha sectorial con tres contadores cero: sin cajas, sin contenedor y ficha viva', () => {
  const card = SECTORS_CONFIG.cardsBlock[0];
  const statsList = [
    { id: 'initiatives', value: 0, label: L('INICIATIVAS') },
    { id: 'stakeholders', value: '0', label: L('STAKEHOLDERS') },
    { id: 'courses', value: 0, label: L('CURSOS') },
  ];
  const html = conCardStats(card, statsList, () => vistas.sectores.render());
  const article = articleDe(html, card.id);
  assert.deepEqual(botonesDe(article), []);
  assert.ok(!article.includes('md:w-[24rem]'), 'el contenedor de cifras sigue reservando hueco');
  assert.ok(article.includes(`data-toggle="${card.id}"`), 'la ficha sigue navegable');
  assert.ok(article.includes('Fabricación'), 'el título de la ficha sigue presente');
  assert.deepEqual(statsList.map((s) => s.value), [0, '0', 0], 'los datos no se alteraron');
});

test('ficha sectorial en mezcla: solo positivos, en orden, sin huecos y con columnas ajustadas', () => {
  const card = SECTORS_CONFIG.cardsBlock[0];
  const statsList = [
    { id: 'initiatives', value: 0, label: L('INICIATIVAS') },
    { id: 'stakeholders', value: 5, label: L('CINCO') },
    { id: 'courses', value: '0.0', label: L('CURSOS') },
    { id: 'extra', value: 9, visible: false, label: L('OCULTA') },
  ];
  const html = conCardStats(card, statsList, () => vistas.sectores.render());
  const article = articleDe(html, card.id);
  assert.deepEqual(botonesDe(article), ['5']);
  assert.ok(article.includes('CINCO'));
  assert.ok(!article.includes('OCULTA'));
  assert.ok(article.includes('md:w-[24rem]'), 'queda un positivo: el contenedor sigue');
  assert.match(article, /grid-template-columns: repeat\(1, minmax\(0, 1fr\)\)/, 'una columna para un positivo');
});

test('ficha sectorial: transición 0 → positivo → 0 sin tocar flags', () => {
  const card = SECTORS_CONFIG.cardsBlock[0];
  const statsList = [{ id: 'initiatives', value: 0, label: L('TRANSICION') }];
  const render = () => vistas.sectores.render();
  assert.deepEqual(botonesDe(articleDe(conCardStats(card, statsList, render), card.id)), []);
  statsList[0].value = 6;
  assert.deepEqual(botonesDe(articleDe(conCardStats(card, statsList, render), card.id)), ['6']);
  statsList[0].value = 0;
  assert.deepEqual(botonesDe(articleDe(conCardStats(card, statsList, render), card.id)), []);
});

test('ficha sectorial: la ausencia de dato conserva su comportamiento previo (hueco «0»)', () => {
  const card = SECTORS_CONFIG.cardsBlock[0];
  const statsList = [{ id: 'initiatives', label: L('SIN-DATO') }];
  const html = conCardStats(card, statsList, () => vistas.sectores.render());
  const article = articleDe(html, card.id);
  assert.deepEqual(botonesDe(article), ['0']);
  assert.doesNotMatch(article, />undefined</);
  assert.doesNotMatch(article, />null</);
});

// ── Ausencia en heroes ────────────────────────────────────────────────────────

test('gobernanza: la ausencia de dato pinta el hueco vacío (no es cero)', () => {
  const stats = [{ id: 'sin-dato', label: L('SIN-DATO') }];
  const html = conHeroStats(GOVERNANCE_CONFIG, stats, () => vistas.gobernanza.render());
  assert.deepEqual(VALORES.gobernanza(html), ['']);
  assert.doesNotMatch(html, />undefined</);
  assert.doesNotMatch(html, />null</);
});

test('inicio: cadena vacía y false no se clasifican como cero', () => {
  const stats = [
    { id: 'a', value: '', icon: 'zap', label: L('VACIA') },
    { id: 'b', value: false, icon: 'zap', label: L('FALSE') },
    { id: 'c', value: 0, icon: 'zap', label: L('CERO') },
  ];
  const html = conHeroStats(HOME_CONFIG, stats, () => vistas.inicio.render());
  assert.deepEqual(VALORES.inicio(html), ['', 'false']);
  assert.doesNotMatch(html, />undefined</);
  assert.doesNotMatch(html, />null</);
});
