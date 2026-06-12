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
  const icons = {
    'estructura':  'network',
    'dual-track':  'git-commit',
    'lbd':         'cpu',
    'documentos':  'file-text',
    'participar':  'users',
  };
  return TABS.map(id => `
    <button data-gov-tab="${id}" class="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold cursor-pointer transition-all duration-300 ${
      activeTab === id
        ? 'bg-eu-blue text-white shadow-sm'
        : 'bg-eu-yellow/70 text-eu-purple border border-eu-yellow hover:bg-eu-yellow hover:border-eu-purple/30'
    }"><i data-lucide="${icons[id]}" class="w-4 h-4"></i>${labels[id]}</button>
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
    <div class="rd-card rd-card-grad-violet rd-card-edge p-6 flex flex-col justify-between h-full group">
      <div>
        <div class="w-12 h-12 rounded-full flex items-center justify-center mb-4 text-eu-blue shadow-inner shrink-0 rd-icon-circle-gov transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" style="background:#ffffff">
          <i data-lucide="${node.icon || 'globe'}" class="w-5 h-5"></i>
        </div>
        <p class="text-xs font-extrabold uppercase tracking-widest text-eu-blue mb-1.5">${pickLang(node.label, node.label || '')}</p>
        <p class="font-extrabold text-2xl text-eu-purple leading-tight">${pickLang(node.city, node.city || '')}</p>
        <p class="text-base text-eu-text/80 mt-2 font-bold">${pickLang(node.org, node.org || '')}</p>
      </div>
      <p class="text-lg text-gray-700 mt-5 leading-relaxed">${pickLang(node.role, node.role || '')}</p>
    </div>
  `).join('');

  const hasCmsActorCards = Object.prototype.hasOwnProperty.call(actorsBlock, 'cards');
  const actorCards = hasCmsActorCards && Array.isArray(actorsBlock.cards)
    ? actorsBlock.cards
    : [
        { id: 'ceice', visible: true, icon: 'building-2', tone: 'orange', title: s.ceiceTitle, subtitle: s.ceiceSubtitle, roles: s.ceiceRoles || [] },
        { id: 'uveg', visible: true, icon: 'graduation-cap', tone: 'blue', title: s.uvegTitle, subtitle: s.uvegSubtitle, roles: s.uvegRoles || [] },
      ];

  const actorCardsHtml = actorCards.map(card => {
    const isOrange = card.tone === 'orange';
    // CEICE = Track B (orange), UVEG = Track A (blue) — mismo código de color que Dual Track
    const headerBg  = isOrange ? 'bg-eu-purple' : 'bg-eu-blue';
    const bodyBg    = isOrange ? 'rgb(255 244 225/.6)' : 'rgb(86 32 246/.07)';
    const alertText = isOrange ? 'text-eu-purple' : 'text-eu-blue';

    const rolesHtml = (Array.isArray(card.roles) ? card.roles : []).map(item => `
      <div class="flex items-start gap-4">
        <div class="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
          <i data-lucide="${item.icon || 'globe'}" class="w-4 h-4 ${alertText}"></i>
        </div>
        <div>
          <span class="font-extrabold text-eu-text text-lg">${pickLang(item.label, item.label || '')}: </span>
          <span class="text-lg text-gray-700 leading-relaxed">${pickLang(item.desc, item.desc || '')}</span>
        </div>
      </div>
    `).join('');

    return `
      <div class="rd-card border-none overflow-hidden shadow-lg h-full flex flex-col rd-card-hover cursor-default" style="background:${bodyBg}">
        <div class="${headerBg} text-white px-6 py-6 shrink-0">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
              <i data-lucide="${card.icon || 'globe'}" class="w-6 h-6 text-white"></i>
            </div>
            <div>
              <h3 class="font-extrabold text-2xl leading-tight text-white">${pickLang(card.title, card.title || '')}</h3>
              <p class="text-white/80 text-sm mt-0.5">${pickLang(card.subtitle, card.subtitle || '')}</p>
            </div>
          </div>
        </div>
        <div class="rd-pad space-y-5">${rolesHtml}</div>
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
    return `<p class="text-sm"><span class="font-extrabold text-gray-700">${pickLang(label)}:</span> <span class="text-gray-650 font-medium">${text}</span></p>`;
  }

  const bodiesHtml = formalBodies.map(body => {
    return `
      <div class="rd-card-mp rd-card-mp-hover flex flex-col overflow-hidden h-full group">
        <div class="rd-card-mp-ceja flex items-start justify-between gap-3">
          <h3 class="rd-card-mp-title">${pickLang(body.name, body.name || '')}</h3>
          <span class="text-2xl font-extrabold text-white/40 select-none shrink-0 leading-none">${body.abbr || ''}</span>
        </div>
        <div class="p-7 pt-5 flex flex-col justify-between flex-1">
          <div>
            <p class="text-sm font-extrabold uppercase tracking-wider mb-3 text-eu-blue">${pickLang(body.type, body.type || '')}</p>
            <p class="text-lg text-gray-700 mb-5 leading-relaxed">${pickLang(body.desc, body.desc || '')}</p>
          </div>
          <div class="space-y-2.5 pt-4 border-t border-eu-blue/10">
            ${metaRow(formalLabels.members || { es: 'Miembros', en: 'Members', va: 'Membres' }, body.members)}
            ${metaRow(formalLabels.frequency || { es: 'Frecuencia', en: 'Frequency', va: 'Freqüència' }, body.frequency || body.freq)}
            ${metaRow(formalLabels.quorum || { es: 'Quórum', en: 'Quorum', va: 'Quòrum' }, body.quorum)}
          </div>
        </div>
      </div>
    `;
  }).join('');

  const standardCardsHtml = (Array.isArray(standardsBlock.cards) ? standardsBlock.cards : [
    { icon: 'shield-check', title: s.iso21001Title, desc: s.iso21001Desc },
    { icon: 'globe',        title: s.enredTitle,    desc: s.enredDesc    },
  ]).map((card, idx) => {
    const gradClass = idx % 2 === 0 ? 'rd-card-grad-blue' : 'rd-card-grad-beige';
    const iconColor = idx % 2 === 0 ? 'text-eu-blue' : 'text-eu-purple';
    const accentClass = idx % 2 === 0 ? 'rd-card-accent' : 'rd-card-accent rd-accent-purple';
    return `
    <div class="rd-card ${gradClass} ${accentClass} rd-card-edge rd-pad flex gap-6 items-start cursor-default group">
      <div class="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" style="background:#ffffff">
        <i data-lucide="${card.icon || 'globe'}" class="w-6 h-6 ${iconColor}"></i>
      </div>
      <div>
        <h3 class="font-extrabold text-eu-purple mb-3 text-2xl leading-snug">${pickLang(card.title, card.title || '')}</h3>
        <p class="text-lg text-gray-700 leading-relaxed">${pickLang(card.desc, card.desc || '')}</p>
      </div>
    </div>
  `;}).join('');

  return `
    <div class="space-y-12">
      ${hubBlock.visible !== false ? `
      <!-- Hub -->
      <div class="rd-card rd-card-accent rd-pad rd-card-edge group rd-card-grad-beige">
        <h2 class="font-extrabold text-eu-purple mb-3 flex items-center gap-4">
          <div class="w-14 h-14 rounded-full flex items-center justify-center text-eu-blue shrink-0 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6" style="background:#ffffff">
            <i data-lucide="globe" class="w-7 h-7"></i>
          </div>
          ${pickLang(hubBlock.title, s.hubTitle || '')}
        </h2>
        <p class="text-lg text-gray-600 mb-8 leading-relaxed">${pickLang(hubBlock.description, s.hubDesc || '')}</p>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">${nodesHtml}</div>
      </div>` : ''}

      ${actorsBlock.visible !== false ? `
      <!-- Actores principales -->
      <div>
        <h2 class="font-extrabold text-eu-purple mb-3">${pickLang(actorsBlock.title, s.actorsTitle || '')}</h2>
        <p class="text-lg text-gray-600 mb-8 leading-relaxed">${pickLang(actorsBlock.description, s.actorsDesc || '')}</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          ${actorCardsHtml}
        </div>
      </div>` : ''}

      ${formalBodiesBlock.visible !== false ? `
      <!-- Órganos formales -->
      <div>
        <h2 class="font-extrabold text-eu-purple mb-3">${pickLang(formalBodiesBlock.title, s.bodiesTitle || '')}</h2>
        <p class="text-lg text-gray-600 mb-8 leading-relaxed">${pickLang(formalBodiesBlock.description, s.bodiesDesc || '')}</p>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">${bodiesHtml}</div>
      </div>` : ''}

      ${standardsBlock.visible !== false ? `
      <!-- ISO + ENRED -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
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

  function trackBlock(cmsTrack, colorClass, accentClass, alertIcon, alertText, bodyBg, keyLimitBg) {
    const bodiesHtml = (cmsTrack.activeBodies || []).map(b =>
      `<span class="text-sm ${accentClass} font-bold px-3.5 py-1.5 rounded-full">${pickLang(b.label)}</span>`
    ).join('');
    return `
      <div class="rd-card border-none overflow-hidden shadow-lg h-full flex flex-col rd-card-hover cursor-default" style="background:${bodyBg}">
        <div class="${colorClass} text-white px-6 py-6 shrink-0">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center font-extrabold text-xl shrink-0">${cmsTrack.letter || ''}</div>
            <div>
              <h3 class="font-extrabold text-2xl leading-tight">${pickLang(cmsTrack.title)}</h3>
              <p class="text-white/80 text-sm mt-0.5">${pickLang(cmsTrack.subtitle)}</p>
            </div>
          </div>
        </div>
        <div class="p-8 space-y-6 flex-1 flex flex-col justify-between">
          <div class="space-y-6">
            <div>
              <h4 class="text-xl font-extrabold text-eu-purple mb-2">${pickLang(fl.scope)}</h4>
              <p class="text-lg text-gray-700 leading-relaxed">${pickLang(cmsTrack.scope?.text)}</p>
            </div>
            <div>
              <h4 class="text-xl font-extrabold text-eu-purple mb-2">${pickLang(fl.normativeFramework)}</h4>
              <p class="text-lg text-gray-700 leading-relaxed">${pickLang(cmsTrack.normativeFramework?.text)}</p>
            </div>
          </div>
          <div class="space-y-6 mt-6 pt-6 border-t border-eu-blue/10">
            <div>
              <h4 class="text-xl font-extrabold text-eu-purple mb-3">${pickLang(fl.keyLimit)}</h4>
              <div class="flex items-start gap-3 rounded-2xl p-5 transition-all duration-300 hover:shadow-md hover:scale-[1.015] cursor-default" style="background:${keyLimitBg}">
                <i data-lucide="${alertIcon}" class="w-5 h-5 ${alertText} shrink-0 mt-0.5"></i>
                <p class="text-base ${alertText} font-semibold leading-relaxed">${pickLang(cmsTrack.keyLimit?.text)}</p>
              </div>
            </div>
            <div>
              <h4 class="text-xl font-extrabold text-eu-purple mb-3">${pickLang(fl.activeBodies)}</h4>
              <div class="flex flex-wrap gap-2">${bodiesHtml}</div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  const cmsDataArch = dualTrackBlock.dataArch || {};
  const zoneStyles = {
    public:  { dot: 'bg-eu-blue',   zone: 'rd-card rd-card-grad-violet rd-card-edge rounded-2xl p-6', h4: 'text-eu-blue'   },
    private: { dot: 'bg-eu-purple', zone: 'rd-card rd-card-grad-violet rd-card-edge rounded-2xl p-6', h4: 'text-eu-purple' },
  };
  const dataArchZonesHtml = (cmsDataArch.zones || []).map(zone => {
    const st = zoneStyles[zone.id] || zoneStyles.public;
    const itemsHtml = (zone.items || []).map(item =>
      `<li class="flex items-center gap-2.5 text-base text-gray-700"><span class="w-1.5 h-1.5 rounded-full ${st.dot} shrink-0"></span>${pickLang(item)}</li>`
    ).join('');
    return `
      <div class="${st.zone}">
        <h4 class="text-xl font-extrabold ${st.h4} mb-2">${pickLang(zone.title)}</h4>
        <p class="text-lg text-gray-700 mb-4 leading-relaxed">${pickLang(zone.description)}</p>
        <ul class="space-y-2">${itemsHtml}</ul>
      </div>`;
  }).join('');

  const cmsRB = dualTrackBlock.responsibilityBoundaries || {};
  const responsibilityHtml = (cmsRB.items || []).map(item => `
    <div class="rd-card rd-card-grad-violet rd-card-edge p-6 h-full flex flex-col justify-between">
      <div>
        <h4 class="text-xl font-extrabold text-eu-purple mb-2">${pickLang(item.owner)}</h4>
        <p class="text-lg text-gray-700 leading-relaxed">${pickLang(item.scope)}</p>
      </div>
    </div>
  `).join('');

  const cmsAgreement = dualTrackBlock.agreement || {};
  const agreementItemsHtml = (cmsAgreement.items || []).map(c => `
    <div class="rd-card rd-card-grad-violet rd-card-edge p-6 h-full flex flex-col justify-between">
      <div>
        <h4 class="text-xl font-extrabold text-eu-purple mb-2">${pickLang(c.title)}</h4>
        <p class="text-lg text-gray-700 leading-relaxed">${pickLang(c.desc)}</p>
      </div>
    </div>
  `).join('');

  return `
    <div class="space-y-12">
      ${dualTrackVisible ? `
      <div>
        <h2 class="font-extrabold text-eu-purple mb-3">${pickLang(dualTrackBlock.title)}</h2>
        <p class="text-lg text-gray-600 mb-8 leading-relaxed">${pickLang(dualTrackBlock.description)}</p>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          ${trackAVisible ? trackBlock(tracksById['track-a'], 'bg-eu-blue',   'bg-eu-blue/10 text-eu-blue',   'alert-circle',  'text-eu-blue',   'linear-gradient(to bottom,#ffffff 0%,#EAE6FF 100%)',   'rgb(86 32 246/.12)'  ) : ''}
          ${trackBVisible ? trackBlock(tracksById['track-b'], 'bg-eu-purple', 'bg-eu-purple/10 text-eu-purple','check-circle',  'text-eu-purple', 'linear-gradient(to bottom,#ffffff 0%,#FFF4E1 100%)',  'rgb(73 24 173/.12)' ) : ''}
        </div>
      </div>` : ''}
      <div>

        <!-- Arquitectura de Datos -->
        ${cmsDataArch.visible !== false ? `
        <div class="rd-card rd-card-accent rd-card-edge rd-pad mb-8 group rd-card-grad-beige">
          <h3 class="text-2xl font-extrabold text-eu-purple mb-4 flex items-center gap-3">
            <div class="w-12 h-12 rounded-full flex items-center justify-center text-eu-blue shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" style="background:rgba(255,255,255,0.85)">
              <i data-lucide="shield-check" class="w-6 h-6"></i>
            </div>
            ${pickLang(cmsDataArch.title)}
          </h3>
          <p class="text-lg text-gray-600 mb-6 leading-relaxed">${pickLang(cmsDataArch.description)}</p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">${dataArchZonesHtml}</div>
        </div>` : ''}

        <!-- Datos y límites de responsabilidad -->
        ${cmsRB.visible !== false ? `
        <div class="rd-card rd-card-edge rd-pad mb-8 group rd-card-grad-beige">
          <h3 class="text-2xl font-extrabold text-eu-purple mb-2 flex items-center gap-3">
            <div class="w-12 h-12 rounded-full flex items-center justify-center text-eu-purple shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" style="background:rgba(255,255,255,0.85)">
              <i data-lucide="shield" class="w-6 h-6"></i>
            </div>
            ${pickLang(cmsRB.title)}
          </h3>
          <p class="text-lg text-gray-600 mb-6 leading-relaxed">${pickLang(cmsRB.description)}</p>
          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">${responsibilityHtml}</div>
        </div>` : ''}

        <!-- Acuerdo de Colaboración -->
        ${cmsAgreement.visible !== false ? `
        <div class="rd-card rd-card-edge rd-pad group rd-card-grad-beige">
          <h3 class="text-2xl font-extrabold text-eu-purple mb-3 flex items-center gap-3">
            <div class="w-12 h-12 rounded-full flex items-center justify-center text-eu-purple shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" style="background:rgba(255,255,255,0.85)">
              <i data-lucide="file-signature" class="w-6 h-6"></i>
            </div>
            ${pickLang(cmsAgreement.title)}
          </h3>
          <p class="text-lg text-gray-600 mb-6 leading-relaxed">${pickLang(cmsAgreement.description)}</p>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">${agreementItemsHtml}</div>
        </div>` : ''}
      </div>
    </div>
  `;
}

// ─── Tab 3: LbD ─────────────────────────────────────────────────────────────

function tabLbd(govT) {
  const s = govT?.tabContent_lbd || {};
  const lbdBlock = GOVERNANCE_CONFIG?.lbdBlock || {};
  const cycleBlock = lbdBlock.cycle || {};
  const cyclePhases = Array.isArray(cycleBlock.phases) ? cycleBlock.phases : null;
  const operatingFlowBlock = lbdBlock.operatingFlow || {};
  const operatingFlowSteps = Array.isArray(operatingFlowBlock.steps) ? operatingFlowBlock.steps : null;
  const platformsBlock = lbdBlock.platformsBlock || {};
  const platformCards = Array.isArray(platformsBlock.cards) ? platformsBlock.cards : null;
  const scalabilityBlock = lbdBlock.scalabilityBlock || {};
  const scalabilityPhases = Array.isArray(scalabilityBlock.phases) ? scalabilityBlock.phases : null;

  const phaseColors = [
    ['bg-eu-blue', 'border-eu-blue'],
    ['bg-eu-purple', 'border-eu-purple'],
    ['bg-eu-blue', 'border-eu-blue'],
  ];

  const phasesHtml = (cyclePhases || s.phases || []).map((phase, i, arr) => {
    const [color, border] = phaseColors[i % phaseColors.length];
    const outputsHtml = (phase.outputs || []).map(o => `
      <span class="flex items-center gap-1.5 text-sm bg-eu-blue/5 border border-eu-blue/10 px-3.5 py-1.5 rounded-full text-gray-750 font-bold">
        <i data-lucide="check-circle" class="w-4 h-4 text-eu-blue shrink-0"></i>${pickLang(o.label, o)}
      </span>`).join('');
    return `
      <div class="relative">
        <div class="flex flex-col md:flex-row gap-6 p-8 rd-card rd-card-grad-violet rd-card-edge mb-4 border-l-4 ${border} group">
          <div class="w-12 h-12 rounded-full ${color} text-white flex items-center justify-center font-extrabold text-xl shrink-0 shadow-md group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">${phase.step}</div>
          <div class="flex-1 min-w-0">
            <div class="flex flex-wrap items-center gap-3 mb-2">
              <span class="text-xs font-extrabold uppercase px-2.5 py-1 rounded-full ${color} text-white">${pickLang(phase.track, phase.track || '')}</span>
              <span class="text-xs text-gray-500">·</span>
              <span class="text-sm font-bold text-eu-purple">${pickLang(phase.platform, phase.platform || '')}</span>
            </div>
            <h4 class="text-2xl font-extrabold text-eu-text mb-2">${pickLang(phase.title, phase.title || '')}</h4>
            <p class="text-sm text-gray-600 font-bold mb-3 flex items-center gap-1.5"><i data-lucide="user" class="w-3.5 h-3.5"></i> ${pickLang(phase.actor, phase.actor || '')}</p>
            <p class="text-lg text-gray-700 mb-4 leading-relaxed">${pickLang(phase.description, phase.desc || '')}</p>
            <div class="flex flex-wrap gap-2">${outputsHtml}</div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  const flowStepsHtml = (operatingFlowSteps || s.operatingFlow?.steps || []).map((step, i) => `
    <div class="rd-card rd-card-grad-violet rd-card-edge p-6 flex flex-col h-full group">
      <div class="w-8 h-8 rounded-lg bg-eu-blue text-white flex items-center justify-center font-extrabold text-sm mb-4 shrink-0 shadow-sm rd-icon-circle-gov">${i + 1}</div>
      <p class="text-base font-extrabold text-eu-text mb-2.5 leading-snug">${pickLang(step.title, step.title || '')}</p>
      <p class="text-base text-gray-700 leading-relaxed mt-auto">${pickLang(step.description, step.desc || '')}</p>
    </div>
  `).join('');

  const platformTones = [
    ['bg-eu-blue', 'border-eu-blue', 'text-eu-blue'],
    ['bg-eu-purple', 'border-eu-purple', 'text-eu-purple'],
    ['bg-eu-blue', 'border-eu-blue', 'text-eu-blue'],
  ];

  const platformsHtml = (platformCards || s.platforms || []).map((p, i, arr) => {
    const [color, border, text] = platformTones[i % platformTones.length];
    return `
    <div class="relative h-full">
      <div class="rd-card rd-card-grad-violet rd-card-edge p-6 border-l-4 ${border} h-full flex flex-col group">
        <div class="mb-3">
          <span class="inline-block text-xs font-extrabold uppercase px-2.5 py-1 rounded-full ${color} text-white">${pickLang(p.track, p.track || '')}</span>
        </div>
        <p class="font-extrabold text-2xl text-eu-text leading-snug mb-1">${pickLang(p.name, p.name || '')}</p>
        <p class="text-sm text-gray-500 mb-2 font-bold">${pickLang(p.tech, p.tech || '')}</p>
        <p class="text-sm font-extrabold uppercase ${text} mb-3 tracking-wider">${pickLang(p.role, p.role || '')}</p>
        <p class="text-lg text-gray-700 mb-4 leading-relaxed">${pickLang(p.description, p.desc || '')}</p>
        <p class="text-xs text-gray-600 font-bold bg-eu-blue/5 rounded-full px-3 py-1.5 mt-auto flex items-center gap-1.5 w-fit">
          <i data-lucide="user" class="w-3.5 h-3.5"></i> ${pickLang(p.owner, p.owner || '')}
        </p>
      </div>
    </div>
  `;
  }).join('');

  const scaleTones = [
    'bg-eu-blue',
    'bg-eu-purple',
    'bg-eu-blue',
  ];
  const scaleHtml = (scalabilityPhases || []).map((f, i) => {
    const color = scaleTones[i % scaleTones.length];
    return `
    <div class="rd-card rd-card-grad-violet rd-card-edge p-6 flex flex-col h-full group">
      <div class="mb-3 shrink-0">
        <span class="inline-block px-3 py-1 rounded-full text-white text-xs font-extrabold uppercase ${color}">${pickLang(f.label)}</span>
      </div>
      <p class="font-extrabold text-eu-purple text-lg mb-0.5 leading-snug">${pickLang(f.range)}</p>
      <p class="text-sm text-gray-500 font-bold mb-4">${f.period || ''}</p>
      <ul class="space-y-2.5 mt-2">
        ${(f.items || []).map(item => `
          <li class="flex items-start gap-2.5 text-base text-gray-700 leading-relaxed">
            <span class="w-1.5 h-1.5 rounded-full mt-2 shrink-0 ${color}"></span>
            <span>${pickLang(item.label)}</span>
          </li>`).join('')}
      </ul>
    </div>
  `}).join('');

  return `
    <div class="space-y-12">
      <div>
        ${lbdBlock.visible !== false ? `
        <h2 class="font-extrabold text-eu-purple mb-3">${pickLang(lbdBlock.title, s.title || '')}</h2>
        <p class="text-lg text-gray-600 mb-4 leading-relaxed">${pickLang(lbdBlock.description, s.intro_desc || '')}</p>
        <p class="text-base text-gray-500 mb-8 leading-relaxed">${pickLang(lbdBlock.diginetDescription, s.diginetDesc || '')}</p>
        ` : ''}

        <!-- Fases LbD -->
        ${cycleBlock.visible !== false ? `
        <div class="rd-card overflow-hidden mb-8">
          <div class="px-10 py-6 rd-ceja-grad">
            <h3 class="text-2xl font-extrabold text-white">${pickLang(cycleBlock.title, s.cycleTitle || '')}</h3>
          </div>
          <div class="p-8 space-y-0 rd-card-grad-beige">${phasesHtml}</div>
        </div>` : ''}

        <!-- Flujo operativo -->
        ${operatingFlowBlock.visible !== false ? `
        <div class="rd-card overflow-hidden mb-8">
          <div class="px-10 py-6 rd-ceja-grad">
            <h3 class="text-2xl font-extrabold text-white flex items-center gap-3">
              <div class="w-10 h-10 rounded-full flex items-center justify-center text-white shrink-0" style="background:rgba(255,255,255,0.2)">
                <i data-lucide="arrow-right" class="w-5 h-5"></i>
              </div>
              ${pickLang(operatingFlowBlock.title, s.operatingFlow?.title || '')}
            </h3>
          </div>
          <div class="p-8 rd-card-grad-beige">
            <p class="text-lg text-gray-600 mb-6 leading-relaxed">${pickLang(operatingFlowBlock.description, s.operatingFlow?.desc || '')}</p>
            <div class="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-4">${flowStepsHtml}</div>
          </div>
        </div>` : ''}

        <!-- Plataformas -->
        ${platformsBlock.visible !== false ? `
        <div class="rd-card overflow-hidden mb-8">
          <div class="px-10 py-6 rd-ceja-grad">
            <h3 class="text-2xl font-extrabold text-white">${pickLang(platformsBlock.title, s.platformsTitle || '')}</h3>
          </div>
          <div class="p-8 rd-card-grad-beige">
            <p class="text-lg text-gray-600 mb-6 leading-relaxed">${pickLang(platformsBlock.description, s.platformsDesc || '')}</p>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">${platformsHtml}</div>
          </div>
        </div>` : ''}

        <!-- Escalabilidad -->
        ${scalabilityBlock.visible !== false ? `
        <div class="rd-card overflow-hidden">
          <div class="px-10 py-6 rd-ceja-grad">
            <h3 class="text-2xl font-extrabold text-white flex items-center gap-3">
              <div class="w-10 h-10 rounded-full flex items-center justify-center text-white shrink-0" style="background:rgba(255,255,255,0.2)">
                <i data-lucide="zap" class="w-5 h-5"></i>
              </div>
              ${pickLang(scalabilityBlock.title)}
            </h3>
          </div>
          <div class="p-8 rd-card-grad-beige">
            <p class="text-lg text-gray-600 mb-6 leading-relaxed">${pickLang(scalabilityBlock.description)}</p>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">${scaleHtml}</div>
          </div>
        </div>` : ''}
      </div>
    </div>
  `;
}

// ─── Tab 4: Documentos ───────────────────────────────────────────────────────

function formatDocDate(dateStr) {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    const lang = getLang();
    const months_es = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
    const months_en = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const d = date.getDate();
    const m = date.getMonth();
    const y = date.getFullYear();
    if (lang === 'es') return `${d} ${months_es[m]} ${y}`;
    if (lang === 'en') return `${months_en[m]} ${d}, ${y}`;
    if (lang === 'va') return `${d} ${months_es[m]} ${y}`;
    return dateStr;
  } catch {
    return dateStr;
  }
}

function tabDocumentos(govT) {
  const s   = govT?.tabContent_documentos || {};
  const cms = GOVERNANCE_CONFIG?.documentationBlock || {};
  const hasCmsDocs = Object.prototype.hasOwnProperty.call(cms, 'docs');
  const accessLabels = cms.accessLabels || { public: { es: '', en: '', va: '' }, partners: { es: '', en: '', va: '' } };
  const pageSize = cms.pageSize || 12;
  const pageSizeOptions = cms.pageSizeOptions || [12, 24, 48];
  const showAllOption = cms.showAllOption !== false;
  const allLabel = cms.allLabel || { es: 'Todo', en: 'All', va: 'Tot' };
  const paginationPrev = cms.paginationPrev || { es: 'Anterior', en: 'Previous', va: 'Anterior' };
  const paginationNext = cms.paginationNext || { es: 'Siguiente', en: 'Next', va: 'Següent' };
  const noSearchResultsMessage = cms.noSearchResultsMessage || { es: 'No hay documentos que coincidan con la búsqueda.', en: 'No documents match your search.', va: 'Cap document coincideix amb la teva cerca.' };

  function isPublic(doc) {
    return doc.access === 'public';
  }

  function docMatchesSearch(doc, term) {
    if (!term) return true;
    const title = (pickLang(doc.title) || '').toLowerCase();
    const typesStr = (Array.isArray(doc.types) ? doc.types.map(t => (t.label?.es || '').toLowerCase()).join(' ') : '').toLowerCase();
    const id = (doc.id || '').toLowerCase();
    return title.includes(term) || typesStr.includes(term) || id.includes(term);
  }

  function renderDocs() {
    const allDocs = (hasCmsDocs && Array.isArray(cms.docs) ? cms.docs : []);
    const searchQuery = document.getElementById('gov-doc-search')?.value?.toLowerCase() || '';
    const filtered = allDocs.filter(doc => docMatchesSearch(doc, searchQuery));

    if (filtered.length === 0) {
      return `
        <div class="col-span-full rounded-2xl border border-eu-blue/10 bg-eu-blue/5 p-8 text-center">
          <p class="text-sm text-gray-600">${searchQuery ? pickLang(noSearchResultsMessage, 'No hay documentos que coincidan con la búsqueda.') : pickLang(cms.noDocsMessage, s.noDocsMessage || '')}</p>
        </div>
      `;
    }

    const actualPageSize = getState('govDocPageSize') || pageSize;
    const isShowAll = actualPageSize === 'all';
    const totalPages = isShowAll ? 1 : Math.ceil(filtered.length / actualPageSize);
    const page = getState('govDocPage') || 0;
    const safePage = Math.min(page, totalPages - 1);
    const paged = isShowAll ? filtered : filtered.slice(safePage * actualPageSize, (safePage + 1) * actualPageSize);

    const cardsHtml = paged.map(doc => {
      const pub = isPublic(doc);
      const hasFile = doc.filePublicPath && doc.filePublicPath.trim();
      const hasUrl = doc.url && doc.url.trim();
      const lang = getLang();
      const customLinkText = pickLang(doc.linkText, '');
      // Texto del enlace: el personalizado del CMS o un default según el origen.
      const defaultDownload = lang === 'en' ? 'Download' : lang === 'va' ? 'Descarregar' : 'Descargar';
      const defaultView = lang === 'en' ? 'View' : lang === 'va' ? 'Veure' : 'Ver';
      const linkText = customLinkText || (hasFile ? defaultDownload : defaultView);
      return `
        <div class="rd-card-mp rd-card-mp-hover flex flex-col overflow-hidden h-full group">
          <div class="rd-card-mp-ceja">
            <h3 class="rd-card-mp-title break-words">${pickLang(doc.title) || ''}</h3>
          </div>
          <div class="p-7 pt-5 flex flex-col justify-between flex-1">
          <div>
            <div class="flex items-start gap-4 mb-4">
              <div class="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" style="background:#ffffff; box-shadow: inset 0 2px 6px rgb(73 24 173 / .08)">
                <i data-lucide="file-text" class="w-6 h-6" style="color:#4918AD"></i>
              </div>
              <div class="flex-1 min-w-0">
                <span class="text-sm text-gray-500 font-bold">${formatDocDate(doc.date)}</span>
              </div>
            </div>
            <div class="flex items-center gap-2 flex-wrap">
              ${(Array.isArray(doc.types) ? doc.types : []).map((type, ti) => {
                const chipStyles = [
                  'background:rgb(86 32 246/.10); color:#5620F6; border:1px solid rgb(86 32 246/.18)',
                  'background:rgb(73 24 173/.10); color:#4918AD; border:1px solid rgb(73 24 173/.18)',
                ];
                return `<span class="text-sm px-3 py-1 rounded-full font-bold" style="${chipStyles[ti % chipStyles.length]}">${pickLang(type.label, '')}</span>`;
              }).join('')}
              <span class="text-sm font-extrabold px-3 py-1 rounded-full inline-flex items-center gap-1.5" style="${pub ? 'background:rgb(86 32 246/.10); color:#5620F6; border:1px solid rgb(86 32 246/.18)' : 'background:rgb(73 24 173/.08); color:#4918AD; border:1px solid rgb(73 24 173/.15)'}">
                <i data-lucide="${pub ? 'globe' : 'lock'}" class="w-3.5 h-3.5 shrink-0"></i>
                ${pickLang(pub ? accessLabels.public : accessLabels.partners, pub ? (s.accessPublic || 'Público') : (s.accessPartners || 'Partners')).replace(/[\u{1F300}-\u{1FAFF}]/gu, '').trim()}
              </span>
            </div>
          </div>
          <div class="mt-5 pt-4 border-t border-eu-blue/10">
            ${hasFile ? `
            <a href="${doc.filePublicPath}" download class="inline-flex items-center gap-1.5 text-base font-bold text-eu-blue hover:text-eu-purple transition-colors duration-300">
              <span>${linkText}</span>
              <i data-lucide="download" class="w-4 h-4"></i>
            </a>
            ` : hasUrl ? `
            <a href="${doc.url}" ${doc.external ? 'target="_blank" rel="noopener noreferrer"' : ''} class="inline-flex items-center gap-1.5 text-base font-bold text-eu-blue hover:text-eu-purple transition-colors duration-300">
              <span>${linkText}</span>
              <i data-lucide="external-link" class="w-4 h-4"></i>
            </a>
            ` : `<span class="inline-flex items-center gap-1.5 text-sm font-bold text-gray-400"><i data-lucide="minus-circle" class="w-4 h-4"></i>${lang === 'en' ? 'No link' : lang === 'va' ? 'Sense enllaç' : 'Sin enlace'}</span>`}
          </div>
          </div>
        </div>
      `;
    }).join('');

    const paginationHtml = !isShowAll && totalPages > 1 ? `
      <div class="flex gap-2 justify-center mt-6">
        <button data-gov-doc-page="prev" class="px-4 py-2 text-xs font-bold rounded-full border cursor-pointer transition-all ${safePage === 0 ? 'opacity-50 cursor-not-allowed text-gray-400 border-gray-200' : 'bg-white text-eu-text border-eu-blue/10 hover:border-eu-blue/30 hover:bg-eu-blue/5'}">← ${pickLang(paginationPrev, 'Anterior')}</button>
        <span class="px-3 py-2 text-xs text-gray-500 font-bold">Página ${safePage + 1} de ${totalPages}</span>
        <button data-gov-doc-page="next" class="px-4 py-2 text-xs font-bold rounded-full border cursor-pointer transition-all ${safePage >= totalPages - 1 ? 'opacity-50 cursor-not-allowed text-gray-400 border-gray-200' : 'bg-white text-eu-text border-eu-blue/10 hover:border-eu-blue/30 hover:bg-eu-blue/5'}">${pickLang(paginationNext, 'Siguiente')} →</button>
      </div>
    ` : '';

    const pageSizeSelector = pageSizeOptions && pageSizeOptions.length > 0 ? `
      <div class="flex gap-2 justify-end mb-4">
        ${pageSizeOptions.map(opt => `
          <button data-gov-doc-pagesize="${opt}" class="px-3 py-1.5 rounded-full border cursor-pointer transition-all text-xs font-bold ${actualPageSize === opt ? 'bg-eu-blue text-white border-eu-blue shadow-sm' : 'bg-white text-gray-600 border-eu-blue/10 hover:border-eu-blue/30 hover:bg-eu-blue/5'}">
            ${opt}
          </button>
        `).join('')}
        ${showAllOption ? `<button data-gov-doc-pagesize="all" class="px-3 py-1.5 rounded-full border cursor-pointer transition-all text-xs font-bold ${actualPageSize === 'all' ? 'bg-eu-blue text-white border-eu-blue shadow-sm' : 'bg-white text-gray-600 border-eu-blue/10 hover:border-eu-blue/30 hover:bg-eu-blue/5'}">
          ${pickLang(allLabel, 'Todo')}
        </button>` : ''}
      </div>
    ` : '';

    return `${pageSizeSelector}<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mb-2">${cardsHtml}</div>${paginationHtml}`;
  }

  return `
    ${cms.visible !== false ? `
    <div class="space-y-8">
      ${cms.headerVisible !== false ? `
      <div class="rd-card rd-card-accent rd-card-grad-violet overflow-hidden group">
        <div class="p-6 pl-7 sm:p-8 sm:pl-9">
          <div class="min-w-0">
            <div class="flex items-center gap-3">
              <span class="rd-icon-circle shrink-0 text-eu-blue transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" style="background:#ffffff">
                <i data-lucide="file-text" class="h-6 w-6"></i>
              </span>
              <h2 class="min-w-0 text-3xl font-extrabold leading-tight text-eu-purple">${pickLang(cms.title, s.title || '')}</h2>
            </div>
            ${pickLang(cms.description, s.description || '') ? `<p class="mt-5 text-lg leading-relaxed text-gray-600">${pickLang(cms.description, s.description || '')}</p>` : ''}
          </div>
        </div>
      </div>
      ` : ''}
      <div>
        <input type="text" id="gov-doc-search" placeholder="Buscar por título, tipo o ID..." class="w-full px-6 py-4 rounded-full border border-eu-purple/20 focus:outline-none focus:ring-2 focus:ring-eu-purple focus:border-eu-purple text-eu-text placeholder-eu-text/40 shadow-sm transition-all text-sm mb-6" style="background:#ffffff" />
        <div id="gov-docs-results">${renderDocs()}</div>
      </div>
    </div>
    ` : ''}
  `;
}

// ─── Tab 5: Participar ───────────────────────────────────────────────────────

function tabParticipar(govT) {
  const s = govT?.tabContent_participar || {};
  const cms = GOVERNANCE_CONFIG?.participateBlock || {};
  const hasCms = !!cms.stakeholderCard;

  const sc = hasCms ? cms.stakeholderCard : {};
  const cc = hasCms ? cms.consensueCard : {};
  const ms = hasCms ? cms.meetingsSection : {};

  const stakeBtnUrl = hasCms ? cms.stakeholderCard.buttonUrl || '#' : '#';
  const stakeBtnExt = hasCms ? cms.stakeholderCard.buttonExternal : false;
  const consBtnUrl = hasCms ? cms.consensueCard.buttonUrl || '#' : '#';
  const consBtnExt = hasCms ? cms.consensueCard.buttonExternal : false;

  const stakeholderBenefitsHtml = (hasCms
    ? (cms.stakeholderCard.benefits || []).map(b => `
    <li class="flex items-start gap-2.5 text-lg text-gray-700 leading-relaxed">
      <i data-lucide="check-circle" class="w-4 h-4 mt-1 shrink-0" style="color:#5620F6"></i>${pickLang(b.text, b.text?.es || '')}
    </li>`).join('')
    : (s.stakeholderBenefits || []).map(a => `
    <li class="flex items-start gap-2.5 text-lg text-gray-700 leading-relaxed">
      <i data-lucide="check-circle" class="w-4 h-4 mt-1 shrink-0" style="color:#5620F6"></i>${a}
    </li>`).join('')
  );

  const consensueGroups = hasCms
    ? (cms.consensueCard.groups || []).map(g => ({
        who: pickLang(g.who, g.who?.es || ''),
        actions: (g.actions || []).map(a => pickLang(a.text, a.text?.es || '')),
      }))
    : [
        { who: s.consensueGroupStakeholders, actions: s.consensueActionsStakeholders },
        { who: s.consensueGroupConsortium,   actions: s.consensueActionsConsortium   },
      ];

  const consensueGroupsHtml = consensueGroups.map(g => `
    <div class="rounded-2xl p-5 rd-card-grad-violet" style="border:1px solid rgb(73 24 173 / .15)">
      <p class="text-base font-extrabold uppercase tracking-wider mb-3" style="color:#4918AD">${g.who || ''}</p>
      <ul class="space-y-2.5">
        ${(g.actions || []).map(a => `
          <li class="flex items-start gap-2.5 text-lg text-gray-700 leading-relaxed">
            <span class="w-1.5 h-1.5 rounded-full shrink-0 mt-2" style="background:#5620F6"></span>
            <span>${a}</span>
          </li>`).join('')}
      </ul>
    </div>
  `).join('');

  const meetingsHtml = hasCms
    ? (cms.meetingsSection.meetings || []).map(e => {
        const parts = (e.date || '').split(' ');
        const regUrl = (e.registrationUrl || '').trim();
        const regExt = e.registrationExternal;
        const accUrl = (e.accessUrl || '').trim();
        const accExt = e.accessExternal;
        return `
      <div class="flex flex-col justify-between gap-4 p-6 rd-card rd-card-grad-violet rd-card-edge h-full group">
        <div class="flex items-start gap-4">
          <div class="bg-eu-blue text-white rounded-xl px-3 py-2 text-center shrink-0 min-w-[3.5rem] shadow-sm">
            <span class="block text-lg font-extrabold leading-none">${parts[0] || ''}</span>
            <span class="block text-xs font-bold uppercase tracking-wider mt-1">${parts[1] || ''}</span>
          </div>
          <div class="min-w-0">
            <p class="font-extrabold text-lg text-eu-purple leading-snug break-words">${pickLang(e.title, e.title?.es || '')}</p>
            <p class="text-sm text-gray-600 mt-1.5 flex items-center gap-1"><i data-lucide="map-pin" class="w-3.5 h-3.5 shrink-0"></i>${pickLang(e.location, e.location?.es || '')}</p>
          </div>
        </div>
        ${(regUrl || accUrl) ? `
        <div class="flex flex-wrap gap-2 pt-3 border-t border-eu-blue/10 mt-auto">
          ${regUrl ? `<a href="${regUrl}" ${regExt ? 'target="_blank" rel="noopener noreferrer"' : ''} class="inline-flex items-center gap-1.5 text-sm font-bold text-eu-blue hover:text-eu-purple transition-colors bg-eu-blue/5 border border-eu-blue/10 rounded-lg px-3 py-1.5">
            <i data-lucide="clipboard-list" class="w-4 h-4"></i>Registration
          </a>` : ''}
          ${accUrl ? `<a href="${accUrl}" ${accExt ? 'target="_blank" rel="noopener noreferrer"' : ''} class="inline-flex items-center gap-1.5 text-sm font-bold text-eu-purple hover:text-eu-blue transition-colors border rounded-lg px-3 py-1.5" style="background:rgb(73 24 173/.06); border-color:rgb(73 24 173/.15)">
            <i data-lucide="video" class="w-4 h-4"></i>Access
          </a>` : ''}
        </div>` : ''}
      </div>
    `;
      }).join('')
    : (s.meetings || []).map(e => {
        const parts = (e.date || '').split(' ');
        return `
      <div class="flex items-start gap-4 p-6 rd-card rd-card-grad-violet rd-card-edge h-full group">
        <div class="bg-eu-blue text-white rounded-xl px-3 py-2 text-center shrink-0 min-w-[3.5rem] shadow-sm">
          <span class="block text-lg font-extrabold leading-none">${parts[0] || ''}</span>
          <span class="block text-xs font-bold uppercase tracking-wider mt-1">${parts[1] || ''}</span>
        </div>
        <div>
          <p class="font-extrabold text-lg text-eu-purple leading-snug">${e.title || ''}</p>
          <p class="text-sm text-gray-600 mt-1.5 flex items-center gap-1"><i data-lucide="map-pin" class="w-3.5 h-3.5 shrink-0"></i>${e.location || ''}</p>
        </div>
      </div>
    `;
      }).join('');

  return `
    <div class="space-y-12">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Track B – Stakeholder (beige) -->
        ${(hasCms ? cms.stakeholderCard.visible !== false : true) ? `
        <div class="rd-card rd-card-edge flex flex-col justify-between h-full overflow-hidden group">
          <div class="bg-eu-blue text-white px-8 py-6 flex items-center gap-4" style="min-height:8.5rem">
            <div class="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center shrink-0 rd-icon-circle-gov transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
              <i data-lucide="building-2" class="w-6 h-6 text-white"></i>
            </div>
            <div>
              <h3 class="text-2xl font-extrabold text-white leading-snug">${hasCms ? pickLang(cms.stakeholderCard.title, s.stakeholderTitle || '') : (s.stakeholderTitle || '')}</h3>
              <p class="text-sm font-extrabold uppercase tracking-widest text-white/80 mt-0.5">${hasCms ? pickLang(cms.stakeholderCard.subtitle, s.stakeholderSubtitle || '') : (s.stakeholderSubtitle || '')}</p>
            </div>
          </div>
          <div class="rd-pad rd-card-grad-blue flex-1 flex flex-col justify-between">
            <div>
              <p class="text-lg text-gray-700 mb-6 leading-relaxed">${hasCms ? pickLang(cms.stakeholderCard.description, s.stakeholderDesc || '') : (s.stakeholderDesc || '')}</p>
              <div class="rounded-2xl p-6 mb-6 rd-card-grad-beige" style="border:1px solid rgb(86 32 246/.18)">
                <p class="text-base font-extrabold uppercase tracking-wider mb-3" style="color:#4918AD">${hasCms ? pickLang(cms.stakeholderCard.benefitsLabel, s.stakeholderBenefitsLabel || '') : (s.stakeholderBenefitsLabel || '')}</p>
                <ul class="space-y-2.5">${stakeholderBenefitsHtml}</ul>
              </div>
              <p class="text-base text-gray-600 mb-6 flex items-start gap-2.5 leading-relaxed">
                <i data-lucide="alert-circle" class="w-4 h-4 shrink-0 mt-1" style="color:#4918AD"></i>
                <span>${hasCms ? pickLang(cms.stakeholderCard.warning, s.stakeholderWarning || '') : (s.stakeholderWarning || '')}</span>
              </p>
            </div>
            <div class="pt-4 shrink-0" style="border-top:1px solid rgb(86 32 246/.15)">
              ${(hasCms && stakeBtnUrl !== '#')
                ? `<a href="${stakeBtnUrl}" ${stakeBtnExt ? 'target="_blank" rel="noopener noreferrer"' : ''} class="inline-flex items-center gap-2 text-white px-6 py-3 rounded-full font-bold text-base hover:opacity-90 transition-all shadow-md" style="background:#5620F6">
                <span>${pickLang(cms.stakeholderCard.buttonText, s.stakeholderButton || '')}</span> <i data-lucide="external-link" class="w-4 h-4"></i>
              </a>`
                : `<span class="inline-flex items-center gap-2 text-white px-6 py-3 rounded-full font-bold text-base shadow-md" style="background:#5620F6">
                <span>${pickLang(cms.stakeholderCard.buttonText, s.stakeholderButton || '')}</span>
              </span>`
              }
            </div>
          </div>
        </div>` : ''}

        <!-- ConsensUE (púrpura) -->
        ${(hasCms ? cms.consensueCard.visible !== false : true) ? `
        <div class="rd-card rd-card-edge flex flex-col justify-between h-full overflow-hidden group">
          <div class="bg-eu-purple text-white px-8 py-6 flex items-center gap-4" style="min-height:8.5rem">
            <div class="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center shrink-0 rd-icon-circle-gov transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
              <i data-lucide="users" class="w-6 h-6 text-white"></i>
            </div>
            <div>
              <h3 class="text-2xl font-extrabold text-white leading-snug">${hasCms ? pickLang(cms.consensueCard.title, s.consensueTitle || '') : (s.consensueTitle || '')}</h3>
              <p class="text-sm font-extrabold uppercase tracking-widest text-white/80 mt-0.5">${hasCms ? pickLang(cms.consensueCard.subtitle, s.consensueSubtitle || '') : (s.consensueSubtitle || '')}</p>
            </div>
          </div>
          <div class="rd-pad rd-card-grad-beige flex-1 flex flex-col justify-between">
            <div>
              <p class="text-lg text-gray-700 mb-6 leading-relaxed">${hasCms ? pickLang(cms.consensueCard.description, s.consensueDesc || '') : (s.consensueDesc || '')}</p>
              <div class="space-y-4 mb-6">${consensueGroupsHtml}</div>
            </div>
            <div class="pt-4 shrink-0" style="border-top:1px solid rgb(73 24 173 / .15)">
              ${(hasCms && consBtnUrl !== '#')
                ? `<a href="${consBtnUrl}" ${consBtnExt ? 'target="_blank" rel="noopener noreferrer"' : ''} class="inline-flex items-center gap-2 text-white px-6 py-3 rounded-full font-bold text-base hover:opacity-90 transition-all shadow-md" style="background:#4918AD">
                <span>${pickLang(cms.consensueCard.buttonText, s.consensueButton || '')}</span> <i data-lucide="external-link" class="w-4 h-4"></i>
              </a>`
                : `<span class="inline-flex items-center gap-2 text-white px-6 py-3 rounded-full font-bold text-base shadow-md" style="background:#4918AD">
                <span>${pickLang(cms.consensueCard.buttonText, s.consensueButton || '')}</span>
              </span>`
              }
            </div>
          </div>
        </div>` : ''}
      </div>

      <!-- Reuniones -->
      ${(hasCms ? cms.meetingsSection.visible !== false : true) ? `
      <div class="rd-card-gov-beige rd-card-gov-static-hover rd-pad">
        <div class="flex items-center gap-4 mb-6">
          <div class="w-14 h-14 bg-eu-blue/10 rounded-2xl flex items-center justify-center shrink-0 rd-icon-circle-gov">
            <i data-lucide="landmark" class="w-6 h-6 text-eu-blue"></i>
          </div>
          <div>
            <h2 class="text-3xl font-extrabold text-eu-purple leading-tight">${hasCms ? pickLang(cms.meetingsSection.title, s.meetingsTitle || '') : (s.meetingsTitle || '')}</h2>
            <p class="text-base text-gray-500 font-bold mt-1">${hasCms ? pickLang(cms.meetingsSection.subtitle, s.meetingsSubtitle || '') : (s.meetingsSubtitle || '')}</p>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">${meetingsHtml}</div>
      </div>` : ''}
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
    <div class="rd-hero-stat text-center">
      <p class="text-3xl font-extrabold text-white leading-tight">${s.value || ''}</p>
      <p class="text-[10px] font-extrabold uppercase tracking-widest mt-2" style="color:rgba(255,244,225,.75)">${pickLang(s.label)}</p>
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
      <div class="rd-hero-gradient text-white px-6 py-20 relative overflow-hidden">
        <!-- Accent circles -->
        <div class="absolute -right-20 -bottom-20 w-80 h-80 bg-white/5 rounded-full blur-2xl"></div>
        <div class="absolute left-10 top-5 w-40 h-40 bg-eu-yellow/5 rounded-full blur-xl"></div>
        
        <div class="max-w-7xl mx-auto relative z-10">
          <div class="flex flex-wrap items-start justify-between gap-8">
            <div class="max-w-4xl">
              <span class="inline-block bg-white/10 border border-white/20 font-extrabold text-xs uppercase tracking-widest px-4 py-1.5 rounded-full mb-6" style="color:#FFF4E1;backdrop-filter:blur(8px)">
                ${govT?.eyebrow || 'Gobernanza'}
              </span>
              <h1 class="font-extrabold mb-6" style="color:#FFF4E1;letter-spacing:-.025em;font-size:clamp(2.5rem,5vw,3.75rem);line-height:1.05;max-width:20ch">${pickLang(heroBlock.title, govT?.title || '')}</h1>
              <p class="text-lg leading-relaxed max-w-3xl" style="color:rgba(255,255,255,.9)">${pickLang(heroBlock.description, govT?.description || '')}</p>
            </div>
            ${ctaButton.visible !== false && ctaButton.url ? `
            <div class="flex items-center mt-4 lg:mt-12">
              <a href="${ctaButton.url}" target="_blank" rel="noopener noreferrer"
                 class="flex items-center gap-2 rounded-full font-bold transition-all hover:scale-105 hover:bg-white hover:text-eu-purple border-none cursor-pointer shadow-lg"
                 style="background:#FFF4E1;color:#4918AD;padding:1rem 2rem;font-size:0.875rem">
                <i data-lucide="file-text" class="w-4 h-4"></i>${pickLang(ctaButton.label)}<i data-lucide="external-link" class="w-3 h-3"></i>
              </a>
            </div>` : ''}
          </div>
          ${heroStats.length > 0 ? `
          <div class="rd-hero-stats-grid mt-10 max-w-4xl">${statsHtml}</div>` : ''}
        </div>
      </div>` : ''}

      <!-- Tabs + content -->
      <div class="rd-canvas rd-section py-16">
        <div class="max-w-7xl mx-auto px-6">
          <div class="flex flex-wrap gap-2 mb-10">
            ${tabBar(activeTab, govT)}
          </div>
          <div class="rd-divide pt-10">
            ${contentMap[activeTab] || ''}
          </div>
        </div>
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

  // Documentación: búsqueda
  const docSearch = document.getElementById('gov-doc-search');
  if (docSearch) {
    docSearch.addEventListener('input', () => {
      setState('govDocPage', 0); // Reset a página 1
      const results = document.getElementById('gov-docs-results');
      if (results && getState('governanceTab') === 'documentos') {
        const govT = window.GOVERNANCE_CONFIG?.governanceTexts || {};
        const tabContent = tabDocumentos(govT);
        // Extraer solo la parte de documentos
        const temp = document.createElement('div');
        temp.innerHTML = tabContent;
        const newResults = temp.querySelector('#gov-docs-results');
        if (newResults) {
          results.innerHTML = newResults.innerHTML;
          mount();
          if (window.lucide) window.lucide.createIcons();
        }
      }
    });
  }

  // Documentación: paginación
  document.querySelectorAll('[data-gov-doc-page]').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.govDocPage;
      const currentPage = getState('govDocPage') || 0;
      if (action === 'next') {
        setState('govDocPage', currentPage + 1);
      } else if (action === 'prev' && currentPage > 0) {
        setState('govDocPage', currentPage - 1);
      }
      const results = document.getElementById('gov-docs-results');
      if (results) {
        const govT = window.GOVERNANCE_CONFIG?.governanceTexts || {};
        const tabContent = tabDocumentos(govT);
        const temp = document.createElement('div');
        temp.innerHTML = tabContent;
        const newResults = temp.querySelector('#gov-docs-results');
        if (newResults) {
          results.innerHTML = newResults.innerHTML;
          mount();
          if (window.lucide) window.lucide.createIcons();
        }
      }
    });
  });

  // Documentación: selector de tamaño de página
  document.querySelectorAll('[data-gov-doc-pagesize]').forEach(btn => {
    btn.addEventListener('click', () => {
      const size = btn.dataset.govDocPagesize === 'all' ? 'all' : parseInt(btn.dataset.govDocPagesize);
      setState('govDocPageSize', size);
      setState('govDocPage', 0); // Reset a página 1
      const results = document.getElementById('gov-docs-results');
      if (results) {
        const govT = window.GOVERNANCE_CONFIG?.governanceTexts || {};
        const tabContent = tabDocumentos(govT);
        const temp = document.createElement('div');
        temp.innerHTML = tabContent;
        const newResults = temp.querySelector('#gov-docs-results');
        if (newResults) {
          results.innerHTML = newResults.innerHTML;
          mount();
          if (window.lucide) window.lucide.createIcons();
        }
      }
    });
  });
}
