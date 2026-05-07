const appState = {
  cookiesAccepted: localStorage.getItem('cookies-accepted') === 'true',
  mobileMenuOpen: false,
  marketplaceFilters: { type: 'all', route: 'all', status: 'all', sector: 'all', search: '' },
  networkTab: 'consorcio',
  networkCountry: 'all',
  knowledgeTab: 'flow',
  knowledgeSearch: '',
  governanceTab: 'estructura',
  trainingTab: 'fp',
  expandedSector: null,
  newsCategoryFilter: 'all',
};

export function getState(key) { return appState[key]; }
export function setState(key, value) { appState[key] = value; }
