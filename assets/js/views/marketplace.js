import { t } from '../i18n.js';
import { getState, setState } from '../state.js';
import { getViewParams } from '../router.js';
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
    es: 'Madurez tecnológica',
    en: 'Technology readiness',
    va: 'Maduresa tecnològica',
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
  validationEnvironment: { es: 'Entorno de validación', en: 'Validation environment', va: "Entorn de validació" },
  decisionSection: { es: 'Decisión', en: 'Decision', va: 'Decisió' },
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
  trl: { es: 'Madurez tecnológica', en: 'Technology readiness', va: 'Maduresa tecnològica' },
  valorisation: { es: 'Valorizacion', en: 'Valorisation', va: 'Valoritzacio' },
  validationStatus: { es: 'Estado de validacion', en: 'Validation status', va: 'Estat de validacio' },
};

const TRANSFER_TYPE_ICONS = {
  implementación: 'wrench',
  adaptación: 'git-branch',
  capacitación: 'graduation-cap',
  escalado: 'trending-up',
};

const CARD_CHIP_MAX = MARKETPLACE_CONFIG.cardChipMax ?? 4;

const LEVEL_STYLES = {
  FP:       'bg-[#FFF4E1] text-eu-purple border-eu-purple/20',
  vet:      'bg-[#FFF4E1] text-eu-purple border-eu-purple/20',
  Máster:   'bg-eu-purple/10 text-eu-purple border-eu-purple/20',
  master:   'bg-eu-purple/10 text-eu-purple border-eu-purple/20',
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
    badge: 'bg-eu-blue text-white border-eu-blue',
  },
  cases: {
    badge: 'bg-eu-purple text-white border-eu-purple',
  },
  pilots: {
    badge: 'bg-eu-blue text-white border-eu-blue',
  },
  validations: {
    badge: 'bg-eu-purple text-white border-eu-purple',
  },
  mentorings: {
    badge: 'bg-eu-blue text-white border-eu-blue',
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

function simpleMarkdown(text) {
  if (!text) return '';
  return esc(text)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>');
}

function asArray(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function getLabelFromArray(arr, id, fallback = '') {
  const rawId = id == null ? '' : String(id);
  const match = arr?.find(item => String(item.id) === rawId);
  return pickLang(match?.label, fallback || id);
}

function getTypeLabel(id) {
  return getLabelFromArray(MARKETPLACE_CONFIG.trackBTypeLabels || MARKETPLACE_CONFIG.typeLabels, id);
}

function getStatusLabel(id) {
  return getLabelFromArray(MARKETPLACE_CONFIG.statusLabels, id);
}

function getMentoringTypeLabel(id) {
  return getLabelFromArray(MARKETPLACE_CONFIG.mentoringTypeLabels || MARKETPLACE_CONFIG.labels?.mentoringType, id, '');
}

function getMentoringStatusLabel(id) {
  return getLabelFromArray(MARKETPLACE_CONFIG.mentoringStatusLabels || MARKETPLACE_CONFIG.statusLabels, id, '');
}

function getMentoringSpecialtyLabel(id) {
  return getLabelFromArray(MARKETPLACE_CONFIG.mentoringSpecialtyLabels || MARKETPLACE_CONFIG.labels?.mentoringSpecialty, id, '');
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
    planned:    'bg-[#FFF4E1] text-eu-purple border-eu-purple/20',
    open:       'bg-eu-blue/10 text-eu-blue border-eu-blue/20',
    'in-progress': 'bg-eu-blue/10 text-eu-blue border-eu-blue/20',
    completed:  'bg-eu-purple/10 text-eu-purple border-eu-purple/20',
    published:  'bg-eu-purple/10 text-eu-purple border-eu-purple/20',
    scaled:     'bg-eu-purple/10 text-eu-purple border-eu-purple/20',
    archived:   'bg-[#FFF4E1] text-eu-purple/70 border-eu-purple/15',
  };
  return tones[stage] || 'bg-[#FFF4E1] text-eu-purple border-eu-purple/20';
}

function getEducationalReadinessLabel(id) {
  return getLabelFromArray(MARKETPLACE_CONFIG.labels?.educationalReadiness, id);
}

function getTechnologyReadinessLabel(id) {
  return getLabelFromArray(MARKETPLACE_CONFIG.labels?.technologyReadiness || MARKETPLACE_CONFIG.technologyReadinessLabels, id);
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
  return getStatusLabel(id);
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
  return tabs[0]?.id || 'mentorings';
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
    <section class="rd-hero-gradient px-6 py-20 text-white relative overflow-hidden">
      <div class="absolute -right-20 -bottom-20 w-80 h-80 bg-white/5 rounded-full blur-2xl"></div>
      <div class="absolute left-10 top-5 w-40 h-40 bg-eu-yellow/5 rounded-full blur-xl"></div>
      <div class="mx-auto max-w-7xl relative z-10">
        <div class="mb-8 max-w-4xl">
          <p class="inline-block rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] backdrop-blur" style="color:#FFF4E1">${esc(pickLang(MARKETPLACE_CONFIG.publicSectionName?.nav, 'Comunidad'))}</p>
          <h1 class="mt-6 max-w-4xl font-extrabold leading-tight" style="color:#FFF4E1;letter-spacing:-.025em;font-size:clamp(2.5rem,5vw,3.75rem);line-height:1.05">${esc(title)}</h1>
          ${description ? `<p class="mt-6 max-w-3xl text-lg leading-relaxed text-white/90">${esc(description)}</p>` : ''}
        </div>
        ${stats.length ? `
          <div class="rd-hero-stats-grid">
            ${stats.map(stat => `
              <div class="rd-hero-stat text-center">
                <p class="text-4xl font-extrabold leading-none text-white">${esc(stat.value)}</p>
                <p class="mt-2 text-xs font-bold uppercase tracking-wider" style="color:rgba(255,244,225,.75)">${esc(pickLang(stat.label))}</p>
              </div>`).join('')}
          </div>` : ''}
      </div>
    </section>`;
}

function renderTabs(activeId) {
  const tabs = getTabs();
  const ariaLabel = pickLang(MARKETPLACE_CONFIG.publicSectionName?.nav, 'Comunidad');
  return `
    <div class="rd-canvas px-6 pt-12">
      <div class="mx-auto max-w-7xl">
        <div class="flex flex-wrap gap-2" role="tablist" aria-label="${esc(ariaLabel)}">
        ${tabs.map(tab => {
          const active = tab.id === activeId;
          return `
            <button type="button" role="tab" aria-selected="${active ? 'true' : 'false'}"
              id="mp-tab-${esc(tab.id)}" aria-controls="mp-tabpanel-${esc(tab.id)}"
              data-mp-tab="${esc(tab.id)}"
              class="flex min-h-11 items-center gap-2 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-bold transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-eu-blue focus:ring-offset-2 ${
                active
                  ? 'border-eu-blue bg-eu-blue text-white shadow-sm'
                  : 'border-eu-yellow bg-eu-yellow/70 text-eu-purple hover:border-eu-purple/30 hover:bg-eu-yellow'
              }">
              <i data-lucide="${esc(tab.icon || 'layers-3')}" class="h-4 w-4"></i>
              ${esc(pickLang(tab.label, tab.id))}
            </button>`;
        }).join('')}
        </div>
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

function applyRouteParams() {
  const params = getViewParams() || {};
  if (!params.sector || params._appliedMarketplaceFilters) return;
  const tabId = params.tab || getState('marketplaceTab') || getActiveTabId();
  const state = getTabFilterState(tabId);
  state.values = { ...(state.values || {}), sector: params.sector };
  setTabFilterState(tabId, state);
  setState('marketplaceTab', tabId);
  resetTabPagination(tabId);
  params._appliedMarketplaceFilters = true;
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

function isLocalizedObject(value) {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value) && ['es', 'en', 'va'].some(key => key in value));
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
  if (key === 'window') return item.core?.status || pickLang(card.validationStatus) || formatExecutionWindow(card.executionWindow);
  if (key === 'specialty') {
    if (item.type === 'mentoring' && asArray(item.mentors?.items).length) {
      return [...new Set(asArray(item.mentors?.items).flatMap(m => asArray(m?.specialties)))];
    }
    return asArray(card.specialties);
  }
  if (key === 'mentoringType') return item.core?.mentoringType || '';
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
  if (key === 'validationStage') return item.core?.status || '';
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
    ];
  }
  if (tabId === 'validations') {
    return [
      { key: 'validationType', label: uiText('filterBy') + ' ' + pickLang({ es: 'Tipo', en: 'Type', va: 'Tipus' }), labeler: getValidationTypeLabel },
      common.status,
      common.sector,
    ];
  }
  if (tabId === 'mentorings') {
    return [
      { key: 'mentoringType', label: uiText('filterBy') + ' ' + pickLang({ es: 'Tipo', en: 'Type', va: 'Tipus' }), labeler: getMentoringTypeLabel },
      common.status,
      common.sector,
      { key: 'specialty', label: uiText('filterBy') + ' ' + pickLang(FIELD_LABELS.specialties), labeler: value => getMentoringSpecialtyLabel(value) || value },
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
    <div class="mt-4 flex flex-wrap items-center gap-2 rounded-2xl border border-eu-blue/15 bg-eu-blue/5 px-4 py-3">
      <span class="text-sm font-bold text-gray-700">${esc(uiText('activeFilters'))}:</span>
      ${chips.map(chip => `
        <button type="button"
          data-mp-remove-filter="${esc(chip.key)}"
          ${chip.value ? `data-mp-filter-value="${esc(chip.value)}"` : ''}
          class="inline-flex min-h-8 items-center gap-1.5 rounded-full border border-eu-blue/25 bg-white px-3 py-1 text-sm font-bold text-eu-blue transition-colors hover:border-eu-blue hover:bg-eu-blue/10 focus:outline-none focus:ring-2 focus:ring-eu-blue focus:ring-offset-2">
          <span>${esc(chip.label)}</span>
          <i data-lucide="x" class="h-3.5 w-3.5"></i>
        </button>`).join('')}
      <button id="mp-clear-tab-filters" type="button"
        class="ml-auto inline-flex min-h-8 items-center gap-1.5 rounded-full border border-eu-purple/25 bg-white px-3 py-1 text-sm font-bold text-eu-purple transition-colors hover:bg-eu-purple/10 focus:outline-none focus:ring-2 focus:ring-eu-blue focus:ring-offset-2">
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
    <div class="mt-6 rounded-[2rem] border border-eu-purple/10 p-4 sm:p-5 rd-card-grad-beige">
      <div class="grid gap-3 sm:grid-cols-[minmax(18rem,1fr)_auto] sm:items-start">
        <label class="block w-full">
          <span class="sr-only">${esc(uiText('search'))}</span>
          <span class="relative flex min-h-11 w-full items-center rounded-full border border-eu-purple/20 bg-white shadow-sm transition-colors focus-within:border-eu-blue focus-within:ring-2 focus-within:ring-eu-blue">
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
            class="inline-flex min-h-11 w-fit cursor-pointer items-center gap-2 rounded-full border border-eu-blue/20 bg-white px-4 py-2 text-sm font-bold text-eu-blue shadow-sm transition-colors hover:border-eu-blue hover:bg-eu-blue/5 focus:outline-none focus:ring-2 focus:ring-eu-blue focus:ring-offset-2">
              <i data-lucide="sliders-horizontal" class="h-4 w-4"></i>
              <span>${esc(uiText('moreFilters'))}<span id="mp-filter-count">${esc(renderFilterCountSuffix(activeCount))}</span></span>
              <i data-lucide="chevron-down" class="h-4 w-4 transition-transform ${filtersOpen ? 'rotate-180' : ''}"></i>
          </button>` : ''}
      </div>
      ${filterControls && filtersOpen ? `
        <div class="mt-4 rounded-3xl border border-eu-purple/10 bg-white p-4 shadow-sm sm:p-5">
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
      <div class="rd-card-grad-violet rounded-2xl border border-dashed border-eu-purple/20 p-8 text-center shadow-sm">
        <i data-lucide="search-x" class="mx-auto h-8 w-8 text-eu-purple/60"></i>
        <h3 class="mt-3 text-lg font-extrabold text-eu-text">${esc(uiText('noResults'))}</h3>
        <p class="mx-auto mt-2 max-w-xl text-base leading-6 text-gray-600">${esc(pickLang(tab.emptyState?.message))}</p>
      </div>`;
  }
  return `
    ${resultsHeader}
    <div class="grid grid-cols-1 gap-6 md:grid-cols-2">${paginated.map(item => renderItemCard(item, tab)).join('')}</div>
    ${paginationControls}`;
}

function renderCardShell(item, tab, body, options = {}) {
  const title = pickLang(options.title, pickLang(item.core?.title, item.id));
  const subtitle = pickLang(options.subtitle);
  const entity = options.entity !== undefined ? options.entity : pickLang(item.core?.entity?.name);
  const dateLabel = getItemDateLabel(item);
  const tone = TAB_TONES[tab.id] || TAB_TONES.challenges;
  const statusRaw = options.statusValue !== undefined ? options.statusValue : item.core?.status;
  const statusLabel = options.statusLabel !== undefined ? options.statusLabel : getStatusLabel(statusRaw);
  const statusFilterKey = options.statusFilterKey !== undefined
    ? options.statusFilterKey
    : (getFilterDefinitions(tab.id).some(d => d.key === 'status') ? 'status' : '');

  return `
    <article class="rd-card-mp rd-card-mp-hover group flex h-full flex-col overflow-hidden">
      <div class="rd-card-mp-ceja">
        <h3 class="rd-card-mp-title">${esc(title)}</h3>
      </div>
      <div class="flex flex-1 flex-col p-7 pt-5">
        <div class="flex flex-wrap gap-2">
          ${options.hideTypeBadge ? '' : renderBadge(getTypeLabel(item.type), tone.badge)}
          ${options.showStatusBadge !== false ? renderBadge(statusLabel, options.statusBadgeTone || 'bg-white/70 text-eu-purple border-eu-purple/25', statusFilterKey, statusRaw) : ''}
          ${options.extraBadge ? renderBadge(options.extraBadge, options.extraBadgeTone || 'bg-white/70 text-eu-purple border-eu-purple/25', options.extraBadgeFilterKey || '', options.extraBadgeFilterValue || '') : ''}
          ${options.extraBadge2 ? renderBadge(options.extraBadge2, options.extraBadge2Tone || 'bg-white/70 text-eu-purple border-eu-purple/25', options.extraBadge2FilterKey || '', options.extraBadge2FilterValue || '') : ''}
        </div>
        <div class="mt-4 flex-1">
          ${subtitle ? `<p class="text-base leading-relaxed text-gray-600">${esc(subtitle)}</p>` : ''}
          ${body}
        </div>
        ${renderCardFooter(item, tab, entity, dateLabel)}
      </div>
    </article>`;
}

// Acciones de card: descargar ficha (si hay archivo) y solicitar adhesión (si hay
// URL). Cada una solo aparece si su dato existe; si no, no ocupa espacio.
function renderCardActions(item) {
  const fichaUrl = item.ficha?.publicPath || '';
  const adhesionUrl = (item.adhesionForm?.url || '').trim();
  const parts = [];
  if (fichaUrl) {
    const label = pickLang({ es: 'Descargar ficha', en: 'Download brief', va: 'Descarregar fitxa' });
    parts.push(`<a href="${esc(fichaUrl)}" download class="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-eu-blue hover:text-eu-purple focus:outline-none focus:ring-2 focus:ring-eu-blue focus:ring-offset-2 rounded">${esc(label)} <i data-lucide="download" class="h-4 w-4"></i></a>`);
  }
  if (adhesionUrl) {
    const label = pickLang({ es: 'Solicitar adhesión', en: 'Request membership', va: 'Sol·licitar adhesió' });
    parts.push(`<a href="${esc(adhesionUrl)}" target="_blank" rel="noopener noreferrer" class="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-eu-blue hover:text-eu-purple focus:outline-none focus:ring-2 focus:ring-eu-blue focus:ring-offset-2 rounded">${esc(label)} <i data-lucide="external-link" class="h-4 w-4"></i></a>`);
  }
  return parts.join('');
}

function renderCardFooter(item, tab, entity, dateLabel) {
  // El CTA al detalle interno se retiró (Fase 2). La card solo ofrece las
  // acciones de ficha/adhesión; si no hay ninguna, el bloque de acciones queda vacío.
  const actions = renderCardActions(item);
  const hasInfo = entity || dateLabel;
  if (!hasInfo && !actions) return '';
  return `
    <div class="mt-5 border-t border-eu-purple/12 pt-4">
      ${hasInfo ? `<div class="mb-3 text-sm text-gray-600">
        ${entity ? `<p class="text-xs font-bold uppercase tracking-wide text-eu-purple/60">${esc(pickLang(FIELD_LABELS.entity))}</p><p class="mt-0.5 font-semibold text-eu-text">${esc(entity)}</p>` : ''}
        ${dateLabel ? `<p class="${entity ? 'mt-2' : ''} text-xs font-semibold text-gray-500">${esc(dateLabel)}</p>` : ''}
      </div>` : ''}
      ${actions ? `<div class="flex flex-wrap items-center justify-end gap-x-4 gap-y-2">${actions}</div>` : ''}
    </div>`;
}

function renderCardCallout(label, value, icon = 'sparkles', strict = false, tone = {}) {
  const text = strict ? pickLangStrict(value) : pickLang(value);
  if (!text) return '';
  const boxClass = tone.boxClass || 'rd-card-grad-violet border border-eu-purple/10 border-l-4 border-l-eu-blue';
  const labelClass = tone.labelClass || 'text-eu-blue';
  const valueClass = tone.valueClass || 'text-eu-text';
  return `
    <div class="mt-4 rounded-xl p-4 ${boxClass}">
      <p class="flex items-center gap-2 text-xs font-bold uppercase tracking-wide ${labelClass}">
        <i data-lucide="${esc(icon)}" class="h-3.5 w-3.5"></i>
        ${esc(label)}
      </p>
      <p class="mt-1 text-base font-semibold leading-relaxed ${valueClass}">${esc(text)}</p>
    </div>`;
}

function renderCardMiniMeta(items) {
  const visible = items.filter(item => item.htmlValue || (item.value !== undefined && item.value !== null && item.value !== ''));
  if (!visible.length) return '';
  return `
    <div class="mt-4 grid gap-3">
      ${visible.map(item => `
        <div class="rounded-xl border px-3.5 py-2.5 ${item.boxClass || 'border-eu-purple/15 bg-white'}">
          <p class="text-xs font-semibold uppercase tracking-wide ${item.labelClass || 'text-eu-purple/70'}">${esc(item.label)}</p>
          ${item.htmlValue
            ? `<div class="mt-1 ${item.valueClass || 'text-base text-gray-600'}">${item.htmlValue}</div>`
            : `<p class="mt-0.5 text-base leading-relaxed ${item.valueClass || 'text-gray-700'}">${esc(item.value)}</p>`}
          ${item.secondaryValue ? `<p class="mt-1 text-base leading-relaxed ${item.secondaryValueClass || 'text-gray-600'}">${esc(item.secondaryValue)}</p>` : ''}
          ${item.tertiaryValue ? `<div class="${item.tertiaryWrapClass || 'mt-2 border-t border-slate-100 pt-2'}"><p class="text-sm leading-5 ${item.tertiaryValueClass || 'text-gray-700'}">${esc(item.tertiaryValue)}</p></div>` : ''}
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
  const inner = items.map(({ label, value }) => renderBadge(label, 'bg-eu-blue/10 text-eu-blue border-eu-blue/20', filterKey, value)).join('');
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
    const level = trl.level ? String(trl.level) : '';
    const officialLabel = getTechnologyReadinessLabel(level);
    const levelPrefix = level ? pickLang({
      es: `Nivel TRL ${level}`,
      en: `TRL level ${level}`,
      va: `Nivell TRL ${level}`,
    }) : '';
    if (level) return officialLabel ? `${levelPrefix} · ${officialLabel}` : levelPrefix;
    return officialLabel;
  }

function getEducationalReadinessDisplay(er) {
    if (!er) return '';
    const officialLabel = getEducationalReadinessLabel(er.level);
    return officialLabel || er.level || '';
  }

function getPilotSpecificReadinessText(pilotLabel, fallbackLabel = '') {
    const text = String(pilotLabel || '').trim();
    const fallback = String(fallbackLabel || '').trim();
    if (!text) return '';
    if (fallback && text === fallback) return '';
    return pickLang({
      es: `En este piloto: ${text}`,
      en: `In this pilot: ${text}`,
      va: `En aquest pilot: ${text}`,
    });
  }

function getPilotReadinessDetail(readiness) {
    const trl = readiness?.technologyReadiness;
    if (trl?.enabled && trl?.level) {
      const officialMeaning = getTechnologyReadinessLabel(trl.level);
      const pilotSpecific = getPilotSpecificReadinessText(pickLangStrict(trl.pilotLabel), officialMeaning);
      return {
        kindLabel: pickLang({
          es: 'Nivel de madurez tecnológica',
          en: 'Technology readiness level',
          va: 'Nivell de maduresa tecnològica',
        }),
        levelLabel: pickLang({
          es: `Nivel TRL ${trl.level}`.trim(),
          en: `TRL level ${trl.level}`.trim(),
          va: `Nivell TRL ${trl.level}`.trim(),
        }),
        officialMeaning,
        pilotSpecific,
      };
    }

    const er = readiness?.educationalReadiness;
    if (er?.enabled && er?.level) {
      const officialMeaning = getEducationalReadinessDisplay(er);
      const pilotSpecific = getPilotSpecificReadinessText(pickLangStrict(er.pilotLabel), officialMeaning);
      return {
        kindLabel: pickLang({
          es: 'Nivel de madurez educativa',
          en: 'Educational readiness level',
          va: 'Nivell de maduresa educativa',
        }),
        levelLabel: officialMeaning,
        officialMeaning: '',
        pilotSpecific,
      };
    }

    return null;
  }
  
function getPilotReadinessMeta(readiness) {
    const trl = readiness?.technologyReadiness;
    if (trl?.enabled && trl?.level) {
      const officialMeaning = getTechnologyReadinessLabel(trl.level);
      const pilotSpecific = getPilotSpecificReadinessText(pickLangStrict(trl.pilotLabel), officialMeaning);
      return {
        label: pickLang({
          es: 'Nivel de madurez tecnológica',
          en: 'Technology readiness level',
          va: 'Nivell de maduresa tecnològica',
        }),
        value: pickLang({
          es: `Nivel TRL ${trl.level}`.trim(),
          en: `TRL level ${trl.level}`.trim(),
          va: `Nivell TRL ${trl.level}`.trim(),
        }),
        secondaryValue: officialMeaning,
        tertiaryValue: pilotSpecific,
      };
    }
  
    const er = readiness?.educationalReadiness;
    if (er?.enabled && er?.level) {
      const officialValue = getEducationalReadinessDisplay(er);
      const pilotSpecific = getPilotSpecificReadinessText(pickLangStrict(er.pilotLabel), officialValue);
      return {
        label: pickLang({
          es: 'Nivel de madurez educativa',
          en: 'Educational readiness level',
          va: 'Nivell de maduresa educativa',
        }),
        value: officialValue,
        tertiaryValue: pilotSpecific,
      };
    }

  return null;
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
        <div class="flex flex-wrap gap-2">${compChips.map(c => renderBadge(c.label, 'bg-eu-purple/10 text-eu-purple border-eu-purple/20', 'competency', c.id)).join('')}</div>
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
    extraBadgeTone: 'bg-eu-blue/10 text-eu-blue border-eu-blue/20',
    extraBadgeFilterKey: maturityLabel ? 'maturity' : '',
    extraBadgeFilterValue: maturityLabel ? (item.core?.maturity || '') : '',
    entity: entityLabel,
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
      <div class="mt-4 rounded-lg rd-card-grad-violet p-4">
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
        <div class="flex flex-wrap gap-2">${sectorCodes.map((code, index) => renderBadge(sectorLabels[index], 'bg-eu-purple/10 text-eu-purple border-eu-purple/20', 'sector', code)).join('')}</div>
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
        <div class="flex flex-wrap gap-2">${renderBadge(evidenceLevelLabel, 'bg-eu-blue/10 text-eu-blue border-eu-blue/20', 'evidenceLevel', core.evidenceLevel)}</div>
      </div>`
    : '';

  const verifStatus = core.verificationStatus || cl.verificationStatus || '';
  const verifStatusLabel = getVerificationLabel(verifStatus);
  const verifActive = verifStatus && String(getTabFilterState(getActiveTabId()).values?.verificationStatus) === verifStatus;
  const verifBadge = (showEvidBadge && verifStatus && verifStatusLabel)
    ? `<span class="inline-flex items-center gap-1.5 rounded border border-eu-blue/20 bg-eu-blue/10 px-2 py-0.5 text-xs font-semibold text-eu-blue cursor-pointer select-none${verifActive ? ' ring-1 ring-inset ring-current' : ''}" data-mp-chip-filter="verificationStatus" data-mp-chip-value="${esc(verifStatus)}"><i data-lucide="shield-check" class="h-3 w-3"></i>${esc(verifStatusLabel)}</span>`
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

  const shellOptions = {
    title: core.title,
    subtitle: core.summary,
    showStatusBadge,
    extraBadge: showStageBadge ? (caseStageLabel || '') : '',
    extraBadgeTone: 'bg-eu-purple/10 text-eu-purple border-eu-purple/20',
    extraBadgeFilterKey: (showStageBadge && caseStageLabel) ? 'caseStage' : '',
    extraBadgeFilterValue: (showStageBadge && caseStageLabel) ? (core.caseStage || '') : '',
    entity: (ccv.ch_entity !== false && cardPres.showEntity !== false) ? (originName || publisherName) : null,
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
  const showSectorBadge = ccv.ch_pilot_sector !== false;
  const showReadiness = ccv.ch_pilot_readiness !== false && pres.showReadiness !== false;
  const showWindow = ccv.ch_pilot_window !== false && pres.showWindow !== false;
  const showInfrastructure = ccv.ch_pilot_infrastructure !== false && pres.showInfrastructure !== false;
  const showPilotStage = ccv.ch_pilot_stage !== false;
  const showPilotType = ccv.ch_pilot_type !== false;

  // ── Hypothesis (bloque principal de la card) ──────────────────────────────
  const resultBlockLabel = pickLang(pres.resultBlockLabel) || uiText('whatIsTested');
  const hypothesisHtml = renderCardCallout(
    resultBlockLabel,
    pilotPlan.hypothesis || core.summary,
    'flask-conical',
    false,
    {
      boxClass: 'bg-eu-blue/8 border border-eu-blue/15',
      labelClass: 'text-eu-blue',
      valueClass: 'text-eu-text',
    },
  );

  // ── Madurez (TRL o educacional) ───────────────────────────────────────────
  const readinessMeta = showReadiness ? getPilotReadinessMeta(readiness) : null;

  // ── Ventana temporal ──────────────────────────────────────────────────────
  const windowLabel = showWindow ? formatExecutionWindow(core.executionWindow) : '';

  // ── Mini-meta: readiness + ventana ────────────────────────────────────────
  const miniMetaHtml = renderCardMiniMeta([
    readinessMeta ? {
      label: readinessMeta.label,
      value: readinessMeta.value,
      secondaryValue: readinessMeta.secondaryValue,
      tertiaryValue: readinessMeta.tertiaryValue,
      boxClass: 'border-eu-purple/10 rd-card-grad-violet',
      labelClass: 'text-eu-purple/70',
      valueClass: 'text-slate-900',
      secondaryValueClass: 'text-slate-700',
      tertiaryValueClass: 'text-gray-600',
      tertiaryWrapClass: 'mt-2',
    } : null,
    windowLabel ? {
      label: uiText('window'),
      value: windowLabel,
      boxClass: 'border-eu-blue/15 bg-eu-blue/5',
      labelClass: 'text-eu-blue',
      valueClass: 'font-normal text-eu-text',
    } : null,
  ].filter(Boolean));

  // ── Infraestructura (max 3 chips) ─────────────────────────────────────────
  let infraHtml = '';
  if (showInfrastructure) {
    const infraLabels = asArray(impl.infrastructure).slice(0, CARD_CHIP_MAX)
      .map(i => typeof i === 'string' ? i : pickLang(i.label, i.label)).filter(Boolean);
    if (infraLabels.length) {
      infraHtml = `<div class="mt-4">
        <p class="mb-1.5 text-xs font-bold uppercase tracking-wide text-gray-500">${esc(uiText(infraLabels.length > 1 ? 'infrastructures' : 'infrastructure'))}</p>
        <div class="flex flex-wrap gap-2">${infraLabels.map(l => renderBadge(l, 'bg-eu-blue/10 text-eu-blue border-eu-blue/20')).join('')}</div>
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
      kpiHtml = renderCardCallout(uiText('pilotCriteria'), pilotPlan.successCriteria[0].label, 'target', false, {
        boxClass: 'bg-eu-purple/8 border border-eu-purple/20',
        labelClass: 'text-eu-purple',
        valueClass: 'text-eu-text',
      });
    }
  }

  // ── Badges: stage + type as parallel pilot metadata ──────────────────────
  const pilotTypeLabel = getPilotTypeLabel(core.pilotType);
  const stageLabel = getPilotStageLabel(core.pilotStage);
  const pilotMetaBadges = [
    (showPilotStage && stageLabel)
      ? renderBadge(
          `${uiText('pilotStageLabel')}: ${stageLabel}`,
          'bg-eu-blue/10 text-eu-blue border-eu-blue/20',
          'pilotStage',
          core.pilotStage,
        )
      : '',
    (showPilotType && pilotTypeLabel)
      ? renderBadge(
          `${uiText('pilotType')}: ${pilotTypeLabel}`,
          'bg-eu-purple/10 text-eu-purple border-eu-purple/20',
          'pilotType',
          core.pilotType,
        )
      : '',
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

  const leadName = pickLang(item.ownership?.lead?.name, item.ownership?.lead?.name || '');
  const entityLabel = (ccv.ch_entity !== false && pres.showEntity !== false) ? leadName : null;

  return renderCardShell(item, tab, body, {
    title: core.title,
    subtitle: core.summary,
    showStatusBadge: ccv.ch_pilot_status !== false,
    statusBadgeTone: 'bg-eu-blue/10 text-eu-blue border-eu-blue/20',
    extraBadge: showSectorBadge ? sectorLabel : '',
    extraBadgeTone: 'bg-eu-purple/10 text-eu-purple border-eu-purple/20',
    extraBadgeFilterKey: showSectorBadge && sectorLabel ? 'sector' : '',
    extraBadgeFilterValue: showSectorBadge && sectorLabel ? getSectorCode(sectorCode) : '',
    entity: entityLabel,
    hideTypeBadge: true,
  });
}

function renderPilotCardLegacy(item, tab) {
  const ccv = MARKETPLACE_CONFIG.cardChipVisibility || {};
  const card = item.card || {};
  const pilotTypeLabel = getPilotTypeLabel(item.core?.pilotType);
  const helixChips = asArray(item.core?.helix).map(h => renderBadge(getHelixLabel(h), 'bg-eu-bg text-gray-700 border-eu-border', 'helix', h)).filter(Boolean).join('');
  const body = `
    ${renderCardCallout(uiText('direction'), card.collaborationDirection || item.core?.summary, 'route')}
    ${renderCardMiniMeta([
      { label: uiText('trl'), value: getTrlLabel(card.trl) },
      { label: uiText('window'), value: formatExecutionWindow(card.executionWindow) || pickLang(card.validationStatus) },
      { label: uiText('infrastructure'), value: asArray(card.infrastructure).slice(0, CARD_CHIP_MAX).join(' / ') },
    ])}
    ${pilotTypeLabel || helixChips ? `
      <div class="mt-4 flex flex-wrap gap-2">
        ${pilotTypeLabel ? renderBadge(pilotTypeLabel, 'bg-eu-blue/10 text-eu-blue border-eu-blue/20', 'pilotType', item.core?.pilotType) : ''}
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
    ? `<div class="mt-4 rounded-lg rd-card-grad-violet p-4">
        <p class="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-gray-500">
          <i data-lucide="clipboard-check" class="h-3.5 w-3.5"></i>
          ${esc(mainBlockLabel)}
        </p>
        <p class="mt-1 text-sm font-semibold leading-6 text-eu-text">${esc(objectTitle)}</p>
      </div>`
    : '';

  // ── Ventana de validación (computed top-level, not in core) ──────────────
  const showWindow = ccv.ch_val_window !== false && pres.showWindow !== false;
  const windowLabel = showWindow ? formatExecutionWindow(item.validationWindow) : '';

  // ── Entorno de validación (max 3 chips) ───────────────────────────────────
  let envHtml = '';
  if (ccv.ch_val_environment !== false && pres.showValidationEnvironment !== false) {
    const envItems = asArray(validation.validationEnvironment).slice(0, CARD_CHIP_MAX)
      .map(e => pickLangStrict(e.label)).filter(Boolean);
    if (envItems.length) {
      const envSectionLabel = uiText('validationEnvironment');
      envHtml = `<div class="mt-4">
        <p class="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-gray-500">
          <i data-lucide="layers" class="h-3.5 w-3.5 shrink-0"></i>
          ${esc(envSectionLabel)}
        </p>
        <div class="flex flex-wrap gap-2">${envItems.map(l => renderBadge(l, 'bg-[#FFF4E1] text-eu-purple border-eu-purple/20')).join('')}</div>
      </div>`;
    }
  }

  // ── Decisión ──────────────────────────────────────────────────────────────
  const decisionLabel = pickLang(decision.label);
  const _decToneKey = decision.tone || 'neutral';
  const _decTone = _decToneKey === 'positive'
    ? 'bg-eu-blue/10 text-eu-blue border-eu-blue/20'
    : _decToneKey === 'negative'
      ? 'bg-eu-purple/10 text-eu-purple border-eu-purple/20'
      : 'bg-[#FFF4E1] text-eu-purple/80 border-eu-purple/15';
  const _decIcon = _decToneKey === 'positive' ? 'check-circle-2' : _decToneKey === 'negative' ? 'x-circle' : 'circle-dot';
  const decisionHtml = (ccv.ch_val_decision !== false && pres.showDecision !== false && decisionLabel)
    ? `<div class="mt-4 rounded-lg border px-3 py-2 ${_decTone}">
        <p class="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide opacity-70">
          <i data-lucide="${esc(_decIcon)}" class="h-3.5 w-3.5 shrink-0"></i>
          ${esc(uiText('decisionSection'))}
        </p>
        <p class="mt-0.5 text-sm font-semibold leading-5">${esc(decisionLabel)}</p>
      </div>`
    : '';

  // ── Descargables ──────────────────────────────────────────────────────────
  let dlHtml = '';
  if (pres.showDownloadsIndicator && item.hasDownloads && item.downloadCount) {
    const n = item.downloadCount;
    dlHtml = `<div class="mt-3 flex items-center gap-1.5 text-xs text-gray-500"><i data-lucide="file-down" class="h-3.5 w-3.5 shrink-0"></i><span>${esc(n === 1 ? `1 ${uiText('downloadable')}` : `${n} ${uiText('downloadables')}`)}</span></div>`;
  }

  // ── Mini-meta: solo ventana ───────────────────────────────────────────────
  const miniMetaHtml = renderCardMiniMeta([
    windowLabel ? { label: uiText('window'), value: windowLabel, valueClass: 'font-normal text-eu-text' } : null,
  ].filter(Boolean));

  const validationTypeLabel = pickLang(item.validationTypeLabel) || getValidationTypeLabel(core.validationType);
  const stageLabel = (ccv.ch_val_stage !== false && pres.showValidationStage !== false) ? pickLang(item.validationStageLabel) : '';
  const showSectorBadge = ccv.ch_val_extraBadge !== false;

  const body = `
    ${mainBlockHtml}
    ${miniMetaHtml}
    ${envHtml}
    ${decisionHtml}
    ${dlHtml}
  `;

  const proposerName = ccv.ch_entity !== false ? (pickLang(item.ownership?.proposer?.name) || '') : '';

  return renderCardShell(item, tab, body, {
    title: core.title,
    subtitle: core.summary,
    statusLabel: stageLabel,
    statusValue: core.status || '',
    statusFilterKey: stageLabel ? 'status' : '',
    statusBadgeTone: 'bg-eu-blue/10 text-eu-blue border-eu-blue/20',
    extraBadge: validationTypeLabel,
    extraBadgeTone: 'bg-eu-purple/10 text-eu-purple border-eu-purple/20',
    extraBadgeFilterKey: validationTypeLabel ? 'validationType' : '',
    extraBadgeFilterValue: validationTypeLabel ? (core.validationType || '') : '',
    extraBadge2: showSectorBadge ? getSectorLabel(core.sector) : '',
    extraBadge2FilterKey: showSectorBadge ? 'sector' : '',
    extraBadge2FilterValue: showSectorBadge ? getSectorCode(core.sector) : '',
    entity: proposerName,
    hideTypeBadge: true,
  });
}

function renderMentoringCard(item, tab) {
  const ccv = MARKETPLACE_CONFIG.cardChipVisibility || {};
  const core = item.core || {};
  const pres = item.presentation?.card || {};
  const offer = item.mentoringOffer || {};
  const format = offer.format || {};
  const provider = item.ownership?.mentoringTeam || {};
  const ef = item.externalFlow || {};
  const primaryUrl = ef.enabled && ef.primaryAction?.url ? ef.primaryAction.url : '';

  if (offer.purpose || item.mentors || item.expectedOutputs || item.presentation) {
    const providerName = pickLang(provider.name) || pickLang(core.entity?.name);
    const providerRole = pickLangStrict(provider.role);
    const purposeLabel = pickLang(pres.mainBlockLabel) || pickLang({ es: 'Que ofrece', en: 'What it offers', va: 'Que ofereix' });
    const purpose = pickLang(offer.purpose);
    const specialties = asArray(item.mentors?.items)
      .flatMap(mentor => asArray(mentor?.specialties))
      .map(specialty => ({ value: specialty, label: getMentoringSpecialtyLabel(specialty) || pickLang(specialty) }))
      .filter(specialty => specialty.label)
      .filter((specialty, index, all) => all.findIndex(entry => entry.value === specialty.value) === index);
    const formatSummary = getMentoringFormatSummary(format);
    const cardDownloads = asArray(item.cardDownloads).filter(download => download?.showOnCard !== false);
    const dlHtml = pres.showDownloadsIndicator !== false && item.downloads?.enabled && item.hasDownloads && cardDownloads.length
      ? `<div class="mt-3 flex items-center gap-1.5 text-xs text-gray-500"><i data-lucide="file-down" class="h-3.5 w-3.5 shrink-0"></i><span>${esc(cardDownloads.length === 1 ? `1 ${uiText('downloadable')}` : `${cardDownloads.length} ${uiText('downloadables')}`)}</span></div>`
      : '';

    const showProvider = ccv.ch_mentoring_provider !== false && pres.showProvider !== false;
    const showSpecialties = ccv.ch_mentoring_specialties !== false && pres.showSpecialties !== false;

    const providerHtml = showProvider && providerName
      ? `<div class="mt-4 rounded-lg border border-eu-purple/10 rd-card-grad-violet px-3 py-2">
          <p class="text-[11px] font-bold uppercase tracking-wide text-eu-purple/70">${esc(pickLang({ es: 'Equipo mentor', en: 'Mentoring team', va: 'Equip mentor' }))}</p>
          <p class="mt-0.5 text-sm font-semibold leading-5 text-gray-700">${esc(providerName)}</p>
          ${providerRole ? `<p class="mt-1 text-xs leading-5 text-gray-500">${esc(providerRole)}</p>` : ''}
        </div>`
      : '';

    const specialtiesHtml = showSpecialties && specialties.length
      ? `<div class="mt-4">
          <p class="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-gray-500">
            <i data-lucide="graduation-cap" class="h-3.5 w-3.5 shrink-0"></i>
            ${esc(pickLang({ es: 'Especialidades', en: 'Specialties', va: 'Especialitats' }))}
          </p>
          <div class="flex flex-wrap gap-2">${specialties.map(s => renderBadge(s.label, 'bg-slate-100 text-slate-700 border-slate-200', 'specialty', s.value)).join('')}</div>
        </div>`
      : '';

    const body = `
      ${purpose && pres.showPurpose !== false ? `
        <div class="mt-4 rounded-lg rd-card-grad-violet p-4">
          <p class="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-gray-500">
            <i data-lucide="handshake" class="h-3.5 w-3.5"></i>
            ${esc(purposeLabel)}
          </p>
          <p class="mt-1 text-sm font-semibold leading-6 text-eu-text">${esc(purpose)}</p>
        </div>` : ''}
      ${providerHtml}
      ${specialtiesHtml}
      ${renderCardMiniMeta([
        { label: uiText('availability'), value: ccv.ch_mentoring_availability !== false && pres.showAvailability !== false ? pickLang(format.availability) : '' },
        { label: pickLang({ es: 'Formato', en: 'Format', va: 'Format' }), htmlValue: asArray(format.sessions).map(s => { const count = s.sessionCount ? `${s.sessionCount} ${pickLang({ es: 'ses.', en: 'sess.', va: 'sess.' })}` : ''; const parts = [getModalityLabel(s.modality), count, formatSessionDuration(s.sessionDurationHours, s.sessionDurationMinutes), getMentoringSessionTypesSummary(s.sessionTypes)].filter(Boolean); return `<p class="flex items-center gap-2 leading-5 text-sm text-gray-600"><span class="h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400"></span>${esc(parts.join(' · '))}</p>`; }).join('') },
      ])}
      ${dlHtml}
    `;

    const showStatusBadge = ccv.ch_mentoring_status !== false;
    const showSectorBadge = ccv.ch_mentoring_sector !== false;

    return renderCardShell(item, tab, body, {
      title: core.title,
      subtitle: core.summary,
      statusLabel: showStatusBadge ? getMentoringStatusLabel(core.status) : '',
      statusValue: core.status || '',
      statusFilterKey: showStatusBadge ? 'status' : '',
      extraBadge: ccv.ch_mentoring_type !== false ? getMentoringTypeLabel(core.mentoringType) : '',
      extraBadgeFilterKey: ccv.ch_mentoring_type !== false && core.mentoringType ? 'mentoringType' : '',
      extraBadgeFilterValue: core.mentoringType || '',
      extraBadge2: showSectorBadge ? getSectorLabel(core.sector) : '',
      extraBadge2FilterKey: showSectorBadge ? 'sector' : '',
      extraBadge2FilterValue: showSectorBadge ? getSectorCode(core.sector) : '',
      entity: '',
      hideTypeBadge: true,
    });
  }

  const card = item.card || {};
  const mentorName = pickLang(card.mentorName, pickLang(item.ownership?.mentoringTeam?.name) || pickLang(item.core?.entity?.name));
  const mentorRole = pickLang(card.mentorRole || item.ownership?.mentoringTeam?.role || item.core?.summary);
  const badges = asArray(card.badges).map(badge => badge?.label || badge);
  const body = `
    <div class="mt-4 flex items-start gap-4 rounded-lg rd-card-grad-violet p-4">
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
    <div class="rd-card rd-card-grad-violet rd-card-edge p-10 text-center">
      <i data-lucide="${esc(tab.icon || 'inbox')}" class="mx-auto h-10 w-10 text-eu-purple/50"></i>
      <h3 class="mt-4 text-xl font-extrabold text-eu-purple">${esc(pickLang(tab.emptyState?.title, 'Sin elementos publicados'))}</h3>
      <p class="mx-auto mt-2 max-w-xl text-base leading-relaxed text-gray-600">${esc(pickLang(tab.emptyState?.message))}</p>
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
    <div class="rd-card rd-card-accent rd-card-grad-violet overflow-hidden group">
      <div class="p-6 pl-7 sm:p-8 sm:pl-9">
        <div class="min-w-0">
          <div class="flex items-center gap-3">
            <span class="rd-icon-circle shrink-0 text-eu-blue transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" style="background:#ffffff">
              <i data-lucide="${esc(tab.icon || 'layers-3')}" class="h-6 w-6"></i>
            </span>
            <h2 class="min-w-0 text-3xl font-extrabold leading-tight text-eu-purple">${esc(title)}</h2>
          </div>
          ${intro ? `<p class="mt-5 text-lg leading-relaxed text-gray-600">${simpleMarkdown(intro)}</p>` : ''}
        </div>
      </div>
    </div>`;
}

function renderTabPanel(tab, items) {
  return `
    <section class="rd-canvas rd-section" style="padding-top:2.5rem"
      id="mp-tabpanel-${esc(tab.id)}" role="tabpanel" aria-labelledby="mp-tab-${esc(tab.id)}">
      <div class="mx-auto max-w-7xl px-6">
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

function formatDateLong(isoStr) {
  if (!isoStr) return '';
  try {
    const d = new Date(isoStr + 'T00:00:00');
    const lang = getLang();
    const locale = lang === 'en' ? 'en-US' : lang === 'va' ? 'ca-ES' : 'es-ES';
    return d.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' });
  } catch {
    return isoStr;
  }
}

function formatExecutionWindow(window) {
  const start = window?.start || '';
  const end = window?.end || '';
  if (!start && !end) return '';

  const startLabel = formatDateLong(start);
  const endLabel = formatDateLong(end);

  if (startLabel && endLabel) {
    return pickLang({
      es: `del ${startLabel} al ${endLabel}`,
      en: `from ${startLabel} to ${endLabel}`,
      va: `del ${startLabel} al ${endLabel}`,
    });
  }
  if (startLabel) {
    return pickLang({
      es: `desde ${startLabel}`,
      en: `from ${startLabel}`,
      va: `des de ${startLabel}`,
    });
  }
  return pickLang({
    es: `hasta ${endLabel}`,
    en: `until ${endLabel}`,
    va: `fins a ${endLabel}`,
  });
}

const SESSION_TYPE_LABELS = {
  sync:           { es: 'síncrona',           en: 'synchronous',   va: 'síncrona'           },
  async:          { es: 'asíncrona',          en: 'asynchronous',  va: 'asíncrona'          },
  workshop:       { es: 'taller',             en: 'workshop',      va: 'taller'             },
  'async-review': { es: 'revisión asíncrona', en: 'async review',  va: 'revisió asíncrona'  },
};

function formatSessionDuration(h, m) {
  if (!h && !m) return '';
  if (h && m) return `${h}h ${m}min`;
  return h ? `${h}h` : `${m}min`;
}

function getMentoringSessionTypesSummary(types) {
  return asArray(types).map(t => pickLang(SESSION_TYPE_LABELS[t]) || t).filter(Boolean).join(', ');
}

function getMentoringFormatSummary(format = {}) {
  return asArray(format.sessions).map(s => {
    const count = s.sessionCount ? `${s.sessionCount} ${pickLang({ es: 'ses.', en: 'sess.', va: 'sess.' })}` : '';
    const parts = [
      getModalityLabel(s.modality),
      count,
      formatSessionDuration(s.sessionDurationHours, s.sessionDurationMinutes),
      getMentoringSessionTypesSummary(s.sessionTypes),
    ].filter(Boolean);
    return parts.join(' · ');
  }).filter(Boolean).join(' / ');
}

function scrollToTop(preferredBehavior = 'auto') {
  const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : preferredBehavior });
}

export function render() {
  // El segundo nivel de detalle se retiró (Fase 2). Las cards solo ofrecen la
  // descarga de ficha y el formulario de adhesión; no hay vista de detalle.
  applyRouteParams();
  return renderList();
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
