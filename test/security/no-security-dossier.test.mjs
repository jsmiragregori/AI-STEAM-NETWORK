import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readdir } from 'node:fs/promises';
import test from 'node:test';

const ROOT = new URL('../../', import.meta.url);

// `VAN-4.3` midió que este repositorio es **público** en GitHub y que la rama
// de seguridad publicaba `docs/security/` —incluido el apartado que enumera las
// protecciones que le faltan al servidor de producción—. El expediente se
// trasladó a `AI-STEAM-CONTENT`, cuyo remoto vive en la red local.
//
// Esta guarda no repara el pasado: impide la reincidencia. Documentación de
// análisis de seguridad no vuelve a este árbol, porque este árbol se publica.
const PROHIBIDOS = [
  'docs/security',
  'docs/seguridad',
];

test('el expediente de seguridad no vive en el repositorio publicado', () => {
  const presentes = PROHIBIDOS.filter(ruta => existsSync(new URL(ruta, ROOT)));

  assert.deepEqual(
    presentes,
    [],
    'El expediente de securización pertenece a AI-STEAM-CONTENT (remoto en red ' +
      'local), no a este repositorio, que es público. Ver el checkpoint de ' +
      'VAN-4.3b antes de reintroducir nada bajo docs/.',
  );
});

test('docs/ no reintroduce análisis de seguridad por otra ruta', async () => {
  const docs = new URL('docs/', ROOT);
  if (!existsSync(docs)) return; // sin docs/ no hay nada que revisar

  const entradas = await readdir(docs, { withFileTypes: true });
  const sospechosas = entradas
    .filter(e => e.isDirectory() && /segur|security|hardening/i.test(e.name))
    .map(e => `docs/${e.name}`);

  // Invariante sobre lista, no sobre número: el fallo nombra la carpeta.
  assert.deepEqual(sospechosas, [], 'carpeta de seguridad reintroducida bajo docs/');
});
