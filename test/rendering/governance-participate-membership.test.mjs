// F4 bis (P-66) — La tarjeta Stakeholder de Gobernanza → Participar usa la
// MISMA acción de adhesión que el CTA de la hero de Inicio: la resolución
// compartida (`utils/membership.js`) sobre la configuración canónica. Estos
// casos fijan el render de cada estado: externo (Forms en pestaña nueva),
// interno (Red → Stakeholders), oculto por flags y «unsafe» (rótulo sin
// enlace), sin ningún `href="#"` inerte en el botón.

import assert from 'node:assert/strict';
import test from 'node:test';

let idioma = 'es';
globalThis.localStorage = {
  getItem(k) { return k === 'language' ? idioma : null; },
  setItem() {},
  removeItem() {},
};
globalThis.document = {
  documentElement: {},
  getElementById() { return null; },
  querySelector() { return null; },
  querySelectorAll() { return []; },
};
globalThis.window = { location: { hash: '' }, addEventListener() {}, scrollTo() {} };

const { GOVERNANCE_CONFIG } = await import('../../assets/data/governance.js');
const { setState } = await import('../../assets/js/state.js');
const { render } = await import('../../assets/js/views/governance.js');

const FORMS = 'https://forms.invalid/response';
const TEXTO = {
  es: 'CTA sintético es',
  en: 'Synthetic CTA en',
  va: 'CTA sintètic va',
};
const TITULO = {
  es: 'Stakeholder sintético es',
  en: 'Synthetic Stakeholder en',
  va: 'Stakeholder sintètic va',
};

const ORIGINAL_PARTICIPATE = GOVERNANCE_CONFIG.participateBlock;

function participateFixture(stakeholderOverrides = {}, consensueOverrides = {}) {
  return {
    stakeholderCard: {
      visible: true,
      title: TITULO,
      subtitle: { es: 'Subtítulo es', en: 'Subtitle en', va: 'Subtítol va' },
      description: { es: 'Descripción es', en: 'Description en', va: 'Descripció va' },
      benefitsLabel: { es: 'Beneficios es', en: 'Benefits en', va: 'Beneficis va' },
      benefits: [],
      warning: { es: 'Aviso es', en: 'Warning en', va: 'Avís va' },
      buttonText: TEXTO,
      formVisible: true,
      effectiveMembershipCtasVisible: true,
      formMode: 'microsoftForms',
      microsoftForms: { url: FORMS, presentation: 'newTab' },
      ...stakeholderOverrides,
    },
    consensueCard: {
      visible: true,
      title: { es: 'ConsensUE es', en: 'ConsensUE en', va: 'ConsensUE va' },
      subtitle: { es: 'Subtítulo es', en: 'Subtitle en', va: 'Subtítol va' },
      description: { es: 'Descripción es', en: 'Description en', va: 'Descripció va' },
      groups: [],
      buttonText: { es: 'Abrir es', en: 'Open en', va: 'Obrir va' },
      buttonUrl: 'https://consensue.invalid/participate',
      buttonExternal: true,
      ...consensueOverrides,
    },
  };
}

function conCard(card, lang = 'es') {
  idioma = lang;
  GOVERNANCE_CONFIG.participateBlock = participateFixture(card);
  setState('governanceTab', 'participar');
  return render();
}

function etiquetaCta(html) {
  return (html.match(/<[a-z]+[^>]*data-gov-participar-cta="true"[^>]*>[\s\S]*?<span>([^<]*)<\/span>/) || [])[1];
}

test('modo externo (newTab): enlace directo a Forms con target y rel seguros', () => {
  const html = conCard({
    formVisible: true,
    effectiveMembershipCtasVisible: true,
    formMode: 'microsoftForms',
    microsoftForms: { url: FORMS, presentation: 'newTab' },
  });

  const cta = html.match(/<a[^>]*data-gov-participar-cta="true"[^>]*>/)?.[0] || '';
  assert.ok(cta.startsWith('<a '), 'el CTA externo es un enlace');
  assert.ok(cta.includes(`href="${FORMS}"`), 'apunta a la URL canónica de Forms');
  assert.ok(cta.includes('target="_blank"'), 'abre en pestaña nueva');
  assert.ok(cta.includes('rel="noopener noreferrer"'), 'sin exponer window.opener');
  assert.equal(etiquetaCta(html), TEXTO.es);
});

test('modo interno (iframe/demo): botón que abre Red → Stakeholders, sin href', () => {
  for (const presentacion of ['iframe', 'demo']) {
    const html = conCard({
      formVisible: true,
      effectiveMembershipCtasVisible: true,
      formMode: presentacion === 'demo' ? 'demo' : 'microsoftForms',
      microsoftForms: { url: FORMS, presentation: 'iframe' },
    });

    const cta = html.match(/<button[^>]*data-gov-participar-cta="true"[^>]*>/)?.[0] || '';
    assert.ok(cta.startsWith('<button '), `${presentacion}: el CTA interno es un botón`);
    assert.ok(!cta.includes('href'), `${presentacion}: sin enlace inerte`);
    assert.ok(!cta.includes('target='), `${presentacion}: sin target`);
    assert.equal(etiquetaCta(html), TEXTO.es);
  }
});

test('formVisible: false oculta el CTA pero conserva la tarjeta', () => {
  const html = conCard({ formVisible: false, effectiveMembershipCtasVisible: false, formMode: 'microsoftForms', microsoftForms: { url: FORMS } });

  assert.ok(!html.includes('data-gov-participar-cta'), 'sin botón');
  assert.ok(!html.includes(TEXTO.es), 'sin rótulo de adhesión');
  assert.ok(html.includes(TITULO.es), 'la tarjeta sigue');
});

test('membershipCtasVisible: false oculta solo el CTA (misma decisión que Inicio)', () => {
  const html = conCard({
    formVisible: true,
    effectiveMembershipCtasVisible: false,
    formMode: 'microsoftForms',
    microsoftForms: { url: FORMS, presentation: 'newTab' },
  });

  assert.ok(!html.includes('data-gov-participar-cta'), 'sin botón');
  assert.ok(!html.includes(TEXTO.es), 'sin rótulo');
  assert.ok(html.includes(TITULO.es), 'la tarjeta y sus avisos siguen');
});

test('URL insegura: se conserva el rótulo, no la navegación', () => {
  const html = conCard({
    formVisible: true,
    effectiveMembershipCtasVisible: true,
    formMode: 'microsoftForms',
    microsoftForms: { url: 'javascript:alert(1)', presentation: 'newTab' },
  });

  const cta = html.match(/<[a-z]+[^>]*data-gov-participar-cta="true"[^>]*>/)?.[0] || '';
  assert.ok(cta.startsWith('<span '), 'queda como rótulo, no como enlace ni botón');
  assert.ok(!html.includes('javascript:'), 'la URL rechazada no llega al HTML');
  assert.equal(etiquetaCta(html), TEXTO.es);
});

test('la ocultación editorial de la tarjeta la retira entera', () => {
  const html = conCard({ visible: false, formMode: 'microsoftForms', microsoftForms: { url: FORMS } });

  assert.ok(!html.includes(TITULO.es), 'sin tarjeta');
  assert.ok(!html.includes('data-gov-participar-cta'), 'sin CTA');
});

test('el rótulo sigue el idioma activo, igual que en Inicio', () => {
  const card = {
    formVisible: true,
    effectiveMembershipCtasVisible: true,
    formMode: 'microsoftForms',
    microsoftForms: { url: FORMS, presentation: 'newTab' },
  };

  for (const lang of ['es', 'en', 'va']) {
    assert.equal(etiquetaCta(conCard(card, lang)), TEXTO[lang], lang);
  }
});

test('Participate conserva cero/uno Stakeholder y ConsensUE en es/en/va e ignora Meetings heredado', () => {
  const texts = {
    es: { benefit: 'Beneficio sintético es', group: 'Grupo sintético es', action: 'Acción sintética es' },
    en: { benefit: 'Benefit synthetic en', group: 'Group synthetic en', action: 'Action synthetic en' },
    va: { benefit: 'Benefici sintètic va', group: 'Grup sintètic va', action: 'Acció sintètica va' },
  };

  try {
    for (const [lang, value] of Object.entries(texts)) {
      idioma = lang;
      setState('governanceTab', 'participar');
      const legacy = {
        visible: true,
        title: 'Synthetic legacy fallback must not render',
        meetings: [{ title: 'Synthetic legacy card must not render' }],
      };
      GOVERNANCE_CONFIG.participateBlock = participateFixture(
        {
          title: { es: 'Stakeholder card es', en: 'Stakeholder card en', va: 'Targeta Stakeholder va' },
          benefits: [{ text: { es: texts.es.benefit, en: texts.en.benefit, va: texts.va.benefit } }],
        },
        {
          title: { es: 'ConsensUE card es', en: 'ConsensUE card en', va: 'Targeta ConsensUE va' },
          groups: [{
            id: 'synthetic-group',
            visible: true,
            who: { es: texts.es.group, en: texts.en.group, va: texts.va.group },
            actions: [{ text: { es: texts.es.action, en: texts.en.action, va: texts.va.action } }],
          }],
        },
      );
      GOVERNANCE_CONFIG.participateBlock.meetingsSection = legacy;
      const withOne = render();
      assert.ok(withOne.includes(lang === 'va' ? 'Targeta Stakeholder va' : `Stakeholder card ${lang}`), `${lang}: card Stakeholder`);
      assert.ok(withOne.includes(lang === 'va' ? 'Targeta ConsensUE va' : `ConsensUE card ${lang}`), `${lang}: card ConsensUE`);
      assert.ok(withOne.includes(value.benefit), `${lang}: un beneficio Stakeholder`);
      assert.ok(withOne.includes(value.group), `${lang}: un grupo ConsensUE`);
      assert.ok(withOne.includes(value.action), `${lang}: una acción ConsensUE`);
      const stakeLink = withOne.match(/<a[^>]*data-gov-participar-cta="true"[^>]*>/)?.[0] || '';
      assert.ok(stakeLink.includes(`href="${FORMS}"`), `${lang}: href Stakeholder conservado`);
      assert.ok(stakeLink.includes('target="_blank"'), `${lang}: target Stakeholder conservado`);
      assert.ok(stakeLink.includes('rel="noopener noreferrer"'), `${lang}: rel Stakeholder conservado`);
      const consensueLink = withOne.match(/<a href="https:\/\/consensue\.invalid\/participate"[^>]*>/)?.[0] || '';
      assert.ok(consensueLink.includes('target="_blank"'), `${lang}: target ConsensUE conservado`);
      assert.ok(consensueLink.includes('rel="noopener noreferrer"'), `${lang}: rel ConsensUE conservado`);
      assert.ok(!withOne.includes('Synthetic legacy fallback'), `${lang}: no se pinta fallback legacy`);
      assert.ok(!withOne.includes('Synthetic legacy card'), `${lang}: no se pintan tarjetas legacy`);

      GOVERNANCE_CONFIG.participateBlock = participateFixture();
      GOVERNANCE_CONFIG.participateBlock.meetingsSection = legacy;
      const withZero = render();
      assert.ok(withZero.includes(TITULO[lang]), `${lang}: card Stakeholder con cero`);
      assert.ok(withZero.includes(`ConsensUE ${lang}`), `${lang}: card ConsensUE con cero`);
      assert.ok(!withZero.includes(value.benefit), `${lang}: cero beneficios`);
      assert.ok(!withZero.includes(value.group), `${lang}: cero grupos`);
      assert.ok(!withZero.includes(value.action), `${lang}: cero acciones`);
      assert.ok(!withZero.includes('Synthetic legacy fallback'), `${lang}: fallback sigue retirado con colecciones vacías`);
      assert.ok(!withZero.includes('undefined'), `${lang}: cero colecciones sin huecos de undefined`);
    }
  } finally {
    GOVERNANCE_CONFIG.participateBlock = ORIGINAL_PARTICIPATE;
    idioma = 'es';
  }
});
