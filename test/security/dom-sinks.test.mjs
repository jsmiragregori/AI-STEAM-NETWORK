import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import { generateInventory } from '../../scripts/inventory-render-surface.mjs';

const AUDIT_URL = new URL('../../docs/security/AUDITORIA_SINKS_DOM.md', import.meta.url);

function sorted(values) {
  return [...values].sort((left, right) => left.localeCompare(right, 'en', { numeric: true }));
}

test('ningún sink DOM queda sin productor clasificado ni conserva una fila obsoleta', async () => {
  const [inventory, audit] = await Promise.all([
    generateInventory(),
    readFile(AUDIT_URL, 'utf8'),
  ]);

  const measured = sorted(inventory.dangerousSinks.map(
    ({ file, line, sink }) => `${file}:${line}:${sink}`,
  ));
  const rows = [...audit.matchAll(
    /^\| `([^`]+:(?:innerHTML assignment|insertAdjacentHTML))` \| `([^`]+)` \| `(AUDITADO|RETIRADO_RUNTIME)` \| ([^|]+) \|$/gm,
  )].map((match) => ({ id: match[1], producer: match[2], status: match[3], evidence: match[4].trim() }));
  const classified = sorted(rows.map(({ id }) => id));

  assert.deepEqual(measured.filter(id => !classified.includes(id)), [], 'hay sinks sin clasificación');
  assert.deepEqual(classified.filter(id => !measured.includes(id)), [], 'la auditoría contiene sinks obsoletos');
  assert.equal(new Set(classified).size, classified.length, 'cada sink debe tener una única fila');

  for (const row of rows) {
    assert.ok(row.producer.length > 0, `${row.id} carece de productor`);
    assert.ok(row.evidence.length > 0, `${row.id} carece de evidencia`);
  }
});

test('el sink conservado de News está clasificado como retirado del runtime', async () => {
  const audit = await readFile(AUDIT_URL, 'utf8');
  const retired = [...audit.matchAll(
    /^\| `([^`]+)` \| `([^`]+)` \| `RETIRADO_RUNTIME` \|/gm,
  )].map((match) => ({ id: match[1], producer: match[2] }));

  assert.deepEqual(retired, [
    { id: 'assets/js/views/news.js:404:innerHTML assignment', producer: 'render() de News' },
  ]);
});
