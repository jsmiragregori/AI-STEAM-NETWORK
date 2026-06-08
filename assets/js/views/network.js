import { getState, setState } from '../state.js';
import { NETWORK_CONFIG } from '../../data/network.js';

// ── Static data ─────────────────────────────────────────────────────────────

// Iconos representativos por sector, alineados con sectors.js
const SECTOR_ICON = {
  mfg: 'factory',      // Manufactura
  mob: 'car',          // Movilidad y Transporte
  ene: 'zap',          // Energía y Medio Ambiente
  agr: 'wheat',        // Agroalimentario
  cci: 'palette',      // Industrias Culturales y Creativas
  hou: 'home',         // Vivienda
  nts: 'briefcase',    // Servicios No Turísticos
};

const SECTOR_LABEL = {
  mfg: { es: 'Manufactura',                       en: 'Manufacturing',                  va: 'Manufactura'                      },
  mob: { es: 'Movilidad y Transporte',            en: 'Mobility & Transport',           va: 'Mobilitat i Transport'            },
  ene: { es: 'Energía y Medio Ambiente',          en: 'Energy & Environment',           va: 'Energia i Medi Ambient'           },
  agr: { es: 'Agroalimentario',                   en: 'Agrifood',                       va: 'Agroalimentari'                   },
  cci: { es: 'Industrias Culturales y Creativas', en: 'Cultural & Creative Industries', va: 'Indústries Culturals i Creatives' },
  hou: { es: 'Vivienda',                          en: 'Housing',                        va: 'Habitatge'                        },
  nts: { es: 'Servicios No Turísticos',           en: 'Non-Tourism Services',           va: 'Serveis No Turístics'             },
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

// Cuádruple hélice homogeneizada a la paleta corporativa (Blue/Purple).
// Sin verdes/rosas: la distinción se mantiene con icono + alternancia azul/púrpura.
const CATEGORY_META = {
  universidad: { icon: 'graduation-cap', color: 'text-eu-purple', bg: 'bg-eu-purple/10', border: 'border-eu-purple/25' },
  empresa:     { icon: 'building-2',     color: 'text-eu-blue',   bg: 'bg-eu-blue/10',   border: 'border-eu-blue/25'   },
  admin:       { icon: 'globe',          color: 'text-eu-blue',   bg: 'bg-eu-blue/10',   border: 'border-eu-blue/25'   },
  sociedad:    { icon: 'heart-handshake',color: 'text-eu-purple', bg: 'bg-eu-purple/10', border: 'border-eu-purple/25' },
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
    const meta = CATEGORY_META[cat.id] || CATEGORY_META.sociedad;
    const total = (pc[cat.id] || 0) + (sc[cat.id] || 0);
    const detailParts = [
      pc[cat.id] ? `${pc[cat.id]} ${loc({es:'socios',en:'partners',va:'socis'})}` : '',
      sc[cat.id] ? `${sc[cat.id]} ${loc({es:'stakeholders',en:'stakeholders',va:'stakeholders'})}` : '',
    ].filter(Boolean);
    return `
      <div class="rd-card rd-card-grad-violet rd-card-edge p-5 text-center group">
        <div class="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" style="background:#ffffff"><i data-lucide="${meta.icon}" class="w-6 h-6 ${meta.color}"></i></div>
        <p class="font-extrabold text-base ${meta.color}">${loc(cat.label)}</p>
        <p class="text-3xl font-extrabold text-eu-text mt-1">${total}</p>
        ${detailParts.length ? `<p class="text-sm text-gray-500 mt-0.5">${detailParts.join(' · ')}</p>` : ''}
      </div>
    `;
  }).join('');

  return `
    <div class="rd-card rd-card-accent rd-pad mb-8 rd-card-grad-beige">
      <h2 class="text-2xl font-extrabold text-eu-purple mb-2">${loc(helix.heading)}</h2>
      <p class="text-lg text-gray-600 mb-6 max-w-3xl leading-relaxed">${loc(helix.description)}</p>
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
    <button data-net-cat="todos" class="px-4 py-1.5 rounded-full text-sm font-bold cursor-pointer border transition-colors ${activeCategory === 'todos' ? 'bg-eu-blue text-white border-eu-blue' : 'bg-eu-yellow/70 text-eu-purple border-eu-yellow hover:bg-eu-yellow'}">
      ${loc(pb.filterAll) || 'Todos'} (${ACTIVE_PARTNERS.length})
    </button>
    ${Object.entries(CATEGORY_META).map(([key, meta]) => `
      <button data-net-cat="${key}" class="px-4 py-1.5 rounded-full text-sm font-bold cursor-pointer border transition-colors ${activeCategory === key ? 'bg-eu-blue text-white border-eu-blue' : 'bg-eu-yellow/70 text-eu-purple border-eu-yellow hover:bg-eu-yellow'}">
        ${getCategoryLabel(key)} (${pc[key] || 0})
      </button>
    `).join('')}
  `;

  const LOGO_BASE = 'assets/images/partners/';
  const partnerCv        = pb.chipVisibility || {};
  const pShowCategory    = partnerCv.category !== false;
  const pShowSectors     = partnerCv.sectors  !== false;
  const pShowRole        = partnerCv.role     !== false;
  const cardsHtml = filtered.map(p => {
    const meta = CATEGORY_META[p.category];
    const sectorsHtml = p.sectors.map(s => `<span class="text-sm px-2 py-0.5 rounded-full font-bold" style="background:rgb(86 32 246/.10); color:#5620F6">${localized(s)}</span>`).join('');
    const categoryLabel = localized(p.categoryLabel) || getCategoryLabel(p.category);
    const roleLabel = loc(pb.roleLabels?.[p.role]) || p.role;
    const consortiumLabel = loc(pb.consortium) || 'CONSORCIO';
    const visitLabel = loc(pb.visitSite) || 'Visit website';
    const logoHtml = p.logo
      ? `<img src="${LOGO_BASE}${p.logo}" alt="${p.acronym}" class="max-h-12 max-w-[160px] w-auto h-auto object-contain" loading="lazy" />`
      : `<div class="network-category-tooltip w-12 h-12 rounded-xl ${meta.bg} flex items-center justify-center" data-tooltip="${categoryLabel}" aria-label="${categoryLabel}"><i data-lucide="${meta.icon}" class="w-6 h-6 ${meta.color}"></i></div>`;
    const visitLinkHtml = p.url ? `
      <div class="border-t border-eu-purple/10 px-4 py-3">
        <a href="${p.url}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 text-sm font-bold text-eu-blue hover:text-eu-purple transition-colors">
          <i data-lucide="external-link" class="w-3.5 h-3.5"></i>${visitLabel}
        </a>
      </div>` : '';
    return `
      <div class="rd-card rd-card-grad-violet rd-card-edge flex flex-col overflow-hidden">
        <!-- Logo area -->
        <div class="flex items-center justify-center bg-white border-b border-eu-purple/10 h-24 px-6 py-4">
          ${logoHtml}
        </div>
        <!-- Meta: categoría (línea 1) · bandera + consorcio (línea 2) -->
        <div class="px-4 pt-3 pb-2 flex flex-col gap-1.5">
          ${pShowCategory ? `<div class="network-category-tooltip flex items-center gap-1.5 min-w-0" data-tooltip="${categoryLabel}" aria-label="${categoryLabel}" tabindex="0">
            <div class="w-5 h-5 rounded ${meta.bg} flex items-center justify-center shrink-0">
              <i data-lucide="${meta.icon}" class="w-3 h-3 ${meta.color}"></i>
            </div>
            <span class="text-sm text-gray-500 font-medium truncate">${categoryLabel}</span>
          </div>` : ''}
          <div class="flex items-center gap-1.5">
            <img src="https://flagcdn.com/20x15/${p.country.toLowerCase()}.png" alt="${p.country}" class="rounded-sm" />
            <span class="text-xs bg-eu-blue/10 text-eu-blue font-bold px-1.5 py-0.5 rounded">${consortiumLabel}</span>
          </div>
        </div>
        <!-- Nombre + info + sectores -->
        <div class="px-4 pb-4 flex-1 flex flex-col">
          <p class="font-extrabold text-eu-purple text-base leading-snug mb-0.5">${localized(p.name)}</p>
          <p class="text-sm text-gray-500 mb-1">${p.acronym} · ${localized(p.city)}</p>
          ${pShowRole ? `<p class="text-sm text-eu-blue font-bold mb-3">${roleLabel}</p>` : ''}
          ${pShowSectors ? `<div class="flex flex-wrap gap-1.5 mt-auto">${sectorsHtml}</div>` : ''}
        </div>
        ${visitLinkHtml}
      </div>
    `;
  }).join('');

  const getCountryName = c => loc(pb.countryNames?.[c]) || c;

  const countryGrid = COUNTRIES.map(c => {
    const cnt = ACTIVE_PARTNERS.filter(p => p.country === c).length;
    const isActive = filterCountry === c;
    const name = getCountryName(c);
    return `
      <button data-net-country="${c}" class="rd-card rd-card-grad-violet rd-card-edge p-4 flex flex-col items-center gap-2 cursor-pointer text-center ${isActive ? 'ring-2 ring-eu-blue' : ''}">
        <img src="https://flagcdn.com/48x36/${c.toLowerCase()}.png" alt="${name}" class="w-10 h-auto rounded-sm shadow-sm" />
        <p class="font-bold text-sm leading-tight text-eu-text">${name}</p>
        <span class="text-sm font-bold px-2 py-0.5 rounded-full bg-eu-blue/10 text-eu-blue">
          ${cnt} ${cnt === 1 ? (loc(pb.member) || '') : (loc(pb.members) || '')}
        </span>
      </button>
    `;
  }).join('');

  const filterNote = filterCountry ? `
    <p class="text-sm text-gray-500 mt-4">
      ${loc(pb.filteringPartners)} <strong>${getCountryName(filterCountry)}</strong>. ${loc(pb.resultsMessage)}
    </p>` : '';

  return `
    <p class="text-lg text-gray-600 mb-5 max-w-3xl leading-relaxed">${loc(pb.description)}</p>
    <div class="flex flex-wrap gap-2 mb-5">${catFilters}</div>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-10">${cardsHtml}</div>
    <div class="rd-card rd-card-accent rd-pad rd-card-grad-beige">
      <div class="flex items-center justify-between mb-5">
        <h2 class="text-2xl font-extrabold text-eu-purple flex items-center gap-2">
          <i data-lucide="map-pin" class="w-5 h-5 text-eu-blue"></i>${loc(pb.geographicCoverage)}
        </h2>
        ${filterCountry ? `<button id="net-clear-country" class="text-sm font-bold text-eu-blue hover:text-eu-purple transition-colors cursor-pointer bg-transparent border-none">${loc(pb.clearFilter) || '✕'}</button>` : ''}
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
  const formVisible = shBlock.formVisible !== false;
  const membershipCtasVisible = formVisible && shBlock.membershipCtasVisible !== false;
  const effectiveShowForm = formVisible && showForm;
  const showToggleButton = formVisible;

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
  const formHtml = effectiveShowForm ? `
    <div id="stakeholder-form" class="rd-card overflow-hidden mt-8" style="border:2px solid rgb(86 32 246/.3)">
      <div class="px-6 py-4 flex items-center gap-3" style="background:#5222B0">
        <i data-lucide="user-plus" class="w-5 h-5 text-white"></i>
        <div>
          <h2 class="text-lg font-extrabold text-white">${loc(f.title)}</h2>
          <p class="text-sm mt-0.5" style="color:rgba(255,255,255,.85)">${loc(f.subtitle)}</p>
        </div>
      </div>
      <div class="p-6 rd-card-grad-beige">
        <p class="text-base text-gray-600 mb-6 max-w-2xl leading-relaxed">${loc(f.description)}</p>
        <form id="net-form" class="space-y-5 max-w-2xl">
          <div class="grid grid-cols-1 gap-y-5 gap-x-4 sm:grid-cols-2">
            <div class="sm:col-span-2">
              <label for="net-entity" class="block text-sm font-bold text-eu-text mb-1">${loc(f.fields?.entityName)} *</label>
              <input id="net-entity" type="text" class="w-full rounded-md p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-eu-blue focus:border-eu-blue bg-white" style="border:1px solid rgb(73 24 173/.2)" placeholder="Ej. FEDACOVA, Hospital La Fe..." />
            </div>
            <div>
              <label for="net-category" class="block text-sm font-bold text-eu-text mb-1">${loc(f.fields?.category)} *</label>
              <select id="net-category" class="w-full rounded-md p-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-eu-blue focus:border-eu-blue" style="border:1px solid rgb(73 24 173/.2)">
                <option>${loc(f.categoryOptions?.university)}</option>
                <option>${loc(f.categoryOptions?.company)}</option>
                <option>${loc(f.categoryOptions?.admin)}</option>
                <option>${loc(f.categoryOptions?.civil)}</option>
              </select>
            </div>
            <div>
              <label for="net-sector" class="block text-sm font-bold text-eu-text mb-1">${loc(f.fields?.sector)} *</label>
              <select id="net-sector" class="w-full rounded-md p-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-eu-blue focus:border-eu-blue" style="border:1px solid rgb(73 24 173/.2)">
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
              <label for="net-contact" class="block text-sm font-bold text-eu-text mb-1">${loc(f.fields?.contact)} *</label>
              <input id="net-contact" type="text" class="w-full rounded-md p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-eu-blue focus:border-eu-blue bg-white" style="border:1px solid rgb(73 24 173/.2)" placeholder="Nombre y apellidos" />
            </div>
            <div>
              <label for="net-country" class="block text-sm font-bold text-eu-text mb-1">${loc(f.fields?.country)} *</label>
              <input id="net-country" type="text" class="w-full rounded-md p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-eu-blue focus:border-eu-blue bg-white" style="border:1px solid rgb(73 24 173/.2)" value="España" />
            </div>
            <div>
              <label for="net-region" class="block text-sm font-bold text-eu-text mb-1">${loc(f.fields?.region)} *</label>
              <input id="net-region" type="text" class="w-full rounded-md p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-eu-blue focus:border-eu-blue bg-white" style="border:1px solid rgb(73 24 173/.2)" placeholder="Comunitat Valenciana..." />
            </div>
            <div class="sm:col-span-2">
              <label for="net-email" class="block text-sm font-bold text-eu-text mb-1">${loc(f.fields?.email)} *</label>
              <input id="net-email" type="email" class="w-full rounded-md p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-eu-blue focus:border-eu-blue bg-white" style="border:1px solid rgb(73 24 173/.2)" placeholder="correo@entidad.com" />
            </div>
            <div class="sm:col-span-2">
              <label for="net-contribution" class="block text-sm font-bold text-eu-text mb-1">${loc(f.fields?.contributionFocus)} *</label>
              <select id="net-contribution" class="w-full rounded-md p-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-eu-blue focus:border-eu-blue" style="border:1px solid rgb(73 24 173/.2)">
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
              <label for="net-description" class="block text-sm font-bold text-eu-text mb-1">${loc(f.fields?.description)}</label>
              <textarea id="net-description" rows="3" class="w-full rounded-md p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-eu-blue focus:border-eu-blue bg-white resize-none" style="border:1px solid rgb(73 24 173/.2)" placeholder="Describa su entidad e interés en la red AI-STEAM..."></textarea>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <input type="checkbox" id="net-gdpr" class="rounded" style="border:1px solid rgb(73 24 173/.2)" />
            <label for="net-gdpr" class="text-sm text-gray-600">
              ${loc(f.acceptTerms)} <a href="#" class="text-eu-blue hover:underline">${loc(f.privacyPolicy)}</a> ${loc(f.rgpd)}
            </label>
          </div>
          <div class="flex justify-end">
            <button type="submit" class="bg-eu-blue text-white px-6 py-2.5 rounded-full font-bold border-none hover:bg-eu-purple transition-colors cursor-pointer">
              ${loc(f.submitBtn)}
            </button>
          </div>
        </form>
      </div>
    </div>` : '';

  // ── Header bar (description + membership button) ──────────────────────────────
  const headerBar = `
    <div class="flex items-start justify-between mb-5 flex-wrap gap-4">
      <p class="text-lg text-gray-600 max-w-3xl leading-relaxed">${shTexts.description}</p>
      ${showToggleButton ? `<button id="net-toggle-form" class="flex items-center gap-2 bg-eu-blue text-white px-5 py-2.5 rounded-full font-bold text-sm hover:bg-eu-purple transition-colors border-none cursor-pointer shrink-0">
        <i data-lucide="user-plus" class="w-4 h-4"></i>
        ${effectiveShowForm ? shTexts.closeForm : shTexts.requestMembership}
      </button>` : ''}
    </div>`;

  // ── Empty state (no stakeholders at all) ──────────────────────────────────────
  if (STAKEHOLDERS.length === 0) {
    return `
      ${headerBar}
      <div class="rd-card rd-card-accent rd-pad text-center rd-card-grad-beige">
        <i data-lucide="users" class="w-12 h-12 text-eu-purple/40 mx-auto mb-5"></i>
        ${shTexts.emptyStateTitle ? `<h3 class="text-xl font-extrabold text-eu-purple mb-3">${shTexts.emptyStateTitle}</h3>` : ''}
        <p class="text-base text-gray-600 max-w-sm sm:max-w-md mx-auto mb-8 leading-relaxed">${shTexts.emptyState}</p>
        ${formVisible ? `<button id="net-toggle-form-empty" class="inline-flex items-center gap-2 bg-eu-blue text-white px-5 py-2.5 rounded-full font-bold text-sm hover:bg-eu-purple transition-colors border-none cursor-pointer">
          <i data-lucide="user-plus" class="w-4 h-4"></i>
          ${shTexts.requestMembership}
        </button>` : ''}
      </div>
      ${formHtml}`;
  }

  // ── Filters ───────────────────────────────────────────────────────────────────
  const sc = counts(STAKEHOLDERS);

  const catFilters = `
    <button data-net-cat="todos" class="px-4 py-1.5 rounded-full text-sm font-bold cursor-pointer border transition-colors ${activeCategory === 'todos' ? 'bg-eu-blue text-white border-eu-blue' : 'bg-eu-yellow/70 text-eu-purple border-eu-yellow hover:bg-eu-yellow'}">
      ${shTexts.filterAll} (${STAKEHOLDERS.length})
    </button>
    ${Object.entries(CATEGORY_META).filter(([key]) => (sc[key] || 0) > 0).map(([key]) => `
      <button data-net-cat="${key}" class="px-4 py-1.5 rounded-full text-sm font-bold cursor-pointer border transition-colors ${activeCategory === key ? 'bg-eu-blue text-white border-eu-blue' : 'bg-eu-yellow/70 text-eu-purple border-eu-yellow hover:bg-eu-yellow'}">
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
        class="w-full sm:w-72 rounded-full pl-9 pr-4 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-eu-blue focus:border-eu-blue" style="background:#fff;border:1px solid rgb(73 24 173/.2)" />
    </div>`;

  return `
    ${headerBar}
    <div class="flex flex-wrap items-center gap-3 mb-4">
      ${catFilters}
      <div class="ml-auto">${searchBar}</div>
    </div>
    <div id="net-sh-results">
      ${buildShResults({ lang, shTexts, shBlock, pageSize, activeCategory, activeSector, searchQuery, page, pageSizeOptions: shBlock.pageSizeOptions || [12, 24, 48, 96], showAllOption: shBlock.showAllOption !== false })}
    </div>
    ${formHtml}
  `;
}

// ─── Stakeholder results builder (partial update target) ─────────────────────

function buildShResults({ lang, shTexts, shBlock, pageSize, activeCategory, activeSector, searchQuery, page, pageSizeOptions, showAllOption }) {
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

  const shCv          = shBlock.chipVisibility || {};
  const shShowCategory = shCv.category !== false;
  const shShowSectors  = shCv.sectors  !== false;

  const cardsHtml = paged.length === 0
    ? `<div class="col-span-3 py-10 text-center text-base text-gray-500">${shTexts.noResults}</div>`
    : paged.map(s => {
        const meta = CATEGORY_META[s.category] || CATEGORY_META.sociedad;
        const sectorIcon    = SECTOR_ICON[s.primarySector] || 'layers';
        const sectorTooltip = localized(SECTOR_LABEL[s.primarySector] || { es: s.primarySector, en: s.primarySector, va: s.primarySector });
        const description   = s.description?.[lang] || s.description?.es || '';
        const categoryLabel = getCatLabel(s.category);
        const allSectors    = [s.primarySector, ...(s.sectors || [])].filter(Boolean).filter((v, i, a) => a.indexOf(v) === i);

        const sectorPills = shShowSectors ? allSectors.map(sec => {
          const label    = localized(SECTOR_LABEL[sec] || { es: sec, en: sec, va: sec });
          const isActive = activeSector === sec;
          return `<button data-net-sector="${sec}" class="text-sm px-2 py-0.5 rounded-full font-bold cursor-pointer transition-all ${isActive ? 'ring-2 ring-offset-1 ring-eu-blue' : ''}" style="background:rgb(86 32 246/.10); color:#5620F6">${label}</button>`;
        }).join('') : '';

        const webLink = s.website ? `
          <a href="${s.website}" target="_blank" rel="noopener noreferrer" class="mt-3 inline-flex items-center gap-1 text-sm text-eu-blue font-bold hover:text-eu-purple transition-colors">
            <i data-lucide="external-link" class="w-3.5 h-3.5"></i>${shTexts.visitWebLabel}
          </a>` : '';

        return `
          <div class="rd-card rd-card-grad-violet rd-card-edge p-4 flex flex-col group">
            <div class="flex items-start justify-between mb-3">
              <div class="network-category-tooltip w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" style="background:#ffffff" data-tooltip="${sectorTooltip}" aria-label="${sectorTooltip}" tabindex="0">
                <i data-lucide="${sectorIcon}" class="w-4 h-4 ${meta.color}"></i>
              </div>
              ${shShowCategory ? `<div class="network-category-tooltip flex items-center gap-1.5 ${meta.bg} ${meta.border} border rounded-full px-2 py-0.5" data-tooltip="${categoryLabel}" aria-label="${categoryLabel}" tabindex="0">
                <i data-lucide="${meta.icon}" class="w-3 h-3 ${meta.color}"></i>
                <span class="text-xs font-bold ${meta.color}">${categoryLabel}</span>
              </div>` : ''}
            </div>
            <p class="font-extrabold text-eu-purple text-base leading-snug mb-0.5">${localized(s.name)}</p>
            ${s.region ? `<p class="text-sm text-eu-blue font-bold mb-1 inline-flex items-center gap-1"><i data-lucide="map-pin" class="w-3.5 h-3.5"></i>${localized(s.region)}</p>` : ''}
            ${description ? `<p class="text-sm text-gray-600 mb-2 flex-1">${description}</p>` : ''}
            ${sectorPills ? `<div class="flex flex-wrap gap-1.5 mt-auto pt-2">${sectorPills}</div>` : ''}
            ${webLink}
          </div>`;
      }).join('');

  const paginationHtml = !isShowAll && totalPages > 1 ? `
    <div class="flex items-center justify-between mt-6">
      <button id="net-pag-prev" ${safePage === 0 ? 'disabled' : ''} class="px-4 py-1.5 rounded-full text-sm font-bold border border-eu-blue/15 bg-white text-eu-text hover:border-eu-blue disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors">
        ← ${shTexts.paginationPrev}
      </button>
      <span class="text-sm text-gray-500">${safePage + 1} / ${totalPages}</span>
      <button id="net-pag-next" ${safePage >= totalPages - 1 ? 'disabled' : ''} class="px-4 py-1.5 rounded-full text-sm font-bold border border-eu-blue/15 bg-white text-eu-text hover:border-eu-blue disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors">
        ${shTexts.paginationNext} →
      </button>
    </div>` : '';

  const sectorNote = activeSector ? `
    <p class="text-sm text-gray-500 mb-3">
      Sector activo:
      <button data-net-sector="${activeSector}" class="text-eu-blue font-bold hover:text-eu-purple transition-colors cursor-pointer bg-transparent border-none">
        ${localized(SECTOR_LABEL[activeSector] || { es: activeSector })} ✕
      </button>
    </p>` : '';

  const pageSizeSelector = pageSizeOptions && pageSizeOptions.length > 0 ? `
    <div class="flex items-center gap-2 text-sm">
      <span class="text-gray-600">Mostrar:</span>
      <div class="flex gap-1">
        ${pageSizeOptions.map(opt => `
          <button data-net-pagesize="${opt}" class="px-2 py-1 rounded-full border cursor-pointer transition-colors font-bold ${actualPageSize === opt ? 'bg-eu-blue text-white border-eu-blue' : 'bg-white text-gray-700 border-eu-blue/15 hover:border-eu-blue'}">
            ${opt}
          </button>
        `).join('')}
        ${showAllOption ? `
          <button data-net-pagesize="all" class="px-2 py-1 rounded-full border cursor-pointer transition-colors font-bold ${actualPageSize === 'all' ? 'bg-eu-blue text-white border-eu-blue' : 'bg-white text-gray-700 border-eu-blue/15 hover:border-eu-blue'}">
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
    shBlock,
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

  const statsHtml = (hero.stats || []).map((s, i) => `
    <div class="${i % 2 === 0 ? 'rd-hero-stat' : 'rd-hero-stat-alt'} px-6 py-4 text-center">
      <p class="text-3xl font-extrabold text-white leading-none">${s.value}</p>
      <p class="text-xs font-bold uppercase tracking-wider mt-1.5" style="color:rgba(255,244,225,.75)">${s.label?.[lang] || s.label?.es || ''}</p>
    </div>`
  ).join('');

  const eyebrow = hero.eyebrow?.[lang] || hero.eyebrow?.es || 'Red AI-STEAM';

  return `
    <div class="rd-hero-gradient text-white px-6 py-20 relative overflow-hidden">
      <div class="absolute -right-20 -bottom-20 w-80 h-80 bg-white/5 rounded-full blur-2xl"></div>
      <div class="absolute left-10 top-5 w-40 h-40 bg-eu-yellow/5 rounded-full blur-xl"></div>
      <div class="max-w-7xl mx-auto relative z-10">
        <span class="inline-block bg-white/10 border border-white/20 font-bold text-xs uppercase tracking-widest px-4 py-1.5 rounded-full mb-6" style="color:#FFF4E1;backdrop-filter:blur(8px)">${eyebrow}</span>
        <h1 class="font-extrabold mb-6" style="color:#FFF4E1;letter-spacing:-.025em;font-size:clamp(2.5rem,5vw,3.75rem);line-height:1.05;max-width:20ch">${title}</h1>
        <p class="text-lg leading-relaxed max-w-3xl mb-8" style="color:rgba(255,255,255,.9)">${description}</p>
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

    const tabBtnClass = (id) => `flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold cursor-pointer border transition-all whitespace-nowrap ${
      activeTab === id ? 'bg-eu-blue text-white border-eu-blue shadow-sm' : 'bg-eu-yellow/70 text-eu-purple border-eu-yellow hover:bg-eu-yellow hover:border-eu-purple/30'
    }`;

    const pb = NETWORK_CONFIG?.partnersBlock || {};
    const content = activeTab === 'socios' && SHOW_PARTNERS_TAB
      ? tabSocios(activeCategory, filterCountry === null ? null : filterCountry)
      : activeTab === 'stakeholders' && SHOW_STAKEHOLDERS_TAB
        ? tabStakeholders(activeCategory, showForm)
        : '';
    const partnersTab = SHOW_PARTNERS_TAB ? `
          <button data-net-tab="socios" class="${tabBtnClass('socios')}">
            <i data-lucide="network" class="w-4 h-4"></i>${localized(pb.tabTitle) || 'Socios'} (${ACTIVE_PARTNERS.length})
          </button>
    ` : '';
    const stakeholdersTab = SHOW_STAKEHOLDERS_TAB ? `
          <button data-net-tab="stakeholders" class="${tabBtnClass('stakeholders')}">
            <i data-lucide="users" class="w-4 h-4"></i>${localized(NETWORK_CONFIG?.stakeholdersBlock?.tabTitle) || 'Stakeholders'} (${STAKEHOLDERS.length})
          </button>
    ` : '';

    return `
    <div>
      ${renderNetworkHero()}

      <div class="rd-canvas rd-section py-16">
        <div class="max-w-7xl mx-auto px-6">
          ${helixBlock()}

          <div class="flex flex-wrap gap-2 mb-8">
            ${partnersTab}
            ${stakeholdersTab}
          </div>

          ${content}
        </div>
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
