import { t } from '../i18n.js';
import { getState, setState } from '../state.js';
import { MARKETPLACE_CONFIG } from '../../data/marketplace.js';

const MP_FILTER_KEY = 'mpFilters';
const MP_SEARCH_KEY = 'mpSearch';
const MP_EXPANDED_KEY = 'mpSearchExpanded';
const MP_PANEL_KEY = 'mpFilterPanelExpandedV2';

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
  open: 'bg-green-100 text-green-800 border-eu-border',
  'in-progress': 'bg-orange-100 text-orange-800 border-eu-border',
  resolved: 'bg-gray-100 text-gray-600 border-eu-border',
};

const TYPE_TONE = {
  challenge: 'bg-eu-blue/10 text-eu-blue border-eu-blue/20',
  case: 'bg-eu-orange/10 text-eu-orange border-eu-orange/20',
  validation: 'bg-blue-50 text-blue-700 border-blue-200',
  mentoring: 'bg-purple-100 text-purple-800 border-purple-300',
  pilot: 'bg-green-100 text-green-800 border-eu-border',
  resource: 'bg-eu-bg text-gray-700 border-eu-border',
};

const UI_TEXT = {
  backMarketplace: { es: 'Volver a Retos y Casos', en: 'Back to Challenges & Cases', va: 'Tornar a Reptes i Casos' },
  trackBValue: { es: 'Valor Track B', en: 'Track B value', va: 'Valor Track B' },
  detailEmpty: { es: 'Este elemento todavía no tiene bloques de detalle publicados.', en: 'This item does not have published detail blocks yet.', va: 'Aquest element encara no té blocs de detall publicats.' },
  operationalSummary: { es: 'Resumen operativo', en: 'Operational summary', va: 'Resum operatiu' },
  nextStep: { es: 'Siguiente paso', en: 'Next step', va: 'Següent pas' },
  participationRequest: { es: 'Solicitar participación', en: 'Request participation', va: 'Sol·licitar participació' },
  searchPlaceholder: { es: 'Buscar por título, entidad, sector, foco o etiqueta', en: 'Search by title, organisation, sector, focus or tag', va: 'Busca per títol, entitat, sector, focus o etiqueta' },
  statItems: { es: 'Elementos', en: 'Items', va: 'Elements' },
  statOpen: { es: 'Abiertos', en: 'Open', va: 'Oberts' },
  statFocuses: { es: 'Focos AI-STEAM', en: 'AI-STEAM focuses', va: 'Focus AI-STEAM' },
  summaryType: { es: 'Tipo', en: 'Type', va: 'Tipus' },
  summaryStatus: { es: 'Estado', en: 'Status', va: 'Estat' },
  summarySector: { es: 'Sector', en: 'Sector', va: 'Sector' },
  summaryAgent: { es: 'Agente', en: 'Agent', va: 'Agent' },
  summaryMaturity: { es: 'Madurez', en: 'Maturity', va: 'Maduresa' },
  summaryEngagement: { es: 'Participación', en: 'Participation', va: 'Participació' },
  filterType: { es: 'Tipo', en: 'Type', va: 'Tipus' },
  filterStatus: { es: 'Estado', en: 'Status', va: 'Estat' },
  filterSector: { es: 'Sector', en: 'Sector', va: 'Sector' },
  filterAgent: { es: 'Agente', en: 'Agent', va: 'Agent' },
  filterTransition: { es: 'Transición', en: 'Transition', va: 'Transició' },
  filterPolicy: { es: 'Política', en: 'Policy', va: 'Política' },
  filterEngagement: { es: 'Participación', en: 'Participation', va: 'Participació' },
  filterEvidence: { es: 'Evidencia', en: 'Evidence', va: 'Evidència' },
  filterFocus: { es: 'Foco AI-STEAM', en: 'AI-STEAM focus', va: 'Focus AI-STEAM' },
  filterTags: { es: 'Etiquetas', en: 'Tags', va: 'Etiquetes' },
  activeFilters: { es: 'Filtros activos', en: 'Active filters', va: 'Filtres actius' },
  clearAll: { es: 'Limpiar todo', en: 'Clear all', va: 'Netejar-ho tot' },
  clearFilters: { es: 'Limpiar filtros', en: 'Clear filters', va: 'Netejar filtres' },
  viewDetail: { es: 'Ver detalle', en: 'View detail', va: 'Veure detall' },
  noResultsTitle: { es: 'No hay resultados con esos filtros', en: 'No results with those filters', va: 'No hi ha resultats amb aquests filtres' },
  noResultsMessage: { es: 'Prueba a ajustar la búsqueda o limpiar filtros. Hay {{total}} elementos publicados.', en: 'Try adjusting the search or clearing filters. There are {{total}} published items.', va: 'Prova a ajustar la cerca o netejar filtres. Hi ha {{total}} elements publicats.' },
  searchAction: { es: 'Buscar', en: 'Search', va: 'Buscar' },
  filtersAction: { es: 'Filtros', en: 'Filters', va: 'Filtres' },
  resultsCount: { es: 'Mostrando <strong>{{count}}</strong> de {{total}} elementos', en: 'Showing <strong>{{count}}</strong> of {{total}} items', va: 'Mostrant <strong>{{count}}</strong> de {{total}} elements' },
  heroDescriptionFallback: { es: 'Retos, casos, validaciones, mentorías, pilotajes y recursos para transferencia real en IA, STEAM, arte y creatividad.', en: 'Challenges, cases, validations, mentoring, pilots and resources for real transfer in AI, STEAM, art and creativity.', va: 'Reptes, casos, validacions, mentories, pilotatges i recursos per a transferència real en IA, STEAM, art i creativitat.' },
};

const FIELD_LABELS = {
  method: { es: 'Método', en: 'Method', va: 'Mètode' },
  indicators: { es: 'Indicadores', en: 'Indicators', va: 'Indicadors' },
  metric: { es: 'Métrica', en: 'Metric', va: 'Mètrica' },
  expected: { es: 'Entregables previstos', en: 'Expected deliverables', va: 'Entregables previstos' },
  milestones: { es: 'Hitos', en: 'Milestones', va: 'Fites' },
  date: { es: 'Fecha', en: 'Date', va: 'Data' },
  available: { es: 'Recursos disponibles', en: 'Available resources', va: 'Recursos disponibles' },
  format: { es: 'Formato', en: 'Format', va: 'Format' },
  license: { es: 'Licencia', en: 'License', va: 'Llicència' },
  publicUrl: { es: 'URL pública', en: 'Public URL', va: 'URL pública' },
  rightsNote: { es: 'Derechos y privacidad', en: 'Rights and privacy', va: 'Drets i privacitat' },
  privacyLevel: { es: 'Nivel de privacidad', en: 'Privacy level', va: 'Nivell de privacitat' },
  ctaLabel: { es: 'Acción', en: 'Action', va: 'Acció' },
  instructions: { es: 'Instrucciones', en: 'Instructions', va: 'Instruccions' },
  url: { es: 'Enlace', en: 'Link', va: 'Enllaç' },
  modality: { es: 'Modalidad', en: 'Modality', va: 'Modalitat' },
  availability: { es: 'Disponibilidad', en: 'Availability', va: 'Disponibilitat' },
  result: { es: 'Resultado', en: 'Result', va: 'Resultat' },
  learningSignals: { es: 'Señales de aprendizaje', en: 'Learning signals', va: 'Senyals d’aprenentatge' },
  nextStep: { es: 'Próximo paso', en: 'Next step', va: 'Pròxim pas' },
  mainResource: { es: 'Recurso principal', en: 'Main resource', va: 'Recurs principal' },
  organisations: { es: 'Organizaciones', en: 'Organisations', va: 'Organitzacions' },
  role: { es: 'Rol', en: 'Role', va: 'Rol' },
  expertise: { es: 'Experiencia', en: 'Expertise', va: 'Experiència' },
  contact: { es: 'Contacto', en: 'Contact', va: 'Contacte' },
  owner: { es: 'Responsable', en: 'Owner', va: 'Responsable' },
  value: { es: 'Valor', en: 'Value', va: 'Valor' },
  question: { es: 'Pregunta guía', en: 'Guiding question', va: 'Pregunta guia' },
  dataInputs: { es: 'Datos de entrada', en: 'Data inputs', va: 'Dades d’entrada' },
  targetUsers: { es: 'Usuarios destinatarios', en: 'Target users', va: 'Usuaris destinataris' },
  learningSetting: { es: 'Contexto de aprendizaje', en: 'Learning setting', va: 'Context d’aprenentatge' },
  participants: { es: 'Participantes', en: 'Participants', va: 'Participants' },
};

function getLang() {
  return localStorage.getItem('language') || 'es';
}

function uiText(key) {
  return pickLang(UI_TEXT[key], key);
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
  return primary.filter(item => item.visible !== false);
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
  if (active) return 'bg-eu-blue text-white border-eu-blue';
  return `${tone || 'bg-white text-gray-700 border-eu-border'} hover:border-eu-blue hover:text-eu-blue`;
}

function renderClickableChip(dimension, value, label, active = false, tone = '') {
  if (!value || !label) return '';
  return `
    <button type="button" data-mp-chip="${dimension}" data-mp-val="${esc(value)}"
      class="inline-flex items-center rounded border px-2 py-0.5 text-xs font-semibold leading-5 transition-colors cursor-pointer ${chipClasses(active, tone)}">
      ${esc(label)}
    </button>`;
}

function renderBadge(label, tone = 'bg-eu-bg text-gray-700 border-eu-border') {
  if (!label) return '';
  return `<span class="inline-flex items-center rounded border px-2 py-0.5 text-xs font-semibold ${tone}">${esc(label)}</span>`;
}

function renderFilterGroup(title, dimension, options, activeValues) {
  if (!options.length) return '';
  const activeCount = activeValues?.length || 0;
  return `
    <details class="rounded-lg border border-eu-border bg-white">
      <summary class="flex min-h-10 cursor-pointer list-none items-center justify-between gap-3 px-3 py-2 text-xs font-bold uppercase tracking-wide text-gray-600 hover:text-eu-blue">
        <span>${esc(title)}</span>
        <span class="inline-flex items-center gap-2">
          ${activeCount ? `<span class="rounded bg-eu-blue px-1.5 py-0.5 text-xs text-white">${activeCount}</span>` : ''}
          <i data-lucide="chevron-down" class="h-3.5 w-3.5"></i>
        </span>
      </summary>
      <div class="flex flex-wrap gap-1.5 border-t border-eu-border bg-eu-bg p-3">
        ${options.map(option => renderClickableChip(dimension, option.value, option.label, activeValues.includes(option.value))).join('')}
      </div>
    </details>`;
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
      class="inline-flex items-center gap-1.5 rounded bg-eu-bg px-3 py-1.5 text-xs font-semibold text-gray-700 border border-eu-border hover:border-eu-blue hover:text-eu-blue transition-colors cursor-pointer">
      ${esc(labels[key](value))}
      <i data-lucide="x" class="h-3 w-3"></i>
    </button>`));
  if (search) {
    chips.unshift(`
      <button type="button" data-mp-remove="search" data-mp-val=""
        class="inline-flex items-center gap-1.5 rounded bg-eu-blue/10 px-3 py-1.5 text-xs font-semibold text-eu-blue border border-eu-blue/20 hover:bg-eu-blue/20 transition-colors cursor-pointer">
        ${esc(search)}
        <i data-lucide="x" class="h-3 w-3"></i>
      </button>`);
  }
  return `
    <div id="mp-active-filters" class="flex flex-wrap items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 p-4">
      <span class="text-xs font-semibold text-gray-700">${esc(uiText('activeFilters'))}:</span>
      ${chips.join('')}
      <button id="mp-clear-active-filters" type="button" class="ml-auto rounded border border-red-200 px-2.5 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer">
        ${esc(uiText('clearAll'))}
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
    <article class="group flex h-full flex-col overflow-hidden rounded-xl border border-eu-border bg-white shadow-sm transition-colors hover:border-eu-blue">
      <div class="p-5 flex-1">
      <div class="flex flex-wrap items-center gap-2 mb-3">
        ${renderClickableChip('type', item.type, getTypeLabel(item.type), active.types.includes(item.type), TYPE_TONE[item.type])}
        ${renderClickableChip('status', item.core?.status, getStatusLabel(item.core?.status), active.statuses.includes(item.core?.status), STATUS_TONE[item.core?.status])}
        ${renderClickableChip('evidence', item.classification?.evidenceMaturity, getEvidenceLabel(item.classification?.evidenceMaturity), active.evidences.includes(item.classification?.evidenceMaturity))}
      </div>

      <div>
        <h3 class="font-bold text-eu-text text-base leading-snug group-hover:text-eu-blue transition-colors">${esc(title)}</h3>
        ${entity ? `<p class="mt-1 text-xs font-semibold text-gray-500">${esc(entity)}${item.core?.entity?.type ? ` · ${esc(pickLang(item.core.entity.type))}` : ''}</p>` : ''}
        ${summary ? `<p class="mt-3 line-clamp-2 text-sm leading-6 text-gray-600">${esc(summary)}</p>` : ''}
      </div>

      <div class="mt-4 flex flex-wrap gap-2">
        ${renderClickableChip('sector', sectorCode, getSectorLabel(item.core?.sector), active.sectors.includes(sectorCode))}
        ${renderClickableChip('stakeholder', item.core?.stakeholderCategory, getStakeholderLabel(item.core?.stakeholderCategory), active.stakeholders.includes(item.core?.stakeholderCategory))}
        ${transitions.map(value => renderClickableChip('transition', value, getTransitionLabel(value), active.transitions.includes(value))).join('')}
        ${focuses.map(value => renderClickableChip('focus', value, getFocusLabel(value), active.focuses.includes(value))).join('')}
      </div>

      ${signal ? `
        <div class="mt-4 rounded-lg border border-eu-border bg-eu-bg p-3 text-xs leading-relaxed text-gray-700">
          <span class="font-bold text-eu-text">${esc(getTypeLabel(item.type))}:</span>
          ${esc(signal)}
        </div>` : ''}
      </div>

      <div class="border-t border-eu-border bg-eu-bg p-3 flex items-center justify-between gap-3">
        <span class="text-xs font-semibold uppercase text-gray-500">Track B</span>
        <button type="button" data-id="${esc(item.id)}"
          class="mp-view-detail inline-flex items-center gap-1.5 text-eu-blue text-xs font-bold hover:underline cursor-pointer">
          ${esc(uiText('viewDetail'))}
          <i data-lucide="arrow-right" class="h-3.5 w-3.5"></i>
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
    return `<ul class="space-y-2">${items.map(item => `<li class="flex gap-2"><span class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-eu-blue"></span><span>${item}</span></li>`).join('')}</ul>`;
  }
  if (typeof localized === 'object') {
    if (localized.label) return renderLabeledObject(localized);
    return renderObjectValue(localized);
  }
  return `<span>${esc(localized)}</span>`;
}

function renderLabeledObject(value) {
  const label = pickLang(value.label);
  const meta = Object.entries(value || {})
    .filter(([key]) => key !== 'label')
    .map(([key, entry]) => [key, renderTextValue(entry)])
    .filter(([, rendered]) => rendered);
  if (!label && !meta.length) return '';
  if (!meta.length) return `<span>${esc(label)}</span>`;
  return `
    <div>
      ${label ? `<p class="font-semibold text-gray-800">${esc(label)}</p>` : ''}
      <dl class="mt-2 space-y-2">${meta.map(([key, rendered]) => `
        <div>
          <dt class="text-xs font-bold uppercase tracking-wide text-gray-500">${esc(getFieldLabel(key))}</dt>
          <dd class="mt-0.5 text-sm leading-6 text-gray-700">${rendered}</dd>
        </div>`).join('')}</dl>
    </div>`;
}

function renderObjectValue(value) {
  const entries = Object.entries(value || {})
    .map(([key, entry]) => [key, renderTextValue(entry)])
    .filter(([, rendered]) => rendered);
  if (!entries.length) return '';
  return `<dl class="space-y-3">${entries.map(([key, rendered]) => `
    <div>
      <dt class="text-xs font-bold uppercase tracking-wide text-gray-500">${esc(getFieldLabel(key))}</dt>
      <dd class="mt-1 text-sm leading-6 text-gray-700">${rendered}</dd>
    </div>`).join('')}</dl>`;
}

function getFieldLabel(key) {
  return pickLang(FIELD_LABELS[key], humanizeKey(key));
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
    <section class="rounded-xl border border-eu-border bg-white p-6 shadow-sm">
      <div class="mb-4 flex items-center gap-3">
        <span class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-eu-blue/10 text-eu-blue">
          <i data-lucide="${block.icon}" class="h-5 w-5"></i>
        </span>
        <h2 class="text-base font-bold text-eu-text">${esc(getBlockLabel(block.key) || humanizeKey(block.key))}</h2>
      </div>
      <div class="text-sm leading-6 text-gray-700">${body}</div>
    </section>`;
}

function renderDetail(item) {
  const title = pickLang(item.core?.title, item.id);
  const summary = pickLang(item.core?.summary);
  const entity = pickLang(item.core?.entity?.name);
  const publishedAtLabel = pickLang(item.core?.publishedAtLabel);
  const deadlineLabel = pickLang(item.core?.deadlineLabel);
  const trackBValue = pickLang(item.classification?.trackBValue);
  const sectorCode = getSectorCode(item.core?.sector);
  const transitions = asArray(item.classification?.tripleTransition);
  const policies = asArray(item.classification?.policyCluster);
  const focuses = asArray(item.classification?.aiSteamFocus);
  const blocks = DETAIL_BLOCKS.map(block => renderDetailBlock(item, block)).filter(Boolean);

  return `
    <div>
      <section class="bg-eu-blue px-6 py-12 text-white">
        <div class="mx-auto max-w-7xl">
          <button id="mp-back" type="button" class="mb-7 inline-flex min-h-10 items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm font-bold text-white hover:bg-white/20 transition-colors cursor-pointer">
            <i data-lucide="arrow-left" class="h-4 w-4"></i>
            ${esc(uiText('backMarketplace'))}
          </button>
          <div class="flex flex-wrap gap-2">
            ${renderBadge(getTypeLabel(item.type), 'bg-white/10 text-white border-white/20')}
            ${renderBadge(getStatusLabel(item.core?.status), 'bg-white/10 text-white border-white/20')}
            ${renderBadge(getEvidenceLabel(item.classification?.evidenceMaturity), 'bg-white/10 text-white border-white/20')}
            ${renderBadge(getEngagementLabel(item.classification?.engagementLevel), 'bg-white/10 text-white border-white/20')}
          </div>
          <h1 class="mt-5 max-w-4xl text-3xl font-extrabold leading-tight">${esc(title)}</h1>
          ${summary ? `<p class="mt-4 max-w-4xl text-base leading-7 text-white/80">${esc(summary)}</p>` : ''}
          <div class="mt-6 flex flex-wrap items-center gap-8 text-sm text-white/75">
            ${entity ? `<span class="inline-flex items-center gap-2"><i data-lucide="building-2" class="h-4 w-4"></i>${esc(entity)}</span>` : ''}
            ${publishedAtLabel ? `<span class="inline-flex items-center gap-2"><i data-lucide="calendar" class="h-4 w-4"></i>${esc(publishedAtLabel)}</span>` : ''}
            ${deadlineLabel ? `<span class="inline-flex items-center gap-2"><i data-lucide="timer" class="h-4 w-4"></i>${esc(deadlineLabel)}</span>` : ''}
          </div>
        </div>
      </section>

      <section class="mx-auto max-w-7xl px-6 py-8">
        <div class="rounded-xl border border-eu-border bg-white p-5 shadow-sm">
          <div class="flex flex-wrap gap-2">
            ${renderBadge(getSectorLabel(item.core?.sector))}
            ${renderBadge(getStakeholderLabel(item.core?.stakeholderCategory))}
            ${transitions.map(value => renderBadge(getTransitionLabel(value))).join('')}
            ${policies.map(value => renderBadge(getPolicyLabel(value))).join('')}
            ${focuses.map(value => renderBadge(getFocusLabel(value))).join('')}
          </div>
          ${trackBValue ? `
            <div class="mt-4 rounded-lg border border-eu-blue/20 bg-eu-blue/10 p-4 text-sm leading-6 text-eu-text">
              <strong>${esc(uiText('trackBValue'))}:</strong> ${esc(trackBValue)}
            </div>` : ''}
        </div>

        <div class="mt-6 grid gap-6 lg:grid-cols-3">
          <div class="grid gap-5 md:grid-cols-2 lg:col-span-2">
            ${blocks.join('') || `<p class="rounded-xl border border-eu-border bg-white p-6 text-sm text-gray-500 shadow-sm">${esc(uiText('detailEmpty'))}</p>`}
          </div>
          <aside class="space-y-5">
            <section class="rounded-xl border border-eu-border bg-white p-5 shadow-sm">
              <h2 class="text-base font-bold text-eu-text">${esc(uiText('operationalSummary'))}</h2>
              <dl class="mt-4 space-y-3 text-sm">
                ${renderSummaryRow(uiText('summaryType'), getTypeLabel(item.type))}
                ${renderSummaryRow(uiText('summaryStatus'), getStatusLabel(item.core?.status))}
                ${renderSummaryRow(uiText('summarySector'), getSectorLabel(item.core?.sector))}
                ${renderSummaryRow(uiText('summaryAgent'), getStakeholderLabel(item.core?.stakeholderCategory))}
                ${renderSummaryRow(uiText('summaryMaturity'), getEvidenceLabel(item.classification?.evidenceMaturity))}
                ${renderSummaryRow(uiText('summaryEngagement'), getEngagementLabel(item.classification?.engagementLevel))}
              </dl>
            </section>
            ${renderCallToAction(item)}
          </aside>
        </div>
      </section>
    </div>`;
}

function renderSummaryRow(label, value) {
  if (!value) return '';
  return `
    <div>
      <dt class="text-xs font-bold uppercase tracking-wide text-gray-500">${esc(label)}</dt>
      <dd class="mt-1 font-semibold text-gray-700">${esc(value)}</dd>
    </div>`;
}

function renderCallToAction(item) {
  const access = item.access || {};
  const detailAccess = item.detail?.access || {};
  const label = pickLang(access.ctaLabel) || pickLang(detailAccess.ctaLabel) || uiText('participationRequest');
  const url = pickLang(access.url) || pickLang(detailAccess.url);
  const href = url || '#';
  return `
    <section class="rounded-xl border border-eu-border bg-eu-bg p-5 shadow-sm">
      <h2 class="text-base font-bold text-eu-text">${esc(uiText('nextStep'))}</h2>
      ${pickLang(access.instructions) ? `<p class="mt-2 text-sm leading-6 text-gray-700">${esc(pickLang(access.instructions))}</p>` : ''}
      <a ${url ? `href="${esc(href)}"` : ''} class="mt-4 inline-flex w-full min-h-11 items-center justify-center gap-2 rounded-lg bg-eu-orange px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-eu-purple">
        ${esc(label)}
        <i data-lucide="arrow-right" class="h-4 w-4"></i>
      </a>
    </section>`;
}

function renderEmptyState(total) {
  const message = uiText('noResultsMessage').replace('{{total}}', total);
  return `
    <div id="mp-grid" class="rounded-xl border border-eu-border bg-white p-8 text-center shadow-sm">
      <i data-lucide="search-x" class="mx-auto h-8 w-8 text-gray-400"></i>
      <h3 class="mt-3 text-lg font-bold text-eu-text">${esc(uiText('noResultsTitle'))}</h3>
      <p class="mt-2 text-sm text-gray-500">${esc(message)}</p>
      <button id="mp-clear-all" type="button" class="mt-4 rounded-lg bg-eu-blue px-4 py-2 text-sm font-bold text-white hover:bg-eu-purple transition-colors cursor-pointer">${esc(uiText('clearFilters'))}</button>
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
    <section class="bg-eu-blue text-white px-6 py-12">
      <div class="mx-auto max-w-7xl">
        <div class="grid gap-8 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-end">
          <div>
            <h1 class="max-w-4xl text-3xl font-extrabold leading-tight">${esc(pickLang(hero.title, 'Marketplace Track B'))}</h1>
            <p class="mt-3 max-w-3xl text-base leading-7 text-white/80">${esc(pickLang(hero.description, uiText('heroDescriptionFallback')))}</p>
          </div>
          <div class="grid grid-cols-3 gap-3">
            ${stats.map(stat => `
              <div class="rounded-xl bg-white/10 px-5 py-3 text-center">
                <p class="text-2xl font-extrabold text-eu-yellow">${stat.value}</p>
                <p class="mt-0.5 text-xs font-semibold uppercase text-white/70">${esc(stat.label)}</p>
              </div>`).join('')}
          </div>
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-7xl px-6 py-8">
      <div class="rounded-xl border border-eu-border bg-white p-5 shadow-sm">
        <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div class="flex flex-wrap items-center gap-2">
            <button id="mp-search-toggle" type="button" class="inline-flex min-h-10 items-center gap-2 rounded-lg border border-eu-border px-4 py-2 text-sm font-bold text-eu-text hover:border-eu-blue hover:text-eu-blue transition-colors cursor-pointer">
              <i data-lucide="search" class="h-4 w-4"></i>
              ${esc(uiText('searchAction'))}
            </button>
            <button id="mp-filter-panel-toggle" type="button" class="inline-flex min-h-10 items-center gap-2 rounded-lg border border-eu-border px-4 py-2 text-sm font-bold text-eu-text hover:border-eu-blue hover:text-eu-blue transition-colors cursor-pointer">
              <i data-lucide="sliders-horizontal" class="h-4 w-4"></i>
              ${esc(uiText('filtersAction'))}
              ${hasMpFilters(filters, '') ? `<span class="rounded bg-eu-blue px-1.5 py-0.5 text-xs text-white">${FILTER_KEYS.reduce((acc, key) => acc + filters[key].length, 0)}</span>` : ''}
            </button>
          </div>
          <p id="mp-results-count" class="text-sm font-semibold text-gray-500">${uiText('resultsCount').replace('{{count}}', esc(filtered.length)).replace('{{total}}', esc(items.length))}</p>
        </div>

        ${searchExpanded ? `
          <div class="mt-4 flex gap-2">
            <input id="mp-search" value="${esc(search)}" type="search" placeholder="${esc(uiText('searchPlaceholder'))}"
              class="min-h-11 w-full rounded-lg border border-eu-border px-4 text-sm outline-none focus:border-eu-blue focus:ring-2 focus:ring-eu-blue">
            ${search ? `<button id="mp-search-clear" type="button" class="rounded-lg border border-eu-border px-3 text-gray-500 hover:text-eu-text cursor-pointer"><i data-lucide="x" class="h-4 w-4"></i></button>` : ''}
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
    [uiText('filterType'), 'type', 'types', buildOptions(items, 'types', getTypeLabel)],
    [uiText('filterStatus'), 'status', 'statuses', buildOptions(items, 'statuses', getStatusLabel)],
    [uiText('filterSector'), 'sector', 'sectors', buildOptions(items, 'sectors', getSectorLabel)],
    [uiText('filterAgent'), 'stakeholder', 'stakeholders', buildOptions(items, 'stakeholders', getStakeholderLabel)],
    [uiText('filterTransition'), 'transition', 'transitions', buildOptions(items, 'transitions', getTransitionLabel)],
    [uiText('filterPolicy'), 'policy', 'policies', buildOptions(items, 'policies', getPolicyLabel)],
    [uiText('filterEngagement'), 'engagement', 'engagements', buildOptions(items, 'engagements', getEngagementLabel)],
    [uiText('filterEvidence'), 'evidence', 'evidences', buildOptions(items, 'evidences', getEvidenceLabel)],
    [uiText('filterFocus'), 'focus', 'focuses', buildOptions(items, 'focuses', getFocusLabel)],
    [uiText('filterTags'), 'tag', 'tags', buildOptions(items, 'tags', value => value)],
  ];
  return `
    <div class="mt-4 border-t border-eu-border pt-4">
      <div class="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
      ${groups.map(([title, dimension, key, options]) => renderFilterGroup(title, dimension, options, filters[key])).join('')}
      </div>
    </div>`;
}

function getStats(items) {
  return [
    { value: items.length, label: uiText('statItems') },
    { value: items.filter(item => item.core?.status === 'open').length, label: uiText('statOpen') },
    { value: new Set(items.flatMap(item => asArray(item.classification?.aiSteamFocus))).size, label: uiText('statFocuses') },
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
  if (count) count.innerHTML = uiText('resultsCount')
    .replace('{{count}}', esc(filtered.length))
    .replace('{{total}}', esc(items.length));

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
