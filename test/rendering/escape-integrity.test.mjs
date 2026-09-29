import assert from 'node:assert/strict';
import test from 'node:test';

// CS-22 — La otra cara del escapado: no escapar DE MÁS.
//
// Escapar un texto ya escapado lo pinta mal (`d&#39;Usuari` en pantalla), y
// escapar un fragmento HTML compuesto por el código lo pinta como texto
// (`<div class=...>` visible). Ninguno de los dos es un fallo de seguridad,
// pero los dos rompen la página en silencio. Se pintan todas las vistas y
// pestañas, en los tres idiomas y con los datos reales, y se buscan sus huellas.

let lang = 'es';
globalThis.localStorage = { getItem: (k) => (k === 'language' ? lang : null), setItem() {}, removeItem() {} };
globalThis.document = {
  documentElement: {},
  getElementById() { return null; },
  querySelector() { return null; },
  querySelectorAll() { return []; },
};
globalThis.window = { location: { hash: '' }, addEventListener() {}, scrollTo() {} };

const { MARKETPLACE_CONFIG } = await import('../../assets/data/marketplace.js');
const { setState } = await import('../../assets/js/state.js');
const vistas = await import('../../assets/js/views/index.js');

const PESTANAS = {
  gobernanza: ['governanceTab', ['estructura', 'dual-track', 'lbd', 'documentos', 'participar']],
  conocimiento: ['knowledgeTab', ['flujo', 'oer', 'plantillas']],
  red: ['networkTab', ['socios', 'stakeholders']],
  formacion: ['trainingTab', ['fp', 'master', 'teacher']],
  bancoRetos: ['marketplaceTab', (MARKETPLACE_CONFIG.tabs || []).map((t) => t?.id).filter(Boolean)],
};

// Una entidad escapada dos veces.
const DOBLE = /&amp;(?:amp|lt|gt|quot|#39|#x27|#\d+);/;
// Una etiqueta que el código compuso y acabó escapada como texto.
const MARCADO_ESCAPADO = /&lt;\/?(?:div|span|a|p|li|ul|ol|i|b|strong|em|button|svg|path|img|h[1-6]|article|section|br|small|table|tr|td|th|details|summary|label|input|select|option)\b/i;

function contexto(html, indice) {
  return html.slice(Math.max(0, indice - 80), indice + 80).replace(/\s+/g, ' ');
}

for (const idioma of ['es', 'en', 'va']) {
  for (const nombre of Object.keys(vistas)) {
    test(`${nombre} (${idioma}) no escapa de más`, () => {
      lang = idioma;
      const [clave, valores] = PESTANAS[nombre] || [null, [null]];
      for (const valor of valores) {
        if (clave) setState(clave, valor);
        const html = vistas[nombre].render();
        const doble = html.search(DOBLE);
        assert.equal(doble, -1, `doble escapado en ${valor ?? nombre}: …${contexto(html, doble)}…`);
        const marcado = html.search(MARCADO_ESCAPADO);
        assert.equal(marcado, -1, `marcado escapado en ${valor ?? nombre}: …${contexto(html, marcado)}…`);
      }
    });
  }
}
