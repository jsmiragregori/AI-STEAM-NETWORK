// Elementos sintéticos de Marketplace para las pruebas. No son contenido editorial: dos elementos por
// pestaña, con la forma completa del registro (todos los campos del esquema) y valores de prueba.
// Cada prueba los usa como estado de partida propio, en lugar de los del contenido real.

const traduccion = (texto) => ({ es: texto, en: texto, va: texto });

const PESTANAS = {
  challenge: 'challenges',
  case: 'cases',
  mentoring: 'mentorings',
  pilot: 'pilots',
  validation: 'validations',
};

const PREFIJO = { challenge: 'CHA', case: 'CAS', mentoring: 'MEN', pilot: 'PIL', validation: 'VAL' };

// Beneficiarias del primer caso de prueba (su cadena de transferencia las pinta todas).
export const BENEFICIARIAS_DE_PRUEBA = [1, 2, 3, 4].map((n) => `Beneficiaria de prueba ${n}`);

export function elementoDePrueba(tipo, numero) {
  const id = `${tipo}-de-prueba-${numero}`;
  const primero = numero === 1;
  return {
    id,
    code: `${PREFIJO[tipo]}-2026-${String(numero).padStart(3, '0')}`,
    type: tipo,
    tab: PESTANAS[tipo],
    sortDate: '2026-01-01',
    visible: true,
    sourcePath: `contenido-de-prueba/${id}.yml`,
    core: {
      status: '',
      forceOpen: false,
      maturity: '',
      title: traduccion(`Elemento de prueba ${numero} (${tipo})`),
      summary: traduccion('Elemento sintético para la prueba.'),
      entity: { name: 'Entidad de prueba', type: traduccion('Prueba') },
      caseStage: '',
      pilotStage: '',
      executionWindow: null,
      evidenceLevel: '',
      verificationStatus: '',
      sector: primero && tipo === 'challenge' ? 'ene' : '',
      sectors: primero && tipo === 'challenge' ? ['ene'] : [],
      stakeholderCategory: '',
      levels: [],
      pilotType: '',
      validationType: '',
      mentoringType: '',
      helix: [],
      relatedDeliverable: '',
      relatedOerId: '',
      publishedAt: '2026-01-01',
      revisionDate: '2026-01-01',
      deadline: '',
      publishedAtLabel: traduccion('Publicado'),
      revisionDateLabel: traduccion('Revisado'),
      deadlineLabel: traduccion('Plazo'),
    },
    ficha: { file: '', publicPath: '' },
    adhesionForm: { url: '' },
    ownership: {
      publisher: { name: 'Editor de prueba', org: 'Organización de prueba' },
      origin: null,
      requester: { name: 'Solicitante de prueba', publicLabel: traduccion('Solicitante') },
      leadTeam: null,
      contact: null,
      beneficiaries: primero && tipo === 'case' ? BENEFICIARIAS_DE_PRUEBA.map((name) => ({ name })) : [],
    },
    classification: {
      aiSteamFocus: [],
      tripleTransition: [],
      policyCluster: [],
      engagementLevel: '',
      evidenceMaturity: '',
      lbdStage: '',
      trackBValue: traduccion('Valor de prueba'),
      verificationStatus: '',
      pilotStatus: '',
      contributionTypes: [],
      audience: [],
      competences: [],
      sdgs: [],
    },
    transfer: { type: '', originOrganization: '', beneficiaryOrganizations: [] },
    community: { tab: '' },
    card: {},
    visibility: {},
    detail: { briefTitle: traduccion('Título breve de prueba'), reward: traduccion('Recompensa de prueba') },
    access: {
      pageVisibility: '',
      pageLicense: '',
      codeLicense: '',
      dataAvailability: '',
      sensitiveDataIncluded: false,
      contributionVisibility: '',
      sensitiveDataPolicy: traduccion('Sin datos sensibles.'),
      rightsNote: traduccion('Nota de prueba.'),
      mentoringRequestAccess: '',
      confidentialityLevel: '',
      publicationNote: traduccion('Nota de publicación de prueba.'),
      publicUrl: '',
      license: '',
      privacyLevel: '',
    },
    trackA: { enabled: false, label: traduccion('Track A'), url: '' },
    trackALink: { enabled: false, label: traduccion('Track A'), url: '' },
    externalFlow: { enabled: false, primaryAction: { label: traduccion('Acción de prueba') } },
  };
}

/** Dos elementos por pestaña, agrupados como los necesita la vista (`items` y `itemsByTab`). */
export function elementosDePrueba() {
  const items = Object.keys(PESTANAS).flatMap((tipo) => [1, 2, 3].map((n) => elementoDePrueba(tipo, n)));
  const itemsByTab = Object.fromEntries(Object.values(PESTANAS).map((tab) => [tab, items.filter((i) => i.tab === tab)]));
  return { items, itemsByTab };
}
