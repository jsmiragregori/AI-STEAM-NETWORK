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
        <div class="relative">
          <i data-lucide="search" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"></i>
          <input id="oer-search" type="text" value="${(search || '').replace(/"/g, '&quot;')}"
            class="border border-eu-border rounded-md pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-eu-blue focus:border-eu-blue w-64"
            placeholder="${searchPlh}" />
        </div>
      </div>
      <div id="oer-grid">${renderOerGridContent(search)}</div>
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

  const filtered = search
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
  const countLabel = `${count} recurso${count !== 1 ? 's' : ''}`;

  const pageSizeHtml = `
    <div class="flex gap-1">
      ${pageSizeOpts.map(n => `<button data-oer-pagesize="${n}" class="px-2 py-1 rounded border cursor-pointer text-xs font-semibold transition-colors ${pageSize === n ? 'bg-eu-blue text-white border-eu-blue' : 'bg-white text-gray-700 border-eu-border hover:border-eu-blue'}">${n}</button>`).join('')}
      ${showAllOpt ? `<button data-oer-pagesize="all" class="px-2 py-1 rounded border cursor-pointer text-xs font-semibold transition-colors ${pageSize === 'all' ? 'bg-eu-blue text-white border-eu-blue' : 'bg-white text-gray-700 border-eu-border hover:border-eu-blue'}">${showAllLbl}</button>` : ''}
    </div>`;

  const paginationHtml = !isAll && totalPages > 1 ? `
    <div class="flex gap-2 justify-center mt-6 items-center">
      <button id="oer-pag-prev" class="px-3 py-1.5 rounded border text-sm cursor-pointer transition-colors border-eu-border ${safePage === 0 ? 'opacity-40 pointer-events-none' : 'hover:border-eu-blue'}">
        ← ${getLang() === 'en' ? 'Previous' : getLang() === 'va' ? 'Anterior' : 'Anterior'}
      </button>
      <span class="px-3 py-1 text-xs text-gray-500">${safePage + 1} / ${totalPages}</span>
      <button id="oer-pag-next" class="px-3 py-1.5 rounded border text-sm cursor-pointer transition-colors border-eu-border ${safePage >= totalPages - 1 ? 'opacity-40 pointer-events-none' : 'hover:border-eu-blue'}">
        ${getLang() === 'en' ? 'Next' : getLang() === 'va' ? 'Següent' : 'Siguiente'} →
      </button>
    </div>` : '';

  const rowsHtml = paginated.map(r => {
    const rTitle  = hasCmsBlock ? pickLang(r.title, '') : (r.title || '');
    const rTypeId = hasCmsBlock ? r.typeId : r.type;
    const rType   = typeLabels[rTypeId] || rTypeId;
    const rIcon   = typeIcons[rTypeId] || '📄';
    const rSectorIds = hasCmsBlock
      ? (Array.isArray(r.sectorIds) ? r.sectorIds : (r.sectorId ? [r.sectorId] : []))
      : (r.sector ? [r.sector] : []);
    const rSectorsHtml = rSectorIds.map(sid => 
      `<span class="text-xs font-semibold px-1.5 py-0.5 rounded ${SECTOR_COLORS[sid] || 'bg-gray-100 text-gray-600'}">${getSectorName(sid)}</span>`
    ).join(' ');
    const rLevels = hasCmsBlock
      ? (Array.isArray(r.levels) ? r.levels : (r.level && r.level !== 'Todos' ? [r.level] : ['FP', 'Máster', 'Docentes']))
      : (r.level && r.level !== 'Todos' ? [r.level] : ['FP', 'Máster', 'Docentes']);
    const rLevelsHtml = rLevels.map(l => {
      const label = LEVEL_LABELS[l] ? pickLang(LEVEL_LABELS[l], l) : l;
      return `<span class="text-xs font-bold px-1.5 py-0.5 rounded ${LEVEL_COLORS[l] || 'bg-gray-100 text-gray-600'}">${label}</span>`;
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
    <div class="bg-white rounded-xl border border-eu-border shadow-sm flex flex-col overflow-hidden hover:border-eu-blue hover:shadow-md transition-all cursor-pointer">
      <div class="p-6 flex-1 flex flex-col">
        <!-- Header: Type + Levels -->
        <div class="flex items-start justify-between mb-4 gap-3">
          <div class="flex items-center gap-3">
            <span class="text-3xl flex-shrink-0">${rIcon}</span>
            <span class="text-sm font-bold uppercase px-2.5 py-1 rounded bg-eu-bg border border-eu-border text-gray-700 whitespace-nowrap">${rType}</span>
          </div>
          <div class="flex flex-wrap justify-end gap-1.5">${rLevelsHtml}</div>
        </div>

        <!-- Title: Large and bold -->
        <h3 class="font-bold text-eu-text text-base mb-4 leading-snug">${rTitle}</h3>

        <!-- Sectors -->
        <div class="flex flex-wrap gap-2 mb-4">${rSectorsHtml}</div>

        <!-- Technical Metadata: Author, License, Language -->
        <div class="space-y-2 mb-4 pb-4 border-b border-eu-border">
          <div class="text-sm text-gray-700 font-semibold">
            ${r.author ? `${r.author}` : '<span class="text-gray-400">Sin autor</span>'}
          </div>
          <div class="flex flex-wrap gap-3 text-sm text-gray-600">
            ${r.license ? `<span class="font-mono">${r.license}</span>` : ''}
            ${r.lang ? `<span>🌐 ${r.lang}</span>` : ''}
          </div>
        </div>

        <!-- Resource Details: Date, Duration, Format, Updated -->
        <div class="space-y-2 text-sm text-gray-600">
          ${r.date ? `<div><span class="text-gray-500">Creado:</span> ${r.date}</div>` : ''}
          ${r.duration ? `<div><span class="text-gray-500">Duración:</span> ⏱️ ${r.duration}</div>` : ''}
          ${r.format ? `<div><span class="text-gray-500">Formato:</span> ${r.format}</div>` : ''}
          ${r.updatedAt ? `<div><span class="text-eu-blue font-semibold">✎ Actualizado:</span> ${r.updatedAt}</div>` : ''}
        </div>
      </div>

      <!-- Footer: Validation status + Link button -->
      <div class="border-t border-eu-border p-4 flex items-center justify-between gap-3 bg-eu-bg">
        <div>
          ${(() => {
            const status = r.validationStatus || 'validated';
            const statusBadges = {
              validated: { icon: '✓', text: 'Validado', color: 'bg-green-100 text-green-800' },
              pending: { icon: '⏳', text: 'En proceso', color: 'bg-amber-100 text-amber-800' },
              draft: { icon: '📝', text: 'Borrador', color: 'bg-gray-100 text-gray-700' }
            };
            const badge = statusBadges[status] || statusBadges.validated;
            return `<span class="inline-block text-sm font-bold px-3 py-1.5 rounded ${badge.color}">${badge.icon} ${badge.text}</span>`;
          })()}
        </div>
        ${linkButtonHtml}
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

// ─── Tab 3: Casos de Transferencia ───────────────────────────────────────────

function tabCasos() {
  const cases = t('knowledge.successCases') || [];
  const casesHtml = cases.map(c => `
    <div class="bg-white rounded-xl border border-eu-border shadow-sm p-6 hover:border-eu-blue transition-colors">
      <div class="flex flex-wrap items-start justify-between gap-3 mb-3">
        <div>
          <h3 class="font-bold text-eu-text text-base mb-0.5">${c.title || ''}</h3>
          <p class="text-sm text-gray-500">${c.org || ''} · <span class="text-eu-teal font-semibold">${getSectorName(c.sector)}</span></p>
        </div>
        <div class="flex flex-wrap gap-2">
          <span class="text-xs font-bold px-2 py-0.5 rounded ${LEVEL_COLORS[c.level] || 'bg-gray-100 text-gray-600'}">${c.level || ''}</span>
          <span class="text-xs bg-green-100 text-green-800 font-bold px-2 py-0.5 rounded">${t('knowledge.casesSolved') || ''}</span>
          <span class="text-xs bg-eu-bg border border-eu-border px-2 py-0.5 rounded text-gray-600 font-semibold">${c.year || ''}</span>
        </div>
      </div>
      ${c.route ? `<p class="text-xs text-eu-orange font-semibold mb-2">${t('knowledge.casesRoute') || 'Ruta:'} ${c.route}</p>` : ''}
      <p class="text-sm text-gray-700 mb-3">${c.result || ''}</p>
      ${c.oer ? `<div class="flex items-center gap-2 text-xs mb-3"><i data-lucide="book-open" class="w-3.5 h-3.5 text-eu-teal"></i><span class="text-eu-teal font-semibold">${c.oer}</span></div>` : ''}
      ${c.evidence ? `<p class="text-xs text-gray-500 italic mb-3">${t('knowledge.casesEvidence') || 'Evidencia:'} ${c.evidence}</p>` : ''}
      <div class="mt-3 flex gap-3">
        <button class="flex items-center gap-1 text-eu-blue text-xs font-bold hover:underline cursor-pointer bg-transparent border-none">
          <i data-lucide="file-text" class="w-3 h-3"></i>${t('knowledge.casesViewFull') || ''}
        </button>
        <button class="flex items-center gap-1 text-eu-blue text-xs font-bold hover:underline cursor-pointer bg-transparent border-none">
          <i data-lucide="download" class="w-3 h-3"></i>${t('knowledge.casesDownloadResources') || ''}
        </button>
      </div>
    </div>
  `).join('');

  return `
    <div>
      <h2 class="text-xl font-bold text-eu-text mb-2">${t('knowledge.casesTitle') || ''}</h2>
      <p class="text-sm text-gray-600 mb-7 max-w-2xl">${t('knowledge.casesDesc') || ''}</p>
      <div class="space-y-5">${casesHtml}</div>
    </div>
  `;
}

// ─── Tab 4: Evidencias ───────────────────────────────────────────────────────

function tabEvidencia() {
  const items = t('knowledge.evidenceItems') || [];
  const evHtml = items.map(ev => `
    <div class="bg-white rounded-xl border border-eu-border shadow-sm p-6 hover:border-eu-blue transition-colors">
      <div class="flex flex-wrap items-start justify-between gap-3 mb-3">
        <div class="flex-1 min-w-0">
          <h3 class="font-bold text-eu-text text-base mb-1">${ev.title || ''}</h3>
          <div class="flex flex-wrap gap-2">
            <span class="text-xs font-bold px-1.5 py-0.5 rounded ${SECTOR_COLORS[ev.sector] || 'bg-gray-100 text-gray-600'}">
              ${t('knowledge.evidenceSector') || 'Sector:'} ${getSectorName(ev.sector)}
            </span>
            <span class="text-xs bg-eu-bg border border-eu-border px-1.5 py-0.5 rounded text-gray-600 font-semibold">
              ${t('knowledge.evidenceRoute') || 'Ruta:'} ${ev.route || ''}
            </span>
          </div>
        </div>
        <div class="flex items-center gap-2">
          ${statusIcon(ev.status || '')}
          <span class="text-xs font-bold px-2 py-0.5 rounded ${statusBadge(ev.status || '')}">${ev.status || ''}</span>
        </div>
      </div>
      ${ev.participants > 0 ? `<p class="text-xs text-gray-500 mb-2">👥 ${ev.participants} participantes</p>` : ''}
      <p class="text-sm text-gray-700 mb-2">${t('knowledge.evidenceOutcome') || 'Evidencia:'} <span class="font-medium">${ev.outcome || ''}</span></p>
      <p class="text-xs text-eu-blue font-semibold">${ev.partner || ''}</p>
    </div>
  `).join('');

  return `
    <div>
      <h2 class="text-xl font-bold text-eu-text mb-2">${t('knowledge.evidenceTitle') || ''}</h2>
      <p class="text-sm text-gray-600 mb-7 max-w-2xl">${t('knowledge.evidenceDesc') || ''}</p>
      <div class="bg-amber-50 border border-amber-200 rounded-xl px-5 py-3 mb-7 flex items-start gap-3">
        <span class="text-amber-500 text-lg mt-0.5">⚠️</span>
        <p class="text-xs text-amber-700">${t('knowledge.evidenceDemoLabel') || 'Indicadores demo'} — ${t('knowledge.evidenceDesc') || ''}</p>
      </div>
      <div class="space-y-5">${evHtml}</div>
    </div>
  `;
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

  const contentMap = {
    flujo:      tabFlujo(),
    oer:        tabOER(oerSearch),
    casos:      tabCasos(),
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
      rerender();
    });
  });

  // OER search — partial update only (no full re-render, preserves focus while typing)
  document.getElementById('oer-search')?.addEventListener('input', e => {
    setState('knowledgeSearch', e.target.value);
    setState('oerPage', 0);
    updateOerGrid();
  });

  attachOerPaginationListeners();
}

function rerender() {
  const main = document.getElementById('main-root');
  main.innerHTML = render();
  mount();
  if (window.lucide) window.lucide.createIcons();
}
