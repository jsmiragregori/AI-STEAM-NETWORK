import { t } from '../i18n.js';
import { navigateTo } from '../router.js';
import { getState, setState } from '../state.js';
import { SECTORS_CONFIG } from '../../data/sectors.js';

const SECTORS_META = [
  { id: 'mfg', emoji: '⚙️',  color: 'from-blue-700 to-blue-500',      borderColor: 'border-blue-600',  tagBg: 'bg-blue-100',   tagText: 'text-blue-800',   challenges: 23, partners: 23, courses: 14, stakeholders: 87,  featuredPartners: ['TUV.IT', 'JOIST', 'INESC TEC', 'Hochschule Wismar'] },
  { id: 'mob', emoji: '🚗',  color: 'from-eu-purple to-eu-blue',       borderColor: 'border-eu-purple', tagBg: 'bg-eu-yellow',  tagText: 'text-eu-purple',  challenges: 18, partners: 20, courses: 12, stakeholders: 65,  featuredPartners: ['NTNU', 'HSW', 'INESC TEC', 'CEICE'] },
  { id: 'ene', emoji: '⚡',  color: 'from-green-700 to-emerald-500',   borderColor: 'border-green-600', tagBg: 'bg-green-100',  tagText: 'text-green-800',  challenges: 19, partners: 22, courses: 9,  stakeholders: 102, featuredPartners: ['Region Värmland', 'PREDA', 'NTNU', 'INESC TEC'] },
  { id: 'agr', emoji: '🌾',  color: 'from-yellow-600 to-amber-400',    borderColor: 'border-yellow-500',tagBg: 'bg-yellow-100', tagText: 'text-yellow-800', challenges: 14, partners: 22, courses: 8,  stakeholders: 78,  featuredPartners: ['AVA-ASAJA', 'CINK', 'INESC TEC', 'UVEG'] },
  { id: 'cci', emoji: '🎨',  color: 'from-pink-600 to-fuchsia-400',    borderColor: 'border-pink-500',  tagBg: 'bg-pink-100',   tagText: 'text-pink-800',   challenges: 12, partners: 19, courses: 7,  stakeholders: 43,  featuredPartners: ['LPGA', 'C-LINK', 'KEA', 'ESAD-GV', 'RCE'] },
  { id: 'hou', emoji: '🏘️', color: 'from-red-600 to-rose-500',         borderColor: 'border-red-500',   tagBg: 'bg-red-100',    tagText: 'text-red-800',    challenges: 15, partners: 18, courses: 10, stakeholders: 91,  featuredPartners: ['HSW', 'NTNU', 'INESC TEC', 'CEICE'] },
  { id: 'nts', emoji: '🏢',  color: 'from-slate-600 to-gray-500',      borderColor: 'border-slate-500', tagBg: 'bg-slate-100',  tagText: 'text-slate-800',  challenges: 16, partners: 21, courses: 11, stakeholders: 56,  featuredPartners: ['CEICE', 'LC', 'COGN', 'FIDIT'] },
];

const CHAIN_ICONS = ['users', 'book-open', 'lightbulb', 'flask-conical', 'graduation-cap'];
const CHAIN_COLORS = [
  'bg-eu-blue/10 text-eu-blue border-eu-blue/20',
  'bg-eu-orange/10 text-eu-orange border-eu-orange/20',
  'bg-blue-50 text-blue-700 border-blue-200',
  'bg-green-50 text-green-700 border-green-200',
  'bg-purple-50 text-purple-700 border-purple-200',
];

function get(sectorsT, key, sectorId) {
  return sectorsT?.[key]?.[sectorId];
}

function renderExpanded(sector, sectorsT) {
  const keywords      = get(sectorsT, 'sectorKeywords', sector.id) || [];
  const fpSkills      = get(sectorsT, 'sectorFpModules', sector.id) || [];
  const masterBridge  = get(sectorsT, 'sectorMasterTopics', sector.id) || [];
  const stakeholderTypes = get(sectorsT, 'sectorStakeholderTypes', sector.id) || [];
  const teacherRelevance = get(sectorsT, 'sectorTeacherRelevance', sector.id) || '';
  const exampleChallenge = get(sectorsT, 'sectorExampleChallenge', sector.id) || '';
  const description   = get(sectorsT, 'sectorDescriptions', sector.id) || '';
  const chainLabels   = sectorsT?.transferChainLabels || {};

  const chainItems = [
    { label: chainLabels.stakeholderNeed, value: stakeholderTypes[0] || '—' },
    { label: chainLabels.fpSkill,         value: fpSkills[0] || '—' },
    { label: chainLabels.teacherUse,      value: teacherRelevance },
    { label: chainLabels.evidence,        value: exampleChallenge },
    { label: chainLabels.masterBridge,    value: masterBridge[0] || '—' },
  ];

  const chainHtml = chainItems.map((item, i) => `
    <div class="flex items-start gap-1.5">
      <div class="flex flex-col gap-1 border rounded-lg px-3 py-2 min-w-32.5 max-w-50 ${CHAIN_COLORS[i]}">
        <div class="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide">
          <i data-lucide="${CHAIN_ICONS[i]}" class="w-4 h-4"></i>
          ${item.label || ''}
        </div>
        <p class="text-xs leading-snug">${item.value}</p>
      </div>
      ${i < chainItems.length - 1 ? '<i data-lucide="arrow-right" class="w-4 h-4 text-gray-400 mt-3 shrink-0"></i>' : ''}
    </div>
  `).join('');

  const stakeholderHtml = stakeholderTypes.map(s => `
    <li class="text-xs text-gray-700 flex items-start gap-1.5">
      <i data-lucide="arrow-right" class="w-3 h-3 text-eu-blue mt-0.5 shrink-0"></i>${s}
    </li>`).join('');

  const keywordsHtml = keywords.map(kw =>
    `<span class="text-xs font-semibold px-2 py-0.5 rounded-full ${sector.tagBg} ${sector.tagText}">${kw}</span>`
  ).join('');

  const fpHtml = fpSkills.map(m => `
    <li class="text-xs text-gray-700 flex items-start gap-2">
      <i data-lucide="arrow-right" class="w-3 h-3 text-eu-orange mt-0.5 shrink-0"></i>${m}
    </li>`).join('');

  const masterHtml = masterBridge.map(topic => `
    <li class="text-xs text-gray-700 flex items-start gap-2">
      <i data-lucide="arrow-right" class="w-3 h-3 text-purple-600 mt-0.5 shrink-0"></i>${topic}
    </li>`).join('');

  const partnersHtml = sector.featuredPartners.map(p =>
    `<span class="text-xs bg-eu-bg border border-eu-border px-1.5 py-0.5 rounded text-gray-600 font-bold">${p}</span>`
  ).join('');

  return `
    <div class="border-t border-eu-border px-6 py-6 bg-eu-bg space-y-6">
      <!-- Transfer Chain -->
      <div class="bg-white rounded-xl border border-eu-border p-5">
        <h4 class="font-bold text-eu-text text-sm mb-4">${sectorsT?.transferChainTitle || ''}</h4>
        <div class="flex flex-wrap items-start gap-2">${chainHtml}</div>
      </div>

      <!-- Detail Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Col 1: Stakeholders + keywords -->
        <div class="space-y-3">
          <div class="bg-white rounded-lg border border-eu-border p-4">
            <h4 class="font-bold text-eu-text text-sm mb-2 flex items-center gap-2">
              <i data-lucide="users" class="w-4 h-4 text-eu-blue"></i>
              ${sectorsT?.stakeholderTypesLabel || ''}
            </h4>
            <ul class="space-y-1">${stakeholderHtml}</ul>
          </div>
          <div class="bg-white rounded-lg border border-eu-border p-4">
            <p class="text-xs text-gray-700 mb-3">${description}</p>
            <div class="flex flex-wrap gap-1.5">${keywordsHtml}</div>
          </div>
        </div>

        <!-- Col 2: FP skills + teacher relevance -->
        <div class="space-y-3">
          <div class="bg-white rounded-lg border border-eu-border p-4">
            <h4 class="font-bold text-eu-text text-sm mb-3 flex items-center gap-2">
              <i data-lucide="book-open" class="w-4 h-4 text-eu-orange"></i>
              ${sectorsT?.fpModulesLabel || ''}
            </h4>
            <ul class="space-y-2">${fpHtml}</ul>
          </div>
          <div class="bg-white rounded-lg border border-eu-border p-4">
            <h4 class="font-bold text-eu-text text-sm mb-2 flex items-center gap-2">
              <i data-lucide="lightbulb" class="w-4 h-4 text-blue-600"></i>
              ${sectorsT?.teacherRelevanceLabel || ''}
            </h4>
            <p class="text-xs text-gray-700">${teacherRelevance}</p>
          </div>
        </div>

        <!-- Col 3: Master bridge + partners + example -->
        <div class="space-y-3">
          <div class="bg-white rounded-lg border border-purple-100 p-4">
            <h4 class="font-bold text-eu-text text-sm mb-3 flex items-center gap-2">
              <i data-lucide="graduation-cap" class="w-4 h-4 text-purple-600"></i>
              ${sectorsT?.masterTopicsLabel || ''}
            </h4>
            <ul class="space-y-2">${masterHtml}</ul>
            <div class="mt-3 pt-3 border-t border-eu-border">
              <p class="text-xs text-gray-500 font-semibold uppercase mb-1.5">${sectorsT?.featuredPartnersLabel || ''}</p>
              <div class="flex flex-wrap gap-1">${partnersHtml}</div>
            </div>
          </div>
          <div class="bg-amber-50 rounded-lg border border-amber-200 p-4">
            <h4 class="font-bold text-amber-800 text-xs mb-1.5 flex items-center gap-1.5">
              <i data-lucide="flask-conical" class="w-3.5 h-3.5"></i>
              ${sectorsT?.exampleChallengeLabel || ''}
            </h4>
            <p class="text-xs text-amber-700 italic">${exampleChallenge}</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

function getLang() {
  return localStorage.getItem('language') || 'es';
}

function localized(label) {
  if (!label) return '';
  if (typeof label === 'string') return label;
  return label[getLang()] || label.es || '';
}

export function render() {
  const sectorsT = t('sectors') || {};
  const expanded = getState('expandedSector');

  const hero = SECTORS_CONFIG?.heroBlock;
  const heroTitle = hero?.title || {};
  const heroDescription = hero?.description || {};
  const heroStats = hero?.stats || [];

  const cardsHtml = SECTORS_META.map(sector => {
    const isOpen = expanded === sector.id;
    const name        = get(sectorsT, 'sectorNames', sector.id) || sector.id;
    const description = get(sectorsT, 'sectorDescriptions', sector.id) || '';
    const sectorLabels = sectorsT?.sectorLabels || {};

    return `
      <div class="bg-white rounded-xl border ${sector.borderColor} border-l-4 shadow-sm overflow-hidden transition-all">
        <button data-toggle="${sector.id}" class="w-full flex items-center gap-4 p-5 text-left hover:bg-eu-bg transition-colors">
          <span class="text-4xl">${sector.emoji}</span>
          <div class="flex-1 min-w-0">
            <h2 class="text-lg font-bold text-eu-text">${name}</h2>
            <p class="text-sm text-gray-600 line-clamp-1">${description}</p>
          </div>
          <div class="hidden sm:flex items-center gap-6 shrink-0">
            <div class="text-center">
              <p class="text-xl font-extrabold text-eu-teal">${sector.challenges}</p>
              <p class="text-xs text-gray-500 uppercase font-semibold">${sectorLabels.challenges || ''}</p>
            </div>
            <div class="text-center">
              <p class="text-xl font-extrabold text-eu-blue">${sector.partners}</p>
              <p class="text-xs text-gray-500 uppercase font-semibold">${sectorLabels.partners || ''}</p>
            </div>
            <div class="text-center">
              <p class="text-xl font-extrabold text-purple-600">${sector.stakeholders}</p>
              <p class="text-xs text-gray-500 uppercase font-semibold">${sectorLabels.stakeholders || ''}</p>
            </div>
          </div>
          <i data-lucide="${isOpen ? 'chevron-up' : 'chevron-down'}" class="w-5 h-5 text-gray-400 shrink-0"></i>
        </button>
        ${isOpen ? renderExpanded(sector, sectorsT) : ''}
      </div>
    `;
  }).join('');

  return `
    <div>
      <!-- Header (CMS-powered) -->
      <div class="bg-eu-blue text-white px-6 py-12">
        <div class="max-w-7xl mx-auto">
          <h1 class="text-3xl font-extrabold mb-3">${localized(heroTitle)}</h1>
          <p class="text-white/80 max-w-3xl text-base mb-8">${localized(heroDescription)}</p>
          <div class="flex flex-wrap gap-6">
            ${heroStats.map(s => `
              <div class="bg-white/10 rounded-xl px-6 py-4 text-center">
                <p class="text-3xl font-extrabold text-eu-yellow">${s.value}</p>
                <p class="text-xs text-white/70 font-semibold uppercase mt-1">${localized(s.label)}</p>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- Sector Cards -->
      <div class="max-w-7xl mx-auto px-6 py-10 space-y-4">${cardsHtml}</div>

      <!-- CTA -->
      <div class="max-w-7xl mx-auto px-6 pb-12">
        <div class="bg-eu-blue rounded-xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div class="max-w-2xl">
            <h3 class="text-xl font-bold mb-2">${sectorsT?.cta || ''}</h3>
            <p class="text-white/80 text-sm">${sectorsT?.ctaDesc || ''}</p>
          </div>
          <button id="sectors-cta-btn" class="bg-eu-orange text-white px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-eu-purple transition-colors border-none cursor-pointer shrink-0">
            ${sectorsT?.ctaButton || ''}
          </button>
        </div>
      </div>
    </div>
  `;
}

export function mount() {
  // Toggle expand/collapse — re-render solo el main-root para no perder scroll
  document.querySelectorAll('[data-toggle]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.toggle;
      const current = getState('expandedSector');
      setState('expandedSector', current === id ? null : id);
      import('../main.js').then(m => m.renderApp());
    });
  });

  // CTA → red tab
  document.getElementById('sectors-cta-btn')?.addEventListener('click', () => {
    navigateTo('red');
  });
}
