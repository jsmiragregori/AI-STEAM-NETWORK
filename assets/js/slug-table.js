// La tabla de slugs que usa el sitio: la del CMS si está sana, la del código si no.
//
// Existe por una restricción deliberada: `utils/view-route.js` es un módulo PURO
// que no importa nada (DA-DL-4), para que su arnés sea `node --test` sin
// navegador ni datos. Alguien tiene que unir ese módulo con el dato generado, y
// ese alguien es este fichero — el **único** sitio del repositorio que lo hace.
//
// Se resuelve una sola vez, al cargar. No hay recarga en caliente: el dato llega
// con la página, y recalcularlo en cada navegación solo añadiría formas de que
// dos partes de la misma sesión usaran tablas distintas.
//
// Si `NAV_CONFIG` llega vacío, a medias o corrupto —`assets/data/` es un montaje
// NFS escrito por el panel, y ya llegó vacío una vez tras un reinicio—, las
// funciones de saneado devuelven la tabla incrustada y el sitio sigue enlazable
// exactamente igual que antes de que existiera el CMS (DA-CS-5).

import { NAV_CONFIG } from '../data/navigation.js';
import { construirTablaEfectiva, construirAliasEfectivos } from './utils/view-route.js';

/** Tabla efectiva de slugs canónicos. Nunca tiene menos vistas que el código. */
export const TABLA_SLUGS = construirTablaEfectiva(NAV_CONFIG);

/** Slugs jubilados que siguen resolviendo, para no romper enlaces repartidos. */
export const ALIAS_SLUGS = construirAliasEfectivos(NAV_CONFIG, TABLA_SLUGS);
