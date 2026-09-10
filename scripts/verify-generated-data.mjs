// Comprueba que los datos generados están completos ANTES de publicarlos (P-40).
//
// Los ficheros de `assets/data/` se importan de forma estática desde todo el
// sitio. Si uno falta, llega vacío o truncado, el import falla y el visitante ve
// una página **en blanco**, sin aviso: `index.html` es una cáscara y el fallo
// ocurre antes de que se ejecute una sola línea nuestra, así que ningún «fallo
// cerrado» del código puede salvarlo.
//
// La escritura ya es atómica en los dos extremos, de modo que el vector real no
// es escribir a medias sino **transportar** a medias: el sitio se entrega en ZIP
// y se despliega descomprimiendo sobre montajes NFS. Esta guarda es la que ve
// una descompresión parcial o un montaje que no está donde se cree.
//
// HERRAMIENTA DE CONSTRUCCIÓN. Se ejecuta en la máquina que genera y empaqueta
// el sitio, nunca en el servidor: el paquete que se despliega lleva solo
// `index.html` y `assets/`, sin `package.json` ni `scripts/`, y el sitio servido
// no depende de Node para nada.
//
// Uso:  npm run verify:data
// Devuelve código 1 si algo falta, para poder encadenarlo antes de empaquetar.

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Los ficheros generados y el símbolo que el sitio importa de cada uno.
 *
 * El símbolo importa tanto como el fichero: uno que existe, pesa y parsea pero
 * no exporta lo que alguien importa falla igual, y a simple vista parece
 * correcto. `generated-data-integrity.test.mjs` comprueba contra el código que
 * esta lista no se quede corta.
 */
export const DATOS_GENERADOS = [
  { fichero: 'governance.js', simbolo: 'GOVERNANCE_CONFIG' },
  { fichero: 'header.js', simbolo: 'HEADER_CONFIG' },
  { fichero: 'home.js', simbolo: 'HOME_CONFIG' },
  { fichero: 'knowledge.js', simbolo: 'KNOWLEDGE_CONFIG' },
  { fichero: 'legal.js', simbolo: 'LEGAL_CONFIG' },
  { fichero: 'marketplace.js', simbolo: 'MARKETPLACE_CONFIG' },
  { fichero: 'navigation.js', simbolo: 'NAV_CONFIG' },
  { fichero: 'network.js', simbolo: 'NETWORK_CONFIG' },
  { fichero: 'news.js', simbolo: 'NEWS_CONFIG' },
  { fichero: 'sectors.js', simbolo: 'SECTORS_CONFIG' },
  { fichero: 'sitemap.js', simbolo: 'SITEMAP_CONFIG' },
  { fichero: 'training.js', simbolo: 'TRAINING_CONFIG' },
  // En minúscula, a diferencia del resto: así se exporta desde que existe.
  { fichero: 'translations.js', simbolo: 'translations' },
];

/** Un fichero generado por debajo de esto está a medias, no escrito. */
const TAMANO_MINIMO = 40;

/**
 * @param {string} raiz Raíz del repositorio.
 * @param {{leer?: (relativo: string) => Promise<string|null>}} [opciones]
 *   `leer` permite inyectar contenidos en las pruebas; devolver `null` significa
 *   «lee del disco de verdad».
 */
export async function verificarDatosGenerados(raiz, opciones = {}) {
  const problemas = [];
  let comprobados = 0;

  for (const { fichero, simbolo } of DATOS_GENERADOS) {
    const relativo = path.join('assets', 'data', fichero);
    const absoluto = path.join(raiz, relativo);
    comprobados += 1;

    let contenido = null;
    try {
      if (opciones.leer) contenido = await opciones.leer(relativo);
      if (contenido === null) contenido = await readFile(absoluto, 'utf8');
    } catch (error) {
      problemas.push(
        error.code === 'ENOENT'
          ? `assets/data/${fichero}: no existe. El sitio no arrancará.`
          : `assets/data/${fichero}: no se ha podido leer (${error.code || error.message}).`,
      );
      continue;
    }

    if (contenido.trim() === '') {
      problemas.push(`assets/data/${fichero}: está vacío. El sitio no arrancará.`);
      continue;
    }
    if (contenido.length < TAMANO_MINIMO) {
      problemas.push(
        `assets/data/${fichero}: solo ${contenido.length} bytes; parece truncado.`,
      );
      continue;
    }
    if (!new RegExp(`export\\s+(const|let|var|function|class)\\s+${simbolo}\\b`).test(contenido)) {
      problemas.push(
        `assets/data/${fichero}: no exporta ${simbolo}, que es lo que el sitio importa.`,
      );
      continue;
    }
    // Truncado a media sentencia: parsea mal aunque el símbolo aparezca.
    const llaves = (contenido.match(/\{/g) || []).length - (contenido.match(/\}/g) || []).length;
    const corchetes = (contenido.match(/\[/g) || []).length - (contenido.match(/\]/g) || []).length;
    if (llaves !== 0 || corchetes !== 0) {
      problemas.push(
        `assets/data/${fichero}: llaves o corchetes sin cerrar; el fichero está truncado.`,
      );
    }
  }

  return { comprobados, problemas };
}

const ejecutadoDirectamente = process.argv[1]
  && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));

if (ejecutadoDirectamente) {
  const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const informe = await verificarDatosGenerados(raiz);
  if (informe.problemas.length > 0) {
    console.error('Los datos generados NO están completos:');
    for (const problema of informe.problemas) console.error(`  - ${problema}`);
    console.error('\nPublicar así deja el sitio en blanco, sin aviso para quien lo visite.');
    process.exitCode = 1;
  } else {
    console.log(`Verified ${informe.comprobados} generated data files; the site can boot.`);
  }
}
