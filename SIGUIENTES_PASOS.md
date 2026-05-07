# Siguientes Pasos — AI-STEAM Network Vanilla

**Última sesión:** 2026-05-07  
**Completado:** Fases 1–5 (Infraestructura, vistas simples, estado, marketplace, accesibilidad)  
**Estado actual:** Proyecto funcional y accesible — WCAG 2.1 AA cumplido ✅

---

## Resumen Sesión 2026-05-07

### Completado

✅ **Fase 1:** Infraestructura base (routing, i18n, state, components)  
✅ **Fase 2:** home, sectors, training, news (+ news detail)  
✅ **Fase 3:** governance, knowledge, network (5 tabs c/u, filtros, formularios)  
✅ **Fase 4:** marketplace (13 retos, 5 filtros, challenge detail inline, participation form)  
✅ **Fase 5:** Accesibilidad & UX (WCAG 2.1 AA)

### Commits de hoy

```
bee147f — Fase 1: Infraestructura base
da46ea5 — Fase 2: home, sectors, training, news
f81dbb3 — Fase 3: governance, knowledge, network
55e8d48 — Fase 4: marketplace + challenge detail
841f8d6 — Fase 5: Accessibility & UX audit (ui-ux-pro-max)
```

---

## Cómo Continuar en Otro Ordenador

### 1. Clonar el repo
```bash
git clone https://github.com/jsmiragregori/AI-STEAM-NETWORK.git
cd AI-STEAM-VANILLA
```

### 2. Servir localmente
```bash
# Opción A: Node.js
npx serve -l 3000

# Opción B: Python
python -m http.server 3000

# Abrir en navegador
http://localhost:3000
```

### 3. Verificar que funciona
- [ ] Página carga sin errores en Console
- [ ] Navegar entre tabs (Home → Sectores → Formación, etc.)
- [ ] Cambiar idioma (ES / EN / VA)
- [ ] Network → Abrir formulario
- [ ] Retos → Abrir detalle de un reto
- [ ] DevTools → Application → localStorage → `language` se actualiza al cambiar idioma

---

## Estructura Clave (Para Editar)

**Traducciones:** `assets/data/translations.js`  
- Idiomas: `{ es: {...}, en: {...}, va: {...} }`
- Editar cualquier label → actualiza automáticamente en todas las vistas

**Datos de retos:** `assets/data/challenge-extras.js`  
- Extras para r1–r9 (descripción, objetivos, hitos, mentores, FAQ, etc.)
- r10–r13 sin extras (se mostraría solo lo básico)

**Vistas:** `assets/js/views/*.js`  
- Cada archivo exporta `render()` (HTML string) y `mount()` (event listeners)
- Patrón: `render()` retorna template literal con Tailwind
- Patrón: `mount()` wirerea listeners y llama `rerender()` si el estado cambia

**Estado:** `assets/js/state.js`  
- Objeto `appState` con todas las claves (tabs, filtros, formularios, etc.)
- Acceso: `getState('key')`, `setState('key', value)`

**Estilos:** `assets/css/`  
- `tailwind-output.css` — **NO EDITAR** (compilado desde React source)
- `main.css` — variables CSS, `prefers-reduced-motion`, fuente custom

---

## Puntos Críticos (Antes de Editar Código)

### ⚠️ 1. Clases Tailwind — EXACTAS del React source
Si añades una clase nueva, verifica que esté en `tailwind-output.css`:
```bash
grep "nueva-clase" assets/css/tailwind-output.css
```
Si NO está → usar `style=""` inline (ej. `style="min-height:44px"`).

### ⚠️ 2. State keys — DEBEN coincidir exactamente con contentMap keys
Ejemplo: Si `knowledgeTab` es `'flow'` pero contentMap usa `'flujo'` → tab en blanco.  
Solución: Siempre inicializar state con el valor EXACTO que usa el contentMap.

### ⚠️ 3. Sin bundler, ES6 modules nativos
- Import/export funcionan en navegadores modernos
- Usar rutas relativas: `import { t } from '../i18n.js'` (con `.js`)
- NO omitir `.js` al final

### ⚠️ 4. HTML lang sincronizado
- Cambiar idioma → `document.documentElement.lang` se actualiza automáticamente
- Si añades un idioma nuevo, actualizar la función `syncHtmlLang()` en `main.js`

### ⚠️ 5. Lucide icons
```html
<i data-lucide="icon-name" class="w-4 h-4"></i>
```
Llamar `window.lucide.createIcons()` tras cada `render()` o `rerender()`.

---

## Posibles Mejoras (Para Próximas Sesiones)

- **Minificación JS** — Opcional, reduce tamaño en ~40%
  ```bash
  npx esbuild assets/js/main.js --bundle --minify --outfile=assets/js/main.min.js
  ```

- **Más challenge-extras** — Para r10–r13 si se necesita más detalle

- **Service Worker** — Para offline (opcional, no es prioritario)

- **SEO/OpenGraph** — Metas en `index.html` si se expone públicamente

- **Tests E2E** — Playwright/Cypress para validar navegación, filtros, i18n

---

## Testing Checklist (Antes de cada deploy)

```
[ ] Carga sin errores en Chrome + Firefox + Safari
[ ] Navega entre todas las tabs sin scroll jump
[ ] Cambiar idioma → toda la UI se traduce
[ ] Filtros funcionan (marketplace, network, knowledge)
[ ] Formularios aceptan input (no necesitan enviar realmente)
[ ] localStorage persiste idioma entre recargas
[ ] DevTools Console → cero errores JS
[ ] Responsive: 375px (mobile), 768px (tablet), 1440px (desktop)
[ ] prefers-reduced-motion: reduce → sin animaciones
[ ] Focus states visibles al tabular (focus:ring-2)
```

---

## Commit Message Format

```bash
# Features
git commit -m "feat(vista): añadir/mejorar algo"

# Fixes
git commit -m "fix(vista): reparar bug específico"

# Docs/Config
git commit -m "docs: actualizar SIGUIENTES_PASOS.md"
git commit -m "ci: actualizar CLAUDE.md"

# Accesibilidad
git commit -m "a11y: mejorar contraste de X"
```

---

## Comandos Rápidos

```bash
# Verificar estado
git status
git log --oneline -5

# Actualizar desde main (si hay cambios)
git pull origin master

# Crear nueva rama para features
git checkout -b feat/nombre-descriptivo
git commit -m "feat: descripción"
git push -u origin feat/nombre-descriptivo
# Luego crear PR en GitHub

# Ver cambios locales antes de commit
git diff

# Resetear cambios locales (CUIDADO)
git checkout -- assets/js/views/home.js
```

---

## Recursos

- **React source (referencia):** `D:\CEICE\AI-STEAM-MOCKUP`
- **Tailwind docs:** https://tailwindcss.com/docs
- **Lucide icons:** https://lucide.dev
- **MDN Web Docs:** https://developer.mozilla.org/en-US/
- **WCAG 2.1 AA checklist:** https://www.w3.org/WAI/WCAG21/quickref/

---

## Estado del Proyecto

```
Líneas de código:
- assets/js/views/*.js: ~4500 líneas (sin minificar)
- assets/js/components/*.js: ~350 líneas
- assets/data/translations.js: ~2800 líneas
- assets/data/challenge-extras.js: ~900 líneas
- assets/css/tailwind-output.css: ~300 KB (compilado React source)
- HTML + CSS custom: ~200 líneas

Total sin minificar: ~9700 líneas JS + 300 KB CSS ✅
Sin node_modules en producción ✅
```

---

**Última actualización:** 2026-05-07 23:59:59 UTC  
**Siguiente revisor:** Eres tú, en otro ordenador 🚀
