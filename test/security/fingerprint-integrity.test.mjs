// F5 (D9) — coherencia de los activos inmutables: copias `<nombre>.<hash8>.<ext>`.
//
// Prueba en rojo ANTES de extender `scripts/verify-generated-data.mjs` al esquema
// `ai-steam-build/2`: hoy la guarda P-40 solo mira la integridad de los 13 datos y
// no ve que una copia sellada pueda faltar, estar alterada o no cuadrar con su
// manifest. Los canónicos que el panel escribe quedan fuera del alcance del sello.

import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, rm, stat } from 'node:fs/promises';
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

const nombreCopia = (rel, contenido) => {
  const i = rel.lastIndexOf('.');
  return `${rel.slice(0, i)}.${h8(contenido)}${rel.slice(i)}`;
};

/** Árbol mínimo sellado con copias inmutables: 13 datos, main, index y version.json. */
async function sitioSellado() {
  const raiz = await mkdtemp(path.join(os.tmpdir(), 'f5-copias-'));
  const contenidoDatos = {};
  const datos = {};
  for (const { fichero, simbolo } of DATOS_GENERADOS) {
    const contenido = `// generado\nexport const ${simbolo} = { marca: 'base' };\n`;
    contenidoDatos[fichero] = contenido;
    await escribir(raiz, `assets/data/${fichero}`, contenido);
    const copia = nombreCopia(`assets/data/${fichero}`, contenido);
    await escribir(raiz, copia, contenido);
    datos[fichero] = { url: copia, sha256: sha256(contenido), canonico: `assets/data/${fichero}` };
  }
  const home = contenidoDatos['home.js'];
  const mainCanonico = "import { HOME_CONFIG } from '../data/home.js';\nexport const arranque = HOME_CONFIG;\n";
  const main = `import { HOME_CONFIG } from '../data/${nombreCopia('home.js', home)}';\nexport const arranque = HOME_CONFIG;\n`;
  await escribir(raiz, 'assets/js/main.js', mainCanonico);
  const copiaMain = nombreCopia('assets/js/main.js', main);
  await escribir(raiz, copiaMain, main);
  await escribir(raiz, 'index.html',
    `<script type="module" src="./${copiaMain}"></script>\n`);
  const version = {
    schema: 'ai-steam-build/2',
    commit: { content: 'c'.repeat(40), vanilla: 'v'.repeat(40) },
    fecha: '2026-10-06',
    entrada: { url: copiaMain, sha256: sha256(main), canonico: 'assets/js/main.js' },
    modulos: {},
    datos,
    recursos: {},
  };
  await escribir(raiz, 'version.json', JSON.stringify(version, null, 2) + '\n');
  return { raiz, version, datos, copiaMain, main, contenidoDatos };
}

test('un árbol sellado con copias coherentes no produce problemas', async () => {
  const { raiz } = await sitioSellado();
  const informe = await verificarDatosGenerados(raiz);
  assert.deepEqual(informe.problemas, []);
  assert.equal(informe.comprobados, DATOS_GENERADOS.length);
});

test('una copia alterada se detecta aunque el canónico siga intacto', async () => {
  const { raiz, version, datos } = await sitioSellado();
  const copiaLegal = datos['legal.js'].url;
  await escribir(raiz, copiaLegal, "// generado\nexport const LEGAL_CONFIG = { marca: 'alterada' };\n");
  const informe = await verificarDatosGenerados(raiz);
  assert.ok(informe.problemas.some((p) => p.includes(copiaLegal)), informe.problemas);
  const canonico = await readFile(path.join(raiz, 'assets/data/legal.js'), 'utf8');
  assert.match(canonico, /marca: 'base'/, 'el canónico no se toca en esta prueba');
});

test('una copia ausente referenciada por el manifest se detecta', async () => {
  const { raiz, version } = await sitioSellado();
  const copia = version.entrada.url;
  await rm(path.join(raiz, ...copia.split('/')));
  const informe = await verificarDatosGenerados(raiz);
  assert.ok(informe.problemas.some((p) => p.includes(copia)), informe.problemas);
});

test('sha256 del manifest que no cuadra con su copia se detecta', async () => {
  const { raiz, version } = await sitioSellado();
  version.entrada.sha256 = '0'.repeat(64);
  await escribir(raiz, 'version.json', JSON.stringify(version, null, 2) + '\n');
  const informe = await verificarDatosGenerados(raiz);
  assert.ok(informe.problemas.some((p) => /version\.json/.test(p) && /main/.test(p)), informe.problemas);
});

test('la huella del nombre que no cuadra con los bytes se detecta', async () => {
  const { raiz, version } = await sitioSellado();
  const item = version.datos['home.js'];
  item.url = 'assets/data/home.deadbeef.js';
  await escribir(raiz, item.url, await readFile(path.join(raiz, 'assets/data/home.js')));
  await escribir(raiz, 'version.json', JSON.stringify(version, null, 2) + '\n');
  const informe = await verificarDatosGenerados(raiz);
  assert.ok(informe.problemas.some((p) => /home\.deadbeef\.js|huella/.test(p)), informe.problemas);
});

test('huellas sin version.json se detectan', async () => {
  const { raiz } = await sitioSellado();
  await writeFile(path.join(raiz, 'version.json'), '');
  const informe = await verificarDatosGenerados(raiz);
  assert.ok(informe.problemas.some((p) => /version\.json/.test(p)), informe.problemas);
});

test('version.json sin un dato declarado (canónico) se detecta', async () => {
  const { raiz, version } = await sitioSellado();
  delete version.datos['legal.js'];
  await escribir(raiz, 'version.json', JSON.stringify(version, null, 2) + '\n');
  const informe = await verificarDatosGenerados(raiz);
  assert.ok(informe.problemas.some((p) => /legal\.js/.test(p)), informe.problemas);
});

test('un recurso sellado ausente se detecta', async () => {
  const { raiz, version } = await sitioSellado();
  version.recursos['assets/downloads/no-existe.pdf'] = {
    url: 'assets/downloads/no-existe.deadbeef.pdf',
    sha256: 'e'.repeat(64),
    canonico: 'assets/downloads/no-existe.pdf',
  };
  await escribir(raiz, 'version.json', JSON.stringify(version, null, 2) + '\n');
  const informe = await verificarDatosGenerados(raiz);
  assert.ok(informe.problemas.some((p) => /no-existe/.test(p)), informe.problemas);
});

test('un index.html que carga el módulo canónico en vez de la copia se detecta', async () => {
  const { raiz } = await sitioSellado();
  await escribir(raiz, 'index.html', '<script type="module" src="./assets/js/main.js"></script>\n');
  const informe = await verificarDatosGenerados(raiz);
  assert.ok(informe.problemas.some((p) => /index\.html/.test(p)), informe.problemas);
});
