// QA-018 (portada) — Un dato ausente (null, undefined, cadena vacía o solo espacios)
// no es una cifra: la portada no pinta caja, ni número ni etiqueta. El cero sigue
// ocultándose y la cifra positiva sigue viéndose. Fixtures propias: no se fijan
// cifras ni textos del contenido real.

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
const { isAbsentStatValue } = await import('../../assets/js/utils/stat-visibility.js');
const vistas = await import('../../assets/js/views/index.js');

const L = (es) => ({ es, en: `${es} EN`, va: `${es} VA` });
const CIFRAS_PORTADA = (html) => [...html.matchAll(/<div class="text-4xl font-extrabold text-white leading-none mb-2">([^<]*)<\/div>/g)].map((m) => m[1]);

function conHeroStats(stats, fn) {
  const prev = HOME_CONFIG.heroBlock.stats;
  HOME_CONFIG.heroBlock.stats = stats;
  try {
    return fn();
  } finally {
    HOME_CONFIG.heroBlock.stats = prev;
  }
}

test('isAbsentStatValue: ausente es null, undefined, cadena vacía o solo espacios; cero y false no lo son', () => {
  for (const ausente of [null, undefined, '', '   ', '\t']) {
    assert.equal(isAbsentStatValue(ausente), true, `debería ser ausente: ${JSON.stringify(ausente)}`);
  }
  for (const presente of [0, '0', ' 0 ', 7, '7', false, 'x']) {
    assert.equal(isAbsentStatValue(presente), false, `no debería ser ausente: ${JSON.stringify(presente)}`);
  }
});

test('portada: pinta solo las cifras presentes y positivas; ausente y cero no dejan caja', () => {
  const stats = [
    { id: 'n', value: null, icon: 'zap', label: L('NULA') },
    { id: 'u', icon: 'zap', label: L('INDEFINIDA') },
    { id: 'v', value: '', icon: 'zap', label: L('VACIA') },
    { id: 's', value: '   ', icon: 'zap', label: L('ESPACIOS') },
    { id: 'c', value: 0, icon: 'zap', label: L('CERO') },
    { id: 'p', value: 12, icon: 'zap', label: L('POSITIVA') },
  ];
  const html = conHeroStats(stats, () => vistas.inicio.render());

  assert.deepEqual(CIFRAS_PORTADA(html), ['12']);
  assert.ok(html.includes('POSITIVA'), 'la etiqueta de la cifra positiva sigue');
  for (const oculta of ['NULA', 'INDEFINIDA', 'VACIA', 'ESPACIOS', 'CERO']) {
    assert.ok(!html.includes(oculta), `se coló la caja de ${oculta}`);
  }
  assert.doesNotMatch(html, />null</);
  assert.doesNotMatch(html, />undefined</);
});

test('portada: con solo datos ausentes no queda rejilla de cifras', () => {
  const stats = [
    { id: 'n', value: null, icon: 'zap', label: L('NULA') },
    { id: 'v', value: '', icon: 'zap', label: L('VACIA') },
  ];
  const html = conHeroStats(stats, () => vistas.inicio.render());

  assert.deepEqual(CIFRAS_PORTADA(html), []);
  assert.ok(!html.includes('rd-hero-stat'), 'no debe haber ninguna caja');
  assert.ok(!html.includes('grid grid-cols-2 gap-5'), 'la rejilla desaparece sin cajas');
  assert.match(html, /<h1/, 'la sección sigue en pie');
});

test('portada: el dato ausente no cambia la fuente de datos', () => {
  const stats = [{ id: 'n', value: null, icon: 'zap', label: L('NULA') }];
  conHeroStats(stats, () => vistas.inicio.render());

  assert.equal(stats[0].value, null, 'el valor ausente no se reescribe');
});
