// S6 — Resumen breve (`summary`) en las tres cards de Vanilla (OER, Plantillas, DOC).
//
// RED primero: este fichero se crea ANTES del producto y NO importa
// `assets/js/utils/resource-summary.js` (todavía no existe). Prueba el render
// real de las vistas con fixtures EN MEMORIA: clona un elemento real con
// structuredClone y sustituye temporalmente su colección con splice (la
// identidad del array se conserva). Nunca escribe en disco.
//
// Un nodo por fila de la matriz P01–P24 (24 nodos); los bucles internos
// recorren colecciones (OER/Plantillas/DOC) e idiomas (ES/EN/VA). Este archivo
// se ejecuta solo, en su propio proceso:
//   node --test --test-isolation=none --test-reporter=tap test/rendering/resource-summary.test.mjs
//
// Los literales de los casos de seguridad (P13–P15) están escritos a mano; no
// se usa `escapeHtml` como oráculo.

import assert from 'node:assert/strict';
import test from 'node:test';

// ── Stubs mínimos de navegador (mismo patrón que knowledge-codigo) ───────────

const almacen = new Map();
let lang = 'es';
let busqueda = '';
globalThis.localStorage = {
  getItem: (k) => (k === 'language' ? lang : (almacen.has(k) ? almacen.get(k) : null)),
  setItem: (k, v) => almacen.set(k, String(v)),
  removeItem: (k) => almacen.delete(k),
};
globalThis.document = {
  documentElement: {},
  getElementById: (id) => (id === 'gov-doc-search' ? { value: busqueda } : null),
  querySelector() { return null; },
  querySelectorAll() { return []; },
};
globalThis.window = { location: { hash: '' }, addEventListener() {}, scrollTo() {} };

const { KNOWLEDGE_CONFIG } = await import('../../assets/data/knowledge.js');
const { GOVERNANCE_CONFIG } = await import('../../assets/data/governance.js');
const { setState } = await import('../../assets/js/state.js');
const vistas = await import('../../assets/js/views/index.js');

// ── Colecciones, fixtures e infraestructura de aislamiento ──────────────────

const COLS = ['oer', 'tpl', 'doc'];
const IDIOMAS = ['es', 'en', 'va'];
const NOMBRE = { oer: 'OER', tpl: 'Plantillas', doc: 'DOC' };
const ROTACION = { es: 'en', en: 'va', va: 'es' };
const CODS = { oer: 'S6T-BASE-OER', tpl: 'S6T-BASE-TPL', doc: 'S6T-BASE-DOC' };
const MARCA = { oer: 'oer-grid', tpl: 'tmpl-grid', doc: 'gov-docs-results' };
const CUERPO_MARCA = {
  oer: '<div class="p-7 pt-5 flex-1 flex flex-col">',
  tpl: '<div class="p-7 pt-5 flex flex-col flex-1">',
  doc: '<div class="p-7 pt-5 flex flex-col justify-between flex-1">',
};
const PIE_MARCA = {
  oer: '<div class="border-t border-eu-purple/10 p-4',
  tpl: '<div class="flex items-center justify-between">',
  doc: '<div class="mt-5 pt-4 border-t border-eu-blue/10">',
};

function coleccion(col) {
  if (col === 'oer') return KNOWLEDGE_CONFIG.oerResourcesBlock.resources;
  if (col === 'tpl') return KNOWLEDGE_CONFIG.templatesBlock.templates;
  return GOVERNANCE_CONFIG.documentationBlock.docs;
}

const ORIG_REF = { oer: coleccion('oer'), tpl: coleccion('tpl'), doc: coleccion('doc') };
const ORIG = { oer: coleccion('oer').slice(), tpl: coleccion('tpl').slice(), doc: coleccion('doc').slice() };
const DOC_ARCHIVO = coleccion('doc').find((d) => d.filePublicPath);
const DOC_URL = coleccion('doc').find((d) => d.url && d.external);

const ctx = (col, idioma, caso) => `${NOMBRE[col]} ${idioma} [${caso}]`;
const tituloDe = (code) => ({ es: `${code} — título ES`, en: `${code} — title EN`, va: `${code} — títol VA` });

/** Fixture en memoria: clon de un elemento real, con código y título inequívocos. */
function fixtureCol(col, campos = {}, baseElegida = null) {
  const base = baseElegida || (col === 'doc' ? DOC_ARCHIVO : coleccion(col)[0]);
  const item = structuredClone(base);
  Object.assign(item, campos);
  item.id = `s6t-${String(item.code).toLowerCase()}`;
  item.visible = true;
  item.title = tituloDe(item.code);
  return item;
}

/** Sustituye la colección real por los fixtures y la restaura al terminar. */
function enclavarCol(col, fixtures, fn) {
  const lista = coleccion(col);
  const respaldo = lista.slice();
  lista.splice(0, lista.length, ...fixtures);
  try {
    return fn();
  } finally {
    lista.splice(0, lista.length, ...respaldo);
  }
}

function pintarCol(col, idioma, code) {
  lang = idioma;
  if (col === 'oer') {
    almacen.delete('oerFilters');
    setState('knowledgeTab', 'oer');
    setState('oerPage', 0);
    setState('knowledgeSearch', code || '');
    return vistas.conocimiento.render();
  }
  if (col === 'tpl') {
    almacen.delete('tmplFilters');
    setState('knowledgeTab', 'plantillas');
    setState('templatesPage', 0);
    setState('templatesSearch', code || '');
    return vistas.conocimiento.render();
  }
  busqueda = code || '';
  setState('governanceTab', 'documentos');
  setState('govDocPage', 0);
  setState('govDocPageSize', null);
  return vistas.gobernanza.render();
}

// ── Extracción por estructura real (mismo patrón que knowledge-codigo) ──────

const seccionDe = (col, html) => {
  const i = html.indexOf(`id="${MARCA[col]}"`);
  assert.ok(i !== -1, `${NOMBRE[col]}: no aparece la sección ${MARCA[col]}`);
  return html.slice(i);
};
const cards = (html) => html.split('<div class="rd-card-mp rd-card-mp-hover').slice(1);
const ceja = (card) => /<div class="rd-card-mp-ceja">([\s\S]*?)<\/div>/.exec(card)?.[1] ?? '';
const parrafos = (card) => [...card.matchAll(/<p\b([^>]*)>([\s\S]*?)<\/p>/g)].map((m) => ({ attrs: m[1], crudo: m[2] }));
const parrafosNoCodigo = (card) => parrafos(card).filter((p) => !/rd-card-mp-code/.test(p.attrs));
const pie = (col, card) => {
  const i = card.indexOf(PIE_MARCA[col]);
  assert.ok(i !== -1, `${NOMBRE[col]}: no se encontró el pie de la tarjeta`);
  return card.slice(i);
};

function tarjetaUnica(col, html, code) {
  const lista = cards(seccionDe(col, html));
  assert.equal(lista.length, 1, `${NOMBRE[col]}: se esperaba exactamente 1 tarjeta de ${code}, hay ${lista.length}`);
  const card = lista[0];
  assert.ok(card.includes(code), `${NOMBRE[col]}: la tarjeta aislada no contiene el código ${code}`);
  return card;
}

/** Con summary presente: exactamente un párrafo (fuera de la ceja) con ese contenido crudo. */
function assertResumen(card, col, idioma, texto, caso) {
  const otros = parrafosNoCodigo(card);
  assert.equal(otros.length, 1, `${ctx(col, idioma, caso)}: se esperaba 1 párrafo de resumen, hay ${otros.length}`);
  assert.equal(otros[0].crudo, texto, `${ctx(col, idioma, caso)}: contenido crudo exacto`);
  return otros[0];
}

/** Base sin summary capturada en P04, por colección e idioma. */
const BASES = { oer: {}, tpl: {}, doc: {} };
function baseDe(col, idioma) {
  const b = BASES[col][idioma];
  assert.ok(b, `${NOMBRE[col]} ${idioma}: falta la base sin summary de P04`);
  return b;
}

const prueba = (nombre, fn) => test(nombre, { concurrency: false }, fn);

// S25 (contrato del checkpoint §8.3): 25 separadores. U+0085, U+001C–U+001F,
// U+180E y U+200B NO son separadores.
const S25 = [
  0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x20, 0xa0, 0x1680,
  0x2000, 0x2001, 0x2002, 0x2003, 0x2004, 0x2005, 0x2006, 0x2007, 0x2008, 0x2009, 0x200a,
  0x2028, 0x2029, 0x202f, 0x205f, 0x3000, 0xfeff,
].map((c) => String.fromCodePoint(c)).join('');
const NO_SEPARADORES = [0x85, 0x1c, 0x1d, 0x1e, 0x1f, 0x180e, 0x200b].map((c) => String.fromCodePoint(c));

const palabras = (n) => Array.from({ length: n }, (_, i) => `p${String(i + 1).padStart(3, '0')}`).join(' ');

// ── P01–P03 · summary completo y distinto por idioma ────────────────────────

prueba('S6-P01 · OER: summary completo muestra solo el idioma activo', () => {
  const code = 'S6T-P01-OER';
  for (const idioma of IDIOMAS) {
    const textos = { es: `${code}-ES`, en: `${code}-EN`, va: `${code}-VA` };
    const f = fixtureCol('oer', { code, summary: { ...textos } });
    enclavarCol('oer', [f], () => {
      const card = tarjetaUnica('oer', pintarCol('oer', idioma, code), code);
      assertResumen(card, 'oer', idioma, textos[idioma], 'P01');
      for (const otro of IDIOMAS.filter((l) => l !== idioma)) {
        assert.ok(!card.includes(textos[otro]), `${ctx('oer', idioma, 'P01')}: no aparece el texto de ${otro}`);
      }
    });
  }
});

prueba('S6-P02 · Plantillas: el único párrafo descriptivo se sustituye, sin legacy ni segundo resumen', () => {
  const code = 'S6T-P02-TPL';
  for (const idioma of IDIOMAS) {
    const textos = { es: `${code}-ES`, en: `${code}-EN`, va: `${code}-VA` };
    const f = fixtureCol('tpl', { code, summary: { ...textos } });
    enclavarCol('tpl', [f], () => {
      const card = tarjetaUnica('tpl', pintarCol('tpl', idioma, code), code);
      assertResumen(card, 'tpl', idioma, textos[idioma], 'P02');
      assert.ok(!card.includes(f.description[idioma]), `${ctx('tpl', idioma, 'P02')}: no queda la descripción legacy`);
    });
  }
});

prueba('S6-P03 · DOC: un párrafo activo antes de chips/fecha y fuera del pie', () => {
  const code = 'S6T-P03-DOC';
  for (const idioma of IDIOMAS) {
    const textos = { es: `${code}-ES`, en: `${code}-EN`, va: `${code}-VA` };
    const f = fixtureCol('doc', { code, summary: { ...textos } });
    enclavarCol('doc', [f], () => {
      const card = tarjetaUnica('doc', pintarCol('doc', idioma, code), code);
      const p = assertResumen(card, 'doc', idioma, textos[idioma], 'P03');
      const marca = `<p${p.attrs}>${p.crudo}</p>`;
      const i = card.indexOf(marca);
      assert.ok(i < card.indexOf('<div class="flex items-start gap-4 mb-4">'), `${ctx('doc', idioma, 'P03')}: antes del bloque icono/fecha`);
      assert.ok(i < card.indexOf('<div class="flex items-center gap-2 flex-wrap">'), `${ctx('doc', idioma, 'P03')}: antes de los chips`);
      assert.ok(!pie('doc', card).includes(textos[idioma]), `${ctx('doc', idioma, 'P03')}: fuera del pie`);
      for (const otro of IDIOMAS.filter((l) => l !== idioma)) {
        assert.ok(!card.includes(textos[otro]), `${ctx('doc', idioma, 'P03')}: no aparece el texto de ${otro}`);
      }
    });
  }
});

// ── P04 · sin summary: OER/DOC sin párrafo; Plantillas con descripción legacy ─

prueba('S6-P04 · Tres: sin summary no hay párrafo nuevo y Plantillas conserva su descripción', () => {
  for (const col of COLS) {
    for (const idioma of IDIOMAS) {
      const code = CODS[col];
      const f = fixtureCol(col, { code });
      enclavarCol(col, [f], () => {
        const card = tarjetaUnica(col, pintarCol(col, idioma, code), code);
        if (col === 'tpl') {
          const otros = parrafosNoCodigo(card);
          assert.equal(otros.length, 1, `${ctx(col, idioma, 'P04')}: exactamente el párrafo de descripción`);
          assert.equal(otros[0].crudo, f.description[idioma], `${ctx(col, idioma, 'P04')}: descripción legacy intacta`);
        } else {
          assert.equal(parrafosNoCodigo(card).length, 0, `${ctx(col, idioma, 'P04')}: sin resumen no hay párrafo`);
        }
        assert.ok(!card.includes('undefined'), `${ctx(col, idioma, 'P04')}: no aparece «undefined»`);
        BASES[col][idioma] = card;
      });
    }
  }
});

// ── P05–P09 · ausencia y formas corruptas ───────────────────────────────────

prueba('S6-P05 · Tres × idioma: null, {}, tres vacíos o solo S25 equivalen a la base sin summary', () => {
  const variantes = [
    ['null', null],
    ['mapa-vacio', {}],
    ['tres-vacios', { es: '', en: '', va: '' }],
    ['solo-separadores-s25', { es: S25, en: S25, va: S25 }],
  ];
  for (const col of COLS) {
    for (const idioma of IDIOMAS) {
      for (const [nombre, valor] of variantes) {
        const f = fixtureCol(col, { code: CODS[col], summary: valor });
        enclavarCol(col, [f], () => {
          const card = tarjetaUnica(col, pintarCol(col, idioma, CODS[col]), CODS[col]);
          assert.equal(card, baseDe(col, idioma), `${ctx(col, idioma, `P05 ${nombre}`)}: mismo HTML que sin resumen`);
        });
      }
    }
  }
});

prueba('S6-P06 · Tres × idioma: mapa con solo otro idioma no toma prestado texto (sin fallback ES)', () => {
  for (const col of COLS) {
    for (const idioma of IDIOMAS) {
      const falta = ROTACION[idioma];
      const texto = `S6P06-${col}-${falta}`;
      const f = fixtureCol(col, { code: CODS[col], summary: { [falta]: texto } });
      enclavarCol(col, [f], () => {
        const card = tarjetaUnica(col, pintarCol(col, idioma, CODS[col]), CODS[col]);
        assert.equal(card, baseDe(col, idioma), `${ctx(col, idioma, 'P06')}: resultado legacy`);
        assert.ok(!card.includes(texto), `${ctx(col, idioma, 'P06')}: no se toma el idioma ausente`);
      });
    }
  }
});

prueba('S6-P07 · Tres × idioma: mapa parcial con el idioma activo válido se muestra; en el ausente, legacy', () => {
  for (const col of COLS) {
    for (const idioma of IDIOMAS) {
      const texto = `S6P07-${col}-${idioma}`;
      const f = fixtureCol(col, { code: CODS[col], summary: { [idioma]: texto } });
      enclavarCol(col, [f], () => {
        const conTexto = tarjetaUnica(col, pintarCol(col, idioma, CODS[col]), CODS[col]);
        assertResumen(conTexto, col, idioma, texto, 'P07 activo');
        const otro = ROTACION[idioma];
        const legacy = tarjetaUnica(col, pintarCol(col, otro, CODS[col]), CODS[col]);
        assert.equal(legacy, baseDe(col, otro), `${ctx(col, otro, 'P07')}: idioma ausente usa la base`);
        assert.ok(!legacy.includes(texto), `${ctx(col, otro, 'P07')}: sin fugas del idioma presente`);
      });
    }
  }
});

prueba('S6-P08 · Tres × idioma: summary escalar o array no se convierte ni lanza', () => {
  const variantes = [
    ['string', 'S6P08-STRING-NO-DEBE-SALIR'],
    ['numero', 42424242],
    ['true', true],
    ['false', false],
    ['array', ['S6P08-ARRAY-NO-DEBE-SALIR']],
  ];
  for (const col of COLS) {
    for (const idioma of IDIOMAS) {
      for (const [nombre, valor] of variantes) {
        const f = fixtureCol(col, { code: CODS[col], summary: valor });
        enclavarCol(col, [f], () => {
          const card = tarjetaUnica(col, pintarCol(col, idioma, CODS[col]), CODS[col]);
          assert.equal(card, baseDe(col, idioma), `${ctx(col, idioma, `P08 ${nombre}`)}: resultado legacy sin conversión`);
          assert.ok(!card.includes('S6P08'), `${ctx(col, idioma, `P08 ${nombre}`)}: el valor no se pinta`);
          assert.ok(!card.includes('42424242'), `${ctx(col, idioma, `P08 ${nombre}`)}: el número no se pinta`);
          assert.ok(!card.includes('[object Object]'), `${ctx(col, idioma, `P08 ${nombre}`)}: sin coerción de objeto`);
          assert.doesNotMatch(card, />\s*(?:undefined|null)\s*</, `${ctx(col, idioma, `P08 ${nombre}`)}: sin undefined/null crudo`);
        });
      }
    }
  }
});

prueba('S6-P09 · Tres × idioma: valor activo inválido da legacy; un mapa completo válido sí renderiza', () => {
  const invalidos = [
    ['null', null],
    ['numero', 99],
    ['true', true],
    ['array', ['x']],
    ['objeto', { es: 'x' }],
  ];
  for (const col of COLS) {
    for (const idioma of IDIOMAS) {
      for (const [nombre, valor] of invalidos) {
        const mapa = { es: 'S6P09-OTRO-ES', en: 'S6P09-OTRO-EN', va: 'S6P09-OTRO-VA', [idioma]: valor };
        const f = fixtureCol(col, { code: CODS[col], summary: mapa });
        enclavarCol(col, [f], () => {
          const card = tarjetaUnica(col, pintarCol(col, idioma, CODS[col]), CODS[col]);
          assert.equal(card, baseDe(col, idioma), `${ctx(col, idioma, `P09 ${nombre}`)}: mismo resultado legacy`);
          assert.ok(!card.includes('S6P09'), `${ctx(col, idioma, `P09 ${nombre}`)}: ningún otro idioma se cuela`);
        });
      }
      const control = { es: 'S6P09-CTRL-ES', en: 'S6P09-CTRL-EN', va: 'S6P09-CTRL-VA' };
      const f = fixtureCol(col, { code: CODS[col], summary: control });
      enclavarCol(col, [f], () => {
        const card = tarjetaUnica(col, pintarCol(col, idioma, CODS[col]), CODS[col]);
        assertResumen(card, col, idioma, control[idioma], 'P09 control válido');
      });
    }
  }
});

// ── P10 · herencia, propiedad propia e idioma desconocido ───────────────────

prueba('S6-P10 · Tres: propiedad heredada no se lee; propia sí; idioma desconocido no selecciona', () => {
  for (const col of COLS) {
    const code = `S6T-P10-${col}`;
    const basesPropias = {};
    for (const idioma of IDIOMAS) {
      const fBase = fixtureCol(col, { code });
      basesPropias[idioma] = enclavarCol(col, [fBase], () =>
        tarjetaUnica(col, pintarCol(col, idioma, code), code));
    }
    const mapa = Object.create({ es: 'S6P10-HEREDADO-ES' });
    mapa.en = 'S6P10-PROPIO-EN';
    const f = fixtureCol(col, { code, summary: mapa });
    enclavarCol(col, [f], () => {
      const cardEs = tarjetaUnica(col, pintarCol(col, 'es', code), code);
      assert.equal(cardEs, basesPropias.es, `${ctx(col, 'es', 'P10')}: la propiedad heredada no se lee`);
      assert.ok(!cardEs.includes('S6P10-HEREDADO-ES'), `${ctx(col, 'es', 'P10')}: sin texto heredado`);
      const cardEn = tarjetaUnica(col, pintarCol(col, 'en', code), code);
      assertResumen(cardEn, col, 'en', 'S6P10-PROPIO-EN', 'P10 propia');
    });
    const fFr = fixtureCol(col, { code, summary: { es: 'S6P10-FR-ES', en: 'S6P10-FR-EN' } });
    enclavarCol(col, [fFr], () => {
      const card = tarjetaUnica(col, pintarCol(col, 'fr', code), code);
      if (col === 'tpl') {
        const otros = parrafosNoCodigo(card);
        assert.equal(otros.length, 1, `${ctx(col, 'fr', 'P10')}: Plantillas conserva su párrafo legacy`);
        assert.equal(otros[0].crudo, fFr.description.es, `${ctx(col, 'fr', 'P10')}: descripción con fallback legacy ES`);
      } else {
        assert.equal(parrafosNoCodigo(card).length, 0, `${ctx(col, 'fr', 'P10')}: idioma fr no selecciona resumen`);
      }
      assert.ok(!card.includes('S6P10-FR-'), `${ctx(col, 'fr', 'P10')}: ni ES ni fr del mapa se seleccionan`);
    });
    lang = 'es';
  }
});

// ── P11–P12 · separadores y texto crudo ─────────────────────────────────────

prueba('S6-P11 · Tres × idioma: S25 es vacío; NEL y los otros seis no-separadores se conservan', () => {
  assert.equal([...S25].length, 25, 'S25 debe tener 25 separadores');
  assert.equal(NO_SEPARADORES.length, 7, 'la lista de no-separadores debe tener 7 caracteres');
  for (const col of COLS) {
    for (const idioma of IDIOMAS) {
      const f = fixtureCol(col, { code: CODS[col], summary: { [idioma]: S25 } });
      enclavarCol(col, [f], () => {
        const card = tarjetaUnica(col, pintarCol(col, idioma, CODS[col]), CODS[col]);
        assert.equal(card, baseDe(col, idioma), `${ctx(col, idioma, 'P11 S25 combinado')}: vacío como la base`);
        for (const ch of [...S25]) {
          const punto = `U+${ch.codePointAt(0).toString(16).toUpperCase().padStart(4, '0')}`;
          f.summary = { [idioma]: ch };
          const cardSep = tarjetaUnica(col, pintarCol(col, idioma, CODS[col]), CODS[col]);
          assert.equal(cardSep, baseDe(col, idioma), `${ctx(col, idioma, `P11 separador ${punto}`)}: vacío`);
        }
        f.summary = { [idioma]: S25 };
        for (const ch of NO_SEPARADORES) {
          const punto = `U+${ch.codePointAt(0).toString(16).toUpperCase().padStart(4, '0')}`;
          f.summary = { [idioma]: ch };
          const cardNo = tarjetaUnica(col, pintarCol(col, idioma, CODS[col]), CODS[col]);
          assertResumen(cardNo, col, idioma, ch, `P11 no-separador ${punto}`);
        }
      });
    }
  }
});

prueba('S6-P12 · Tres × idioma: el texto crudo se preserva entero (sin trim del valor ni Markdown)', () => {
  const T12 = '  Hola\tmundo\u0085fin\nsegunda línea "comillas" \'apóstrofos\' \u00A0espacio\u2028final **negrita** [enlace](https://ejemplo.example)  ';
  const T12_ESCAPADO = '  Hola\tmundo\u0085fin\nsegunda línea &quot;comillas&quot; &#39;apóstrofos&#39; \u00A0espacio\u2028final **negrita** [enlace](https://ejemplo.example)  ';
  for (const col of COLS) {
    for (const idioma of IDIOMAS) {
      const f = fixtureCol(col, { code: CODS[col], summary: { [idioma]: T12 } });
      enclavarCol(col, [f], () => {
        const card = tarjetaUnica(col, pintarCol(col, idioma, CODS[col]), CODS[col]);
        assertResumen(card, col, idioma, T12_ESCAPADO, 'P12');
        assert.ok(card.includes('**negrita**'), `${ctx(col, idioma, 'P12')}: el Markdown queda literal`);
        assert.ok(card.includes('[enlace](https://ejemplo.example)'), `${ctx(col, idioma, 'P12')}: el enlace no se genera`);
      });
    }
  }
});

// ── P13–P15 · seguridad de render ───────────────────────────────────────────

prueba('S6-P13 · Tres × idioma: <script> queda como texto y no se ejecuta', () => {
  const PAYLOAD = '<script>globalThis.__s6=1</script>';
  const ESCAPADO = '&lt;script&gt;globalThis.__s6=1&lt;/script&gt;';
  for (const col of COLS) {
    for (const idioma of IDIOMAS) {
      const f = fixtureCol(col, { code: CODS[col], summary: { [idioma]: PAYLOAD } });
      enclavarCol(col, [f], () => {
        const card = tarjetaUnica(col, pintarCol(col, idioma, CODS[col]), CODS[col]);
        assertResumen(card, col, idioma, ESCAPADO, 'P13');
        assert.ok(!/<script/i.test(card), `${ctx(col, idioma, 'P13')}: ningún tag script en la tarjeta`);
        assert.ok(!card.includes('</script>'), `${ctx(col, idioma, 'P13')}: ningún cierre de script`);
      });
    }
  }
  assert.equal(globalThis.__s6, undefined, 'P13: el payload no se ejecuta en Node');
});

prueba('S6-P14 · Tres × idioma: comillas y ángulos se escapan y no aparece img ni onerror', () => {
  const PAYLOAD = `"><img src=x onerror="boom()"> & 'fin'`;
  const ESCAPADO = '&quot;&gt;&lt;img src=x onerror=&quot;boom()&quot;&gt; &amp; &#39;fin&#39;';
  for (const col of COLS) {
    for (const idioma of IDIOMAS) {
      const f = fixtureCol(col, { code: CODS[col], summary: { [idioma]: PAYLOAD } });
      enclavarCol(col, [f], () => {
        const card = tarjetaUnica(col, pintarCol(col, idioma, CODS[col]), CODS[col]);
        assertResumen(card, col, idioma, ESCAPADO, 'P14');
        assert.ok(!card.includes('<img'), `${ctx(col, idioma, 'P14')}: sin img`);
        assert.ok(!card.includes('onerror="'), `${ctx(col, idioma, 'P14')}: sin atributo onerror ejecutable`);
      });
    }
  }
});

prueba('S6-P15 · Tres × idioma: entidades y marcado se escapan una vez, sin b/a nuevas', () => {
  const TEXTO = '&lt;b&gt; y <b>literal</b> y [enlace](https://x.example) y **fuerte**';
  const ESCAPADO = '&amp;lt;b&amp;gt; y &lt;b&gt;literal&lt;/b&gt; y [enlace](https://x.example) y **fuerte**';
  for (const col of COLS) {
    for (const idioma of IDIOMAS) {
      const code = `S6T-P15-${col}`;
      const fBase = fixtureCol(col, { code });
      const baseCard = enclavarCol(col, [fBase], () => tarjetaUnica(col, pintarCol(col, idioma, code), code));
      const f = fixtureCol(col, { code, summary: { [idioma]: TEXTO } });
      enclavarCol(col, [f], () => {
        const card = tarjetaUnica(col, pintarCol(col, idioma, code), code);
        assertResumen(card, col, idioma, ESCAPADO, 'P15');
        assert.ok(!card.includes('&amp;amp;'), `${ctx(col, idioma, 'P15')}: no se escapa dos veces`);
        assert.ok(!/<b[\s>]/.test(card), `${ctx(col, idioma, 'P15')}: sin etiquetas b nuevas`);
        const anclas = (html) => (html.match(/<a\b/g) || []).length;
        assert.equal(anclas(card), anclas(baseCard), `${ctx(col, idioma, 'P15')}: sin enlaces nuevos`);
      });
    }
  }
});

// ── P16–P18 · límites, repintado y fallback de Plantillas ───────────────────

prueba('S6-P16 · Tres × idioma: 100 y 101 palabras íntegras, sin line-clamp nuevo en el resumen', () => {
  const TXT100 = palabras(100);
  const TXT101 = palabras(101);
  for (const col of COLS) {
    for (const idioma of IDIOMAS) {
      const f = fixtureCol(col, { code: CODS[col], summary: { [idioma]: TXT100 } });
      enclavarCol(col, [f], () => {
        const card = tarjetaUnica(col, pintarCol(col, idioma, CODS[col]), CODS[col]);
        const p = assertResumen(card, col, idioma, TXT100, 'P16 100 palabras');
        assert.ok(!/line-clamp/.test(p.attrs), `${ctx(col, idioma, 'P16')}: sin line-clamp en el resumen`);
        assert.ok(!/style\s*=/.test(p.attrs), `${ctx(col, idioma, 'P16')}: sin altura fija inline`);
        assert.ok(!/truncate|ellipsis/.test(p.attrs), `${ctx(col, idioma, 'P16')}: sin truncado`);
        f.summary = { [idioma]: TXT101 };
        const card101 = tarjetaUnica(col, pintarCol(col, idioma, CODS[col]), CODS[col]);
        assertResumen(card101, col, idioma, TXT101, 'P16 101 palabras');
        if (col === 'oer') {
          assert.ok(ceja(card101).includes('line-clamp-3'), `${ctx(col, idioma, 'P16')}: el clamp del título es el legacy`);
        }
      });
    }
  }
});

prueba('S6-P17 · Tres: secuencia ES→EN→VA→ES sin reiniciar y sin mutar el mapa', () => {
  for (const col of COLS) {
    const code = `S6T-P17-${col}`;
    const textos = { es: `S6P17-${col}-ES`, en: `S6P17-${col}-EN`, va: `S6P17-${col}-VA` };
    const mapa = { ...textos };
    const antes = structuredClone(mapa);
    const f = fixtureCol(col, { code, summary: mapa });
    enclavarCol(col, [f], () => {
      for (const idioma of ['es', 'en', 'va', 'es']) {
        const card = tarjetaUnica(col, pintarCol(col, idioma, code), code);
        assertResumen(card, col, idioma, textos[idioma], `P17 ${idioma}`);
      }
      assert.deepStrictEqual(mapa, antes, `${ctx(col, 'es', 'P17')}: el mapa original no se muta`);
      assert.equal(f.summary, mapa, `${ctx(col, 'es', 'P17')}: la referencia del mapa se conserva`);
    });
  }
});

prueba('S6-P18 · Plantillas: summary solo ES no ocupa EN/VA; description conserva su fallback ES', () => {
  const code = 'S6T-P18-TPL';
  const f = fixtureCol('tpl', { code, summary: { es: 'S6P18-SOLO-ES' } });
  enclavarCol('tpl', [f], () => {
    for (const idioma of ['en', 'va']) {
      const card = tarjetaUnica('tpl', pintarCol('tpl', idioma, code), code);
      const otros = parrafosNoCodigo(card);
      assert.equal(otros.length, 1, `${ctx('tpl', idioma, 'P18')}: un único párrafo`);
      assert.equal(otros[0].crudo, f.description[idioma], `${ctx('tpl', idioma, 'P18')}: descripción EN/VA legacy`);
      assert.ok(!card.includes('S6P18-SOLO-ES'), `${ctx('tpl', idioma, 'P18')}: el summary ES no ocupa ${idioma}`);
    }
    delete f.description.en;
    const cardEn = tarjetaUnica('tpl', pintarCol('tpl', 'en', code), code);
    const otros = parrafosNoCodigo(cardEn);
    assert.equal(otros[0].crudo, f.description.es, `${ctx('tpl', 'en', 'P18')}: fallback legacy ES de description`);
    assert.ok(!cardEn.includes('S6P18-SOLO-ES'), `${ctx('tpl', 'en', 'P18')}: el summary no sustituye el fallback`);
  });
});

// ── P19–P21 · estructura, pie y búsqueda ────────────────────────────────────

prueba('S6-P19 · Tres × idioma: ceja estable con código encima del título; resumen en el cuerpo', () => {
  for (const col of COLS) {
    for (const idioma of IDIOMAS) {
      const code = CODS[col];
      const textos = { es: 'S6P19-ES', en: 'S6P19-EN', va: 'S6P19-VA' };
      const f = fixtureCol(col, { code, summary: { ...textos } });
      enclavarCol(col, [f], () => {
        const card = tarjetaUnica(col, pintarCol(col, idioma, code), code);
        const p = assertResumen(card, col, idioma, textos[idioma], 'P19');
        const c = ceja(card);
        assert.equal(c, ceja(baseDe(col, idioma)), `${ctx(col, idioma, 'P19')}: la ceja no cambia`);
        const titulo = tituloDe(code)[idioma];
        assert.ok(c.includes(code), `${ctx(col, idioma, 'P19')}: el código sigue en la ceja`);
        assert.ok(c.includes(titulo), `${ctx(col, idioma, 'P19')}: el título sigue en la ceja`);
        assert.ok(c.indexOf(code) < c.indexOf(titulo), `${ctx(col, idioma, 'P19')}: código encima del título`);
        const marca = `<p${p.attrs}>${p.crudo}</p>`;
        const i = card.indexOf(marca);
        assert.ok(i > card.indexOf(CUERPO_MARCA[col]), `${ctx(col, idioma, 'P19')}: el resumen está en el cuerpo`);
        assert.ok(i < card.indexOf(PIE_MARCA[col]), `${ctx(col, idioma, 'P19')}: antes del pie`);
        assert.ok(!c.includes(textos[idioma]), `${ctx(col, idioma, 'P19')}: resumen fuera de la ceja`);
        assert.ok(!pie(col, card).includes(textos[idioma]), `${ctx(col, idioma, 'P19')}: resumen fuera del pie`);
      });
    }
  }
});

prueba('S6-P20 · Tres × idioma: chips, fechas, licencia y pie idénticos a la base sin summary', () => {
  for (const col of COLS) {
    for (const idioma of IDIOMAS) {
      const code = CODS[col];
      const texto = `S6P20-${col}-${idioma}`;
      const fBase = fixtureCol(col, { code });
      const baseCard = enclavarCol(col, [fBase], () => tarjetaUnica(col, pintarCol(col, idioma, code), code));
      const f = fixtureCol(col, { code, summary: { [idioma]: texto } });
      enclavarCol(col, [f], () => {
        const card = tarjetaUnica(col, pintarCol(col, idioma, code), code);
        const p = assertResumen(card, col, idioma, texto, 'P20');
        assert.equal(ceja(card), ceja(baseCard), `${ctx(col, idioma, 'P20')}: ceja idéntica`);
        assert.equal(pie(col, card), pie(col, baseCard), `${ctx(col, idioma, 'P20')}: pie idéntico`);
        if (col === 'tpl') {
          const pBase = assertResumen(baseCard, col, idioma, fBase.description[idioma], 'P20-base');
          const attrsEsperados = pBase.attrs.replace('leading-relaxed"', 'leading-relaxed wrap-anywhere"');
          assert.notEqual(attrsEsperados, pBase.attrs, `${ctx(col, idioma, 'P20')}: ancla de clase legacy encontrada`);
          assert.equal(p.attrs, attrsEsperados, `${ctx(col, idioma, 'P20')}: solo se añade wrap-anywhere al párrafo`);
          const marca = `<p${p.attrs}>${p.crudo}</p>`;
          const marcaBase = `<p${pBase.attrs}>${pBase.crudo}</p>`;
          const i = card.indexOf(marca);
          assert.ok(i !== -1, `${ctx(col, idioma, 'P20')}: párrafo exacto encontrado`);
          const normalizado = card.slice(0, i) + marcaBase + card.slice(i + marca.length);
          assert.equal(normalizado, baseCard, `${ctx(col, idioma, 'P20')}: solo cambian texto y clase autorizada del párrafo`);
        } else {
          const marca = `<p${p.attrs}>${p.crudo}</p>`;
          const i = card.indexOf(marca);
          const recortado = card.slice(0, i) + card.slice(i + marca.length);
          assert.equal(recortado, baseCard, `${ctx(col, idioma, 'P20')}: solo se añade el párrafo del resumen`);
        }
      });
    }
  }
});

prueba('S6-P21 · OER/Plantillas: acción, filtros y búsqueda iguales; el resumen no entra en el buscador', () => {
  for (const col of ['oer', 'tpl']) {
    for (const idioma of IDIOMAS) {
      const code = `S6T-P21-${col}`;
      const token = `S6P21-TOKEN-${col}`;
      const fBase = fixtureCol(col, { code });
      const baseCard = enclavarCol(col, [fBase], () => tarjetaUnica(col, pintarCol(col, idioma, code), code));
      const f = fixtureCol(col, { code, summary: { [idioma]: token } });
      enclavarCol(col, [f], () => {
        const card = tarjetaUnica(col, pintarCol(col, idioma, code), code);
        assertResumen(card, col, idioma, token, 'P21');
        assert.equal(pie(col, card), pie(col, baseCard), `${ctx(col, idioma, 'P21')}: el pie de acción no cambia`);
        assert.ok(pie(col, card).includes(`href="${f.url}"`), `${ctx(col, idioma, 'P21')}: URL de acción conservada`);
        if (col === 'tpl') {
          assert.ok(pie(col, card).includes('target="_blank" rel="noopener noreferrer"'), `${ctx(col, idioma, 'P21')}: target/rel conservados`);
        }
        const datasets = (html, colPropia) => {
          const re = colPropia === 'oer'
            ? /data-filter-(?:type|sector|level|status)="([^"]*)"/g
            : /data-tmpl-filter-(?:type|route)="([^"]*)"/g;
          return [...html.matchAll(re)].map((m) => m[1]);
        };
        assert.deepEqual(datasets(card, col), datasets(baseCard, col), `${ctx(col, idioma, 'P21')}: atributos de filtro iguales`);
        const htmlToken = pintarCol(col, idioma, token);
        assert.equal(cards(seccionDe(col, htmlToken)).length, 0, `${ctx(col, idioma, 'P21')}: el token del resumen no encuentra tarjeta`);
        assert.ok(htmlToken.includes('text-center'), `${ctx(col, idioma, 'P21')}: aparece el estado vacío, no una rejilla muda`);
        const htmlAjeno = pintarCol(col, idioma, 'S6T-CODIGO-AJENO-XYZ');
        assert.equal(cards(seccionDe(col, htmlAjeno)).length, 0, `${ctx(col, idioma, 'P21')}: un código ajeno no encuentra tarjeta`);
      });
    }
  }
});

// ── P22 · DOC: acción y accesos ─────────────────────────────────────────────

prueba('S6-P22 · DOC: archivo con download, URL con target/rel y badges public/partners', () => {
  assert.ok(DOC_ARCHIVO && DOC_URL, 'P22: la base real necesita un documento con archivo y otro con URL externa');
  const fArchivo = fixtureCol('doc', { code: 'S6T-P22-ARCHIVO', access: 'partners' });
  const fUrl = fixtureCol('doc', { code: 'S6T-P22-URL' }, DOC_URL);
  assert.equal(fArchivo.access, 'partners');
  assert.equal(fUrl.access, 'public');
  enclavarCol('doc', [fArchivo, fUrl], () => {
    const cardA = tarjetaUnica('doc', pintarCol('doc', 'es', 'S6T-P22-ARCHIVO'), 'S6T-P22-ARCHIVO');
    assert.ok(cardA.includes(`href="${fArchivo.filePublicPath}" download`), 'P22: el archivo local sigue siendo descarga directa');
    assert.ok(cardA.includes('data-lucide="lock"'), 'P22: partners muestra su candado (no es oculto)');
    assert.ok(!cardA.includes('target="_blank"'), 'P22: la descarga local no abre pestaña');
    const cardB = tarjetaUnica('doc', pintarCol('doc', 'es', 'S6T-P22-URL'), 'S6T-P22-URL');
    assert.ok(cardB.includes(`href="${fUrl.url}"`), 'P22: la URL externa se conserva');
    assert.ok(cardB.includes('target="_blank" rel="noopener noreferrer"'), 'P22: target/rel externos conservados');
    assert.ok(cardB.includes('data-lucide="globe"'), 'P22: público muestra su globo');
    assert.ok(!/download/.test(cardB.slice(cardB.indexOf('<div class="mt-5 pt-4 border-t'))), 'P22: el documento por URL no es una descarga');
  });
});

// ── P23–P24 · convivencia y vaciado ─────────────────────────────────────────

prueba('S6-P23 · Tres: fichas consecutivas con resúmenes distintos y una legacy, sin fugas', () => {
  for (const col of COLS) {
    const codeA = `S6T-P23-${col}-A`;
    const codeB = `S6T-P23-${col}-B`;
    const codeC = `S6T-P23-${col}-C`;
    const tA = `S6P23-${col}-ALFA`;
    const tB = `S6P23-${col}-BETA`;
    const fA = fixtureCol(col, { code: codeA, summary: { es: tA } });
    const fB = fixtureCol(col, { code: codeB, summary: { es: tB } });
    const fC = fixtureCol(col, { code: codeC });
    enclavarCol(col, [fA, fB, fC], () => {
      const cardA = tarjetaUnica(col, pintarCol(col, 'es', codeA), codeA);
      assertResumen(cardA, col, 'es', tA, 'P23 A');
      assert.ok(!cardA.includes(tB), `${ctx(col, 'es', 'P23 A')}: sin fugas de B`);
      const cardB = tarjetaUnica(col, pintarCol(col, 'es', codeB), codeB);
      assertResumen(cardB, col, 'es', tB, 'P23 B');
      assert.ok(!cardB.includes(tA), `${ctx(col, 'es', 'P23 B')}: sin fugas de A`);
      const cardC = tarjetaUnica(col, pintarCol(col, 'es', codeC), codeC);
      if (col === 'tpl') {
        const otros = parrafosNoCodigo(cardC);
        assert.equal(otros.length, 1, `${ctx(col, 'es', 'P23 C')}: la ficha legacy conserva su descripción`);
        assert.equal(otros[0].crudo, fC.description.es, `${ctx(col, 'es', 'P23 C')}: descripción legacy exacta`);
      } else {
        assert.equal(parrafosNoCodigo(cardC).length, 0, `${ctx(col, 'es', 'P23 C')}: la ficha legacy no gana párrafo`);
      }
      assert.ok(!cardC.includes(tA) && !cardC.includes(tB), `${ctx(col, 'es', 'P23 C')}: sin fugas de A/B`);
    });
  }
});

prueba('S6-P24 · Tres: quitar o vaciar el summary vuelve al HTML legacy, sin residuo ni daño global', () => {
  for (const col of COLS) {
    const code = `S6T-P24-${col}`;
    const fBase = fixtureCol(col, { code });
    const baseCard = enclavarCol(col, [fBase], () =>
      tarjetaUnica(col, pintarCol(col, 'es', code), code));
    const f = fixtureCol(col, { code, summary: { es: 'S6P24-ES', en: 'S6P24-EN', va: 'S6P24-VA' } });
    enclavarCol(col, [f], () => {
      const cardCon = tarjetaUnica(col, pintarCol(col, 'es', code), code);
      assertResumen(cardCon, col, 'es', 'S6P24-ES', 'P24 mostrado');
      delete f.summary;
      assert.equal(tarjetaUnica(col, pintarCol(col, 'es', code), code), baseCard, `${ctx(col, 'es', 'P24 sin summary')}: legacy exacto`);
      f.summary = {};
      assert.equal(tarjetaUnica(col, pintarCol(col, 'es', code), code), baseCard, `${ctx(col, 'es', 'P24 mapa vacío')}: legacy exacto`);
      f.summary = { es: '', en: '', va: '' };
      const cardVacio = tarjetaUnica(col, pintarCol(col, 'es', code), code);
      assert.equal(cardVacio, baseCard, `${ctx(col, 'es', 'P24 tres vacíos')}: legacy exacto`);
      assert.equal(parrafosNoCodigo(cardVacio).length, col === 'tpl' ? 1 : 0, `${ctx(col, 'es', 'P24')}: sin párrafo residual`);
    });
  }
  // Integridad global: colecciones restauradas y CONFIG sin fixtures tras toda la matriz.
  for (const col of COLS) {
    assert.equal(coleccion(col), ORIG_REF[col], `${NOMBRE[col]}: la identidad del array se conserva`);
    assert.deepStrictEqual(coleccion(col), ORIG[col], `${NOMBRE[col]}: colección restaurada byte a byte (en memoria)`);
    assert.ok(!coleccion(col).some((it) => String(it.code || '').startsWith('S6T-')), `${NOMBRE[col]}: sin fixtures residuales`);
  }
});

// ════════════════════════════════════════════════════════════════════════════
// S7-R1 · W01–W03 — el párrafo del resumen debe poder envolver (clase de corte)
// sin alterar texto, conteo ni legacy. Se añaden AL FINAL y no modifican los 24
// nodos anteriores (S6). Estos tres nodos se escriben ANTES del producto de R1:
// su rojo funcional esperado es «falta la clase de corte en el párrafo».
// ════════════════════════════════════════════════════════════════════════════

const CLASE_CORTE = 'wrap-anywhere';
const TOKEN_NEL = 'nel\u0085interior';

/** NBSP100: 99 tokens pal01…pal99 + 1 token con NEL dentro, unidos con U+00A0. */
const textoNBSP100 = () =>
  [...Array.from({ length: 99 }, (_, i) => `pal${String(i + 1).padStart(2, '0')}`), TOKEN_NEL].join('\u00a0');

/** Normal100: 100 tokens con espacio ordinario e idioma identificado. */
const textoNormal100 = (idioma) =>
  Array.from({ length: 100 }, (_, i) => `S7R1-${idioma}-n${String(i + 1).padStart(3, '0')}`).join(' ');

/** Largo100: primer token `S7R1-<idioma>-` + 512 X, más 99 tokens normales. */
const textoLargo100 = (idioma) =>
  [`S7R1-${idioma}-${'X'.repeat(512)}`,
   ...Array.from({ length: 99 }, (_, i) => `S7R1-${idioma}-w${String(i + 1).padStart(3, '0')}`)].join(' ');

const CASOS_R1 = [
  ['NBSP100', (idioma) => textoNBSP100()],
  ['Normal100', (idioma) => textoNormal100(idioma)],
  ['Largo100', (idioma) => textoLargo100(idioma)],
];

const attrsTitulo = (card) => /<h3 class="([^"]*)"/.exec(card)?.[1] ?? '';
const cuentaClase = (attrs) => (attrs.match(new RegExp(CLASE_CORTE, 'g')) || []).length;

/** Summary completo y distinto por idioma: el activo lleva el texto del caso. */
function mapaR1(idioma, texto, caso) {
  const mapa = {};
  for (const otro of IDIOMAS) mapa[otro] = `S7R1-${otro}-${caso}-otro-idioma`;
  mapa[idioma] = texto;
  return mapa;
}

function assertClaseCorte(card, col, idioma, caso, p) {
  assert.equal(cuentaClase(p.attrs), 1,
    `${ctx(col, idioma, caso)}: el párrafo del resumen debe llevar «${CLASE_CORTE}» exactamente una vez (attrs:${p.attrs})`);
  assert.ok(!attrsTitulo(card).includes(CLASE_CORTE), `${ctx(col, idioma, caso)}: el título no lleva la clase de corte`);
  assert.ok(!pie(col, card).includes(CLASE_CORTE), `${ctx(col, idioma, caso)}: el pie no lleva la clase de corte`);
  assert.ok(!ceja(card).includes(CLASE_CORTE), `${ctx(col, idioma, caso)}: la ceja no lleva la clase de corte`);
}

prueba('S7-R1-W01 · OER: 3 textos límite por idioma, contenido exacto y clase de corte solo en el resumen', () => {
  const col = 'oer';
  for (const idioma of IDIOMAS) {
    for (const [caso, construir] of CASOS_R1) {
      const code = `S7R1-W01-${idioma}-${caso}`;
      const texto = construir(idioma);
      const f = fixtureCol(col, { code, summary: mapaR1(idioma, texto, caso) });
      let p;
      const card = enclavarCol(col, [f], () => {
        const c = tarjetaUnica(col, pintarCol(col, idioma, code), code);
        p = assertResumen(c, col, idioma, texto, `W01 ${caso}`);
        return c;
      });
      assert.ok(ceja(card).includes(code), `${ctx(col, idioma, `W01 ${caso}`)}: código conservado en la ceja`);
      assertClaseCorte(card, col, idioma, `W01 ${caso}`, p);
    }
    const codeS = `S7R1-W01-${idioma}-sin-summary`;
    const fs = fixtureCol(col, { code: codeS });
    enclavarCol(col, [fs], () => {
      const card = tarjetaUnica(col, pintarCol(col, idioma, codeS), codeS);
      assert.equal(parrafosNoCodigo(card).length, 0, `${ctx(col, idioma, 'W01 sin summary')}: sin párrafo ni wrapper`);
      assert.ok(!card.includes(CLASE_CORTE), `${ctx(col, idioma, 'W01 sin summary')}: sin clase de corte`);
    });
  }
});

prueba('S7-R1-W02 · Plantillas: resumen con corte, y legacy (vacío/sin idioma/ausente) sin clase nueva', () => {
  const col = 'tpl';
  for (const idioma of IDIOMAS) {
    for (const [caso, construir] of CASOS_R1) {
      const code = `S7R1-W02-${idioma}-${caso}`;
      const texto = construir(idioma);
      const f = fixtureCol(col, { code, summary: mapaR1(idioma, texto, caso) });
      let p;
      const card = enclavarCol(col, [f], () => {
        const c = tarjetaUnica(col, pintarCol(col, idioma, code), code);
        p = assertResumen(c, col, idioma, texto, `W02 ${caso}`);
        return c;
      });
      assert.ok(ceja(card).includes(code), `${ctx(col, idioma, `W02 ${caso}`)}: código conservado en la ceja`);
      assertClaseCorte(card, col, idioma, `W02 ${caso}`, p);
    }
  }
  // Variantes legacy: el párrafo vuelve a la descripción, con sus clases y sin clase de corte.
  for (const idioma of IDIOMAS) {
    const codeBase = `S7R1-W02-${idioma}-base`;
    const fBase = fixtureCol(col, { code: codeBase });
    const baseCard = enclavarCol(col, [fBase], () =>
      tarjetaUnica(col, pintarCol(col, idioma, codeBase), codeBase));
    const variantes = [
      ['activo-vacio', { ...mapaR1(idioma, 'x', 'base'), [idioma]: '' }],
      ['sin-idioma-activo', (() => { const m = mapaR1(idioma, 'x', 'base'); delete m[idioma]; return m; })()],
      ['ausencia-completa', null],
    ];
    for (const [nombre, summary] of variantes) {
      const code = `S7R1-W02-${idioma}-${nombre}`;
      const f = fixtureCol(col, { code });
      if (summary !== null) f.summary = summary;
      enclavarCol(col, [f], () => {
        const card = tarjetaUnica(col, pintarCol(col, idioma, code), code);
        const otros = parrafosNoCodigo(card);
        assert.equal(otros.length, 1, `${ctx(col, idioma, `W02 ${nombre}`)}: exactamente el párrafo legacy`);
        assert.equal(otros[0].crudo, f.description[idioma], `${ctx(col, idioma, `W02 ${nombre}`)}: descripción legacy exacta`);
        assert.ok(!otros[0].attrs.includes(CLASE_CORTE), `${ctx(col, idioma, `W02 ${nombre}`)}: la descripción legacy no lleva la clase de corte`);
        // estructuralmente igual a la base sin summary salvo código/id: compara el párrafo y el pie
        assert.equal(parrafosNoCodigo(baseCard)[0].attrs, otros[0].attrs, `${ctx(col, idioma, `W02 ${nombre}`)}: clases del párrafo legacy intactas`);
        assert.ok(!pie(col, card).includes(CLASE_CORTE), `${ctx(col, idioma, `W02 ${nombre}`)}: pie sin clase de corte`);
      });
    }
  }
});

prueba('S7-R1-W03 · DOC: 3 textos límite por idioma, contenido exacto y clase de corte solo en el resumen', () => {
  const col = 'doc';
  for (const idioma of IDIOMAS) {
    for (const [caso, construir] of CASOS_R1) {
      const code = `S7R1-W03-${idioma}-${caso}`;
      const texto = construir(idioma);
      const f = fixtureCol(col, { code, summary: mapaR1(idioma, texto, caso) });
      let p;
      const card = enclavarCol(col, [f], () => {
        const c = tarjetaUnica(col, pintarCol(col, idioma, code), code);
        p = assertResumen(c, col, idioma, texto, `W03 ${caso}`);
        return c;
      });
      assert.ok(ceja(card).includes(code), `${ctx(col, idioma, `W03 ${caso}`)}: código conservado en la ceja`);
      assertClaseCorte(card, col, idioma, `W03 ${caso}`, p);
    }
    const codeS = `S7R1-W03-${idioma}-sin-summary`;
    const fs = fixtureCol(col, { code: codeS });
    enclavarCol(col, [fs], () => {
      const card = tarjetaUnica(col, pintarCol(col, idioma, codeS), codeS);
      assert.equal(parrafosNoCodigo(card).length, 0, `${ctx(col, idioma, 'W03 sin summary')}: sin párrafo ni wrapper`);
      assert.ok(!card.includes(CLASE_CORTE), `${ctx(col, idioma, 'W03 sin summary')}: sin clase de corte`);
    });
  }
  // Integridad tras W01–W03 (sin escrituras: este archivo jamás toca assets/data).
  for (const colFinal of COLS) {
    assert.equal(coleccion(colFinal), ORIG_REF[colFinal], `${NOMBRE[colFinal]}: identidad del array conservada tras R1`);
    assert.ok(!coleccion(colFinal).some((it) => String(it.code || '').startsWith('S7R1-')), `${NOMBRE[colFinal]}: sin fixtures residuales R1`);
  }
});
