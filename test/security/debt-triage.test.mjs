import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const SECURITY_DOCS = new URL('../../docs/security/', import.meta.url);

function uniqueSorted(values) {
  return [...new Set(values)].sort((left, right) => left.localeCompare(right, 'en', { numeric: true }));
}

function parseDebtRows(document) {
  const table = document.match(/^### Tabla\r?\n([\s\S]*?)(?=^## 3\.)/m)?.[1];
  assert.ok(table, 'no se encontró la tabla normativa de deuda');

  return table
    .split(/\r?\n/)
    .filter(line => /^\| V\d+ \|/.test(line))
    .map((line) => {
      const cells = line.slice(2, -2).split(' | ');
      assert.equal(cells.length, 4, `fila de deuda mal formada: ${line}`);
      const [id, debt, origin, statusText] = cells;
      const state = statusText.match(/^\*\*(Abierta|Cerrada|Aceptada)\b/)?.[1];
      return { id, debt, origin, statusText, state };
    });
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

test('la puerta VAN-3B solo admite estados normativos y ninguna deuda abierta', async () => {
  const debt = await readFile(new URL('DEUDA_VANILLA.md', SECURITY_DOCS), 'utf8');
  const rows = parseDebtRows(debt);

  assert.ok(rows.length > 0, 'la tabla de deuda no puede quedar vacía');
  assert.equal(new Set(rows.map(({ id }) => id)).size, rows.length, 'cada deuda debe tener un ID único');
  assert.deepEqual(
    rows.filter(({ state }) => !state).map(({ id, statusText }) => ({ id, statusText })),
    [],
    'toda fila debe comenzar por Abierta, Cerrada o Aceptada en negrita',
  );
  assert.deepEqual(
    rows.filter(({ state }) => state === 'Abierta').map(({ id }) => id),
    [],
    'VAN-3B no puede cerrarse con deuda abierta',
  );
});

test('la guarda de salida detecta estados abiertos y vocabulario desconocido', () => {
  const fixture = `### Tabla

| # | Deuda | Origen | Estado |
|---|---|---|---|
| V1 | ejemplo | prueba | **Abierta.** pendiente |
| V2 | ejemplo | prueba | **Diferida.** no es un estado válido |

## 3. Fin`;
  const rows = parseDebtRows(fixture);

  assert.deepEqual(rows.filter(({ state }) => state === 'Abierta').map(({ id }) => id), ['V1']);
  assert.deepEqual(rows.filter(({ state }) => !state).map(({ id }) => id), ['V2']);
});
