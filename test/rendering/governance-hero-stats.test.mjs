// H1 (auditoría F3, 2026-10-04) + F3 bis (2026-10-04) — El cero ya no se
// muestra: la caja de una estadística con valor efectivo cero no se renderiza
// (regla común en `utils/stat-visibility.js`) y reaparece sola al pasar a un
// valor positivo, sin tocar flags ni datos. La ausencia de dato no es cero y
// conserva el hueco vacío de `escapeHtml` (null/undefined → '').

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

test('una estadística con valor cero no pinta su caja ni su etiqueta', () => {
  const html = conStats([{ id: 'governance-documents', value: 0, label: LABEL }]);
  assert.deepEqual(valoresDeStats(html), []);
  assert.ok(!html.includes('Documentos de Gobernanza'), 'la etiqueta desaparece con la caja');
  // La cifra en datos sigue siendo cero: la regla es solo de presentación.
  assert.equal(GOVERNANCE_CONFIG.heroBlock.stats[0].value, 0);
});

test('un valor positivo se muestra tal cual', () => {
  const html = conStats([{ id: 'governance-bodies', value: 6, label: LABEL }]);
  assert.deepEqual(valoresDeStats(html), ['6']);
});

test('la transición 0 → positivo → 0 reaparece y desaparece sin tocar flags', () => {
  const stat = { id: 'governance-documents', value: 0, label: LABEL };
  assert.deepEqual(valoresDeStats(conStats([stat])), []);
  stat.value = 7;
  assert.deepEqual(valoresDeStats(conStats([stat])), ['7']);
  stat.value = 0;
  assert.deepEqual(valoresDeStats(conStats([stat])), []);
});

test('la ausencia de dato no es cero: deja el hueco vacío, sin «undefined» ni «null»', () => {
  const html = conStats([{ id: 'sin-dato', label: LABEL }]);
  assert.deepEqual(valoresDeStats(html), ['']);
  assert.doesNotMatch(html, />undefined</);
  assert.doesNotMatch(html, />null</);
});

test('el hero de la Gobernanza limpia muestra 6 y 23; el documento 0 no pinta caja', () => {
  const html = conStats([
    { id: 'governance-bodies', value: 6, label: LABEL },
    { id: 'consortium-partners', value: 23, label: LABEL },
    { id: 'governance-documents', value: 0, label: { es: 'DOCUMENTOS-CERO', en: 'DOCS-ZERO', va: 'DOCS-ZERO' } },
  ]);
  assert.deepEqual(valoresDeStats(html), ['6', '23']);
  assert.ok(!html.includes('DOCUMENTOS-CERO'));
});
