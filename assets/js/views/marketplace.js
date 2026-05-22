import { t } from '../i18n.js';
import { getState, setState } from '../state.js';
import { MARKETPLACE_CONFIG } from '../../data/marketplace.js';

const MP_FILTER_KEY = 'mpFilters';
const MP_SEARCH_KEY = 'mpSearch';
const MP_EXPANDED_KEY = 'mpSearchExpanded';
const MP_PANEL_KEY = 'mpFilterPanelExpanded';

const FILTER_KEYS = [
  'types',
  'statuses',
  'sectors',
  'stakeholders',
  'transitions',
  'policies',
  'engagements',
  'evidences',
  'focuses',
  'tags',
];

const DIM_MAP_GRID = {
  type: 'types',
  status: 'statuses',
  sector: 'sectors',
  stakeholder: 'stakeholders',
  transition: 'transitions',
  policy: 'policies',
  engagement: 'engagements',
  evidence: 'evidences',
  focus: 'focuses',
  tag: 'tags',
};

const DETAIL_BLOCKS = [
  { key: 'need', icon: 'sparkles' },
  { key: 'context', icon: 'map' },
  { key: 'transferValue', icon: 'repeat-2' },
  { key: 'participation', icon: 'users' },
  { key: 'resources', icon: 'folder-open' },
  { key: 'outputs', icon: 'package-check' },
  { key: 'evidence', icon: 'bar-chart-3' },
  { key: 'process', icon: 'route' },
  { key: 'people', icon: 'user-round-check' },
  { key: 'access', icon: 'link' },
  { key: 'trackA', icon: 'graduation-cap' },
];

const STATUS_TONE = {
  open: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
  'in-progress': 'bg-sky-50 text-sky-800 ring-sky-200',
  resolved: 'bg-slate-100 text-slate-700 ring-slate-200',
};

const TYPE_TONE = {
  challenge: 'bg-violet-50 text-violet-800 ring-violet-200',
  case: 'bg-amber-50 text-amber-800 ring-amber-200',
  validation: 'bg-cyan-50 text-cyan-800 ring-cyan-200',
  mentoring: 'bg-rose-50 text-rose-800 ring-rose-200',
  pilot: 'bg-lime-50 text-lime-900 ring-lime-200',
  resource: 'bg-indigo-50 text-indigo-800 ring-indigo-200',
};

function getLang() {
  return localStorage.getItem('language') || 'es';
}

function pickLang(value, fallback = '') {
  if (value == null) return fallback;
  if (typeof value !== 'object' || Array.isArray(value)) return value;
  const lang = getLang();
  return value[lang] || value.es || value.en || Object.values(value).find(Boolean) || fallback;
}

function isLocalizedObject(value) {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value) && ['es', 'en', 'va'].some(key => key in value));
}

function esc(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function getLabelFromArray(arr, id, fallback = '') {
  return pickLang(arr?.find(item => item.id === id)?.label, fallback || id);
}

function getStatusLabel(id) { return getLabelFromArray(MARKETPLACE_CONFIG.statusLabels, id); }
function getTypeLabel(id) { return getLabelFromArray(MARKETPLACE_CONFIG.trackBTypeLabels || MARKETPLACE_CONFIG.typeLabels, id); }
function getStakeholderLabel(id) { return getLabelFromArray(MARKETPLACE_CONFIG.stakeholderCategoryLabels, id); }
function getTransitionLabel(id) { return getLabelFromArray(MARKETPLACE_CONFIG.transitionLabels, id); }
function getPolicyLabel(id) { return getLabelFromArray(MARKETPLACE_CONFIG.policyClusterLabels, id); }
function getEngagementLabel(id) { return getLabelFromArray(MARKETPLACE_CONFIG.engagementLevelLabels, id); }
function getEvidenceLabel(id) { return getLabelFromArray(MARKETPLACE_CONFIG.evidenceMaturityLabels, id); }
function getFocusLabel(id) { return getLabelFromArray(MARKETPLACE_CONFIG.aiSteamFocusLabels, id); }
function getBlockLabel(id) { return getLabelFromArray(MARKETPLACE_CONFIG.detailBlockLabels, id); }

function getSectorCode(value) {
  const map = {
    Manufacturing: 'mfg',
    'Mobility and Transport': 'mob',
    'Energy and Environment': 'ene',
    Agrifood: 'agr',
    'Cultural and Creative Industries': 'cci',
    Housing: 'hou',
    'Non-Touristic Services': 'nts',
  };
  return map[value] || value;
}

function getSectorLabel(value) {
  return (t('sectors.sectorNames') || {})[getSectorCode(value)] || value;
}

function compact(values) {
  return values.flat().filter(value => value !== undefined && value !== null && value !== '');
}

function asArray(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function getLocalizedTags(item) {
  const tags = item.core?.tags || item.tags || [];
  if (Array.isArray(tags)) return tags;
  if (typeof tags === 'object') return pickLang(tags, []);
  return [];
}

function getItems() {
  const primary = MARKETPLACE_CONFIG.items || [];
  if (primary.length) return primary.filter(item => item.visible !== false);
  return (MARKETPLACE_CONFIG.contributions || []).filter(item => item.visible !== false).map(contributionToItem);
}

function contributionToItem(ch) {
  return {
    id: ch.id,
    type: String(ch.type || '').toLowerCase(),
    core: {
      status: ch.status,
      title: ch.title,
      summary: ch.description,
      entity: { name: ch.owner || ch.entity, type: ch.ownerType },
      sector: ch.sector,
      stakeholderCategory: ch.helixRole,
      deadlineLabel: ch.deadlineLabel,
      tags: ch.tags,
    },
    classification: {
      tripleTransition: asArray(ch.tripleTransition),
      evidenceMaturity: ch.evidenceMaturity,
      engagementLevel: ch.level,
      aiSteamFocus: asArray(ch.focus || ch.tags),
      trackBValue: ch.impact,
    },
    detail: ch.detail || {},
    visibility: {},
    access: {},
  };
}

function getMpFilters() {
  try {
    const parsed = JSON.parse(localStorage.getItem(MP_FILTER_KEY) || '{}');
    return FILTER_KEYS.reduce((acc, key) => {
      acc[key] = Array.isArray(parsed[key]) ? parsed[key] : [];
      return acc;
    }, {});
  } catch {
    return FILTER_KEYS.reduce((acc, key) => ({ ...acc, [key]: [] }), {});
  }
}

function setMpFilters(filters) {
  localStorage.setItem(MP_FILTER_KEY, JSON.stringify(filters));
}

function clearMpFilters() {
  localStorage.removeItem(MP_FILTER_KEY);
  localStorage.removeItem(MP_SEARCH_KEY);
}

function getMpSearch() {
  return localStorage.getItem(MP_SEARCH_KEY) || '';
}

function setMpSearch(value) {
  if (value) localStorage.setItem(MP_SEARCH_KEY, value);
  else localStorage.removeItem(MP_SEARCH_KEY);
}

function getMpSearchExpanded() {
  const stored = localStorage.getItem(MP_EXPANDED_KEY);
  if (stored !== null) return stored === 'true';
  return MARKETPLACE_CONFIG.searchBlock?.defaultExpanded === true;
}

function setMpSearchExpanded(value) {
  localStorage.setItem(MP_EXPANDED_KEY, value ? 'true' : 'false');
}

function getMpFilterPanelExpanded() {
  return localStorage.getItem(MP_PANEL_KEY) === 'true';
}

function setMpFilterPanelExpanded(value) {
  localStorage.setItem(MP_PANEL_KEY, value ? 'true' : 'false');
}

function toggleMpFilter(arr, value) {
  return arr.includes(value) ? arr.filter(item => item !== value) : [...arr, value];
}

function hasMpFilters(filters, search) {
  return FILTER_KEYS.some(key => filters[key]?.length) || Boolean(search);
}

function getFilterValues(item) {
  return {
    types: compact([item.type]),
    statuses: compact([item.core?.status]),
    sectors: compact([getSectorCode(item.core?.sector)]),
    stakeholders: compact([item.core?.stakeholderCategory]),
    transitions: compact(asArray(item.classification?.tripleTransition)),
    policies: compact(asArray(item.classification?.policyCluster)),
    engagements: compact([item.classification?.engagementLevel]),
    evidences: compact([item.classification?.evidenceMaturity]),
    focuses: compact(asArray(item.classification?.aiSteamFocus)),
    tags: compact(getLocalizedTags(item)),
  };
}

function itemMatchesFilters(item, filters) {
  const values = getFilterValues(item);
  return FILTER_KEYS.every(key => !filters[key]?.length || filters[key].some(value => values[key].includes(value)));
}

function itemMatchesSearch(item, search) {
  if (!search) return true;
  const q = search.toLowerCase();
  const haystack = compact([
    pickLang(item.core?.title),
    pickLang(item.core?.summary),
    pickLang(item.core?.entity?.name),
    getTypeLabel(item.type),
    getStatusLabel(item.core?.status),
    getSectorLabel(item.core?.sector),
    getStakeholderLabel(item.core?.stakeholderCategory),
    getEvidenceLabel(item.classification?.evidenceMaturity),
    getEngagementLabel(item.classification?.engagementLevel),
    asArray(item.classification?.tripleTransition).map(getTransitionLabel),
    asArray(item.classification?.policyCluster).map(getPolicyLabel),
    asArray(item.classification?.aiSteamFocus).map(getFocusLabel),
    getLocalizedTags(item),
  ]).join(' ').toLowerCase();
  return haystack.includes(q);
}

function getFilteredItems(items, filters, search) {
  return items.filter(item => itemMatchesFilters(item, filters) && itemMatchesSearch(item, search.trim()));
}

function buildOptions(items, key, labeler) {
  const values = [...new Set(items.flatMap(item => getFilterValues(item)[key] || []))].filter(Boolean);
  return values.map(value => ({ value, label: labeler(value) })).sort((a, b) => a.label.localeCompare(b.label));
}

function chipClasses(active = false, tone = '') {
  if (active) return 'border-violet-500 bg-violet-50 text-violet-800';
  return `${tone || 'bg-white text-slate-700'} border-slate-200 hover:border-violet-300 hover:text-violet-800`;
}

function renderClickableChip(dimension, value, label, active = false, tone = '') {
  if (!value || !label) return '';
  return `
    <button type="button" data-mp-chip="${dimension}" data-mp-val="${esc(value)}"
      class="inline-flex min-h-11 items-center rounded-full border px-3 py-1 text-xs font-semibold transition ${chipClasses(active, tone)}">
      ${esc(label)}
    </button>`;
}

function renderBadge(label, tone = 'bg-white text-slate-700 ring-slate-200') {
  if (!label) return '';
  return `<span class="inline-flex min-h-8 items-center rounded-full px-3 py-1 text-xs font-bold ring-1 ${tone}">${esc(label)}</span>`;
}

function renderFilterGroup(title, dimension, options, activeValues) {
  if (!options.length) return '';
  return `
    <div class="space-y-2">
      <p class="text-xs font-bold uppercase tracking-wide text-slate-500">${esc(title)}</p>
      <div class="flex flex-wrap gap-2">
        ${options.map(option => renderClickableChip(dimension, option.value, option.label, activeValues.includes(option.value))).join('')}
      </div>
    </div>`;
}

function renderActiveFilters(filters, search) {
  if (!hasMpFilters(filters, search)) return '';
  const labels = {
    types: getTypeLabel,
    statuses: getStatusLabel,
    sectors: getSectorLabel,
    stakeholders: getStakeholderLabel,
    transitions: getTransitionLabel,
    policies: getPolicyLabel,
    engagements: getEngagementLabel,
    evidences: getEvidenceLabel,
    focuses: getFocusLabel,
    tags: value => value,
  };
  const chips = FILTER_KEYS.flatMap(key => filters[key].map(value => `
    <button type="button" data-mp-remove="${key}" data-mp-val="${esc(value)}"
      class="inline-flex min-h-11 items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-200">
      ${esc(labels[key](value))}
      <i data-lucide="x" class="h-3 w-3"></i>
    </button>`));
  if (search) {
    chips.unshift(`
      <button type="button" data-mp-remove="search" data-mp-val=""
        class="inline-flex min-h-11 items-center gap-2 rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-800 hover:bg-violet-100">
        ${esc(search)}
        <i data-lucide="x" class="h-3 w-3"></i>
      </button>`);
  }
  return `
    <div id="mp-active-filters" class="flex flex-wrap items-center gap-2">
      ${chips.join('')}
      <button id="mp-clear-active-filters" type="button" class="text-xs font-bold text-violet-700 hover:text-violet-900">
        Limpiar filtros
      </button>
    </div>`;
}

function getCardSignal(item) {
  const detail = item.detail || {};
  const core = item.core || {};
  if (item.type === 'challenge') return core.deadlineLabel || pickLang(detail.need?.question) || pickLang(item.classification?.trackBValue);
  if (item.type === 'case') return pickLang(detail.transferValue?.value) || pickLang(detail.context?.learningSetting);
  if (item.type === 'validation') return pickLang(detail.evidence?.result) || pickLang(detail.evidence?.method);
  if (item.type === 'mentoring') return pickLang(detail.participation?.availability) || pickLang(detail.participation?.modality);
  if (item.type === 'pilot') return pickLang(detail.process?.nextStep) || pickLang(detail.evidence?.learningSignals);
  if (item.type === 'resource') return pickLang(detail.access?.format) || pickLang(detail.resources?.mainResource);
  return pickLang(item.classification?.trackBValue);
}

function renderCard(item) {
  const title = pickLang(item.core?.title, item.id);
  const summary = pickLang(item.core?.summary);
  const entity = pickLang(item.core?.entity?.name);
  const sectorCode = getSectorCode(item.core?.sector);
  const signal = getCardSignal(item);
  const active = getMpFilters();
  const focuses = asArray(item.classification?.aiSteamFocus).slice(0, 2);
  const transitions = asArray(item.classification?.tripleTransition).slice(0, 2);

  return `
    <article class="group flex h-full flex-col rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-md">
      <div class="flex flex-wrap items-center gap-2">
        ${renderClickableChip('type', item.type, getTypeLabel(item.type), active.types.includes(item.type), TYPE_TONE[item.type])}
        ${renderClickableChip('status', item.core?.status, getStatusLabel(item.core?.status), active.statuses.includes(item.core?.status), STATUS_TONE[item.core?.status])}
        ${renderClickableChip('evidence', item.classification?.evidenceMaturity, getEvidenceLabel(item.classification?.evidenceMaturity), active.evidences.includes(item.classification?.evidenceMaturity))}
      </div>

      <div class="mt-4 flex-1">
        <h3 class="text-lg font-black leading-snug text-slate-950">${esc(title)}</h3>
        ${entity ? `<p class="mt-1 text-sm font-semibold text-slate-500">${esc(entity)}${item.core?.entity?.type ? ` · ${esc(pickLang(item.core.entity.type))}` : ''}</p>` : ''}
        ${summary ? `<p class="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">${esc(summary)}</p>` : ''}
      </div>

      <div class="mt-4 flex flex-wrap gap-2">
        ${renderClickableChip('sector', sectorCode, getSectorLabel(item.core?.sector), active.sectors.includes(sectorCode))}
        ${renderClickableChip('stakeholder', item.core?.stakeholderCategory, getStakeholderLabel(item.core?.stakeholderCategory), active.stakeholders.includes(item.core?.stakeholderCategory))}
        ${transitions.map(value => renderClickableChip('transition', value, getTransitionLabel(value), active.transitions.includes(value))).join('')}
        ${focuses.map(value => renderClickableChip('focus', value, getFocusLabel(value), active.focuses.includes(value))).join('')}
      </div>

      ${signal ? `
        <div class="mt-5 rounded-lg bg-slate-50 p-3 text-sm leading-6 text-slate-700">
          <span class="font-bold text-slate-950">${esc(getTypeLabel(item.type))}:</span>
          ${esc(signal)}
        </div>` : ''}

      <div class="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
        <span class="text-xs font-semibold uppercase tracking-wide text-slate-400">Track B</span>
        <button type="button" data-id="${esc(item.id)}"
          class="mp-view-detail inline-flex items-center gap-2 rounded-full bg-violet-700 px-4 py-2 text-sm font-bold text-white transition hover:bg-violet-800">
          Ver detalle
          <i data-lucide="arrow-right" class="h-4 w-4"></i>
        </button>
      </div>
    </article>`;
}

function renderTextValue(value) {
  const localized = isLocalizedObject(value) ? pickLang(value) : value;
  if (localized == null || localized === '') return '';
  if (Array.isArray(localized)) {
    const items = localized.map(renderTextValue).filter(Boolean);
    if (!items.length) return '';
    return `<ul class="space-y-2">${items.map(item => `<li class="flex gap-2"><span class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400"></span><span>${item}</span></li>`).join('')}</ul>`;
  }
  if (typeof localized === 'object') {
    return renderObjectValue(localized);
  }
  return `<span>${esc(localized)}</span>`;
}

function renderObjectValue(value) {
  const entries = Object.entries(value || {})
    .map(([key, entry]) => [key, renderTextValue(entry)])
    .filter(([, rendered]) => rendered);
  if (!entries.length) return '';
  return `<dl class="space-y-3">${entries.map(([key, rendered]) => `
    <div>
      <dt class="text-xs font-bold uppercase tracking-wide text-slate-400">${esc(humanizeKey(key))}</dt>
      <dd class="mt-1 text-sm leading-6 text-slate-700">${rendered}</dd>
    </div>`).join('')}</dl>`;
}

function humanizeKey(key) {
  return String(key)
    .replace(/([A-Z])/g, ' $1')
    .replace(/[_-]/g, ' ')
    .replace(/^./, match => match.toUpperCase());
}

function getBlockContent(item, key) {
  if (key === 'access') {
    return item.detail?.access || item.access || {};
  }
  if (key === 'trackA') {
    if (item.trackALink?.enabled === false) return {};
    return item.detail?.trackA || item.trackALink || {};
  }
  return item.detail?.[key] || {};
}

function renderDetailBlock(item, block) {
  if (item.visibility?.[block.key] === false) return '';
  const content = getBlockContent(item, block.key);
  const body = renderTextValue(content);
  if (!body) return '';
  return `
    <section class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div class="mb-4 flex items-center gap-3">
        <span class="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50 text-violet-700">
          <i data-lucide="${block.icon}" class="h-4 w-4"></i>
        </span>
        <h2 class="text-base font-black text-slate-950">${esc(getBlockLabel(block.key) || humanizeKey(block.key))}</h2>
      </div>
      <div class="text-sm leading-6 text-slate-700">${body}</div>
    </section>`;
}

function renderDetail(item) {
  const title = pickLang(item.core?.title, item.id);
  const summary = pickLang(item.core?.summary);
  const entity = pickLang(item.core?.entity?.name);
  const trackBValue = pickLang(item.classification?.trackBValue);
  const sectorCode = getSectorCode(item.core?.sector);
  const transitions = asArray(item.classification?.tripleTransition);
  const policies = asArray(item.classification?.policyCluster);
  const focuses = asArray(item.classification?.aiSteamFocus);
  const blocks = DETAIL_BLOCKS.map(block => renderDetailBlock(item, block)).filter(Boolean);

  return `
    <section class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <button id="mp-back" type="button" class="mb-6 inline-flex items-center gap-2 text-sm font-bold text-violet-700 hover:text-violet-900">
        <i data-lucide="arrow-left" class="h-4 w-4"></i>
        Volver al marketplace
      </button>

      <div class="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div class="bg-slate-950 px-5 py-7 text-white sm:px-8 sm:py-9">
          <div class="flex flex-wrap gap-2">
            ${renderBadge(getTypeLabel(item.type), 'bg-white/10 text-white ring-white/20')}
            ${renderBadge(getStatusLabel(item.core?.status), 'bg-emerald-400/15 text-emerald-100 ring-emerald-300/25')}
            ${renderBadge(getEvidenceLabel(item.classification?.evidenceMaturity), 'bg-sky-400/15 text-sky-100 ring-sky-300/25')}
            ${renderBadge(getEngagementLabel(item.classification?.engagementLevel), 'bg-amber-400/15 text-amber-100 ring-amber-300/25')}
          </div>
          <h1 class="mt-5 max-w-4xl text-3xl font-black leading-tight sm:text-4xl">${esc(title)}</h1>
          ${summary ? `<p class="mt-4 max-w-4xl text-base leading-7 text-slate-200">${esc(summary)}</p>` : ''}
          <div class="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-300">
            ${entity ? `<span class="inline-flex items-center gap-2"><i data-lucide="building-2" class="h-4 w-4"></i>${esc(entity)}</span>` : ''}
            ${item.core?.publishedAtLabel ? `<span class="inline-flex items-center gap-2"><i data-lucide="calendar" class="h-4 w-4"></i>${esc(item.core.publishedAtLabel)}</span>` : ''}
            ${item.core?.deadlineLabel ? `<span class="inline-flex items-center gap-2"><i data-lucide="timer" class="h-4 w-4"></i>${esc(item.core.deadlineLabel)}</span>` : ''}
          </div>
        </div>

        <div class="px-5 py-5 sm:px-8">
          <div class="flex flex-wrap gap-2">
            ${renderBadge(getSectorLabel(item.core?.sector))}
            ${renderBadge(getStakeholderLabel(item.core?.stakeholderCategory))}
            ${transitions.map(value => renderBadge(getTransitionLabel(value))).join('')}
            ${policies.map(value => renderBadge(getPolicyLabel(value))).join('')}
            ${focuses.map(value => renderBadge(getFocusLabel(value))).join('')}
          </div>
          ${trackBValue ? `
            <div class="mt-5 rounded-lg bg-violet-50 p-4 text-sm leading-6 text-violet-950 ring-1 ring-violet-100">
              <strong>Valor Track B:</strong> ${esc(trackBValue)}
            </div>` : ''}
        </div>
      </div>

      <div class="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div class="grid gap-5 md:grid-cols-2">
          ${blocks.join('') || `<p class="rounded-lg border border-slate-200 bg-white p-5 text-sm text-slate-500">Este elemento todavía no tiene bloques de detalle publicados.</p>`}
        </div>
        <aside class="space-y-5">
          <section class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 class="text-base font-black text-slate-950">Resumen operativo</h2>
            <dl class="mt-4 space-y-3 text-sm">
              ${renderSummaryRow('Tipo', getTypeLabel(item.type))}
              ${renderSummaryRow('Estado', getStatusLabel(item.core?.status))}
              ${renderSummaryRow('Sector', getSectorLabel(item.core?.sector))}
              ${renderSummaryRow('Agente', getStakeholderLabel(item.core?.stakeholderCategory))}
              ${renderSummaryRow('Madurez', getEvidenceLabel(item.classification?.evidenceMaturity))}
              ${renderSummaryRow('Participación', getEngagementLabel(item.classification?.engagementLevel))}
            </dl>
          </section>
          ${renderCallToAction(item)}
        </aside>
      </div>
    </section>`;
}

function renderSummaryRow(label, value) {
  if (!value) return '';
  return `
    <div>
      <dt class="text-xs font-bold uppercase tracking-wide text-slate-400">${esc(label)}</dt>
      <dd class="mt-1 font-semibold text-slate-700">${esc(value)}</dd>
    </div>`;
}

function renderCallToAction(item) {
  const access = item.access || {};
  const detailAccess = item.detail?.access || {};
  const label = pickLang(access.ctaLabel) || pickLang(detailAccess.ctaLabel) || 'Solicitar participación';
  const url = pickLang(access.url) || pickLang(detailAccess.url);
  const href = url || '#';
  return `
    <section class="rounded-lg border border-violet-200 bg-violet-50 p-5 shadow-sm">
      <h2 class="text-base font-black text-violet-950">Siguiente paso</h2>
      ${pickLang(access.instructions) ? `<p class="mt-2 text-sm leading-6 text-violet-900">${esc(pickLang(access.instructions))}</p>` : ''}
      <a ${url ? `href="${esc(href)}"` : ''} class="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-violet-700 px-4 py-2 text-sm font-bold text-white transition hover:bg-violet-800">
        ${esc(label)}
        <i data-lucide="arrow-right" class="h-4 w-4"></i>
      </a>
    </section>`;
}

function renderEmptyState(total) {
  return `
    <div id="mp-grid" class="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center">
      <i data-lucide="search-x" class="mx-auto h-8 w-8 text-slate-400"></i>
      <h3 class="mt-3 text-lg font-black text-slate-900">No hay resultados con esos filtros</h3>
      <p class="mt-2 text-sm text-slate-500">Prueba a ajustar la búsqueda o limpiar filtros. Hay ${total} elementos publicados.</p>
      <button id="mp-clear-all" type="button" class="mt-4 rounded-full bg-violet-700 px-4 py-2 text-sm font-bold text-white hover:bg-violet-800">Limpiar filtros</button>
    </div>`;
}

function renderList(items) {
  const filters = getMpFilters();
  const search = getMpSearch();
  const filtered = getFilteredItems(items, filters, search);
  const searchExpanded = getMpSearchExpanded();
  const filterPanelExpanded = getMpFilterPanelExpanded();
  const hero = MARKETPLACE_CONFIG.heroBlock || {};
  const stats = getStats(items);

  return `
    <section class="bg-slate-950 text-white">
      <div class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div class="grid gap-8 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-end">
          <div>
            <p class="text-sm font-bold uppercase tracking-wide text-violet-200">AI-STEAM Network · Track B</p>
            <h1 class="mt-3 max-w-4xl text-4xl font-black leading-tight sm:text-5xl">${esc(pickLang(hero.title, 'Marketplace Track B'))}</h1>
            <p class="mt-4 max-w-3xl text-base leading-7 text-slate-200">${esc(pickLang(hero.description, 'Retos, casos, validaciones, mentorías, pilotajes y recursos para transferencia real en IA, STEAM, arte y creatividad.'))}</p>
          </div>
          <div class="grid grid-cols-3 gap-3">
            ${stats.map(stat => `
              <div class="rounded-lg bg-white/10 p-4 ring-1 ring-white/15">
                <p class="text-2xl font-black">${stat.value}</p>
                <p class="mt-1 text-xs font-semibold text-slate-300">${esc(stat.label)}</p>
              </div>`).join('')}
          </div>
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div class="flex flex-wrap items-center gap-2">
            <button id="mp-search-toggle" type="button" class="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 hover:border-violet-300 hover:text-violet-800">
              <i data-lucide="search" class="h-4 w-4"></i>
              Buscar
            </button>
            <button id="mp-filter-panel-toggle" type="button" class="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 hover:border-violet-300 hover:text-violet-800">
              <i data-lucide="sliders-horizontal" class="h-4 w-4"></i>
              Filtros
            </button>
          </div>
          <p id="mp-results-count" class="text-sm font-semibold text-slate-500">Mostrando <strong>${filtered.length}</strong> de ${items.length} elementos</p>
        </div>

        ${searchExpanded ? `
          <div class="mt-4 flex gap-2">
            <input id="mp-search" value="${esc(search)}" type="search" placeholder="Buscar por título, entidad, sector, foco o etiqueta"
              class="min-h-11 w-full rounded-lg border border-slate-200 px-4 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100">
            ${search ? `<button id="mp-search-clear" type="button" class="rounded-lg border border-slate-200 px-3 text-slate-500 hover:text-slate-800"><i data-lucide="x" class="h-4 w-4"></i></button>` : ''}
          </div>` : ''}

        ${filterPanelExpanded ? renderFilterPanel(items, filters) : ''}
        <div id="mp-active-filter-slot" class="${hasMpFilters(filters, search) ? 'mt-4' : ''}">${renderActiveFilters(filters, search)}</div>
      </div>

      <div class="mt-6">
        ${filtered.length ? `<div id="mp-grid" class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">${filtered.map(renderCard).join('')}</div>` : renderEmptyState(items.length)}
      </div>
    </section>`;
}

function renderFilterPanel(items, filters) {
  const groups = [
    ['Tipo', 'type', 'types', buildOptions(items, 'types', getTypeLabel)],
    ['Estado', 'status', 'statuses', buildOptions(items, 'statuses', getStatusLabel)],
    ['Sector', 'sector', 'sectors', buildOptions(items, 'sectors', getSectorLabel)],
    ['Agente', 'stakeholder', 'stakeholders', buildOptions(items, 'stakeholders', getStakeholderLabel)],
    ['Transición', 'transition', 'transitions', buildOptions(items, 'transitions', getTransitionLabel)],
    ['Política', 'policy', 'policies', buildOptions(items, 'policies', getPolicyLabel)],
    ['Participación', 'engagement', 'engagements', buildOptions(items, 'engagements', getEngagementLabel)],
    ['Evidencia', 'evidence', 'evidences', buildOptions(items, 'evidences', getEvidenceLabel)],
    ['Foco AI-STEAM', 'focus', 'focuses', buildOptions(items, 'focuses', getFocusLabel)],
    ['Etiquetas', 'tag', 'tags', buildOptions(items, 'tags', value => value)],
  ];
  return `
    <div class="mt-5 grid gap-5 border-t border-slate-100 pt-5 md:grid-cols-2 lg:grid-cols-3">
      ${groups.map(([title, dimension, key, options]) => renderFilterGroup(title, dimension, options, filters[key])).join('')}
    </div>`;
}

function getStats(items) {
  return [
    { value: items.length, label: 'Elementos' },
    { value: items.filter(item => item.core?.status === 'open').length, label: 'Abiertos' },
    { value: new Set(items.flatMap(item => asArray(item.classification?.aiSteamFocus))).size, label: 'Focos AI-STEAM' },
  ];
}

export function render() {
  const items = getItems();
  const selectedId = getState('selectedChallengeId');
  const selected = items.find(item => item.id === selectedId);
  return selected ? renderDetail(selected) : renderList(items);
}

export function mount() {
  const items = getItems();

  document.getElementById('mp-back')?.addEventListener('click', () => {
    setState('selectedChallengeId', null);
    window.history.pushState({}, '', window.location.pathname);
    rerender();
    window.scrollTo({ top: 0, behavior: 'instant' });
  });

  document.getElementById('mp-filter-panel-toggle')?.addEventListener('click', () => {
    setMpFilterPanelExpanded(!getMpFilterPanelExpanded());
    rerender();
  });

  document.getElementById('mp-search-toggle')?.addEventListener('click', () => {
    setMpSearchExpanded(!getMpSearchExpanded());
    rerender();
  });

  document.getElementById('mp-search')?.addEventListener('input', event => {
    setMpSearch(event.target.value);
    updateMpGrid();
  });

  document.getElementById('mp-search-clear')?.addEventListener('click', () => {
    setMpSearch('');
    rerender();
  });

  document.getElementById('mp-clear-all')?.addEventListener('click', () => {
    clearMpFilters();
    rerender();
  });

  document.getElementById('mp-clear-active-filters')?.addEventListener('click', () => {
    clearMpFilters();
    rerender();
  });

  document.querySelectorAll('[data-mp-chip]').forEach(button => {
    button.addEventListener('click', () => {
      const key = DIM_MAP_GRID[button.dataset.mpChip];
      if (!key) return;
      const filters = getMpFilters();
      filters[key] = toggleMpFilter(filters[key], button.dataset.mpVal);
      setMpFilters(filters);
      rerender();
    });
  });

  document.querySelectorAll('[data-mp-remove]').forEach(button => {
    button.addEventListener('click', () => {
      const key = button.dataset.mpRemove;
      if (key === 'search') {
        setMpSearch('');
      } else {
        const filters = getMpFilters();
        filters[key] = filters[key]?.filter(value => value !== button.dataset.mpVal) || [];
        setMpFilters(filters);
      }
      rerender();
    });
  });

  document.querySelectorAll('.mp-view-detail').forEach(button => {
    button.addEventListener('click', () => {
      setState('selectedChallengeId', button.dataset.id);
      window.history.pushState({ itemId: button.dataset.id }, '', window.location.pathname);
      rerender();
      window.scrollTo({ top: 0, behavior: 'instant' });
    });
  });

  window.onpopstate = () => {
    if (!getState('selectedChallengeId')) return;
    setState('selectedChallengeId', null);
    rerender();
  };

  if (!items.length) clearMpFilters();
}

function rerender() {
  const main = document.getElementById('main-root');
  if (!main) return;
  main.innerHTML = render();
  mount();
  if (window.lucide) window.lucide.createIcons();
}

function updateMpGrid() {
  const items = getItems();
  const filters = getMpFilters();
  const search = getMpSearch();
  const filtered = getFilteredItems(items, filters, search);

  document.getElementById('mp-results-count')?.replaceChildren();
  const count = document.getElementById('mp-results-count');
  if (count) count.innerHTML = `Mostrando <strong>${filtered.length}</strong> de ${items.length} elementos`;

  const activeSlot = document.getElementById('mp-active-filter-slot');
  const renderedActive = renderActiveFilters(filters, search);
  if (activeSlot) {
    activeSlot.className = hasMpFilters(filters, search) ? 'mt-4' : '';
    activeSlot.innerHTML = renderedActive;
  }

  const grid = document.getElementById('mp-grid');
  if (!grid) {
    rerender();
    return;
  }
  grid.outerHTML = filtered.length
    ? `<div id="mp-grid" class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">${filtered.map(renderCard).join('')}</div>`
    : renderEmptyState(items.length);

  bindDynamicListControls();
  if (window.lucide) window.lucide.createIcons();
}

function bindDynamicListControls() {
  document.querySelectorAll('#mp-grid [data-mp-chip]').forEach(button => {
    button.addEventListener('click', () => {
      const key = DIM_MAP_GRID[button.dataset.mpChip];
      if (!key) return;
      const filters = getMpFilters();
      filters[key] = toggleMpFilter(filters[key], button.dataset.mpVal);
      setMpFilters(filters);
      rerender();
    });
  });

  document.querySelectorAll('#mp-active-filter-slot [data-mp-remove]').forEach(button => {
    button.addEventListener('click', () => {
      const key = button.dataset.mpRemove;
      if (key === 'search') {
        setMpSearch('');
      } else {
        const filters = getMpFilters();
        filters[key] = filters[key]?.filter(value => value !== button.dataset.mpVal) || [];
        setMpFilters(filters);
      }
      rerender();
    });
  });

  document.querySelectorAll('#mp-grid .mp-view-detail').forEach(button => {
    button.addEventListener('click', () => {
      setState('selectedChallengeId', button.dataset.id);
      window.history.pushState({ itemId: button.dataset.id }, '', window.location.pathname);
      rerender();
      window.scrollTo({ top: 0, behavior: 'instant' });
    });
  });

  document.getElementById('mp-clear-all')?.addEventListener('click', () => {
    clearMpFilters();
    rerender();
  });

  document.getElementById('mp-clear-active-filters')?.addEventListener('click', () => {
    clearMpFilters();
    rerender();
  });
}
