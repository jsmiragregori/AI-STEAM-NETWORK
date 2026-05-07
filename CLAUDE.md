# CLAUDE.md - AI-STEAM Network Vanilla

**Fecha de inicio:** 2026-05-07  
**Estado:** Fase 2 (Vistas principales) - COMPLETADO ✅  
**Próximo:** Fase 3 (Vistas con estado: knowledge, governance, network)  
**Objetivo:** Convertir el mockup React/Vite a HTML/CSS/JS vanilla puro (sin dependencias en producción)

---

## 📋 Contexto del Proyecto

Este es el resultado de la conversión de `D:\CEICE\AI-STEAM-MOCKUP` (React/Vite) a vanilla HTML/CSS/JS.

**Por qué vanilla:**
- El servidor de alojamiento solo soporta HTML, CSS, JS estático
- No requiere build tools en producción
- Datos completamente estáticos (mockup)
- Comportamiento idéntico al original: routing por tabs, i18n 3 idiomas, UI dinámica

**Garantías de éxito:**
- Look and feel idéntico al original (Tailwind compilado)
- Misma funcionalidad: tabs, idiomas, filtros, formularios (demo)
- Archivos fuente pequeños y legibles (~1000 líneas JS total)

---

## 🗂️ Estructura del Proyecto

```
D:\CEICE\AI-STEAM-VANILLA/
├── index.html                  ← Punto de entrada único
├── assets/
│   ├── css/
│   │   ├── main.css            ← Variables CSS custom, layout
│   │   └── tailwind-output.css ← Tailwind compilado (estático)
│   ├── js/
│   │   ├── main.js             ← Inicialización, orquestación
│   │   ├── router.js           ← Gestión de tabs (navegación)
│   │   ├── i18n.js             ← Sistema de traducciones
│   │   ├── state.js            ← Estado global minimal
│   │   ├── components/
│   │   │   ├── header.js
│   │   │   ├── footer.js
│   │   │   └── cookie-banner.js
│   │   └── views/
│   │       ├── index.js        ← Exporta todas las views
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
│       ├── translations.js     ← { es: {...}, en: {...}, va: {...} }
│       └── challenge-extras.js ← Datos extra de retos
└── fonts/                      ← Instrument Sans local
    └── InstrumentSans-*.woff2
```

---

## 🔄 Flujo de Funcionamiento

1. **Carga:** `index.html` → `main.js` (módulo ES)
2. **Inicialización:** `main.js` importa todo y llama `renderApp()`
3. **Primer render:** `router.js` obtiene view activa → `views[view].render()`
4. **HTML string:** Template literal con clases Tailwind, interpolaciones de `t(key)`
5. **Mount:** Tras insertar HTML, `views[view].mount()` añade event listeners
6. **Navegación:** Click → `navigateTo(view)` → `renderApp()` → loop
7. **Idiomas:** `setLanguage(lang)` → localStorage → `renderApp()`

---

## 📝 Patrones Clave

### Traducción (i18n.js)
```js
import { t } from './i18n.js';
const title = t('home.heroTitle');           // string
const home = t('home');                      // { heroTitle: '...', ... }
```

### Routing (router.js)
```js
import { navigateTo } from './router.js';
element.addEventListener('click', () => navigateTo('sectores'));
```

### Estado (state.js)
```js
import { getState, setState } from './state.js';
const filters = getState('marketplaceFilters');
setState('marketplaceFilters', { ...filters, type: 'validation' });
```

### Vista (views/home.js)
```js
export function render() {
  return `<section class="...">...</section>`;
}

export function mount() {
  document.querySelector('[data-action="navigate-to-sectores"]')
    ?.addEventListener('click', () => navigateTo('sectores'));
}
```

---

## 🎨 CSS y Tema

**Tailwind:** Compilado una sola vez via CLI, no es build-time.

```bash
# Comando único (ya realizado o a realizar):
npx tailwindcss -i ../AI-STEAM-MOCKUP/src/index.css \
  -o ./assets/css/tailwind-output.css --minify
```

**Variables CSS custom** (en `main.css`):
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

---

## 🎯 Fases de Desarrollo

### Fase 1: Infraestructura ✅ COMPLETADO
- [x] Estructura de directorios
- [x] `index.html` shell
- [x] CSS compilado + `main.css` (Tailwind v4 CLI)
- [x] `i18n.js`, `router.js`, `state.js`, `main.js`
- [x] `header.js`, `footer.js`, `cookie-banner.js`
- [x] Criterio: App carga, navega entre tabs, language switcher funciona

**Commits:** `bee147f` (fase1: Infraestructura base)

### Fase 2: Views simples ✅ COMPLETADO
- [x] `home.js` — Hero + stats + sectores + formación + retos
- [x] `sectors.js` — 7 sectores con expand/collapse + transfer chain
- [x] `training.js` — 3 tabs (FP/Teacher/Master) + cursos + badges + paths
- [x] `news.js` — Listado + filtros + featured + sidebar + detail view
- [x] Criterio: Todas las views renderean en ES/EN/VA ✅

**Commits:** `da46ea5` (feat: sectors, training, news views)

### Fase 3: Views con estado ⏳ PENDIENTE
- [ ] `knowledge.js` (2 tabs: flow + stakeholder map)
- [ ] `governance.js` (3 tabs: estructura + documentos + procesos)
- [ ] `network.js` (2 tabs: consorcio + por-país)
- [ ] Criterio: Tabs, filtros, estado funcionales

**Recurso:** Ver `SIGUIENTE_SESION.md` para detalles de implementación

### Fase 4: Marketplace + ChallengeDetail ⏳ PENDIENTE
- [ ] `marketplace.js` (filtros: type, route, status, sector, search)
- [ ] `challenge-detail.js` (hero + problem + outcomes + related)
- [ ] Integración bidireccional (card → detail → list)
- [ ] Criterio: Filtrado y navegación funcionan

### Fase 5: QA + Polish ⏳ PENDIENTE
- [ ] Tests responsive (320px, 768px, 1024px, 1440px)
- [ ] Tests de idioma (reset de filtros, persistencia)
- [ ] localStorage funciona entre recargas
- [ ] Minificación opcional
- [ ] Criterio: Funciona con `npx serve -l 3000`, sin node_modules

---

## 🚀 Desarrollo Local

```bash
# Servir en HTTP (ES OBLIGATORIO, no funciona file://)
cd D:\CEICE\AI-STEAM-VANILLA
npx serve -l 3000

# Abrir en navegador
http://localhost:3000
```

**DevTools útiles:**
- F12 → Console para errores JS (los imports show en Network)
- F12 → Network para ver módulos cargando (index.js, home.js, etc.)
- F12 → Application → localStorage para inspeccionar estado persistido
- F12 → Console: `getState('key')`, `setLanguage('en')` para debug

---

## 📚 Referencias Externas

**Proyecto origen:** `D:\CEICE\AI-STEAM-MOCKUP`
- `src/translations.ts` ← copiar a `assets/data/translations.js`
- `src/challengeExtras.ts` ← copiar a `assets/data/challenge-extras.js`
- `src/components/views/*.tsx` ← adaptar a `.js` templates

**Plan detallado:** Ver `PLAN_CONVERSION_VANILLA.md` en este mismo directorio.

---

## ⚠️ Puntos Críticos

1. **Sin bundler:** Usar `import/export` ES6 nativos. Los navegadores modernos los soportan.
2. **Sin build-time:** Todo es estático. Las clases Tailwind ya están compiladas.
3. **HTTP obligatorio:** No funciona con `file://`, requiere servidor.
4. **Lucide vanilla:** `lucide.createIcons()` tras cada `renderApp()`.
5. **ChallengeDetail 1061 líneas:** Será el componente más complejo, dedicar Fase 4 completa.

---

## 📦 Dependencias Externas (Fase 1)

En desarrollo (local):
- `tailwindcss` CLI (para compilar CSS)
- Python o Node.js HTTP server

En producción (cero dependencias):
- ✅ HTML
- ✅ CSS (estático, compilado)
- ✅ JavaScript (modules nativos ES6)
- ✅ Fuentes woff2 locales
- ✅ Lucide vanilla (bundle JS)

---

## 📋 Checklist de Inicio (Antes de Fase 1)

- [ ] Confirmar acceso a `D:\CEICE\AI-STEAM-MOCKUP` desde nuevo working directory (`D:\CEICE`)
- [ ] Crear estructura base de directorios
- [ ] Copiar y convertir `translations.ts` → `translations.js`
- [ ] Copiar y convertir `challengeExtras.ts` → `challenge-extras.js`
- [ ] Compilar Tailwind CSS
- [ ] Crear `index.html` shell
- [ ] Crear módulos base: `i18n.js`, `router.js`, `state.js`, `main.js`
- [ ] Crear componentes base: `header.js`, `footer.js`, `cookie-banner.js`
- [ ] Verificar que HTTP server funciona
- [ ] Primer test en navegador (header navega, idioma cambia)

---

## 🔗 Comandos Rápidos

```bash
# Compilar CSS (ejecución única)
npx tailwindcss -i ../AI-STEAM-MOCKUP/src/index.css -o ./assets/css/tailwind-output.css --minify

# Servidor dev (obliga HTTP)
python -m http.server 8000

# Minificar JS (opcional, Fase 5)
npx esbuild ./assets/js/main.js --bundle --minify --outfile=./assets/js/main.min.js
```

---

## 📝 Notas de Cierre de Sesión

Cuando finalices una sesión:
1. Actualizar este `CLAUDE.md` con estado de Fases
2. Crear/actualizar `SIGUIENTE_SESION.md` con próximos pasos
3. Commits claros con `feat:`, `fix:`, `docs:` según corresponda
4. Push a `origin/master`

**Patrón de commits:**
```bash
feat(fase3): implement knowledge.js and governance.js
fix(news): handle empty detail gracefully
docs: update SIGUIENTE_SESION.md with Phase 4 details
```

---

**Última actualización:** 2026-05-07  
**Última sesión completada:** Fase 2 (sectors, training, news) ✅  
**Próxima sesión:** Fase 3 (knowledge, governance, network) — ver `SIGUIENTE_SESION.md`
