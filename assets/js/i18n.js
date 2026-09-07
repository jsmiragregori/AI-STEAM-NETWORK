import { translations } from '../data/translations.js';

const LANG_BCP47 = { es: 'es', en: 'en', va: 'ca-valencia' };

// Se lee de forma perezosa y protegida, no en el ámbito del módulo. Leer
// localStorage al importar hacía que cualquiera que importase este fichero
// —o el router, que ahora lo necesita— dependiese de que exista un navegador
// con almacenamiento disponible. También lanzaba en navegadores con las cookies
// de terceros bloqueadas, donde el simple acceso a localStorage tira una
// excepción.
let currentLang = null;

export function getLanguage() {
  if (currentLang === null) currentLang = getStoredLanguage() || 'es';
  return currentLang;
}

// Preferencia guardada, tal cual está en localStorage. La usa el router para
// decidir el idioma al abrir un enlace directo sin prefijo. Devuelve null si no
// hay ninguna: quien llama decide el idioma por defecto, no este módulo.
export function getStoredLanguage() {
  try {
    return localStorage.getItem('language');
  } catch {
    return null; // navegador con almacenamiento bloqueado
  }
}

// Fija el idioma SIN renderizar ni tocar la URL. La usa main.js al arrancar con
// un enlace que trae idioma: en ese momento aún no se ha pintado nada, y volver
// a pintar aquí provocaría el doble render de §6.4.
export function applyLanguage(lang) {
  if (!['es', 'en', 'va'].includes(lang)) return;
  currentLang = lang;
  try { localStorage.setItem('language', lang); } catch { /* sin persistencia */ }
  document.documentElement.lang = LANG_BCP47[lang] || lang;
}

export function setLanguage(lang) {
  applyLanguage(lang);
  import('./main.js').then(m => m.renderApp());
}

export function t(key) {
  const keys = key.split('.');
  let val = translations[getLanguage()];
  for (const k of keys) {
    val = val?.[k];
    if (val === undefined) return key;
  }
  return val;
}

export function getLangData() {
  return translations[getLanguage()];
}
