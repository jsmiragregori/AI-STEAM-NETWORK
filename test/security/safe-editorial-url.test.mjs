import assert from 'node:assert/strict';
import test from 'node:test';

import { getSafeEditorialUrl } from '../../assets/js/utils/safe-editorial-url.js';

test('getSafeEditorialUrl permite exclusivamente esquemas y rutas editoriales autorizados', () => {
  for (const value of [
    'https://example.org/recurso',
    'http://example.org/recurso?x=1#seccion',
    'mailto:equipo@example.org',
    '/assets/downloads/guia.pdf',
    './documento.html',
    '../documento.html',
    'documento.html',
    '#participar',
    '?pagina=2',
  ]) {
    assert.equal(getSafeEditorialUrl(value), value);
  }
});

test('getSafeEditorialUrl falla cerrado ante esquemas activos, ambiguos o malformados', () => {
  for (const value of [
    '', '   ', 'javascript:alert(1)', 'JaVaScRiPt:alert(1)', 'data:text/html,<script>',
    'vbscript:msgbox(1)', '//example.org/recurso', 'https:\\example.org', 'https://exa\n mple.org',
  ]) {
    assert.equal(getSafeEditorialUrl(value), null, value);
  }
});
