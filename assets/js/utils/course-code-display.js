// C13 — Códigos de un curso en la vista pública: qué se muestra y qué se busca.
//
// Lógica pura, sin DOM: la usan la card de Formación y su buscador. El contrato de datos es el de C6/C7:
// `code` (AI-STEAM, obligatorio si el curso es visible), `externalCode` opcional y `codeDisplay`
// (`internal` por defecto, `external` o `both`). El loader ya valida y normaliza; aquí solo se decide la
// presentación, de forma tolerante con datos viejos o manuales:
//
// - un modo desconocido o ausente se trata como `internal` (nunca deja la card sin identificación);
// - `external` o `both` sin externo válido caen a `internal` (el loader no los publica así, pero la vista
//   no debe pintar una card sin identificación si el dato llegara mal);
// - los códigos son texto literal: se recortan y se comparan tal cual, sin interpretar HTML ni convertirlos
//   en URL (eso lo garantiza quien pinta, con `esc`).
//
// La búsqueda usa SIEMPRE los dos identificadores, aunque el modo elegido muestre solo uno.

export const COURSE_CODE_MODES = Object.freeze(['internal', 'external', 'both']);

/** Cadena recortada, o '' si no es texto o queda vacía. */
export function normalizeCourseCode(value) {
  return typeof value === 'string' && value.trim() ? value.trim() : '';
}

/**
 * Códigos que la card debe mostrar, en orden: el AI-STEAM y después el de la formación.
 * Devuelve `[{ kind: 'internal'|'external', value }]`; puede ser vacío si no hay ningún código.
 */
export function resolveCourseCodes(course) {
  const internal = normalizeCourseCode(course?.code);
  const external = normalizeCourseCode(course?.externalCode);
  const rawMode = course?.codeDisplay;
  let mode = COURSE_CODE_MODES.includes(rawMode) ? rawMode : 'internal';
  if ((mode === 'external' || mode === 'both') && !external) mode = 'internal';
  const codes = [];
  if ((mode === 'internal' || mode === 'both') && internal) codes.push({ kind: 'internal', value: internal });
  if ((mode === 'external' || mode === 'both') && external) codes.push({ kind: 'external', value: external });
  return codes;
}

/** Texto para el buscador: los dos identificadores, se muestre uno o los dos. */
export function courseCodeSearchText(course) {
  const internal = normalizeCourseCode(course?.code);
  const external = normalizeCourseCode(course?.externalCode);
  return [internal, external].filter(Boolean).join(' ');
}
