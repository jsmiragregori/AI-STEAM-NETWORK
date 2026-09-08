// LG-7 — el pie enlaza de verdad con los cuatro documentos legales.
//
// Hasta LG-6 las páginas existían pero no se encontraban: solo se llegaba
// escribiendo el enlace. Esto comprueba lo que el plan pide como puerta de
// salida —«los cuatro enlaces llevan a su documento en el idioma activo»— y
// además que siguen llevando bien al cambiar de idioma, que es donde se rompen
// estas cosas.

import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

// El pie llama a `t()`, que lee el idioma de localStorage, y `applyLanguage`
// toca `document.documentElement`. Ninguno de los dos existe en Node.
let idiomaGuardado = 'es';
globalThis.localStorage = {
  getItem() { return idiomaGuardado; },
  setItem(_, value) { idiomaGuardado = value; },
};
globalThis.document = { documentElement: {} };

const { renderFooter } = await import('../../assets/js/components/footer.js');
const { applyLanguage } = await import('../../assets/js/i18n.js');
const { translations } = await import('../../assets/data/translations.js');
const { formatViewRoute } = await import('../../assets/js/utils/view-route.js');

const ROOT = new URL('../../', import.meta.url);

/** Los cuatro documentos, con la clave de su rótulo en el pie. */
const ENLACES = [
  { view: 'aviso-legal',   clave: 'legalNotice' },
  { view: 'privacidad',    clave: 'privacy' },
  { view: 'cookies',       clave: 'cookies' },
  { view: 'accesibilidad', clave: 'accessibility' },
];

/** Extrae los pares (href, texto) de los enlaces del pie. */
function anclas(html) {
  return [...html.matchAll(/<a\b[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/g)]
    .map(([, href, texto]) => ({ href, texto: texto.trim() }));
}

test('TDD-L17: el pie lleva a los cuatro documentos en el idioma activo', () => {
  for (const lang of ['es', 'en', 'va']) {
    applyLanguage(lang);
    const encontrados = anclas(renderFooter());

    for (const { view, clave } of ENLACES) {
      const esperado = formatViewRoute(view, lang);
      const ancla = encontrados.find(a => a.href === esperado);
      assert.ok(ancla, `${lang}: falta el enlace a ${view} (${esperado})`);
      // Y con su rótulo traducido, no con el del idioma anterior.
      assert.equal(ancla.texto, translations[lang].footer[clave], `${lang}/${view}`);
    }
  }
  applyLanguage('es');
});

test('TDD-L17: cambiar de idioma cambia los cuatro enlaces', () => {
  applyLanguage('es');
  const enEspanol = anclas(renderFooter()).map(a => a.href);
  applyLanguage('en');
  const enIngles = anclas(renderFooter()).map(a => a.href);
  applyLanguage('es');

  assert.notDeepEqual(enEspanol, enIngles, 'el pie se quedó con los enlaces del idioma anterior');
  assert.ok(enIngles.every(h => h.startsWith('#en/')), enIngles.join(' '));
  assert.ok(enEspanol.every(h => h.startsWith('#es/')), enEspanol.join(' '));
});

test('TDD-L18: el pie no deja anclas sin destino ni destinos inventados', async () => {
  const fuente = await readFile(new URL('assets/js/components/footer.js', ROOT), 'utf8');

  // Ni `href="#"` (TDD-L11) ni un `<a>` sin href, que parece un enlace, no se
  // puede enfocar con el teclado y no lleva a ninguna parte. Es lo que tenían
  // los tres rótulos del pie hasta ahora.
  assert.ok(!/href="#"/.test(fuente), 'href="#" vacía el hash y abre Inicio');
  const anclasSinHref = (renderFooter().match(/<a(?![^>]*\bhref=)/g) || []).length;
  assert.equal(anclasSinHref, 0, 'un <a> sin href no es un enlace, es un rótulo disfrazado');

  // Los destinos salen del enrutador, no escritos a mano: escribir '#es/cookies'
  // en el pie sobreviviría a cualquier cambio de slug sin enterarse. Se mira el
  // código, no los comentarios, que sí pueden citar un enlace de ejemplo.
  const codigo = fuente
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^\s*\/\/.*$/gm, '')
    .replace(/<!--[\s\S]*?-->/g, '');
  assert.match(codigo, /formatViewRoute\(/);
  assert.ok(!/#(es|en|va)\//.test(codigo), 'el pie no puede llevar slugs escritos a mano');

  // Fallo cerrado: si una vista no resolviera, se pinta el rótulo sin enlace en
  // lugar de un href vacío, que apunta a la página actual.
  assert.ok(!/href="\$\{esc\(formatViewRoute/.test(fuente), 'el href se comprueba antes de pintarlo');
});

test('TDD-L18: los rótulos del pie salen del CMS en los tres idiomas', () => {
  for (const lang of ['es', 'en', 'va']) {
    for (const { clave } of ENLACES) {
      const rotulo = translations[lang]?.footer?.[clave];
      assert.ok(rotulo && rotulo.trim() !== '', `falta footer.${clave} en ${lang}`);
      // Que no se haya quedado el texto de otro idioma por descuido.
      assert.notEqual(rotulo, `footer.${clave}`, `footer.${clave} sin traducir en ${lang}`);
    }
  }
});
