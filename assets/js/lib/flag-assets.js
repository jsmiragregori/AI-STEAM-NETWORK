import { AVAILABLE_FLAG_CODES } from './available-flags.js';

const AVAILABLE_FLAGS = new Set(AVAILABLE_FLAG_CODES);
const FLAG_CODE_PATTERN = /^[A-Z]{2}$/;
const FLAG_SIZES = new Set(['20x15', '48x36']);
const FALLBACK_PATH = 'assets/flags/neutral.svg';

export function getFlagAssetPath(country, size) {
  const code = typeof country === 'string' ? country.toUpperCase() : '';
  if (!FLAG_SIZES.has(size) || !FLAG_CODE_PATTERN.test(code) || !AVAILABLE_FLAGS.has(code)) {
    return FALLBACK_PATH;
  }
  return `assets/flags/${size}/${code.toLowerCase()}.png`;
}
