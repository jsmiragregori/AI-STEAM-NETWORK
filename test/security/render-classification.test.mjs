import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

import { generateInventory } from '../../scripts/inventory-render-surface.mjs';
import {
  CATEGORIES,
  categorize,
  generateClassification,
  htmlContextOf,
} from '../../scripts/classify-render-surface.mjs';

// Línea base de VAN-1.2. Si alguien migra una interpolación, este desglose
// cambia: debe cambiarse aquí a la vez, con su justificación en el checkpoint.
const EXPECTED_BY_CATEGORY = {
  TEXTO_PLANO: 4,
  ATRIBUTO: 0,
  URL: 0,
  HTML_INTENCIONAL: 0,
  ESTRUCTURAL: 3,
  HELPER_QUE_ESCAPA: 2,
  COMPOSICION_CADENA: 2,
};

const EXPECTED_BY_FILE = {
  'assets/js/views/governance.js': { ESTRUCTURAL: 1 },
  'assets/js/views/marketplace.js': { ESTRUCTURAL: 1, HELPER_QUE_ESCAPA: 2, COMPOSICION_CADENA: 2 },
  'assets/js/views/news.js': { TEXTO_PLANO: 4 },
  'assets/js/views/training.js': { ESTRUCTURAL: 1 },
};

// Las siete interpolaciones que NO son texto plano se fijan una por una: son
// las decisiones revisadas a mano en VAN-1.2 y las únicas que la migración de
// VAN-1.3 en adelante no debe escapar sin volver a razonarlas.
// VAN-2.2 solo desplaza estas líneas (governance +5, marketplace +9,
// training +6) al insertar la validación de URL por encima de ellas. Siguen
// siendo las mismas siete expresiones, con la misma categoría.
const EXPECTED_EXCEPTIONS = [
  { file: 'assets/js/views/governance.js', line: 699, category: 'ESTRUCTURAL' },
  { file: 'assets/js/views/marketplace.js', line: 1752, category: 'HELPER_QUE_ESCAPA' },
  { file: 'assets/js/views/marketplace.js', line: 1937, category: 'ESTRUCTURAL' },
  { file: 'assets/js/views/marketplace.js', line: 1939, category: 'COMPOSICION_CADENA' },
  { file: 'assets/js/views/marketplace.js', line: 1978, category: 'HELPER_QUE_ESCAPA' },
  { file: 'assets/js/views/marketplace.js', line: 2138, category: 'COMPOSICION_CADENA' },
  { file: 'assets/js/views/training.js', line: 434, category: 'ESTRUCTURAL' },
];

test('la clasificación VAN-1.2 reproduce su línea base', async () => {
  const report = await generateClassification();

  assert.equal(report.total, 11);
  assert.deepEqual(report.byCategory, EXPECTED_BY_CATEGORY);

  const observedByFile = Object.fromEntries(
    Object.entries(report.byFile).map(([file, counts]) => [
      file,
      Object.fromEntries(Object.entries(counts).filter(([, count]) => count > 0)),
    ]),
  );
  assert.deepEqual(observedByFile, EXPECTED_BY_FILE);

  const observedExceptions = report.entries
    .filter((entry) => entry.category !== 'TEXTO_PLANO')
    .map(({ file, line, category }) => ({ file, line, category }))
    .sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line);
  assert.deepEqual(observedExceptions, EXPECTED_EXCEPTIONS);

  for (const entry of report.entries) {
    assert.ok(CATEGORIES.includes(entry.category), `categoría desconocida: ${entry.category}`);
    assert.ok(entry.reason && entry.reason.length > 0, 'toda entrada debe llevar motivo');
  }

  assert.deepEqual(await generateClassification(), report, 'la clasificación debe ser determinista');
});

test('VAN-3B.2.2 demuestra el destino seguro de las siete excepciones de V1', async () => {
  const [governance, marketplace, training] = await Promise.all([
    readFile(new URL('../../assets/js/views/governance.js', import.meta.url), 'utf8'),
    readFile(new URL('../../assets/js/views/marketplace.js', import.meta.url), 'utf8'),
    readFile(new URL('../../assets/js/views/training.js', import.meta.url), 'utf8'),
  ]);

  // ESTRUCTURAL Governance: el pickLang exterior decide si se crea el <p>;
  // el mismo productor solo llega al texto mediante esc().
  assert.match(
    governance,
    /\$\{pickLang\(cms\.description, s\.description \|\| ''\) \? `<p[^`]+\$\{esc\(pickLang\(cms\.description, s\.description \|\| ''\)\)\}<\/p>` : ''\}/,
  );

  // HELPER_QUE_ESCAPA: el helper que recibe las dos excepciones de value
  // protege todos sus campos de texto. htmlValue queda explícitamente fuera
  // de esa afirmación y se prueba por separado debajo.
  const miniMetaBody = marketplace.match(/function renderCardMiniMeta\(items\) \{([\s\S]*?)\n\}/)?.[1] || '';
  for (const field of ['label', 'value', 'secondaryValue', 'tertiaryValue']) {
    assert.match(miniMetaBody, new RegExp(`\\$\\{esc\\(item\\.${field}\\)\\}`), `${field} debe escapar en el helper`);
  }

  // ESTRUCTURAL + COMPOSICION_CADENA Marketplace: el único htmlValue que
  // contiene el sufijo localizado compone `parts` y solo lo emite escapado.
  assert.match(
    marketplace,
    /htmlValue:[\s\S]*?const count = s\.sessionCount \? `\$\{s\.sessionCount\} \$\{pickLang\([\s\S]*?const parts = \[[\s\S]*?\$\{esc\(parts\.join\(' · '\)\)\}<\/p>/,
  );

  // COMPOSICION_CADENA Marketplace restante: getMentoringFormatSummary()
  // produce texto, pero formatSummary no tiene consumidor ni interpolación.
  // Si empezara a usarse, este recuento dejaría de ser uno y exigiría auditar
  // el nuevo sink.
  assert.equal((marketplace.match(/\bformatSummary\b/g) || []).length, 1);
  assert.match(marketplace, /const formatSummary = getMentoringFormatSummary\(format\);/);

  // ESTRUCTURAL Training: título y pasos proceden de pickLang; el título se
  // emite con esc() y cada paso cruza pathSteps(), que escapa `step`.
  assert.match(training, /const pbTitle = pb \? pickLang\(pb\.title,[^;]+;/);
  assert.match(training, /<h3[^>]*>\$\{esc\(pbTitle\)\}<\/h3>/);
  assert.match(training, /const pbSteps = [^;]*pickLang\(s\.text, ''\)[^;]*;/);
  assert.match(training, /pathSteps\(pbSteps, 'bg-eu-purple'\)/);
  const pathStepsBody = training.match(/function pathSteps\(steps, color\) \{([\s\S]*?)\n\}/)?.[1] || '';
  assert.match(pathStepsBody, /\$\{esc\(step\)\}/);
});

test('el techo de salidas editoriales indirectas queda fijado (deuda V6)', async () => {
  const { indirectOutputCandidates } = await generateClassification();

  assert.equal(indirectOutputCandidates.total, 170);
  assert.deepEqual(indirectOutputCandidates.byFile, {
    'assets/js/components/header.js': 4,
    'assets/js/views/governance.js': 25,
    'assets/js/views/home.js': 18,
    'assets/js/views/knowledge.js': 18,
    'assets/js/views/marketplace.js': 19,
    'assets/js/views/network.js': 37,
    'assets/js/views/news.js': 34,
    'assets/js/views/sectors.js': 2,
    'assets/js/views/training.js': 13,
  });

  // VAN-3B.2.1 tría las ocho candidatas de Header: cuatro eran texto
  // editorial y ahora pasan por esc(); las cuatro restantes son fragmentos
  // estructurales construidos por helpers cuyos productores ya se protegen.
  assert.deepEqual(
    indirectOutputCandidates.entries
      .filter(({ file }) => file === 'assets/js/components/header.js')
      .map(({ expression }) => expression),
    ['desktopNav', 'desktopLangButtons', 'mobileNav', 'mobileLangButtons'],
  );
});

test('la clasificación cubre exactamente las interpolaciones sin escapar del inventario', async () => {
  const inventory = await generateInventory();
  const classification = await generateClassification();

  assert.equal(classification.total, inventory.pickLangInterpolations.unescaped);

  const inventoryKeys = inventory.pickLangInterpolations.perFile
    .flatMap((entry) => entry.interpolationDetails
      .filter((detail) => !detail.escaped)
      .map((detail) => `${entry.file}:${detail.line}:${detail.expression}`))
    .sort();
  const classificationKeys = classification.entries
    .map((entry) => `${entry.file}:${entry.line}:${entry.expression}`)
    .sort();

  assert.deepEqual(classificationKeys, inventoryKeys, 'ambos informes deben describir el mismo conjunto');
});

test('htmlContextOf distingue texto de elemento y valor de atributo', () => {
  assert.deepEqual(htmlContextOf('<p class="x">'), { context: 'element-text', attribute: null });
  assert.deepEqual(htmlContextOf('<a href="'), { context: 'attribute', attribute: 'href' });
  assert.deepEqual(htmlContextOf('<img alt="'), { context: 'attribute', attribute: 'alt' });
  // Un atributo ya cerrado no arrastra: lo que sigue es otro atributo.
  assert.deepEqual(htmlContextOf('<a href="/x" title="'), { context: 'attribute', attribute: 'title' });
  assert.deepEqual(htmlContextOf('texto suelto sin etiquetas'), { context: 'element-text', attribute: null });
});

test('categorize aplica las reglas documentadas de VAN-1.2', () => {
  const html = '<p>x</p>';

  assert.equal(categorize({
    rawExpr: 'pickLang(a)', directText: 'pickLang(a)', precedingLiteral: '<p>', enclosingTemplate: html,
  }).category, 'TEXTO_PLANO');

  assert.equal(categorize({
    rawExpr: 'pickLang(a)', directText: 'pickLang(a)', precedingLiteral: '<a href="', enclosingTemplate: html,
  }).category, 'URL');

  assert.equal(categorize({
    rawExpr: 'pickLang(a)', directText: 'pickLang(a)', precedingLiteral: '<a title="', enclosingTemplate: html,
  }).category, 'ATRIBUTO');

  assert.equal(categorize({
    rawExpr: 'pickLang(a)', directText: 'pickLang(a)', precedingLiteral: '', enclosingTemplate: 'sin marcado',
  }).category, 'COMPOSICION_CADENA');

  assert.equal(categorize({
    rawExpr: 'flag ? `<b>${pickLang(a)}</b>` : ""',
    directText: 'flag ? `<b>${ }</b>` : ""',
    precedingLiteral: '<div>',
    enclosingTemplate: html,
  }).category, 'ESTRUCTURAL');

  assert.equal(categorize({
    rawExpr: 'renderCardMiniMeta([{ label: pickLang(a) }])',
    directText: 'renderCardMiniMeta([{ label: pickLang(a) }])',
    precedingLiteral: '<div>',
    enclosingTemplate: html,
  }).category, 'HELPER_QUE_ESCAPA');

  // El campo htmlValue del helper NO se escapa: no puede darse por cubierto.
  assert.equal(categorize({
    rawExpr: 'renderCardMiniMeta([{ htmlValue: pickLang(a) }])',
    directText: 'renderCardMiniMeta([{ htmlValue: pickLang(a) }])',
    precedingLiteral: '<div>',
    enclosingTemplate: html,
  }).category, 'ESTRUCTURAL');
});
