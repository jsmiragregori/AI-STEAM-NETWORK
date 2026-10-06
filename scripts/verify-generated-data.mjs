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

// ── F5 (D9): coherencia de los activos inmutables ───────────────────────────
//
// Un árbol sellado referencia COPIAS con la huella en el nombre
// (`main.<hash8>.js`, `marketplace.<hash8>.js`, `adjunto.<hash8>.pdf`) y
// `version.json` (esquema `ai-steam-build/2`) declara cada una con su `sha256` y
// su canónico. Esta comprobación es ligera e independiente de
// `stamp-assets.mjs` (que vive en CONTENT): un manifest que no cuadre con sus
// bytes, una copia ausente o alterada, o un `index.html` que cargue el canónico
// en vez de la copia se ven aquí. Los canónicos siguen siendo el alcance de la
// guarda P-40 (datos generados completos), y el panel/los enlaces compartidos
// siguen usándolos.

const SCHEMA_VERSION = 'ai-steam-build/2';
const SELLADA = /\.[0-9a-f]{8}\.[^./]+$/;

function sha256Hex(bytes) {
  return createHash('sha256').update(bytes).digest('hex');
}

function esRutaSellada(rel) {
  return SELLADA.test(String(rel));
}

function canonicoDe(rel) {
  return String(rel).replace(/\.[0-9a-f]{8}(\.[^./]+)$/, '$1');
}

async function leerTextoSiExiste(absoluto) {
  try {
    return await readFile(absoluto, 'utf8');
  } catch {
    return null;
  }
}

/** Referencias a copias citadas por `index.html`, los módulos/datos y los adjuntos. */
async function referenciasSelladas(raiz) {
  const refs = [];
  const agregar = (origenRel, texto) => {
    for (const match of texto.matchAll(/[A-Za-z0-9_./-]+\.[0-9a-f]{8}\.[a-z0-9]+/g)) {
      refs.push({ token: match[0], origenRel });
    }
  };
  const html = await leerTextoSiExiste(path.join(raiz, 'index.html'));
  if (html) agregar('index.html', html);
  async function caminar(directorio, relBase) {
    let entradas;
    try {
      entradas = await readdir(directorio, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entrada of entradas.sort((a, b) => a.name.localeCompare(b.name))) {
      const rel = `${relBase}/${entrada.name}`;
      if (entrada.isDirectory()) {
        await caminar(path.join(directorio, entrada.name), rel);
        continue;
      }
      if (!/\.(?:js|html)$/.test(entrada.name)) continue;
      const texto = await leerTextoSiExiste(path.join(directorio, entrada.name));
      if (texto) agregar(rel, texto);
    }
  }
  await caminar(path.join(raiz, 'assets', 'js'), 'assets/js');
  await caminar(path.join(raiz, 'assets', 'data'), 'assets/data');
  return refs;
}

/** Ruta absoluta de un token sellado: `assets/...` es de raíz; `./` y `../`, relativos. */
function absolutoDeToken(raiz, token, origenRel) {
  const limpio = token.replace(/^\.\//, '');
  if (limpio.startsWith('assets/')) return path.join(raiz, ...limpio.split('/'));
  const base = path.dirname(path.join(raiz, ...origenRel.split('/')));
  return path.resolve(base, limpio);
}

async function verificarHuellas(raiz) {
  const problemas = [];
  let comprobadas = 0;
  const refs = await referenciasSelladas(raiz);

  let version = null;
  let crudo = null;
  try {
    crudo = await readFile(path.join(raiz, 'version.json'), 'utf8');
  } catch (error) {
    if (error.code !== 'ENOENT') {
      problemas.push('version.json ilegible: no se puede comprobar el sello');
    }
  }
  if (crudo !== null) {
    if (crudo.trim() === '') problemas.push('version.json vacío: el sitio no está sellado');
    else {
      try {
        version = JSON.parse(crudo);
      } catch {
        problemas.push('version.json ilegible: no se puede comprobar el sello');
      }
    }
  }
  if (!version || typeof version !== 'object') {
    if (refs.length > 0) {
      problemas.push('hay copias selladas referenciadas pero no hay version.json legible: el sitio no está sellado');
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
  const declaradas = new Set();
  for (const [seccion, mapa] of secciones) {
    for (const [clave, item] of Object.entries(mapa)) {
      if (!item || typeof item.url !== 'string' || !/^[0-9a-f]{64}$/.test(item.sha256 || '')) {
        problemas.push(`version.json: ${seccion}['${clave}'] mal formado`);
        continue;
      }
      const url = item.url.replace(/^\.\//, '');
      declaradas.add(url);
      let bytes;
      try {
        bytes = await readFile(path.join(raiz, ...url.split('/')));
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
      const sufijo = /\.([0-9a-f]{8})\.[^./]+$/.exec(url);
      if (!sufijo || sufijo[1] !== real.slice(0, 8)) {
        problemas.push(
          `version.json: ${seccion}['${clave}'] (${item.url}) tiene una huella en el nombre que no corresponde a sus bytes`,
        );
      }
      if (item.canonico) {
        if (item.canonico !== canonicoDe(url)) {
          problemas.push(`version.json: ${seccion}['${clave}'] declara un canónico distinto de su copia: ${item.canonico}`);
        }
        if ((await leerTextoSiExiste(path.join(raiz, ...item.canonico.split('/')))) === null) {
          problemas.push(`version.json: ${seccion}['${clave}']: falta el canónico ${item.canonico}`);
        }
      }
    }
  }

  // `index.html` tiene que cargar la copia de entrada, no el canónico.
  const html = (await leerTextoSiExiste(path.join(raiz, 'index.html'))) || '';
  const scriptSrc = /<script[^>]*type="module"[^>]*src="((?:\.\/)?[^"]+)"/.exec(html);
  const tokenEntrada = scriptSrc ? scriptSrc[1].replace(/^\.\//, '') : null;
  if (!tokenEntrada || !esRutaSellada(tokenEntrada)) {
    problemas.push('index.html no carga ninguna copia sellada del módulo de entrada (¿sello incompleto?)');
  } else if (version.entrada && tokenEntrada !== version.entrada.url) {
    problemas.push(`index.html carga ${tokenEntrada} y version.json declara ${version.entrada.url}`);
  }

  // Referencias selladas que no pasan por el manifest: deben existir y cuadrar.
  for (const { token, origenRel } of refs) {
    const url = token.replace(/^\.\//, '');
    if (declaradas.has(url)) continue;
    const absoluto = absolutoDeToken(raiz, token, origenRel);
    let bytes;
    try {
      bytes = await readFile(absoluto);
    } catch {
      problemas.push(`referencia sellada sin fichero: ${origenRel} cita ${token}`);
      continue;
    }
    comprobadas += 1;
    const sufijo = /\.([0-9a-f]{8})\.[^./]+$/.exec(url);
    if (!sufijo || sufijo[1] !== sha256Hex(bytes).slice(0, 8)) {
      problemas.push(`referencia sellada alterada: ${token} (citada en ${origenRel})`);
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
