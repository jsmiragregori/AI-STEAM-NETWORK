import { t } from '../i18n.js';
import { getState, setState } from '../state.js';
import { KNOWLEDGE_CONFIG } from '../../data/knowledge.js';

const TABS = ['flujo', 'oer', 'plantillas'];

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

function formatMonthYear(dateStr) {
  if (!dateStr) return '';
  const [year, month] = dateStr.split('-');
  const lang = getLang();
  const months = {
    es: ['', 'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    en: ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    va: ['', 'Gen', 'Feb', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Oct', 'Nov', 'Des'],
  };
  const m = parseInt(month, 10);
  return `${(months[lang] || months.es)[m] || month} ${year}`;
}

// ─── Tab bar ─────────────────────────────────────────────────────────────────

function tabBar(activeTab) {
  const labels = {
    flujo:      t('knowledge.tabFlow')      || 'Flujo',
    oer:        t('knowledge.tabOER')       || 'OER',
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
  const oerCv = oerBlock?.chipVisibility || {};
  const oerShowType             = oerCv.type             !== false;
  const oerShowLevels           = oerCv.levels           !== false;
  const oerShowSectors          = oerCv.sectors          !== false;
  const oerShowValidationStatus = oerCv.validationStatus !== false;
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
          ${oerShowType ? `<span class="text-2xl flex-shrink-0">${rIcon}</span><span class="text-xs font-bold uppercase text-gray-600 tracking-wider">${rType}</span>` : ''}
          ${oerShowLevels ? `<div class="flex gap-1 ml-auto">${rLevelsHtml}</div>` : ''}
        </div>

        <!-- Title: Larger and more prominent -->
        <h3 class="font-bold text-eu-text text-lg mb-5 leading-tight line-clamp-3">${rTitle}</h3>

        <!-- Sectors with visual separation -->
        ${oerShowSectors ? `<div class="flex flex-wrap gap-2 mb-5 pb-4 border-b border-gray-200">${rSectorsHtml}</div>` : '<div class="mb-5 pb-4 border-b border-gray-200"></div>'}

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
            ${r.date ? `📅 ${getOerLabel('created')}: ${r.date}` : ''}
            ${r.duration ? `${r.date ? ' | ' : ''}⏱️ ${r.duration}` : ''}
            ${r.format ? `${r.date || r.duration ? ' | ' : ''}📄 ${r.format}` : ''}
          </div>` : ''}
          ${r.updatedAt ? `<div class="text-eu-blue font-medium">✎ ${getOerLabel('updated')}: ${r.updatedAt}</div>` : ''}
        </div>
      </div>

      <!-- Footer: Status badge (compact, clickable) + Link button (primary) -->
      <div class="border-t border-gray-200 p-4 flex items-center justify-between gap-3 bg-white">
        ${oerShowValidationStatus ? `<button data-filter-status="${r.validationStatus || 'validated'}" class="text-xs font-semibold px-2.5 py-1 rounded whitespace-nowrap cursor-pointer transition-all ${(() => {
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
        </button>` : '<span></span>'}
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
// ─── Tab 3: Plantillas y Toolkits (CMS) ──────────────────────────────────────

function getTemplatesFilters() {
  const stored = localStorage.getItem('tmplFilters');
  if (!stored) return { typeId: null, routeIds: [] };
  try {
    const parsed = JSON.parse(stored);
    return {
      typeId: parsed.typeId || null,
      routeIds: Array.isArray(parsed.routeIds) ? parsed.routeIds : [],
    };
  } catch {
    return { typeId: null, routeIds: [] };
  }
}

function setTemplatesFilters(filters) {
  localStorage.setItem('tmplFilters', JSON.stringify(filters));
}

function tabPlantillas(search) {
  const block = KNOWLEDGE_CONFIG?.templatesBlock;

  if (!block) {
    return `<div class="bg-white rounded-xl border border-eu-border p-8 text-center">
      <i data-lucide="inbox" class="w-12 h-12 text-gray-400 mx-auto mb-4"></i>
      <p class="text-gray-500 text-base">Sin datos de plantillas.</p>
    </div>`;
  }

  if (!block.visible) {
    return `<div class="bg-white rounded-xl border border-eu-border p-8 text-center">
      <i data-lucide="inbox" class="w-12 h-12 text-gray-400 mx-auto mb-4"></i>
      <p class="text-gray-500 text-base">${pickLang(block.emptyMessage, '')}</p>
    </div>`;
  }

  const blockTitle = pickLang(block.title, '');
  const blockDesc  = pickLang(block.description, '');
  const searchPlh  = pickLang(block.searchPlaceholder, '');

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
            <input id="tmpl-search" type="text" value="${(search || '').replace(/"/g, '&quot;')}"
              class="border border-eu-border rounded-md pl-9 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-eu-blue focus:border-eu-blue w-64"
              placeholder="${searchPlh}" />
            <button id="tmpl-search-clear"
              style="position:absolute;right:0.5rem;top:50%;transform:translateY(-50%)"
              class="w-5 h-5 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer ${search ? '' : 'hidden'}"
              title="Borrar búsqueda"><i data-lucide="x" class="w-3.5 h-3.5"></i></button>
          </div>
        </div>
      </div>
      <div id="tmpl-grid">${renderTemplatesGridContent(search)}</div>
    </div>
  `;
}

function renderTemplatesGridContent(search) {
  const block = KNOWLEDGE_CONFIG?.templatesBlock;
  if (!block) return '';

  const cv = block.chipVisibility || {};
  const showType    = cv.type    !== false;
  const showRoute   = cv.route   !== false;
  const showLicense = cv.license !== false;

  const typeLabelMap  = Object.fromEntries((block.typeLabels  || []).map(x => [x.id, x]));
  const routeLabelMap = Object.fromEntries((block.routeLabels || []).map(x => [x.id, x]));

  const dlLabel  = pickLang(block.downloadLabel, '');
  const extLabel = pickLang(block.externalLabel, '');
  const emptyMsg = pickLang(block.emptyMessage, '');

  const data = block.templates || [];

  // Apply search
  let filtered = search
    ? data.filter(tpl => {
        const q = search.toLowerCase();
        const titleStr = pickLang(tpl.title, '').toLowerCase();
        const descStr  = pickLang(tpl.description, '').toLowerCase();
        const typeStr  = pickLang(typeLabelMap[tpl.typeId]?.label, '').toLowerCase();
        return titleStr.includes(q) || descStr.includes(q) || typeStr.includes(q);
      })
    : data;

  // Apply filter chips
  const activeFilters = getTemplatesFilters();
  if (activeFilters.typeId) {
    filtered = filtered.filter(tpl => tpl.typeId === activeFilters.typeId);
  }
  if (activeFilters.routeIds.length > 0) {
    filtered = filtered.filter(tpl => {
      const rIds = Array.isArray(tpl.routeIds) ? tpl.routeIds : [];
      return activeFilters.routeIds.some(rid => rIds.includes(rid));
    });
  }

  // Pagination
  const pageSizeOpts = Array.isArray(block.pageSizeOptions) ? block.pageSizeOptions : [9, 18, 36];
  const showAllOpt   = block.showAllOption !== false;
  const showAllLbl   = pickLang(block.showAllLabel, 'Todos');

  const pageSize   = getState('templatesPageSize') || block.pageSize || pageSizeOpts[0] || 9;
  const isAll      = pageSize === 'all';
  const rawPage    = getState('templatesPage') || 0;
  const totalPages = isAll ? 1 : Math.ceil(filtered.length / pageSize);
  const safePage   = Math.min(rawPage, Math.max(0, totalPages - 1));
  const paginated  = isAll ? filtered : filtered.slice(safePage * pageSize, (safePage + 1) * pageSize);

  const lang = getLang();
  const prevLbl = lang === 'en' ? 'Previous' : lang === 'va' ? 'Anterior' : 'Anterior';
  const nextLbl = lang === 'en' ? 'Next' : lang === 'va' ? 'Següent' : 'Siguiente';

  const activeFiltersHtml = (() => {
    const badges = [];
    if (activeFilters.typeId) {
      const meta = typeLabelMap[activeFilters.typeId];
      const lbl = meta ? pickLang(meta.label, activeFilters.typeId) : activeFilters.typeId;
      const icon = meta?.icon || '📋';
      badges.push(`
        <button data-tmpl-remove-filter="type" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-eu-blue/10 text-eu-blue border border-eu-blue/30 text-xs font-semibold hover:bg-eu-blue/20 transition-colors cursor-pointer">
          <span>${icon} ${lbl}</span>
          <i data-lucide="x" class="w-3.5 h-3.5"></i>
        </button>`);
    }
    activeFilters.routeIds.forEach(rid => {
      const meta = routeLabelMap[rid];
      const lbl = meta ? pickLang(meta.label, rid) : rid;
      badges.push(`
        <button data-tmpl-remove-filter="route" data-filter-value="${rid}" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-purple-100 text-purple-800 border border-purple-300 text-xs font-semibold hover:bg-purple-200 transition-colors cursor-pointer">
          <span>👥 ${lbl}</span>
          <i data-lucide="x" class="w-3.5 h-3.5"></i>
        </button>`);
    });

    if (badges.length === 0) return '';

    const activeFiltersLabel = lang === 'en' ? 'Active filters:' : lang === 'va' ? 'Filtres actius:' : 'Filtros activos:';
    const clearAllLabel = lang === 'en' ? 'Clear all' : lang === 'va' ? 'Netejar tots' : 'Limpiar todo';

    return `
      <div class="flex flex-wrap items-center gap-2 mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <span class="text-xs font-semibold text-gray-700">${activeFiltersLabel}</span>
        ${badges.join('')}
        <button id="tmpl-clear-all-filters" class="ml-auto px-2.5 py-1 rounded text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer border border-red-200">
          ${clearAllLabel}
        </button>
      </div>`;
  })();

  const pageSizeHtml = `
    <div class="flex gap-1">
      ${pageSizeOpts.map(n => `<button data-tmpl-pagesize="${n}" class="px-2 py-1 rounded border cursor-pointer text-xs font-semibold transition-colors ${pageSize === n ? 'bg-eu-blue text-white border-eu-blue' : 'bg-white text-gray-700 border-eu-border hover:border-eu-blue'}">${n}</button>`).join('')}
      ${showAllOpt ? `<button data-tmpl-pagesize="all" class="px-2 py-1 rounded border cursor-pointer text-xs font-semibold transition-colors ${pageSize === 'all' ? 'bg-eu-blue text-white border-eu-blue' : 'bg-white text-gray-700 border-eu-border hover:border-eu-blue'}">${showAllLbl}</button>` : ''}
    </div>`;

  const paginationHtml = !isAll && totalPages > 1 ? `
    <div class="flex gap-2 justify-center mt-6 items-center">
      <button id="tmpl-pag-prev" class="px-3 py-1.5 rounded border text-sm cursor-pointer transition-colors border-eu-border ${safePage === 0 ? 'opacity-40 pointer-events-none' : 'hover:border-eu-blue'}">
        ← ${prevLbl}
      </button>
      <span class="px-3 py-1 text-xs text-gray-500">${safePage + 1} / ${totalPages}</span>
      <button id="tmpl-pag-next" class="px-3 py-1.5 rounded border text-sm cursor-pointer transition-colors border-eu-border ${safePage >= totalPages - 1 ? 'opacity-40 pointer-events-none' : 'hover:border-eu-blue'}">
        ${nextLbl} →
      </button>
    </div>` : '';

  const cardsHtml = paginated.map(tpl => {
    const typeMeta = typeLabelMap[tpl.typeId];
    const iconStr  = tpl.icon || typeMeta?.icon || '📄';
    const typeStr  = typeMeta ? pickLang(typeMeta.label, '') : '';
    const routes   = (tpl.routeIds || []).map(rid => ({ id: rid, label: pickLang(routeLabelMap[rid]?.label, rid) }));

    const btnLabel  = tpl.linkType === 'external' ? extLabel : dlLabel;
    const btnIcon   = tpl.linkType === 'external' ? 'external-link' : 'download';
    const isExternal = tpl.linkType === 'external' || tpl.external !== false;
    const targetAttr = isExternal ? `target="_blank" rel="noopener noreferrer"` : '';

    const tplLang = getLang();
    const createdLbl = tplLang === 'en' ? 'Created' : tplLang === 'va' ? 'Creat' : 'Creado';
    const revisedLbl = tplLang === 'en' ? 'Revised' : tplLang === 'va' ? 'Revisat' : 'Revisado';
    const pubFmt = tpl.publishedAt ? formatMonthYear(tpl.publishedAt) : '';
    const revFmt = tpl.revisionDate ? formatMonthYear(tpl.revisionDate) : '';

    const filtersHere = getTemplatesFilters();

    return `<div class="bg-white rounded-xl border border-eu-border shadow-sm p-6 flex flex-col hover:border-eu-blue transition-colors group">
      <div class="text-4xl mb-4">${iconStr}</div>
      <h3 class="font-bold text-eu-text text-base mb-2 group-hover:text-eu-blue transition-colors">${pickLang(tpl.title, '')}</h3>
      <p class="text-sm text-gray-600 mb-4 flex-1">${pickLang(tpl.description, '')}</p>
      <div class="flex flex-wrap gap-2 mb-4">
        ${showType && typeStr ? `<button data-tmpl-filter-type="${tpl.typeId}" class="text-xs px-2 py-0.5 rounded font-semibold cursor-pointer transition-colors border ${filtersHere.typeId === tpl.typeId ? 'bg-eu-blue text-white border-eu-blue' : 'bg-eu-bg border-eu-border text-gray-600 hover:bg-eu-blue/10 hover:border-eu-blue hover:text-eu-blue'}">${typeStr}</button>` : ''}
        ${showRoute ? routes.map(r => `<button data-tmpl-filter-route="${r.id}" class="text-xs px-2 py-0.5 rounded font-semibold cursor-pointer transition-colors border ${filtersHere.routeIds.includes(r.id) ? 'bg-purple-600 text-white border-purple-600' : 'bg-eu-blue/10 text-eu-blue border-eu-blue/20 hover:bg-purple-100 hover:text-purple-800 hover:border-purple-300'}">${r.label}</button>`).join('') : ''}
      </div>
      <div class="text-xs text-gray-500 space-y-1 mb-3 pt-3 border-t border-gray-100">
        ${pubFmt ? `<div>📅 ${createdLbl}: ${pubFmt}</div>` : ''}
        ${revFmt ? `<div class="text-eu-blue font-medium">✎ ${revisedLbl}: ${revFmt}</div>` : ''}
      </div>
      <div class="flex items-center justify-between">
        ${showLicense ? `<span class="text-xs font-mono text-eu-teal">${tpl.license || ''}</span>` : '<span></span>'}
        <a href="${tpl.url}" ${targetAttr} class="flex items-center gap-1.5 text-eu-blue text-xs font-bold hover:underline cursor-pointer">
          <i data-lucide="${btnIcon}" class="w-3.5 h-3.5"></i>${btnLabel}
        </a>
      </div>
    </div>`;
  }).join('');

  const emptyHtml = paginated.length === 0
    ? `<div class="col-span-full bg-white rounded-xl border border-eu-border p-8 text-center">
        <i data-lucide="inbox" class="w-12 h-12 text-gray-400 mx-auto mb-4"></i>
        <p class="text-gray-500 text-base">${emptyMsg}</p>
      </div>`
    : '';

  return `
    ${activeFiltersHtml}
    <div class="flex items-center justify-end mb-4">
      ${pageSizeHtml}
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">${cardsHtml}${emptyHtml}</div>
    ${paginationHtml}
  `;
}

function updateTemplatesGrid() {
  const container = document.getElementById('tmpl-grid');
  if (!container) return;
  const search = getState('templatesSearch') || '';
  container.innerHTML = renderTemplatesGridContent(search);
  if (window.lucide) window.lucide.createIcons();
  attachTemplatesGridListeners();
}

function attachTemplatesGridListeners() {
  document.querySelectorAll('[data-tmpl-pagesize]').forEach(btn => {
    btn.addEventListener('click', () => {
      const v = btn.dataset.tmplPagesize;
      setState('templatesPageSize', v === 'all' ? 'all' : parseInt(v, 10));
      setState('templatesPage', 0);
      updateTemplatesGrid();
    });
  });
  document.getElementById('tmpl-pag-prev')?.addEventListener('click', () => {
    const cur = getState('templatesPage') || 0;
    if (cur > 0) { setState('templatesPage', cur - 1); updateTemplatesGrid(); }
  });
  document.getElementById('tmpl-pag-next')?.addEventListener('click', () => {
    setState('templatesPage', (getState('templatesPage') || 0) + 1);
    updateTemplatesGrid();
  });

  // Filter chip clicks on cards
  document.querySelectorAll('[data-tmpl-filter-type]').forEach(btn => {
    btn.addEventListener('click', () => {
      const v = btn.dataset.tmplFilterType;
      const filters = getTemplatesFilters();
      filters.typeId = filters.typeId === v ? null : v;
      setTemplatesFilters(filters);
      setState('templatesPage', 0);
      updateTemplatesGrid();
    });
  });
  document.querySelectorAll('[data-tmpl-filter-route]').forEach(btn => {
    btn.addEventListener('click', () => {
      const v = btn.dataset.tmplFilterRoute;
      const filters = getTemplatesFilters();
      if (filters.routeIds.includes(v)) {
        filters.routeIds = filters.routeIds.filter(x => x !== v);
      } else {
        filters.routeIds = [...filters.routeIds, v];
      }
      setTemplatesFilters(filters);
      setState('templatesPage', 0);
      updateTemplatesGrid();
    });
  });

  // Remove-filter badges
  document.querySelectorAll('[data-tmpl-remove-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      const kind = btn.dataset.tmplRemoveFilter;
      const filters = getTemplatesFilters();
      if (kind === 'type') filters.typeId = null;
      if (kind === 'route') {
        const v = btn.dataset.filterValue;
        filters.routeIds = filters.routeIds.filter(x => x !== v);
      }
      setTemplatesFilters(filters);
      setState('templatesPage', 0);
      updateTemplatesGrid();
    });
  });
  document.getElementById('tmpl-clear-all-filters')?.addEventListener('click', () => {
    setTemplatesFilters({ typeId: null, routeIds: [] });
    setState('templatesPage', 0);
    updateTemplatesGrid();
  });
}

// ─── render / mount ──────────────────────────────────────────────────────────

export function render() {
  const storedTab  = getState('knowledgeTab') || 'flujo';
  const activeTab  = TABS.includes(storedTab) ? storedTab : 'flujo';
  const oerSearch  = getState('knowledgeSearch') || '';
  const oerData    = t('knowledge.oerResources') || [];
  const totalDl    = oerData.reduce((a, r) => a + (r.downloads || 0), 0).toLocaleString();

  const heroBlock = KNOWLEDGE_CONFIG?.heroBlock || {};
  const heroVisible = heroBlock.visible !== false;
  const heroStats = Array.isArray(heroBlock.stats) ? heroBlock.stats : [];
  const notice = pickLang(heroBlock.notice, '');

  const templatesSearch = getState('templatesSearch') || '';

  const contentMap = {
    flujo:      tabFlujo(),
    oer:        tabOER(oerSearch),
    plantillas: tabPlantillas(templatesSearch),
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
      setState('templatesPage', 0);
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

  attachOerPaginationListeners();
  attachOerFilterListeners();

  // Templates / Plantillas y Toolkits
  document.getElementById('tmpl-search')?.addEventListener('input', e => {
    const val = e.target.value;
    setState('templatesSearch', val);
    setState('templatesPage', 0);
    const clearBtn = document.getElementById('tmpl-search-clear');
    if (clearBtn) clearBtn.classList.toggle('hidden', !val);
    updateTemplatesGrid();
  });
  document.getElementById('tmpl-search-clear')?.addEventListener('click', () => {
    const input = document.getElementById('tmpl-search');
    if (input) input.value = '';
    document.getElementById('tmpl-search-clear')?.classList.add('hidden');
    setState('templatesSearch', '');
    setState('templatesPage', 0);
    updateTemplatesGrid();
    input?.focus();
  });
  attachTemplatesGridListeners();
}

function rerender() {
  const main = document.getElementById('main-root');
  main.innerHTML = render();
  mount();
  if (window.lucide) window.lucide.createIcons();
}
