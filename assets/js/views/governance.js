import { t } from '../i18n.js';
import { getState, setState } from '../state.js';
import { GOVERNANCE_CONFIG } from '../../data/governance.js';

function getLang() { return localStorage.getItem('language') || 'es'; }
function pickLang(value, fallback = '') {
  const lang = getLang();
  if (value && typeof value === 'object') return value[lang] || value.es || fallback;
  return fallback;
}

const TABS = ['estructura', 'dual-track', 'lbd', 'documentos', 'participar'];

// ─── helpers ─────────────────────────────────────────────────────────────────

function tabBar(activeTab, govT) {
  const labels = {
    'estructura':  govT?.tabEstructura  || 'Estructura',
    'dual-track':  govT?.tabDualTrack   || 'Dual Track',
    'lbd':         govT?.tabLbd         || 'Metodología LbD',
    'documentos':  govT?.tabDocumentos  || 'Documentos',
    'participar':  govT?.tabParticipar  || 'Participar',
  };
  return TABS.map(id => `
    <button data-gov-tab="${id}" class="px-5 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-colors cursor-pointer whitespace-nowrap ${
      activeTab === id
        ? 'border-eu-blue text-eu-blue'
        : 'border-transparent text-gray-600 hover:text-eu-text'
    }">${labels[id]}</button>
  `).join('');
}

// ─── Tab 1: Estructura ───────────────────────────────────────────────────────

function tabEstructura(govT) {
  const s = govT?.tabContent_estructura || {};
  const structureBodiesBlock = GOVERNANCE_CONFIG?.structureBodiesBlock || {};
  const hubBlock = structureBodiesBlock.hub || {};
  const actorsBlock = structureBodiesBlock.actors || {};
  const formalBodiesBlock = GOVERNANCE_CONFIG?.formalBodiesBlock || {};
  const bodies = govT?.governanceBodies || [];

  const hasCmsHubNodes = Object.prototype.hasOwnProperty.call(hubBlock, 'nodes');
  const hubNodes = hasCmsHubNodes && Array.isArray(hubBlock.nodes)
    ? hubBlock.nodes
    : (s.nodes || []);
  const nodesHtml = hubNodes.map(node => `
    <div class="rounded-xl border-2 ${node.border || 'border-eu-border'} p-5">
      <div class="w-8 h-8 rounded-lg ${node.color || 'bg-eu-blue'} text-white flex items-center justify-center mb-3">
        <i data-lucide="${node.icon || 'globe'}" class="w-4 h-4"></i>
      </div>
      <p class="text-xs font-extrabold uppercase tracking-wider text-gray-500 mb-0.5">${pickLang(node.label, node.label || '')}</p>
      <p class="font-bold text-eu-text">${pickLang(node.city, node.city || '')}</p>
      <p class="text-xs text-gray-500 mb-2">${pickLang(node.org, node.org || '')}</p>
      <p class="text-xs text-gray-600">${pickLang(node.role, node.role || '')}</p>
    </div>
  `).join('');

  const ceiceIconMap = { 'shield': 'shield', 'file-text': 'file-text', 'users': 'users', 'globe': 'globe' };
  function ceiceIcon(label) {
    if (/representac/i.test(label)) return 'shield';
    if (/contenido|content|contingut/i.test(label)) return 'file-text';
    if (/datos|data|dades/i.test(label)) return 'users';
    return 'globe';
  }
  function uvegIcon(label) {
    if (/garant|acadèmic/i.test(label)) return 'graduation-cap';
    if (/contenido|content|contingut/i.test(label)) return 'file-text';
    if (/datos|data|dades/i.test(label)) return 'shield';
    return 'globe';
  }

  const ceiceRolesHtml = (s.ceiceRoles || []).map(item => `
    <div class="flex items-start gap-2.5">
      <i data-lucide="${ceiceIcon(item.label)}" class="w-4 h-4 text-eu-orange mt-0.5 shrink-0"></i>
      <div>
        <span class="font-bold text-eu-text">${item.label}: </span>
        <span class="text-gray-600">${item.desc}</span>
      </div>
    </div>
  `).join('');

  const uvegRolesHtml = (s.uvegRoles || []).map(item => `
    <div class="flex items-start gap-2.5">
      <i data-lucide="${uvegIcon(item.label)}" class="w-4 h-4 text-eu-blue mt-0.5 shrink-0"></i>
      <div>
        <span class="font-bold text-eu-text">${item.label}: </span>
        <span class="text-gray-600">${item.desc}</span>
      </div>
    </div>
  `).join('');

  const hasCmsActorCards = Object.prototype.hasOwnProperty.call(actorsBlock, 'cards');
  const actorCards = hasCmsActorCards && Array.isArray(actorsBlock.cards)
    ? actorsBlock.cards
    : [
        { id: 'ceice', visible: true, icon: 'building-2', tone: 'orange', title: s.ceiceTitle, subtitle: s.ceiceSubtitle, roles: s.ceiceRoles || [] },
        { id: 'uveg', visible: true, icon: 'graduation-cap', tone: 'blue', title: s.uvegTitle, subtitle: s.uvegSubtitle, roles: s.uvegRoles || [] },
      ];

  function actorTone(tone) {
    return tone === 'orange'
      ? { border: 'border-eu-orange', bg: 'bg-eu-orange/10', text: 'text-eu-orange' }
      : { border: 'border-eu-blue', bg: 'bg-eu-blue/10', text: 'text-eu-blue' };
  }

  const actorCardsHtml = actorCards.map(card => {
    const tone = actorTone(card.tone);
    const rolesHtml = (Array.isArray(card.roles) ? card.roles : []).map(item => `
      <div class="flex items-start gap-2.5">
        <i data-lucide="${item.icon || 'globe'}" class="w-4 h-4 ${tone.text} mt-0.5 shrink-0"></i>
        <div>
          <span class="font-bold text-eu-text">${pickLang(item.label, item.label || '')}: </span>
          <span class="text-gray-600">${pickLang(item.desc, item.desc || '')}</span>
        </div>
      </div>
    `).join('');

    return `
      <div class="bg-white rounded-xl border-l-4 ${tone.border} border border-eu-border shadow-sm p-6">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 ${tone.bg} rounded-xl flex items-center justify-center">
            <i data-lucide="${card.icon || 'globe'}" class="w-5 h-5 ${tone.text}"></i>
          </div>
          <div>
            <h3 class="font-bold text-eu-text">${pickLang(card.title, card.title || '')}</h3>
            <p class="text-xs ${tone.text} font-bold uppercase">${pickLang(card.subtitle, card.subtitle || '')}</p>
          </div>
        </div>
        <div class="space-y-3 text-sm">${rolesHtml}</div>
      </div>
    `;
  }).join('');

  const hasCmsFormalBodies = Object.prototype.hasOwnProperty.call(formalBodiesBlock, 'cards');
  const formalBodies = hasCmsFormalBodies && Array.isArray(formalBodiesBlock.cards)
    ? formalBodiesBlock.cards
    : bodies;
  const formalLabels = formalBodiesBlock.fieldLabels || {};
  const standardsBlock = formalBodiesBlock.standards || {};
  function metaRow(label, value) {
    const picked = pickLang(value, '');
    const text = typeof picked === 'string' ? picked.trim() : '';
    if (!text) return '';
    return `<p><span class="font-bold text-gray-700">${pickLang(label)}:</span> ${text}</p>`;
  }

  const bodiesHtml = formalBodies.map(body => `
    <div class="rounded-xl border-l-4 border ${body.color || 'border-eu-border'} p-6 shadow-sm">
      <div class="flex items-start justify-between mb-3">
        <div>
          <h3 class="font-bold text-lg text-eu-text">${pickLang(body.name, body.name || '')}</h3>
          <p class="text-xs font-bold uppercase tracking-wider mt-0.5 ${body.iconColor || 'text-eu-blue'}">${pickLang(body.type, body.type || '')}</p>
        </div>
        <span class="text-2xl font-extrabold ${body.iconColor || 'text-eu-blue'} opacity-20">${body.abbr || ''}</span>
      </div>
      <p class="text-sm text-gray-600 mb-4">${pickLang(body.desc, body.desc || '')}</p>
      <div class="space-y-1 text-xs text-gray-500">
        ${metaRow(formalLabels.members || { es: 'Miembros', en: 'Members', va: 'Membres' }, body.members)}
        ${metaRow(formalLabels.frequency || { es: 'Frecuencia', en: 'Frequency', va: 'Freqüència' }, body.frequency || body.freq)}
        ${metaRow(formalLabels.quorum || { es: 'Quórum', en: 'Quorum', va: 'Quòrum' }, body.quorum)}
      </div>
    </div>
  `).join('');

  const standardTone = tone => tone === 'orange'
    ? { bg: 'bg-eu-orange/10', text: 'text-eu-orange' }
    : { bg: 'bg-eu-blue/10', text: 'text-eu-blue' };
  const standardCardsHtml = (Array.isArray(standardsBlock.cards) ? standardsBlock.cards : [
    { icon: 'shield-check', tone: 'blue', title: s.iso21001Title, desc: s.iso21001Desc },
    { icon: 'globe', tone: 'orange', title: s.enredTitle, desc: s.enredDesc },
  ]).map(card => {
    const tone = standardTone(card.tone);
    return `
      <div class="bg-white rounded-xl border border-eu-border shadow-sm p-6 flex gap-4 items-start">
        <div class="w-12 h-12 rounded-xl ${tone.bg} flex items-center justify-center shrink-0">
          <i data-lucide="${card.icon || 'globe'}" class="w-6 h-6 ${tone.text}"></i>
        </div>
        <div>
          <h3 class="font-bold text-eu-text mb-1">${pickLang(card.title, card.title || '')}</h3>
          <p class="text-sm text-gray-600">${pickLang(card.desc, card.desc || '')}</p>
        </div>
      </div>
    `;
  }).join('');

  return `
    <div class="space-y-10">
      ${hubBlock.visible !== false ? `
      <!-- Hub -->
      <div class="bg-white rounded-xl border border-eu-border shadow-sm p-7">
        <h2 class="text-xl font-bold text-eu-text mb-3 flex items-center gap-2">
          <i data-lucide="globe" class="w-5 h-5 text-eu-blue"></i>${pickLang(hubBlock.title, s.hubTitle || '')}
        </h2>
        <p class="text-sm text-gray-600 mb-5 max-w-3xl">${pickLang(hubBlock.description, s.hubDesc || '')}</p>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">${nodesHtml}</div>
      </div>` : ''}

      ${actorsBlock.visible !== false ? `
      <!-- Actores principales -->
      <div>
        <h2 class="text-xl font-bold text-eu-text mb-2">${pickLang(actorsBlock.title, s.actorsTitle || '')}</h2>
        <p class="text-sm text-gray-600 mb-5 max-w-3xl">${pickLang(actorsBlock.description, s.actorsDesc || '')}</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          ${actorCardsHtml}
        </div>
      </div>` : ''}

      ${formalBodiesBlock.visible !== false ? `
      <!-- Órganos formales -->
      <div>
        <h2 class="text-xl font-bold text-eu-text mb-2">${pickLang(formalBodiesBlock.title, s.bodiesTitle || '')}</h2>
        <p class="text-sm text-gray-600 mb-6 max-w-3xl">${pickLang(formalBodiesBlock.description, s.bodiesDesc || '')}</p>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">${bodiesHtml}</div>
      </div>` : ''}

      ${standardsBlock.visible !== false ? `
      <!-- ISO + ENRED -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        ${standardCardsHtml}
      </div>` : ''}
    </div>
  `;
}

// ─── Tab 2: Dual Track ───────────────────────────────────────────────────────

function tabDualTrack(govT) {
  const s = govT?.tabContent_dualtrack || {};
  const dualTrackBlock = GOVERNANCE_CONFIG?.dualTrackBlock || {};
  const dualTrackVisible = dualTrackBlock.visible !== false;
  const tracksById = Object.fromEntries((dualTrackBlock.tracks || []).map(t => [t.id, t]));
  const trackAVisible = tracksById['track-a']?.visible !== false;
  const trackBVisible = tracksById['track-b']?.visible !== false;

  const fl = dualTrackBlock.fieldLabels || {};

  function trackBlock(cmsTrack, colorClass, borderClass, accentClass, alertIcon, alertBg, alertText) {
    const bodiesHtml = (cmsTrack.activeBodies || []).map(b =>
      `<span class="text-xs ${accentClass} font-bold px-2 py-1 rounded">${pickLang(b.label)}</span>`
    ).join('');
    return `
      <div class="bg-white rounded-2xl border-2 ${borderClass} shadow-sm overflow-hidden">
        <div class="${colorClass} text-white px-6 py-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center font-extrabold text-lg">${cmsTrack.letter || ''}</div>
            <div>
              <h3 class="font-extrabold text-lg">${pickLang(cmsTrack.title)}</h3>
              <p class="text-white/70 text-sm">${pickLang(cmsTrack.subtitle)}</p>
            </div>
          </div>
        </div>
        <div class="p-6 space-y-4">
          <div>
            <p class="text-xs font-bold uppercase ${alertText} mb-1">${pickLang(fl.scope)}</p>
            <p class="text-sm text-gray-600">${pickLang(cmsTrack.scope?.text)}</p>
          </div>
          <div>
            <p class="text-xs font-bold uppercase ${alertText} mb-1">${pickLang(fl.normativeFramework)}</p>
            <p class="text-sm text-gray-600">${pickLang(cmsTrack.normativeFramework?.text)}</p>
          </div>
          <div>
            <p class="text-xs font-bold uppercase ${alertText} mb-1">${pickLang(fl.keyLimit)}</p>
            <div class="flex items-start gap-2 ${alertBg} rounded-lg p-3">
              <i data-lucide="${alertIcon}" class="w-4 h-4 ${alertText} mt-0.5 shrink-0"></i>
              <p class="text-sm ${alertText} font-semibold">${pickLang(cmsTrack.keyLimit?.text)}</p>
            </div>
          </div>
          <div>
            <p class="text-xs font-bold uppercase ${alertText} mb-2">${pickLang(fl.activeBodies)}</p>
            <div class="flex flex-wrap gap-2">${bodiesHtml}</div>
          </div>
        </div>
      </div>
    `;
  }

  const cmsDataArch = dualTrackBlock.dataArch || {};
  const zoneStyles = {
    public:  { dot: 'bg-eu-blue',    zone: 'bg-blue-50 border-blue-200',     title: 'text-eu-blue'    },
    private: { dot: 'bg-purple-600', zone: 'bg-purple-50 border-purple-200', title: 'text-purple-700' },
  };
  const dataArchZonesHtml = (cmsDataArch.zones || []).map(zone => {
    const st = zoneStyles[zone.id] || zoneStyles.public;
    const itemsHtml = (zone.items || []).map(item =>
      `<li class="flex items-center gap-2 text-xs text-gray-700"><span class="w-1.5 h-1.5 rounded-full ${st.dot} shrink-0"></span>${pickLang(item)}</li>`
    ).join('');
    return `
      <div class="${st.zone} border rounded-xl p-5">
        <p class="text-xs font-extrabold uppercase ${st.title} mb-2">${pickLang(zone.title)}</p>
        <p class="text-xs text-gray-600 mb-3">${pickLang(zone.description)}</p>
        <ul class="space-y-1.5">${itemsHtml}</ul>
      </div>`;
  }).join('');

  const cmsRB = dualTrackBlock.responsibilityBoundaries || {};
  const responsibilityHtml = (cmsRB.items || []).map(item => `
    <div class="rounded-xl border border-eu-border bg-eu-bg p-5">
      <p class="text-xs font-extrabold uppercase text-eu-blue mb-1">${pickLang(item.owner)}</p>
      <p class="text-sm text-gray-700">${pickLang(item.scope)}</p>
    </div>
  `).join('');

  const cmsAgreement = dualTrackBlock.agreement || {};
  const agreementItemsHtml = (cmsAgreement.items || []).map(c => `
    <div class="bg-white rounded-lg border border-eu-border p-4">
      <p class="font-bold text-eu-teal text-sm mb-1">${pickLang(c.title)}</p>
      <p class="text-xs text-gray-600">${pickLang(c.desc)}</p>
    </div>
  `).join('');

  return `
    <div class="space-y-8">
      ${dualTrackVisible ? `
      <div>
        <h2 class="text-xl font-bold text-eu-text mb-2">${pickLang(dualTrackBlock.title)}</h2>
        <p class="text-sm text-gray-600 mb-6 max-w-3xl">${pickLang(dualTrackBlock.description)}</p>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          ${trackAVisible ? trackBlock(tracksById['track-a'], 'bg-eu-blue',   'border-eu-blue',   'bg-eu-blue/10 text-eu-blue',   'alert-circle',  'bg-blue-50',       'text-eu-blue'  ) : ''}
          ${trackBVisible ? trackBlock(tracksById['track-b'], 'bg-eu-orange',  'border-eu-orange', 'bg-eu-orange/10 text-eu-orange','check-circle',  'bg-eu-yellow/60',  'text-eu-orange') : ''}
        </div>
      </div>` : ''}
      <div>

        <!-- Zonas de datos -->
        ${cmsDataArch.visible !== false ? `
        <div class="bg-white rounded-xl border border-eu-border shadow-sm p-7 mb-6">
          <h3 class="font-bold text-eu-text mb-4 flex items-center gap-2">
            <i data-lucide="shield-check" class="w-5 h-5 text-eu-blue"></i>${pickLang(cmsDataArch.title)}
          </h3>
          <p class="text-sm text-gray-600 mb-5">${pickLang(cmsDataArch.description)}</p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">${dataArchZonesHtml}</div>
        </div>` : ''}

        <!-- Responsabilidad -->
        ${cmsRB.visible !== false ? `
        <div class="bg-white rounded-xl border border-eu-border shadow-sm p-7 mb-6">
          <h3 class="font-bold text-eu-text mb-2 flex items-center gap-2">
            <i data-lucide="shield" class="w-5 h-5 text-eu-orange"></i>${pickLang(cmsRB.title)}
          </h3>
          <p class="text-sm text-gray-600 mb-5">${pickLang(cmsRB.description)}</p>
          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">${responsibilityHtml}</div>
        </div>` : ''}

        <!-- Acuerdo de Colaboración -->
        ${cmsAgreement.visible !== false ? `
        <div class="bg-eu-bg rounded-xl border border-eu-border p-6">
          <h3 class="font-bold text-eu-text mb-3 flex items-center gap-2">
            <i data-lucide="file-signature" class="w-5 h-5 text-eu-teal"></i>${pickLang(cmsAgreement.title)}
          </h3>
          <p class="text-sm text-gray-600 mb-4">${pickLang(cmsAgreement.description)}</p>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">${agreementItemsHtml}</div>
        </div>` : ''}
      </div>
    </div>
  `;
}

// ─── Tab 3: LbD ─────────────────────────────────────────────────────────────

function tabLbd(govT) {
  const s = govT?.tabContent_lbd || {};

  const phaseColors = { '1': ['bg-eu-orange', 'border-eu-orange'], '2': ['bg-eu-blue', 'border-eu-blue'], '3': ['bg-eu-teal', 'border-eu-teal'] };

  const phasesHtml = (s.phases || []).map((phase, i) => {
    const [color, border] = phaseColors[phase.step] || ['bg-gray-400', 'border-gray-400'];
    const outputsHtml = (phase.outputs || []).map(o => `
      <span class="flex items-center gap-1 text-xs bg-eu-bg border border-eu-border px-2 py-1 rounded-full text-gray-700 font-semibold">
        <i data-lucide="check-circle" class="w-3 h-3 text-eu-teal shrink-0"></i>${o}
      </span>`).join('');
    return `
      <div class="relative">
        <div class="flex gap-5 p-5 rounded-xl border-2 ${border} bg-white mb-2">
          <div class="w-10 h-10 rounded-full ${color} text-white flex items-center justify-center font-extrabold text-lg shrink-0">${phase.step}</div>
          <div class="flex-1">
            <div class="flex flex-wrap items-center gap-2 mb-1">
              <span class="text-xs font-extrabold uppercase px-2 py-0.5 rounded ${color} text-white">${phase.track || ''}</span>
              <span class="text-xs text-gray-400">·</span>
              <span class="text-xs font-semibold text-gray-500">${phase.platform || ''}</span>
            </div>
            <h4 class="font-bold text-eu-text mb-0.5">${phase.title || ''}</h4>
            <p class="text-xs text-gray-500 font-semibold mb-2">👤 ${phase.actor || ''}</p>
            <p class="text-sm text-gray-600 mb-3">${phase.desc || ''}</p>
            <div class="flex flex-wrap gap-2">${outputsHtml}</div>
          </div>
        </div>
        ${i < 2 ? '<div class="flex justify-center my-1"><i data-lucide="arrow-down" class="w-5 h-5 text-gray-300"></i></div>' : ''}
      </div>
    `;
  }).join('');

  const flowStepsHtml = (s.operatingFlow?.steps || []).map((step, i) => `
    <div class="relative rounded-xl border border-eu-border bg-eu-bg p-4">
      <div class="w-8 h-8 rounded-lg bg-eu-blue text-white flex items-center justify-center font-extrabold text-sm mb-3">${i + 1}</div>
      <p class="text-sm font-bold text-eu-text mb-1">${step.title || ''}</p>
      <p class="text-xs text-gray-600 leading-relaxed">${step.desc || ''}</p>
    </div>
  `).join('');

  const platformsHtml = (s.platforms || []).map((p, i) => `
    <div class="relative">
      <div class="rounded-xl border-2 ${p.border || 'border-eu-border'} p-5 h-full">
        <div class="inline-block text-xs font-extrabold uppercase px-2 py-0.5 rounded mb-2 ${p.color || 'bg-eu-blue'} text-white">${p.track || ''}</div>
        <p class="font-bold text-eu-text">${p.name || ''}</p>
        <p class="text-xs text-gray-500 mb-1">${p.tech || ''}</p>
        <p class="text-xs font-bold uppercase ${p.text || 'text-eu-blue'} mb-2">${p.role || ''}</p>
        <p class="text-xs text-gray-600 mb-3">${p.desc || ''}</p>
        <p class="text-xs text-gray-500 font-semibold bg-eu-bg rounded px-2 py-1">👤 ${p.owner || ''}</p>
      </div>
      ${i < 2 ? '<div class="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 bg-white border border-eu-border rounded-full items-center justify-center"><i data-lucide="arrow-right" class="w-3 h-3 text-gray-400"></i></div>' : ''}
    </div>
  `).join('');

  // Hardcoded scalability (not in translations)
  const scalePhases = [
    { fase: 'Fase Piloto', rango: '< 50 organizaciones', periodo: '2025–2026', color: 'bg-eu-blue', items: ['Track B gestionado manualmente por CEICE', 'Comité Científico revisa todos los retos', 'ConsensUE con grupos reducidos', 'Todos los retos pasan por revisión completa'] },
    { fase: 'Fase de Crecimiento', rango: '50–250 organizaciones', periodo: '2026–2027', color: 'bg-eu-teal', items: ['Validación por grupos de trabajo sectoriales (SN)', 'Automatización del enrutamiento de propuestas', 'RBAC en las 3 plataformas', 'Sistema de reputación para revisores del Track B'] },
    { fase: 'Fase Estable', rango: '500+ organizaciones', periodo: '2027+', color: 'bg-purple-600', items: ['Delegación de validación Track B a orgs. acreditadas', 'Workflows asíncronos sin reuniones obligatorias', 'IA asistente para pre-validación de retos', 'Sostenibilidad financiera con cuotas + Digital Europe'] },
  ];
  const scaleHtml = scalePhases.map(f => `
    <div class="bg-eu-bg rounded-xl border border-eu-border p-5">
      <div class="inline-block px-3 py-0.5 rounded-full text-white text-xs font-extrabold uppercase mb-2 ${f.color}">${f.fase}</div>
      <p class="font-bold text-eu-text text-sm mb-0.5">${f.rango}</p>
      <p class="text-xs text-gray-500 mb-3">${f.periodo}</p>
      <ul class="space-y-1.5">
        ${f.items.map(item => `<li class="flex items-start gap-2 text-xs text-gray-600"><span class="w-1.5 h-1.5 rounded-full mt-1 shrink-0 ${f.color}"></span>${item}</li>`).join('')}
      </ul>
    </div>
  `).join('');

  return `
    <div class="space-y-8">
      <div>
        <h2 class="text-xl font-bold text-eu-text mb-2">${s.title || ''}</h2>
        <p class="text-sm text-gray-600 mb-2 max-w-3xl">${s.intro_desc || ''}</p>
        <p class="text-sm text-gray-500 mb-6 max-w-3xl">${s.diginetDesc || ''}</p>

        <!-- Fases LbD -->
        <div class="bg-white rounded-xl border border-eu-border shadow-sm p-7 mb-8">
          <h3 class="font-bold text-eu-text mb-6">${s.cycleTitle || ''}</h3>
          <div class="space-y-0">${phasesHtml}</div>
        </div>

        <!-- Flujo operativo -->
        <div class="bg-white rounded-xl border border-eu-border shadow-sm p-7 mb-6">
          <h3 class="font-bold text-eu-text mb-2 flex items-center gap-2">
            <i data-lucide="arrow-right" class="w-5 h-5 text-eu-teal"></i>${s.operatingFlow?.title || ''}
          </h3>
          <p class="text-sm text-gray-600 mb-5">${s.operatingFlow?.desc || ''}</p>
          <div class="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-3">${flowStepsHtml}</div>
        </div>

        <!-- Plataformas -->
        <div class="bg-white rounded-xl border border-eu-border shadow-sm p-7 mb-6">
          <h3 class="font-bold text-eu-text mb-2">${s.platformsTitle || ''}</h3>
          <p class="text-sm text-gray-600 mb-5">${s.platformsDesc || ''}</p>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">${platformsHtml}</div>
        </div>

        <!-- Escalabilidad -->
        <div class="bg-white rounded-xl border border-eu-border shadow-sm p-7">
          <h3 class="font-bold text-eu-text mb-2 flex items-center gap-2">
            <i data-lucide="zap" class="w-5 h-5 text-eu-orange"></i>Escalabilidad del Modelo LbD
          </h3>
          <p class="text-sm text-gray-600 mb-5">El Dual Track + LbD está diseñado para crecer sin reestructurarse. Cada fase añade capacidad manteniendo la misma lógica de intercambio de valor.</p>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">${scaleHtml}</div>
        </div>
      </div>
    </div>
  `;
}

// ─── Tab 4: Documentos ───────────────────────────────────────────────────────

function tabDocumentos(govT) {
  const s   = govT?.tabContent_documentos || {};
  const docs = govT?.transparencyDocs || [];

  const docsHtml = docs.map(doc => {
    const isPublic = doc.access === 'Public' || doc.access === 'Público' || doc.access === 'Públic';
    return `
      <a href="#" class="flex items-center p-4 rounded-xl border border-eu-border bg-white hover:border-eu-blue hover:bg-eu-bg transition-colors group">
        <span class="text-2xl mr-4 shrink-0">${doc.icon || '📄'}</span>
        <div class="flex-1 min-w-0">
          <p class="font-semibold text-sm text-eu-text group-hover:text-eu-blue truncate">${doc.title || ''}</p>
          <div class="flex items-center gap-2 mt-0.5 flex-wrap">
            <span class="text-xs text-gray-500">${doc.date || ''}</span>
            <span class="text-xs bg-eu-bg border border-eu-border px-1.5 py-0.5 rounded text-gray-600 font-semibold">${doc.type || ''}</span>
            <span class="text-xs font-bold px-1.5 py-0.5 rounded ${isPublic ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}">
              ${isPublic ? (s.accessPublic || 'Público') : (s.accessPartners || 'Partners')}
            </span>
          </div>
        </div>
        <i data-lucide="file-signature" class="w-4 h-4 text-gray-300 group-hover:text-eu-blue shrink-0 ml-3"></i>
      </a>
    `;
  }).join('');

  return `
    <div>
      <h2 class="text-xl font-bold text-eu-text mb-2">${s.title || ''}</h2>
      <p class="text-sm text-gray-600 mb-7 max-w-2xl">${s.description || ''}</p>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">${docsHtml}</div>
    </div>
  `;
}

// ─── Tab 5: Participar ───────────────────────────────────────────────────────

function tabParticipar(govT) {
  const s = govT?.tabContent_participar || {};

  const stakeholderBenefitsHtml = (s.stakeholderBenefits || []).map(a => `
    <li class="flex items-start gap-2 text-sm text-gray-700">
      <i data-lucide="check-circle" class="w-3.5 h-3.5 text-eu-orange mt-0.5 shrink-0"></i>${a}
    </li>`).join('');

  const consensueGroups = [
    { who: s.consensueGroupStakeholders, actions: s.consensueActionsStakeholders },
    { who: s.consensueGroupConsortium,   actions: s.consensueActionsConsortium   },
  ];
  const consensueGroupsHtml = consensueGroups.map(g => `
    <div class="bg-eu-blue/10 rounded-lg p-4">
      <p class="text-xs font-extrabold uppercase text-eu-teal mb-2">${g.who || ''}</p>
      <ul class="space-y-1">
        ${(g.actions || []).map(a => `
          <li class="flex items-center gap-2 text-sm text-gray-700">
            <span class="w-1.5 h-1.5 rounded-full bg-eu-teal shrink-0"></span>${a}
          </li>`).join('')}
      </ul>
    </div>
  `).join('');

  const meetingsHtml = (s.meetings || []).map(e => {
    const parts = (e.date || '').split(' ');
    return `
      <div class="flex items-start gap-3 p-4 bg-eu-bg rounded-lg border border-eu-border">
        <div class="bg-eu-blue text-white rounded-lg px-2 py-1 text-center shrink-0 min-w-12">
          <span class="block text-xs font-extrabold leading-none">${parts[0] || ''}</span>
          <span class="block text-xs font-semibold uppercase">${parts[1] || ''}</span>
        </div>
        <div>
          <p class="font-bold text-sm text-eu-text">${e.title || ''}</p>
          <p class="text-xs text-gray-500">${e.location || ''}</p>
        </div>
      </div>
    `;
  }).join('');

  return `
    <div class="space-y-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Track B – Stakeholder -->
        <div class="bg-white rounded-xl border border-eu-border shadow-sm p-7">
          <div class="w-12 h-12 bg-eu-orange/10 rounded-xl flex items-center justify-center mb-4">
            <i data-lucide="building-2" class="w-6 h-6 text-eu-orange"></i>
          </div>
          <h2 class="text-xl font-bold text-eu-text mb-1">${s.stakeholderTitle || ''}</h2>
          <p class="text-xs font-bold uppercase text-eu-orange mb-3">${s.stakeholderSubtitle || ''}</p>
          <p class="text-sm text-gray-600 mb-4">${s.stakeholderDesc || ''}</p>
          <div class="bg-eu-yellow/60 rounded-lg p-4 mb-5">
            <p class="text-xs font-bold text-eu-orange uppercase mb-2">${s.stakeholderBenefitsLabel || ''}</p>
            <ul class="space-y-1.5">${stakeholderBenefitsHtml}</ul>
          </div>
          <p class="text-xs text-gray-500 mb-4 flex items-start gap-2">
            <i data-lucide="alert-circle" class="w-3.5 h-3.5 shrink-0 mt-0.5 text-gray-400"></i>
            ${s.stakeholderWarning || ''}
          </p>
          <a href="#" class="inline-flex items-center gap-2 bg-eu-orange text-white px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-eu-purple transition-colors">
            ${s.stakeholderButton || ''} <i data-lucide="external-link" class="w-4 h-4"></i>
          </a>
        </div>

        <!-- ConsensUE -->
        <div class="bg-white rounded-xl border border-eu-border shadow-sm p-7">
          <div class="w-12 h-12 bg-eu-teal/10 rounded-xl flex items-center justify-center mb-4">
            <i data-lucide="users" class="w-6 h-6 text-eu-teal"></i>
          </div>
          <h2 class="text-xl font-bold text-eu-text mb-1">${s.consensueTitle || ''}</h2>
          <p class="text-xs font-bold uppercase text-eu-teal mb-3">${s.consensueSubtitle || ''}</p>
          <p class="text-sm text-gray-600 mb-4">${s.consensueDesc || ''}</p>
          <div class="space-y-3 mb-5">${consensueGroupsHtml}</div>
          <a href="#" class="inline-flex items-center gap-2 bg-eu-teal text-white px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-eu-purple transition-colors">
            ${s.consensueButton || ''} <i data-lucide="external-link" class="w-4 h-4"></i>
          </a>
        </div>
      </div>

      <!-- Reuniones -->
      <div class="bg-white rounded-xl border border-eu-border shadow-sm p-7">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 bg-eu-blue/10 rounded-xl flex items-center justify-center">
            <i data-lucide="landmark" class="w-5 h-5 text-eu-blue"></i>
          </div>
          <div>
            <h2 class="text-xl font-bold text-eu-text">${s.meetingsTitle || ''}</h2>
            <p class="text-sm text-gray-500">${s.meetingsSubtitle || ''}</p>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">${meetingsHtml}</div>
        <a href="#" class="inline-flex items-center gap-2 bg-eu-blue text-white px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-blue-800 transition-colors">
          ${s.meetingsButton || ''} <i data-lucide="external-link" class="w-4 h-4"></i>
        </a>
      </div>
    </div>
  `;
}

// ─── render / mount ──────────────────────────────────────────────────────────

export function render() {
  const govT      = t('governance') || {};
  const activeTab = getState('governanceTab') || 'estructura';

  const heroBlock  = GOVERNANCE_CONFIG?.heroBlock || {};
  const heroVisible = heroBlock.visible !== false;
  const heroStats  = Array.isArray(heroBlock.stats) ? heroBlock.stats : [];
  const ctaButton  = heroBlock.ctaButton || {};

  const statsHtml = heroStats.map(s => `
    <div class="bg-white/10 rounded-xl px-5 py-3 text-center">
      <p class="text-xl font-extrabold text-eu-yellow leading-tight">${s.value || ''}</p>
      <p class="text-xs text-white/70 font-semibold uppercase mt-0.5">${pickLang(s.label)}</p>
    </div>
  `).join('');

  const contentMap = {
    'estructura':  tabEstructura(govT),
    'dual-track':  tabDualTrack(govT),
    'lbd':         tabLbd(govT),
    'documentos':  tabDocumentos(govT),
    'participar':  tabParticipar(govT),
  };

  return `
    <div>
      ${heroVisible ? `
      <!-- Header -->
      <div class="bg-eu-blue text-white px-6 py-12">
        <div class="max-w-7xl mx-auto">
          <div class="flex flex-wrap items-start justify-between gap-6">
            <div>
              <h1 class="text-3xl font-extrabold mb-3">${pickLang(heroBlock.title, govT?.title || '')}</h1>
              <p class="text-white/80 max-w-3xl text-base">${pickLang(heroBlock.description, govT?.description || '')}</p>
            </div>
            ${ctaButton.visible !== false && ctaButton.url ? `
            <a href="${ctaButton.url}" target="_blank" rel="noopener noreferrer"
               class="flex min-h-11 items-center gap-2 rounded-lg bg-eu-orange px-5 py-2.5 text-sm font-bold text-white hover:bg-eu-purple transition-colors">
              <i data-lucide="file-text" class="w-4 h-4"></i>${pickLang(ctaButton.label)}<i data-lucide="external-link" class="w-3 h-3"></i>
            </a>` : ''}
          </div>
          ${heroStats.length > 0 ? `
          <div class="flex flex-wrap gap-4 mt-6">${statsHtml}</div>` : ''}
        </div>
      </div>` : ''}

      <!-- Tabs + content -->
      <div class="max-w-7xl mx-auto px-6 py-8">
        <div class="flex flex-wrap gap-1 border-b border-eu-border mb-8">
          ${tabBar(activeTab, govT)}
        </div>
        ${contentMap[activeTab] || ''}
      </div>
    </div>
  `;
}

export function mount() {
  document.querySelectorAll('[data-gov-tab]').forEach(btn => {
    btn.addEventListener('click', () => {
      setState('governanceTab', btn.dataset.govTab);
      const main = document.getElementById('main-root');
      main.innerHTML = render();
      mount();
      if (window.lucide) window.lucide.createIcons();
    });
  });
}
