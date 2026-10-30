import assert from 'node:assert/strict';
import test from 'node:test';

const store = new Map();
let lang = 'es';
globalThis.localStorage = {
  getItem: (key) => (key === 'language' ? lang : (store.get(key) ?? null)),
  setItem: (key, value) => store.set(key, String(value)),
  removeItem: (key) => store.delete(key),
};
globalThis.document = {
  documentElement: {},
  getElementById: () => null,
  querySelector: () => null,
  querySelectorAll: () => [],
};
globalThis.window = { location: { hash: '' }, addEventListener() {}, scrollTo() {} };

const { NETWORK_CONFIG } = await import('../../assets/data/network.js');
NETWORK_CONFIG.heroBlock.visible = false;
NETWORK_CONFIG.partnersBlock.visible = false;
NETWORK_CONFIG.stakeholdersBlock.visible = false;
const helixOriginal = NETWORK_CONFIG.helixBlock;
NETWORK_CONFIG.helixBlock = {
  visible: true,
  heading: { es: 'Hélice', en: 'Helix', va: 'Hèlix' },
  description: { es: 'Resumen', en: 'Summary', va: 'Resum' },
  categories: [],
};
const { setState } = await import('../../assets/js/state.js');
const { red } = await import('../../assets/js/views/index.js');

function categoria(id, icon) {
  return {
    id, icon, visible: true, value: 1, manualOverride: true,
    label: { es: `Eje ${id} ES`, en: `Axis ${id} EN`, va: `Eix ${id} VA` }, partnersCount: 1, stakeholdersCount: 0,
  };
}

function pintar(categorias, idioma = 'es') {
  lang = idioma;
  NETWORK_CONFIG.helixBlock.categories = categorias;
  setState('networkTab', 'socios');
  return red.render();
}

function cardFor(html, label) {
  const marker = '<div class="rd-card rd-card-grad-violet rd-card-edge p-5 text-center group">';
  const labelIndex = html.indexOf(label);
  assert.notEqual(labelIndex, -1, `falta la etiqueta ${label}`);
  const start = html.lastIndexOf(marker, labelIndex);
  const next = html.indexOf(marker, start + marker.length);
  return html.slice(start, next < 0 ? undefined : next);
}

test('iconos de categorías admitidos se pintan y la paleta permanece ligada a la categoría', () => {
  const categorias = [
    categoria('universidad', 'globe'),
    categoria('empresa', 'graduation-cap'),
    categoria('admin', 'building-2'),
    categoria('sociedad', 'globe'),
  ];
  const expected = [
    ['universidad', 'globe', 'text-eu-purple'],
    ['empresa', 'graduation-cap', 'text-eu-blue'],
    ['admin', 'building-2', 'text-eu-blue'],
    ['sociedad', 'globe', 'text-eu-purple'],
  ];
  for (const idioma of ['es', 'en', 'va']) {
    const html = pintar(categorias, idioma);
    for (const [id, icon, color] of expected) {
      const label = idioma === 'es' ? `Eje ${id} ES` : idioma === 'en' ? `Axis ${id} EN` : `Eix ${id} VA`;
      const card = cardFor(html, label);
      assert.ok(card.includes(`data-lucide="${icon}"`), `${id}/${idioma}: no pinta el icono guardado`);
      assert.ok(card.includes(`class="w-6 h-6 ${color}"`), `${id}/${idioma}: cambió el color público fijo`);
    }
  }
});

test('icono no admitido cae al icono fijo sin introducir HTML y admite cero/una/varias categorías', () => {
  const hostil = pintar([categoria('universidad', '<img src=x onerror=alert(1)>')]);
  assert.ok(hostil.includes('data-lucide="graduation-cap"'));
  assert.ok(!hostil.includes('<img src=x'));
  assert.equal((pintar([]).match(/rd-card-grad-violet rd-card-edge p-5 text-center group/g) || []).length, 0);
  assert.equal((pintar([categoria('empresa', 'globe')]).match(/rd-card-grad-violet rd-card-edge p-5 text-center group/g) || []).length, 1);
  assert.equal((pintar([categoria('empresa', 'globe'), categoria('admin', 'building-2')]).match(/rd-card-grad-violet rd-card-edge p-5 text-center group/g) || []).length, 2);
});

test.after(() => {
  NETWORK_CONFIG.helixBlock = helixOriginal;
});
