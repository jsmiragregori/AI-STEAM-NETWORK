import assert from 'node:assert/strict';
import test from 'node:test';

import { sanitizeEditorialHtml } from '../../assets/js/utils/sanitize-editorial-html.js';

test('sanitizeEditorialHtml conserva la allowlist editorial y escapa el resto', () => {
  assert.equal(
    sanitizeEditorialHtml('<strong>negrita</strong>, <em>cursiva</em><ul><li>uno</li><li>dos</li></ul>'),
    '<strong>negrita</strong>, <em>cursiva</em><ul><li>uno</li><li>dos</li></ul>',
  );
  assert.equal(sanitizeEditorialHtml('A & B <mark>resaltado</mark>'), 'A &amp; B resaltado');
});

test('sanitizeEditorialHtml conserva solo enlaces con URL segura y atributos seguros', () => {
  assert.equal(
    sanitizeEditorialHtml('<a href="https://example.org" class="cta" target="_blank" onclick="alert(1)">Abrir</a>'),
    '<a href="https://example.org" target="_blank" rel="noopener noreferrer">Abrir</a>',
  );
  assert.equal(sanitizeEditorialHtml('<a href="/guia.pdf">Guía</a>'), '<a href="/guia.pdf">Guía</a>');
  assert.equal(sanitizeEditorialHtml('<a href="javascript:alert(1)">No</a>'), 'No');
  assert.equal(sanitizeEditorialHtml('<a href="&#x6a;avascript:alert(1)">No</a>'), 'No');
});

test('sanitizeEditorialHtml degrada HTML peligroso a texto seguro', () => {
  assert.equal(
    sanitizeEditorialHtml('<script>alert(1)</script><img src=x onerror=alert(2)><strong onclick="x">seguro</strong>'),
    'alert(1)<strong>seguro</strong>',
  );
  assert.equal(sanitizeEditorialHtml('<b>sin cierre'), 'sin cierre');
});
