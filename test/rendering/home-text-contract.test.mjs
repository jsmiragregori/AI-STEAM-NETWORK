import assert from 'node:assert/strict';
import test from 'node:test';

import { HOME_CONFIG } from '../../assets/data/home.js';
import { applyLanguage } from '../../assets/js/i18n.js';
import { render } from '../../assets/js/views/home.js';

const locales = (es, en, va) => ({ es, en, va });
const titles = locales(
  "L'Ecosistema &amp; AI \"STEAM\" <script>alert(1)</script> **literal**",
  "The AiSTEAM's Ecosystem",
  "L'Ecosistema AiSTEAM",
);

const originalConfig = structuredClone(HOME_CONFIG);
const originalGlobals = {
  localStorage: Object.getOwnPropertyDescriptor(globalThis, 'localStorage'),
  document: Object.getOwnPropertyDescriptor(globalThis, 'document'),
};

function restoreGlobal(name, descriptor) {
  if (descriptor) Object.defineProperty(globalThis, name, descriptor);
  else delete globalThis[name];
}

test('Ecosystem sintético con una plataforma muestra texto plano y sanea Markdown', () => {
  try {
    Object.defineProperty(globalThis, 'localStorage', {
      configurable: true,
      value: { getItem: () => null, setItem() {} },
    });
    Object.defineProperty(globalThis, 'document', {
      configurable: true,
      value: { documentElement: {} },
    });

    Object.assign(HOME_CONFIG, {
      heroBlock: { visible: false },
      isNotBlock: { visible: false },
      enredBlock: { visible: false },
      dualFocusBlock: { visible: false },
      sectorsBlock: { visible: false },
      consortiumBlock: { visible: false },
      ecosystemBlock: {
        visible: true,
        heading: titles,
        description: {
          visible: true,
          // This is the marked output for source text containing the literal `&amp;`.
          html: locales(
            '<strong>ENRED</strong> &amp;amp; <script>alert(1)</script>',
            '<strong>ENRED</strong> &amp; cooperation',
            '<strong>ENRED</strong> &amp; cooperació',
          ),
        },
        cards: [{
          id: 'synthetic-card',
          initials: 'SC',
          href: '',
          title: titles,
          subtitle: titles,
          description: titles,
          tag: { visible: false, html: locales('', '', '') },
        }],
      },
    });

    for (const [lang, title] of Object.entries(titles)) {
      applyLanguage(lang);
      const html = render();
      const escapedTitle = title.replaceAll('&', '&amp;').replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
      assert.ok(html.includes(escapedTitle), `${lang}: título plano escapado una vez`);
      assert.ok(!/<script\b/i.test(html), `${lang}: el HTML editorial no ejecuta scripts`);
      assert.ok(html.includes('<strong>ENRED</strong>'), `${lang}: conserva Markdown permitido`);
      if (lang === 'es') {
        assert.ok(escapedTitle.includes('&amp;amp;'), 'el texto plano conserva literalmente la entidad `&amp;`');
        assert.ok(html.includes('<strong>ENRED</strong> &amp;amp;'),
          'el HTML editorial muestra literalmente `&amp;` tras la decodificación DOM');
      }
    }

    HOME_CONFIG.ecosystemBlock = {
      visible: true,
      heading: locales('G04_ECOSYSTEM_ZERO_MARKER', 'G04_ECOSYSTEM_ZERO_MARKER', 'G04_ECOSYSTEM_ZERO_MARKER'),
      description: { visible: false, html: locales('', '', '') },
      cards: [],
    };
    applyLanguage('es');
    assert.doesNotMatch(render(), /G04_ECOSYSTEM_ZERO_MARKER/,
      'sin plataformas la vista omite el bloque conforme a su comportamiento actual');
  } finally {
    for (const key of Object.keys(HOME_CONFIG)) delete HOME_CONFIG[key];
    Object.assign(HOME_CONFIG, originalConfig);
    restoreGlobal('localStorage', originalGlobals.localStorage);
    restoreGlobal('document', originalGlobals.document);
  }
});
