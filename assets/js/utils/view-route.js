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
  'sectores':     Object.freeze({ es: 'sectores',              en: 'sectors',              va: 'sectors' }),
  'banco-retos':  Object.freeze({ es: 'comunidad-de-practica', en: 'community-of-practice', va: 'comunitat-de-practica' }),
  'formacion':    Object.freeze({ es: 'formacion',             en: 'training',              va: 'formacio' }),
  'conocimiento': Object.freeze({ es: 'conocimiento',          en: 'knowledge',             va: 'coneixement' }),
  'gobernanza':   Object.freeze({ es: 'gobernanza',            en: 'governance',            va: 'governanca' }),
});

/**
 * Slugs de las páginas legales, aprobados y congelados por Salva el 2026-09-07
 * (§3.1 de PLAN_LEGAL_VANILLA_2026-09-07). Doce más, y el total del sitio pasa
 * a 33.
 *
 * TABLA SEPARADA A PROPÓSITO (DA-LG-6). `VIEW_SLUGS` es el contrato del menú
 * principal —siete vistas, ni una más— y hay pruebas que lo fijan así. Las
 * páginas legales viven en el pie, no en el menú: mezclarlas en la misma tabla
 * habría obligado a relajar ese contrato, que es justo lo que no interesa.
 * Para resolver rutas se usan las dos juntas; para hablar del menú, solo la
 * primera.
 *
 * Cambiar un valor de aquí rompe enlaces ya repartidos: se añade un alias,
 * nunca se sustituye.
 */
export const LEGAL_VIEW_SLUGS = Object.freeze({
  'aviso-legal':   Object.freeze({ es: 'aviso-legal',            en: 'legal-notice',   va: 'avis-legal' }),
  'privacidad':    Object.freeze({ es: 'politica-de-privacidad', en: 'privacy-policy', va: 'politica-de-privacitat' }),
  'cookies':       Object.freeze({ es: 'politica-de-cookies',    en: 'cookie-policy',  va: 'politica-de-cookies' }),
  'accesibilidad': Object.freeze({ es: 'accesibilidad',          en: 'accessibility',  va: 'accessibilitat' }),
});

/**
 * Las 33 rutas del sitio: las siete del menú y las cuatro legales. Es la tabla
 * que se usa para resolver y para construir enlaces, porque una página legal se
 * enlaza igual que cualquier otra.
 */
export const ALL_VIEW_SLUGS = Object.freeze({ ...VIEW_SLUGS, ...LEGAL_VIEW_SLUGS });

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

// Las 33 rutas, no solo las siete del menú: quien abre un enlace a la política
// de privacidad merece la misma resolución que quien abre uno a Sectores.
const INDICE_POR_DEFECTO = construirIndice(ALL_VIEW_SLUGS);

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
  const fuente = tabla || ALL_VIEW_SLUGS;
  if (!Object.prototype.hasOwnProperty.call(fuente, view)) return null;
  if (!LANGS.includes(lang)) return null;

  const slug = fuente[view][lang];
  if (typeof slug !== 'string' || slug === '') return null;

  return `#${lang}/${slug}`;
}

/** Idioma por defecto cuando el visitante no tiene preferencia guardada. */
export const DEFAULT_LANG = 'es';

/** Vista que se abre ante cualquier ruta que no se reconozca (DA-DL-3). */
export const DEFAULT_VIEW = 'inicio';

/**
 * Decide qué vista y qué idioma corresponden al abrir la página.
 *
 * A diferencia de `parseViewRoute`, esta función NUNCA devuelve `null`: su
 * trabajo es decidir, y ante cualquier ruta irreconocible decide Inicio en el
 * idioma que ya tuviera el visitante (DA-DL-3). Es la que fija los contratos 1,
 * 2 y 3 de §4, y por eso vive aquí, donde se puede probar sin navegador.
 *
 * @param {string|null|undefined} hash
 * @param {{storedLang?: string|null}} [opciones] Preferencia guardada del visitante.
 * @param {Record<string, Record<string, string>>} [tabla]
 * @returns {{view: string, lang: string, langFromLink: boolean, recognised: boolean}}
 */
export function resolveInitialRoute(hash, { storedLang } = {}, tabla) {
  const preferido = LANGS.includes(storedLang) ? storedLang : DEFAULT_LANG;
  const ruta = parseViewRoute(hash, tabla);

  // Ruta no reconocida: Inicio, y el idioma NO se toca. Un enlace roto no puede
  // además cambiarle el idioma al visitante (contrato 3).
  if (!ruta) {
    return { view: DEFAULT_VIEW, lang: preferido, langFromLink: false, recognised: false };
  }

  // El idioma del enlace manda sobre la preferencia guardada (DA-DL-6): es justo
  // lo que hace falta cuando el enlace se envía a un tercero.
  if (ruta.lang) {
    return { view: ruta.view, lang: ruta.lang, langFromLink: true, recognised: true };
  }

  // Alias sin idioma: resuelve la vista y deja el idioma como estaba.
  return { view: ruta.view, lang: preferido, langFromLink: false, recognised: true };
}

/**
 * Enlace canónico al que debe apuntar la barra de direcciones tras cambiar de
 * idioma sin moverse de vista (contrato 5).
 *
 * Se devuelve `replace: true` porque cambiar de idioma no es navegar: apilar
 * una entrada obligaría a pulsar "atrás" dos veces para volver a la página
 * anterior.
 *
 * @returns {{hash: string, replace: boolean}|null} `null` si no hay enlace
 *   posible; en ese caso el llamante deja la URL como está.
 */
export function planLanguageSwitch(view, lang, tabla) {
  const hash = formatViewRoute(view, lang, undefined, tabla);
  return hash ? { hash, replace: true } : null;
}

/**
 * Decide si un cambio de hash obliga a repintar, y con qué vista e idioma.
 *
 * Existe por un fallo encontrado en DL-5: editar a mano `#es/sectores` para
 * dejarlo en `#va/sectors` cambia el idioma pero NO la vista. Comparando solo la
 * vista, el cambio se ignoraba y la página se quedaba en español hasta forzar
 * una recarga sin caché. Comparar las dos cosas es lo que lo arregla, y por eso
 * la comparación vive aquí, donde se puede probar, y no dentro del listener.
 *
 * @param {{view: string, lang: string, langFromLink: boolean}} ruta Lo que
 *   devuelve `resolveInitialRoute` para el hash nuevo.
 * @param {{view: string, lang: string}} actual Lo que hay pintado ahora.
 * @returns {{render: boolean, view: string, lang: string, changeLang: boolean}}
 */
export function planHashChange(ruta, actual) {
  // El idioma solo cuenta como cambio si el enlace lo trae. Un alias sin idioma
  // (`#sectores`) no debe arrastrar al visitante a otro idioma (DA-DL-6b).
  const cambiaIdioma = ruta.langFromLink && ruta.lang !== actual.lang;
  const cambiaVista = ruta.view !== actual.view;

  return {
    render: cambiaVista || cambiaIdioma,
    view: ruta.view,
    lang: cambiaIdioma ? ruta.lang : actual.lang,
    changeLang: cambiaIdioma,
  };
}
