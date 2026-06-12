import { t } from '../i18n.js';
import { navigateTo } from '../router.js';
import { getState, setState } from '../state.js';
import { SECTORS_CONFIG } from '../../data/sectors.js';


const SECTOR_ICONS = {
  mfg: 'factory',
  mob: 'car',
  ene: 'zap',
  agr: 'wheat',
  cci: 'palette',
  hou: 'home',
  nts: 'building-2',
};

const CHAIN_ICONS = {
  sectorNeeds: 'radar',
  fpCompetences: 'book-open-check',
  didacticApplication: 'lightbulb',
  evidenceCase: 'flask-conical',
  academicConnection: 'graduation-cap',
};

const CONTENT_TYPE_TABS = {
  challenge: 'challenges',
  case: 'cases',
  pilot: 'pilots',
  validation: 'validations',
  mentoring: 'mentorings',
};

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

function esc(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function renderHero(hero) {
  if (!hero || hero.visible === false) return '';

  return `
    <section class="rd-hero-gradient px-6 py-24 text-white">
      <div class="mx-auto max-w-7xl">
        <div class="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-white/80 backdrop-blur">
          <i data-lucide="compass" class="h-4 w-4"></i>
          AI-SECRETT
        </div>
        <h1 class="mt-7 max-w-5xl text-5xl font-extrabold tracking-tight md:text-7xl" style="color:#FFF4E1;line-height:1.02">${esc(localized(hero.title))}</h1>
        <p class="mt-7 max-w-3xl text-lg leading-relaxed text-white/85 md:text-xl">${esc(localized(hero.description))}</p>
        <div class="mt-12 rd-hero-stats-grid">
          ${(hero.stats || []).map(stat => `
            <div class="rd-hero-stat text-center">
              <p class="text-4xl font-extrabold text-white">${esc(stat.value)}</p>
              <p class="mt-2 text-xs font-bold uppercase tracking-wider" style="color:rgba(255,244,225,.75)">${esc(localized(stat.label))}</p>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}

function renderStatButton(sector, key, value, label, enabled) {
  const navKind = key === 'initiatives' ? 'marketplace' : key === 'courses' ? 'training' : 'network';
  const disabled = enabled ? '' : ' aria-disabled="true"';
  const action = enabled ? `data-sector-nav="${navKind}" data-sector-id="${esc(sector.id)}"` : '';

  return `
    <button ${action}${disabled} class="rd-card rd-card-grad-beige rd-card-edge min-w-0 rounded-3xl px-3 py-4 text-center transition sm:px-4 ${enabled ? 'cursor-pointer' : 'cursor-default opacity-55'}">
      <span class="block text-3xl font-extrabold ${key === 'courses' ? 'text-eu-purple' : key === 'stakeholders' ? 'text-eu-purple' : 'text-eu-blue'}">${esc(value ?? 0)}</span>
      <span class="mt-1 block max-w-full break-words text-[0.68rem] font-bold uppercase leading-tight tracking-wide text-gray-500 [hyphens:auto] sm:text-xs">${esc(label)}</span>
    </button>
  `;
}

function renderRoute(sector, sectorsT) {
  const labels = sectorsT?.transferChainLabels || {};
  const routeIntro = localized(sector.transferRouteIntro);
  const items = (sector.transferChain || []).filter(item => item.visible !== false);
  if (!routeIntro && items.length === 0) return '';

  return `
    <section class="rd-card rd-card-edge rd-pad rd-card-grad-violet">
      <div class="flex flex-col gap-3">
        <div class="w-full">
          <h4 class="text-xl font-extrabold text-eu-purple">${esc(sectorsT?.transferChainTitle || '')}</h4>
          ${routeIntro ? `<p class="mt-3 text-lg leading-relaxed text-eu-text/75">${esc(routeIntro)}</p>` : ''}
        </div>
      </div>
      <div class="mt-8 grid gap-4 lg:grid-cols-5">
        ${items.map((item, index) => {
          const icon = CHAIN_ICONS[item.id] || 'circle';
          const label = labels[item.id] || '';
          return `
            <article class="group relative rd-card rd-card-grad-beige rd-card-edge rounded-3xl p-5">
              <div class="rd-icon-circle-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" style="background:#ffffff">
                <i data-lucide="${icon}" class="h-5 w-5 text-eu-blue"></i>
              </div>
              <p class="mt-4 text-xs font-bold uppercase tracking-wider text-eu-purple">${esc(label)}</p>
              <p class="mt-3 text-sm leading-relaxed text-eu-text/75">${esc(localized(item.value))}</p>
            </article>
          `;
        }).join('')}
      </div>
    </section>
  `;
}

function renderCardNote(note) {
  if (!note) return '';
  return `<p class="mt-4 border-t border-eu-blue/10 pt-3 text-xs italic leading-relaxed text-eu-text/55">${esc(note)}</p>`;
}

function renderListCard(title, icon, items, tone = 'blue', note = '') {
  if (!items.length) return '';
  const color = tone === 'purple' ? 'text-eu-purple' : 'text-eu-blue';
  return `
    <article class="rd-card group rd-card-grad-violet rd-card-edge rd-pad">
      <div class="flex items-center gap-3">
        <div class="rd-icon-circle-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" style="background:#ffffff"><i data-lucide="${icon}" class="h-5 w-5 ${color}"></i></div>
        <h4 class="text-xl font-extrabold text-eu-purple">${esc(title)}</h4>
      </div>
      <ul class="mt-5 space-y-3">
        ${items.map(item => `
          <li class="flex items-start gap-3 text-base leading-relaxed text-eu-text/75">
            <i data-lucide="arrow-right" class="mt-1 h-4 w-4 shrink-0 ${color}"></i>
            <span>${esc(item)}</span>
          </li>
        `).join('')}
      </ul>
      ${renderCardNote(note)}
    </article>
  `;
}

function renderTextCard(title, icon, text, tone = 'blue', note = '') {
  if (!text) return '';
  const color = tone === 'purple' ? 'text-eu-purple' : 'text-eu-blue';
  return `
    <article class="rd-card group rd-card-grad-violet rd-card-edge rd-pad">
      <div class="flex items-center gap-3">
        <div class="rd-icon-circle-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" style="background:#ffffff"><i data-lucide="${icon}" class="h-5 w-5 ${color}"></i></div>
        <h4 class="text-xl font-extrabold text-eu-purple">${esc(title)}</h4>
      </div>
      <p class="mt-5 text-base leading-relaxed text-eu-text/75">${esc(text)}</p>
      ${renderCardNote(note)}
    </article>
  `;
}

function renderKeywords(sector) {
  const keywords = localizedList(sector.keywords);
  if ((sector.sections || {}).keywords === false || keywords.length === 0) return '';
  return `
    <div class="flex flex-wrap gap-2">
      ${keywords.map(keyword => `<span class="rounded-full border border-white/20 bg-white/15 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-sm">${esc(keyword)}</span>`).join('')}
    </div>
  `;
}

function renderRelatedContent(sector, sectorsT) {
  const items = (sector.relatedContent || []).slice(0, 3);
  if (!sector.emptyFlags?.hasRelatedContent || items.length === 0) return '';

  return `
    <article class="rd-card group rd-card-grad-violet rd-card-edge rd-pad">
      <div class="flex items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <div class="rd-icon-circle-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" style="background:#ffffff"><i data-lucide="folder-kanban" class="h-5 w-5 text-eu-blue"></i></div>
          <h4 class="text-xl font-extrabold text-eu-purple">${esc(sectorsT?.relatedContentLabel || '')}</h4>
        </div>
        <button data-sector-nav="marketplace" data-sector-id="${esc(sector.id)}" class="rounded-full border border-eu-blue/20 px-4 py-2 text-sm font-bold text-eu-blue transition hover:bg-eu-blue/5">
          ${esc(sectorsT?.exploreSectorContent || '')}
        </button>
      </div>
      <div class="mt-5 space-y-3">
        ${items.map(item => `
          <button data-sector-content="${esc(item.id)}" data-content-type="${esc(item.type)}" class="w-full rounded-2xl border border-eu-blue/10 p-4 text-left transition hover:border-eu-blue/30 rd-card-grad-beige">
            <span class="block font-bold text-eu-text">[DEMO] ${esc(localized(item.title) || item.id)}</span>
            ${localized(item.summary) ? `<span class="mt-1 line-clamp-2 block text-sm leading-relaxed text-eu-text/65">${esc(localized(item.summary))}</span>` : ''}
          </button>
        `).join('')}
      </div>
    </article>
  `;
}

function renderPartners(sector, sectorsT) {
  const partners = (sector.featuredPartnerDetails || []).filter(partner => partner.found);
  if ((sector.sections || {}).featuredPartners === false || partners.length === 0) return '';

  return `
    <article class="rd-card group rd-card-grad-violet rd-card-edge rd-pad">
      <div class="flex items-center gap-3">
        <div class="rd-icon-circle-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" style="background:#ffffff"><i data-lucide="network" class="h-5 w-5 text-eu-purple"></i></div>
        <h4 class="text-xl font-extrabold text-eu-purple">${esc(sectorsT?.featuredPartnersLabel || '')}</h4>
      </div>
      <div class="mt-5 grid gap-3 sm:grid-cols-2">
        ${partners.map(partner => `
          <a href="${esc(partner.url || '#')}" ${partner.url ? 'target="_blank" rel="noopener noreferrer"' : ''} class="flex flex-col justify-between rd-card rd-card-grad-beige rd-card-edge rounded-2xl p-5 text-center">
            <div class="flex flex-1 items-center justify-center min-h-[5rem]">
              ${partner.logo ? `
                <img src="assets/images/partners/${esc(partner.logo)}" alt="${esc(partner.acronym || partner.id)}" class="max-h-16 max-w-[95%] object-contain">
              ` : `
                <span class="text-sm font-extrabold text-eu-blue">${esc(partner.acronym || partner.id)}</span>
              `}
            </div>
            <div class="mx-auto my-3 w-8 border-t border-eu-blue/15"></div>
            <div>
              <span class="block text-sm font-bold leading-tight text-eu-text/85">${esc(localized(partner.name) || partner.id)}</span>
            </div>
          </a>
        `).join('')}
      </div>
    </article>
  `;
}

function renderEvidence(sector, sectorsT) {
  const sections = sector.sections || {};
  const evidence = sections.exampleChallenge !== false ? localized(sector.exampleChallenge) : '';
  if (!evidence) return '';

  return `
    <article class="rd-card group rd-card-accent rd-card-grad-violet rd-card-edge rd-pad">
      <div class="flex items-center gap-3">
        <div class="rd-icon-circle-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" style="background:#ffffff"><i data-lucide="badge-check" class="h-5 w-5 text-eu-blue"></i></div>
        <h4 class="text-xl font-extrabold text-eu-purple">${esc(localized(sector.exampleChallengeLabel) || sectorsT?.exampleChallengeLabel || '')}</h4>
      </div>
      <p class="mt-5 text-base italic leading-relaxed text-eu-text/75">${esc(evidence)}</p>
    </article>
  `;
}

function renderExpanded(sector, sectorsT) {
  const sections = sector.sections || {};
  const stakeholderTypes = sections.stakeholderTypes !== false ? localizedList(sector.stakeholderTypes) : [];
  const fpSkills = sections.fpSkills !== false ? localizedList(sector.fpSkills) : [];
  const masterTopics = sections.masterTopics !== false ? localizedList(sector.masterTopics) : [];
  const teacherRelevance = sections.teacherRelevance !== false ? localized(sector.teacherRelevance) : '';
  const stakeholderContribution = localized(sector.stakeholderContribution);

  return `
    <div class="border-t border-eu-blue/10 px-5 py-8 md:px-8 rd-card-grad-beige">
      <div class="space-y-6">
        ${renderRoute(sector, sectorsT)}

        <section class="grid gap-6 lg:grid-cols-2">
          ${renderListCard(sectorsT?.stakeholderTypesLabel || '', 'users', stakeholderTypes, 'blue', sectorsT?.stakeholderNote || '')}
          ${renderTextCard(sectorsT?.stakeholderContributionLabel || '', 'handshake', stakeholderContribution, 'purple')}
          ${renderListCard(sectorsT?.fpModulesLabel || '', 'book-open-check', fpSkills, 'purple')}
          ${renderTextCard(sectorsT?.teacherRelevanceLabel || '', 'presentation', teacherRelevance, 'blue')}
        </section>

        <section class="grid gap-6 lg:grid-cols-2">
          ${renderEvidence(sector, sectorsT)}
          ${renderListCard(sectorsT?.masterTopicsLabel || '', 'graduation-cap', masterTopics, 'purple', sectorsT?.academicNote || '')}
          ${renderRelatedContent(sector, sectorsT)}
          ${renderPartners(sector, sectorsT)}
        </section>
      </div>
    </div>
  `;
}

function renderSectorCard(sector, sectorsT, index) {
  const expanded = getState('expandedSector');
  const isOpen = expanded === sector.id;
  const stats = sector.stats || {};
  const sectorLabels = sectorsT?.sectorLabels || {};
  const statsList = Array.isArray(sector.statsList) ? sector.statsList : [
    { id: 'initiatives', value: stats.initiatives, label: sectorLabels.initiatives || sectorLabels.challenges || '' },
    { id: 'stakeholders', value: stats.stakeholders, label: sectorLabels.stakeholders || '' },
    { id: 'courses', value: stats.courses, label: sectorLabels.courses || '' },
  ];
  const statsColumns = Math.max(1, Math.min(statsList.length, 3));
  const navTargets = sector.navigationTargets || {};
  const icon = SECTOR_ICONS[sector.id] || 'shapes';
  const keywords = renderKeywords(sector);

  const isEven = index % 2 === 0;
  const tintClass = isEven ? 'rd-card-grad-blue' : 'rd-card-grad-violet';

  return `
    <article class="rd-card ${tintClass} ${isOpen ? '' : 'rd-card-hover'} overflow-hidden group">
      <div class="rd-ceja-grad grid gap-6 p-6 md:grid-cols-[auto_1fr_auto] md:items-start md:p-8">
        <button data-toggle="${esc(sector.id)}" class="grid cursor-pointer grid-cols-[auto_1fr] gap-5 border-0 bg-transparent p-0 text-left md:contents">
          <div class="rd-icon-circle transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" style="background:#ffffff">
            <i data-lucide="${icon}" class="h-8 w-8 text-eu-blue"></i>
          </div>
          <div class="min-w-0">
            <div class="flex flex-wrap items-center gap-3">
              <h2 class="text-3xl font-extrabold tracking-tight text-white">${esc(localized(sector.name) || sector.id)}</h2>
              <span class="rounded-full border border-white/25 bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">${esc(sector.id)}</span>
            </div>
            <p class="mt-3 max-w-3xl text-base leading-relaxed text-white/85 md:text-lg">${esc(localized(sector.description))}</p>
            ${keywords ? `<div class="mt-5">${keywords}</div>` : ''}
          </div>
        </button>
        <div class="grid min-w-0 gap-3 md:w-[24rem]" style="grid-template-columns: repeat(${statsColumns}, minmax(0, 1fr))">
          ${statsList.map(stat => {
            const target = stat.id === 'initiatives' ? navTargets.marketplace : stat.id === 'courses' ? navTargets.training : navTargets.network;
            return renderStatButton(sector, stat.id, stat.value, localized(stat.label) || sectorLabels[stat.id] || '', target?.enabled);
          }).join('')}
        </div>
      </div>
      <button data-toggle="${esc(sector.id)}" class="flex w-full cursor-pointer items-center justify-between border-0 border-t border-eu-blue/10 bg-transparent px-6 py-4 text-left md:px-8">
        <span class="text-sm font-bold text-eu-blue">${esc(isOpen ? (sectorsT?.collapseSector || 'Cerrar brújula') : (sectorsT?.expandSector || 'Abrir brújula sectorial'))}</span>
        <i data-lucide="${isOpen ? 'chevron-up' : 'chevron-down'}" class="h-5 w-5 text-eu-blue"></i>
      </button>
      ${isOpen ? renderExpanded(sector, sectorsT) : ''}
    </article>
  `;
}

function renderCta(cta, sectorsT) {
  if (!cta || cta.visible === false) return '';

  return `
    <section class="px-6 pb-24">
      <div class="mx-auto max-w-7xl">
        <div class="rd-hero-gradient flex flex-col items-start justify-between gap-8 rounded-[2rem] p-10 text-white md:flex-row md:items-center md:p-12">
          <div class="${cta.buttonVisible !== false ? 'max-w-2xl' : 'w-full'}">
            <p class="text-xs font-bold uppercase tracking-[0.2em] text-white/70">AI-STEAM Network</p>
            <h3 class="mt-3 text-3xl font-extrabold tracking-tight" style="color:#FFF4E1">${esc(localized(cta.title) || sectorsT?.cta || '')}</h3>
            <p class="mt-4 text-lg leading-relaxed text-white/85">${localized(cta.description) || sectorsT?.ctaDesc || ''}</p>
          </div>
          ${cta.buttonVisible !== false ? `
            <button id="sectors-cta-btn" class="rounded-full border-0 px-8 py-3.5 font-bold text-eu-purple transition hover:bg-white" style="background:#FFF4E1">
              ${esc(localized(cta.buttonLabel) || sectorsT?.ctaButton || '')}
            </button>
          ` : ''}
        </div>
      </div>
    </section>
  `;
}

export function render() {
  const sectorsT = t('sectors') || {};
  const sectorList = (SECTORS_CONFIG.cardsBlock || [])
    .filter(sector => sector.visible !== false);

  return `
    <div class="rd-canvas">
      ${renderHero(SECTORS_CONFIG?.heroBlock)}
      <section class="px-6 py-20">
        <div class="mx-auto max-w-7xl space-y-6">
          ${sectorList.map((sector, index) => renderSectorCard(sector, sectorsT, index)).join('')}
        </div>
      </section>
      ${renderCta(SECTORS_CONFIG?.ctaBlock, sectorsT)}
    </div>
  `;
}

function navigateSector(kind, sectorId) {
  const sector = (SECTORS_CONFIG.cardsBlock || []).find(item => item.id === sectorId);
  if (!sector) return;

  if (kind === 'network') {
    setState('networkTab', 'stakeholders');
    setState('networkShowForm', false);
    setState('networkCategory', 'todos');
    setState('networkCountry', null);
    setState('networkSector', sectorId);
    setState('networkSearch', '');
    setState('networkPage', 0);
    navigateTo('red');
    return;
  }

  if (kind === 'training') {
    const courseSectorIds = sector.navigationTargets?.training?.filters?.sectorIds || [];
    const filters = { sectors: courseSectorIds, modalities: [], tags: [], statuses: [], search: '' };
    localStorage.setItem('trainingFilters_fp', JSON.stringify(filters));
    localStorage.setItem('trainingFilters_teacher', JSON.stringify(filters));
    localStorage.setItem('trainingFilters_master', JSON.stringify(filters));
    setState('trainingTab', 'fp');
    setState('trainingPage', 0);
    navigateTo('formacion', { sectorIds: courseSectorIds, source: 'sectors', sector: sectorId });
    return;
  }

  const firstType = sector.relatedContent?.[0]?.type || 'challenge';
  const tab = CONTENT_TYPE_TABS[firstType] || 'challenges';
  localStorage.setItem(`mpCommunityFilters:${tab}`, JSON.stringify({
    search: '',
    values: { sector: sectorId },
  }));
  setState('marketplaceTab', tab);
  setState('selectedChallengeId', null);
  navigateTo('banco-retos', { sector: sectorId, tab, source: 'sectors' });
}

export function mount() {
  document.querySelectorAll('[data-toggle]').forEach(btn => {
    btn.addEventListener('click', event => {
      if (event.target.closest('[data-sector-nav], [data-sector-content], a')) return;
      const id = btn.dataset.toggle;
      const current = getState('expandedSector');
      setState('expandedSector', current === id ? null : id);
      import('../main.js').then(m => m.renderApp());
    });
  });

  document.querySelectorAll('[data-sector-nav]').forEach(btn => {
    btn.addEventListener('click', event => {
      event.stopPropagation();
      navigateSector(btn.dataset.sectorNav, btn.dataset.sectorId);
    });
  });

  document.querySelectorAll('[data-sector-content]').forEach(btn => {
    btn.addEventListener('click', event => {
      event.stopPropagation();
      const type = btn.dataset.contentType;
      setState('marketplaceTab', CONTENT_TYPE_TABS[type] || 'challenges');
      setState('selectedChallengeId', btn.dataset.sectorContent);
      navigateTo('banco-retos');
    });
  });

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
