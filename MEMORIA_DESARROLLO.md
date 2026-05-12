# Memoria de Desarrollo - AI-STEAM Network Vanilla

**Fecha de inicio:** 2026-05-07  
**Estado:** Artefactos preparados, esperando inicio de Fase 1  
**Contexto:** Conversión de React/Vite a Vanilla HTML/CSS/JS

---

## Actualización 2026-05-12: CMS Network/Formulario/CTAs

El sitio ya consume datos generados por `AI-STEAM-CONTENT` para Home, Network y Sectors. La sesión del 2026-05-12 dejó implementada la gestión global del formulario de adhesión.

### Reglas actuales

- Fuente de verdad: `AI-STEAM-CONTENT/content/network/stakeholders.yml`.
- `formVisible` controla si el formulario de adhesión se renderiza en Network.
- `membershipCtasVisible` controla los CTAs promocionales desde Home y Sectors.
- En Network, si `formVisible=true`, siempre debe haber botón de abrir/cerrar formulario.
- `membershipCtasVisible=false` no debe ocultar el botón operativo de Network.
- En Sectors el destino del CTA es fijo: `red > stakeholders > formulario`.

### Archivos Vanilla relevantes

- `assets/js/views/home.js`: oculta/activa el botón de adhesión del hero según dato generado.
- `assets/js/views/network.js`: controla apertura/cierre y render del formulario.
- `assets/js/views/sectors.js`: navega al formulario desde el CTA cuando el dato generado permite mostrar el botón.
- `assets/data/home.js`, `assets/data/network.js`, `assets/data/sectors.js`: generados desde `AI-STEAM-CONTENT`.

### Regeneración

Desde `AI-STEAM-CONTENT`:

```powershell
npm run cms:network
```

Este comando regenera en secuencia `network.js`, `home.js` y `sectors.js`.

Para cambios aislados en el CTA de Sectors:

```powershell
npm run cms:sectors
```

---

## 📌 Resumen Ejecutivo

Este es el resultado de la **segunda sesión** de Claude Code sobre el mockup de AI-STEAM Network. En la primera sesión (que se encuentra en `D:\CEICE\AI-STEAM-MOCKUP`), se desarrolló completamente la aplicación React/Vite multilingüe. 

**Objetivo de esta sesión:**
- Analizar la arquitectura React original ✅
- Elaborar un plan detallado de conversión a vanilla ✅
- Preparar artefactos necesarios para la implementación ✅
- Estar listo para cambiar de contexto a `D:\CEICE` y ejecutar las Fases ✅

**Estado actual:**
- ✅ Plan detallado creado en `PLAN_CONVERSION_VANILLA.md`
- ✅ CLAUDE.md para nuevo proyecto creado
- ✅ Script PowerShell de inicialización creado (`init-fase1.ps1`)
- ✅ Esta memoria de contexto creada

---

## 🔄 Cambio de Contexto: Instrucciones para la Próxima Sesión

### Paso 1: Cerrar contexto actual (D:\CEICE\AI-STEAM-MOCKUP)

En VSCode:
1. Abre la carpeta raíz: `D:\CEICE` (no `D:\CEICE\AI-STEAM-MOCKUP`)
2. Esto te dará acceso simultáneo a:
   - `./AI-STEAM-MOCKUP/` (proyecto original React)
   - `./AI-STEAM-VANILLA/` (proyecto destino vanilla)

### Paso 2: Verificar acceso

```powershell
# En PowerShell, estando en D:\CEICE:
ls AI-STEAM-MOCKUP/src/  # Debe funcionar
ls AI-STEAM-VANILLA/     # Debe mostrar los artefactos preparados
```

### Paso 3: Ejecutar script de inicialización

```powershell
cd D:\CEICE\AI-STEAM-VANILLA
.\init-fase1.ps1
```

Esto:
- Crea la estructura de directorios
- Copia datos estáticos (translations, challenge-extras)
- Crea placeholders para archivos JS base
- Genera `.gitignore`

### Paso 4: Compilar CSS

```powershell
# Desde D:\CEICE\AI-STEAM-VANILLA:
npx tailwindcss -i ..\AI-STEAM-MOCKUP\src\index.css -o .\assets\css\tailwind-output.css --minify
```

### Paso 5: Empezar Fase 1

Implementar siguiendo el orden en `PLAN_CONVERSION_VANILLA.md`:
1. Completar `index.html` shell
2. Implementar módulos JS base (router, i18n, state, main)
3. Implementar componentes base (header, footer, cookie-banner)
4. Probar en navegador

---

## 📚 Documentación de Referencia

### En D:\CEICE\AI-STEAM-VANILLA (este directorio)
- **PLAN_CONVERSION_VANILLA.md** — Plan detallado de 5 fases con arquitectura completa
- **CLAUDE.md** — Instrucciones del proyecto, estructura, patrones clave
- **init-fase1.ps1** — Script que prepara estructura base
- **MEMORIA_DESARROLLO.md** — Este archivo

### En D:\CEICE\AI-STEAM-MOCKUP (proyecto original)
- **CLAUDE.md** — Contexto del proyecto React original
- **MEMORIA_DESARROLLO.md** — Historial de sesiones previas del proyecto original
- **src/translations.ts** — 2.692 líneas, 3 idiomas (ES, EN, VA)
- **src/challengeExtras.ts** — Datos adicionales de retos
- **src/components/views/*.tsx** — 10 componentes a convertir
- **src/context/LanguageContext.tsx** — Sistema i18n (reemplazar con i18n.js vanilla)

---

## 🎯 Objetivos por Fase

### Fase 1: Infraestructura Base (PRÓXIMA)
**Criterio de éxito:** App carga en `http://localhost:8000`, header navega, idioma cambia y persiste

Tareas:
- Terminar `index.html` (shell + mount points)
- Completar `main.css` (variables tema)
- Compilar `tailwind-output.css`
- Implementar `router.js`, `i18n.js`, `state.js`, `main.js`
- Implementar `header.js`, `footer.js`, `cookie-banner.js`
- Verificar que módulos ES6 importan correctamente
- Test básico en navegador

**Estimado:** 2-3 horas

### Fase 2: Views Simples
**Criterio:** Home, Training, Sectors, News renderizan en ES/EN/VA

Componentes:
- `home.js` (343 líneas JSX → ~200 líneas template string)
- `training.js` (3 tabs simples)
- `sectors.js` (expand/collapse)
- `news.js` (filtro categorías)
- `news-detail.js` (stub)

**Estimado:** 4-5 horas

### Fase 3: Views con Estado
**Criterio:** Filtros y formularios funcionan en UI (sin submit real)

Componentes:
- `governance.js` (5 tabs, diagrama)
- `knowledge.js` (5 tabs, search OER)
- `network.js` (filtro país, formulario)

**Estimado:** 5-6 horas

### Fase 4: Marketplace + ChallengeDetail
**Criterio:** Filtrado múltiple funciona, navegación bidireccional

Componentes (más complejos):
- `marketplace.js` (filtros múltiples, search)
- `challenge-detail.js` (1.061 líneas → descomponer en helpers)

**Estimado:** 6-8 horas (el más complejo)

### Fase 5: QA + Polish
**Criterio:** Funciona en `python -m http.server`, responsive, localStorage persiste

Tasks:
- Tests responsive (4 breakpoints)
- Tests de idioma (cambios, filtros)
- localStorage funciona
- Minificación opcional JS
- Sin node_modules en resultado final

**Estimado:** 2-3 horas

**Total estimado:** 20-25 horas de trabajo

---

## 🔧 Decisiones Arquitectónicas Confirmadas

| Aspecto | Decisión | Razón |
|---|---|---|
| **Bundler** | Ninguno (ES modules nativos) | Servidor estático, sin build-time |
| **CSS** | Tailwind CLI compilado estático | Mantiene look/feel exacto |
| **Iconos** | Lucide vanilla + data-lucide | DRY, mantenible, idéntico resultado |
| **Render** | innerHTML + template literals | Simple, sin dependencias |
| **Estado** | Global minimal object | Suficiente para mockup |
| **Routing** | En memoria, sin URL | Idéntico al original React |
| **i18n** | Función `t()` directa en JS | Reemplaza LanguageContext |

---

## ⚠️ Puntos Críticos a Recordar

1. **HTTP obligatorio:** No funciona con `file://`. Usar `python -m http.server 8000`
2. **Lucide init:** Llamar `lucide.createIcons()` tras cada `renderApp()`
3. **Template literals:** Las comillas invertidas `` ` `` son críticas para HTML embedding
4. **localStorage:** Persiste entre tabs/recargas. Cuidado con datos sensibles
5. **ChallengeDetail 1061 líneas:** El más complejo. Descomponer en helper functions
6. **Tailwind CLI:** Ejecutar una sola vez. No es build-time, es pre-compilado

---

## 📋 Checklist Pre-Implementación (Nueva Sesión)

- [ ] Cambiar working directory a `D:\CEICE` (NO `AI-STEAM-MOCKUP`)
- [ ] Verificar acceso a ambas carpetas: `AI-STEAM-MOCKUP` y `AI-STEAM-VANILLA`
- [ ] Ejecutar `init-fase1.ps1` desde `AI-STEAM-VANILLA`
- [ ] Compilar CSS: `npx tailwindcss -i ..\AI-STEAM-MOCKUP\src\index.css -o .\assets\css\tailwind-output.css --minify`
- [ ] Convertir manualmente `translations.ts` → `translations.js` (eliminar tipos TS)
- [ ] Convertir manualmente `challenge-extras.ts` → `challenge-extras.js` (eliminar tipos TS)
- [ ] Crear `index.html` completo
- [ ] Implementar módulos base (router, i18n, state, main)
- [ ] Primer test en navegador: carga sin errores, header funciona
- [ ] Iniciar Fase 1 formal

---

## 🔗 Referencias Rápidas

**Comandos clave:**
```powershell
# Cambiar directorio
cd D:\CEICE

# Iniciar Fase 1
cd AI-STEAM-VANILLA
.\init-fase1.ps1

# Compilar CSS
npx tailwindcss -i ..\AI-STEAM-MOCKUP\src\index.css -o .\assets\css\tailwind-output.css --minify

# Servidor dev
python -m http.server 8000

# Minificar JS (Fase 5)
npx esbuild ./assets/js/main.js --bundle --minify --outfile=./assets/js/main.min.js
```

**Archivos a editar en nueva sesión:**

Creados (listos):
- `PLAN_CONVERSION_VANILLA.md` ✅
- `CLAUDE.md` ✅
- `init-fase1.ps1` ✅
- Estructura base (directorios) — ejecutar script

A crear (Fase 1):
- `index.html` (shell completo)
- `assets/css/main.css` (variables + layout)
- `assets/js/main.js` (orquestación)
- `assets/js/router.js` (tabs)
- `assets/js/i18n.js` (traducciones)
- `assets/js/state.js` (estado global)
- `assets/js/components/header.js`
- `assets/js/components/footer.js`
- `assets/js/components/cookie-banner.js`

A copiar y convertir:
- `assets/data/translations.js` (desde AI-STEAM-MOCKUP/src/translations.ts)
- `assets/data/challenge-extras.js` (desde AI-STEAM-MOCKUP/src/challengeExtras.ts)

---

## 📊 Estado Actual (2026-05-07)

```
AI-STEAM Network Mockup (React/Vite)
  ↓
Plan de Conversión ✅
  ↓
Artefactos Preparados ✅
  ↓
[ESPERANDO: Cambio de contexto y Fase 1]
  ↓
Vanilla HTML/CSS/JS (Objetivo Final)
```

---

## 🎓 Lecciones Aprendidas del Análisis Original

1. **Translations.ts es enorme** (2.692 líneas) pero su estructura es simple: `{ es: {...}, en: {...}, va: {...} }`
2. **LanguageContext es trivial** de reemplazar con un módulo JS simple
3. **No hay state real complejo** — todo cabe en un objeto global `appState`
4. **El routing no usa URLs** — es puro estado en memoria, facilita vanilla
5. **Lucide-react es reemplazable** por lucide vanilla directamente
6. **Tailwind está bien usado** — es puro utility classes, compilable estático
7. **ChallengeDetail es el único componente realmente complejo** (1.061 líneas de JSX)

---

**Próxima sesión iniciará cuando:**
1. Se abra contexto en `D:\CEICE`
2. Se confirme acceso a ambos proyectos
3. Se ejecute `init-fase1.ps1`
4. Se inicie implementación de Fase 1

**Actualización:** 2026-05-07 — Artefactos completados, listos para próxima sesión.
