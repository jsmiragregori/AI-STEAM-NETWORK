// F6 / D10 — renombrado editorial de marca: AI-STEAM -> AiSTEAM y AI-SECRETT -> AiSECRETT.
//
// Cambia lo que se lee, nunca los identificadores. La prueba mira el código fuente de las vistas y
// los datos PUBLICADOS (solo lectura) y fija las dos mitades de la frontera: el texto visible lleva
// la grafía nueva; los nombres de fichero, ids, slugs y hosts conservan la antigua.

import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import test from 'node:test';

const leer = (ruta) => readFile(new URL(`../../${ruta}`, import.meta.url), 'utf8');

test('index.html: el título es AiSTEAM Network y el comentario/identidad no cambia de sitio', async () => {
  const html = await leer('index.html');
  assert.match(html, /<title>AiSTEAM Network<\/title>/);
  assert.ok(!/<title>[^<]*AI-STEAM/.test(html));
});

test('etiquetas «Código AiSTEAM» de las vistas, en ES/EN/VA', async () => {
  for (const vista of ['training', 'knowledge', 'governance']) {
    const src = await leer(`assets/js/views/${vista}.js`);
    assert.ok(src.includes("'Código AiSTEAM'"), `${vista}: es`);
    assert.ok(src.includes("'AiSTEAM code'"), `${vista}: en`);
    assert.ok(src.includes("'Codi AiSTEAM'"), `${vista}: va`);
    assert.ok(!/Código AI-STEAM|AI-STEAM code|Codi AI-STEAM/.test(src), `${vista}: sin la grafía antigua`);
  }
});

test('cabecera: nombres accesibles con la grafía nueva y ficheros de imagen intactos', async () => {
  const src = await leer('assets/js/components/header.js');
  assert.ok(src.includes('aria-label="AiSECRETT — '));
  assert.ok(src.includes('alt="AiSECRETT — '));
  assert.ok(src.includes("esc('AiSTEAM Network')"));
  assert.ok(!/(aria-label|alt)="AI-SECRETT/.test(src));
  for (const f of ['aisecrett-oficial-1x.png', 'aisteam-network-oficial-1x.png']) {
    assert.ok(src.includes(f), `sigue referenciando ${f}`);
    await access(new URL(`../../assets/images/brand/${f}`, import.meta.url));
  }
});

test('vistas de sectores, formación y conocimiento: texto visible con la grafía nueva', async () => {
  const sectors = await leer('assets/js/views/sectors.js');
  assert.ok(sectors.includes('AiSECRETT') && sectors.includes('>AiSTEAM Network</p>'));
  assert.ok(!/AI-SECRETT|AI-STEAM Network/.test(sectors.replace(/\/\/.*$/gm, '')));
  const training = await leer('assets/js/views/training.js');
  assert.ok(training.includes('AiSECRETT') && !/\bAI-SECRETT\b/.test(training));
  const knowledge = await leer('assets/js/views/knowledge.js');
  assert.ok(knowledge.includes('AiSTEAM Network Website'));
});

test('traducciones publicadas: AiSTEAM Network en header y home, en los tres idiomas', async () => {
  const { translations } = await import('../../assets/data/translations.js');
  for (const lang of ['es', 'en', 'va']) {
    assert.equal(translations[lang].header.title, 'AiSTEAM Network', lang);
    assert.equal(translations[lang].home.title, 'AiSTEAM Network', lang);
  }
  assert.match(translations.es.home.heroTagline, /AiSTEAM Network es el ecosistema Track B de CECU para AiSECRETT/);
});

test('identificadores estructurales publicados conservan su grafía', async () => {
  const data = await leer('assets/data/governance.js');
  assert.ok(/\bai-steam-network\b/.test(data), 'el id/slug ai-steam-network no cambia');
  assert.ok(!/AiSTEAM-|AiSECRETT-/.test(data), 'ninguna grafía nueva dentro de un identificador');
});
