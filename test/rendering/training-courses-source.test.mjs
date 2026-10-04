// F3.01 — Formación distingue configuración ausente de `courses: []`:
// una colección vacía explícita muestra el vacío y no recupera los cursos
// legacy de traducciones; una colección parcial conserva solo los cursos del
// CMS. La constante demo COURSE_MODALITY se retiró (decisión D3) y los cursos
// legacy ya no inventan una modalidad que no traen.

import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

globalThis.localStorage = { getItem(k) { return k === 'language' ? 'es' : null; }, setItem() {}, removeItem() {} };
globalThis.document = {
  getElementById() { return null; },
  querySelector() { return null; },
  querySelectorAll() { return []; },
};
globalThis.window = { location: { hash: '' }, addEventListener() {}, scrollTo() {} };

const { resolveCourses } = await import('../../assets/js/views/training.js');

const LEGACY = {
  course1: { title: 'Curso legacy', desc: 'Descripción legacy', level: 'FP', sector: 'Industria', status: 'Activo' },
};

const CMS = {
  courses: [
    {
      id: 'real-1',
      title: { es: 'Curso real', en: 'Real course', va: 'Curs real' },
      description: { es: 'Descripción', en: 'Description', va: 'Descripció' },
      level: 'FP',
      sectorIds: ['mfg'],
      modalityId: 'online',
      statusId: 'activo',
      skillIds: [],
    },
  ],
  sectors: [{ id: 'mfg', label: { es: 'Fabricación', en: 'Manufacturing', va: 'Fabricació' } }],
  modalities: [{ id: 'online', label: { es: 'Online', en: 'Online', va: 'En línia' } }],
  statuses: [{ id: 'activo', label: { es: 'Activo', en: 'Active', va: 'Actiu' }, tone: 'success' }],
};

test('courses: [] es un vacío válido y no recupera los cursos legacy', () => {
  assert.deepEqual(resolveCourses({ courses: [] }, LEGACY, 'es'), []);
});

test('colección parcial: solo los cursos reales del CMS, sin mezclar legacy', () => {
  const cursos = resolveCourses(CMS, LEGACY, 'es');
  assert.equal(cursos.length, 1);
  assert.equal(cursos[0].id, 'real-1');
  assert.equal(cursos[0].title, 'Curso real');
  assert.equal(cursos[0].modality, 'Online');
  assert.equal(cursos[0].modalityId, 'online');
  assert.deepEqual(cursos[0].sectorIds, ['mfg']);
  assert.deepEqual(cursos[0].sectors, ['Fabricación']);
  assert.ok(!cursos.some(c => c.title === 'Curso legacy'));
});

test('bloque ausente conserva el respaldo legacy, sin modalidad inventada', () => {
  const cursos = resolveCourses(undefined, LEGACY, 'es');
  assert.equal(cursos.length, 1);
  assert.equal(cursos[0].title, 'Curso legacy');
  assert.equal(cursos[0].modalityId, '');
  assert.equal(cursos[0].modality, '');
});

test('bloque presente sin la clave courses también es ausencia de configuración', () => {
  const cursos = resolveCourses({ sections: [] }, LEGACY, 'es');
  assert.equal(cursos.length, 1);
  assert.equal(cursos[0].title, 'Curso legacy');
});

test('el idioma se aplica sin depender del localStorage', () => {
  const cursos = resolveCourses(CMS, null, 'va');
  assert.equal(cursos[0].title, 'Curs real');
  assert.equal(cursos[0].modality, 'En línia');
  assert.equal(cursos[0].sectors[0], 'Fabricació');
});

test('COURSE_MODALITY (demo, D3) ya no se declara ni se usa en la vista', async () => {
  const fuente = await readFile(new URL('../../assets/js/views/training.js', import.meta.url), 'utf8');
  assert.doesNotMatch(fuente, /\b(?:const|let|var)\s+COURSE_MODALITY\b/, 'la constante demo del fallback debe estar retirada');
  assert.doesNotMatch(fuente, /COURSE_MODALITY\s*\[/, 'no debe quedar ningún uso de la constante demo');
});
