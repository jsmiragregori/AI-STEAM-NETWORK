import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const EVIDENCE_ROOT = new URL('../../docs/security/evidence/', import.meta.url);

test('la captura OSV VAN-3.2 corresponde a las versiones upstream inventariadas', async () => {
  const request = JSON.parse(await readFile(
    new URL('2026-08-03_VAN-3.2_osv-request.json', EVIDENCE_ROOT),
    'utf8',
  ));
  const response = JSON.parse(await readFile(
    new URL('2026-08-03_VAN-3.2_osv-response.json', EVIDENCE_ROOT),
    'utf8',
  ));

  assert.equal(request.endpoint, 'https://api.osv.dev/v1/querybatch');
  assert.equal(request.queriedAt, '2026-08-03T17:44:58.034Z');
  assert.deepEqual(request.queries, [
    { version: '1.24.0', package: { ecosystem: 'npm', name: 'lucide' } },
    { version: '1.2.3', package: { ecosystem: 'npm', name: 'wordcloud' } },
  ]);
  assert.equal(response.results.length, request.queries.length);
  assert.deepEqual(response.results, [{}, {}]);
});
