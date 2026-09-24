import { t, getLanguage, setLanguage } from '../i18n.js';
import { VIEWS, getActiveView, navigateTo, syncRouteLanguage } from '../router.js';
import { getState, setState } from '../state.js';
import { HEADER_CONFIG } from '../../data/header.js';
import { NAV_CONFIG } from '../../data/navigation.js';
import { escapeHtml as esc } from '../utils/escape-html.js';
import { getSafeEditorialUrl } from '../utils/safe-editorial-url.js';

const DEFAULT_LANGUAGES = [
  { code: 'en', label: 'EN', bcp47: 'en' },
  { code: 'es', label: 'ES', bcp47: 'es' },
  { code: 'va', label: 'VA', bcp47: 'ca-valencia' },
];

const BRAND_ALT = {
  es: 'Generalitat Valenciana — Conselleria de Educación, Cultura y Universidades',
  en: 'Valencian Government — Department of Education, Culture and Universities',
  va: 'Generalitat Valenciana — Conselleria d’Educació, Cultura i Universitats',
};
const HOME_LABEL = { es: 'Ir al inicio', en: 'Go to home', va: 'Anar a l’inici' };

const AI_SECRETT_URL = getSafeEditorialUrl('https://aisecrett.eu/');

function getHeaderLanguages() {
  const configured = Array.isArray(HEADER_CONFIG?.languages) ? HEADER_CONFIG.languages : [];
  const valid = configured
    .filter(item => item && typeof item.code === 'string' && item.code.trim())
    .map(item => ({
      code: item.code.trim(),
      label: String(item.label || item.code).trim(),
      bcp47: String(item.bcp47 || item.code).trim(),
    }));
  return valid.length ? valid : DEFAULT_LANGUAGES;
}

function langBtn(language, lang) {
  const code = language.code;
  const label = language.label || code.toUpperCase();
  const active = lang === code;
  // `aria-pressed` dice el estado a quien no ve el color de fondo (criterios
  // 1.4.1 y 4.1.2). Sin él, el idioma activo solo se distinguía por color.
  return `<button data-lang="${esc(code)}" lang="${esc(language.bcp47 || code)}" aria-pressed="${active}" aria-label="Cambiar idioma a ${esc(label)}" class="cursor-pointer font-bold transition-all whitespace-nowrap" style="min-height:44px;min-width:2rem;font-size:0.8125rem;padding:.25rem .625rem;border-radius:.4rem;background:${active ? 'rgba(255,255,255,0.2)' : 'transparent'};color:${active ? '#FFF4E1' : 'rgba(255,244,225,0.75)'}"
    onmouseover="if(!${active})this.style.background='rgba(255,255,255,0.1)'"
    onmouseout="if(!${active})this.style.background='transparent'"
  >${esc(label)}</button>`;
}

function langBtnMobile(language, lang) {
  const code = language.code;
  const label = language.label || code.toUpperCase();
  const active = lang === code;
  return `<button data-lang="${esc(code)}" lang="${esc(language.bcp47 || code)}" aria-pressed="${active}" aria-label="Cambiar idioma a ${esc(label)}" class="flex-1 px-3 py-2 rounded font-bold transition-all min-h-10 flex items-center justify-center text-sm ${
    // El inactivo era blanco sobre `white/40` encima de #5620F6: 3,24:1, por
    // debajo del 4,5:1 que exige 1.4.3. Sin fondo son 7,2:1, y el hover a
    // `white/20` sigue en 5,0:1. El activo (#FFF4E1 sobre azul) ya daba 6,6:1.
    active ? 'bg-eu-yellow text-eu-blue shadow-lg' : 'text-white hover:bg-white/20 active:bg-white/10'
  }">${esc(label)}</button>`;
}

function renderDesktopButtons() {
  return HEADER_CONFIG.buttons
    .filter(btn => btn.visible !== false)
    .map(btn => {
      const label = btn[`label_${getLanguage()}`] || btn.label_es;
      const safeHref = getSafeEditorialUrl(btn.href);
      if (!safeHref) return '';
      return `<a href="${esc(safeHref)}" target="${esc(btn.target || '_self')}" rel="noopener noreferrer"
               class="rounded-full text-sm font-bold cursor-pointer transition-colors inline-flex items-center" style="min-height:44px;background:#FFF4E1;color:#4918AD;padding:.375rem 1rem"
               onmouseover="this.style.background='#5620F6';this.style.color='#FFF4E1'"
               onmouseout="this.style.background='#FFF4E1';this.style.color='#4918AD'">
              ${esc(label)}
            </a>`;
    }).join('');
}

function renderMobileButtons() {
  return HEADER_CONFIG.buttons
    .filter(btn => btn.visible !== false)
    .map(btn => {
      const label = btn[`label_${getLanguage()}`] || btn.label_es;
      const safeHref = getSafeEditorialUrl(btn.href);
      if (!safeHref) return '';
      return `<a href="${esc(safeHref)}" target="${esc(btn.target || '_self')}" rel="noopener noreferrer"
             class="flex w-full items-center justify-center bg-white border border-eu-blue text-eu-blue px-4 py-3 rounded text-sm font-bold hover:bg-gray-50 transition-colors min-h-12">
            ${esc(label)}
          </a>`;
    }).join('');
}

export function renderHeader() {
  const lang = getLanguage();
  const active = getActiveView();
  const mobileOpen = getState('mobileMenuOpen');
  const languages = getHeaderLanguages();
  const desktopLangButtons = languages.map(language => langBtn(language, lang)).join('');
  const mobileLangButtons = languages.map(language => langBtnMobile(language, lang)).join('');
  const visibleNavItems = NAV_CONFIG.items.filter(item => VIEWS.includes(item.id));

  const desktopNav = visibleNavItems.map(item => `
    <button data-view="${esc(item.id)}" class="font-bold uppercase cursor-pointer transition-all duration-200 rounded-full ${
      active === item.id
        ? 'bg-white/20'
        : 'hover:bg-white/10'
    }" style="min-height:44px;flex-shrink:0;white-space:nowrap;font-size:0.8125rem;letter-spacing:.03em;padding:.375rem .625rem;color:#FFF4E1">${esc(t(item.key))}</button>
  `).join('');

  const mobileNav = visibleNavItems.map(item => `
    <button data-view="${esc(item.id)}" class="px-6 py-4 text-left font-bold uppercase tracking-wider border-l-4 transition-all duration-200 min-h-12 flex items-center text-sm active:scale-95 ${
      active === item.id
        ? 'bg-eu-blue/20 border-eu-yellow text-white shadow-md'
        : 'border-transparent text-white/80 hover:text-white hover:bg-white/10 active:bg-white/20'
    }" style="color:#FFF4E1">${esc(t(item.key))}</button>
  `).join('');

  const hamburgerPath = mobileOpen
    ? 'M6 18L18 6M6 6l12 12'
    : 'M4 6h16M4 12h16M4 18h16';

  return `
    <div class="fixed top-0 left-0 right-0 z-50">
      <!-- Top bar -->
      <header class="rd-brand-header">
        <div class="rd-brand-row">
          <button id="logo-btn" class="rd-brand-link rd-brand-government" type="button" aria-label="${esc(BRAND_ALT[lang] || BRAND_ALT.es)} — ${esc(HOME_LABEL[lang] || HOME_LABEL.es)}">
            <img src="assets/images/brand/generalitat-va-480.png" srcset="assets/images/brand/generalitat-va-240.png 240w, assets/images/brand/generalitat-va-480.png 480w, assets/images/brand/generalitat-va-720.png 720w" sizes="(max-width: 479px) 190px, (max-width: 767px) 210px, (max-width: 1279px) 190px, 300px" width="720" height="343" alt="${esc(BRAND_ALT[lang] || BRAND_ALT.es)}">
          </button>
          ${AI_SECRETT_URL ? `<a class="rd-brand-link rd-brand-secrett" href="${esc(AI_SECRETT_URL)}" target="_blank" rel="noopener noreferrer" aria-label="AI-SECRETT — ${esc('Creativity and AI for the Triple Transition')}">
            <img src="assets/images/brand/aisecrett-480.png" srcset="assets/images/brand/aisecrett-240.png 240w, assets/images/brand/aisecrett-480.png 480w, assets/images/brand/aisecrett-720.png 720w" sizes="(max-width: 1023px) 235px, (max-width: 1279px) 300px, 500px" width="720" height="96" alt="AI-SECRETT — Creativity and AI for the Triple Transition">
          </a>` : ''}
          <button id="network-logo-btn" class="rd-brand-link rd-brand-network" type="button" aria-label="${esc('AI-STEAM Network')} — ${esc(HOME_LABEL[lang] || HOME_LABEL.es)}">
            <img src="assets/images/brand/aisteam-network-480.png" srcset="assets/images/brand/aisteam-network-240.png 240w, assets/images/brand/aisteam-network-480.png 480w, assets/images/brand/aisteam-network-720.png 720w" sizes="(max-width: 767px) 160px, (max-width: 1023px) 200px, (max-width: 1279px) 350px, 600px" width="720" height="57" alt="AI-STEAM Network">
          </button>
        </div>

        <!-- Hamburger (responsive controlado en redesign.css: rd-nav-toggle) -->
        <button id="mobile-menu-toggle" style="min-height:44px;min-width:44px" class="rd-nav-toggle p-2 rounded hover:bg-gray-100 transition-colors items-center justify-center" aria-label="Toggle menu">
          <svg class="w-6 h-6" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${hamburgerPath}"/>
          </svg>
        </button>
      </header>

      <!-- Desktop nav bar — píldora editorial AI-SECRETT (rd-nav-desktop) -->
      <nav class="rd-nav-desktop bg-eu-purple items-center py-2" style="padding-left:1.25rem;padding-right:1.25rem;gap:.75rem">
        <div class="rd-navpill">
          ${desktopNav}
        </div>
        <div class="flex items-center gap-1 shrink-0" style="margin-left:auto">
          ${desktopLangButtons}
        </div>
        <div class="flex items-center gap-2 shrink-0 border-l border-white/20" style="padding-left:.75rem">
          ${renderDesktopButtons()}
        </div>
      </nav>

      <!-- Mobile/tablet dropdown (rd-nav-mobile) -->
      ${mobileOpen ? `
      <nav class="rd-nav-mobile bg-eu-blue border-t border-eu-blue/20 overflow-y-auto">
        <div class="flex flex-col">${mobileNav}</div>
        <div class="border-t border-eu-blue/20 px-6 py-4">
          <p class="text-xs text-white/80 font-bold uppercase mb-3 tracking-wide">${esc(t('header.language'))}</p>
          <div class="flex gap-2">
            ${mobileLangButtons}
          </div>
        </div>
        <div class="border-t border-eu-blue/20 px-4 sm:px-6 py-6 space-y-3">
          ${renderMobileButtons()}
        </div>
      </nav>` : ''}
    </div>
  `;
}

export function mountHeader() {
  // Logo → inicio
  document.getElementById('logo-btn')?.addEventListener('click', () => navigateTo('inicio'));
  document.getElementById('network-logo-btn')?.addEventListener('click', () => navigateTo('inicio'));

  // Tabs nav — al elegir destino, cerrar el menú móvil antes de navegar
  // (navigateTo → renderApp re-renderiza el header leyendo mobileMenuOpen)
  document.querySelectorAll('[data-view]').forEach(btn => {
    btn.addEventListener('click', () => {
      setState('mobileMenuOpen', false);
      navigateTo(btn.dataset.view);
    });
  });

  // Language buttons — cerrar también el menú móvil al elegir idioma
  document.querySelectorAll('[data-lang]').forEach(btn => {
    btn.addEventListener('click', () => {
      setState('mobileMenuOpen', false);
      setLanguage(btn.dataset.lang);
      // El enlace de la barra de direcciones sigue al idioma, sin apilar
      // historial: cambiar de idioma no es navegar (contrato 5).
      syncRouteLanguage(btn.dataset.lang);
    });
  });

  // Hamburger toggle
  document.getElementById('mobile-menu-toggle')?.addEventListener('click', () => {
    setState('mobileMenuOpen', !getState('mobileMenuOpen'));
    document.getElementById('header-root').innerHTML = renderHeader();
    mountHeader();
  });
}
