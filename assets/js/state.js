const appState = {
  cookiesAccepted: localStorage.getItem('cookies-accepted') === 'true',
  mobileMenuOpen: false,
  selectedChallengeId: null,
  marketplaceTab: 'mentorings',
  networkTab: 'socios',
  networkCategory: 'todos',
  networkCountry: null,
  networkShowForm: false,
  networkSector: null,
  networkSearch: '',
  networkPage: 0,
  networkPageSize: null,
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
