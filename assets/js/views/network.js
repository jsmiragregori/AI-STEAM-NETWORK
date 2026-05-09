import { t } from '../i18n.js';
import { getState, setState } from '../state.js';
import { NETWORK_CONFIG } from '../../data/network.js';

// ── Static data ─────────────────────────────────────────────────────────────

const SECTOR_ICON = {
  mfg:         'factory',
  mob:         'car',
  ene:         'zap',
  agr:         'wheat',
  cci:         'palette',
  hou:         'building',
  nts:         'stethoscope',
  edu:         'graduation-cap',
  health:      'heart-pulse',
  transversal: 'layers',
};

const SECTOR_LABEL = {
  mfg:         { es: 'Manufactura',                       en: 'Manufacturing',                  va: 'Manufactura'                      },
  mob:         { es: 'Movilidad y Transporte',            en: 'Mobility & Transport',           va: 'Mobilitat i Transport'            },
  ene:         { es: 'Energía y Medio Ambiente',          en: 'Energy & Environment',           va: 'Energia i Medi Ambient'           },
  agr:         { es: 'Agroalimentario',                   en: 'Agrifood',                       va: 'Agroalimentari'                   },
  cci:         { es: 'Industrias Culturales y Creativas', en: 'Cultural & Creative Industries', va: 'Indústries Culturals i Creatives' },
  hou:         { es: 'Vivienda',                          en: 'Housing',                        va: 'Habitatge'                        },
  nts:         { es: 'Servicios No Turísticos',           en: 'Non-Tourism Services',           va: 'Serveis No Turístics'             },
  edu:         { es: 'Educación',                         en: 'Education',                      va: 'Educació'                         },
  health:      { es: 'Salud',                             en: 'Health',                         va: 'Salut'                            },
  transversal: { es: 'Transversal',                       en: 'Transversal',                    va: 'Transversal'                      },
};

const PARTNERS = [
  { id: 'uveg',   name: 'Universitat de València',               acronym: 'UVEG',    country: 'ES', city: 'Valencia',        category: 'universidad', sectors: ['Educación', 'Industria'],            role: 'coordinator'   },
  { id: 'umu',    name: 'Universidad de Murcia',                  acronym: 'UMU',     country: 'ES', city: 'Murcia',          category: 'universidad', sectors: ['Salud', 'Educación'],                role: 'beneficiary'   },
  { id: 'upv',    name: 'Universitat Politècnica de València',    acronym: 'UPV',     country: 'ES', city: 'Valencia',        category: 'universidad', sectors: ['Industria', 'Medio Ambiente'],       role: 'beneficiary'   },
  { id: 'ntnu',   name: 'NTNU – Norwegian Univ. of S&T',         acronym: 'NTNU',    country: 'NO', city: 'Trondheim',       category: 'universidad', sectors: ['Industria', 'Medio Ambiente'],       role: 'beneficiary'   },
  { id: 'hsw',    name: 'Hochschule Wismar',                      acronym: 'HSW',     country: 'DE', city: 'Wismar',          category: 'universidad', sectors: ['Industria', 'Educación'],            role: 'beneficiary'   },
  { id: 'fidit',  name: 'Univ. de Rijeka – FIDIT',               acronym: 'FIDIT',   country: 'HR', city: 'Rijeka',          category: 'universidad', sectors: ['Educación', 'Administración'],       role: 'beneficiary'   },
  { id: 'uda',    name: "Univ. Gabriele d'Annunzio",             acronym: "Ud'A",    country: 'IT', city: 'Chieti-Pescara',  category: 'universidad', sectors: ['Salud', 'Industria'],                role: 'beneficiary'   },
  { id: 'esad',   name: 'ESAD Grenoble-Valence',                  acronym: 'ESAD-GV', country: 'FR', city: 'Grenoble',        category: 'universidad', sectors: ['Turismo y Cultura'],                 role: 'beneficiary'   },
  { id: 'inesc',  name: 'INESC TEC',                              acronym: 'INESC',   country: 'PT', city: 'Porto',           category: 'universidad', sectors: ['Industria', 'Medio Ambiente'],       role: 'beneficiary'   },
  { id: 'laurea', name: 'LAUREA University of Applied Sciences',  acronym: 'LAUREA',  country: 'FI', city: 'Espoo',           category: 'universidad', sectors: ['Educación', 'Industria'],            role: 'beneficiary'   },
  { id: 'ceice',  name: "Conselleria d'Educació (CEICE)",        acronym: 'CEICE',   country: 'ES', city: 'Valencia',        category: 'admin',       sectors: ['Educación', 'Administración'],       role: 'beneficiary'   },
  { id: 'lpga',   name: 'Promoción Las Palmas de GC',             acronym: 'LPGA',    country: 'ES', city: 'Las Palmas',      category: 'admin',       sectors: ['Turismo y Cultura', 'Administración'],role: 'beneficiary'  },
  { id: 'varm',   name: 'Region Värmland',                        acronym: 'VARM',    country: 'SE', city: 'Karlstad',        category: 'admin',       sectors: ['Medio Ambiente', 'Administración'], role: 'beneficiary'   },
  { id: 'preda',  name: 'Agencia Desarrollo Prijedor',            acronym: 'PREDA',   country: 'BA', city: 'Prijedor',        category: 'admin',       sectors: ['Administración', 'Industria'],       role: 'beneficiary'   },
  { id: 'cogn',   name: 'Cognito S.R.L.',                         acronym: 'COGN',    country: 'IT', city: 'Massa',           category: 'empresa',     sectors: ['Industria', 'Educación'],            role: 'beneficiary'   },
  { id: 'tuvit',  name: 'TÜV Thüringen Italia',                   acronym: 'TUV.IT',  country: 'IT', city: 'Collecchio',      category: 'empresa',     sectors: ['Industria'],                         role: 'certification' },
  { id: 'joist',  name: 'The Factory IKE (JOIST)',                acronym: 'JOIST',   country: 'GR', city: 'Larissa',         category: 'empresa',     sectors: ['Industria', 'Turismo y Cultura'],    role: 'beneficiary'   },
  { id: 'clink',  name: 'CulturaLink SL',                         acronym: 'C-LINK',  country: 'ES', city: 'Las Palmas',      category: 'empresa',     sectors: ['Turismo y Cultura'],                 role: 'beneficiary'   },
  { id: 'cink',   name: 'CINK Venturing SL',                      acronym: 'CINK',    country: 'ES', city: 'Madrid',          category: 'empresa',     sectors: ['Industria', 'Agroalimentario'],      role: 'beneficiary'   },
  { id: 'lc',     name: 'The Lisbon Council',                     acronym: 'LC',      country: 'BE', city: 'Bruselas',        category: 'sociedad',    sectors: ['Administración', 'Educación'],       role: 'beneficiary'   },
  { id: 'kea',    name: 'KEA European Affairs',                   acronym: 'KEA',     country: 'BE', city: 'Bruselas',        category: 'sociedad',    sectors: ['Turismo y Cultura'],                 role: 'beneficiary'   },
  { id: 'ife',    name: 'Inspiring Futures Europe',               acronym: 'IF.E',    country: 'ES', city: 'Madrid',          category: 'sociedad',    sectors: ['Educación'],                         role: 'beneficiary'   },
  { id: 'rce',    name: 'Relais Culture Europe',                   acronym: 'RCE',     country: 'FR', city: 'París',           category: 'sociedad',    sectors: ['Turismo y Cultura'],                 role: 'associated'    },
];

const PARTNERS_BLOCK_VISIBLE = NETWORK_CONFIG?.partnersBlock?.visible !== false;
const CMS_PARTNERS = NETWORK_CONFIG?.partnersBlock?.partners || [];
const ACTIVE_PARTNERS = PARTNERS_BLOCK_VISIBLE ? (CMS_PARTNERS.length ? CMS_PARTNERS : PARTNERS) : [];
const SHOW_PARTNERS_TAB = PARTNERS_BLOCK_VISIBLE && ACTIVE_PARTNERS.length > 0;

const STAKEHOLDERS = NETWORK_CONFIG?.stakeholdersBlock?.stakeholders || [];

const CATEGORY_META = {
  universidad: { icon: 'graduation-cap', color: 'text-purple-700', bg: 'bg-purple-100', border: 'border-purple-300' },
  empresa:     { icon: 'building-2',     color: 'text-blue-700',   bg: 'bg-blue-100',   border: 'border-blue-300'   },
  admin:       { icon: 'globe',          color: 'text-green-700',  bg: 'bg-green-100',  border: 'border-green-300'  },
  sociedad:    { icon: 'heart-handshake',color: 'text-pink-700',   bg: 'bg-pink-100',   border: 'border-pink-300'   },
};


const COUNTRIES = [...new Set(ACTIVE_PARTNERS.map(p => p.country))];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getLang() {
  return localStorage.getItem('language') || 'es';
}

function getRoleLabel(role, networkT) {
  return networkT?.[role] || role;
}

function localized(value) {
  const lang = getLang();
  if (typeof value === 'string') return value;
  return value?.[lang] || value?.es || '';
}

function counts(list) {
  return {
    universidad: list.filter(x => x.category === 'universidad').length,
    empresa:     list.filter(x => x.category === 'empresa').length,
    admin:       list.filter(x => x.category === 'admin').length,
    sociedad:    list.filter(x => x.category === 'sociedad').length,
  };
}

// ─── Helix block ─────────────────────────────────────────────────────────────

function helixBlock() {
  if (!NETWORK_CONFIG || !NETWORK_CONFIG.helixBlock) return '';
  const helix = NETWORK_CONFIG.helixBlock;
  if (!helix?.visible) return '';

  const lang = getLang();
  const loc = v => v?.[lang] || v?.es || '';

  const pc = counts(ACTIVE_PARTNERS);
  const sc = counts(STAKEHOLDERS);

  const html = (helix.categories || []).map(cat => {
    const total = (pc[cat.id] || 0) + (sc[cat.id] || 0);
    const detailParts = [
      pc[cat.id] ? `${pc[cat.id]} ${loc({es:'socios',en:'partners',va:'socis'})}` : '',
      sc[cat.id] ? `${sc[cat.id]} ${loc({es:'stakeholders',en:'stakeholders',va:'stakeholders'})}` : '',
    ].filter(Boolean);
    return `
      <div class="${cat.bg} ${cat.border} border rounded-xl p-4 text-center">
        <i data-lucide="${cat.icon}" class="w-6 h-6 ${cat.color} mx-auto mb-2"></i>
        <p class="font-bold text-sm ${cat.color}">${loc(cat.label)}</p>
        <p class="text-2xl font-extrabold text-gray-800 mt-1">${total}</p>
        ${detailParts.length ? `<p class="text-xs text-gray-500 mt-0.5">${detailParts.join(' · ')}</p>` : ''}
      </div>
    `;
  }).join('');

  return `
    <div class="bg-white rounded-xl border border-eu-border shadow-sm p-7 mb-8">
      <h2 class="text-xl font-bold text-eu-text mb-2">${loc(helix.heading)}</h2>
      <p class="text-sm text-gray-600 mb-5 max-w-3xl">${loc(helix.description)}</p>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">${html}</div>
    </div>
  `;
}

// ─── Partners tab ─────────────────────────────────────────────────────────────

function tabSocios(networkT, activeCategory, filterCountry) {
  const pc = counts(ACTIVE_PARTNERS);

  const filtered = ACTIVE_PARTNERS.filter(p =>
    (activeCategory === 'todos' || p.category === activeCategory) &&
    (filterCountry === null || p.country === filterCountry)
  );

  const catFilters = `
    <button data-net-cat="todos" class="px-4 py-1.5 rounded-full text-xs font-bold cursor-pointer border transition-colors ${activeCategory === 'todos' ? 'bg-eu-blue text-white border-eu-blue' : 'bg-white text-eu-text border-eu-border hover:border-eu-blue'}">
      ${networkT?.filterAll || 'Todos'} (${ACTIVE_PARTNERS.length})
    </button>
    ${Object.entries(CATEGORY_META).map(([key, meta]) => `
      <button data-net-cat="${key}" class="px-4 py-1.5 rounded-full text-xs font-bold cursor-pointer border transition-colors ${activeCategory === key ? 'bg-eu-blue text-white border-eu-blue' : 'bg-white text-eu-text border-eu-border hover:border-eu-blue'}">
        ${networkT?.categoryLabels?.[key] || key} (${pc[key] || 0})
      </button>
    `).join('')}
  `;

  const cardsHtml = filtered.map(p => {
    const meta = CATEGORY_META[p.category];
    const sectorsHtml = p.sectors.map(s => `<span class="text-xs bg-eu-bg border border-eu-border px-1.5 py-0.5 rounded text-gray-600 font-semibold">${localized(s)}</span>`).join('');
    const categoryLabel = localized(p.categoryLabel) || networkT?.categoryLabels?.[p.category] || p.category;
    const cardAttrs = p.url ? `href="${p.url}" target="_blank" rel="noopener noreferrer"` : '';
    const cardElement = p.url ? 'a' : 'div';
    return `
      <${cardElement} ${cardAttrs} class="block bg-white rounded-xl border border-eu-border shadow-sm p-4 hover:border-eu-blue hover:shadow-md transition-colors no-underline">
        <div class="flex items-start justify-between mb-3">
          <div class="network-category-tooltip w-9 h-9 rounded-lg ${meta.bg} flex items-center justify-center" data-tooltip="${categoryLabel}" aria-label="${categoryLabel}" tabindex="0">
            <i data-lucide="${meta.icon}" class="w-4 h-4 ${meta.color}"></i>
          </div>
          <div class="flex items-center gap-1.5">
            <img src="https://flagcdn.com/20x15/${p.country.toLowerCase()}.png" alt="${p.country}" class="rounded-sm" />
            <span class="text-xs bg-eu-blue/10 text-eu-blue font-bold px-1.5 py-0.5 rounded">${networkT?.consortium || 'Consorcio'}</span>
          </div>
        </div>
        <p class="font-bold text-eu-text text-sm leading-snug mb-0.5">${localized(p.name)}</p>
        <p class="text-xs font-mono text-gray-500 mb-2">${p.acronym} · ${localized(p.city)}</p>
        <p class="text-xs text-eu-teal font-semibold mb-2">${getRoleLabel(p.role, networkT)}</p>
        <div class="flex flex-wrap gap-1">${sectorsHtml}</div>
      </${cardElement}>
    `;
  }).join('');

  const countryGrid = COUNTRIES.map(c => {
    const cnt = ACTIVE_PARTNERS.filter(p => p.country === c).length;
    const isActive = filterCountry === c;
    const name = networkT?.countryNames?.[c] ?? c;
    return `
      <button data-net-country="${c}" class="rounded-xl p-4 flex flex-col items-center gap-2 border-2 transition-all cursor-pointer text-center ${isActive ? 'bg-eu-blue border-eu-blue shadow-md' : 'bg-eu-bg border-eu-border hover:border-eu-blue hover:shadow-sm'}">
        <img src="https://flagcdn.com/48x36/${c.toLowerCase()}.png" alt="${name}" class="w-10 h-auto rounded-sm shadow-sm" />
        <p class="font-bold text-xs leading-tight ${isActive ? 'text-white' : 'text-eu-text'}">${name}</p>
        <span class="text-xs font-semibold px-2 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-eu-blue/10 text-eu-blue'}">
          ${cnt} ${cnt === 1 ? (networkT?.member || '') : (networkT?.members || '')}
        </span>
      </button>
    `;
  }).join('');

  const filterNote = filterCountry ? `
    <p class="text-xs text-gray-500 mt-4">
      ${networkT?.filteringPartners || ''} <strong>${networkT?.countryNames?.[filterCountry] || filterCountry}</strong>. ${networkT?.resultsMessage || ''}
    </p>` : '';

  return `
    <p class="text-sm text-gray-600 mb-5 max-w-3xl">${networkT?.partnersDesc || ''}</p>
    <div class="flex flex-wrap gap-2 mb-5">${catFilters}</div>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-10">${cardsHtml}</div>
    <div class="bg-white rounded-xl border border-eu-border shadow-sm p-7">
      <div class="flex items-center justify-between mb-5">
        <h2 class="text-xl font-bold text-eu-text flex items-center gap-2">
          <i data-lucide="map-pin" class="w-5 h-5 text-eu-teal"></i>${networkT?.geographicCoverage || ''}
        </h2>
        ${filterCountry ? `<button id="net-clear-country" class="text-xs font-bold text-eu-blue hover:underline cursor-pointer bg-transparent border-none">${networkT?.clearFilter || 'Limpiar'}</button>` : ''}
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">${countryGrid}</div>
      ${filterNote}
    </div>
  `;
}

// ─── Stakeholders tab ─────────────────────────────────────────────────────────

function tabStakeholders(networkT, activeCategory, showForm) {
  const lang = getLang();
  const shBlock = NETWORK_CONFIG?.stakeholdersBlock || {};
  const shTexts = {
    description:       localized(shBlock.description)       || networkT?.stakeholdersDesc || '',
    filterAll:         localized(shBlock.filterAll)         || networkT?.filterAll || 'Todos',
    requestMembership: localized(shBlock.requestMembership) || networkT?.requestMembership || '',
    closeForm:         localized(shBlock.closeForm)         || networkT?.closeForm || '',
    noResults:         localized(shBlock.noResults)         || networkT?.noResults || '',
    form: shBlock.form || {},
  };
  const loc = obj => localized(obj) || '';

  const sc = counts(STAKEHOLDERS);
  const filtered = activeCategory === 'todos'
    ? STAKEHOLDERS
    : STAKEHOLDERS.filter(s => s.category === activeCategory);

  const catFilters = `
    <button data-net-cat="todos" class="px-4 py-1.5 rounded-full text-xs font-bold cursor-pointer border transition-colors ${activeCategory === 'todos' ? 'bg-eu-blue text-white border-eu-blue' : 'bg-white text-eu-text border-eu-border hover:border-eu-blue'}">
      ${shTexts.filterAll} (${STAKEHOLDERS.length})
    </button>
    ${Object.entries(CATEGORY_META).filter(([key]) => (sc[key] || 0) > 0).map(([key, meta]) => `
      <button data-net-cat="${key}" class="px-4 py-1.5 rounded-full text-xs font-bold cursor-pointer border transition-colors ${activeCategory === key ? 'bg-eu-blue text-white border-eu-blue' : 'bg-white text-eu-text border-eu-border hover:border-eu-blue'}">
        ${networkT?.categoryLabels?.[key] || key} (${sc[key] || 0})
      </button>
    `).join('')}
  `;

  const cardsHtml = filtered.map(s => {
    const meta = CATEGORY_META[s.category] || CATEGORY_META.sociedad;
    const sectorIcon = SECTOR_ICON[s.primarySector] || 'layers';
    const sectorTooltip = localized(SECTOR_LABEL[s.primarySector] || { es: s.primarySector, en: s.primarySector, va: s.primarySector });
    const description = s.description?.[lang] || s.description?.es || '';
    const categoryLabel = localized(s.categoryLabel) || networkT?.categoryLabels?.[s.category] || s.category;
    // Todos los sectores (principal + secundarios) sin duplicados, con nombre localizado
    const allSectors = [s.primarySector, ...(s.sectors || [])].filter(Boolean).filter((v, i, a) => a.indexOf(v) === i);
    const sectorPills = allSectors.map(sec => {
      const label = localized(SECTOR_LABEL[sec] || { es: sec, en: sec, va: sec });
      return `<span class="text-xs bg-eu-bg border border-eu-border px-1.5 py-0.5 rounded text-gray-600 font-semibold">${label}</span>`;
    }).join('');
    const cardAttrs = s.website ? `href="${s.website}" target="_blank" rel="noopener noreferrer"` : '';
    const cardElement = s.website ? 'a' : 'div';
    return `
      <${cardElement} ${cardAttrs} class="block bg-white rounded-xl border border-eu-border shadow-sm p-4 hover:border-eu-blue hover:shadow-md transition-colors no-underline">
        <div class="flex items-start justify-between mb-3">
          <div class="network-category-tooltip w-9 h-9 rounded-lg ${meta.bg} flex items-center justify-center" data-tooltip="${sectorTooltip}" aria-label="${sectorTooltip}" tabindex="0">
            <i data-lucide="${sectorIcon}" class="w-4 h-4 ${meta.color}"></i>
          </div>
          <div class="network-category-tooltip flex items-center gap-1.5 ${meta.bg} ${meta.border} border rounded-full px-2 py-0.5" data-tooltip="${categoryLabel}" aria-label="${categoryLabel}" tabindex="0">
            <i data-lucide="${meta.icon}" class="w-3 h-3 ${meta.color}"></i>
            <span class="text-xs font-bold ${meta.color}">${categoryLabel}</span>
          </div>
        </div>
        <p class="font-bold text-eu-text text-sm leading-snug mb-0.5">${localized(s.name)}</p>
        ${s.region ? `<p class="text-xs text-eu-teal font-semibold mb-2">📍 ${localized(s.region)}</p>` : ''}
        ${description ? `<p class="text-xs text-gray-600 mb-2">${description}</p>` : ''}
        ${sectorPills ? `<div class="flex flex-wrap gap-1 mt-2">${sectorPills}</div>` : ''}
      </${cardElement}>
    `;
  }).join('');

  const f = shTexts.form;
  const formHtml = showForm ? `
    <div id="stakeholder-form" class="bg-white rounded-xl border-2 border-eu-orange shadow-sm overflow-hidden mt-8">
      <div class="bg-eu-orange/10 border-b border-eu-orange/30 px-6 py-4 flex items-center gap-3">
        <i data-lucide="user-plus" class="w-5 h-5 text-eu-orange"></i>
        <div>
          <h2 class="text-lg font-bold text-eu-text">${loc(f.title)}</h2>
          <p class="text-xs text-gray-600 mt-0.5">${loc(f.subtitle)}</p>
        </div>
      </div>
      <div class="p-6 bg-eu-bg">
        <p class="text-sm text-gray-600 mb-6 max-w-2xl">${loc(f.description)}</p>
        <form id="net-form" class="space-y-5 max-w-2xl">
          <div class="grid grid-cols-1 gap-y-5 gap-x-4 sm:grid-cols-2">
            <div class="sm:col-span-2">
              <label for="net-entity" class="block text-xs font-bold text-eu-text mb-1">${loc(f.fields?.entityName)} *</label>
              <input id="net-entity" type="text" class="w-full border border-eu-border rounded-md p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-eu-blue focus:border-eu-blue bg-white" placeholder="Ej. FEDACOVA, Hospital La Fe..." />
            </div>
            <div>
              <label for="net-category" class="block text-xs font-bold text-eu-text mb-1">${loc(f.fields?.category)} *</label>
              <select id="net-category" class="w-full border border-eu-border rounded-md p-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-eu-blue focus:border-eu-blue">
                <option>${loc(f.categoryOptions?.university)}</option>
                <option>${loc(f.categoryOptions?.company)}</option>
                <option>${loc(f.categoryOptions?.admin)}</option>
                <option>${loc(f.categoryOptions?.civil)}</option>
              </select>
            </div>
            <div>
              <label for="net-sector" class="block text-xs font-bold text-eu-text mb-1">${loc(f.fields?.sector)} *</label>
              <select id="net-sector" class="w-full border border-eu-border rounded-md p-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-eu-blue focus:border-eu-blue">
                <option>${loc(f.sectorOptions?.manufacturing)}</option>
                <option>${loc(f.sectorOptions?.mobility)}</option>
                <option>${loc(f.sectorOptions?.energy)}</option>
                <option>${loc(f.sectorOptions?.agrifood)}</option>
                <option>${loc(f.sectorOptions?.cci)}</option>
                <option>${loc(f.sectorOptions?.housing)}</option>
                <option>${loc(f.sectorOptions?.services)}</option>
              </select>
            </div>
            <div>
              <label for="net-contact" class="block text-xs font-bold text-eu-text mb-1">${loc(f.fields?.contact)} *</label>
              <input id="net-contact" type="text" class="w-full border border-eu-border rounded-md p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-eu-blue focus:border-eu-blue bg-white" placeholder="Nombre y apellidos" />
            </div>
            <div>
              <label for="net-country" class="block text-xs font-bold text-eu-text mb-1">${loc(f.fields?.country)} *</label>
              <input id="net-country" type="text" class="w-full border border-eu-border rounded-md p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-eu-blue focus:border-eu-blue bg-white" value="España" />
            </div>
            <div>
              <label for="net-region" class="block text-xs font-bold text-eu-text mb-1">${loc(f.fields?.region)} *</label>
              <input id="net-region" type="text" class="w-full border border-eu-border rounded-md p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-eu-blue focus:border-eu-blue bg-white" placeholder="Comunitat Valenciana..." />
            </div>
            <div class="sm:col-span-2">
              <label for="net-email" class="block text-xs font-bold text-eu-text mb-1">${loc(f.fields?.email)} *</label>
              <input id="net-email" type="email" class="w-full border border-eu-border rounded-md p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-eu-blue focus:border-eu-blue bg-white" placeholder="correo@entidad.com" />
            </div>
            <div class="sm:col-span-2">
              <label for="net-contribution" class="block text-xs font-bold text-eu-text mb-1">${loc(f.fields?.contributionFocus)} *</label>
              <select id="net-contribution" class="w-full border border-eu-border rounded-md p-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-eu-blue focus:border-eu-blue">
                <option>${loc(f.contributionOptions?.challenge)}</option>
                <option>${loc(f.contributionOptions?.case)}</option>
                <option>${loc(f.contributionOptions?.validation)}</option>
                <option>${loc(f.contributionOptions?.mentoring)}</option>
                <option>${loc(f.contributionOptions?.pilot)}</option>
                <option>${loc(f.contributionOptions?.resource)}</option>
                <option>${loc(f.contributionOptions?.network)}</option>
              </select>
            </div>
            <div class="sm:col-span-2">
              <label for="net-description" class="block text-xs font-bold text-eu-text mb-1">${loc(f.fields?.description)}</label>
              <textarea id="net-description" rows="3" class="w-full border border-eu-border rounded-md p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-eu-blue focus:border-eu-blue bg-white resize-none" placeholder="Describa su entidad e interés en la red AI-STEAM..."></textarea>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <input type="checkbox" id="net-gdpr" class="rounded border-eu-border" />
            <label for="net-gdpr" class="text-xs text-gray-600">
              ${loc(f.acceptTerms)} <a href="#" class="text-eu-blue hover:underline">${loc(f.privacyPolicy)}</a> ${loc(f.rgpd)}
            </label>
          </div>
          <div class="flex justify-end">
            <button type="submit" class="bg-eu-orange text-white px-6 py-2.5 rounded-md font-bold border-none hover:bg-eu-purple transition-colors cursor-pointer">
              ${loc(f.submitBtn)}
            </button>
          </div>
        </form>
      </div>
    </div>` : '';

  return `
    <div class="flex items-start justify-between mb-5 flex-wrap gap-4">
      <p class="text-sm text-gray-600 max-w-3xl">${shTexts.description}</p>
      <button id="net-toggle-form" class="flex items-center gap-2 bg-eu-orange text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-eu-purple transition-colors border-none cursor-pointer shrink-0">
        <i data-lucide="user-plus" class="w-4 h-4"></i>
        ${showForm ? shTexts.closeForm : shTexts.requestMembership}
      </button>
    </div>
    <div class="flex flex-wrap gap-2 mb-5">${catFilters}</div>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">${cardsHtml}</div>
    ${formHtml}
  `;
}

// ─── Network hero (CMS) ───────────────────────────────────────────────────────

function renderNetworkHero() {
  if (!NETWORK_CONFIG || !NETWORK_CONFIG.heroBlock) return '';
  const hero = NETWORK_CONFIG.heroBlock;
  if (!hero?.visible) return '';

  const lang = getLang();
  const title = hero.title?.[lang] || hero.title?.es || '';
  const description = hero.description?.[lang] || hero.description?.es || '';

  const statsHtml = (hero.stats || []).map(s => `
    <div class="bg-white/10 rounded-xl px-5 py-3 text-center">
      <p class="text-2xl font-extrabold text-eu-yellow">${s.value}</p>
      <p class="text-xs text-white/70 font-semibold uppercase mt-0.5">${s.label?.[lang] || s.label?.es || ''}</p>
    </div>`
  ).join('');

  return `
    <div class="bg-eu-blue text-white px-6 py-12">
      <div class="max-w-7xl mx-auto">
        <h1 class="text-3xl font-extrabold mb-3">${title}</h1>
        <p class="text-white/80 max-w-3xl text-base mb-6">${description}</p>
        <div class="flex flex-wrap gap-4">${statsHtml}</div>
      </div>
    </div>`;
}

// ─── render / mount ───────────────────────────────────────────────────────────

export function render() {
  try {
    const networkT      = t('network') || {};
    const requestedTab  = getState('networkTab')      || 'socios';
    const activeTab     = requestedTab === 'socios' && !SHOW_PARTNERS_TAB ? 'stakeholders' : requestedTab;
    const activeCategory= getState('networkCategory') || 'todos';
    const filterCountry = getState('networkCountry');
    const showForm      = getState('networkShowForm') || false;

    const tabBtnClass = (id) => `px-5 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-colors cursor-pointer ${
      activeTab === id ? 'border-eu-blue text-eu-blue' : 'border-transparent text-gray-600 hover:text-eu-text'
    }`;

    const content = activeTab === 'socios' && SHOW_PARTNERS_TAB
      ? tabSocios(networkT, activeCategory, filterCountry === null ? null : filterCountry)
      : tabStakeholders(networkT, activeCategory, showForm);
    const partnersTab = SHOW_PARTNERS_TAB ? `
          <button data-net-tab="socios" class="${tabBtnClass('socios')}">
            ${networkT?.partnersTabTitle || 'Socios'} (${ACTIVE_PARTNERS.length})
          </button>
    ` : '';

    return `
    <div>
      <!-- Header -->
      ${renderNetworkHero()}

      <div class="max-w-7xl mx-auto px-6 py-10">
        ${helixBlock()}

        <!-- Tabs -->
        <div class="flex gap-1 border-b border-eu-border mb-6">
          ${partnersTab}
          <button data-net-tab="stakeholders" class="${tabBtnClass('stakeholders')}">
            ${localized(NETWORK_CONFIG?.stakeholdersBlock?.tabTitle) || networkT?.stakeholdersTabTitle || 'Stakeholders'} (${STAKEHOLDERS.length})
          </button>
        </div>

        ${content}
      </div>
    </div>
    `;
  } catch (error) {
    console.error('❌ Error rendering network view:', error);
    return `<div class="p-6"><p class="text-red-600">Error al cargar la sección Red. Revisa la consola.</p><pre>${error.message}</pre></div>`;
  }
}

function rerender() {
  const main = document.getElementById('main-root');
  main.innerHTML = render();
  mount();
  if (window.lucide) window.lucide.createIcons();
}

export function mount() {
  // Tab switch
  document.querySelectorAll('[data-net-tab]').forEach(btn => {
    btn.addEventListener('click', () => {
      setState('networkTab', btn.dataset.netTab);
      setState('networkCategory', 'todos');
      setState('networkCountry', null);
      rerender();
    });
  });

  // Category filter (socios + stakeholders)
  document.querySelectorAll('[data-net-cat]').forEach(btn => {
    btn.addEventListener('click', () => {
      setState('networkCategory', btn.dataset.netCat);
      rerender();
    });
  });

  // Country filter
  document.querySelectorAll('[data-net-country]').forEach(btn => {
    btn.addEventListener('click', () => {
      const current = getState('networkCountry');
      setState('networkCountry', current === btn.dataset.netCountry ? null : btn.dataset.netCountry);
      setState('networkCategory', 'todos');
      rerender();
    });
  });

  // Clear country
  document.getElementById('net-clear-country')?.addEventListener('click', () => {
    setState('networkCountry', null);
    setState('networkCategory', 'todos');
    rerender();
  });

  // Toggle form
  document.getElementById('net-toggle-form')?.addEventListener('click', () => {
    setState('networkShowForm', !getState('networkShowForm'));
    rerender();
    if (getState('networkShowForm')) {
      setTimeout(() => document.getElementById('stakeholder-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
    }
  });

  // Form submit
  document.getElementById('net-form')?.addEventListener('submit', e => e.preventDefault());
}
