import { t } from '../i18n.js';
import { getState, setState } from '../state.js';

// ─── Static data ─────────────────────────────────────────────────────────────

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

const STAKEHOLDERS = [
  { id: 'aesia',        name: 'AESIA – Agencia Española de Supervisión de IA',  type: 'Agencia estatal regulatoria',      sector: 'Transversal',        region: 'Nacional',        category: 'admin'      },
  { id: 'ivace',        name: 'IVACE+i',                                          type: 'Agencia de Innovación Regional',   sector: 'Transversal',        region: 'C. Valenciana',   category: 'admin'      },
  { id: 'dgtic',        name: 'GVA – DGTIC',                                      type: 'Organismo Público',                sector: 'Transversal',        region: 'C. Valenciana',   category: 'admin'      },
  { id: 'lasnaves',     name: 'Las Naves',                                        type: 'Centro de Innovación Urbana',      sector: 'Industria / Energía', region: 'C. Valenciana',  category: 'admin'      },
  { id: 'fedacova',     name: 'FEDACOVA',                                         type: 'Federación Agroalimentaria',       sector: 'Agroalimentario',    region: 'C. Valenciana',   category: 'empresa'    },
  { id: 'avaasaja',     name: 'AVA-ASAJA',                                        type: 'Asociación de Agricultores',       sector: 'Agroalimentario',    region: 'C. Valenciana',   category: 'empresa'    },
  { id: 'femeval',      name: 'FEMEVAL',                                          type: 'Federación Metalúrgica',           sector: 'Manufactura',        region: 'C. Valenciana',   category: 'empresa'    },
  { id: 'ascer',        name: 'ASCER',                                            type: 'Asoc. Fabricantes de Azulejos',    sector: 'Manufactura',        region: 'C. Valenciana',   category: 'empresa'    },
  { id: 'globalomnium', name: 'Global Omnium',                                    type: 'Empresa de Gestión del Agua',      sector: 'Medio Ambiente',     region: 'C. Valenciana',   category: 'empresa'    },
  { id: 'brainstorm',   name: 'Brainstorm Multimedia',                            type: 'Empresa Tecnológica',              sector: 'Turismo y Cultura',  region: 'C. Valenciana',   category: 'empresa'    },
  { id: 'iti',          name: "ITI – Institut Tecnològic d'Informàtica",         type: 'Centro Tecnológico (REDIT)',       sector: 'Transversal',        region: 'C. Valenciana',   category: 'universidad'},
  { id: 'redit',        name: 'REDIT',                                            type: 'Red de Institutos Tecnológicos',   sector: 'Transversal',        region: 'C. Valenciana',   category: 'universidad'},
  { id: 'lafe',         name: 'Hospital Universitario La Fe',                     type: 'Institución Sanitaria Pública',    sector: 'Salud',              region: 'C. Valenciana',   category: 'sociedad'   },
  { id: 'invattur',     name: "INVAT·TUR",                                        type: 'Instituto Tecnologías Turísticas', sector: 'Turismo y Cultura',  region: 'C. Valenciana',   category: 'admin'      },
];

const CATEGORY_META = {
  universidad: { icon: 'graduation-cap', color: 'text-purple-700', bg: 'bg-purple-100', border: 'border-purple-300' },
  empresa:     { icon: 'building-2',     color: 'text-blue-700',   bg: 'bg-blue-100',   border: 'border-blue-300'   },
  admin:       { icon: 'globe',          color: 'text-green-700',  bg: 'bg-green-100',  border: 'border-green-300'  },
  sociedad:    { icon: 'heart-handshake',color: 'text-pink-700',   bg: 'bg-pink-100',   border: 'border-pink-300'   },
};

const STAKEHOLDER_DESCS = {
  aesia:        { es: 'Supervisión regulatoria y ética de la IA en España.',                                             en: 'AI regulatory supervision and ethics in Spain.',                                    va: "Supervisió regulatòria i ética de la IA a Espanya."                                     },
  ivace:        { es: 'Financiación de innovación y enlace con PYMES.',                                                  en: 'Innovation funding and liaison with SMEs.',                                         va: "Finançament d'innovació i enllaç amb PIMEs."                                            },
  dgtic:        { es: 'Dirección General de TIC de la GVA.',                                                             en: 'General Directorate of ICT of the GVA.',                                           va: 'Direcció General de TIC de la GVA.'                                                     },
  lasnaves:     { es: 'Living lab urbano, misiones 2030 de la ciudad de Valencia.',                                      en: 'Urban living lab, 2030 missions of the city of Valencia.',                          va: 'Living lab urbà, missions 2030 de la ciutat de València.'                               },
  fedacova:     { es: 'Agrupa 30 asociaciones de la industria transformadora agroalimentaria.',                          en: 'Groups 30 associations of the agrifood processing industry.',                       va: "Agrupa 30 associacions de la indústria transformadora agroalimentària."                  },
  avaasaja:     { es: 'Digitalización rural y representación de la base productiva agrícola.',                           en: 'Rural digitalization and representation of the agricultural productive base.',       va: 'Digitalització rural i representació de la base productiva agrícola.'                   },
  femeval:      { es: 'Transformación digital del sector metal valenciano.',                                              en: 'Digital transformation of the Valencian metal sector.',                             va: 'Transformació digital del sector metal valencià.'                                       },
  ascer:        { es: 'Clúster cerámico, eficiencia energética e IA en diseño.',                                         en: 'Ceramic cluster, energy efficiency and AI in design.',                              va: 'Clúster ceràmic, eficiència energètica i IA en disseny.'                                },
  globalomnium: { es: 'IA en ciclo integral del agua y gemelos digitales.',                                              en: 'AI in the complete water cycle and digital twins.',                                  va: "IA en cicle integral de l'aigua i bessons digitals."                                    },
  brainstorm:   { es: 'Gráficos 3D en tiempo real y estudios virtuales con IA.',                                         en: 'Real-time 3D graphics and virtual studios with AI.',                                va: 'Gràfics 3D en temps real i estudis virtuals amb IA.'                                    },
  iti:          { es: 'Big Data, IA y coordinador del EDIH valenciano.',                                                  en: 'Big Data, AI and coordinator of the Valencian EDIH.',                               va: "Big Data, IA i coordinador de l'EDIH valencià."                                         },
  redit:        { es: 'Coordinación de 11 centros tecnológicos de la Comunitat Valenciana.',                             en: 'Coordination of 11 technology centers in the Valencian Community.',                 va: 'Coordinació de 11 centres tecnològics de la Comunitat Valenciana.'                      },
  lafe:         { es: 'Referente en IA clínica y datos de salud.',                                                       en: 'Leader in clinical AI and health data.',                                            va: 'Referent en IA clínica i dades de salut.'                                               },
  invattur:     { es: 'Turismo inteligente y analítica de destinos.',                                                    en: 'Smart tourism and destination analytics.',                                          va: 'Turisme intel·ligent i analítica de destinacions.'                                      },
};

const COUNTRIES = [...new Set(PARTNERS.map(p => p.country))];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getLang() {
  return localStorage.getItem('language') || 'es';
}

function getRoleLabel(role, networkT) {
  return networkT?.[role] || role;
}

function getDesc(id) {
  const lang = getLang();
  return STAKEHOLDER_DESCS[id]?.[lang] || '';
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

function helixBlock(networkT) {
  const pc = counts(PARTNERS);
  const sc = counts(STAKEHOLDERS);
  const html = Object.entries(CATEGORY_META).map(([key, meta]) => {
    const total = (pc[key] || 0) + (sc[key] || 0);
    const label = networkT?.categoryLabels?.[key] || key;
    return `
      <div class="${meta.bg} ${meta.border} border rounded-xl p-4 text-center">
        <i data-lucide="${meta.icon}" class="w-6 h-6 ${meta.color} mx-auto mb-2"></i>
        <p class="font-bold text-sm ${meta.color}">${label}</p>
        <p class="text-2xl font-extrabold text-gray-800 mt-1">${total}</p>
        <p class="text-xs text-gray-500 mt-0.5">${pc[key] || 0} ${networkT?.sociosLabel || ''} · ${sc[key] || 0} ${networkT?.stakeholdersLabel || ''}</p>
      </div>
    `;
  }).join('');
  return `
    <div class="bg-white rounded-xl border border-eu-border shadow-sm p-7 mb-8">
      <h2 class="text-xl font-bold text-eu-text mb-2">${networkT?.helixTitle || ''}</h2>
      <p class="text-sm text-gray-600 mb-5 max-w-3xl">${networkT?.helixDesc || ''}</p>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">${html}</div>
    </div>
  `;
}

// ─── Partners tab ─────────────────────────────────────────────────────────────

function tabSocios(networkT, activeCategory, filterCountry) {
  const pc = counts(PARTNERS);

  const filtered = PARTNERS.filter(p =>
    (activeCategory === 'todos' || p.category === activeCategory) &&
    (filterCountry === null || p.country === filterCountry)
  );

  const catFilters = `
    <button data-net-cat="todos" class="px-4 py-1.5 rounded-full text-xs font-bold cursor-pointer border transition-colors ${activeCategory === 'todos' ? 'bg-eu-blue text-white border-eu-blue' : 'bg-white text-eu-text border-eu-border hover:border-eu-blue'}">
      ${networkT?.filterAll || 'Todos'} (${PARTNERS.length})
    </button>
    ${Object.entries(CATEGORY_META).map(([key, meta]) => `
      <button data-net-cat="${key}" class="px-4 py-1.5 rounded-full text-xs font-bold cursor-pointer border transition-colors ${activeCategory === key ? 'bg-eu-blue text-white border-eu-blue' : 'bg-white text-eu-text border-eu-border hover:border-eu-blue'}">
        ${networkT?.categoryLabels?.[key] || key} (${pc[key] || 0})
      </button>
    `).join('')}
  `;

  const cardsHtml = filtered.map(p => {
    const meta = CATEGORY_META[p.category];
    const sectorsHtml = p.sectors.map(s => `<span class="text-xs bg-eu-bg border border-eu-border px-1.5 py-0.5 rounded text-gray-600 font-semibold">${s}</span>`).join('');
    return `
      <div class="bg-white rounded-xl border border-eu-border shadow-sm p-4 hover:border-eu-blue transition-colors">
        <div class="flex items-start justify-between mb-3">
          <div class="w-9 h-9 rounded-lg ${meta.bg} flex items-center justify-center">
            <i data-lucide="${meta.icon}" class="w-4 h-4 ${meta.color}"></i>
          </div>
          <div class="flex items-center gap-1.5">
            <img src="https://flagcdn.com/20x15/${p.country.toLowerCase()}.png" alt="${p.country}" class="rounded-sm" />
            <span class="text-xs bg-eu-blue/10 text-eu-blue font-bold px-1.5 py-0.5 rounded">${networkT?.consortium || 'Consorcio'}</span>
          </div>
        </div>
        <p class="font-bold text-eu-text text-sm leading-snug mb-0.5">${p.name}</p>
        <p class="text-xs font-mono text-gray-500 mb-2">${p.acronym} · ${p.city}</p>
        <p class="text-xs text-eu-teal font-semibold mb-2">${getRoleLabel(p.role, networkT)}</p>
        <div class="flex flex-wrap gap-1">${sectorsHtml}</div>
      </div>
    `;
  }).join('');

  const countryGrid = COUNTRIES.map(c => {
    const cnt = PARTNERS.filter(p => p.country === c).length;
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
  const sc = counts(STAKEHOLDERS);
  const filtered = activeCategory === 'todos'
    ? STAKEHOLDERS
    : STAKEHOLDERS.filter(s => s.category === activeCategory);

  const catFilters = `
    <button data-net-cat="todos" class="px-4 py-1.5 rounded-full text-xs font-bold cursor-pointer border transition-colors ${activeCategory === 'todos' ? 'bg-eu-blue text-white border-eu-blue' : 'bg-white text-eu-text border-eu-border hover:border-eu-blue'}">
      ${networkT?.stakeholdersFilterAll || 'Todos'} (${STAKEHOLDERS.length})
    </button>
    ${Object.entries(CATEGORY_META).filter(([key]) => (sc[key] || 0) > 0).map(([key, meta]) => `
      <button data-net-cat="${key}" class="px-4 py-1.5 rounded-full text-xs font-bold cursor-pointer border transition-colors ${activeCategory === key ? 'bg-eu-blue text-white border-eu-blue' : 'bg-white text-eu-text border-eu-border hover:border-eu-blue'}">
        ${networkT?.categoryLabels?.[key] || key} (${sc[key] || 0})
      </button>
    `).join('')}
  `;

  const cardsHtml = filtered.map(s => {
    const meta = CATEGORY_META[s.category];
    return `
      <div class="bg-white rounded-xl border border-eu-border shadow-sm p-4 hover:border-eu-blue transition-colors">
        <div class="flex items-start justify-between mb-3">
          <div class="w-9 h-9 rounded-lg ${meta.bg} flex items-center justify-center">
            <i data-lucide="${meta.icon}" class="w-4 h-4 ${meta.color}"></i>
          </div>
          <span class="text-xs bg-eu-orange/10 text-eu-orange font-bold px-1.5 py-0.5 rounded">${networkT?.stakeholderBadge || 'Stakeholder'}</span>
        </div>
        <p class="font-bold text-eu-text text-sm leading-snug mb-0.5">${s.name}</p>
        <p class="text-xs text-gray-500 mb-1">${s.type}</p>
        <p class="text-xs text-eu-teal font-semibold mb-2">📍 ${s.region}</p>
        <p class="text-xs text-gray-600 mb-2">${getDesc(s.id)}</p>
        <span class="text-xs bg-eu-bg border border-eu-border px-1.5 py-0.5 rounded text-gray-600 font-semibold">${s.sector}</span>
      </div>
    `;
  }).join('');

  const formHtml = showForm ? `
    <div id="stakeholder-form" class="bg-white rounded-xl border-2 border-eu-orange shadow-sm overflow-hidden mt-8">
      <div class="bg-eu-orange/10 border-b border-eu-orange/30 px-6 py-4 flex items-center gap-3">
        <i data-lucide="user-plus" class="w-5 h-5 text-eu-orange"></i>
        <div>
          <h2 class="text-lg font-bold text-eu-text">${networkT?.formTitle || ''}</h2>
          <p class="text-xs text-gray-600 mt-0.5">${networkT?.formSubtitle || ''}</p>
        </div>
      </div>
      <div class="p-6 bg-eu-bg">
        <p class="text-sm text-gray-600 mb-6 max-w-2xl">${networkT?.formDescription || ''}</p>
        <form id="net-form" class="space-y-5 max-w-2xl">
          <div class="grid grid-cols-1 gap-y-5 gap-x-4 sm:grid-cols-2">
            <div class="sm:col-span-2">
              <label for="net-entity" class="block text-xs font-bold text-eu-text mb-1">${networkT?.formFields?.entityName || ''} *</label>
              <input id="net-entity" type="text" class="w-full border border-eu-border rounded-md p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-eu-blue focus:border-eu-blue bg-white" placeholder="Ej. FEDACOVA, Hospital La Fe..." />
            </div>
            <div>
              <label for="net-category" class="block text-xs font-bold text-eu-text mb-1">${networkT?.formFields?.category || ''} *</label>
              <select id="net-category" class="w-full border border-eu-border rounded-md p-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-eu-blue focus:border-eu-blue">
                <option>${networkT?.categoryOptions?.university || ''}</option>
                <option>${networkT?.categoryOptions?.company || ''}</option>
                <option>${networkT?.categoryOptions?.admin || ''}</option>
                <option>${networkT?.categoryOptions?.civil || ''}</option>
              </select>
            </div>
            <div>
              <label for="net-sector" class="block text-xs font-bold text-eu-text mb-1">${networkT?.formFields?.sector || ''} *</label>
              <select id="net-sector" class="w-full border border-eu-border rounded-md p-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-eu-blue focus:border-eu-blue">
                <option>${networkT?.sectorOptions?.manufacturing || ''}</option>
                <option>${networkT?.sectorOptions?.mobility || ''}</option>
                <option>${networkT?.sectorOptions?.energy || ''}</option>
                <option>${networkT?.sectorOptions?.agrifood || ''}</option>
                <option>${networkT?.sectorOptions?.cci || ''}</option>
                <option>${networkT?.sectorOptions?.housing || ''}</option>
                <option>${networkT?.sectorOptions?.services || ''}</option>
              </select>
            </div>
            <div>
              <label for="net-contact" class="block text-xs font-bold text-eu-text mb-1">${networkT?.formFields?.contact || ''} *</label>
              <input id="net-contact" type="text" class="w-full border border-eu-border rounded-md p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-eu-blue focus:border-eu-blue bg-white" placeholder="Nombre y apellidos" />
            </div>
            <div>
              <label for="net-country" class="block text-xs font-bold text-eu-text mb-1">${networkT?.formFields?.country || ''} *</label>
              <input id="net-country" type="text" class="w-full border border-eu-border rounded-md p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-eu-blue focus:border-eu-blue bg-white" value="España" />
            </div>
            <div>
              <label for="net-region" class="block text-xs font-bold text-eu-text mb-1">${networkT?.formFields?.region || ''} *</label>
              <input id="net-region" type="text" class="w-full border border-eu-border rounded-md p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-eu-blue focus:border-eu-blue bg-white" placeholder="Comunitat Valenciana..." />
            </div>
            <div class="sm:col-span-2">
              <label for="net-email" class="block text-xs font-bold text-eu-text mb-1">${networkT?.formFields?.email || ''} *</label>
              <input id="net-email" type="email" class="w-full border border-eu-border rounded-md p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-eu-blue focus:border-eu-blue bg-white" placeholder="correo@entidad.com" />
            </div>
            <div class="sm:col-span-2">
              <label for="net-contribution" class="block text-xs font-bold text-eu-text mb-1">${networkT?.formFields?.contributionFocus || ''} *</label>
              <select id="net-contribution" class="w-full border border-eu-border rounded-md p-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-eu-blue focus:border-eu-blue">
                <option>${networkT?.contributionOptions?.challenge || ''}</option>
                <option>${networkT?.contributionOptions?.case || ''}</option>
                <option>${networkT?.contributionOptions?.validation || ''}</option>
                <option>${networkT?.contributionOptions?.mentoring || ''}</option>
                <option>${networkT?.contributionOptions?.pilot || ''}</option>
                <option>${networkT?.contributionOptions?.resource || ''}</option>
                <option>${networkT?.contributionOptions?.network || ''}</option>
              </select>
            </div>
            <div class="sm:col-span-2">
              <label for="net-description" class="block text-xs font-bold text-eu-text mb-1">${networkT?.formFields?.description || ''}</label>
              <textarea id="net-description" rows="3" class="w-full border border-eu-border rounded-md p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-eu-blue focus:border-eu-blue bg-white resize-none" placeholder="Describa su entidad e interés en la red AI-STEAM..."></textarea>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <input type="checkbox" id="net-gdpr" class="rounded border-eu-border" />
            <label for="net-gdpr" class="text-xs text-gray-600">
              ${networkT?.acceptTerms || ''} <a href="#" class="text-eu-blue hover:underline">${networkT?.privacyPolicy || ''}</a> ${networkT?.rgpd || ''}
            </label>
          </div>
          <div class="flex justify-end">
            <button type="submit" class="bg-eu-orange text-white px-6 py-2.5 rounded-md font-bold border-none hover:bg-eu-purple transition-colors cursor-pointer">
              ${networkT?.submitBtn || ''}
            </button>
          </div>
        </form>
      </div>
    </div>` : '';

  return `
    <div class="flex items-start justify-between mb-5 flex-wrap gap-4">
      <p class="text-sm text-gray-600 max-w-3xl">${networkT?.stakeholdersDesc || ''}</p>
      <button id="net-toggle-form" class="flex items-center gap-2 bg-eu-orange text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-eu-purple transition-colors border-none cursor-pointer shrink-0">
        <i data-lucide="user-plus" class="w-4 h-4"></i>
        ${showForm ? (networkT?.closeForm || 'Cerrar') : (networkT?.requestMembership || 'Solicitar')}
      </button>
    </div>
    <div class="flex flex-wrap gap-2 mb-5">${catFilters}</div>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">${cardsHtml}</div>
    ${formHtml}
  `;
}

// ─── render / mount ───────────────────────────────────────────────────────────

export function render() {
  const networkT      = t('network') || {};
  const activeTab     = getState('networkTab')      || 'socios';
  const activeCategory= getState('networkCategory') || 'todos';
  const filterCountry = getState('networkCountry');
  const showForm      = getState('networkShowForm') || false;

  const tabBtnClass = (id) => `px-5 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-colors cursor-pointer ${
    activeTab === id ? 'border-eu-blue text-eu-blue' : 'border-transparent text-gray-600 hover:text-eu-text'
  }`;

  const content = activeTab === 'socios'
    ? tabSocios(networkT, activeCategory, filterCountry === null ? null : filterCountry)
    : tabStakeholders(networkT, activeCategory, showForm);

  return `
    <div>
      <!-- Header -->
      <div class="bg-eu-blue text-white px-6 py-12">
        <div class="max-w-7xl mx-auto">
          <h1 class="text-3xl font-extrabold mb-3">${t('network.title') || ''}</h1>
          <p class="text-white/80 max-w-3xl text-base mb-6">${t('network.description') || ''}</p>
          <div class="flex flex-wrap gap-4">
            <div class="bg-white/10 rounded-xl px-5 py-3 text-center">
              <p class="text-2xl font-extrabold text-eu-yellow">${PARTNERS.length}</p>
              <p class="text-xs text-white/70 font-semibold uppercase mt-0.5">${networkT?.stats?.consortiumPartners || ''}</p>
            </div>
            <div class="bg-white/10 rounded-xl px-5 py-3 text-center">
              <p class="text-2xl font-extrabold text-eu-yellow">${STAKEHOLDERS.length}</p>
              <p class="text-xs text-white/70 font-semibold uppercase mt-0.5">${networkT?.stats?.stakeholdersNetwork || ''}</p>
            </div>
            <div class="bg-white/10 rounded-xl px-5 py-3 text-center">
              <p class="text-2xl font-extrabold text-eu-yellow">${COUNTRIES.length}</p>
              <p class="text-xs text-white/70 font-semibold uppercase mt-0.5">${networkT?.stats?.countries || ''}</p>
            </div>
            <div class="bg-white/10 rounded-xl px-5 py-3 text-center">
              <p class="text-2xl font-extrabold text-eu-yellow">${PARTNERS.length + STAKEHOLDERS.length}</p>
              <p class="text-xs text-white/70 font-semibold uppercase mt-0.5">${networkT?.stats?.totalOrganizations || ''}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-6 py-10">
        ${helixBlock(networkT)}

        <!-- Tabs -->
        <div class="flex gap-1 border-b border-eu-border mb-6">
          <button data-net-tab="socios" class="${tabBtnClass('socios')}">
            ${networkT?.partnersTabTitle || 'Socios'} (${PARTNERS.length})
          </button>
          <button data-net-tab="stakeholders" class="${tabBtnClass('stakeholders')}">
            ${networkT?.stakeholdersTabTitle || 'Stakeholders'} (${STAKEHOLDERS.length})
          </button>
        </div>

        ${content}
      </div>
    </div>
  `;
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
