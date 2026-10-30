// P-66 · F3 bis — Estadísticas a cero: regla común de presentación.
//
// Una caja de estadística con valor efectivo cero no se renderiza; vuelve
// automáticamente cuando el valor pasa a no cero. El valor efectivo es el que
// la vista mostraría: los loaders ya resuelven en `value` el cálculo y su
// override, así que aquí no se recalcula ninguna cifra ni se toca ningún dato.
//
// Solo el cero se oculta: el 0 numérico (incluido -0) y las cadenas numéricas
// de cero no vacías ('0', ' 0 ', '0.0'). No se clasifican como cero
// null/undefined, la cadena vacía, los espacios solos ni false: con ellos se
// conserva el comportamiento previo del render. Un texto decorado como '0+'
// tampoco es cero.
//
// La ocultación editorial (`visible: false`) sigue teniendo prioridad: una
// caja oculta por el editor no reaparece aunque su valor sea positivo.

export function isZeroStatValue(value) {
  if (typeof value === 'number') return value === 0;
  if (typeof value !== 'string') return false;
  const text = value.trim();
  if (text === '') return false;
  return Number(text) === 0;
}

// QA-018 (solo portada): un dato ausente (null, undefined, cadena vacía o solo
// espacios) no es una cifra ni pinta caja. Es distinto de cero: el loader de Home
// lo marca como null cuando falta el valor calculado o el manual está vacío. Las
// demás vistas no lo aplican y conservan su comportamiento previo.
export function isAbsentStatValue(value) {
  if (value === null || value === undefined) return true;
  return typeof value === 'string' && value.trim() === '';
}

export function filterVisibleStats(stats) {
  if (!Array.isArray(stats)) return [];
  return stats.filter(stat => stat && stat.visible !== false && !isZeroStatValue(stat.value));
}
