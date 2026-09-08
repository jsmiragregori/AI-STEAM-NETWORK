// Leer localStorage aquí, en el ámbito del módulo, LANZA en navegadores que
// bloquean el almacenamiento, y con ello se cae la carga entera del sitio. Es el
// mismo fallo que se corrigió en i18n.js el 2026-09-07; esta lectura se quedó.
function preferenciaGuardada(clave) {
  try {
    return localStorage.getItem(clave) === 'true';
  } catch {
    return false;
  }
}

const appState = {
  // El aviso de cookies dejó de pedir consentimiento en LG-8: ya no se
  // «acepta», se cierra. La CLAVE de almacenamiento conserva su nombre porque
  // así la enumera la política publicada (ver components/cookie-notice.js).
  cookieNoticeDismissed: preferenciaGuardada('cookies-accepted'),
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
  sectorsScrollTarget: null,
  newsCategoryFilter: null,
  selectedNewsId: null,
};

export function getState(key) { return appState[key]; }
export function setState(key, value) { appState[key] = value; }
