// H1 (auditoría F3, 2026-10-04) — El cero de una estadística visible no se
// oculta. `esc(s.value)` conserva el 0 y deja el hueco vacío cuando el dato
// falta (`escapeHtml` convierte null/undefined en ''), que es el contrato que
// rompía `esc(s.value || '')` en el hero de Gobernanza.

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

const { GOVERNANCE_CONFIG } = await import('../../assets/data/governance.js');
const { render } = await import('../../assets/js/views/governance.js');

const LABEL = { es: 'Documentos de Gobernanza', en: 'Governance Documents', va: 'Documents de Governança' };

function conStats(stats) {
  GOVERNANCE_CONFIG.heroBlock.stats = stats;
  return render();
}

function valoresDeStats(html) {
  return [...html.matchAll(/<p class="text-3xl font-extrabold text-white leading-tight">([^<]*)<\/p>/g)]
    .map((m) => m[1]);
}

test('una estadística con valor cero muestra 0 (no se oculta)', () => {
  const html = conStats([{ id: 'governance-documents', value: 0, label: LABEL }]);
  assert.deepEqual(valoresDeStats(html), ['0']);
  assert.ok(html.includes('Documentos de Gobernanza'), 'la etiqueta permanece junto al cero');
});

test('un valor positivo se muestra tal cual', () => {
  const html = conStats([{ id: 'governance-bodies', value: 6, label: LABEL }]);
  assert.deepEqual(valoresDeStats(html), ['6']);
});

test('la ausencia de dato deja el hueco vacío, sin «undefined» ni «null»', () => {
  const html = conStats([{ id: 'sin-dato', label: LABEL }]);
  assert.deepEqual(valoresDeStats(html), ['']);
  assert.doesNotMatch(html, />undefined</);
  assert.doesNotMatch(html, />null</);
});

test('el hero de la Gobernanza limpia muestra 6, 23 y 0', () => {
  const html = conStats([
    { id: 'governance-bodies', value: 6, label: LABEL },
    { id: 'consortium-partners', value: 23, label: LABEL },
    { id: 'governance-documents', value: 0, label: LABEL },
  ]);
  assert.deepEqual(valoresDeStats(html), ['6', '23', '0']);
});
