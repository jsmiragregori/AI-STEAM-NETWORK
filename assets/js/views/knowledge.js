import { t } from '../i18n.js';
import { getState, setState } from '../state.js';
import { KNOWLEDGE_CONFIG } from '../../data/knowledge.js';

const TABS = ['flujo', 'oer', 'casos', 'evidencia', 'plantillas'];

const TYPE_ICONS = { 'Guía': '📖', 'Manual': '📋', 'Dataset': '🗄️', 'Vídeo': '🎬', 'Plantilla': '📝' };

const LEVEL_COLORS = {
  FP:       'bg-eu-yellow text-eu-purple',
  Máster:   'bg-purple-100 text-purple-800',
  Docentes: 'bg-eu-blue/10 text-eu-blue',
  'VET/FP': 'bg-eu-yellow text-eu-purple',
  Master:   'bg-purple-100 text-purple-800',
};

const LEVEL_LABELS = {
  FP:       { es: 'FP', en: 'VET', va: 'FP' },
  Máster:   { es: 'Máster', en: 'Master', va: 'Màster' },
  Docentes: { es: 'Docentes', en: 'Teachers', va: 'Docents' },
};

const SECTOR_COLORS = {
  mfg: 'bg-blue-100 text-blue-800',
  nts: 'bg-purple-100 text-purple-800',
  agr: 'bg-yellow-100 text-yellow-800',
  ene: 'bg-green-100 text-green-800',
  mob: 'bg-sky-100 text-sky-800',
  cci: 'bg-pink-100 text-pink-800',
  con: 'bg-orange-100 text-orange-800',
};

const FLOW_ICONS = ['🏭', '🔍', '👥', '💻', '✅', '🌐'];

const TRANSFER_TYPE_COLOR = 'bg-gray-100 text-gray-700 border border-gray-300';

const TRANSFER_TYPE_ICONS = {
  implementación: 'wrench',
  adaptación:     'git-branch',
  capacitación:   'graduation-cap',
  escalado:       'trending-up',
};

const TRANSFER_TYPE_LABELS = {
  implementación: { es: 'Implementación', en: 'Implementation', va: 'Implementació' },
  adaptación:     { es: 'Adaptación',     en: 'Adaptation',     va: 'Adaptació' },
  capacitación:   { es: 'Capacitación',   en: 'Training',       va: 'Capacitació' },
  escalado:       { es: 'Escalado',       en: 'Scaling',        va: 'Escalat' },
};

function getLang() { return localStorage.getItem('language') || 'es'; }
function pickLang(value, fallback = '') {
  const lang = getLang();
  if (value && typeof value === 'object') return value[lang] || value.es || fallback;
  return fallback;
}

function getSectorName(sectorId) {
  if (!sectorId || sectorId === 'Todos' || sectorId === 'All' || sectorId === 'Tots') return sectorId || '';
  const sectorNames = t('sectors.sectorNames') || {};
  return sectorNames[sectorId] || sectorId;
}

function statusIcon(status) {
  if (/completad|completat|completed/i.test(status))
    return '<i data-lucide="check-circle" class="w-4 h-4 text-green-600 inline-block"></i>';
  if (/en curso|en curs|in progress/i.test(status))
    return '<i data-lucide="clock" class="w-4 h-4 text-eu-orange inline-block"></i>';
  return '<i data-lucide="alert-circle" class="w-4 h-4 text-gray-500 inline-block"></i>';
}

function statusBadge(status) {
  if (/completad|completat|completed/i.test(status)) return 'bg-green-100 text-green-800';
  if (/en curso|en curs|in progress/i.test(status))  return 'bg-orange-100 text-orange-800';
  return 'bg-gray-100 text-gray-600';
}

// ─── Tab bar ─────────────────────────────────────────────────────────────────

function tabBar(activeTab) {
  const labels = {
    flujo:      t('knowledge.tabFlow')      || 'Flujo',
    oer:        t('knowledge.tabOER')       || 'OER',
    casos:      t('knowledge.tabCases')     || 'Casos',
    evidencia:  t('knowledge.tabEvidence')  || 'Evidencias',
    plantillas: t('knowledge.tabTemplates') || 'Plantillas',
  };
  return TABS.map(id => `
    <button data-know-tab="${id}" class="px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-colors cursor-pointer whitespace-nowrap ${
      activeTab === id
        ? 'border-eu-blue text-eu-blue'
        : 'border-transparent text-gray-600 hover:text-eu-text'
    }">${labels[id]}</button>
  `).join('');
}

// ─── Tab 1: Flujo de transferencia ───────────────────────────────────────────

const PLATFORM_COLORS = {
  aules:     'border-eu-teal/30 text-eu-teal',
  network:   'border-eu-blue/30 text-eu-blue',
  consensue: 'border-eu-orange/30 text-eu-orange',
};

// ─── OER Filter Functions ────────────────────────────────────────────────────────

function getOerFilters() {
  const key = 'oerFilters';
  const stored = localStorage.getItem(key);
  if (!stored) return { typeId: null, sectors: [], levels: [], validationStatus: null };
  try {
    const parsed = JSON.parse(stored);
    return {
      typeId: parsed.typeId || null,
      sectors: parsed.sectors || [],
      levels: parsed.levels || [],
      validationStatus: parsed.validationStatus || null
    };
  } catch {
    return { typeId: null, sectors: [], levels: [], validationStatus: null };
  }
}

function setOerFilters(filters) {
  localStorage.setItem('oerFilters', JSON.stringify(filters));
}

function getStatusLabel(status) {
  const lang = getLang();
  const labels = {
    validated: { es: 'Validado', en: 'Validated', va: 'Validat' },
    pending: { es: 'En proceso', en: 'Pending', va: 'En procés' },
    draft: { es: 'Borrador', en: 'Draft', va: 'Esborrany' }
  };
  return labels[status]?.[lang] || status;
}

function getOerLabel(key) {
  const lang = getLang();
  const labels = {
    noAuthor: { es: 'Sin autor', en: 'No author', va: 'Sense autor' },
    created: { es: 'Creado:', en: 'Created:', va: 'Creat:' },
    duration: { es: 'Duración:', en: 'Duration:', va: 'Duració:' },
    format: { es: 'Formato:', en: 'Format:', va: 'Format:' },
    updated: { es: 'Actualizado:', en: 'Updated:', va: 'Actualitzat:' },
    filterByStatus: { es: 'Filtrar por estado', en: 'Filter by status', va: 'Filtrar per estat' },
    resource: { es: 'recurso', en: 'resource', va: 'recurs' },
    resources: { es: 'recursos', en: 'resources', va: 'recursos' },
    previous: { es: 'Anterior', en: 'Previous', va: 'Anterior' },
    next: { es: 'Siguiente', en: 'Next', va: 'Següent' }
  };
  return labels[key]?.[lang] || key;
}

function getCasosLabel(key) {
  const lang = getLang();
  const labels = {
    createdBy:      { es: 'Creado por:', en: 'Created by:', va: 'Creat per:' },
    adoptedBy:      { es: 'Adoptado por:', en: 'Adopted by:', va: 'Adoptat per:' },
    howTransferred: { es: 'Cómo se transfirió', en: 'How it was transferred', va: 'Com es va transferir' },
    impact:         { es: 'Impacto', en: 'Impact', va: 'Impacte' },
    evidence:       { es: 'Evidencias', en: 'Evidence', va: 'Evidències' },
    published:      { es: 'Publicado:', en: 'Published:', va: 'Publicat:' },
    revised:        { es: 'Revisado:', en: 'Revised:', va: 'Revisat:' },
    license:        { es: 'Licencia:', en: 'License:', va: 'Llicència:' },
    viewCase:       { es: 'Ver caso completo', en: 'View full case', va: 'Veure cas complet' },
    documentation:  { es: 'Documentación', en: 'Documentation', va: 'Documentació' },
    resources:      { es: 'Recursos', en: 'Resources', va: 'Recursos' },
    previous:       { es: 'Anterior', en: 'Previous', va: 'Anterior' },
    next:           { es: 'Siguiente', en: 'Next', va: 'Següent' },
    filterSector:   { es: 'Filtrar por sector', en: 'Filter by sector', va: 'Filtrar per sector' },
    filterLevel:    { es: 'Filtrar por nivel', en: 'Filter by level', va: 'Filtrar per nivell' },
    filterTransfer: { es: 'Filtrar por tipo de transferencia', en: 'Filter by transfer type', va: 'Filtrar per tipus de transferència' },
    filterStatus:   { es: 'Filtrar por estado', en: 'Filter by status', va: 'Filtrar per estat' },
    activeFilters:  { es: 'Filtros activos:', en: 'Active filters:', va: 'Filtres actius:' },
    clearAll:       { es: 'Limpiar todo', en: 'Clear all', va: 'Netejar tots' },
    clearFilters:   { es: 'Limpiar filtros', en: 'Clear filters', va: 'Netejar filtres' },
    statusVerified: { es: 'Verificado', en: 'Verified', va: 'Verificat' },
    statusPending:  { es: 'Pendiente', en: 'Pending', va: 'Pendent' },
  };
  return labels[key]?.[lang] || key;
}

function getCasosFilters() {
  try {
    const parsed = JSON.parse(localStorage.getItem('casosFilters') || '{}');
    return {
      sectors:            parsed.sectors || [],
      levels:             parsed.levels || [],
      transferType:       parsed.transferType || null,
      verificationStatus: parsed.verificationStatus || null,
    };
  } catch {
    return { sectors: [], levels: [], transferType: null, verificationStatus: null };
  }
}

function setCasosFilters(filters) {
  localStorage.setItem('casosFilters', JSON.stringify(filters));
}

function renderCasosActiveFiltersDisplay() {
  const f = getCasosFilters();
  const hasFilters = f.sectors.length > 0 || f.levels.length > 0 || f.transferType || f.verificationStatus;
  if (!hasFilters) return '';

  const badges = [];

  f.sectors.forEach(sid => {
    badges.push(`
      <button data-caso-remove-filter="sector" data-filter-value="${sid}"
        class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded ${SECTOR_COLORS[sid] || 'bg-gray-100 text-gray-600'} border border-current/30 text-xs font-semibold hover:opacity-80 transition-opacity cursor-pointer">
        <span>🏷️ ${getSectorName(sid)}</span>
        <i data-lucide="x" class="w-3.5 h-3.5"></i>
      </button>`);
  });

  f.levels.forEach(l => {
    const label = LEVEL_LABELS[l] ? pickLang(LEVEL_LABELS[l], l) : l;
    badges.push(`
      <button data-caso-remove-filter="level" data-filter-value="${l}"
        class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded ${LEVEL_COLORS[l] || 'bg-gray-100 text-gray-600'} border border-current/30 text-xs font-semibold hover:opacity-80 transition-opacity cursor-pointer">
        <span>🎓 ${label}</span>
        <i data-lucide="x" class="w-3.5 h-3.5"></i>
      </button>`);
  });

  if (f.transferType) {
    const cls = TRANSFER_TYPE_COLOR;
    const icon = TRANSFER_TYPE_ICONS[f.transferType] || 'arrow-right';
    badges.push(`
      <button data-caso-remove-filter="transfer"
        class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded ${cls} border border-current/20 text-xs font-semibold hover:opacity-80 transition-opacity cursor-pointer">
        <i data-lucide="${icon}" class="w-3 h-3"></i>
        <span>${pickLang(KNOWLEDGE_CONFIG?.successCasesBlock?.transferTypeLabels?.[f.transferType] || TRANSFER_TYPE_LABELS[f.transferType], f.transferType)}</span>
        <i data-lucide="x" class="w-3.5 h-3.5"></i>
      </button>`);
  }

  if (f.verificationStatus) {
    const cls = f.verificationStatus === 'verified'
      ? 'bg-green-100 text-green-800 border-green-300'
      : 'bg-amber-100 text-amber-800 border-amber-300';
    const icon = f.verificationStatus === 'verified' ? '✓' : '⏳';
    const statusLabels = KNOWLEDGE_CONFIG?.successCasesBlock?.verificationStatusLabels || {};
    const verLabel = statusLabels[f.verificationStatus]
      ? pickLang(statusLabels[f.verificationStatus], f.verificationStatus)
      : getCasosLabel(f.verificationStatus === 'verified' ? 'statusVerified' : 'statusPending');
    badges.push(`
      <button data-caso-remove-filter="status"
        class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded ${cls} border text-xs font-semibold hover:opacity-80 transition-opacity cursor-pointer">
        <span>${icon} ${verLabel}</span>
        <i data-lucide="x" class="w-3.5 h-3.5"></i>
      </button>`);
  }

  return `
    <div class="flex flex-wrap items-center gap-2 mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <span class="text-xs font-semibold text-gray-700">${getCasosLabel('activeFilters')}</span>
      ${badges.join('')}
      <button id="casos-clear-all-filters" class="ml-auto px-2.5 py-1 rounded text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer border border-red-200">
        ${getCasosLabel('clearAll')}
      </button>
    </div>`;
}

function tabFlujo() {
  const cycleBlock = KNOWLEDGE_CONFIG?.transferCycleBlock;
  const hasCmsBlock = Boolean(cycleBlock);

  // ── Bloque de steps (título + cards) — visible controla solo este bloque ──
  const stepsVisible = !hasCmsBlock || cycleBlock.visible !== false;
  let stepsSection = '';
  if (stepsVisible) {
    const sectionTitle = hasCmsBlock ? pickLang(cycleBlock.title, '') : (t('knowledge.flowTitle') || '');
    const sectionDesc  = hasCmsBlock ? pickLang(cycleBlock.description, '') : (t('knowledge.flowDesc') || '');
    let stepsHtml = '';
    if (hasCmsBlock) {
      // CMS activo: renderiza solo los steps visibles (puede ser array vacío)
      stepsHtml = (cycleBlock.steps || []).map((step, idx) => `
        <div class="bg-white rounded-xl border border-eu-border shadow-sm p-6 relative">
          <div class="absolute top-4 right-4 w-8 h-8 rounded-full bg-eu-blue text-white flex items-center justify-center font-extrabold text-sm">${idx + 1}</div>
          <span class="text-3xl block mb-3">${step.icon || '🔹'}</span>
          <h3 class="font-bold text-eu-text mb-2">${pickLang(step.title, '')}</h3>
          <p class="text-sm text-gray-600">${pickLang(step.description, '')}</p>
        </div>
      `).join('');
    } else {
      // Legacy fallback (sin bloque CMS)
      const flowSteps = t('knowledge.flowSteps') || [];
      stepsHtml = flowSteps.map((step, idx) => `
        <div class="bg-white rounded-xl border border-eu-border shadow-sm p-6 relative">
          <div class="absolute top-4 right-4 w-8 h-8 rounded-full bg-eu-blue text-white flex items-center justify-center font-extrabold text-sm">${idx + 1}</div>
          <span class="text-3xl block mb-3">${FLOW_ICONS[idx] || '🔹'}</span>
          <h3 class="font-bold text-eu-text mb-2">${step.title || ''}</h3>
          <p class="text-sm text-gray-600">${step.desc || ''}</p>
        </div>
      `).join('');
    }
    stepsSection = `
      <h2 class="text-xl font-bold text-eu-text mb-2">${sectionTitle}</h2>
      <p class="text-sm text-gray-600 mb-8 max-w-3xl">${sectionDesc}</p>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">${stepsHtml}</div>`;
  }

  // ── Bloque de plataformas — platformsBlock.visible controla solo este bloque ──
  const pb = hasCmsBlock ? cycleBlock.platformsBlock : null;
  let platformsHtml = '';
  if (!hasCmsBlock || pb?.visible !== false) {
    const pbTitle = pb ? pickLang(pb.title, '') : (t('knowledge.flowConnection') || '');
    let platformCards = '';
    if (hasCmsBlock) {
      // CMS activo: el loader ya filtró las plataformas con visible:false
      platformCards = (pb?.platforms || []).map(p => {
        const colorClass = PLATFORM_COLORS[p.id] || 'border-gray-200 text-gray-700';
        const [borderCls, textCls] = colorClass.split(' ');
        return `
          <div class="bg-white rounded-lg border ${borderCls} p-4">
            <p class="font-bold ${textCls} mb-1">${p.name || ''}</p>
            <p class="text-gray-600 text-xs">${pickLang(p.description, '')}</p>
          </div>`;
      }).join('');
    } else {
      // Legacy fallback (sin bloque CMS)
      platformCards = `
        <div class="bg-white rounded-lg border border-eu-teal/30 p-4">
          <p class="font-bold text-eu-teal mb-1">Aules (Moodle)</p>
          <p class="text-gray-600 text-xs">${t('knowledge.aulesPlatform') || ''}</p>
        </div>
        <div class="bg-white rounded-lg border border-eu-blue/30 p-4">
          <p class="font-bold text-eu-blue mb-1">AI-STEAM Network (CMS)</p>
          <p class="text-gray-600 text-xs">${t('knowledge.networkPlatform') || ''}</p>
        </div>
        <div class="bg-white rounded-lg border border-eu-orange/30 p-4">
          <p class="font-bold text-eu-orange mb-1">ConsensUE (Decidim)</p>
          <p class="text-gray-600 text-xs">${t('knowledge.consensuePlatform') || ''}</p>
        </div>`;
    }
    // Solo renderizar el contenedor si hay plataformas que mostrar
    if (platformCards) {
      platformsHtml = `
        <div class="bg-eu-bg border border-eu-border rounded-xl p-6">
          <h3 class="font-bold text-eu-text mb-3">${pbTitle}</h3>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">${platformCards}</div>
        </div>`;
    }
  }

  return `<div>${stepsSection}${platformsHtml}</div>`;
}

// ─── Tab 2: OER y Recursos ───────────────────────────────────────────────────

function tabOER(search) {
  const oerBlock = KNOWLEDGE_CONFIG?.oerResourcesBlock;
  const hasCmsBlock = Boolean(oerBlock);

  if (hasCmsBlock && oerBlock.visible === false) {
    const lang = getLang();
    const noContentMsg = lang === 'en'
      ? 'No content available in this section yet'
      : lang === 'va'
        ? 'Encara no hi ha contingut disponible en aquesta secció'
        : 'Todavía no hay contenido disponible en esta sección';
    return `
    <div class="bg-white rounded-xl border border-eu-border shadow-sm p-12 text-center">
      <i data-lucide="inbox" class="w-12 h-12 text-gray-400 mx-auto mb-4"></i>
      <p class="text-gray-500 text-base">${noContentMsg}</p>
    </div>`;
  }

  const blockTitle = hasCmsBlock ? pickLang(oerBlock.title, '') : (t('knowledge.oerTitle') || '');
  const blockDesc  = hasCmsBlock ? pickLang(oerBlock.description, '') : (t('knowledge.oerDesc') || '');
  const searchPlh  = hasCmsBlock ? pickLang(oerBlock.searchPlaceholder, '') : (t('knowledge.oerSearch') || '');

  return `
    <div>
      <div class="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h2 class="text-xl font-bold text-eu-text mb-1">${blockTitle}</h2>
          <p class="text-sm text-gray-600 max-w-2xl">${blockDesc}</p>
        </div>
        <div class="flex gap-3 items-center">
          <div class="relative">
            <i data-lucide="search" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"></i>
            <input id="oer-search" type="text" value="${(search || '').replace(/"/g, '&quot;')}"
              class="border border-eu-border rounded-md pl-9 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-eu-blue focus:border-eu-blue w-64"
              placeholder="${searchPlh}" />
            <button id="oer-search-clear"
              style="position:absolute;right:0.5rem;top:50%;transform:translateY(-50%)"
              class="w-5 h-5 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer ${search ? '' : 'hidden'}"
              title="Borrar búsqueda"><i data-lucide="x" class="w-3.5 h-3.5"></i></button>
          </div>
        </div>
      </div>
      <div id="oer-grid">${renderOerGridContent(search)}</div>
    </div>
  `;
}

// ── Active filters display ────────────────────────────────────────────────────

function renderActiveFiltersDisplay() {
  const activeFilters = getOerFilters();
  const hasFilters = activeFilters.typeId || activeFilters.sectors.length > 0 || activeFilters.levels.length > 0 || activeFilters.validationStatus;

  if (!hasFilters) return '';

  const badges = [];

  // Type filter badge
  if (activeFilters.typeId) {
    const typeLabels = {
      guia: 'Guía',
      manual: 'Manual',
      dataset: 'Dataset',
      video: 'Vídeo',
      plantilla: 'Plantilla'
    };
    badges.push(`
      <button data-remove-filter="type" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-eu-blue/10 text-eu-blue border border-eu-blue/30 text-xs font-semibold hover:bg-eu-blue/20 transition-colors cursor-pointer">
        <span>📋 ${typeLabels[activeFilters.typeId] || activeFilters.typeId}</span>
        <i data-lucide="x" class="w-3.5 h-3.5"></i>
      </button>
    `);
  }

  // Sector filter badges
  activeFilters.sectors.forEach(sectorId => {
    const label = getSectorName(sectorId);
    badges.push(`
      <button data-remove-filter="sector" data-filter-value="${sectorId}" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-purple-100 text-purple-800 border border-purple-300 text-xs font-semibold hover:bg-purple-200 transition-colors cursor-pointer">
        <span>🏷️ ${label}</span>
        <i data-lucide="x" class="w-3.5 h-3.5"></i>
      </button>
    `);
  });

  // Level filter badges
  activeFilters.levels.forEach(level => {
    const label = LEVEL_LABELS[level] ? pickLang(LEVEL_LABELS[level], level) : level;
    badges.push(`
      <button data-remove-filter="level" data-filter-value="${level}" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-amber-100 text-amber-800 border border-amber-300 text-xs font-semibold hover:bg-amber-200 transition-colors cursor-pointer">
        <span>🎓 ${label}</span>
        <i data-lucide="x" class="w-3.5 h-3.5"></i>
      </button>
    `);
  });

  // Status filter badge
  if (activeFilters.validationStatus) {
    const status = activeFilters.validationStatus;
    const statusBadges = {
      validated: { icon: '✓', color: 'bg-green-100 text-green-800 border-green-300' },
      pending: { icon: '⏳', color: 'bg-amber-100 text-amber-800 border-amber-300' },
      draft: { icon: '📝', color: 'bg-gray-100 text-gray-700 border-gray-300' }
    };
    const badge = statusBadges[status] || statusBadges.validated;
    badges.push(`
      <button data-remove-filter="status" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded ${badge.color} border text-xs font-semibold hover:opacity-80 transition-opacity cursor-pointer">
        <span>${badge.icon} ${getStatusLabel(status)}</span>
        <i data-lucide="x" class="w-3.5 h-3.5"></i>
      </button>
    `);
  }

  const lang = getLang();
  const activeFiltersLabel = lang === 'en' ? 'Active filters:' : lang === 'va' ? 'Filtres actius:' : 'Filtros activos:';
  const clearAllLabel = lang === 'en' ? 'Clear all' : lang === 'va' ? 'Netejar tots' : 'Limpiar todo';

  return `
    <div class="flex flex-wrap items-center gap-2 mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <span class="text-xs font-semibold text-gray-700">${activeFiltersLabel}</span>
      ${badges.join('')}
      <button id="oer-clear-all-filters" class="ml-auto px-2.5 py-1 rounded text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer border border-red-200">
        ${clearAllLabel}
      </button>
    </div>
  `;
}

// ── OER Grid (partial update target, survives search input) ────────────────────

function renderOerGridContent(search) {
  const oerBlock = KNOWLEDGE_CONFIG?.oerResourcesBlock;
  const hasCmsBlock = Boolean(oerBlock);
  const oerData = hasCmsBlock ? oerBlock.resources : (t('knowledge.oerResources') || []);

  const typeLabels = hasCmsBlock
    ? Object.fromEntries((oerBlock.typeLabels || []).map(tl => [tl.id, pickLang(tl.label, tl.id)]))
    : {
        'Guía':     t('knowledge.oerTypeGuide')    || 'Guía',
        'Manual':   t('knowledge.oerTypeManual')   || 'Manual',
        'Dataset':  t('knowledge.oerTypeDataset')  || 'Dataset',
        'Vídeo':    t('knowledge.oerTypeVideo')    || 'Vídeo',
        'Plantilla':t('knowledge.oerTypeTemplate') || 'Plantilla',
      };

  const typeIcons = hasCmsBlock
    ? Object.fromEntries((oerBlock.typeLabels || []).map(tl => [tl.id, tl.icon]))
    : TYPE_ICONS;

  const dlLabel  = hasCmsBlock ? pickLang(oerBlock.downloadLabel, '') : (t('knowledge.oerDownloadBtn') || '');
  const dlsLabel = hasCmsBlock ? pickLang(oerBlock.downloadsLabel, '') : (t('knowledge.oerDownloads') || '');

  // Apply search filter
  let filtered = search
    ? oerData.filter(r => {
        const titleStr = hasCmsBlock ? pickLang(r.title, '') : (r.title || '');
        const sectorIds = hasCmsBlock
          ? (Array.isArray(r.sectorIds) ? r.sectorIds : (r.sectorId ? [r.sectorId] : []))
          : (r.sector ? [r.sector] : []);
        const sectorStr = sectorIds.map(id => getSectorName(id)).join(' ');
        return titleStr.toLowerCase().includes(search.toLowerCase()) ||
               sectorStr.toLowerCase().includes(search.toLowerCase());
      })
    : oerData;

  // Apply filter chips
  const activeFilters = getOerFilters();
  if (activeFilters.typeId || activeFilters.sectors.length > 0 || activeFilters.levels.length > 0 || activeFilters.validationStatus) {
    filtered = filtered.filter(r => {
      // Type filter
      if (activeFilters.typeId && r.typeId !== activeFilters.typeId) return false;
      // Sector filter (OR logic: resource must have at least one selected sector)
      if (activeFilters.sectors.length > 0) {
        const rSectorIds = hasCmsBlock
          ? (Array.isArray(r.sectorIds) ? r.sectorIds : (r.sectorId ? [r.sectorId] : []))
          : (r.sector ? [r.sector] : []);
        if (!activeFilters.sectors.some(s => rSectorIds.includes(s))) return false;
      }
      // Level filter (OR logic: resource must have at least one selected level)
      if (activeFilters.levels.length > 0) {
        const rLevels = hasCmsBlock
          ? (Array.isArray(r.levels) ? r.levels : (r.level && r.level !== 'Todos' ? [r.level] : []))
          : (r.level && r.level !== 'Todos' ? [r.level] : []);
        if (!activeFilters.levels.some(l => rLevels.includes(l))) return false;
      }
      // Validation status filter
      if (activeFilters.validationStatus && r.validationStatus !== activeFilters.validationStatus) return false;
      return true;
    });
  }

  // ── Pagination ──
  const pageSizeOpts = hasCmsBlock && Array.isArray(oerBlock.pageSizeOptions)
    ? oerBlock.pageSizeOptions : [9, 18, 36];
  const showAllOpt  = hasCmsBlock ? (oerBlock.showAllOption !== false) : true;
  const showAllLbl  = hasCmsBlock ? pickLang(oerBlock.showAllLabel, 'Todos') : 'Todos';
  const emptyMsg    = hasCmsBlock ? pickLang(oerBlock.emptyMessage, '') : '';

  const pageSize   = getState('oerPageSize') || pageSizeOpts[0];
  const isAll      = pageSize === 'all';
  const rawPage    = getState('oerPage') || 0;
  const totalPages = isAll ? 1 : Math.ceil(filtered.length / pageSize);
  const safePage   = Math.min(rawPage, Math.max(0, totalPages - 1));
  const paginated  = isAll ? filtered : filtered.slice(safePage * pageSize, (safePage + 1) * pageSize);

  const count      = filtered.length;
  const countLabel = `${count} ${count !== 1 ? getOerLabel('resources') : getOerLabel('resource')}`;

  const pageSizeHtml = `
    <div class="flex gap-1">
      ${pageSizeOpts.map(n => `<button data-oer-pagesize="${n}" class="px-2 py-1 rounded border cursor-pointer text-xs font-semibold transition-colors ${pageSize === n ? 'bg-eu-blue text-white border-eu-blue' : 'bg-white text-gray-700 border-eu-border hover:border-eu-blue'}">${n}</button>`).join('')}
      ${showAllOpt ? `<button data-oer-pagesize="all" class="px-2 py-1 rounded border cursor-pointer text-xs font-semibold transition-colors ${pageSize === 'all' ? 'bg-eu-blue text-white border-eu-blue' : 'bg-white text-gray-700 border-eu-border hover:border-eu-blue'}">${showAllLbl}</button>` : ''}
    </div>`;

  const paginationHtml = !isAll && totalPages > 1 ? `
    <div class="flex gap-2 justify-center mt-6 items-center">
      <button id="oer-pag-prev" class="px-3 py-1.5 rounded border text-sm cursor-pointer transition-colors border-eu-border ${safePage === 0 ? 'opacity-40 pointer-events-none' : 'hover:border-eu-blue'}">
        ← ${getOerLabel('previous')}
      </button>
      <span class="px-3 py-1 text-xs text-gray-500">${safePage + 1} / ${totalPages}</span>
      <button id="oer-pag-next" class="px-3 py-1.5 rounded border text-sm cursor-pointer transition-colors border-eu-border ${safePage >= totalPages - 1 ? 'opacity-40 pointer-events-none' : 'hover:border-eu-blue'}">
        ${getOerLabel('next')} →
      </button>
    </div>` : '';

  const rowsHtml = paginated.map(r => {
    const rTitle  = hasCmsBlock ? pickLang(r.title, '') : (r.title || '');
    const rTypeId = hasCmsBlock ? r.typeId : r.type;
    const rType   = typeLabels[rTypeId] || rTypeId;
    const rIcon   = typeIcons[rTypeId] || '📄';
    const activeFilters = getOerFilters();
    const rSectorIds = hasCmsBlock
      ? (Array.isArray(r.sectorIds) ? r.sectorIds : (r.sectorId ? [r.sectorId] : []))
      : (r.sector ? [r.sector] : []);
    const rSectorsHtml = rSectorIds.map(sid => {
      const isActive = activeFilters.sectors.includes(sid);
      return `<button data-filter-sector="${sid}" class="text-xs font-semibold px-1.5 py-0.5 rounded cursor-pointer transition-all ${SECTOR_COLORS[sid] || 'bg-gray-100 text-gray-600'} ${isActive ? 'ring-2 ring-offset-1 ring-eu-blue' : ''}" title="Filtrar por sector">${getSectorName(sid)}</button>`;
    }).join(' ');
    const rLevels = hasCmsBlock
      ? (Array.isArray(r.levels) ? r.levels : (r.level && r.level !== 'Todos' ? [r.level] : ['FP', 'Máster', 'Docentes']))
      : (r.level && r.level !== 'Todos' ? [r.level] : ['FP', 'Máster', 'Docentes']);
    const rLevelsHtml = rLevels.map(l => {
      const isActive = activeFilters.levels.includes(l);
      const label = LEVEL_LABELS[l] ? pickLang(LEVEL_LABELS[l], l) : l;
      return `<button data-filter-level="${l}" class="text-xs font-bold px-1.5 py-0.5 rounded cursor-pointer transition-all ${LEVEL_COLORS[l] || 'bg-gray-100 text-gray-600'} ${isActive ? 'ring-2 ring-offset-1 ring-eu-blue' : ''}" title="Filtrar por nivel">${label}</button>`;
    }).join(' ');
    const rUrl    = r.url || '';
    const rLinkType = r.linkType || 'external';
    const rExternal = r.external === true;
    const linkIcon = rLinkType === 'download' ? 'download' : 'external-link';
    const linkText = rLinkType === 'download'
      ? (getLang() === 'en' ? 'Download' : getLang() === 'va' ? 'Descarregar' : 'Descargar')
      : (getLang() === 'en' ? 'View' : getLang() === 'va' ? 'Veure' : 'Ver');
    const linkButtonHtml = rUrl
      ? `<a href="${rUrl}"${rExternal ? ' target="_blank" rel="noopener noreferrer"' : ''} class="flex items-center gap-1 text-eu-blue text-xs font-bold hover:underline cursor-pointer"><i data-lucide="${linkIcon}" class="w-3 h-3"></i>${linkText}</a>`
      : `<span class="flex items-center gap-1 text-gray-400 text-xs font-bold"><i data-lucide="${linkIcon}" class="w-3 h-3"></i>${linkText}</span>`;

    return `
    <div class="bg-white rounded-xl border border-eu-border shadow-sm flex flex-col overflow-hidden hover:border-eu-blue hover:shadow-md transition-all">
      <div class="p-6 flex-1 flex flex-col">
        <!-- Header: Type + Levels (secondary, compact) -->
        <div class="flex items-center gap-2 mb-3">
          <span class="text-2xl flex-shrink-0">${rIcon}</span>
          <span class="text-xs font-bold uppercase text-gray-600 tracking-wider">${rType}</span>
          <div class="flex gap-1 ml-auto">${rLevelsHtml}</div>
        </div>

        <!-- Title: Larger and more prominent -->
        <h3 class="font-bold text-eu-text text-lg mb-5 leading-tight line-clamp-3">${rTitle}</h3>

        <!-- Sectors with visual separation -->
        <div class="flex flex-wrap gap-2 mb-5 pb-4 border-b border-gray-200">${rSectorsHtml}</div>

        <!-- Author + Metadata (compact) -->
        <div class="mb-4 pb-4 border-b border-gray-200">
          <div class="text-sm text-gray-800 font-semibold mb-1">
            ${r.author ? `${r.author}` : `<span class="text-gray-400">${getOerLabel('noAuthor')}</span>`}
          </div>
          <div class="text-xs text-gray-500 flex gap-2 flex-wrap">
            ${r.license ? `<span>${r.license}</span>` : ''}
            ${r.lang ? `<span>🌐 ${r.lang}</span>` : ''}
          </div>
        </div>

        <!-- Resource Details (compressed) -->
        <div class="text-xs text-gray-500 space-y-1">
          ${r.date || r.duration || r.format ? `<div>
            ${r.date ? `${getOerLabel('created')}: ${r.date}` : ''}
            ${r.duration ? `${r.date ? ' | ' : ''}⏱️ ${r.duration}` : ''}
            ${r.format ? `${r.date || r.duration ? ' | ' : ''}📄 ${r.format}` : ''}
          </div>` : ''}
          ${r.updatedAt ? `<div class="text-eu-blue font-medium">✎ ${getOerLabel('updated')}: ${r.updatedAt}</div>` : ''}
        </div>
      </div>

      <!-- Footer: Status badge (compact, clickable) + Link button (primary) -->
      <div class="border-t border-gray-200 p-4 flex items-center justify-between gap-3 bg-white">
        <button data-filter-status="${r.validationStatus || 'validated'}" class="text-xs font-semibold px-2.5 py-1 rounded whitespace-nowrap cursor-pointer transition-all ${(() => {
          const status = r.validationStatus || 'validated';
          const activeFilters = getOerFilters();
          const baseColors = { validated: 'bg-green-100 text-green-800', pending: 'bg-amber-100 text-amber-800', draft: 'bg-gray-100 text-gray-700' };
          const color = baseColors[status] || baseColors.validated;
          const isActive = activeFilters.validationStatus === status;
          return `${color} ${isActive ? 'ring-2 ring-offset-1 ring-eu-blue' : ''}`;
        })()}" title="${getOerLabel('filterByStatus')}">
          ${(() => {
            const status = r.validationStatus || 'validated';
            const icons = { validated: '✓', pending: '⏳', draft: '📝' };
            return `${icons[status] || '✓'} ${getStatusLabel(status)}`;
          })()}
        </button>
        ${rUrl ? `<a href="${rUrl}"${rExternal ? ' target="_blank" rel="noopener noreferrer"' : ''} class="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-eu-blue text-white text-sm font-bold hover:bg-eu-blue/90 transition-colors"><i data-lucide="${linkIcon}" class="w-4 h-4"></i>${linkText}</a>` : `<span class="inline-flex items-center gap-1.5 text-gray-400 text-sm font-bold"><i data-lucide="${linkIcon}" class="w-4 h-4"></i>${linkText}</span>`}
      </div>
    </div>
  `}).join('');

  const emptyHtml = filtered.length === 0
    ? `
    <div class="bg-white rounded-xl border border-eu-border shadow-sm p-12 text-center">
      <i data-lucide="search" class="w-12 h-12 text-gray-400 mx-auto mb-4"></i>
      <p class="text-gray-500 text-base">
        ${emptyMsg || (getLang() === 'en' ? 'No resources found matching your search'
          : getLang() === 'va' ? 'No s\'han trobat recursos amb la cerca'
          : 'No se encontraron recursos')}
      </p>
    </div>`
    : '';

  return `
    ${renderActiveFiltersDisplay()}
    <div class="flex items-center justify-between mb-4">
      <span class="text-xs text-gray-500 font-medium">${countLabel}</span>
      ${pageSizeHtml}
    </div>
    ${paginated.length > 0 ? `
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">${rowsHtml}</div>
      ${paginationHtml}` : emptyHtml}`;
}

// ── OER partial update — only replaces #oer-grid, preserves search input focus ──

function updateOerGrid() {
  const search    = getState('knowledgeSearch') || '';
  const container = document.getElementById('oer-grid');
  if (!container) return;
  container.innerHTML = renderOerGridContent(search);
  if (window.lucide) window.lucide.createIcons();
  attachOerPaginationListeners();
  attachOerFilterListeners();
}

function attachOerPaginationListeners() {
  document.querySelectorAll('[data-oer-pagesize]').forEach(btn => {
    btn.addEventListener('click', () => {
      const sz = btn.dataset.oerPagesize === 'all' ? 'all' : parseInt(btn.dataset.oerPagesize, 10);
      setState('oerPageSize', sz);
      setState('oerPage', 0);
      updateOerGrid();
    });
  });
  document.getElementById('oer-pag-prev')?.addEventListener('click', () => {
    const cur = getState('oerPage') || 0;
    if (cur > 0) { setState('oerPage', cur - 1); updateOerGrid(); }
  });
  document.getElementById('oer-pag-next')?.addEventListener('click', () => {
    setState('oerPage', (getState('oerPage') || 0) + 1);
    updateOerGrid();
  });
}

function attachOerFilterListeners() {
  // Type filter
  document.querySelectorAll('[data-filter-type]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const typeId = btn.dataset.filterType;
      const filters = getOerFilters();
      filters.typeId = filters.typeId === typeId ? null : typeId;
      setOerFilters(filters);
      setState('oerPage', 0);
      updateOerGrid();
    });
  });

  // Sector filter
  document.querySelectorAll('[data-filter-sector]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const sectorId = btn.dataset.filterSector;
      const filters = getOerFilters();
      if (filters.sectors.includes(sectorId)) {
        filters.sectors = filters.sectors.filter(s => s !== sectorId);
      } else {
        filters.sectors.push(sectorId);
      }
      setOerFilters(filters);
      setState('oerPage', 0);
      updateOerGrid();
    });
  });

  // Level filter
  document.querySelectorAll('[data-filter-level]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const level = btn.dataset.filterLevel;
      const filters = getOerFilters();
      if (filters.levels.includes(level)) {
        filters.levels = filters.levels.filter(l => l !== level);
      } else {
        filters.levels.push(level);
      }
      setOerFilters(filters);
      setState('oerPage', 0);
      updateOerGrid();
    });
  });

  // Validation status filter
  document.querySelectorAll('[data-filter-status]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const status = btn.dataset.filterStatus;
      const filters = getOerFilters();
      filters.validationStatus = filters.validationStatus === status ? null : status;
      setOerFilters(filters);
      setState('oerPage', 0);
      updateOerGrid();
    });
  });

  // Clear individual filters
  document.querySelectorAll('[data-remove-filter]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const filterType = btn.dataset.removeFilter;
      const filterValue = btn.dataset.filterValue;
      const filters = getOerFilters();

      if (filterType === 'type') {
        filters.typeId = null;
      } else if (filterType === 'sector') {
        filters.sectors = filters.sectors.filter(s => s !== filterValue);
      } else if (filterType === 'level') {
        filters.levels = filters.levels.filter(l => l !== filterValue);
      } else if (filterType === 'status') {
        filters.validationStatus = null;
      }
      setOerFilters(filters);
      setState('oerPage', 0);
      rerender();
    });
  });

  // Clear filters button (top)
  document.getElementById('oer-clear-filters')?.addEventListener('click', () => {
    setOerFilters({ typeId: null, sectors: [], levels: [], validationStatus: null });
    setState('oerPage', 0);
    rerender();
  });

  // Clear all filters button (in active filters panel)
  document.getElementById('oer-clear-all-filters')?.addEventListener('click', () => {
    setOerFilters({ typeId: null, sectors: [], levels: [], validationStatus: null });
    setState('oerPage', 0);
    rerender();
  });
}

// ─── Tab 3: Casos de Transferencia ───────────────────────────────────────────

function formatMonthYear(dateStr) {
  if (!dateStr) return '';
  const [year, month] = dateStr.split('-');
  const lang = getLang();
  const months = {
    es: ['', 'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    en: ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    va: ['', 'Gen', 'Feb', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Oct', 'Nov', 'Des']
  };
  const monthLabels = months[lang] || months.es;
  return `${monthLabels[parseInt(month, 10)] || month} ${year}`;
}

function tabCasos(search) {
  const casesBlock = KNOWLEDGE_CONFIG?.successCasesBlock;
  const hasCmsBlock = Boolean(casesBlock);

  if (hasCmsBlock && casesBlock.visible === false) {
    const lang = getLang();
    const noContentMsg = lang === 'en'
      ? 'No content available in this section yet'
      : lang === 'va'
        ? 'Encara no hi ha contingut disponible en aquesta secció'
        : 'Todavía no hay contenido disponible en esta sección';
    return `
    <div class="bg-white rounded-xl border border-eu-border shadow-sm p-12 text-center">
      <i data-lucide="inbox" class="w-12 h-12 text-gray-400 mx-auto mb-4"></i>
      <p class="text-gray-500 text-base">${noContentMsg}</p>
    </div>`;
  }

  const casesData = hasCmsBlock ? casesBlock.cases : (t('knowledge.successCases') || []);
  const showVerificationStatus = hasCmsBlock ? (casesBlock.showVerificationStatus !== false) : false;

  const blockTitle = hasCmsBlock ? pickLang(casesBlock.title, '') : (t('knowledge.casesTitle') || '');
  const blockDesc = hasCmsBlock ? pickLang(casesBlock.description, '') : (t('knowledge.casesDesc') || '');
  const searchPlh = hasCmsBlock ? pickLang(casesBlock.searchPlaceholder, '') : (t('knowledge.casesSearch') || 'Buscar casos...');

  return `
    <div>
      <div class="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h2 class="text-xl font-bold text-eu-text mb-1">${blockTitle}</h2>
          <p class="text-base text-gray-600 max-w-2xl">${blockDesc}</p>
        </div>
        <div class="relative">
          <i data-lucide="search" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"></i>
          <input id="casos-search" type="text" value="${(search || '').replace(/"/g, '&quot;')}"
            class="border border-eu-border rounded-md pl-9 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-eu-blue focus:border-eu-blue w-64"
            placeholder="${searchPlh}" />
          <button id="casos-search-clear" style="position:absolute;right:0.5rem;top:50%;transform:translateY(-50%)" class="w-5 h-5 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer ${search ? '' : 'hidden'}" title="Borrar búsqueda"><i data-lucide="x" class="w-3.5 h-3.5"></i></button>
        </div>
      </div>
      <div id="casos-grid">${renderCasosGridContent(search)}</div>
    </div>
  `;
}

function renderCasosGridContent(search) {
  const casesBlock = KNOWLEDGE_CONFIG?.successCasesBlock;
  const hasCmsBlock = Boolean(casesBlock);
  const casesData = hasCmsBlock ? casesBlock.cases : (t('knowledge.successCases') || []);
  const showVerificationStatus = hasCmsBlock ? (casesBlock.showVerificationStatus !== false) : false;

  // Sort by most recent date (revisionDate if present, else publishedAt)
  let sorted = [...casesData].sort((a, b) => {
    const dateA = a.revisionDate ? new Date(a.revisionDate).getTime() : new Date(a.publishedAt).getTime();
    const dateB = b.revisionDate ? new Date(b.revisionDate).getTime() : new Date(b.publishedAt).getTime();
    return dateB - dateA; // Descendente: más nuevas primero
  });

  // Apply search filter
  let filtered = search
    ? sorted.filter(c => {
        const cTitle = hasCmsBlock ? pickLang(c.title, '') : (c.title || '');
        const cOrg = c.originOrganization || c.organization || '';
        const cBens = (c.beneficiaryOrganizations || []).map(b => b.name || '').join(' ');
        const cSectorIds = Array.isArray(c.sectorIds) ? c.sectorIds : (c.sector ? [c.sector] : []);
        const cSectorStr = cSectorIds.map(id => getSectorName(id)).join(' ');
        const haystack = `${cTitle} ${cOrg} ${cBens} ${cSectorStr}`.toLowerCase();
        return haystack.includes(search.toLowerCase());
      })
    : sorted;

  // Apply chip filters
  const activeCasosFilters = getCasosFilters();
  const hasChipFilters = activeCasosFilters.sectors.length > 0 || activeCasosFilters.levels.length > 0 || activeCasosFilters.transferType || activeCasosFilters.verificationStatus;
  if (hasChipFilters) {
    filtered = filtered.filter(c => {
      if (activeCasosFilters.sectors.length > 0) {
        const cSectors = Array.isArray(c.sectorIds) ? c.sectorIds : (c.sector ? [c.sector] : []);
        if (!activeCasosFilters.sectors.some(s => cSectors.includes(s))) return false;
      }
      if (activeCasosFilters.levels.length > 0) {
        const cLevels = Array.isArray(c.levels) ? c.levels : (c.level ? [c.level] : []);
        if (!activeCasosFilters.levels.some(l => cLevels.includes(l))) return false;
      }
      if (activeCasosFilters.transferType && c.transferType !== activeCasosFilters.transferType) return false;
      if (activeCasosFilters.verificationStatus && c.verificationStatus !== activeCasosFilters.verificationStatus) return false;
      return true;
    });
  }

  // Pagination
  const pageSize = getState('casosPageSize') || 6;
  const isAll = pageSize === 'all';
  const rawPage = getState('casosPage') || 0;
  const totalPages = isAll ? 1 : Math.ceil(filtered.length / pageSize);
  const safePage = Math.min(rawPage, Math.max(0, totalPages - 1));
  const paginated = isAll ? filtered : filtered.slice(safePage * pageSize, (safePage + 1) * pageSize);

  const count = filtered.length;
  const countLabel = `${count} ${count !== 1 ? (getLang() === 'en' ? 'cases' : getLang() === 'va' ? 'casos' : 'casos') : (getLang() === 'en' ? 'case' : getLang() === 'va' ? 'cas' : 'caso')}`;

  const pageSizeHtml = `
    <div class="flex gap-1">
      ${[6, 12, 24].map(n => `<button data-casos-pagesize="${n}" class="px-2 py-1 rounded border cursor-pointer text-xs font-semibold transition-colors ${pageSize === n ? 'bg-eu-blue text-white border-eu-blue' : 'bg-white text-gray-700 border-eu-border hover:border-eu-blue'}">${n}</button>`).join('')}
      <button data-casos-pagesize="all" class="px-2 py-1 rounded border cursor-pointer text-xs font-semibold transition-colors ${pageSize === 'all' ? 'bg-eu-blue text-white border-eu-blue' : 'bg-white text-gray-700 border-eu-border hover:border-eu-blue'}">Todos</button>
    </div>`;

  const paginationHtml = !isAll && totalPages > 1 ? `
    <div class="flex gap-2 justify-center mt-6 items-center">
      <button id="casos-pag-prev" class="px-3 py-1.5 rounded border text-sm cursor-pointer transition-colors border-eu-border ${safePage === 0 ? 'opacity-40 pointer-events-none' : 'hover:border-eu-blue'}">
        ← ${getCasosLabel('previous')}
      </button>
      <span class="px-3 py-1 text-xs text-gray-500">${safePage + 1} / ${totalPages}</span>
      <button id="casos-pag-next" class="px-3 py-1.5 rounded border text-sm cursor-pointer transition-colors border-eu-border ${safePage >= totalPages - 1 ? 'opacity-40 pointer-events-none' : 'hover:border-eu-blue'}">
        ${getCasosLabel('next')} →
      </button>
    </div>` : '';

  const casesHtml = paginated.map(c => {
    const cTitle = hasCmsBlock ? pickLang(c.title, '') : (c.title || '');
    const cDescription = c.description ? pickLang(c.description, '') : null;
    const cResult = hasCmsBlock ? pickLang(c.result, '') : (c.result || '');
    const cLicense = c.license || '';

    // Transfer information
    const cOrigin = c.originOrganization || '';
    const cBeneficiaries = Array.isArray(c.beneficiaryOrganizations) ? c.beneficiaryOrganizations : [];
    const cTransferType = c.transferType || '';

    // Sectores: múltiples — clickables como filtro
    const cSectorIds = Array.isArray(c.sectorIds) ? c.sectorIds : (c.sector ? [c.sector] : []);
    const cSectorsHtml = cSectorIds.map(sid => {
      const isActive = activeCasosFilters.sectors.includes(sid);
      return `<button data-caso-filter-sector="${sid}" class="text-xs font-semibold px-2 py-0.5 rounded cursor-pointer transition-all ${SECTOR_COLORS[sid] || 'bg-gray-100 text-gray-600'} ${isActive ? 'ring-2 ring-offset-1 ring-eu-blue' : ''}" title="${getCasosLabel('filterSector')}">${getSectorName(sid)}</button>`;
    }).join(' ');

    // Niveles: múltiples — clickables como filtro
    const cLevels = Array.isArray(c.levels) ? c.levels : (c.level ? [c.level] : []);
    const cLevelsHtml = cLevels.map(l => {
      const label = LEVEL_LABELS[l] ? pickLang(LEVEL_LABELS[l], l) : l;
      const isActive = activeCasosFilters.levels.includes(l);
      return `<button data-caso-filter-level="${l}" class="text-xs font-bold px-2 py-0.5 rounded cursor-pointer transition-all ${LEVEL_COLORS[l] || 'bg-gray-100 text-gray-600'} ${isActive ? 'ring-2 ring-offset-1 ring-eu-blue' : ''}" title="${getCasosLabel('filterLevel')}">${label}</button>`;
    }).join(' ');

    // Fecha publicación
    const cPublishedAt = c.publishedAt ? formatMonthYear(c.publishedAt) : '';
    const cRevisionDate = c.revisionDate ? formatMonthYear(c.revisionDate) : null;

    // Campos opcionales (respetan flag show* — default true si no existe)
    const cTransferDesc = (c.showTransferDescription !== false) && c.transferDescription ? pickLang(c.transferDescription, '') : null;
    const cImpact = (c.showImpact !== false) && c.impact ? pickLang(c.impact, '') : null;
    const cEvidence = (c.showEvidence !== false) && c.evidence ? pickLang(c.evidence, '') : null;
    const cMainLink = (c.showMainLink !== false) && c.mainLink ? c.mainLink : null;
    const cDocumentation = (c.showDocumentation !== false) && c.documentation ? c.documentation : null;
    const cAdditionalUrl = (c.showAdditionalUrl !== false) && c.additionalUrl ? c.additionalUrl : null;

    // Verification status badge
    const statusLabels = casesBlock?.verificationStatusLabels || {};
    const cVerificationLabel = pickLang(statusLabels[c.verificationStatus], c.verificationStatus === 'verified' ? 'Verificado' : 'Pendiente');
    const verStatusIsActive = activeCasosFilters.verificationStatus === c.verificationStatus;
    const verificationStatusHtml = showVerificationStatus ? `
      <div>
        <button data-caso-filter-status="${c.verificationStatus}" class="text-sm font-bold px-3 py-1.5 rounded cursor-pointer transition-all ${c.verificationStatus === 'verified' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'} ${verStatusIsActive ? 'ring-2 ring-offset-1 ring-eu-blue' : ''}" title="${getCasosLabel('filterStatus')}">
          ${c.verificationStatus === 'verified' ? '✓' : '⏳'} ${cVerificationLabel}
        </button>
      </div>
    ` : '';

    return `
    <div class="bg-white rounded-xl border border-eu-border shadow-sm hover:shadow-md hover:border-eu-blue transition-all overflow-hidden flex flex-col">
      <!-- Header: Title + Status Badge -->
      <div class="border-b border-eu-border p-6 pb-4">
        <div class="flex flex-wrap items-start justify-between gap-4 mb-3">
          <div class="flex-1">
            <h3 class="text-lg font-bold text-eu-text mb-2">${cTitle}</h3>
            <!-- Transfer Info: Origin → Beneficiaries -->
            <div class="space-y-1 mb-2">
              <p class="text-sm text-gray-700"><span class="font-semibold">${getCasosLabel('createdBy')}</span> ${cOrigin}</p>
              <p class="text-sm text-gray-700">
                <span class="font-semibold">${getCasosLabel('adoptedBy')}</span> ${cBeneficiaries.map(b => b.name).join(', ')}
              </p>
              <button data-caso-filter-transfer="${cTransferType}" class="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded cursor-pointer transition-all ${TRANSFER_TYPE_COLOR} ${activeCasosFilters.transferType === cTransferType ? 'ring-2 ring-offset-1 ring-eu-blue' : ''}" title="${getCasosLabel('filterTransfer')}">
                <i data-lucide="${TRANSFER_TYPE_ICONS[cTransferType] || 'arrow-right'}" class="w-3 h-3"></i> ${pickLang(casesBlock?.transferTypeLabels?.[cTransferType] || TRANSFER_TYPE_LABELS[cTransferType], cTransferType)}
              </button>
            </div>
          </div>
          ${verificationStatusHtml}
        </div>

        <!-- Sectors and Levels -->
        <div class="flex flex-wrap gap-2">
          <div class="flex flex-wrap gap-1.5">${cSectorsHtml}</div>
          <div class="flex flex-wrap gap-1.5">${cLevelsHtml}</div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="p-6 flex-1 flex flex-col space-y-4">
        <!-- Description (optional) -->
        ${cDescription ? `<p class="text-base text-gray-700">${cDescription}</p>` : ''}

        <!-- Result -->
        <div>
          <p class="text-base text-gray-700 leading-relaxed">${cResult}</p>
        </div>

        <!-- Transfer Description (optional) -->
        ${cTransferDesc ? `
        <div class="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <p class="text-sm font-semibold text-blue-900 mb-1">🔄 ${getCasosLabel('howTransferred')}</p>
          <p class="text-base text-blue-800">${cTransferDesc}</p>
        </div>
        ` : ''}

        <!-- Impact (optional) -->
        ${cImpact ? `
        <div class="bg-blue-50 rounded-lg p-4 border border-blue-100">
          <p class="text-sm font-semibold text-blue-900 mb-1">📊 ${getCasosLabel('impact')}</p>
          <p class="text-base text-blue-800">${cImpact}</p>
        </div>
        ` : ''}

        <!-- Evidence (optional) -->
        ${cEvidence ? `
        <div class="bg-purple-50 rounded-lg p-4 border border-purple-100">
          <p class="text-sm font-semibold text-purple-900 mb-1">📋 ${getCasosLabel('evidence')}</p>
          <p class="text-base text-purple-800">${cEvidence}</p>
        </div>
        ` : ''}
      </div>

      <!-- Technical Metadata -->
      <div class="border-t border-eu-border px-6 py-4 bg-eu-bg space-y-2 text-sm">
        <div class="flex items-center justify-between">
          <span class="text-gray-600">${getCasosLabel('published')}</span>
          <span class="font-semibold text-gray-800">${cPublishedAt}</span>
        </div>
        ${cRevisionDate ? `
        <div class="flex items-center justify-between">
          <span class="text-gray-600">${getCasosLabel('revised')}</span>
          <span class="font-semibold text-gray-800">${cRevisionDate}</span>
        </div>
        ` : ''}
        <div class="flex items-center justify-between">
          <span class="text-gray-600">${getCasosLabel('license')}</span>
          <span class="font-semibold text-gray-800">${cLicense}</span>
        </div>
      </div>

      <!-- Footer: Links -->
      <div class="border-t border-eu-border p-6 flex flex-wrap gap-3">
        ${cMainLink ? `
        <a href="${cMainLink.url}" ${cMainLink.externalLink ? 'target="_blank" rel="noopener noreferrer"' : ''} class="inline-flex items-center gap-2 text-eu-blue font-bold text-base hover:underline cursor-pointer transition-colors">
          <i data-lucide="arrow-right" class="w-4 h-4"></i>${getCasosLabel('viewCase')}
        </a>
        ` : ''}
        ${cDocumentation ? `
        <a href="${cDocumentation.url}" ${cDocumentation.externalLink !== false ? 'target="_blank" rel="noopener noreferrer"' : ''} class="inline-flex items-center gap-2 text-eu-blue font-bold text-base hover:underline cursor-pointer transition-colors">
          <i data-lucide="book-open" class="w-4 h-4"></i>${getCasosLabel('documentation')}
        </a>
        ` : ''}
        ${cAdditionalUrl ? `
        <a href="${cAdditionalUrl.url}" ${cAdditionalUrl.externalLink !== false ? 'target="_blank" rel="noopener noreferrer"' : ''} class="inline-flex items-center gap-2 text-eu-blue font-bold text-base hover:underline cursor-pointer transition-colors">
          <i data-lucide="download" class="w-4 h-4"></i>${pickLang(cAdditionalUrl.label, getCasosLabel('resources'))}
        </a>
        ` : ''}
      </div>
    </div>
  `;
  }).join('');

  const emptyHtml = filtered.length === 0
    ? `
    <div class="bg-white rounded-xl border border-eu-border shadow-sm p-12 text-center">
      <i data-lucide="${search ? 'search' : 'inbox'}" class="w-12 h-12 text-gray-400 mx-auto mb-4"></i>
      <p class="text-gray-500 text-base">
        ${search
          ? (getLang() === 'en' ? 'No cases found matching your search'
            : getLang() === 'va' ? 'No s\'han trobat casos amb la cerca'
            : 'No se encontraron casos')
          : (getLang() === 'en' ? 'No transfer cases registered yet'
            : getLang() === 'va' ? 'Aún no hi ha casos de transferència registrats'
            : 'Aún no hay casos de transferencia registrados')}
      </p>
    </div>`
    : '';

  return `
    ${renderCasosActiveFiltersDisplay()}
    <div class="flex items-center justify-between mb-4">
      <span class="text-xs text-gray-500 font-medium">${countLabel}</span>
      ${pageSizeHtml}
    </div>
    ${paginated.length > 0 ? `
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">${casesHtml}</div>
      ${paginationHtml}` : emptyHtml}`;
}

function updateCasosGrid() {
  const search = getState('casosSearch') || '';
  const container = document.getElementById('casos-grid');
  if (!container) return;
  container.innerHTML = renderCasosGridContent(search);
  if (window.lucide) window.lucide.createIcons();
  attachCasosPaginationListeners();
  attachCasosFilterListeners();
}

function attachCasosPaginationListeners() {
  document.querySelectorAll('[data-casos-pagesize]').forEach(btn => {
    btn.addEventListener('click', () => {
      const sz = btn.dataset.casosPagesize === 'all' ? 'all' : parseInt(btn.dataset.casosPagesize, 10);
      setState('casosPageSize', sz);
      setState('casosPage', 0);
      updateCasosGrid();
    });
  });
  document.getElementById('casos-pag-prev')?.addEventListener('click', () => {
    const cur = getState('casosPage') || 0;
    if (cur > 0) { setState('casosPage', cur - 1); updateCasosGrid(); }
  });
  document.getElementById('casos-pag-next')?.addEventListener('click', () => {
    setState('casosPage', (getState('casosPage') || 0) + 1);
    updateCasosGrid();
  });
}

function attachCasosFilterListeners() {
  // Sector chip filter
  document.querySelectorAll('[data-caso-filter-sector]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const sid = btn.dataset.casoFilterSector;
      const f = getCasosFilters();
      if (f.sectors.includes(sid)) f.sectors = f.sectors.filter(s => s !== sid);
      else f.sectors.push(sid);
      setCasosFilters(f);
      setState('casosPage', 0);
      updateCasosGrid();
    });
  });

  // Level chip filter
  document.querySelectorAll('[data-caso-filter-level]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const l = btn.dataset.casoFilterLevel;
      const f = getCasosFilters();
      if (f.levels.includes(l)) f.levels = f.levels.filter(x => x !== l);
      else f.levels.push(l);
      setCasosFilters(f);
      setState('casosPage', 0);
      updateCasosGrid();
    });
  });

  // Transfer type filter (toggle)
  document.querySelectorAll('[data-caso-filter-transfer]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const tt = btn.dataset.casoFilterTransfer;
      const f = getCasosFilters();
      f.transferType = f.transferType === tt ? null : tt;
      setCasosFilters(f);
      setState('casosPage', 0);
      updateCasosGrid();
    });
  });

  // Verification status filter (toggle)
  document.querySelectorAll('[data-caso-filter-status]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const st = btn.dataset.casoFilterStatus;
      const f = getCasosFilters();
      f.verificationStatus = f.verificationStatus === st ? null : st;
      setCasosFilters(f);
      setState('casosPage', 0);
      updateCasosGrid();
    });
  });

  // Remove individual filter badges
  document.querySelectorAll('[data-caso-remove-filter]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const type = btn.dataset.casoRemoveFilter;
      const val = btn.dataset.filterValue;
      const f = getCasosFilters();
      if (type === 'sector') f.sectors = f.sectors.filter(s => s !== val);
      else if (type === 'level') f.levels = f.levels.filter(l => l !== val);
      else if (type === 'transfer') f.transferType = null;
      else if (type === 'status') f.verificationStatus = null;
      setCasosFilters(f);
      setState('casosPage', 0);
      updateCasosGrid();
    });
  });

  // Clear all filters (panel button)
  document.getElementById('casos-clear-all-filters')?.addEventListener('click', () => {
    setCasosFilters({ sectors: [], levels: [], transferType: null, verificationStatus: null });
    setState('casosPage', 0);
    updateCasosGrid();
  });

}

// ─── Tab 4: Evidencias de Pilotaje ───────────────────────────────────────────

const PILOT_TYPE_CHIP   = 'bg-gray-100 text-gray-700 border border-gray-300';
const HELIX_CHIP        = 'bg-indigo-50 text-indigo-700 border border-indigo-200';
const TRANSITION_CHIP   = 'bg-teal-50 text-teal-700 border border-teal-200';
const STATUS_CHIP = {
  'in-design':   'bg-gray-100 text-gray-700',
  'in-progress': 'bg-orange-100 text-orange-800',
  'completed':   'bg-green-100 text-green-800',
  'in-review':   'bg-amber-100 text-amber-800',
  'validated':   'bg-emerald-100 text-emerald-800',
};

function getEvidLabel(key) {
  const lang = getLang();
  const labels = {
    participants:   { es: 'participantes',   en: 'participants',   va: 'participants' },
    leadOrg:        { es: 'Líder:',          en: 'Lead:',          va: 'Líder:' },
    partners:       { es: 'Partners:',       en: 'Partners:',      va: 'Partners:' },
    deliverable:    { es: 'Entregable:',     en: 'Deliverable:',   va: 'Lliurable:' },
    relatedCase:    { es: 'Caso:',           en: 'Case:',          va: 'Cas:' },
    relatedOer:     { es: 'Recurso:',        en: 'Resource:',      va: 'Recurs:' },
    objective:      { es: 'Objetivo',        en: 'Objective',      va: 'Objectiu' },
    methodology:    { es: 'Metodología',     en: 'Methodology',    va: 'Metodologia' },
    outcome:        { es: 'Resultado',       en: 'Outcome',        va: 'Resultat' },
    helix:          { es: 'Hélice:',         en: 'Helix:',         va: 'Hèlix:' },
    transitions:    { es: 'Transiciones:',   en: 'Transitions:',   va: 'Transicions:' },
    filterType:     { es: 'Filtrar por tipo de piloto',   en: 'Filter by pilot type',   va: 'Filtrar per tipus de pilot' },
    filterStatus:   { es: 'Filtrar por estado',           en: 'Filter by status',       va: 'Filtrar per estat' },
    filterSector:   { es: 'Filtrar por sector',           en: 'Filter by sector',       va: 'Filtrar per sector' },
    filterLevel:    { es: 'Filtrar por nivel',            en: 'Filter by level',        va: 'Filtrar per nivell' },
    filterHelix:    { es: 'Filtrar por hélice',           en: 'Filter by helix',        va: 'Filtrar per hèlix' },
    filterTrans:    { es: 'Filtrar por transición',       en: 'Filter by transition',   va: 'Filtrar per transició' },
    activeFilters:  { es: 'Filtros activos:', en: 'Active filters:', va: 'Filtres actius:' },
    clearAll:       { es: 'Limpiar todo',     en: 'Clear all',       va: 'Netejar tots' },
    previous:       { es: 'Anterior',         en: 'Previous',        va: 'Anterior' },
    next:           { es: 'Siguiente',        en: 'Next',            va: 'Següent' },
    noResults:      { es: 'No se encontraron evidencias', en: 'No evidence found', va: 'No s\'han trobat evidències' },
    viewEvidence:   { es: 'Ver evidencia',    en: 'View evidence',   va: 'Veure evidència' },
    documentation:  { es: 'Documentación',    en: 'Documentation',   va: 'Documentació' },
  };
  return labels[key]?.[lang] || key;
}

function getEvidFilters() {
  try {
    const p = JSON.parse(localStorage.getItem('evidFilters') || '{}');
    return {
      pilotType: p.pilotType || null,
      status: p.status || null,
      sectors: p.sectors || [],
      levels: p.levels || [],
      helix: p.helix || [],
      transitions: p.transitions || [],
    };
  } catch {
    return { pilotType: null, status: null, sectors: [], levels: [], helix: [], transitions: [] };
  }
}
function setEvidFilters(f) { localStorage.setItem('evidFilters', JSON.stringify(f)); }

function tabEvidencia() {
  const block = KNOWLEDGE_CONFIG?.pilotEvidencesBlock;
  if (!block) {
    return `<div class="bg-white rounded-xl border border-eu-border shadow-sm p-12 text-center">
      <i data-lucide="inbox" class="w-12 h-12 text-gray-400 mx-auto mb-4"></i>
      <p class="text-gray-500 text-base">${getEvidLabel('noResults')}</p>
    </div>`;
  }
  if (block.visible === false) {
    const lang = getLang();
    const msg = lang === 'en' ? 'No content available in this section yet'
              : lang === 'va' ? 'Encara no hi ha contingut disponible en aquesta secció'
              : 'Todavía no hay contenido disponible en esta sección';
    return `<div class="bg-white rounded-xl border border-eu-border shadow-sm p-12 text-center">
      <i data-lucide="inbox" class="w-12 h-12 text-gray-400 mx-auto mb-4"></i>
      <p class="text-gray-500 text-base">${msg}</p>
    </div>`;
  }

  const search = getState('evidSearch') || '';
  const title = pickLang(block.title, '');
  const desc = pickLang(block.description, '');
  const placeholder = pickLang(block.searchPlaceholder, '');
  const demo = block.demoNotice || {};
  const demoText = pickLang(demo.text, '');

  return `
    <div>
      <div class="flex flex-wrap items-start justify-between gap-4 mb-4">
        <div>
          <h2 class="text-xl font-bold text-eu-text mb-1">${title}</h2>
          <p class="text-base text-gray-600 max-w-2xl">${desc}</p>
        </div>
        <div class="relative">
          <i data-lucide="search" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"></i>
          <input id="evid-search" type="text" value="${(search || '').replace(/"/g, '&quot;')}"
            class="border border-eu-border rounded-md pl-9 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-eu-blue focus:border-eu-blue w-64"
            placeholder="${placeholder}" />
          <button id="evid-search-clear" style="position:absolute;right:0.5rem;top:50%;transform:translateY(-50%)" class="w-5 h-5 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer ${search ? '' : 'hidden'}" title="Borrar búsqueda"><i data-lucide="x" class="w-3.5 h-3.5"></i></button>
        </div>
      </div>
      ${(demo.visible !== false && demoText) ? `
      <div class="bg-amber-50 border border-amber-200 rounded-xl px-5 py-3 mb-6 flex items-start gap-3">
        <span class="text-amber-500 text-lg mt-0.5">⚠️</span>
        <p class="text-xs text-amber-700">${demoText}</p>
      </div>` : ''}
      <div id="evid-grid">${renderEvidGridContent(search)}</div>
    </div>
  `;
}

function renderEvidGridContent(search) {
  const block = KNOWLEDGE_CONFIG?.pilotEvidencesBlock;
  if (!block) return '';
  const evidences = Array.isArray(block.evidences) ? block.evidences : [];

  // Sort by startDate desc
  let sorted = [...evidences].sort((a, b) => {
    const da = new Date(a.startDate || '1970-01-01').getTime();
    const db = new Date(b.startDate || '1970-01-01').getTime();
    return db - da;
  });

  // Text search
  let filtered = search ? sorted.filter(e => {
    const tt = pickLang(e.title, '');
    const sm = pickLang(e.summary, '');
    const lead = e.leadOrganization || '';
    const partners = (e.partnerOrganizations || []).map(p => p.name).join(' ');
    const deliv = e.relatedDeliverable || '';
    const hay = `${e.id} ${tt} ${sm} ${lead} ${partners} ${deliv}`.toLowerCase();
    return hay.includes(search.toLowerCase());
  }) : sorted;

  // Chip filters
  const f = getEvidFilters();
  filtered = filtered.filter(e => {
    if (f.pilotType && e.pilotType !== f.pilotType) return false;
    if (f.status && e.status !== f.status) return false;
    if (f.sectors.length && !f.sectors.some(s => (e.sectorIds || []).includes(s))) return false;
    if (f.levels.length && !f.levels.some(l => (e.levels || []).includes(l))) return false;
    if (f.helix.length && !f.helix.some(h => (e.helix || []).includes(h))) return false;
    if (f.transitions.length && !f.transitions.some(t => (e.transitions || []).includes(t))) return false;
    return true;
  });

  // Pagination
  const pageOptions = Array.isArray(block.pageSizeOptions) ? block.pageSizeOptions : [6, 12, 24];
  const pageSize = getState('evidPageSize') || pageOptions[0];
  const isAll = pageSize === 'all';
  const rawPage = getState('evidPage') || 0;
  const totalPages = isAll ? 1 : Math.ceil(filtered.length / pageSize);
  const safePage = Math.min(rawPage, Math.max(0, totalPages - 1));
  const paginated = isAll ? filtered : filtered.slice(safePage * pageSize, (safePage + 1) * pageSize);

  const ptLabels = block.pilotTypeLabels || {};
  const stLabels = block.statusLabels || {};
  const hxLabels = block.helixLabels || {};
  const trLabels = block.transitionLabels || {};

  // Cards
  const cardsHtml = paginated.length === 0 ? `
    <div class="bg-white rounded-xl border border-eu-border shadow-sm p-12 text-center">
      <i data-lucide="${search ? 'search' : 'inbox'}" class="w-12 h-12 text-gray-400 mx-auto mb-4"></i>
      <p class="text-gray-500 text-base">${search ? getEvidLabel('noResults') : pickLang(block.emptyMessage, getEvidLabel('noResults'))}</p>
    </div>
  ` : `<div class="space-y-5">${paginated.map(e => renderEvidCard(e, ptLabels, stLabels, hxLabels, trLabels)).join('')}</div>`;

  // Active filters panel
  const activeChips = [];
  if (f.pilotType) activeChips.push({ kind: 'pilotType', value: f.pilotType, label: pickLang(ptLabels[f.pilotType], f.pilotType), cls: PILOT_TYPE_CHIP });
  if (f.status) activeChips.push({ kind: 'status', value: f.status, label: pickLang(stLabels[f.status], f.status), cls: STATUS_CHIP[f.status] || 'bg-gray-100 text-gray-700' });
  for (const s of f.sectors) activeChips.push({ kind: 'sectors', value: s, label: getSectorName(s), cls: SECTOR_COLORS[s] || 'bg-gray-100 text-gray-600' });
  for (const l of f.levels) activeChips.push({ kind: 'levels', value: l, label: pickLang(LEVEL_LABELS[l], l), cls: LEVEL_COLORS[l] || 'bg-gray-100 text-gray-700' });
  for (const h of f.helix) activeChips.push({ kind: 'helix', value: h, label: pickLang(hxLabels[h], h), cls: HELIX_CHIP });
  for (const tr of f.transitions) activeChips.push({ kind: 'transitions', value: tr, label: pickLang(trLabels[tr], tr), cls: TRANSITION_CHIP });

  const activeFiltersHtml = activeChips.length ? `
    <div class="bg-eu-bg border border-eu-border rounded-xl p-4 mb-5">
      <div class="flex flex-wrap items-center gap-2">
        <span class="text-xs font-semibold text-gray-600 mr-1">${getEvidLabel('activeFilters')}</span>
        ${activeChips.map(c => `
          <span class="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded ${c.cls}">
            ${c.label}
            <button class="evid-filter-remove ml-1 text-gray-600 hover:text-red-600 cursor-pointer" data-kind="${c.kind}" data-value="${c.value}">×</button>
          </span>
        `).join('')}
        <button id="evid-filter-clear-all" class="text-xs text-eu-blue font-semibold hover:underline cursor-pointer ml-2">${getEvidLabel('clearAll')}</button>
      </div>
    </div>
  ` : '';

  // Pagination controls
  const showAll = block.showAllOption !== false;
  const showAllLabel = pickLang(block.showAllLabel, 'Todas');
  const pageSelector = `
    <div class="flex flex-wrap items-center justify-between gap-3 mt-6">
      <div class="text-xs text-gray-600">${filtered.length}</div>
      <div class="flex items-center gap-2">
        <label class="text-xs text-gray-600">Página:</label>
        <select id="evid-page-size" class="border border-eu-border rounded px-2 py-1 text-xs cursor-pointer">
          ${pageOptions.map(o => `<option value="${o}" ${pageSize === o ? 'selected' : ''}>${o}</option>`).join('')}
          ${showAll ? `<option value="all" ${isAll ? 'selected' : ''}>${showAllLabel}</option>` : ''}
        </select>
        ${!isAll && totalPages > 1 ? `
          <button id="evid-prev" class="px-2 py-1 text-xs border border-eu-border rounded cursor-pointer hover:bg-eu-bg" ${safePage === 0 ? 'disabled' : ''}>${getEvidLabel('previous')}</button>
          <span class="text-xs">${safePage + 1} / ${totalPages}</span>
          <button id="evid-next" class="px-2 py-1 text-xs border border-eu-border rounded cursor-pointer hover:bg-eu-bg" ${safePage >= totalPages - 1 ? 'disabled' : ''}>${getEvidLabel('next')}</button>
        ` : ''}
      </div>
    </div>
  `;

  return `${activeFiltersHtml}${cardsHtml}${pageSelector}`;
}

function renderEvidCard(e, ptLabels, stLabels, hxLabels, trLabels) {
  const tt = pickLang(e.title, '');
  const sm = pickLang(e.summary, '');
  const ptLabel = pickLang(ptLabels[e.pilotType], e.pilotType);
  const stLabel = pickLang(stLabels[e.status], e.status);
  const stCls = STATUS_CHIP[e.status] || 'bg-gray-100 text-gray-700';

  const sectorChips = (e.sectorIds || []).map(s => `
    <span class="text-xs font-bold px-1.5 py-0.5 rounded ${SECTOR_COLORS[s] || 'bg-gray-100 text-gray-600'}">${getSectorName(s)}</span>
  `).join('');
  const levelChips = (e.levels || []).map(l => `
    <span class="text-xs font-bold px-1.5 py-0.5 rounded ${LEVEL_COLORS[l] || 'bg-gray-100 text-gray-700'}">${pickLang(LEVEL_LABELS[l], l)}</span>
  `).join('');
  const helixChips = (e.helix || []).map(h => `
    <span class="text-xs font-semibold px-1.5 py-0.5 rounded ${HELIX_CHIP}">${pickLang(hxLabels[h], h)}</span>
  `).join('');
  const transChips = (e.transitions || []).map(tr => `
    <span class="text-xs font-semibold px-1.5 py-0.5 rounded ${TRANSITION_CHIP}">${pickLang(trLabels[tr], tr)}</span>
  `).join('');

  const objective   = (e.showObjective   !== false) && e.objective   ? pickLang(e.objective,   '') : null;
  const methodology = (e.showMethodology !== false) && e.methodology ? pickLang(e.methodology, '') : null;
  const outcome     = (e.showOutcome     !== false) && e.outcome     ? pickLang(e.outcome,     '') : null;

  const evLink = (e.showEvidenceLink !== false) && e.evidenceLink && e.evidenceLink.url ? e.evidenceLink : null;
  const docLink = (e.showDocumentation !== false) && e.documentation && e.documentation.url ? e.documentation : null;
  const addLink = (e.showAdditionalUrl !== false) && e.additionalUrl && e.additionalUrl.url ? e.additionalUrl : null;

  const partners = (e.partnerOrganizations || []).filter(p => p.name).map(p => p.role ? `${p.name} (${p.role})` : p.name).join(', ');
  const dates = e.startDate ? (e.endDate && e.endDate !== e.startDate ? `${e.startDate} → ${e.endDate}` : e.startDate) : '';

  return `
    <div class="bg-white rounded-xl border border-eu-border shadow-sm p-6 hover:border-eu-blue transition-colors">
      <div class="flex flex-wrap items-start justify-between gap-3 mb-3">
        <div class="flex-1 min-w-0">
          <h3 class="font-bold text-eu-text text-base mb-1">${tt}</h3>
          ${sm ? `<p class="text-sm text-gray-600 mb-2">${sm}</p>` : ''}
          <div class="flex flex-wrap gap-1.5 items-center">
            <span class="text-xs font-semibold px-1.5 py-0.5 rounded ${PILOT_TYPE_CHIP}">${ptLabel}</span>
            ${sectorChips}
            ${levelChips}
          </div>
        </div>
        <span class="text-xs font-bold px-2 py-0.5 rounded ${stCls}">${stLabel}</span>
      </div>

      ${(helixChips || transChips) ? `
        <div class="flex flex-wrap gap-1.5 mb-3">
          ${helixChips}
          ${transChips}
        </div>` : ''}

      <div class="text-xs text-gray-500 space-y-0.5 mb-3">
        ${e.leadOrganization ? `<p><span class="font-semibold">${getEvidLabel('leadOrg')}</span> <span class="text-eu-blue font-semibold">${e.leadOrganization}</span></p>` : ''}
        ${partners ? `<p><span class="font-semibold">${getEvidLabel('partners')}</span> ${partners}</p>` : ''}
        ${e.relatedDeliverable ? `<p><span class="font-semibold">${getEvidLabel('deliverable')}</span> <span class="font-mono">${e.relatedDeliverable}</span></p>` : ''}
        ${e.relatedCaseId ? `<p><span class="font-semibold">${getEvidLabel('relatedCase')}</span> <span class="font-mono">${e.relatedCaseId}</span></p>` : ''}
        ${e.relatedOerId ? `<p><span class="font-semibold">${getEvidLabel('relatedOer')}</span> <span class="font-mono">${e.relatedOerId}</span></p>` : ''}
        ${dates ? `<p>📅 ${dates}</p>` : ''}
        ${e.participants > 0 ? `<p>👥 ${e.participants} ${getEvidLabel('participants')}</p>` : ''}
      </div>

      ${objective ? `<div class="bg-blue-50 border-l-4 border-blue-400 rounded p-3 mb-2">
        <p class="text-xs font-semibold text-blue-900 mb-0.5">🎯 ${getEvidLabel('objective')}</p>
        <p class="text-sm text-gray-700">${objective}</p>
      </div>` : ''}
      ${methodology ? `<div class="bg-violet-50 border-l-4 border-violet-400 rounded p-3 mb-2">
        <p class="text-xs font-semibold text-violet-900 mb-0.5">🛠️ ${getEvidLabel('methodology')}</p>
        <p class="text-sm text-gray-700">${methodology}</p>
      </div>` : ''}
      ${outcome ? `<div class="bg-emerald-50 border-l-4 border-emerald-400 rounded p-3 mb-2">
        <p class="text-xs font-semibold text-emerald-900 mb-0.5">📊 ${getEvidLabel('outcome')}</p>
        <p class="text-sm text-gray-700">${outcome}</p>
      </div>` : ''}

      ${(evLink || docLink || addLink) ? `
        <div class="flex flex-wrap gap-2 mt-3 pt-3 border-t border-eu-border">
          ${evLink ? `<a href="${evLink.url}" ${evLink.externalLink !== false ? 'target="_blank" rel="noopener noreferrer"' : ''} class="inline-flex items-center gap-1 text-xs font-semibold text-eu-blue hover:underline"><i data-lucide="external-link" class="w-3.5 h-3.5"></i>${getEvidLabel('viewEvidence')}</a>` : ''}
          ${docLink ? `<a href="${docLink.url}" ${docLink.externalLink !== false ? 'target="_blank" rel="noopener noreferrer"' : ''} class="inline-flex items-center gap-1 text-xs font-semibold text-eu-teal hover:underline"><i data-lucide="file-text" class="w-3.5 h-3.5"></i>${getEvidLabel('documentation')}${docLink.license ? ` <span class="font-mono text-gray-500">(${docLink.license})</span>` : ''}</a>` : ''}
          ${addLink ? `<a href="${addLink.url}" ${addLink.externalLink !== false ? 'target="_blank" rel="noopener noreferrer"' : ''} class="inline-flex items-center gap-1 text-xs font-semibold text-gray-700 hover:underline"><i data-lucide="link" class="w-3.5 h-3.5"></i>${pickLang(addLink.label, '')}</a>` : ''}
        </div>` : ''}
    </div>
  `;
}

function updateEvidGrid() {
  const grid = document.getElementById('evid-grid');
  if (!grid) return;
  const search = getState('evidSearch') || '';
  grid.innerHTML = renderEvidGridContent(search);
  attachEvidGridListeners();
  if (window.lucide) window.lucide.createIcons();
}

function attachEvidGridListeners() {
  // Remove single filter chip
  document.querySelectorAll('.evid-filter-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      const kind = btn.dataset.kind;
      const value = btn.dataset.value;
      const f = getEvidFilters();
      if (Array.isArray(f[kind])) {
        f[kind] = f[kind].filter(v => v !== value);
      } else {
        f[kind] = null;
      }
      setEvidFilters(f);
      setState('evidPage', 0);
      updateEvidGrid();
    });
  });
  // Clear all
  document.getElementById('evid-filter-clear-all')?.addEventListener('click', () => {
    setEvidFilters({ pilotType: null, status: null, sectors: [], levels: [], helix: [], transitions: [] });
    setState('evidPage', 0);
    updateEvidGrid();
  });
  // Pagination
  document.getElementById('evid-prev')?.addEventListener('click', () => {
    const cur = getState('evidPage') || 0;
    if (cur > 0) { setState('evidPage', cur - 1); updateEvidGrid(); }
  });
  document.getElementById('evid-next')?.addEventListener('click', () => {
    setState('evidPage', (getState('evidPage') || 0) + 1);
    updateEvidGrid();
  });
  document.getElementById('evid-page-size')?.addEventListener('change', e => {
    const v = e.target.value;
    setState('evidPageSize', v === 'all' ? 'all' : parseInt(v, 10));
    setState('evidPage', 0);
    updateEvidGrid();
  });
}

// ─── Tab 5: Plantillas ───────────────────────────────────────────────────────

function tabPlantillas() {
  const items = t('knowledge.templatesItems') || [];
  const tmplHtml = items.map(tmpl => `
    <div class="bg-white rounded-xl border border-eu-border shadow-sm p-6 flex flex-col hover:border-eu-blue transition-colors group">
      <div class="text-4xl mb-4">${tmpl.icon || '📄'}</div>
      <h3 class="font-bold text-eu-text text-base mb-2 group-hover:text-eu-blue transition-colors">${tmpl.title || ''}</h3>
      <p class="text-sm text-gray-600 mb-4 flex-1">${tmpl.desc || ''}</p>
      <div class="flex flex-wrap gap-2 mb-4">
        <span class="text-xs bg-eu-bg border border-eu-border px-2 py-0.5 rounded text-gray-600 font-semibold">${tmpl.type || ''}</span>
        <span class="text-xs bg-eu-blue/10 text-eu-blue px-2 py-0.5 rounded font-semibold">${tmpl.route || ''}</span>
      </div>
      <div class="flex items-center justify-between">
        <span class="text-xs font-mono text-eu-teal">${tmpl.license || ''}</span>
        <button class="flex items-center gap-1.5 text-eu-blue text-xs font-bold hover:underline cursor-pointer bg-transparent border-none">
          <i data-lucide="download" class="w-3.5 h-3.5"></i>${t('knowledge.templatesDownload') || ''}
        </button>
      </div>
    </div>
  `).join('');

  return `
    <div>
      <h2 class="text-xl font-bold text-eu-text mb-2">${t('knowledge.templatesTitle') || ''}</h2>
      <p class="text-sm text-gray-600 mb-7 max-w-2xl">${t('knowledge.templatesDesc') || ''}</p>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">${tmplHtml}</div>
    </div>
  `;
}

// ─── render / mount ──────────────────────────────────────────────────────────

export function render() {
  const activeTab  = getState('knowledgeTab')    || 'flujo';
  const oerSearch  = getState('knowledgeSearch') || '';
  const oerData    = t('knowledge.oerResources') || [];
  const totalDl    = oerData.reduce((a, r) => a + (r.downloads || 0), 0).toLocaleString();

  const heroBlock = KNOWLEDGE_CONFIG?.heroBlock || {};
  const heroVisible = heroBlock.visible !== false;
  const heroStats = Array.isArray(heroBlock.stats) ? heroBlock.stats : [];
  const notice = pickLang(heroBlock.notice, '');

  const casosSearch = getState('casosSearch') || '';

  const contentMap = {
    flujo:      tabFlujo(),
    oer:        tabOER(oerSearch),
    casos:      tabCasos(casosSearch),
    evidencia:  tabEvidencia(),
    plantillas: tabPlantillas(),
  };

  return `
    <div>
      ${heroVisible ? `
      <!-- Header -->
      <div class="bg-eu-blue text-white px-6 py-12">
        <div class="max-w-7xl mx-auto">
          <h1 class="text-3xl font-extrabold mb-2">${pickLang(heroBlock.title, t('knowledge.title') || '')}</h1>
          <p class="text-white/70 text-sm max-w-3xl mb-1">${pickLang(heroBlock.description, t('knowledge.description') || '')}</p>
          ${notice ? `<p class="text-xs text-eu-yellow/80 italic mt-2">${notice}</p>` : ''}
          ${heroStats.length > 0 ? `
          <div class="flex flex-wrap gap-4 mt-6">
            ${heroStats.map(stat => `
            <div class="bg-white/10 rounded-xl px-5 py-3 text-center">
              <p class="text-2xl font-extrabold text-eu-yellow">${stat.value}</p>
              <p class="text-sm text-white/70 font-semibold uppercase mt-0.5">${pickLang(stat.label, '')}</p>
            </div>`).join('')}
          </div>` : ''}
        </div>
      </div>` : ''}

      <!-- Tabs + content -->
      <div class="max-w-7xl mx-auto px-6 py-8">
        <div class="flex flex-wrap gap-1 border-b border-eu-border mb-8">
          ${tabBar(activeTab)}
        </div>
        ${contentMap[activeTab] || ''}
      </div>
    </div>
  `;
}

export function mount() {
  document.querySelectorAll('[data-know-tab]').forEach(btn => {
    btn.addEventListener('click', () => {
      setState('knowledgeTab', btn.dataset.knowTab);
      setState('oerPage', 0);
      setState('casosPage', 0);
      rerender();
    });
  });

  // OER search — partial update only (no full re-render, preserves focus while typing)
  document.getElementById('oer-search')?.addEventListener('input', e => {
    const val = e.target.value;
    setState('knowledgeSearch', val);
    setState('oerPage', 0);
    const clearBtn = document.getElementById('oer-search-clear');
    if (clearBtn) clearBtn.classList.toggle('hidden', !val);
    updateOerGrid();
  });
  document.getElementById('oer-search-clear')?.addEventListener('click', () => {
    const input = document.getElementById('oer-search');
    if (input) input.value = '';
    document.getElementById('oer-search-clear')?.classList.add('hidden');
    setState('knowledgeSearch', '');
    setState('oerPage', 0);
    updateOerGrid();
    input?.focus();
  });

  // Casos search — partial update only
  document.getElementById('casos-search')?.addEventListener('input', e => {
    const val = e.target.value;
    setState('casosSearch', val);
    setState('casosPage', 0);
    const clearBtn = document.getElementById('casos-search-clear');
    if (clearBtn) clearBtn.classList.toggle('hidden', !val);
    updateCasosGrid();
  });
  document.getElementById('casos-search-clear')?.addEventListener('click', () => {
    const input = document.getElementById('casos-search');
    if (input) input.value = '';
    document.getElementById('casos-search-clear')?.classList.add('hidden');
    setState('casosSearch', '');
    setState('casosPage', 0);
    updateCasosGrid();
    input?.focus();
  });

  attachOerPaginationListeners();
  attachOerFilterListeners();
  attachCasosPaginationListeners();
  attachCasosFilterListeners();

  // Evidencias de pilotaje
  document.getElementById('evid-search')?.addEventListener('input', e => {
    const val = e.target.value;
    setState('evidSearch', val);
    setState('evidPage', 0);
    const clearBtn = document.getElementById('evid-search-clear');
    if (clearBtn) clearBtn.classList.toggle('hidden', !val);
    updateEvidGrid();
  });
  document.getElementById('evid-search-clear')?.addEventListener('click', () => {
    const input = document.getElementById('evid-search');
    if (input) input.value = '';
    document.getElementById('evid-search-clear')?.classList.add('hidden');
    setState('evidSearch', '');
    setState('evidPage', 0);
    updateEvidGrid();
    input?.focus();
  });
  attachEvidGridListeners();
}

function rerender() {
  const main = document.getElementById('main-root');
  main.innerHTML = render();
  mount();
  if (window.lucide) window.lucide.createIcons();
}
