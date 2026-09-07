import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import { INVENTORY_JS_ROOT, collectJsFiles } from '../../scripts/inventory-render-surface.mjs';

// TDD-L11 (LG-1) — enlaces que no llevan a ninguna parte.
//
// `href="#"` era, hasta el 2026-09-07, un marcador inofensivo: pulsarlo no hacía
// nada visible. Los enlaces directos por slug cambiaron eso. Ahora un hash vacío
// es una ruta —la que no se reconoce— y el router responde abriendo Inicio, así
// que pulsar «Privacidad» en el pie desde cualquier sección saca al visitante a
// la portada.
//
// La guarda no distingue casos: prohíbe el marcador entero. Un enlace o lleva a
// algún sitio, o no es un enlace. Mientras una sección no exista, su rótulo se
// pinta sin `href`, que es lo que hace un `<a>` sin destino: texto.

const ANCLA_VACIA = /href\s*=\s*(['"])#\1/;

function rutaRelativa(absoluta) {
  return `assets/js/${absoluta.replace(/\\/g, '/').split('/assets/js/')[1]}`;
}

test('TDD-L11: ningún componente ni vista emite href="#"', async () => {
  const infractores = [];

  for (const absoluta of await collectJsFiles(INVENTORY_JS_ROOT)) {
    const fuente = await readFile(absoluta, 'utf8');
    if (ANCLA_VACIA.test(fuente)) infractores.push(rutaRelativa(absoluta));
  }

  // Invariante sobre lista y no sobre número: el fallo nombra el fichero.
  assert.deepEqual(
    infractores,
    [],
    'Un href="#" ya no es inocuo: vacía el hash y el router abre Inicio. Si el ' +
      'destino todavía no existe, pintar el rótulo sin href.',
  );
});

test('TDD-L11b: el pie sigue mostrando sus tres rótulos', async () => {
  const footer = await readFile(new URL('../../assets/js/components/footer.js', import.meta.url), 'utf8');

  // El arreglo no puede consistir en borrar los rótulos: la accesibilidad es una
  // obligación legal (RD 1112/2018) y su enlace tiene que acabar existiendo.
  for (const clave of ['footer.accessibility', 'footer.privacy', 'footer.sitemap']) {
    assert.match(footer, new RegExp(`t\\('${clave}'\\)`), clave);
  }
});
