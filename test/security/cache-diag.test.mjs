// F5 (D9, T5.3) — ?diag=cache: funciones puras del diagnóstico.
// Prueba en rojo ANTES de implementar `assets/js/diag-cache.js`.

import assert from 'node:assert/strict';
import test from 'node:test';

import {
  esDiagCache,
  construirActivosCriticos,
  formatearCabeceras,
  resumenCargados,
} from '../../assets/js/diag-cache.js';

test('esDiagCache solo acepta diag=cache, entre otros parámetros', () => {
  assert.equal(esDiagCache('?diag=cache'), true);
  assert.equal(esDiagCache('?diag=cache&otra=1'), true);
  assert.equal(esDiagCache('?otra=1&diag=cache'), true);
  assert.equal(esDiagCache('?diag=otra'), false);
  assert.equal(esDiagCache('?diag='), false);
  assert.equal(esDiagCache('?diag=cachex'), false);
  assert.equal(esDiagCache(''), false);
  assert.equal(esDiagCache('?xdiag=cache'), false);
});

test('formatearCabeceras distingue el valor presente del ausente', () => {
  const cabeceras = new Headers({ 'cache-control': 'no-cache', age: '12' });
  assert.deepEqual(
    formatearCabeceras(cabeceras, ['Cache-Control', 'Age', 'ETag', 'Last-Modified', 'X-Cache']),
    [
      { nombre: 'Cache-Control', valor: 'no-cache' },
      { nombre: 'Age', valor: '12' },
      { nombre: 'ETag', valor: null },
      { nombre: 'Last-Modified', valor: null },
      { nombre: 'X-Cache', valor: null },
    ],
  );
});

test('construirActivosCriticos lista entrada, módulos, datos y recursos con su URL', () => {
  const version = {
    schema: 'ai-steam-build/2',
    entrada: { url: 'assets/js/main.aaaaaaaa.js', sha256: 'a'.repeat(64), canonico: 'assets/js/main.js' },
    modulos: {
      'assets/js/views/v.js': { url: 'assets/js/views/v.js?v=bbbbbbbb', sha256: 'b'.repeat(64) },
    },
    datos: {
      'marketplace.js': { url: 'assets/data/marketplace.js?v=cccccccc', sha256: 'c'.repeat(64) },
    },
    recursos: {
      'assets/downloads/x.pdf': { url: 'assets/downloads/x.pdf?v=dddddddd', sha256: 'd'.repeat(64) },
    },
  };
  assert.deepEqual(construirActivosCriticos(version), [
    { grupo: 'entrada', etiqueta: 'assets/js/main.js', url: 'assets/js/main.aaaaaaaa.js' },
    { grupo: 'modulos', etiqueta: 'assets/js/views/v.js', url: 'assets/js/views/v.js?v=bbbbbbbb' },
    { grupo: 'datos', etiqueta: 'marketplace.js', url: 'assets/data/marketplace.js?v=cccccccc' },
    { grupo: 'recursos', etiqueta: 'assets/downloads/x.pdf', url: 'assets/downloads/x.pdf?v=dddddddd' },
  ]);
  assert.deepEqual(construirActivosCriticos(null), []);
  assert.deepEqual(construirActivosCriticos({ schema: 'otro' }), []);
});

test('resumenCargados cruza la URL real del grafo con lo que cargó la página', () => {
  const entradas = [
    { name: 'https://host/pre/assets/data/home.js?v=aaaaaaaa', transferSize: 900, encodedBodySize: 700, duration: 12.5, initiatorType: 'script' },
    { name: 'https://host/pre/index.html', transferSize: 0, encodedBodySize: 0, duration: 2, initiatorType: 'navigation' },
  ];
  const resumen = resumenCargados(entradas);
  assert.deepEqual(resumen.get('https://host/pre/assets/data/home.js?v=aaaaaaaa'), {
    transferSize: 900, encodedBodySize: 700, duration: 12.5, initiatorType: 'script',
  });
  assert.equal(resumen.size, 2);
  assert.deepEqual(resumenCargados(undefined).size, 0);
});
