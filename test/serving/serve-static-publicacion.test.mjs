import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createHash, randomBytes } from 'node:crypto';
import { mkdirSync, mkdtempSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

// REGRESIÓN DEL INCIDENTE 2026-11-09 (publicación con VANILLA activa).
//
// Un cliente lento mantiene una descarga de 32 MiB a medias. Mientras tanto, el
// escritor publica una versión nueva con write-a-temporal + fs.renameSync sobre el
// destino, UNA sola vez y sin reintentos. Deben cumplirse a la vez:
//   - el rename tiene éxito a la primera;
//   - la descarga en curso completa con el SHA-256 de la versión ANTERIOR;
//   - una petición nueva recibe el SHA-256 de la versión NUEVA;
//   - el servidor es el mismo proceso (mismo PID) durante todo el escenario.
//
// Servidor: el CLI real (scripts/serve-static.mjs) en un proceso hijo.
// Contraste: http.server de Python, solo si SERVE_STATIC_CONTRASTE_PYTHON apunta a un
// intérprete (no se fija ninguna ruta local en el repositorio). Es un diagnóstico
// del defecto original, marcado como TODO: no es una guarda de producto.
// Puertos: solo >= 3500, sin tocar 3000-3006 ni 8501.

const SCRIPT = fileURLToPath(new URL('../../scripts/serve-static.mjs', import.meta.url));
const MIB = 1024 * 1024;
const TAMANO = 32 * MIB;
const PAUSA_TRAS = 1 * MIB;
const PUERTO_BASE = 3500;
const PYTHON = process.env.SERVE_STATIC_CONTRASTE_PYTHON;

const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
const esperar = ms => new Promise(resolve => setTimeout(resolve, ms));

async function esperarHasta(condicion, limiteMs = 5000) {
  const hasta = Date.now() + limiteMs;
  while (Date.now() < hasta) {
    if (condicion()) return true;
    await esperar(50);
  }
  return condicion();
}

/** Escritor sintético: un temporal y un único rename. Si el rename falla, la prueba falla. */
function publicar(destino, datos) {
  const temporal = `${destino}.tmp`;
  writeFileSync(temporal, datos);
  renameSync(temporal, destino);
  return sha256(datos);
}

/**
 * Descarga con control: `pausarTras` deja de leer tras esa cantidad de bytes;
 * `esperarEstancada` detecta cuándo la transferencia ya no avanza (buffers llenos).
 */
function descargar(puertoDestino, ruta, { pausarTras } = {}) {
  return new Promise((resolve, reject) => {
    const req = http.get({ host: '127.0.0.1', port: puertoDestino, path: ruta, agent: false }, res => {
      const hash = createHash('sha256');
      let bytes = 0;
      let pausada = false;
      let terminar;
      let fallar;
      const hecho = new Promise((ok, ko) => {
        terminar = ok;
        fallar = ko;
      });
      hecho.catch(() => {});
      res.on('data', trozo => {
        hash.update(trozo);
        bytes += trozo.length;
        if (pausarTras !== undefined && !pausada && bytes >= pausarTras) {
          pausada = true;
          res.pause();
        }
      });
      res.on('end', () => terminar({ estado: res.statusCode, sha: hash.digest('hex'), bytes }));
      res.on('error', fallar);
      resolve({
        estado: res.statusCode,
        hecho,
        bytesRecibidos: () => bytes,
        async esperarEstancada() {
          let anterior = -1;
          let estable = 0;
          for (let i = 0; i < 300 && estable < 4; i += 1) {
            await esperar(100);
            const ahora = res.socket.bytesRead;
            if (ahora === anterior) estable += 1;
            else {
              estable = 0;
              anterior = ahora;
            }
          }
          return estable >= 4;
        },
        reanudar: () => res.resume(),
        abortar: () => req.destroy(),
      });
    });
    req.on('error', reject);
  });
}

function detener(proceso) {
  return new Promise(resolve => {
    if (proceso.exitCode !== null || proceso.signalCode !== null) return resolve();
    proceso.once('close', () => resolve());
    proceso.kill();
  });
}

/**
 * Arranca un servidor en el primer puerto libre desde `base`. `listo` detecta el
 * arranque en stdout; si el puerto está ocupado se prueba el siguiente.
 */
async function arrancarEnPuertoLibre(comando, argumentosPara, listo, base) {
  for (let puerto = base; puerto < base + 60; puerto += 1) {
    const proceso = spawn(comando, argumentosPara(puerto), {
      stdio: ['ignore', 'pipe', 'pipe'],
      windowsHide: true,
    });
    proceso.salida = { stdout: '', stderr: '' };
    proceso.stdout.on('data', trozo => {
      proceso.salida.stdout += trozo;
    });
    proceso.stderr.on('data', trozo => {
      proceso.salida.stderr += trozo;
    });
    const estado = await new Promise(resolve => {
      const limite = setTimeout(() => resolve('tiempo'), 15000);
      proceso.stdout.on('data', () => {
        if (listo.test(proceso.salida.stdout)) {
          clearTimeout(limite);
          resolve('listo');
        }
      });
      proceso.once('close', () => {
        clearTimeout(limite);
        resolve('cerrado');
      });
    });
    if (estado === 'listo') return { proceso, puerto };
    if (estado === 'tiempo') {
      await detener(proceso);
      throw new Error(`el servidor no arrancó a tiempo: ${proceso.salida.stderr}`);
    }
    const ocupado = /EADDRINUSE|EACCES|Errno 10048|Errno 98|Errno 13/;
    if (!ocupado.test(proceso.salida.stderr)) {
      throw new Error(`arranque fallido: ${proceso.salida.stderr || proceso.salida.stdout}`);
    }
  }
  throw new Error('sin puerto libre para el servidor de prueba');
}

function arrancarNode(raiz) {
  return arrancarEnPuertoLibre(
    process.execPath,
    puerto => [SCRIPT, '--port', String(puerto), '--root', raiz],
    /escuchando/,
    PUERTO_BASE,
  );
}

function arrancarPython(raiz) {
  return arrancarEnPuertoLibre(
    PYTHON,
    puerto => ['-I', '-u', '-m', 'http.server', String(puerto), '--bind', '127.0.0.1', '--directory', raiz],
    /Serving HTTP/,
    PUERTO_BASE + 100,
  );
}

function prepararSandbox() {
  const sandbox = mkdtempSync(path.join(os.tmpdir(), 'serve-static-publica-'));
  const raiz = path.join(sandbox, 'www');
  mkdirSync(raiz);
  return { sandbox, raiz, destino: path.join(raiz, 'modulo.js') };
}

test('publicación con servidor activo: rename durante descarga lenta, mismo PID, versiones íntegras', { timeout: 180000 }, async () => {
  const { sandbox, raiz, destino } = prepararSandbox();
  let servidor;
  try {
    let vigente = publicar(destino, randomBytes(TAMANO));
    servidor = await arrancarNode(raiz);
    const { proceso, puerto } = servidor;
    const pid = proceso.pid;

    for (let ciclo = 1; ciclo <= 2; ciclo += 1) {
      const lenta = await descargar(puerto, '/modulo.js', { pausarTras: PAUSA_TRAS });
      assert.equal(lenta.estado, 200, `ciclo ${ciclo}: estado de la descarga lenta`);
      assert.ok(await lenta.esperarEstancada(), `ciclo ${ciclo}: la descarga lenta no se estabilizó`);
      assert.ok(lenta.bytesRecibidos() > 0 && lenta.bytesRecibidos() < TAMANO, `ciclo ${ciclo}: la descarga debe seguir en curso`);

      // Sin reintentos: si el rename no tiene éxito a la primera, la prueba falla aquí.
      const nueva = publicar(destino, randomBytes(TAMANO));

      const fresca = await descargar(puerto, '/modulo.js');
      const frescaDatos = await fresca.hecho;
      assert.equal(fresca.estado, 200, `ciclo ${ciclo}: estado de la petición nueva`);
      assert.equal(frescaDatos.bytes, TAMANO, `ciclo ${ciclo}: la petición nueva debe ser completa`);
      assert.equal(frescaDatos.sha, nueva, `ciclo ${ciclo}: la petición nueva debe recibir la versión publicada`);

      lenta.reanudar();
      const antigua = await lenta.hecho;
      assert.equal(antigua.bytes, TAMANO, `ciclo ${ciclo}: la descarga en curso debe ser completa`);
      assert.equal(antigua.sha, vigente, `ciclo ${ciclo}: la descarga en curso debe ser la versión anterior`);

      assert.equal(proceso.pid, pid, `ciclo ${ciclo}: el PID debe ser el mismo`);
      assert.equal(proceso.exitCode, null, `ciclo ${ciclo}: el servidor debe seguir vivo`);
      vigente = nueva;
    }

    assert.equal(sha256(readFileSync(destino)), vigente, 'el archivo en disco debe ser la última versión');
    assert.ok(
      await esperarHasta(() => (proceso.salida.stdout.match(/GET \/modulo\.js 200/g) ?? []).length >= 4),
      `el log debe registrar las cuatro descargas completas: ${proceso.salida.stdout}`,
    );
  } finally {
    if (servidor) await detener(servidor.proceso);
    rmSync(sandbox, { recursive: true, force: true });
  }
});

test('dos descargas lentas simultáneas y una abandonada no bloquean la publicación ni al servidor', { timeout: 180000 }, async () => {
  const { sandbox, raiz, destino } = prepararSandbox();
  let servidor;
  try {
    const vieja = publicar(destino, randomBytes(TAMANO));
    servidor = await arrancarNode(raiz);
    const { proceso, puerto } = servidor;
    const pid = proceso.pid;

    const primera = await descargar(puerto, '/modulo.js', { pausarTras: PAUSA_TRAS });
    const segunda = await descargar(puerto, '/modulo.js', { pausarTras: PAUSA_TRAS });
    assert.ok(await primera.esperarEstancada(), 'la primera descarga no se estabilizó');
    assert.ok(await segunda.esperarEstancada(), 'la segunda descarga no se estabilizó');

    // El cliente de la primera abandona la respuesta a medias.
    primera.abortar();
    await primera.hecho.catch(() => {});

    const nueva = publicar(destino, randomBytes(TAMANO));

    const fresca = await descargar(puerto, '/modulo.js');
    assert.equal((await fresca.hecho).sha, nueva, 'la petición nueva debe recibir la versión publicada');

    segunda.reanudar();
    const completa = await segunda.hecho;
    assert.equal(completa.bytes, TAMANO);
    assert.equal(completa.sha, vieja, 'la descarga simultánea en curso debe ser la versión anterior');

    assert.equal(proceso.pid, pid, 'el PID debe ser el mismo');
    assert.equal(proceso.exitCode, null, 'el servidor debe seguir vivo');
    // La línea de log indica que la respuesta se entregó al socket, no que el cliente la
    // recibiera: con 32 MiB el servidor registra antes de que el cliente lea. Por eso aquí
    // solo se exige una línea por petición atendida (primera, segunda y la nueva).
    if (!(await esperarHasta(() => (proceso.salida.stdout.match(/GET \/modulo\.js 200/g) ?? []).length >= 3))) {
      assert.fail(`el log debe registrar las tres peticiones. Log del servidor:\n${proceso.salida.stdout}`);
    }
  } finally {
    if (servidor) await detener(servidor.proceso);
    rmSync(sandbox, { recursive: true, force: true });
  }
});

test(
  'CONTRASTE (diagnóstico, no guarda de producto): http.server de Python retiene el destino y el rename falla',
  {
    timeout: 120000,
    skip: !PYTHON
      ? 'defina SERVE_STATIC_CONTRASTE_PYTHON con un intérprete de Python para ejecutar el contraste'
      : process.platform !== 'win32'
        ? 'el bloqueo de reemplazo es un comportamiento de Windows'
        : false,
    todo: 'defecto original reproducido: con http.server de Python el rename falla mientras la respuesta está en curso',
  },
  async () => {
    const { sandbox, raiz, destino } = prepararSandbox();
    let servidor;
    let lenta;
    try {
      const vieja = publicar(destino, randomBytes(TAMANO));
      servidor = await arrancarPython(raiz);
      lenta = await descargar(servidor.puerto, '/modulo.js', { pausarTras: PAUSA_TRAS });
      assert.equal(lenta.estado, 200);
      assert.ok(await lenta.esperarEstancada(), 'la descarga lenta no se estabilizó');
      assert.ok(lenta.bytesRecibidos() < TAMANO, 'la descarga debe seguir en curso');

      // Con el defecto, aquí se lanza EPERM (WinError 5).
      publicar(destino, randomBytes(TAMANO));

      lenta.reanudar();
      assert.equal((await lenta.hecho).sha, vieja);
    } finally {
      if (lenta) lenta.abortar();
      if (servidor) await detener(servidor.proceso);
      rmSync(sandbox, { recursive: true, force: true });
    }
  },
);
