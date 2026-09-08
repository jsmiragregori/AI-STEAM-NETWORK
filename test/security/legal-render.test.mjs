// LG-8 — el aviso de cookies informa, no pide permiso.
//
// El banner anterior pedía consentimiento para algo que está EXENTO (art. 22.2
// LSSI: el idioma y los filtros los elige la persona usuaria), y encima solo
// ofrecía «Aceptar». Un banner así no recoge un consentimiento válido -no hay
// forma de negarse- y da a entender que el sitio hace algo que no hace.
//
// TDD-L13 y TDD-L14 del plan (§6.3).

import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

let almacen = {};
globalThis.localStorage = {
  getItem(k) { return k in almacen ? almacen[k] : null; },
  setItem(k, v) { almacen[k] = String(v); },
};
globalThis.document = { documentElement: {} };

const { renderCookieNotice, mountCookieNotice } = await import('../../assets/js/components/cookie-notice.js');
const { getState, setState } = await import('../../assets/js/state.js');
const { translations } = await import('../../assets/data/translations.js');

const ROOT = new URL('../../', import.meta.url);
const fuente = await readFile(new URL('assets/js/components/cookie-notice.js', ROOT), 'utf8');

/** Deja el aviso sin descartar antes de cada comprobación. */
function reiniciar() {
  almacen = {};
  setState('cookieNoticeDismissed', false);
}

// TDD-L13
test('TDD-L13: el aviso no bloquea el uso del sitio', () => {
  reiniciar();
  const html = renderCookieNotice();

  // Ni pantalla completa ni capa que tape el contenido: es una banda al pie.
  assert.ok(!/\binset-0\b/.test(html), 'una capa a pantalla completa es un muro');
  assert.ok(!/\btop-0\b/.test(html), 'el aviso no puede ocupar de arriba abajo');
  assert.ok(!/\bh-screen\b|\bmin-h-screen\b/.test(html));
  // Ni modal: nada de atrapar el foco ni de exigir una respuesta para seguir.
  assert.ok(!/aria-modal|role="dialog"|role="alertdialog"/.test(html));
  assert.ok(!/overflow-hidden/.test(html), 'no se bloquea el desplazamiento de la página');

  // Y tampoco en el código: ni foco atrapado, ni scroll bloqueado sobre body.
  assert.ok(!/document\.body\.style\.overflow/.test(fuente));
  assert.ok(!/\.focus\(\)|focusin|keydown/.test(fuente), 'el aviso no gobierna el foco');

  // El sitio se puede usar con el aviso puesto: no hay backdrop que intercepte
  // los clics.
  assert.ok(!/backdrop|fixed inset|z-\[?9{3,}/.test(html));
});

test('TDD-L13: el aviso informa y no pide consentimiento', () => {
  reiniciar();
  const html = renderCookieNotice();

  // Un solo botón, y es de cerrar. Si algún día aparece un segundo botón, esto
  // hay que volver a pensarlo: dos botones son una elección, y una elección es
  // un consentimiento.
  assert.equal((html.match(/<button/g) || []).length, 1);

  for (const lang of ['es', 'en', 'va']) {
    const textos = translations[lang]?.cookieNotice;
    assert.ok(textos?.text, `falta cookieNotice.text en ${lang}`);
    assert.ok(textos?.dismiss, `falta cookieNotice.dismiss en ${lang}`);

    // El texto no puede pedir permiso ni afirmar que se usan cookies: el sitio
    // no instala ninguna, y decir lo contrario haría falsa la política.
    const texto = textos.text.toLowerCase();
    for (const prohibido of ['acept', 'consent', 'permis', 'utilizamos cookies', 'we use cookies', 'utilitzem cookies']) {
      assert.ok(!texto.includes(prohibido), `${lang}: el aviso no puede decir "${prohibido}"`);
    }
    assert.ok(!/^acept|^accept/i.test(textos.dismiss), `${lang}: el botón cierra, no acepta`);
  }
});

// TDD-L14
test('TDD-L14: el aviso es descartable y no vuelve a salir', () => {
  reiniciar();
  assert.notEqual(renderCookieNotice(), '', 'la primera visita ve el aviso');

  // Se descarta como lo haría una persona: pulsando el botón.
  const escuchas = {};
  const elementos = {
    'cookie-notice': { remove() { elementos['cookie-notice'].borrado = true; }, borrado: false },
    'cookie-notice-dismiss': { addEventListener(evento, fn) { escuchas[evento] = fn; } },
  };
  globalThis.document.getElementById = (id) => elementos[id] || null;

  mountCookieNotice();
  assert.ok(escuchas.click, 'el botón de cerrar tiene que hacer algo');
  escuchas.click();

  assert.ok(elementos['cookie-notice'].borrado, 'el aviso desaparece al cerrarlo');
  assert.equal(renderCookieNotice(), '', 'no vuelve a salir en la misma sesión');

  // Y tampoco en la siguiente visita: la preferencia queda guardada.
  assert.equal(localStorage.getItem('cookies-accepted'), 'true');
  assert.equal(getState('cookieNoticeDismissed'), true);
});

test('TDD-L14: un navegador con el almacenamiento bloqueado no tumba el sitio', async () => {
  // La lección de i18n.js: leer localStorage en el ámbito del módulo lanzaba en
  // navegadores que bloquean el almacenamiento, y con ello se caía la carga
  // entera. `state.js` hacía exactamente eso con la clave del aviso.
  const estado = await readFile(new URL('assets/js/state.js', ROOT), 'utf8');
  const lecturas = estado.match(/localStorage\.\w+\(/g) || [];
  if (lecturas.length > 0) {
    assert.match(estado, /try\s*\{/, 'toda lectura de localStorage va protegida');
  }

  // Y el propio aviso tampoco puede lanzar al guardar.
  const escrituras = fuente.match(/localStorage\.setItem/g) || [];
  if (escrituras.length > 0) {
    assert.match(fuente, /try\s*\{/, 'guardar la preferencia no puede tumbar el clic');
  }
});
