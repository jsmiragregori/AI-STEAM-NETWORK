# CLAUDE.md - AI-STEAM Network Vanilla

**Fecha de inicio:** 2026-05-07  
**Última sesión:** 2026-06-08  
**Estado:** Fases 1–5 y Overhaul Visual (F0–F11) COMPLETADOS ✅ — Proyecto funcional, rediseñado y publicado  
**Repo:** https://github.com/jsmiragregori/AI-STEAM-NETWORK

---

## Contexto del Proyecto

Conversión de `D:\CEICE\AI-STEAM-MOCKUP` (React/Vite) a vanilla HTML/CSS/JS sin bundler.  
Hosting estático, sin node_modules en producción.

**Commits clave:**
- `bee147f` — Fase 1: Infraestructura base
- `da46ea5` — Fase 2: home, sectors, training, news
- `f81dbb3` — Fase 3: governance, knowledge, network
- `55e8d48` — Fase 4: marketplace + challenge detail
- `841f8d6` — Fase 5: Accessibility & UX audit
- `d287066` — Fase F6: Rediseño Gobernanza (introducción de degradados y paleta corporativa v3)
- `6f19f89` — Fase F10: Rediseño Marketplace (grid 2 columnas, patrón ceja, lift cards)
- `P0-P7` — Fase F11: Cierre del overhaul, accesibilidad WCAG 2.1 AA, responsive y correcciones finales de ancho de párrafo.

---

## Estructura

```
D:\CEICE\AI-STEAM-VANILLA/
├── index.html
├── CLAUDE.md
├── assets/
│   ├── css/
│   │   ├── main.css            ← prefers-reduced-motion aquí
│   │   └── tailwind-output.css ← compilado estático desde React source
│   ├── js/
│   │   ├── main.js             ← syncHtmlLang() + renderApp() en DOMContentLoaded
│   │   ├── router.js
│   │   ├── i18n.js             ← setLanguage() actualiza document.documentElement.lang
│   │   ├── state.js            ← getState / setState
│   │   ├── components/
│   │   │   ├── header.js
│   │   │   ├── footer.js
│   │   │   └── cookie-banner.js
│   │   └── views/
│   │       ├── index.js        ← exporta todas las views
│   │       ├── home.js
│   │       ├── sectors.js
│   │       ├── training.js
│   │       ├── news.js
│   │       ├── governance.js
│   │       ├── knowledge.js
│   │       ├── network.js
│   │       └── marketplace.js  ← incluye challenge detail inline
│   └── data/
│       ├── translations.js     ← { es, en, va }
│       └── challenge-extras.js ← datos extra r1-r9 (en/es/va)
└── fonts/
    └── InstrumentSans-*.woff2
```

---

## Estado Actual de Cada Vista

| Vista | Archivo | Estado | Notas |
|-------|---------|--------|-------|
| Inicio | `home.js` | ✅ | Hero, stats, features, partners |
| Sectores | `sectors.js` | ✅ | 7 sectores expand/collapse, transfer chain |
| Formación | `training.js` | ✅ | 3 tabs (FP/Teacher/Master), cursos, badges |
| Actualidad | `news.js` | ✅ | Filtros, featured, sidebar, detail view |
| Gobernanza | `governance.js` | ✅ | 5 tabs (estructura/dual-track/lbd/docs/participar) |
| Conocimiento | `knowledge.js` | ✅ | 5 tabs (flujo/oer/casos/evidencia/plantillas), búsqueda OER |
| Red | `network.js` | ✅ | 2 tabs (socios/stakeholders), filtros país+categoría, form |
| Retos | `marketplace.js` | ✅ | 13 retos, 5 filtros, detail inline, participation form |

---

## Patrones Críticos (NO modificar sin entender)

### 1. Render + Mount
```js
export function render() { return `<div>...</div>`; }
export function mount() { /* event listeners */ }
```
Tras re-renderizar en-vista (sin `renderApp()`):
```js
function rerender() {
  document.getElementById('main-root').innerHTML = render();
  mount();
  if (window.lucide) window.lucide.createIcons();
}
```

### 2. Clases Tailwind — REGLA CRÍTICA
El CSS fue compilado desde el React source. **Usar exactamente las mismas clases que el original React.**
- ✅ `bg-gradient-to-b` (NO `bg-linear-to-b` — es v4, no está en el CSS compilado)
- ✅ Si una clase nueva no está en el CSS compilado → usar `style=""` inline
- Verificar: `grep "clase-sospechosa" assets/css/tailwind-output.css`

### 3. Estado global
```js
// state.js — claves actuales:
selectedChallengeId: null,
marketplaceShowSubmit: false,
marketplaceShowParticipation: false,
marketplaceParticipationSent: false,
marketplaceFilters: { type: 'All', route: 'All', status: 'Todos', sector: 'Todos', evidence: 'All', search: '' },
networkTab: 'socios',         // valores válidos: 'socios' | 'stakeholders'
networkCategory: 'todos',
networkCountry: null,
networkShowForm: false,
knowledgeTab: 'flujo',        // clave debe coincidir exactamente con contentMap keys
knowledgeSearch: '',
governanceTab: 'estructura',
trainingTab: 'fp',
expandedSector: null,
newsCategoryFilter: null,
selectedNewsId: null,
```
**ATENCIÓN:** El valor inicial de un tab debe coincidir exactamente con la clave del contentMap. Bug anterior: `'flow'` vs `'flujo'`.

### 4. Marketplace — Challenge Detail (inline en marketplace.js)
- `challengeExtras` de `../../data/challenge-extras.js` — datos para r1-r9 (r10-r13 sin extras)
- Fallback de idioma: `challengeExtras[lang][id] || challengeExtras.es[id]`
- Navegación: `history.pushState` al abrir detail, listener `popstate` para volver
- Estado: `marketplaceShowParticipation` y `marketplaceParticipationSent` en state.js

### 5. Lang + Accesibilidad
- `i18n.js`: `setLanguage()` actualiza `document.documentElement.lang` con BCP47 (`ca-valencia` para va)
- `main.js`: `syncHtmlLang()` se llama en `DOMContentLoaded`
- `main.css`: tiene `@media (prefers-reduced-motion: reduce)` — NO añadir animaciones sin respetar esto
- Todos los inputs/selects: `focus:outline-none focus:ring-2 focus:ring-eu-blue focus:border-eu-blue`
- Botones táctiles: `min-height:44px` inline si la clase no está en el CSS compilado

### 6. Iconos Lucide
```html
<i data-lucide="nombre-icono" class="w-4 h-4 text-eu-blue"></i>
```
Llamar `window.lucide.createIcons()` tras cada render/rerender.

### 7. Traducciones
```js
import { t } from '../i18n.js';
const mT = t('marketplace');   // objeto completo de la sección
const title = t('home.heroTitle');  // string directamente
```
Namespaces disponibles: `home`, `sectors`, `training`, `news`, `governance`, `knowledge`, `network`, `marketplace`, `challengeDetail`, `header`, `footer`, `cookies`.

---

## Accesibilidad — Fixes ya aplicados (Fase 5)

| Fix | Archivos | WCAG |
|-----|----------|------|
| `focus:ring-2` en todos los inputs | knowledge, network, marketplace | 2.4.7 |
| Skip-to-content link | index.html | 2.4.1 |
| `<html lang>` dinámico | i18n.js, main.js | 3.1.1 |
| `for`/`id` en labels+inputs | network, marketplace | 1.3.1 |
| `prefers-reduced-motion` | main.css | 2.3.3 |
| Touch targets 44px | header.js (inline style) | Touch |
| `role="alert"` en confirmaciones | marketplace.js | 4.1.3 |
| `text-gray-400` → `text-gray-500` en texto | home, news, governance, knowledge, marketplace | 1.4.3 |

---

## Fuente de Datos

```
D:\CEICE\AI-STEAM-MOCKUP\src\
├── translations.ts             ← fuente de translations.js
├── challengeExtras.ts          ← fuente de challenge-extras.js
└── components/views/
    ├── Marketplace.tsx         ← fuente de marketplace.js
    ├── ChallengeDetail.tsx     ← integrado en marketplace.js
    ├── Governance.tsx          ← fuente de governance.js
    ├── Knowledge.tsx           ← fuente de knowledge.js
    └── Network.tsx             ← fuente de network.js
```

---

## Desarrollo Local

```bash
# HTTP obligatorio (no funciona con file://)
cd D:\CEICE\AI-STEAM-VANILLA
npx serve -l 3000
# o: python -m http.server 3000
```

### ⚙️ BUILD CSS — Tailwind v4 (desde 2026-06-05, F0b del rediseño visual)

El CSS ya NO está congelado: `assets/css/tailwind-output.css` se **genera** desde
`assets/css/tailwind-input.css` (que contiene `@theme` con la paleta `eu-*` y la fuente
Instrument Sans). **Si cambias clases Tailwind en cualquier `.js`/`.html`, recompila:**

```bash
npm install          # solo la 1ª vez en un PC (node_modules NO está en git)
npm run build:css    # compila el output (--minify)
npm run watch:css    # alternativa: recompila al guardar
```

- NUNCA editar a mano `tailwind-output.css` (se sobrescribe).
- `assets/css/redesign.css` es CSS a mano (design system v3, utilidades `.rd-*`) → no lo toca Tailwind.
- Orden en `index.html`: tailwind-output.css → main.css → redesign.css.
- Plan y reglas completas: `PLAN_VISUAL_REDESIGN_2026-06-05.md` (sección "⚙️ BUILD CSS").

DevTools útiles:
- Console → errores JS y módulos
- Application → localStorage → `language`, `cookies-accepted`
- Console: `localStorage.setItem('language','en'); location.reload()`

---

## Posibles Tareas Futuras

- [ ] Minificación JS (`npx esbuild main.js --bundle --minify`)
- [ ] Tests responsive manuales en 375px, 768px, 1024px, 1440px
- [ ] Verificar persistencia localStorage entre recargas (language, cookies)
- [ ] Añadir más challenge-extras para r10-r13 si se necesita
- [ ] Considerar Service Worker para offline (opcional)
