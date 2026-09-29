import assert from 'node:assert/strict';
import test from 'node:test';

// CS-20 — News está fuera del runtime (news-runtime-retirement), pero se
// conserva para cuando vuelva y el fichero se publica. Si vuelve, tiene que
// volver escapada: toda cadena que llegue de los datos o de las traducciones
// debe acabar como texto, nunca como marcado.
//
// Se envenena en memoria CADA cadena de NEWS_CONFIG y del bloque `news` de las
// traducciones con una carga que, sin escapar, crearía una etiqueta <img> viva.

let state = {};
globalThis.localStorage = { getItem: (k) => (k === 'language' ? 'es' : null), setItem() {}, removeItem() {} };
globalThis.window = { location: { hash: '' }, addEventListener() {}, scrollTo() {} };
globalThis.document = { addEventListener() {}, querySelectorAll: () => [], getElementById: () => null };

const PAYLOAD = '"><img src=x onerror=alert(1)>';

function poison(value, seen = new Set()) {
  if (!value || typeof value !== 'object' || seen.has(value)) return;
  seen.add(value);
  for (const key of Object.keys(value)) {
    // Los identificadores numéricos y las banderas no son texto: se respetan.
    if (typeof value[key] === 'string') value[key] = PAYLOAD;
    else poison(value[key], seen);
  }
}

// Una etiqueta viva es un `<img` que no fue escapado a `&lt;img`.
const LIVE_TAG = /<img\b/i;

async function renderNews(selectedNewsId) {
  const { NEWS_CONFIG } = await import('../../assets/data/news.js');
  const { translations } = await import('../../assets/data/translations.js');
  const stateModule = await import('../../assets/js/state.js');
  poison(NEWS_CONFIG);
  poison(translations.es.news);
  // Una noticia destacada y un evento con inscripción, para recorrer todas las ramas.
  const items = translations.es.news.newsItems || {};
  const first = Object.values(items)[0];
  if (first) { first.featured = true; first.isOfficial = true; }
  const firstEvent = Object.values(translations.es.news.events || {})[0];
  if (firstEvent) firstEvent.register = true;
  stateModule.setState('newsCategoryFilter', null);
  stateModule.setState('selectedNewsId', selectedNewsId);
  const { render } = await import('../../assets/js/views/news.js');
  return render();
}

test('el listado de News pinta como texto toda cadena de datos y traducciones', async () => {
  const html = await renderNews(null);
  assert.ok(html.includes('&lt;img'), 'la carga debe aparecer, escapada');
  assert.doesNotMatch(html, LIVE_TAG);
});

test('el detalle de News pinta como texto toda cadena de datos y traducciones', async () => {
  const html = await renderNews(1);
  assert.ok(html.includes('&lt;img'), 'la carga debe aparecer, escapada');
  assert.doesNotMatch(html, LIVE_TAG);
});
