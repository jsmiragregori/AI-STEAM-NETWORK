#!/usr/bin/env node
// CS-18 — Recorre las secciones enlazables en los tres idiomas contra
// `serve-csp.mjs` con un navegador sin interfaz y pide al servidor las
// violaciones que el navegador le haya comunicado.
//
//   npm run serve:csp            (en otra terminal)
//   npm run csp:walk -- --browser "C:\...\msedge.exe" [--port 3005]
//
// Termina con código 1 si hay alguna violación o si una página no se pinta.

import { execFile } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';

import { TABLA_SLUGS, VISTAS_OCULTAS } from '../assets/js/slug-table.js';

const run = promisify(execFile);
const LANGS = ['es', 'en', 'va'];

function arg(name, fallback) {
  const i = process.argv.indexOf(name);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}

const browser = arg('--browser', process.env.CSP_BROWSER);
const base = `http://127.0.0.1:${arg('--port', '3005')}`;
if (!browser) {
  console.error('Falta --browser <ruta a Chrome o Edge> (o CSP_BROWSER).');
  process.exit(2);
}

const hidden = new Set(VISTAS_OCULTAS);
const views = Object.keys(TABLA_SLUGS).filter((view) => !hidden.has(view));
let failures = 0;
let visited = 0;
// Perfil temporal propio: con el perfil habitual, un Edge o Chrome ya abierto
// recoge la petición y el proceso sin interfaz no termina nunca.
const profile = mkdtempSync(path.join(tmpdir(), 'csp-walk-'));
const only = arg('--only', null);

for (const lang of LANGS) {
  for (const view of views) {
    const url = `${base}/#${lang}/${TABLA_SLUGS[view][lang]}`;
    if (only && !url.endsWith(only)) continue;
    visited += 1;
    let stdout = '';
    try {
      ({ stdout } = await run(browser, [
        '--headless=new', '--disable-gpu', '--no-first-run', '--disable-extensions',
        `--user-data-dir=${profile}`, '--virtual-time-budget=6000', '--dump-dom', url,
      ], { maxBuffer: 64 * 1024 * 1024, timeout: 30000, killSignal: 'SIGKILL' }));
    } catch (error) {
      console.log(`ERROR ${url}: ${error.killed ? 'sin respuesta en 30 s' : error.message}`);
      failures += 1;
      continue;
    }
    // Sin JavaScript en marcha, <main> queda vacío: así se detecta una página
    // que la política ha dejado en blanco aunque no haya informado de nada.
    const main = stdout.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1] ?? '';
    const painted = main.replace(/<[^>]+>/g, '').trim().length > 50;
    if (!painted) failures += 1;
    console.log(`${painted ? 'ok  ' : 'VACÍA'} ${url}`);
  }
}

rmSync(profile, { recursive: true, force: true });
const reports = await (await fetch(`${base}/__csp-report`)).json();
console.log(`\n${visited} páginas · ${failures} sin pintar o sin respuesta · ${reports.length} violaciones`);
for (const report of reports) console.log(JSON.stringify(report));
process.exit(failures || reports.length ? 1 : 0);
