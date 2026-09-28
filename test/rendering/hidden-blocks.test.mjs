// Un bloque oculto llega a los datos generados como `{ visible: false }`, sin su
// contenido. Cada vista debe aceptarlo: pintar sin lanzar y sin mostrar el bloque.
//
// Los datos se reducen en memoria ANTES de importar las vistas, porque algunas
// calculan constantes al cargarse: todo objeto con `visible` pasa a la forma
// mínima y los elementos de lista que lo llevan desaparecen (como en el generador).
//
// Tres comprobaciones:
//   1. Robustez: cada vista, en todas sus pestañas, pinta sin lanzar.
//   2. Sin fugas: no aparece ningún texto que solo existía dentro de lo retirado.
//   3. Sin respaldos: un bloque oculto no se sustituye por el contenido de reserva
//      que la vista usa cuando no hay datos. Una vez retirado el contenido, un
//      respaldo es lo único que podría volver a mostrar el bloque.

import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import test from 'node:test';

globalThis.localStorage = { getItem(k) { return k === 'language' ? 'es' : null; }, setItem() {}, removeItem() {} };
globalThis.document = {
  documentElement: {},
  getElementById() { return null; },
  querySelector() { return null; },
  querySelectorAll() { return []; },
};
globalThis.window = { location: { hash: '' }, addEventListener() {}, scrollTo() {} };

const RAIZ = new URL('../../', import.meta.url);
const DIR_DATOS = new URL('assets/data/', RAIZ);
const DIR_VISTAS = new URL('assets/js/views/', RAIZ);

const modulos = {};
for (const fichero of (await readdir(DIR_DATOS)).filter(f => f.endsWith('.js'))) {
  modulos[fichero] = await import(new URL(fichero, DIR_DATOS).href);
}

// Respaldos conocidos, capturados antes de reducir nada.
const { translations } = modulos['translations.js'];
const tituloReunionesReserva = translations.es.governance.tabContent_participar.meetingsTitle;
const { MARKETPLACE_CONFIG } = modulos['marketplace.js'];
const pestanasMarketplace = (MARKETPLACE_CONFIG.tabs || []).map(t => t?.id).filter(Boolean);

// --- Reducción -------------------------------------------------------------
const retiradosBrutos = new Set();
const recoger = (v) => {
  if (typeof v === 'string') { const t = v.trim(); if (t.length > 12) retiradosBrutos.add(t); }
  else if (Array.isArray(v)) v.forEach(recoger);
  else if (v && typeof v === 'object') Object.values(v).forEach(recoger);
};
const esBloque = (v) => v && typeof v === 'object' && !Array.isArray(v) && 'visible' in v;

function reducir(valor) {
  if (Array.isArray(valor)) {
    for (let i = valor.length - 1; i >= 0; i -= 1) {
      if (esBloque(valor[i])) { recoger(valor[i]); valor.splice(i, 1); } else reducir(valor[i]);
    }
    return;
  }
  if (!valor || typeof valor !== 'object') return;
  for (const hijo of Object.values(valor)) {
    if (esBloque(hijo)) {
      recoger(hijo);
      for (const k of Object.keys(hijo)) delete hijo[k];
      hijo.visible = false;
    } else {
      reducir(hijo);
    }
  }
}
for (const modulo of Object.values(modulos)) Object.values(modulo).forEach(reducir);

// Solo se vigilan los textos que no sobreviven en ninguna otra parte: ni en los datos
// que quedan (incluidas subcadenas, p. ej. dentro del HTML legal) ni en el código de
// las vistas (iconos o rótulos por defecto).
const restante = Object.values(modulos).map(m => JSON.stringify(m)).join('\n');
const codigoVistas = (await Promise.all(
  (await readdir(DIR_VISTAS)).filter(f => f.endsWith('.js')).map(f => readFile(new URL(f, DIR_VISTAS), 'utf8')),
)).join('\n');
const retirados = [...retiradosBrutos].filter(t => !restante.includes(t) && !codigoVistas.includes(t));

// --- Vistas ----------------------------------------------------------------
const { setState } = await import('../../assets/js/state.js');
const vistas = await import('../../assets/js/views/index.js');

const PESTANAS = {
  gobernanza: ['governanceTab', ['estructura', 'dual-track', 'lbd', 'documentos', 'participar']],
  conocimiento: ['knowledgeTab', ['flujo', 'oer', 'plantillas']],
  red: ['networkTab', ['socios', 'stakeholders']],
  formacion: ['trainingTab', ['fp', 'master', 'teacher']],
  bancoRetos: ['marketplaceTab', pestanasMarketplace],
};

const sinComentarios = html => html.replace(/<!--[\s\S]*?-->/g, '');

function pintar(nombre, soloPestana) {
  const [clave, valores] = PESTANAS[nombre] || [null, []];
  const lista = soloPestana ? [soloPestana] : (valores.length ? valores : [null]);
  let html = '';
  for (const valor of lista) {
    if (clave) setState(clave, valor);
    html += vistas[nombre].render();
  }
  return sinComentarios(html);
}

test('la reducción retira bloques y deja textos que vigilar', () => {
  assert.ok(retirados.length > 50, `solo ${retirados.length} textos que vigilar`);
});

for (const nombre of Object.keys(vistas)) {
  test(`${nombre}: pinta con todos los bloques ocultos, sin lanzar ni mostrarlos`, () => {
    let html;
    assert.doesNotThrow(() => { html = pintar(nombre); }, `${nombre} lanza con bloques ocultos`);
    assert.equal(typeof html, 'string');
    const filtrados = retirados.filter(t => html.includes(t));
    const muestra = filtrados.slice(0, 6).map(t => `  · ${t.slice(0, 90)}`).join('\n');
    assert.deepEqual(filtrados, [], `${nombre} muestra texto de bloques ocultos:\n${muestra}`);
  });
}

test('red: con el bloque de socios oculto no se pinta la lista de reserva', async () => {
  const codigo = await readFile(new URL('network.js', DIR_VISTAS), 'utf8');
  const nombresReserva = [...codigo.matchAll(/^\s*\{ id: '[a-z0-9-]+',\s*name: '([^']+)'/gm)].map(m => m[1]);
  assert.ok(nombresReserva.length >= 10, 'no se encontró la lista de reserva de socios');
  const html = pintar('red', 'socios');
  const vistos = nombresReserva.filter(n => html.includes(n));
  assert.deepEqual(vistos, [], `se pintan socios de la lista de reserva: ${vistos.join(', ')}`);
});

test('gobernanza: con las reuniones ocultas no se pinta su título de reserva', () => {
  assert.ok(tituloReunionesReserva, 'no se encontró el título de reserva de reuniones');
  const html = pintar('gobernanza', 'participar');
  assert.ok(!html.includes(tituloReunionesReserva), 'se pinta la sección de reuniones con el título de reserva');
});
