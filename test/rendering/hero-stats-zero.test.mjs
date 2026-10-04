// H1 (auditoría F3, 2026-10-04) — Ninguna estadística visible puede ocultar su
// cero. Se ponen a 0 todas las cifras de hero de las siete vistas principales y
// se comprueba que cada una pinta su «0» y su etiqueta; después se comprueba la
// ausencia de dato en Gobernanza. El defecto `value || ''` que ocultaba el cero
// hace fallar estas comprobaciones.

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

for (const [vista, config] of Object.entries(datos)) {
  test(`${vista}: todas las estadísticas muestran 0 y conservan su etiqueta`, () => {
    const html = vistas[vista].render();
    for (const stat of config.heroBlock.stats) {
      const etiqueta = stat.label?.es ?? '';
      if (etiqueta) assert.ok(html.includes(etiqueta), `${vista}: falta la etiqueta ${etiqueta}`);
    }
    const ceros = (html.match(/>0</g) || []).length;
    assert.ok(
      ceros >= config.heroBlock.stats.length,
      `${vista}: ceros visibles ${ceros}, se esperaban al menos ${config.heroBlock.stats.length}`,
    );
    assert.doesNotMatch(html, />undefined</);
    assert.doesNotMatch(html, />null</);
  });
}

test('gobernanza: la ausencia de dato deja el hueco vacío', () => {
  const stats = datos.gobernanza.heroBlock.stats;
  const original = stats[0].value;
  stats[0].value = undefined;
  const html = vistas.gobernanza.render();
  assert.doesNotMatch(html, />undefined</);
  assert.doesNotMatch(html, />null</);
  stats[0].value = original;
});
