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
//
// Cliente que aborta (recargas del navegador, mismo incidente): una descarga se corta tras
// el primer fragmento. El servidor no debe retener el archivo después, ni lanzar excepciones
// ni caer. Cubierto por las pruebas "cliente que aborta", "ciclos de recargas" y "tras N
// recargas cortadas" del final de este fichero.
// Límite medido (Windows 11, loopback y LAN): serve-static entrega 32-256 MiB al socket en
// 20-170 ms aunque el cliente deje de leer tras el primer fragmento, así que la respuesta no
// queda en curso del lado del servidor. Estas pruebas comprueban el resultado observable
// (rename a la primera, versión nueva, servidor vivo). Contraste ad hoc, fuera del repo, con
// el mismo escenario de abortar y renombrar: serve 14.2.6 da EPERM y serve-static.mjs no.

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

/**
 * Cliente que aborta, como un navegador que recarga: lee solo el primer fragmento de la
 * respuesta y destruye el socket. Resuelve cuando el socket del cliente ya está cerrado.
 */
function abortarTrasPrimerTrozo(puertoDestino, ruta) {
  return new Promise((resolve, reject) => {
    let abortada = false;
    const req = http.get({ host: '127.0.0.1', port: puertoDestino, path: ruta, agent: false }, res => {
      res.on('error', () => {}); // la respuesta que corta el propio cliente no es un fallo de la prueba
      res.once('data', trozo => {
        abortada = true;
        req.once('close', () => resolve({ estado: res.statusCode, bytes: trozo.length }));
        req.destroy();
      });
      res.once('end', () => {
        if (!abortada) reject(new Error(`la respuesta de ${ruta} terminó sin abortarse`));
      });
    });
    req.on('error', error => {
      if (!abortada) reject(error);
    });
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

test('un cliente que aborta a mitad de 32 MiB no retiene el archivo: el rename tiene éxito a la primera', { timeout: 180000 }, async () => {
  const { sandbox, raiz, destino } = prepararSandbox();
  let servidor;
  try {
    publicar(destino, randomBytes(TAMANO));
    servidor = await arrancarNode(raiz);
    const { proceso, puerto } = servidor;
    const pid = proceso.pid;

    const cortada = await abortarTrasPrimerTrozo(puerto, '/modulo.js');
    assert.equal(cortada.estado, 200);
    assert.ok(cortada.bytes > 0 && cortada.bytes < TAMANO, `bytes leídos antes de abortar: ${cortada.bytes}`);
    // No se exige la nota "cliente cerró antes de terminar" en el log: en Windows el servidor
    // entrega el cuerpo al socket en milisegundos (finish antes del corte) y la línea sale con 200.
    await esperar(200);

    // Una sola pasada, sin reintentos: si el servidor retuviera el archivo, aquí lanzaría EPERM.
    const nueva = publicar(destino, randomBytes(TAMANO));

    const fresca = await descargar(puerto, '/modulo.js');
    const datos = await fresca.hecho;
    assert.equal(fresca.estado, 200);
    assert.equal(datos.bytes, TAMANO, 'la petición nueva debe ser completa');
    assert.equal(datos.sha, nueva, 'la petición nueva debe recibir la versión publicada');
    assert.equal(proceso.pid, pid, 'el PID debe ser el mismo');
    assert.equal(proceso.exitCode, null, 'el servidor debe seguir vivo');
  } finally {
    if (servidor) await detener(servidor.proceso);
    rmSync(sandbox, { recursive: true, force: true });
  }
});

test('20 ciclos de recargas simultáneas y publicación de tres archivos: ningún EPERM y el mismo servidor', { timeout: 300000 }, async () => {
  const sandbox = mkdtempSync(path.join(os.tmpdir(), 'serve-static-publica-'));
  const raiz = path.join(sandbox, 'www');
  mkdirSync(raiz);
  const archivos = ['modulo-a.js', 'modulo-b.js', 'modulo-c.js'];
  let servidor;
  try {
    let vigente = new Map(archivos.map(nombre => [nombre, publicar(path.join(raiz, nombre), randomBytes(TAMANO))]));
    servidor = await arrancarNode(raiz);
    const { proceso, puerto } = servidor;
    const pid = proceso.pid;

    for (let ciclo = 1; ciclo <= 20; ciclo += 1) {
      // Tres recargas a la vez, cada una sobre un archivo distinto y cortada tras el primer fragmento.
      const cortadas = await Promise.all(archivos.map(nombre => abortarTrasPrimerTrozo(puerto, `/${nombre}`)));
      for (const cortada of cortadas) {
        assert.equal(cortada.estado, 200, `ciclo ${ciclo}: estado de una recarga cortada`);
        assert.ok(cortada.bytes > 0 && cortada.bytes < TAMANO, `ciclo ${ciclo}: bytes antes de abortar: ${cortada.bytes}`);
      }

      // Una lectura completa en vuelo mientras se publica: sale íntegra, con la versión anterior o la nueva.
      const archivoEnVuelo = archivos[ciclo % archivos.length];
      const enVuelo = await descargar(puerto, `/${archivoEnVuelo}`);
      await esperar((ciclo % 3) * 10);

      // Tres publicaciones seguidas, una pasada cada una: un EPERM lanza y la prueba falla.
      const nueva = new Map();
      for (const nombre of archivos) {
        nueva.set(nombre, publicar(path.join(raiz, nombre), randomBytes(TAMANO)));
      }

      const datosEnVuelo = await enVuelo.hecho;
      assert.equal(enVuelo.estado, 200, `ciclo ${ciclo}: estado de la lectura en vuelo`);
      assert.equal(datosEnVuelo.bytes, TAMANO, `ciclo ${ciclo}: la lectura en vuelo debe ser completa`);
      assert.ok(
        [vigente.get(archivoEnVuelo), nueva.get(archivoEnVuelo)].includes(datosEnVuelo.sha),
        `ciclo ${ciclo}: la lectura en vuelo debe ser una versión íntegra`,
      );

      for (const nombre of archivos) {
        const fresca = await descargar(puerto, `/${nombre}`);
        const datos = await fresca.hecho;
        assert.equal(fresca.estado, 200, `ciclo ${ciclo}: estado de ${nombre}`);
        assert.equal(datos.bytes, TAMANO, `ciclo ${ciclo}: ${nombre} debe ser completo`);
        assert.equal(datos.sha, nueva.get(nombre), `ciclo ${ciclo}: ${nombre} debe servir la versión publicada`);
      }

      assert.equal(proceso.pid, pid, `ciclo ${ciclo}: el PID debe ser el mismo`);
      assert.equal(proceso.exitCode, null, `ciclo ${ciclo}: el servidor debe seguir vivo`);
      vigente = nueva;
    }
  } finally {
    if (servidor) await detener(servidor.proceso);
    rmSync(sandbox, { recursive: true, force: true });
  }
});

test('tras 60 recargas cortadas el servidor sigue respondiendo, sin salida de error ni ERROR en el log', { timeout: 180000 }, async () => {
  const { sandbox, raiz, destino } = prepararSandbox();
  let servidor;
  try {
    writeFileSync(destino, randomBytes(TAMANO));
    const pagina = '<p>sintetico</p>\n';
    writeFileSync(path.join(raiz, 'pagina.html'), pagina);
    servidor = await arrancarNode(raiz);
    const { proceso, puerto } = servidor;
    const pid = proceso.pid;

    for (let lote = 0; lote < 6; lote += 1) {
      const cortadas = await Promise.all(Array.from({ length: 10 }, () => abortarTrasPrimerTrozo(puerto, '/modulo.js')));
      assert.ok(cortadas.every(cortada => cortada.estado === 200), `lote ${lote}: estado de las recargas cortadas`);
    }

    const respuesta = await descargar(puerto, '/pagina.html');
    const datos = await respuesta.hecho;
    assert.equal(respuesta.estado, 200, 'el servidor debe seguir respondiendo');
    assert.equal(datos.sha, sha256(Buffer.from(pagina)), 'la página pequeña debe llegar íntegra');

    assert.equal(proceso.pid, pid, 'el PID debe ser el mismo');
    assert.equal(proceso.exitCode, null, 'el servidor no debe haber terminado');
    assert.equal(proceso.signalCode, null, 'el servidor no debe haber recibido señal');
    assert.equal(proceso.salida.stderr, '', 'no debe haber excepciones no capturadas ni avisos en stderr');
    assert.doesNotMatch(proceso.salida.stdout, / ERROR /, 'el log no debe registrar errores internos');
    // Cada petición atendida deja una línea (finish o close, una sola vez por respuesta).
    assert.ok(
      await esperarHasta(() => (proceso.salida.stdout.match(/GET \/modulo\.js 200/g) ?? []).length >= 60),
      `el log debe registrar las 60 peticiones atendidas: ${proceso.salida.stdout}`,
    );
  } finally {
    if (servidor) await detener(servidor.proceso);
    rmSync(sandbox, { recursive: true, force: true });
  }
});
