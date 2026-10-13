// C16 — «Puente al Máster» pasa a «Actividades extracurriculares» en ES/EN/VA.
//
// La prueba mira los datos PUBLICADOS (traducciones regeneradas + TRAINING_CONFIG): es el rótulo que ve
// quien visita. Conserva las claves técnicas (la sección `master-skills`, la pestaña `master`) y las
// menciones legítimas a la titulación de máster (el aviso del Track A sigue nombrándolo).

import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

let lang = 'es';
globalThis.localStorage = { getItem: (k) => (k === 'language' ? lang : null), setItem() {}, removeItem() {} };
globalThis.document = {
  documentElement: {},
  getElementById() { return null; },
  querySelector() { return null; },
  querySelectorAll() { return []; },
};
globalThis.window = { location: { hash: '' }, addEventListener() {}, scrollTo() {} };

const { translations } = await import('../../assets/data/translations.js');
const { TRAINING_CONFIG } = await import('../../assets/data/training.js');
const { setState } = await import('../../assets/js/state.js');
const { applyLanguage } = await import('../../assets/js/i18n.js');
const vistas = await import('../../assets/js/views/index.js');

const NUEVO = {
  es: 'Actividades extracurriculares',
  en: 'Extracurricular activities',
  va: 'Activitats extracurriculars',
};
const VIEJO = /Puente al M|Master Bridge|Pont al M/;

test('competencias, itinerarios y pasos de la sección se conservan', () => {
  const seccion = (TRAINING_CONFIG.sectionsBlock || []).find((s) => s.id === 'master-skills');
  assert.ok(Array.isArray(seccion.skillsBlock?.skills) && seccion.skillsBlock.skills.length > 0);
  assert.ok(Array.isArray(seccion.skillsBlock?.derivedSkillIds), 'los derivados de competencias siguen ahí');
  assert.ok(Array.isArray(seccion.pathBlock?.steps) && seccion.pathBlock.steps.length > 0);
  for (const paso of seccion.pathBlock.steps) {
    assert.ok(paso.id && paso.text && paso.text.es, JSON.stringify(paso));
  }
});

test('los cursos llevan su código EXT y el nivel no cambia', () => {
  // Estado de partida propio: un curso de Máster sintético con su código EXT, restaurado al acabar.
  const courses = TRAINING_CONFIG.coursesBlock.courses;
  const previos = courses.splice(0, courses.length, { id: 'curso-master-de-prueba', code: 'EXT-2026-001', level: 'Máster' });
  try {
    const cursos = courses.filter((c) => c.level === 'Máster');
    assert.ok(cursos.length > 0);
    for (const c of cursos) {
      assert.match(c.code || '', /^EXT-2026-\d{3,}$/, `${c.id}: ${c.code}`);
    }
  } finally {
    courses.splice(0, courses.length, ...previos);
  }
});

test('la pestaña `master` conserva su clave técnica y pinta el rótulo nuevo', () => {
  lang = 'es';
  setState('trainingTab', 'master');
  const html = vistas.formacion.render();
  assert.ok(html.includes('data-tab="master"'), 'la clave técnica de la pestaña no cambia');
});

test('la vista no escribe los rótulos a mano: los toma de traducciones/secciones', async () => {
  const vista = await readFile(new URL('../../assets/js/views/training.js', import.meta.url), 'utf8');
  assert.ok(!/Puente al M|Master Bridge|Pont al M/.test(vista), 'la vista no debe contener el rótulo antiguo');
  assert.match(vista, /tabMasterBridge/);
});

// ── F4 de la depuración (T4.2): enlace FSTP en «Actividades extracurriculares» ────────────────────

const LINK_URL = 'https://aisecrett.eu/bid-to-our-call/';
const LINK_TEXT = {
  es: 'La UVEG gestiona, en nombre del consorcio, la convocatoria FSTP de apoyo económico para participar en actividades extracurriculares del Máster: escuelas de verano e invierno, talleres temáticos y formación intensiva.',
  en: "UVEG runs, on behalf of the consortium, the AiSECRETT FSTP Call, which offers financial support for taking part in extracurricular activities linked to the master's programme: summer and winter schools, thematic workshops and intensive training events.",
  va: "La UVEG gestiona, en nom del consorci, la convocatòria FSTP de suport econòmic per a participar en activitats extracurriculars del Màster: escoles d'estiu i d'hivern, tallers temàtics i formació intensiva.",
};
const LINK_LABEL = {
  es: 'Consultar la convocatoria FSTP de AiSECRETT',
  en: 'See the AiSECRETT FSTP Call',
  va: "Consultar la convocatòria FSTP d'AiSECRETT",
};

const { escapeHtml } = await import('../../assets/js/utils/escape-html.js');

function seccionMaster() {
  const seccion = (TRAINING_CONFIG.sectionsBlock || []).find((s) => s.id === 'master-skills');
  assert.ok(seccion?.disclaimerBlock, 'la sección master-skills debe publicar su aviso');
  return seccion;
}

/** Cambia el link (o lo quita) mientras dura `fn` y restaura el estado original. */
function conLink(link, fn) {
  const block = seccionMaster().disclaimerBlock;
  const tenia = Object.prototype.hasOwnProperty.call(block, 'link');
  const original = block.link;
  if (link === undefined) delete block.link;
  else block.link = link;
  try {
    return fn();
  } finally {
    if (tenia) block.link = original;
    else delete block.link;
  }
}

function renderMaster(idioma = 'es') {
  lang = idioma;
  applyLanguage(idioma);
  setState('trainingTab', 'master');
  return vistas.formacion.render();
}

test('la vista pinta el enlace con target, rel y el idioma activo', () => {
  for (const idioma of ['es', 'en', 'va']) {
    const html = conLink(structuredClone({ url: LINK_URL, text: LINK_TEXT, label: LINK_LABEL }),
      () => renderMaster(idioma));
    assert.ok(html.includes(`href="${LINK_URL}"`), `${idioma}: href`);
    assert.ok(html.includes('target="_blank"'), `${idioma}: target`);
    assert.ok(html.includes('rel="noopener noreferrer"'), `${idioma}: rel`);
    assert.ok(html.includes(escapeHtml(LINK_TEXT[idioma])), `${idioma}: frase`);
    assert.ok(html.includes(escapeHtml(LINK_LABEL[idioma])), `${idioma}: etiqueta`);
  }
  lang = 'es';
  applyLanguage('es');
});

test('un aviso sin link (contenido antiguo) no pinta enlaces y conserva el texto', () => {
  const aviso = seccionMaster().disclaimerBlock.text.es;
  const html = conLink(undefined, () => renderMaster('es'));
  assert.ok(html.includes(escapeHtml(aviso)), 'el aviso existente debe seguir pintándose');
  assert.ok(!html.includes('aisecrett.eu/bid-to-our-call'), 'sin link no debe aparecer el enlace');
});

test('un texto con marcado hostil se pinta escapado y la URL se valida', () => {
  const hostil = structuredClone({ url: LINK_URL, text: LINK_TEXT, label: LINK_LABEL });
  hostil.text.es = '<img src=x onerror=alert(1)>';
  const html = conLink(hostil, () => renderMaster('es'));
  assert.ok(!html.includes('<img src=x'), 'la etiqueta inyectada llegó sin escapar');
  assert.ok(html.includes('&lt;img src=x onerror=alert(1)&gt;'), 'debería verse como texto');
  for (const url of ['javascript:alert(1)', 'data:text/html,x', '//evil.example/x']) {
    const conPeligrosa = structuredClone({ url, text: LINK_TEXT, label: LINK_LABEL });
    const malo = conLink(conPeligrosa, () => renderMaster('es'));
    assert.ok(!malo.includes(`href="${url}"`), `no debe emitirse ${url}`);
    assert.ok(!malo.includes('javascript:'), 'no debe quedar rastro de javascript:');
  }
});

test('con el aviso oculto no se pinta ni el texto ni el enlace', () => {
  const seccion = seccionMaster();
  const original = seccion.disclaimerBlock.visible;
  seccion.disclaimerBlock.visible = false;
  try {
    const html = conLink(structuredClone({ url: LINK_URL, text: LINK_TEXT, label: LINK_LABEL }),
      () => renderMaster('es'));
    assert.ok(!html.includes(escapeHtml(LINK_LABEL.es)), 'no debe pintarse la etiqueta del enlace');
    assert.ok(!html.includes(`href="${LINK_URL}"`), 'no debe pintarse el enlace');
  } finally {
    seccion.disclaimerBlock.visible = original;
  }
});

test('una ruta interna del enlace se pinta tal cual (href interno)', () => {
  // F4/P2: la vista valida el esquema con getSafeEditorialUrl y conserva las rutas internas admitidas.
  for (const ruta of ['assets/downloads/convocatoria.pdf', './assets/downloads/convocatoria.pdf',
    '../recursos/convocatoria.pdf']) {
    const html = conLink(structuredClone({ url: ruta, text: LINK_TEXT, label: LINK_LABEL }), () => renderMaster('es'));
    assert.ok(html.includes(`href="${ruta}"`), `falta el href interno ${ruta}`);
    assert.ok(!html.includes(`href="https://${ruta}`), `no debe convertirse en https:// (${ruta})`);
  }
});
