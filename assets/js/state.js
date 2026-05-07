const appState = {
  cookiesAccepted: localStorage.getItem('cookies-accepted') === 'true',
  mobileMenuOpen: false,
  marketplaceFilters: { type: 'all', route: 'all', status: 'all', sector: 'all', search: '' },
  networkTab: 'socios',
  networkCategory: 'todos',
  networkCountry: null,
  networkShowForm: false,
  knowledgeTab: 'flujo',
  knowledgeSearch: '',
  governanceTab: 'estructura',
  trainingTab: 'fp',
  expandedSector: null,
  newsCategoryFilter: null,
  selectedNewsId: null,
};

export function getState(key) { return appState[key]; }
export function setState(key, value) { appState[key] = value; }
