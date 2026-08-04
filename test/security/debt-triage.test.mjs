import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const SECURITY_DOCS = new URL('../../docs/security/', import.meta.url);

function uniqueSorted(values) {
  return [...new Set(values)].sort((left, right) => left.localeCompare(right, 'en', { numeric: true }));
}

test('toda deuda abierta conserva una propuesta de triaje', async () => {
  const debt = await readFile(new URL('DEUDA_VANILLA.md', SECURITY_DOCS), 'utf8');
  const triage = await readFile(new URL('TRIAJE_DEUDA_VANILLA.md', SECURITY_DOCS), 'utf8');

  const openIds = uniqueSorted(
    [...debt.matchAll(/^\| (V\d+) \|.*\| \*\*Abierta\./gm)].map(match => match[1]),
  );
  const triagedIds = uniqueSorted(
    [...triage.matchAll(/^### (V\d+)$/gm)].map(match => match[1]),
  );

  const openWithoutTriage = openIds.filter(id => !triagedIds.includes(id));
  assert.deepEqual(openWithoutTriage, [], 'cada deuda abierta debe tener una sección de triaje');
  assert.match(triage, /\*\*Propuesta: (?:Saldar|Aceptar)/);

  for (const id of openIds) {
    const section = triage.match(new RegExp(`^### ${id}\\r?\\n([\\s\\S]*?)(?=^### V\\d+|^## |(?![\\s\\S]))`, 'm'))?.[1] || '';
    assert.match(section, /\*\*Propuesta: (?:Saldar|Aceptar)/, `${id} carece de propuesta`);
  }
});
