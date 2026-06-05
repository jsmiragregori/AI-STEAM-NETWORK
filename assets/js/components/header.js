import { t, getLanguage, setLanguage } from '../i18n.js';
import { getActiveView, navigateTo } from '../router.js';
import { getState, setState } from '../state.js';
import { HEADER_CONFIG } from '../../data/header.js';
import { NAV_CONFIG } from '../../data/navigation.js';

const DEFAULT_LANGUAGES = [
  { code: 'en', label: 'EN', bcp47: 'en' },
  { code: 'es', label: 'ES', bcp47: 'es' },
  { code: 'va', label: 'VA', bcp47: 'ca-valencia' },
];

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
  return `<button data-lang="${code}" lang="${language.bcp47 || code}" aria-label="Cambiar idioma a ${label}" class="cursor-pointer font-bold transition-all whitespace-nowrap" style="min-height:44px;min-width:2rem;font-size:0.8125rem;padding:.25rem .625rem;border-radius:.4rem;background:${active ? 'rgba(255,255,255,0.2)' : 'transparent'};color:${active ? '#FFF4E1' : 'rgba(255,244,225,0.6)'}"
    onmouseover="if(!${active})this.style.background='rgba(255,255,255,0.1)'"
    onmouseout="if(!${active})this.style.background='transparent'"
  >${label}</button>`;
}

function langBtnMobile(language, lang) {
  const code = language.code;
  const label = language.label || code.toUpperCase();
  const active = lang === code;
  return `<button data-lang="${code}" lang="${language.bcp47 || code}" class="flex-1 px-3 py-2 rounded font-bold transition-all min-h-10 flex items-center justify-center text-sm ${
    active ? 'bg-eu-yellow text-eu-blue shadow-lg' : 'bg-white/40 text-white hover:bg-white/60 active:bg-white/50'
  }">${label}</button>`;
}

function renderDesktopButtons() {
  return HEADER_CONFIG.buttons
    .filter(btn => btn.visible !== false)
    .map(btn => {
      const label = btn[`label_${getLanguage()}`] || btn.label_es;
      const href = btn.href;
      if (!href) return '';
      return `<a href="${href}" target="${btn.target || '_self'}" rel="noopener noreferrer"
               class="rounded-full text-sm font-bold cursor-pointer transition-colors inline-flex items-center" style="min-height:44px;background:#FFF4E1;color:#4918AD;padding:.375rem 1rem"
               onmouseover="this.style.background='#5620F6';this.style.color='#FFF4E1'"
               onmouseout="this.style.background='#FFF4E1';this.style.color='#4918AD'">
              ${label}
            </a>`;
    }).join('');
}

function renderMobileButtons() {
  return HEADER_CONFIG.buttons
    .filter(btn => btn.visible !== false)
    .map(btn => {
      const label = btn[`label_${getLanguage()}`] || btn.label_es;
      const href = btn.href;
      if (!href) return '';
      return `<a href="${href}" target="${btn.target || '_self'}" rel="noopener noreferrer"
             class="flex w-full items-center justify-center bg-white border border-eu-teal text-eu-teal px-4 py-3 rounded text-sm font-bold hover:bg-gray-50 transition-colors min-h-12">
            ${label}
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

  const desktopNav = NAV_CONFIG.items.map(item => `
    <button data-view="${item.id}" class="font-bold uppercase cursor-pointer transition-all duration-200 rounded-full ${
      active === item.id
        ? 'bg-white/20'
        : 'hover:bg-white/10'
    }" style="min-height:44px;flex-shrink:0;white-space:nowrap;font-size:0.8125rem;letter-spacing:.03em;padding:.375rem .625rem;color:#FFF4E1">${t(item.key)}</button>
  `).join('');

  const mobileNav = NAV_CONFIG.items.map(item => `
    <button data-view="${item.id}" class="px-6 py-4 text-left font-bold uppercase tracking-wider border-l-4 transition-all duration-200 min-h-12 flex items-center text-sm active:scale-95 ${
      active === item.id
        ? 'bg-eu-blue/20 border-eu-yellow text-white shadow-md'
        : 'border-transparent text-white/80 hover:text-white hover:bg-white/10 active:bg-white/20'
    }" style="color:#FFF4E1">${t(item.key)}</button>
  `).join('');

  const hamburgerPath = mobileOpen
    ? 'M6 18L18 6M6 6l12 12'
    : 'M4 6h16M4 12h16M4 18h16';

  return `
    <div class="fixed top-0 left-0 right-0 z-50">
      <!-- Top bar -->
      <header class="bg-white border-b border-eu-border h-16 flex items-center justify-between px-4 sm:px-6">
        <!-- Logo -->
        <div id="logo-btn" class="flex items-center gap-2 sm:gap-3 cursor-pointer shrink-0">
          <div class="w-10 h-10 bg-eu-blue rounded flex items-center justify-center text-white font-bold text-xl shrink-0">AI</div>
          <div class="hidden sm:block">
            <span class="font-bold text-xl text-eu-blue block leading-none">${t('header.title')}</span>
            <span class="text-xs text-gray-500 font-medium tracking-wide uppercase">${t('header.subtitle')}</span>
          </div>
        </div>

        <!-- Hamburger (responsive controlado en redesign.css: rd-nav-toggle) -->
        <button id="mobile-menu-toggle" style="min-height:44px;min-width:44px" class="rd-nav-toggle p-2 rounded hover:bg-gray-100 transition-colors items-center justify-center" aria-label="Toggle menu">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      <nav class="rd-nav-mobile bg-eu-blue border-t border-eu-blue/20 max-h-[calc(100vh-128px)] overflow-y-auto">
        <div class="flex flex-col">${mobileNav}</div>
        <div class="border-t border-eu-blue/20 px-6 py-4">
          <p class="text-xs text-white/80 font-bold uppercase mb-3 tracking-wide">${t('header.language')}</p>
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

  // Tabs nav
  document.querySelectorAll('[data-view]').forEach(btn => {
    btn.addEventListener('click', () => navigateTo(btn.dataset.view));
  });

  // Language buttons
  document.querySelectorAll('[data-lang]').forEach(btn => {
    btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
  });

  // Hamburger toggle
  document.getElementById('mobile-menu-toggle')?.addEventListener('click', () => {
    setState('mobileMenuOpen', !getState('mobileMenuOpen'));
    document.getElementById('header-root').innerHTML = renderHeader();
    mountHeader();
  });
}
