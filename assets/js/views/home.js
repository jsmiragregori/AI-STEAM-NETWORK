import { t } from '../i18n.js';
import { getLanguage } from '../i18n.js';
import { navigateTo } from '../router.js';
import { HERO_CONFIG } from '../../data/hero.js';
import { HOME_CONFIG } from '../../data/home.js';


const PARTNERS = ['UVEG','CEICE','UMU','UPV','NTNU','HSW','FIDIT','INESC','TUV.IT','JOIST','C-LINK','LC','COGN','ESAD-GV','IF.E',"Ud'A",'LPGA','VARM','CINK','KEA','PREDA','RCE'];

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
    <section class="px-6 py-12 bg-white border-b border-eu-border">
      <div class="max-w-7xl mx-auto">
        <h2 class="text-2xl font-bold text-eu-text mb-8">${localized(block.heading)}</h2>
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
    <section class="px-6 py-12 bg-eu-bg border-b border-eu-border">
      <div class="max-w-7xl mx-auto">
        <h2 class="text-2xl font-bold text-eu-text mb-6">${localized(block.heading)}</h2>
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
    <section class="px-6 py-12 bg-white border-b border-eu-border">
      <div class="max-w-7xl mx-auto">
        <h2 class="text-2xl font-bold text-eu-text mb-2">${localized(block.heading)}</h2>
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
    <section class="px-6 py-12 bg-white">
      <div class="max-w-7xl mx-auto">
        <h2 class="text-2xl font-bold text-eu-text mb-2">${localized(block.heading)}</h2>
        ${description}
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          ${cards}
        </div>
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
    <section class="px-6 py-12 bg-eu-bg">
      <div class="max-w-7xl mx-auto">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h2 class="text-2xl font-bold text-eu-text mb-1">${localized(block.heading)}</h2>
            ${description}
          </div>
          ${viewAll}
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">${cards}</div>
      </div>
    </section>
  `;
}

export function render() {
  const challenges = t('home.latestChallengesData') || [];
  const sectorNames = t('marketplace.sectorNames') || {};

  const statsHtml = HERO_CONFIG.stats.map(s => `
    <div class="bg-white/10 backdrop-blur rounded-xl p-5 flex flex-col">
      <i data-lucide="${s.icon}" class="w-5 h-5 text-eu-yellow mb-2"></i>
      <div class="text-3xl font-extrabold text-white leading-none mb-1">${s.value}</div>
      <div class="text-xs text-white/70 font-semibold uppercase tracking-wide">${t(s.key)}</div>
    </div>
  `).join('');

  const challengesHtml = challenges.map(ch => {
    const statusKey = statusClass(ch.status);
    const statusLabel = t(`marketplace.${statusKey}`);
    const sectorLabel = sectorNames[ch.sectorCode] || ch.sectorCode;
    const levelClass = ch.level === 'FP' ? 'bg-eu-yellow text-eu-purple' : 'bg-purple-100 text-purple-800';
    return `
      <div class="bg-white rounded-xl border border-eu-border p-5 hover:border-eu-blue transition-colors shadow-sm">
        <div class="flex items-center justify-between mb-3">
          <span class="text-sm font-extrabold uppercase px-2 py-0.5 rounded ${levelClass}">${t('home.challengeLabel')} ${ch.level}</span>
          <span class="text-sm text-eu-teal font-bold">● ${statusLabel}</span>
        </div>
        <h3 class="font-bold text-eu-text text-sm mb-1 leading-snug">${ch.title}</h3>
        <p class="text-xs text-gray-500 mb-3">${ch.org}</p>
        <span class="text-sm bg-eu-bg border border-eu-border px-2 py-0.5 rounded text-gray-600 font-semibold">${sectorLabel}</span>
      </div>`;
  }).join('');

  const partnersHtml = PARTNERS.map(p =>
    `<div class="bg-eu-bg border border-eu-border rounded px-3 py-1.5 text-sm font-bold text-gray-600">${p}</div>`
  ).join('');

  return `
    <div>
      <!-- Hero -->
      <section class="bg-linear-to-br from-eu-blue to-eu-purple text-white px-6 py-16">
        <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <span class="inline-block bg-eu-yellow/20 text-eu-yellow font-bold text-xs uppercase tracking-widest px-3 py-1 rounded-full mb-4">
              ${t('home.badge')}
            </span>
            <h1 class="text-4xl lg:text-5xl font-extrabold leading-tight mb-3">${t('home.title')}</h1>
            <p class="text-lg font-semibold text-eu-yellow mb-4">${t('home.subtitle')}</p>
            <p class="text-base text-white/90 mb-4 max-w-xl leading-relaxed border-l-4 border-eu-yellow/60 pl-4">${t('home.heroTagline')}</p>
            <p class="text-sm text-white/70 mb-8 max-w-xl">${t('home.description')}</p>
            <div class="flex flex-wrap gap-3">
              <button data-nav="banco-retos" class="bg-eu-orange text-white px-6 py-3 rounded-md font-bold hover:bg-eu-purple transition-colors flex items-center gap-2">
                ${t('home.uploadChallenge')} <i data-lucide="arrow-right" class="w-4 h-4"></i>
              </button>
              <button data-nav="red" class="border-2 border-white/50 text-white px-6 py-3 rounded-md font-bold hover:bg-white/10 transition-colors">
                ${t('home.requestJoin')}
              </button>
            </div>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">${statsHtml}</div>
        </div>
      </section>

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
      <section class="px-6 py-12 bg-eu-bg border-t border-eu-border">
        <div class="max-w-7xl mx-auto">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold text-eu-text">${t('home.latestChallenges')}</h2>
            <button data-nav="banco-retos" class="flex items-center gap-2 text-eu-blue font-bold text-sm hover:underline bg-transparent border-none cursor-pointer">
              ${t('home.viewAll')} <i data-lucide="arrow-right" class="w-4 h-4"></i>
            </button>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-5">${challengesHtml}</div>
        </div>
      </section>

      <!-- Partners -->
      <section class="px-6 py-10 bg-white border-t border-eu-border">
        <div class="max-w-7xl mx-auto">
          <p class="text-center text-xs font-bold uppercase tracking-widest text-gray-500 mb-6">${t('home.consortium')} 23 ${t('home.members')} 12 ${t('home.countries2')}</p>
          <div class="flex flex-wrap justify-center gap-4 items-center">${partnersHtml}</div>
        </div>
      </section>
    </div>
  `;
}

export function mount() {
  document.querySelectorAll('[data-nav]').forEach(btn => {
    btn.addEventListener('click', () => navigateTo(btn.dataset.nav));
  });
}
