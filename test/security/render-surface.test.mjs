import assert from 'node:assert/strict';
import test from 'node:test';

import { generateInventory } from '../../scripts/inventory-render-surface.mjs';

const EXPECTED_PER_FILE = [
  // 99 y no 101: los dos botones de Participar dejan de tener rama <span> con
  // `pickLang` para el caso "con CMS", porque ahora siempre son <a>. Esa rama
  // solo se conserva para el caso sin CMS, donde `pickLang` no aplica —y donde
  // acceder a `cms.*` habría lanzado—.
  { file: 'assets/js/views/governance.js', unescaped: 1, escaped: 99 },
  { file: 'assets/js/views/knowledge.js', unescaped: 0, escaped: 9 },
  { file: 'assets/js/views/marketplace.js', unescaped: 5, escaped: 12 },
  { file: 'assets/js/views/news.js', unescaped: 4, escaped: 0 },
  // VAN-2.2: 10 y no 9 porque el rótulo del CTA del hero aparece ahora también
  // en la rama <span> de fallo cerrado. Es la misma salida, protegida dos veces.
  { file: 'assets/js/views/training.js', unescaped: 1, escaped: 10 },
];

const EXPECTED_ESC_VIEWS = [
  'assets/js/views/governance.js',
  'assets/js/views/home.js',
  'assets/js/views/knowledge.js',
  // LG-6: la vista legal importa el escapado común, no una copia propia. Que
  // aparezca en esta lista es exactamente lo que exige TDD-L12.
  'assets/js/views/legal.js',
  'assets/js/views/marketplace.js',
  'assets/js/views/network.js',
  'assets/js/views/sectors.js',
  'assets/js/views/training.js',
];

test('el inventario de render reproduce la línea base VAN-0.1', async () => {
  const report = await generateInventory();

  // DL-2: 21 y no 20 porque existe un fichero nuevo, assets/js/utils/view-route.js.
  // Es un recuento de ficheros, no de superficie: TODAS las demás cifras de esta
  // prueba siguen idénticas a la línea base VAN-0.1 —interpolaciones, sinks,
  // hrefs y vistas—, y el módulo nuevo no aparece en ninguna de ellas porque no
  // renderiza nada. Verificado contra el tag salvaguardia/pre-deeplink-2026-09-07.
  // LG-6: 23 y no 21 por dos ficheros nuevos, assets/js/views/legal.js y
  // assets/js/utils/sanitize-legal-html.js. Es un recuento de ficheros, no de
  // superficie: las cifras de interpolaciones, hrefs y sinks siguen idénticas
  // —la vista legal no usa pickLang, no construye ningún href dinámico y no
  // escribe en el DOM—. Lo único que sí se mueve es el total de vistas y la
  // lista de las que importan el escapado común, más abajo.
  assert.equal(report.scannedFiles, 23);
  assert.equal(report.pickLangInterpolations.unescaped, 11);
  assert.equal(report.pickLangInterpolations.escaped, 130);
  assert.deepEqual(
    report.pickLangInterpolations.perFile.map(({ file, unescaped, escaped }) => ({ file, unescaped, escaped })),
    EXPECTED_PER_FILE,
  );

  // LG-6: la décima vista es legal.js, la de las cuatro páginas legales.
  assert.equal(report.viewsTotal, 10);
  assert.deepEqual(report.viewsDefiningEsc, []);
  assert.deepEqual(report.viewsImportingEscapeHtml, EXPECTED_ESC_VIEWS);
  // LG-7 y LG-8: 25 y no 23. Dos enlaces nuevos -el del pie a las páginas
  // legales y el del aviso de cookies a su política- y un censo que pasa a
  // cubrir TODOS los componentes en vez de una lista de ficheros, porque
  // enumerarlos dejaba el instrumento un paso por detrás del código.
  // Ninguno de los dos es editorial: los construye `formatViewRoute()` desde la
  // tabla de slugs congelada, y por eso cuentan como validados (ver
  // `collectValidatedUrlIdentifiers`).
  assert.equal(report.dynamicHrefs.editorialCount, 25);
  // VAN-3B.2.1: los 23 pasan por getSafeEditorialUrl(), incluidos los dos de
  // Header que V9 demostró editoriales. El invariante que importa
  // es que no quede ninguno sin validar, no que sigan siendo 23: si alguien
  // añade el enlace 22 sin cablearlo, esta lista deja de estar vacía.
  assert.deepEqual(report.dynamicHrefs.editorialUnvalidated, []);
  assert.equal(report.dynamicHrefs.editorialSchemeValidated, 25);
  assert.equal(report.dynamicHrefs.nonEditorialCount, 0);
  assert.equal(report.dynamicHrefs.total, 25);
  // VAN-2.3: 21 y no 16 por dos ampliaciones de la medición: los
  // `target="${…}"` calculados, antes invisibles, y el ancla que emite
  // `sanitize-editorial-html.js`, antes fuera de alcance. El invariante —que la
  // lista de inseguros esté vacía— vive en `noopener.test.mjs`.
  assert.equal(report.blankTargetsWithoutNoopener.total, 21);
  assert.deepEqual(report.blankTargetsWithoutNoopener.unsafe, []);

  const sinkCounts = Object.fromEntries(
    [...new Set(report.dangerousSinks.map(({ sink }) => sink))]
      .sort()
      .map((sink) => [sink, report.dangerousSinks.filter((hit) => hit.sink === sink).length]),
  );
  assert.deepEqual(sinkCounts, {
    'innerHTML assignment': 23,
    insertAdjacentHTML: 1,
    // DL-4: la ÚNICA lectura del hash de todo el árbol, en router.js. El
    // inventario la marca porque el hash es entrada no confiable, y hace bien:
    // que aparezca aquí es lo que obliga a justificarla. Está contenida por
    // test/security/hash-containment.test.mjs, que falla si aparece una segunda
    // lectura en cualquier otro fichero (TDD-14) o si el fichero que la lee
    // escribe HTML (TDD-15). Su valor no se interpola nunca: solo se compara
    // contra la allowlist de slugs y se descarta.
    // LG-10: pasa a 2 —ambas en router.js—. La segunda es isInPageAnchor, que
    // distingue el salto al contenido principal de una ruta. Sigue contenida:
    // TDD-14 falla si location.hash aparece en cualquier otro fichero, y TDD-15
    // si el fichero que lo lee escribe HTML. Ninguna de las dos interpola el
    // valor: una lo compara contra la allowlist de slugs y la otra pregunta si
    // existe un elemento con ese id en nuestro propio DOM.
    'location.hash': 2,
  });

  assert.deepEqual(await generateInventory(), report, 'el inventario debe ser determinista');
});
