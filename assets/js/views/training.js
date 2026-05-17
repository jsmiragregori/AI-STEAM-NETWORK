import { t } from '../i18n.js';
import { getState, setState } from '../state.js';
import { TRAINING_CONFIG } from '../../data/training.js';

const COURSE_PARTNERS  = ['UVEG / CEICE', "Ud'A / UVEG", 'CEICE / Inspiring Futures Europe', 'AVA-ASAJA / CINK', 'INESC TEC / HSW', 'Region Värmland / NTNU', 'KEA / ESAD-GV / LPGA', 'LC / CEICE'];
const COURSE_MODALITY  = ['Semipresencial', 'Online', 'Online', 'Semipresencial', 'Online', 'Online', 'Online', 'Online'];

const TONE_MAP = {
  success: { cls: 'text-green-700 bg-green-50',   activeStyle: 'background:#15803d;color:#fff' },
  warning: { cls: 'text-yellow-700 bg-yellow-50', activeStyle: 'background:#b45309;color:#fff' },
  danger:  { cls: 'text-red-700 bg-red-50',       activeStyle: 'background:#b91c1c;color:#fff' },
  info:    { cls: 'text-eu-blue bg-eu-blue/10',   activeStyle: 'background:#1d4ed8;color:#fff' },
  neutral: { cls: 'text-gray-600 bg-gray-100',    activeStyle: 'background:#4b5563;color:#fff' },
};

// ── Helpers ──────────────────────────────────────────────────────────────────
function getLang() { return localStorage.getItem('language') || 'es'; }
function pickLang(value, fallback = '') {
  const lang = getLang();
  if (value && typeof value === 'object') return value[lang] || value.es || fallback;
  return fallback;
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
      rating:      course.rating   ?? null,
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
    hours: null, enrolled: null, rating: null,
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

  const chipsHtml = (course.skillIds || course.tagIds || []).map(chipId => {
    const chip = courseTags.find(c => c.id === chipId);
    if (!chip) return '';
    const isActive = activeFilters.tags.includes(chipId);
    return `<button data-filter-tag="${chipId}" class="text-xs font-medium px-2 py-1 rounded-full transition-colors cursor-pointer ${isActive ? 'bg-eu-blue text-white border border-eu-blue' : 'bg-eu-blue/10 text-eu-blue border border-eu-blue/20 hover:bg-eu-blue/20'}">${pickLang(chip.shortLabel || chip.label, chipId)}</button>`;
  }).join('');

  return `
    <div class="bg-white rounded-xl border border-eu-border shadow-sm flex flex-col overflow-hidden hover:border-eu-blue transition-colors">
      <div class="p-5 flex-1">
        <div class="flex items-center justify-between mb-3 gap-2">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="text-sm font-extrabold uppercase px-2 py-0.5 rounded bg-eu-yellow text-eu-purple">${levelLabel}</span>
            ${isMaster ? '<span class="text-xs bg-purple-600 text-white px-2 py-0.5 rounded font-bold">Track A</span>' : ''}
          </div>
          <button data-filter-status="${course.statusId}" class="text-sm font-bold px-2 py-0.5 rounded cursor-pointer transition-colors ${isStatusActive ? '' : (TONE_MAP[tone]?.cls || TONE_MAP.neutral.cls)}" ${isStatusActive ? `style="${TONE_MAP[tone]?.activeStyle || TONE_MAP.neutral.activeStyle}"` : ''}>${statusLabel}</button>
        </div>
        <h3 class="font-bold text-eu-text text-sm mb-2 leading-snug">${course.title}</h3>
        <p class="text-xs text-gray-500 mb-3">${course.description}</p>
        <div class="flex flex-wrap gap-2 text-sm text-gray-600 mb-3">
          ${course.hours    != null ? `<span class="flex items-center gap-1"><i data-lucide="clock" class="w-3 h-3"></i>${course.hours}${trainingT?.courseHours || ''}</span>` : ''}
          ${course.enrolled != null ? `<span class="flex items-center gap-1"><i data-lucide="users" class="w-3 h-3"></i>${course.enrolled} ${trainingT?.courseEnrolledLabel || ''}</span>` : ''}
          ${course.rating   != null ? `<span class="flex items-center gap-1"><i data-lucide="star" class="w-3 h-3 text-yellow-500"></i>${course.rating}</span>` : ''}
        </div>
        <div class="flex flex-wrap gap-2">
          ${(course.sectorIds || []).map((sectorId, idx) => {
            const isActive = activeFilters.sectors.includes(sectorId);
            const label    = course.sectors[idx] || sectorId;
            return `<button data-filter-sector="${sectorId}" class="text-sm font-semibold px-2 py-0.5 rounded whitespace-nowrap transition-colors cursor-pointer ${isActive ? 'bg-eu-blue text-white border border-eu-blue' : 'bg-eu-bg border border-eu-border text-gray-600 hover:border-eu-blue'}">${label}</button>`;
          }).join('')}
          ${course.modalityId ? `<button data-filter-modality="${course.modalityId}" class="text-xs px-2 py-0.5 rounded font-bold whitespace-nowrap transition-colors cursor-pointer ${activeFilters.modalities.includes(course.modalityId) ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-700 border border-purple-300 hover:bg-purple-200'}">${modalityLabel}</button>` : ''}
        </div>
        ${chipsHtml ? `<div class="flex flex-wrap gap-2 mt-3">${chipsHtml}</div>` : ''}
      </div>
      ${linkUrl ? `
      <div class="border-t border-eu-border p-3 flex items-center justify-end bg-eu-bg">
        <a href="${linkUrl}" target="${linkTarget}" ${linkTarget === '_blank' ? 'rel="noopener noreferrer"' : ''}
           class="text-eu-blue font-bold text-xs cursor-pointer hover:underline inline-flex items-center gap-1 shrink-0">
          ${viewLabel} <i data-lucide="external-link" class="w-3 h-3"></i>
        </a>
      </div>` : ''}
    </div>`;
}

function renderSkillPanel(theme, icon, title, itemsHtml, gridClass) {
  const themes = {
    fp: {
      ring: 'border-eu-border',
      fill: 'bg-white',
      shadow: 'shadow-sm',
      accent: 'bg-eu-yellow/70',
      icon: 'text-eu-orange',
    },
    teacher: {
      ring: 'border-eu-border',
      fill: 'bg-white',
      shadow: 'shadow-sm',
      accent: 'bg-eu-blue/70',
      icon: 'text-eu-blue',
    },
    master: {
      ring: 'border-eu-border',
      fill: 'bg-white',
      shadow: 'shadow-sm',
      accent: 'bg-eu-purple/70',
      icon: 'text-eu-purple',
    },
  }[theme] || {
    ring: 'border-eu-border',
    fill: 'bg-white',
    shadow: 'shadow-sm',
    accent: 'bg-eu-yellow/70',
    icon: 'text-eu-orange',
  };

  return `
    <section class="relative overflow-hidden rounded-2xl border ${themes.ring} ${themes.fill} ${themes.shadow}">
      <div class="absolute inset-x-0 top-0 h-1 ${themes.accent}"></div>
      <div class="p-5 sm:p-6">
        <div class="flex items-start gap-3 mb-5">
          <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${themes.ring} bg-white">
            <i data-lucide="${icon}" class="w-5 h-5 ${themes.icon}"></i>
          </div>
          <div class="min-w-0">
            <h2 class="text-lg font-bold text-eu-text leading-tight">${title}</h2>
          </div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 ${gridClass} gap-3">${itemsHtml}</div>
      </div>
    </section>`;
}

function renderSkillCloudPanel(theme, icon, title, canvasId) {
  const themes = {
    fp: { ring: 'border-eu-border', fill: 'bg-white', shadow: 'shadow-sm', accent: 'bg-eu-yellow/70', icon: 'text-eu-orange' },
    teacher: { ring: 'border-eu-border', fill: 'bg-white', shadow: 'shadow-sm', accent: 'bg-eu-blue/70', icon: 'text-eu-blue' },
    master: { ring: 'border-eu-border', fill: 'bg-white', shadow: 'shadow-sm', accent: 'bg-eu-purple/70', icon: 'text-eu-purple' },
  }[theme] || { ring: 'border-eu-border', fill: 'bg-white', shadow: 'shadow-sm', accent: 'bg-eu-yellow/70', icon: 'text-eu-orange' };

  return `
    <section class="relative overflow-hidden rounded-2xl border ${themes.ring} ${themes.fill} ${themes.shadow}">
      <div class="absolute inset-x-0 top-0 h-1 ${themes.accent}"></div>
      <div class="p-5 sm:p-6">
        <div class="flex items-start gap-3 mb-5">
          <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${themes.ring} bg-white">
            <i data-lucide="${icon}" class="w-5 h-5 ${themes.icon}"></i>
          </div>
          <div class="min-w-0">
            <h2 class="text-lg font-bold text-eu-text leading-tight">${title}</h2>
          </div>
        </div>
        <div class="flex justify-center">
          <canvas id="${canvasId}" class="w-full" style="height: 280px;"></canvas>
        </div>
      </div>
    </section>`;
}

// ── Path steps ────────────────────────────────────────────────────────────────
function pathSteps(steps, color) {
  return (steps || []).map((step, i, arr) => `
    <div class="flex items-center gap-2">
      <div class="flex items-center gap-2 bg-eu-bg border border-eu-border rounded-lg px-3 py-2">
        <span class="w-5 h-5 rounded-full ${color} text-white text-xs font-bold flex items-center justify-center shrink-0">${i + 1}</span>
        <span class="text-sm text-eu-text">${step}</span>
      </div>
      ${i < arr.length - 1 ? '<i data-lucide="arrow-right" class="w-4 h-4 text-gray-400 shrink-0"></i>' : ''}
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
    <div class="flex flex-wrap items-center gap-3 mb-4">
      <div class="relative">
        <i data-lucide="search" class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"></i>
        <input id="tr-search" type="search" value="${(filters.search || '').replace(/"/g, '&quot;')}"
          placeholder="${placeholder}"
          class="w-full sm:w-64 border border-eu-border rounded-full pl-9 pr-4 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-eu-blue focus:border-eu-blue bg-white" />
      </div>
      ${hasActive ? `<button data-clear-filters class="inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-full font-medium transition-colors bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200 hover:border-gray-400"><i data-lucide="x" class="w-4 h-4"></i>${clearLabel}</button>` : ''}
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
    <div class="flex gap-1">
      ${pageSizeOpts.map(n => `<button data-tr-pagesize="${n}" class="px-2 py-1 rounded border cursor-pointer text-xs font-semibold transition-colors ${pageSize === n ? 'bg-eu-blue text-white border-eu-blue' : 'bg-white text-gray-700 border-eu-border hover:border-eu-blue'}">${n}</button>`).join('')}
      ${showAllOpt ? `<button data-tr-pagesize="all" class="px-2 py-1 rounded border cursor-pointer text-xs font-semibold transition-colors ${pageSize === 'all' ? 'bg-eu-blue text-white border-eu-blue' : 'bg-white text-gray-700 border-eu-border hover:border-eu-blue'}">${showAllLbl}</button>` : ''}
    </div>`;

  const paginationHtml = !isAll && totalPages > 1 ? `
    <div class="flex gap-2 justify-center mt-6 mb-6 items-center">
      <button id="tr-pag-prev" class="px-3 py-1.5 rounded border text-sm cursor-pointer transition-colors border-eu-border ${safePage === 0 ? 'opacity-40 pointer-events-none' : 'hover:border-eu-blue'}">← ${trainingT?.paginationPrev || 'Anterior'}</button>
      <span class="px-3 py-1 text-xs text-gray-500">${safePage + 1} / ${totalPages}</span>
      <button id="tr-pag-next" class="px-3 py-1.5 rounded border text-sm cursor-pointer transition-colors border-eu-border ${safePage >= totalPages - 1 ? 'opacity-40 pointer-events-none' : 'hover:border-eu-blue'}">${trainingT?.paginationNext || 'Siguiente'} →</button>
    </div>` : '';

  const count = filtered.length;
  const countLabel = `${count} curso${count !== 1 ? 's' : ''}`;

  return `
    <div class="flex items-center justify-between mb-4">
      <span class="text-xs text-gray-500 font-medium">${countLabel}</span>
      ${pageSizeHtml}
    </div>
    ${paginated.length > 0 ? `
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        ${paginated.map(c => courseCard(c, trainingT, isMaster, courseTags, tab, filters)).join('')}
      </div>
      ${paginationHtml}` : `
      <div class="bg-white rounded-xl border border-eu-border shadow-sm p-8 text-center">
        <i data-lucide="inbox" class="w-12 h-12 text-gray-400 mx-auto mb-4"></i>
        <p class="text-gray-600 text-base">${pickLang(emptyMessage, 'No hay cursos disponibles.')}</p>
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
          ? skills.map(s => `<div class="flex items-start gap-3 rounded-xl border border-eu-border bg-white px-4 py-3 text-sm font-medium text-eu-text shadow-sm">
              <div class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-eu-border bg-eu-bg text-eu-orange">
                <span class="text-base leading-none">${s.icon}</span>
              </div>
              <span class="min-w-0 leading-5">${pickLang(s.title, '')}</span>
            </div>`).join('')
          : (trainingT?.fpSkills || []).map(s => `<div class="flex items-start gap-3 rounded-xl border border-eu-border bg-white px-4 py-3 text-sm font-medium text-eu-text shadow-sm">
              <div class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-eu-border bg-eu-bg text-eu-orange">
                <i data-lucide="check-circle" class="w-4 h-4 shrink-0"></i>
              </div>
              <span class="min-w-0 leading-5">${s}</span>
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
        return `<div class="bg-white rounded-xl border border-eu-border shadow-sm p-6 mt-10">
          <h3 class="font-bold text-eu-text mb-4">${pbTitle}</h3>
          <div class="flex flex-wrap items-center gap-2">${pathSteps(pbSteps, 'bg-eu-orange')}</div>
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
          ? skills.map(s => `<div class="flex items-start gap-3 rounded-xl border border-eu-border bg-white px-4 py-3 text-sm font-medium text-eu-text shadow-sm">
              <div class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-eu-border bg-eu-bg text-eu-blue">
                <span class="text-base leading-none">${s.icon}</span>
              </div>
              <span class="min-w-0 leading-5">${pickLang(s.title, '')}</span>
            </div>`).join('')
          : (trainingT?.teacherTopics || []).map(s => `<div class="flex items-start gap-3 rounded-xl border border-eu-border bg-white px-4 py-3 text-sm font-medium text-eu-text shadow-sm">
              <div class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-eu-border bg-eu-bg text-eu-blue">
                <i data-lucide="check-circle" class="w-4 h-4 shrink-0"></i>
              </div>
              <span class="min-w-0 leading-5">${s}</span>
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
        ? masterSkills.map(s => `<div class="flex items-start gap-3 rounded-xl border border-eu-border bg-white px-4 py-3 text-sm font-medium text-eu-text shadow-sm">
            <div class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-eu-border bg-eu-bg text-eu-purple">
              <span class="text-base leading-none">${s.icon}</span>
            </div>
            <span class="min-w-0 leading-5">${pickLang(s.title, '')}</span>
          </div>`).join('')
        : (trainingT?.masterBridgeItems || []).map((item, i) => `<div class="flex items-start gap-3 rounded-xl border border-eu-border bg-white px-4 py-3 text-sm font-medium text-eu-text shadow-sm">
            <div class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-eu-border bg-eu-bg text-eu-purple">
              <span class="w-5 h-5 rounded-full bg-eu-purple text-white text-xs font-bold flex items-center justify-center">${i + 1}</span>
            </div>
            <span class="min-w-0 leading-5">${item}</span>
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
    <div class="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8 flex items-start gap-3">
      <i data-lucide="alert-triangle" class="w-5 h-5 text-amber-600 shrink-0 mt-0.5"></i>
      <p class="text-sm text-amber-800">${masterDisclaimer}</p>
    </div>`}
    ${masterSkillsBlockHtml}
    ${searchControls}${courseGrid}
    ${masterPathBlock?.visible === false ? '' : `
    <div class="bg-white rounded-xl border border-eu-border shadow-sm p-6 mt-8">
      <h3 class="font-bold text-eu-text mb-4">${masterPathTitle}</h3>
      <div class="flex flex-wrap items-center gap-2">${pathSteps(masterPathSteps, 'bg-purple-600')}</div>
    </div>`}`;
}

// ── render ────────────────────────────────────────────────────────────────────
export function render() {
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
    <button data-tab="${tab.key}" class="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold cursor-pointer transition-colors ${
      activeTab === tab.key ? 'bg-eu-blue text-white shadow-sm' : 'bg-white text-eu-text border border-eu-border hover:border-eu-blue'
    }"><i data-lucide="${tab.icon}" class="w-4 h-4"></i>${tab.label || ''}</button>`).join('');

  const heroBlock  = TRAINING_CONFIG?.heroBlock || {};
  const heroStats  = Array.isArray(heroBlock.stats) ? heroBlock.stats : [];
  const ctaButton  = heroBlock.ctaButton || {};

  return `
    <div>
      ${heroBlock.visible !== false ? `
      <div class="bg-eu-blue text-white px-6 py-12">
        <div class="max-w-7xl mx-auto">
          <div class="flex flex-wrap items-start justify-between gap-6">
            <div>
              <h1 class="text-3xl font-extrabold mb-3">${pickLang(heroBlock.title, trainingT?.title || '')}</h1>
              <p class="text-white/80 max-w-2xl text-base">${pickLang(heroBlock.description, trainingT?.description || '')}</p>
            </div>
            ${ctaButton.visible !== false ? `
            <a href="${ctaButton.url || 'https://aules.edu.gva.es/'}" target="_blank" rel="noopener noreferrer"
               class="flex min-h-11 items-center gap-2 rounded-lg bg-eu-orange px-5 py-2.5 text-sm font-bold text-white hover:bg-eu-purple transition-colors">
              <i data-lucide="book-open" class="w-4 h-4"></i>${pickLang(ctaButton.label, trainingT?.accessAules || '')}<i data-lucide="external-link" class="w-3 h-3"></i>
            </a>` : ''}
          </div>
          ${heroStats.length > 0 ? `
          <div class="flex flex-wrap gap-6 mt-8">
            ${heroStats.map(stat => `
            <div class="bg-white/10 rounded-xl px-6 py-4">
              <p class="text-2xl font-extrabold text-eu-yellow">${stat.value}</p>
              <p class="text-xs text-white/70 font-semibold uppercase mt-1">${pickLang(stat.label, '')}</p>
            </div>`).join('')}
          </div>` : ''}
        </div>
      </div>` : ''}
      <div class="max-w-7xl mx-auto px-6 py-10">
        <div class="flex flex-wrap gap-2 mb-8 border-b border-eu-border pb-4">${tabsHtml}</div>
        ${tabContent(activeTab, courses, trainingT, sections, courseTags, coursesBlock.emptyMessage || {})}
      </div>
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

  // WordCloud init for skills block when displayMode === 'cloud'
  const sectionMap = { fp: 'fp-skills', teacher: 'continuous-learning', master: 'master-skills' };
  const cloudCanvas = document.getElementById(`tr-cloud-${activeTab}`);
  if (cloudCanvas && typeof window.WordCloud === 'function') {
    const cmsSection = (TRAINING_CONFIG?.sectionsBlock || []).find(s => s.id === sectionMap[activeTab]);
    const cloudCounts = cmsSection?.skillsBlock?.cloudCounts || [];
    const skillsCatalog = TRAINING_CONFIG?.coursesBlock?.skills || TRAINING_CONFIG?.coursesBlock?.courseTags || [];
    const wordList = cloudCounts.map(({ skillId, count }) => {
      const skill = skillsCatalog.find(s => s.id === skillId);
      const label = pickLang(skill?.shortLabel || skill?.title, skillId);
      return [label, count];
    }).filter(([label]) => label);

    if (wordList.length > 0) {
      window.WordCloud.stop();
      const rect = cloudCanvas.parentElement.getBoundingClientRect();
      cloudCanvas.width = rect.width;
      cloudCanvas.height = 280;
      const palette = ['#5620f6', '#1d4ed8', '#0d9488', '#ea580c', '#d97706', '#7c3aed'];
      window.WordCloud(cloudCanvas, {
        list: wordList,
        fontFamily: '"Instrument Sans", sans-serif',
        color: (word) => {
          let hash = 0;
          for (let i = 0; i < word.length; i++) hash = ((hash << 5) - hash) + word.charCodeAt(i);
          return palette[Math.abs(hash) % palette.length];
        },
        rotateRatio: 0.3,
        minRotation: 0,
        maxRotation: Math.PI / 2,
        rotationSteps: 2,
        gridSize: 8,
        weightFactor: (size) => Math.max(14, Math.min(44, 12 + size * 6)),
        backgroundColor: 'transparent',
        drawOutOfBound: false,
        shrinkToFit: true,
        abortThreshold: 3000,
      });
    }
  }
}
