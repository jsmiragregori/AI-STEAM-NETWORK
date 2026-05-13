import { t } from '../i18n.js';
import { getState, setState } from '../state.js';
import { challengeExtras } from '../../data/challenge-extras.js';
import { CHALLENGES_CONFIG } from '../../data/challenges.js';

const CHALLENGES = [
  { id: 'r1', title: 'Optimización energética de museos públicos con IA', entity: 'Generalitat Valenciana (CEICE)', entityType: 'Administración Pública', level: 'FP', status: 'Abierto', sector: 'Energy and Environment', description: 'Desarrollo de un modelo predictivo para optimizar el consumo de HVAC en la red de museos públicos valencianos. Se busca reducir el consumo un 25% sin afectar al confort de visitantes.', posted: '10 Mar 2026', deadline: '30 Jun 2026', teams: 0, tags: ['HVAC', 'ML Predictivo', 'IoT', 'Eficiencia Energética'], country: '🇪🇸', contributionType: 'Challenge', route: 'FP/VET', evidenceExpected: 'Modelo predictivo HVAC validado en 8 museos piloto', evidenceMaturity: 'validated' },
  { id: 'r2', title: 'Detección de plagas en cítricos vía Computer Vision', entity: 'AVA-ASAJA Cooperativa', entityType: 'Empresa Agrícola', level: 'Máster', status: 'En Resolución', sector: 'Agrifood', description: 'Sistema de detección temprana de la Xylella fastidiosa y cotonet en cultivos de cítricos mediante drones y modelos de visión computacional entrenados con imágenes multiespectrales.', posted: '15 Ene 2026', deadline: '15 Jul 2026', teams: 3, tags: ['Computer Vision', 'Drones', 'Deep Learning', 'Xylella'], country: '🇪🇸', contributionType: 'Challenge', route: 'Master Bridge', evidenceExpected: 'Pipeline CV desplegable en campo + artículo técnico IEEE', evidenceMaturity: 'inPilot' },
  { id: 'r3', title: 'Mantenimiento predictivo en líneas de embotellado', entity: 'Bodegas Murviedro SA', entityType: 'PYME Agroalimentaria', level: 'FP', status: 'Abierto', sector: 'Manufacturing', description: 'Reducción de paradas no planificadas en líneas de embotellado de vino mediante sensórica vibratoria y modelos LSTM para la predicción de fallos en rodamientos y motores.', posted: '01 Feb 2026', deadline: '30 Ago 2026', teams: 1, tags: ['LSTM', 'Vibración', 'IoT Sectorial', 'Manufactura 4.0'], country: '🇪🇸', contributionType: 'Challenge', route: 'FP/VET', evidenceExpected: 'Sistema de alertas integrado con SAP PM + informe ROI', evidenceMaturity: 'validated' },
  { id: 'r4', title: 'IA en triaje de urgencias pediátricas', entity: 'Hospital Universitario La Fe', entityType: 'Institución Sanitaria Pública', level: 'Máster', status: 'Abierto', sector: 'Non-Touristic Services', description: 'Modelo de apoyo a la decisión clínica para el triaje en urgencias pediátricas basado en constantes vitales, motivo de consulta (NLP) e historial clínico previo (HL7 FHIR).', posted: '05 Mar 2026', deadline: '30 Sep 2026', teams: 2, tags: ['NLP Clínico', 'FHIR', 'Triaje', 'Ética IA'], country: '🇪🇸', contributionType: 'Challenge', route: 'Master Bridge', evidenceExpected: 'CDSS con kappa ≥ 88% + documentación AI Act', evidenceMaturity: 'idea' },
  { id: 'r5', title: 'Digitalización de colecciones patrimoniales con NLP multilingüe', entity: 'LPGA – Promoción Las Palmas', entityType: 'Administración Pública', level: 'Máster', status: 'En Resolución', sector: 'Cultural and Creative Industries', description: 'Uso de NLP y OCR para catalogar y enriquecer semánticamente 50.000 documentos históricos en español, inglés y neerlandés del archivo colonial de Gran Canaria.', posted: '20 Nov 2025', deadline: '20 May 2026', teams: 4, tags: ['NLP', 'OCR', 'Patrimonio Digital', 'Multilingüe'], country: '🇪🇸', contributionType: 'Challenge', route: 'Master Bridge', evidenceExpected: 'Dataset Dublin Core 5.000 docs + pipeline OCR-NER publicado', evidenceMaturity: 'inPilot' },
  { id: 'r6', title: 'Predicción de calidad del agua en cuencas fluviales', entity: 'Region Värmland', entityType: 'Administración Regional', level: 'Máster', status: 'Abierto', sector: 'Energy and Environment', description: 'Modelos de series temporales para predecir la concentración de nitratos y fosfatos en el lago Vänern usando datos de sensores remotos y registros históricos de 15 años.', posted: '01 Mar 2026', deadline: '30 Sep 2026', teams: 1, tags: ['Series Temporales', 'Teledetección', 'Calidad Agua', 'GIS'], country: '🇸🇪', contributionType: 'Challenge', route: 'Master Bridge', evidenceExpected: 'Modelo predicción 30 días + sistema de alertas prototipo', evidenceMaturity: 'idea' },
  { id: 'r7', title: 'Sistema de recomendación de itinerarios turísticos sostenibles', entity: 'CulturaLink SL', entityType: 'Startup', level: 'FP', status: 'Abierto', sector: 'Cultural and Creative Industries', description: 'Motor de recomendación personalizado para turismo cultural en Canarias que integre criterios de sostenibilidad, preferencias de usuario y datos de afluencia en tiempo real.', posted: '12 Feb 2026', deadline: '12 Ago 2026', teams: 2, tags: ['Recomendación', 'Turismo Sostenible', 'LLM', 'API REST'], country: '🇪🇸', contributionType: 'Challenge', route: 'FP/VET', evidenceExpected: 'Motor de recomendación desplegado con precisión@10 ≥ 0.7', evidenceMaturity: 'validated' },
  { id: 'r8', title: 'Automatización del proceso de expedientes académicos con IA', entity: "CEICE – Conselleria d'Educació", entityType: 'Administración Pública', level: 'FP', status: 'Resuelto', sector: 'Non-Touristic Services', description: 'Sistema de extracción y validación automática de datos en expedientes académicos de la CV mediante OCR + LLM. Reducción del tiempo de tramitación del 70%. En producción desde enero 2026.', posted: '01 Sep 2025', deadline: '28 Feb 2026', teams: 5, tags: ['OCR', 'RPA', 'LLM', 'Tramitación Electrónica'], country: '🇪🇸', contributionType: 'Case', route: 'FP/VET', evidenceExpected: 'Sistema en producción GVA (99.3% precisión, 1.200 exp/día)', evidenceMaturity: 'completed' },
  { id: 'r9', title: 'Detección de desinformación climática en redes sociales', entity: 'INESC TEC', entityType: 'Centro de Investigación', level: 'Máster', status: 'Abierto', sector: 'Energy and Environment', description: 'Clasificador multilingüe (ES/PT/EN) para identificar narrativas de desinformación sobre cambio climático en Twitter/X y Mastodon usando modelos transformer y grafos de conocimiento.', posted: '20 Feb 2026', deadline: '20 Oct 2026', teams: 0, tags: ['NLP', 'Desinformación', 'Transformers', 'Redes Sociales'], country: '🇵🇹', contributionType: 'Challenge', route: 'Master Bridge', evidenceExpected: 'Clasificador multilingüe F1 ≥ 0.82 + API tiempo real', evidenceMaturity: 'idea' },
  { id: 'r10', title: 'Validación sectorial de necesidades IA para FP industrial', entity: 'Clúster Manufactura Avanzada CV', entityType: 'Clúster Empresarial', level: 'FP', status: 'Abierto', sector: 'Manufacturing', description: 'Revisión con empresas industriales de competencias, herramientas y casos reales que deberían priorizarse en actividades FP/VET sobre IA aplicada a producción, mantenimiento y calidad.', posted: '18 Mar 2026', deadline: '30 Jun 2026', teams: 0, tags: ['Validación Sectorial', 'FP/VET', 'Industria', 'Competencias'], country: '🇪🇸', contributionType: 'Validation', route: 'FP/VET', evidenceExpected: 'Informe breve de relevancia sectorial + matriz de competencias priorizadas', evidenceMaturity: 'idea' },
  { id: 'r11', title: 'Mentoría para proyectos de IA responsable en administración pública', entity: 'FIDIT', entityType: 'Fundación de Innovación Pública', level: 'Máster', status: 'En Resolución', sector: 'Non-Touristic Services', description: 'Disponibilidad de perfiles expertos para orientar equipos docentes y estudiantes en privacidad, explicabilidad y evaluación de impacto en casos de IA para servicios públicos.', posted: '22 Mar 2026', deadline: '15 Jul 2026', teams: 2, tags: ['Mentoría', 'IA Responsable', 'Sector Público', 'Ética'], country: '🇪🇸', contributionType: 'Mentoring', route: 'Mixed', evidenceExpected: 'Registro de sesiones, recomendaciones éticas y checklist reutilizable', evidenceMaturity: 'validated' },
  { id: 'r12', title: 'Pilotaje de actividad docente sobre sensores y calidad del aire', entity: 'IES La Costera', entityType: 'Centro FP/VET', level: 'FP', status: 'En Resolución', sector: 'Energy and Environment', description: 'Piloto en aula para probar una situación de aprendizaje con sensores ambientales, visualización de datos y reflexión sobre sostenibilidad y sesgos de medición.', posted: '27 Mar 2026', deadline: '30 Sep 2026', teams: 1, tags: ['Pilotaje', 'Sensórica', 'Aules', 'Sostenibilidad'], country: '🇪🇸', contributionType: 'Pilot', route: 'Teacher Training', evidenceExpected: 'Actividad probada, feedback docente y paquete OER revisable', evidenceMaturity: 'inPilot' },
  { id: 'r13', title: 'Dataset sintético para trazabilidad agroalimentaria', entity: 'CINK', entityType: 'PYME Tecnológica', level: 'FP', status: 'Resuelto', sector: 'Agrifood', description: 'Aportación de un conjunto de datos sintético y anonimizado para practicar trazabilidad, detección de anomalías y visualización de cadenas de suministro agroalimentarias.', posted: '02 Abr 2026', deadline: '30 Abr 2026', teams: 0, tags: ['Recurso', 'Dataset Sintético', 'Trazabilidad', 'Agroalimentario'], country: '🇭🇷', contributionType: 'Resource', route: 'FP/VET', evidenceExpected: 'Dataset CC-BY-SA, guía docente y ficha de uso responsable', evidenceMaturity: 'completed' },
];

const STATUS_STYLES = {
  'Abierto':       'bg-green-100 text-green-800',
  'En Resolución': 'bg-yellow-100 text-yellow-800',
  'Resuelto':      'bg-gray-100 text-gray-600',
};
const STATUS_DOT = {
  'Abierto':       'bg-green-500',
  'En Resolución': 'bg-yellow-500',
  'Resuelto':      'bg-gray-400',
};
const STATUS_BG = {
  'Abierto':       'bg-green-100',
  'En Resolución': 'bg-yellow-100',
  'Resuelto':      'bg-gray-100',
};
const STATUS_TEXT = {
  'Abierto':       'text-green-800',
  'En Resolución': 'text-yellow-800',
  'Resuelto':      'text-gray-600',
};
const ROUTE_STYLES = {
  'FP/VET':           'bg-eu-yellow text-eu-purple',
  'Teacher Training': 'bg-teal-100 text-teal-800',
  'Master Bridge':    'bg-purple-100 text-purple-800',
  'Mixed':            'bg-blue-100 text-blue-800',
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
const SECTOR_CODE = {
  'Manufacturing': 'mfg', 'Mobility and Transport': 'mob', 'Energy and Environment': 'ene',
  'Agrifood': 'agr', 'Cultural and Creative Industries': 'cci', 'Housing': 'hou', 'Non-Touristic Services': 'nts',
};

function getSectorCode(s) { return SECTOR_CODE[s] || s; }
function getSectorLabel(s, mT) { return (mT?.sectorNames || t('sectors.sectorNames') || {})[getSectorCode(s)] || s; }
function getStatusLabel(s, mT) {
  const map = { 'Abierto': mT?.open || 'Abierto', 'En Resolución': mT?.inProgress || 'En Resolución', 'Resuelto': mT?.resolved || 'Resuelto' };
  return map[s] || s;
}
function getContributionTypeLabel(type, mT) { return (mT?.contributionTypes || {})[type] || type; }
function getRouteLabel(route, mT) { return (mT?.routeOptions || {})[route] || route; }
function getEvidenceMaturityLabel(m, mT) { return (mT?.evidenceMaturityOptions || {})[m] || m; }

function getTranslatedChallenges(mT) {
  const cd = mT?.challengeData || {};
  return CHALLENGES.map(ch => ({
    ...ch,
    title:       cd[ch.id]?.title       || ch.title,
    description: cd[ch.id]?.description || ch.description,
    entityType:  cd[ch.id]?.entityType  || ch.entityType,
    tags:        cd[ch.id]?.tags        || ch.tags,
  }));
}

function getLang() { return localStorage.getItem('language') || 'es'; }

function pickLang(value, fallback = '') {
  const lang = getLang();
  return value?.[lang] || value?.es || fallback;
}

function getFilteredChallenges(all, filters) {
  return all.filter(ch => {
    if (filters.type   !== 'All'  && ch.contributionType !== filters.type)   return false;
    if (filters.route  !== 'All'  && ch.route            !== filters.route)  return false;
    if (filters.status !== 'Todos'&& ch.status           !== filters.status) return false;
    if (filters.sector !== 'Todos'&& ch.sector           !== filters.sector) return false;
    if (filters.evidence !== 'All'&& ch.evidenceMaturity !== filters.evidence) return false;
    if (filters.search) {
      const q = filters.search.toLowerCase();
      if (!ch.title.toLowerCase().includes(q) && !ch.description.toLowerCase().includes(q)) return false;
    }
    return true;
  });
}

// ─── Detail view ─────────────────────────────────────────────────────────────

function renderDetail(ch, mT) {
  const lang = getLang();
  const cdT = t('challengeDetail') || {};
  const extra = (challengeExtras[lang] || {})[ch.id] || (challengeExtras.es || {})[ch.id] || null;
  const st = STATUS_STYLES[ch.status] || 'bg-gray-100 text-gray-600';
  const stBg = STATUS_BG[ch.status] || 'bg-gray-100';
  const stText = STATUS_TEXT[ch.status] || 'text-gray-600';
  const stDot = STATUS_DOT[ch.status] || 'bg-gray-400';
  const lvl = LEVEL_STYLES[ch.level] || 'bg-gray-100 text-gray-600';
  const participationCtas = cdT.participationCtas || {};
  const participationButton = participationCtas[ch.contributionType] || cdT.requestParticipationButton || 'Solicitar participación →';

  const showForm = getState('marketplaceShowParticipation');
  const participationSent = getState('marketplaceParticipationSent');

  // Participation roles/types/pathways/ethics from translations
  const roles = cdT.participationRoles || [];
  const types = cdT.participationTypes || [];
  const pathways = cdT.participationPathways || [];
  const ethics = cdT.participationEthics || [];
  const fields = cdT.participationFields || {};
  const placeholders = cdT.participationPlaceholders || {};

  return `
<div class="animate-in fade-in duration-300">
  <!-- Sticky nav -->
  <div class="bg-white border-b border-eu-border sticky top-[112px] z-40 px-6 py-3">
    <div class="max-w-7xl mx-auto flex items-center justify-between gap-4">
      <button id="mp-back" class="flex items-center gap-2 text-eu-blue font-bold text-sm hover:underline bg-transparent border-none cursor-pointer">
        <i data-lucide="arrow-left" class="w-4 h-4"></i> ${cdT.backButton || 'Volver a Retos y Casos'}
      </button>
      <div class="flex items-center gap-2">
        <span class="text-sm font-extrabold uppercase px-2 py-0.5 rounded ${lvl}">${cdT.challengeLevel || 'Nivel'} ${ch.level}</span>
        <span class="flex items-center gap-1.5 text-sm font-bold px-2 py-0.5 rounded ${stBg} ${stText}">
          <span class="w-1.5 h-1.5 rounded-full ${stDot}"></span>
          ${ch.status}
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
          <span class="text-xs text-white/60">${ch.entityType}</span>
        </div>
        <h1 class="text-3xl font-extrabold mb-3 leading-tight">${ch.title}</h1>
        <div class="flex items-center gap-3 mb-5">
          <i data-lucide="building-2" class="w-4 h-4 text-white/60 shrink-0"></i>
          <span class="text-white/80 font-semibold">${ch.entity}</span>
          <span class="text-white/40">·</span>
          <span class="text-white/60 text-sm">${ch.country}</span>
        </div>
        <div class="flex flex-wrap gap-2">
          ${ch.tags.map(tag => `<span class="flex items-center gap-1 bg-white/10 text-white/80 text-xs font-semibold px-2.5 py-1 rounded-full"><i data-lucide="tag" class="w-3 h-3"></i>${tag}</span>`).join('')}
        </div>
      </div>
      <!-- Key info card -->
      <div class="bg-white/10 rounded-xl p-5 flex flex-col gap-3">
        <div class="flex items-center gap-3">
          <i data-lucide="calendar" class="w-4 h-4 text-eu-yellow shrink-0"></i>
          <div>
            <p class="text-xs text-white/50 uppercase font-bold">${cdT.deadline || 'Plazo de entrega'}</p>
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
        ${extra ? `
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
            <p class="font-bold text-white text-sm">${ch.route}</p>
          </div>
        </div>` : ''}
        ${ch.evidenceExpected ? `
        <div class="flex items-start gap-3">
          <i data-lucide="flask-conical" class="w-4 h-4 text-eu-yellow shrink-0 mt-0.5"></i>
          <div>
            <p class="text-xs text-white/50 uppercase font-bold">${cdT.evidenceLabel || 'Evidencia esperada'}</p>
            <p class="text-white text-sm leading-snug">${ch.evidenceExpected}</p>
          </div>
        </div>` : ''}
        ${ch.status === 'Abierto' ? `<button id="mp-open-form" class="mt-2 w-full bg-eu-orange text-white font-bold py-2.5 rounded-lg hover:bg-eu-purple transition-colors border-none cursor-pointer text-sm">${participationButton}</button>` : ''}
        ${ch.status === 'En Resolución' ? `<div class="mt-2 w-full bg-yellow-400/20 text-yellow-200 font-bold py-2.5 rounded-lg text-sm text-center">${cdT.enrollmentClosed || 'Inscripciones cerradas'}</div>` : ''}
        ${ch.status === 'Resuelto' ? `<div class="mt-2 w-full bg-white/10 text-white/60 font-bold py-2.5 rounded-lg text-sm text-center">${cdT.challengeCompleted || 'Reto completado'}</div>` : ''}
      </div>
    </div>
  </div>

  <!-- Participation form -->
  ${showForm && ch.status === 'Abierto' ? `
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
        <p class="text-sm text-gray-700 leading-relaxed mb-4">${extra?.fullDescription ?? ch.description}</p>
        ${extra?.context ? `<div class="bg-eu-bg border-l-4 border-eu-teal rounded-r-lg p-4"><p class="text-xs font-bold text-eu-teal uppercase mb-1">${cdT.contextLabel || 'Contexto y datos disponibles'}</p><p class="text-sm text-gray-600">${extra.context}</p></div>` : ''}
      </section>

      <!-- Objectives -->
      ${extra?.objectives ? `
      <section class="bg-white rounded-xl border border-eu-border shadow-sm p-7">
        <h2 class="text-lg font-bold text-eu-text mb-4 flex items-center gap-2"><i data-lucide="target" class="w-5 h-5 text-eu-orange"></i> ${cdT.objectivesTitle || 'Objetivos y Resultados Esperados'}</h2>
        <ul class="space-y-2.5">
          ${extra.objectives.map(o => `<li class="flex items-start gap-3 text-sm text-gray-700"><i data-lucide="check-circle" class="w-4 h-4 text-eu-teal mt-0.5 shrink-0"></i>${o}</li>`).join('')}
        </ul>
      </section>` : ''}

      <!-- Datasets & tools -->
      ${extra ? `
      <section class="bg-white rounded-xl border border-eu-border shadow-sm p-7">
        <h2 class="text-lg font-bold text-eu-text mb-4 flex items-center gap-2"><i data-lucide="database" class="w-5 h-5 text-eu-blue"></i> ${cdT.resourcesTitle || 'Datos y Recursos Disponibles'}</h2>
        <div class="mb-5">
          <p class="text-xs font-bold text-gray-500 uppercase mb-3">${cdT.datasetsLabel || 'Datasets proporcionados'}</p>
          <div class="space-y-2">
            ${extra.datasets.map(d => `
            <div class="flex items-center justify-between bg-eu-bg rounded-lg px-4 py-2.5 border border-eu-border">
              <div class="flex items-center gap-2"><i data-lucide="download" class="w-4 h-4 text-eu-blue shrink-0"></i><span class="text-sm font-semibold text-eu-text">${d.label}</span></div>
              <div class="flex items-center gap-2 shrink-0 ml-4"><span class="text-xs bg-eu-blue/10 text-eu-blue font-bold px-2 py-0.5 rounded">${d.format}</span><span class="text-xs text-gray-400 font-semibold">${d.size}</span></div>
            </div>`).join('')}
          </div>
        </div>
        <div>
          <p class="text-xs font-bold text-gray-500 uppercase mb-3">${cdT.toolsLabel || 'Tecnologías recomendadas'}</p>
          <div class="flex flex-wrap gap-2">
            ${extra.tools.map(tool => `<span class="text-xs bg-eu-bg border border-eu-border px-2.5 py-1 rounded-full font-semibold text-gray-600">${tool}</span>`).join('')}
          </div>
        </div>
      </section>` : ''}

      <!-- Deliverables -->
      ${extra?.deliverables ? `
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
      ${extra?.evalCriteria ? `
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
      ${extra?.eligibility && extra.eligibility.length > 0 && extra.eligibility[0] !== 'Reto cerrado — en producción desde enero 2026' ? `
      <section class="bg-white rounded-xl border border-eu-border shadow-sm p-7">
        <h2 class="text-lg font-bold text-eu-text mb-4 flex items-center gap-2"><i data-lucide="users" class="w-5 h-5 text-eu-teal"></i> ${cdT.eligibilityTitle || 'Elegibilidad y Requisitos'}</h2>
        <ul class="space-y-2">
          ${extra.eligibility.map(e => `<li class="flex items-start gap-2.5 text-sm text-gray-700"><span class="w-1.5 h-1.5 rounded-full bg-eu-teal mt-1.5 shrink-0"></span>${e}</li>`).join('')}
        </ul>
      </section>` : ''}

      <!-- FAQ -->
      ${extra?.faq && extra.faq.length > 0 ? `
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
      ${extra?.milestones ? `
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
      ${extra?.mentors ? `
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
      ${extra?.recognition ? `
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
      ${ch.status === 'Abierto' ? `
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
  const filtered = getFilteredChallenges(all, effectiveFilters);

  const fallbackStats = [
    { value: all.filter(c => c.status === 'Abierto').length, label: mT?.openChallenges || 'Abiertos' },
    { value: all.filter(c => c.status === 'En Resolución').length, label: mT?.inProgressChallenges || 'En resolución' },
    { value: all.filter(c => c.status === 'Resuelto').length, label: mT?.resolvedChallenges || 'Resueltos' },
  ];
  const heroBlock = CHALLENGES_CONFIG?.heroBlock || {};
  const heroStats = Array.isArray(heroBlock.stats) && heroBlock.stats.length > 0
    ? heroBlock.stats
    : fallbackStats;
  const submitButton = heroBlock.submitButton || {};

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
  const contributionTypes = mT?.contributionTypes || {};
  const routeOptions = mT?.routeOptions || {};

  return `
<div class="animate-in fade-in duration-300">
  <!-- Header -->
  <div class="bg-eu-blue text-white px-4 sm:px-6 py-8 sm:py-10">
    <div class="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
      <div class="flex-1 min-w-0">
        <h1 class="text-2xl sm:text-3xl font-extrabold mb-2">${pickLang(heroBlock.title, mT?.title || 'Retos y Casos')}</h1>
        <p class="text-white/80 max-w-2xl text-sm sm:text-base">${pickLang(heroBlock.description, mT?.description || '')}</p>
        <div class="grid grid-cols-3 gap-3 sm:gap-5 mt-5">
          ${heroStats.map(stat => `
          <div class="bg-white/10 rounded-xl px-3 sm:px-6 py-3 sm:py-4 text-center sm:text-left">
            <p class="text-xl sm:text-2xl font-extrabold text-eu-yellow">${stat.value}</p>
            <p class="text-xs text-white/70 font-semibold uppercase mt-1 line-clamp-2">${pickLang(stat.label, stat.label || '')}</p>
          </div>`).join('')}
        </div>
      </div>
      ${submitButton.visible !== false ? `
      <button id="mp-toggle-submit" class="flex items-center justify-center sm:justify-start gap-2 bg-eu-orange text-white px-5 py-3 rounded-lg font-bold text-sm hover:bg-eu-purple transition-colors border-none cursor-pointer shrink-0 w-full sm:w-auto">
        <i data-lucide="plus" class="w-4 h-4"></i> ${pickLang(submitButton.label, mT?.publishChallenge || 'Publicar reto')}
      </button>` : ''}
    </div>
  </div>

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
              ${Object.entries(contributionTypes).map(([k, v]) => `<option value="${k}">${v}</option>`).join('')}
            </select>
          </div>
          <div>
            <label for="mp-sf-route" class="block text-[13px] font-bold text-eu-text mb-1">${formLabels.route || 'Ruta'} *</label>
            <select id="mp-sf-route" class="w-full border border-eu-border rounded-md p-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-eu-blue focus:border-eu-blue">
              ${Object.entries(routeOptions).map(([k, v]) => `<option value="${k}">${v}</option>`).join('')}
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
        <div><label for="mp-sf-evidence" class="block text-[13px] font-bold text-eu-text mb-1">${formLabels.evidenceExpected || 'Evidencia esperada'}</label><input id="mp-sf-evidence" type="text" class="w-full border border-eu-border rounded-md p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-eu-blue focus:border-eu-blue" placeholder="${formPlaceholders.evidenceExpected || ''}"></div>
        <div><label for="mp-sf-return" class="block text-[13px] font-bold text-eu-text mb-1">${formLabels.stakeholderReturn || 'Valor para tu organización'}</label><input id="mp-sf-return" type="text" class="w-full border border-eu-border rounded-md p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-eu-blue focus:border-eu-blue" placeholder="${formPlaceholders.stakeholderReturn || ''}"></div>
        <div><label for="mp-sf-ethics" class="block text-[13px] font-bold text-eu-text mb-1">${formLabels.ethicsConditions || 'Condiciones de datos / ética'}</label><input id="mp-sf-ethics" type="text" class="w-full border border-eu-border rounded-md p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-eu-blue focus:border-eu-blue" placeholder="RGPD, datos anonimizados, acuerdo de uso..."></div>
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
              ${Object.entries(contributionTypes).map(([k, v]) => `<option value="${k}" ${filters.type === k ? 'selected' : ''}>${v}</option>`).join('')}
            </select>
          </div>
          <div>
            <label class="flex items-center gap-1 text-[12px] font-bold text-gray-500 uppercase mb-1"><i data-lucide="route" class="w-3 h-3"></i> ${mT?.filterRoute || 'Ruta'}</label>
            <select id="mp-filter-route" class="w-full border border-eu-border rounded-md p-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-eu-blue focus:border-eu-blue">
              <option value="All">${mT?.all || 'Todos'}</option>
              ${Object.entries(routeOptions).map(([k, v]) => `<option value="${k}" ${filters.route === k ? 'selected' : ''}>${v}</option>`).join('')}
            </select>
          </div>
          <div>
            <label class="block text-[12px] font-bold text-gray-500 uppercase mb-1">${mT?.filterStatus || 'Estado'}</label>
            <select id="mp-filter-status" class="w-full border border-eu-border rounded-md p-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-eu-blue focus:border-eu-blue">
              <option value="Todos">${mT?.all || 'Todos'}</option>
              <option value="Abierto" ${filters.status === 'Abierto' ? 'selected' : ''}>${mT?.open || 'Abierto'}</option>
              <option value="En Resolución" ${filters.status === 'En Resolución' ? 'selected' : ''}>${mT?.inProgress || 'En Resolución'}</option>
              <option value="Resuelto" ${filters.status === 'Resuelto' ? 'selected' : ''}>${mT?.resolved || 'Resuelto'}</option>
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
              ${Object.entries(mT?.evidenceMaturityOptions || {}).map(([k, v]) => `<option value="${k}" ${evidenceFilter === k ? 'selected' : ''}>${v}</option>`).join('')}
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Results count -->
    <p class="text-sm text-gray-500 mb-4">${resultsCountTpl}</p>

    <!-- Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
      ${filtered.map(ch => `
      <div class="bg-white rounded-xl border border-eu-border shadow-sm flex flex-col hover:border-eu-blue transition-colors">
        <div class="p-4 sm:p-5 flex-1">
          <div class="flex flex-wrap items-center gap-2 mb-3">
            <span class="text-xs font-extrabold uppercase px-2 py-0.5 rounded bg-eu-blue/10 text-eu-blue">${getContributionTypeLabel(ch.contributionType, mT)}</span>
            <span class="text-xs font-bold px-2 py-0.5 rounded ${STATUS_STYLES[ch.status] || 'bg-gray-100 text-gray-600'}">${getStatusLabel(ch.status, mT)}</span>
          </div>
          <h3 class="font-bold text-eu-text text-sm mb-1 leading-snug line-clamp-2">${ch.title}</h3>
          <p class="text-xs text-gray-500 mb-1 font-semibold truncate">${ch.country} ${ch.entity}</p>
          <p class="text-xs text-gray-500 mb-3 line-clamp-1">${ch.entityType}</p>
          <p class="text-xs text-gray-600 mb-3 line-clamp-2">${ch.description}</p>
          <div class="flex flex-wrap items-center gap-2 mb-3">
            <span class="text-xs font-bold px-2 py-0.5 rounded ${ROUTE_STYLES[ch.route] || 'bg-gray-100 text-gray-600'}">${getRouteLabel(ch.route, mT)}</span>
            <span class="text-xs font-semibold px-2 py-0.5 rounded ${EVIDENCE_STYLES[ch.evidenceMaturity] || 'bg-gray-100 text-gray-600'}">${getEvidenceMaturityLabel(ch.evidenceMaturity, mT)}</span>
          </div>
          <p class="text-xs text-gray-500 mb-3 line-clamp-1"><span class="font-bold">${mT?.evidenceLabel || 'Evidencia'}:</span> ${ch.evidenceExpected}</p>
          <div class="flex flex-wrap gap-1.5 mb-3">
            ${ch.tags.slice(0, 2).map(tag => `<span class="flex items-center gap-1 text-xs bg-eu-bg border border-eu-border px-1.5 py-0.5 rounded text-gray-600 font-semibold"><i data-lucide="tag" class="w-2.5 h-2.5 shrink-0"></i>${tag}</span>`).join('')}
          </div>
          <div class="flex flex-col sm:flex-row sm:items-center gap-2 text-xs text-gray-500">
            <span class="flex items-center gap-1"><i data-lucide="calendar" class="w-3 h-3 shrink-0"></i><span class="truncate">${mT?.deadlineLabel || 'Plazo'}: ${ch.deadline}</span></span>
            <span class="flex items-center gap-1"><i data-lucide="users" class="w-3 h-3 shrink-0"></i>${ch.teams} ${ch.teams === 1 ? (mT?.teamSingular || 'equipo') : (mT?.teamPlural || 'equipos')}</span>
          </div>
        </div>
        <div class="border-t border-eu-border p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 bg-eu-bg">
          <span class="text-xs font-bold text-eu-teal uppercase bg-eu-teal/10 px-2 py-0.5 rounded w-fit">${getSectorLabel(ch.sector, mT)}</span>
          <button class="mp-view-detail text-eu-blue font-bold text-xs bg-transparent border-none cursor-pointer hover:underline text-left sm:text-right" data-id="${ch.id}">
            ${mT?.viewAndApply || 'Ver detalle'} →
          </button>
        </div>
      </div>`).join('')}
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
  const all = getTranslatedChallenges(mT);
  const selectedId = getState('selectedChallengeId');
  if (selectedId) {
    const ch = all.find(c => c.id === selectedId);
    if (ch) return renderDetail(ch, mT);
  }
  return renderList(all, mT);
}

export function mount() {
  const mT = t('marketplace') || {};
  const all = getTranslatedChallenges(mT);

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
