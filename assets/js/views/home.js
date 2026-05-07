import { t } from '../i18n.js';
import { navigateTo } from '../router.js';

const SECTORS = [
  { id: 'ind', emoji: '⚙️' },
  { id: 'sal', emoji: '🏥' },
  { id: 'med', emoji: '🌿' },
  { id: 'edu', emoji: '🎓' },
  { id: 'agr', emoji: '🌾' },
  { id: 'tur', emoji: '🏛️' },
  { id: 'adm', emoji: '🏛' },
];

const STATS = [
  { key: 'stakeholders',      value: '142',   icon: 'users' },
  { key: 'totalChallenges',   value: '127',   icon: 'zap' },
  { key: 'consortiumMembers', value: '23',    icon: 'book-open' },
  { key: 'microCredentials',  value: '1.200', icon: 'award' },
  { key: 'countries',         value: '12',    icon: 'globe' },
  { key: 'trainingModules',   value: '68',    icon: 'layers' },
];

const PARTNERS = ['UVEG','CEICE','UMU','UPV','NTNU','HSW','FIDIT','INESC','TUV.IT','JOIST','C-LINK','LC','COGN','ESAD-GV','IF.E',"Ud'A",'LPGA','VARM','CINK','KEA','PREDA','RCE'];

function statusClass(status) {
  const open = ['Abierto','Open','Obert'];
  const inProg = ['En Resolución','In Progress','En Resolució'];
  if (open.includes(status)) return 'open';
  if (inProg.includes(status)) return 'inProgress';
  return 'resolved';
}

export function render() {
  const isNotBlock = t('home.isNotBlock') || {};
  const enredBlock = t('home.enredBlock') || {};
  const challenges = t('home.latestChallengesData') || [];
  const sectorNames = t('marketplace.sectorNames') || {};

  const statsHtml = STATS.map(s => `
    <div class="bg-white/10 backdrop-blur rounded-xl p-5 flex flex-col">
      <i data-lucide="${s.icon}" class="w-5 h-5 text-eu-yellow mb-2"></i>
      <div class="text-3xl font-extrabold text-white leading-none mb-1">${s.value}</div>
      <div class="text-xs text-white/70 font-semibold uppercase tracking-wide">${t('home.stats.' + s.key)}</div>
    </div>
  `).join('');

  const isItems = (isNotBlock.isItems || []).map(item => `
    <li class="flex items-start gap-2 text-sm text-green-900">
      <span class="w-1.5 h-1.5 bg-green-600 rounded-full mt-1.5 shrink-0"></span>${item}
    </li>`).join('');

  const isNotItems = (isNotBlock.isNotItems || []).map(item => `
    <li class="flex items-start gap-2 text-sm text-red-900">
      <span class="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5 shrink-0"></span>${item}
    </li>`).join('');

  const enredTags = (enredBlock.enredTags || []).map(tag =>
    `<span class="text-xs bg-eu-bg border border-eu-border rounded px-2 py-1 text-gray-600">${tag}</span>`
  ).join('');

  const networkTags = (enredBlock.networkTags || []).map(tag =>
    `<span class="text-xs bg-eu-blue/10 border border-eu-blue/30 rounded px-2 py-1 text-eu-blue font-semibold">${tag}</span>`
  ).join('');

  const sectorsHtml = SECTORS.map(s => `
    <button data-nav="sectores" class="bg-white rounded-xl border border-eu-border p-4 flex flex-col items-center text-center hover:border-eu-blue hover:shadow-md transition-all cursor-pointer">
      <span class="text-3xl mb-2">${s.emoji}</span>
    </button>
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
      <section class="px-6 py-12 bg-white border-b border-eu-border">
        <div class="max-w-7xl mx-auto">
          <h2 class="text-2xl font-bold text-eu-text mb-8">${isNotBlock.heading || ''}</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-green-50 border border-green-200 rounded-xl p-6">
              <div class="flex items-center gap-2 mb-4">
                <i data-lucide="check-circle" class="w-5 h-5 text-green-600"></i>
                <h3 class="font-bold text-green-800 text-lg">${isNotBlock.isTitle || ''}</h3>
              </div>
              <ul class="space-y-3">${isItems}</ul>
            </div>
            <div class="bg-red-50 border border-red-200 rounded-xl p-6">
              <div class="flex items-center gap-2 mb-4">
                <i data-lucide="x-circle" class="w-5 h-5 text-red-600"></i>
                <h3 class="font-bold text-red-800 text-lg">${isNotBlock.isNotTitle || ''}</h3>
              </div>
              <ul class="space-y-3">${isNotItems}</ul>
            </div>
          </div>
        </div>
      </section>

      <!-- ENRED → AI-STEAM -->
      <section class="px-6 py-12 bg-eu-bg border-b border-eu-border">
        <div class="max-w-7xl mx-auto">
          <h2 class="text-2xl font-bold text-eu-text mb-6">${enredBlock.heading || ''}</h2>
          <div class="flex flex-col md:flex-row items-stretch gap-4">
            <div class="flex-1 bg-white rounded-xl border border-eu-border p-6 shadow-sm">
              <p class="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">${enredBlock.enredLabel || ''}</p>
              <div class="flex flex-wrap gap-2">${enredTags}</div>
            </div>
            <div class="flex flex-col items-center justify-center gap-1 shrink-0 py-4">
              <i data-lucide="link-2" class="w-6 h-6 text-eu-blue/50"></i>
              <span class="text-xs font-bold text-eu-blue/50 uppercase tracking-wider hidden md:block" style="writing-mode:vertical-rl;transform:rotate(180deg)">${enredBlock.synergyLabel || ''}</span>
            </div>
            <div class="flex-1 bg-white rounded-xl border-2 border-eu-blue p-6 shadow-md">
              <p class="text-xs font-bold uppercase tracking-widest text-eu-blue mb-3">${enredBlock.networkLabel || ''}</p>
              <div class="flex flex-wrap gap-2">${networkTags}</div>
            </div>
          </div>
          <p class="mt-6 text-sm text-gray-600 max-w-3xl leading-relaxed">${enredBlock.desc || ''}</p>
        </div>
      </section>

      <!-- Ecosystem -->
      <section class="px-6 py-12 bg-white border-b border-eu-border">
        <div class="max-w-7xl mx-auto">
          <h2 class="text-2xl font-bold text-eu-text mb-2">${t('home.ecosystem')}</h2>
          <p class="text-gray-600 mb-8 max-w-2xl">${t('home.ecosystemDesc')}</p>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <a href="https://aules.edu.gva.es/" target="_blank" rel="noopener noreferrer" class="bg-white rounded-xl border-t-4 border-eu-teal border border-eu-border p-6 shadow-sm flex flex-col hover:shadow-lg transition-all cursor-pointer">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-10 h-10 bg-eu-teal rounded-lg flex items-center justify-center text-white font-bold text-sm">AU</div>
                <div>
                  <p class="font-bold text-eu-text">${t('home.platforms.aules.name')}</p>
                  <p class="text-xs text-gray-500">${t('home.platforms.aules.subtitle')}</p>
                </div>
              </div>
              <p class="text-sm text-gray-600 flex-1 mb-4">${t('home.platforms.aules.desc')}</p>
              <span class="self-start text-xs font-bold px-2 py-1 bg-eu-bg rounded text-eu-teal">${t('home.platforms.aules.tag')}</span>
            </a>
            <div class="bg-white rounded-xl border-t-4 border-eu-blue border border-eu-border p-6 shadow-sm flex flex-col">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-10 h-10 bg-eu-blue rounded-lg flex items-center justify-center text-white font-bold text-sm">AI</div>
                <div>
                  <p class="font-bold text-eu-text">${t('home.platforms.network.name')}</p>
                  <p class="text-xs text-gray-500">${t('home.platforms.network.subtitle')}</p>
                </div>
              </div>
              <p class="text-sm text-gray-600 flex-1 mb-4">${t('home.platforms.network.desc')}</p>
              <span class="self-start text-xs font-bold px-2 py-1 bg-eu-bg rounded text-eu-teal">${t('home.platforms.network.tag')}</span>
            </div>
            <div class="bg-white rounded-xl border-t-4 border-eu-orange border border-eu-border p-6 shadow-sm flex flex-col">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-10 h-10 bg-eu-orange rounded-lg flex items-center justify-center text-white font-bold text-sm">CO</div>
                <div>
                  <p class="font-bold text-eu-text">${t('home.platforms.consensUE.name')}</p>
                  <p class="text-xs text-gray-500">${t('home.platforms.consensUE.subtitle')}</p>
                </div>
              </div>
              <p class="text-sm text-gray-600 flex-1 mb-4">${t('home.platforms.consensUE.desc')}</p>
              <span class="self-start text-xs font-bold px-2 py-1 bg-eu-bg rounded text-eu-teal">${t('home.platforms.consensUE.tag')}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- 7 Sectors -->
      <section class="px-6 py-12 bg-eu-bg">
        <div class="max-w-7xl mx-auto">
          <div class="flex items-center justify-between mb-8">
            <div>
              <h2 class="text-2xl font-bold text-eu-text mb-1">${t('home.sectors')}</h2>
              <p class="text-gray-600 text-sm">${t('home.sectorsDesc')}</p>
            </div>
            <button data-nav="sectores" class="hidden md:flex items-center gap-2 text-eu-blue font-bold text-sm hover:underline bg-transparent border-none cursor-pointer">
              ${t('home.viewAllSectors')} <i data-lucide="arrow-right" class="w-4 h-4"></i>
            </button>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">${sectorsHtml}</div>
        </div>
      </section>

      <!-- Dual Focus -->
      <section class="px-6 py-12 bg-white">
        <div class="max-w-7xl mx-auto">
          <h2 class="text-2xl font-bold text-eu-text mb-2">${t('home.dualFocus')}</h2>
          <p class="text-gray-600 mb-8 text-sm max-w-2xl">${t('home.dualFocusDesc')}</p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-linear-to-br from-orange-50 to-orange-100/50 border border-eu-yellow rounded-xl p-7">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-12 h-12 bg-eu-orange rounded-xl flex items-center justify-center text-white font-extrabold text-sm">FP</div>
                <div>
                  <h3 class="font-bold text-eu-text text-lg">${t('home.fp.title')}</h3>
                  <p class="text-xs text-eu-orange font-semibold">${t('home.fp.coordinator')}</p>
                </div>
              </div>
              <p class="text-sm text-gray-700 mb-5">${t('home.fp.desc')}</p>
              <ul class="space-y-2 text-sm text-gray-700">
                <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 bg-eu-orange rounded-full inline-block"></span> ${t('home.fp.item1')}</li>
                <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 bg-eu-orange rounded-full inline-block"></span> ${t('home.fp.item2')}</li>
                <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 bg-eu-orange rounded-full inline-block"></span> ${t('home.fp.item3')}</li>
                <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 bg-eu-orange rounded-full inline-block"></span> ${t('home.fp.item4')}</li>
              </ul>
            </div>
            <div class="bg-linear-to-br from-purple-50 to-purple-100/50 border border-purple-200 rounded-xl p-7">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center text-white font-extrabold text-sm">M</div>
                <div>
                  <h3 class="font-bold text-eu-text text-lg">${t('home.master.title')}</h3>
                  <p class="text-xs text-purple-600 font-semibold">${t('home.master.coordinator')}</p>
                </div>
              </div>
              <p class="text-sm text-gray-700 mb-5">${t('home.master.desc')}</p>
              <ul class="space-y-2 text-sm text-gray-700">
                <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 bg-purple-600 rounded-full inline-block"></span> ${t('home.master.item1')}</li>
                <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 bg-purple-600 rounded-full inline-block"></span> ${t('home.master.item2')}</li>
                <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 bg-purple-600 rounded-full inline-block"></span> ${t('home.master.item3')}</li>
                <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 bg-purple-600 rounded-full inline-block"></span> ${t('home.master.item4')}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

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
