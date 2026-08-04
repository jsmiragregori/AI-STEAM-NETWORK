import assert from 'node:assert/strict';
import test from 'node:test';

globalThis.localStorage = {
  getItem() { return null; },
  setItem() {},
};

test('los componentes globales escapan contenido editorial y Header falla cerrado en URL', async () => {
  const { HEADER_CONFIG } = await import('../../assets/data/header.js');
  const { NAV_CONFIG } = await import('../../assets/data/navigation.js');
  const { translations } = await import('../../assets/data/translations.js');
  const { renderHeader } = await import('../../assets/js/components/header.js');
  const { renderFooter } = await import('../../assets/js/components/footer.js');
  const { renderCookieBanner } = await import('../../assets/js/components/cookie-banner.js');

  const button = HEADER_CONFIG.buttons[0];
  const language = HEADER_CONFIG.languages[0];
  const navIdItem = NAV_CONFIG.items.find(item => item.id === 'red');
  const originals = {
    button: { ...button },
    language: { ...language },
    navId: navIdItem.id,
    navText: translations.es.nav.inicio,
    footerText: translations.es.footer.fundedBy,
    cookieText: translations.es.cookieBanner.text,
  };

  try {
    button.href = 'javascript:window.__v9=1';
    button.label_es = '<img src=x onerror=window.__v10=1>';
    language.code = 'es" autofocus onfocus="window.__v10=2';
    language.label = '<svg onload=window.__v10=3>';
    language.bcp47 = 'es" onfocus="window.__v10=4';
    navIdItem.id = 'red" autofocus onfocus="window.__v10=5';
    translations.es.nav.inicio = '<img src=x onerror=window.__v10=6>';
    translations.es.footer.fundedBy = '<svg onload=window.__v10=7>';
    translations.es.cookieBanner.text = '<img src=x onerror=window.__v10=8>';

    const header = renderHeader();
    const footer = renderFooter();
    const cookies = renderCookieBanner();

    assert.ok(!header.includes('javascript:window.__v9=1'), 'una URL rechazada no llega al DOM');
    assert.ok(!header.includes('<img src=x'), 'la traducción no crea un elemento img');
    assert.ok(!header.includes('<svg onload='), 'la etiqueta de idioma no crea un elemento svg');
    assert.ok(!header.includes('window.__v10=5'), 'una ruta que no está publicada no llega al DOM');
    assert.ok(
      !/data-lang="[^"]*"\s+autofocus\b/i.test(header),
      'los atributos editoriales no rompen sus comillas',
    );
    assert.ok(!footer.includes('<svg onload='), 'el pie no crea un elemento svg editorial');
    assert.ok(!cookies.includes('<img src=x'), 'el banner no crea un elemento img editorial');
    assert.match(header, /&lt;img src=x onerror=window\.__v10=6&gt;/);
    assert.match(footer, /&lt;svg onload=window\.__v10=7&gt;/);
    assert.match(cookies, /&lt;img src=x onerror=window\.__v10=8&gt;/);
  } finally {
    Object.assign(button, originals.button);
    Object.assign(language, originals.language);
    navIdItem.id = originals.navId;
    translations.es.nav.inicio = originals.navText;
    translations.es.footer.fundedBy = originals.footerText;
    translations.es.cookieBanner.text = originals.cookieText;
  }
});
