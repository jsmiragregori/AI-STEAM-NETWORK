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
const vistas = await import('../../assets/js/views/index.js');

const NUEVO = {
  es: 'Actividades extracurriculares',
  en: 'Extracurricular activities',
  va: 'Activitats extracurriculars',
};
const VIEJO = /Puente al M|Master Bridge|Pont al M/;

test('la pestaña de actividades usa el rótulo nuevo en los tres idiomas', () => {
  for (const idioma of ['es', 'en', 'va']) {
    const t = translations[idioma]?.training || {};
    assert.equal(t.tabMasterBridge, NUEVO[idioma], `${idioma}: pestaña`);
    assert.ok(!VIEJO.test(t.tabMasterBridge || ''), `${idioma}: la pestaña sigue siendo la antigua`);
  }
});

test('el título heredado del puente también se actualiza', () => {
  for (const idioma of ['es', 'en', 'va']) {
    const t = translations[idioma]?.training || {};
    assert.ok((t.masterBridgeTitle || '').startsWith(NUEVO[idioma]), `${idioma}: ${t.masterBridgeTitle}`);
    assert.ok((t.masterPath || '').includes(NUEVO[idioma]), `${idioma}: ${t.masterPath}`);
    assert.ok(!VIEJO.test(t.masterBridgeTitle || ''), `${idioma}: título antiguo`);
    assert.ok(!VIEJO.test(t.masterPath || ''), `${idioma}: ruta antigua`);
  }
});

test('el subtítulo de la sección nombra la colección nueva', () => {
  for (const idioma of ['es', 'en', 'va']) {
    const subtitulo = translations[idioma]?.training?.subtitle || '';
    assert.ok(subtitulo.includes(NUEVO[idioma]), `${idioma}: ${subtitulo}`);
    assert.ok(!VIEJO.test(subtitulo), `${idioma}: subtítulo antiguo`);
  }
});

test('la sección generada `master-skills` conserva su id y cambia el título', () => {
  const seccion = (TRAINING_CONFIG.sectionsBlock || []).find((s) => s.id === 'master-skills');
  assert.ok(seccion, 'la sección master-skills debe seguir existiendo (id técnico)');
  for (const idioma of ['es', 'en', 'va']) {
    assert.equal(seccion.title[idioma], NUEVO[idioma], `${idioma}: título de la sección`);
    assert.equal(seccion.pathBlock?.title?.[idioma], NUEVO[idioma], `${idioma}: título del bloque de ruta`);
  }
  assert.ok(!VIEJO.test(JSON.stringify(seccion.title)));
  assert.ok(!VIEJO.test(JSON.stringify(seccion.pathBlock?.title)));
});

test('competencias, itinerarios y pasos de la sección se conservan', () => {
  const seccion = (TRAINING_CONFIG.sectionsBlock || []).find((s) => s.id === 'master-skills');
  assert.ok(Array.isArray(seccion.skillsBlock?.skills) && seccion.skillsBlock.skills.length > 0);
  assert.ok(Array.isArray(seccion.skillsBlock?.derivedSkillIds), 'los derivados de competencias siguen ahí');
  assert.ok(Array.isArray(seccion.pathBlock?.steps) && seccion.pathBlock.steps.length > 0);
  for (const paso of seccion.pathBlock.steps) {
    assert.ok(paso.id && paso.text && paso.text.es, JSON.stringify(paso));
  }
  // El aviso legítimo sobre la titulación de máster sigue nombrándola.
  const aviso = seccion.disclaimerBlock?.text || {};
  assert.ok(/Máster|Master|Màster/.test(aviso.es || ''), 'el aviso del Track A debe conservar la mención al máster');
});

test('los cursos llevan su código EXT y el nivel no cambia', () => {
  const cursos = (TRAINING_CONFIG.coursesBlock?.courses || []).filter((c) => c.level === 'Máster');
  assert.ok(cursos.length > 0);
  for (const c of cursos) {
    assert.match(c.code || '', /^EXT-2026-\d{3,}$/, `${c.id}: ${c.code}`);
  }
});

test('la pestaña `master` conserva su clave técnica y pinta el rótulo nuevo', () => {
  lang = 'es';
  setState('trainingTab', 'master');
  const html = vistas.formacion.render();
  assert.ok(html.includes('data-tab="master"'), 'la clave técnica de la pestaña no cambia');
  assert.ok(html.includes(NUEVO.es), 'la pestaña pinta el rótulo nuevo');
});

test('la vista no escribe los rótulos a mano: los toma de traducciones/secciones', async () => {
  const vista = await readFile(new URL('../../assets/js/views/training.js', import.meta.url), 'utf8');
  assert.ok(!/Puente al M|Master Bridge|Pont al M/.test(vista), 'la vista no debe contener el rótulo antiguo');
  assert.match(vista, /tabMasterBridge/);
});
