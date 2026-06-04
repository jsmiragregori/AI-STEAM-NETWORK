import { t, getLanguage } from '../i18n.js';
import { navigateTo } from '../router.js';
import { setState } from '../state.js';
import { HOME_CONFIG } from '../../data/home.js';



function statusClass(status) {
  const open = ['Abierto','Open','Obert'];
  const inProg = ['En Resolución','In Progress','En Resolució'];
  if (open.includes(status)) return 'open';
  if (inProg.includes(status)) return 'inProgress';
  return 'resolved';
}

function localized(value) {
  const lang = getLanguage();
  return value?.[lang] || value?.es || '';
}

function cardToneClasses(tone) {
  const tones = {
    positive: {
      card: 'bg-green-50 border-green-200',
      icon: 'text-green-600',
      title: 'text-green-800',
      bullet: 'bg-green-600',
      item: 'text-green-900',
    },
    negative: {
      card: 'bg-red-50 border-red-200',
      icon: 'text-red-600',
      title: 'text-red-800',
      bullet: 'bg-red-500',
      item: 'text-red-900',
    },
    neutral: {
      card: 'bg-white border-eu-border',
      icon: 'text-eu-blue',
      title: 'text-eu-text',
      bullet: 'bg-eu-blue',
      item: 'text-gray-700',
    },
  };

  return tones[tone] || tones.neutral;
}

function enredToneClasses(tone) {
  const tones = {
    institutional: {
      card: 'bg-white border border-eu-border shadow-sm',
      title: 'text-gray-500',
      pill: 'bg-eu-bg border border-eu-border text-gray-600',
    },
    thematic: {
      card: 'bg-white border-2 border-eu-purple shadow-md',
      title: 'text-eu-purple',
      pill: 'bg-eu-purple/10 border border-eu-purple/30 text-eu-purple font-semibold',
    },
    neutral: {
      card: 'bg-white border border-eu-border shadow-sm',
      title: 'text-eu-text',
      pill: 'bg-eu-bg border border-eu-border text-gray-600',
    },
  };

  return tones[tone] || tones.neutral;
}

function ecosystemToneClasses(tone) {
  const tones = {
    teal: {
      border: 'border-eu-teal',
      icon: 'bg-eu-teal',
      tag: 'text-eu-teal',
    },
    blue: {
      border: 'border-eu-blue',
      icon: 'bg-eu-blue',
      tag: 'text-eu-teal',
    },
    orange: {
      border: 'border-eu-orange',
      icon: 'bg-eu-orange',
      tag: 'text-eu-teal',
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
      <li class="flex items-start gap-2 text-sm ${tone.item}">
        <span class="w-1.5 h-1.5 ${tone.bullet} rounded-full mt-1.5 shrink-0"></span><span>${localized(item.html)}</span>
      </li>
    `).join('');

    return `
      <div class="${tone.card} border rounded-xl p-6">
        <div class="flex items-center gap-2 mb-4">
          <i data-lucide="${card.icon}" class="w-5 h-5 ${tone.icon}"></i>
          <h3 class="font-bold ${tone.title} text-lg">${localized(card.title)}</h3>
        </div>
        <ul class="space-y-3">${items}</ul>
      </div>
    `;
  }).join('');

  if (!cards) return '';

  return `
    <section class="px-6 py-12 bg-eu-yellow">
      <div class="max-w-7xl mx-auto">
        <h2 class="text-3xl md:text-4xl font-extrabold tracking-tight text-eu-text mb-8">${localized(block.heading)}</h2>
        <div class="grid gap-6" style="grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));">
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
      `<span class="text-xs rounded px-2 py-1 ${tone.pill}">${localized(pill.html)}</span>`
    ).join('');

    return `
      <div class="flex-1 ${tone.card} rounded-xl p-6">
        <p class="text-xs font-bold uppercase tracking-widest ${tone.title} mb-3">${localized(card.title)}</p>
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
    ? `<p class="mt-6 text-sm text-gray-600 w-full leading-relaxed columns-1 lg:columns-2 gap-10 [column-fill:balance]">${localized(block.description.html)}</p>`
    : '';

  return `
    <section class="px-6 py-12 bg-white">
      <div class="max-w-7xl mx-auto">
        <h2 class="text-3xl md:text-4xl font-extrabold tracking-tight text-eu-text mb-6">${localized(block.heading)}</h2>
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
    const tone = ecosystemToneClasses(card.tone);
    const tag = card.tag?.visible
      ? `<span class="self-start text-xs font-bold px-2 py-1 bg-eu-bg rounded ${tone.tag}">${localized(card.tag.html)}</span>`
      : '';
    const attrs = card.href
      ? `href="${card.href}"${card.target ? ` target="${card.target}"` : ''}${card.target === '_blank' ? ' rel="noopener noreferrer"' : ''}`
      : '';
    const element = card.href ? 'a' : 'div';
    const interactive = card.href ? ' hover:shadow-lg transition-all cursor-pointer' : '';

    return `
      <${element} ${attrs} class="bg-white rounded-xl border-t-4 ${tone.border} border border-eu-border p-6 shadow-sm flex flex-col${interactive}">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 ${tone.icon} rounded-lg flex items-center justify-center text-white font-bold text-sm">${card.initials}</div>
          <div>
            <p class="font-bold text-eu-text">${localized(card.title)}</p>
            <p class="text-xs text-gray-500">${localized(card.subtitle)}</p>
          </div>
        </div>
        <p class="text-sm text-gray-600 flex-1 mb-4">${localized(card.description)}</p>
        ${tag}
      </${element}>
    `;
  }).join('');

  if (!cards) return '';

  const description = block.description?.visible
    ? `<p class="text-gray-600 mb-8 max-w-2xl">${localized(block.description.html)}</p>`
    : '';

  return `
    <section class="px-6 py-12 bg-eu-yellow">
      <div class="max-w-7xl mx-auto">
        <h2 class="text-3xl md:text-4xl font-extrabold tracking-tight text-eu-text mb-2">${localized(block.heading)}</h2>
        ${description}
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          ${cards}
        </div>
      </div>
    </section>
  `;
}

function dualFocusToneClasses(tone) {
  const tones = {
    orange: {
      card: 'bg-linear-to-br from-orange-50 to-orange-100/50 border-eu-yellow',
      icon: 'bg-eu-orange',
      coordinator: 'text-eu-orange',
      bullet: 'bg-eu-orange',
    },
    purple: {
      card: 'bg-linear-to-br from-purple-50 to-purple-100/50 border-purple-200',
      icon: 'bg-purple-600',
      coordinator: 'text-purple-600',
      bullet: 'bg-purple-600',
    },
    neutral: {
      card: 'bg-white border-eu-border',
      icon: 'bg-gray-600',
      coordinator: 'text-gray-600',
      bullet: 'bg-gray-600',
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
      <li class="flex items-center gap-2 text-sm text-gray-700">
        <span class="w-1.5 h-1.5 ${tone.bullet} rounded-full inline-block"></span>
        <span>${localized(item.html)}</span>
      </li>
    `).join('');

    return `
      <div class="${tone.card} border rounded-xl p-7">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-12 h-12 ${tone.icon} rounded-xl flex items-center justify-center text-white font-extrabold text-sm">${card.initials}</div>
          <div>
            <h3 class="font-bold text-eu-text text-lg">${localized(card.title)}</h3>
            <p class="text-xs ${tone.coordinator} font-semibold">${localized(card.coordinator)}</p>
          </div>
        </div>
        <p class="text-sm text-gray-700 mb-5">${localized(card.description)}</p>
        <ul class="space-y-2">${items}</ul>
      </div>
    `;
  }).join('');

  if (!cards) return '';

  const description = block.description?.visible
    ? `<p class="text-gray-600 mb-8 text-sm max-w-2xl">${localized(block.description.html)}</p>`
    : '';

  return `
    <section class="px-6 py-12 bg-eu-yellow">
      <div class="max-w-7xl mx-auto">
        <h2 class="text-3xl md:text-4xl font-extrabold tracking-tight text-eu-text mb-2">${localized(block.heading)}</h2>
        ${description}
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          ${cards}
        </div>
      </div>
    </section>
  `;
}

function renderLatestChallengesBlock() {
  const block = HOME_CONFIG.latestChallengesBlock;
  if (!block?.visible) return '';

  const contributions = block.cards || [];
  const sectorNames = t('marketplace.sectorNames') || {};

  const contributionsHtml = contributions.length === 0
    ? `<div class="col-span-3 flex flex-col items-center justify-center py-12 px-6 bg-white rounded-xl border border-eu-border border-dashed text-center">
        <i data-lucide="inbox" class="w-10 h-10 text-gray-300 mb-4"></i>
        <p class="text-gray-500 text-sm max-w-md">${localized(block.emptyState?.html)}</p>
      </div>`
    : contributions.map(ch => {
        const statusKey = statusClass(localized(ch.status));
        const statusLabel = t(`marketplace.${statusKey}`);
        const sectorLabel = sectorNames[ch.sectorCode] || ch.sectorCode;
        const typeLabel = localized(ch.contributionType);
        const levelLabel = localized(ch.level);
        const badgeText = `${typeLabel} (${levelLabel})`;
        const isFP = levelLabel === 'FP' || levelLabel === 'VET';
        const typeClass = isFP ? 'bg-eu-yellow text-eu-purple' : 'bg-purple-100 text-purple-800';
        return `
          <div class="bg-white rounded-xl border border-eu-border p-5 hover:border-eu-blue transition-colors shadow-sm">
            <div class="flex items-center justify-between mb-3">
              <span class="text-sm font-extrabold uppercase px-2 py-0.5 rounded ${typeClass}">${badgeText}</span>
              <span class="text-sm text-eu-teal font-bold">● ${statusLabel}</span>
            </div>
            <h3 class="font-bold text-eu-text text-sm mb-1 leading-snug">${localized(ch.title)}</h3>
            <p class="text-xs text-gray-500 mb-3">${localized(ch.org)}</p>
            <span class="text-sm bg-eu-bg border border-eu-border px-2 py-0.5 rounded text-gray-600 font-semibold">${sectorLabel}</span>
          </div>`;
      }).join('');

  const viewAll = block.viewAll?.visible
    ? `<button data-nav="banco-retos" class="flex items-center gap-2 text-eu-blue font-bold text-sm hover:underline bg-transparent border-none cursor-pointer">
        ${localized(block.viewAll.html)} <i data-lucide="arrow-right" class="w-4 h-4"></i>
      </button>`
    : '';

  return `
    <section class="px-6 py-12 bg-white">
      <div class="max-w-7xl mx-auto">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-3xl md:text-4xl font-extrabold tracking-tight text-eu-text">${localized(block.heading)}</h2>
          ${viewAll}
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-5">${contributionsHtml}</div>
      </div>
    </section>
  `;
}

function renderSectorsBlock() {
  const block = HOME_CONFIG.sectorsBlock;
  if (!block?.visible) return '';

  const cards = (block.cards || []).map(card => `
    <button data-nav="sectores" class="bg-white rounded-xl border border-eu-border p-4 flex flex-col items-center text-center hover:border-eu-blue hover:shadow-md transition-all cursor-pointer" aria-label="${localized(card.label)}">
      <span class="text-3xl mb-2" role="img" aria-hidden="true">${card.emoji}</span>
    </button>
  `).join('');

  if (!cards) return '';

  const description = block.description?.visible
    ? `<p class="text-gray-600 text-sm">${localized(block.description.html)}</p>`
    : '';

  const viewAll = block.viewAll?.visible
    ? `<button data-nav="sectores" class="hidden md:flex items-center gap-2 text-eu-blue font-bold text-sm hover:underline bg-transparent border-none cursor-pointer">
        ${localized(block.viewAll.html)} <i data-lucide="arrow-right" class="w-4 h-4"></i>
      </button>`
    : '';

  return `
    <section class="px-6 py-12 bg-white">
      <div class="max-w-7xl mx-auto">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h2 class="text-3xl md:text-4xl font-extrabold tracking-tight text-eu-text mb-1">${localized(block.heading)}</h2>
            ${description}
          </div>
          ${viewAll}
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">${cards}</div>
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
    return `<div title="${p.name}" style="height:68px;min-width:100px;max-width:180px;display:flex;align-items:center;justify-content:center;padding:10px 18px;overflow:hidden;background:white;border:1px solid #e5e7eb;border-radius:10px;flex-shrink:0;">${inner}</div>`;
  }).join('');

  return `
    <section class="px-6 py-10 bg-eu-yellow">
      <div class="max-w-7xl mx-auto">
        <p class="text-center text-xs font-bold uppercase tracking-[0.2em] text-eu-purple mb-6">${localized(block.heading)}</p>
        <div style="display:flex;flex-wrap:wrap;justify-content:center;gap:14px;align-items:center;">${partnersHtml}</div>
      </div>
    </section>
  `;
}

function renderHeroBlock() {
  const hero = HOME_CONFIG.heroBlock;
  if (!hero?.visible) return '';
  const lang = getLanguage();
  const loc = v => v?.[lang] || v?.es || '';
  const statsHtml = (hero.stats || []).map(s => `
    <div class="bg-white/15 backdrop-blur rounded-xl p-5 flex flex-col">
      <i data-lucide="${s.icon}" class="w-5 h-5 text-eu-yellow mb-2"></i>
      <div class="text-3xl font-extrabold text-white leading-none mb-1">${s.value}</div>
      <div class="text-xs text-white/70 font-semibold uppercase tracking-wide">${loc(s.label)}</div>
    </div>
  `).join('');
  const requestJoinButton = hero.buttons?.requestJoin?.visible !== false
    ? `<button data-nav="red" data-membership-cta="true" class="border-2 border-white/60 text-white px-6 py-3 rounded-sm font-bold uppercase tracking-wide hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-eu-purple">
        ${loc(hero.buttons?.requestJoin)}
      </button>`
    : '';
  return `
    <section class="bg-linear-to-br from-eu-blue to-eu-purple text-white px-6 py-16">
      <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div>
          <span class="inline-block bg-eu-yellow/20 text-eu-yellow font-bold text-xs uppercase tracking-[0.2em] px-3 py-1 rounded-full mb-4">
            ${loc(hero.badge)}
          </span>
          <h1 class="text-4xl lg:text-5xl font-extrabold leading-tight mb-3">${loc(hero.title)}</h1>
          <p class="text-lg font-semibold text-eu-yellow mb-4">${loc(hero.subtitle)}</p>
          <p class="text-base text-white/90 mb-4 max-w-xl leading-relaxed border-l-4 border-eu-yellow/60 pl-4">${loc(hero.heroTagline)}</p>
          <p class="text-sm text-white/70 mb-8 max-w-xl">${loc(hero.description)}</p>
          <div class="flex flex-wrap gap-3">
            <button data-nav="banco-retos" class="bg-eu-yellow text-eu-purple px-6 py-3 rounded-sm font-bold uppercase tracking-wide hover:bg-white transition-colors flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-eu-blue">
              ${loc(hero.buttons?.uploadChallenge)} <i data-lucide="arrow-right" class="w-4 h-4"></i>
            </button>
            ${requestJoinButton}
          </div>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">${statsHtml}</div>
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

      <!-- Latest Challenges -->
      ${renderLatestChallengesBlock()}

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
