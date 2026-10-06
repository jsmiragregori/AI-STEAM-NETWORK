// F3 de la depuración (D4 y D5) — tarjetas de Comunidad en Vanilla.
//
// T3.1: la cadena de transferencia se pinta COMPLETA (ni slice(0,2) ni line-clamp-2).
//       Hay un caso real con cuatro beneficiarias (movilidad-sostenible-formacion-docente).
// T3.2: la card de reto muestra su sector con etiqueta localizada, controlado por el chip
//       global `ch_challenge_sector` (mismo patrón que ch_case_sector / ch_pilot_sector).
// T3.3: la card de reto muestra la Triple Transición con las etiquetas ES/EN/VA del catálogo
//       existente (transitionLabels), controlada por `cardChipVisibility.tripleTransition`.
//
// Los valores de Triple Transición se inyectan EN MEMORIA ítem a ítem (las fuentes reales
// todavía no tienen valores) y se restauran siempre; la prueba no escribe nada.

import assert from 'node:assert/strict';
import test from 'node:test';

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

/** Pinta una pestaña completa (todas las cards) en el idioma pedido. */
function pintar(tab, idioma = 'es') {
  lang = idioma;
  applyLanguage(idioma); // el cambio de idioma real pasa por aquí (i18n cachea currentLang)
  almacen.set(`mpCommunityFilters:${tab}`, JSON.stringify({ search: '', values: {} }));
  setState(`marketplacePageSize:${tab}`, 'all');
  setState(`marketplacePage:${tab}`, 0);
  setState('marketplaceTab', tab);
  return vistas.bancoRetos.render();
}

/** Las cards del HTML, de `<article class="rd-card-mp` a su cierre. */
function cards(html) {
  return html.split('<article class="rd-card-mp ').slice(1).map((trozo) => trozo.split('</article>')[0]);
}

/** La card cuyo código público es `code`. */
function cardDe(html, code) {
  const encontrada = cards(html).find((card) => card.includes(`>${code}</p>`) || card.includes(`${code}</p>`));
  assert.ok(encontrada, `no se encontró la card ${code}`);
  return encontrada;
}

function itemDe(tab, id) {
  const item = MARKETPLACE_CONFIG.itemsByTab[tab].find((i) => i.id === id);
  assert.ok(item, `no existe el elemento ${id} en ${tab}`);
  return item;
}

/** Cambia un valor de MARKETPLACE_CONFIG mientras dura `fn` y lo restaura siempre. */
function conConfig(ruta, valor, fn) {
  const [clave] = ruta;
  const original = MARKETPLACE_CONFIG[clave];
  MARKETPLACE_CONFIG[clave] = { ...(original || {}), [ruta[1]]: valor };
  try {
    return fn();
  } finally {
    MARKETPLACE_CONFIG[clave] = original;
  }
}

/** Cambia classification.tripleTransition de un reto mientras dura `fn` y la restaura. */
function conTransicion(item, valores, fn) {
  const original = item.classification.tripleTransition;
  item.classification.tripleTransition = valores;
  try {
    return fn();
  } finally {
    item.classification.tripleTransition = original;
  }
}

// ═══ T3.1 — cadena de transferencia completa ═══════════════════════════════════════════════

const CASO = 'movilidad-sostenible-formacion-docente';
const BENEFICIARIAS = [
  'EMT Valencia',
  'CEFIRE de Valencia',
  'CEFIRE de Alicante',
  'CEFIRE de Castellón',
];

/** El bloque de la cadena de transferencia de una card: clase e interior del `<p>` de texto. */
function cadenaDe(card) {
  const match = /<i data-lucide="building-2"[\s\S]*?<\/p>\s*<p class="([^"]*)">([\s\S]*?)<\/p>/.exec(card);
  assert.ok(match, 'no se encontró la cadena de transferencia en la card');
  return { clase: match[1], texto: match[2] };
}

test('T3.1 control: el caso real tiene cuatro beneficiarias y la cadena activa', () => {
  const item = itemDe('cases', CASO);
  assert.equal(item.ownership.beneficiaries.length, 4);
  assert.notEqual(item.presentation?.card?.showActors, false);
  assert.deepEqual(item.ownership.beneficiaries.map((b) => b.name), BENEFICIARIAS);
});

test('T3.1 la cadena de transferencia pinta completas las cuatro beneficiarias', () => {
  const item = itemDe('cases', CASO);
  const card = cardDe(pintar('cases'), item.code);
  const { texto } = cadenaDe(card);
  for (const nombre of BENEFICIARIAS) {
    assert.ok(texto.includes(nombre), `falta «${nombre}» en la cadena: ${texto}`);
  }
});

test('T3.1 la cadena no se recorta con line-clamp (texto largo visible)', () => {
  const item = itemDe('cases', CASO);
  const card = cardDe(pintar('cases'), item.code);
  const { clase } = cadenaDe(card);
  assert.ok(!clase.includes('line-clamp'), `la cadena conserva una clase de recorte: ${clase}`);
});

test('T3.1 un nombre muy largo llega entero al HTML', () => {
  const item = itemDe('cases', CASO);
  const originales = item.ownership.beneficiaries;
  const largo = 'Consorcio Interprovincial de Formación Técnica y Transferencia en Inteligencia Artificial Aplicada a la Movilidad Sostenible de la Comunitat Valenciana';
  item.ownership.beneficiaries = [...originales, { name: largo }];
  try {
    const card = cardDe(pintar('cases'), item.code);
    const { texto } = cadenaDe(card);
    assert.ok(texto.includes(largo), 'el nombre largo debería llegar completo');
    assert.ok(!texto.includes('…'), 'no debe aparecer ningún recorte tipográfico');
  } finally {
    item.ownership.beneficiaries = originales;
  }
});

test('T3.1 una beneficiaria con marcado hostil se pinta escapada', () => {
  const item = itemDe('cases', CASO);
  const originales = item.ownership.beneficiaries;
  item.ownership.beneficiaries = [{ name: '<img src=x onerror=alert(1)>' }];
  try {
    const card = cardDe(pintar('cases'), item.code);
    assert.ok(!card.includes('<img src=x'), 'la etiqueta inyectada llegó sin escapar');
    assert.ok(card.includes('&lt;img src=x onerror=alert(1)&gt;'), 'debería verse como texto');
  } finally {
    item.ownership.beneficiaries = originales;
  }
});

test('T3.1 ch_case_actors=false sigue escondiendo la cadena (regresión)', () => {
  const item = itemDe('cases', CASO);
  const card = conConfig(['cardChipVisibility', 'ch_case_actors'], false, () => cardDe(pintar('cases'), item.code));
  assert.ok(!/building-2/.test(card), 'con el chip global apagado no debe pintarse la cadena');
});

// ═══ T3.2 — sector en la card de reto ══════════════════════════════════════════════════════

const RETO = 'creative-ai-green-campus';

test('T3.2 control: el reto real tiene sector', () => {
  const item = itemDe('challenges', RETO);
  assert.equal(item.core.sector, 'ene');
});

test('T3.2 la card de reto pinta el sector con etiqueta localizada (ES/EN/VA)', () => {
  const item = itemDe('challenges', RETO);
  const esperado = {
    es: 'Energía y Medio Ambiente',
    en: 'Energy and Environment',
    va: 'Energia i Medi Ambient',
  };
  for (const [idioma, etiqueta] of Object.entries(esperado)) {
    const card = cardDe(pintar('challenges', idioma), item.code);
    assert.ok(
      card.includes('data-mp-chip-filter="sector" data-mp-chip-value="ene">' + etiqueta + '<'),
      `${idioma}: falta el chip de sector «${etiqueta}»`,
    );
  }
});

test('T3.2 ch_challenge_sector=false esconde el sector de todos los retos', () => {
  assert.ok(cardDe(pintar('challenges'), itemDe('challenges', RETO).code).includes('data-mp-chip-filter="sector"'),
    'control: con el chip activo el sector debe pintarse');
  const html = conConfig(['cardChipVisibility', 'ch_challenge_sector'], false, () => pintar('challenges'));
  for (const item of MARKETPLACE_CONFIG.itemsByTab.challenges) {
    const card = cardDe(html, item.code);
    assert.ok(!card.includes('data-mp-chip-filter="sector"'), `${item.id}: el chip de sector no debería pintarse`);
  }
});

test('T3.2 el sector respeta el filtro activo de la pestaña (chip clicable)', () => {
  const item = itemDe('challenges', RETO);
  almacen.set('mpCommunityFilters:challenges', JSON.stringify({ search: '', values: { sector: 'ene' } }));
  setState('marketplacePageSize:challenges', 'all');
  setState('marketplacePage:challenges', 0);
  setState('marketplaceTab', 'challenges');
  const card = cardDe(vistas.bancoRetos.render(), item.code);
  assert.ok(/class="[^"]*ring-1[^"]*" data-mp-chip-filter="sector" data-mp-chip-value="ene"/.test(card), 'el chip activo debe marcarse');
});

// ═══ T3.3 — Triple Transición en la card de reto ═══════════════════════════════════════════

const TRANSICIONES = ['digital', 'green', 'social'];
const ETIQUETAS = {
  es: ['Transición Digital', 'Transición Verde', 'Transición Social'],
  en: ['Digital Transition', 'Green Transition', 'Social Transition'],
  va: ['Transició Digital', 'Transició Verda', 'Transició Social'],
};

test('T3.3 un reto con Triple Transición pinta los chips en ES/EN/VA', () => {
  const item = itemDe('challenges', RETO);
  for (const [idioma, etiquetas] of Object.entries(ETIQUETAS)) {
    const card = conTransicion(item, TRANSICIONES, () => cardDe(pintar('challenges', idioma), item.code));
    for (const etiqueta of etiquetas) {
      assert.ok(card.includes(etiqueta), `${idioma}: falta «${etiqueta}» en la card`);
    }
  }
});

test('T3.3 la cabecera del bloque está localizada', () => {
  const item = itemDe('challenges', RETO);
  const cabeceras = {
    es: 'Triple transición',
    en: 'Triple transition',
    va: 'Triple transició',
  };
  for (const [idioma, cabecera] of Object.entries(cabeceras)) {
    const card = conTransicion(item, TRANSICIONES, () => cardDe(pintar('challenges', idioma), item.code));
    assert.ok(card.includes('>' + cabecera + '</p>'), `${idioma}: falta la cabecera «${cabecera}»`);
  }
});

test('T3.3 cardChipVisibility.tripleTransition=false esconde los chips', () => {
  const item = itemDe('challenges', RETO);
  assert.ok(conTransicion(item, TRANSICIONES, () => pintar('challenges')).includes('Transición Digital'),
    'control: con el chip activo la transición debe pintarse');
  const card = conTransicion(item, TRANSICIONES, () =>
    conConfig(['cardChipVisibility', 'tripleTransition'], false, () => cardDe(pintar('challenges'), item.code)));
  for (const etiqueta of ETIQUETAS.es) {
    assert.ok(!card.includes(etiqueta), `no debería pintarse «${etiqueta}»`);
  }
});

test('T3.3 un reto sin Triple Transición no pinta bloque ni cabecera', () => {
  const item = itemDe('challenges', RETO);
  const card = conTransicion(item, [], () => cardDe(pintar('challenges'), item.code));
  assert.ok(!card.includes('Triple transición'), 'sin valores no debe aparecer la cabecera');
});

test('T3.3 un id fuera del catálogo no pinta «undefined» y conserva los válidos', () => {
  const item = itemDe('challenges', RETO);
  const card = conTransicion(item, ['digital', 'no-existe'], () => cardDe(pintar('challenges'), item.code));
  assert.ok(card.includes('Transición Digital'), 'el id válido debería seguir pintándose');
  assert.ok(!card.includes('undefined'), 'no debe aparecer «undefined»');
});

test('T3.3 los valores en la card siguen el orden de la fuente', () => {
  const item = itemDe('challenges', RETO);
  const card = conTransicion(item, ['social', 'digital'], () => cardDe(pintar('challenges'), item.code));
  assert.ok(card.indexOf('Transición Social') < card.indexOf('Transición Digital'), 'debe respetarse el orden de la fuente');
});
