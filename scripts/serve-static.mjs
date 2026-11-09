#!/usr/bin/env node
// Servidor estático para los perfiles local, LAN y DEMO de VANILLA.
//
//   npm run serve:static -- --port 3000                  -> http://127.0.0.1:3000/
//   npm run serve:static -- --port 3000 --bind 0.0.0.0   -> visible en la red local
//   npm run serve:static -- --port 3100 --root <carpeta> -> otra raíz (pruebas)
//
// Sustituye a `python -m http.server` en los lanzadores. La diferencia que importa
// es la misma que en serve-csp.mjs: cada fichero se lee COMPLETO a memoria y su
// descriptor se cierra antes de enviar la respuesta. Así una descarga lenta no
// retiene el archivo, y un escritor puede reemplazarlo con rename() en Windows
// mientras la respuesta en curso sigue íntegra con la versión anterior.
//
// No añade Content-Security-Policy (eso es serve-csp.mjs). No lista directorios.
// No es un servidor de producción.

import { realpathSync, statSync } from 'node:fs';
import { readFile, realpath, stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';

const DEFAULT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DEFAULT_BIND = '127.0.0.1';
const LOOPBACK_HOSTS = new Set(['127.0.0.1', 'localhost', '::1']);

export const MIME_TYPES = Object.freeze({
  '.html': 'text/html; charset=utf-8',
  '.htm': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.csv': 'text/csv; charset=utf-8',
  '.yml': 'text/yaml; charset=utf-8',
  '.yaml': 'text/yaml; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.pdf': 'application/pdf',
});

const TEXTOS = {
  400: 'Petición no válida',
  403: 'Prohibido',
  404: 'No encontrado',
  405: 'Método no permitido',
  500: 'Error interno',
};

// Errores transitorios de Windows mientras otro proceso reemplaza el archivo.
// Reintento acotado solo en lecturas; la escritura del publicador no se reintenta aquí.
const REINTENTABLES = new Set(['EPERM', 'EACCES', 'EBUSY']);
const INTENTOS = 5;
const PAUSA_MS = 40;

const NO_ENCONTRADO = new Set(['ENOENT', 'ENOTDIR', 'EINVAL', 'ENAMETOOLONG', 'EILSEQ']);
const SIN_PERMISO = new Set(['EPERM', 'EACCES']);

class UsoError extends Error {}

/** Un segmento que empieza por punto (.env, .git, ..) no se sirve nunca. */
function oculto(ruta) {
  return ruta.split(/[\\/]/).some(parte => parte.startsWith('.'));
}

function dentro(base, ruta) {
  const prefijo = base.endsWith(path.sep) ? base : base + path.sep;
  return ruta === base || ruta.startsWith(prefijo);
}

function seguroParaLog(texto) {
  return String(texto)
    .replace(/[\u0000-\u001f\u007f]/g, c => `\\x${c.charCodeAt(0).toString(16).padStart(2, '0')}`)
    .slice(0, 300);
}

async function conReintento(operacion) {
  for (let intento = 1; ; intento += 1) {
    try {
      return await operacion();
    } catch (error) {
      if (!REINTENTABLES.has(error.code) || intento >= INTENTOS) throw error;
      await new Promise(resolve => setTimeout(resolve, PAUSA_MS));
    }
  }
}

function responder(req, res, estado, cabeceras = {}) {
  const cuerpo = Buffer.from(`${TEXTOS[estado]}\n`, 'utf8');
  res.writeHead(estado, {
    'Content-Type': 'text/plain; charset=utf-8',
    'Content-Length': cuerpo.length,
    'X-Content-Type-Options': 'nosniff',
    'Cache-Control': 'no-store',
    ...cabeceras,
  });
  res.end(req.method === 'HEAD' ? undefined : cuerpo);
}

function responderError(req, res, error) {
  if (NO_ENCONTRADO.has(error.code)) return responder(req, res, 404);
  if (SIN_PERMISO.has(error.code)) return responder(req, res, 403);
  return responder(req, res, 500);
}

async function servir(req, res, base) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    return responder(req, res, 405, { Allow: 'GET, HEAD' });
  }

  let url;
  try {
    // Barras iniciales repetidas o mezcladas (`//`, `/\`) no deben leerse como host.
    url = new URL(req.url.replace(/^[\\/]{2,}/, '/'), 'http://localhost');
  } catch {
    return responder(req, res, 400);
  }

  let ruta;
  try {
    ruta = decodeURIComponent(url.pathname);
  } catch {
    return responder(req, res, 400);
  }
  if (ruta.includes('\0')) return responder(req, res, 400);

  const pedido = path.resolve(base, `.${ruta}`);
  if (!dentro(base, pedido)) return responder(req, res, 403);
  if (oculto(ruta)) return responder(req, res, 404);

  let destino = pedido;
  let info;
  try {
    info = await conReintento(() => stat(destino));
  } catch (error) {
    return responderError(req, res, error);
  }

  if (info.isDirectory()) {
    if (!url.pathname.endsWith('/')) {
      const sinBarras = url.pathname.replace(/^\/+/, '');
      res.writeHead(301, {
        Location: `/${sinBarras}/${url.search}`,
        'Content-Length': 0,
        'X-Content-Type-Options': 'nosniff',
        'Cache-Control': 'no-store',
      });
      return res.end();
    }
    destino = path.join(pedido, 'index.html');
    try {
      info = await conReintento(() => stat(destino));
    } catch (error) {
      return responderError(req, res, error);
    }
  }
  if (!info.isFile()) return responder(req, res, 404);

  // Un enlace simbólico o un junction no puede sacar la lectura de la raíz.
  let real;
  try {
    real = await conReintento(() => realpath(destino));
  } catch (error) {
    return responderError(req, res, error);
  }
  if (!dentro(base, real)) return responder(req, res, 403);
  if (oculto(path.relative(base, real))) return responder(req, res, 404);

  // Lectura completa: el descriptor se cierra aquí, antes de enviar nada.
  let cuerpo;
  try {
    cuerpo = await conReintento(() => readFile(real));
  } catch (error) {
    return responderError(req, res, error);
  }

  res.writeHead(200, {
    'Content-Type': MIME_TYPES[path.extname(destino).toLowerCase()] ?? 'application/octet-stream',
    'Content-Length': cuerpo.length,
    'X-Content-Type-Options': 'nosniff',
    'Cache-Control': 'no-store',
  });
  res.end(req.method === 'HEAD' ? undefined : cuerpo);
}

// La línea se emite al terminar la respuesta en el servidor (entregada al socket),
// no cuando el cliente la lee. Con cuerpos grandes, un cliente lento puede seguir
// recibiendo bytes después de esa línea.
function lineaDeLog(req, res, incompleta) {
  const nota = incompleta ? ' (cliente cerró antes de terminar)' : '';
  return `${new Date().toISOString()} ${seguroParaLog(req.method)} ${seguroParaLog(req.url)} ${res.statusCode}${nota}`;
}

/**
 * Crea el servidor sin escuchar. La raíz debe existir.
 * `log` recibe una línea por petición (método, ruta, estado).
 */
export function createStaticServer({ root = DEFAULT_ROOT, log = () => {} } = {}) {
  const base = realpathSync.native(path.resolve(root));

  return createServer((req, res) => {
    let registrada = false;
    const registrar = incompleta => {
      if (registrada) return;
      registrada = true;
      log(lineaDeLog(req, res, incompleta));
    };
    res.on('finish', () => registrar(false));
    res.on('close', () => registrar(!res.writableFinished));

    servir(req, res, base).catch(error => {
      log(`${new Date().toISOString()} ERROR ${seguroParaLog(req.method)} ${seguroParaLog(req.url)} ${seguroParaLog(error.code ?? error.message)}`);
      if (res.headersSent) res.destroy();
      else responder(req, res, 500);
    });
  });
}

const AYUDA = `Uso: node scripts/serve-static.mjs --port <n> [--bind <host>] [--root <carpeta>]

  --port <n>        puerto de escucha (obligatorio, 1-65535)
  --bind <host>     interfaz de escucha (por defecto 127.0.0.1)
  --root <carpeta>  carpeta a servir (por defecto, la raíz de VANILLA)`;

function isDirectory(ruta) {
  try {
    return statSync(ruta).isDirectory();
  } catch {
    return false;
  }
}

function leerOpciones(argv) {
  let valores;
  try {
    ({ values: valores } = parseArgs({
      args: argv,
      strict: true,
      allowPositionals: false,
      options: {
        port: { type: 'string' },
        bind: { type: 'string' },
        root: { type: 'string' },
        help: { type: 'boolean', short: 'h' },
      },
    }));
  } catch (error) {
    throw new UsoError(error.message);
  }
  if (valores.help) return { ayuda: true };

  if (valores.port === undefined) throw new UsoError('falta --port <n>');
  const puerto = Number(valores.port);
  if (!/^\d{1,5}$/.test(valores.port) || puerto < 1 || puerto > 65535) {
    throw new UsoError(`--port no válido: "${valores.port}" (use un número de 1 a 65535)`);
  }
  if (valores.bind !== undefined && valores.bind.trim() === '') throw new UsoError('--bind está vacío');
  if (valores.root !== undefined && valores.root.trim() === '') throw new UsoError('--root está vacío');

  const root = path.resolve(valores.root ?? DEFAULT_ROOT);
  if (!isDirectory(root)) throw new UsoError(`--root no es una carpeta existente: ${root}`);

  return { ayuda: false, port: puerto, bind: valores.bind ?? DEFAULT_BIND, root };
}

function instalarCierre(servidor) {
  const cerrar = senal => {
    console.log(`${senal}: cerrando servidor`);
    servidor.close(() => process.exit(0));
    servidor.closeIdleConnections();
    setTimeout(() => servidor.closeAllConnections(), 1000).unref();
    setTimeout(() => process.exit(0), 3000).unref();
  };
  process.once('SIGINT', () => cerrar('SIGINT'));
  process.once('SIGTERM', () => cerrar('SIGTERM'));
}

export function ejecutarCli(argv = process.argv.slice(2)) {
  let opciones;
  try {
    opciones = leerOpciones(argv);
  } catch (error) {
    if (!(error instanceof UsoError)) throw error;
    console.error(`serve-static: ${error.message}`);
    console.error(AYUDA);
    process.exitCode = 2;
    return;
  }
  if (opciones.ayuda) {
    console.log(AYUDA);
    return;
  }

  const servidor = createStaticServer({ root: opciones.root, log: linea => console.log(linea) });
  servidor.on('error', error => {
    console.error(`serve-static: no se pudo escuchar en ${opciones.bind}:${opciones.port}: ${error.code ?? error.message}`);
    process.exitCode = 1;
  });
  servidor.listen(opciones.port, opciones.bind, () => {
    const anfitrion = opciones.bind.includes(':') ? `[${opciones.bind}]` : opciones.bind;
    console.log(`Servidor estático de VANILLA escuchando en http://${anfitrion}:${opciones.port}/ (raíz: ${opciones.root})`);
    if (!LOOPBACK_HOSTS.has(opciones.bind)) {
      console.log(`AVISO: ${opciones.bind} hace visible la carpeta a otras máquinas de la red.`);
    }
    instalarCierre(servidor);
  });
}

function esEjecutableDirecto() {
  if (!process.argv[1]) return false;
  const yo = fileURLToPath(import.meta.url);
  const entrada = path.resolve(process.argv[1]);
  let entradaReal = entrada;
  try {
    entradaReal = realpathSync.native(entrada);
  } catch {
    // Sin realpath, se compara la ruta tal como llegó.
  }
  const iguales = (a, b) => (process.platform === 'win32' ? a.toLowerCase() === b.toLowerCase() : a === b);
  return iguales(yo, entrada) || iguales(yo, entradaReal);
}

if (esEjecutableDirecto()) ejecutarCli();
