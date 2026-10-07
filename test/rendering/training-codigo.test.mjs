// C13 — La card de Formación muestra el código según `codeDisplay` y el buscador encuentra por AMBOS
// identificadores, aunque uno no se muestre.
//
// Los datos generados aún no llevan `code`/`externalCode`/`codeDisplay` (los regenera C20), así que la
// prueba los inyecta EN MEMORIA, ítem a ítem, antes de pintar. No escribe nada.
//
// Reglas del contrato C6 que aquí se comprueban desde la vista: `internal` (por defecto) muestra el código
// AI-STEAM; `external` muestra el de la formación; `both` muestra los dos, con sus etiquetas; un modo
// desconocido o un externo ausente no dejan la card sin identificación (fallback a interno). El externo es
// texto literal: se escapa y nunca se convierte en enlace.

import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const almacen = new Map();
let lang = 'es';
globalThis.localStorage = {
  getItem: (k) => (k === 'language' ? lang : (almacen.has(k) ? almacen.get(k) : null)),
  setItem: (k, v) => almacen.set(k, String(v)),
  removeItem: (k) => almacen.delete(k),
};
globalThis.document = {
  documentElement: {},
  getElementById() { return null; },
  querySelector() { return null; },
  querySelectorAll() { return []; },
};
globalThis.window = { location: { hash: '' }, addEventListener() {}, scrollTo() {} };

const { TRAINING_CONFIG } = await import('../../assets/data/training.js');
const { setState } = await import('../../assets/js/state.js');
const vistas = await import('../../assets/js/views/index.js');

const ETIQUETA = {
  es: { internal: 'Código AiSTEAM', external: 'Código de la formación' },
  en: { internal: 'AiSTEAM code', external: 'Training code' },
  va: { internal: 'Codi AiSTEAM', external: 'Codi de la formació' },
};

const CURSOS = () => TRAINING_CONFIG.coursesBlock.courses;

function conCodigos(items, fn) {
  const campos = ['code', 'externalCode', 'codeDisplay'];
  const originales = items.map((c) => [c, Object.fromEntries(campos.map((k) => [k, c[k]]))]);
  for (const [c, valores] of originales) {
    for (const k of campos) {
      if (valores[k] === undefined) delete c[k];
      else c[k] = valores[k];
    }
  }
  try {
    return fn();
  } finally {
    for (const [c, valores] of originales) {
      for (const k of campos) {
        if (valores[k] === undefined) delete c[k];
        else c[k] = valores[k];
      }
    }
  }
}

function pintar(tab = 'fp', idioma = 'es', filtros = null) {
  lang = idioma;
  almacen.delete(`trainingFilters_${tab}`);
  if (filtros) almacen.set(`trainingFilters_${tab}`, JSON.stringify(filtros));
  setState('trainingTab', tab);
  setState('trainingPage', 0);
  return vistas.formacion.render();
}

const cards = (html) => html.split('<div class="rd-card-mp rd-card-mp-hover').slice(1);

const ceja = (card) => /<div class="rd-card-mp-ceja">([\s\S]*?)<\/div>/.exec(card)?.[1] ?? '';
const lineasCodigo = (card) => [...ceja(card).matchAll(/<p class="rd-card-mp-code">([\s\S]*?)<\/p>/g)].map((m) => m[1]);
const sinMarcas = (html) => html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();

// Todos los cursos de una pestaña (la primera página enseña los primeros; con todos asignados no hay
// que adivinar cuáles salen pintados).
function cursosDe(tab) {
  const mapa = { fp: 'FP', teacher: 'Docentes', master: 'Máster' };
  return CURSOS().filter((c) => c.level === mapa[tab]);
}

test('hay cursos y el bloque de datos es el del CMS', () => {
  assert.ok(Array.isArray(CURSOS()) && CURSOS().length > 0);
});

test('cursos sin sectores ni skills: card visible sin pills en las tres modalidades e idiomas', () => {
  const originales = CURSOS();
  const cv = TRAINING_CONFIG.coursesBlock.chipVisibility;
  try {
    TRAINING_CONFIG.coursesBlock.chipVisibility = { ...cv, sectors: true, tags: true, modality: true };
    for (const tab of ['fp', 'teacher', 'master']) {
      const base = cursosDe(tab)[0];
      assert.ok(base, `falta curso de ${tab}`);
      TRAINING_CONFIG.coursesBlock.courses = [{ ...base, sectorIds: [], skillIds: [], tagIds: [] }];
      for (const idioma of ['es', 'en', 'va']) {
        const pintadas = cards(pintar(tab, idioma));
        assert.equal(pintadas.length, 1);
        assert.match(pintadas[0], /rd-card-mp-title/);
        assert.doesNotMatch(pintadas[0], /data-filter-sector=/);
        assert.doesNotMatch(pintadas[0], /data-filter-tag=/);
        if (base.modalityId) assert.match(pintadas[0], /data-filter-modality=/);
      }
      TRAINING_CONFIG.coursesBlock.courses = originales;
    }
  } finally {
    TRAINING_CONFIG.coursesBlock.courses = originales;
    TRAINING_CONFIG.coursesBlock.chipVisibility = cv;
  }
});

test('codeDisplay internal (y sin campo): solo el código AI-STEAM', () => {
  const items = cursosDe('fp');
  conCodigos(items, () => {
    for (const c of items) { c.code = 'VET-2026-001'; c.externalCode = 'EXT-FORM-99'; delete c.codeDisplay; }
    const html = pintar('fp');
    for (const card of cards(html)) {
      const lineas = lineasCodigo(card);
      assert.equal(lineas.length, 1);
      assert.ok(sinMarcas(lineas[0]).includes('VET-2026-001'));
      assert.ok(!sinMarcas(lineas[0]).includes('EXT-FORM-99'));
    }
  });
});

test('codeDisplay external: solo el código de la formación', () => {
  const items = cursosDe('teacher');
  conCodigos(items, () => {
    for (const c of items) { c.code = 'TCH-2026-002'; c.externalCode = 'EXP-2026-77'; c.codeDisplay = 'external'; }
    for (const card of cards(pintar('teacher'))) {
      const lineas = lineasCodigo(card);
      assert.equal(lineas.length, 1);
      assert.ok(sinMarcas(lineas[0]).includes('EXP-2026-77'));
      assert.ok(!sinMarcas(lineas[0]).includes('TCH-2026-002'));
      assert.ok(sinMarcas(lineas[0]).startsWith('Código de la formación: '));
    }
  });
});

test('codeDisplay both: los dos, el AI-STEAM primero, cada uno con su etiqueta', () => {
  const items = cursosDe('master');
  conCodigos(items, () => {
    for (const c of items) { c.code = 'EXT-2026-003'; c.externalCode = 'MASTER-X-1'; c.codeDisplay = 'both'; }
    for (const card of cards(pintar('master'))) {
      const lineas = lineasCodigo(card);
      assert.equal(lineas.length, 2);
      assert.ok(sinMarcas(lineas[0]).startsWith('Código AiSTEAM: ') && sinMarcas(lineas[0]).includes('EXT-2026-003'));
      assert.ok(sinMarcas(lineas[1]).startsWith('Código de la formación: ') && sinMarcas(lineas[1]).includes('MASTER-X-1'));
    }
  });
});

test('un modo desconocido o un externo ausente no dejan la card sin identificación', () => {
  const items = cursosDe('fp');
  conCodigos(items, () => {
    for (const c of items) { c.code = 'VET-2026-009'; c.externalCode = 'X-9'; c.codeDisplay = 'raro'; }
    const pintadas = cards(pintar('fp'));
    let lineas = pintadas.flatMap(lineasCodigo);
    assert.equal(lineas.length, pintadas.length);
    for (const l of lineas) assert.ok(sinMarcas(l).includes('VET-2026-009'));
    for (const c of items) { c.code = 'VET-2026-010'; delete c.externalCode; c.codeDisplay = 'both'; }
    const pintadas2 = cards(pintar('fp'));
    lineas = pintadas2.flatMap(lineasCodigo);
    assert.equal(lineas.length, pintadas2.length);
    for (const l of lineas) assert.ok(sinMarcas(l).includes('VET-2026-010'), sinMarcas(l));
  });
});

test('sin código no se pinta línea ni aparece «undefined»', () => {
  const items = cursosDe('fp');
  conCodigos(items, () => {
    for (const c of items) { delete c.code; delete c.externalCode; delete c.codeDisplay; }
    const html = pintar('fp');
    assert.ok(!html.includes('rd-card-mp-code'));
    assert.ok(!html.includes('undefined'));
    // control: con código sí hay línea
    for (const c of items) c.code = 'VET-2026-011';
    assert.ok(cards(pintar('fp')).every((card) => lineasCodigo(card).length === 1));
  });
});

test('las etiquetas accesibles están en ES/EN/VA y el código se lee entero', () => {
  const items = cursosDe('fp');
  conCodigos(items, () => {
    for (const c of items) { c.code = 'VET-2026-012'; c.externalCode = 'EXT-12'; c.codeDisplay = 'both'; }
    for (const idioma of ['es', 'en', 'va']) {
      for (const card of cards(pintar('fp', idioma))) {
        const lineas = lineasCodigo(card);
        assert.equal(lineas.length, 2, idioma);
        assert.ok(lineas[0].includes('<span class="sr-only">'));
        assert.ok(sinMarcas(lineas[0]).startsWith(`${ETIQUETA[idioma].internal}: `), idioma);
        assert.ok(sinMarcas(lineas[1]).startsWith(`${ETIQUETA[idioma].external}: `), idioma);
      }
    }
  });
});

test('el buscador encuentra por el código externo aunque el modo muestre solo el interno', () => {
  const items = cursosDe('fp');
  conCodigos(items, () => {
    const objetivo = items[0];
    objetivo.code = 'VET-2026-013'; objetivo.externalCode = 'OCULTO-EXT-13'; objetivo.codeDisplay = 'internal';
    const html = pintar('fp', 'es', { sectors: [], modalities: [], tags: [], statuses: [], search: 'oculto-ext-13' });
    const visibles = cards(html);
    assert.equal(visibles.length, 1, 'la búsqueda debía encontrar un único curso');
    assert.ok(visibles[0].includes('VET-2026-013'));
  });
});

test('el buscador encuentra por el código AI-STEAM aunque el modo muestre solo el externo', () => {
  const items = cursosDe('fp');
  conCodigos(items, () => {
    const objetivo = items[0];
    objetivo.code = 'VET-2026-014'; objetivo.externalCode = 'EXTERNO-14'; objetivo.codeDisplay = 'external';
    const html = pintar('fp', 'es', { sectors: [], modalities: [], tags: [], statuses: [], search: 'vet-2026-014' });
    const visibles = cards(html);
    assert.equal(visibles.length, 1);
    assert.ok(sinMarcas(ceja(visibles[0])).includes('EXTERNO-14'));
  });
});

test('el buscador por código conserva los filtros y el orden', () => {
  const items = cursosDe('fp');
  conCodigos(items, () => {
    items.forEach((c, i) => { c.code = `VET-2026-1${String(i).padStart(2, '0')}`; delete c.externalCode; c.codeDisplay = 'internal'; });
    const sector = items[0].sectorIds?.[0] || items[1].sectorIds?.[0] || 'mfg';
    const filtros = { sectors: [sector], modalities: [], tags: [], statuses: [], search: 'VET-2026' };
    const original = pintar('fp', 'es', filtros);
    const esperados = items.filter((c) => (c.sectorIds || []).includes(sector)).map((c) => c.id);
    const pintados = cards(original).map((card) => items.find((c) => card.includes(c.title))?.id);
    const limpios = pintados.filter(Boolean);
    assert.deepEqual(limpios, esperados.filter((id) => limpios.includes(id)));
    // repetir el pintado da el mismo orden (no depende del estado previo)
    const repetido = cards(pintar('fp', 'es', filtros)).map((card) => items.find((c) => card.includes(c.title))?.id);
    assert.deepEqual(repetido, pintados);
  });
});

test('el código externo se escapa y NUNCA se convierte en enlace', () => {
  const items = cursosDe('fp');
  const hostil = 'EVIL"><img src=x onerror=alert(1)>&\''; 
  conCodigos(items, () => {
    const objetivo = items[0];
    objetivo.code = 'VET-2026-015'; objetivo.externalCode = hostil; objetivo.codeDisplay = 'external';
    const html = pintar('fp');
    assert.ok(!html.includes('<img src=x'), 'la etiqueta inyectada llegó sin escapar');
    assert.ok(!html.includes('onerror=alert(1)>'), 'el atributo inyectado llegó sin escapar');
    assert.ok(html.includes('&lt;img src=x onerror=alert(1)&gt;'), 'el externo debería verse como texto');
    assert.doesNotMatch(html, /href="[^"]*onerror/, 'el externo no puede acabar en un href');
    assert.doesNotMatch(html, /<a[^>]*>[^<]*onerror/, 'el externo no puede convertirse en enlace');
    assert.doesNotMatch(html, /&amp;(?:amp|lt|gt|quot|#39);/, 'no debe escaparse dos veces');
  });
});

test('la etiqueta local no toca translations.js (no hace falta cms:ui)', async () => {
  const fuente = await readFile(new URL('../../assets/data/translations.js', import.meta.url), 'utf8');
  assert.ok(!/trainingCode|Código de la formación|rd-card-tr-code/.test(fuente));
  const vista = await readFile(new URL('../../assets/js/views/training.js', import.meta.url), 'utf8');
  assert.match(vista, /trainingCode/);
});
