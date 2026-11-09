import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmdirSync, rmSync, symlinkSync, unlinkSync, writeFileSync } from 'node:fs';
import http from 'node:http';
import net from 'node:net';
import os from 'node:os';
import path from 'node:path';
import test, { after, before } from 'node:test';
import { fileURLToPath } from 'node:url';

import { createStaticServer, MIME_TYPES } from '../../scripts/serve-static.mjs';

// scripts/serve-static.mjs: rutas, MIME, errores, seguridad de rutas y CLI.
// Servidores de prueba solo en puertos >= 3100 (no se usan 3000-3006 ni 8501).
// Todo el contenido es sintético y vive en un directorio temporal propio.

const PUERTO_BASE = 3100;
const SCRIPT = fileURLToPath(new URL('../../scripts/serve-static.mjs', import.meta.url));

const INDEX = '<!doctype html><title>sintetico</title>\n';
const SUB_INDEX = 'indice de sub sintetico\n';
const SECRETO = 'SECRETO-SINTETICO-FUERA-DE-LA-RAIZ';
const NOMBRE_OCULTO = 'NOMBRE-LISTADO-OCULTO.txt';
const ENV = 'CLAVE=sintetica-no-real\n';

const TIPOS = [
  ['pagina.html', 'text/html; charset=utf-8'],
  ['pagina.htm', 'text/html; charset=utf-8'],
  ['MAYUSCULAS.HTML', 'text/html; charset=utf-8'],
  ['app.js', 'text/javascript; charset=utf-8'],
  ['modulo.mjs', 'text/javascript; charset=utf-8'],
  ['estilo.css', 'text/css; charset=utf-8'],
  ['datos.json', 'application/json; charset=utf-8'],
  ['mapa.js.map', 'application/json; charset=utf-8'],
  ['manifest.webmanifest', 'application/manifest+json; charset=utf-8'],
  ['texto.txt', 'text/plain; charset=utf-8'],
  ['notas.md', 'text/markdown; charset=utf-8'],
  ['datos.csv', 'text/csv; charset=utf-8'],
  ['config.yml', 'text/yaml; charset=utf-8'],
  ['config.yaml', 'text/yaml; charset=utf-8'],
  ['ruta.xml', 'application/xml; charset=utf-8'],
  ['logo.svg', 'image/svg+xml'],
  ['imagen.png', 'image/png'],
  ['foto.jpg', 'image/jpeg'],
  ['foto.jpeg', 'image/jpeg'],
  ['animacion.gif', 'image/gif'],
  ['imagen.webp', 'image/webp'],
  ['favicon.ico', 'image/x-icon'],
  ['fuente.woff2', 'font/woff2'],
  ['fuente.woff', 'font/woff'],
  ['documento.pdf', 'application/pdf'],
  ['sin-extension', 'application/octet-stream'],
  ['desconocido.xyz', 'application/octet-stream'],
];

let sandbox;
let site;
let server;
let puerto;
const enlacesCreados = [];
const enlaces = { archivoDentro: false, archivoFuera: false, carpeta: false };

function escribir(relativa, contenido) {
  const destino = path.join(site, relativa);
  mkdirSync(path.dirname(destino), { recursive: true });
  writeFileSync(destino, contenido);
}

function intentarEnlace(destino, enlace, tipo) {
  try {
    symlinkSync(destino, enlace, tipo);
    enlacesCreados.push(enlace);
    return true;
  } catch {
    // Windows sin modo desarrollador impide enlaces simbólicos de archivo (EPERM).
    return false;
  }
}

function escucharEnPuertoLibre(servidor, base) {
  return new Promise((resolve, reject) => {
    let candidato = base;
    const intentar = () => {
      const alFallar = error => {
        servidor.removeListener('listening', alEscuchar);
        if (error.code === 'EADDRINUSE' && candidato < base + 300) {
          candidato += 1;
          intentar();
        } else {
          reject(error);
        }
      };
      const alEscuchar = () => {
        servidor.removeListener('error', alFallar);
        resolve(candidato);
      };
      servidor.once('error', alFallar);
      servidor.once('listening', alEscuchar);
      servidor.listen(candidato, '127.0.0.1');
    };
    intentar();
  });
}

function pedir(metodo, ruta, puertoDestino = puerto) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      { host: '127.0.0.1', port: puertoDestino, method: metodo, path: ruta, agent: false },
      res => {
        const trozos = [];
        res.on('data', trozo => trozos.push(trozo));
        res.on('end', () => resolve({ estado: res.statusCode, cabeceras: res.headers, cuerpo: Buffer.concat(trozos) }));
        res.on('error', reject);
      },
    );
    req.on('error', reject);
    req.end();
  });
}

const texto = respuesta => respuesta.cuerpo.toString('utf8');

function asertarCabecerasDeSeguridad(respuesta) {
  assert.equal(respuesta.cabeceras['x-content-type-options'], 'nosniff');
  assert.equal(respuesta.cabeceras['cache-control'], 'no-store');
}

before(async () => {
  sandbox = mkdtempSync(path.join(os.tmpdir(), 'serve-static-'));
  site = path.join(sandbox, 'www');
  mkdirSync(site);

  escribir('index.html', INDEX);
  escribir('sub/index.html', SUB_INDEX);
  escribir('sub/pagina.html', '<p>pagina sintetica</p>');
  escribir('sub/.oculto.html', 'contenido oculto');
  escribir(`listado/${NOMBRE_OCULTO}`, 'sin index');
  escribir('.env', ENV);
  escribir('.git/config', '[core]\n');
  mkdirSync(path.join(site, 'vacio'));
  for (const [nombre] of TIPOS) escribir(`tipos/${nombre}`, `sintetico ${nombre}\n`);
  writeFileSync(path.join(sandbox, 'secreto.txt'), SECRETO);

  // Enlaces: se crean aquí y cada prueba se omite si el sistema no lo permite.
  enlaces.archivoDentro = intentarEnlace(path.join(site, 'index.html'), path.join(site, 'enlace-dentro.html'), 'file');
  enlaces.archivoFuera = intentarEnlace(path.join(sandbox, 'secreto.txt'), path.join(site, 'enlace-fuera.txt'), 'file');
  mkdirSync(path.join(sandbox, 'fuera'));
  writeFileSync(path.join(sandbox, 'fuera', 'index.html'), 'indice fuera de la raiz');
  enlaces.carpeta = intentarEnlace(
    path.join(sandbox, 'fuera'),
    path.join(site, 'enlace-carpeta'),
    process.platform === 'win32' ? 'junction' : 'dir',
  );

  server = createStaticServer({ root: site });
  puerto = await escucharEnPuertoLibre(server, PUERTO_BASE);
});

after(async () => {
  for (const enlace of enlacesCreados) {
    try {
      unlinkSync(enlace);
    } catch {
      try {
        rmdirSync(enlace);
      } catch {
        // El enlace ya no existe.
      }
    }
  }
  if (server) {
    server.closeAllConnections();
    await new Promise(resolve => server.close(resolve));
  }
  if (sandbox) rmSync(sandbox, { recursive: true, force: true });
});

test('GET / devuelve index.html completo con longitud exacta y cabeceras de seguridad', async () => {
  const respuesta = await pedir('GET', '/');
  assert.equal(respuesta.estado, 200);
  assert.equal(respuesta.cabeceras['content-type'], 'text/html; charset=utf-8');
  assert.equal(respuesta.cabeceras['content-length'], String(Buffer.byteLength(INDEX)));
  assert.equal(texto(respuesta), INDEX);
  asertarCabecerasDeSeguridad(respuesta);
});

test('un directorio con index.html sirve su índice; sin barra final redirige con 301', async () => {
  const conBarra = await pedir('GET', '/sub/');
  assert.equal(conBarra.estado, 200);
  assert.equal(texto(conBarra), SUB_INDEX);

  const sinBarra = await pedir('GET', '/sub');
  assert.equal(sinBarra.estado, 301);
  assert.equal(sinBarra.cabeceras.location, '/sub/');

  const conQuery = await pedir('GET', '/sub/?v=2');
  assert.equal(conQuery.estado, 200);
  assert.equal(texto(conQuery), SUB_INDEX);
});

test('un directorio sin index.html responde 404 y no lista su contenido', async () => {
  const respuesta = await pedir('GET', '/listado/');
  assert.equal(respuesta.estado, 404);
  assert.ok(!texto(respuesta).includes(NOMBRE_OCULTO), 'el 404 no debe listar el directorio');
  assert.ok(!texto(respuesta).includes('listado'), 'el 404 no debe nombrar el directorio');
  asertarCabecerasDeSeguridad(respuesta);

  const vacio = await pedir('GET', '/vacio/');
  assert.equal(vacio.estado, 404);
});

test('una ruta inexistente responde 404 sin revelar la ruta del sistema', async () => {
  const respuesta = await pedir('GET', '/no-existe.html');
  assert.equal(respuesta.estado, 404);
  assert.equal(texto(respuesta), 'No encontrado\n');
  assert.ok(!texto(respuesta).includes(site));
  asertarCabecerasDeSeguridad(respuesta);
});

test('el tipo MIME sale de la extensión, sin distinguir mayúsculas', async () => {
  for (const [nombre, tipo] of TIPOS) {
    const respuesta = await pedir('GET', `/tipos/${nombre}`);
    assert.equal(respuesta.estado, 200, nombre);
    assert.equal(respuesta.cabeceras['content-type'], tipo, nombre);
  }
});

test('la tabla MIME exportada queda cubierta por fixtures de prueba', () => {
  for (const extension of Object.keys(MIME_TYPES)) {
    assert.ok(
      TIPOS.some(([nombre]) => nombre.toLowerCase().endsWith(extension)),
      `falta un fixture para ${extension}`,
    );
  }
});

test('el traversal codificado sale de la raíz y responde 403 sin contenido', async () => {
  for (const ruta of ['/..%2f..%2fsecreto.txt', '/..%2f..', '/%2e%2e%2fsecreto.txt']) {
    const respuesta = await pedir('GET', ruta);
    assert.equal(respuesta.estado, 403, ruta);
    assert.ok(!texto(respuesta).includes(SECRETO), ruta);
    asertarCabecerasDeSeguridad(respuesta);
  }
});

test('el traversal con barras de Windows o normalizado por la URL no sirve el secreto', async () => {
  const contraBarras = await pedir('GET', '/..%5c..%5csecreto.txt');
  assert.ok([403, 404].includes(contraBarras.estado), `estado ${contraBarras.estado}`);
  assert.ok(!texto(contraBarras).includes(SECRETO));

  for (const ruta of ['/../secreto.txt', '/%2e%2e/secreto.txt']) {
    const respuesta = await pedir('GET', ruta);
    assert.equal(respuesta.estado, 404, ruta);
    assert.ok(!texto(respuesta).includes(SECRETO), ruta);
  }
});

test('una ruta de unidad de Windows dentro de la raíz no se sirve', async () => {
  const respuesta = await pedir('GET', '/C:/Windows/win.ini');
  assert.equal(respuesta.estado, 404);
});

test('el byte nulo y la codificación inválida responden 400', async () => {
  for (const ruta of ['/index.html%00', '/%00/index.html', '/%00', '/%E0%A4%A']) {
    const respuesta = await pedir('GET', ruta);
    assert.equal(respuesta.estado, 400, ruta);
    asertarCabecerasDeSeguridad(respuesta);
  }
});

test('los dotfiles y dotdirs nunca se sirven: 404, también con HEAD', async () => {
  for (const ruta of ['/.env', '/.git/config', '/.git/', '/sub/.oculto.html']) {
    const respuesta = await pedir('GET', ruta);
    assert.equal(respuesta.estado, 404, ruta);
    assert.ok(!texto(respuesta).includes('CLAVE'), ruta);
  }
  const cabeza = await pedir('HEAD', '/.env');
  assert.equal(cabeza.estado, 404);
  assert.equal(cabeza.cuerpo.length, 0);
});

test('HEAD devuelve las cabeceras de GET sin cuerpo', async () => {
  const cabeza = await pedir('HEAD', '/index.html');
  assert.equal(cabeza.estado, 200);
  assert.equal(cabeza.cabeceras['content-type'], 'text/html; charset=utf-8');
  assert.equal(cabeza.cabeceras['content-length'], String(Buffer.byteLength(INDEX)));
  assert.equal(cabeza.cuerpo.length, 0);
  asertarCabecerasDeSeguridad(cabeza);

  const raiz = await pedir('HEAD', '/sub/');
  assert.equal(raiz.estado, 200);
  assert.equal(raiz.cuerpo.length, 0);

  const redireccion = await pedir('HEAD', '/sub');
  assert.equal(redireccion.estado, 301);

  const inexistente = await pedir('HEAD', '/no-existe.html');
  assert.equal(inexistente.estado, 404);
  assert.equal(inexistente.cuerpo.length, 0);
});

test('los métodos distintos de GET y HEAD responden 405 y no escriben nada', async () => {
  for (const metodo of ['POST', 'PUT', 'DELETE', 'OPTIONS']) {
    const respuesta = await pedir(metodo, '/index.html');
    assert.equal(respuesta.estado, 405, metodo);
    assert.equal(respuesta.cabeceras.allow, 'GET, HEAD', metodo);
    asertarCabecerasDeSeguridad(respuesta);
  }
  const creado = await pedir('PUT', '/creado-por-put.txt');
  assert.equal(creado.estado, 405);
  const despues = await pedir('GET', '/creado-por-put.txt');
  assert.equal(despues.estado, 404);
});

test('un enlace simbólico que queda dentro de la raíz se sirve', async t => {
  if (!enlaces.archivoDentro) {
    t.skip('este sistema no permite crear enlaces simbólicos de archivo');
    return;
  }
  const respuesta = await pedir('GET', '/enlace-dentro.html');
  assert.equal(respuesta.estado, 200);
  assert.equal(texto(respuesta), INDEX);
});

test('un enlace simbólico que sale de la raíz responde 403', async t => {
  if (!enlaces.archivoFuera) {
    t.skip('este sistema no permite crear enlaces simbólicos de archivo');
    return;
  }
  const respuesta = await pedir('GET', '/enlace-fuera.txt');
  assert.equal(respuesta.estado, 403);
  assert.ok(!texto(respuesta).includes(SECRETO));
});

test('un directorio enlazado que sale de la raíz responde 403 aunque tenga index.html', async t => {
  if (!enlaces.carpeta) {
    t.skip('este sistema no permite crear enlaces de directorio');
    return;
  }
  const respuesta = await pedir('GET', '/enlace-carpeta/');
  assert.equal(respuesta.estado, 403);
  assert.ok(!texto(respuesta).includes('indice fuera de la raiz'));
});

test('createStaticServer exige una raíz existente', () => {
  assert.throws(() => createStaticServer({ root: path.join(sandbox, 'no-existe') }), { code: 'ENOENT' });
});

// --- CLI -------------------------------------------------------------------

function ejecutarCli(args) {
  return spawnSync(process.execPath, [SCRIPT, ...args], {
    encoding: 'utf8',
    timeout: 15000,
    windowsHide: true,
  });
}

test('sin --port el CLI sale con código 2 y nombra --port', () => {
  const r = ejecutarCli([]);
  assert.equal(r.status, 2);
  assert.match(r.stderr, /--port/);
});

test('un --port no válido sale con código 2', () => {
  for (const valor of ['abc', '0', '70000', '-1', '']) {
    const r = ejecutarCli(['--port', valor]);
    assert.equal(r.status, 2, `valor "${valor}"`);
  }
});

test('una opción desconocida o un --port sin valor salen con código 2', () => {
  assert.equal(ejecutarCli(['--puerto', '3100']).status, 2);
  assert.equal(ejecutarCli(['--port']).status, 2);
});

test('un --root inexistente sale con código 2', () => {
  const r = ejecutarCli(['--port', '3150', '--root', path.join(sandbox, 'no-existe')]);
  assert.equal(r.status, 2);
  assert.match(r.stderr, /--root/);
});

test('--help imprime el uso y sale con código 0', () => {
  const r = ejecutarCli(['--help']);
  assert.equal(r.status, 0);
  assert.match(r.stdout, /--port <n>/);
});

test('un puerto ya ocupado sale con código 1 y lo declara', async () => {
  const bloqueo = net.createServer();
  const ocupado = await escucharEnPuertoLibre(bloqueo, PUERTO_BASE + 400);
  try {
    const r = spawnSync(process.execPath, [SCRIPT, '--port', String(ocupado), '--root', site], {
      encoding: 'utf8',
      timeout: 15000,
      windowsHide: true,
    });
    assert.equal(r.status, 1);
    assert.match(r.stderr, /EADDRINUSE|EACCES/);
  } finally {
    await new Promise(resolve => bloqueo.close(resolve));
  }
});

function arrancarCli(args) {
  const child = spawn(process.execPath, [SCRIPT, ...args], {
    stdio: ['ignore', 'pipe', 'pipe'],
    windowsHide: true,
  });
  child.salida = { stdout: '', stderr: '' };
  child.stdout.on('data', trozo => {
    child.salida.stdout += trozo;
  });
  child.stderr.on('data', trozo => {
    child.salida.stderr += trozo;
  });
  return child;
}

function esperarArranque(child, limiteMs = 15000) {
  return new Promise(resolve => {
    const limite = setTimeout(() => resolve({ arrancado: false, motivo: 'tiempo agotado' }), limiteMs);
    const mirar = () => {
      if (/escuchando/.test(child.salida.stdout)) {
        clearTimeout(limite);
        resolve({ arrancado: true });
      }
    };
    child.stdout.on('data', mirar);
    // 'close' (no 'exit'): garantiza que stderr está vaciado antes de decidir.
    child.once('close', code => {
      clearTimeout(limite);
      resolve({ arrancado: false, motivo: `salió con código ${code}` });
    });
  });
}

async function arrancarServidorCli(raiz) {
  for (let candidato = PUERTO_BASE + 200; candidato < PUERTO_BASE + 260; candidato += 1) {
    const child = arrancarCli(['--port', String(candidato), '--root', raiz]);
    const resultado = await esperarArranque(child);
    if (resultado.arrancado) return { child, puerto: candidato };
    if (!/EADDRINUSE|EACCES/.test(child.salida.stderr)) {
      throw new Error(`arranque fallido (${resultado.motivo}): ${child.salida.stderr}`);
    }
  }
  throw new Error('sin puerto libre para el servidor de prueba');
}

async function esperarHasta(condicion, limiteMs = 5000) {
  const hasta = Date.now() + limiteMs;
  while (Date.now() < hasta) {
    if (condicion()) return true;
    await new Promise(resolve => setTimeout(resolve, 50));
  }
  return condicion();
}

function detener(child) {
  return new Promise(resolve => {
    if (child.exitCode !== null || child.signalCode !== null) return resolve();
    child.once('exit', () => resolve());
    child.kill();
  });
}

test('el CLI escucha en loopback por defecto y registra una línea por petición', async () => {
  const { child, puerto: p } = await arrancarServidorCli(site);
  try {
    assert.match(child.salida.stdout, new RegExp(`http://127\\.0\\.0\\.1:${p}/`));
    const respuesta = await pedir('GET', '/index.html', p);
    assert.equal(respuesta.estado, 200);
    assert.ok(
      await esperarHasta(() => /GET \/index\.html 200/.test(child.salida.stdout)),
      `sin línea de log: ${child.salida.stdout}`,
    );
  } finally {
    await detener(child);
  }
});

test('SIGTERM cierra el servidor con código 0', { skip: process.platform === 'win32' ? 'Windows no entrega SIGTERM: kill() termina el proceso a la fuerza' : false }, async () => {
  const { child } = await arrancarServidorCli(site);
  const cierre = new Promise(resolve => child.once('close', (code, senal) => resolve({ code, senal })));
  child.kill('SIGTERM');
  const { code, senal } = await cierre;
  assert.equal(code, 0);
  assert.equal(senal, null);
  assert.match(child.salida.stdout, /SIGTERM: cerrando servidor/);
});
