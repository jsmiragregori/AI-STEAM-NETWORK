# Próxima sesión: Continuación Migración Vanilla

**Estado actual:** Fase 2 completada al 100% (Home, Sectors, Training, News)

## Resumen de progreso
- ✅ **Fase 1 (Infrastructure):** Tailwind CLI, estructura, i18n, router, state, components (header/footer/cookie-banner)
- ✅ **Fase 2 (Vistas principales):** 
  - `home.js` — Hero, stats, Is/IsNot, ecosystem, sectores, formación, retos
  - `sectors.js` — 7 sectores con expand/collapse, transfer chain, detail grid
  - `training.js` — 3 tabs (FP/Teacher/Master), cursos, badges, paths
  - `news.js` — Listado con filtros, featured article, sidebar (eventos, newsletter, social), detail view con breadcrumb y browser back

---

## Qué falta: Fase 3 (Placeholder → Real)

### 1. **knowledge.js** (`conocimiento`)
   - **Ubicación fuente:** `AI-STEAM-MOCKUP/src/components/views/Knowledge.tsx`
   - **Componentes:** 
     - 2 tabs: `flow` (flujo de transferencia) y `map` (mapa de stakeholders)
     - Flow tab: Diagrama visual de las etapas, visualización interactiva
     - Map tab: Grid de stakeholder cards con sectores, roles, links
   - **State:** `knowledgeTab`, `knowledgeSearch`
   - **Patrón:** Similar a training.js (tab switching in-view sin scroll)

### 2. **governance.js** (`gobernanza`)
   - **Ubicación fuente:** `AI-STEAM-MOCKUP/src/components/views/Governance.tsx`
   - **Componentes:**
     - 3 tabs: `estructura` (org chart), `documentos` (agreements/charters), `procesos` (decision-making flow)
     - Org chart: Visualización jerárquica de roles
     - Documentos: Cards con links a archivos
     - Procesos: Timeline/flowchart visual
   - **State:** `governanceTab`
   - **Patrón:** Tab switching (similar a training/news)

### 3. **network.js / red.js** (`red`)
   - **Ubicación fuente:** `AI-STEAM-MOCKUP/src/components/views/Network.tsx`
   - **Componentes:**
     - 2 tabs: `consorcio` (partner overview), `por-pais` (country distribution)
     - Consorcio: Partner grid cards, stats (partners, countries, sectors, orgs)
     - Por País: Selección país → partners de ese país
   - **State:** `networkTab`, `networkCountry`
   - **Patrón:** Tab switching + dropdown country filter

---

## Fase 4: Marketplace & Challenge Detail

### 4. **marketplace.js / bancoRetos** (`banco-retos`)
   - **Ubicación fuente:** `AI-STEAM-MOCKUP/src/components/views/Marketplace.tsx`
   - **Componentes:** 
     - Multi-filters: type, route, status, sector, search
     - Challenge cards grid
     - Sorting/pagination (si aplica)
   - **State:** `marketplaceFilters` (ya definido)

### 5. **challenge-detail.js** (nueva ruta o modal)
   - **Ubicación fuente:** `AI-STEAM-MOCKUP/src/components/views/ChallengeDetail.tsx`
   - **Componentes:**
     - Hero con metadata
     - Problem statement, learning outcomes, requirements
     - Related challenges
   - **Navegación:** Desde marketplace card → detail (similar a news detail)

---

## Fase 5: QA & Polish

- Tests responsive (mobile, tablet, desktop)
- Validar localStorage persistence (filters, language, cookies)
- Optimizar performance (lazy load imágenes, minify JS)
- Verificar accesibilidad (contrast, keyboard nav)

---

## Notas técnicas

### Patrón para nuevas vistas
1. Leer fuente React en `AI-STEAM-MOCKUP/src/components/views/<Name>.tsx`
2. Crear `assets/js/views/<name>.js` con estructura:
   ```js
   import { t } from '../i18n.js';
   import { getState, setState } from '../state.js';
   
   export function render() { /* retorna HTML string */ }
   export function mount() { /* event listeners */ }
   ```
3. Importar en `assets/js/views/index.js` y exportar con el nombre correcto
4. Para tab switching **dentro de la misma vista**: re-render solo `main-root` (no `renderApp()`)
5. Para navegación **entre vistas**: usar `navigateTo()` desde router

### Tailwind CSS
- Clases compiladas from React source en `tailwind-output.css`
- Usar exactamente las clases que aparecen en mockup React (ej: `bg-gradient-to-b`, no `bg-linear-to-b`)
- Si agregar clase nueva que no está compilada: ejecutar `npx @tailwindcss/cli -i ../AI-STEAM-MOCKUP/src/index.css -o ./assets/css/tailwind-output.css --minify` desde `AI-STEAM-VANILLA`

### Icons
- Usar `<i data-lucide="icon-name"></i>` + `window.lucide.createIcons()` en mount

### Git workflow
- Branch feature: `git checkout -b feature/<name>`
- Commit con mensaje descriptivo: `feat: implement <view-name>`
- Push y PR a `main` (o direct commit si solo)

---

## Próximo comando al iniciar sesión
```bash
cd D:\CEICE\AI-STEAM-VANILLA
npx serve -l 3000
# Navegar a http://localhost:3000
```

**Orden recomendado:**
1. Knowledge.js (complejo pero importante)
2. Governance.js (similar a knowledge)
3. Network.js (más simple)
4. Marketplace.js + Challenge-detail.js
5. QA & polish

---

**Última actualización:** 2026-05-07  
**Última sesión:** news.js completado con detail view y browser back button fix
