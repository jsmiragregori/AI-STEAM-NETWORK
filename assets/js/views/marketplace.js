import { t } from '../i18n.js';
import { getState, setState } from '../state.js';
import { MARKETPLACE_CONFIG } from '../../data/marketplace.js';

const UI_TEXT = {
  backCommunity: {
    es: 'Volver a Comunidad',
    en: 'Back to Community',
    va: 'Tornar a Comunitat',
  },
  created: {
    es: 'Creado',
    en: 'Created',
    va: 'Creat',
  },
  clearFilters: {
    es: 'Limpiar filtros',
    en: 'Clear filters',
    va: 'Netejar filtres',
  },
  clearSearch: {
    es: 'Borrar busqueda',
    en: 'Clear search',
    va: 'Netejar cerca',
  },
  activeFilters: {
    es: 'Filtros activos',
    en: 'Active filters',
    va: 'Filtres actius',
  },
  moreFilters: {
    es: 'Filtros',
    en: 'Filters',
    va: 'Filtres',
  },
  detailEmpty: {
    es: 'Este elemento todavia no tiene bloques de detalle publicados.',
    en: 'This item does not have published detail blocks yet.',
    va: 'Aquest element encara no te blocs de detall publicats.',
  },
  access: {
    es: 'Acceso y siguiente paso',
    en: 'Access and next step',
    va: 'Acces i seguent pas',
  },
  challengeBrief: {
    es: 'Brief del reto',
    en: 'Challenge brief',
    va: 'Brief del repte',
  },
  collaborationMap: {
    es: 'Mapa de colaboracion',
    en: 'Collaboration map',
    va: 'Mapa de col-laboracio',
  },
  detailCaseEvidence: {
    es: 'Evidencia y transferencia',
    en: 'Evidence and transfer',
    va: 'Evidencia i transferencia',
  },
  featuredSignal: {
    es: 'Clave para participar',
    en: 'Participation signal',
    va: 'Clau per a participar',
  },
  actors: {
    es: 'Actores',
    en: 'Actors',
    va: 'Actors',
  },
  all: {
    es: 'Todos',
    en: 'All',
    va: 'Tots',
  },
  availability: {
    es: 'Disponibilidad',
    en: 'Availability',
    va: 'Disponibilitat',
  },
  competencies: {
    es: 'Competencias STEAM',
    en: 'STEAM competences',
    va: 'Competències STEAM',
  },
  deadline: {
    es: 'Fecha limite',
    en: 'Deadline',
    va: 'Data limit',
  },
  direction: {
    es: 'Direccion',
    en: 'Direction',
    va: 'Direccio',
  },
  infrastructure: {
    es: 'Infraestructura',
    en: 'Infrastructure',
    va: 'Infraestructura',
  },
  filterBy: {
    es: 'Filtrar por',
    en: 'Filter by',
    va: 'Filtrar per',
  },
  kpi: {
    es: 'KPI',
    en: 'KPI',
    va: 'KPI',
  },
  noDate: {
    es: 'Sin fecha',
    en: 'No date',
    va: 'Sense data',
  },
  noResults: {
    es: 'No hay elementos con estos filtros',
    en: 'No items match these filters',
    va: 'No hi ha elements amb aquests filtres',
  },
  reward: {
    es: 'Recompensa',
    en: 'Reward',
    va: 'Recompensa',
  },
  search: {
    es: 'Buscar',
    en: 'Search',
    va: 'Buscar',
  },
  searchPlaceholder: {
    es: 'Buscar en esta subseccion',
    en: 'Search this subsection',
    va: 'Buscar en aquesta subseccio',
  },
  sdgs: {
    es: 'ODS',
    en: 'SDGs',
    va: 'ODS',
  },
  sector: {
    es: 'Sector',
    en: 'Sector',
    va: 'Sector',
  },
  sectors: {
    es: 'Sectores',
    en: 'Sectors',
    va: 'Sectors',
  },
  status: {
    es: 'Estado',
    en: 'Status',
    va: 'Estat',
  },
  tags: {
    es: 'Etiquetas',
    en: 'Tags',
    va: 'Etiquetes',
  },
  trl: {
    es: 'TRL',
    en: 'TRL',
    va: 'TRL',
  },
  valorisation: {
    es: 'Valorizacion',
    en: 'Valorisation',
    va: 'Valoritzacio',
  },
  window: {
    es: 'Ventana',
    en: 'Window',
    va: 'Finestra',
  },
  operationalSummary: {
    es: 'Resumen operativo',
    en: 'Operational summary',
    va: 'Resum operatiu',
  },
  pilotValidationPlan: {
    es: 'Plan de piloto o validacion',
    en: 'Pilot or validation plan',
    va: 'Pla de pilot o validacio',
  },
  mentoringSupport: {
    es: 'Soporte de mentoria',
    en: 'Mentoring support',
    va: 'Suport de mentoria',
  },
  relationships: {
    es: 'Trazabilidad relacional',
    en: 'Relational traceability',
    va: 'Traçabilitat relacional',
  },
  technicalBlocks: {
    es: 'Bloques tecnicos',
    en: 'Technical blocks',
    va: 'Blocs tecnics',
  },
  updated: {
    es: 'Revisado',
    en: 'Reviewed',
    va: 'Revisat',
  },
  viewDetail: {
    es: 'Ver detalle',
    en: 'View detail',
    va: 'Veure detall',
  },
  transferType: {
    es: 'Tipo de transferencia',
    en: 'Transfer type',
    va: 'Tipus de transferència',
  },
  verificationStatus: {
    es: 'Verificación',
    en: 'Verification',
    va: 'Verificació',
  },
  level: {
    es: 'Nivel formativo',
    en: 'Training level',
    va: 'Nivell formatiu',
  },
  transferFlow: {
    es: 'Transferencia',
    en: 'Transfer',
    va: 'Transferència',
  },
  pilotType: {
    es: 'Tipo de piloto',
    en: 'Pilot type',
    va: 'Tipus de pilot',
  },
  pilotStatus: {
    es: 'Estado del piloto',
    en: 'Pilot status',
    va: 'Estat del pilot',
  },
  helix: {
    es: 'Hélice',
    en: 'Helix',
    va: 'Hèlix',
  },
  seeking: {
    es: 'Se busca',
    en: 'Looking for',
    va: 'Es busca',
  },
  contributionType: {
    es: 'Tipo de contribución',
    en: 'Contribution type',
    va: 'Tipus de contribució',
  },
  audience: {
    es: 'Audiencia',
    en: 'Audience',
    va: 'Audiència',
  },
  downloadable: {
    es: 'descargable',
    en: 'download',
    va: 'descarregable',
  },
  downloadables: {
    es: 'descargables',
    en: 'downloads',
    va: 'descarregables',
  },
  whatIsTested: {
    es: 'Qué se prueba',
    en: 'What is being tested',
    va: 'Què es prova',
  },
  readiness: {
    es: 'Madurez',
    en: 'Readiness',
    va: 'Maduresa',
  },
  infrastructure: { es: 'Infraestructura', en: 'Infrastructure', va: 'Infraestructura' },
  infrastructures: { es: 'Infraestructuras', en: 'Infrastructure', va: 'Infraestructures' },
  pilotMetadata: { es: 'Datos del piloto', en: 'Pilot details', va: 'Dades del pilot' },
  pilotMetadataSingle: { es: 'Dato del piloto', en: 'Pilot detail', va: 'Dada del pilot' },
  pilotStageLabel: {
    es: 'Fase',
    en: 'Stage',
    va: 'Fase',
  },
  pilotResult: {
    es: 'Resultado',
    en: 'Result',
    va: 'Resultat',
  },
  pilotCriteria: {
    es: 'Criterio clave',
    en: 'Key criterion',
    va: 'Criteri clau',
  },
  levels: { es: 'Niveles', en: 'Levels', va: 'Nivells' },
  level: { es: 'Nivel', en: 'Level', va: 'Nivell' },
  evidenceLevel: { es: 'Nivel de evidencia', en: 'Evidence level', va: "Nivell d'evidència" },
  verification: { es: 'Verificación', en: 'Verification', va: 'Verificació' },
  transferChain: { es: 'Cadena de transferencia', en: 'Transfer chain', va: 'Cadena de transferència' },
};

const FIELD_LABELS = {
  actionTitle: { es: 'Accion', en: 'Action', va: 'Accio' },
  actors: { es: 'Actores', en: 'Actors', va: 'Actors' },
  availability: { es: 'Disponibilidad', en: 'Availability', va: 'Disponibilitat' },
  badges: { es: 'Distintivos', en: 'Badges', va: 'Distintius' },
  collaborationDirection: { es: 'Direccion de colaboracion', en: 'Collaboration direction', va: 'Direccio de col-laboracio' },
  entity: { es: 'Entidad', en: 'Organisation', va: 'Entitat' },
  evidence: { es: 'Evidencia', en: 'Evidence', va: 'Evidencia' },
  executionWindow: { es: 'Ventana', en: 'Window', va: 'Finestra' },
  featuredSignal: { es: 'Senal destacada', en: 'Featured signal', va: 'Senyal destacat' },
  impactKpi: { es: 'KPI de impacto', en: 'Impact KPI', va: 'KPI d impacte' },
  infrastructure: { es: 'Infraestructura', en: 'Infrastructure', va: 'Infraestructura' },
  mentorName: { es: 'Mentor', en: 'Mentor', va: 'Mentor' },
  mentorRole: { es: 'Rol', en: 'Role', va: 'Rol' },
  needs: { es: 'Necesidades', en: 'Needs', va: 'Necessitats' },
  organisation: { es: 'Organizacion', en: 'Organisation', va: 'Organitzacio' },
  requirements: { es: 'Requisitos', en: 'Requirements', va: 'Requisits' },
  reward: { es: 'Recompensa', en: 'Reward', va: 'Recompensa' },
  sdgs: { es: 'ODS', en: 'SDGs', va: 'ODS' },
  setCompetences: { es: 'Competencias STEAM', en: 'STEAM competences', va: 'Competències STEAM' },
  specialties: { es: 'Especialidades', en: 'Specialties', va: 'Especialitats' },
  trl: { es: 'TRL', en: 'TRL', va: 'TRL' },
  valorisation: { es: 'Valorizacion', en: 'Valorisation', va: 'Valoritzacio' },
  validationStatus: { es: 'Estado de validacion', en: 'Validation status', va: 'Estat de validacio' },
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

const TRANSFER_TYPE_ICONS = {
  implementación: 'wrench',
  adaptación: 'git-branch',
  capacitación: 'graduation-cap',
  escalado: 'trending-up',
};

const CARD_CHIP_MAX = MARKETPLACE_CONFIG.cardChipMax ?? 4;

const LEVEL_STYLES = {
  FP:       'bg-yellow-100 text-yellow-800 border-yellow-200',
  vet:      'bg-yellow-100 text-yellow-800 border-yellow-200',
  Máster:   'bg-purple-100 text-purple-800 border-purple-200',
  master:   'bg-purple-100 text-purple-800 border-purple-200',
  Docentes: 'bg-eu-blue/10 text-eu-blue border-eu-blue/20',
  teacher:  'bg-eu-blue/10 text-eu-blue border-eu-blue/20',
};

const CASE_LEVEL_TONE = 'bg-eu-blue/10 text-eu-blue border-eu-blue/20';

const SECTOR_FALLBACK_LABELS = {
  agr: { es: 'Agroalimentario', en: 'Agrifood', va: 'Agroalimentari' },
  cci: { es: 'Industrias culturales y creativas', en: 'Cultural and creative industries', va: 'Industries culturals i creatives' },
  ene: { es: 'Energia y Medio Ambiente', en: 'Energy and Environment', va: 'Energia i Medi Ambient' },
  hou: { es: 'Vivienda', en: 'Housing', va: 'Habitatge' },
  mfg: { es: 'Manufactura', en: 'Manufacturing', va: 'Manufactura' },
  mob: { es: 'Movilidad y Transporte', en: 'Mobility and Transport', va: 'Mobilitat i Transport' },
  nts: { es: 'Servicios No Turisticos', en: 'Non-Touristic Services', va: 'Serveis No Turistics' },
};

const TAB_TONES = {
  challenges: {
    badge: 'bg-eu-blue/10 text-eu-blue border-eu-blue/20',
  },
  cases: {
    badge: 'bg-eu-orange/10 text-eu-orange border-eu-orange/20',
  },
  pilots: {
    badge: 'bg-eu-teal/10 text-eu-teal border-eu-teal/20',
  },
  validations: {
    badge: 'bg-eu-purple/10 text-eu-purple border-eu-purple/20',
  },
  mentorings: {
    badge: 'bg-eu-blue/10 text-eu-blue border-eu-blue/20',
  },
};

function getLang() {
  return localStorage.getItem('language') || 'es';
}

function pickLang(value, fallback = '') {
  if (value == null) return fallback;
  if (Array.isArray(value)) return value.map(entry => pickLang(entry)).filter(Boolean);
  if (typeof value !== 'object') return value;
  const lang = getLang();
  if (value[lang] != null) return pickLang(value[lang], fallback);
  if (value.es != null) return pickLang(value.es, fallback);
  if (value.en != null) return pickLang(value.en, fallback);
  if (value.label != null) return pickLang(value.label, fallback);
  if (value.title != null) return pickLang(value.title, fallback);
  if (value.name != null) return pickLang(value.name, fallback);
  for (const entry of Object.values(value)) {
    const resolved = pickLang(entry);
    if (Array.isArray(resolved) ? resolved.length : resolved) return resolved;
  }
  return fallback;
}

function pickLangStrict(value) {
  if (!value || typeof value !== 'object') return '';
  const lang = getLang();
  const v = value[lang];
  return (v != null && v !== '') ? String(v) : '';
}

function uiText(key) {
  return pickLang(UI_TEXT[key], key);
}

function esc(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function asArray(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function getLabelFromArray(arr, id, fallback = '') {
  return pickLang(arr?.find(item => item.id === id)?.label, fallback || id);
}

function getTypeLabel(id) {
  return getLabelFromArray(MARKETPLACE_CONFIG.trackBTypeLabels || MARKETPLACE_CONFIG.typeLabels, id);
}

function getStatusLabel(id) {
  return getLabelFromArray(MARKETPLACE_CONFIG.statusLabels, id);
}

function getMentoringTypeLabel(id) {
  return getLabelFromArray(MARKETPLACE_CONFIG.mentoringTypeLabels || MARKETPLACE_CONFIG.labels?.mentoringType, id);
}

function getMentoringStatusLabel(id) {
  return getLabelFromArray(MARKETPLACE_CONFIG.mentoringStatusLabels || MARKETPLACE_CONFIG.statusLabels, id);
}

function getMentoringSpecialtyLabel(id) {
  return getLabelFromArray(MARKETPLACE_CONFIG.mentoringSpecialtyLabels || MARKETPLACE_CONFIG.labels?.mentoringSpecialty, id);
}

function getModalityLabel(id) {
  return getLabelFromArray(MARKETPLACE_CONFIG.modalityLabels || MARKETPLACE_CONFIG.labels?.modality, id);
}

function getMentoringRequestAccessLabel(id) {
  return getLabelFromArray(MARKETPLACE_CONFIG.mentoringRequestAccessLabels || MARKETPLACE_CONFIG.labels?.mentoringRequestAccess, id);
}

function getConfidentialityLevelLabel(id) {
  return getLabelFromArray(MARKETPLACE_CONFIG.confidentialityLevelLabels || MARKETPLACE_CONFIG.labels?.confidentialityLevel, id);
}

function getEvidenceLabel(id) {
  return getLabelFromArray(MARKETPLACE_CONFIG.evidenceMaturityLabels, id);
}

function getCaseStageLabel(id) {
  return getLabelFromArray(MARKETPLACE_CONFIG.caseStageLabels, id);
}

function getEvidenceLevelLabel(id) {
  return getLabelFromArray(MARKETPLACE_CONFIG.evidenceLevelLabels, id);
}

function getDataAvailabilityLabel(id) {
  return getLabelFromArray(MARKETPLACE_CONFIG.dataAvailabilityLabels, id);
}

function getEngagementLabel(id) {
  return getLabelFromArray(MARKETPLACE_CONFIG.engagementLevelLabels, id);
}

function getFocusLabel(id) {
  return getLabelFromArray(MARKETPLACE_CONFIG.aiSteamFocusLabels, id);
}

function getBlockLabel(id) {
  return getLabelFromArray(MARKETPLACE_CONFIG.detailBlockLabels, id);
}

function getTransferTypeLabel(id) {
  return getLabelFromArray(MARKETPLACE_CONFIG.labels?.transferType || MARKETPLACE_CONFIG.transferTypeLabels, id);
}

function getLevelLabel(id) {
  return getLabelFromArray(MARKETPLACE_CONFIG.labels?.level || MARKETPLACE_CONFIG.legacyLabels?.levelLabels, id);
}

function getVerificationLabel(id) {
  return getLabelFromArray(MARKETPLACE_CONFIG.labels?.verificationStatus || MARKETPLACE_CONFIG.verificationStatusLabels, id);
}

function getPilotTypeLabel(id) {
  return getLabelFromArray(MARKETPLACE_CONFIG.labels?.pilotType || MARKETPLACE_CONFIG.pilotTypeLabels, id);
}

function getPilotStatusLabel(id) {
  return getLabelFromArray(MARKETPLACE_CONFIG.labels?.pilotStatus || MARKETPLACE_CONFIG.pilotStatusLabels, id);
}

function getPilotStageLabel(id) {
  return getLabelFromArray(MARKETPLACE_CONFIG.labels?.pilotStage, id);
}

function getPilotStageTone(stage) {
  const tones = {
    planned:    'bg-gray-100 text-gray-700 border-gray-200',
    open:       'bg-blue-50 text-blue-700 border-blue-200',
    'in-progress': 'bg-amber-50 text-amber-800 border-amber-200',
    completed:  'bg-teal-50 text-teal-700 border-teal-200',
    published:  'bg-green-50 text-green-800 border-green-200',
    scaled:     'bg-purple-50 text-purple-700 border-purple-200',
    archived:   'bg-gray-50 text-gray-500 border-gray-200',
  };
  return tones[stage] || 'bg-eu-bg text-gray-700 border-eu-border';
}

function getEducationalReadinessLabel(id) {
  return getLabelFromArray(MARKETPLACE_CONFIG.labels?.educationalReadiness, id);
}

function getHelixLabel(id) {
  return getLabelFromArray(MARKETPLACE_CONFIG.helixLabels, id);
}

function getContributionTypeLabel(id) {
  return getLabelFromArray(MARKETPLACE_CONFIG.labels?.contributionTypes, id);
}

function getAudienceLabel(id) {
  return getLabelFromArray(MARKETPLACE_CONFIG.labels?.audience, id);
}

function getCompetenceLabel(id) {
  return getLabelFromArray(MARKETPLACE_CONFIG.labels?.competences, id);
}

function getDownloadTypeLabel(id) {
  return getLabelFromArray(MARKETPLACE_CONFIG.labels?.downloadTypes, id);
}

function getValidationTypeLabel(id) {
  return getLabelFromArray(MARKETPLACE_CONFIG.validationTypeLabels, id);
}

function getValidationStageLabel(id) {
  return getLabelFromArray(MARKETPLACE_CONFIG.validationStageLabels, id);
}

function getDecisionOutcomeLabel(id) {
  return getLabelFromArray(MARKETPLACE_CONFIG.decisionOutcomeLabels, id);
}

function getSectorCode(value) {
  if (Array.isArray(value)) return value.map(getSectorCode).filter(Boolean);
  const map = {
    adm: 'nts',
    edu: 'nts',
    tur: 'cci',
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
  const code = getSectorCode(value);
  if (Array.isArray(code)) return code.map(getSectorLabel).filter(Boolean);
  return (t('sectors.sectorNames') || {})[code] || pickLang(SECTOR_FALLBACK_LABELS[code], code);
}

function getItemSectorCodes(item) {
  const sources = [
    item.core?.sectors,
    item.core?.sector,
    item.classification?.sectors,
    item.classification?.sector,
  ];
  const value = sources.find(source => asArray(source).filter(Boolean).length);
  return asArray(getSectorCode(value)).filter(Boolean);
}

function getTabs() {
  return (MARKETPLACE_CONFIG.tabs || [])
    .filter(tab => tab.visible !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));
}

function getActiveTabId() {
  const tabs = getTabs();
  const current = getState('marketplaceTab');
  if (tabs.some(tab => tab.id === current)) return current;
  return tabs[0]?.id || 'challenges';
}

function getActiveTab() {
  const activeId = getActiveTabId();
  return getTabs().find(tab => tab.id === activeId);
}

function getItemsForTab(tabId) {
  const items = MARKETPLACE_CONFIG.itemsByTab?.[tabId] || [];
  return items.filter(item => item.visible !== false);
}

function getAllItems() {
  return (MARKETPLACE_CONFIG.items || []).filter(item => item.visible !== false);
}

function getItemById(id) {
  return getAllItems().find(item => item.id === id);
}

function getItemDateLabel(item) {
  const ccv = MARKETPLACE_CONFIG.cardChipVisibility || {};
  if (ccv.ch_reviewDate === false) return '';
  const revised = pickLang(item.core?.revisionDateLabel);
  return revised ? `${uiText('updated')}: ${revised}` : '';
}

function renderBadge(label, tone = 'bg-white text-gray-700 border-eu-border', filterKey = '', filterValue = '') {
  const text = pickLang(label);
  if (Array.isArray(text)) return text.map(entry => renderBadge(entry, tone, filterKey, filterValue)).join('');
  if (!text) return '';
  if (!filterKey) return `<span class="inline-flex items-center rounded border px-2 py-0.5 text-xs font-semibold ${tone}">${esc(text)}</span>`;
  const isActive = String(getTabFilterState(getActiveTabId()).values?.[filterKey]) === String(filterValue);
  const activeCls = isActive ? ' ring-1 ring-inset ring-current' : '';
  return `<span class="inline-flex items-center rounded border px-2 py-0.5 text-xs font-semibold cursor-pointer select-none ${tone}${activeCls}" data-mp-chip-filter="${esc(filterKey)}" data-mp-chip-value="${esc(String(filterValue))}">${esc(text)}</span>`;
}

function renderHero() {
  const hero = MARKETPLACE_CONFIG.heroBlock || {};
  const stats = (hero.stats || []).filter(stat => stat.visible !== false);
  const title = pickLang(hero.title, pickLang(MARKETPLACE_CONFIG.publicSectionName?.title, 'Comunidad de Practica'));
  const description = pickLang(hero.description);

  return `
    <section class="bg-eu-blue px-6 py-12 text-white">
      <div class="mx-auto max-w-7xl">
        <div class="mb-8">
          <p class="text-sm font-bold uppercase tracking-[0.2em] text-eu-yellow">${esc(pickLang(MARKETPLACE_CONFIG.publicSectionName?.nav, 'Comunidad'))}</p>
          <h1 class="mt-3 max-w-4xl text-3xl font-extrabold leading-tight md:text-4xl">${esc(title)}</h1>
          ${description ? `<p class="mt-4 max-w-3xl text-base leading-7 text-white/80">${esc(description)}</p>` : ''}
        </div>
        ${stats.length ? `
          <div class="flex flex-wrap gap-4">
            ${stats.map(stat => `
              <div class="rounded-xl bg-white/10 px-6 py-4 backdrop-blur text-center min-w-[7.5rem]">
                <p class="text-2xl font-extrabold leading-none text-white">${esc(stat.value)}</p>
                <p class="mt-2 text-xs font-semibold uppercase tracking-wide text-white/70">${esc(pickLang(stat.label))}</p>
              </div>`).join('')}
          </div>` : ''}
      </div>
    </section>`;
}

function renderTabs(activeId) {
  const tabs = getTabs();
  const ariaLabel = pickLang(MARKETPLACE_CONFIG.publicSectionName?.nav, 'Comunidad');
  return `
    <div class="mx-auto max-w-7xl px-6 pt-8">
      <div class="flex flex-wrap gap-1 border-b border-eu-border" role="tablist" aria-label="${esc(ariaLabel)}">
        ${tabs.map(tab => {
          const active = tab.id === activeId;
          return `
            <button type="button" role="tab" aria-selected="${active ? 'true' : 'false'}"
              id="mp-tab-${esc(tab.id)}" aria-controls="mp-tabpanel-${esc(tab.id)}"
              data-mp-tab="${esc(tab.id)}"
              class="min-h-11 whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-eu-blue focus:ring-offset-2 ${
                active
                  ? 'border-eu-blue text-eu-blue'
                  : 'border-transparent text-gray-600 hover:text-eu-text'
              }">
              ${esc(pickLang(tab.label, tab.id))}
            </button>`;
        }).join('')}
      </div>
    </div>`;
}

function getFilterStorageKey(tabId) {
  return `mpCommunityFilters:${tabId}`;
}

function getTabFilterState(tabId) {
  try {
    const parsed = JSON.parse(localStorage.getItem(getFilterStorageKey(tabId)) || '{}');
    return {
      search: typeof parsed.search === 'string' ? parsed.search : '',
      values: parsed.values && typeof parsed.values === 'object' ? parsed.values : {},
    };
  } catch {
    return { search: '', values: {} };
  }
}

function setTabFilterState(tabId, state) {
  localStorage.setItem(getFilterStorageKey(tabId), JSON.stringify({
    search: state.search || '',
    values: state.values || {},
  }));
}

function clearTabFilterState(tabId) {
  localStorage.removeItem(getFilterStorageKey(tabId));
}

function normalizeText(value) {
  return String(value || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function getSearchHaystack(item) {
  return [
    pickLang(item.core?.title),
    pickLang(item.core?.summary),
    pickLang(item.core?.entity?.name),
    getTypeLabel(item.type),
    getStatusLabel(item.core?.status),
    getSectorLabel(item.core?.sector),
    pickLang(item.classification?.trackBValue),
    renderPlainValue(item.card),
  ].join(' ');
}

function renderPlainValue(value) {
  if (value === null || value === undefined || value === false) return '';
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (Array.isArray(value)) return value.map(renderPlainValue).filter(Boolean).join(' ');
  if (isLocalizedObject(value)) return pickLang(value);
  return Object.values(value).map(renderPlainValue).filter(Boolean).join(' ');
}

function getItemFilterValue(item, key) {
  const card = item.card || {};
  if (key === 'sector') return getItemSectorCodes(item);
  if (key === 'status') return item.core?.status;
  if (key === 'contributionType') return asArray(item.classification?.contributionTypes);
  if (key === 'audience') return asArray(item.classification?.audience);
  if (key === 'competency') return asArray(card.setCompetences).length ? asArray(card.setCompetences) : asArray(item.classification?.competences);
  if (key === 'sdg') return asArray(card.sdgs || card.validatedSdgs || item.classification?.sdgs).map(sdg => sdg?.id != null ? String(sdg.id) : (typeof sdg === 'number' ? String(sdg) : pickLang(sdg?.label || sdg)));
  if (key === 'maturity') return item.core?.maturity || '';
  if (key === 'impact') return item.classification?.evidenceMaturity || (card.highlightKpi || card.impactKpi ? 'with-kpi' : '');
  if (key === 'trl') return card.trl?.level ? String(card.trl.level) : '';
  if (key === 'infrastructure') return asArray(card.infrastructure);
  if (key === 'window') return item.core?.status || pickLang(card.validationStatus) || pickLang(card.executionWindow?.label);
  if (key === 'specialty') return asArray(card.specialties);
  if (key === 'availability') return pickLang(item.mentoringOffer?.format?.availability) || pickLang(card.availability);
  if (key === 'organisation') return card.organisation || pickLang(item.core?.entity?.name);
  if (key === 'transferType') return item.transfer?.type || '';
  if (key === 'level') return asArray(item.classification?.levels || item.core?.levels);
  if (key === 'evidenceLevel') return item.core?.evidenceLevel || item.evidence?.evidenceLevel || '';
  if (key === 'verificationStatus') return item.core?.verificationStatus || item.classification?.verificationStatus || '';
  if (key === 'pilotType') return item.core?.pilotType || '';
  if (key === 'pilotStage') return item.core?.pilotStage || '';
  if (key === 'helix') return asArray(item.core?.helix);
  if (key === 'pilotStatus') return item.classification?.pilotStatus || '';
  if (key === 'validationType') return item.core?.validationType || '';
  if (key === 'validationStage') return item.core?.validationStage || '';
  if (key === 'caseStage') return item.core?.caseStage || '';
  return '';
}

function getFilterDefinitions(tabId) {
  const sdgPrefix = pickLang({ es: 'ODS', en: 'SDG', va: 'ODS' });
  const common = {
    sector: { key: 'sector', label: uiText('filterBy') + ' ' + uiText('sector'), labeler: getSectorLabel },
    status: { key: 'status', label: uiText('filterBy') + ' ' + uiText('status'), labeler: getStatusLabel },
    sdg: { key: 'sdg', label: uiText('filterBy') + ' ' + uiText('sdgs'), labeler: value => `${sdgPrefix} ${value}` },
  };
  if (tabId === 'challenges') {
    return [
      common.sector,
      common.status,
      { key: 'maturity', label: uiText('filterBy') + ' ' + pickLang({ es: 'Madurez', en: 'Maturity', va: 'Maduresa' }), labeler: getEvidenceLabel },
      { key: 'contributionType', label: uiText('filterBy') + ' ' + uiText('contributionType'), labeler: getContributionTypeLabel },
      { key: 'audience', label: uiText('filterBy') + ' ' + uiText('audience'), labeler: getAudienceLabel },
      { key: 'sdg', label: uiText('filterBy') + ' ' + uiText('sdgs'), labeler: value => `ODS ${value}` },
      { key: 'competency', label: uiText('filterBy') + ' ' + pickLang({ es: 'Competencia', en: 'Competency', va: 'Competència' }), labeler: getCompetenceLabel },
    ];
  }
  if (tabId === 'cases') {
    return [
      common.sector,
      common.status,
      { key: 'caseStage', label: uiText('filterBy') + ' ' + pickLang({ es: 'Etapa', en: 'Stage', va: 'Etapa' }), labeler: getCaseStageLabel },
      { key: 'transferType', label: uiText('filterBy') + ' ' + uiText('transferType'), labeler: getTransferTypeLabel },
      { key: 'level', label: uiText('filterBy') + ' ' + uiText('level'), labeler: id => getLevelLabel(id) || id },
      { key: 'evidenceLevel', label: uiText('filterBy') + ' ' + uiText('evidenceLevel'), labeler: getEvidenceLevelLabel },
      { key: 'verificationStatus', label: uiText('filterBy') + ' ' + uiText('verificationStatus'), labeler: getVerificationLabel },
      common.sdg,
    ];
  }
  if (tabId === 'pilots') {
    return [
      common.sector,
      common.status,
      { key: 'pilotStage', label: uiText('filterBy') + ' ' + uiText('pilotStageLabel'), labeler: getPilotStageLabel },
      { key: 'pilotType', label: uiText('filterBy') + ' ' + uiText('pilotType'), labeler: getPilotTypeLabel },
      { key: 'pilotStatus', label: uiText('filterBy') + ' ' + uiText('pilotStatus'), labeler: getPilotStatusLabel },
      { key: 'helix', label: uiText('filterBy') + ' ' + uiText('helix'), labeler: getHelixLabel },
    ];
  }
  if (tabId === 'validations') {
    return [
      { key: 'validationType', label: uiText('filterBy') + ' ' + pickLang({ es: 'Tipo', en: 'Type', va: 'Tipus' }), labeler: getValidationTypeLabel },
      { key: 'validationStage', label: uiText('filterBy') + ' ' + pickLang({ es: 'Etapa', en: 'Stage', va: 'Etapa' }), labeler: getValidationStageLabel },
      common.sector,
    ];
  }
  if (tabId === 'mentorings') {
    return [
      { key: 'specialty', label: uiText('filterBy') + ' ' + pickLang(FIELD_LABELS.specialties), labeler: value => value },
      { key: 'availability', label: uiText('filterBy') + ' ' + uiText('availability'), labeler: value => value === 'chat' ? 'Chat' : value },
      { key: 'organisation', label: uiText('filterBy') + ' ' + pickLang(FIELD_LABELS.organisation), labeler: value => value },
    ];
  }
  return [common.sector, common.status];
}

function getFilterOptions(items, definition) {
  const values = [...new Set(items.flatMap(item => asArray(getItemFilterValue(item, definition.key))))].filter(Boolean);
  return values
    .map(value => ({ value, label: definition.labeler ? definition.labeler(value) : value }))
    .filter(option => option.label)
    .sort((a, b) => String(a.label).localeCompare(String(b.label)));
}

function itemMatchesTabFilters(item, filterState, definitions) {
  const search = normalizeText(filterState.search);
  if (search && !normalizeText(getSearchHaystack(item)).includes(search)) return false;
  return definitions.every(definition => {
    const selected = filterState.values?.[definition.key];
    if (!selected) return true;
    return asArray(getItemFilterValue(item, definition.key)).map(String).includes(String(selected));
  });
}

function getFilteredTabItems(tabId, items) {
  const filterState = getTabFilterState(tabId);
  const definitions = getFilterDefinitions(tabId);
  return items.filter(item => itemMatchesTabFilters(item, filterState, definitions));
}

function getTabPageStateKey(tabId) {
  return `marketplacePage:${tabId}`;
}

function getTabPageSizeStateKey(tabId) {
  return `marketplacePageSize:${tabId}`;
}

function getTabPagination(tab) {
  const cfg = tab.pagination || {};
  const pageSizeOptions = Array.isArray(cfg.pageSizeOptions) && cfg.pageSizeOptions.length ? cfg.pageSizeOptions : [6, 12, 24, 48];
  return {
    pageSize: Number.isFinite(Number(cfg.pageSize)) ? Number(cfg.pageSize) : pageSizeOptions[0],
    pageSizeOptions,
    showAllOption: cfg.showAllOption !== false,
    showAllLabel: cfg.showAllLabel || { es: 'Todos', en: 'All', va: 'Tots' },
    paginationPrev: cfg.paginationPrev || { es: 'Anterior', en: 'Previous', va: 'Anterior' },
    paginationNext: cfg.paginationNext || { es: 'Siguiente', en: 'Next', va: 'Seguent' },
  };
}

function resetTabPagination(tabId) {
  setState(getTabPageStateKey(tabId), 0);
}

function getActiveFilterChips(tabId, items) {
  const state = getTabFilterState(tabId);
  const definitions = getFilterDefinitions(tabId);
  const chips = [];
  const search = (state.search || '').trim();

  if (search) {
    chips.push({
      key: 'search',
      label: `${uiText('search')}: ${search}`,
      value: '',
    });
  }

  definitions.forEach(definition => {
    const selected = state.values?.[definition.key];
    if (!selected) return;
    const option = getFilterOptions(items, definition).find(entry => String(entry.value) === String(selected));
    chips.push({
      key: definition.key,
      label: option?.label ? `${definition.label}: ${option.label}` : `${definition.label}: ${selected}`,
      value: selected,
    });
  });

  return chips;
}

function renderActiveFilterChips(tab, items) {
  const chips = getActiveFilterChips(tab.id, items);
  if (!chips.length) return '';
  return `
    <div class="mt-3 flex flex-wrap items-center gap-2 rounded-lg border border-eu-blue/20 bg-eu-blue/5 px-3 py-2">
      <span class="text-xs font-bold text-gray-600">${esc(uiText('activeFilters'))}:</span>
      ${chips.map(chip => `
        <button type="button"
          data-mp-remove-filter="${esc(chip.key)}"
          ${chip.value ? `data-mp-filter-value="${esc(chip.value)}"` : ''}
          class="inline-flex min-h-8 items-center gap-1.5 rounded-full border border-eu-blue/25 bg-white px-3 py-1 text-xs font-semibold text-eu-blue transition-colors hover:border-eu-blue hover:bg-eu-blue/10 focus:outline-none focus:ring-2 focus:ring-eu-blue focus:ring-offset-2">
          <span>${esc(chip.label)}</span>
          <i data-lucide="x" class="h-3.5 w-3.5"></i>
        </button>`).join('')}
      <button id="mp-clear-tab-filters" type="button"
        class="ml-auto inline-flex min-h-8 items-center gap-1.5 rounded-full border border-red-200 bg-white px-3 py-1 text-xs font-bold text-red-600 transition-colors hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2">
        <i data-lucide="x-circle" class="h-3.5 w-3.5"></i>
        ${esc(uiText('clearFilters'))}
      </button>
    </div>`;
}

function renderFilterCountSuffix(count) {
  return count ? ` (${count})` : '';
}

function getFilterPanelStateKey(tabId) {
  return `marketplaceFiltersOpen:${tabId}`;
}

function renderTabFilters(tab, items) {
  const state = getTabFilterState(tab.id);
  const definitions = getFilterDefinitions(tab.id);
  const activeCount = getActiveFilterChips(tab.id, items).length;
  const filtersOpen = getState(getFilterPanelStateKey(tab.id)) === true;
  const filterControls = definitions.map(definition => {
    const options = getFilterOptions(items, definition);
    if (!options.length) return '';
    return `
      <label class="block">
        <span class="text-xs font-bold uppercase tracking-wide text-gray-500">${esc(definition.label)}</span>
        <select data-mp-filter="${esc(definition.key)}" class="mt-1 min-h-11 w-full rounded-lg border border-eu-border bg-white px-3 py-2 text-sm outline-none focus:border-eu-blue focus:ring-2 focus:ring-eu-blue">
          <option value="">${esc(uiText('all'))}</option>
          ${options.map(option => `<option value="${esc(option.value)}" ${String(state.values?.[definition.key] || '') === String(option.value) ? 'selected' : ''}>${esc(option.label)}</option>`).join('')}
        </select>
      </label>`;
  }).join('');

  return `
    <div class="mt-5">
      <div class="grid gap-3 sm:grid-cols-[minmax(18rem,1fr)_auto] sm:items-start">
        <label class="block w-full">
          <span class="sr-only">${esc(uiText('search'))}</span>
          <span class="relative flex h-10 w-full items-center rounded-full border border-eu-border bg-white shadow-sm transition-colors focus-within:border-eu-blue focus-within:ring-2 focus-within:ring-eu-blue">
            <i data-lucide="search" class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"></i>
            <input id="mp-tab-search" type="text" value="${esc(state.search)}" placeholder="${esc(uiText('searchPlaceholder'))}"
              class="h-full min-w-0 flex-1 rounded-full border-0 bg-transparent py-2 pl-9 pr-1 text-sm outline-none">
            <button id="mp-clear-search" type="button" title="${esc(uiText('clearSearch'))}" aria-label="${esc(uiText('clearSearch'))}"
              class="mr-2 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-transparent bg-white text-gray-400 transition-colors hover:border-eu-border hover:bg-gray-50 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-eu-blue ${state.search ? '' : 'hidden'}">
              <i data-lucide="x" class="h-3.5 w-3.5"></i>
            </button>
          </span>
        </label>
        ${filterControls ? `
          <button id="mp-toggle-filters" type="button" aria-expanded="${filtersOpen ? 'true' : 'false'}"
            class="inline-flex min-h-10 w-fit cursor-pointer items-center gap-2 rounded-full border border-eu-border bg-white px-3 py-2 text-sm font-bold text-gray-700 shadow-sm transition-colors hover:border-eu-blue hover:text-eu-blue focus:outline-none focus:ring-2 focus:ring-eu-blue focus:ring-offset-2">
              <i data-lucide="sliders-horizontal" class="h-4 w-4"></i>
              <span>${esc(uiText('moreFilters'))}<span id="mp-filter-count">${esc(renderFilterCountSuffix(activeCount))}</span></span>
              <i data-lucide="chevron-down" class="h-4 w-4 transition-transform ${filtersOpen ? 'rotate-180' : ''}"></i>
          </button>` : ''}
      </div>
      ${filterControls && filtersOpen ? `
        <div class="mt-3 rounded-xl border border-eu-border bg-white p-3 shadow-sm sm:p-4">
          <div class="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            ${filterControls}
          </div>
        </div>` : ''}
      <div id="mp-active-filters">${renderActiveFilterChips(tab, items)}</div>
    </div>`;
}

function renderTabResults(tab, items) {
  const filtered = getFilteredTabItems(tab.id, items);
  const pagination = getTabPagination(tab);
  const pageSize = getState(getTabPageSizeStateKey(tab.id)) || pagination.pageSize;
  const isAll = pageSize === 'all';
  const totalPages = isAll ? 1 : Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(getState(getTabPageStateKey(tab.id)) || 0, totalPages - 1);
  const paginated = isAll ? filtered : filtered.slice(currentPage * pageSize, (currentPage + 1) * pageSize);
  const pageSizeSelector = `
    <div class="flex flex-wrap items-center gap-1">
      ${pagination.pageSizeOptions.map(option => `
        <button type="button" data-mp-pagesize="${esc(option)}"
          class="rounded border px-2 py-1 text-xs font-semibold transition-colors ${pageSize === option ? 'border-eu-blue bg-eu-blue text-white' : 'border-eu-border bg-white text-gray-700 hover:border-eu-blue'}">
          ${esc(option)}
        </button>`).join('')}
      ${pagination.showAllOption ? `
        <button type="button" data-mp-pagesize="all"
          class="rounded border px-2 py-1 text-xs font-semibold transition-colors ${pageSize === 'all' ? 'border-eu-blue bg-eu-blue text-white' : 'border-eu-border bg-white text-gray-700 hover:border-eu-blue'}">
          ${esc(pickLang(pagination.showAllLabel, uiText('all')))}
        </button>` : ''}
    </div>`;
  const paginationControls = !isAll && totalPages > 1 ? `
    <div class="mt-6 flex items-center justify-center gap-2">
      <button type="button" data-mp-page="prev"
        class="rounded border border-eu-border px-3 py-1.5 text-sm font-semibold transition-colors ${currentPage === 0 ? 'pointer-events-none opacity-40' : 'hover:border-eu-blue hover:text-eu-blue'}">
        ${esc(pickLang(pagination.paginationPrev, 'Anterior'))}
      </button>
      <span class="px-2 text-xs font-semibold text-gray-500">${currentPage + 1} / ${totalPages}</span>
      <button type="button" data-mp-page="next"
        class="rounded border border-eu-border px-3 py-1.5 text-sm font-semibold transition-colors ${currentPage >= totalPages - 1 ? 'pointer-events-none opacity-40' : 'hover:border-eu-blue hover:text-eu-blue'}">
        ${esc(pickLang(pagination.paginationNext, 'Siguiente'))}
      </button>
    </div>` : '';
  const resultsHeader = `
    <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
      <span class="text-xs font-semibold text-gray-500">${filtered.length} ${filtered.length === 1 ? 'item' : 'items'}</span>
      ${pageSizeSelector}
    </div>`;

  if (!filtered.length) {
    return `
      ${resultsHeader}
      <div class="rounded-2xl border border-dashed border-eu-border bg-white p-8 text-center shadow-sm">
        <i data-lucide="search-x" class="mx-auto h-8 w-8 text-gray-400"></i>
        <h3 class="mt-3 text-lg font-extrabold text-eu-text">${esc(uiText('noResults'))}</h3>
        <p class="mx-auto mt-2 max-w-xl text-sm leading-6 text-gray-500">${esc(pickLang(tab.emptyState?.message))}</p>
      </div>`;
  }
  return `
    ${resultsHeader}
    <div class="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">${paginated.map(item => renderItemCard(item, tab)).join('')}</div>
    ${paginationControls}`;
}

function renderCardShell(item, tab, body, options = {}) {
  const title = pickLang(options.title, pickLang(item.core?.title, item.id));
  const subtitle = pickLang(options.subtitle);
  const entity = options.entity !== undefined ? options.entity : pickLang(item.core?.entity?.name);
  const dateLabel = getItemDateLabel(item);
  const tone = TAB_TONES[tab.id] || TAB_TONES.challenges;
  const statusRaw = item.core?.status;
  const statusLabel = options.statusLabel !== undefined ? options.statusLabel : getStatusLabel(statusRaw);
  const statusFilterKey = getFilterDefinitions(tab.id).some(d => d.key === 'status') ? 'status' : '';

  return `
    <article class="group flex h-full flex-col rounded-xl border border-eu-border bg-white p-6 shadow-sm transition-colors hover:border-eu-blue">
      <div class="flex flex-wrap gap-2">
        ${options.hideTypeBadge ? '' : renderBadge(getTypeLabel(item.type), tone.badge)}
        ${options.showStatusBadge !== false ? renderBadge(statusLabel, 'bg-white text-gray-700 border-eu-border', statusFilterKey, statusRaw) : ''}
        ${options.extraBadge ? renderBadge(options.extraBadge, options.extraBadgeTone || 'bg-white text-gray-700 border-eu-border', options.extraBadgeFilterKey || '', options.extraBadgeFilterValue || '') : ''}
      </div>
      <div class="mt-4 flex-1">
        <h3 class="text-lg font-bold leading-snug text-eu-text group-hover:text-eu-blue">${esc(title)}</h3>
        ${subtitle ? `<p class="mt-2 text-sm leading-6 text-gray-600">${esc(subtitle)}</p>` : ''}
        ${body}
      </div>
      ${renderCardFooter(item, tab, entity, dateLabel, options.ctaHtml)}
    </article>`;
}

function renderCardFooter(item, tab, entity, dateLabel, ctaHtml = null) {
  const defaultCta = `<button type="button" data-id="${esc(item.id)}" class="mp-view-detail inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-eu-blue hover:text-eu-purple focus:outline-none focus:ring-2 focus:ring-eu-blue focus:ring-offset-2 rounded">${esc(pickLang(tab.ctaLabel, uiText('viewDetail')))} <i data-lucide="arrow-right" class="h-4 w-4"></i></button>`;
  const cta = ctaHtml || defaultCta;
  const hasInfo = entity || dateLabel;
  return `
    <div class="mt-5 border-t border-eu-border pt-4">
      ${hasInfo ? `<div class="mb-3 text-xs text-gray-500">
        ${entity ? `<p class="font-bold uppercase tracking-wide text-gray-400">${esc(pickLang(FIELD_LABELS.entity))}</p><p class="mt-0.5 font-semibold">${esc(entity)}</p>` : ''}
        ${dateLabel ? `<p class="${entity ? 'mt-2' : ''} font-semibold">${esc(dateLabel)}</p>` : ''}
      </div>` : ''}
      <div class="flex justify-end">${cta}</div>
    </div>`;
}

function renderCardCallout(label, value, icon = 'sparkles', strict = false) {
  const text = strict ? pickLangStrict(value) : pickLang(value);
  if (!text) return '';
  return `
    <div class="mt-4 rounded-lg bg-eu-bg p-4">
      <p class="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-gray-500">
        <i data-lucide="${esc(icon)}" class="h-3.5 w-3.5"></i>
        ${esc(label)}
      </p>
      <p class="mt-1 text-sm font-semibold leading-6 text-eu-text">${esc(text)}</p>
    </div>`;
}

function renderCardMiniMeta(items) {
  const visible = items.filter(item => item.value !== undefined && item.value !== null && item.value !== '');
  if (!visible.length) return '';
  return `
    <div class="mt-4 grid gap-3">
      ${visible.map(item => `
        <div class="rounded-lg border border-eu-border bg-white px-3 py-2">
          <p class="text-[11px] font-bold uppercase tracking-wide text-gray-500">${esc(item.label)}</p>
          <p class="mt-0.5 text-sm font-semibold leading-5 text-gray-700">${esc(item.value)}</p>
        </div>`).join('')}
    </div>`;
}

function renderChipList(values, tone = 'bg-eu-bg text-gray-700 border-eu-border', limit = CARD_CHIP_MAX) {
  const chips = values.map(value => pickLang(value)).filter(Boolean).slice(0, limit);
  if (!chips.length) return '';
  return `<div class="mt-4 flex flex-wrap gap-2">${chips.map(chip => renderBadge(chip, tone)).join('')}</div>`;
}

function renderSdgs(sdgs, limit = CARD_CHIP_MAX, filterKey = '', noWrap = false) {
  const items = asArray(sdgs).slice(0, limit).map(sdg => {
    const rawId = sdg?.id != null ? String(sdg.id) : (typeof sdg === 'number' || /^\d+$/.test(String(sdg ?? '')) ? String(sdg) : null);
    const sdgPrefix = pickLang({ es: 'ODS', en: 'SDG', va: 'ODS' });
    const label = rawId ? `${sdgPrefix} ${rawId}` : pickLang(sdg?.label || sdg);
    return label ? { label, value: rawId || label } : null;
  }).filter(Boolean);
  if (!items.length) return '';
  const inner = items.map(({ label, value }) => renderBadge(label, 'bg-green-50 text-green-800 border-green-200', filterKey, value)).join('');
  return noWrap ? inner : `<div class="mt-4 flex flex-wrap gap-2">${inner}</div>`;
}

function renderActorNames(actors) {
  return asArray(actors)
    .map(actor => actor?.name || pickLang(actor))
    .filter(Boolean)
    .slice(0, 2)
    .join(' / ');
}

function getTrlLabel(trl) {
  if (!trl) return '';
  const label = pickLang(trl.label);
  return trl.level ? `TRL ${trl.level}${label ? ` / ${label}` : ''}` : label;
}

function getMentorInitials(name) {
  return String(name || 'AI')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase())
    .join('');
}

function renderItemCard(item, tab) {
  if (item.type === 'challenge') return renderChallengeCard(item, tab);
  if (item.type === 'case') return renderCaseCard(item, tab);
  if (item.type === 'validation') return renderValidationCard(item, tab);
  if (item.type === 'pilot') return renderPilotCard(item, tab);
  if (item.type === 'mentoring') return renderMentoringCard(item, tab);
  return renderGenericCard(item, tab);
}

function renderChallengeCard(item, tab) {
  const tone = TAB_TONES.challenges;
  const cl = item.classification || {};
  const pres = item.presentation?.card || {};
  const ef = item.externalFlow || {};
  const ownership = item.ownership || {};
  const ccv = MARKETPLACE_CONFIG.cardChipVisibility || {};

  const contribChips = ccv.ch_contributions !== false ? asArray(cl.contributionTypes)
    .map(id => ({ id, label: getContributionTypeLabel(id) }))
    .filter(c => c.label)
    .slice(0, CARD_CHIP_MAX) : [];

  const audienceChips = ccv.ch_audience !== false ? asArray(cl.audience)
    .map(id => ({ id, label: getAudienceLabel(id) }))
    .filter(c => c.label)
    .slice(0, CARD_CHIP_MAX) : [];

  const compChips = ccv.ch_competences !== false ? asArray(cl.competences)
    .map(id => ({ id, label: getCompetenceLabel(id) }))
    .filter(c => c.label)
    .slice(0, CARD_CHIP_MAX) : [];

  // Fecha límite
  const deadlineLabel = pres.showDeadline !== false ? pickLang(item.core?.deadlineLabel) : null;

  const dlIndicator = '';

  // CTA: externo si hay URL real, interno (Ver reto) si no — NUNCA usar tab.ctaLabel
  const extUrl = ef.enabled && ef.primaryAction?.url ? ef.primaryAction.url : null;
  const ctaHtml = extUrl
    ? `<a href="${esc(extUrl)}" target="_blank" rel="noopener noreferrer" class="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-lg bg-eu-blue px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-eu-purple focus:outline-none focus:ring-2 focus:ring-eu-blue focus:ring-offset-2">${esc(pickLang(ef.primaryAction?.label) || uiText('viewDetail'))}<i data-lucide="external-link" class="h-3.5 w-3.5"></i></a>`
    : `<button type="button" data-id="${esc(item.id)}" class="mp-view-detail inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-eu-blue hover:text-eu-purple focus:outline-none focus:ring-2 focus:ring-eu-blue focus:ring-offset-2 rounded">${esc(pickLang({ es: 'Ver reto', en: 'View challenge', va: 'Veure repte' }))} <i data-lucide="arrow-right" class="h-4 w-4"></i></button>`;

  // Entidad promotora — solo si global visibility lo permite
  const entityLabel = ccv.ch_entity !== false
    ? (pickLang(ownership.requester?.publicLabel) || pickLang(item.core?.entity?.name))
    : null;

  const body = `
    ${renderCardCallout(uiText('challengeBrief'), item.detail?.briefTitle, 'target', true)}
    ${renderCardCallout(uiText('reward'), item.detail?.reward, 'award', true)}
    ${contribChips.length ? `
      <div class="mt-4">
        <p class="mb-1.5 text-xs font-bold uppercase tracking-wide text-gray-500">${esc(uiText('seeking'))}</p>
        <div class="flex flex-wrap gap-2">${contribChips.map(c => renderBadge(c.label, tone.badge, 'contributionType', c.id)).join('')}</div>
      </div>` : ''}
    ${audienceChips.length ? `
      <div class="mt-3">
        <p class="mb-1.5 text-xs font-bold uppercase tracking-wide text-gray-500">${esc(uiText('audience'))}</p>
        <div class="flex flex-wrap gap-2">${audienceChips.map(c => renderBadge(c.label, 'bg-eu-purple/10 text-eu-purple border-eu-purple/20', 'audience', c.id)).join('')}</div>
      </div>` : ''}
    ${deadlineLabel ? `<div class="mt-4 flex items-center gap-2 rounded-lg border border-eu-border px-3 py-2 text-sm text-gray-600"><i data-lucide="clock" class="h-4 w-4 shrink-0 text-gray-400"></i><span class="text-xs font-bold uppercase tracking-wide text-gray-400">${esc(uiText('deadline'))}</span><span class="font-semibold">${esc(deadlineLabel)}</span></div>` : ''}
    ${dlIndicator ? `<div class="mt-3 flex items-center gap-1.5 text-xs text-gray-500"><i data-lucide="file-down" class="h-3.5 w-3.5 shrink-0"></i><span>${esc(dlIndicator)}</span></div>` : ''}
    ${(() => { const _sdgInner = ccv.ch_sdgs !== false ? renderSdgs(cl.sdgs, CARD_CHIP_MAX, 'sdg', true) : ''; return _sdgInner ? `<div class="mt-3"><p class="mb-1.5 text-xs font-bold uppercase tracking-wide text-gray-500">${esc(uiText('sdgs'))}</p><div class="flex flex-wrap gap-2">${_sdgInner}</div></div>` : ''; })()}
    ${compChips.length ? `
      <div class="mt-3">
        <p class="mb-1.5 text-xs font-bold uppercase tracking-wide text-gray-500">${esc(uiText('competencies'))}</p>
        <div class="flex flex-wrap gap-2">${compChips.map(c => renderBadge(c.label, 'bg-green-50 text-green-700 border-green-200', 'competency', c.id)).join('')}</div>
      </div>` : ''}
  `;

  const showMat = ccv.ch_maturityBadge !== false;
  const maturityLabel = showMat ? getEvidenceLabel(item.core?.maturity) : null;
  const challengeSectorCode = getSectorCode(item.core?.sector || cl.sector);
  return renderCardShell(item, tab, body, {
    title: item.core?.title,
    subtitle: item.core?.summary,
    hideTypeBadge: true,
    showStatusBadge: ccv.ch_statusBadge !== false,
    extraBadge: maturityLabel || null,
    extraBadgeTone: 'bg-eu-teal/10 text-eu-teal border-eu-teal/20',
    extraBadgeFilterKey: maturityLabel ? 'maturity' : '',
    extraBadgeFilterValue: maturityLabel ? (item.core?.maturity || '') : '',
    entity: entityLabel,
    ctaHtml,
  });
}

function renderCaseCard(item, tab) {
  const core = item.core || {};
  const ownership = item.ownership || {};
  const cl = item.classification || {};
  const evidence = item.evidence || {};
  const downloads = item.downloads || {};
  const presentation = item.presentation || {};
  const cardPres = presentation.card || {};

  const ccv = MARKETPLACE_CONFIG.cardChipVisibility || {};
  const originName = ownership.origin?.name || '';
  const publisherName = ownership.publisher?.name || '';
  const beneficiaries = asArray(ownership.beneficiaries).map(b => pickLang(b.name)).filter(Boolean);

  const caseStageLabel = getCaseStageLabel(core.caseStage);
  const evidenceLevelLabel = getEvidenceLevelLabel(core.evidenceLevel);
  const sectorCodes = getItemSectorCodes(item);
  const sectorLabels = sectorCodes.map(code => getSectorLabel(code)).filter(Boolean);

  const resultBlockLabel = cardPres.resultBlockLabel || {
    es: 'Resultado clave',
    en: 'Key result',
    va: 'Resultat clau',
  };

  const caseBadgeText = pickLang({
    es: 'Caso transferible',
    en: 'Transferable Case',
    va: 'Cas transferible',
  });

  const showStatusBadge  = ccv.ch_case_status        !== false;
  const showStageBadge   = ccv.ch_case_stage         !== false;
  const showActors       = ccv.ch_case_actors        !== false && cardPres.showActors       !== false;
  const showSectorFlag   = ccv.ch_case_sector        !== false && cardPres.showSector !== false;
  const showLevelsFlag   = ccv.ch_case_levels       !== false && cardPres.showLevels       !== false;
  const showEvidBadge      = ccv.ch_case_evidenceBadge  !== false && cardPres.showEvidenceBadge !== false;
  const showEvidLevel      = ccv.ch_case_evidenceLevel  !== false;
  const showSdgsFlag     = ccv.ch_case_sdgs         !== false && cardPres.showSdgs         !== false;

  // 1. Cadena de transferencia (origen → beneficiarios)
  let actorLineHtml = '';
  if (showActors && (originName || beneficiaries.length)) {
    actorLineHtml = `
      <div class="mt-4 rounded-lg bg-eu-bg p-4">
        <p class="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-gray-500">
          <i data-lucide="building-2" class="h-3.5 w-3.5"></i>
          ${esc(uiText('transferChain'))}
        </p>
        <p class="mt-1 text-sm font-semibold leading-6 text-gray-700 line-clamp-2">${esc(originName || publisherName)}${beneficiaries.length ? ' → ' + beneficiaries.slice(0, 2).join(', ') : ''}</p>
      </div>`;
  }

  // 2. Bloque "Resultado clave" (Callout estándar)
  const resultCalloutHtml = renderCardCallout(
    pickLang(resultBlockLabel),
    evidence.headline || core.summary,
    'trophy'
  );

  // 3. KPI Destacado (MiniMeta estándar)
  let miniMetaHtml = '';
  if (cardPres.showPrimaryMetric !== false && evidence.primaryMetric) {
    let metricVal = String(evidence.primaryMetric.value);
    const unit = evidence.primaryMetric.unit || '';
    if (unit && !['images', 'teachers', 'narratives', 'cases'].includes(unit.toLowerCase())) {
      metricVal += unit.startsWith('%') ? unit : ` ${unit}`;
    }
    const metricLabel = pickLang(evidence.primaryMetric.label);
    miniMetaHtml = renderCardMiniMeta([{
      label: uiText('kpi'),
      value: `${metricVal} — ${metricLabel}`,
    }]);
  }

  // 4. Sector
  const sectorHtml = (showSectorFlag && sectorLabels.length)
    ? `<div class="mt-4">
        <p class="mb-1.5 text-xs font-bold uppercase tracking-wide text-gray-500">${esc(uiText(sectorLabels.length > 1 ? 'sectors' : 'sector'))}</p>
        <div class="flex flex-wrap gap-2">${sectorCodes.map((code, index) => renderBadge(sectorLabels[index], 'bg-eu-orange/10 text-eu-orange border-eu-orange/20', 'sector', code)).join('')}</div>
      </div>`
    : '';

  // 5. Niveles formativos
  const levels = asArray(cl.levels);
  const levelsHtml = (showLevelsFlag && levels.length)
    ? `<div class="mt-3">
        <p class="mb-1.5 text-xs font-bold uppercase tracking-wide text-gray-500">${esc(uiText(levels.length > 1 ? 'levels' : 'level'))}</p>
        <div class="flex flex-wrap gap-2">${levels.map(lvl => renderBadge(getLevelLabel(lvl) || lvl, CASE_LEVEL_TONE, 'level', lvl)).join('')}</div>
      </div>`
    : '';

  // 6. Nivel de evidencia / Verificación
  const evidenceLevelHtml = (showEvidLevel && evidenceLevelLabel)
    ? `<div class="mt-3">
        <p class="mb-1.5 text-xs font-bold uppercase tracking-wide text-gray-500">${esc(uiText('evidenceLevel'))}</p>
        <div class="flex flex-wrap gap-2">${renderBadge(evidenceLevelLabel, 'bg-blue-50 text-blue-700 border-blue-200', 'evidenceLevel', core.evidenceLevel)}</div>
      </div>`
    : '';

  const verifStatus = core.verificationStatus || cl.verificationStatus || '';
  const verifStatusLabel = getVerificationLabel(verifStatus);
  const verifActive = verifStatus && String(getTabFilterState(getActiveTabId()).values?.verificationStatus) === verifStatus;
  const verifBadge = (showEvidBadge && verifStatus && verifStatusLabel)
    ? `<span class="inline-flex items-center gap-1.5 rounded border border-green-200 bg-green-50 px-2 py-0.5 text-xs font-semibold text-green-700 cursor-pointer select-none${verifActive ? ' ring-1 ring-inset ring-current' : ''}" data-mp-chip-filter="verificationStatus" data-mp-chip-value="${esc(verifStatus)}"><i data-lucide="shield-check" class="h-3 w-3"></i>${esc(verifStatusLabel)}</span>`
    : '';
  const verifHtml = verifBadge
    ? `<div class="mt-3">
        <p class="mb-1.5 text-xs font-bold uppercase tracking-wide text-gray-500">${esc(uiText('verification'))}</p>
        <div class="flex flex-wrap gap-2">${verifBadge}</div>
      </div>`
    : '';


  // 8. ODS
  const _sdgInner = (showSdgsFlag && cl.sdgs) ? renderSdgs(cl.sdgs, 3, 'sdg', true) : '';
  const sdgsHtml = _sdgInner
    ? `<div class="mt-3">
        <p class="mb-1.5 text-xs font-bold uppercase tracking-wide text-gray-500">${esc(uiText('sdgs'))}</p>
        <div class="flex flex-wrap gap-2">${_sdgInner}</div>
      </div>`
    : '';

  const body = `
    ${actorLineHtml}
    ${resultCalloutHtml}
    ${miniMetaHtml}
    ${sectorHtml}
    ${levelsHtml}
    ${evidenceLevelHtml}
    ${verifHtml}
    ${sdgsHtml}
  `;

  const ctaHtml = `<button type="button" data-id="${esc(item.id)}" class="mp-view-detail inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-eu-blue hover:text-eu-purple focus:outline-none focus:ring-2 focus:ring-eu-blue focus:ring-offset-2 rounded">${esc(pickLang({ es: 'Ver caso', en: 'View case', va: 'Veure cas' }))} <i data-lucide="arrow-right" class="h-4 w-4"></i></button>`;

  const shellOptions = {
    title: core.title,
    subtitle: core.summary,
    showStatusBadge,
    extraBadge: showStageBadge ? (caseStageLabel || '') : '',
    extraBadgeTone: 'bg-eu-purple/10 text-eu-purple border-eu-purple/20',
    extraBadgeFilterKey: (showStageBadge && caseStageLabel) ? 'caseStage' : '',
    extraBadgeFilterValue: (showStageBadge && caseStageLabel) ? (core.caseStage || '') : '',
    entity: (ccv.ch_entity !== false && cardPres.showEntity !== false) ? (originName || publisherName) : null,
    ctaHtml,
    hideTypeBadge: true,
  };

  return renderCardShell(item, tab, body, shellOptions);
}

function renderPilotCard(item, tab) {
  const ccv = MARKETPLACE_CONFIG.cardChipVisibility || {};
  // Detección v2: pilotPlan presente → esquema nuevo
  const isV2 = item.pilotPlan != null || item.ownership?.lead != null;
  if (!isV2) return renderPilotCardLegacy(item, tab);

  const core = item.core || {};
  const pres = item.presentation?.card || {};
  const pilotPlan = item.pilotPlan || {};
  const impl = item.implementation || {};
  const readiness = impl.readiness || {};
  const results = item.results || {};
  const classification = item.classification || {};
  const sectorCode = core.sector || classification.sector || '';
  const sectorLabel = getSectorLabel(sectorCode);
  const showSectorBadge = ccv.ch_pilot_sector !== false && pres.showSector !== false;
  const showReadiness = ccv.ch_pilot_readiness !== false && pres.showReadiness !== false;
  const showWindow = ccv.ch_pilot_window !== false && pres.showWindow !== false;
  const showInfrastructure = ccv.ch_pilot_infrastructure !== false && pres.showInfrastructure !== false;
  const showPilotStage = ccv.ch_pilot_stage !== false && pres.showPilotStage !== false;
  const showPilotType = ccv.ch_pilot_type !== false && pres.showPilotType !== false;

  // ── Hypothesis (bloque principal de la card) ──────────────────────────────
  const resultBlockLabel = pickLang(pres.resultBlockLabel) || uiText('whatIsTested');
  const hypothesisHtml = renderCardCallout(resultBlockLabel, pilotPlan.hypothesis || core.summary, 'flask-conical');

  // ── Madurez (TRL o educacional) ───────────────────────────────────────────
  let readinessStr = '';
  const trl = readiness.technologyReadiness;
  const er = readiness.educationalReadiness;
  if (showReadiness) {
    if (trl?.enabled && trl?.level) {
      const trlLbl = pickLang(trl.label);
      readinessStr = `TRL ${trl.level}${trlLbl ? ` — ${trlLbl}` : ''}`;
    } else if (er?.enabled && er?.level) {
      readinessStr = getEducationalReadinessLabel(er.level) || pickLang(er.label) || er.level;
    }
  }

  // ── Ventana temporal ──────────────────────────────────────────────────────
  const windowLabel = showWindow ? pickLang(core.executionWindow?.label) : '';

  // ── Mini-meta: readiness + ventana ────────────────────────────────────────
  const miniMetaHtml = renderCardMiniMeta([
    readinessStr ? { label: uiText('readiness'), value: readinessStr } : null,
    windowLabel ? { label: uiText('window'), value: windowLabel } : null,
  ].filter(Boolean));

  // ── Infraestructura (max 3 chips) ─────────────────────────────────────────
  let infraHtml = '';
  if (showInfrastructure) {
    const infraLabels = asArray(impl.infrastructure).slice(0, CARD_CHIP_MAX)
      .map(i => typeof i === 'string' ? i : pickLang(i.label, i.label)).filter(Boolean);
    if (infraLabels.length) {
      infraHtml = `<div class="mt-4">
        <p class="mb-1.5 text-xs font-bold uppercase tracking-wide text-gray-500">${esc(uiText(infraLabels.length > 1 ? 'infrastructures' : 'infrastructure'))}</p>
        <div class="flex flex-wrap gap-2">${infraLabels.map(l => renderBadge(l, 'bg-slate-50 text-slate-700 border-slate-200')).join('')}</div>
      </div>`;
    }
  }

  // ── Resultado / KPI ───────────────────────────────────────────────────────
  let kpiHtml = '';
  if (pres.showPrimaryMetric !== false) {
    const isFinished = ['completed', 'published', 'scaled'].includes(core.pilotStage);
    if (isFinished && results.headline) {
      kpiHtml = renderCardCallout(uiText('pilotResult'), results.headline, 'check-circle');
    } else if (!isFinished && pilotPlan.successCriteria?.length) {
      kpiHtml = renderCardCallout(uiText('pilotCriteria'), pilotPlan.successCriteria[0].label, 'target');
    }
  }

  // ── Badges: stage + tipo (colores diferenciados) ─────────────────────────
  const pilotTypeLabel = getPilotTypeLabel(core.pilotType);
  const stageLabel = getPilotStageLabel(core.pilotStage);
  const stageTone = getPilotStageTone(core.pilotStage);
  const pilotMetaBadges = [
    (showPilotStage && stageLabel) ? renderBadge(stageLabel, stageTone, 'pilotStage', core.pilotStage) : '',
    (showPilotType && pilotTypeLabel) ? renderBadge(pilotTypeLabel, 'bg-green-50 text-green-800 border-green-200', 'pilotType', core.pilotType) : '',
  ].filter(Boolean);
  const badgesHtml = pilotMetaBadges.length
    ? `<div class="mt-4">
        <p class="mb-1.5 text-xs font-bold uppercase tracking-wide text-gray-500">${esc(uiText(pilotMetaBadges.length > 1 ? 'pilotMetadata' : 'pilotMetadataSingle'))}</p>
        <div class="flex flex-wrap gap-2">${pilotMetaBadges.join('')}</div>
      </div>`
    : '';

  const body = `
    ${hypothesisHtml}
    ${miniMetaHtml}
    ${infraHtml}
    ${kpiHtml}
    ${badgesHtml}
  `;

  // ── CTA ───────────────────────────────────────────────────────────────────
  const ef = item.externalFlow || {};
  const extUrl = ef.enabled && ef.primaryAction?.url ? ef.primaryAction.url : null;
  const ctaLabel = pickLang({ es: 'Ver pilotaje', en: 'View pilot', va: 'Veure pilot' });
  const ctaHtml = extUrl
    ? `<a href="${esc(extUrl)}" target="_blank" rel="noopener noreferrer" class="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-eu-blue hover:text-eu-purple focus:outline-none focus:ring-2 focus:ring-eu-blue focus:ring-offset-2 rounded">${esc(pickLang(ef.primaryAction?.label) || ctaLabel)} <i data-lucide="external-link" class="h-4 w-4"></i></a>`
    : `<button type="button" data-id="${esc(item.id)}" class="mp-view-detail inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-eu-blue hover:text-eu-purple focus:outline-none focus:ring-2 focus:ring-eu-blue focus:ring-offset-2 rounded">${esc(ctaLabel)} <i data-lucide="arrow-right" class="h-4 w-4"></i></button>`;
  const leadName = pickLang(item.ownership?.lead?.name, item.ownership?.lead?.name || '');
  const entityLabel = (ccv.ch_entity !== false && pres.showEntity !== false) ? leadName : null;

  return renderCardShell(item, tab, body, {
    title: core.title,
    subtitle: core.summary,
    showStatusBadge: ccv.ch_pilot_status !== false,
    extraBadge: showSectorBadge ? sectorLabel : '',
    extraBadgeFilterKey: showSectorBadge && sectorLabel ? 'sector' : '',
    extraBadgeFilterValue: showSectorBadge && sectorLabel ? getSectorCode(sectorCode) : '',
    entity: entityLabel,
    ctaHtml,
    hideTypeBadge: true,
  });
}

function renderPilotCardLegacy(item, tab) {
  const ccv = MARKETPLACE_CONFIG.cardChipVisibility || {};
  const card = item.card || {};
  const pilotTypeLabel = getPilotTypeLabel(item.core?.pilotType);
  const pilotStatusLabel = getPilotStatusLabel(item.classification?.pilotStatus);
  const helixChips = asArray(item.core?.helix).map(h => renderBadge(getHelixLabel(h), 'bg-eu-bg text-gray-700 border-eu-border', 'helix', h)).filter(Boolean).join('');
  const body = `
    ${renderCardCallout(uiText('direction'), card.collaborationDirection || item.core?.summary, 'route')}
    ${renderCardMiniMeta([
      { label: uiText('trl'), value: getTrlLabel(card.trl) },
      { label: uiText('window'), value: pickLang(card.executionWindow?.label) || pickLang(card.validationStatus) },
      { label: uiText('infrastructure'), value: asArray(card.infrastructure).slice(0, CARD_CHIP_MAX).join(' / ') },
    ])}
    ${pilotTypeLabel || pilotStatusLabel || helixChips ? `
      <div class="mt-4 flex flex-wrap gap-2">
        ${pilotTypeLabel ? renderBadge(pilotTypeLabel, 'bg-green-50 text-green-800 border-green-200', 'pilotType', item.core?.pilotType) : ''}
        ${pilotStatusLabel ? renderBadge(pilotStatusLabel, 'bg-emerald-50 text-emerald-800 border-emerald-200', 'pilotStatus', item.classification?.pilotStatus) : ''}
        ${helixChips}
      </div>` : ''}
  `;
  return renderCardShell(item, tab, body, {
    title: item.core?.title,
    subtitle: card.validationStatus || item.core?.summary,
    extraBadge: ccv.ch_pilot_extraBadge !== false ? (pilotTypeLabel || getTrlLabel(card.trl) || getSectorLabel(item.core?.sector)) : '',
    extraBadgeFilterKey: ccv.ch_pilot_extraBadge !== false ? (pilotTypeLabel ? 'pilotType' : (!getTrlLabel(card.trl) ? 'sector' : '')) : '',
    extraBadgeFilterValue: ccv.ch_pilot_extraBadge !== false ? (pilotTypeLabel ? item.core?.pilotType : getSectorCode(item.core?.sector)) : '',
    hideTypeBadge: true,
  });
}

function renderValidationCard(item, tab) {
  const ccv = MARKETPLACE_CONFIG.cardChipVisibility || {};
  const core = item.core || {};
  const pres = item.presentation?.card || {};
  const validation = item.validation || {};
  const decision = item.decision || {};
  const ef = item.externalFlow || {};

  // ── Bloque principal: "Qué se valida" ────────────────────────────────────
  const mainBlockLabel = pickLang(pres.mainBlockLabel) || pickLang({ es: 'Qué se valida', en: 'What is validated', va: 'Què es valida' });
  const objectTitle = pickLang(validation.objectTitle) || pickLang(core.summary);
  const mainBlockHtml = objectTitle
    ? `<div class="mt-4 rounded-lg bg-eu-bg p-4">
        <p class="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-gray-500">
          <i data-lucide="clipboard-check" class="h-3.5 w-3.5"></i>
          ${esc(mainBlockLabel)}
        </p>
        <p class="mt-1 text-sm font-semibold leading-6 text-eu-text">${esc(objectTitle)}</p>
      </div>`
    : '';

  // ── Ventana de validación (computed top-level, not in core) ──────────────
  const windowLabel = pres.showWindow !== false ? pickLang(item.validationWindow?.label) : '';

  // ── Entorno de validación (max 3 chips) ───────────────────────────────────
  let envHtml = '';
  if (pres.showValidationEnvironment !== false) {
    const envItems = asArray(validation.validationEnvironment).slice(0, CARD_CHIP_MAX)
      .map(e => pickLang(e.label)).filter(Boolean);
    if (envItems.length) {
      envHtml = `<div class="mt-4 flex flex-wrap gap-2">${envItems.map(l => renderBadge(l, 'bg-slate-50 text-slate-700 border-slate-200')).join('')}</div>`;
    }
  }

  // ── Decisión ──────────────────────────────────────────────────────────────
  const decisionLabel = pickLang(decision.label);
  const decisionHtml = (pres.showDecision !== false && decisionLabel)
    ? `<div class="mt-3 flex items-center gap-1.5 text-xs text-gray-500">
        <i data-lucide="check-circle-2" class="h-3.5 w-3.5 shrink-0 text-green-600"></i>
        <span>${esc(decisionLabel)}</span>
      </div>`
    : '';

  // ── Descargables ──────────────────────────────────────────────────────────
  let dlHtml = '';
  if (pres.showDownloadsIndicator && item.hasDownloads && item.downloadCount) {
    const n = item.downloadCount;
    dlHtml = `<div class="mt-3 flex items-center gap-1.5 text-xs text-gray-500"><i data-lucide="file-down" class="h-3.5 w-3.5 shrink-0"></i><span>${esc(n === 1 ? `1 ${uiText('downloadable')}` : `${n} ${uiText('downloadables')}`)}</span></div>`;
  }

  // ── Mini-meta: ventana + etapa de validación (ya traducida en computed field) ──
  const stageLabel = pres.showEvidenceLevel !== false ? pickLang(item.validationStageLabel) : '';
  const stageMetaLabel = pickLang({ es: 'Etapa', en: 'Stage', va: 'Etapa' });
  const miniMetaHtml = renderCardMiniMeta([
    windowLabel ? { label: uiText('window'), value: windowLabel } : null,
    stageLabel ? { label: stageMetaLabel, value: stageLabel } : null,
  ].filter(Boolean));

  // ── CTA: "Ver validación" siempre singular ────────────────────────────────
  const extUrl = ef.enabled && ef.primaryAction?.url ? ef.primaryAction.url : null;
  const ctaLabel = pickLang({ es: 'Ver validación', en: 'View validation', va: 'Veure validació' });
  const ctaHtml = extUrl
    ? `<a href="${esc(extUrl)}" target="_blank" rel="noopener noreferrer" class="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-lg bg-eu-blue px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-eu-purple focus:outline-none focus:ring-2 focus:ring-eu-blue focus:ring-offset-2">${esc(ctaLabel)}<i data-lucide="external-link" class="h-3.5 w-3.5"></i></a>`
    : `<button type="button" data-id="${esc(item.id)}" class="mp-view-detail inline-flex min-h-11 shrink-0 items-center gap-2 rounded-lg bg-eu-blue px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-eu-purple focus:outline-none focus:ring-2 focus:ring-eu-blue focus:ring-offset-2">${esc(ctaLabel)}<i data-lucide="arrow-right" class="h-3.5 w-3.5"></i></button>`;

  // ── Badge extra: sector (validationType ya aparece como badge de estado) ──
  const extraBadge = ccv.ch_val_extraBadge !== false ? getSectorLabel(core.sector) : '';

  const body = `
    ${mainBlockHtml}
    ${miniMetaHtml}
    ${envHtml}
    ${decisionHtml}
    ${dlHtml}
  `;

  const proposerName = pickLang(item.ownership?.proposer?.name) || '';

  return renderCardShell(item, tab, body, {
    title: core.title,
    subtitle: core.summary,
    extraBadge,
    extraBadgeFilterKey: ccv.ch_val_extraBadge !== false ? 'sector' : '',
    extraBadgeFilterValue: ccv.ch_val_extraBadge !== false ? getSectorCode(core.sector) : '',
    entity: proposerName,
    ctaHtml,
  });
}

function renderMentoringCard(item, tab) {
  const ccv = MARKETPLACE_CONFIG.cardChipVisibility || {};
  const core = item.core || {};
  const pres = item.presentation?.card || {};
  const offer = item.mentoringOffer || {};
  const format = offer.format || {};
  const provider = item.ownership?.provider || {};
  const ef = item.externalFlow || {};
  const primaryUrl = ef.enabled && ef.primaryAction?.url ? ef.primaryAction.url : '';
  const fallbackLabel = pickLang(ef.fallbackAction?.label) || pickLang({ es: 'Ver mentoria', en: 'View mentoring', va: 'Veure mentoria' });

  if (offer.purpose || item.mentors || item.expectedOutputs || item.presentation) {
    const providerName = pickLang(provider.name) || pickLang(core.entity?.name);
    const providerRole = pickLang(provider.role);
    const purposeLabel = pickLang(pres.mainBlockLabel) || pickLang({ es: 'Que ofrece', en: 'What it offers', va: 'Que ofereix' });
    const purpose = pickLang(offer.purpose);
    const specialties = asArray(item.mentors?.items)
      .flatMap(mentor => asArray(mentor?.specialties))
      .map(specialty => getMentoringSpecialtyLabel(specialty) || pickLang(specialty))
      .filter(Boolean)
      .filter((specialty, index, all) => all.indexOf(specialty) === index);
    const modality = getModalityLabel(format.modality);
    const duration = format.sessionDurationMinutes
      ? pickLang({
          es: `${format.sessionDurationMinutes} min`,
          en: `${format.sessionDurationMinutes} min`,
          va: `${format.sessionDurationMinutes} min`,
        })
      : '';
    const asyncReview = format.asyncReview
      ? pickLang({
          es: 'revision asincronica',
          en: 'async review',
          va: 'revisio asincronica',
        })
      : '';
    const formatSummary = [modality, duration, asyncReview].filter(Boolean).join(' / ');
    const cardDownloads = asArray(item.cardDownloads).filter(download => download?.showOnCard !== false);
    const dlHtml = pres.showDownloadsIndicator !== false && item.downloads?.enabled && item.hasDownloads && cardDownloads.length
      ? `<div class="mt-3 flex items-center gap-1.5 text-xs text-gray-500"><i data-lucide="file-down" class="h-3.5 w-3.5 shrink-0"></i><span>${esc(cardDownloads.length === 1 ? `1 ${uiText('downloadable')}` : `${cardDownloads.length} ${uiText('downloadables')}`)}</span></div>`
      : '';
    const ctaHtml = primaryUrl
      ? `<a href="${esc(primaryUrl)}" target="_blank" rel="noopener noreferrer" class="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-lg bg-eu-blue px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-eu-purple focus:outline-none focus:ring-2 focus:ring-eu-blue focus:ring-offset-2">${esc(pickLang(ef.primaryAction?.label) || fallbackLabel)}<i data-lucide="external-link" class="h-3.5 w-3.5"></i></a>`
      : `<button type="button" data-id="${esc(item.id)}" class="mp-view-detail inline-flex min-h-11 shrink-0 items-center gap-2 rounded-lg bg-eu-blue px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-eu-purple focus:outline-none focus:ring-2 focus:ring-eu-blue focus:ring-offset-2">${esc(fallbackLabel)}<i data-lucide="arrow-right" class="h-3.5 w-3.5"></i></button>`;

    const providerHtml = providerName
      ? `<div class="mt-4 rounded-lg border border-eu-border bg-white px-3 py-2">
          <p class="text-[11px] font-bold uppercase tracking-wide text-gray-500">${esc(pickLang({ es: 'Proveedor', en: 'Provider', va: 'Proveidor' }))}</p>
          <p class="mt-0.5 text-sm font-semibold leading-5 text-gray-700">${esc(providerName)}</p>
          ${providerRole ? `<p class="mt-1 text-xs leading-5 text-gray-500">${esc(providerRole)}</p>` : ''}
        </div>`
      : '';

    const body = `
      ${purpose ? `
        <div class="mt-4 rounded-lg bg-eu-bg p-4">
          <p class="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-gray-500">
            <i data-lucide="handshake" class="h-3.5 w-3.5"></i>
            ${esc(purposeLabel)}
          </p>
          <p class="mt-1 text-sm font-semibold leading-6 text-eu-text">${esc(purpose)}</p>
        </div>` : ''}
      ${providerHtml}
      ${renderChipList(specialties, 'bg-slate-100 text-slate-700 border-slate-200', 4)}
      ${renderCardMiniMeta([
        { label: uiText('availability'), value: pickLang(format.availability) },
        { label: pickLang({ es: 'Formato', en: 'Format', va: 'Format' }), value: formatSummary },
      ])}
      ${dlHtml}
    `;

    return renderCardShell(item, tab, body, {
      title: core.title,
      subtitle: core.summary,
      statusLabel: getMentoringStatusLabel(core.status),
      extraBadge: ccv.ch_mentoring_type !== false ? getMentoringTypeLabel(core.mentoringType) : '',
      entity: '',
      ctaHtml,
    });
  }

  const card = item.card || {};
  const ctaHtml = primaryUrl
    ? `<a href="${esc(primaryUrl)}" target="_blank" rel="noopener noreferrer" class="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-lg bg-eu-blue px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-eu-purple focus:outline-none focus:ring-2 focus:ring-eu-blue focus:ring-offset-2">${esc(pickLang(ef.primaryAction?.label) || fallbackLabel)}<i data-lucide="external-link" class="h-3.5 w-3.5"></i></a>`
    : `<button type="button" data-id="${esc(item.id)}" class="mp-view-detail inline-flex min-h-11 shrink-0 items-center gap-2 rounded-lg bg-eu-blue px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-eu-purple focus:outline-none focus:ring-2 focus:ring-eu-blue focus:ring-offset-2">${esc(fallbackLabel)}<i data-lucide="arrow-right" class="h-3.5 w-3.5"></i></button>`;
  const mentorName = pickLang(card.mentorName, pickLang(item.ownership?.provider?.name) || pickLang(item.core?.entity?.name));
  const mentorRole = pickLang(card.mentorRole || item.ownership?.provider?.role || item.core?.summary);
  const badges = asArray(card.badges).map(badge => badge?.label || badge);
  const body = `
    <div class="mt-4 flex items-start gap-4 rounded-lg bg-eu-bg p-4">
      <span class="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-eu-blue text-sm font-extrabold text-white">${esc(getMentorInitials(mentorName))}</span>
      <div>
        <p class="text-sm font-bold text-eu-text">${esc(mentorName)}</p>
        <p class="mt-1 text-sm leading-5 text-gray-600">${esc(mentorRole)}</p>
      </div>
    </div>
    ${renderChipList(asArray(card.specialties), 'bg-slate-100 text-slate-700 border-slate-200', 4)}
    ${renderChipList(badges, 'bg-eu-blue/10 text-eu-blue border-eu-blue/20', 3)}
    ${renderCardMiniMeta([
      { label: uiText('availability'), value: pickLang(card.availability) },
    ])}
  `;
  return renderCardShell(item, tab, body, {
    title: item.core?.title,
    subtitle: card.organisation || item.core?.summary,
    extraBadge: ccv.ch_mentoring_type !== false ? ((primaryUrl && item.presentation?.card?.showChatBadge) ? 'Chat' : getSectorLabel(item.core?.sector)) : '',
    ctaHtml,
  });
}

function renderGenericCard(item, tab) {
  const body = `
    ${renderCardCallout(uiText('featuredSignal'), item.core?.summary, 'sparkles')}
    ${renderChipList(asArray(item.classification?.aiSteamFocus).map(getFocusLabel), 'bg-eu-bg text-gray-700 border-eu-border', 3)}
  `;
  return renderCardShell(item, tab, body, {
    title: item.core?.title,
    subtitle: item.core?.summary,
    extraBadge: getSectorLabel(item.core?.sector),
  });
}

function renderEmptyState(tab) {
  return `
    <div class="rounded-2xl border border-dashed border-eu-border bg-white p-8 text-center shadow-sm">
      <i data-lucide="${esc(tab.icon || 'inbox')}" class="mx-auto h-8 w-8 text-gray-400"></i>
      <h3 class="mt-3 text-lg font-extrabold text-eu-text">${esc(pickLang(tab.emptyState?.title, 'Sin elementos publicados'))}</h3>
      <p class="mx-auto mt-2 max-w-xl text-sm leading-6 text-gray-500">${esc(pickLang(tab.emptyState?.message))}</p>
    </div>`;
}

function renderTabIntroIcon(tabId) {
  const common = 'class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"';
  const icons = {
    cases: `<svg ${common}><path d="M8 21h8"/><path d="M12 17v4"/><path d="M7 4h10v4a5 5 0 0 1-10 0V4Z"/><path d="M5 5H3v2a4 4 0 0 0 4 4"/><path d="M19 5h2v2a4 4 0 0 1-4 4"/></svg>`,
    pilots: `<svg ${common}><path d="M9 3h6"/><path d="M10 3v5l-5 9a3 3 0 0 0 2.6 4.5h8.8A3 3 0 0 0 19 17l-5-9V3"/><path d="M8 15h8"/></svg>`,
    validations: `<svg ${common}><circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/></svg>`,
    mentorings: `<svg ${common}><path d="M21 12a7 7 0 0 1-7 7H8l-5 3 2-5a7 7 0 1 1 16-5Z"/><path d="M8 10h8"/><path d="M8 14h5"/></svg>`,
  };
  return icons[tabId] || `<svg ${common}><path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12c.8.7 1 1.4 1 2h6c0-.6.2-1.3 1-2a7 7 0 0 0-4-12Z"/></svg>`;
}

function renderTabIntroCard(tab, items) {
  const title = pickLang(tab.label, tab.id);
  const intro = pickLang(tab.intro);
  return `
    <div class="relative overflow-hidden rounded-xl border border-eu-border bg-white shadow-sm">
      <div class="absolute inset-y-0 left-0 w-1.5 bg-eu-blue"></div>
      <div class="p-5 pl-6 sm:p-6 sm:pl-7">
        <div class="min-w-0">
          <div class="flex items-center gap-3">
            <span class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-eu-blue text-white shadow-sm">
              ${renderTabIntroIcon(tab.id)}
            </span>
            <h2 class="min-w-0 text-2xl font-extrabold leading-tight text-eu-text">${esc(title)}</h2>
          </div>
          ${intro ? `<p class="mt-4 max-w-4xl text-base leading-7 text-gray-650">${esc(intro)}</p>` : ''}
        </div>
      </div>
    </div>`;
}

function renderTabPanel(tab, items) {
  return `
    <section class="mx-auto max-w-7xl px-6 py-8"
      id="mp-tabpanel-${esc(tab.id)}" role="tabpanel" aria-labelledby="mp-tab-${esc(tab.id)}">
      <div>
        ${tab.introVisible !== false ? renderTabIntroCard(tab, items) : ''}

          ${items.length ? renderTabFilters(tab, items) : ''}
          <div id="mp-tab-results" class="mt-6">
            ${items.length ? renderTabResults(tab, items) : renderEmptyState(tab)}
          </div>
        </div>
      </section>`;
}

function renderList() {
  const activeTab = getActiveTab();
  const activeId = activeTab?.id || getActiveTabId();
  const tab = activeTab || { id: activeId, label: { es: activeId }, icon: 'layers-3' };
  const items = getItemsForTab(activeId);
  return `
    ${renderHero()}
    ${renderTabs(activeId)}
    ${renderTabPanel(tab, items)}`;
}

function formatDateShort(isoStr) {
  if (!isoStr) return '';
  try {
    const d = new Date(isoStr + 'T00:00:00');
    const lang = getLang();
    const locale = lang === 'en' ? 'en-GB' : lang === 'va' ? 'ca-ES' : 'es-ES';
    return d.toLocaleDateString(locale, { month: 'short', year: 'numeric' });
  } catch {
    return isoStr;
  }
}

function renderStructuredSection(title, icon, contentHtml) {
  if (!contentHtml) return '';
  return `
    <section class="rounded-2xl bg-white border border-eu-border p-6">
      ${renderSecondaryHeader(icon, pickLang(title, title))}
      ${contentHtml}
    </section>`;
}

function renderContactCards(people) {
  const contacts = asArray(people?.contacts);
  if (!contacts.length) return '';
  return `<div class="space-y-3">
    ${contacts.map(contact => {
      const name = contact.name || '';
      const role = pickLang(contact.role);
      const org = contact.org || '';
      const initials = name.split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]?.toUpperCase()).join('') || '?';
      const meta = [role, org].filter(Boolean).join(' · ');
      return `
        <div class="flex items-center gap-3 rounded-lg border border-eu-border bg-eu-bg p-3">
          <span class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-eu-blue text-sm font-extrabold text-white">${esc(initials)}</span>
          <div class="min-w-0">
            <p class="text-sm font-bold text-eu-text">${esc(name)}</p>
            ${meta ? `<p class="mt-0.5 truncate text-xs text-gray-500">${esc(meta)}</p>` : ''}
          </div>
        </div>`;
    }).join('')}
  </div>`;
}

function renderMilestoneList(process) {
  const milestones = asArray(process?.milestones);
  if (!milestones.length) return '';
  return `<ol>
    ${milestones.map((ms, i) => {
      const dateLabel = formatDateShort(ms.date);
      const label = pickLang(ms.label || ms);
      if (!label) return '';
      const isLast = i === milestones.length - 1;
      return `<li class="flex gap-3">
        <div class="flex flex-col items-center">
          <span class="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-eu-blue" style="min-width:0.625rem"></span>
          ${!isLast ? `<span class="mt-1 w-px flex-1 bg-gray-200" style="min-height:1.5rem"></span>` : ''}
        </div>
        <div class="${isLast ? '' : 'pb-4'} min-w-0">
          ${dateLabel ? `<p class="text-xs font-bold text-eu-blue">${esc(dateLabel)}</p>` : ''}
          <p class="mt-0.5 text-sm text-gray-700">${esc(label)}</p>
        </div>
      </li>`;
    }).join('')}
  </ol>`;
}

function renderDeliverableList(outputs) {
  const expected = asArray(outputs?.expected);
  if (!expected.length) return '';
  return `<ul class="space-y-2">
    ${expected.map(item => {
      const label = pickLang(item?.label || item);
      if (!label) return '';
      return `<li class="flex items-start gap-2">
        <i data-lucide="check" class="mt-0.5 h-4 w-4 shrink-0 text-green-600"></i>
        <span class="text-sm text-gray-700">${esc(label)}</span>
      </li>`;
    }).filter(Boolean).join('')}
  </ul>`;
}

function renderResourceRows(resources) {
  const available = asArray(resources?.available);
  if (!available.length) return '';
  return `<ul class="space-y-2">
    ${available.map(resource => {
      const label = pickLang(resource?.label || resource);
      if (!label) return '';
      const format = resource?.format || '';
      const license = resource?.license || '';
      return `<li class="flex items-center justify-between gap-3 rounded-lg border border-eu-border bg-eu-bg p-3">
        <div class="flex items-center gap-2 min-w-0">
          <i data-lucide="file-text" class="h-4 w-4 shrink-0 text-eu-blue"></i>
          <span class="text-sm font-semibold text-gray-700 truncate">${esc(label)}</span>
        </div>
        <div class="flex shrink-0 gap-1">
          ${format ? renderBadge(format) : ''}
          ${license ? renderBadge(license, 'bg-green-50 text-green-800 border-green-200') : ''}
        </div>
      </li>`;
    }).filter(Boolean).join('')}
  </ul>`;
}

function renderTrackABlock(item) {
  const trackA = getBlockContent(item, 'trackA');
  if (!trackA || trackA.enabled === false) return '';
  const label = pickLang(trackA.label);
  if (!label) return '';
  const url = pickLang(trackA.url);
  return `
    <section class="rounded-2xl border border-eu-border bg-white p-6 shadow-sm">
      <div class="mb-4 flex items-center gap-3">
        <span class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-eu-blue/10 text-eu-blue">
          <i data-lucide="graduation-cap" class="h-5 w-5"></i>
        </span>
        <h2 class="text-base font-extrabold text-eu-text">${esc(getBlockLabel('trackA') || 'Track A')}</h2>
      </div>
      <p class="text-sm leading-6 text-gray-700">${esc(label)}</p>
      ${url ? `
        <a href="${esc(url)}" class="mt-4 inline-flex min-h-11 items-center gap-2 rounded-lg bg-eu-blue px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-eu-purple focus:outline-none focus:ring-2 focus:ring-eu-blue focus:ring-offset-2">
          ${esc(uiText('viewDetail'))}
          <i data-lucide="arrow-right" class="h-4 w-4"></i>
        </a>` : ''}
    </section>`;
}

/* ─── Narrative section renderers ─── */

function fw(html) { return html ? `<div class="col-span-2">${html}</div>` : ''; }

function renderSecondaryHeader(icon, title) {
  return `
    <div class="mb-4 flex items-center gap-2 border-b border-eu-border pb-3">
      <i data-lucide="${esc(icon)}" class="h-4 w-4 shrink-0 text-eu-blue"></i>
      <h2 class="text-xs font-extrabold uppercase tracking-widest text-gray-400">${esc(title)}</h2>
    </div>`;
}

function renderSectionHeader(icon, title, accent = false) {
  const iconBg = accent ? 'bg-eu-blue text-white' : 'bg-eu-blue/10 text-eu-blue';
  return `
    <div class="mb-5 flex items-center gap-3">
      <span class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconBg}">
        <i data-lucide="${esc(icon)}" class="h-5 w-5"></i>
      </span>
      <h2 class="text-base font-extrabold text-eu-text">${esc(title)}</h2>
    </div>`;
}

function renderCallout(icon, labelText, body, tone = 'bg-eu-bg border-eu-border text-gray-500') {
  if (!body) return '';
  const [bg, border, labelColor] = tone.split(' ');
  return `
    <div class="mt-5 flex items-start gap-3 rounded-xl ${bg} p-4" style="border:1px solid rgba(0,0,0,0.07)">
      <i data-lucide="${esc(icon)}" class="mt-0.5 h-5 w-5 shrink-0 ${labelColor || 'text-gray-500'}"></i>
      <div>
        <p class="text-xs font-extrabold uppercase tracking-wide ${labelColor || 'text-gray-500'}">${esc(labelText)}</p>
        <p class="mt-1 text-sm leading-6 text-gray-700">${esc(body)}</p>
      </div>
    </div>`;
}

function renderKeyFact(label, value) {
  if (!value) return '';
  return `
    <div class="rounded-xl bg-eu-bg p-4">
      <p class="text-xs font-bold uppercase tracking-wide text-gray-500">${esc(label)}</p>
      <p class="mt-1 text-sm font-semibold text-eu-text">${esc(value)}</p>
    </div>`;
}

function renderChallengeBriefSection(item) {
  const card = item.card || {};
  const detail = item.detail || {};
  const actionTitle = pickLang(card.actionTitle);
  const need = pickLang(detail.need);
  const reward = pickLang(card.reward);
  const deadline = pickLang(card.deadlineMode) || pickLang(item.core?.deadlineLabel);
  if (!actionTitle && !need && !reward) return '';
  return `
    <section class="rounded-2xl bg-eu-blue/5 border border-eu-blue/20 p-6">
      ${renderSectionHeader('target', uiText('challengeBrief'), true)}
      ${actionTitle ? `<p class="text-xl font-bold leading-snug text-eu-blue">${esc(actionTitle)}</p>` : ''}
      ${need ? `<p class="mt-4 text-sm leading-7 text-gray-700">${esc(need)}</p>` : ''}
      ${renderCallout('award', pickLang(FIELD_LABELS.reward), reward, 'bg-eu-orange/10 border-eu-orange/20 text-eu-orange')}
      ${deadline ? `<p class="mt-4 flex items-center gap-2 text-sm text-gray-500"><i data-lucide="clock" class="h-4 w-4 shrink-0 text-eu-blue"></i>${esc(deadline)}</p>` : ''}
    </section>`;
}

function renderCollaborationSection(item) {
  const detail = item.detail || {};
  const context = pickLang(detail.context);
  const audience = pickLang(detail.participation?.audience);
  const format = pickLang(detail.participation?.format);
  const transferValue = pickLang(detail.transferValue);
  if (!context && !audience && !format && !transferValue) return '';
  return `
    <section class="rounded-2xl bg-white border border-eu-border p-6">
      ${renderSecondaryHeader('users', uiText('collaborationMap'))}
      ${context ? `<p class="text-sm leading-7 text-gray-700">${esc(context)}</p>` : ''}
      ${audience || format ? `
        <div class="mt-5 rounded-xl bg-eu-bg p-4">
          ${audience ? `<div class="flex items-start gap-2"><i data-lucide="user-check" class="mt-0.5 h-4 w-4 shrink-0 text-eu-blue"></i><p class="text-sm leading-6 text-gray-700">${esc(audience)}</p></div>` : ''}
          ${format ? `<div class="mt-3 flex items-start gap-2"><i data-lucide="send" class="mt-0.5 h-4 w-4 shrink-0 text-eu-blue"></i><p class="text-sm leading-6 text-gray-700">${esc(format)}</p></div>` : ''}
        </div>` : ''}
      ${transferValue ? `
        <div class="mt-5 border-t border-eu-border pt-4">
          <p class="mb-2 text-xs font-bold uppercase tracking-wide text-gray-500">${esc(getBlockLabel('transferValue') || pickLang(FIELD_LABELS.evidence))}</p>
          <p class="text-sm leading-7 text-gray-700">${esc(transferValue)}</p>
        </div>` : ''}
    </section>`;
}

function renderTechnicalSection(item) {
  const card = item.card || {};
  const sdgSource = card.sdgs || card.validatedSdgs;
  const competences = asArray(card.setCompetences).map(v => (typeof v === 'string' ? v : pickLang(v))).filter(Boolean);
  const sdgs = asArray(sdgSource);
  const ipModel = pickLang(card.ipModel);
  if (!competences.length && !sdgs.length && !ipModel) return '';
  return `
    <section class="rounded-2xl bg-white border border-eu-border p-6">
      ${renderSecondaryHeader('settings-2', uiText('technicalBlocks'))}
      ${competences.length ? `
        <div>
          <p class="mb-2 text-xs font-bold uppercase tracking-wide text-gray-500">${esc(pickLang(FIELD_LABELS.setCompetences))}</p>
          <div class="flex flex-wrap gap-2">${competences.map(c => renderBadge(c, 'bg-eu-blue/10 text-eu-blue border-eu-blue/20')).join('')}</div>
        </div>` : ''}
      ${sdgs.length ? `
        <div class="${competences.length ? 'mt-5' : ''}">
          <p class="mb-2 text-xs font-bold uppercase tracking-wide text-gray-500">${esc(pickLang(FIELD_LABELS.sdgs))}</p>
          <div class="flex flex-wrap gap-2">
            ${sdgs.map(sdg => {
              const id = sdg?.id;
              const lbl = pickLang(sdg?.label || sdg);
              const text = id ? `ODS ${id}${lbl ? ' · ' + lbl : ''}` : lbl;
              return text ? renderBadge(text, 'bg-green-50 text-green-800 border-green-200') : '';
            }).filter(Boolean).join('')}
          </div>
        </div>` : ''}
      ${ipModel ? `
        <div class="${(competences.length || sdgs.length) ? 'mt-5' : ''} flex items-start gap-2">
          <i data-lucide="shield" class="mt-0.5 h-4 w-4 shrink-0 text-gray-400"></i>
          <p class="text-sm leading-6 text-gray-600">${esc(ipModel)}</p>
        </div>` : ''}
    </section>`;
}

function renderCaseEvidenceSection(item) {
  const card = item.card || {};
  const achievement = pickLang(card.achievement);
  const actors = renderActorNames(card.actors);
  const kpi = card.highlightKpi?.value
    ? `${pickLang(card.highlightKpi.value)}${pickLang(card.highlightKpi.label) ? ' / ' + pickLang(card.highlightKpi.label) : ''}`
    : pickLang(card.impactKpi);
  const valorisation = pickLang(card.economicValue || card.valorisation);
  if (!achievement && !actors && !kpi) return '';
  return `
    <section class="rounded-2xl bg-eu-orange/10 border border-eu-orange/20 p-6">
      ${renderSectionHeader('trophy', uiText('detailCaseEvidence'), true)}
      ${achievement ? `<p class="text-xl font-bold leading-snug text-eu-blue">${esc(achievement)}</p>` : ''}
      ${actors ? `<p class="mt-3 flex items-center gap-2 text-sm text-gray-500"><i data-lucide="users" class="h-4 w-4 shrink-0"></i>${esc(actors)}</p>` : ''}
      ${kpi || valorisation ? `
        <div class="mt-5 grid gap-3 md:grid-cols-2">
          ${renderKeyFact(pickLang(UI_TEXT.kpi), kpi)}
          ${renderKeyFact(pickLang(UI_TEXT.valorisation), valorisation)}
        </div>` : ''}
    </section>`;
}

function renderPilotPlanSection(item) {
  const card = item.card || {};
  const direction = pickLang(card.collaborationDirection);
  const trlLabel = getTrlLabel(card.trl);
  const window = pickLang(card.executionWindow?.label) || pickLang(card.validationStatus);
  const infra = asArray(card.infrastructure).join(' / ');
  if (!direction && !trlLabel && !window && !infra) return '';
  return `
    <section class="rounded-2xl bg-eu-blue/5 border border-eu-blue/20 p-6">
      ${renderSectionHeader('flask-conical', uiText('pilotValidationPlan'), true)}
      ${direction ? `<p class="text-xl font-bold leading-snug text-eu-blue">${esc(direction)}</p>` : ''}
      <div class="mt-5 grid gap-3 md:grid-cols-2">
        ${renderKeyFact(pickLang(UI_TEXT.trl), trlLabel)}
        ${renderKeyFact(pickLang(UI_TEXT.window), window)}
        ${infra ? renderKeyFact(pickLang(UI_TEXT.infrastructure), infra) : ''}
      </div>
    </section>`;
}

function renderDetailHeader(item) {
  const title = pickLang(item.core?.title, item.id);
  const summary = pickLang(item.core?.summary);
  const entity = pickLang(item.core?.entity?.name);
  const tab = getTabs().find(candidate => candidate.id === item.tab) || getActiveTab();
  const tone = TAB_TONES[tab?.id] || TAB_TONES.challenges;
  const dateLabel = getItemDateLabel(item);
  const featuredSignal = pickLang(item.community?.featuredSignal);
  const deadline = pickLang(item.card?.deadlineMode) || pickLang(item.core?.deadlineLabel);

  return `
    <section class="bg-eu-blue px-6 py-12 text-white">
      <div class="mx-auto max-w-7xl">
        <button id="mp-back" type="button" class="mb-7 inline-flex min-h-11 items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm font-bold text-white transition-colors hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-eu-blue">
          <i data-lucide="arrow-left" class="h-4 w-4"></i>
          ${esc(uiText('backCommunity'))}
        </button>
        <div class="flex flex-wrap gap-2">
          ${renderBadge(pickLang(tab?.label, item.tab), 'bg-white/10 text-white border-white/20')}
          ${renderBadge(getTypeLabel(item.type), 'bg-white/10 text-white border-white/20')}
          ${renderBadge(getStatusLabel(item.core?.status), 'bg-white/10 text-white border-white/20')}
          ${item.type === 'challenge' ? renderBadge(getEvidenceLabel(item.classification?.evidenceMaturity), 'bg-white/10 text-white border-white/20') : ''}
        </div>
        <h1 class="mt-5 max-w-4xl text-3xl font-extrabold leading-tight md:text-4xl">${esc(title)}</h1>
        ${summary ? `<p class="mt-4 max-w-4xl text-base leading-7 text-white/80">${esc(summary)}</p>` : ''}
        ${featuredSignal ? `
          <div class="mt-4 inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm font-semibold text-white">
            <i data-lucide="zap" class="h-4 w-4 text-eu-yellow"></i>
            ${esc(featuredSignal)}
          </div>` : ''}
        <div class="mt-6 flex flex-wrap items-center gap-4 text-sm font-semibold text-white/75">
          ${entity ? `<span class="inline-flex items-center gap-2"><i data-lucide="building-2" class="h-4 w-4"></i>${esc(entity)}</span>` : ''}
          ${deadline ? `<span class="inline-flex items-center gap-2 rounded border border-white/20 bg-white/10 px-2 py-1"><i data-lucide="clock" class="h-4 w-4"></i>${esc(deadline)}</span>` : ''}
          ${!deadline && dateLabel ? `<span class="inline-flex items-center gap-2"><i data-lucide="calendar" class="h-4 w-4"></i>${esc(dateLabel)}</span>` : ''}
          <span class="inline-flex items-center gap-2 ${tone.badge} rounded border px-2 py-1">${esc(getSectorLabel(item.core?.sector))}</span>
        </div>
      </div>
    </section>`;
}

function renderDetail(item) {
  if (item.type === 'challenge') return renderChallengeDetail(item);
  if (item.type === 'case') return renderCaseDetail(item);
  if (item.type === 'validation') return renderValidationDetail(item);
  if (item.type === 'pilot') return renderPilotDetail(item);
  if (item.type === 'mentoring') return renderMentoringDetail(item);
  return renderGenericDetail(item);
}

function renderDetailLayout(item, mainHtml, sidebarHtml = '') {
  return `
    <div>
      ${renderDetailHeader(item)}
      <section class="mx-auto max-w-7xl px-6 py-8">
        <div class="grid gap-6 lg:grid-cols-3">
          <div class="space-y-5 lg:col-span-2">
            ${mainHtml || renderDetailEmpty()}
          </div>
          <aside class="space-y-5 self-start">
            ${renderOperationalSummary(item)}
            ${renderAccessPanel(item)}
            ${sidebarHtml}
            ${renderTraceabilityPanel(item)}
          </aside>
        </div>
      </section>
    </div>`;
}

/* ─── Challenge v2 detail: header ─── */

function renderChallengeDetailHeader(item) {
  const ownership = item.ownership || {};
  const ef = item.externalFlow || {};
  const title = pickLang(item.core?.title, item.id);
  const summary = pickLang(item.core?.summary);
  const tab = getTabs().find(t => t.id === item.tab) || getActiveTab();
  const tone = TAB_TONES[tab?.id] || TAB_TONES.challenges;
  const dateLabel = getItemDateLabel(item);
  const featuredSignal = pickLang(item.community?.featuredSignal);
  const deadline = pickLang(item.core?.deadlineLabel);
  const entityLabel = pickLang(ownership.requester?.publicLabel) || pickLang(item.core?.entity?.name);
  const ctaUrl = ef.enabled && ef.primaryAction?.url ? ef.primaryAction.url : null;
  const ctaLabel = ctaUrl ? (pickLang(ef.primaryAction?.label) || uiText('viewDetail')) : null;
  return `
    <section class="bg-eu-blue px-6 py-12 text-white">
      <div class="mx-auto max-w-7xl">
        <button id="mp-back" type="button" class="mb-7 inline-flex min-h-11 items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm font-bold text-white transition-colors hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-eu-blue">
          <i data-lucide="arrow-left" class="h-4 w-4"></i>
          ${esc(uiText('backCommunity'))}
        </button>
        <div class="flex flex-wrap gap-2">
          ${renderBadge(pickLang(tab?.label, item.tab), 'bg-white/10 text-white border-white/20')}
          ${renderBadge(getTypeLabel(item.type), 'bg-white/10 text-white border-white/20')}
          ${renderBadge(getStatusLabel(item.core?.status), 'bg-white/10 text-white border-white/20')}
          ${renderBadge(getEvidenceLabel(item.core?.maturity || item.classification?.evidenceMaturity), 'bg-white/10 text-white border-white/20')}
        </div>
        <h1 class="mt-5 max-w-4xl text-3xl font-extrabold leading-tight md:text-4xl">${esc(title)}</h1>
        ${summary ? `<p class="mt-4 max-w-4xl text-base leading-7 text-white/80">${esc(summary)}</p>` : ''}
        ${featuredSignal ? `
          <div class="mt-4 inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm font-semibold text-white">
            <i data-lucide="zap" class="h-4 w-4 text-eu-yellow"></i>
            ${esc(featuredSignal)}
          </div>` : ''}
        <div class="mt-6 flex flex-wrap items-center gap-4 text-sm font-semibold text-white/75">
          ${entityLabel ? `<span class="inline-flex items-center gap-2"><i data-lucide="building-2" class="h-4 w-4"></i>${esc(entityLabel)}</span>` : ''}
          ${deadline ? `<span class="inline-flex items-center gap-2 rounded border border-white/20 bg-white/10 px-2 py-1"><i data-lucide="clock" class="h-4 w-4"></i>${esc(deadline)}</span>` : ''}
          ${!deadline && dateLabel ? `<span class="inline-flex items-center gap-2"><i data-lucide="calendar" class="h-4 w-4"></i>${esc(dateLabel)}</span>` : ''}
          <span class="inline-flex items-center gap-2 ${tone.badge} rounded border px-2 py-1">${esc(getSectorLabel(item.core?.sector))}</span>
        </div>
        ${ctaUrl ? `
          <div class="mt-6">
            <a href="${esc(ctaUrl)}" target="_blank" rel="noopener noreferrer" class="inline-flex min-h-11 items-center gap-2 rounded-lg bg-eu-orange px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-eu-purple focus:outline-none focus:ring-2 focus:ring-eu-orange focus:ring-offset-2 focus:ring-offset-eu-blue">
              ${esc(ctaLabel)}
              <i data-lucide="external-link" class="h-4 w-4"></i>
            </a>
          </div>` : ''}
      </div>
    </section>`;
}

/* ─── Challenge v2 detail: main column sections ─── */

function renderChallengeBriefV2(item) {
  const briefTitle = pickLang(item.detail?.briefTitle);
  const need = pickLang(item.detail?.need);
  const reward = pickLang(item.detail?.reward);
  if (!briefTitle && !need && !reward) return '';
  return `
    <section class="rounded-2xl bg-eu-blue/5 border border-eu-blue/20 p-6">
      ${renderSectionHeader('target', uiText('challengeBrief'), true)}
      ${briefTitle ? `<p class="text-xl font-bold leading-snug text-eu-blue">${esc(briefTitle)}</p>` : ''}
      ${need ? `<p class="mt-4 text-sm leading-7 text-gray-700">${esc(need)}</p>` : ''}
      ${renderCallout('award', pickLang(FIELD_LABELS.reward), reward, 'bg-eu-orange/10 border-eu-orange/20 text-eu-orange')}
    </section>`;
}

function renderChallengeContextSection(item) {
  const context = pickLang(item.detail?.context);
  if (!context) return '';
  return `
    <section class="rounded-2xl bg-white border border-eu-border p-6">
      ${renderSecondaryHeader('map', getBlockLabel('context') || pickLang({ es: 'Contexto', en: 'Context', va: 'Context' }))}
      <p class="text-sm leading-7 text-gray-700">${esc(context)}</p>
    </section>`;
}

function renderChallengeParticipationSection(item) {
  const cl = item.classification || {};
  const part = item.detail?.participation || {};
  const audienceText = pickLang(part.audienceText);
  const formatText = pickLang(part.formatText);
  const transferValue = pickLang(part.transferValue);
  const contribChips = asArray(cl.contributionTypes).map(id => getContributionTypeLabel(id)).filter(Boolean);
  if (!audienceText && !formatText && !transferValue && !contribChips.length) return '';
  return `
    <section class="rounded-2xl bg-white border border-eu-border p-6">
      ${renderSecondaryHeader('users', pickLang({ es: 'Quién puede participar', en: 'Who can participate', va: 'Qui pot participar' }))}
      ${contribChips.length ? `
        <div class="mb-4">
          <p class="mb-1.5 text-xs font-bold uppercase tracking-wide text-gray-500">${esc(uiText('seeking'))}</p>
          <div class="flex flex-wrap gap-2">${contribChips.map(c => renderBadge(c, 'bg-eu-blue/10 text-eu-blue border-eu-blue/20')).join('')}</div>
        </div>` : ''}
      ${audienceText || formatText ? `
        <div class="rounded-xl bg-eu-bg p-4">
          ${audienceText ? `<div class="flex items-start gap-2"><i data-lucide="user-check" class="mt-0.5 h-4 w-4 shrink-0 text-eu-blue"></i><p class="text-sm leading-6 text-gray-700">${esc(audienceText)}</p></div>` : ''}
          ${formatText ? `<div class="mt-3 flex items-start gap-2"><i data-lucide="send" class="mt-0.5 h-4 w-4 shrink-0 text-eu-blue"></i><p class="text-sm leading-6 text-gray-700">${esc(formatText)}</p></div>` : ''}
        </div>` : ''}
      ${transferValue ? `
        <div class="mt-5 border-t border-eu-border pt-4">
          <p class="mb-2 text-xs font-bold uppercase tracking-wide text-gray-500">${esc(getBlockLabel('transferValue') || pickLang({ es: 'Valor para la red', en: 'Network value', va: 'Valor per a la xarxa' }))}</p>
          <p class="text-sm leading-7 text-gray-700">${esc(transferValue)}</p>
        </div>` : ''}
    </section>`;
}

function renderDownloadsSection(item) {
  const dl = item.downloads || {};
  const basePath = dl.basePath || '';
  const hasTarget = dlItem => Boolean(dlItem?.url || asArray(dlItem?.files).some(file => file?.file || file?.url));
  const dlItems = asArray(dl.items).filter(i => i.showOnDetail !== false && hasTarget(i));
  if (!dlItems.length) return '';
  return `
    <section class="rounded-2xl bg-white border border-eu-border p-6">
      ${renderSecondaryHeader('file-down', getBlockLabel('downloads') || pickLang({ es: 'Materiales descargables', en: 'Downloadable materials', va: 'Materials descarregables' }))}
      <div class="space-y-4">
        ${dlItems.map(dlItem => {
          const typeLabel = getDownloadTypeLabel(dlItem.type);
          const dlTitle = pickLang(dlItem.title);
          const dlDesc = pickLang(dlItem.description);
          const dlFiles = asArray(dlItem.files);
          const dlMeta = [dlItem.format?.toUpperCase(), dlItem.language?.toUpperCase(), dlItem.license].filter(Boolean).join(' / ');
          const itemUrlHtml = dlItem.url
            ? `<a href="${esc(dlItem.url)}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 rounded border border-eu-border bg-white px-2.5 py-1 text-xs font-semibold text-gray-700 transition-colors hover:border-eu-blue hover:bg-eu-blue hover:text-white focus:outline-none focus:ring-2 focus:ring-eu-blue"><i data-lucide="external-link" class="h-3.5 w-3.5"></i>${esc(pickLang({ es: 'Abrir', en: 'Open', va: 'Obrir' }))}</a>`
            : '';
          const filesHtml = dlFiles.map(f => {
            const href = f.url || (f.file ? `${basePath}${f.file}` : '');
            if (!href) return '';
          const badge = [f.format?.toUpperCase(), f.language?.toUpperCase()].filter(Boolean).join(' / ') || pickLang({ es: 'Descargar', en: 'Download', va: 'Descarregar' });
            const attrs = f.url ? 'target="_blank" rel="noopener noreferrer"' : 'download';
            const icon = f.url ? 'external-link' : 'download';
            return `<a href="${esc(href)}" ${attrs} class="inline-flex items-center gap-1.5 rounded border border-eu-border bg-white px-2.5 py-1 text-xs font-semibold text-gray-700 hover:bg-eu-blue hover:text-white hover:border-eu-blue transition-colors focus:outline-none focus:ring-2 focus:ring-eu-blue"><i data-lucide="${icon}" class="h-3.5 w-3.5"></i>${esc(badge)}</a>`;
          }).filter(Boolean).join('');
          return `
            <div class="rounded-xl border border-eu-border bg-eu-bg p-4">
              <div class="flex items-start justify-between gap-2">
                <p class="text-sm font-bold text-eu-text">${esc(dlTitle)}</p>
                ${typeLabel ? renderBadge(typeLabel, 'bg-eu-blue/10 text-eu-blue border-eu-blue/20') : ''}
              </div>
              ${dlDesc ? `<p class="mt-1 text-xs leading-5 text-gray-500">${esc(dlDesc)}</p>` : ''}
              ${dlMeta ? `<p class="mt-2 text-xs text-gray-400">${esc(dlMeta)}</p>` : ''}
              ${itemUrlHtml || filesHtml ? `<div class="mt-3 flex flex-wrap gap-2">${itemUrlHtml}${filesHtml}</div>` : ''}
            </div>`;
        }).join('')}
      </div>
    </section>`;
}

function renderChallengeOwnershipSection(item) {
  const ownership = item.ownership || {};
  const publisher = ownership.publisher;
  const requester = ownership.requester;
  const contact = ownership.contact;
  const publicLabel = pickLang(requester?.publicLabel);
  const publisherStr = [publisher?.name, publisher?.org].filter(Boolean).join(' · ');
  if (!publisherStr && !publicLabel && !contact) return '';
  const contactHtml = contact ? (() => {
    const name = contact.name || '';
    const role = pickLang(contact.role);
    const org = contact.org || '';
    const initials = name.split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]?.toUpperCase()).join('') || '?';
    const meta = [role, org].filter(Boolean).join(' · ');
    return `
      <div class="flex items-center gap-3 rounded-lg border border-eu-border bg-eu-bg p-3">
        <span class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-eu-blue text-sm font-extrabold text-white">${esc(initials)}</span>
        <div class="min-w-0">
          <p class="text-sm font-bold text-eu-text">${esc(name)}</p>
          ${meta ? `<p class="mt-0.5 truncate text-xs text-gray-500">${esc(meta)}</p>` : ''}
        </div>
      </div>`;
  })() : '';
  return `
    <section class="rounded-2xl bg-white border border-eu-border p-6">
      ${renderSecondaryHeader('user-round-check', getBlockLabel('people') || pickLang({ es: 'Personas y entidades', en: 'People and organisations', va: 'Persones i entitats' }))}
      ${publisherStr ? `
        <div class="mb-3 flex items-center gap-2 text-sm text-gray-700">
          <i data-lucide="building-2" class="h-4 w-4 shrink-0 text-eu-blue"></i>
          <span class="font-semibold">${esc(publisherStr)}</span>
        </div>` : ''}
      ${publicLabel ? `
        <div class="mb-3 flex items-center gap-2 text-sm text-gray-500">
          <i data-lucide="briefcase" class="h-4 w-4 shrink-0 text-gray-400"></i>
          <span>${esc(publicLabel)}</span>
        </div>` : ''}
      ${contactHtml}
    </section>`;
}

function renderChallengeTechnicalSection(item) {
  const cl = item.classification || {};
  const competences = asArray(cl.competences).map(id => getCompetenceLabel(id)).filter(Boolean);
  const sdgs = asArray(cl.sdgs);
  const sensitivePolicy = pickLang(item.access?.sensitiveDataPolicy);
  if (!competences.length && !sdgs.length && !sensitivePolicy) return '';
  return `
    <section class="rounded-2xl bg-white border border-eu-border p-6">
      ${renderSecondaryHeader('settings-2', pickLang({ es: 'Competencias y ODS', en: 'Competences and SDGs', va: 'Competències i ODS' }))}
      ${competences.length ? `
        <div>
          <p class="mb-2 text-xs font-bold uppercase tracking-wide text-gray-500">${esc(uiText('competencies'))}</p>
          <div class="flex flex-wrap gap-2">${competences.map(c => renderBadge(c, 'bg-eu-blue/10 text-eu-blue border-eu-blue/20')).join('')}</div>
        </div>` : ''}
      ${sdgs.length ? `
        <div class="${competences.length ? 'mt-5' : ''}">
          <p class="mb-2 text-xs font-bold uppercase tracking-wide text-gray-500">${esc(uiText('sdgs'))}</p>
          <div class="flex flex-wrap gap-2">${sdgs.map(id => {
            const n = typeof id === 'object' ? id?.id : id;
            return n != null ? renderBadge(`ODS ${n}`, 'bg-green-50 text-green-800 border-green-200') : '';
          }).filter(Boolean).join('')}</div>
        </div>` : ''}
      ${sensitivePolicy ? `
        <div class="${(competences.length || sdgs.length) ? 'mt-5' : ''} flex items-start gap-2">
          <i data-lucide="shield-alert" class="mt-0.5 h-4 w-4 shrink-0 text-gray-400"></i>
          <p class="text-xs leading-5 text-gray-500">${esc(sensitivePolicy)}</p>
        </div>` : ''}
    </section>`;
}

function renderChallengeAccessSection(item) {
  const access = item.access || {};
  const PRIVACY_LABELS = {
    public:     { icon: 'globe',   label: { es: 'Acceso público',     en: 'Public access',     va: 'Accés públic' } },
    restricted: { icon: 'lock',    label: { es: 'Acceso restringido', en: 'Restricted access', va: 'Accés restringit' } },
    private:    { icon: 'eye-off', label: { es: 'Acceso privado',     en: 'Private access',    va: 'Accés privat' } },
  };
  const pv = access.pageVisibility || access.privacyLevel;
  const privacy = pv ? (PRIVACY_LABELS[pv] || { icon: 'info', label: { es: pv, en: pv, va: pv } }) : null;
  const privacyLabel = privacy ? pickLang(privacy.label) : '';
  const license = access.pageLicense || access.license;
  const rightsNote = pickLang(access.rightsNote);
  if (!privacyLabel && !license && !rightsNote) return '';
  return `
    <section class="rounded-2xl bg-white border border-eu-border p-6">
      ${renderSecondaryHeader('link', pickLang({ es: 'Acceso, licencia y datos', en: 'Access, licence and data', va: 'Accés, llicència i dades' }))}
      ${privacyLabel || license ? `
        <div class="flex items-center gap-3">
          ${privacy ? `<i data-lucide="${esc(privacy.icon)}" class="h-4 w-4 shrink-0 text-eu-blue"></i>` : ''}
          ${privacyLabel ? `<span class="text-sm font-semibold text-gray-700">${esc(privacyLabel)}</span>` : ''}
          ${license ? `<span class="ml-auto rounded-full bg-eu-bg px-2.5 py-0.5 text-xs font-bold text-gray-600" style="border:1px solid rgba(0,0,0,0.08)">${esc(license)}</span>` : ''}
        </div>` : ''}
      ${rightsNote ? `<p class="mt-3 text-xs leading-5 text-gray-500">${esc(rightsNote)}</p>` : ''}
    </section>`;
}

/* ─── Challenge v2 detail: sidebar panel ─── */

function renderChallengeOperationalPanel(item) {
  const ownership = item.ownership || {};
  const status = getStatusLabel(item.core?.status);
  const typeLabel = getTypeLabel(item.type);
  const sector = getSectorLabel(item.core?.sector);
  const maturity = getEvidenceLabel(item.core?.maturity || item.classification?.evidenceMaturity);
  const engagement = getEngagementLabel(item.classification?.engagementLevel);
  const created = pickLang(item.core?.publishedAtLabel);
  const updated = pickLang(item.core?.revisionDateLabel);
  const entityLabel = pickLang(ownership.requester?.publicLabel) || pickLang(item.core?.entity?.name);
  const metaRows = [
    sector && [uiText('sector'), sector],
    maturity && [pickLang({ es: 'Madurez', en: 'Maturity', va: 'Maduresa' }), maturity],
    engagement && [pickLang({ es: 'Participación', en: 'Participation', va: 'Participació' }), engagement],
    created && [pickLang(UI_TEXT.created), created],
    updated && [pickLang(UI_TEXT.updated), updated],
  ].filter(Boolean);
  return `
    <section class="rounded-2xl border border-eu-border bg-white p-5 shadow-sm">
      <div class="mb-4 flex flex-wrap items-center gap-2">
        ${status ? renderBadge(status, 'bg-eu-blue/10 text-eu-blue border-eu-blue/20') : ''}
        ${typeLabel ? renderBadge(typeLabel, 'bg-eu-bg text-gray-600 border-eu-border') : ''}
      </div>
      ${entityLabel ? `
        <div class="flex items-start gap-2">
          <i data-lucide="building-2" class="mt-0.5 h-4 w-4 shrink-0 text-eu-blue"></i>
          <p class="text-sm font-bold leading-snug text-eu-text">${esc(entityLabel)}</p>
        </div>` : ''}
      ${metaRows.length ? `
        <dl class="mt-4 space-y-2 border-t border-eu-border pt-4">
          ${metaRows.map(([label, value]) => `
            <div class="flex items-baseline justify-between gap-2">
              <dt class="shrink-0 text-xs font-bold uppercase tracking-wide text-gray-400">${esc(label)}</dt>
              <dd class="text-right text-xs font-semibold text-gray-700">${esc(value)}</dd>
            </div>`).join('')}
        </dl>` : ''}
    </section>`;
}

/* ─── Challenge v2 detail: orchestrator ─── */

function renderChallengeDetail(item) {
  const sections = item.presentation?.detail?.sections || {};

  const resourceRows = renderResourceRows(item.resources);
  const deliverables = renderDeliverableList(item.outputs);
  const milestones = renderMilestoneList(item.process);

  const mainHtml = [
    sections.brief !== false && renderChallengeBriefV2(item),
    sections.context !== false && renderChallengeContextSection(item),
    sections.participation !== false && renderChallengeParticipationSection(item),
    sections.resources !== false && resourceRows ? renderStructuredSection(getBlockLabel('resources'), 'folder-open', resourceRows) : '',
    sections.downloads !== false && item.downloads?.enabled && renderDownloadsSection(item),
    sections.outputs !== false && deliverables ? renderStructuredSection(getBlockLabel('outputs'), 'package-check', deliverables) : '',
    sections.process !== false && milestones ? renderStructuredSection(getBlockLabel('process'), 'route', milestones) : '',
    sections.people !== false && renderChallengeOwnershipSection(item),
    renderChallengeTechnicalSection(item),
    sections.access !== false && renderChallengeAccessSection(item),
    sections.trackA !== false && renderTrackABlock(item),
  ].filter(Boolean).join('');

  return `
    <div>
      ${renderChallengeDetailHeader(item)}
      <section class="mx-auto max-w-7xl px-6 py-8">
        <div class="grid gap-6 lg:grid-cols-3">
          <div class="space-y-5 lg:col-span-2">
            ${mainHtml || renderDetailEmpty()}
          </div>
          <aside class="space-y-5 self-start">
            ${renderChallengeOperationalPanel(item)}
            ${renderDetailChipPanel(item)}
          </aside>
        </div>
      </section>
    </div>`;
}

function renderCaseTransferSection(item) {
  const transfer = item.transfer || {};
  const origin = transfer.originOrganization || '';
  const beneficiaries = asArray(transfer.beneficiaryOrganizations).filter(b => b.name);
  const transferType = transfer.type || '';
  const transferTypeLabel = getTransferTypeLabel(transferType);
  const transferTypeIcon = TRANSFER_TYPE_ICONS[transferType] || 'arrow-right';
  const vs = item.classification?.verificationStatus || '';
  const verificationLabel = getVerificationLabel(vs);
  if (!origin && !beneficiaries.length && !transferTypeLabel) return '';
  return `
    <section class="rounded-2xl bg-eu-orange/5 border border-eu-orange/20 p-6">
      ${renderSectionHeader('repeat-2', uiText('transferFlow'), true)}
      ${transferTypeLabel ? `
        <div class="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1.5 text-sm font-bold text-orange-700">
          <i data-lucide="${esc(transferTypeIcon)}" class="h-4 w-4"></i>
          ${esc(transferTypeLabel)}
        </div>` : ''}
      ${origin ? `
        <div class="flex items-start gap-2 text-sm text-gray-700">
          <i data-lucide="building-2" class="mt-0.5 h-4 w-4 shrink-0 text-eu-orange"></i>
          <span class="font-semibold">${esc(origin)}</span>
        </div>` : ''}
      ${beneficiaries.length ? `
        <div class="mt-3 space-y-2">
          <p class="text-xs font-bold text-gray-500">${esc(pickLang({ es: 'Entidades beneficiarias', en: 'Beneficiary organisations', va: 'Entitats beneficiàries' }))}</p>
          ${beneficiaries.map(b => `
            <div class="flex items-center gap-2 text-sm text-gray-700">
              <i data-lucide="arrow-right" class="h-3.5 w-3.5 shrink-0 text-eu-orange"></i>
              <span>${esc(b.name)}</span>
              ${b.type ? `<span class="text-xs text-gray-400">(${esc(b.type)})</span>` : ''}
            </div>`).join('')}
        </div>` : ''}
      ${vs ? `
        <div class="mt-4 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold ${vs === 'verified' ? 'border-green-200 bg-green-50 text-green-700' : 'border-gray-200 bg-gray-50 text-gray-600'}">
          <i data-lucide="${vs === 'verified' ? 'shield-check' : 'shield'}" class="h-3.5 w-3.5"></i>
          ${esc(verificationLabel)}
        </div>` : ''}
    </section>`;
}

function renderCaseDownloadsBlock(item) {
  const downloads = item.downloads || {};
  if (!downloads.enabled || !Array.isArray(downloads.items) || downloads.items.length === 0) return '';
  const visibleItems = downloads.items.filter(d => d.showOnDetail !== false);
  if (!visibleItems.length) return '';

  const basePath = downloads.basePath || '';
  const html = `
    <div class="mt-4 space-y-4">
      ${visibleItems.map(d => {
        const title = pickLang(d.title);
        const desc = pickLang(d.description);
        const typeLabel = getDownloadTypeLabel(d.type);
        const dlFiles = asArray(d.files);
        const filesHtml = dlFiles.map(f => {
          if (!f.file) return '';
          const url = f.url || (basePath ? `${basePath.replace(/\/$/, '')}/${f.file}` : f.file);
            const badge = [f.format?.toUpperCase(), f.language?.toUpperCase()].filter(Boolean).join(' / ') || pickLang({ es: 'Descargar', en: 'Download', va: 'Descarregar' });
          return `<a href="${esc(url)}" download class="inline-flex items-center gap-1.5 rounded border border-eu-border bg-white px-2.5 py-1 text-xs font-semibold text-gray-700 hover:bg-eu-blue hover:text-white hover:border-eu-blue transition-colors focus:outline-none focus:ring-2 focus:ring-eu-blue"><i data-lucide="download" class="h-3.5 w-3.5"></i>${esc(badge)}</a>`;
        }).filter(Boolean).join('');

        return `
          <div class="rounded-xl border border-eu-border bg-eu-bg p-4">
            <div class="flex items-start justify-between gap-2">
              <p class="text-sm font-bold text-eu-text">${esc(title)}</p>
              ${typeLabel ? renderBadge(typeLabel, 'bg-eu-blue/10 text-eu-blue border-eu-blue/20') : ''}
            </div>
            ${desc ? `<p class="mt-1 text-xs leading-5 text-gray-500">${esc(desc)}</p>` : ''}
            ${filesHtml ? `<div class="mt-3 flex flex-wrap gap-2">${filesHtml}</div>` : ''}
            ${d.license ? `<p class="mt-2 text-xs text-gray-400">${esc(d.license)}</p>` : ''}
          </div>`;
      }).join('')}
    </div>`;
  
  return renderStructuredSection(
    { es: 'Materiales descargables', en: 'Downloadable materials', va: 'Materials descarregables' },
    'file-down',
    html
  );
}

function renderCaseResourcesBlock(item) {
  const r = item.resources || {};
  const links = asArray(r.externalLinks).filter(link => link.url);
  if (!links.length) return '';
  const html = `
    <div class="mt-4 space-y-3">
      ${links.map(link => `
        <div class="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-eu-border bg-eu-bg p-4 text-sm">
          <div class="flex items-center gap-2 min-w-0">
            <i data-lucide="link-2" class="h-4 w-4 text-gray-450 shrink-0"></i>
            <span class="font-bold text-eu-text truncate max-w-[250px]">${esc(pickLang(link.label))}</span>
            ${link.license ? renderBadge(link.license, 'bg-eu-blue/10 text-eu-blue border-eu-blue/20') : ''}
          </div>
          <a href="${esc(link.url)}" target="_blank" rel="noopener noreferrer" class="inline-flex shrink-0 items-center gap-1 text-xs font-bold text-eu-blue hover:text-eu-purple transition-colors focus:outline-none">
            <span>${esc(pickLang({ es: 'Visitar', en: 'Visit', va: 'Visitar' }))}</span>
            <i data-lucide="external-link" class="h-3.5 w-3.5"></i>
          </a>
        </div>`).join('')}
    </div>`;

  return renderStructuredSection(
    { es: 'Recursos y documentación', en: 'Resources and documentation', va: 'Recursos i documentació' },
    'folder-open',
    html
  );
}

function renderCasePeopleBlock(item) {
  const ownership = item.ownership || {};
  const publisherName = pickLang(ownership.publisher?.name) || '';
  const originName = pickLang(ownership.origin?.name) || '';
  
  // Lead Team
  let leadHtml = '';
  if (ownership.leadTeam) {
    leadHtml = `
      <div class="rounded-xl border border-eu-border bg-eu-bg p-4 mb-4">
        <span class="text-xs font-bold text-gray-400 block mb-1">${esc(pickLang({ es: 'Equipo líder de desarrollo', en: 'Lead development team', va: 'Equip líder de desenvolupament' }))}</span>
        <p class="text-sm font-bold text-eu-text leading-snug">${esc(ownership.leadTeam.name)}</p>
        ${ownership.leadTeam.role ? `<p class="mt-1 text-xs leading-5 text-gray-500">${esc(pickLang(ownership.leadTeam.role))}</p>` : ''}
      </div>`;
  }

  // Origin
  let origHtml = '';
  if (originName) {
    origHtml = `
      <div class="rounded-xl border border-eu-border bg-eu-bg p-4 mb-4">
        <span class="text-xs font-bold text-gray-400 block mb-1">${esc(pickLang({ es: 'Entidad de origen', en: 'Originating organisation', va: 'Entitat d\'origen' }))}</span>
        <p class="text-sm font-bold text-eu-text leading-snug">${esc(originName)}</p>
      </div>`;
  }

  // Beneficiaries
  let benHtml = '';
  const bens = asArray(ownership.beneficiaries).filter(b => b.name);
  if (bens.length) {
    benHtml = `
      <div class="rounded-xl border border-eu-border bg-eu-bg p-4">
        <span class="text-xs font-bold text-gray-400 block mb-2">${esc(pickLang({ es: 'Entidades beneficiarias y colaboradoras', en: 'Beneficiary & collaborating entities', va: 'Entitats beneficiàries i col·laboradores' }))}</span>
        <div class="space-y-3">
          ${bens.map(b => `
            <div class="flex items-start gap-2 border-b border-eu-border pb-2 last:border-b-0 last:pb-0">
              <i data-lucide="arrow-right" class="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-400"></i>
              <div>
                <p class="text-xs font-bold text-eu-text leading-snug">${esc(pickLang(b.name))}</p>
                ${b.role ? `<p class="mt-0.5 text-[11px] leading-4 text-gray-500">${esc(pickLang(b.role))}</p>` : ''}
              </div>
            </div>`).join('')}
        </div>
      </div>`;
  }

  const peopleHtml = `
    <div class="mt-4 min-w-0">
      ${leadHtml}
      ${origHtml}
      ${benHtml}
    </div>`;

  return renderStructuredSection(
    { es: 'Personas y entidades asociadas', en: 'Associated entities and team', va: 'Persones i entitats associades' },
    'user-round-check',
    peopleHtml
  );
}

function renderCaseTrackABlock(item) {
  if (!item.trackA?.enabled) return '';
  return renderStructuredSection(
    { es: 'Entregable académico relacionado', en: 'Related academic deliverable', va: 'Lliurable acadèmic relacionat' },
    'graduation-cap',
    `<p class="text-sm leading-6 text-gray-700">${esc(pickLang(item.trackA.label))}</p>
     ${item.trackA.url ? `<a href="${esc(item.trackA.url)}" target="_blank" rel="noopener noreferrer" class="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-eu-blue hover:text-eu-purple transition-colors"><span>Ver entregable</span><i data-lucide="external-link" class="h-3.5 w-3.5"></i></a>` : ''}`
  );
}

function renderCaseRelationsBlock(item) {
  const rels = item.relations || {};
  let relRows = [];
  if (rels.originChallengeId) {
    relRows.push(`
      <li class="flex gap-2 text-sm leading-6 text-gray-700">
        <i data-lucide="lightbulb" class="mt-1 h-4 w-4 shrink-0 text-eu-blue"></i>
        <span><strong>${esc(pickLang({ es: 'Reto de origen: ', en: 'Origin challenge: ', va: 'Repte d\'origen: ' }))}</strong>${esc(rels.originChallengeId)}</span>
      </li>`);
  }
  const relatedPilots = asArray(rels.relatedPilots);
  if (relatedPilots.length) {
    relRows.push(`
      <li class="flex gap-2 text-sm leading-6 text-gray-700">
        <i data-lucide="flask-conical" class="mt-1 h-4 w-4 shrink-0 text-eu-blue"></i>
        <span><strong>${esc(pickLang({ es: 'Pilotos relacionados: ', en: 'Related pilots: ', va: 'Pilots relacionats: ' }))}</strong>${esc(relatedPilots.join(', '))}</span>
      </li>`);
  }
  const relatedCases = asArray(rels.relatedCases);
  if (relatedCases.length) {
    relRows.push(`
      <li class="flex gap-2 text-sm leading-6 text-gray-700">
        <i data-lucide="trophy" class="mt-1 h-4 w-4 shrink-0 text-eu-blue"></i>
        <span><strong>${esc(pickLang({ es: 'Casos relacionados: ', en: 'Related cases: ', va: 'Casos relacionats: ' }))}</strong>${esc(relatedCases.join(', '))}</span>
      </li>`);
  }
  if (!relRows.length) return '';
  return renderStructuredSection(
    { es: 'Relaciones de red', en: 'Network relations', va: 'Relacions de xarxa' },
    'network',
    `<ul class="space-y-2 mt-2">${relRows.join('')}</ul>`
  );
}

function renderCaseDetail(item) {
  const core = item.core || {};
  const cl = item.classification || {};
  const cs = item.caseStudy || {};
  const evidence = item.evidence || {};
  const downloads = item.downloads || {};
  const presentation = item.presentation || {};
  const sections = presentation.detail?.sections || {};

  // 1. Resumen / Ficha de caso
  const summarySection = (sections.summary !== false) ? renderStructuredSection(
    { es: 'Resumen del caso', en: 'Case summary', va: 'Resum del cas' },
    'info',
    `<p class="text-base leading-8 text-gray-700 font-medium">${esc(pickLang(core.summary))}</p>`
  ) : '';

  // 2. Contexto de origen
  const originContextHtml = (sections.originContext !== false && cs.originContext) ? `
    <div class="mt-2">
      <p class="text-sm leading-7 text-gray-700">${esc(pickLang(cs.originContext))}</p>
    </div>` : '';
  const originSection = originContextHtml ? renderStructuredSection(
    { es: 'Contexto de origen', en: 'Original context', va: 'Context d\'origen' },
    'history',
    originContextHtml
  ) : '';

  // 3. Necesidad y transferencia
  const transferContextHtml = (sections.transferContext !== false && cs.transferContext) ? `
    <div class="mt-2">
      <p class="text-sm leading-7 text-gray-700">${esc(pickLang(cs.transferContext))}</p>
    </div>` : '';
  const transferSection = transferContextHtml ? renderStructuredSection(
    { es: 'Necesidad y transferencia', en: 'Need and transfer context', va: 'Necessitat i transferència' },
    'help-circle',
    transferContextHtml
  ) : '';

  // 4. Intervención realizada
  const interventionHtml = (sections.intervention !== false && cs.intervention) ? `
    <div class="mt-2">
      <p class="text-sm leading-7 text-gray-700">${esc(pickLang(cs.intervention))}</p>
    </div>` : '';
  const interventionSection = interventionHtml ? renderStructuredSection(
    { es: 'Intervención realizada', en: 'Intervention performed', va: 'Intervenció realitzada' },
    'cpu',
    interventionHtml
  ) : '';

  // 5. Camino de transferencia
  const transferPathHtml = (sections.transferPath !== false && cs.transferPath) ? `
    <div class="mt-2">
      <p class="text-sm leading-7 text-gray-700">${esc(pickLang(cs.transferPath))}</p>
    </div>` : '';
  const transferPathSection = transferPathHtml ? renderStructuredSection(
    { es: 'Camino de transferencia', en: 'Transfer path', va: 'Camí de transferència' },
    'route',
    transferPathHtml
  ) : '';

  // 6. Evidencias y resultados (Métricas primarias y secundarias, población, etc.)
  let evidenceHtml = '';
  if (sections.evidence !== false && (evidence.headline || evidence.primaryMetric || evidence.secondaryMetrics)) {
    const headlineHtml = evidence.headline ? `<h4 class="text-base font-bold text-eu-text leading-snug mb-4">${esc(pickLang(evidence.headline))}</h4>` : '';
    
    let primaryHtml = '';
    if (evidence.primaryMetric) {
      primaryHtml = `
        <div class="rounded-xl border border-eu-border bg-eu-bg p-5 mb-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <span class="text-xs font-bold text-gray-400">${esc(pickLang({ es: 'Métrica de impacto principal', en: 'Primary impact metric', va: 'Mètrica d\'impacte principal' }))}</span>
            <p class="mt-1 text-sm font-bold text-eu-text leading-relaxed">${esc(pickLang(evidence.primaryMetric.label))}</p>
          </div>
          <div class="shrink-0 rounded-lg bg-eu-orange/10 border border-eu-orange/20 px-4 py-3 text-center min-w-[100px]">
            <span class="text-xl font-bold text-eu-orange">${esc(evidence.primaryMetric.value)}${esc(evidence.primaryMetric.unit || '')}</span>
          </div>
        </div>`;
    }

    let secondaryHtml = '';
    const secs = asArray(evidence.secondaryMetrics).filter(m => m.value != null);
    if (secs.length) {
      secondaryHtml = `
        <div class="mt-4 space-y-3">
          <p class="text-xs font-bold text-gray-400 mb-2">${esc(pickLang({ es: 'Métricas secundarias', en: 'Secondary metrics', va: 'Mètriques secundàries' }))}</p>
          <div class="grid gap-3 md:grid-cols-2">
            ${secs.map(m => {
              let valStr = String(m.value);
              const unit = m.unit || '';
              if (unit && !['images', 'teachers', 'narratives', 'cases'].includes(unit.toLowerCase())) {
                valStr += unit.startsWith('%') ? unit : ` ${unit}`;
              }
              return `
                <div class="rounded-xl border border-eu-border bg-white p-4">
                  <span class="text-xs font-bold text-gray-400 block mb-0.5">${esc(pickLang(m.label))}</span>
                  <p class="text-base font-extrabold text-eu-text">${esc(valStr)}</p>
                </div>`;
            }).join('')}
          </div>
        </div>`;
    }

    const popHtml = evidence.population ? `
      <div class="mt-4 flex items-start gap-2.5 rounded-xl border border-eu-border bg-eu-bg p-4 text-xs text-gray-700">
        <i data-lucide="users" class="h-4 w-4 shrink-0 text-gray-400"></i>
        <span><strong>${esc(pickLang({ es: 'Población afectada: ', en: 'Affected population: ', va: 'Població afectada: ' }))}</strong>${esc(pickLang(evidence.population))}</span>
      </div>` : '';

    let verificationHtml = '';
    if (evidence.verification) {
      const v = evidence.verification;
      const verifiedLabel = getVerificationLabel(v.status);
      verificationHtml = `
        <div class="mt-5 border-t border-eu-border pt-4 space-y-2">
          <div class="flex items-center gap-2">
            <span class="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-bold ${v.status === 'verified' ? 'border-green-200 bg-green-50 text-green-700' : 'border-eu-border bg-eu-bg text-gray-655'}">
              <i data-lucide="${v.status === 'verified' ? 'shield-check' : 'shield'}" class="h-3.5 w-3.5"></i>
              ${esc(verifiedLabel)}
            </span>
            ${v.verifiedBy ? `<span class="text-xs text-gray-500 font-bold">${esc(v.verifiedBy)} (${v.verifiedAt || ''})</span>` : ''}
          </div>
          ${v.method ? `<p class="text-xs leading-5 text-gray-500">${esc(pickLang(v.method))}</p>` : ''}
        </div>`;
    }

    const limitHtml = evidence.limitations ? `
      <div class="mt-4 border-t border-eu-border pt-4">
        <span class="text-xs font-bold text-amber-600 block">${esc(pickLang({ es: 'Límites y confidencialidad', en: 'Limitations and confidentiality', va: 'Límits i confidencialitat' }))}</span>
        <p class="mt-1 text-xs leading-5 text-amber-700">${esc(pickLang(evidence.limitations))}</p>
      </div>` : '';

    evidenceHtml = `
      <div class="mt-2 min-w-0">
        ${headlineHtml}
        ${primaryHtml}
        ${secondaryHtml}
        ${popHtml}
        ${verificationHtml}
        ${limitHtml}
      </div>`;
  }
  const evidenceSection = evidenceHtml ? renderStructuredSection(
    { es: 'Evidencias y resultados', en: 'Evidence and results', va: 'Evidències i resultats' },
    'trophy',
    evidenceHtml
  ) : '';

  // 7. Transferibilidad
  let transferabilityHtml = '';
  const tf = item.transferability;
  if (sections.transferability !== false && tf) {
    const whyHtml = tf.whyTransferable ? `<p class="text-sm leading-7 text-gray-700 mb-4">${esc(pickLang(tf.whyTransferable))}</p>` : '';
    
    let suitableHtml = '';
    const suitables = asArray(tf.suitableFor);
    if (suitables.length) {
      suitableHtml = `
        <div class="mb-4">
          <span class="text-xs font-bold text-gray-400 block mb-1.5">${esc(pickLang({ es: 'Adecuado para', en: 'Suitable for', va: 'Adequat per a' }))}</span>
          <div class="flex flex-wrap gap-2">
            ${suitables.map(s => renderBadge(pickLang(s), 'bg-eu-bg text-gray-700 border-eu-border')).join('')}
          </div>
        </div>`;
    }

    let reqsHtml = '';
    const reqs = asArray(tf.requirements);
    if (reqs.length) {
      reqsHtml = `
        <div class="mb-4 border-t border-eu-border pt-3">
          <span class="text-xs font-bold text-gray-400 block mb-2">${esc(pickLang({ es: 'Requisitos previos', en: 'Prerequisites', va: 'Requisits previs' }))}</span>
          <ul class="space-y-1.5">
            ${reqs.map(r => `
              <li class="flex items-start gap-2 text-xs text-gray-650 leading-5">
                <i data-lucide="check" class="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500"></i>
                <span>${esc(pickLang(r.label || r))}</span>
              </li>`).join('')}
          </ul>
        </div>`;
    }

    let stepsHtml = '';
    const steps = asArray(tf.adaptationSteps);
    if (steps.length) {
      stepsHtml = `
        <div class="mb-4 border-t border-eu-border pt-3">
          <span class="text-xs font-bold text-gray-400 block mb-2">${esc(pickLang({ es: 'Pasos para la adaptación', en: 'Adaptation steps', va: 'Pasos per a l\'adaptació' }))}</span>
          <ol class="space-y-2">
            ${steps.map((s, idx) => `
              <li class="flex items-start gap-2 text-xs text-gray-650 leading-5">
                <span class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-eu-orange/10 text-[10px] font-bold text-eu-orange border border-eu-orange/20">${idx + 1}</span>
                <span class="mt-0.5">${esc(pickLang(s.label || s))}</span>
              </li>`).join('')}
          </ol>
        </div>`;
    }

    let risksHtml = '';
    const risks = asArray(tf.risks);
    if (risks.length) {
      risksHtml = `
        <div class="border-t border-eu-border pt-3">
          <span class="text-xs font-bold text-amber-600 block mb-2">${esc(pickLang({ es: 'Riesgos y mitigaciones', en: 'Risks and mitigations', va: 'Riscs i mitigacions' }))}</span>
          <ul class="space-y-1.5">
            ${risks.map(r => `
              <li class="flex items-start gap-2 text-xs text-amber-700 leading-5">
                <i data-lucide="alert-triangle" class="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500"></i>
                <span>${esc(pickLang(r.label || r))}</span>
              </li>`).join('')}
          </ul>
        </div>`;
    }

    transferabilityHtml = `
      <div class="mt-2 min-w-0">
        ${whyHtml}
        ${suitableHtml}
        ${reqsHtml}
        ${stepsHtml}
        ${risksHtml}
      </div>`;
  }
  const transferabilitySection = transferabilityHtml ? renderStructuredSection(
    { es: 'Transferibilidad y guía de uso', en: 'Transferability and guide', va: 'Transferibilitat i guia d\'ús' },
    'git-fork',
    transferabilityHtml
  ) : '';

  // 8. Descargables
  const downloadsSection = (sections.downloads !== false) ? renderCaseDownloadsBlock(item) : '';

  // 9. Recursos externos
  const resourcesSection = (sections.resources !== false) ? renderCaseResourcesBlock(item) : '';

  // 10. Personas y actores
  const peopleSection = (sections.people !== false) ? renderCasePeopleBlock(item) : '';

  // 11. Entregables académicos (Track A)
  const trackASection = (sections.trackA !== false) ? renderCaseTrackABlock(item) : '';

  // 12. Relaciones
  const relationsSection = (sections.relations !== false) ? renderCaseRelationsBlock(item) : '';

  const mainHtml = [
    summarySection,
    originSection,
    transferSection,
    interventionSection,
    transferPathSection,
    evidenceSection,
    transferabilitySection,
    downloadsSection,
    resourcesSection,
    peopleSection,
    trackASection,
    relationsSection,
  ].filter(Boolean).join('');

  return renderDetailLayout(item, mainHtml, renderDetailChipPanel(item));
}

/* ─── Validation v2 detail ─── */

function renderValidationDetail(item) {
  const core = item.core || {};
  const pres = item.presentation?.detail?.sections || {};
  const validation = item.validation || {};
  const criteria = item.criteria || {};
  const evidence = item.evidence || {};
  const decision = item.decision || {};
  const trackRouting = item.trackRouting || {};
  const ownership = item.ownership || {};
  const downloads = item.downloads || {};
  const resources = item.resources || {};
  const relations = item.relations || {};

  // ── S1: Objeto de validación ──────────────────────────────────────────────
  const objectTitle = pickLang(validation.objectTitle);
  const objectType = validation.objectType || '';
  const objectTypeLabel = getLabelFromArray(MARKETPLACE_CONFIG.objectTypeLabels, objectType, objectType);
  const validationQ = pickLang(validation.validationQuestion);
  let objectHtml = '';
  if (pres.object !== false && (objectTitle || validationQ)) {
    objectHtml = `
      <div class="mt-2 space-y-4">
        ${objectTypeLabel ? `<p class="text-xs font-bold uppercase tracking-wide text-eu-blue">${esc(objectTypeLabel)}</p>` : ''}
        ${objectTitle ? `<p class="text-base font-bold leading-snug text-eu-text">${esc(objectTitle)}</p>` : ''}
        ${validationQ ? `
          <div class="rounded-lg border-l-4 border-eu-blue bg-eu-bg px-4 py-3">
            <p class="text-xs font-bold uppercase tracking-wide text-gray-400">${esc(pickLang({ es: 'Pregunta de validación', en: 'Validation question', va: 'Pregunta de validació' }))}</p>
            <p class="mt-1 text-sm leading-6 text-gray-700">${esc(validationQ)}</p>
          </div>` : ''}
      </div>`;
  }
  const objectSection = renderStructuredSection({ es: 'Objeto de validación', en: 'Validation object', va: 'Objecte de validació' }, 'clipboard-check', objectHtml);

  // ── S2: Necesidad y contexto ──────────────────────────────────────────────
  const need = pickLang(validation.need);
  const context = pickLang(validation.context);
  let needContextHtml = '';
  if ((pres.need !== false || pres.context !== false) && (need || context)) {
    needContextHtml = `
      <div class="mt-2 space-y-4">
        ${need && pres.need !== false ? `
          <div>
            <p class="text-xs font-bold uppercase tracking-wide text-gray-400">${esc(pickLang({ es: 'Necesidad identificada', en: 'Identified need', va: 'Necessitat identificada' }))}</p>
            <p class="mt-1 text-sm leading-7 text-gray-700">${esc(need)}</p>
          </div>` : ''}
        ${context && pres.context !== false ? `
          <div class="border-t border-eu-border pt-4">
            <p class="text-xs font-bold uppercase tracking-wide text-gray-400">${esc(pickLang({ es: 'Contexto', en: 'Context', va: 'Context' }))}</p>
            <p class="mt-1 text-sm leading-7 text-gray-700">${esc(context)}</p>
          </div>` : ''}
      </div>`;
  }
  const needContextSection = renderStructuredSection({ es: 'Necesidad y contexto', en: 'Need and context', va: 'Necessitat i context' }, 'help-circle', needContextHtml);

  // ── S3: Método de validación ──────────────────────────────────────────────
  const method = pickLang(validation.method);
  const envItems = asArray(validation.validationEnvironment).map(e => pickLang(e.label)).filter(Boolean);
  let methodHtml = '';
  if (pres.method !== false && (method || envItems.length)) {
    methodHtml = `
      <div class="mt-2 space-y-4">
        ${method ? `<p class="text-sm leading-7 text-gray-700">${esc(method)}</p>` : ''}
        ${envItems.length ? `
          <div class="border-t border-eu-border pt-4">
            <p class="mb-2 text-xs font-bold uppercase tracking-wide text-gray-400">${esc(pickLang({ es: 'Entorno de validación', en: 'Validation environment', va: 'Entorn de validació' }))}</p>
            <div class="flex flex-wrap gap-2">${envItems.map(l => renderBadge(l, 'bg-slate-50 text-slate-700 border-slate-200')).join('')}</div>
          </div>` : ''}
      </div>`;
  }
  const methodSection = renderStructuredSection({ es: 'Método de validación', en: 'Validation method', va: 'Mètode de validació' }, 'search', methodHtml);

  // ── S4: Criterios de validación ───────────────────────────────────────────
  const CRITERIA_TONES = {
    positive:   { badge: 'bg-green-50 text-green-800 border-green-200', icon: 'check-circle-2', iconColor: 'text-green-600' },
    medium:     { badge: 'bg-amber-50 text-amber-800 border-amber-200', icon: 'minus-circle', iconColor: 'text-amber-500' },
    manageable: { badge: 'bg-blue-50 text-blue-800 border-blue-200', icon: 'info', iconColor: 'text-blue-500' },
    negative:   { badge: 'bg-red-50 text-red-700 border-red-200', icon: 'x-circle', iconColor: 'text-red-500' },
  };
  const CRITERIA_RESULT_LABELS = {
    positive:   { es: 'Positivo', en: 'Positive', va: 'Positiu' },
    medium:     { es: 'Medio', en: 'Medium', va: 'Mitjà' },
    manageable: { es: 'Manejable', en: 'Manageable', va: 'Manejable' },
    negative:   { es: 'Negativo', en: 'Negative', va: 'Negatiu' },
  };
  const criteriaItems = asArray(criteria.items);
  let criteriaHtml = '';
  if (pres.criteria !== false && criteriaItems.length) {
    criteriaHtml = `
      <div class="mt-2 space-y-3">
        ${criteriaItems.map(c => {
          const tone = CRITERIA_TONES[c.result] || CRITERIA_TONES.medium;
          const resultLabel = pickLang(CRITERIA_RESULT_LABELS[c.result]) || c.result || '';
          const label = pickLang(c.label);
          const note = pickLang(c.note);
          return `
            <div class="rounded-xl border border-eu-border bg-eu-bg p-4">
              <div class="flex items-center justify-between gap-3">
                <p class="text-sm font-bold text-eu-text">${esc(label)}</p>
                <span class="inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-bold ${tone.badge}">
                  <i data-lucide="${tone.icon}" class="h-3 w-3 ${tone.iconColor}"></i>
                  ${esc(resultLabel)}
                </span>
              </div>
              ${note ? `<p class="mt-2 text-xs leading-5 text-gray-600">${esc(note)}</p>` : ''}
            </div>`;
        }).join('')}
      </div>`;
  }
  const criteriaSection = renderStructuredSection({ es: 'Criterios de validación', en: 'Validation criteria', va: 'Criteris de validació' }, 'list-checks', criteriaHtml);

  // ── S5: Evidencia utilizada ───────────────────────────────────────────────
  const collectionMethod = pickLang(evidence.collectionMethod);
  const indicators = asArray(evidence.indicators);
  const limitations = pickLang(evidence.limitations);
  let evidenceHtml = '';
  if (pres.evidence !== false && (collectionMethod || indicators.length || limitations)) {
    evidenceHtml = `
      <div class="mt-2 space-y-4">
        ${collectionMethod ? `<p class="text-sm leading-7 text-gray-700">${esc(collectionMethod)}</p>` : ''}
        ${indicators.length ? `
          <div class="border-t border-eu-border pt-4">
            <p class="mb-2 text-xs font-bold uppercase tracking-wide text-gray-400">${esc(pickLang({ es: 'Indicadores', en: 'Indicators', va: 'Indicadors' }))}</p>
            <div class="space-y-2">
              ${indicators.map(ind => {
                const indLabel = pickLang(ind.label);
                const metric = pickLang(ind.metric);
                return `
                  <div class="flex items-baseline justify-between gap-3 rounded-lg border border-eu-border bg-white px-3 py-2">
                    <span class="text-xs font-bold text-eu-text">${esc(indLabel)}</span>
                    ${metric ? `<span class="text-right text-xs text-gray-500">${esc(metric)}</span>` : ''}
                  </div>`;
              }).join('')}
            </div>
          </div>` : ''}
        ${limitations ? `
          <div class="border-t border-eu-border pt-4">
            <p class="text-xs font-bold uppercase tracking-wide text-amber-600">${esc(pickLang({ es: 'Límites y confidencialidad', en: 'Limitations and confidentiality', va: 'Límits i confidencialitat' }))}</p>
            <p class="mt-1 text-xs leading-5 text-amber-700">${esc(limitations)}</p>
          </div>` : ''}
      </div>`;
  }
  const evidenceSection = renderStructuredSection({ es: 'Evidencia utilizada', en: 'Evidence used', va: 'Evidència utilitzada' }, 'bar-chart-3', evidenceHtml);

  // ── S6: Decisión y justificación ──────────────────────────────────────────
  const decisionLabel = pickLang(decision.label);
  const decisionRationale = pickLang(decision.rationale);
  const decisionOutcomeLabel = pickLang(item.decisionOutcomeLabel);
  const nextStepLabel = pickLang(decision.nextStep?.label);
  let decisionHtml = '';
  if (pres.decision !== false && (decisionLabel || decisionRationale)) {
    const outcomeTone = (decision.outcome || '').includes('track-a') || (decision.outcome || '').includes('track-b') || (decision.outcome || '').includes('validated')
      ? 'bg-green-50 text-green-800 border-green-200'
      : (decision.outcome || '').includes('rejected') ? 'bg-red-50 text-red-700 border-red-200'
      : 'bg-eu-bg text-gray-700 border-eu-border';
    decisionHtml = `
      <div class="mt-2 space-y-4">
        ${decisionOutcomeLabel ? `<span class="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-bold ${outcomeTone}"><i data-lucide="check-circle-2" class="h-4 w-4"></i>${esc(decisionOutcomeLabel)}</span>` : ''}
        ${decisionLabel ? `<p class="text-base font-bold text-eu-text">${esc(decisionLabel)}</p>` : ''}
        ${decisionRationale ? `<p class="text-sm leading-7 text-gray-700">${esc(decisionRationale)}</p>` : ''}
        ${nextStepLabel ? `
          <div class="flex items-start gap-2 rounded-lg border border-eu-blue/20 bg-eu-blue/5 px-4 py-3">
            <i data-lucide="arrow-right-circle" class="mt-0.5 h-4 w-4 shrink-0 text-eu-blue"></i>
            <div>
              <p class="text-xs font-bold uppercase tracking-wide text-eu-blue">${esc(pickLang({ es: 'Próximo paso', en: 'Next step', va: 'Pròxim pas' }))}</p>
              <p class="mt-0.5 text-sm text-gray-700">${esc(nextStepLabel)}</p>
            </div>
          </div>` : ''}
      </div>`;
  }
  const decisionSection = renderStructuredSection({ es: 'Decisión y justificación', en: 'Decision and rationale', va: 'Decisió i justificació' }, 'gavel', decisionHtml);

  // ── S7: Descargables ──────────────────────────────────────────────────────
  const downloadsSection = pres.downloads !== false ? renderCaseDownloadsBlock(item) : '';

  // ── S8: Recursos externos ─────────────────────────────────────────────────
  const resourcesSection = pres.resources !== false ? renderCaseResourcesBlock(item) : '';

  // ── S9: Personas y entidades ──────────────────────────────────────────────
  const proposer = ownership.proposer;
  const validators = asArray(ownership.validators);
  let peopleHtml = '';
  if (pres.people !== false && (proposer?.name || validators.length)) {
    const proposerHtml = proposer?.name ? `
      <div class="rounded-xl border border-eu-border bg-eu-bg p-4 mb-4">
        <span class="text-xs font-bold text-gray-400 block mb-1">${esc(pickLang({ es: 'Proponente del reto', en: 'Challenge proposer', va: 'Proponent del repte' }))}</span>
        <p class="text-sm font-bold text-eu-text">${esc(pickLang(proposer.name) || proposer.name)}</p>
        ${proposer.role ? `<p class="mt-0.5 text-xs leading-5 text-gray-500">${esc(pickLang(proposer.role))}</p>` : ''}
      </div>` : '';
    const validatorsHtml = validators.length ? `
      <div class="rounded-xl border border-eu-border bg-eu-bg p-4">
        <span class="text-xs font-bold text-gray-400 block mb-2">${esc(pickLang({ es: 'Entidades validadoras', en: 'Validating entities', va: 'Entitats validadores' }))}</span>
        <div class="space-y-3">
          ${validators.map(v => `
            <div class="flex items-start gap-2 border-b border-eu-border pb-2 last:border-b-0 last:pb-0">
              <i data-lucide="shield-check" class="mt-0.5 h-3.5 w-3.5 shrink-0 text-eu-blue"></i>
              <div>
                <p class="text-xs font-bold text-eu-text">${esc(v.name || '')}</p>
                ${v.role ? `<p class="mt-0.5 text-[11px] leading-4 text-gray-500">${esc(pickLang(v.role))}</p>` : ''}
              </div>
            </div>`).join('')}
        </div>
      </div>` : '';
    peopleHtml = `<div class="mt-2 min-w-0">${proposerHtml}${validatorsHtml}</div>`;
  }
  const peopleSection = renderStructuredSection({ es: 'Personas y entidades', en: 'Entities involved', va: 'Persones i entitats' }, 'user-round-check', peopleHtml);

  // ── S10: Derivación Track A / Track B ─────────────────────────────────────
  const routeLabel = pickLang(trackRouting.label);
  const academicReview = trackRouting.academicReview;
  let trackHtml = '';
  if (pres.trackRouting !== false && (routeLabel || trackRouting.route)) {
    const routeBadgeTone = trackRouting.route === 'track-a'
      ? 'bg-purple-50 text-purple-800 border-purple-200'
      : trackRouting.route === 'track-b'
        ? 'bg-blue-50 text-blue-800 border-blue-200'
        : 'bg-eu-bg text-gray-700 border-eu-border';
    const routeBadgeLabel = trackRouting.route === 'track-a' ? 'Track A' : trackRouting.route === 'track-b' ? 'Track B' : trackRouting.route;
    trackHtml = `
      <div class="mt-2 space-y-4">
        ${routeBadgeLabel ? renderBadge(routeBadgeLabel, routeBadgeTone) : ''}
        ${routeLabel ? `<p class="text-sm leading-7 text-gray-700">${esc(routeLabel)}</p>` : ''}
        ${academicReview?.enabled && academicReview?.reviewer?.name ? `
          <div class="flex items-start gap-2 rounded-lg border border-eu-border bg-eu-bg px-4 py-3">
            <i data-lucide="graduation-cap" class="mt-0.5 h-4 w-4 shrink-0 text-gray-400"></i>
            <div>
              <p class="text-xs font-bold text-gray-500">${esc(pickLang({ es: 'Revisión académica', en: 'Academic review', va: 'Revisió acadèmica' }))}</p>
              <p class="mt-0.5 text-sm font-bold text-eu-text">${esc(academicReview.reviewer.name)}</p>
              ${academicReview.note ? `<p class="mt-0.5 text-xs text-gray-500">${esc(pickLang(academicReview.note))}</p>` : ''}
            </div>
          </div>` : ''}
      </div>`;
  }
  const trackSection = renderStructuredSection({ es: 'Derivación Track A / Track B', en: 'Track A / Track B routing', va: 'Derivació Track A / Track B' }, 'git-branch', trackHtml);

  const mainHtml = [
    objectSection,
    needContextSection,
    methodSection,
    criteriaSection,
    evidenceSection,
    decisionSection,
    downloadsSection,
    resourcesSection,
    peopleSection,
    trackSection,
  ].filter(Boolean).join('');

  return renderDetailLayout(item, mainHtml, renderValidationChipPanel(item));
}

function renderValidationChipPanel(item) {
  const tags = pickLang(item.core?.tags) || pickLang(item.classification?.tags) || [];
  const chips = [
    getSectorLabel(item.core?.sector),
    pickLang(item.validationTypeLabel),
    pickLang(item.validationStageLabel),
    pickLang(item.decisionOutcomeLabel),
    ...asArray(item.classification?.tripleTransition).map(id => getLabelFromArray(MARKETPLACE_CONFIG.transitionLabels, id)).filter(Boolean),
    ...asArray(tags),
  ].filter(Boolean);
  if (!chips.length) return '';
  return `
    <section class="rounded-2xl border border-eu-border bg-white p-5 shadow-sm">
      <h2 class="text-base font-extrabold text-eu-text">${esc(uiText('tags'))}</h2>
      <div class="mt-3 flex flex-wrap gap-2">
        ${chips.slice(0, 8).map(chip => renderBadge(chip)).join('')}
      </div>
    </section>`;
}

function renderPilotDetail(item) {
  const isV2 = item.pilotPlan != null || item.ownership?.lead != null;
  return isV2 ? renderPilotDetailV2(item) : renderPilotDetailLegacy(item);
}

function renderPilotDetailV2(item) {
  const core = item.core || {};
  const pilotPlan = item.pilotPlan || {};
  const impl = item.implementation || {};
  const readiness = impl.readiness || {};
  const evidence = item.evidence || {};
  const results = item.results || {};
  const transfer = item.transferability || {};
  const downloads = item.downloads || {};
  const resources = item.resources || {};
  const ownership = item.ownership || {};
  const pres = item.presentation?.detail?.sections || {};

  // ── Helpers internos ───────────────────────────────────────────────────────
  function textBlock(localized) {
    const text = pickLang(localized);
    return text ? `<p class="mt-2 text-sm leading-7 text-gray-700">${esc(text)}</p>` : '';
  }
  function labeledBlock(labelText, localized) {
    const text = pickLang(localized);
    if (!text) return '';
    return `<div class="mt-4">
      <p class="text-xs font-bold uppercase tracking-wide text-gray-400 mb-1">${esc(labelText)}</p>
      <p class="text-sm leading-7 text-gray-700">${esc(text)}</p>
    </div>`;
  }
  function bulletList(items, icon = 'check-circle') {
    const arr = asArray(items).map(i => pickLang(i.label || i)).filter(Boolean);
    if (!arr.length) return '';
    return `<ul class="mt-3 space-y-2">${arr.map(t => `
      <li class="flex gap-2 text-sm leading-6 text-gray-700">
        <i data-lucide="${esc(icon)}" class="mt-0.5 h-4 w-4 shrink-0 text-eu-blue"></i>
        <span>${esc(t)}</span>
      </li>`).join('')}</ul>`;
  }
  function orgList(items) {
    return asArray(items).map(o => {
      const name = o.name || '';
      const role = pickLang(o.role);
      const initials = name.split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]?.toUpperCase()).join('') || '?';
      return `<div class="flex items-center gap-3 rounded-lg border border-eu-border bg-eu-bg p-3">
        <span class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-eu-blue text-xs font-extrabold text-white">${esc(initials)}</span>
        <div class="min-w-0">
          <p class="text-sm font-bold text-eu-text truncate">${esc(name)}</p>
          ${role ? `<p class="mt-0.5 text-xs text-gray-500 truncate">${esc(role)}</p>` : ''}
        </div>
      </div>`;
    }).join('');
  }

  // ── S1: Plan de pilotaje ───────────────────────────────────────────────────
  const s1Html = pres.pilotPlan !== false ? (() => {
    const hypothesis = pickLang(pilotPlan.hypothesis);
    const content = [
      hypothesis ? `<p class="text-lg font-bold leading-snug text-eu-blue">${esc(hypothesis)}</p>` : '',
      labeledBlock(pickLang({ es: 'Objetivo', en: 'Objective', va: 'Objectiu' }), pilotPlan.objective),
      labeledBlock(pickLang({ es: 'Contexto', en: 'Context', va: 'Context' }), pilotPlan.context),
      labeledBlock(pickLang({ es: 'Participantes', en: 'Participants', va: 'Participants' }), pilotPlan.targetParticipants),
    ].filter(Boolean).join('');
    return content ? renderStructuredSection({ es: 'Plan de pilotaje', en: 'Pilot plan', va: 'Pla de pilot' }, 'flask-conical', content) : '';
  })() : '';

  // ── S2: Metodología ────────────────────────────────────────────────────────
  const s2Html = pres.pilotPlan !== false ? (() => {
    const method = pickLang(pilotPlan.methodology);
    const criteria = bulletList(pilotPlan.successCriteria, 'target');
    const content = [
      method ? `<p class="text-sm leading-7 text-gray-700">${esc(method)}</p>` : '',
      criteria ? `<div class="mt-4"><p class="text-xs font-bold uppercase tracking-wide text-gray-400 mb-1">${esc(pickLang({ es: 'Criterios de éxito', en: 'Success criteria', va: 'Criteris d\'èxit' }))}</p>${criteria}</div>` : '',
    ].filter(Boolean).join('');
    return content ? renderStructuredSection({ es: 'Metodología', en: 'Methodology', va: 'Metodologia' }, 'book-open', content) : '';
  })() : '';

  // ── S3: Implementación ─────────────────────────────────────────────────────
  const s3Html = pres.implementation !== false ? (() => {
    const trl = readiness.technologyReadiness;
    const er = readiness.educationalReadiness;
    const trlHtml = trl?.enabled ? `
      <div class="rounded-lg border border-eu-border bg-eu-bg px-4 py-3">
        <p class="text-xs font-bold uppercase tracking-wide text-gray-400">TRL</p>
        <p class="mt-0.5 text-base font-bold text-eu-blue">TRL ${trl.level || ''}${pickLang(trl.label) ? ` — ${pickLang(trl.label)}` : ''}</p>
      </div>` : '';
    const erHtml = er?.enabled ? `
      <div class="rounded-lg border border-eu-border bg-eu-bg px-4 py-3">
        <p class="text-xs font-bold uppercase tracking-wide text-gray-400">${esc(pickLang({ es: 'Madurez educativa', en: 'Educational readiness', va: 'Maduresa educativa' }))}</p>
        <p class="mt-0.5 text-base font-bold text-eu-blue">${esc(getEducationalReadinessLabel(er.level) || pickLang(er.label) || er.level || '')}</p>
      </div>` : '';
    const readinessRow = (trlHtml || erHtml) ? `<div class="grid gap-3 md:grid-cols-2">${trlHtml}${erHtml}</div>` : '';

    const infraLabels = asArray(impl.infrastructure).map(i => pickLang(i.label)).filter(Boolean);
    const infraChips = infraLabels.length ? `
      <div class="mt-4">
        <p class="text-xs font-bold uppercase tracking-wide text-gray-400 mb-2">${esc(pickLang({ es: 'Infraestructura', en: 'Infrastructure', va: 'Infraestructura' }))}</p>
        <div class="flex flex-wrap gap-2">${infraLabels.map(l => renderBadge(l, 'bg-slate-50 text-slate-700 border-slate-200')).join('')}</div>
      </div>` : '';

    const toolLabels = asArray(impl.tools).map(t => pickLang(t.label)).filter(Boolean);
    const toolChips = toolLabels.length ? `
      <div class="mt-4">
        <p class="text-xs font-bold uppercase tracking-wide text-gray-400 mb-2">${esc(pickLang({ es: 'Herramientas', en: 'Tools', va: 'Eines' }))}</p>
        <div class="flex flex-wrap gap-2">${toolLabels.map(l => renderBadge(l, 'bg-blue-50 text-blue-700 border-blue-200')).join('')}</div>
      </div>` : '';

    const dm = impl.dataManagement;
    const dmHtml = dm?.note ? `
      <div class="mt-4 flex gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800">
        <i data-lucide="database" class="h-4 w-4 shrink-0 mt-0.5"></i>
        <span>${esc(pickLang(dm.note))}</span>
      </div>` : '';

    const content = [readinessRow, infraChips, toolChips, dmHtml].filter(Boolean).join('');
    return content ? renderStructuredSection({ es: 'Implementación', en: 'Implementation', va: 'Implementació' }, 'cpu', content) : '';
  })() : '';

  // ── S4: Evidencia ──────────────────────────────────────────────────────────
  const s4Html = pres.evidence !== false ? (() => {
    const evLevel = getLabelFromArray(MARKETPLACE_CONFIG.labels?.pilotEvidenceLevel, evidence.evidenceLevel);
    const evVer = evidence.verificationStatus || '';
    const badgesHtml = (evLevel || evVer) ? `
      <div class="flex flex-wrap gap-2 mb-4">
        ${evLevel ? renderBadge(evLevel, 'bg-teal-50 text-teal-700 border-teal-200') : ''}
        ${evVer ? renderBadge(evVer, 'bg-eu-bg text-gray-700 border-eu-border') : ''}
      </div>` : '';

    const pm = evidence.primaryMetric;
    const primaryHtml = pm ? `
      <div class="rounded-xl border border-eu-border bg-eu-bg p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span class="text-xs font-bold text-gray-400">${esc(pickLang({ es: 'Métrica principal', en: 'Primary metric', va: 'Mètrica principal' }))}</span>
          <p class="mt-1 text-sm font-bold text-eu-text">${esc(pickLang(pm.label))}</p>
        </div>
        <div class="shrink-0 rounded-lg bg-eu-orange/10 border border-eu-orange/20 px-4 py-3 text-center">
          <span class="text-xl font-bold text-eu-orange">${esc(String(pm.value))} <span class="text-sm font-semibold">${esc(pickLang(pm.unit) || '')}</span></span>
        </div>
      </div>` : '';

    const secMetrics = asArray(evidence.secondaryMetrics).filter(m => pickLang(m.label));
    const secondaryHtml = secMetrics.length ? `
      <div class="mt-4 space-y-2">
        <p class="text-xs font-bold uppercase tracking-wide text-gray-400">${esc(pickLang({ es: 'Métricas secundarias', en: 'Secondary metrics', va: 'Mètriques secundàries' }))}</p>
        ${secMetrics.map(m => `
          <div class="rounded-lg border border-eu-border bg-white px-4 py-3">
            <p class="text-xs font-bold text-gray-400">${esc(pickLang(m.label))}</p>
            ${pickLang(m.method) ? `<p class="mt-0.5 text-xs text-gray-500">${esc(pickLang(m.method))}</p>` : ''}
          </div>`).join('')}
      </div>` : '';

    const limHtml = evidence.limitations ? labeledBlock(
      pickLang({ es: 'Limitaciones', en: 'Limitations', va: 'Limitacions' }),
      evidence.limitations
    ) : '';

    const collHtml = evidence.collectionMethod ? labeledBlock(
      pickLang({ es: 'Método de recogida', en: 'Collection method', va: 'Mètode de recollida' }),
      evidence.collectionMethod
    ) : '';

    const content = [badgesHtml, collHtml, primaryHtml, secondaryHtml, limHtml].filter(Boolean).join('');
    return content ? renderStructuredSection({ es: 'Evidencia', en: 'Evidence', va: 'Evidència' }, 'bar-chart-2', content) : '';
  })() : '';

  // ── S5: Resultados y decisión ──────────────────────────────────────────────
  const s5Html = pres.results !== false ? (() => {
    const headline = pickLang(results.headline);
    const outputs = bulletList(results.outputs, 'check-circle');
    const dec = results.decision;
    const decHtml = dec ? `
      <div class="mt-4 rounded-lg border border-eu-border bg-eu-bg px-4 py-3 flex items-start gap-3">
        <i data-lucide="arrow-right-circle" class="h-4 w-4 mt-0.5 shrink-0 text-eu-blue"></i>
        <div>
          <span class="text-xs font-bold uppercase tracking-wide text-gray-400">${esc(pickLang({ es: 'Decisión posterior', en: 'Next decision', va: 'Decisió posterior' }))}</span>
          ${dec.outcome ? `<span class="ml-2 inline-flex rounded border px-1.5 py-0.5 text-xs font-bold bg-green-50 text-green-800 border-green-200">${esc(getLabelFromArray(MARKETPLACE_CONFIG.labels?.pilotDecision, dec.outcome) || dec.outcome)}</span>` : ''}
          ${pickLang(dec.label) ? `<p class="mt-1 text-sm text-gray-700">${esc(pickLang(dec.label))}</p>` : ''}
        </div>
      </div>` : '';

    const content = [
      headline ? `<p class="text-base font-bold leading-snug text-eu-text">${esc(headline)}</p>` : '',
      outputs ? `<div class="mt-4"><p class="text-xs font-bold uppercase tracking-wide text-gray-400 mb-1">${esc(pickLang({ es: 'Outputs', en: 'Outputs', va: 'Outputs' }))}</p>${outputs}</div>` : '',
      decHtml,
    ].filter(Boolean).join('');
    return content ? renderStructuredSection({ es: 'Resultados y decisión', en: 'Results and decision', va: 'Resultats i decisió' }, 'trophy', content) : '';
  })() : '';

  // ── S6: Transferibilidad ───────────────────────────────────────────────────
  const s6Html = pres.transferability !== false ? (() => {
    const whyText = pickLang(transfer.whyTransferable);
    const suitFor = asArray(transfer.suitableFor).filter(Boolean);
    const reqs = bulletList(transfer.requirements, 'check-square');
    const steps = bulletList(transfer.replicationSteps, 'arrow-right');
    const risks = bulletList(transfer.risks, 'alert-triangle');
    const content = [
      whyText ? `<p class="text-sm leading-7 text-gray-700">${esc(whyText)}</p>` : '',
      suitFor.length ? `<div class="mt-3 flex flex-wrap gap-2">${suitFor.map(s => renderBadge(s, 'bg-purple-50 text-purple-700 border-purple-200')).join('')}</div>` : '',
      reqs ? `<div class="mt-4"><p class="text-xs font-bold uppercase tracking-wide text-gray-400 mb-1">${esc(pickLang({ es: 'Requisitos', en: 'Requirements', va: 'Requisits' }))}</p>${reqs}</div>` : '',
      steps ? `<div class="mt-4"><p class="text-xs font-bold uppercase tracking-wide text-gray-400 mb-1">${esc(pickLang({ es: 'Pasos de replicación', en: 'Replication steps', va: 'Passos de replicació' }))}</p>${steps}</div>` : '',
      risks ? `<div class="mt-4"><p class="text-xs font-bold uppercase tracking-wide text-gray-400 mb-1">${esc(pickLang({ es: 'Riesgos', en: 'Risks', va: 'Riscos' }))}</p>${risks}</div>` : '',
    ].filter(Boolean).join('');
    return content ? renderStructuredSection({ es: 'Transferibilidad', en: 'Transferability', va: 'Transferibilitat' }, 'share-2', content) : '';
  })() : '';

  // ── S7: Descargables ──────────────────────────────────────────────────────
  const s7Html = (pres.downloads !== false && downloads.enabled && asArray(downloads.items).length) ? (() => {
    const itemsHtml = asArray(downloads.items).map(d => {
      const title = pickLang(d.title);
      const desc = pickLang(d.description);
      const typeLabel = getLabelFromArray(MARKETPLACE_CONFIG.labels?.downloadTypes, d.type);
      return `
        <div class="rounded-lg border border-eu-border bg-white px-4 py-3">
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0">
              <p class="text-sm font-bold text-eu-text">${esc(title || typeLabel || d.id)}</p>
              ${desc ? `<p class="mt-0.5 text-xs leading-5 text-gray-500">${esc(desc)}</p>` : ''}
              ${d.format ? `<span class="mt-1 inline-block text-xs font-semibold text-gray-400">${esc(d.format)}</span>` : ''}
            </div>
            ${typeLabel ? renderBadge(typeLabel, 'bg-eu-bg text-gray-600 border-eu-border') : ''}
          </div>
        </div>`;
    }).join('');
    return renderStructuredSection({ es: 'Descargables', en: 'Downloads', va: 'Descarregables' }, 'file-down', `<div class="mt-2 space-y-2">${itemsHtml}</div>`);
  })() : '';

  // ── S8: Recursos externos ─────────────────────────────────────────────────
  const s8Html = (pres.resources !== false && asArray(resources.externalLinks).length) ? (() => {
    const linksHtml = asArray(resources.externalLinks).map(l => {
      const label = pickLang(l.label);
      return `<a href="${esc(l.url || '#')}" target="_blank" rel="noopener noreferrer" class="flex items-center gap-2 rounded-lg border border-eu-border bg-white px-4 py-3 text-sm font-semibold text-eu-blue hover:bg-eu-bg">
        <i data-lucide="external-link" class="h-4 w-4 shrink-0"></i>
        <span class="truncate">${esc(label || l.url)}</span>
      </a>`;
    }).join('');
    return renderStructuredSection({ es: 'Recursos externos', en: 'External resources', va: 'Recursos externs' }, 'link', `<div class="mt-2 space-y-2">${linksHtml}</div>`);
  })() : '';

  // ── S9: Proceso / Hitos ───────────────────────────────────────────────────
  const s9Html = pres.process !== false ? (() => {
    const ew = core.executionWindow;
    const startMs = ew?.start ? [{ date: ew.start, label: { es: 'Inicio del piloto', en: 'Pilot start', va: 'Inici del pilot' } }] : [];
    const endMs = ew?.end ? [{ date: ew.end, label: { es: 'Fin del piloto', en: 'Pilot end', va: 'Fi del pilot' } }] : [];
    const extraMs = asArray(item.process?.milestones);
    const allMs = [...startMs, ...extraMs, ...endMs];
    const milestonesHtml = renderMilestoneList({ milestones: allMs });
    return milestonesHtml ? renderStructuredSection({ es: 'Proceso y hitos', en: 'Process and milestones', va: 'Procés i fites' }, 'route', milestonesHtml) : '';
  })() : '';

  // ── Sidebar: Personas y entidades ─────────────────────────────────────────
  const sidebarPeopleHtml = pres.people !== false ? (() => {
    const leadHtml = ownership.lead?.name ? `
      <div>
        <p class="text-xs font-bold uppercase tracking-wide text-gray-400 mb-2">${esc(pickLang({ es: 'Entidad líder', en: 'Lead entity', va: 'Entitat líder' }))}</p>
        <div class="rounded-lg border border-eu-border bg-eu-bg px-4 py-3">
          <p class="text-sm font-bold text-eu-text">${esc(ownership.lead.name)}</p>
          ${pickLang(ownership.lead.type) ? `<p class="mt-0.5 text-xs text-gray-500">${esc(pickLang(ownership.lead.type))}</p>` : ''}
          ${pickLang(ownership.lead.role) ? `<p class="mt-0.5 text-xs text-gray-500">${esc(pickLang(ownership.lead.role))}</p>` : ''}
        </div>
      </div>` : '';

    const sitesOrgs = asArray(ownership.pilotSites);
    const sitesHtml = sitesOrgs.length ? `
      <div class="mt-4">
        <p class="text-xs font-bold uppercase tracking-wide text-gray-400 mb-2">${esc(pickLang({ es: 'Centros piloto', en: 'Pilot sites', va: 'Centres pilot' }))}</p>
        <div class="space-y-2">${orgList(sitesOrgs)}</div>
      </div>` : '';

    const partnerOrgs = asArray(ownership.partners);
    const partnersHtml = partnerOrgs.length ? `
      <div class="mt-4">
        <p class="text-xs font-bold uppercase tracking-wide text-gray-400 mb-2">${esc(pickLang({ es: 'Socios', en: 'Partners', va: 'Socis' }))}</p>
        <div class="space-y-2">${orgList(partnerOrgs)}</div>
      </div>` : '';

    const content = [leadHtml, sitesHtml, partnersHtml].filter(Boolean).join('');
    if (!content) return '';
    return `
      <section class="rounded-2xl border border-eu-border bg-white p-5 shadow-sm">
        <h2 class="mb-4 text-base font-extrabold text-eu-text">${esc(pickLang({ es: 'Personas y entidades', en: 'People and entities', va: 'Persones i entitats' }))}</h2>
        ${content}
      </section>`;
  })() : '';

  // ── Sidebar: Acceso ───────────────────────────────────────────────────────
  const accessPanelHtml = pres.access !== false ? renderAccessPanel(item) : '';

  const mainHtml = [s1Html, s2Html, s3Html, s4Html, s5Html, s6Html, s7Html, s8Html, s9Html].filter(Boolean).join('');

  return renderDetailLayout(item, mainHtml, sidebarPeopleHtml + accessPanelHtml);
}

function renderPilotDetailLegacy(item) {
  const detail = item.detail || {};
  const milestones = renderMilestoneList(detail.process);
  const resourceRows = renderResourceRows(detail.resources);
  const deliverables = renderDeliverableList(detail.outputs);

  return renderDetailLayout(item, [
    renderPilotPlanSection(item),
    renderDetailBlock(item, { key: 'objective', icon: 'target' }),
    renderDetailBlock(item, { key: 'methodology', icon: 'flask-conical' }),
    renderDetailBlock(item, { key: 'outcome', icon: 'trending-up' }),
    renderCollaborationSection(item),
    milestones ? renderStructuredSection(getBlockLabel('process'), 'route', milestones) : '',
    resourceRows ? renderStructuredSection(getBlockLabel('resources'), 'folder-open', resourceRows) : '',
    deliverables ? renderStructuredSection(getBlockLabel('outputs'), 'package-check', deliverables) : '',
    renderTechnicalSection(item),
  ].filter(Boolean).join(''), renderDetailChipPanel(item));
}

function renderMentoringDetail(item) {
  const isV2 = item.mentoringOffer || item.mentors || item.expectedOutputs || item.presentation?.detail;
  if (isV2) return renderMentoringDetailV2(item);

  const card = item.card || {};
  const detail = item.detail || {};
  const mentorName = pickLang(card.mentorName);
  const mentorRole = pickLang(card.mentorRole);
  const organisation = pickLang(card.organisation);
  const specialties = asArray(card.specialties).map(v => (typeof v === 'string' ? v : pickLang(v))).filter(Boolean);
  const badges = asArray(card.badges).map(v => (typeof v === 'string' ? v : pickLang(v))).filter(Boolean);
  const availability = pickLang(card.availability);
  const context = pickLang(detail.context);
  const participation = pickLang(detail.participation);
  const transferValue = pickLang(detail.transferValue);
  const mentorProfile = `
    <section class="rounded-2xl bg-eu-blue/5 border border-eu-blue/20 p-6">
      ${renderSectionHeader('messages-square', uiText('mentoringSupport'), true)}
      ${mentorName ? `<p class="text-xl font-bold leading-snug text-eu-blue">${esc(mentorName)}</p>` : ''}
      ${mentorRole ? `<p class="mt-1 text-sm font-semibold text-gray-600">${esc(mentorRole)}</p>` : ''}
      ${organisation ? `
        <div class="mt-3 flex items-center gap-2 text-sm text-gray-500">
          <i data-lucide="building-2" class="h-4 w-4 shrink-0 text-eu-blue"></i>
          <span>${esc(organisation)}</span>
        </div>` : ''}
      ${availability ? `
        <div class="mt-2 flex items-center gap-2 text-sm text-gray-500">
          <i data-lucide="calendar-check" class="h-4 w-4 shrink-0 text-eu-blue"></i>
          <span>${esc(availability)}</span>
        </div>` : ''}
      ${specialties.length ? `
        <div class="mt-5">
          <p class="mb-2 text-xs font-bold uppercase tracking-wide text-gray-500">${esc(pickLang(FIELD_LABELS.specialties))}</p>
          <div class="flex flex-wrap gap-2">${specialties.map(s => renderBadge(s, 'bg-eu-blue/10 text-eu-blue border-eu-blue/20')).join('')}</div>
        </div>` : ''}
      ${badges.length ? `
        <div class="mt-4">
          <div class="flex flex-wrap gap-2">${badges.map(b => renderBadge(b, 'bg-eu-orange/10 text-eu-orange border-eu-orange/20')).join('')}</div>
        </div>` : ''}
    </section>`;

  const collaborationSection = (context || participation) ? `
    <section class="rounded-2xl bg-white border border-eu-border p-6">
      ${renderSecondaryHeader('users', getBlockLabel('participation') || pickLang({ es: 'Colaboración', en: 'Collaboration', va: 'Col·laboració' }))}
      ${context ? `<p class="text-sm leading-7 text-gray-700">${esc(context)}</p>` : ''}
      ${participation ? `
        <div class="mt-4 rounded-xl bg-eu-bg p-4">
          <div class="flex items-start gap-2">
            <i data-lucide="user-check" class="mt-0.5 h-4 w-4 shrink-0 text-eu-blue"></i>
            <p class="text-sm leading-6 text-gray-700">${esc(participation)}</p>
          </div>
        </div>` : ''}
      ${transferValue ? `
        <div class="mt-5 border-t border-eu-border pt-4">
          <p class="mb-2 text-xs font-bold uppercase tracking-wide text-gray-500">${esc(getBlockLabel('transferValue') || '')}</p>
          <p class="text-sm leading-7 text-gray-700">${esc(transferValue)}</p>
        </div>` : ''}
    </section>` : '';

  return renderDetailLayout(item, [
    mentorProfile,
    collaborationSection,
  ].filter(Boolean).join(''), renderDetailChipPanel(item));
}

function renderMentoringDetailV2(item) {
  const sections = item.presentation?.detail?.sections || {};
  const mainHtml = [
    renderMentoringPurposeSection(item, sections),
    renderMentoringScopeSection(item, sections),
    renderMentoringTargetUsersSection(item, sections),
    renderMentoringFormatSection(item, sections),
    renderMentoringTeamSection(item, sections),
    renderMentoringPreparationSection(item, sections),
    renderMentoringExpectedOutputsSection(item, sections),
    renderMentoringTransferValueSection(item, sections),
    renderMentoringDownloadsSection(item, sections),
    renderMentoringResourcesSection(item, sections),
    renderMentoringAccessSection(item, sections),
    renderMentoringRelationsSection(item, sections),
  ].filter(Boolean).join('');

  return `
    <div>
      ${renderMentoringDetailHeader(item)}
      <section class="mx-auto max-w-7xl px-6 py-8">
        <div class="grid gap-6 lg:grid-cols-3">
          <div class="space-y-5 lg:col-span-2">
            ${mainHtml || renderDetailEmpty()}
          </div>
          <aside class="space-y-5 self-start">
            ${renderMentoringSummaryPanel(item)}
            ${renderDetailChipPanel(item)}
          </aside>
        </div>
      </section>
    </div>`;
}

function renderMentoringDetailHeader(item) {
  const core = item.core || {};
  const offer = item.mentoringOffer || {};
  const format = offer.format || {};
  const provider = item.ownership?.provider || {};
  const ef = item.externalFlow || {};
  const tab = getTabs().find(candidate => candidate.id === item.tab) || getActiveTab();
  const title = pickLang(core.title, item.id);
  const summary = pickLang(core.summary);
  const providerName = pickLang(provider.name) || pickLang(core.entity?.name);
  const availability = pickLang(format.availability);
  const typeLabel = getMentoringTypeLabel(core.mentoringType);
  const primaryUrl = ef.enabled && ef.primaryAction?.url ? ef.primaryAction.url : '';
  const primaryLabel = pickLang(ef.primaryAction?.label) || pickLang({ es: 'Abrir sistema externo', en: 'Open external system', va: 'Obrir sistema extern' });
  const formatSummary = getMentoringFormatSummary(format);

  return `
    <section class="bg-eu-blue px-6 py-12 text-white">
      <div class="mx-auto max-w-7xl">
        <button id="mp-back" type="button" class="mb-7 inline-flex min-h-11 items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm font-bold text-white transition-colors hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-eu-blue">
          <i data-lucide="arrow-left" class="h-4 w-4"></i>
          ${esc(uiText('backCommunity'))}
        </button>
        <div class="flex flex-wrap gap-2">
          ${renderBadge(pickLang(tab?.label, item.tab), 'bg-white/10 text-white border-white/20')}
          ${renderBadge(getTypeLabel(item.type), 'bg-white/10 text-white border-white/20')}
          ${renderBadge(getMentoringStatusLabel(core.status), 'bg-white/10 text-white border-white/20')}
          ${typeLabel ? renderBadge(typeLabel, 'bg-white/10 text-white border-white/20') : ''}
        </div>
        <h1 class="mt-5 max-w-4xl text-3xl font-extrabold leading-tight md:text-4xl">${esc(title)}</h1>
        ${summary ? `<p class="mt-4 max-w-4xl text-base leading-7 text-white/80">${esc(summary)}</p>` : ''}
        <div class="mt-6 flex flex-wrap items-center gap-4 text-sm font-semibold text-white/75">
          ${providerName ? `<span class="inline-flex items-center gap-2"><i data-lucide="building-2" class="h-4 w-4"></i>${esc(providerName)}</span>` : ''}
          ${availability ? `<span class="inline-flex items-center gap-2"><i data-lucide="calendar-check" class="h-4 w-4"></i>${esc(availability)}</span>` : ''}
          ${formatSummary ? `<span class="inline-flex items-center gap-2"><i data-lucide="monitor-dot" class="h-4 w-4"></i>${esc(formatSummary)}</span>` : ''}
        </div>
        ${primaryUrl ? `
          <div class="mt-6">
            <a href="${esc(primaryUrl)}" target="_blank" rel="noopener noreferrer" class="inline-flex min-h-11 items-center gap-2 rounded-lg bg-eu-orange px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-eu-purple focus:outline-none focus:ring-2 focus:ring-eu-orange focus:ring-offset-2 focus:ring-offset-eu-blue">
              ${esc(primaryLabel)}
              <i data-lucide="external-link" class="h-4 w-4"></i>
            </a>
          </div>` : ''}
      </div>
    </section>`;
}

function getMentoringFormatSummary(format = {}) {
  const parts = [
    getModalityLabel(format.modality),
    format.sessionDurationMinutes ? `${format.sessionDurationMinutes} min` : '',
    format.asyncReview ? pickLang({ es: 'revision asincronica', en: 'async review', va: 'revisio asincronica' }) : '',
  ].filter(Boolean);
  return parts.join(' / ');
}

function renderMentoringSection(sections, key, icon, title, body, accent = false) {
  if (sections?.[key] === false || !body) return '';
  return `
    <section class="rounded-2xl border ${accent ? 'border-eu-blue/20 bg-eu-blue/5' : 'border-eu-border bg-white'} p-6 shadow-sm">
      ${accent ? renderSectionHeader(icon, title, true) : renderSecondaryHeader(icon, title)}
      ${body}
    </section>`;
}

function renderMentoringParagraphs(values) {
  const paragraphs = values.map(value => pickLang(value)).filter(Boolean);
  if (!paragraphs.length) return '';
  return paragraphs.map(text => `<p class="text-sm leading-7 text-gray-700">${esc(text)}</p>`).join('');
}

function renderMentoringLabeledList(items, tone = 'text-gray-700') {
  const labels = asArray(items).map(item => pickLang(item?.label || item)).filter(Boolean);
  if (!labels.length) return '';
  return `
    <ul class="space-y-2">
      ${labels.map(label => `
        <li class="flex gap-2 text-sm leading-6 ${tone}">
          <i data-lucide="check-circle-2" class="mt-1 h-4 w-4 shrink-0 text-eu-blue"></i>
          <span>${esc(label)}</span>
        </li>`).join('')}
    </ul>`;
}

function renderMentoringPurposeSection(item, sections) {
  const offer = item.mentoringOffer || {};
  const body = renderMentoringParagraphs([offer.purpose, offer.problemAddressed]);
  return renderMentoringSection(sections, 'purpose', 'handshake', pickLang({ es: 'Que ofrece', en: 'What it offers', va: 'Que ofereix' }), body, true);
}

function renderMentoringScopeSection(item, sections) {
  const scope = item.mentoringOffer?.mentoringScope || {};
  const included = renderMentoringLabeledList(scope.included);
  const excludedLabels = asArray(scope.excluded).map(entry => pickLang(entry?.label || entry)).filter(Boolean);
  const excluded = excludedLabels.length ? `
    <ul class="space-y-2">
      ${excludedLabels.map(label => `
        <li class="flex gap-2 text-sm leading-6 text-gray-600">
          <i data-lucide="minus-circle" class="mt-1 h-4 w-4 shrink-0 text-gray-400"></i>
          <span>${esc(label)}</span>
        </li>`).join('')}
    </ul>` : '';
  const body = [included ? `
      <div>
        <p class="mb-2 text-xs font-bold uppercase tracking-wide text-gray-500">${esc(pickLang({ es: 'Incluye', en: 'Includes', va: 'Inclou' }))}</p>
        ${included}
      </div>` : '',
    excluded ? `
      <div class="mt-5 border-t border-eu-border pt-4">
        <p class="mb-2 text-xs font-bold uppercase tracking-wide text-gray-500">${esc(pickLang({ es: 'No incluye', en: 'Does not include', va: 'No inclou' }))}</p>
        ${excluded}
      </div>` : '',
  ].filter(Boolean).join('');
  return renderMentoringSection(sections, 'scope', 'list-checks', pickLang({ es: 'Alcance', en: 'Scope', va: 'Abast' }), body);
}

function renderMentoringTargetUsersSection(item, sections) {
  const users = pickLang(item.mentoringOffer?.targetUsers);
  const audience = asArray(item.classification?.audience).map(getAudienceLabel).filter(Boolean);
  const body = [
    users ? `<p class="text-sm leading-7 text-gray-700">${esc(users)}</p>` : '',
    audience.length ? `<div class="mt-4 flex flex-wrap gap-2">${audience.map(label => renderBadge(label, 'bg-eu-bg text-gray-700 border-eu-border')).join('')}</div>` : '',
  ].filter(Boolean).join('');
  return renderMentoringSection(sections, 'targetUsers', 'users', pickLang({ es: 'Para quien es', en: 'Who it is for', va: 'Per a qui es' }), body);
}

function renderMentoringFormatSection(item, sections) {
  const format = item.mentoringOffer?.format || {};
  const languages = asArray(format.languageCodes).map(code => String(code).toUpperCase()).join(' / ');
  const body = `
    <dl class="grid gap-3 md:grid-cols-2">
      ${renderDetailPair(pickLang({ es: 'Modalidad', en: 'Modality', va: 'Modalitat' }), getModalityLabel(format.modality))}
      ${renderDetailPair(pickLang({ es: 'Duracion', en: 'Duration', va: 'Duracio' }), format.sessionDurationMinutes ? `${format.sessionDurationMinutes} min` : '')}
      ${renderDetailPair(pickLang({ es: 'Revision asincronica', en: 'Async review', va: 'Revisio asincronica' }), format.asyncReview ? pickLang({ es: 'Si', en: 'Yes', va: 'Si' }) : '')}
      ${renderDetailPair(pickLang({ es: 'Idiomas', en: 'Languages', va: 'Idiomes' }), languages)}
    </dl>
    ${pickLang(format.availability) ? `<p class="mt-4 text-sm leading-7 text-gray-700">${esc(pickLang(format.availability))}</p>` : ''}`;
  return renderMentoringSection(sections, 'format', 'calendar-check', pickLang({ es: 'Formato y disponibilidad', en: 'Format and availability', va: 'Format i disponibilitat' }), body.trim());
}

function renderMentoringTeamSection(item, sections) {
  const mentors = asArray(item.mentors?.items);
  const mode = pickLang(item.mentors?.mode) || item.mentors?.mode;
  const mentorHtml = mentors.map(mentor => {
    const name = pickLang(mentor?.name);
    const role = pickLang(mentor?.role);
    const organisation = pickLang(mentor?.organisation);
    const specialties = asArray(mentor?.specialties).map(getMentoringSpecialtyLabel).filter(Boolean);
    if (!name && !role && !organisation && !specialties.length) return '';
    return `
      <div class="rounded-xl bg-eu-bg p-4">
        ${name ? `<p class="text-sm font-bold text-eu-text">${esc(name)}</p>` : ''}
        ${role ? `<p class="mt-1 text-sm leading-6 text-gray-700">${esc(role)}</p>` : ''}
        ${organisation ? `<p class="mt-1 text-xs font-semibold text-gray-500">${esc(organisation)}</p>` : ''}
        ${specialties.length ? `<div class="mt-3 flex flex-wrap gap-2">${specialties.map(label => renderBadge(label, 'bg-white text-gray-700 border-eu-border')).join('')}</div>` : ''}
      </div>`;
  }).filter(Boolean).join('');
  const body = [
    mode ? `<p class="mb-3 text-xs font-bold uppercase tracking-wide text-gray-500">${esc(mode)}</p>` : '',
    mentorHtml,
  ].filter(Boolean).join('');
  return renderMentoringSection(sections, 'mentors', 'user-round-check', pickLang({ es: 'Mentores o equipo', en: 'Mentors or team', va: 'Mentors o equip' }), body);
}

function renderMentoringPreparationSection(item, sections) {
  const prep = item.preparation || {};
  const required = renderMentoringLabeledList(prep.requiredBeforeRequest);
  const questions = renderMentoringLabeledList(prep.intakeQuestions);
  const body = [
    required ? `
      <div>
        <p class="mb-2 text-xs font-bold uppercase tracking-wide text-gray-500">${esc(pickLang({ es: 'Antes de solicitar', en: 'Before requesting', va: 'Abans de sol-licitar' }))}</p>
        ${required}
      </div>` : '',
    questions ? `
      <div class="mt-5 border-t border-eu-border pt-4">
        <p class="mb-2 text-xs font-bold uppercase tracking-wide text-gray-500">${esc(pickLang({ es: 'Preguntas de preparacion', en: 'Preparation questions', va: 'Preguntes de preparacio' }))}</p>
        ${questions}
      </div>` : '',
  ].filter(Boolean).join('');
  return renderMentoringSection(sections, 'preparation', 'clipboard-list', pickLang({ es: 'Como prepararse', en: 'How to prepare', va: 'Com preparar-se' }), body);
}

function renderMentoringExpectedOutputsSection(item, sections) {
  const body = renderMentoringLabeledList(item.expectedOutputs?.items);
  return renderMentoringSection(sections, 'expectedOutputs', 'package-check', pickLang({ es: 'Resultado esperado', en: 'Expected output', va: 'Resultat esperat' }), body);
}

function renderMentoringTransferValueSection(item, sections) {
  const body = renderMentoringParagraphs([item.mentoringOffer?.transferValue]);
  return renderMentoringSection(sections, 'transferValue', 'repeat-2', pickLang({ es: 'Valor para Track B', en: 'Track B value', va: 'Valor per a Track B' }), body);
}

function renderMentoringDownloadsSection(item, sections) {
  if (sections?.downloads === false || !item.downloads?.enabled || !item.hasDownloads) return '';
  return renderDownloadsSection(item);
}

function renderMentoringResourcesSection(item, sections) {
  const links = asArray(item.resources?.externalLinks).filter(link => link?.url);
  const body = links.map(link => `
    <a href="${esc(link.url)}" target="_blank" rel="noopener noreferrer" class="flex items-start gap-3 rounded-xl border border-eu-border bg-white p-4 text-sm font-semibold text-eu-blue transition-colors hover:border-eu-blue hover:bg-eu-blue/5">
      <i data-lucide="external-link" class="mt-0.5 h-4 w-4 shrink-0"></i>
      <span>${esc(pickLang(link.label) || link.url)}</span>
    </a>`).join('');
  return renderMentoringSection(sections, 'resources', 'folder-open', pickLang({ es: 'Recursos externos', en: 'External resources', va: 'Recursos externs' }), body);
}

function renderMentoringAccessSection(item, sections) {
  const access = item.access || {};
  const rows = [
    renderDetailPair(pickLang({ es: 'Visibilidad', en: 'Visibility', va: 'Visibilitat' }), access.pageVisibility),
    renderDetailPair(pickLang({ es: 'Licencia de pagina', en: 'Page licence', va: 'Llicencia de pagina' }), access.pageLicense || access.license),
    renderDetailPair(pickLang({ es: 'Gestion de solicitud', en: 'Request management', va: 'Gestio de sol-licitud' }), getMentoringRequestAccessLabel(access.mentoringRequestAccess)),
    renderDetailPair(pickLang({ es: 'Confidencialidad', en: 'Confidentiality', va: 'Confidencialitat' }), getConfidentialityLevelLabel(access.confidentialityLevel)),
    renderDetailPair(pickLang({ es: 'Datos sensibles', en: 'Sensitive data', va: 'Dades sensibles' }), access.sensitiveDataIncluded === false ? pickLang({ es: 'No incluidos', en: 'Not included', va: 'No incloses' }) : ''),
  ].filter(Boolean).join('');
  const notes = renderMentoringParagraphs([access.rightsNote, access.publicationNote]);
  const body = [
    rows ? `<dl class="grid gap-4 md:grid-cols-2">${rows}</dl>` : '',
    notes ? `<div class="mt-5 border-t border-eu-border pt-4">${notes}</div>` : '',
  ].filter(Boolean).join('');
  return renderMentoringSection(sections, 'access', 'shield-check', pickLang({ es: 'Acceso, titularidad y confidencialidad', en: 'Access, ownership and confidentiality', va: 'Acces, titularitat i confidencialitat' }), body);
}

function renderMentoringRelationsSection(item, sections) {
  const relations = item.relations || {};
  const linked = [
    ...asArray(relations.relatedChallenges),
    ...asArray(relations.relatedValidations),
    ...asArray(relations.relatedPilots),
    ...asArray(relations.relatedCases),
    ...asArray(relations.relatedResources),
  ].map(entry => pickLang(entry?.label || entry?.title || entry)).filter(Boolean);
  const outputs = asArray(relations.possibleOutputs).map(getTypeLabel).filter(Boolean);
  const body = [
    linked.length ? renderMentoringLabeledList(linked) : '',
    outputs.length ? `
      <div class="${linked.length ? 'mt-5 border-t border-eu-border pt-4' : ''}">
        <p class="mb-2 text-xs font-bold uppercase tracking-wide text-gray-500">${esc(pickLang({ es: 'Puede derivar en', en: 'May lead to', va: 'Pot derivar en' }))}</p>
        <div class="flex flex-wrap gap-2">${outputs.map(label => renderBadge(label, 'bg-eu-bg text-gray-700 border-eu-border')).join('')}</div>
      </div>` : '',
  ].filter(Boolean).join('');
  return renderMentoringSection(sections, 'relations', 'git-branch', pickLang({ es: 'Relaciones', en: 'Relations', va: 'Relacions' }), body);
}

function renderMentoringSummaryPanel(item) {
  const format = item.mentoringOffer?.format || {};
  const provider = pickLang(item.ownership?.provider?.name);
  const rows = [
    provider && [pickLang({ es: 'Proveedor', en: 'Provider', va: 'Proveidor' }), provider],
    getMentoringStatusLabel(item.core?.status) && [uiText('status'), getMentoringStatusLabel(item.core?.status)],
    getMentoringTypeLabel(item.core?.mentoringType) && [pickLang({ es: 'Subtipo', en: 'Subtype', va: 'Subtipus' }), getMentoringTypeLabel(item.core?.mentoringType)],
    getModalityLabel(format.modality) && [pickLang({ es: 'Modalidad', en: 'Modality', va: 'Modalitat' }), getModalityLabel(format.modality)],
    pickLang(format.availability) && [uiText('availability'), pickLang(format.availability)],
  ].filter(Boolean);
  if (!rows.length) return '';
  return `
    <section class="rounded-2xl border border-eu-border bg-white p-5 shadow-sm">
      <h2 class="text-base font-extrabold text-eu-text">${esc(pickLang({ es: 'Resumen de mentoria', en: 'Mentoring summary', va: 'Resum de mentoria' }))}</h2>
      <dl class="mt-4 space-y-2">
        ${rows.map(([label, value]) => `
          <div class="flex items-baseline justify-between gap-2">
            <dt class="shrink-0 text-xs font-bold uppercase tracking-wide text-gray-400">${esc(label)}</dt>
            <dd class="text-right text-xs font-semibold text-gray-700">${esc(value)}</dd>
          </div>`).join('')}
      </dl>
    </section>`;
}

function renderGenericDetail(item) {
  return renderDetailLayout(item, [
    renderDetailSection(uiText('featuredSignal'), 'layout-dashboard', [renderDetailPair(uiText('featuredSignal'), item.card)]),
    DETAIL_BLOCKS.map(block => renderDetailBlock(item, block)).filter(Boolean).join(''),
  ].filter(Boolean).join(''), renderDetailChipPanel(item));
}

function renderDetailSection(title, icon, rows) {
  const body = rows.filter(Boolean).join('');
  if (!body) return '';
  return `
    <section class="rounded-2xl border border-eu-border bg-white p-6 shadow-sm">
      <div class="mb-4 flex items-center gap-3">
        <span class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-eu-blue/10 text-eu-blue">
          <i data-lucide="${esc(icon)}" class="h-5 w-5"></i>
        </span>
        <h2 class="text-base font-extrabold text-eu-text">${esc(title)}</h2>
      </div>
      <dl class="grid gap-4 md:grid-cols-2">${body}</dl>
    </section>`;
}

function renderDetailPair(label, value) {
  const rendered = renderValue(value);
  if (!rendered) return '';
  return `
    <div>
      <dt class="text-xs font-bold uppercase tracking-wide text-gray-500">${esc(pickLang(label, label))}</dt>
      <dd class="mt-1 text-sm leading-6 text-gray-700">${rendered}</dd>
    </div>`;
}

function renderDetailBlock(item, block) {
  if (item.visibility?.[block.key] === false) return '';
  const content = getBlockContent(item, block.key);
  const body = renderValue(content);
  if (!body) return '';
  return `
    <section class="rounded-2xl border border-eu-border bg-white p-6 shadow-sm">
      <div class="mb-4 flex items-center gap-3">
        <span class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-eu-blue/10 text-eu-blue">
          <i data-lucide="${esc(block.icon)}" class="h-5 w-5"></i>
        </span>
        <h2 class="text-base font-extrabold text-eu-text">${esc(getBlockLabel(block.key) || humanizeKey(block.key))}</h2>
      </div>
      <div class="text-sm leading-6 text-gray-700">${body}</div>
    </section>`;
}

function getBlockContent(item, key) {
  if (key === 'access') return item.detail?.access || item.access || {};
  if (key === 'trackA') {
    if (item.trackA != null) return item.trackA;          // v2 root-level
    if (item.trackALink?.enabled === false) return {};    // v1 disabled
    return item.detail?.trackA || item.trackALink || {};  // v1 fallback
  }
  return item.detail?.[key] || {};
}

function renderDetailEmpty() {
  return `<p class="col-span-2 rounded-2xl border border-eu-border bg-white p-6 text-sm text-gray-500 shadow-sm">${esc(uiText('detailEmpty'))}</p>`;
}

function renderDetailChipPanel(item) {
  const focus = asArray(item.classification?.aiSteamFocus).map(getFocusLabel).filter(Boolean);
  const isPilot = item.type === 'pilot';
  const helixChips = isPilot ? asArray(item.core?.helix).map(getHelixLabel).filter(Boolean) : [];
  const chips = [
    getSectorLabel(item.core?.sector),
    getEvidenceLabel(item.classification?.evidenceMaturity),
    getEngagementLabel(item.classification?.engagementLevel),
    isPilot ? getPilotTypeLabel(item.core?.pilotType) : null,
    isPilot ? getPilotStatusLabel(item.classification?.pilotStatus) : null,
    ...helixChips,
    ...focus,
  ].filter(Boolean);
  if (!chips.length) return '';
  return `
    <section class="rounded-2xl border border-eu-border bg-white p-5 shadow-sm">
      <h2 class="text-base font-extrabold text-eu-text">${esc(uiText('tags'))}</h2>
      <div class="mt-3 flex flex-wrap gap-2">
        ${chips.slice(0, 8).map(chip => renderBadge(chip)).join('')}
      </div>
    </section>`;
}

function renderAccessPanel(item) {
  const access = item.detail?.access || item.access || {};
  const ctaLabel = pickLang(access.ctaLabel) || pickLang(item.card?.availability) || uiText('viewDetail');
  const instructions = pickLang(access.instructions);
  const url = pickLang(access.url) || (typeof access.publicUrl === 'string' && access.publicUrl ? access.publicUrl : '');
  
  const isCase = item.type === 'case';
  const isValidation = item.type === 'validation';
  const pageLicense = (isCase || isValidation) ? access.pageLicense : null;
  const codeLicense = isCase ? access.codeLicense : null;
  const materialLicense = isValidation ? access.materialLicense : null;
  const dataAvailability = (isCase || isValidation) ? getDataAvailabilityLabel(access.dataAvailability) : null;
  
  const license = pageLicense || (typeof access.license === 'string' ? access.license : pickLang(access.license));
  const rightsNote = pickLang(access.rightsNote);
  const privacyLevel = access.privacyLevel || access.pageVisibility;

  if (!url && !instructions && !license && !rightsNote && !privacyLevel && !codeLicense && !materialLicense && !dataAvailability) return '';

  const PRIVACY = {
    public:     { icon: 'globe',      label: { es: 'Acceso público',      en: 'Public access',      va: 'Accés públic' } },
    restricted: { icon: 'lock',       label: { es: 'Acceso restringido',  en: 'Restricted access',  va: 'Accés restringit' } },
    private:    { icon: 'eye-off',    label: { es: 'Acceso privado',      en: 'Private access',     va: 'Accés privat' } },
  };
  const privacy = privacyLevel ? (PRIVACY[privacyLevel] || { icon: 'info', label: { es: privacyLevel, en: privacyLevel, va: privacyLevel } }) : null;
  const privacyLabel = privacy ? pickLang(privacy.label) : '';

  return `
    <section class="rounded-2xl border border-eu-border bg-white p-5 shadow-sm">
      <h2 class="mb-4 text-base font-extrabold text-eu-text">${esc(uiText('access'))}</h2>
      ${privacyLabel || license ? `
        <div class="flex items-center gap-3">
          ${privacy ? `<i data-lucide="${esc(privacy.icon)}" class="h-4 w-4 shrink-0 text-eu-blue"></i>` : ''}
          ${privacyLabel ? `<span class="text-sm font-semibold text-gray-700">${esc(privacyLabel)}</span>` : ''}
          ${license ? `<span class="ml-auto rounded-full bg-eu-bg px-2.5 py-0.5 text-xs font-bold text-gray-600" style="border:1px solid rgba(0,0,0,0.08)">${esc(license)}</span>` : ''}
        </div>` : ''}

      <!-- Licencias adicionales y disponibilidad de datos -->
      ${(isCase || isValidation) ? `
        <dl class="mt-4 space-y-2 border-t border-eu-border pt-4">
          ${codeLicense ? `
            <div class="flex items-baseline justify-between gap-2">
              <dt class="shrink-0 text-xs font-bold uppercase tracking-wide text-gray-400">${esc(pickLang({ es: 'Licencia código', en: 'Code license', va: 'Llicència codi' }))}</dt>
              <dd class="text-right text-xs font-semibold text-gray-700">${esc(codeLicense)}</dd>
            </div>` : ''}
          ${materialLicense ? `
            <div class="flex items-baseline justify-between gap-2">
              <dt class="shrink-0 text-xs font-bold uppercase tracking-wide text-gray-400">${esc(pickLang({ es: 'Licencia materiales', en: 'Material license', va: 'Llicència materials' }))}</dt>
              <dd class="text-right text-xs font-semibold text-gray-700">${esc(materialLicense)}</dd>
            </div>` : ''}
          ${dataAvailability ? `
            <div class="flex items-baseline justify-between gap-2">
              <dt class="shrink-0 text-xs font-bold uppercase tracking-wide text-gray-400">${esc(pickLang({ es: 'Disponibilidad de datos', en: 'Data availability', va: 'Disponibilitat de dades' }))}</dt>
              <dd class="text-right text-xs font-semibold text-gray-700">${esc(dataAvailability)}</dd>
            </div>` : ''}
        </dl>` : ''}

      ${rightsNote ? `<p class="mt-3 text-xs leading-5 text-gray-500">${esc(rightsNote)}</p>` : ''}
      ${instructions ? `<p class="mt-3 text-sm leading-6 text-gray-600">${esc(instructions)}</p>` : ''}
      ${url ? `
        <a href="${esc(url)}" target="_blank" rel="noopener" class="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-eu-orange px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-eu-purple focus:outline-none focus:ring-2 focus:ring-eu-orange focus:ring-offset-2">
          ${esc(ctaLabel)}
          <i data-lucide="arrow-right" class="h-4 w-4"></i>
        </a>` : ''}
    </section>`;
}

function collectRelatedEntries(value, found = []) {
  if (!value) return found;
  if (Array.isArray(value)) {
    value.forEach(entry => collectRelatedEntries(entry, found));
    return found;
  }
  if (typeof value !== 'object') return found;
  if (Array.isArray(value.related)) {
    value.related.forEach(entry => found.push(entry));
  }
  Object.entries(value).forEach(([key, entry]) => {
    if (key !== 'related') collectRelatedEntries(entry, found);
  });
  return found;
}

function renderTraceabilityPanel(item) {
  const related = collectRelatedEntries(item.detail || {})
    .map(entry => pickLang(entry?.label || entry?.title || entry?.name || entry))
    .filter(Boolean);
  if (!related.length) return '';
  return `
    <section class="rounded-2xl border border-eu-border bg-white p-5 shadow-sm">
      <h2 class="text-base font-extrabold text-eu-text">${esc(uiText('relationships'))}</h2>
      <ul class="mt-3 space-y-2">
        ${related.slice(0, 6).map(label => `
          <li class="flex gap-2 text-sm leading-6 text-gray-700">
            <i data-lucide="link-2" class="mt-1 h-4 w-4 shrink-0 text-eu-blue"></i>
            <span>${esc(label)}</span>
          </li>`).join('')}
      </ul>
    </section>`;
}

function renderOperationalSummary(item) {
  const isValidation = item.type === 'validation';
  const entity = isValidation
    ? (pickLang(item.ownership?.proposer?.name) || pickLang(item.core?.entity?.name))
    : pickLang(item.core?.entity?.name);
  const status = isValidation
    ? (pickLang(item.validationStageLabel) || getStatusLabel(item.core?.status))
    : getStatusLabel(item.core?.status);
  const typeLabel = isValidation
    ? (pickLang(item.validationTypeLabel) || getTypeLabel(item.type))
    : getTypeLabel(item.type);
  const sector = getSectorLabel(item.core?.sector);
  const isChallenge = item.type === 'challenge';
  const maturity = isChallenge ? getEvidenceLabel(item.classification?.evidenceMaturity) : '';
  const engagement = isChallenge
    ? asArray(item.classification?.contributionTypes)
        .map(id => getLabelFromArray(MARKETPLACE_CONFIG.contributionTypeLabels, id))
        .filter(Boolean).join(' · ')
    : '';
  const created = pickLang(item.core?.publishedAtLabel);
  const updated = pickLang(item.core?.revisionDateLabel);
  const window = isValidation ? pickLang(item.validationWindow?.label) : '';

  const metaRows = [
    sector && [uiText('sector') || 'Sector', sector],
    window && [pickLang({ es: 'Ventana', en: 'Window', va: 'Finestra' }), window],
    maturity && [pickLang({ es: 'Madurez', en: 'Maturity', va: 'Maduresa' }), maturity],
    engagement && [pickLang({ es: 'Contribución esperada', en: 'Expected contribution', va: 'Contribució esperada' }), engagement],
    created && [pickLang(UI_TEXT.created), created],
    updated && [pickLang(UI_TEXT.updated), updated],
  ].filter(Boolean);

  return `
    <section class="rounded-2xl border border-eu-border bg-white p-5 shadow-sm">
      <div class="mb-4 flex flex-wrap items-center gap-2">
        ${status ? renderBadge(status, 'bg-eu-blue/10 text-eu-blue border-eu-blue/20') : ''}
        ${typeLabel ? renderBadge(typeLabel, 'bg-eu-bg text-gray-600 border-eu-border') : ''}
      </div>
      ${entity ? `
        <div class="flex items-start gap-2">
          <i data-lucide="building-2" class="mt-0.5 h-4 w-4 shrink-0 text-eu-blue"></i>
          <p class="text-sm font-bold leading-snug text-eu-text">${esc(entity)}</p>
        </div>` : ''}
      ${metaRows.length ? `
        <dl class="mt-4 space-y-2 border-t border-eu-border pt-4">
          ${metaRows.map(([label, value]) => `
            <div class="flex items-baseline justify-between gap-2">
              <dt class="shrink-0 text-xs font-bold uppercase tracking-wide text-gray-400">${esc(label)}</dt>
              <dd class="text-right text-xs font-semibold text-gray-700">${esc(value)}</dd>
            </div>`).join('')}
        </dl>` : ''}
    </section>`;
}

function renderValue(value) {
  if (value === null || value === undefined || value === '' || value === false) return '';
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return esc(value);
  if (Array.isArray(value)) {
    const rendered = value.map(renderValue).filter(Boolean);
    if (!rendered.length) return '';
    return `<ul class="list-disc space-y-1 pl-5">${rendered.map(entry => `<li>${entry}</li>`).join('')}</ul>`;
  }
  if (isLocalizedObject(value)) return esc(pickLang(value));
  const entries = Object.entries(value)
    .map(([key, entry]) => [key, renderValue(entry)])
    .filter(([, rendered]) => rendered);
  if (!entries.length) return '';
  return `
    <dl class="space-y-3">
      ${entries.map(([key, rendered]) => `
        <div>
          <dt class="text-xs font-bold uppercase tracking-wide text-gray-500">${esc(getFieldLabel(key))}</dt>
          <dd class="mt-1">${rendered}</dd>
        </div>`).join('')}
    </dl>`;
}

function isLocalizedObject(value) {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value) && ['es', 'en', 'va'].some(key => key in value));
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

function scrollToTop(preferredBehavior = 'auto') {
  const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : preferredBehavior });
}

export function render() {
  const selected = getItemById(getState('selectedChallengeId'));
  return selected ? renderDetail(selected) : renderList();
}

export function mount() {
  const tabButtons = [...document.querySelectorAll('[data-mp-tab]')];
  tabButtons.forEach((button, idx) => {
    button.addEventListener('click', () => {
      setState('marketplaceTab', button.dataset.mpTab);
      setState('selectedChallengeId', null);
      rerender();
      scrollToTop('smooth');
    });
    button.addEventListener('keydown', event => {
      let next = -1;
      if (event.key === 'ArrowRight') next = (idx + 1) % tabButtons.length;
      if (event.key === 'ArrowLeft') next = (idx - 1 + tabButtons.length) % tabButtons.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabButtons.length - 1;
      if (next >= 0) {
        event.preventDefault();
        tabButtons[next].focus();
        setState('marketplaceTab', tabButtons[next].dataset.mpTab);
        setState('selectedChallengeId', null);
        rerender();
        scrollToTop('smooth');
      }
    });
  });

  document.querySelectorAll('.mp-view-detail').forEach(button => {
    button.addEventListener('click', () => {
      setState('selectedChallengeId', button.dataset.id);
      window.history.pushState({ itemId: button.dataset.id }, '', window.location.pathname);
      rerender();
      scrollToTop();
    });
  });

  document.getElementById('mp-back')?.addEventListener('click', () => {
    setState('selectedChallengeId', null);
    window.history.pushState({}, '', window.location.pathname);
    rerender();
    scrollToTop();
  });

  document.getElementById('mp-tab-search')?.addEventListener('input', event => {
    const tabId = getActiveTabId();
    const state = getTabFilterState(tabId);
    state.search = event.target.value;
    setTabFilterState(tabId, state);
    resetTabPagination(tabId);
    document.getElementById('mp-clear-search')?.classList.toggle('hidden', !state.search);
    updateTabResults();
  });

  document.getElementById('mp-clear-search')?.addEventListener('click', () => {
    const tabId = getActiveTabId();
    const state = getTabFilterState(tabId);
    state.search = '';
    setTabFilterState(tabId, state);
    resetTabPagination(tabId);
    rerender();
  });

  document.getElementById('mp-toggle-filters')?.addEventListener('click', () => {
    const tabId = getActiveTabId();
    const key = getFilterPanelStateKey(tabId);
    setState(key, getState(key) !== true);
    rerender();
  });

  document.querySelectorAll('[data-mp-filter]').forEach(select => {
    select.addEventListener('change', () => {
      const tabId = getActiveTabId();
      const state = getTabFilterState(tabId);
      state.values = { ...(state.values || {}), [select.dataset.mpFilter]: select.value };
      if (!select.value) delete state.values[select.dataset.mpFilter];
      setTabFilterState(tabId, state);
      resetTabPagination(tabId);
      updateTabResults();
    });
  });

  attachMarketplaceFilterActionListeners();
  attachMarketplacePaginationListeners();

  window.onpopstate = () => {
    if (!getState('selectedChallengeId')) return;
    setState('selectedChallengeId', null);
    rerender();
  };
}

function attachMarketplaceFilterActionListeners() {
  document.querySelectorAll('[data-mp-chip-filter]').forEach(chip => {
    chip.addEventListener('click', e => {
      e.stopPropagation();
      const key = chip.dataset.mpChipFilter;
      const value = chip.dataset.mpChipValue;
      const tabId = getActiveTabId();
      if (!getFilterDefinitions(tabId).some(d => d.key === key)) return;
      const state = getTabFilterState(tabId);
      if (!state.values) state.values = {};
      if (String(state.values[key]) === String(value)) {
        delete state.values[key];
      } else {
        state.values[key] = value;
      }
      setTabFilterState(tabId, state);
      resetTabPagination(tabId);
      rerender();
    });
  });

  document.querySelectorAll('#mp-clear-tab-filters').forEach(button => {
    button.addEventListener('click', () => {
      const tabId = getActiveTabId();
      clearTabFilterState(tabId);
      resetTabPagination(tabId);
      rerender();
    });
  });

  document.querySelectorAll('[data-mp-remove-filter]').forEach(button => {
    button.addEventListener('click', () => {
      const tabId = getActiveTabId();
      const state = getTabFilterState(tabId);
      const key = button.dataset.mpRemoveFilter;
      if (key === 'search') {
        state.search = '';
      } else if (state.values) {
        delete state.values[key];
      }
      setTabFilterState(tabId, state);
      resetTabPagination(tabId);
      rerender();
    });
  });
}

function updateTabResults() {
  const activeTab = getActiveTab();
  if (!activeTab) return;
  const items = getItemsForTab(activeTab.id);
  const target = document.getElementById('mp-tab-results');
  if (!target) return;
  target.innerHTML = renderTabResults(activeTab, items);
  const activeFilters = document.getElementById('mp-active-filters');
  if (activeFilters) activeFilters.innerHTML = renderActiveFilterChips(activeTab, items);
  const filterCount = document.getElementById('mp-filter-count');
  if (filterCount) filterCount.textContent = renderFilterCountSuffix(getActiveFilterChips(activeTab.id, items).length);
  attachMarketplaceFilterActionListeners();
  attachMarketplacePaginationListeners();
  document.querySelectorAll('#mp-tab-results .mp-view-detail').forEach(button => {
    button.addEventListener('click', () => {
      setState('selectedChallengeId', button.dataset.id);
      window.history.pushState({ itemId: button.dataset.id }, '', window.location.pathname);
      rerender();
      scrollToTop();
    });
  });
  if (window.lucide) window.lucide.createIcons();
}

function attachMarketplacePaginationListeners() {
  document.querySelectorAll('[data-mp-pagesize]').forEach(button => {
    button.addEventListener('click', () => {
      const tabId = getActiveTabId();
      const raw = button.dataset.mpPagesize;
      setState(getTabPageSizeStateKey(tabId), raw === 'all' ? 'all' : Number(raw));
      resetTabPagination(tabId);
      updateTabResults();
    });
  });

  document.querySelectorAll('[data-mp-page]').forEach(button => {
    button.addEventListener('click', () => {
      const tabId = getActiveTabId();
      const current = getState(getTabPageStateKey(tabId)) || 0;
      setState(getTabPageStateKey(tabId), button.dataset.mpPage === 'next' ? current + 1 : Math.max(0, current - 1));
      updateTabResults();
    });
  });
}

function rerender() {
  const main = document.getElementById('main-root');
  if (!main) return;
  main.innerHTML = render();
  mount();
  if (window.lucide) window.lucide.createIcons();
}
