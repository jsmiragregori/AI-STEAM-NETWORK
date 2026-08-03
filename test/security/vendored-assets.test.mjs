import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { promisify } from 'node:util';

import test from 'node:test';

const execFileAsync = promisify(execFile);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

test('las dependencias vendorizadas conservan procedencia, versión e integridad verificables', async () => {
  const { stdout, stderr } = await execFileAsync(
    process.execPath,
    ['scripts/verify-vendored-assets.mjs'],
    { cwd: ROOT },
  );

  assert.equal(stderr, '');
  assert.match(
    stdout,
    /Verified 33 locked files; browser runtime contains no CDN dependencies\./,
  );
});
