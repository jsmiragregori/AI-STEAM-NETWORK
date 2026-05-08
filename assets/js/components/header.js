import { t, getLanguage, setLanguage } from '../i18n.js';
import { getActiveView, navigateTo } from '../router.js';
import { getState, setState } from '../state.js';
import { HEADER_CONFIG } from '../../data/header.js';

const NAV_ITEMS = [
  { id: 'inicio',      key: 'nav.inicio' },
  { id: 'red',         key: 'nav.red' },
  { id: 'sectores',    key: 'nav.sectores' },
  { id: 'banco-retos', key: 'nav.bancoRetos' },
  { id: 'formacion',   key: 'nav.formacion' },
  { id: 'conocimiento',key: 'nav.conocimiento' },
  { id: 'gobernanza',  key: 'nav.gobernanza' },
  { id: 'actualidad',  key: 'nav.actualidad' },
];

function langBtn(code, lang) {
  const active = lang === code;
  return `<button data-lang="${code}" aria-label="Cambiar idioma a ${code.toUpperCase()}" style="min-height:44px;min-width:44px" class="cursor-pointer px-2 rounded transition-colors whitespace-nowrap text-sm font-semibold ${
    active ? 'text-eu-text font-bold bg-gray-100' : 'text-gray-700 hover:text-eu-blue hover:bg-gray-100'
  }">${code.toUpperCase()}</button>`;
}

function langBtnMobile(code, lang) {
  const active = lang === code;
  return `<button data-lang="${code}" class="flex-1 px-3 py-2 rounded font-bold transition-all min-h-10 flex items-center justify-center text-sm ${
    active ? 'bg-eu-yellow text-eu-blue shadow-lg' : 'bg-white/40 text-white hover:bg-white/60 active:bg-white/50'
  }">${code.toUpperCase()}</button>`;
}

function renderDesktopButtons() {
  return HEADER_CONFIG.buttons
    .filter(btn => btn.visible === 'si')
    .map(btn => {
      const label = btn[`label_${getLanguage()}`] || btn.label_es;
      const href = btn.href;
      if (!href) return '';
      return `<a href="${href}" target="${btn.target || '_self'}" rel="noopener noreferrer"
               class="bg-eu-teal/10 border border-eu-teal text-eu-teal px-3 py-2 rounded text-sm font-bold cursor-pointer hover:bg-eu-teal hover:text-white transition-colors inline-block">
              ${label}
            </a>`;
    }).join('');
}

function renderMobileButtons() {
  return HEADER_CONFIG.buttons
    .filter(btn => btn.visible === 'si')
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

  const desktopNav = NAV_ITEMS.map(item => `
    <button data-view="${item.id}" class="text-sm font-medium flex items-center px-3 cursor-pointer border-b-[3px] transition-all duration-200 whitespace-nowrap h-full ${
      active === item.id
        ? 'text-white border-eu-yellow'
        : 'text-white/80 border-transparent hover:text-white hover:border-white/40'
    }">${t(item.key)}</button>
  `).join('');

  const mobileNav = NAV_ITEMS.map(item => `
    <button data-view="${item.id}" class="px-6 py-4 text-left font-medium border-l-4 transition-all duration-200 min-h-12 flex items-center text-sm active:scale-95 ${
      active === item.id
        ? 'bg-eu-blue/20 border-eu-yellow text-white shadow-md'
        : 'border-transparent text-white/80 hover:text-white hover:bg-white/10 active:bg-white/20'
    }">${t(item.key)}</button>
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
            <span class="font-bold text-xl text-eu-blue block leading-none">${HEADER_CONFIG.title}</span>
            <span class="text-xs text-gray-500 font-medium tracking-wide uppercase">${HEADER_CONFIG.subtitle}</span>
          </div>
        </div>

        <!-- Desktop right actions (lg+) -->
        <div class="hidden lg:flex items-center gap-3">
          <div class="flex items-center font-semibold text-gray-700 gap-2">
            ${langBtn('en', lang)}
            <span class="text-gray-400">|</span>
            ${langBtn('es', lang)}
            <span class="text-gray-400">|</span>
            ${langBtn('va', lang)}
          </div>
          <div class="flex items-center gap-2 border-l border-eu-border pl-4">
            ${renderDesktopButtons()}
          </div>
        </div>

        <!-- Hamburger (below lg) -->
        <button id="mobile-menu-toggle" style="min-height:44px;min-width:44px" class="lg:hidden p-2 rounded hover:bg-gray-100 transition-colors flex items-center justify-center" aria-label="Toggle menu">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${hamburgerPath}"/>
          </svg>
        </button>
      </header>

      <!-- Desktop nav bar (lg+) -->
      <nav class="hidden lg:flex bg-eu-blue h-12 px-6 gap-1">
        ${desktopNav}
      </nav>

      <!-- Mobile/tablet dropdown -->
      ${mobileOpen ? `
      <nav class="lg:hidden bg-eu-blue border-t border-eu-blue/20 max-h-[calc(100vh-128px)] overflow-y-auto">
        <div class="flex flex-col">${mobileNav}</div>
        <div class="border-t border-eu-blue/20 px-6 py-4">
          <p class="text-xs text-white/80 font-bold uppercase mb-3 tracking-wide">${t('header.language')}</p>
          <div class="flex gap-2">
            ${langBtnMobile('en', lang)}
            ${langBtnMobile('es', lang)}
            ${langBtnMobile('va', lang)}
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
