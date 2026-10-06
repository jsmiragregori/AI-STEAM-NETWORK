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

import { readFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
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

// ── F5 (D9): coherencia de las huellas `?v=<hash8>` ─────────────────────────
//
// Un árbol sellado lleva en cada URL de módulo/dato/adjunto el prefijo de 8 hex
// del SHA-256 de sus bytes finales, y `version.json` con commit, fecha y los
// hashes de cada `assets/data/*.js`. Esta comprobación es ligera e independiente
// de `stamp-assets.mjs` (que vive en CONTENT): recorre las huellas declaradas,
// resuelve su destino y compara. Un dato tocado sin resellar, o un adjunto
// sustituido, se ven aquí aunque el fichero siga existiendo y parseando.

const HUELLA_EN_TEXTO = /([A-Za-z0-9_./-]+)\?v=([0-9a-f]{8})/g;
const SCHEMA_VERSION = 'ai-steam-build/1';

function sha256Hex(bytes) {
  return createHash('sha256').update(bytes).digest('hex');
}

/** Resuelve el token de una URL sellada, o null si no es una ruta local. */
function resolverToken(raiz, relArchivo, token) {
  const limpio = String(token).split('#')[0];
  if (!limpio || /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(limpio) || limpio.startsWith('//')) return null;
  const base = limpio.startsWith('./') || limpio.startsWith('../')
    ? path.dirname(path.join(raiz, ...relArchivo.split('/')))
    : raiz;
  return path.resolve(base, limpio);
}

async function ficherosConHuellas(raiz) {
  const salida = [];
  const agregar = async (absoluto, rel) => {
    try {
      salida.push({ rel, texto: await readFile(absoluto, 'utf8') });
    } catch {
      /* un fichero que no existe no aporta huellas */
    }
  };
  await agregar(path.join(raiz, 'index.html'), 'index.html');
  await agregar(path.join(raiz, 'version.json'), 'version.json');
  async function caminar(directorio, relBase) {
    let entradas;
    try {
      entradas = await readdir(directorio, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entrada of entradas.sort((a, b) => a.name.localeCompare(b.name))) {
      const rel = `${relBase}/${entrada.name}`;
      if (entrada.isDirectory()) await caminar(path.join(directorio, entrada.name), rel);
      else if (entrada.name.endsWith('.js')) await agregar(path.join(directorio, entrada.name), rel);
    }
  }
  await caminar(path.join(raiz, 'assets', 'js'), 'assets/js');
  await caminar(path.join(raiz, 'assets', 'data'), 'assets/data');
  return salida;
}

async function verificarHuellas(raiz) {
  const problemas = [];
  let comprobadas = 0;
  const declaraciones = new Map(); // absoluto → { esperada, origen, url }

  for (const { rel, texto } of await ficherosConHuellas(raiz)) {
    for (const match of texto.matchAll(HUELLA_EN_TEXTO)) {
      const absoluto = resolverToken(raiz, rel, match[1]);
      if (!absoluto) continue;
      if (!declaraciones.has(absoluto)) {
        declaraciones.set(absoluto, { esperada: match[2], origen: rel, url: match[1] });
      }
    }
  }

  for (const [absoluto, declaracion] of declaraciones) {
    let bytes;
    try {
      bytes = await readFile(absoluto);
    } catch {
      problemas.push(
        `huella sin destino: ${declaracion.origen} apunta a ${declaracion.url}?v=${declaracion.esperada}, `
        + 'y ese fichero no existe',
      );
      continue;
    }
    comprobadas += 1;
    const real = sha256Hex(bytes).slice(0, 8);
    if (real !== declaracion.esperada) {
      problemas.push(
        `huella obsoleta: ${declaracion.origen} apunta a ${declaracion.url}?v=${declaracion.esperada}, `
        + `pero los bytes son ${real}; hay que resellar`,
      );
    }
  }

  let version = null;
  try {
    version = JSON.parse(await readFile(path.join(raiz, 'version.json'), 'utf8'));
  } catch (error) {
    if (error.code !== 'ENOENT') problemas.push('version.json ilegible: no se puede comprobar el sello');
    version = null;
  }
  if (!version || typeof version !== 'object') {
    if (declaraciones.size > 0) {
      problemas.push('hay huellas ?v= pero no hay version.json: el sitio no está sellado');
    }
    return { problemas, comprobadas };
  }
  if (version.schema !== SCHEMA_VERSION) {
    problemas.push(`version.json con esquema desconocido: ${JSON.stringify(version.schema)}`);
  }
  const datos = version.datos && typeof version.datos === 'object' ? version.datos : {};
  for (const { fichero } of DATOS_GENERADOS) {
    if (!datos[fichero]) problemas.push(`version.json no declara assets/data/${fichero}`);
  }
  const secciones = [
    ['entrada', { entrada: version.entrada }],
    ['modulos', version.modulos || {}],
    ['datos', datos],
    ['recursos', version.recursos || {}],
  ];
  for (const [seccion, mapa] of secciones) {
    for (const [clave, item] of Object.entries(mapa)) {
      if (!item || typeof item.url !== 'string' || !/^[0-9a-f]{64}$/.test(item.sha256 || '')) {
        problemas.push(`version.json: ${seccion}['${clave}'] mal formado`);
        continue;
      }
      const absoluto = resolverToken(raiz, 'version.json', item.url.replace(/\?v=[0-9a-f]{8}$/, ''));
      let bytes;
      try {
        bytes = await readFile(absoluto);
      } catch {
        problemas.push(`version.json: ${seccion}['${clave}'] apunta a ${item.url}, que no existe`);
        continue;
      }
      comprobadas += 1;
      const real = sha256Hex(bytes);
      if (item.sha256 !== real) {
        problemas.push(
          `version.json: ${seccion}['${clave}'] (${item.url}) declara sha256 ${item.sha256.slice(0, 12)}… `
          + `pero los bytes son ${real.slice(0, 12)}…`,
        );
      }
      const huella = /\?v=([0-9a-f]{8})$/.exec(item.url);
      if (!huella || huella[1] !== real.slice(0, 8)) {
        problemas.push(
          `version.json: ${seccion}['${clave}'] (${item.url}) tiene una huella que no corresponde a sus bytes`,
        );
      }
    }
  }
  return { problemas, comprobadas };
}

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

  // F5: si el sitio está sellado, las huellas tienen que corresponder a los bytes
  // que se van a servir. Es independiente de la guarda P-40 y no la sustituye.
  const sello = await verificarHuellas(raiz);
  problemas.push(...sello.problemas);

  return { comprobados, problemas, huellas: sello.comprobadas };
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
