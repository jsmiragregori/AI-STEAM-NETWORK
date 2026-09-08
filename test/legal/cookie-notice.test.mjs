// LG-9 — la política de cookies no puede mentir.
//
// Una política de cookies es una DECLARACIÓN SOBRE EL COMPORTAMIENTO DEL
// SOFTWARE. Si el software cambia y el documento no, el documento pasa a ser
// falso, y una declaración falsa publicada por una administración es peor que
// no tenerla. Estas dos pruebas convierten esa coherencia en algo que el arnés
// vigila solo, en vez de depender de que alguien se acuerde.
//
// TDD-L15 y TDD-L16 del plan (§6.4), que su propio texto llama el corazón del
// plan legal.

import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import { LEGAL_CONFIG } from '../../assets/data/legal.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const JS_DIR = path.join(ROOT, 'assets/js');

/** Todos los .js del runtime. `lib/` es código vendorizado y no es nuestro. */
async function ficherosDelRuntime(dir = JS_DIR) {
  const salida = [];
  for (const entrada of await readdir(dir, { withFileTypes: true })) {
    const completo = path.join(dir, entrada.name);
    if (entrada.isDirectory()) {
      if (entrada.name === 'lib') continue;
      salida.push(...await ficherosDelRuntime(completo));
    } else if (entrada.name.endsWith('.js')) {
      salida.push(completo);
    }
  }
  return salida.sort();
}

const FICHEROS = await ficherosDelRuntime();
const FUENTES = new Map(await Promise.all(
  FICHEROS.map(async f => [path.relative(ROOT, f).replaceAll('\\', '/'), await readFile(f, 'utf8')]),
));

// TDD-L15
test('TDD-L15: la política dice que no hay cookies, y el código no crea ninguna', () => {
  const culpables = [];
  for (const [fichero, fuente] of FUENTES) {
    // Se busca el uso real, no la palabra: los comentarios hablan de cookies a
    // menudo y con razón.
    const sinComentarios = fuente
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/^\s*\/\/.*$/gm, '');
    if (/document\s*\.\s*cookie/.test(sinComentarios)) culpables.push(fichero);
  }

  assert.deepEqual(
    culpables, [],
    'Alguien ha añadido una cookie. La política de cookies publicada afirma que este sitio no '
    + 'instala NINGUNA: o se retira la cookie, o hay que reescribir el documento en los tres '
    + 'idiomas antes de publicar. Ficheros: ' + culpables.join(', '),
  );

  // Y el documento sigue diciéndolo, en los tres idiomas: si alguien suaviza el
  // texto, esta prueba deja de tener sentido y hay que enterarse. La frase se
  // fija literal, tomada del documento publicado, porque «afirmar que no hay
  // cookies» no es algo que se pueda comprobar con una palabra suelta.
  const AFIRMACION = {
    es: 'no instala ninguna cookie',
    en: 'does not place any cookies',
    va: 'no instal·la cap cookie',
  };
  for (const [lang, frase] of Object.entries(AFIRMACION)) {
    const html = LEGAL_CONFIG.documentos.cookies[lang].html.toLowerCase();
    assert.ok(
      html.includes(frase),
      `${lang}: la política ha dejado de afirmar que no se instalan cookies («${frase}»)`,
    );
  }
});

// --- Claves de almacenamiento: lo declarado frente a lo real -----------------

/**
 * Resuelve la clave de un `localStorage.xItem(...)`.
 *
 * Devuelve la clave literal, o un prefijo terminado en ':' cuando la clave se
 * construye con una plantilla. Devuelve `null` si NO se puede saber qué clave
 * es: eso también es un resultado, y hace fallar la prueba. Una clave que nadie
 * puede rastrear no se puede declarar en un documento legal.
 */
function resolverClave(argumento, fuente) {
  const arg = argumento.trim();

  // 1. Literal: localStorage.getItem('language')
  const literal = /^['"]([^'"]+)['"]$/.exec(arg);
  if (literal) return literal[1];

  // 2. Plantilla con prefijo: `mpCommunityFilters:${tabId}`
  const plantilla = /^`([^`$]+)\$\{/.exec(arg);
  if (plantilla) return plantilla[1];

  // 3. Llamada a un ayudante: getFilterStorageKey(tabId) -> se mira su cuerpo.
  const llamada = /^([A-Za-z_$][\w$]*)\s*\(/.exec(arg);
  if (llamada) {
    const cuerpo = new RegExp(`function\\s+${llamada[1]}\\s*\\([^)]*\\)\\s*\\{([\\s\\S]*?)\\n\\}`).exec(fuente);
    if (cuerpo) {
      const devuelve = /return\s+(`[^`]*`|['"][^'"]*['"])/.exec(cuerpo[1]);
      if (devuelve) return resolverClave(devuelve[1], fuente);
    }
    return null;
  }

  // 4. Identificador: o es una constante del fichero, o es un parámetro y
  //    entonces se mira con qué lo llaman.
  const ident = /^[A-Za-z_$][\w$]*$/.exec(arg);
  if (ident) {
    const constante = new RegExp(`(?:const|let|var)\\s+${arg}\\s*=\\s*(['"\`][^'"\`]*['"\`])`).exec(fuente);
    if (constante) return resolverClave(constante[1], fuente);

    const envolvente = new RegExp(`function\\s+([A-Za-z_$][\\w$]*)\\s*\\([^)]*\\b${arg}\\b`).exec(fuente);
    if (envolvente) {
      const argumentos = [...fuente.matchAll(new RegExp(`${envolvente[1]}\\s*\\(\\s*(['"][^'"]+['"])`, 'g'))];
      if (argumentos.length > 0) return resolverClave(argumentos[0][1], fuente);
    }
  }

  return null;
}

/** Todas las claves de localStorage que el código usa de verdad. */
function clavesEnUso() {
  const encontradas = new Map();
  const sinResolver = [];

  for (const [fichero, fuente] of FUENTES) {
    const re = /localStorage\s*\.\s*(?:get|set|remove)Item\s*\(\s*([^,)]+)/g;
    let m;
    while ((m = re.exec(fuente))) {
      const clave = resolverClave(m[1], fuente);
      if (clave === null) sinResolver.push(`${fichero}: ${m[1].trim()}`);
      else if (!encontradas.has(clave)) encontradas.set(clave, fichero);
    }
  }

  return { encontradas, sinResolver };
}

/** Las claves que el documento publicado declara, marcadas con `code`. */
function clavesDeclaradas(lang) {
  const html = LEGAL_CONFIG.documentos.cookies[lang].html;
  return new Set([...html.matchAll(/<code>([^<]+)<\/code>/g)].map(m => m[1]));
}

// TDD-L16
test('TDD-L16: las claves declaradas en la política son las que el código usa', () => {
  const { encontradas, sinResolver } = clavesEnUso();

  assert.deepEqual(
    sinResolver, [],
    'Hay una clave de almacenamiento que no se puede rastrear hasta un literal, así que no se '
    + 'puede declarar en la política. Dale un nombre resoluble: ' + sinResolver.join(' · '),
  );

  const declaradas = clavesDeclaradas('es');
  assert.ok(declaradas.size > 0, 'la política ha dejado de enumerar claves');

  // 1. Todo lo que el código guarda está declarado. Una clave nueva sin declarar
  //    convierte el documento en incompleto, que es una forma de ser falso.
  // Una clave puede construirse con plantilla -`trainingFilters_${tab}`- y en ese
  // caso lo que se encuentra es un PREFIJO. Cuenta como cubierto si la política
  // declara ese prefijo o cualquier clave concreta que empiece por él: declarar
  // las tres de Formación una a una informa mejor que declarar la familia.
  const esPrefijo = clave => clave.endsWith(':') || clave.endsWith('_');
  const noDeclaradas = [];
  for (const [clave, fichero] of encontradas) {
    const cubierta = declaradas.has(clave)
      || (esPrefijo(clave) && [...declaradas].some(d => d.startsWith(clave)))
      || [...declaradas].some(d => esPrefijo(d) && clave.startsWith(d));
    if (!cubierta) noDeclaradas.push(`${clave} (${fichero})`);
  }
  assert.deepEqual(
    noDeclaradas, [],
    'El código guarda claves que la política de cookies NO declara. Hay que añadirlas al '
    + 'documento en los tres idiomas antes de publicar: ' + noDeclaradas.join(' · '),
  );

  // 2. Y al revés: lo declarado existe. Declarar algo que ya no se guarda
  //    también es informar mal, y además deja rastro de código muerto.
  const sobrantes = [...declaradas].filter(d => {
    if (encontradas.has(d)) return false;
    return ![...encontradas.keys()].some(c => (
      (esPrefijo(d) && c.startsWith(d)) || (esPrefijo(c) && d.startsWith(c))
    ));
  });
  assert.deepEqual(
    sobrantes, [],
    'La política declara claves que el código ya no usa: ' + sobrantes.join(' · '),
  );
});

test('TDD-L16: las tres versiones declaran exactamente las mismas claves', () => {
  const es = [...clavesDeclaradas('es')].sort();
  for (const lang of ['en', 'va']) {
    assert.deepEqual(
      [...clavesDeclaradas(lang)].sort(), es,
      `${lang}: la lista de claves no coincide con la española. Un nombre técnico no se traduce, `
      + 'y si una versión enumera otras claves es que una de las dos se quedó sin actualizar.',
    );
  }
});
