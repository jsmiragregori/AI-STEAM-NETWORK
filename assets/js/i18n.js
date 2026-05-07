import { translations } from '../data/translations.js';

let currentLang = localStorage.getItem('language') || 'es';

export function getLanguage() { return currentLang; }

export function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('language', lang);
  import('./main.js').then(m => m.renderApp());
}

export function t(key) {
  const keys = key.split('.');
  let val = translations[currentLang];
  for (const k of keys) {
    val = val?.[k];
    if (val === undefined) return key;
  }
  return val;
}

export function getLangData() {
  return translations[currentLang];
}
