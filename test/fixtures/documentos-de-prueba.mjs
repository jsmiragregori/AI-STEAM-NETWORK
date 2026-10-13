// Documentos sintéticos para las pruebas de Gobernanza. No son contenido editorial: existen para
// que cada prueba tenga su propio estado de partida, con un documento de acceso público con adjunto
// y otro de socios con enlace externo.

const traduccion = (texto) => ({ es: texto, en: texto, va: texto });

export function documentosDePrueba() {
  return [
    {
      id: 'prueba-publico-adjunto',
      visible: true,
      order: 1,
      title: traduccion('Documento de prueba público'),
      date: '2026-01-01',
      types: [{ id: 'prueba', label: traduccion('Prueba') }],
      access: 'public',
      icon: 'file-text',
      url: '',
      external: false,
      file: 'prueba-publico.pdf',
      filePublicPath: 'assets/downloads/governance/prueba-publico.pdf',
      linkText: traduccion('Descargar'),
      summary: traduccion('Documento sintético para la prueba del adjunto público.'),
    },
    {
      id: 'prueba-socios-enlace',
      visible: true,
      order: 2,
      title: traduccion('Documento de prueba de socios'),
      date: '2026-01-02',
      types: [{ id: 'prueba', label: traduccion('Prueba') }],
      access: 'partners',
      icon: 'link',
      url: 'https://example.org/prueba-socios',
      external: true,
      file: '',
      filePublicPath: '',
      linkText: traduccion('Ver'),
      summary: traduccion('Documento sintético para la prueba del enlace externo de socios.'),
    },
  ];
}
