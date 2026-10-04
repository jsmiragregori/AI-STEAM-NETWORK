// H1 (auditoría F3 bis, 2026-10-04) — Composición externa sin cajas:
// Inicio no reserva la segunda columna cuando no queda ninguna estadística y
// la hélice de Red reparte sus ejes visibles sin columnas vacías (0–4), con
// los márgenes exclusivos de la rejilla desaparecida retirados.
// Debe fallar con la implementación anterior (VANILLA 3069eab): el padre del
// hero conservaba `lg:grid-cols-2` y la hélice `grid-cols-2 md:grid-cols-4`
// con menos ejes, y su descripción conservaba `mb-6` sin rejilla.

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

const { HOME_CONFIG } = await import('../../assets/data/home.js');
const { NETWORK_CONFIG } = await import('../../assets/data/network.js');
const vistas = await import('../../assets/js/views/index.js');

const L = (es) => ({ es, en: `${es} EN`, va: `${es} VA` });

// ── Inicio ────────────────────────────────────────────────────────────────────

function conHomeStats(stats, fn) {
  const prev = HOME_CONFIG.heroBlock.stats;
  HOME_CONFIG.heroBlock.stats = stats;
  try {
    return fn();
  } finally {
    HOME_CONFIG.heroBlock.stats = prev;
  }
}

function clasesPadreHero(html) {
  const match = html.match(/<div class="max-w-7xl mx-auto w-full grid ([^"]*)">/);
  assert.ok(match, 'no se encontró el contenedor externo del hero de Inicio');
  return match[1];
}

test('inicio: sin cajas no queda la columna reservada del layout externo', () => {
  const stats = [
    { id: 'a', value: 0, icon: 'zap', label: L('A') },
    { id: 'b', value: ' 0 ', icon: 'zap', label: L('B') },
    { id: 'c', value: 0, icon: 'zap', label: L('C') },
  ];
  const html = conHomeStats(stats, () => vistas.inicio.render());
  const clases = clasesPadreHero(html);
  assert.ok(!clases.includes('lg:grid-cols-2'), `el padre sigue reservando dos columnas: ${clases}`);
  assert.ok(clases.includes('grid-cols-1'), `el padre debe quedar a una columna: ${clases}`);
  assert.match(html, /<h1/, 'el hero y su contenido deben seguir');
  assert.equal((html.match(/rd-hero-stat\b/g) || []).length, 0);
});

test('inicio: con cajas visibles el padre conserva sus dos columnas', () => {
  const stats = [
    { id: 'a', value: 5, icon: 'zap', label: L('A') },
    { id: 'b', value: 0, icon: 'zap', label: L('B') },
    { id: 'c', value: 9, icon: 'zap', label: L('C') },
  ];
  const html = conHomeStats(stats, () => vistas.inicio.render());
  const clases = clasesPadreHero(html);
  assert.ok(clases.includes('lg:grid-cols-2'), `el padre debe conservar dos columnas cuando hay cajas: ${clases}`);
  assert.equal((html.match(/rd-hero-stat\b/g) || []).length, 2);
});

test('inicio: la transición 0→positivo→0 recupera y retira la columna externa', () => {
  const stats = [{ id: 'a', value: 0, icon: 'zap', label: L('A') }];
  const conCero = clasesPadreHero(conHomeStats(stats, () => vistas.inicio.render()));
  assert.ok(!conCero.includes('lg:grid-cols-2'));
  stats[0].value = 4;
  const conPositivo = clasesPadreHero(conHomeStats(stats, () => vistas.inicio.render()));
  assert.ok(conPositivo.includes('lg:grid-cols-2'));
  stats[0].value = 0;
  const otraVez = clasesPadreHero(conHomeStats(stats, () => vistas.inicio.render()));
  assert.ok(!otraVez.includes('lg:grid-cols-2'));
});

// ── Hélice de Red ─────────────────────────────────────────────────────────────

const CATS = [
  { id: 'universidad', icon: 'graduation-cap', value: 10, computedValue: 10, partnersCount: 0, stakeholdersCount: 0, label: L('CAT-UNI') },
  { id: 'empresa', icon: 'building-2', value: 7, computedValue: 7, partnersCount: 0, stakeholdersCount: 0, label: L('CAT-EMP') },
  { id: 'admin', icon: 'landmark', value: 5, computedValue: 5, partnersCount: 0, stakeholdersCount: 0, label: L('CAT-ADM') },
  { id: 'sociedad', icon: 'users', value: 4, computedValue: 4, partnersCount: 0, stakeholdersCount: 0, label: L('CAT-SOC') },
];

function conHelix(cats, fn) {
  const prev = NETWORK_CONFIG.helixBlock.categories;
  NETWORK_CONFIG.helixBlock.categories = cats;
  try {
    return fn();
  } finally {
    NETWORK_CONFIG.helixBlock.categories = prev;
  }
}

/** Clases de la rejilla de la hélice; null si no hay rejilla. */
function rejillaHelix(html) {
  const match = html.match(/(<div class="grid ([^"]+) gap-4">)/);
  if (!match) return null;
  const start = match.index + match[1].length;
  // Empareja el cierre del div de la rejilla para medir solo su contenido.
  let depth = 1;
  let i = start;
  let end = -1;
  while (i < html.length && depth > 0) {
    const nextOpen = html.indexOf('<div', i);
    const nextClose = html.indexOf('</div>', i);
    if (nextClose === -1) break;
    if (nextOpen !== -1 && nextOpen < nextClose) { depth += 1; i = nextOpen + 4; }
    else { depth -= 1; i = nextClose + 6; if (depth === 0) end = nextClose; }
  }
  return { clases: match[2], contenido: end === -1 ? '' : html.slice(start, end) };
}

function tarjetasHelix(html) {
  const rejilla = rejillaHelix(html);
  if (!rejilla) return null;
  return rejilla.contenido.match(/rd-card-grad-violet rd-card-edge p-5 text-center group/g) || [];
}

test('hélice: 4 ejes conserva la distribución actual', () => {
  const html = conHelix(CATS, () => vistas.red.render());
  assert.equal(rejillaHelix(html).clases, 'grid-cols-2 md:grid-cols-4');
  assert.equal(tarjetasHelix(html).length, 4);
});

test('hélice: 1, 2 y 3 ejes reparten solo las columnas visibles', () => {
  const casos = [
    [1, 'grid-cols-1'],
    [2, 'grid-cols-2'],
    [3, 'grid-cols-2 md:grid-cols-3'],
  ];
  for (const [n, esperado] of casos) {
    const html = conHelix(CATS.slice(0, n), () => vistas.red.render());
    assert.equal(rejillaHelix(html).clases, esperado, `con ${n} ejes`);
    assert.equal(tarjetasHelix(html).length, n, `con ${n} ejes`);
    assert.equal((rejillaHelix(html).contenido.match(/CAT-UNI|CAT-EMP|CAT-ADM|CAT-SOC/g) || []).length, n, `con ${n} ejes`);
  }
});

test('hélice: 0 ejes sin rejilla y sin el margen exclusivo de la rejilla', () => {
  const html = conHelix(CATS.map((c) => ({ ...c, value: 0, computedValue: 0 })), () => vistas.red.render());
  assert.equal(rejillaHelix(html), null, 'no debe quedar rejilla sin ejes');
  assert.ok(!html.includes('text-lg text-gray-600 mb-6 leading-relaxed'), 'la descripción conserva el margen exclusivo de la rejilla');
  assert.match(html, /text-lg text-gray-600 leading-relaxed/, 'la descripción sigue, sin el hueco de la rejilla');
  assert.match(html, /Modelo de Cuádruple Hélice/, 'el título de la sección se conserva');
});

test('hélice: un eje oculto editorialmente no cuenta ni reserva su columna', () => {
  const cats = CATS.map((c, i) => (i === 2 ? { ...c, visible: false } : c));
  const html = conHelix(cats, () => vistas.red.render());
  assert.equal(rejillaHelix(html).clases, 'grid-cols-2 md:grid-cols-3', 'con 3 ejes visibles');
  assert.equal(tarjetasHelix(html).length, 3, 'el eje oculto no se pinta');
  assert.ok(!rejillaHelix(html).contenido.includes('CAT-ADM'), 'el eje oculto no aparece en la rejilla');
});

test('hélice: transición cero → positivo → cero del mismo eje', () => {
  const cats = CATS.map((c) => ({ ...c }));
  assert.equal(rejillaHelix(conHelix(cats, () => vistas.red.render())).clases, 'grid-cols-2 md:grid-cols-4');
  cats[3].value = 0;
  assert.equal(rejillaHelix(conHelix(cats, () => vistas.red.render())).clases, 'grid-cols-2 md:grid-cols-3');
  cats[3].value = 4;
  assert.equal(rejillaHelix(conHelix(cats, () => vistas.red.render())).clases, 'grid-cols-2 md:grid-cols-4');
});

test('hélice: override editorial a cero oculta y su vuelta a positivo reaparece', () => {
  const cats = CATS.map((c) => ({ ...c }));
  cats[1] = { ...cats[1], manualOverride: true, value: 0, computedValue: 7 };
  assert.equal(rejillaHelix(conHelix(cats, () => vistas.red.render())).clases, 'grid-cols-2 md:grid-cols-3');
  cats[1] = { ...cats[1], value: 7 };
  assert.equal(rejillaHelix(conHelix(cats, () => vistas.red.render())).clases, 'grid-cols-2 md:grid-cols-4');
});
