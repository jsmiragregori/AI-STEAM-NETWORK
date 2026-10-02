// F6 del plan de códigos: la búsqueda de cada subsección encuentra por código.
//
// Decidido en el plan: el código entra en la BÚSQUEDA GENERAL (`getSearchHaystack`), sin rama de
// coincidencia exacta. Un punto de cambio, una línea. Así hereda gratis lo que ya hace
// `normalizeText` (minúsculas y sin diacríticos) y la persistencia del estado de búsqueda.
//
// La búsqueda se ejercita por su camino real: el estado se guarda en localStorage
// (`mpCommunityFilters:<pestaña>`) y `render()` lo lee. Los códigos se inyectan en memoria porque los
// datos generados aún no los llevan (los regenera la Fase 7); la prueba no escribe nada.

import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
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
const vistas = await import('../../assets/js/views/index.js');

const PREFIJO = { challenge: 'CHA', case: 'CAS', mentoring: 'MEN', pilot: 'PIL', validation: 'VAL' };
const TABS = ['challenges', 'cases', 'mentorings', 'pilots', 'validations'];

let numero = 0;
const codigoDe = new Map();
for (const lista of [MARKETPLACE_CONFIG.items, ...Object.values(MARKETPLACE_CONFIG.itemsByTab)]) {
  for (const item of lista) {
    if (!codigoDe.has(item.id)) {
      numero += 1;
      codigoDe.set(item.id, `${PREFIJO[item.type]}-2026-${String(numero).padStart(3, '0')}`);
    }
    item.code = codigoDe.get(item.id);
  }
}
const items = (tab) => MARKETPLACE_CONFIG.itemsByTab[tab];

/** Pinta la pestaña con ese texto de búsqueda, todas las páginas, y devuelve el HTML. */
function pintar(tab, busqueda, idioma = 'es') {
  lang = idioma;
  almacen.set(`mpCommunityFilters:${tab}`, JSON.stringify({ search: busqueda, values: {} }));
  setState(`marketplacePageSize:${tab}`, 'all');
  setState(`marketplacePage:${tab}`, 0);
  setState('marketplaceTab', tab);
  return vistas.bancoRetos.render();
}

const cards = (html) => html.split('<article class="rd-card-mp ').slice(1).map((t) => t.split('</article>')[0]);
const codigosPintados = (html) => cards(html).map((c) => /<\/span>([^<]+)<\/p>/.exec(/<p class="rd-card-mp-code">[\s\S]*?<\/p>/.exec(c)?.[0] ?? '')?.[1]);

test('hay códigos inyectados y la pestaña sin búsqueda pinta todos sus elementos', () => {
  for (const tab of TABS) {
    assert.equal(cards(pintar(tab, '')).length, items(tab).length, tab);
  }
});

for (const tab of TABS) {
  test(`F6.1 ${tab}: el código completo devuelve ese elemento, y solo ese`, () => {
    for (const item of items(tab)) {
      const html = pintar(tab, item.code);
      assert.deepEqual(codigosPintados(html), [item.code], `buscando ${item.code}`);
    }
  });

  test(`F6.1 ${tab}: el prefijo con el año devuelve todos los de la subsección`, () => {
    const prefijo = `${PREFIJO[items(tab)[0].type].toLowerCase()}-2026`;
    const encontrados = codigosPintados(pintar(tab, prefijo));
    assert.deepEqual([...encontrados].sort(), items(tab).map((i) => i.code).sort(), prefijo);
  });
}

// Ojo: en Mentorías esta prueba NO distingue la búsqueda por código, porque la etiqueta de tipo
// («Mentoría») ya contiene «men». Es una regresión de lo que pide el plan; lo que prueba que el
// prefijo busca POR CÓDIGO es la del prefijo con el año (`men-2026`), que ningún texto contiene.
test('F6.1 «MEN» devuelve todas las mentorías (regresión; ver la nota de arriba)', () => {
  const todas = items('mentorings').map((i) => i.code).sort();
  assert.deepEqual([...codigosPintados(pintar('mentorings', 'MEN'))].sort(), todas);
  assert.deepEqual([...codigosPintados(pintar('mentorings', 'men'))].sort(), todas);
});

test('F6.1 el número del código también busca, y un código inexistente no devuelve nada', () => {
  const un = items('pilots')[2];
  const numeroDelCodigo = un.code.split('-')[2];
  assert.ok(codigosPintados(pintar('pilots', `-${numeroDelCodigo}`)).includes(un.code));
  assert.equal(cards(pintar('pilots', 'zzz-9999-999')).length, 0);
});

test('F6.1 el código viaja con el resto del texto: una búsqueda por título sigue funcionando', () => {
  const objetivo = items('cases')[0];
  const palabra = (objetivo.core.title.es || '').split(/\s+/).find((p) => p.length > 6);
  assert.ok(palabra, 'el título de prueba debería tener una palabra larga');
  assert.ok(cards(pintar('cases', palabra)).length >= 1);
});

test('F6.2 mayúsculas, minúsculas y mezcla encuentran lo mismo', () => {
  const codigo = items('validations')[1].code;
  for (const consulta of [codigo, codigo.toLowerCase(), codigo.toUpperCase(), codigo.replace('VAL', 'vAl')]) {
    assert.deepEqual(codigosPintados(pintar('validations', consulta)), [codigo], consulta);
  }
});

test('F6.2 los diacríticos no rompen la búsqueda: «MÉN-2026» encuentra MEN-2026', () => {
  const todas = items('mentorings').map((i) => i.code).sort();
  assert.deepEqual([...codigosPintados(pintar('mentorings', 'MÉN-2026'))].sort(), todas);
  assert.deepEqual([...codigosPintados(pintar('mentorings', 'mën-2026'))].sort(), todas);
});

for (const idioma of ['es', 'en', 'va']) {
  test(`F6.2 en ${idioma} el código se encuentra igual y se pinta con su etiqueta`, () => {
    for (const tab of TABS) {
      const codigo = items(tab)[0].code;
      const html = pintar(tab, codigo.toLowerCase(), idioma);
      assert.deepEqual(codigosPintados(html), [codigo], `${tab}/${idioma}`);
    }
  });
}

test('F6 un elemento sin código no mete «undefined» ni «null» en el texto de búsqueda', () => {
  const originales = items('cases').map((item) => [item, item.code]);
  try {
    for (const [item] of originales) delete item.code;
    assert.equal(cards(pintar('cases', 'undefined')).length, 0);
    for (const [item] of originales) item.code = null;
    assert.equal(cards(pintar('cases', 'null')).length, 0);
    for (const [item] of originales) item.code = 'x';
    assert.equal(cards(pintar('cases', '')).length, items('cases').length, 'sin búsqueda siguen saliendo todos');
  } finally {
    for (const [item, codigo] of originales) item.code = codigo;
  }
});

test('F6 el estado de búsqueda se conserva y el chip de filtro activo la muestra escapada', () => {
  const codigo = items('mentorings')[0].code.toLowerCase();
  const html = pintar('mentorings', codigo);
  assert.deepEqual(JSON.parse(almacen.get('mpCommunityFilters:mentorings')), { search: codigo, values: {} },
    'pintar no debe alterar el estado persistido');
  assert.match(html, new RegExp(`Buscar: ${codigo}`), 'el chip de búsqueda activa');
  assert.ok(html.includes(`value="${codigo}"`), 'el cuadro de búsqueda conserva lo tecleado');

  const hostil = '"><img src=x onerror=alert(1)>';
  const sucio = pintar('mentorings', hostil);
  assert.ok(!sucio.includes('<img src=x'), 'lo tecleado nunca llega sin escapar');
});

test('F6 sin búsqueda ni código en la consulta, el comportamiento anterior no cambia', () => {
  const html = pintar('mentorings', '');
  assert.equal(cards(html).length, items('mentorings').length);
  assert.ok(!html.includes('Buscar: '), 'sin búsqueda no hay chip');
});

test('F6 es búsqueda general: una línea en getSearchHaystack, sin rama de coincidencia exacta', async () => {
  const fuente = (await readFile(new URL('../../assets/js/views/marketplace.js', import.meta.url), 'utf8')).replace(/\r\n/g, '\n');
  const cuerpo = (nombre) => new RegExp(`function ${nombre}\\([^)]*\\) \\{\\n([\\s\\S]*?)\\n\\}\\n`).exec(fuente)?.[1] ?? '';
  const haystack = cuerpo('getSearchHaystack');
  assert.ok(haystack, 'no se encontró getSearchHaystack');
  assert.match(haystack, /item\.code/, 'el código debe entrar en el texto de búsqueda general');
  const filtro = cuerpo('itemMatchesTabFilters');
  assert.ok(filtro);
  assert.ok(!/code/i.test(filtro), 'el filtro no tiene rama propia para el código');
  assert.ok(!/\bcode\s*(===|!==|==)|(===|!==)\s*[\w.]*code\b|code\)?\.(startsWith|endsWith)\(/.test(fuente),
    'no debe haber coincidencia exacta ni por prefijo sobre el código');
});
