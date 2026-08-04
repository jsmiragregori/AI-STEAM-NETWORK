import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const ROOT = new URL('../../', import.meta.url);
const MARKETPLACE = 'assets/js/views/marketplace.js';

function git(args) {
  return execFileSync('git', args, {
    cwd: ROOT,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();
}

test('V7 conserva una excepción CRLF específica sin reescribir Marketplace', async () => {
  assert.equal(
    git(['check-attr', 'text', 'eol', '--', MARKETPLACE]),
    `${MARKETPLACE}: text: set\n${MARKETPLACE}: eol: crlf`,
  );
  assert.equal(
    git(['check-attr', 'eol', '--', 'assets/js/views/network.js']),
    'assets/js/views/network.js: eol: lf',
    'la excepción no debe alcanzar otras vistas',
  );

  const bytes = await readFile(new URL(`../../${MARKETPLACE}`, import.meta.url));
  const text = bytes.toString('utf8');
  assert.ok(text.includes('\r\n'), 'Marketplace debe conservar CRLF');
  assert.ok(!text.replaceAll('\r\n', '').includes('\n'), 'no debe contener LF aislados');
  assert.equal(git(['diff', '--name-only', '--', MARKETPLACE]), '', 'la vista no debe reescribirse');
});
