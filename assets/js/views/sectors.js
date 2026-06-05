import { t } from '../i18n.js';
import { navigateTo } from '../router.js';
import { getState, setState } from '../state.js';
import { SECTORS_CONFIG } from '../../data/sectors.js';

const SECTORS_META = [
  { id: 'mfg', emoji: '⚙️',  color: 'from-blue-700 to-blue-500',      borderColor: 'border-blue-600',  tagBg: 'bg-blue-100',   tagText: 'text-blue-800',   challenges: 23, courses: 14, stakeholders: 87,  featuredPartners: ['TUV.IT', 'JOIST', 'INESC TEC', 'Hochschule Wismar'] },
  { id: 'mob', emoji: '🚗',  color: 'from-eu-purple to-eu-blue',       borderColor: 'border-eu-purple', tagBg: 'bg-eu-yellow',  tagText: 'text-eu-purple',  challenges: 18, courses: 12, stakeholders: 65,  featuredPartners: ['NTNU', 'HSW', 'INESC TEC', 'CEICE'] },
  { id: 'ene', emoji: '⚡',  color: 'from-green-700 to-emerald-500',   borderColor: 'border-green-600', tagBg: 'bg-green-100',  tagText: 'text-green-800',  challenges: 19, courses: 9,  stakeholders: 102, featuredPartners: ['Region Värmland', 'PREDA', 'NTNU', 'INESC TEC'] },
  { id: 'agr', emoji: '🌾',  color: 'from-yellow-600 to-amber-400',    borderColor: 'border-yellow-500',tagBg: 'bg-yellow-100', tagText: 'text-yellow-800', challenges: 14, courses: 8,  stakeholders: 78,  featuredPartners: ['AVA-ASAJA', 'CINK', 'INESC TEC', 'UVEG'] },
  { id: 'cci', emoji: '🎨',  color: 'from-pink-600 to-fuchsia-400',    borderColor: 'border-pink-500',  tagBg: 'bg-pink-100',   tagText: 'text-pink-800',   challenges: 12, courses: 7,  stakeholders: 43,  featuredPartners: ['LPGA', 'C-LINK', 'KEA', 'ESAD-GV', 'RCE'] },
  { id: 'hou', emoji: '🏘️', color: 'from-red-600 to-rose-500',         borderColor: 'border-red-500',   tagBg: 'bg-red-100',    tagText: 'text-red-800',    challenges: 15, courses: 10, stakeholders: 91,  featuredPartners: ['HSW', 'NTNU', 'INESC TEC', 'CEICE'] },
  { id: 'nts', emoji: '🏢',  color: 'from-slate-600 to-gray-500',      borderColor: 'border-slate-500', tagBg: 'bg-slate-100',  tagText: 'text-slate-800',  challenges: 16, courses: 11, stakeholders: 56,  featuredPartners: ['CEICE', 'LC', 'COGN', 'FIDIT'] },
];

// Iconos Lucide por sector (mismo criterio que la home; sustituyen a los emojis)
const SECTOR_ICONS = {
  mfg: 'factory',
  mob: 'car',
  ene: 'zap',
  agr: 'wheat',
  cci: 'palette',
  hou: 'home',
  nts: 'building-2',
};

const CHAIN_ICONS = ['users', 'book-open', 'lightbulb', 'flask-conical', 'graduation-cap'];
// Solo binomio corporativo (alternando azul/morado) con transparencias suaves.
const CHAIN_COLORS = [
  'bg-eu-blue/5 text-eu-blue border-eu-blue/15',
  'bg-eu-purple/5 text-eu-purple border-eu-purple/15',
  'bg-eu-blue/5 text-eu-blue border-eu-blue/15',
  'bg-eu-purple/5 text-eu-purple border-eu-purple/15',
  'bg-eu-blue/5 text-eu-blue border-eu-blue/15',
];

function enhanceSectorWithMetadata(sector) {
  const uiMeta = SECTORS_CONFIG?.uiBlock || [];
  const meta = uiMeta.find(m => m.id === sector.id) || SECTORS_META.find(m => m.id === sector.id);
  return {
    ...sector,
    emoji: meta?.emoji || '❓',
    color: meta?.color || 'from-gray-500 to-gray-400',
    borderColor: meta?.borderColor || 'border-gray-400',
    tagBg: meta?.tagBg || 'bg-gray-100',
    tagText: meta?.tagText || 'text-gray-800',
  };
}

function renderExpanded(sector, sectorsT) {
  const chainLabels = ['stakeholderNeed', 'fpSkill', 'teacherUse', 'evidence', 'masterBridge'];
  const visibleChainItems = (sector.transferChain || [])
    .map((item, index) => ({ ...item, index }))
    .filter(item => item.visible !== false);

  const chainHtml = visibleChainItems.map((chainItem, displayIdx) => `
    <div class="flex items-start gap-2">
      <div class="flex flex-col gap-2 border rounded-xl px-4 py-3.5 ${CHAIN_COLORS[chainItem.index] || CHAIN_COLORS[0]}" style="min-width:13rem;max-width:17rem">
        <div class="flex items-center gap-2 text-sm font-bold uppercase tracking-wide">
          <i data-lucide="${CHAIN_ICONS[chainItem.index] || 'circle'}" class="w-5 h-5 shrink-0"></i>
          ${sectorsT?.transferChainLabels?.[chainLabels[chainItem.index]] || ''}
        </div>
        <p class="text-base leading-relaxed">${localized(chainItem.value)}</p>
      </div>
      ${displayIdx < visibleChainItems.length - 1 ? '<i data-lucide="arrow-right" class="w-5 h-5 text-eu-blue/40 mt-4 shrink-0"></i>' : ''}
    </div>
  `).join('');

  const sections = sector.sections || {};
  const stakeholderTypes = localizedList(sector.stakeholderTypes);
  const keywords = localizedList(sector.keywords);
  const fpSkills = localizedList(sector.fpSkills);
  const masterTopics = localizedList(sector.masterTopics);
  const internalCardsHtml = [];

  if (sections.stakeholderTypes !== false && stakeholderTypes.length > 0) {
    internalCardsHtml.push(`
      <div class="bg-white rounded-2xl border border-eu-blue/10 p-6">
        <h4 class="font-bold text-eu-text text-lg mb-3 flex items-center gap-2">
          <i data-lucide="users" class="w-5 h-5 text-eu-blue"></i>
          ${sectorsT?.stakeholderTypesLabel || ''}
        </h4>
        <ul class="space-y-2.5">
          ${stakeholderTypes.map(s => `
            <li class="text-base text-gray-700 flex items-start gap-2 leading-relaxed">
              <i data-lucide="arrow-right" class="w-4 h-4 text-eu-blue mt-1 shrink-0"></i>${s}
            </li>`).join('')}
        </ul>
      </div>
    `);
  }

  if ((sections.keywordsDescription !== false && localized(sector.description)) || (sections.keywords !== false && keywords.length > 0)) {
    internalCardsHtml.push(`
      <div class="bg-white rounded-2xl border border-eu-blue/10 p-6">
        ${sections.keywordsDescription !== false && localized(sector.description) ? `
          <p class="text-base text-gray-700 leading-relaxed ${sections.keywords !== false && keywords.length > 0 ? 'mb-4' : ''}">${localized(sector.description)}</p>
        ` : ''}
        ${sections.keywords !== false && keywords.length > 0 ? `
          <div class="flex flex-wrap gap-1.5">
            ${keywords.map(kw => `
              <span class="text-sm font-semibold px-3 py-1 rounded-full text-eu-purple" style="background:rgba(255,244,225,.6)">${kw}</span>
            `).join('')}
          </div>
        ` : ''}
      </div>
    `);
  }

  if (sections.fpSkills !== false && fpSkills.length > 0) {
    internalCardsHtml.push(`
      <div class="bg-white rounded-2xl border border-eu-blue/10 p-6">
        <h4 class="font-bold text-eu-text text-lg mb-4 flex items-center gap-2">
          <i data-lucide="book-open" class="w-5 h-5 text-eu-purple"></i>
          ${sectorsT?.fpModulesLabel || ''}
        </h4>
        <ul class="space-y-2">
          ${fpSkills.map(m => `
            <li class="text-base text-gray-700 flex items-start gap-2 leading-relaxed">
              <i data-lucide="arrow-right" class="w-4 h-4 text-eu-purple mt-1 shrink-0"></i>${m}
            </li>`).join('')}
        </ul>
      </div>
    `);
  }

  if (sections.teacherRelevance !== false && localized(sector.teacherRelevance)) {
    internalCardsHtml.push(`
      <div class="bg-white rounded-2xl border border-eu-blue/10 p-6">
        <h4 class="font-bold text-eu-text text-lg mb-3 flex items-center gap-2">
          <i data-lucide="lightbulb" class="w-5 h-5 text-eu-blue"></i>
          ${sectorsT?.teacherRelevanceLabel || ''}
        </h4>
        <p class="text-base text-gray-700 leading-relaxed">${localized(sector.teacherRelevance)}</p>
      </div>
    `);
  }

  const showMasterTopics = sections.masterTopics !== false && masterTopics.length > 0;
  const showFeaturedPartners = sections.featuredPartners !== false && (sector.featuredPartners || []).length > 0;

  if (showMasterTopics || showFeaturedPartners) {
    internalCardsHtml.push(`
      <div class="bg-white rounded-2xl border border-eu-blue/10 p-6">
        ${showMasterTopics ? `
          <h4 class="font-bold text-eu-text text-lg mb-4 flex items-center gap-2">
            <i data-lucide="graduation-cap" class="w-5 h-5 text-eu-purple"></i>
            ${sectorsT?.masterTopicsLabel || ''}
          </h4>
          <ul class="space-y-2">
            ${masterTopics.map(topic => `
              <li class="text-base text-gray-700 flex items-start gap-2 leading-relaxed">
                <i data-lucide="arrow-right" class="w-4 h-4 text-eu-purple mt-1 shrink-0"></i>${topic}
              </li>`).join('')}
          </ul>
        ` : ''}
        ${showFeaturedPartners ? `
          <div class="${showMasterTopics ? 'mt-4 pt-4 border-t border-eu-blue/10' : ''}">
            <p class="text-sm text-gray-500 font-semibold uppercase tracking-wide mb-2">${sectorsT?.featuredPartnersLabel || ''}</p>
            <div class="flex flex-wrap gap-1.5">
              ${(sector.featuredPartners || []).map(p => `
                <span class="text-sm border border-eu-blue/15 px-3 py-1 rounded-full text-eu-blue font-bold" style="background:rgba(86,32,246,.05)">${p}</span>
              `).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    `);
  }

  if (sections.exampleChallenge !== false && localized(sector.exampleChallenge)) {
    internalCardsHtml.push(`
      <div class="rounded-2xl border border-eu-yellow p-5" style="background:rgba(255,244,225,.45)">
        <h4 class="font-bold text-eu-purple text-base mb-2 flex items-center gap-2">
          <i data-lucide="flask-conical" class="w-5 h-5 shrink-0"></i>
          ${localized(sector.exampleChallengeLabel) || sectorsT?.exampleChallengeLabel || ''}
        </h4>
        <p class="text-base text-eu-text/70 italic leading-relaxed">${localized(sector.exampleChallenge)}</p>
      </div>
    `);
  }

  const gridHtml = internalCardsHtml.length ? `
    <div class="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
      ${internalCardsHtml.join('')}
    </div>
  ` : '';

  return `
    <div class="border-t border-eu-blue/10 px-6 py-8 space-y-6" style="background:rgba(86,32,246,0.03)">
      ${chainHtml ? `
        <div class="bg-white rounded-2xl border border-eu-blue/10 p-6">
          <h4 class="font-bold text-eu-text text-lg mb-5">${sectorsT?.transferChainTitle || ''}</h4>
          <div class="flex flex-wrap items-start gap-2.5">${chainHtml}</div>
        </div>
      ` : ''}
      ${gridHtml}
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

function localizedList(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  return value[getLang()] || value.es || [];
}

export function render() {
  const sectorsT = t('sectors') || {};
  const expanded = getState('expandedSector');

  const hero = SECTORS_CONFIG?.heroBlock;
  const heroTitle = hero?.title || {};
  const heroDescription = hero?.description || {};
  const heroStats = hero?.stats || [];
  const cta = SECTORS_CONFIG?.ctaBlock;
  const heroHtml = hero?.visible !== false ? `
      <section class="bg-eu-blue text-white px-6 py-20">
        <div class="max-w-7xl mx-auto">
          <h1 class="font-extrabold mb-5" style="color:#FFF4E1;letter-spacing:-.02em;font-size:clamp(2.5rem,5vw,4rem);line-height:1.05">${localized(heroTitle)}</h1>
          <p class="max-w-3xl text-lg mb-10 leading-relaxed" style="color:rgba(255,255,255,.85)">${localized(heroDescription)}</p>
          <div class="flex flex-wrap gap-5">
            ${heroStats.map(s => `
              <div class="rd-hero-stat text-center" style="min-width:9rem">
                <p class="text-4xl font-extrabold" style="color:#FFF4E1">${s.value}</p>
                <p class="text-xs font-bold uppercase tracking-wider mt-2" style="color:rgba(255,244,225,.75)">${localized(s.label)}</p>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
  ` : '';

  const sectorList = (SECTORS_CONFIG.cardsBlock || [])
    .filter(s => s.visible !== false)
    .map(enhanceSectorWithMetadata);

  const cardsHtml = sectorList.map(sector => {
    const isOpen = expanded === sector.id;
    const name = localized(sector.name) || sector.id;
    const description = localized(sector.description);
    const stats = sector.stats || {};
    const sectorLabels = sectorsT?.sectorLabels || {};

    const icon = SECTOR_ICONS[sector.id] || 'shapes';
    return `
      <div class="rd-card ${isOpen ? '' : 'rd-card-edge'} overflow-hidden">
        <button data-toggle="${sector.id}" class="w-full flex items-center gap-5 text-left" style="padding:1.75rem">
          <div class="rd-icon-circle shrink-0">
            <i data-lucide="${icon}" class="w-7 h-7 text-eu-blue"></i>
          </div>
          <div class="flex-1 min-w-0">
            <h2 class="text-2xl font-extrabold text-eu-purple">${name}</h2>
            <p class="text-base text-gray-600 line-clamp-2 mt-0.5">${description}</p>
          </div>
          <div class="hidden sm:flex items-center gap-7 shrink-0">
            <div class="text-center">
              <p class="text-2xl font-extrabold text-eu-blue">${stats.challenges ?? ''}</p>
              <p class="text-xs text-gray-500 uppercase font-semibold mt-0.5">${sectorLabels.challenges || ''}</p>
            </div>
            <div class="text-center">
              <p class="text-2xl font-extrabold text-eu-purple">${stats.stakeholders ?? ''}</p>
              <p class="text-xs text-gray-500 uppercase font-semibold mt-0.5">${sectorLabels.stakeholders || ''}</p>
            </div>
            <div class="text-center">
              <p class="text-2xl font-extrabold text-eu-orange">${stats.courses ?? ''}</p>
              <p class="text-xs text-gray-500 uppercase font-semibold mt-0.5">${sectorLabels.courses || ''}</p>
            </div>
          </div>
          <i data-lucide="${isOpen ? 'chevron-up' : 'chevron-down'}" class="w-6 h-6 text-eu-blue shrink-0"></i>
        </button>
        ${isOpen ? renderExpanded(sector, sectorsT) : ''}
      </div>
    `;
  }).join('');

  return `
    <div class="rd-canvas">
      <!-- Header (CMS-powered) -->
      ${heroHtml}

      <!-- Sector Cards -->
      <div class="max-w-7xl mx-auto px-6 space-y-5" style="padding-block:4rem">${cardsHtml}</div>

      ${cta?.visible !== false ? `
        <!-- CTA -->
        <div class="max-w-7xl mx-auto px-6 pb-20">
          <div class="bg-eu-blue text-white flex flex-col md:flex-row items-center justify-between gap-6" style="border-radius:2rem;padding:3rem">
            <div class="${cta?.buttonVisible !== false ? 'max-w-2xl' : 'w-full'}">
              <h3 class="text-2xl font-extrabold mb-2" style="color:#FFF4E1">${localized(cta?.title) || sectorsT?.cta || ''}</h3>
              <p class="text-lg leading-relaxed" style="color:rgba(255,255,255,.85)">${localized(cta?.description) || sectorsT?.ctaDesc || ''}</p>
            </div>
            ${cta?.buttonVisible !== false ? `
              <button id="sectors-cta-btn" class="rounded-full font-bold transition-colors border-none cursor-pointer shrink-0 hover:bg-white" style="background:#FFF4E1;color:#4918AD;padding:.875rem 2rem">
                ${localized(cta?.buttonLabel) || sectorsT?.ctaButton || ''}
              </button>
            ` : ''}
          </div>
        </div>
      ` : ''}
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
    const cta = SECTORS_CONFIG?.ctaBlock || {};
    if ((cta.targetRoute || 'red') === 'red') {
      setState('networkTab', cta.targetNetworkTab || 'stakeholders');
      setState('networkShowForm', cta.openMembershipForm !== false);
      setState('networkCategory', 'todos');
      setState('networkCountry', null);
      setState('networkSector', null);
      setState('networkSearch', '');
      setState('networkPage', 0);
    }
    navigateTo(cta.targetRoute || 'red');
  });
}
