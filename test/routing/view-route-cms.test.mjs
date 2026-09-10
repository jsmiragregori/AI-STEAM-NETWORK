// CS-4 — El router consume los slugs administrados desde el CMS, con fallo cerrado.
//
// Cubre T-R1…T-R5 de `PLAN_DEEPLINK_CMS_2026-09-04.md` §5.3 (el plan vive en
// AI-STEAM-CONTENT; este repo es público y no aloja documentación de trabajo).
//
// **La pieza que estas pruebas protegen.** A partir de aquí los enlaces del
// sitio salen de un dato generado que viaja a `assets/data/`, que en producción
// es un **montaje NFS escrito por el panel**. Ya llegó vacío una vez tras un
// reinicio: ese fue el fallo de julio. Si el enrutado dependiera de que ese
// montaje esté sano, un reinicio desafortunado dejaría el sitio entero sin
// enlaces directos — y sin error, porque `FallbackResource` abre Inicio.
//
// De ahí DA-CS-5, que es lo que casi todas estas pruebas comprueban desde un
// ángulo distinto: **ante cualquier duda, la tabla incrustada**. El dato del CMS
// solo puede mejorar lo que ya funciona; nunca puede quitarlo.
//
// Y DA-CS-4: el CMS aporta el *texto* del slug, nunca **qué vistas existen**. La
// allowlist es del código. Un dato generado corrupto —o un CSV manipulado— no
// puede inventar una vista ni tocar el prototipo.

import assert from 'node:assert/strict';
import test from 'node:test';

import {
  ALL_VIEW_SLUGS,
  construirTablaEfectiva,
  construirAliasEfectivos,
  parseViewRoute,
  formatViewRoute,
} from '../../assets/js/utils/view-route.js';

const TABLA_CMS = {
  slugs: {
    sectores: { es: 'areas-sectoriales', en: 'sector-areas', va: 'arees-sectorials' },
  },
  aliases: [{ id: 'sectores', lang: 'es', slug: 'sectores' }],
};

// --- T-R1: con tabla válida, manda el CMS -----------------------------------

test('T-R1 con una tabla válida, resuelve y genera por los slugs del CMS', () => {
  const tabla = construirTablaEfectiva(TABLA_CMS);
  assert.equal(formatViewRoute('sectores', 'es', undefined, tabla), '#es/areas-sectoriales');
  assert.deepEqual(parseViewRoute('#es/areas-sectoriales', tabla), { view: 'sectores', lang: 'es' });
});

test('T-R1b las vistas que el CMS no trae conservan las del código', () => {
  // Fusión por vista, no todo o nada: un CSV a medias no puede dejar sin enlace
  // a las secciones que sí estaban bien.
  const tabla = construirTablaEfectiva(TABLA_CMS);
  assert.deepEqual(tabla.gobernanza, ALL_VIEW_SLUGS.gobernanza);
  assert.deepEqual(tabla.privacidad, ALL_VIEW_SLUGS.privacidad);
  assert.equal(
    Object.keys(tabla).length, Object.keys(ALL_VIEW_SLUGS).length,
    'nunca menos vistas que las incrustadas',
  );
});

// --- T-R2: fallo cerrado (DA-CS-5) ------------------------------------------

test('T-R2 ante un dato ausente, nulo o corrupto se usa la tabla incrustada', () => {
  for (const entrada of [undefined, null, {}, [], 0, '', 'no', true, { slugs: null },
    { slugs: 'texto' }, { slugs: [] }, { slugs: {} }]) {
    const tabla = construirTablaEfectiva(entrada);
    assert.deepEqual(tabla, ALL_VIEW_SLUGS, `entrada ${JSON.stringify(entrada)}`);
  }
});

test('T-R2b con el dato corrupto, el sitio sigue enlazable exactamente como antes', () => {
  // La garantía que de verdad importa: G8, ningún enlace ya repartido se rompe.
  const tabla = construirTablaEfectiva(null);
  for (const [view, idiomas] of Object.entries(ALL_VIEW_SLUGS)) {
    for (const [lang, slug] of Object.entries(idiomas)) {
      assert.deepEqual(
        parseViewRoute(`#${lang}/${slug}`, tabla), { view, lang },
        `${lang}/${slug} debe seguir resolviendo`,
      );
    }
  }
});

test('T-R2c una vista con un slug inválido cae a la del código, sin arrastrar a las demás', () => {
  const tabla = construirTablaEfectiva({
    slugs: {
      sectores: { es: 'MAYUSCULAS', en: 'sector-areas', va: 'arees-sectorials' },
      formacion: { es: 'capacitacion', en: 'training', va: 'formacio' },
    },
  });
  assert.deepEqual(tabla.sectores, ALL_VIEW_SLUGS.sectores, 'la inválida se descarta entera');
  assert.equal(tabla.formacion.es, 'capacitacion', 'la válida sí se aplica');
});

test('T-R2d una vista a la que le falta un idioma no se aplica a medias', () => {
  const tabla = construirTablaEfectiva({
    slugs: { sectores: { es: 'areas-sectoriales', en: 'sector-areas' } },
  });
  assert.deepEqual(tabla.sectores, ALL_VIEW_SLUGS.sectores);
});

// --- T-R3: el CMS no puede inventar vistas (DA-CS-4) ------------------------

test('T-R3 una vista desconocida se descarta en silencio', () => {
  const tabla = construirTablaEfectiva({
    slugs: { inventada: { es: 'a-b', en: 'a-b', va: 'a-b' } },
  });
  assert.equal('inventada' in tabla, false);
  assert.equal(parseViewRoute('#es/a-b', tabla), null);
});

// --- T-R4: los alias resuelven; el canónico es el que se genera -------------

test('T-R4 un alias jubilado sigue resolviendo, pero no es lo que se genera', () => {
  const tabla = construirTablaEfectiva(TABLA_CMS);
  const alias = construirAliasEfectivos(TABLA_CMS, tabla);

  // El enlace viejo, repartido antes del renombrado, sigue abriendo la sección.
  assert.deepEqual(parseViewRoute('#es/sectores', tabla, alias), { view: 'sectores', lang: 'es' });
  // Y lo que el sitio escribe en la barra es el nuevo.
  assert.equal(formatViewRoute('sectores', 'es', undefined, tabla), '#es/areas-sectoriales');
});

test('T-R4a un alias NUNCA puede secuestrar un enlace vivo', () => {
  // El fallo más grave posible en todo esto: si un alias pudiera pisar un slug
  // canónico, bastaría con jubilar el texto adecuado para que un enlace ya
  // repartido —impreso en un correo institucional— empezara a abrir OTRA
  // sección. Sin error y sin aviso, que es lo peor: se seguiría usando.
  //
  // El validador de CONTENT ya lo impide al guardar (V4), pero esa es la puerta
  // de entrada; esta es la de salida. Un CSV editado a mano, una fusión mal
  // resuelta o un montaje NFS con un fichero antiguo se saltan el panel entero.
  const tabla = construirTablaEfectiva(TABLA_CMS);
  const alias = construirAliasEfectivos({
    aliases: [
      { id: 'formacion', lang: 'es', slug: 'areas-sectoriales' }, // canónico vivo de sectores
      { id: 'gobernanza', lang: 'es', slug: 'politica-de-privacidad' }, // canónico vivo de privacidad
    ],
  }, tabla);

  assert.deepEqual(
    parseViewRoute('#es/areas-sectoriales', tabla, alias), { view: 'sectores', lang: 'es' },
    'el canónico manda sobre cualquier alias',
  );
  assert.deepEqual(
    parseViewRoute('#es/politica-de-privacidad', tabla, alias), { view: 'privacidad', lang: 'es' },
  );
});

test('T-R4b un alias de una vista desconocida se descarta', () => {
  const tabla = construirTablaEfectiva(TABLA_CMS);
  const alias = construirAliasEfectivos(
    { aliases: [{ id: 'inventada', lang: 'es', slug: 'lo-que-sea' }] }, tabla,
  );
  assert.equal(parseViewRoute('#es/lo-que-sea', tabla, alias), null);
});

test('T-R4c alias mal formados no rompen nada', () => {
  const tabla = construirTablaEfectiva(TABLA_CMS);
  for (const entrada of [undefined, null, {}, { aliases: null }, { aliases: 'x' },
    { aliases: [null] }, { aliases: [{ id: 'sectores' }] },
    { aliases: [{ id: 'sectores', lang: 'zz', slug: 'x-y' }] },
    { aliases: [{ id: 'sectores', lang: 'es', slug: 'MAL' }] }]) {
    assert.doesNotThrow(() => construirAliasEfectivos(entrada, tabla));
  }
});

// --- T-R5: contaminación de prototipo ---------------------------------------

test('T-R5 una clave __proto__ en el dato generado no altera Object.prototype', () => {
  // El dato generado es código JS, no JSON: en un objeto literal, `__proto__`
  // como clave SÍ establece el prototipo. Por eso la allowlist del código no es
  // solo higiene de datos, es la contención de esta vía.
  const malicioso = { slugs: {} };
  Object.defineProperty(malicioso.slugs, '__proto__', {
    value: { contaminado: true }, enumerable: true, configurable: true,
  });
  malicioso.slugs.constructor = { es: 'a-b', en: 'a-b', va: 'a-b' };
  malicioso.slugs.prototype = { es: 'c-d', en: 'c-d', va: 'c-d' };

  const tabla = construirTablaEfectiva(malicioso);

  assert.equal({}.contaminado, undefined, 'Object.prototype intacto');
  assert.equal('contaminado' in {}, false);
  assert.equal('constructor' in tabla && tabla.constructor.es === 'a-b', false);
  assert.equal(parseViewRoute('#es/a-b', tabla), null);
  assert.deepEqual(tabla, ALL_VIEW_SLUGS, 'nada de eso llega a la tabla');
});

test('T-R5b un alias que se llama __proto__ tampoco contamina', () => {
  const tabla = construirTablaEfectiva(TABLA_CMS);
  assert.doesNotThrow(() => construirAliasEfectivos(
    { aliases: [{ id: '__proto__', lang: 'es', slug: 'x-y' }] }, tabla,
  ));
  assert.equal({}.contaminado, undefined);
});

// --- pureza ------------------------------------------------------------------

test('construir no muta ni el dato recibido ni la tabla incrustada', () => {
  const antes = structuredClone(ALL_VIEW_SLUGS);
  const entrada = structuredClone(TABLA_CMS);
  construirTablaEfectiva(entrada);
  construirAliasEfectivos(entrada, construirTablaEfectiva(entrada));
  assert.deepEqual(ALL_VIEW_SLUGS, antes, 'la tabla incrustada es intocable');
  assert.deepEqual(entrada, TABLA_CMS, 'no muta lo que recibe');
});
