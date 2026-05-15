import { t } from '../i18n.js';
import { getState, setState } from '../state.js';
import { TRAINING_CONFIG } from '../../data/training.js';

const COURSE_HOURS     = [60, 90, 30, 45, 80, 50, 70, 40];
const COURSE_ENROLLED  = [312, 87, 524, 198, 54, 143, 72, 211];
const COURSE_RATING    = [4.7, 4.9, 4.8, 4.6, 4.8, 4.5, 4.7, 4.4];
const COURSE_PARTNERS  = ['UVEG / CEICE', "Ud'A / UVEG", 'CEICE / Inspiring Futures Europe', 'AVA-ASAJA / CINK', 'INESC TEC / HSW', 'Region Värmland / NTNU', 'KEA / ESAD-GV / LPGA', 'LC / CEICE'];
const COURSE_MODALITY  = ['Semipresencial', 'Online', 'Online', 'Semipresencial', 'Online', 'Online', 'Online', 'Online'];

const CREDENTIAL_FRAMEWORKS = [
  { name: 'European Digital Credentials (EDC)', org: 'European Commission',          logo: '🇪🇺' },
  { name: 'Open Badges 3.0',                    org: 'IMS Global / 1EdTech',         logo: '🏅' },
  { name: 'Europass Certificate Supplement',    org: 'CEDEFOP',                      logo: '📋' },
  { name: 'TÜV Thüringen Certification',        org: 'TUV.IT – AI-SECRETT Consortium', logo: '✅' },
];

function getLang() { return localStorage.getItem('language') || 'es'; }
function pickLang(value, fallback = '') {
  const lang = getLang();
  if (value && typeof value === 'object') return value[lang] || value.es || fallback;
  return fallback;
}

const TONE_MAP = {
  success: { cls: 'text-green-700 bg-green-50',   activeStyle: 'background:#15803d;color:#fff' },
  warning: { cls: 'text-yellow-700 bg-yellow-50', activeStyle: 'background:#b45309;color:#fff' },
  danger:  { cls: 'text-red-700 bg-red-50',       activeStyle: 'background:#b91c1c;color:#fff' },
  info:    { cls: 'text-eu-blue bg-eu-blue/10',   activeStyle: 'background:#1d4ed8;color:#fff' },
  neutral: { cls: 'text-gray-600 bg-gray-100',    activeStyle: 'background:#4b5563;color:#fff' },
};

function getActiveFilters(tab) {
  const filterKey = `trainingFilters_${tab}`;
  return JSON.parse(localStorage.getItem(filterKey) || '{"sectors":[],"modalities":[],"tags":[],"statuses":[]}');
}

function setActiveFilters(tab, filters) {
  const filterKey = `trainingFilters_${tab}`;
  localStorage.setItem(filterKey, JSON.stringify(filters));
}

function filterCourses(courses, filters) {
  return courses.filter(course => {
    const sectorMatch   = filters.sectors.length === 0   || course.sectorIds?.some(s => filters.sectors.includes(s));
    const modalityMatch = filters.modalities.length === 0 || (course.modalityId && filters.modalities.includes(course.modalityId));
    const tagMatch      = filters.tags.length === 0      || course.tagIds?.some(t => filters.tags.includes(t));
    const statusMatch   = (filters.statuses || []).length === 0 || (filters.statuses || []).includes(course.statusId);
    return sectorMatch && modalityMatch && tagMatch && statusMatch;
  });
}

function getCourses(trainingT) {
  const cmsConfig = TRAINING_CONFIG?.coursesBlock;
  if (cmsConfig?.courses?.length > 0) {
    // Crear mapas de lookup para resolver IDs a labels/objetos
    const sectorsMap = {};
    const modalitiesMap = {};
    const statusesMap = {};
    (cmsConfig.sectors || []).forEach(s => { sectorsMap[s.id] = s.label; });
    (cmsConfig.modalities || []).forEach(m => { modalitiesMap[m.id] = m.label; });
    (cmsConfig.statuses || []).forEach(s => { statusesMap[s.id] = s; });

    return cmsConfig.courses.map((course, idx) => ({
      id: course.id,
      title: pickLang(course.title, ''),
      level: course.level,
      sectorIds: course.sectorIds || [],
      sectors: (course.sectorIds || []).map(sectorId => pickLang(sectorsMap[sectorId], sectorId)),
      hours: COURSE_HOURS[idx] || 0,
      enrolled: COURSE_ENROLLED[idx] || 0,
      rating: COURSE_RATING[idx] || 0,
      partner: COURSE_PARTNERS[idx] || '',
      description: pickLang(course.description, ''),
      modalityId: course.modalityId || '',
      modality: pickLang(modalitiesMap[course.modalityId], course.modalityId),
      statusId: course.statusId || '',
      statusObj: statusesMap[course.statusId] || { id: course.statusId, label: { es: course.statusId, en: course.statusId, va: course.statusId }, tone: 'neutral' },
      tagIds: course.tagIds || [],
    }));
  }
  // Fallback to translations if no CMS courses
  const coursesObj = trainingT?.courses || {};
  return Object.values(coursesObj).map((course, idx) => ({
    id: `c${idx + 1}`,
    title: course.title,
    level: course.level,
    sectorIds: [],
    sectors: [course.sector] || [],
    hours: COURSE_HOURS[idx],
    enrolled: COURSE_ENROLLED[idx],
    rating: COURSE_RATING[idx],
    partner: COURSE_PARTNERS[idx],
    description: course.desc,
    modalityId: '',
    modality: COURSE_MODALITY[idx],
    statusId: course.status || '',
    statusObj: { id: course.status, label: { es: course.status, en: course.status, va: course.status }, tone: 'neutral' },
    tagIds: [],
  }));
}

function courseCard(course, trainingT, isMaster = false, courseTags = [], activeTab = 'fp', activeFilters = { sectors: [], modalities: [], tags: [], statuses: [] }) {
  const levelLabels    = trainingT?.levelLabels    || {};
  const modalityLabels = trainingT?.modalityLabels || {};

  const statusLabel   = pickLang(course.statusObj?.label, course.statusId);
  const levelLabel    = levelLabels[course.level]       || course.level;
  const modalityLabel = modalityLabels[course.modality] || course.modality;

  const tone = course.statusObj?.tone || 'neutral';
  const isStatusActive = (activeFilters.statuses || []).includes(course.statusId);
  const courseSectorLabels = course.sectors || [];
  const href = isMaster ? 'https://valgrai.eu' : 'https://portal.edu.gva.es/aules/';
  const viewLabel = isMaster ? 'Ver' : (trainingT?.courseViewMore || '');

  const chipsHtml = (course.tagIds || []).map(chipId => {
    const chip = courseTags.find(c => c.id === chipId);
    if (!chip) return '';
    const isActive = activeFilters.tags.includes(chipId);
    return `<button data-filter-tag="${chipId}" class="text-xs font-medium px-2 py-1 rounded-full transition-colors cursor-pointer ${isActive ? 'bg-eu-blue text-white border border-eu-blue' : 'bg-eu-blue/10 text-eu-blue border border-eu-blue/20 hover:bg-eu-blue/20'}">${pickLang(chip.label, chipId)}</button>`;
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
          <span class="flex items-center gap-1"><i data-lucide="clock" class="w-3 h-3"></i>${course.hours}${trainingT?.courseHours || ''}</span>
          <span class="flex items-center gap-1"><i data-lucide="users" class="w-3 h-3"></i>${course.enrolled} ${trainingT?.courseEnrolledLabel || ''}</span>
          <span class="flex items-center gap-1"><i data-lucide="star" class="w-3 h-3 text-yellow-500"></i>${course.rating}</span>
        </div>
        <div class="flex flex-wrap gap-2">
          ${(course.sectorIds || []).map((sectorId, idx) => {
            const isActive = activeFilters.sectors.includes(sectorId);
            const sectorLabel = courseSectorLabels[idx] || sectorId;
            return `<button data-filter-sector="${sectorId}" class="text-sm font-semibold px-2 py-0.5 rounded whitespace-nowrap transition-colors cursor-pointer ${isActive ? 'bg-eu-blue text-white border border-eu-blue' : 'bg-eu-bg border border-eu-border text-gray-600 hover:border-eu-blue'}">${sectorLabel}</button>`;
          }).join('')}
          ${course.modalityId ? `<button data-filter-modality="${course.modalityId}" class="text-xs px-2 py-0.5 rounded font-bold whitespace-nowrap transition-colors cursor-pointer ${activeFilters.modalities.includes(course.modalityId) ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-700 border border-purple-300 hover:bg-purple-200'}">${modalityLabel}</button>` : ''}
        </div>
        ${chipsHtml ? `<div class="flex flex-wrap gap-2 mt-3">${chipsHtml}</div>` : ''}
      </div>
      <div class="border-t border-eu-border p-3 flex items-center justify-end bg-eu-bg">
        <a href="${href}" target="_blank" rel="noopener noreferrer"
           class="text-eu-blue font-bold text-xs cursor-pointer hover:underline inline-flex items-center gap-1 shrink-0">
          ${viewLabel} <i data-lucide="external-link" class="w-3 h-3"></i>
        </a>
      </div>
    </div>
  `;
}

function pathSteps(steps, color) {
  return (steps || []).map((step, i, arr) => `
    <div class="flex items-center gap-2">
      <div class="flex items-center gap-2 bg-eu-bg border border-eu-border rounded-lg px-3 py-2">
        <span class="w-5 h-5 rounded-full ${color} text-white text-xs font-bold flex items-center justify-center shrink-0">${i + 1}</span>
        <span class="text-sm text-eu-text">${step}</span>
      </div>
      ${i < arr.length - 1 ? '<i data-lucide="arrow-right" class="w-4 h-4 text-gray-400 shrink-0"></i>' : ''}
    </div>
  `).join('');
}

function tabContent(activeTab, courses, trainingT, sections, courseTags = [], emptyMessage = {}) {
  const cmsConfig = TRAINING_CONFIG?.coursesBlock || {};
  const filters = getActiveFilters(activeTab);

  // Filter courses by level and active filters
  let fpCourses      = courses.filter(c => c.level === 'FP');
  let teacherCourses = courses.filter(c => c.level === 'Docentes');
  let masterCourses  = courses.filter(c => c.level === 'Máster');

  // Apply active filters
  fpCourses = filterCourses(fpCourses, filters);
  teacherCourses = filterCourses(teacherCourses, filters);
  masterCourses = filterCourses(masterCourses, filters);

  // Build clear filters button if needed
  const hasActiveFilters = filters.sectors.length > 0 || filters.modalities.length > 0 || filters.tags.length > 0 || (filters.statuses || []).length > 0;
  const clearFiltersLabel = trainingT?.clearFiltersButton || 'Limpiar filtros';
  const clearFiltersHtml = hasActiveFilters ? `<div class="mb-6"><button data-clear-filters class="inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-full font-medium transition-colors bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200 hover:border-gray-400"><i data-lucide="x" class="w-4 h-4"></i>${clearFiltersLabel}</button></div>` : '';
  const filterChipsHtml = clearFiltersHtml;

  // Encontrar sección CMS correspondiente
  const sectionMap = {
    'fp': 'fp-skills',
    'teacher': 'continuous-learning',
    'master': 'master-skills'
  };
  const cmsSection = sections.find(s => s.id === sectionMap[activeTab]);

  if (activeTab === 'fp') {
    // Usar skills del CMS si están disponibles, sino fallback a traducciones
    const skillsBlockVisible = cmsSection?.skillsBlock?.visible !== false;
    const skills = cmsSection?.skillsBlock?.skills || [];
    const skillsHtml = skills.length > 0
      ? skills.map(skill => `
        <div class="flex items-center gap-2 bg-white rounded-lg px-3 py-2 border border-eu-yellow shadow-sm text-sm text-eu-text font-medium">
          <span class="text-lg">${skill.icon}</span><span>${pickLang(skill.title, '')}</span>
        </div>`).join('')
      : (trainingT?.fpSkills || []).map(skill => `
        <div class="flex items-center gap-2 bg-white rounded-lg px-3 py-2 border border-eu-yellow shadow-sm text-sm text-eu-text font-medium">
          <i data-lucide="check-circle" class="w-4 h-4 text-eu-orange shrink-0"></i>${skill}
        </div>`).join('');

    const sectionTitle = cmsSection ? pickLang(cmsSection.title, trainingT?.tabFpVet || '') : (trainingT?.tabFpVet || '');

    return `
      ${skillsBlockVisible ? `
      <div class="bg-eu-yellow/20 border border-eu-yellow rounded-xl p-6 mb-8">
        <h2 class="text-lg font-bold text-eu-text mb-4 flex items-center gap-2">
          <i data-lucide="briefcase" class="w-5 h-5 text-eu-orange"></i>${sectionTitle}
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">${skillsHtml}</div>
      </div>` : ''}
      ${filterChipsHtml}
      ${fpCourses.length > 0 ? `
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
        ${fpCourses.map(c => courseCard(c, trainingT, false, courseTags, activeTab, filters)).join('')}
      </div>` : `
      <div class="bg-white rounded-xl border border-eu-border shadow-sm p-8 mb-10 text-center">
        <i data-lucide="inbox" class="w-12 h-12 text-gray-400 mx-auto mb-4"></i>
        <p class="text-gray-600 text-base">${pickLang(emptyMessage, '')}</p>
      </div>`}
      <div class="bg-white rounded-xl border border-eu-border shadow-sm p-6">
        <h3 class="font-bold text-eu-text mb-4">${trainingT?.fpPath || ''}</h3>
        <div class="flex flex-wrap items-center gap-2">${pathSteps(trainingT?.fpPathSteps, 'bg-eu-orange')}</div>
      </div>`;
  }

  if (activeTab === 'teacher') {
    // Usar skills del CMS si están disponibles (continuous-learning section)
    const teacherSection = sections.find(s => s.id === 'continuous-learning');
    const skillsBlockVisible = teacherSection?.skillsBlock?.visible !== false;
    const skills = teacherSection?.skillsBlock?.skills || [];
    const topicsHtml = skills.length > 0
      ? skills.map(skill => `
        <div class="flex items-center gap-2 bg-white rounded-lg px-3 py-2 border border-eu-border shadow-sm text-sm text-eu-text font-medium">
          <span class="text-lg">${skill.icon}</span><span>${pickLang(skill.title, '')}</span>
        </div>`).join('')
      : (trainingT?.teacherTopics || []).map(topic => `
        <div class="flex items-center gap-2 bg-white rounded-lg px-3 py-2 border border-eu-border shadow-sm text-sm text-eu-text font-medium">
          <i data-lucide="check-circle" class="w-4 h-4 text-eu-blue shrink-0"></i>${topic}
        </div>`).join('');

    const sectionTitle = teacherSection ? pickLang(teacherSection.title, trainingT?.tabTeacherTraining || '') : (trainingT?.tabTeacherTraining || '');

    return `
      ${skillsBlockVisible ? `
      <div class="bg-eu-blue/5 border border-eu-blue/20 rounded-xl p-6 mb-8">
        <h2 class="text-lg font-bold text-eu-text mb-4 flex items-center gap-2">
          <i data-lucide="book-open" class="w-5 h-5 text-eu-blue"></i>${sectionTitle}
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">${topicsHtml}</div>
      </div>` : ''}
      ${filterChipsHtml}
      ${teacherCourses.length > 0 ? `
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        ${teacherCourses.map(c => courseCard(c, trainingT, false, courseTags, activeTab, filters)).join('')}
      </div>` : `
      <div class="bg-white rounded-xl border border-eu-border shadow-sm p-8 text-center">
        <i data-lucide="inbox" class="w-12 h-12 text-gray-400 mx-auto mb-4"></i>
        <p class="text-gray-600 text-base">${pickLang(emptyMessage, '')}</p>
      </div>`}`;
  }

  // master
  const masterSection = sections.find(s => s.id === 'master-skills');
  const masterSkillsBlockVisible = masterSection?.skillsBlock?.visible !== false;
  const masterSkills = masterSection?.skillsBlock?.skills || [];
  const masterSkillsHtml = masterSkills.length > 0
    ? masterSkills.map((skill, i) => `
      <div class="flex items-start gap-2 bg-white rounded-lg px-4 py-3 border border-purple-100 shadow-sm text-sm text-eu-text font-medium">
        <span class="text-lg">${skill.icon}</span>
        <span>${pickLang(skill.title, '')}</span>
      </div>`).join('')
    : (trainingT?.masterBridgeItems || []).map((item, i) => `
      <div class="flex items-start gap-2 bg-white rounded-lg px-4 py-3 border border-purple-100 shadow-sm text-sm text-eu-text font-medium">
        <span class="w-5 h-5 rounded-full bg-purple-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">${i + 1}</span>
        ${item}
      </div>`).join('');

  const masterSectionTitle = masterSection ? pickLang(masterSection.title, trainingT?.tabMasterBridge || '') : (trainingT?.tabMasterBridge || '');

  return `
    <div class="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8 flex items-start gap-3">
      <i data-lucide="alert-triangle" class="w-5 h-5 text-amber-600 shrink-0 mt-0.5"></i>
      <p class="text-sm text-amber-800">${trainingT?.masterBridgeDisclaimer || ''}</p>
    </div>
    ${masterSkillsBlockVisible ? `
    <div class="bg-purple-50 border border-purple-200 rounded-xl p-6 mb-8">
      <h2 class="text-lg font-bold text-eu-text mb-4 flex items-center gap-2">
        <i data-lucide="graduation-cap" class="w-5 h-5 text-purple-700"></i>${masterSectionTitle}
      </h2>
      <div class="space-y-3">${masterSkillsHtml}</div>
    </div>` : ''}
    ${filterChipsHtml}
    ${masterCourses.length > 0 ? `
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
      ${masterCourses.map(c => courseCard(c, trainingT, true, courseTags, activeTab, filters)).join('')}
    </div>` : `
    <div class="bg-white rounded-xl border border-eu-border shadow-sm p-8 mb-8 text-center">
      <i data-lucide="inbox" class="w-12 h-12 text-gray-400 mx-auto mb-4"></i>
      <p class="text-gray-600 text-base">${pickLang(emptyMessage, '')}</p>
    </div>`}
    <div class="bg-white rounded-xl border border-eu-border shadow-sm p-6">
      <h3 class="font-bold text-eu-text mb-4">${trainingT?.masterPath || ''}</h3>
      <div class="flex flex-wrap items-center gap-2">${pathSteps(trainingT?.masterPathSteps, 'bg-purple-600')}</div>
    </div>`;
}

export function render() {
  const trainingT = t('training') || {};
  const activeTab = getState('trainingTab') || 'fp';
  const coursesBlock = TRAINING_CONFIG?.coursesBlock || {};
  const coursesBlockVisible = coursesBlock.visible !== false;
  const courses   = coursesBlockVisible ? getCourses(trainingT) : [];
  const sections  = TRAINING_CONFIG?.sectionsBlock || [];
  const courseTags = coursesBlock.courseTags || [];

  const totalEnrolled = courses.reduce((a, c) => a + c.enrolled, 0).toLocaleString();

  const TABS = [
    { key: 'fp',      icon: 'briefcase',      label: trainingT?.tabFpVet },
    { key: 'teacher', icon: 'book-open',       label: trainingT?.tabTeacherTraining },
    { key: 'master',  icon: 'graduation-cap',  label: trainingT?.tabMasterBridge },
  ];

  const tabsHtml = TABS.map(tab => `
    <button data-tab="${tab.key}" class="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold cursor-pointer transition-colors ${
      activeTab === tab.key
        ? 'bg-eu-blue text-white shadow-sm'
        : 'bg-white text-eu-text border border-eu-border hover:border-eu-blue'
    }">
      <i data-lucide="${tab.icon}" class="w-4 h-4"></i>${tab.label || ''}
    </button>`).join('');

  const heroBlock = TRAINING_CONFIG?.heroBlock || {};
  const heroVisible = heroBlock.visible !== false;
  const heroStats = Array.isArray(heroBlock.stats) ? heroBlock.stats : [];
  const ctaButton = heroBlock.ctaButton || {};

  return `
    <div>
      ${heroVisible ? `
      <!-- Header -->
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

      <!-- Tabs + content -->
      <div class="max-w-7xl mx-auto px-6 py-10">
        <div class="flex flex-wrap gap-2 mb-8 border-b border-eu-border pb-4">${tabsHtml}</div>
        ${tabContent(activeTab, courses, trainingT, sections, courseTags, coursesBlock.emptyMessage || {})}
      </div>
    </div>
  `;
}

export function mount() {
  const activeTab = getState('trainingTab') || 'fp';

  // Tab navigation
  document.querySelectorAll('[data-tab]').forEach(btn => {
    btn.addEventListener('click', () => {
      setState('trainingTab', btn.dataset.tab);
      const main = document.getElementById('main-root');
      main.innerHTML = render();
      mount();
      if (window.lucide) window.lucide.createIcons();
    });
  });

  // Filter chips - Sector
  document.querySelectorAll('[data-filter-sector]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const filters = getActiveFilters(activeTab);
      const sectorId = btn.dataset.filterSector;
      const idx = filters.sectors.indexOf(sectorId);
      if (idx > -1) filters.sectors.splice(idx, 1);
      else filters.sectors.push(sectorId);
      setActiveFilters(activeTab, filters);
      const main = document.getElementById('main-root');
      main.innerHTML = render();
      mount();
      if (window.lucide) window.lucide.createIcons();
    });
  });

  document.querySelectorAll('[data-filter-modality]').forEach(btn => {
    btn.addEventListener('click', () => {
      const filters = getActiveFilters(activeTab);
      const modalityId = btn.dataset.filterModality;
      const idx = filters.modalities.indexOf(modalityId);
      if (idx > -1) filters.modalities.splice(idx, 1);
      else filters.modalities.push(modalityId);
      setActiveFilters(activeTab, filters);
      const main = document.getElementById('main-root');
      main.innerHTML = render();
      mount();
      if (window.lucide) window.lucide.createIcons();
    });
  });

  document.querySelectorAll('[data-filter-tag]').forEach(btn => {
    btn.addEventListener('click', () => {
      const filters = getActiveFilters(activeTab);
      const tagId = btn.dataset.filterTag;
      const idx = filters.tags.indexOf(tagId);
      if (idx > -1) filters.tags.splice(idx, 1);
      else filters.tags.push(tagId);
      setActiveFilters(activeTab, filters);
      const main = document.getElementById('main-root');
      main.innerHTML = render();
      mount();
      if (window.lucide) window.lucide.createIcons();
    });
  });

  document.querySelectorAll('[data-filter-status]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const filters = getActiveFilters(activeTab);
      if (!filters.statuses) filters.statuses = [];
      const statusId = btn.dataset.filterStatus;
      const idx = filters.statuses.indexOf(statusId);
      if (idx > -1) filters.statuses.splice(idx, 1);
      else filters.statuses.push(statusId);
      setActiveFilters(activeTab, filters);
      const main = document.getElementById('main-root');
      main.innerHTML = render();
      mount();
      if (window.lucide) window.lucide.createIcons();
    });
  });

  // Clear filters button
  document.querySelector('[data-clear-filters]')?.addEventListener('click', () => {
    setActiveFilters(activeTab, { sectors: [], modalities: [], tags: [], statuses: [] });
    const main = document.getElementById('main-root');
    main.innerHTML = render();
    mount();
    if (window.lucide) window.lucide.createIcons();
  });
}
