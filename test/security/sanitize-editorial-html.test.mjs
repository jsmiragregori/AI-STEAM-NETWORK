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

// Los campos editoriales llegan como HTML que produjo `marked` en el build, y
// `marked` ya escapa el texto: «IA & STEAM» llega como «IA &amp; STEAM». Volver
// a escaparlo sin descodificar pintaba «IA &amp; STEAM» en la portada.
test('sanitizeEditorialHtml no escapa dos veces el texto que ya llega escapado', () => {
  assert.equal(sanitizeEditorialHtml('IA &amp; STEAM'), 'IA &amp; STEAM');
  assert.equal(sanitizeEditorialHtml('Drets d&#39;Autor'), 'Drets d&#39;Autor');
  assert.equal(sanitizeEditorialHtml('<strong>R&amp;D&amp;I</strong>'), '<strong>R&amp;D&amp;I</strong>');
});

test('descodificar antes de escapar no convierte texto en marcado', () => {
  // Una etiqueta que llega escapada sigue siendo texto.
  assert.equal(sanitizeEditorialHtml('&lt;script&gt;alert(1)&lt;/script&gt;'), '&lt;script&gt;alert(1)&lt;/script&gt;');
  assert.equal(sanitizeEditorialHtml('&lt;img src=x onerror=alert(1)&gt;'), '&lt;img src=x onerror=alert(1)&gt;');
  // Una doblemente escapada tampoco sale como marcado: se descodifica una sola vez.
  assert.doesNotMatch(sanitizeEditorialHtml('&amp;lt;script&amp;gt;'), /<script/);
});
