// F5 (D9) — coherencia de las huellas `?v=<hash8>` en un árbol sellado.
//
// Prueba en rojo ANTES de extender `scripts/verify-generated-data.mjs`: hoy la
// guarda P-40 mira solo la integridad de los 13 datos y no ve que una URL
// sellada pueda apuntar a otros bytes (o que falte `version.json`).

import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import { DATOS_GENERADOS, verificarDatosGenerados } from '../../scripts/verify-generated-data.mjs';

const sha256 = (t) => createHash('sha256').update(t).digest('hex');
const h8 = (t) => sha256(t).slice(0, 8);

async function escribir(raiz, rel, contenido) {
  const destino = path.join(raiz, rel);
  await mkdir(path.dirname(destino), { recursive: true });
  await writeFile(destino, contenido);
}

/** Árbol mínimo sellado y coherente: 13 datos, main.js, index.html y version.json. */
async function sitioSellado() {
  const raiz = await mkdtemp(path.join(os.tmpdir(), 'f5-huellas-'));
  const datos = {};
  for (const { fichero, simbolo } of DATOS_GENERADOS) {
    const contenido = `// generado\nexport const ${simbolo} = { marca: 'base' };\n`;
    await escribir(raiz, `assets/data/${fichero}`, contenido);
    datos[fichero] = { url: `assets/data/${fichero}?v=${h8(contenido)}`, sha256: sha256(contenido) };
  }
  const home = await readFile(path.join(raiz, 'assets/data/home.js'), 'utf8');
  const main = `import { HOME_CONFIG } from '../data/home.js?v=${h8(home)}';\nexport const arranque = HOME_CONFIG;\n`;
  await escribir(raiz, 'assets/js/main.js', main);
  await escribir(raiz, 'index.html',
    `<script type="module" src="./assets/js/main.js?v=${h8(main)}"></script>\n`);
  const version = {
    schema: 'ai-steam-build/1',
    commit: { content: 'c'.repeat(40), vanilla: 'v'.repeat(40) },
    fecha: '2026-10-06',
    entrada: { url: `assets/js/main.js?v=${h8(main)}`, sha256: sha256(main) },
    modulos: {},
    datos,
    recursos: {},
  };
  await escribir(raiz, 'version.json', JSON.stringify(version, null, 2) + '\n');
  return { raiz, version };
}

test('un árbol sellado coherente no produce problemas', async () => {
  const { raiz } = await sitioSellado();
  const informe = await verificarDatosGenerados(raiz);
  assert.deepEqual(informe.problemas, []);
  assert.equal(informe.comprobados, DATOS_GENERADOS.length);
});

test('una huella que no corresponde a los bytes del destino se detecta', async () => {
  const { raiz, version } = await sitioSellado();
  version.entrada.sha256 = '0'.repeat(64);
  await escribir(raiz, 'version.json', JSON.stringify(version, null, 2) + '\n');
  // La URL conserva la huella antigua; el sha256 declarado ya no casa con main.js.
  const informe = await verificarDatosGenerados(raiz);
  assert.ok(informe.problemas.some((p) => /version\.json/.test(p) && /main\.js/.test(p)), informe.problemas);
});

test('una URL sellada que apunta a otros bytes se detecta', async () => {
  const { raiz } = await sitioSellado();
  await escribir(raiz, 'assets/data/home.js',
    "// generado\nexport const HOME_CONFIG = { marca: 'cambiada sin sellar' };\n");
  const informe = await verificarDatosGenerados(raiz);
  assert.ok(
    informe.problemas.some((p) => /home\.js/.test(p) && /huella|v=/i.test(p)),
    informe.problemas,
  );
});

test('huellas sin version.json se detectan', async () => {
  const { raiz } = await sitioSellado();
  await writeFile(path.join(raiz, 'version.json'), '');
  const informe = await verificarDatosGenerados(raiz);
  assert.ok(informe.problemas.some((p) => /version\.json/.test(p)), informe.problemas);
});

test('version.json incompleto (falta un dato declarado) se detecta', async () => {
  const { raiz, version } = await sitioSellado();
  delete version.datos['legal.js'];
  await escribir(raiz, 'version.json', JSON.stringify(version, null, 2) + '\n');
  const informe = await verificarDatosGenerados(raiz);
  assert.ok(informe.problemas.some((p) => /legal\.js/.test(p)), informe.problemas);
});

test('un recurso sellado ausente se detecta', async () => {
  const { raiz, version } = await sitioSellado();
  version.recursos['assets/downloads/no-existe.pdf'] = {
    url: 'assets/downloads/no-existe.pdf?v=deadbeef',
    sha256: 'e'.repeat(64),
  };
  await escribir(raiz, 'version.json', JSON.stringify(version, null, 2) + '\n');
  const informe = await verificarDatosGenerados(raiz);
  assert.ok(
    informe.problemas.some((p) => /no-existe\.pdf/.test(p)),
    informe.problemas,
  );
});
