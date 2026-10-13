// Cursos sintéticos para las pruebas de Formación. No son contenido editorial: dos cursos por nivel
// (FP, Docentes y Máster), con identificadores de estado, modalidad y sector tomados de las listas de
// configuración. Cada prueba los usa como estado de partida propio.

const traduccion = (texto) => ({ es: texto, en: texto, va: texto });

export function cursosDePrueba(bloque) {
  const estado = bloque.statuses[0].id;
  const modalidad = bloque.modalities[0].id;
  const sector = bloque.sectors[0].id;
  const niveles = ['FP', 'Docentes', 'Máster'];
  return niveles.flatMap((nivel, i) => [1, 2].map((n) => {
    const numero = i * 2 + n;
    return {
      id: `curso-de-prueba-${numero}`,
      code: `CUR-2026-${String(numero).padStart(3, '0')}`,
      externalCode: null,
      codeDisplay: 'internal',
      createdAt: '2026-01-01',
      title: traduccion(`Curso de prueba ${numero}`),
      description: traduccion('Curso sintético para la prueba.'),
      level: nivel,
      statusId: estado,
      hours: 10,
      enrolled: 0,
      sectorIds: [sector],
      modalityId: modalidad,
      skillIds: [],
      tagIds: [],
      link: { url: 'https://example.org/curso-de-prueba', external: false },
    };
  }));
}
