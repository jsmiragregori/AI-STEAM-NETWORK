// F5.2 del plan de códigos: el contraste del código sobre la ceja violeta se MIDE, no se supone.
//
// La ceja es un degradado de marca con texto claro, y un blanco rebajado en opacidad cae por debajo
// de AA con facilidad. El proyecto ya se encontró un selector de idioma a 3,24:1 por no medirlo.
//
// La prueba lee el CSS real —el degradado de `.rd-card-mp-ceja` y el color de
// `.rd-card-mp-code`— en lugar de copiar cifras, compone el color con su transparencia sobre cada
// punto del degradado y exige el mínimo de WCAG 2.1 AA para texto pequeño (4,5:1) en el PEOR punto.

import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const CSS = await readFile(new URL('../../assets/css/redesign.css', import.meta.url), 'utf8');
const AA_TEXTO_PEQUENO = 4.5;
const AA_TEXTO_GRANDE = 3;

// ── Colorimetría (WCAG 2.1) ───────────────────────────────────────────────────

function parseColor(texto) {
  const valor = texto.trim().toLowerCase();
  let m = /^#([0-9a-f]{3})$/.exec(valor);
  if (m) return { r: parseInt(m[1][0] + m[1][0], 16), g: parseInt(m[1][1] + m[1][1], 16), b: parseInt(m[1][2] + m[1][2], 16), a: 1 };
  m = /^#([0-9a-f]{6})$/.exec(valor);
  if (m) return { r: parseInt(m[1].slice(0, 2), 16), g: parseInt(m[1].slice(2, 4), 16), b: parseInt(m[1].slice(4, 6), 16), a: 1 };
  m = /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)$/.exec(valor);
  if (m) return { r: Number(m[1]), g: Number(m[2]), b: Number(m[3]), a: m[4] === undefined ? 1 : Number(m[4]) };
  throw new Error(`color no reconocido: ${texto}`);
}

const canal = (c) => {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
};
const luminancia = ({ r, g, b }) => 0.2126 * canal(r) + 0.7152 * canal(g) + 0.0722 * canal(b);
const razon = (a, b) => {
  const [claro, oscuro] = [luminancia(a), luminancia(b)].sort((x, y) => y - x);
  return (claro + 0.05) / (oscuro + 0.05);
};
/** El color de texto con su transparencia, compuesto sobre un fondo opaco. */
const componer = (texto, fondo) => ({
  r: texto.r * texto.a + fondo.r * (1 - texto.a),
  g: texto.g * texto.a + fondo.g * (1 - texto.a),
  b: texto.b * texto.a + fondo.b * (1 - texto.a),
  a: 1,
});
const mezclar = (a, b, t) => ({ r: a.r + (b.r - a.r) * t, g: a.g + (b.g - a.g) * t, b: a.b + (b.b - a.b) * t, a: 1 });

// ── Lectura del CSS ───────────────────────────────────────────────────────────

function regla(selector) {
  const escapado = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const m = new RegExp(`(?:^|\\n)${escapado}\\s*\\{([^}]*)\\}`).exec(CSS);
  return m ? m[1] : null;
}
const propiedad = (cuerpo, nombre) => new RegExp(`(?:^|[;\\s])${nombre}\\s*:\\s*([^;]+);`).exec(cuerpo)?.[1].trim();

function degradadoDeLaCeja() {
  const cuerpo = regla('.rd-card-mp-ceja');
  assert.ok(cuerpo, 'no se encontró la regla .rd-card-mp-ceja');
  const fondo = propiedad(cuerpo, 'background');
  const paradas = [...fondo.matchAll(/(#[0-9a-fA-F]{3,6}|rgba?\([^)]*\))\s*(?:\d+%)?/g)].map((m) => parseColor(m[1]));
  assert.ok(paradas.length >= 2, `degradado sin al menos dos paradas: ${fondo}`);
  return paradas;
}

// ── Comprobaciones ────────────────────────────────────────────────────────────

test('la medición es correcta: negro sobre blanco 21:1 y #767676 sobre blanco 4,54:1', () => {
  assert.ok(Math.abs(razon(parseColor('#000'), parseColor('#fff')) - 21) < 1e-9);
  assert.ok(Math.abs(razon(parseColor('#767676'), parseColor('#ffffff')) - 4.54) < 0.01);
  assert.ok(Math.abs(razon(componer(parseColor('rgba(255,255,255,.5)'), parseColor('#000')), parseColor('#000')) - 5.3) < 0.1);
});

test('el degradado de la ceja se lee del CSS y es el de marca', () => {
  const [arriba, abajo] = degradadoDeLaCeja();
  assert.deepEqual([arriba.r, arriba.g, arriba.b], [0x4e, 0x1b, 0xc8]);
  assert.deepEqual([abajo.r, abajo.g, abajo.b], [0x55, 0x20, 0xf6]);
});

test('F5.2 el código tiene regla propia en la ceja y su color es legible', () => {
  const cuerpo = regla('.rd-card-mp-ceja .rd-card-mp-code');
  assert.ok(cuerpo, 'falta la regla .rd-card-mp-ceja .rd-card-mp-code');
  assert.ok(propiedad(cuerpo, 'color'), 'la regla del código no fija su color');
  assert.ok(propiedad(cuerpo, 'font-size'), 'la regla del código no fija su tamaño');
});

test('F5.2 el contraste del código es AA en TODO el degradado, medido en el peor punto', (t) => {
  const cuerpo = regla('.rd-card-mp-ceja .rd-card-mp-code');
  assert.ok(cuerpo, 'falta la regla del código');
  const color = parseColor(propiedad(cuerpo, 'color'));
  const paradas = degradadoDeLaCeja();

  // El texto se coloca en el tramo alto de la ceja, pero se mide sobre todo el degradado.
  const muestras = [];
  for (let i = 0; i < paradas.length - 1; i += 1) {
    for (let paso = 0; paso <= 20; paso += 1) muestras.push(mezclar(paradas[i], paradas[i + 1], paso / 20));
  }
  const razones = muestras.map((fondo) => razon(componer(color, fondo), fondo));
  const peor = Math.min(...razones);
  const tamano = propiedad(cuerpo, 'font-size');
  const rem = tamano.endsWith('rem') ? Number(tamano.replace('rem', '')) : tamano.endsWith('px') ? Number(tamano.replace('px', '')) / 16 : NaN;
  assert.ok(Number.isFinite(rem), `tamaño no reconocido: ${tamano}`);
  const negrita = Number(propiedad(cuerpo, 'font-weight') || 400) >= 700;
  // Texto grande de WCAG: 24 px, o 18,66 px en negrita. Un código de línea pequeña NO lo es.
  const grande = rem * 16 >= 24 || (negrita && rem * 16 >= 18.66);
  const minimo = grande ? AA_TEXTO_GRANDE : AA_TEXTO_PEQUENO;

  t.diagnostic(`contraste medido: peor ${peor.toFixed(2)}:1 · mejor ${Math.max(...razones).toFixed(2)}:1 · mínimo exigido ${minimo}:1 (${tamano}, ${grande ? 'texto grande' : 'texto pequeño'})`);
  assert.ok(peor >= minimo, `contraste ${peor.toFixed(2)}:1 por debajo de ${minimo}:1`);
});

test('F5.2 el título de la ceja, la referencia visual, sigue siendo AA (control de la medición)', () => {
  const cuerpo = regla('.rd-card-mp-ceja .rd-card-mp-title');
  const color = parseColor(propiedad(cuerpo, 'color'));
  const peor = Math.min(...degradadoDeLaCeja().map((fondo) => razon(componer(color, fondo), fondo)));
  assert.ok(peor >= AA_TEXTO_PEQUENO, `el título mide ${peor.toFixed(2)}:1`);
});
