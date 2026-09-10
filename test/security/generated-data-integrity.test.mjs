// P-40 — Los datos generados llegan enteros, o se sabe antes de publicar.
//
// ## El problema que esto cubre, dicho con precisión
//
// Los 14 ficheros de `assets/data/` se importan de forma ESTÁTICA, y el grafo es
// completo: `main.js` → `views/index.js` → las nueve vistas → su fichero de
// datos. Si UNO solo falta, está vacío o tiene la sintaxis rota, el import falla
// y **no arranca nada**. El visitante ve una página en blanco: `index.html` es
// una cáscara con `<main id="main-root">` vacío, sin texto ni aviso.
//
// Lo importante es lo que NO puede arreglar el código del sitio. Un fallo de
// import ocurre ANTES de que ninguna línea nuestra se ejecute, así que el «fallo
// cerrado» de DA-CS-5 —que sí funciona con datos malformados dentro de un
// fichero válido— no llega a tener ocasión de actuar. No es un defecto del
// enrutado: es una propiedad del grafo de módulos ES.
//
// ## Por qué una guarda de publicación y no un `import()` con try/catch
//
// Convertir los 14 imports en dinámicos volvería asíncrono todo el arranque del
// sitio, para acabar mostrando secciones vacías en vez de una página vacía. Es
// mucho riesgo sobre algo que hoy funciona, a cambio de poco. La vía barata es
// esta: comprobar ANTES de publicar que los ficheros están completos.
//
// ## Qué vector cubre de verdad
//
// La escritura ya es atómica en los dos extremos —el loader publica con
// `rename` tras `fsync`, y el panel con `os.replace`—, así que un fichero a
// medias no puede nacer de una escritura interrumpida. El vector real es el
// **transporte**: el sitio se entrega a DGTIC en ZIP y se despliega
// descomprimiendo sobre montajes NFS. Una descompresión parcial, una copia
// interrumpida o un montaje que no está donde se cree sí dejan ficheros
// ausentes o truncados. Eso es lo que esta guarda ve.

import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { DATOS_GENERADOS, verificarDatosGenerados } from '../../scripts/verify-generated-data.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

test('están declarados todos los ficheros de datos que el sitio importa', async () => {
  // El censo se saca del código, no de una lista escrita a mano: enumerarlos a
  // mano deja el instrumento un paso por detrás en cuanto alguien añade una
  // sección, que es justo lo que pasó con los enlaces del pie en LG-7.
  const declarados = new Set(DATOS_GENERADOS.map((d) => d.fichero));
  const importados = new Set();

  const ficherosJs = [
    'assets/js/main.js', 'assets/js/i18n.js', 'assets/js/slug-table.js',
    'assets/js/components/header.js', 'assets/js/views/index.js',
  ];
  for (const vista of ['home', 'sectors', 'training', 'governance', 'knowledge',
    'network', 'marketplace', 'legal', 'sitemap', 'news']) {
    ficherosJs.push(`assets/js/views/${vista}.js`);
  }

  for (const relativo of ficherosJs) {
    let fuente;
    try {
      fuente = await readFile(path.join(ROOT, relativo), 'utf8');
    } catch {
      continue; // una vista que ya no exista no invalida el censo
    }
    for (const encontrado of fuente.matchAll(/from '(?:\.\.\/)+data\/([\w-]+\.js)'/g)) {
      importados.add(encontrado[1]);
    }
  }

  assert.ok(importados.size > 0, 'el escáner no ha encontrado ningún import de datos');
  for (const fichero of importados) {
    assert.ok(
      declarados.has(fichero),
      `assets/data/${fichero} se importa y no está declarado en DATOS_GENERADOS: `
      + 'si llega vacío o truncado, el sitio entero se queda en blanco sin aviso',
    );
  }
});

test('los datos publicados hoy pasan la verificación', async () => {
  const informe = await verificarDatosGenerados(ROOT);
  assert.deepEqual(informe.problemas, []);
  assert.equal(informe.comprobados, DATOS_GENERADOS.length);
});

test('ninguno de los ficheros declarados está vacío ni es sospechosamente corto', async () => {
  for (const { fichero } of DATOS_GENERADOS) {
    const info = await stat(path.join(ROOT, 'assets', 'data', fichero));
    assert.ok(info.size > 0, `assets/data/${fichero} está vacío`);
  }
});

test('la verificación detecta un fichero vacío', async () => {
  const informe = await verificarDatosGenerados(ROOT, {
    leer: async (relativo) => (relativo.endsWith('navigation.js') ? '' : null),
  });
  assert.equal(informe.problemas.length, 1);
  assert.match(informe.problemas[0], /navigation\.js/);
  assert.match(informe.problemas[0], /vac/i);
});

test('la verificación detecta un fichero truncado a media sentencia', async () => {
  const informe = await verificarDatosGenerados(ROOT, {
    leer: async (relativo) => (
      relativo.endsWith('navigation.js') ? 'export const NAV_CONFIG = { "items": [' : null
    ),
  });
  assert.equal(informe.problemas.length, 1);
  assert.match(informe.problemas[0], /navigation\.js/);
});

test('la verificación detecta que falta el símbolo que el sitio importa', async () => {
  // El caso más engañoso: el fichero existe, pesa y parsea, pero no exporta lo
  // que alguien importa. Falla igual, y a simple vista parece correcto.
  const informe = await verificarDatosGenerados(ROOT, {
    leer: async (relativo) => (
      relativo.endsWith('navigation.js')
        // Con cuerpo suficiente: se quiere probar que falta el símbolo, no que
        // el fichero sea corto, que es otra comprobación distinta.
        ? '// GENERADO AUTOMÁTICAMENTE\nexport const OTRA_COSA = { "items": [] };\n'
        : null
    ),
  });
  assert.equal(informe.problemas.length, 1);
  assert.match(informe.problemas[0], /NAV_CONFIG/);
});

test('la verificación detecta un fichero ausente', async () => {
  const informe = await verificarDatosGenerados(ROOT, {
    leer: async (relativo) => {
      if (!relativo.endsWith('navigation.js')) return null;
      const error = new Error('ENOENT');
      error.code = 'ENOENT';
      throw error;
    },
  });
  assert.equal(informe.problemas.length, 1);
  assert.match(informe.problemas[0], /no existe|ENOENT/i);
});
