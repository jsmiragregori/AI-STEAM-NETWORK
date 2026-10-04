// F3 bis (2026-10-04) — Todas las cifras de hero a cero: ninguna caja se
// renderiza, no queda rejilla ni hueco, y la sección sigue en pie. Sustituye
// las aserciones de la corrección H1 (auditoría F3) que exigían el cero
// visible: la cifra en datos sigue siendo cero; lo que cambia es solo su
// presentación (regla común en `utils/stat-visibility.js`).

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

const datos = {
  inicio: (await import('../../assets/data/home.js')).HOME_CONFIG,
  red: (await import('../../assets/data/network.js')).NETWORK_CONFIG,
  sectores: (await import('../../assets/data/sectors.js')).SECTORS_CONFIG,
  bancoRetos: (await import('../../assets/data/marketplace.js')).MARKETPLACE_CONFIG,
  formacion: (await import('../../assets/data/training.js')).TRAINING_CONFIG,
  conocimiento: (await import('../../assets/data/knowledge.js')).KNOWLEDGE_CONFIG,
  gobernanza: (await import('../../assets/data/governance.js')).GOVERNANCE_CONFIG,
};

for (const [vista, config] of Object.entries(datos)) {
  const stats = config.heroBlock?.stats || [];
  assert.ok(stats.length > 0, `${vista}: sin estadísticas de hero para probar`);
  for (const stat of stats) stat.value = 0;
}

const vistas = await import('../../assets/js/views/index.js');
const news = await import('../../assets/js/views/news.js');

for (const [vista, config] of Object.entries(datos)) {
  test(`${vista}: hero a cero sin cajas, sin contenedor y con la sección en pie`, () => {
    const html = vistas[vista].render();
    assert.equal((html.match(/rd-hero-stat\b/g) || []).length, 0, `${vista}: alguna caja a cero sigue pintada`);
    assert.ok(!html.includes('rd-hero-stats-grid'), `${vista}: el contenedor de la rejilla sigue presente`);
    assert.match(html, /<h1/, `${vista}: la sección desapareció con las estadísticas`);
    // La fuente no se toca: las cifras siguen siendo cero.
    for (const stat of config.heroBlock.stats) assert.equal(stat.value, 0);
    assert.doesNotMatch(html, />undefined</);
    assert.doesNotMatch(html, />null</);
  });
}

test('news: hero a cero sin cajas, sin rejilla y con la vista completa', async () => {
  const datosNewsStats = (await import('../../assets/data/news.js')).NEWS_CONFIG.heroBlock.stats;
  for (const stat of datosNewsStats) stat.value = 0;
  const html = news.render();
  assert.equal((html.match(/rd-hero-stat\b/g) || []).length, 0);
  assert.ok(!html.includes('rd-hero-stats-grid'));
  assert.ok(html.length > 200);
});
