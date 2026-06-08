import { t } from '../i18n.js';
import { getState, setState } from '../state.js';
import { getViewParams } from '../router.js';
import { TRAINING_CONFIG } from '../../data/training.js';

const COURSE_PARTNERS  = ['UVEG / CEICE', "Ud'A / UVEG", 'CEICE / Inspiring Futures Europe', 'AVA-ASAJA / CINK', 'INESC TEC / HSW', 'Region Värmland / NTNU', 'KEA / ESAD-GV / LPGA', 'LC / CEICE'];
const COURSE_MODALITY  = ['Semipresencial', 'Online', 'Online', 'Semipresencial', 'Online', 'Online', 'Online', 'Online'];

const TONE_MAP = {
  success: { cls: 'text-eu-purple bg-eu-purple/5 border border-eu-purple/15 hover:bg-eu-purple/10',   activeStyle: 'background:#4918AD;color:#fff;border-color:#4918AD' },
  warning: { cls: 'text-eu-purple bg-eu-yellow/60 border border-eu-yellow/80 hover:bg-eu-yellow', activeStyle: 'background:#FFF4E1;color:#4918AD;border-color:#FFF4E1' },
  danger:  { cls: 'text-eu-purple bg-eu-purple/5 border border-eu-purple/15 hover:bg-eu-purple/10',   activeStyle: 'background:#4918AD;color:#fff;border-color:#4918AD' },
  info:    { cls: 'text-eu-blue bg-eu-blue/5 border border-eu-blue/15 hover:bg-eu-blue/10',   activeStyle: 'background:#5620F6;color:#fff;border-color:#5620F6' },
  neutral: { cls: 'text-indigo-900/60 bg-indigo-900/5 border border-indigo-900/10 hover:bg-indigo-900/10',    activeStyle: 'background:#1E1B4B;color:#fff;border-color:#1E1B4B' },
};

// ── Helpers ──────────────────────────────────────────────────────────────────
function getLang() { return localStorage.getItem('language') || 'es'; }
function pickLang(value, fallback = '') {
  const lang = getLang();
  if (value && typeof value === 'object') return value[lang] || value.es || fallback;
  return fallback;
}
function esc(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
function getSkillIcon(id) {
  const iconMap = {
    // FP
    'ai-literacy': 'bot',
    'data-work': 'database',
    'process-automation': 'cpu',
    'responsible-ai': 'scale',
    'technical-communication': 'message-square',
    'problem-solving': 'lightbulb',
    'sustainability': 'leaf',
    'privacy-ethics': 'lock',
    'teamwork': 'users',

    // Master
    'ai-strategy': 'trending-up',
    'advanced-data': 'binary',
    'ai-governance': 'landmark',
    'innovation-management': 'rocket',
    'stakeholder-engagement': 'handshake',
    'systems-thinking': 'git-branch',
    'strategic-communication': 'megaphone',

    // Teacher
    'ped-ai-integration': 'graduation-cap',
    'digital-literacy': 'monitor',
    'critical-thinking': 'brain',
    'assessment-innovation': 'clipboard-check',
    'student-support': 'heart-handshake',
    'collaboration-networks': 'globe'
  };
  return iconMap[id] || 'check-circle';
}

function rerender() {
  const main = document.getElementById('main-root');
  main.innerHTML = render();
  mount();
  if (window.lucide) window.lucide.createIcons();
}

// ── Filter state (localStorage, per tab) ─────────────────────────────────────
function getActiveFilters(tab) {
  const key = `trainingFilters_${tab}`;
  const def = '{"sectors":[],"modalities":[],"tags":[],"statuses":[],"search":""}';
  const stored = JSON.parse(localStorage.getItem(key) || def);
  if (!('search' in stored)) stored.search = '';   // back-compat
  return stored;
}

function setActiveFilters(tab, filters) {
  localStorage.setItem(`trainingFilters_${tab}`, JSON.stringify(filters));
}

function applyRouteParams() {
  const params = getViewParams() || {};
  const sectorIds = Array.isArray(params.sectorIds) ? params.sectorIds : [];
  if (sectorIds.length === 0 || params._appliedTrainingFilters) return;
  const tab = getState('trainingTab') || 'fp';
  setActiveFilters(tab, { sectors: sectorIds, modalities: [], tags: [], statuses: [], search: '' });
  setState('trainingPage', 0);
  params._appliedTrainingFilters = true;
}

function filterCourses(courses, filters) {
  const q = (filters.search || '').toLowerCase().trim();
  return courses.filter(course => {
    if (q) {
      const hit = course.title.toLowerCase().includes(q) || course.description.toLowerCase().includes(q);
      if (!hit) return false;
    }
    const sectorMatch   = !filters.sectors.length   || course.sectorIds?.some(s => filters.sectors.includes(s));
    const modalityMatch = !filters.modalities.length || (course.modalityId && filters.modalities.includes(course.modalityId));
    const tagMatch      = !filters.tags.length       || course.skillIds?.some(tg => filters.tags.includes(tg));
    const statusMatch   = !(filters.statuses || []).length || (filters.statuses || []).includes(course.statusId);
    return sectorMatch && modalityMatch && tagMatch && statusMatch;
  });
}

// ── Course data ───────────────────────────────────────────────────────────────
function getCourses(trainingT) {
  const cmsConfig = TRAINING_CONFIG?.coursesBlock;
  if (cmsConfig?.courses?.length > 0) {
    const sectorsMap = {}, modalitiesMap = {}, statusesMap = {};
    (cmsConfig.sectors    || []).forEach(s => { sectorsMap[s.id]    = s.label; });
    (cmsConfig.modalities || []).forEach(m => { modalitiesMap[m.id] = m.label; });
    (cmsConfig.statuses   || []).forEach(s => { statusesMap[s.id]   = s; });

    return cmsConfig.courses.map((course, idx) => ({
      id:          course.id,
      title:       pickLang(course.title, ''),
      level:       course.level,
      sectorIds:   course.sectorIds || [],
      sectors:     (course.sectorIds || []).map(id => pickLang(sectorsMap[id], id)),
      hours:       course.hours    ?? null,
      enrolled:    course.enrolled ?? null,
      partner:     COURSE_PARTNERS[idx] || '',
      description: pickLang(course.description, ''),
      modalityId:  course.modalityId || '',
      modality:    pickLang(modalitiesMap[course.modalityId], course.modalityId),
      statusId:    course.statusId || '',
      statusObj:   statusesMap[course.statusId] || { id: course.statusId, label: { es: course.statusId, en: course.statusId, va: course.statusId }, tone: 'neutral' },
      skillIds:    course.skillIds || course.tagIds || [],
      tagIds:      course.skillIds || course.tagIds || [],
      link:        course.link || { url: '', external: true },
    }));
  }
  const coursesObj = trainingT?.courses || {};
  return Object.values(coursesObj).map((course, idx) => ({
    id: `c${idx + 1}`, title: course.title, level: course.level,
    sectorIds: [], sectors: [course.sector] || [],
    hours: null, enrolled: null,
    partner: COURSE_PARTNERS[idx], description: course.desc,
    modalityId: '', modality: COURSE_MODALITY[idx],
    statusId: course.status || '',
    statusObj: { id: course.status, label: { es: course.status, en: course.status, va: course.status }, tone: 'neutral' },
    skillIds: [], tagIds: [], link: { url: '', external: true },
  }));
}

// ── Course card ───────────────────────────────────────────────────────────────
function courseCard(course, trainingT, isMaster, courseTags, activeTab, activeFilters) {
  const levelLabels    = trainingT?.levelLabels    || {};
  const modalityLabels = trainingT?.modalityLabels || {};
  const statusLabel    = pickLang(course.statusObj?.label, course.statusId);
  const levelLabel     = levelLabels[course.level]       || course.level;
  const modalityLabel  = modalityLabels[course.modality] || course.modality;
  const tone           = course.statusObj?.tone || 'neutral';
  const isStatusActive = (activeFilters.statuses || []).includes(course.statusId);
  const linkUrl        = course.link?.url || '';
  const linkTarget     = course.link?.external !== false ? '_blank' : '_self';
  const viewLabel      = trainingT?.courseViewMore || 'Ver';

  const trCv          = TRAINING_CONFIG?.coursesBlock?.chipVisibility || {};
  const trShowLevel    = trCv.level    !== false;
  const trShowStatus   = trCv.status   !== false;
  const trShowSectors  = trCv.sectors  !== false;
  const trShowModality = trCv.modality !== false;
  const trShowTags     = trCv.tags     !== false;

  const chipsHtml = trShowTags ? (course.skillIds || course.tagIds || []).map(chipId => {
    const chip = courseTags.find(c => c.id === chipId);
    if (!chip) return '';
    const isActive = activeFilters.tags.includes(chipId);
    return `<button data-filter-tag="${chipId}" class="text-xs font-bold px-2.5 py-1 rounded-full transition-all duration-300 cursor-pointer ${isActive ? 'bg-eu-blue text-white border border-eu-blue shadow-sm' : 'bg-eu-blue/5 text-eu-blue border border-eu-blue/15 hover:bg-eu-blue/10'}">${pickLang(chip.shortLabel || chip.label, chipId)}</button>`;
  }).join('') : '';

  return `
    <div class="rd-card-mp rd-card-mp-hover flex flex-col overflow-hidden">
      <div class="rd-card-mp-ceja">
        <h3 class="rd-card-mp-title">${course.title}</h3>
      </div>
      <div class="p-7 pt-5 flex-1">
        <div class="flex items-center justify-between mb-4 gap-2 flex-wrap">
          <div class="flex items-center gap-2 flex-wrap">
            ${isMaster ? '<span class="text-xs bg-eu-purple text-white px-2.5 py-0.5 rounded-lg font-bold">Track A</span>' : ''}
          </div>
          ${trShowStatus ? `<button data-filter-status="${course.statusId}" class="text-xs font-bold px-2.5 py-1 rounded-full cursor-pointer transition-all duration-300 ${isStatusActive ? 'shadow-sm' : (TONE_MAP[tone]?.cls || TONE_MAP.neutral.cls)}" ${isStatusActive ? `style="${TONE_MAP[tone]?.activeStyle || TONE_MAP.neutral.activeStyle}"` : ''}>${statusLabel}</button>` : ''}
        </div>
        <p class="text-base text-eu-text/75 mb-4 leading-relaxed">${course.description}</p>
        <div class="flex flex-wrap gap-3 text-sm text-eu-text/70 mb-4">
          ${course.hours    != null ? `<span class="flex items-center gap-1.5"><i data-lucide="clock" class="w-4 h-4 text-eu-blue"></i>${course.hours}${trainingT?.courseHours || ''}</span>` : ''}
          ${course.enrolled != null ? `<span class="flex items-center gap-1.5"><i data-lucide="users" class="w-4 h-4 text-eu-blue"></i>${course.enrolled} ${trainingT?.courseEnrolledLabel || ''}</span>` : ''}
        </div>
        ${trShowSectors || trShowModality ? `<div class="flex flex-wrap gap-2">
          ${trShowSectors ? (course.sectorIds || []).map((sectorId, idx) => {
            const isActive = activeFilters.sectors.includes(sectorId);
            const label    = course.sectors[idx] || sectorId;
            return `<button data-filter-sector="${sectorId}" class="text-xs font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap transition-all duration-300 cursor-pointer ${isActive ? 'bg-eu-blue text-white border border-eu-blue shadow-sm' : 'bg-eu-blue/5 border border-eu-blue/15 text-eu-blue hover:bg-eu-blue/10'}" style="min-height: 24px;">${label}</button>`;
          }).join('') : ''}
          ${trShowModality && course.modalityId ? `<button data-filter-modality="${course.modalityId}" class="text-xs px-2.5 py-0.5 rounded-full font-bold whitespace-nowrap transition-all duration-300 cursor-pointer ${activeFilters.modalities.includes(course.modalityId) ? 'bg-eu-purple text-white border border-eu-purple shadow-sm' : 'bg-eu-purple/5 text-eu-purple border border-eu-purple/15 hover:bg-eu-purple/10'}" style="min-height: 24px;">${modalityLabel}</button>` : ''}
        </div>` : ''}
        ${chipsHtml ? `<div class="flex flex-wrap gap-2 mt-4">${chipsHtml}</div>` : ''}
      </div>
      ${linkUrl ? `
      <div class="border-t border-eu-blue/10 p-4 flex items-center justify-end">
        <a href="${linkUrl}" target="${linkTarget}" ${linkTarget === '_blank' ? 'rel="noopener noreferrer"' : ''}
           class="text-eu-blue font-bold text-sm cursor-pointer hover:text-eu-purple hover:underline inline-flex items-center gap-1.5 shrink-0 transition-colors duration-300">
          ${viewLabel} <i data-lucide="external-link" class="w-4 h-4"></i>
        </a>
      </div>` : ''}
    </div>`;
}

function renderSkillPanel(theme, icon, title, itemsHtml, gridClass) {
  return `
    <section class="rd-card rd-card-accent rd-pad relative overflow-hidden rd-card-grad-beige group">
      <div class="flex items-start gap-4 mb-6">
        <div class="rd-icon-circle transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" style="background:#ffffff">
          <i data-lucide="${icon}" class="w-6 h-6 text-eu-blue"></i>
        </div>
        <div class="min-w-0 flex items-center h-16">
          <h2 class="text-2xl font-extrabold text-eu-purple leading-tight">${title}</h2>
        </div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 ${gridClass} gap-4">${itemsHtml}</div>
    </section>`;
}

function renderSkillCloudPanel(theme, icon, title, cloudId) {
  return `
    <section class="rd-card rd-card-accent rd-pad relative overflow-hidden rd-card-grad-beige group">
      <div class="flex items-start gap-4 mb-6">
        <div class="rd-icon-circle transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" style="background:#ffffff">
          <i data-lucide="${icon}" class="w-6 h-6 text-eu-blue"></i>
        </div>
        <div class="min-w-0 flex items-center h-16">
          <h2 class="text-2xl font-extrabold text-eu-purple leading-tight">${title}</h2>
        </div>
      </div>
      <div id="${cloudId}" class="flex flex-wrap items-center justify-center gap-4 py-4 min-h-[280px]"></div>
    </section>`;
}

// ── Path steps ────────────────────────────────────────────────────────────────
function pathSteps(steps, color) {
  return (steps || []).map((step, i) => `
    <div class="flex items-center gap-3 rd-card-grad-violet border border-eu-blue/10 rounded-2xl px-4 py-3 shadow-sm hover:border-eu-blue/30 transition-all duration-300">
      <div class="w-6 h-6 rounded-full ${color} text-white text-xs font-bold flex items-center justify-center shrink-0 shadow-inner"><span>${i + 1}</span></div>
      <span class="text-base font-semibold text-eu-text leading-tight">${step}</span>
    </div>`).join('');
}

// ── Search controls (outside #tr-courses-grid, survives partial updates) ──────
function renderSearchControls(tab, trainingT) {
  const filters = getActiveFilters(tab);
  const hasActive = filters.sectors.length || filters.modalities.length || filters.tags.length
    || (filters.statuses || []).length || (filters.search || '').trim().length;
  const clearLabel  = trainingT?.clearFiltersButton || 'Limpiar filtros';
  const placeholder = trainingT?.searchPlaceholder  || 'Buscar cursos...';
  return `
    <div class="flex flex-wrap items-center gap-4 mb-6">
      <div class="relative">
        <i data-lucide="search" class="w-5 h-5 text-eu-blue absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"></i>
        <input id="tr-search" type="search" value="${(filters.search || '').replace(/"/g, '&quot;')}"
          placeholder="${placeholder}"
          class="w-full sm:w-80 border border-eu-blue/10 rounded-full pl-11 pr-5 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-eu-blue focus:border-eu-blue bg-white shadow-sm transition-all duration-300 placeholder:text-eu-text/40" />
      </div>
      ${hasActive ? `<button data-clear-filters class="inline-flex items-center gap-2 text-sm px-5 py-2.5 rounded-full font-bold transition-all duration-300 bg-white text-eu-purple border border-eu-blue/10 hover:bg-eu-blue/5 hover:border-eu-blue/30 cursor-pointer shadow-sm"><i data-lucide="x" class="w-4 h-4 text-eu-blue"></i>${clearLabel}</button>` : ''}
    </div>`;
}

// ── Course grid with pagination (replaces #tr-courses-grid on partial update) ─
function renderCourseGridContent(tab, allCourses, trainingT, courseTags, emptyMessage) {
  const levelMap  = { fp: 'FP', teacher: 'Docentes', master: 'Máster' };
  const isMaster  = tab === 'master';
  const filters   = getActiveFilters(tab);
  const filtered  = filterCourses(allCourses.filter(c => c.level === levelMap[tab]), filters);

  const coursesBlock = TRAINING_CONFIG?.coursesBlock || {};
  const pageSizeOpts = Array.isArray(coursesBlock.pageSizeOptions) ? coursesBlock.pageSizeOptions : [9, 18, 36];
  const showAllOpt   = coursesBlock.showAllOption !== false;
  const showAllLbl   = pickLang(coursesBlock.showAllLabel, 'Todos');

  const pageSize     = getState('trainingPageSize') || pageSizeOpts[0];
  const isAll        = pageSize === 'all';
  const rawPage      = getState('trainingPage') || 0;
  const totalPages   = isAll ? 1 : Math.ceil(filtered.length / pageSize);
  const safePage     = Math.min(rawPage, Math.max(0, totalPages - 1));
  const paginated    = isAll ? filtered : filtered.slice(safePage * pageSize, (safePage + 1) * pageSize);

  const pageSizeHtml = `
    <div class="flex gap-1.5">
      ${pageSizeOpts.map(n => `<button data-tr-pagesize="${n}" class="px-3 py-1.5 rounded-xl border cursor-pointer text-xs font-bold transition-all duration-300 ${pageSize === n ? 'bg-eu-blue text-white border-eu-blue shadow-sm' : 'bg-white text-eu-text border border-eu-blue/10 hover:border-eu-blue/30 hover:bg-eu-blue/5'}">${n}</button>`).join('')}
      ${showAllOpt ? `<button data-tr-pagesize="all" class="px-3 py-1.5 rounded-xl border cursor-pointer text-xs font-bold transition-all duration-300 ${pageSize === 'all' ? 'bg-eu-blue text-white border-eu-blue shadow-sm' : 'bg-white text-eu-text border border-eu-blue/10 hover:border-eu-blue/30 hover:bg-eu-blue/5'}">${showAllLbl}</button>` : ''}
    </div>`;

  const paginationHtml = !isAll && totalPages > 1 ? `
    <div class="flex gap-3 justify-center mt-8 mb-6 items-center">
      <button id="tr-pag-prev" class="px-4 py-2 rounded-xl border text-sm font-bold cursor-pointer transition-all duration-300 ${safePage === 0 ? 'opacity-40 pointer-events-none border-eu-blue/10 text-eu-text/40' : 'bg-white border-eu-blue/10 text-eu-text hover:border-eu-blue/30 hover:bg-eu-blue/5'}">← ${trainingT?.paginationPrev || 'Anterior'}</button>
      <span class="px-4 py-2 text-sm font-bold text-eu-text/70 bg-eu-blue/5 rounded-xl">${safePage + 1} / ${totalPages}</span>
      <button id="tr-pag-next" class="px-4 py-2 rounded-xl border text-sm font-bold cursor-pointer transition-all duration-300 ${safePage >= totalPages - 1 ? 'opacity-40 pointer-events-none border-eu-blue/10 text-eu-text/40' : 'bg-white border-eu-blue/10 text-eu-text hover:border-eu-blue/30 hover:bg-eu-blue/5'}">${trainingT?.paginationNext || 'Siguiente'} →</button>
    </div>` : '';

  const count = filtered.length;
  const countLabel = `${count} curso${count !== 1 ? 's' : ''}`;

  return `
    <div class="flex items-center justify-between mb-4">
      <span class="text-xs text-eu-text/60 font-semibold">${countLabel}</span>
      ${pageSizeHtml}
    </div>
    ${paginated.length > 0 ? `
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        ${paginated.map(c => courseCard(c, trainingT, isMaster, courseTags, tab, filters)).join('')}
      </div>
      ${paginationHtml}` : `
      <div class="rd-card rd-pad text-center rd-card-grad-beige">
        <i data-lucide="inbox" class="w-12 h-12 text-eu-blue/50 mx-auto mb-4"></i>
        <p class="text-eu-text/80 text-base font-semibold">${pickLang(emptyMessage, 'No hay cursos disponibles.')}</p>
      </div>`}`;
}

// ── Partial update — only replaces #tr-courses-grid ──────────────────────────
function updateCourseGrid() {
  const tab         = getState('trainingTab') || 'fp';
  const trainingT   = t('training') || {};
  const coursesBlock = TRAINING_CONFIG?.coursesBlock || {};
  const courses     = getCourses(trainingT);
  const courseTags  = coursesBlock.skills || coursesBlock.courseTags || [];
  const emptyMsg    = coursesBlock.emptyMessage || {};
  const container   = document.getElementById('tr-courses-grid');
  if (!container) return;
  container.innerHTML = renderCourseGridContent(tab, courses, trainingT, courseTags, emptyMsg);
  if (window.lucide) window.lucide.createIcons();
  attachPaginationListeners();
  attachFilterPillListeners(tab);
}

// ── Listener helpers ──────────────────────────────────────────────────────────
function attachPaginationListeners() {
  document.querySelectorAll('[data-tr-pagesize]').forEach(btn => {
    btn.addEventListener('click', () => {
      const sz = btn.dataset.trPagesize === 'all' ? 'all' : parseInt(btn.dataset.trPagesize, 10);
      setState('trainingPageSize', sz);
      setState('trainingPage', 0);
      updateCourseGrid();
    });
  });
  document.getElementById('tr-pag-prev')?.addEventListener('click', () => {
    const cur = getState('trainingPage') || 0;
    if (cur > 0) { setState('trainingPage', cur - 1); updateCourseGrid(); }
  });
  document.getElementById('tr-pag-next')?.addEventListener('click', () => {
    setState('trainingPage', (getState('trainingPage') || 0) + 1);
    updateCourseGrid();
  });
}

function attachFilterPillListeners(tab) {
  const toggle = (arr, val) => {
    const idx = arr.indexOf(val);
    if (idx > -1) arr.splice(idx, 1); else arr.push(val);
  };
  document.querySelectorAll('[data-filter-sector]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault(); e.stopPropagation();
      const f = getActiveFilters(tab); toggle(f.sectors, btn.dataset.filterSector);
      setActiveFilters(tab, f); setState('trainingPage', 0); rerender();
    });
  });
  document.querySelectorAll('[data-filter-modality]').forEach(btn => {
    btn.addEventListener('click', () => {
      const f = getActiveFilters(tab); toggle(f.modalities, btn.dataset.filterModality);
      setActiveFilters(tab, f); setState('trainingPage', 0); rerender();
    });
  });
  document.querySelectorAll('[data-filter-tag]').forEach(btn => {
    btn.addEventListener('click', () => {
      const f = getActiveFilters(tab); toggle(f.tags, btn.dataset.filterTag);
      setActiveFilters(tab, f); setState('trainingPage', 0); rerender();
    });
  });
  document.querySelectorAll('[data-filter-status]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault(); e.stopPropagation();
      const f = getActiveFilters(tab);
      if (!f.statuses) f.statuses = [];
      toggle(f.statuses, btn.dataset.filterStatus);
      setActiveFilters(tab, f); setState('trainingPage', 0); rerender();
    });
  });
  document.querySelector('[data-clear-filters]')?.addEventListener('click', () => {
    setActiveFilters(tab, { sectors: [], modalities: [], tags: [], statuses: [], search: '' });
    setState('trainingPage', 0); rerender();
  });
}

// ── Tab content ───────────────────────────────────────────────────────────────
function tabContent(activeTab, courses, trainingT, sections, courseTags, emptyMessage) {
  const sectionMap = { fp: 'fp-skills', teacher: 'continuous-learning', master: 'master-skills' };
  const cmsSection = sections.find(s => s.id === sectionMap[activeTab]);
  const searchControls = renderSearchControls(activeTab, trainingT);
  const courseGrid = `<div id="tr-courses-grid">${renderCourseGridContent(activeTab, courses, trainingT, courseTags, emptyMessage)}</div>`;

  if (activeTab === 'fp') {
    const skillsBlockVisible = cmsSection?.skillsBlock?.visible !== false;
    const displayMode = cmsSection?.skillsBlock?.displayMode || 'cards';
    const sectionTitle = cmsSection ? pickLang(cmsSection.title, trainingT?.tabFpVet || '') : (trainingT?.tabFpVet || '');
    let skillsBlockHtml = '';
    if (skillsBlockVisible) {
      if (displayMode === 'cloud') {
        skillsBlockHtml = `<div class="mb-8">${renderSkillCloudPanel('fp', 'briefcase', sectionTitle, 'tr-cloud-fp')}</div>`;
      } else {
        const skills = cmsSection?.skillsBlock?.skills || [];
        const skillsHtml = skills.length > 0
          ? skills.map(s => `<div class="group flex items-center gap-3 rounded-2xl border border-eu-blue/10 bg-[#FFFDF9] px-4 py-3 text-base font-semibold text-eu-text shadow-sm hover:bg-white hover:border-eu-blue/30 transition-all duration-300">
              <div class="rd-icon-circle-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" style="background:#ffffff">
                <i data-lucide="${getSkillIcon(s.id)}" class="w-5 h-5 text-eu-blue"></i>
              </div>
              <span class="min-w-0 leading-tight">${pickLang(s.title, '')}</span>
            </div>`).join('')
          : (trainingT?.fpSkills || []).map(s => `<div class="group flex items-center gap-3 rounded-2xl border border-eu-blue/10 bg-[#FFFDF9] px-4 py-3 text-base font-semibold text-eu-text shadow-sm hover:bg-white hover:border-eu-blue/30 transition-all duration-300">
              <div class="rd-icon-circle-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" style="background:#ffffff">
                <i data-lucide="check-circle" class="w-5 h-5 text-eu-blue"></i>
              </div>
              <span class="min-w-0 leading-tight">${s}</span>
            </div>`).join('');
        skillsBlockHtml = `<div class="mb-8">${renderSkillPanel('fp', 'briefcase', sectionTitle, skillsHtml, 'lg:grid-cols-3')}</div>`;
      }
    }
    return `
      ${skillsBlockHtml}
      ${searchControls}${courseGrid}
      ${(() => {
        const pb = cmsSection?.pathBlock;
        if (pb && pb.visible === false) return '';
        const pbTitle = pb ? pickLang(pb.title, trainingT?.fpPath || '') : (trainingT?.fpPath || '');
        const pbSteps = pb?.steps?.length > 0 ? pb.steps.map(s => pickLang(s.text, '')) : (trainingT?.fpPathSteps || []);
        return `<div class="rd-hero-gradient rounded-[2rem] p-10 md:p-12 mt-10 text-white">
          <h3 class="text-2xl font-extrabold mb-6" style="color:#FFF4E1">${pbTitle}</h3>
          <div class="flex flex-wrap items-center gap-3">${pathSteps(pbSteps, 'bg-eu-purple')}</div>
        </div>`;
      })()}`;
  }

  if (activeTab === 'teacher') {
    const skillsBlockVisible = cmsSection?.skillsBlock?.visible !== false;
    const displayMode = cmsSection?.skillsBlock?.displayMode || 'cards';
    const sectionTitle = cmsSection ? pickLang(cmsSection.title, trainingT?.tabTeacherTraining || '') : (trainingT?.tabTeacherTraining || '');
    let skillsBlockHtml = '';
    if (skillsBlockVisible) {
      if (displayMode === 'cloud') {
        skillsBlockHtml = `<div class="mb-8">${renderSkillCloudPanel('teacher', 'book-open', sectionTitle, 'tr-cloud-teacher')}</div>`;
      } else {
        const skills = cmsSection?.skillsBlock?.skills || [];
        const topicsHtml = skills.length > 0
          ? skills.map(s => `<div class="group flex items-center gap-3 rounded-2xl border border-eu-blue/10 bg-[#FFFDF9] px-4 py-3 text-base font-semibold text-eu-text shadow-sm hover:bg-white hover:border-eu-blue/30 transition-all duration-300">
              <div class="rd-icon-circle-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" style="background:#ffffff">
                <i data-lucide="${getSkillIcon(s.id)}" class="w-5 h-5 text-eu-blue"></i>
              </div>
              <span class="min-w-0 leading-tight">${pickLang(s.title, '')}</span>
            </div>`).join('')
          : (trainingT?.teacherTopics || []).map(s => `<div class="group flex items-center gap-3 rounded-2xl border border-eu-blue/10 bg-[#FFFDF9] px-4 py-3 text-base font-semibold text-eu-text shadow-sm hover:bg-white hover:border-eu-blue/30 transition-all duration-300">
              <div class="rd-icon-circle-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" style="background:#ffffff">
                <i data-lucide="check-circle" class="w-5 h-5 text-eu-blue"></i>
              </div>
              <span class="min-w-0 leading-tight">${s}</span>
            </div>`).join('');
        skillsBlockHtml = `<div class="mb-8">${renderSkillPanel('teacher', 'book-open', sectionTitle, topicsHtml, 'lg:grid-cols-2')}</div>`;
      }
    }
    return `
      ${skillsBlockHtml}
      ${searchControls}${courseGrid}`;
  }

  // master
  const masterSkillsBlockVisible = cmsSection?.skillsBlock?.visible !== false;
  const masterDisplayMode = cmsSection?.skillsBlock?.displayMode || 'cards';
  const masterSectionTitle = cmsSection ? pickLang(cmsSection.title, trainingT?.tabMasterBridge || '') : (trainingT?.tabMasterBridge || '');
  let masterSkillsBlockHtml = '';
  if (masterSkillsBlockVisible) {
    if (masterDisplayMode === 'cloud') {
      masterSkillsBlockHtml = `<div class="mb-8">${renderSkillCloudPanel('master', 'graduation-cap', masterSectionTitle, 'tr-cloud-master')}</div>`;
    } else {
      const masterSkills = cmsSection?.skillsBlock?.skills || [];
      const masterSkillsHtml = masterSkills.length > 0
        ? masterSkills.map(s => `<div class="group flex items-center gap-3 rounded-2xl border border-eu-blue/10 bg-[#FFFDF9] px-4 py-3 text-base font-semibold text-eu-text shadow-sm hover:bg-white hover:border-eu-blue/30 transition-all duration-300">
            <div class="rd-icon-circle-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" style="background:#ffffff">
              <i data-lucide="${getSkillIcon(s.id)}" class="w-5 h-5 text-eu-blue"></i>
            </div>
            <span class="min-w-0 leading-tight">${pickLang(s.title, '')}</span>
          </div>`).join('')
        : (trainingT?.masterBridgeItems || []).map((item, i) => `<div class="group flex items-center gap-3 rounded-2xl border border-eu-blue/10 bg-[#FFFDF9] px-4 py-3 text-base font-semibold text-eu-text shadow-sm hover:bg-white hover:border-eu-blue/30 transition-all duration-300">
            <div class="rd-icon-circle-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" style="background:#ffffff">
              <span class="text-xs font-extrabold text-eu-blue">${i + 1}</span>
            </div>
            <span class="min-w-0 leading-tight">${item}</span>
          </div>`).join('');
      masterSkillsBlockHtml = `<div class="mb-8">${renderSkillPanel('master', 'graduation-cap', masterSectionTitle, masterSkillsHtml, 'xl:grid-cols-4')}</div>`;
    }
  }
  const masterDisclaimer = cmsSection?.disclaimerBlock
    ? pickLang(cmsSection.disclaimerBlock.text, '')
    : (trainingT?.masterBridgeDisclaimer || '');
  const masterPathBlock = cmsSection?.pathBlock;
  const masterPathTitle = masterPathBlock ? pickLang(masterPathBlock.title, trainingT?.masterPath || '') : (trainingT?.masterPath || '');
  const masterPathSteps = masterPathBlock?.steps?.length > 0 ? masterPathBlock.steps.map(s => pickLang(s.text, '')) : (trainingT?.masterPathSteps || []);
  return `
    ${cmsSection?.disclaimerBlock?.visible === false || !masterDisclaimer ? '' : `
    <div class="rd-card group border-0 text-white rd-pad flex items-start gap-4 mb-8 shadow-sm" style="background: #5C2FB6 !important;">
      <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-[#5C2FB6] shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
        <i data-lucide="alert-triangle" class="w-6 h-6"></i>
      </div>
      <div class="flex-1">
        <p class="text-base text-white leading-relaxed font-semibold">${masterDisclaimer}</p>
      </div>
    </div>`}
    ${masterSkillsBlockHtml}
    ${searchControls}${courseGrid}
    ${masterPathBlock?.visible === false ? '' : `
    <div class="rd-hero-gradient rounded-[2rem] p-10 md:p-12 mt-10 text-white">
      <h3 class="text-2xl font-extrabold mb-6" style="color:#FFF4E1">${masterPathTitle}</h3>
      <div class="flex flex-wrap items-center gap-3">${pathSteps(masterPathSteps, 'bg-eu-purple')}</div>
    </div>`}`;
}

// ── render ────────────────────────────────────────────────────────────────────
export function render() {
  applyRouteParams();
  const trainingT    = t('training') || {};
  const activeTab    = getState('trainingTab') || 'fp';
  const coursesBlock = TRAINING_CONFIG?.coursesBlock || {};
  const courses      = coursesBlock.visible !== false ? getCourses(trainingT) : [];
  const sections     = TRAINING_CONFIG?.sectionsBlock || [];
  const courseTags   = coursesBlock.skills || coursesBlock.courseTags || [];

  const TABS = [
    { key: 'fp',      icon: 'briefcase',     label: trainingT?.tabFpVet },
    { key: 'teacher', icon: 'book-open',      label: trainingT?.tabTeacherTraining },
    { key: 'master',  icon: 'graduation-cap', label: trainingT?.tabMasterBridge },
  ];

  const tabsHtml = TABS.map(tab => `
    <button data-tab="${tab.key}" class="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold cursor-pointer transition-all duration-300 ${
      activeTab === tab.key ? 'bg-eu-blue text-white shadow-sm' : 'bg-eu-yellow/70 text-eu-purple border border-eu-yellow hover:bg-eu-yellow hover:border-eu-purple/30'
    }"><i data-lucide="${tab.icon}" class="w-4 h-4"></i>${esc(tab.label || '')}</button>`).join('');

  const heroBlock  = TRAINING_CONFIG?.heroBlock || {};
  const heroStats  = Array.isArray(heroBlock.stats) ? heroBlock.stats : [];
  const ctaButton  = heroBlock.ctaButton || {};

  return `
    <div class="rd-canvas">
      ${heroBlock.visible !== false ? `
      <div class="bg-eu-purple text-white px-6 py-24">
        <div class="max-w-7xl mx-auto">
          <div class="flex flex-wrap items-start justify-between gap-6">
            <div class="max-w-4xl">
              <div class="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-white/80 backdrop-blur">
                <i data-lucide="graduation-cap" class="h-4 w-4"></i>
                AI-SECRETT
              </div>
              <h1 class="mt-7 text-4xl font-extrabold tracking-tight md:text-6xl" style="color:#FFF4E1;line-height:1.02">${esc(pickLang(heroBlock.title, trainingT?.title || ''))}</h1>
              <p class="mt-7 text-lg leading-relaxed text-white/85 md:text-xl">${esc(pickLang(heroBlock.description, trainingT?.description || ''))}</p>
            </div>
            ${ctaButton.visible !== false ? `
            <div class="shrink-0 mt-2 md:mt-0">
              <a href="${ctaButton.url || 'https://aules.edu.gva.es/'}" target="_blank" rel="noopener noreferrer"
                 class="inline-flex min-h-11 items-center gap-2 rounded-full border-0 px-8 py-3.5 font-bold text-eu-purple transition hover:bg-white cursor-pointer shadow-sm animate-pulse" style="background:#FFF4E1">
                <i data-lucide="book-open" class="w-4 h-4"></i>${esc(pickLang(ctaButton.label, trainingT?.accessAules || ''))}<i data-lucide="external-link" class="w-3 h-3"></i>
              </a>
            </div>` : ''}
          </div>
          ${heroStats.length > 0 ? `
          <div class="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            ${heroStats.map(stat => `
            <div class="rd-hero-stat text-center">
              <p class="text-4xl font-extrabold" style="color:#FFF4E1">${esc(stat.value)}</p>
              <p class="mt-2 text-xs font-bold uppercase tracking-wider text-white/70">${esc(pickLang(stat.label, ''))}</p>
            </div>`).join('')}
          </div>` : ''}
        </div>
      </div>` : ''}
      <section class="px-6 py-20">
        <div class="max-w-7xl mx-auto">
          <div class="flex flex-wrap gap-3 mb-8 border-b border-eu-blue/10 pb-4">${tabsHtml}</div>
          ${tabContent(activeTab, courses, trainingT, sections, courseTags, coursesBlock.emptyMessage || {})}
        </div>
      </section>
    </div>`;
}

// ── mount ─────────────────────────────────────────────────────────────────────
export function mount() {
  const activeTab = getState('trainingTab') || 'fp';

  document.querySelectorAll('[data-tab]').forEach(btn => {
    btn.addEventListener('click', () => {
      setState('trainingTab', btn.dataset.tab);
      setState('trainingPage', 0);
      rerender();
    });
  });

  // Search — partial update only (no full re-render, preserves focus while typing)
  document.getElementById('tr-search')?.addEventListener('input', e => {
    const tab = getState('trainingTab') || 'fp';
    const f = getActiveFilters(tab);
    f.search = e.target.value;
    setActiveFilters(tab, f);
    setState('trainingPage', 0);
    updateCourseGrid();
  });

  attachFilterPillListeners(activeTab);
  attachPaginationListeners();

  // Skill cloud render for skills block when displayMode === 'cloud'
  const sectionMap = { fp: 'fp-skills', teacher: 'continuous-learning', master: 'master-skills' };
  const cloudContainer = document.getElementById(`tr-cloud-${activeTab}`);
  if (cloudContainer) {
    const cmsSection = (TRAINING_CONFIG?.sectionsBlock || []).find(s => s.id === sectionMap[activeTab]);
    const cloudCounts = cmsSection?.skillsBlock?.cloudCounts || [];
    const skillsCatalog = TRAINING_CONFIG?.coursesBlock?.skills || TRAINING_CONFIG?.coursesBlock?.courseTags || [];

    const items = cloudCounts.map(({ skillId, count }) => {
      const skill = skillsCatalog.find(s => s.id === skillId);
      const label = pickLang(skill?.shortLabel || skill?.title, skillId);
      return { label, count, length: label.length };
    }).filter(item => item.label);

    if (items.length > 0) {
      const maxCount = Math.max(...items.map(i => i.count));
      const minSize = 14;
      const maxSize = 32;
      const palette = ['#5620f6', '#1d4ed8', '#0d9488', '#ea580c', '#d97706', '#7c3aed'];

      // Preseleccionar ~30% de palabras más cortas para vertical
      const sortedByLength = [...items].sort((a, b) => a.length - b.length);
      const verticalCount = Math.max(2, Math.ceil(items.length * 0.3));
      const verticalWords = new Set(sortedByLength.slice(0, verticalCount).map(i => i.label));

      // Aleatorizar orden para distribución orgánica
      const shuffled = [...items].sort(() => Math.random() - 0.5);

      cloudContainer.innerHTML = shuffled.map((item, idx) => {
        const size = Math.round(minSize + (item.count / maxCount) * (maxSize - minSize));
        const color = palette[Math.abs(item.label.split('').reduce((h, c) => ((h << 5) - h) + c.charCodeAt(0), 0)) % palette.length];
        const isVertical = verticalWords.has(item.label);
        const style = isVertical
          ? `font-size:${size}px;color:${color};writing-mode:vertical-rl;text-orientation:mixed;line-height:1.2;`
          : `font-size:${size}px;color:${color};line-height:1.2;`;
        return `<span class="inline-block font-medium px-1 py-1 whitespace-nowrap" style="${style}">${item.label}</span>`;
      }).join('');
    }
  }
}
