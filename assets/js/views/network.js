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

const STAKEHOLDERS_BLOCK_VISIBLE = NETWORK_CONFIG?.stakeholdersBlock?.visible !== false;
const STAKEHOLDERS = STAKEHOLDERS_BLOCK_VISIBLE ? (NETWORK_CONFIG?.stakeholdersBlock?.stakeholders || []) : [];
const SHOW_STAKEHOLDERS_TAB = STAKEHOLDERS_BLOCK_VISIBLE;

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

function tabSocios(activeCategory, filterCountry) {
  const lang = getLang();
  const pb = NETWORK_CONFIG?.partnersBlock || {};
  const loc = obj => localized(obj) || '';

  const getCategoryLabel = key => {
    const cat = (NETWORK_CONFIG?.helixBlock?.categories || []).find(c => c.id === key);
    return loc(cat?.label) || key;
  };

  const pc = counts(ACTIVE_PARTNERS);

  const filtered = ACTIVE_PARTNERS.filter(p =>
    (activeCategory === 'todos' || p.category === activeCategory) &&
    (filterCountry === null || p.country === filterCountry)
  );

  const catFilters = `
    <button data-net-cat="todos" class="px-4 py-1.5 rounded-full text-xs font-bold cursor-pointer border transition-colors ${activeCategory === 'todos' ? 'bg-eu-blue text-white border-eu-blue' : 'bg-white text-eu-text border-eu-border hover:border-eu-blue'}">
      ${loc(pb.filterAll) || 'Todos'} (${ACTIVE_PARTNERS.length})
    </button>
    ${Object.entries(CATEGORY_META).map(([key, meta]) => `
      <button data-net-cat="${key}" class="px-4 py-1.5 rounded-full text-xs font-bold cursor-pointer border transition-colors ${activeCategory === key ? 'bg-eu-blue text-white border-eu-blue' : 'bg-white text-eu-text border-eu-border hover:border-eu-blue'}">
        ${getCategoryLabel(key)} (${pc[key] || 0})
      </button>
    `).join('')}
  `;

  const cardsHtml = filtered.map(p => {
    const meta = CATEGORY_META[p.category];
    const sectorsHtml = p.sectors.map(s => `<span class="text-xs bg-eu-bg border border-eu-border px-1.5 py-0.5 rounded text-gray-600 font-semibold">${localized(s)}</span>`).join('');
    const categoryLabel = localized(p.categoryLabel) || getCategoryLabel(p.category);
    const roleLabel = loc(pb.roleLabels?.[p.role]) || p.role;
    const consortiumLabel = loc(pb.consortium) || 'CONSORCIO';
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
            <span class="text-xs bg-eu-blue/10 text-eu-blue font-bold px-1.5 py-0.5 rounded">${consortiumLabel}</span>
          </div>
        </div>
        <p class="font-bold text-eu-text text-sm leading-snug mb-0.5">${localized(p.name)}</p>
        <p class="text-xs font-mono text-gray-500 mb-2">${p.acronym} · ${localized(p.city)}</p>
        <p class="text-xs text-eu-teal font-semibold mb-2">${roleLabel}</p>
        <div class="flex flex-wrap gap-1">${sectorsHtml}</div>
      </${cardElement}>
    `;
  }).join('');

  const getCountryName = c => loc(pb.countryNames?.[c]) || c;

  const countryGrid = COUNTRIES.map(c => {
    const cnt = ACTIVE_PARTNERS.filter(p => p.country === c).length;
    const isActive = filterCountry === c;
    const name = getCountryName(c);
    return `
      <button data-net-country="${c}" class="rounded-xl p-4 flex flex-col items-center gap-2 border-2 transition-all cursor-pointer text-center ${isActive ? 'bg-eu-blue border-eu-blue shadow-md' : 'bg-eu-bg border-eu-border hover:border-eu-blue hover:shadow-sm'}">
        <img src="https://flagcdn.com/48x36/${c.toLowerCase()}.png" alt="${name}" class="w-10 h-auto rounded-sm shadow-sm" />
        <p class="font-bold text-xs leading-tight ${isActive ? 'text-white' : 'text-eu-text'}">${name}</p>
        <span class="text-xs font-semibold px-2 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-eu-blue/10 text-eu-blue'}">
          ${cnt} ${cnt === 1 ? (loc(pb.member) || '') : (loc(pb.members) || '')}
        </span>
      </button>
    `;
  }).join('');

  const filterNote = filterCountry ? `
    <p class="text-xs text-gray-500 mt-4">
      ${loc(pb.filteringPartners)} <strong>${getCountryName(filterCountry)}</strong>. ${loc(pb.resultsMessage)}
    </p>` : '';

  return `
    <p class="text-sm text-gray-600 mb-5 max-w-3xl">${loc(pb.description)}</p>
    <div class="flex flex-wrap gap-2 mb-5">${catFilters}</div>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-10">${cardsHtml}</div>
    <div class="bg-white rounded-xl border border-eu-border shadow-sm p-7">
      <div class="flex items-center justify-between mb-5">
        <h2 class="text-xl font-bold text-eu-text flex items-center gap-2">
          <i data-lucide="map-pin" class="w-5 h-5 text-eu-teal"></i>${loc(pb.geographicCoverage)}
        </h2>
        ${filterCountry ? `<button id="net-clear-country" class="text-xs font-bold text-eu-blue hover:underline cursor-pointer bg-transparent border-none">${loc(pb.clearFilter) || '✕'}</button>` : ''}
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">${countryGrid}</div>
      ${filterNote}
    </div>
  `;
}

// ─── Stakeholders tab ─────────────────────────────────────────────────────────

function tabStakeholders(activeCategory, showForm) {
  const lang = getLang();
  const shBlock = NETWORK_CONFIG?.stakeholdersBlock || {};
  const loc = obj => localized(obj) || '';

  const shTexts = {
    description:       loc(shBlock.description),
    filterAll:         loc(shBlock.filterAll)         || 'Todos',
    requestMembership: loc(shBlock.requestMembership) || '',
    closeForm:         loc(shBlock.closeForm)         || '',
    noResults:         loc(shBlock.noResults)         || '',
    emptyState:        loc(shBlock.emptyState)        || '',
    emptyStateTitle:   loc(shBlock.emptyStateTitle)   || '',
    visitWebLabel:     loc(shBlock.visitWebLabel)     || 'Visitar web',
    searchPlaceholder: loc(shBlock.searchPlaceholder) || '',
    paginationPrev:    loc(shBlock.paginationPrev)    || '←',
    paginationNext:    loc(shBlock.paginationNext)    || '→',
    form: shBlock.form || {},
  };
  const pageSize = shBlock.pageSize || 12;

  const getCategoryLabel = key => {
    const cat = (NETWORK_CONFIG?.helixBlock?.categories || []).find(c => c.id === key);
    return loc(cat?.label) || key;
  };

  const activeSector = getState('networkSector');
  const searchQuery  = (getState('networkSearch') || '').toLowerCase().trim();
  const page         = getState('networkPage') || 0;

  // ── Form HTML (shared by empty-state and full view) ──────────────────────────
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

  // ── Header bar (description + membership button) ──────────────────────────────
  const headerBar = `
    <div class="flex items-start justify-between mb-5 flex-wrap gap-4">
      <p class="text-sm text-gray-600 max-w-3xl">${shTexts.description}</p>
      <button id="net-toggle-form" class="flex items-center gap-2 bg-eu-orange text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-eu-purple transition-colors border-none cursor-pointer shrink-0">
        <i data-lucide="user-plus" class="w-4 h-4"></i>
        ${showForm ? shTexts.closeForm : shTexts.requestMembership}
      </button>
    </div>`;

  // ── Empty state (no stakeholders at all) ──────────────────────────────────────
  if (STAKEHOLDERS.length === 0) {
    return `
      ${headerBar}
      <div class="bg-eu-bg border-2 border-dashed border-eu-border rounded-xl px-6 py-12 sm:px-12 sm:py-16 text-center">
        <i data-lucide="users" class="w-12 h-12 text-gray-300 mx-auto mb-5"></i>
        ${shTexts.emptyStateTitle ? `<h3 class="text-base font-bold text-eu-text mb-3">${shTexts.emptyStateTitle}</h3>` : ''}
        <p class="text-sm text-gray-600 max-w-sm sm:max-w-md mx-auto mb-8">${shTexts.emptyState}</p>
        <button id="net-toggle-form-empty" class="inline-flex items-center gap-2 bg-eu-orange text-white px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-eu-purple transition-colors border-none cursor-pointer">
          <i data-lucide="user-plus" class="w-4 h-4"></i>
          ${shTexts.requestMembership}
        </button>
      </div>
      ${formHtml}`;
  }

  // ── Filters ───────────────────────────────────────────────────────────────────
  const sc = counts(STAKEHOLDERS);

  const catFilters = `
    <button data-net-cat="todos" class="px-4 py-1.5 rounded-full text-xs font-bold cursor-pointer border transition-colors ${activeCategory === 'todos' ? 'bg-eu-blue text-white border-eu-blue' : 'bg-white text-eu-text border-eu-border hover:border-eu-blue'}">
      ${shTexts.filterAll} (${STAKEHOLDERS.length})
    </button>
    ${Object.entries(CATEGORY_META).filter(([key]) => (sc[key] || 0) > 0).map(([key]) => `
      <button data-net-cat="${key}" class="px-4 py-1.5 rounded-full text-xs font-bold cursor-pointer border transition-colors ${activeCategory === key ? 'bg-eu-blue text-white border-eu-blue' : 'bg-white text-eu-text border-eu-border hover:border-eu-blue'}">
        ${getCategoryLabel(key)} (${sc[key] || 0})
      </button>
    `).join('')}
  `;

  const searchBar = `
    <div class="relative">
      <i data-lucide="search" class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"></i>
      <input id="net-search"
        type="search"
        value="${(getState('networkSearch') || '').replace(/"/g, '&quot;')}"
        placeholder="${shTexts.searchPlaceholder}"
        class="w-full sm:w-72 border border-eu-border rounded-full pl-9 pr-4 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-eu-blue focus:border-eu-blue bg-white" />
    </div>`;

  return `
    ${headerBar}
    <div class="flex flex-wrap items-center gap-3 mb-4">
      ${catFilters}
      <div class="ml-auto">${searchBar}</div>
    </div>
    <div id="net-sh-results">
      ${buildShResults({ lang, shTexts, pageSize, activeCategory, activeSector, searchQuery, page, pageSizeOptions: shBlock.pageSizeOptions || [12, 24, 48, 96], showAllOption: shBlock.showAllOption !== false })}
    </div>
    ${formHtml}
  `;
}

// ─── Stakeholder results builder (partial update target) ─────────────────────

function buildShResults({ lang, shTexts, pageSize, activeCategory, activeSector, searchQuery, page, pageSizeOptions, showAllOption }) {
  const loc = obj => localized(obj) || '';

  const getCatLabel = key => {
    const cat = (NETWORK_CONFIG?.helixBlock?.categories || []).find(c => c.id === key);
    return loc(cat?.label) || key;
  };

  // Apply all filters FIRST
  const filtered = STAKEHOLDERS.filter(s => {
    if (activeCategory !== 'todos' && s.category !== activeCategory) return false;
    if (activeSector && s.primarySector !== activeSector && !(s.sectors || []).includes(activeSector)) return false;
    if (searchQuery) {
      const haystack = [
        localized(s.name),
        s.description?.[lang] || s.description?.es || '',
        s.region ? localized(s.region) : '',
        s.website || '',
      ].join(' ').toLowerCase();
      if (!haystack.includes(searchQuery)) return false;
    }
    return true;
  });

  // NOW compute pagination based on selected pageSize
  const actualPageSize = getState('networkPageSize') || pageSize;
  const isShowAll = actualPageSize === 'all';

  const totalPages = isShowAll ? 1 : Math.max(1, Math.ceil(filtered.length / actualPageSize));
  const safePage   = isShowAll ? 0 : Math.min(page, totalPages - 1);
  const paged      = isShowAll ? filtered : filtered.slice(safePage * actualPageSize, (safePage + 1) * actualPageSize);

  const cardsHtml = paged.length === 0
    ? `<div class="col-span-3 py-10 text-center text-sm text-gray-500">${shTexts.noResults}</div>`
    : paged.map(s => {
        const meta = CATEGORY_META[s.category] || CATEGORY_META.sociedad;
        const sectorIcon    = SECTOR_ICON[s.primarySector] || 'layers';
        const sectorTooltip = localized(SECTOR_LABEL[s.primarySector] || { es: s.primarySector, en: s.primarySector, va: s.primarySector });
        const description   = s.description?.[lang] || s.description?.es || '';
        const categoryLabel = getCatLabel(s.category);
        const allSectors    = [s.primarySector, ...(s.sectors || [])].filter(Boolean).filter((v, i, a) => a.indexOf(v) === i);

        const sectorPills = allSectors.map(sec => {
          const label    = localized(SECTOR_LABEL[sec] || { es: sec, en: sec, va: sec });
          const isActive = activeSector === sec;
          return `<button data-net-sector="${sec}" class="text-xs px-1.5 py-0.5 rounded border font-semibold cursor-pointer transition-colors ${isActive ? 'bg-eu-blue text-white border-eu-blue' : 'bg-eu-bg border-eu-border text-gray-600 hover:border-eu-blue hover:text-eu-blue'}">${label}</button>`;
        }).join('');

        const webLink = s.website ? `
          <a href="${s.website}" target="_blank" rel="noopener noreferrer" class="mt-3 inline-flex items-center gap-1 text-xs text-eu-blue font-semibold hover:underline">
            <i data-lucide="external-link" class="w-3 h-3"></i>${shTexts.visitWebLabel}
          </a>` : '';

        return `
          <div class="bg-white rounded-xl border border-eu-border shadow-sm p-4 hover:border-eu-blue hover:shadow-md transition-colors flex flex-col">
            <div class="flex items-start justify-between mb-3">
              <div class="network-category-tooltip w-9 h-9 rounded-lg ${meta.bg} flex items-center justify-center shrink-0" data-tooltip="${sectorTooltip}" aria-label="${sectorTooltip}" tabindex="0">
                <i data-lucide="${sectorIcon}" class="w-4 h-4 ${meta.color}"></i>
              </div>
              <div class="network-category-tooltip flex items-center gap-1.5 ${meta.bg} ${meta.border} border rounded-full px-2 py-0.5" data-tooltip="${categoryLabel}" aria-label="${categoryLabel}" tabindex="0">
                <i data-lucide="${meta.icon}" class="w-3 h-3 ${meta.color}"></i>
                <span class="text-xs font-bold ${meta.color}">${categoryLabel}</span>
              </div>
            </div>
            <p class="font-bold text-eu-text text-sm leading-snug mb-0.5">${localized(s.name)}</p>
            ${s.region ? `<p class="text-xs text-eu-teal font-semibold mb-1">📍 ${localized(s.region)}</p>` : ''}
            ${description ? `<p class="text-xs text-gray-600 mb-2 flex-1">${description}</p>` : ''}
            ${sectorPills ? `<div class="flex flex-wrap gap-1 mt-auto pt-2">${sectorPills}</div>` : ''}
            ${webLink}
          </div>`;
      }).join('');

  const paginationHtml = !isShowAll && totalPages > 1 ? `
    <div class="flex items-center justify-between mt-6">
      <button id="net-pag-prev" ${safePage === 0 ? 'disabled' : ''} class="px-4 py-1.5 rounded-lg text-xs font-bold border border-eu-border bg-white text-eu-text hover:border-eu-blue disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors">
        ← ${shTexts.paginationPrev}
      </button>
      <span class="text-xs text-gray-500">${safePage + 1} / ${totalPages}</span>
      <button id="net-pag-next" ${safePage >= totalPages - 1 ? 'disabled' : ''} class="px-4 py-1.5 rounded-lg text-xs font-bold border border-eu-border bg-white text-eu-text hover:border-eu-blue disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors">
        ${shTexts.paginationNext} →
      </button>
    </div>` : '';

  const sectorNote = activeSector ? `
    <p class="text-xs text-gray-500 mb-3">
      Sector activo:
      <button data-net-sector="${activeSector}" class="text-eu-blue font-bold hover:underline cursor-pointer bg-transparent border-none">
        ${localized(SECTOR_LABEL[activeSector] || { es: activeSector })} ✕
      </button>
    </p>` : '';

  const pageSizeSelector = pageSizeOptions && pageSizeOptions.length > 0 ? `
    <div class="flex items-center gap-2 text-xs">
      <span class="text-gray-600">Mostrar:</span>
      <div class="flex gap-1">
        ${pageSizeOptions.map(opt => `
          <button data-net-pagesize="${opt}" class="px-2 py-1 rounded border cursor-pointer transition-colors font-semibold ${actualPageSize === opt ? 'bg-eu-blue text-white border-eu-blue' : 'bg-white text-gray-700 border-eu-border hover:border-eu-blue'}">
            ${opt}
          </button>
        `).join('')}
        ${showAllOption ? `
          <button data-net-pagesize="all" class="px-2 py-1 rounded border cursor-pointer transition-colors font-semibold ${actualPageSize === 'all' ? 'bg-eu-blue text-white border-eu-blue' : 'bg-white text-gray-700 border-eu-border hover:border-eu-blue'}">
            Todos
          </button>
        ` : ''}
      </div>
    </div>` : '';

  return `${sectorNote}<div class="flex justify-end mb-3">${pageSizeSelector}</div><div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-2">${cardsHtml}</div>${paginationHtml}`;
}

function mountShResults() {
  document.querySelectorAll('[data-net-sector]').forEach(btn => {
    btn.addEventListener('click', () => {
      const sec = btn.dataset.netSector;
      setState('networkSector', getState('networkSector') === sec ? null : sec);
      setState('networkPage', 0);
      updateShResults();
    });
  });
  document.querySelectorAll('[data-net-pagesize]').forEach(btn => {
    btn.addEventListener('click', () => {
      const size = btn.dataset.netPagesize === 'all' ? 'all' : parseInt(btn.dataset.netPagesize, 10);
      setState('networkPageSize', size);
      setState('networkPage', 0);
      updateShResults();
    });
  });
  document.getElementById('net-pag-prev')?.addEventListener('click', () => {
    setState('networkPage', Math.max(0, (getState('networkPage') || 0) - 1));
    updateShResults();
  });
  document.getElementById('net-pag-next')?.addEventListener('click', () => {
    setState('networkPage', (getState('networkPage') || 0) + 1);
    updateShResults();
  });
}

function updateShResults() {
  const container = document.getElementById('net-sh-results');
  if (!container) { rerender(); return; }

  const shBlock = NETWORK_CONFIG?.stakeholdersBlock || {};
  const loc     = obj => localized(obj) || '';
  container.innerHTML = buildShResults({
    lang:           getLang(),
    shTexts: {
      noResults:      loc(shBlock.noResults)      || '',
      visitWebLabel:  loc(shBlock.visitWebLabel)  || 'Visitar web',
      paginationPrev: loc(shBlock.paginationPrev) || '←',
      paginationNext: loc(shBlock.paginationNext) || '→',
    },
    pageSize:       shBlock.pageSize || 12,
    activeCategory: getState('networkCategory') || 'todos',
    activeSector:   getState('networkSector'),
    searchQuery:    (getState('networkSearch') || '').toLowerCase().trim(),
    page:           getState('networkPage') || 0,
    pageSizeOptions: shBlock.pageSizeOptions || [12, 24, 48, 96],
    showAllOption:   shBlock.showAllOption !== false,
  });
  if (window.lucide) window.lucide.createIcons();
  mountShResults();
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
    const requestedTab  = getState('networkTab')      || 'socios';
    const activeTab     = requestedTab === 'socios' && !SHOW_PARTNERS_TAB
      ? (SHOW_STAKEHOLDERS_TAB ? 'stakeholders' : null)
      : requestedTab === 'stakeholders' && !SHOW_STAKEHOLDERS_TAB
        ? (SHOW_PARTNERS_TAB ? 'socios' : null)
        : requestedTab;
    const activeCategory= getState('networkCategory') || 'todos';
    const filterCountry = getState('networkCountry');
    const showForm      = getState('networkShowForm') || false;

    const tabBtnClass = (id) => `px-5 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-colors cursor-pointer ${
      activeTab === id ? 'border-eu-blue text-eu-blue' : 'border-transparent text-gray-600 hover:text-eu-text'
    }`;

    const pb = NETWORK_CONFIG?.partnersBlock || {};
    const content = activeTab === 'socios' && SHOW_PARTNERS_TAB
      ? tabSocios(activeCategory, filterCountry === null ? null : filterCountry)
      : activeTab === 'stakeholders' && SHOW_STAKEHOLDERS_TAB
        ? tabStakeholders(activeCategory, showForm)
        : '';
    const partnersTab = SHOW_PARTNERS_TAB ? `
          <button data-net-tab="socios" class="${tabBtnClass('socios')}">
            ${localized(pb.tabTitle) || 'Socios'} (${ACTIVE_PARTNERS.length})
          </button>
    ` : '';
    const stakeholdersTab = SHOW_STAKEHOLDERS_TAB ? `
          <button data-net-tab="stakeholders" class="${tabBtnClass('stakeholders')}">
            ${localized(NETWORK_CONFIG?.stakeholdersBlock?.tabTitle) || 'Stakeholders'} (${STAKEHOLDERS.length})
          </button>
    ` : '';

    return `
    <div>
      ${renderNetworkHero()}

      <div class="max-w-7xl mx-auto px-6 py-10">
        ${helixBlock()}

        <div class="flex gap-1 border-b border-eu-border mb-6">
          ${partnersTab}
          ${stakeholdersTab}
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
      setState('networkSector', null);
      setState('networkSearch', '');
      setState('networkPage', 0);
      rerender();
    });
  });

  // Category filter (socios + stakeholders)
  document.querySelectorAll('[data-net-cat]').forEach(btn => {
    btn.addEventListener('click', () => {
      setState('networkCategory', btn.dataset.netCat);
      setState('networkPage', 0);
      rerender();
    });
  });

  // Country filter (socios)
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

  // Text search — partial update: only replaces #net-sh-results, never the input
  document.getElementById('net-search')?.addEventListener('input', e => {
    setState('networkSearch', e.target.value);
    setState('networkPage', 0);
    updateShResults();
  });

  // Sector pills + pagination inside results — delegated to mountShResults
  mountShResults();

  // Toggle form (header button + empty-state button)
  const toggleForm = () => {
    setState('networkShowForm', !getState('networkShowForm'));
    rerender();
    if (getState('networkShowForm')) {
      setTimeout(() => document.getElementById('stakeholder-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
    }
  };
  document.getElementById('net-toggle-form')?.addEventListener('click', toggleForm);
  document.getElementById('net-toggle-form-empty')?.addEventListener('click', toggleForm);

  // Form submit
  document.getElementById('net-form')?.addEventListener('submit', e => e.preventDefault());

  if (getState('networkTab') === 'stakeholders' && getState('networkShowForm')) {
    setTimeout(() => document.getElementById('stakeholder-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
  }
}
