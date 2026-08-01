import { createHash } from 'node:crypto';
import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { NETWORK_CONFIG } from '../assets/data/network.js';
import { AVAILABLE_FLAG_CODES } from '../assets/js/lib/available-flags.js';
import { getFlagAssetPath } from '../assets/js/lib/flag-assets.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FORBIDDEN_HOSTS = ['unpkg.com', 'fonts.googleapis.com', 'fonts.gstatic.com', 'flagcdn.com'];
const CODE_PATTERN = /^[A-Z]{2}$/;

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function sha256(buffer) {
  return createHash('sha256').update(buffer).digest('hex');
}

function pngDimensions(buffer, label) {
  assert(
    buffer.length >= 24
      && buffer.subarray(0, 8).toString('hex') === '89504e470d0a1a0a'
      && buffer.subarray(12, 16).toString('ascii') === 'IHDR',
    `${label} is not a PNG`,
  );
  return [buffer.readUInt32BE(16), buffer.readUInt32BE(20)];
}

async function verifyLockedFile(entry) {
  const absolutePath = path.join(ROOT, entry.path);
  const buffer = await readFile(absolutePath).catch(() => null);
  assert(buffer, `Missing vendored file: ${entry.path}`);
  assert(buffer.length === entry.size, `${entry.path} has ${buffer.length} bytes; expected ${entry.size}`);
  assert(sha256(buffer) === entry.sha256, `${entry.path} does not match its SHA-256 lock`);
  return buffer;
}

async function textFiles(directory) {
  const output = [];
  for (const item of await readdir(directory, { withFileTypes: true })) {
    const itemPath = path.join(directory, item.name);
    if (item.isDirectory()) output.push(...await textFiles(itemPath));
    if (item.isFile() && /\.(?:css|html|js|mjs)$/.test(item.name)) output.push(itemPath);
  }
  return output;
}

async function main() {
  const manifest = JSON.parse(await readFile(path.join(ROOT, 'assets/vendor-manifest.json'), 'utf8'));
  assert(manifest.schemaVersion === 1, 'Unsupported vendor manifest schema');
  const { lucide, wordcloud2, instrumentSans, flags } = manifest.dependencies || {};
  assert(lucide?.version === '1.24.0', 'Lucide version lock is missing or unexpected');
  assert(wordcloud2?.version === '1.2.3+local.1', 'Wordcloud2 version lock is missing or unexpected');
  assert(wordcloud2?.upstreamVersion === '1.2.3', 'Wordcloud2 upstream version is missing or unexpected');
  assert(wordcloud2?.upstreamGitCommit === 'bce07098d4a7b2c298c1b51715f6370b07d80ef2', 'Wordcloud2 upstream commit is missing or unexpected');
  assert(wordcloud2?.localPatch?.commit === '44edcb5209d8e9df297c88753ab093a08f689fd7', 'Wordcloud2 local patch provenance is missing');
  assert(instrumentSans?.version === 'v4', 'Instrument Sans version lock is missing or unexpected');
  assert(flags?.version === 'snapshot-2026-07-15', 'Flag snapshot version is missing or unexpected');
  assert(flags?.retrievedAt === '2026-07-15', 'Flag retrieval date is missing or unexpected');
  assert(typeof flags?.license === 'string' && flags.license.includes('NOTICE.md'), 'Flag licensing notice is missing');

  for (const dependency of [lucide, wordcloud2, instrumentSans]) {
    for (const entry of dependency.files || []) await verifyLockedFile(entry);
  }
  await verifyLockedFile(flags.fallback);
  await verifyLockedFile(flags.notice);

  const lucideBuffer = await readFile(path.join(ROOT, 'assets/js/lib/lucide.min.js'));
  assert(lucideBuffer.includes('1.24.0'), 'Lucide UMD does not identify version 1.24.0');
  const wordcloudBuffer = await readFile(path.join(ROOT, 'assets/js/lib/wordcloud2.js'));
  assert(wordcloudBuffer.includes('Released under the MIT license'), 'Wordcloud2 license header is missing');
  assert(wordcloudBuffer.includes("typeof settings.rotateRatio === 'function'"), 'Wordcloud2 local rotateRatio patch is missing');

  for (const entry of instrumentSans.files.filter(file => file.path.endsWith('.woff2'))) {
    const buffer = await readFile(path.join(ROOT, entry.path));
    assert(buffer.subarray(0, 4).toString('ascii') === 'wOF2', `${entry.path} is not WOFF2`);
  }

  for (const entry of flags.files || []) {
    const buffer = await verifyLockedFile(entry);
    const dimensions = pngDimensions(buffer, entry.path);
    assert(dimensions[0] === entry.width && dimensions[1] === entry.height, `${entry.path} dimensions differ from the lock`);
  }

  const partnerBlock = NETWORK_CONFIG?.partnersBlock;
  const visibleCountries = partnerBlock?.visible === false
    ? []
    : [...new Set((partnerBlock?.partners || []).map(partner => partner.country))].sort();
  assert(visibleCountries.every(code => typeof code === 'string' && CODE_PATTERN.test(code)), 'Generated network data contains an invalid country code');
  assert(JSON.stringify(visibleCountries) === JSON.stringify(flags.countryCodes), 'Not every visible partner country has locked local flags');
  assert(JSON.stringify(AVAILABLE_FLAG_CODES) === JSON.stringify(flags.countryCodes), 'Runtime flag manifest differs from the vendor lock');
  assert(getFlagAssetPath('ES', '20x15') === 'assets/flags/20x15/es.png', 'Known countries must use local PNG flags');
  assert(getFlagAssetPath('ZZ', '20x15') === 'assets/flags/neutral.svg', 'Unknown countries must use the local fallback');
  assert(getFlagAssetPath('../ES', '20x15') === 'assets/flags/neutral.svg', 'Invalid country codes must not enter asset paths');
  assert(getFlagAssetPath('ES', 'other') === 'assets/flags/neutral.svg', 'Unknown flag sizes must use the local fallback');

  const inputCss = await readFile(path.join(ROOT, 'assets/css/tailwind-input.css'), 'utf8');
  const outputCss = await readFile(path.join(ROOT, 'assets/css/tailwind-output.css'), 'utf8');
  assert((inputCss.match(/@font-face/g) || []).length === 8, 'Tailwind input must contain eight local Instrument Sans faces');
  assert((outputCss.match(/@font-face/g) || []).length === 8, 'Tailwind output must contain eight local Instrument Sans faces');
  assert((outputCss.match(/instrument-sans-v4-latin(?:-ext)?\.woff2/g) || []).length === 8, 'Tailwind output font URLs are incomplete');

  const runtimeFiles = [path.join(ROOT, 'index.html')];
  for (const directory of ['assets/css', 'assets/js']) runtimeFiles.push(...await textFiles(path.join(ROOT, directory)));
  for (const file of runtimeFiles) {
    const contents = await readFile(file, 'utf8');
    for (const host of FORBIDDEN_HOSTS) {
      assert(!contents.includes(host), `${path.relative(ROOT, file)} contains forbidden runtime host ${host}`);
    }
    assert(!/\sonerror\s*=/i.test(contents), `${path.relative(ROOT, file)} contains an inline onerror handler`);
  }

  const requiredLicenses = [
    'assets/js/lib/lucide-LICENSE.txt',
    'assets/js/lib/wordcloud2-LICENSE.txt',
    'assets/fonts/instrument-sans/OFL.txt',
    'THIRD_PARTY_NOTICES.md',
  ];
  for (const relativePath of requiredLicenses) {
    const fileStat = await stat(path.join(ROOT, relativePath)).catch(() => null);
    assert(fileStat?.isFile() && fileStat.size > 0, `Missing required notice or license: ${relativePath}`);
  }

  console.log(`Verified ${flags.files.length + lucide.files.length + wordcloud2.files.length + instrumentSans.files.length + 2} locked files; browser runtime contains no CDN dependencies.`);
}

main().catch(error => {
  console.error(`Vendor verification failed: ${error.message}`);
  process.exitCode = 1;
});
