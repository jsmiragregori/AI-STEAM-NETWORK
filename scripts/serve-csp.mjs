#!/usr/bin/env node
// CS-18 — Servidor de desarrollo con la CSP que aplicará Sistemas, FORZADA.
//
//   npm run serve:csp                  -> http://127.0.0.1:3005/ (política forzada)
//   npm run serve:csp -- --report-only -> la misma política, solo en modo informe
//   npm run serve:csp -- --port 3010
//
// Cada violación la envía el navegador a /__csp-report (report-uri): se imprime
// y se guarda en memoria; GET /__csp-report devuelve las recogidas, para que un
// recorrido automático no dependa de mirar la consola a ojo.
// Solo escucha en 127.0.0.1. No es un servidor de producción.

import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const CSP_POLICY = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join('; ');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REPORT_PATH = '/__csp-report';

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.pdf': 'application/pdf',
};

function arg(name, fallback) {
  const i = process.argv.indexOf(name);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}

const reportOnly = process.argv.includes('--report-only');
const port = Number(arg('--port', '3005'));
const reports = [];

function send(res, status, body, type = 'text/plain; charset=utf-8') {
  res.writeHead(status, { 'Content-Type': type });
  res.end(body);
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname === REPORT_PATH) {
    if (req.method === 'POST') {
      let body = '';
      for await (const chunk of req) body += chunk;
      try {
        const report = JSON.parse(body)['csp-report'] ?? JSON.parse(body);
        reports.push(report);
        console.log(`VIOLACIÓN ${report['violated-directive'] ?? report.effectiveDirective}: ` +
          `${report['blocked-uri'] ?? report.blockedURL} en ${report['document-uri'] ?? report.documentURL}`);
      } catch {
        reports.push({ ilegible: body.slice(0, 500) });
      }
      return send(res, 204, '');
    }
    return send(res, 200, JSON.stringify(reports, null, 2), 'application/json; charset=utf-8');
  }

  const relative = decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname);
  const file = path.resolve(ROOT, `.${relative}`);
  if (file !== ROOT && !file.startsWith(ROOT + path.sep)) return send(res, 403, 'Fuera de la raíz');

  try {
    if (!(await stat(file)).isFile()) return send(res, 404, 'No encontrado');
    const header = reportOnly ? 'Content-Security-Policy-Report-Only' : 'Content-Security-Policy';
    res.writeHead(200, {
      'Content-Type': TYPES[path.extname(file).toLowerCase()] ?? 'application/octet-stream',
      [header]: `${CSP_POLICY}; report-uri ${REPORT_PATH}`,
      'X-Content-Type-Options': 'nosniff',
      'Cache-Control': 'no-store',
    });
    res.end(await readFile(file));
  } catch {
    send(res, 404, 'No encontrado');
  }
});

server.listen(port, '127.0.0.1', () => {
  console.log(`VANILLA con CSP ${reportOnly ? 'en modo INFORME' : 'FORZADA'}: http://127.0.0.1:${port}/`);
  console.log(`Violaciones recogidas: http://127.0.0.1:${port}${REPORT_PATH}`);
});
