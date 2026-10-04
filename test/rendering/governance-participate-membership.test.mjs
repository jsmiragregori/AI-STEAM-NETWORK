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

const FORMS = 'https://forms.cloud.microsoft/Pages/ResponsePage.aspx?id=example';
const TEXTO = {
  es: 'Únete a la AI-STEAM Network',
  en: 'Join the AI-STEAM Network',
  va: 'Uneix-te a la AI-STEAM Network',
};
const TITULO = {
  es: 'Adhesión como Stakeholder',
  en: 'Join as a Stakeholder',
  va: 'Adhesió com a Stakeholder',
};

const ORIGINAL = GOVERNANCE_CONFIG.participateBlock.stakeholderCard;

function conCard(card, lang = 'es') {
  idioma = lang;
  GOVERNANCE_CONFIG.participateBlock = {
    ...GOVERNANCE_CONFIG.participateBlock,
    stakeholderCard: {
      ...ORIGINAL,
      title: TITULO,
      buttonText: TEXTO,
      ...card,
    },
  };
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
