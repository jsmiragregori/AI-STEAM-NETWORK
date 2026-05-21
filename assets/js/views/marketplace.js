import { t } from '../i18n.js';
import { getState, setState } from '../state.js';
import { MARKETPLACE_CONFIG } from '../../data/marketplace.js';
import { CHALLENGES_CONFIG } from '../../data/challenges.js';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getLang() { return localStorage.getItem('language') || 'es'; }

function pickLang(value, fallback = '') {
  if (!value || typeof value !== 'object') return value || fallback;
  const lang = getLang();
  return value[lang] || value.es || value.en || fallback;
}

function getLabelFromArray(arr, id) {
  return pickLang(arr?.find(l => l.id === id)?.label) || id;
}

function getStatusLabel(id)         { return getLabelFromArray(MARKETPLACE_CONFIG.statusLabels, id); }
function getTypeLabel(id)           { return getLabelFromArray(MARKETPLACE_CONFIG.typeLabels, id); }
function getRouteLabel(id)          { return getLabelFromArray(MARKETPLACE_CONFIG.routeLabels, id); }
function getHelixLabel(id)          { return getLabelFromArray(MARKETPLACE_CONFIG.helixLabels, id); }
function getCyclePhaseLabel(id)     { return getLabelFromArray(MARKETPLACE_CONFIG.cyclePhaseLabels, id); }
function getTransitionLabel(id)     { return getLabelFromArray(MARKETPLACE_CONFIG.transitionLabels, id); }
function getEvidenceMaturityLabel(id) { return getLabelFromArray(MARKETPLACE_CONFIG.evidenceMaturityLabels, id); }

function getSectorCode(s) {
  const MAP = {
    'Manufacturing': 'mfg', 'Mobility and Transport': 'mob', 'Energy and Environment': 'ene',
    'Agrifood': 'agr', 'Cultural and Creative Industries': 'cci', 'Housing': 'hou',
    'Non-Touristic Services': 'nts',
  };
  return MAP[s] || s;
}
function getSectorLabel(s) { return (t('sectors.sectorNames') || {})[getSectorCode(s)] || s; }

// Tags: pick the right language array
function getTags(ch) {
  const lang = getLang();
  if (ch.tags && typeof ch.tags === 'object' && !Array.isArray(ch.tags)) {
    return ch.tags[lang] || ch.tags.es || ch.tags.en || [];
  }
  return Array.isArray(ch.tags) ? ch.tags : [];
}

// Status badge styles (by normalized id)
const STATUS_STYLES = {
  'open':        'bg-green-100 text-green-800',
  'in-progress': 'bg-yellow-100 text-yellow-800',
  'resolved':    'bg-gray-100 text-gray-600',
};
const STATUS_DOT = {
  'open':        'bg-green-500',
  'in-progress': 'bg-yellow-500',
  'resolved':    'bg-gray-400',
};
const STATUS_BG = {
  'open':        'bg-green-100',
  'in-progress': 'bg-yellow-100',
  'resolved':    'bg-gray-100',
};
const STATUS_TEXT = {
  'open':        'text-green-800',
  'in-progress': 'text-yellow-800',
  'resolved':    'text-gray-600',
};

const ROUTE_STYLES = {
  'fp':      'bg-eu-yellow text-eu-purple',
  'teacher': 'bg-teal-100 text-teal-800',
  'master':  'bg-purple-100 text-purple-800',
  'mixed':   'bg-blue-100 text-blue-800',
};

const EVIDENCE_STYLES = {
  idea:      'bg-gray-100 text-gray-600',
  validated: 'bg-blue-100 text-blue-700',
  inPilot:   'bg-yellow-100 text-yellow-800',
  completed: 'bg-green-100 text-green-800',
};

const LEVEL_STYLES = {
  'FP':     'bg-eu-yellow text-eu-purple',
  'Máster': 'bg-purple-100 text-purple-800',
};

// Helix chip colors
const HELIX_STYLES = {
  academia: 'bg-purple-100 text-purple-700',
  public:   'bg-blue-100 text-blue-700',
  industry: 'bg-orange-100 text-orange-700',
  civil:    'bg-teal-100 text-teal-700',
};

// Cycle phase colors
const CYCLE_PHASE_STYLES = {
  input:      'bg-eu-yellow text-eu-purple',
  processing: 'bg-blue-100 text-blue-700',
  output:     'bg-green-100 text-green-700',
};

// Transition badge colors
const TRANSITION_STYLES = {
  digital: 'bg-blue-50 text-blue-600',
  green:   'bg-green-50 text-green-700',
  social:  'bg-pink-50 text-pink-700',
};

function getFilteredContributions(all, filters) {
  return all.filter(ch => {
    if (filters.type   !== 'All'  && ch.type             !== filters.type)   return false;
    if (filters.route  !== 'All'  && ch.route            !== filters.route)  return false;
    if (filters.status !== 'Todos'&& ch.status           !== filters.status) return false;
    if (filters.sector !== 'Todos'&& ch.sector           !== filters.sector) return false;
    if (filters.evidence !== 'All'&& ch.evidenceMaturity !== filters.evidence) return false;
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const title = pickLang(ch.title).toLowerCase();
      const desc = pickLang(ch.description || ch.detail?.es?.fullDescription || '').toLowerCase();
      if (!title.includes(q) && !desc.includes(q)) return false;
    }
    return true;
  });
}

// ─── Detail view ─────────────────────────────────────────────────────────────

function renderDetail(ch, mT) {
  const lang = getLang();
  const cdT = t('challengeDetail') || {};
  const extra = ch.detail?.[lang] || ch.detail?.en || ch.detail?.es || null;

  const statusId = ch.status;
  const stBg   = STATUS_BG[statusId]   || 'bg-gray-100';
  const stText  = STATUS_TEXT[statusId] || 'text-gray-600';
  const stDot   = STATUS_DOT[statusId]  || 'bg-gray-400';
  const lvlStyle = LEVEL_STYLES[ch.level] || 'bg-gray-100 text-gray-600';

  const participationCtas = cdT.participationCtas || {};
  const participationButton = participationCtas[ch.type] || cdT.requestParticipationButton || 'Solicitar participación →';

  const showForm = getState('marketplaceShowParticipation');
  const participationSent = getState('marketplaceParticipationSent');

  const roles = cdT.participationRoles || [];
  const types = cdT.participationTypes || [];
  const pathways = cdT.participationPathways || [];
  const ethics = cdT.participationEthics || [];
  const fields = cdT.participationFields || {};
  const placeholders = cdT.participationPlaceholders || {};

  const tags = getTags(ch);

  // New LbD badge row
  const ldBadges = `
    <div class="flex flex-wrap gap-2 mt-3">
      ${CYCLE_PHASE_STYLES[ch.cyclePhase] ? `<span class="text-xs font-bold px-2 py-0.5 rounded ${CYCLE_PHASE_STYLES[ch.cyclePhase]}">${getCyclePhaseLabel(ch.cyclePhase)}</span>` : ''}
      ${HELIX_STYLES[ch.helixRole] ? `<span class="text-xs font-bold px-2 py-0.5 rounded ${HELIX_STYLES[ch.helixRole]}">${getHelixLabel(ch.helixRole)}</span>` : ''}
      ${(ch.tripleTransition || []).map(t => `<span class="text-xs font-semibold px-2 py-0.5 rounded ${TRANSITION_STYLES[t] || 'bg-gray-100 text-gray-600'}">${getTransitionLabel(t)}</span>`).join('')}
      ${ch.track ? `<span class="text-xs font-semibold px-2 py-0.5 rounded bg-gray-100 text-gray-600">Track ${ch.track}</span>` : ''}
    </div>`;

  return `
<div class="animate-in fade-in duration-300">
  <!-- Sticky nav -->
  <div class="bg-white border-b border-eu-border sticky top-[112px] z-40 px-6 py-3">
    <div class="max-w-7xl mx-auto flex items-center justify-between gap-4">
      <button id="mp-back" class="flex items-center gap-2 text-eu-blue font-bold text-sm hover:underline bg-transparent border-none cursor-pointer">
        <i data-lucide="arrow-left" class="w-4 h-4"></i> ${cdT.backButton || 'Volver a Retos y Casos'}
      </button>
      <div class="flex items-center gap-2">
        <span class="text-sm font-extrabold uppercase px-2 py-0.5 rounded ${lvlStyle}">${cdT.challengeLevel || 'Nivel'} ${ch.level}</span>
        <span class="flex items-center gap-1.5 text-sm font-bold px-2 py-0.5 rounded ${stBg} ${stText}">
          <span class="w-1.5 h-1.5 rounded-full ${stDot}"></span>
          ${getStatusLabel(statusId)}
        </span>
      </div>
    </div>
  </div>

  <!-- Hero -->
  <div class="bg-eu-blue text-white px-6 py-10">
    <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2">
        <div class="flex items-center gap-2 mb-3">
          <span class="text-xs font-bold uppercase tracking-widest text-eu-yellow">${ch.sector}</span>
          <i data-lucide="chevron-right" class="w-3 h-3 text-white/40"></i>
          <span class="text-xs text-white/60">${pickLang(ch.entityType)}</span>
        </div>
        <h1 class="text-3xl font-extrabold mb-3 leading-tight">${pickLang(ch.title)}</h1>
        <div class="flex items-center gap-3 mb-5">
          <i data-lucide="building-2" class="w-4 h-4 text-white/60 shrink-0"></i>
          <span class="text-white/80 font-semibold">${ch.entity}</span>
        </div>
        <div class="flex flex-wrap gap-2">
          ${tags.map(tag => `<span class="flex items-center gap-1 bg-white/10 text-white/80 text-xs font-semibold px-2.5 py-1 rounded-full"><i data-lucide="tag" class="w-3 h-3"></i>${tag}</span>`).join('')}
        </div>
        ${ldBadges}
      </div>
      <!-- Key info card -->
      <div class="bg-white/10 rounded-xl p-5 flex flex-col gap-3">
        <div class="flex items-center gap-3">
          <i data-lucide="calendar" class="w-4 h-4 text-eu-yellow shrink-0"></i>
          <div>
            <p class="text-xs text-white/50 uppercase font-bold">${cdT.deadline || 'Plazo'}</p>
            <p class="font-bold text-white">${ch.deadline}</p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <i data-lucide="clock" class="w-4 h-4 text-eu-yellow shrink-0"></i>
          <div>
            <p class="text-xs text-white/50 uppercase font-bold">${cdT.posted || 'Publicado'}</p>
            <p class="font-bold text-white">${ch.posted}</p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <i data-lucide="users" class="w-4 h-4 text-eu-yellow shrink-0"></i>
          <div>
            <p class="text-xs text-white/50 uppercase font-bold">${cdT.teamsEnrolled || 'Participaciones activas'}</p>
            <p class="font-bold text-white">${ch.teams} ${ch.teams === 1 ? (cdT.participationSingular || 'participación') : (cdT.participationPlural || 'participaciones')}</p>
          </div>
        </div>
        ${extra?.teamSize ? `
        <div class="flex items-center gap-3">
          <i data-lucide="users" class="w-4 h-4 text-eu-yellow shrink-0"></i>
          <div>
            <p class="text-xs text-white/50 uppercase font-bold">${cdT.teamComposition || 'Composición de equipo'}</p>
            <p class="font-bold text-white text-sm">${extra.teamSize}</p>
          </div>
        </div>` : ''}
        ${ch.route ? `
        <div class="flex items-center gap-3">
          <i data-lucide="route" class="w-4 h-4 text-eu-yellow shrink-0"></i>
          <div>
            <p class="text-xs text-white/50 uppercase font-bold">${cdT.routeLabel || 'Ruta educativa'}</p>
            <p class="font-bold text-white text-sm">${getRouteLabel(ch.route)}</p>
          </div>
        </div>` : ''}
        ${ch.status === 'open' ? `<button id="mp-open-form" class="mt-2 w-full bg-eu-orange text-white font-bold py-2.5 rounded-lg hover:bg-eu-purple transition-colors border-none cursor-pointer text-sm">${participationButton}</button>` : ''}
        ${ch.status === 'in-progress' ? `<div class="mt-2 w-full bg-yellow-400/20 text-yellow-200 font-bold py-2.5 rounded-lg text-sm text-center">${cdT.enrollmentClosed || 'Inscripciones cerradas'}</div>` : ''}
        ${ch.status === 'resolved' ? `<div class="mt-2 w-full bg-white/10 text-white/60 font-bold py-2.5 rounded-lg text-sm text-center">${cdT.challengeCompleted || 'Reto completado'}</div>` : ''}
      </div>
    </div>
  </div>

  <!-- Participation form -->
  ${showForm && ch.status === 'open' ? `
  <div id="challenge-participation-form" class="bg-eu-bg border-b border-eu-border px-6 py-8">
    <div class="max-w-4xl mx-auto bg-white rounded-xl border-2 border-eu-orange shadow-sm overflow-hidden">
      <div class="bg-eu-orange/10 border-b border-eu-orange/30 px-6 py-4">
        <p class="text-xs font-extrabold uppercase text-eu-orange mb-1">${cdT.consensuePreferredLabel || 'ConsensUE · trazabilidad participativa'}</p>
        <h2 class="text-lg font-bold text-eu-text">${cdT.participationFormTitle || 'Formulario de solicitud de participación'}</h2>
        <p class="text-sm text-gray-600 mt-2">${cdT.participationFormIntro || ''}</p>
      </div>
      <form id="mp-participation-form" class="p-6 space-y-5">
        ${participationSent ? `<div role="alert" class="bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-800 font-semibold">${cdT.participationConfirmation || '¡Solicitud enviada correctamente!'}</div>` : ''}
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><label for="mp-pf-name" class="block text-[13px] font-bold text-eu-text mb-1">${fields.name || 'Nombre'}</label><input id="mp-pf-name" type="text" class="w-full border border-eu-border rounded-md p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-eu-blue focus:border-eu-blue"></div>
          <div><label for="mp-pf-email" class="block text-[13px] font-bold text-eu-text mb-1">${fields.email || 'Email'}</label><input id="mp-pf-email" type="email" class="w-full border border-eu-border rounded-md p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-eu-blue focus:border-eu-blue"></div>
          <div><label for="mp-pf-org" class="block text-[13px] font-bold text-eu-text mb-1">${fields.organization || 'Organización'}</label><input id="mp-pf-org" type="text" class="w-full border border-eu-border rounded-md p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-eu-blue focus:border-eu-blue"></div>
          <div><label for="mp-pf-lang" class="block text-[13px] font-bold text-eu-text mb-1">${fields.language || 'Idioma'}</label><select id="mp-pf-lang" class="w-full border border-eu-border rounded-md p-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-eu-blue focus:border-eu-blue"><option>ES</option><option>EN</option><option>VA</option></select></div>
          <div><label for="mp-pf-country" class="block text-[13px] font-bold text-eu-text mb-1">${fields.country || 'País'}</label><input id="mp-pf-country" type="text" class="w-full border border-eu-border rounded-md p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-eu-blue focus:border-eu-blue"></div>
          <div><label for="mp-pf-region" class="block text-[13px] font-bold text-eu-text mb-1">${fields.region || 'Región'}</label><input id="mp-pf-region" type="text" class="w-full border border-eu-border rounded-md p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-eu-blue focus:border-eu-blue"></div>
          ${roles.length ? `<div class="sm:col-span-2"><label class="block text-[13px] font-bold text-eu-text mb-2">${fields.role || 'Rol'}</label><div class="grid grid-cols-1 sm:grid-cols-2 gap-2">${roles.map(r => `<label class="flex items-center gap-2 text-sm text-gray-700 bg-eu-bg border border-eu-border rounded-md px-3 py-2"><input type="checkbox" class="rounded border-eu-border"> ${r}</label>`).join('')}</div></div>` : ''}
          ${types.length ? `<div class="sm:col-span-2"><label class="block text-[13px] font-bold text-eu-text mb-2">${fields.participationType || 'Tipo de participación'}</label><div class="grid grid-cols-1 sm:grid-cols-2 gap-2">${types.map(tp => `<label class="flex items-center gap-2 text-sm text-gray-700 bg-eu-bg border border-eu-border rounded-md px-3 py-2"><input type="checkbox" class="rounded border-eu-border"> ${tp}</label>`).join('')}</div></div>` : ''}
          ${pathways.length ? `<div class="sm:col-span-2"><label class="block text-[13px] font-bold text-eu-text mb-1">${fields.preferredPathway || 'Vía preferida'}</label><select class="w-full border border-eu-border rounded-md p-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-eu-blue focus:border-eu-blue">${pathways.map(p => `<option>${p}</option>`).join('')}</select></div>` : ''}
          <div class="sm:col-span-2"><label class="block text-[13px] font-bold text-eu-text mb-1">${fields.context || 'Contexto'}</label><textarea rows="4" class="w-full border border-eu-border rounded-md p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-eu-blue focus:border-eu-blue resize-none" placeholder="${placeholders.context || ''}"></textarea></div>
          <div class="sm:col-span-2"><label class="block text-[13px] font-bold text-eu-text mb-1">${fields.availability || 'Disponibilidad'}</label><input type="text" class="w-full border border-eu-border rounded-md p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-eu-blue focus:border-eu-blue" placeholder="${placeholders.availability || ''}"></div>
        </div>
        ${ethics.length ? `<div class="space-y-2 border-t border-eu-border pt-4">${ethics.map(e => `<label class="flex items-start gap-2 text-xs text-gray-600"><input type="checkbox" class="mt-0.5 rounded border-eu-border"> ${e}</label>`).join('')}</div>` : ''}
        <div class="flex flex-col sm:flex-row justify-end gap-3">
          <button type="button" id="mp-cancel-form" class="px-5 py-2 rounded-md border border-eu-border text-eu-text text-sm font-bold hover:bg-eu-bg transition-colors cursor-pointer">${cdT.cancel || 'Cancelar'}</button>
          <button type="submit" class="bg-eu-orange text-white px-6 py-2.5 rounded-md font-bold border-none hover:bg-eu-purple transition-colors cursor-pointer">${cdT.submitParticipation || 'Enviar solicitud'}</button>
        </div>
      </form>
    </div>
  </div>` : ''}

  <!-- Main grid -->
  <div class="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
    <!-- Main content -->
    <div class="lg:col-span-2 space-y-8">

      <!-- Description -->
      <section class="bg-white rounded-xl border border-eu-border shadow-sm p-7">
        <h2 class="text-lg font-bold text-eu-text mb-3 flex items-center gap-2"><i data-lucide="file-text" class="w-5 h-5 text-eu-blue"></i> ${cdT.descriptionTitle || 'Descripción'}</h2>
        <p class="text-sm text-gray-700 leading-relaxed mb-4">${extra?.fullDescription ?? pickLang(ch.title)}</p>
        ${extra?.context ? `<div class="bg-eu-bg border-l-4 border-eu-teal rounded-r-lg p-4"><p class="text-xs font-bold text-eu-teal uppercase mb-1">${cdT.contextLabel || 'Contexto y datos disponibles'}</p><p class="text-sm text-gray-600">${extra.context}</p></div>` : ''}
      </section>

      <!-- Objectives -->
      ${extra?.objectives?.length ? `
      <section class="bg-white rounded-xl border border-eu-border shadow-sm p-7">
        <h2 class="text-lg font-bold text-eu-text mb-4 flex items-center gap-2"><i data-lucide="target" class="w-5 h-5 text-eu-orange"></i> ${cdT.objectivesTitle || 'Objetivos y Resultados Esperados'}</h2>
        <ul class="space-y-2.5">
          ${extra.objectives.map(o => `<li class="flex items-start gap-3 text-sm text-gray-700"><i data-lucide="check-circle" class="w-4 h-4 text-eu-teal mt-0.5 shrink-0"></i>${o}</li>`).join('')}
        </ul>
      </section>` : ''}

      <!-- Datasets & tools -->
      ${extra?.datasets?.length || extra?.tools?.length ? `
      <section class="bg-white rounded-xl border border-eu-border shadow-sm p-7">
        <h2 class="text-lg font-bold text-eu-text mb-4 flex items-center gap-2"><i data-lucide="database" class="w-5 h-5 text-eu-blue"></i> ${cdT.resourcesTitle || 'Datos y Recursos Disponibles'}</h2>
        ${extra?.datasets?.length ? `
        <div class="mb-5">
          <p class="text-xs font-bold text-gray-500 uppercase mb-3">${cdT.datasetsLabel || 'Datasets proporcionados'}</p>
          <div class="space-y-2">
            ${extra.datasets.map(d => `
            <div class="flex items-center justify-between bg-eu-bg rounded-lg px-4 py-2.5 border border-eu-border">
              <div class="flex items-center gap-2"><i data-lucide="download" class="w-4 h-4 text-eu-blue shrink-0"></i><span class="text-sm font-semibold text-eu-text">${d.label}</span></div>
              <div class="flex items-center gap-2 shrink-0 ml-4"><span class="text-xs bg-eu-blue/10 text-eu-blue font-bold px-2 py-0.5 rounded">${d.format}</span><span class="text-xs text-gray-400 font-semibold">${d.size}</span></div>
            </div>`).join('')}
          </div>
        </div>` : ''}
        ${extra?.tools?.length ? `
        <div>
          <p class="text-xs font-bold text-gray-500 uppercase mb-3">${cdT.toolsLabel || 'Tecnologías recomendadas'}</p>
          <div class="flex flex-wrap gap-2">
            ${extra.tools.map(tool => `<span class="text-xs bg-eu-bg border border-eu-border px-2.5 py-1 rounded-full font-semibold text-gray-600">${tool}</span>`).join('')}
          </div>
        </div>` : ''}
      </section>` : ''}

      <!-- Deliverables -->
      ${extra?.deliverables?.length ? `
      <section class="bg-white rounded-xl border border-eu-border shadow-sm p-7">
        <h2 class="text-lg font-bold text-eu-text mb-4 flex items-center gap-2"><i data-lucide="file-text" class="w-5 h-5 text-eu-teal"></i> ${cdT.deliverablesTitle || 'Entregables Requeridos'}</h2>
        <div class="space-y-2.5">
          ${extra.deliverables.map((d, i) => `
          <div class="flex items-center justify-between gap-4">
            <div class="flex items-center gap-2.5">
              <span class="w-6 h-6 rounded-full bg-eu-teal/10 text-eu-teal text-xs font-extrabold flex items-center justify-center shrink-0">${i + 1}</span>
              <span class="text-sm font-semibold text-eu-text">${d.label}</span>
            </div>
            <span class="text-xs text-gray-500 font-semibold shrink-0 text-right">${d.format}</span>
          </div>`).join('')}
        </div>
      </section>` : ''}

      <!-- Eval criteria -->
      ${extra?.evalCriteria?.length ? `
      <section class="bg-white rounded-xl border border-eu-border shadow-sm p-7">
        <h2 class="text-lg font-bold text-eu-text mb-4 flex items-center gap-2"><i data-lucide="star" class="w-5 h-5 text-eu-yellow"></i> ${cdT.evaluationTitle || 'Criterios de Evaluación'}</h2>
        <div class="space-y-4">
          ${extra.evalCriteria.map(c => `
          <div>
            <div class="flex items-center justify-between mb-1"><span class="text-sm font-bold text-eu-text">${c.label}</span><span class="text-sm font-extrabold text-eu-blue">${c.weight}%</span></div>
            <div class="w-full bg-eu-bg rounded-full h-1.5 mb-1.5"><div class="bg-eu-blue h-1.5 rounded-full" style="width:${c.weight}%"></div></div>
            <p class="text-xs text-gray-500">${c.desc}</p>
          </div>`).join('')}
        </div>
      </section>` : ''}

      <!-- Eligibility -->
      ${extra?.eligibility?.length && extra.eligibility[0] !== 'Challenge closed — in production since January 2026' ? `
      <section class="bg-white rounded-xl border border-eu-border shadow-sm p-7">
        <h2 class="text-lg font-bold text-eu-text mb-4 flex items-center gap-2"><i data-lucide="users" class="w-5 h-5 text-eu-teal"></i> ${cdT.eligibilityTitle || 'Elegibilidad y Requisitos'}</h2>
        <ul class="space-y-2">
          ${extra.eligibility.map(e => `<li class="flex items-start gap-2.5 text-sm text-gray-700"><span class="w-1.5 h-1.5 rounded-full bg-eu-teal mt-1.5 shrink-0"></span>${e}</li>`).join('')}
        </ul>
      </section>` : ''}

      <!-- FAQ -->
      ${extra?.faq?.length ? `
      <section class="bg-white rounded-xl border border-eu-border shadow-sm p-7">
        <h2 class="text-lg font-bold text-eu-text mb-4 flex items-center gap-2"><i data-lucide="message-square" class="w-5 h-5 text-eu-orange"></i> ${cdT.faqTitle || 'Preguntas Frecuentes'}</h2>
        <div class="space-y-4">
          ${extra.faq.map(f => `
          <div class="border-b border-eu-border pb-4 last:border-0 last:pb-0">
            <p class="text-sm font-bold text-eu-text mb-1.5">${f.q}</p>
            <p class="text-sm text-gray-600">${f.a}</p>
          </div>`).join('')}
        </div>
      </section>` : ''}
    </div>

    <!-- Sidebar -->
    <div class="space-y-6">
      <!-- Timeline -->
      ${extra?.milestones?.length ? `
      <div class="bg-white rounded-xl border border-eu-border shadow-sm p-6">
        <h3 class="font-bold text-eu-text mb-4 flex items-center gap-2"><i data-lucide="calendar" class="w-4 h-4 text-eu-blue"></i> ${cdT.milestonesTitle || 'Hitos'}</h3>
        <div class="relative">
          <div class="absolute left-3 top-2 bottom-2 w-0.5 bg-eu-border"></div>
          <div class="space-y-4">
            ${extra.milestones.map(m => `
            <div class="flex gap-3 pl-8 relative">
              <div class="absolute left-0 top-1 w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${m.done ? 'bg-eu-teal' : 'bg-white border-2 border-eu-border'}">
                ${m.done ? '<i data-lucide="check-circle" class="w-3.5 h-3.5 text-white"></i>' : ''}
              </div>
              <div>
                <p class="text-xs font-bold ${m.done ? 'text-eu-teal' : 'text-gray-500'}">${m.date}</p>
                <p class="text-xs mt-0.5 ${m.done ? 'text-eu-text font-semibold' : 'text-gray-500'}">${m.label}</p>
              </div>
            </div>`).join('')}
          </div>
        </div>
      </div>` : ''}

      <!-- Mentors -->
      ${extra?.mentors?.length ? `
      <div class="bg-white rounded-xl border border-eu-border shadow-sm p-6">
        <h3 class="font-bold text-eu-text mb-4 flex items-center gap-2"><i data-lucide="users" class="w-4 h-4 text-eu-blue"></i> ${cdT.mentorsTitle || 'Mentores'}</h3>
        <div class="space-y-4">
          ${extra.mentors.map(m => {
            const initials = m.name.split(' ').map(n => n[0]).slice(0, 2).join('');
            return `
          <div class="flex items-start gap-3">
            <div class="w-9 h-9 rounded-full bg-eu-blue/10 flex items-center justify-center shrink-0 text-eu-blue font-extrabold text-sm">${initials}</div>
            <div>
              <p class="text-sm font-bold text-eu-text">${m.name}</p>
              <p class="text-xs text-eu-teal font-semibold">${m.role}</p>
              <p class="text-xs text-gray-500">${m.org}</p>
            </div>
          </div>`;
          }).join('')}
        </div>
      </div>` : ''}

      <!-- Recognition -->
      ${extra?.recognition?.length ? `
      <div class="bg-white rounded-xl border border-eu-border shadow-sm p-6">
        <h3 class="font-bold text-eu-text mb-4 flex items-center gap-2"><i data-lucide="award" class="w-4 h-4 text-eu-orange"></i> ${cdT.recognitionTitle || 'Reconocimiento'}</h3>
        <ul class="space-y-2.5">
          ${extra.recognition.map((r, i) => `
          <li class="flex items-start gap-2 text-xs text-gray-700">
            <span class="text-eu-orange font-extrabold shrink-0 mt-0.5">${i === 0 ? '🥇' : i === 1 ? '🥈' : '✓'}</span>
            ${r}
          </li>`).join('')}
        </ul>
      </div>` : ''}

      <!-- Network return -->
      <div class="bg-eu-bg rounded-xl border border-eu-border p-6">
        <h3 class="font-bold text-eu-text mb-4 flex items-center gap-2"><i data-lucide="handshake" class="w-4 h-4 text-eu-teal"></i> ${cdT.networkReturnTitle || 'Qué devuelve la red al stakeholder'}</h3>
        <ul class="space-y-2.5 text-xs text-gray-700">
          <li class="flex items-start gap-2"><span class="w-1.5 h-1.5 bg-eu-teal rounded-full mt-1.5 shrink-0"></span>Publicación del caso/resultado como recurso OER en Aules</li>
          <li class="flex items-start gap-2"><span class="w-1.5 h-1.5 bg-eu-teal rounded-full mt-1.5 shrink-0"></span>Visibilidad en la red de ${cdT.consortiumLabel || '23 socios'} de AI-SECRETT</li>
          <li class="flex items-start gap-2"><span class="w-1.5 h-1.5 bg-eu-teal rounded-full mt-1.5 shrink-0"></span>Acceso a talento formado (FP/VET y, si procede, Máster)</li>
          <li class="flex items-start gap-2"><span class="w-1.5 h-1.5 bg-eu-teal rounded-full mt-1.5 shrink-0"></span>Co-validación del resultado por el Comité Científico AI-SECRETT</li>
          <li class="flex items-start gap-2"><span class="w-1.5 h-1.5 bg-eu-teal rounded-full mt-1.5 shrink-0"></span>Participación en la gobernanza vía ConsensUE (acuerdo gasto cero)</li>
        </ul>
      </div>

      <!-- CTA bottom -->
      ${ch.status === 'open' ? `
      <div class="bg-eu-blue rounded-xl p-6 text-white text-center">
        <p class="font-bold mb-1">${cdT.interestCTA || '¿Quieres participar en este reto?'}</p>
        <p class="text-xs text-white/70 mb-4">${cdT.requestBeforeDeadline || 'Abierto hasta el'} ${ch.deadline}.</p>
        <button id="mp-open-form-bottom" class="w-full bg-eu-orange text-white font-bold py-2.5 rounded-lg hover:bg-eu-purple transition-colors border-none cursor-pointer text-sm">${participationButton}</button>
        <p class="text-xs text-white/60 mt-3">${cdT.requestReviewNote || ''}</p>
      </div>` : ''}
    </div>
  </div>
</div>`;
}

// ─── List view ────────────────────────────────────────────────────────────────

function renderList(all, mT) {
  const filters = getState('marketplaceFilters') || {};
  const showSubmit = getState('marketplaceShowSubmit');
  const evidenceFilter = filters.evidence || 'All';
  const effectiveFilters = { ...filters, evidence: evidenceFilter };
  const filtered = getFilteredContributions(all, effectiveFilters);

  const heroBlock = MARKETPLACE_CONFIG?.heroBlock || CHALLENGES_CONFIG?.heroBlock || {};
  const hasHeroBlock = heroBlock && Object.keys(heroBlock).length > 0;

  const fallbackStats = [
    { value: all.filter(c => c.status === 'open').length, label: { es: 'Abiertas', en: 'Open', va: 'Obertes' } },
    { value: all.filter(c => c.status === 'in-progress').length, label: { es: 'En Proceso', en: 'In Progress', va: 'En Procés' } },
    { value: all.filter(c => c.status === 'resolved').length, label: { es: 'Completadas', en: 'Completed', va: 'Completades' } },
  ];
  const heroStats = hasHeroBlock && Array.isArray(heroBlock.stats) ? heroBlock.stats : fallbackStats;
  const submitButton = heroBlock.submitButton || {};

  const heroHtml = heroBlock.visible !== false ? `
  <div class="bg-eu-blue text-white px-4 sm:px-6 py-8 sm:py-10">
    <div class="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
      <div class="flex-1 min-w-0">
        <h1 class="text-2xl sm:text-3xl font-extrabold mb-2">${pickLang(heroBlock.title, mT?.title || 'Retos y Casos')}</h1>
        <p class="text-white/80 max-w-2xl text-sm sm:text-base">${pickLang(heroBlock.description, mT?.description || '')}</p>
        <div class="grid grid-cols-3 gap-3 sm:gap-5 mt-5">
          ${heroStats.map(stat => `
          <div class="bg-white/10 rounded-xl px-3 sm:px-6 py-3 sm:py-4 text-center sm:text-left">
            <p class="text-xl sm:text-2xl font-extrabold text-eu-yellow">${stat.value}</p>
            <p class="text-xs text-white/70 font-semibold uppercase mt-1 line-clamp-2">${pickLang(stat.label, '')}</p>
          </div>`).join('')}
        </div>
      </div>
      ${submitButton.visible !== false ? `
      <button id="mp-toggle-submit" class="flex items-center justify-center sm:justify-start gap-2 bg-eu-orange text-white px-5 py-3 rounded-lg font-bold text-sm hover:bg-eu-purple transition-colors border-none cursor-pointer shrink-0 w-full sm:w-auto">
        <i data-lucide="plus" class="w-4 h-4"></i> ${pickLang(submitButton.label, mT?.publishChallenge || 'Publicar reto')}
      </button>` : ''}
    </div>
  </div>` : '';

  const sectorNames = t('sectors.sectorNames') || {};
  const sectorOptions = [
    'Manufacturing', 'Mobility and Transport', 'Energy and Environment',
    'Agrifood', 'Cultural and Creative Industries', 'Housing', 'Non-Touristic Services',
  ];

  const resultsCountTpl = (mT?.resultsCount || 'Mostrando <strong>{{count}}</strong> de {{total}} contribuciones')
    .replace('{{count}}', `<strong>${filtered.length}</strong>`)
    .replace('{{total}}', String(all.length));

  const formLabels = mT?.formLabels || {};
  const formPlaceholders = mT?.formPlaceholders || {};

  const typeLabels = MARKETPLACE_CONFIG.typeLabels || [];
  const routeLabels = MARKETPLACE_CONFIG.routeLabels || [];
  const evidenceMaturityLabels = MARKETPLACE_CONFIG.evidenceMaturityLabels || [];

  return `
<div class="animate-in fade-in duration-300">
  ${heroHtml}

  <div class="max-w-7xl mx-auto px-4 sm:px-6 py-8">
    <!-- Submit form -->
    ${showSubmit ? `
    <div class="bg-white rounded-xl border border-eu-border shadow-sm p-5 sm:p-7 mb-8">
      <h2 class="text-lg sm:text-xl font-bold text-eu-text mb-1">${mT?.publishNew || 'Publicar nueva contribución'}</h2>
      <p class="text-sm text-gray-600 mb-5">${mT?.shareChallenge || ''}</p>
      <div class="bg-eu-yellow/30 border border-eu-yellow rounded-md p-3 mb-5 text-sm text-eu-text">
        <p class="font-bold mb-1">${mT?.consensueDemoTitle || 'ConsensUE (demo)'}</p>
        <p class="text-gray-700">${mT?.consensueDemoNote || ''}</p>
      </div>
      <form id="mp-submit-form" class="space-y-4 max-w-2xl">
        <div><label for="mp-sf-title" class="block text-[13px] font-bold text-eu-text mb-1">${formLabels.title || 'Título'} *</label><input id="mp-sf-title" type="text" class="w-full border border-eu-border rounded-md p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-eu-blue focus:border-eu-blue" placeholder="${formPlaceholders.title || ''}"></div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label for="mp-sf-type" class="block text-[13px] font-bold text-eu-text mb-1">${formLabels.contributionType || 'Tipo'} *</label>
            <select id="mp-sf-type" class="w-full border border-eu-border rounded-md p-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-eu-blue focus:border-eu-blue">
              ${typeLabels.filter(l => l.visible).map(l => `<option value="${l.id}">${pickLang(l.label)}</option>`).join('')}
            </select>
          </div>
          <div>
            <label for="mp-sf-route" class="block text-[13px] font-bold text-eu-text mb-1">${formLabels.route || 'Ruta'} *</label>
            <select id="mp-sf-route" class="w-full border border-eu-border rounded-md p-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-eu-blue focus:border-eu-blue">
              ${routeLabels.filter(l => l.visible).map(l => `<option value="${l.id}">${pickLang(l.label)}</option>`).join('')}
            </select>
          </div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label for="mp-sf-sector" class="block text-[13px] font-bold text-eu-text mb-1">${formLabels.sector || 'Sector'} *</label>
            <select id="mp-sf-sector" class="w-full border border-eu-border rounded-md p-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-eu-blue focus:border-eu-blue">
              ${sectorOptions.map(s => `<option>${(sectorNames[getSectorCode(s)] || s)}</option>`).join('')}
            </select>
          </div>
          <div><label for="mp-sf-deadline" class="block text-[13px] font-bold text-eu-text mb-1">${formLabels.deadline || 'Plazo'}</label><input id="mp-sf-deadline" type="date" class="w-full border border-eu-border rounded-md p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-eu-blue focus:border-eu-blue"></div>
        </div>
        <div><label for="mp-sf-desc" class="block text-[13px] font-bold text-eu-text mb-1">${formLabels.description || 'Descripción'} *</label><textarea id="mp-sf-desc" rows="4" class="w-full border border-eu-border rounded-md p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-eu-blue focus:border-eu-blue resize-none" placeholder="${formPlaceholders.description || ''}"></textarea></div>
        <div class="flex flex-col-reverse sm:flex-row justify-end gap-3">
          <button type="button" id="mp-cancel-submit" class="px-5 py-2 rounded-md border border-eu-border text-eu-text text-sm font-bold hover:bg-eu-bg transition-colors cursor-pointer">${mT?.cancel || 'Cancelar'}</button>
          <button type="submit" class="bg-eu-orange text-white px-6 py-2.5 rounded-md font-bold border-none hover:bg-eu-purple transition-colors cursor-pointer">${mT?.submit || 'Enviar'}</button>
        </div>
      </form>
    </div>` : ''}

    <!-- Filters -->
    <div class="bg-white rounded-xl border border-eu-border shadow-sm p-4 sm:p-5 mb-6">
      <div class="flex flex-col gap-4">
        <div class="w-full">
          <label class="block text-[12px] font-bold text-gray-500 uppercase mb-1">${mT?.searchLabel || 'Buscar'}</label>
          <div class="relative">
            <i data-lucide="search" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"></i>
            <input id="mp-search" type="text" value="${(filters.search || '').replace(/"/g, '&quot;')}" class="w-full border border-eu-border rounded-md pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-eu-blue focus:border-eu-blue" placeholder="${mT?.searchPlaceholder || ''}">
          </div>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <div>
            <label class="flex items-center gap-1 text-[12px] font-bold text-gray-500 uppercase mb-1"><i data-lucide="book-open" class="w-3 h-3"></i> ${mT?.filterContributionType || 'Tipo'}</label>
            <select id="mp-filter-type" class="w-full border border-eu-border rounded-md p-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-eu-blue focus:border-eu-blue">
              <option value="All">${mT?.all || 'Todos'}</option>
              ${typeLabels.filter(l => l.visible).map(l => `<option value="${l.id}" ${filters.type === l.id ? 'selected' : ''}>${pickLang(l.label)}</option>`).join('')}
            </select>
          </div>
          <div>
            <label class="flex items-center gap-1 text-[12px] font-bold text-gray-500 uppercase mb-1"><i data-lucide="route" class="w-3 h-3"></i> ${mT?.filterRoute || 'Ruta'}</label>
            <select id="mp-filter-route" class="w-full border border-eu-border rounded-md p-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-eu-blue focus:border-eu-blue">
              <option value="All">${mT?.all || 'Todos'}</option>
              ${routeLabels.filter(l => l.visible).map(l => `<option value="${l.id}" ${filters.route === l.id ? 'selected' : ''}>${pickLang(l.label)}</option>`).join('')}
            </select>
          </div>
          <div>
            <label class="block text-[12px] font-bold text-gray-500 uppercase mb-1">${mT?.filterStatus || 'Estado'}</label>
            <select id="mp-filter-status" class="w-full border border-eu-border rounded-md p-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-eu-blue focus:border-eu-blue">
              <option value="Todos">${mT?.all || 'Todos'}</option>
              <option value="open" ${filters.status === 'open' ? 'selected' : ''}>${getStatusLabel('open')}</option>
              <option value="in-progress" ${filters.status === 'in-progress' ? 'selected' : ''}>${getStatusLabel('in-progress')}</option>
              <option value="resolved" ${filters.status === 'resolved' ? 'selected' : ''}>${getStatusLabel('resolved')}</option>
            </select>
          </div>
          <div>
            <label class="block text-[12px] font-bold text-gray-500 uppercase mb-1">${mT?.filterSector || 'Sector'}</label>
            <select id="mp-filter-sector" class="w-full border border-eu-border rounded-md p-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-eu-blue focus:border-eu-blue">
              <option value="Todos">${mT?.all || 'Todos'}</option>
              ${sectorOptions.map(s => `<option value="${s}" ${filters.sector === s ? 'selected' : ''}>${(sectorNames[getSectorCode(s)] || s)}</option>`).join('')}
            </select>
          </div>
          <div>
            <label class="flex items-center gap-1 text-[12px] font-bold text-gray-500 uppercase mb-1"><i data-lucide="flask-conical" class="w-3 h-3"></i> ${mT?.filterEvidenceMaturity || 'Madurez'}</label>
            <select id="mp-filter-evidence" class="w-full border border-eu-border rounded-md p-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-eu-blue focus:border-eu-blue">
              <option value="All">${mT?.all || 'Todos'}</option>
              ${evidenceMaturityLabels.filter(l => l.visible).map(l => `<option value="${l.id}" ${evidenceFilter === l.id ? 'selected' : ''}>${pickLang(l.label)}</option>`).join('')}
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Results count -->
    <p class="text-sm text-gray-500 mb-4">${resultsCountTpl}</p>

    <!-- Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
      ${filtered.map(ch => {
        const tags = getTags(ch);
        const stStyle = STATUS_STYLES[ch.status] || 'bg-gray-100 text-gray-600';
        const rtStyle = ROUTE_STYLES[ch.route] || 'bg-gray-100 text-gray-600';
        const evStyle = EVIDENCE_STYLES[ch.evidenceMaturity] || 'bg-gray-100 text-gray-600';
        return `
      <div class="bg-white rounded-xl border border-eu-border shadow-sm flex flex-col hover:border-eu-blue transition-colors">
        <div class="p-4 sm:p-5 flex-1">
          <div class="flex flex-wrap items-center gap-2 mb-3">
            <span class="text-xs font-extrabold uppercase px-2 py-0.5 rounded bg-eu-blue/10 text-eu-blue">${getTypeLabel(ch.type)}</span>
            <span class="text-xs font-bold px-2 py-0.5 rounded ${stStyle}">${getStatusLabel(ch.status)}</span>
          </div>
          <h3 class="font-bold text-eu-text text-sm mb-1 leading-snug line-clamp-2">${pickLang(ch.title)}</h3>
          <p class="text-xs text-gray-500 mb-1 font-semibold truncate">${ch.entity}</p>
          <p class="text-xs text-gray-500 mb-3 line-clamp-1">${pickLang(ch.entityType)}</p>
          <div class="flex flex-wrap items-center gap-2 mb-3">
            <span class="text-xs font-bold px-2 py-0.5 rounded ${rtStyle}">${getRouteLabel(ch.route)}</span>
            <span class="text-xs font-semibold px-2 py-0.5 rounded ${evStyle}">${getEvidenceMaturityLabel(ch.evidenceMaturity)}</span>
          </div>
          <!-- LbD badges -->
          <div class="flex flex-wrap gap-1.5 mb-3">
            ${ch.cyclePhase ? `<span class="text-xs px-1.5 py-0.5 rounded ${CYCLE_PHASE_STYLES[ch.cyclePhase] || 'bg-gray-100 text-gray-500'}">${getCyclePhaseLabel(ch.cyclePhase)}</span>` : ''}
            ${ch.helixRole ? `<span class="text-xs px-1.5 py-0.5 rounded ${HELIX_STYLES[ch.helixRole] || 'bg-gray-100 text-gray-500'}">${getHelixLabel(ch.helixRole)}</span>` : ''}
            ${(ch.tripleTransition || []).slice(0, 2).map(tr => `<span class="text-xs px-1.5 py-0.5 rounded ${TRANSITION_STYLES[tr] || 'bg-gray-100 text-gray-500'}">${getTransitionLabel(tr)}</span>`).join('')}
          </div>
          <div class="flex flex-wrap gap-1.5 mb-3">
            ${tags.slice(0, 2).map(tag => `<span class="flex items-center gap-1 text-xs bg-eu-bg border border-eu-border px-1.5 py-0.5 rounded text-gray-600 font-semibold"><i data-lucide="tag" class="w-2.5 h-2.5 shrink-0"></i>${tag}</span>`).join('')}
          </div>
          <div class="flex flex-col sm:flex-row sm:items-center gap-2 text-xs text-gray-500">
            <span class="flex items-center gap-1"><i data-lucide="calendar" class="w-3 h-3 shrink-0"></i><span class="truncate">${mT?.deadlineLabel || 'Plazo'}: ${ch.deadline}</span></span>
            <span class="flex items-center gap-1"><i data-lucide="users" class="w-3 h-3 shrink-0"></i>${ch.teams} ${ch.teams === 1 ? (mT?.teamSingular || 'equipo') : (mT?.teamPlural || 'equipos')}</span>
          </div>
        </div>
        <div class="border-t border-eu-border p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 bg-eu-bg">
          <span class="text-xs font-bold text-eu-teal uppercase bg-eu-teal/10 px-2 py-0.5 rounded w-fit">${getSectorLabel(ch.sector)}</span>
          <button class="mp-view-detail text-eu-blue font-bold text-xs bg-transparent border-none cursor-pointer hover:underline text-left sm:text-right" data-id="${ch.id}">
            ${mT?.viewAndApply || 'Ver detalle'} →
          </button>
        </div>
      </div>`; }).join('')}
    </div>

    ${filtered.length === 0 ? `
    <div class="text-center py-16 text-gray-500">
      <p class="text-lg font-semibold mb-2">${mT?.noResults || 'Sin resultados'}</p>
      <p class="text-sm">${mT?.tryModifying || 'Prueba a modificar los filtros'}</p>
    </div>` : ''}
  </div>
</div>`;
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function render() {
  const mT = t('marketplace') || {};
  const all = MARKETPLACE_CONFIG.contributions || [];
  const selectedId = getState('selectedChallengeId');
  if (selectedId) {
    const ch = all.find(c => c.id === selectedId);
    if (ch) return renderDetail(ch, mT);
  }
  return renderList(all, mT);
}

export function mount() {
  const mT = t('marketplace') || {};

  // Back button (detail view)
  document.getElementById('mp-back')?.addEventListener('click', () => {
    setState('selectedChallengeId', null);
    setState('marketplaceShowParticipation', false);
    setState('marketplaceParticipationSent', false);
    history.pushState({}, '', window.location.pathname);
    rerender();
  });

  // "Ver detalle" buttons (list view)
  document.querySelectorAll('.mp-view-detail').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      setState('selectedChallengeId', id);
      setState('marketplaceShowParticipation', false);
      setState('marketplaceParticipationSent', false);
      history.pushState({ challengeId: id }, '', window.location.pathname);
      rerender();
      window.scrollTo({ top: 0, behavior: 'instant' });
    });
  });

  // Toggle submit form
  document.getElementById('mp-toggle-submit')?.addEventListener('click', () => {
    setState('marketplaceShowSubmit', !getState('marketplaceShowSubmit'));
    rerender();
  });
  document.getElementById('mp-cancel-submit')?.addEventListener('click', () => {
    setState('marketplaceShowSubmit', false);
    rerender();
  });
  document.getElementById('mp-submit-form')?.addEventListener('submit', e => e.preventDefault());

  // Filters
  document.getElementById('mp-search')?.addEventListener('input', e => {
    const f = getState('marketplaceFilters') || {};
    setState('marketplaceFilters', { ...f, search: e.target.value });
    rerender();
  });
  document.getElementById('mp-filter-type')?.addEventListener('change', e => {
    const f = getState('marketplaceFilters') || {};
    setState('marketplaceFilters', { ...f, type: e.target.value });
    rerender();
  });
  document.getElementById('mp-filter-route')?.addEventListener('change', e => {
    const f = getState('marketplaceFilters') || {};
    setState('marketplaceFilters', { ...f, route: e.target.value });
    rerender();
  });
  document.getElementById('mp-filter-status')?.addEventListener('change', e => {
    const f = getState('marketplaceFilters') || {};
    setState('marketplaceFilters', { ...f, status: e.target.value });
    rerender();
  });
  document.getElementById('mp-filter-sector')?.addEventListener('change', e => {
    const f = getState('marketplaceFilters') || {};
    setState('marketplaceFilters', { ...f, sector: e.target.value });
    rerender();
  });
  document.getElementById('mp-filter-evidence')?.addEventListener('change', e => {
    const f = getState('marketplaceFilters') || {};
    setState('marketplaceFilters', { ...f, evidence: e.target.value });
    rerender();
  });

  // Open participation form (detail view)
  const openForm = () => {
    setState('marketplaceShowParticipation', true);
    setState('marketplaceParticipationSent', false);
    rerender();
    setTimeout(() => {
      document.getElementById('challenge-participation-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0);
  };
  document.getElementById('mp-open-form')?.addEventListener('click', openForm);
  document.getElementById('mp-open-form-bottom')?.addEventListener('click', openForm);
  document.getElementById('mp-cancel-form')?.addEventListener('click', () => {
    setState('marketplaceShowParticipation', false);
    rerender();
  });
  document.getElementById('mp-participation-form')?.addEventListener('submit', e => {
    e.preventDefault();
    setState('marketplaceParticipationSent', true);
    rerender();
    setTimeout(() => {
      document.getElementById('challenge-participation-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0);
  });

  // Browser back button
  window.addEventListener('popstate', () => {
    if (!getState('selectedChallengeId')) return;
    setState('selectedChallengeId', null);
    setState('marketplaceShowParticipation', false);
    setState('marketplaceParticipationSent', false);
    rerender();
  });
}

function rerender() {
  const main = document.getElementById('main-root');
  main.innerHTML = render();
  mount();
  if (window.lucide) window.lucide.createIcons();
}
