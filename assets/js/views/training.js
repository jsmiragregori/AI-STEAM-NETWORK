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

function statusColor(status) {
  if (status === 'Activo')       return 'text-green-700 bg-green-50';
  if (status === 'Próximamente') return 'text-yellow-700 bg-yellow-50';
  return 'text-gray-600 bg-gray-100';
}

function getCourses(trainingT) {
  const coursesObj = trainingT?.courses || {};
  return Object.values(coursesObj).map((course, idx) => ({
    id: `c${idx + 1}`,
    title:       course.title,
    level:       course.level,
    sector:      course.sector,
    hours:       COURSE_HOURS[idx],
    enrolled:    COURSE_ENROLLED[idx],
    rating:      COURSE_RATING[idx],
    partner:     COURSE_PARTNERS[idx],
    badge:       course.badge,
    description: course.desc,
    modality:    COURSE_MODALITY[idx],
    status:      course.status,
  }));
}

function courseCard(course, trainingT, isMaster = false) {
  const statusLabels   = trainingT?.statusLabels   || {};
  const levelLabels    = trainingT?.levelLabels    || {};
  const modalityLabels = trainingT?.modalityLabels || {};
  const sectorLabels   = trainingT?.sectorLabels   || {};

  const statusLabel   = statusLabels[course.status]   || course.status;
  const levelLabel    = levelLabels[course.level]     || course.level;
  const modalityLabel = modalityLabels[course.modality] || course.modality;
  const sectorLabel   = sectorLabels[course.sector]   || course.sector;
  const href = isMaster ? 'https://valgrai.eu' : 'https://portal.edu.gva.es/aules/';
  const viewLabel = isMaster ? 'Ver' : (trainingT?.courseViewMore || '');

  return `
    <div class="bg-white rounded-xl border border-eu-border shadow-sm flex flex-col overflow-hidden hover:border-eu-blue transition-colors">
      <div class="p-5 flex-1">
        <div class="flex items-center justify-between mb-3 gap-2">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="text-sm font-extrabold uppercase px-2 py-0.5 rounded bg-eu-yellow text-eu-purple">${levelLabel}</span>
            ${isMaster ? '<span class="text-xs bg-purple-600 text-white px-2 py-0.5 rounded font-bold">Track A</span>' : ''}
          </div>
          <span class="text-sm font-bold px-2 py-0.5 rounded ${statusColor(course.status)}">${statusLabel}</span>
        </div>
        <h3 class="font-bold text-eu-text text-sm mb-2 leading-snug">${course.title}</h3>
        <p class="text-xs text-gray-500 mb-3">${course.description}</p>
        <div class="flex flex-wrap gap-2 text-sm text-gray-600 mb-3">
          <span class="flex items-center gap-1"><i data-lucide="clock" class="w-3 h-3"></i>${course.hours}${trainingT?.courseHours || ''}</span>
          <span class="flex items-center gap-1"><i data-lucide="users" class="w-3 h-3"></i>${course.enrolled} ${trainingT?.courseEnrolledLabel || ''}</span>
          <span class="flex items-center gap-1"><i data-lucide="star" class="w-3 h-3 text-yellow-500"></i>${course.rating}</span>
        </div>
        <div class="flex flex-wrap gap-2">
          <span class="text-sm bg-eu-bg border border-eu-border px-2 py-0.5 rounded font-semibold text-gray-600 whitespace-nowrap">${sectorLabel}</span>
          <span class="text-sm bg-eu-bg border border-eu-border px-2 py-0.5 rounded font-semibold text-gray-600 whitespace-nowrap">${modalityLabel}</span>
        </div>
      </div>
      <div class="border-t border-eu-border p-3 flex items-center justify-between bg-eu-bg">
        <div class="flex items-center gap-1.5 min-w-0 flex-1">
          <i data-lucide="award" class="w-3 h-3 text-eu-orange shrink-0"></i>
          <span class="text-sm font-bold text-eu-orange truncate">${course.badge}</span>
        </div>
        <a href="${href}" target="_blank" rel="noopener noreferrer"
           class="text-eu-blue font-bold text-xs cursor-pointer hover:underline inline-flex items-center gap-1 shrink-0 ml-2">
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

function tabContent(activeTab, courses, trainingT) {
  const fpCourses      = courses.filter(c => c.level === 'FP');
  const teacherCourses = courses.filter(c => c.level === 'Docentes');
  const masterCourses  = courses.filter(c => c.level === 'Máster');

  if (activeTab === 'fp') {
    const skillsHtml = (trainingT?.fpSkills || []).map(skill => `
      <div class="flex items-center gap-2 bg-white rounded-lg px-3 py-2 border border-eu-yellow shadow-sm text-sm text-eu-text font-medium">
        <i data-lucide="check-circle" class="w-4 h-4 text-eu-orange shrink-0"></i>${skill}
      </div>`).join('');

    return `
      <div class="bg-eu-yellow/20 border border-eu-yellow rounded-xl p-6 mb-8">
        <h2 class="text-lg font-bold text-eu-text mb-4 flex items-center gap-2">
          <i data-lucide="briefcase" class="w-5 h-5 text-eu-orange"></i>${trainingT?.tabFpVet || ''}
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">${skillsHtml}</div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
        ${fpCourses.map(c => courseCard(c, trainingT)).join('')}
      </div>
      <div class="bg-white rounded-xl border border-eu-border shadow-sm p-6">
        <h3 class="font-bold text-eu-text mb-4">${trainingT?.fpPath || ''}</h3>
        <div class="flex flex-wrap items-center gap-2">${pathSteps(trainingT?.fpPathSteps, 'bg-eu-orange')}</div>
      </div>`;
  }

  if (activeTab === 'teacher') {
    const topicsHtml = (trainingT?.teacherTopics || []).map(topic => `
      <div class="flex items-center gap-2 bg-white rounded-lg px-3 py-2 border border-eu-border shadow-sm text-sm text-eu-text font-medium">
        <i data-lucide="check-circle" class="w-4 h-4 text-eu-blue shrink-0"></i>${topic}
      </div>`).join('');

    return `
      <div class="bg-eu-blue/5 border border-eu-blue/20 rounded-xl p-6 mb-8">
        <h2 class="text-lg font-bold text-eu-text mb-4 flex items-center gap-2">
          <i data-lucide="book-open" class="w-5 h-5 text-eu-blue"></i>${trainingT?.tabTeacherTraining || ''}
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">${topicsHtml}</div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        ${teacherCourses.map(c => courseCard(c, trainingT)).join('')}
      </div>`;
  }

  // master
  const bridgeItemsHtml = (trainingT?.masterBridgeItems || []).map((item, i) => `
    <div class="flex items-start gap-2 bg-white rounded-lg px-4 py-3 border border-purple-100 shadow-sm text-sm text-eu-text font-medium">
      <span class="w-5 h-5 rounded-full bg-purple-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">${i + 1}</span>
      ${item}
    </div>`).join('');

  return `
    <div class="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8 flex items-start gap-3">
      <i data-lucide="alert-triangle" class="w-5 h-5 text-amber-600 shrink-0 mt-0.5"></i>
      <p class="text-sm text-amber-800">${trainingT?.masterBridgeDisclaimer || ''}</p>
    </div>
    <div class="bg-purple-50 border border-purple-200 rounded-xl p-6 mb-8">
      <h2 class="text-lg font-bold text-eu-text mb-4 flex items-center gap-2">
        <i data-lucide="graduation-cap" class="w-5 h-5 text-purple-700"></i>${trainingT?.tabMasterBridge || ''}
      </h2>
      <div class="space-y-3">${bridgeItemsHtml}</div>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
      ${masterCourses.map(c => courseCard(c, trainingT, true)).join('')}
    </div>
    <div class="bg-white rounded-xl border border-eu-border shadow-sm p-6">
      <h3 class="font-bold text-eu-text mb-4">${trainingT?.masterPath || ''}</h3>
      <div class="flex flex-wrap items-center gap-2">${pathSteps(trainingT?.masterPathSteps, 'bg-purple-600')}</div>
    </div>`;
}

export function render() {
  const trainingT = t('training') || {};
  const activeTab = getState('trainingTab') || 'fp';
  const courses   = getCourses(trainingT);

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
        ${tabContent(activeTab, courses, trainingT)}
      </div>
    </div>
  `;
}

export function mount() {
  document.querySelectorAll('[data-tab]').forEach(btn => {
    btn.addEventListener('click', () => {
      setState('trainingTab', btn.dataset.tab);
      // Re-render solo el main-root para no perder la posición de scroll
      const main = document.getElementById('main-root');
      main.innerHTML = render();
      mount();
      if (window.lucide) window.lucide.createIcons();
    });
  });
}
