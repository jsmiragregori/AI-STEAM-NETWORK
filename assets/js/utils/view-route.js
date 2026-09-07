// Enrutado de vistas por slug para los enlaces directos (deep linking).
//
// Módulo PURO: no toca `window`, `document` ni `location`, y no importa nada
// (DA-DL-4). Quien lo llama le pasa el hash y decide qué hacer con el
// resultado; así el arnés es `node --test` sin navegador.
//
// El hash es entrada NO confiable: la escribe quien redacta el enlace y la abre
// quien lo recibe sin mirarla. La única salida posible es una vista de la tabla
// o `null`. No hay modo permisivo ni mensaje de error que haga eco del valor
// recibido (DA-DL-3, amenaza T5).
//
// Contrato (§4 de PLAN_DEEPLINK_VANILLA_2026-09-04):
//
//   '#es/sectores'  → { view: 'sectores', lang: 'es' }   canónico
//   '#sectores'     → { view: 'sectores' }               alias: no inventa idioma
//   '#en/sectores'  → null                               cruzado: no existe
//   cualquier otro  → null                               el llamante abre Inicio

/** Idiomas del sitio, en el orden en que se ofrecen. */
export const LANGS = ['es', 'en', 'va'];

/**
 * Tabla de slugs aprobada y congelada por Salva el 2026-09-07 (§3.1).
 *
 * Cambiar un valor de aquí ROMPE ENLACES YA REPARTIDOS. La forma correcta de
 * cambiar un slug es añadir el anterior como alias, nunca sustituirlo; eso lo
 * administrará el CMS (PLAN_DEEPLINK_CMS_2026-09-04, DA-CS-2).
 */
export const VIEW_SLUGS = Object.freeze({
  'inicio':       Object.freeze({ es: 'inicio',                en: 'home',                  va: 'inici' }),
  'red':          Object.freeze({ es: 'la-red',                en: 'network',               va: 'la-xarxa' }),
  'sectores':     Object.freeze({ es: 'sectores',              en: 'vertical-sectors',      va: 'sectors' }),
  'banco-retos':  Object.freeze({ es: 'comunidad-de-practica', en: 'community-of-practice', va: 'comunitat-de-practica' }),
  'formacion':    Object.freeze({ es: 'formacion',             en: 'training',              va: 'formacio' }),
  'conocimiento': Object.freeze({ es: 'conocimiento',          en: 'knowledge',             va: 'coneixement' }),
  'gobernanza':   Object.freeze({ es: 'gobernanza',            en: 'governance',            va: 'governanca' }),
});

/**
 * Longitud máxima del hash que se acepta procesar, contando la almohadilla
 * (amenaza T6). El canónico más largo mide 27 caracteres
 * (`#va/comunitat-de-practica`); 128 deja holgura de sobra para los slugs que
 * el CMS pueda añadir y corta cualquier intento de agotar recursos.
 */
export const MAX_HASH_LENGTH = 128;

/**
 * Construye el índice de búsqueda a partir de una tabla de slugs.
 *
 * Se usan `Map` y no objetos literales a propósito: un `Map` no tiene cadena de
 * prototipos, así que `'__proto__'` o `'constructor'` son claves corrientes que
 * simplemente no están, y nunca un acceso a propiedad heredada (amenaza T2).
 *
 * @param {Record<string, Record<string, string>>} tabla
 * @returns {{ canonicos: Map<string, {view: string, lang: string}>, alias: Map<string, string> }}
 */
function construirIndice(tabla) {
  const canonicos = new Map();
  const alias = new Map();

  for (const view of Object.keys(tabla)) {
    // Los identificadores internos se aceptan como entrada, nunca se generan
    // (DA-DL-6b). `#banco-retos` sigue funcionando aunque su slug público sea
    // `comunidad-de-practica`.
    if (!alias.has(view)) alias.set(view, view);

    const fila = tabla[view];
    for (const lang of LANGS) {
      const slug = fila[lang];
      if (typeof slug !== 'string' || slug === '') continue;
      canonicos.set(`${lang}/${slug}`, { view, lang });
      // Un slug puede repetirse entre idiomas (es legítimo); como alias sin
      // idioma gana el primero, que basta para resolver la vista.
      if (!alias.has(slug)) alias.set(slug, view);
    }
  }

  return { canonicos, alias };
}

const INDICE_POR_DEFECTO = construirIndice(VIEW_SLUGS);

/**
 * Decodifica una única vez y falla cerrado si el valor está mal formado o si
 * decodificar cambia algo (amenaza T4).
 *
 * Exigir que el valor decodificado sea idéntico al recibido es lo que hace que
 * `#sect%6Fres` y `#%2573ectores` NO equivalgan a `#sectores`: la comparación
 * es exacta sobre el texto tal cual viajó en el enlace.
 *
 * @param {string} valor
 * @returns {string|null}
 */
function decodificarUnaVez(valor) {
  let decodificado;
  try {
    decodificado = decodeURIComponent(valor);
  } catch {
    return null; // '#%' y demás secuencias inválidas
  }
  return decodificado === valor ? valor : null;
}

/** Un segmento válido: minúsculas, dígitos y guiones. Nada más (T1, T3, T4). */
const SEGMENTO = /^[a-z0-9-]+$/;

/**
 * Resuelve el hash de la barra de direcciones a una vista.
 *
 * @param {string|null|undefined} hash Valor tal cual, con o sin '#'.
 * @param {Record<string, Record<string, string>>} [tabla] Tabla de slugs. Por
 *   defecto la congelada de §3.1; se admite otra por inyección para que el CMS
 *   pueda administrarlos sin reescribir este módulo (DA-DL-9).
 * @returns {{view: string, lang?: string}|null} `null` significa "sin ruta":
 *   el llamante abre Inicio.
 */
export function parseViewRoute(hash, tabla) {
  if (typeof hash !== 'string') return null;
  if (hash.length > MAX_HASH_LENGTH) return null; // T6: acotar ANTES de procesar

  const crudo = hash.startsWith('#') ? hash.slice(1) : hash;
  if (crudo === '') return null;

  const valor = decodificarUnaVez(crudo);
  if (valor === null) return null;

  const { canonicos, alias } = tabla ? construirIndice(tabla) : INDICE_POR_DEFECTO;

  const partes = valor.split('/');

  // Forma canónica: '<idioma>/<slug>'.
  if (partes.length === 2) {
    const [lang, slug] = partes;
    if (!LANGS.includes(lang)) return null;      // includes sobre array, no acceso a propiedad
    if (!SEGMENTO.test(slug)) return null;
    const encontrado = canonicos.get(`${lang}/${slug}`);
    // Un slug de otro idioma con este prefijo no resuelve: cada enlace existe
    // de una sola forma (TDD-10d).
    return encontrado ? { view: encontrado.view, lang: encontrado.lang } : null;
  }

  // Alias sin idioma: '<slug>' o '<identificador interno>'.
  if (partes.length === 1) {
    const slug = partes[0];
    if (!SEGMENTO.test(slug)) return null;
    const view = alias.get(slug);
    // Sin `lang`: el visitante se queda en el idioma que ya tuviera. No se
    // inventa uno (DA-DL-6b).
    return view ? { view } : null;
  }

  return null; // '#a/b/c', '#//evil.example', '#https://evil.example'
}

/**
 * Construye el enlace canónico de una vista en un idioma.
 *
 * `params` se acepta y se IGNORA a propósito: el enlace transporta solo la
 * vista. `sectorIds`, `source` y `tab` son estado interno y publicarlos crearía
 * un contrato que nadie mantiene, además de ampliar la superficie de entrada no
 * confiable (DA-DL-2, amenaza T7). El parámetro está en la firma para que quien
 * llame desde el router no tenga que acordarse de quitarlo.
 *
 * @param {string} view
 * @param {string} lang
 * @param {object} [_params] Ignorado deliberadamente.
 * @param {Record<string, Record<string, string>>} [tabla]
 * @returns {string|null} '#es/sectores', o `null` si la combinación no existe.
 */
export function formatViewRoute(view, lang, _params, tabla) {
  const fuente = tabla || VIEW_SLUGS;
  if (!Object.prototype.hasOwnProperty.call(fuente, view)) return null;
  if (!LANGS.includes(lang)) return null;

  const slug = fuente[view][lang];
  if (typeof slug !== 'string' || slug === '') return null;

  return `#${lang}/${slug}`;
}
