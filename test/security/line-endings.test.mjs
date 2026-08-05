import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { readdir, readFile } from 'node:fs/promises';
import test from 'node:test';

const ROOT = new URL('../../', import.meta.url);
const VIEWS_DIR = new URL('assets/js/views/', ROOT);
const MARKETPLACE = 'assets/js/views/marketplace.js';

// El entorno de destino no tiene git: la VM de laboratorio lo demostró en
// `VAN-4.2`, donde esta prueba fallaba con ENOENT y dejaba el arnés en 42/43.
// Las comprobaciones que sostienen V7 se hacen ahora sobre `.gitattributes` y
// sobre los bytes del fichero —que es lo que de verdad importa—, y los asertos
// con git se conservan como refuerzo solo cuando git está disponible.
function detectGit() {
  try {
    execFileSync('git', ['rev-parse', '--is-inside-work-tree'], {
      cwd: ROOT,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });
    return true;
  } catch {
    return false;
  }
}

const HAS_GIT = detectGit();

function git(args) {
  return execFileSync('git', args, {
    cwd: ROOT,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();
}

/** Reglas `eol=` declaradas en `.gitattributes`, como pares [patrón, valor]. */
function parseEolRules(source) {
  return source
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('#'))
    .map(line => line.split(/\s+/))
    .flatMap(([pattern, ...attrs]) => {
      const eol = attrs.find(a => a.startsWith('eol='));
      return eol ? [[pattern, eol.slice(4)]] : [];
    });
}

test('V7 declara la excepción CRLF solo para Marketplace', async () => {
  const source = await readFile(new URL('.gitattributes', ROOT), 'utf8');
  const rules = parseEolRules(source);

  // Invariante sobre listas, no sobre totales: si alguien añade otra excepción
  // CRLF, esta comparación la nombra en vez de invitar a subir un número.
  const crlf = rules.filter(([, eol]) => eol === 'crlf').map(([pattern]) => pattern);
  assert.deepEqual(crlf, [MARKETPLACE], 'la excepción CRLF debe alcanzar solo a Marketplace');

  const lf = rules.filter(([, eol]) => eol === 'lf').map(([pattern]) => pattern);
  assert.deepEqual(lf, ['*'], 'la regla global debe seguir siendo LF para todo lo demás');

  if (HAS_GIT) {
    assert.equal(
      git(['check-attr', 'text', 'eol', '--', MARKETPLACE]),
      `${MARKETPLACE}: text: set\n${MARKETPLACE}: eol: crlf`,
    );
    assert.equal(
      git(['check-attr', 'eol', '--', 'assets/js/views/network.js']),
      'assets/js/views/network.js: eol: lf',
      'la excepción no debe alcanzar otras vistas',
    );
  }
});

test('V7 conserva los bytes: Marketplace en CRLF y ninguna otra vista', async () => {
  const names = (await readdir(VIEWS_DIR)).filter(name => name.endsWith('.js')).sort();
  assert.ok(names.length > 1, 'debe haber vistas que comparar');

  const withCrlf = [];
  for (const name of names) {
    const text = await readFile(new URL(name, VIEWS_DIR), 'utf8');
    if (text.includes('\r\n')) withCrlf.push(`assets/js/views/${name}`);
  }

  // Mide todas las vistas, no solo una de contraste: la medición anterior podía
  // pasar aunque una tercera vista se hubiera convertido a CRLF sin querer.
  assert.deepEqual(withCrlf, [MARKETPLACE], 'solo Marketplace debe estar almacenada en CRLF');

  const marketplace = await readFile(new URL(`${MARKETPLACE}`, ROOT), 'utf8');
  assert.ok(marketplace.includes('\r\n'), 'Marketplace debe conservar CRLF');
  assert.ok(
    !marketplace.replaceAll('\r\n', '').includes('\n'),
    'no debe contener LF aislados',
  );

  if (HAS_GIT) {
    assert.equal(
      git(['diff', '--name-only', '--', MARKETPLACE]),
      '',
      'la vista no debe reescribirse',
    );

    // La comprobación que faltaba, y que `VAN-4.5b` añade tras el ensayo de
    // integración: `text eol=crlf` significa **almacenar en LF y entregar en
    // CRLF**. Si el blob guardado conserva CRLF, Git ve una discrepancia
    // permanente y **cualquier clon nuevo nace con el fichero modificado**.
    //
    // El síntoma es invisible en un worktree ya existente, porque su índice
    // tiene el fichero cacheado: por eso `VAN-3B.2.4` cerró `V7` en verde con
    // el defecto dentro. Esta aserción mide el blob, no el árbol de trabajo.
    const blob = execFileSync('git', ['show', `HEAD:${MARKETPLACE}`], {
      cwd: ROOT,
      encoding: 'buffer',
      maxBuffer: 1 << 28,
    });
    assert.equal(
      blob.filter(byte => byte === 0x0d).length,
      0,
      'el blob almacenado debe estar en LF puro; con CRLF, todo clon nuevo nace sucio',
    );
    assert.ok(
      marketplace.includes('\r\n'),
      'y el fichero entregado al árbol de trabajo debe seguir en CRLF',
    );
  }
});

// La prueba de que lo anterior no depende de git. Se define solo en el proceso
// padre: el hijo la omite para no recurrir indefinidamente.
if (process.env.VAN42B_SIN_GIT !== '1') {
  test('V7 se comprueba igual sin git en el PATH', () => {
    // El ejecutor de pruebas exporta `NODE_TEST_CONTEXT` y variables afines; si
    // se heredan, el hijo cambia de formato de salida y deja de emitir el
    // resumen TAP que aquí se mide.
    const env = Object.fromEntries(
      Object.entries(process.env).filter(([clave]) => !clave.startsWith('NODE_TEST')),
    );

    const hijo = spawnSync(
      process.execPath,
      ['--test', 'test/security/line-endings.test.mjs'],
      {
        cwd: ROOT,
        encoding: 'utf8',
        // PATH vacío: `git` deja de poder resolverse, que es exactamente la
        // condición medida en la VM de `VAN-4.2`.
        env: { ...env, PATH: '', Path: '', VAN42B_SIN_GIT: '1' },
      },
    );

    const salida = hijo.stdout ?? '';
    assert.equal(hijo.status, 0, `el arnés debe salir en verde sin git:\n${hijo.stderr}`);
    assert.match(salida, /# pass 2\b/, 'las dos comprobaciones deben pasar sin git');
    assert.match(salida, /# fail 0\b/, 'ninguna debe fallar sin git');
    assert.doesNotMatch(salida, /# skipped [1-9]/, 'ninguna debe omitirse sin git');
    assert.doesNotMatch(salida, /ENOENT/, 'no debe intentar ejecutar git');
  });
}
