# Plan de Conversión: React/Vite → Vanilla HTML/CSS/JS

**Fecha:** 2026-05-07  
**Estado:** Planificado (pendiente de implementación)  
**Proyecto:** AI-STEAM Network Mockup

---

## 1. Resumen Ejecutivo

La app es un SPA (Single Page Application) con routing por tabs, i18n en 3 idiomas y datos estáticos embebidos. Es un candidato **ideal** para vanilla porque:

- No hay servidor backend real (todo es mockup con datos hardcoded)
- No hay llamadas a API reales que dependan de React
- El estado es mínimo: pestaña activa + idioma seleccionado + UI toggles locales
- Las animaciones son básicas (Tailwind transitions, nada de Motion complejo)

La estrategia central es: **un único `index.html` + JS modular + CSS compilado manualmente desde Tailwind**.

---

## 2. Estructura de Ficheros del Resultado Final

```
D:\CEICE\AI-STEAM-VANILLA\
├── index.html                  ← Shell HTML único
├── assets/
│   ├── css/
│   │   ├── main.css            ← CSS custom (variables, tema, layout)
│   │   └── tailwind-output.css ← Tailwind compilado (CLI, una vez)
│   ├── js/
│   │   ├── main.js             ← Punto de entrada, inicialización
│   │   ├── router.js           ← Gestión de tab activo
│   │   ├── i18n.js             ← Sistema de traducciones (t() function)
│   │   ├── state.js            ← Estado global mínimo
│   │   ├── components/
│   │   │   ├── header.js
│   │   │   ├── footer.js
│   │   │   └── cookie-banner.js
│   │   └── views/
│   │       ├── home.js
│   │       ├── network.js
│   │       ├── marketplace.js
│   │       ├── challenge-detail.js
│   │       ├── sectors.js
│   │       ├── knowledge.js
│   │       ├── governance.js
│   │       ├── training.js
│   │       ├── news.js
│   │       └── news-detail.js
│   └── data/
│       ├── translations.js     ← translations.ts convertido a JS module
│       └── challenge-extras.js ← challengeExtras.ts convertido a JS module
└── fonts/                      ← Instrument Sans (descargados localmente)
    └── InstrumentSans-*.woff2
```

---

## 3. Estrategia CSS: Tailwind sin Build Tool

### Opción (Recomendada): Tailwind CLI standalone

Usar el ejecutable standalone de Tailwind CLI para compilar `tailwind-output.css` **una sola vez** desde las clases que aparecen en el proyecto React original. El resultado es un CSS estático sin dependencias.

```bash
# Paso único durante la conversión:
npx tailwindcss -i ./AI-STEAM-MOCKUP/src/index.css -o ./AI-STEAM-VANILLA/assets/css/tailwind-output.css --minify
```

### Variables de tema (main.css)

Las variables CSS custom del proyecto se mantienen exactas:

```css
:root {
  --color-eu-blue: #5620F6;
  --color-eu-purple: #4918AD;
  --color-eu-yellow: #FFF4E1;
  --color-eu-bg: #F3F6F8;
  --color-eu-text: #111827;
  --color-eu-border: #C9D1E0;
  --color-eu-footer: #24324A;
  --font-sans: "Instrument Sans", sans-serif;
}
```

### Iconos: Lucide (sin React)

Usar la librería **lucide** JS pura (`lucide` npm package, no `lucide-react`). Tiene API idéntica pero para DOM vanilla.

En los templates HTML, sustituir `<Home className="w-4 h-4" />` por `<i data-lucide="home" class="w-4 h-4"></i>` y llamar `lucide.createIcons()` tras cada render.

---

## 4. Sistema de Traducciones (i18n.js)

Reemplaza completamente `LanguageContext.tsx`. Implementación directa:

```js
// data/translations.js
export const translations = { es: {...}, en: {...}, va: {...} }; // copia literal de translations.ts

// i18n.js
import { translations } from './data/translations.js';

let currentLang = localStorage.getItem('language') || 'es';

export function getLanguage() { return currentLang; }

export function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('language', lang);
  renderApp(); // re-render completo
}

export function t(key) {
  const keys = key.split('.');
  let val = translations[currentLang];
  for (const k of keys) {
    val = val?.[k];
    if (val === undefined) return key; // fallback
  }
  return val;
}

export function getLangData() {
  return translations[currentLang];
}
```

---

## 5. Sistema de Routing (router.js)

```js
// router.js
const VIEWS = ['inicio','red','sectores','banco-retos','formacion','conocimiento','gobernanza','actualidad'];

let activeView = 'inicio';
let viewParams = {};

export function navigateTo(view, params = {}) {
  activeView = view;
  viewParams = params;
  renderApp();
  window.scrollTo(0, 0);
}

export function getActiveView() { return activeView; }
export function getViewParams() { return viewParams; }
```

---

## 6. Estado Global (state.js)

```js
const appState = {
  cookiesAccepted: localStorage.getItem('cookies-accepted') === 'true',
  marketplaceFilters: { type: 'all', route: 'all', status: 'all', sector: 'all', search: '' },
  networkTab: 'consorcio',
  networkCountry: 'all',
  knowledgeTab: 'flow',
  knowledgeSearch: '',
  governanceTab: 'estructura',
  trainingTab: 'fp',
  expandedSector: null,
  mobileMenuOpen: false,
  newsCategoryFilter: 'all',
};

export function getState(key) { return appState[key]; }
export function setState(key, value) { appState[key] = value; }
```

---

## 7. Patrón de Render (el núcleo de la conversión)

Cada view JS exporta:
- `render()`: devuelve HTML string
- `mount()`: adjunta event listeners tras insertar HTML

```js
// views/home.js
import { t } from '../i18n.js';
import { navigateTo } from '../router.js';

export function render() {
  return `<section class="..."><h1>${t('home.heroTitle')}</h1>...</section>`;
}

export function mount() {
  document.querySelector('[data-nav="sectores"]')
    ?.addEventListener('click', () => navigateTo('sectores'));
}
```

**main.js** orquesta:

```js
export function renderApp() {
  const view = getActiveView();
  document.getElementById('header-root').innerHTML = renderHeader();
  document.getElementById('main-root').innerHTML = views[view].render();
  document.getElementById('footer-root').innerHTML = renderFooter();
  
  mountHeader();
  views[view].mount?.();
  lucide.createIcons();
}
```

---

## 8. Componentes a Convertir: Inventario y Complejidad

| Componente | Líneas originales | Complejidad | Razón principal |
|---|---|---|---|
| **Header** | 217 | Media | Hamburger menu toggle, language switcher |
| **Footer** | 36 | Baja | Estático, solo links |
| **CookieBanner** | 25 | Baja | Show/hide condicional |
| **Home** | 343 | Media | Muchas secciones, CTAs |
| **Marketplace** | 670 | **Alta** | Filtros múltiples, search live |
| **ChallengeDetail** | 1.061 | **Alta** | Formulario, secciones dinámicas |
| **Network** | 504 | Alta | Tabs + filtro país + formulario |
| **Governance** | 636 | Media-Alta | 5 tabs, diagrama |
| **Sectors** | 279 | Media | Expand/collapse |
| **Training** | 313 | Media | 3 tabs |
| **Knowledge** | 338 | Media-Alta | 5 tabs, search OER |
| **News** | 340 | Media | Filtro categorías |
| **NewsDetail** | 131 | Baja | Vista stub |

---

## 11. Plan de Trabajo por Fases

### Fase 1: Infraestructura base

1. Crear estructura de directorios
2. Generar `index.html` shell
3. Compilar CSS con Tailwind CLI
4. Implementar `translations.js`, `i18n.js`, `router.js`, `state.js`, `main.js`
5. Header funcional + Footer + CookieBanner

**Éxito:** App carga, header navega, language switcher funciona.

### Fase 2: Views simples

`home.js`, `training.js`, `sectors.js`, `news.js`, `news-detail.js`

### Fase 3: Views con estado

`governance.js`, `knowledge.js`, `network.js`

### Fase 4: Marketplace + ChallengeDetail

Integración bidireccional completa.

### Fase 5: QA y polish

Tests responsive, localStorage, idioma, minificación opcional.

---

## 12. Decisiones Técnicas

| Decisión | Elección | Razón |
|---|---|---|
| Bundler | **Ninguno** (ES modules nativos) | Sin dependencias, servidor estático |
| CSS | **Tailwind CLI + CSS vars** | Mantiene look and feel exacto |
| Iconos | **Lucide vanilla + `data-lucide`** | DRY, mantenible |
| Render | **innerHTML + template strings** | Simple, suficiente |
| Routing | **Estado en memoria** | Mantiene comportamiento exacto |
| Formularios | **UI demo sin envío real** | Es mockup |

---

## 13. Riesgos y Mitigaciones

| Riesgo | Impacto | Mitigación |
|---|---|---|
| Tailwind genera CSS enorme | Bajo | Purge automático del CLI |
| ES modules necesitan HTTP | Medio | Servidor ya lo es; dev con `python -m http.server` |
| Re-renders completos | Bajo | Performance suficiente para mockup |
| ChallengeDetail 1.061 líneas | Alto | Fase 4 dedicada, descomponer en sub-funciones |
| Lucide requiere init tras render | Medio | Centralizar en `initIcons()` |

---

## 14. Resultado Esperado

Directorio completamente estático (~700 KB total):
- `index.html` (2 KB)
- CSS compilado (80-120 KB)
- JS views + componentes (200-300 KB)
- Traducciones + datos (150 KB)
- Fuentes locales (100 KB)
- Lucide (60 KB)

**Sin ninguna dependencia de Node.js, npm, ni build step en producción.**
