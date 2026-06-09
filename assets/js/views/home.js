import { t, getLanguage } from '../i18n.js';
import { navigateTo } from '../router.js';
import { setState } from '../state.js';
import { HOME_CONFIG } from '../../data/home.js';



function localized(value) {
  const lang = getLanguage();
  return value?.[lang] || value?.es || '';
}

function cardToneClasses(tone) {
  const tones = {
    positive: {
      icon: 'text-eu-blue',
      title: 'text-eu-text',
      bulletHex: '#5620F6',
      item: 'text-gray-700',
      accentExtra: '',
    },
    negative: {
      icon: 'text-eu-purple',
      title: 'text-eu-purple',
      bulletHex: '#4918AD',
      item: 'text-eu-purple',
      accentExtra: 'rd-accent-purple rd-card-tint',
    },
    neutral: {
      icon: 'text-eu-blue',
      title: 'text-eu-text',
      bulletHex: '#5620F6',
      item: 'text-gray-700',
      accentExtra: '',
    },
  };

  return tones[tone] || tones.neutral;
}

function enredToneClasses(tone) {
  const tones = {
    institutional: {
      title: 'text-eu-blue',
      accent: '',
      pillBg: 'rgb(86 32 246 / .07)',
      pillColor: '#5620F6',
    },
    thematic: {
      title: 'text-eu-purple',
      accent: 'rd-accent-purple',
      pillBg: 'rgb(73 24 173 / .08)',
      pillColor: '#4918AD',
    },
    neutral: {
      title: 'text-eu-blue',
      accent: '',
      pillBg: 'rgb(86 32 246 / .07)',
      pillColor: '#5620F6',
    },
  };

  return tones[tone] || tones.neutral;
}

function ecosystemToneClasses(tone) {
  const tones = {
    teal: {
      border: 'border-eu-blue',
      icon: 'bg-eu-blue',
      tag: 'text-eu-blue',
    },
    blue: {
      border: 'border-eu-blue',
      icon: 'bg-eu-blue',
      tag: 'text-eu-blue',
    },
    orange: {
      border: 'border-eu-purple',
      icon: 'bg-eu-purple',
      tag: 'text-eu-blue',
    },
    purple: {
      border: 'border-eu-purple',
      icon: 'bg-eu-purple',
      tag: 'text-eu-purple',
    },
    neutral: {
      border: 'border-eu-border',
      icon: 'bg-gray-600',
      tag: 'text-gray-600',
    },
  };

  return tones[tone] || tones.neutral;
}

function renderIsNotBlock() {
  const block = HOME_CONFIG.isNotBlock;
  if (!block?.visible) return '';

  const cards = (block.cards || []).map(card => {
    const tone = cardToneClasses(card.tone);
    const items = (card.items || []).map(item => `
      <li class="flex items-start gap-3 text-base font-medium ${tone.item}">
        <div style="width:9px;height:9px;border-radius:9999px;background:${tone.bulletHex};margin-top:9px;flex-shrink:0"></div><span>${localized(item.html)}</span>
      </li>
    `).join('');

    return `
      <div class="rd-card rd-card-grad-violet rd-card-accent rd-card-edge ${tone.accentExtra} rd-pad group">
        <div class="flex items-center gap-3 mb-8">
          <div class="rd-icon-circle-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" style="background:#ffffff"><i data-lucide="${card.icon}" class="w-5 h-5 ${tone.icon}"></i></div>
          <h3 class="font-extrabold ${tone.title} text-xl">${localized(card.title)}</h3>
        </div>
        <ul class="space-y-5">${items}</ul>
      </div>
    `;
  }).join('');

  if (!cards) return '';

  return `
    <section class="px-6 rd-canvas rd-section rd-divide">
      <div class="max-w-7xl mx-auto">
        <h2 class="mb-12">${localized(block.heading)}</h2>
        <div class="grid gap-8" style="grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));">
          ${cards}
        </div>
      </div>
    </section>
  `;
}

function renderEnredBlock() {
  const block = HOME_CONFIG.enredBlock;
  if (!block?.visible) return '';

  const cards = (block.cards || []).map(card => {
    const tone = enredToneClasses(card.tone);
    const pills = (card.pills || []).map(pill =>
      `<span class="font-semibold rounded-full" style="font-size:.8125rem;padding:.3rem .85rem;background:${tone.pillBg};color:${tone.pillColor}">${localized(pill.html)}</span>`
    ).join('');

    return `
      <div class="flex-1 rd-card rd-card-grad-violet rd-card-accent rd-card-edge ${tone.accent} rd-pad">
        <p class="text-xs font-bold uppercase ${tone.title} mb-4" style="letter-spacing:.15em">${localized(card.title)}</p>
        <div class="flex flex-wrap gap-2">${pills}</div>
      </div>
    `;
  });

  if (cards.length === 0) return '';

  const connector = block.connector?.visible ? `
    <div class="flex flex-col items-center justify-center gap-1 shrink-0 py-4">
      <i data-lucide="${block.connector.icon || 'link-2'}" class="w-6 h-6 text-eu-blue/50"></i>
      <span class="text-xs font-bold text-eu-blue/50 uppercase tracking-wider hidden md:block" style="writing-mode:vertical-rl;transform:rotate(180deg)">${localized(block.connector.label)}</span>
    </div>
  ` : '';

  const body = cards.length === 1
    ? cards[0]
    : `${cards[0]}${connector}${cards.slice(1).join('')}`;

  const description = block.description?.visible
    ? `<p class="mt-8 w-full leading-relaxed" style="font-size:1.1875rem;color:rgba(30,27,75,.74)">${localized(block.description.html)}</p>`
    : '';

  return `
    <section class="px-6 rd-canvas rd-section rd-divide">
      <div class="max-w-7xl mx-auto">
        <h2 class="mb-10">${localized(block.heading)}</h2>
        <div class="flex flex-col md:flex-row items-stretch gap-4">
          ${body}
        </div>
        ${description}
      </div>
    </section>
  `;
}

function renderEcosystemBlock() {
  const block = HOME_CONFIG.ecosystemBlock;
  if (!block?.visible) return '';

  const cards = (block.cards || []).map(card => {
    // La card "activa" es el portal actual (sin enlace externo).
    const isActive = !card.href;
    const initialsStyle = isActive
      ? 'background:linear-gradient(135deg,#5620F6,#4918AD);color:#fff'
      : 'background:#FFF4E1;color:#4918AD';
    const tagStyle = isActive
      ? 'background:#5620F6;color:#fff'
      : 'background:rgb(86 32 246 / .07);color:#5620F6';
    const tag = card.tag?.visible
      ? `<span class="self-start text-sm font-bold rounded-full" style="padding:.35rem 1rem;${tagStyle}">${localized(card.tag.html)}</span>`
      : '';
    const attrs = card.href
      ? `href="${card.href}"${card.target ? ` target="${card.target}"` : ''}${card.target === '_blank' ? ' rel="noopener noreferrer"' : ''}`
      : '';
    const element = card.href ? 'a' : 'div';
    const cardStyle = isActive ? ' style="background:linear-gradient(to bottom,#ffffff 0%,#FFF4E1 100%)"' : '';
    const activeBorder = isActive ? ' border-2 border-eu-purple' : '';
    const cursor = card.href ? ' cursor-pointer' : '';

    return `
      <${element} ${attrs} class="rd-card rd-card-grad-violet rd-card-hover rd-pad flex flex-col${activeBorder}${cursor}"${cardStyle}>
        <div class="flex items-center gap-4 mb-6">
          <div class="flex items-center justify-center font-extrabold text-lg shrink-0" style="width:3.5rem;height:3.5rem;border-radius:1rem;${initialsStyle}">${card.initials}</div>
          <div>
            <p class="font-extrabold text-eu-purple text-xl">${localized(card.title)}</p>
            <p class="text-sm text-gray-500 mt-0.5">${localized(card.subtitle)}</p>
          </div>
        </div>
        <p class="text-lg text-gray-600 flex-1 mb-8 leading-relaxed">${localized(card.description)}</p>
        ${tag}
      </${element}>
    `;
  }).join('');

  if (!cards) return '';

  const description = block.description?.visible
    ? `<p class="text-lg text-gray-600 mb-8 max-w-3xl leading-relaxed">${localized(block.description.html)}</p>`
    : '';

  return `
    <section class="px-6 rd-canvas rd-section rd-divide">
      <div class="max-w-7xl mx-auto">
        <h2 class="mb-4">${localized(block.heading)}</h2>
        ${description}
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          ${cards}
        </div>
      </div>
    </section>
  `;
}

function dualFocusToneClasses(tone) {
  // Solo gama violeta corporativa (sin naranja/colores de advertencia).
  const tones = {
    orange: {
      coordinator: 'text-eu-blue',
      bulletHex: '#5620F6',
      headerBg: 'bg-eu-blue',
      bodyGrad: 'rd-card-grad-blue',
      initialsColor: '#5620F6',
    },
    purple: {
      coordinator: 'text-eu-purple',
      bulletHex: '#4918AD',
      headerBg: 'bg-eu-purple',
      bodyGrad: 'rd-card-grad-beige',
      initialsColor: '#4918AD',
    },
    neutral: {
      coordinator: 'text-eu-blue',
      bulletHex: '#5620F6',
      headerBg: 'bg-eu-blue',
      bodyGrad: 'rd-card-grad-blue',
      initialsColor: '#5620F6',
    },
  };

  return tones[tone] || tones.neutral;
}

function renderDualFocusBlock() {
  const block = HOME_CONFIG.dualFocusBlock;
  if (!block?.visible) return '';

  const cards = (block.cards || []).map(card => {
    const tone = dualFocusToneClasses(card.tone);
    const items = (card.items || []).map(item => `
      <li class="flex items-center gap-3 text-base font-semibold text-eu-text">
        <div style="width:10px;height:10px;border-radius:9999px;background:${tone.bulletHex};flex-shrink:0"></div>
        <span>${localized(item.html)}</span>
      </li>
    `).join('');

    return `
      <div class="rd-card rd-card-edge rd-card-xl rd-card-hover flex flex-col overflow-hidden">
        <div class="${tone.headerBg} text-white px-10 py-7 flex items-center gap-5">
          <div class="flex items-center justify-center font-extrabold text-2xl shrink-0 bg-white/20" style="width:4rem;height:4rem;border-radius:1rem;color:#fff">${card.initials}</div>
          <div>
            <h3 class="font-extrabold text-white text-2xl leading-tight">${localized(card.title)}</h3>
            <p class="text-base text-white/80 font-bold mt-0.5">${localized(card.coordinator)}</p>
          </div>
        </div>
        <div class="rd-pad-l ${tone.bodyGrad} flex-1">
          <p class="text-lg text-gray-600 mb-10 leading-relaxed">${localized(card.description)}</p>
          <ul class="space-y-4">${items}</ul>
        </div>
      </div>
    `;
  }).join('');

  if (!cards) return '';

  const description = block.description?.visible
    ? `<p class="text-lg text-gray-600 mb-8 max-w-3xl leading-relaxed">${localized(block.description.html)}</p>`
    : '';

  return `
    <section class="px-6 rd-canvas rd-section rd-divide">
      <div class="max-w-7xl mx-auto">
        <h2 class="mb-4">${localized(block.heading)}</h2>
        ${description}
        <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
          ${cards}
        </div>
      </div>
    </section>
  `;
}

const SECTOR_ICONS = {
  mfg: 'factory',
  mob: 'car',
  ene: 'zap',
  agr: 'wheat',
  cci: 'palette',
  hou: 'home',
  nts: 'building-2',
};

function renderSectorsBlock() {
  const block = HOME_CONFIG.sectorsBlock;
  if (!block?.visible) return '';

  const cards = (block.cards || []).map(card => {
    const icon = SECTOR_ICONS[card.id] || 'shapes';
    return `
    <button data-nav="sectores" class="rd-card rd-card-grad-violet rd-card-hover flex flex-col items-center justify-center text-center cursor-pointer group" style="padding:2rem 1rem" aria-label="${localized(card.label)}">
      <div class="rd-icon-circle mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" style="background:#ffffff">
        <i data-lucide="${icon}" class="w-6 h-6 text-eu-blue"></i>
      </div>
      <span class="text-sm font-bold text-eu-text leading-tight">${localized(card.label)}</span>
    </button>
  `;
  }).join('');

  if (!cards) return '';

  const description = block.description?.visible
    ? `<p class="text-lg text-gray-600 leading-relaxed">${localized(block.description.html)}</p>`
    : '';

  const viewAll = block.viewAll?.visible
    ? `<div class="mt-10 flex justify-center">
        <button data-nav="sectores" class="inline-flex items-center gap-2 rounded-full bg-eu-blue text-white px-8 py-3.5 font-bold text-sm hover:bg-eu-purple transition-colors cursor-pointer shadow-sm focus:outline-none focus:ring-2 focus:ring-eu-blue focus:ring-offset-2">
          ${localized(block.viewAll.html)} <i data-lucide="arrow-right" class="w-4 h-4"></i>
        </button>
      </div>`
    : '';

  return `
    <section class="px-6 rd-canvas rd-section rd-divide">
      <div class="max-w-7xl mx-auto">
        <div class="mb-12">
          <h2 class="mb-2">${localized(block.heading)}</h2>
          ${description}
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">${cards}</div>
        ${viewAll}
      </div>
    </section>
  `;
}

function renderConsortiumBlock() {
  const block = HOME_CONFIG.consortiumBlock;
  if (!block?.visible) return '';

  const LOGO_BASE = 'assets/images/partners/';
  const partnersHtml = (block.partners || []).map(p => {
    const initials = p.acronym
      ? p.acronym.slice(0, 3).toUpperCase()
      : (p.name || '').split(' ').map(w => w[0]).join('').slice(0, 3).toUpperCase();
    const inner = p.logo
      ? `<img src="${LOGO_BASE}${p.logo}" alt="${p.acronym || p.name}" style="max-height:44px;max-width:140px;width:auto;height:auto;object-fit:contain;display:block;" loading="lazy" />`
      : `<span style="font-size:13px;font-weight:700;color:#6b7280;letter-spacing:0.05em;">${initials}</span>`;
    return `<div title="${p.name}" class="h-[68px] min-w-[100px] max-w-[180px] flex items-center justify-center px-[18px] py-[10px] overflow-hidden bg-white border border-gray-200 rounded-[10px] shrink-0 transition-all duration-300 hover:scale-105 hover:border-eu-purple hover:shadow-[0_4px_12px_rgba(73,24,173,0.15)]">${inner}</div>`;
  }).join('');

  return `
    <section class="px-6 rd-canvas rd-section rd-divide">
      <div class="max-w-7xl mx-auto">
        <div class="rd-hero-gradient rounded-[2rem] p-10 md:p-12 text-white text-center">
          <h2 class="mb-12 text-center text-3xl font-extrabold tracking-tight" style="color:#FFF4E1">${localized(block.heading)}</h2>
          <div style="display:flex;flex-wrap:wrap;justify-content:center;gap:14px;align-items:center;">${partnersHtml}</div>
        </div>
      </div>
    </section>
  `;
}

function renderHeroBlock() {
  const hero = HOME_CONFIG.heroBlock;
  if (!hero?.visible) return '';
  const lang = getLanguage();
  const loc = v => v?.[lang] || v?.es || '';
  const stats = hero.stats || [];
  const statsHtml = stats.map((s, i) => {
    const isOddLast = (i === stats.length - 1) && (stats.length % 2 === 1);
    const spanStyle = isOddLast ? 'grid-column:1 / -1;' : '';
    return `
    <div class="rd-hero-stat flex flex-col" style="${spanStyle}">
      <i data-lucide="${s.icon}" class="w-6 h-6 mb-4" style="color:#FFF4E1"></i>
      <div class="text-4xl font-extrabold text-white leading-none mb-2">${s.value}</div>
      <div class="text-xs font-bold uppercase tracking-wider" style="color:rgba(255,244,225,.75)">${loc(s.label)}</div>
    </div>`;
  }).join('');
  const requestJoinButton = hero.buttons?.requestJoin?.visible !== false
    ? `<button data-nav="red" data-membership-cta="true" class="rounded-full font-bold transition-all" style="border:2px solid rgba(255,255,255,.35);color:white;padding:.875rem 2rem">
        ${loc(hero.buttons?.requestJoin)}
      </button>`
    : '';
  return `
    <section class="rd-hero-gradient rd-hero-fill text-white px-6 py-20">
      <div class="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <div>
          <span class="inline-block bg-white/10 border border-white/20 font-bold text-xs uppercase tracking-widest px-4 py-1.5 rounded-full mb-8" style="color:#FFF4E1;backdrop-filter:blur(8px)">
            ${loc(hero.badge)}
          </span>
          <h1 class="font-extrabold mb-6" style="color:#FFF4E1;letter-spacing:-.025em;font-size:clamp(2.75rem,5vw,4.25rem);line-height:1.05;max-width:14ch">${loc(hero.title)}</h1>
          <p class="text-2xl font-semibold mb-5" style="color:#FFF4E1">${loc(hero.subtitle)}</p>
          <p class="text-lg mb-5 max-w-2xl leading-relaxed border-l-4 pl-4" style="color:rgba(255,255,255,.9);border-color:rgba(255,244,225,.4)">${loc(hero.heroTagline)}</p>
          <p class="text-base mb-10 max-w-2xl leading-relaxed" style="color:rgba(255,255,255,.7)">${loc(hero.description)}</p>
          <div class="flex flex-wrap gap-4">
            <button data-nav="banco-retos" class="rounded-full font-bold flex items-center gap-2 transition-all hover:scale-105" style="background:#FFF4E1;color:#4918AD;padding:.875rem 2rem">
              ${loc(hero.buttons?.uploadChallenge)} <i data-lucide="arrow-right" class="w-4 h-4"></i>
            </button>
            ${requestJoinButton}
          </div>
        </div>
        <div class="grid grid-cols-2 gap-5">${statsHtml}</div>
      </div>
    </section>
  `;
}

export function render() {
  return `
    <div>
      <!-- Hero -->
      ${renderHeroBlock()}

      <!-- Is / Is Not -->
      ${renderIsNotBlock()}

      <!-- ENRED → AI-STEAM -->
      ${renderEnredBlock()}

      <!-- Ecosystem -->
      ${renderEcosystemBlock()}

      <!-- 7 Sectors -->
      ${renderSectorsBlock()}

      <!-- Dual Focus -->
      ${renderDualFocusBlock()}

      <!-- Partners -->
      ${renderConsortiumBlock()}
    </div>
  `;
}

export function mount() {
  document.querySelectorAll('[data-nav]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.dataset.membershipCta === 'true') {
        setState('networkTab', 'stakeholders');
        setState('networkShowForm', true);
        setState('networkCategory', 'todos');
        setState('networkSector', 'todos');
        setState('networkSearch', '');
        setState('networkPage', 0);
      }
      navigateTo(btn.dataset.nav);
    });
  });
}
