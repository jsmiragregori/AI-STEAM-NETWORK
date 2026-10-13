// Recursos y plantillas sintéticos para las pruebas de Conocimiento. No son contenido editorial: tres
// recursos OER y dos plantillas, con tipos y rutas tomados de las listas de configuración. Los sectores
// son identificadores de prueba: la vista los muestra tal cual cuando no tienen nombre.

const traduccion = (texto) => ({ es: texto, en: texto, va: texto });

export function recursosOerDePrueba(bloque) {
  const tipo = bloque.typeLabels[0].id;
  const base = {
    visible: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
    date: '2026-01-01',
    typeId: tipo,
    levels: [],
    license: 'Prueba',
    author: 'Prueba',
    lang: 'es',
    validationStatus: 'validated',
    duration: '',
    format: 'Prueba',
    url: 'https://example.org/recurso-de-prueba',
    linkType: 'external',
    external: true,
  };
  return [
    { ...base, id: 'oer-de-prueba-a', title: traduccion('Recurso de prueba A'), sectorIds: ['sector-de-prueba-1', 'sector-de-prueba-2'], summary: traduccion('Recurso sintético A.') },
    { ...base, id: 'oer-de-prueba-b', title: traduccion('Recurso de prueba B'), sectorIds: ['sector-de-prueba-2'], summary: traduccion('Recurso sintético B.') },
    { ...base, id: 'oer-de-prueba-c', title: traduccion('Recurso de prueba C'), sectorIds: ['sector-de-prueba-1'], summary: traduccion('Recurso sintético C.') },
  ];
}

export function plantillasDePrueba(bloque) {
  const base = {
    visible: true,
    routeIds: [bloque.routeLabels[0].id],
    license: 'Prueba',
    icon: 'file-text',
    publishedAt: '2026-01-01',
    revisionDate: '2026-01-01',
    date: '2026-01-01',
    url: 'https://example.org/plantilla-de-prueba',
    linkType: 'external',
    external: true,
  };
  return [
    { ...base, id: 'plantilla-de-prueba-a', title: traduccion('Plantilla de prueba A'), description: traduccion('Plantilla sintética A.'), typeId: bloque.typeLabels[0].id },
    { ...base, id: 'plantilla-de-prueba-b', title: traduccion('Plantilla de prueba B'), description: traduccion('Plantilla sintética B.'), typeId: bloque.typeLabels[1].id },
  ];
}
