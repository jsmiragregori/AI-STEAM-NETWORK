/**
 * F5 (D9) — Diagnóstico `?diag=cache`.
 *
 * Consulta los activos críticos del sitio con `fetch(..., { cache: 'no-store' })`
 * (petición al navegador de no usar su propia caché; un intermediario puede
 * responder de la suya) y muestra **las cabeceras observadas en crudo**:
 * `Cache-Control`, `Age`, `ETag`, `Last-Modified` y `X-Cache`.
 *
 * Reglas de lectura (no se presenta ninguna como certeza):
 * - «ausente» es un hecho: el servidor no envió esa cabecera en esta respuesta.
 *   No demuestra que no haya caché: puede ser un intermediario que no la anota.
 * - `X-Cache: HIT` (según el producto) indica que un intermediario sirvió de su
 *   caché; su ausencia no decide nada.
 * - Un error de red se distingue de una respuesta HTTP no satisfactoria.
 * - La respuesta observada AHORA no son necesariamente los bytes que cargó esta
 *   página al abrirse: al lado, `performance` muestra lo que el navegador dice
 *   haber cargado.
 *
 * Además: un `index.html` viejo en la caché del navegador no se arregla con
 * huellas —hasta que se revalide el HTML no se ve la URL nueva—; por eso la
 * corrección depende de `Cache-Control: no-cache` en `index.html` y
 * `version.json` (documento para la DGTIC, T5.4).
 */
import { escapeHtml as esc } from './utils/escape-html.js';

const NOMBRES_CABECERA = ['Cache-Control', 'Age', 'ETag', 'Last-Modified', 'X-Cache'];

/** ¿La URL de la página pide el diagnóstico? Solo `diag=cache` exacto. */
export function esDiagCache(search) {
  return /(?:^|[?&])diag=cache(?:$|&)/.test(String(search || ''));
}

/** Pares `{nombre, valor}`; `valor: null` significa cabecera ausente. */
export function formatearCabeceras(cabeceras, nombres = NOMBRES_CABECERA) {
  return nombres.map((nombre) => ({
    nombre,
    valor: cabeceras && typeof cabeceras.get === 'function' ? cabeceras.get(nombre) : null,
  }));
}

/** Lista ordenada de activos críticos declarados en `version.json`. */
export function construirActivosCriticos(version) {
  if (!version || version.schema !== 'ai-steam-build/1') return [];
  const salida = [];
  const sinHuella = (url) => String(url).replace(/\?v=[0-9a-f]{8}$/, '');
  const añadir = (grupo, etiqueta, item) => {
    if (item && typeof item.url === 'string' && item.url) {
      salida.push({ grupo, etiqueta: etiqueta || sinHuella(item.url), url: item.url });
    }
  };
  añadir('entrada', version.entrada ? sinHuella(version.entrada.url) : null, version.entrada);
  for (const [clave, item] of Object.entries(version.modulos || {}).sort(([a], [b]) => a.localeCompare(b))) {
    añadir('modulos', clave, item);
  }
  for (const [clave, item] of Object.entries(version.datos || {}).sort(([a], [b]) => a.localeCompare(b))) {
    añadir('datos', clave, item);
  }
  for (const [clave, item] of Object.entries(version.recursos || {}).sort(([a], [b]) => a.localeCompare(b))) {
    añadir('recursos', clave, item);
  }
  return salida;
}

/** `name` (URL absoluta) → métricas de Resource Timing, para saber qué cargó la página. */
export function resumenCargados(entradas) {
  const mapa = new Map();
  for (const entrada of entradas || []) {
    if (!entrada || !entrada.name) continue;
    mapa.set(entrada.name, {
      transferSize: entrada.transferSize || 0,
      encodedBodySize: entrada.encodedBodySize || 0,
      duration: entrada.duration || 0,
      initiatorType: entrada.initiatorType || '',
    });
  }
  return mapa;
}

async function consultar(url, { json = false } = {}) {
  try {
    const respuesta = await fetch(url, { cache: 'no-store', credentials: 'same-origin' });
    let cuerpo = null;
    if (json) {
      try {
        cuerpo = await respuesta.json();
      } catch {
        cuerpo = null;
      }
    }
    return {
      clase: respuesta.ok ? 'ok' : 'http',
      status: respuesta.status,
      cabeceras: formatearCabeceras(respuesta.headers),
      error: null,
      cuerpo,
    };
  } catch (error) {
    // Distinto de un 4xx/5xx: no hubo respuesta que leer. No se puede concluir
    // nada sobre la caché.
    return { clase: 'red', status: null, cabeceras: [], error: String(error?.message || error), cuerpo: null };
  }
}

function celdaResultado(resultado) {
  if (resultado.clase === 'red') {
    return `<span class="text-red-700 font-semibold">Error de red</span><br><span class="text-xs">${esc(resultado.error)}</span>`;
  }
  if (resultado.clase === 'http') {
    return `<span class="text-amber-700 font-semibold">HTTP ${esc(resultado.status)}</span>`;
  }
  return `<span class="text-green-700 font-semibold">HTTP ${esc(resultado.status)}</span>`;
}

function celdaCargado(entrada) {
  if (!entrada) return '<span class="text-gray-500">No consta en Resource Timing</span>';
  return `transferSize ${esc(entrada.transferSize)} B · encodedBodySize ${esc(entrada.encodedBodySize)} B · ${esc(entrada.initiatorType || '—')} · ${esc(Math.round(entrada.duration))} ms`;
}

function notaVersionHtml(version, consultaVersion) {
  if (version) {
    return `version.json: commit CONTENT ${esc(version.commit?.content || '—')} · commit VANILLA ${esc(version.commit?.vanilla || '—')} · fecha ${esc(version.fecha || '—')}`;
  }
  if (consultaVersion.clase === 'red') {
    return `version.json no se pudo consultar (error de red): ${esc(consultaVersion.error)}`;
  }
  return `version.json no está disponible (HTTP ${esc(consultaVersion.status)}); solo se consultan los activos del HTML. Sin version.json la URL de los datos no consta.`;
}

function fila({ grupo, etiqueta, url, consulta, cargado, esDocumento = false }) {
  const cabeceras = new Map((consulta.cabeceras || []).map((c) => [c.nombre, c.valor]));
  const celdasCabecera = NOMBRES_CABECERA.map((nombre) => {
    const valor = cabeceras.get(nombre);
    return valor === null || valor === undefined
      ? '<td class="px-2 py-1 text-gray-500">ausente</td>'
      : `<td class="px-2 py-1 font-mono text-xs break-all">${esc(valor)}</td>`;
  }).join('');
  return `
    <tr class="border-b align-top">
      <td class="px-2 py-1 text-xs text-gray-500">${esc(grupo)}</td>
      <td class="px-2 py-1 font-mono text-xs break-all">${esc(etiqueta)}</td>
      <td class="px-2 py-1 font-mono text-xs break-all">${esc(url)}</td>
      <td class="px-2 py-1 text-xs">${celdaResultado(consulta)}</td>
      ${celdasCabecera}
      <td class="px-2 py-1 text-xs">${esDocumento ? '<span class="text-gray-500">Es la propia página</span>' : celdaCargado(cargado)}</td>
    </tr>`;
}

function tabla(filas) {
  return `
    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="border-b bg-gray-50">
            <th class="px-2 py-1 text-xs">Grupo</th>
            <th class="px-2 py-1 text-xs">Activo</th>
            <th class="px-2 py-1 text-xs">URL consultada</th>
            <th class="px-2 py-1 text-xs">Resultado</th>
            ${NOMBRES_CABECERA.map((n) => `<th class="px-2 py-1 text-xs">${esc(n)}</th>`).join('')}
            <th class="px-2 py-1 text-xs">Cargado por la página</th>
          </tr>
        </thead>
        <tbody>${filas.join('')}</tbody>
      </table>
    </div>`;
}

function activosDelDom() {
  const urls = new Map();
  for (const nodo of document.querySelectorAll('script[src], link[rel="stylesheet"][href]')) {
    const url = nodo.src || nodo.href;
    if (!url || !url.startsWith(location.origin)) continue;
    urls.set(url, { grupo: 'html', etiqueta: nodo.getAttribute('src') || nodo.getAttribute('href'), url });
  }
  return [...urls.values()];
}

/**
 * Si la página se abrió con `?diag=cache`, sustituye el contenido principal por
 * la tabla del diagnóstico. Si no, no hace nada.
 */
export async function mostrarDiagnosticoCacheSiSePide(raizId = 'main-root') {
  if (!esDiagCache(location.search)) return false;
  const raiz = document.getElementById(raizId);
  if (!raiz) return true;

  raiz.innerHTML = `
    <section class="p-6 max-w-6xl mx-auto">
      <h1 class="text-2xl font-bold mb-2">Diagnóstico de caché (F5)</h1>
      <p class="text-sm text-gray-700 mb-2">
        Cada fila es una consulta nueva con <code>cache: 'no-store'</code>: el navegador no usa su propia
        caché para responderla. Un intermediario (proxy, CDN) sí puede responder de la suya; los valores
        son la respuesta observada ahora, no una garantía de lo que recibirá la próxima visita.
      </p>
      <p class="text-sm text-gray-700 mb-2">
        <strong>«ausente»</strong> significa que el servidor no envió esa cabecera en esta respuesta; no
        demuestra que no haya caché. <strong>X-Cache</strong> solo es concluyente cuando el producto que
        lo emite lo documenta. Un <strong>error de red</strong> no permite concluir nada.
      </p>
      <p class="text-sm text-gray-700 mb-4">
        Un <code>index.html</code> viejo en caché no se corrige con huellas: hasta que el navegador
        revalide el HTML no verá la URL nueva. La corrección depende de <code>Cache-Control: no-cache</code>
        en <code>index.html</code> y <code>version.json</code>, e <code>immutable</code> en las URLs con
        <code>?v=</code>.
      </p>
      <p id="diag-cache-progreso" class="text-sm text-gray-600">Consultando activos…</p>
      <div id="diag-cache-tabla"></div>
    </section>`;

  const progreso = document.getElementById('diag-cache-progreso');
  const contenedor = document.getElementById('diag-cache-tabla');
  const cargados = resumenCargados(performance.getEntriesByType('resource'));

  const documento = {
    grupo: 'html',
    etiqueta: new URL('./index.html', location.href).pathname,
    url: new URL('./index.html', location.href).href,
    esDocumento: true,
  };
  const dom = activosDelDom();
  const consultaVersion = await consultar('./version.json', { json: true });
  const version = consultaVersion.clase === 'ok' && consultaVersion.cuerpo?.schema === 'ai-steam-build/1'
    ? consultaVersion.cuerpo
    : null;
  const declarados = version ? construirActivosCriticos(version) : [];

  const consultas = [documento, ...dom, ...declarados];
  const filasHtml = [];
  const filasVersion = [];
  let indice = 0;
  for (const activo of consultas) {
    indice += 1;
    if (progreso) progreso.textContent = `Consultando ${indice}/${consultas.length}…`;
    const consulta = await consultar(activo.url);
    const urlAbsoluta = activo.esDocumento ? activo.url : new URL(activo.url, location.href).href;
    const filaHtml = fila({
      ...activo,
      consulta,
      cargado: cargados.get(urlAbsoluta),
    });
    (activo.grupo === 'html' ? filasHtml : filasVersion).push(filaHtml);
  }
  if (progreso) progreso.textContent = `${consultas.length} activos consultados.`;

  const resumenVersion = notaVersionHtml(version, consultaVersion);

  contenedor.innerHTML = `<p class="text-sm text-gray-700 mb-2">${resumenVersion}</p>`
    + `<h2 class="mt-6 mb-2 font-semibold text-lg">Documento y activos del HTML</h2>` + tabla(filasHtml)
    + `<h2 class="mt-6 mb-2 font-semibold text-lg">Activos declarados en version.json</h2>`
    + (declarados.length ? tabla(filasVersion) : '<p class="text-sm text-gray-500">Sin version.json no hay lista declarada.</p>');
  return true;
}
