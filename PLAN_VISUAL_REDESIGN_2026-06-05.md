# PLAN: Visual Redesign AI-STEAM-VANILLA — v3.0
# Alineación con AI-SECRETT a partir del prototipo AI-STEAM-MIGRATION
# Generado: 2026-06-05 | SUPERSEDE a PLAN_VISUAL_REDESIGN_2026-06-04.md (v2.0)

> **POR QUÉ ESTA REESCRITURA.** La v2.0 (y sus intentos F2 v1/v3) fracasaron porque
> expresaban el rediseño a través de los **fondos de sección** (bandas de color, o
> alternancia beige↔blanco). Ambas se rechazaron por "bandas y bandas". El prototipo
> **AI-STEAM-MIGRATION** (`D:\CEICE\AI-STEAM-MIGRATION`, app Vite/React en :3003)
> demuestra el modelo correcto, **validado visualmente por el responsable (2026-06-05)**:
> el rediseño NO vive en los fondos, vive en **componentes, espacio, radios, acentos y
> tipografía**. Esta v3 reescribe el DESIGN_SYSTEM en torno a ese prototipo.

---

## 0. CAMBIO DE PARADIGMA (leer antes que nada)

| Dimensión | v2 (RECHAZADO ×2) | v3 — modelo MIGRATION (APROBADO) |
|---|---|---|
| Canvas global | Sand Beige fuerte `#FFF4E1` alternando con blanco | Off-white cálido casi imperceptible **`#FFFDF9`** + blanco puro |
| Separación de secciones | Por color de fondo (banda) | Por **espacio** (`py-32`) + *hairline* `border-eu-blue/10` |
| Sand Beige `#FFF4E1` | Fondo de secciones | **SOLO ACENTO**: círculos de iconos, fills de cards, badges, titular del hero |
| Color fuerte azul/morado | Bandas alternas en el cuerpo | **SOLO** en hero (degradado) + footer (navy) |
| Fuente del "wow" | inexistente | Espaciado generoso, **radios enormes**, cards con **barra de acento lateral**, tintes suaves, **hover-lift**, escala tipográfica grande |

**Regla mental:** si para diferenciar dos secciones estoy pensando en "qué color de fondo
le pongo", estoy reincidiendo en el error. La diferenciación es **espacio + cards**, no fondo.

---

## DECISIONES_HUMANAS (2026-06-05)

1. **Modelo de fondo:** modelo MIGRATION canónico — canvas `#FFFDF9`, Sand Beige solo acento.
   (Se acepta apartarse de la letra del email de Belén "lo blanco → Sand Beige": el prototipo
   aprobado prevalece sobre la directriz literal.)
2. **Técnica CSS:** añadir un archivo nuevo **`assets/css/redesign.css`** con las utilidades
   que el `tailwind-output.css` compilado no contiene (radios grandes, sombras violetas,
   escala tipográfica de `vanilla-fixes.css`, utilidades de card y de nav-pill). NO se
   recompila Tailwind. NO se edita `tailwind-output.css` ni `main.css`.
3. **Fondos del cuerpo (CLAVE, revisado 2026-06-05):** TODAS las secciones del cuerpo usan
   el canvas `#FFFDF9` (`rd-canvas`). **NO** se usan secciones de fondo blanco (`bg-white`)
   como banda: el responsable las rechazó ("han aparecido dos bandas con fondo blanco").
   El contraste y el relieve los dan las CARDS, no el fondo de sección:
   - Cards de ítem / la mayoría → **blancas** (`rd-card`), relieve por borde tenue + sombra
     violeta ("separar con luz, no con oscuridad").
   - Cards informativas / mega-cards (DualFocus) → **tinte de marca** (lila/azul oficial al
     ~6%, `tone.tintBg`), nunca beige-sobre-blanco ni naranja/colores de advertencia.
   - Sand Beige `#FFF4E1` SOLO en círculos de icono, badges y titular del hero.
   Regla dura: si una sección del cuerpo necesita `bg-white`, es un error → usar `rd-canvas`.

### INDEPENDENCIA DEL CMS (confirmado 2026-06-05)

El rediseño toca SOLO presentación de AI-STEAM-VANILLA (`redesign.css`, `index.html`,
`components/header.js`, `views/*.js`). NO toca YAML de AI-STEAM-CONTENT, loaders, `assets/data/*.js`
generados ni el admin Streamlit. Editar contenido en Streamlit y re-ejecutar loaders regenera
`assets/data/*.js` sin afectar vistas/CSS: son capas separadas. El mapeo id→icono de sector vive
en la vista (`SECTOR_ICONS` en home.js), no en los datos.

---

## ⚙️ BUILD CSS — OBLIGATORIO EN CADA FASE  (leer SIEMPRE, cualquier PC/agente)

> Desde F0b (2026-06-05) el CSS **se compila con Tailwind v4**; ya NO está congelado.
> `assets/css/tailwind-output.css` es un **archivo generado** desde
> `assets/css/tailwind-input.css`. Si añades/cambias clases Tailwind en cualquier
> `.js`/`.html` y NO recompilas, **los estilos nuevos no aparecerán**.

**Primera vez en un PC nuevo (o tras clonar):**
```powershell
cd D:\CEICE\AI-STEAM-VANILLA
npm install          # instala @tailwindcss/cli (node_modules NO está en git)
```

**Cada vez que cambies clases (en CADA fase, antes de verificar):**
```powershell
npm run build:css    # compila tailwind-input.css → tailwind-output.css (--minify)
```
o deja recompilación automática al guardar:
```powershell
npm run watch:css
```

**Reglas duras del build:**
1. NUNCA editar a mano `assets/css/tailwind-output.css` (se sobrescribe al compilar).
2. La paleta `eu-*` y la fuente **Instrument Sans** viven en `@theme` dentro de
   `tailwind-input.css`. Si falta una clase/var, se añade ahí, NO en el output.
3. `assets/css/redesign.css` es CSS escrito a mano (NO lo toca Tailwind) → editar libremente.
4. Orden de carga en `index.html`: tailwind-output.css → main.css → redesign.css.
5. Tras compilar, **commitea el `tailwind-output.css` regenerado** junto al cambio de clases.
6. Verificación visual con `npx serve -l 3000` + recarga forzada (Ctrl+Shift+R o DevTools
   "Disable cache"; los módulos ES cachean fuerte).
7. Si una clase usada "no aparece" tras compilar: Tailwind solo escanea lo declarado en
   `@source` (js, data, html). Clases por concatenación (`bg-${x}`) NO se detectan → usar la
   clase como literal completo o añadir `@source inline("…")` en `tailwind-input.css`.

> **Para Codex / otro agente / otro PC:** este proyecto requiere `npm run build:css` tras
> tocar clases. No asumas que basta con editar el JS. Confirma que el output se regeneró
> antes de dar una fase por terminada.

---

## DESIGN_SYSTEM v3 (CANÓNICO)

### DS.1 — Paleta y roles (extraída de App.tsx)

```
#FFFDF9  Canvas         → fondo global y de secciones "claras" (var --rd-canvas)
#FFFFFF  Blanco         → fondo de secciones alternas y de cards sobre canvas
#FFF4E1  Sand Beige     → ACENTO: círculos de icono, fills de card, badges, titular hero
#5620F6  Electric Blue  → degradado hero, barras de acento, iconos, CTAs, hover de cards
#4918AD  Deep Purple    → 2º color del degradado hero, acento alterno, hover de CTAs
#1E1B4B  Indigo profundo→ texto principal sobre claro (var --rd-text)
#24324A  Navy footer    → footer EXISTENTE (NO TOCAR)
```
Aliases tailwind ya presentes: `eu-blue`=#5620F6, `eu-purple`=#4918AD, `eu-yellow`=#FFF4E1,
`eu-footer`=#24324A. El canvas `#FFFDF9` y el texto `#1E1B4B` se definen en `redesign.css`.

### DS.2 — Ritmo y espacio (la base del rediseño)

- Secciones: padding vertical generoso. Utilidad `.rd-section` = `padding-block: 8rem` (py-32),
  responsive a `5rem` < 768px.
- Ancho de contenido: `max-width: 80rem` centrado (`.rd-container`, = `max-w-7xl mx-auto px-6`).
- Separación entre secciones: **un hairline** `border-top: 1px solid rgb(86 32 246 / .10)`
  (`.rd-divide`), NUNCA un bloque de color. El espacio hace casi todo el trabajo.
- Alternancia de fondo **mínima y cálida**: `--rd-canvas` (#FFFDF9) ↔ `#FFFFFF`. La diferencia
  es casi imperceptible; sirve solo para dar un levísimo relieve, no para "separar por color".

### DS.3 — Cards (AQUÍ vive la identidad)  ⭐ núcleo del rediseño

Patrón canónico (de App.tsx). Tres variantes:

**(a) Card estándar sobre canvas** — la mayoría de cards de ítem (REGLA_4):
```
fondo blanco · border 1px eu-blue/10 · radio grande (rounded-[2rem] → .rd-card)
padding interior amplio (p-10 → .rd-pad) · sombra suave violeta
hover: -translate-y-1 + sombra violeta más marcada + border eu-blue/30
```
Utilidad: `.rd-card` (radio + border + sombra + transición) + `.rd-card-hover` (lift).

**(b) Card con barra de acento lateral** — cards "destacadas"/informativas:
```
igual que (a) + barra vertical de color a la izquierda:
  ::before { position:absolute; left:0; top:0; width:.5rem; height:100%; background: eu-blue }
  variante morada para el par alterno (.rd-accent-purple)
```
Utilidad: `.rd-card-accent` (+ `.rd-accent-purple` para el alterno).

**(c) Card "tinte de marca"** — cuando el email pide "cards lilas/beige":
```
fondo Sand Beige al 30-40% (rgb(255 244 225 / .35)) o eu-blue/5 · resto igual que (a)
```
Utilidad: `.rd-card-tint` / `.rd-card-tint-blue`.

REGLAS:
- Cards de ítem (challenge/case/pilot/validation/mentoring/course/news/partner/stakeholder)
  → variante (a), **blanca** (REGLA_4). NUNCA translúcida `bg-white/10`.
- Cards informativas/explicativas ("Es/No es", "Foco dual", ecosistema) → (b) o (c).
- Radio grande SIEMPRE: las esquinas suaves son firma del prototipo.
- Iconos dentro de card: en **círculo Sand Beige** (`.rd-icon-circle`, fondo #FFF4E1, icono
  `text-eu-blue`), NUNCA emoji nuevo (excepción tolerada: emojis de sector ya existentes).
- PRESERVAR degradados pastel ya elegantes (dualFocus, ecosystem border-t de tono): on-brand.

### DS.4 — Iconos en círculo Sand Beige

Cada icono de presentación (sectores, features, avatares de bloque) va en un círculo
`background:#FFF4E1` con el glifo en `eu-blue`. Sombra interior suave (`shadow-inner`).
`group-hover:scale-110`. Es el patrón "Menú de Iconos" del prototipo (Áreas Sectoriales).

### DS.5 — Hero (ancla de color)

Único lugar (junto al footer) con color saturado:
- Fondo: degradado `from-#4918AD via-#521DE2 to-#5620F6` (`.rd-hero-gradient`).
- Titular en **Sand Beige `#FFF4E1`** (no blanco): contraste cálido (App.tsx).
- Eyebrow: píldora `bg-white/10 border-white/20 backdrop-blur uppercase tracking-[0.2em]`.
- Stats (si los hay): grid de cards **glassmórficas** `bg-white/10 backdrop-blur border-white/10
  rounded-3xl p-8`, número `text-5xl font-extrabold`, label `uppercase tracking-wider eu-yellow/80`.
- Botones: primario `bg-eu-yellow text-eu-purple rounded-full px-8 py-3.5 font-bold hover:bg-white`;
  secundario `border-2 border-white/30 text-white rounded-full hover:bg-white/10`.
  (NOTA: el prototipo usa `rounded-full` en hero; los botones del CUERPO siguen DS.7.)

### DS.6 — Menú / Navegación estilo AI-SECRETT  ⭐ IMPLEMENTADO (F1b, commit f699468)

Referencia visual aportada por el responsable (home de aisecrett.eu): la nav es una
**píldora oscura** que contiene las entradas en **MAYÚSCULAS**, tamaño grande y con
**mucho espaciado horizontal** entre ellas; a la derecha un botón CTA tipo píldora clara.

Objetivo para `header.js` (mejora sobre F1, que solo puso mayúsculas):
- Barra de nav desktop: contenedor **píldora** `border-radius: 9999px; background: eu-purple`
  (o el degradado), centrada, con padding generoso (`.rd-navpill`).
- Entradas: `text-sm font-bold uppercase tracking-wider`, **gap amplio** (`gap-8`/`gap-10`),
  color `text-white/90`, activa `text-white` con subrayado/realce sutil. Más "aire" que ahora.
- CTA(s) a la derecha: píldora clara `bg-eu-yellow text-eu-purple rounded-full` (Aules/ConsensUE).
- Mantener accesibilidad: `min-height:44px`, focus ring, idiomas ES/EN/VA.
- Mobile: dropdown actual conservado, entradas mayúsculas (ya hecho).

> Esto es lo que diferencia el menú de "solo mayúsculas" (F1) del menú editorial real de
> AI-SECRETT (tamaño + píldora + espaciado). Es una fase propia (F1b).

### DS.7 — Botones editoriales (cuerpo)

Forma común cuerpo: `rounded-full px-6 py-3 text-sm font-bold` (el prototipo usa `rounded-full`,
no `rounded-sm`; corrige la v2). Mínimo táctil 44px (`py-3` cumple).

| Contexto | Primario | Secundario |
|---|---|---|
| Sobre claro (canvas/blanco) | `bg-eu-blue text-white hover:bg-eu-purple` | `border border-eu-blue/20 text-eu-blue hover:bg-eu-blue/5` |
| Sobre color (hero) | `bg-eu-yellow text-eu-purple hover:bg-white` | `border-2 border-white/30 text-white hover:bg-white/10` |

Focus ring siempre. Iconos Lucide, nunca emoji.

### DS.8 — Tipografía editorial

Cargar en `redesign.css` la escala de `vanilla-fixes.css` (sube `--text-*` a la jerarquía
AI-SECRETT) **con cuidado**: aplicarla acotada (ver F0) para no romper layouts. Fuente
Instrument Sans (ya cargada). Roles:

| Rol | Estilo |
|---|---|
| Eyebrow | `text-xs font-bold uppercase tracking-[0.2em]` + acento (eu-yellow sobre color / eu-blue sobre claro) |
| Titular h2 | `text-4xl font-extrabold tracking-tight` — color `eu-purple` sobre claro (App.tsx usa #4918AD) |
| Subtítulo | `text-lg leading-relaxed text-eu-text/80` |
| Card title h3 | `text-2xl font-extrabold` (eu-purple o eu-text) |
| Cuerpo | **mínimo `text-lg` (1.125rem) `leading-relaxed`** — decisión humana 2026-06-05: textos algo mayores para facilitar la lectura. Evitar `text-sm`/`text-base` en párrafos de contenido (sí permitido en chips/labels/meta) |

> NOTA de color de titular: App.tsx pone los h2 en **Deep Purple #4918AD**, no en near-black.
> Es un rasgo distintivo del prototipo; adoptarlo.

### DS.9 — Accesibilidad (WCAG AA) — sin cambios respecto a v2

| Combinación | Ratio | AA |
|---|---|---|
| Sand Beige sobre Electric Blue (titular hero) | ~4.7:1 | ✅ texto grande/bold |
| #1E1B4B sobre #FFFDF9 | alto | ✅ |
| eu-purple #4918AD sobre #FFFDF9 (titulares) | ~6:1 | ✅ |
| blanco sobre eu-blue / eu-purple | ~5.9 / 6.2:1 | ✅ |

Reglas duras: nunca `text-gray-5xx` sobre color; `prefers-reduced-motion` respetado (main.css);
`cursor-pointer` + focus ring en interactivos; iconos SVG Lucide.

---

## PRESERVAR_INTACTO (colores semánticos — NO tocar)

- 7 gradientes de sector (sectors.js).
- 5 colores de órganos de gobernanza (governance.js): GA/SC/AB/SN/SB.
- 4 colores del Cuádruple Hélice (network.js).
- Chips/badges del Marketplace (sector, ODS, competencias, tipo, estado, etapa) = filtros.
- Tonos verde/rojo de is/is-not en home — semánticos.

Sobre el nuevo canvas claro, todos siguen viviendo DENTRO de cards claras → legibles.

---

## PROGRESO_GLOBAL

INSTRUCCION_LLM: al terminar una fase → `[~] EN_REVISION`. Tras aprobación humana → `[x] APROBADA`
+ commit local. UNA FASE = UN COMMIT. PARAR tras cada fase. Push solo con autorización.

| ID | Nombre | Estado | Notas |
|---|---|---|---|
| **F0** | **Fundación CSS** — crear `redesign.css` (tokens, utilidades de card, nav-pill, escala tipográfica) + enlazarlo en `index.html` | `[x] APROBADA` | commit `0a3a5b9` |
| **F0b** | **Recompilar Tailwind** — `tailwind-input.css` (@theme eu-* + @source) + build `build:css`; fin del CSS congelado | `[~] EN_REVISION` | 0 regresiones verificadas; ahora cualquier clase usada se compila sola |
| F1 | Body bg → canvas `#FFFDF9` | `[x] APROBADA` | commit `0a3a5b9` — Sand Beige liberado a acento |
| **F1b** | **Nav píldora editorial** (DS.6) — el menú AI-SECRETT real | `[x] APROBADA` | commit `f699468` — rd-nav-desktop/toggle/mobile en redesign.css, umbral 80rem |
| F2 | Home — espaciado + cards (DS.3) + iconos círculo + hero stats + titulares morados | `[x] APROBADA` | commit `bbdc6d0` |
| **F2b** | Home — correcciones doc estilo + hover por card (lift/edge) + iniciales que respiran + DualFocus beige oficial; "Últimas contribuciones" fuera de home | `[x] APROBADA` | commit `bbdc6d0` |
| F3 | Sectores — menú de iconos en círculo + cards | `[ ] PENDIENTE` | gradientes de sector intactos |
| F4 | Formación — hero + course cards (a) + tabs | `[ ] PENDIENTE` | |
| F5 | Actualidad — news cards (a) | `[ ] PENDIENTE` | |
| F6 | Gobernanza — cards + tabs; órganos intactos | `[ ] PENDIENTE` | |
| F7 | Conocimiento — cards + buscador | `[ ] PENDIENTE` | |
| F8 | Red — cards socios/stakeholders; hélice intacta | `[ ] PENDIENTE` | |
| F9 | Marketplace — hero + tabs + filtros | `[ ] PENDIENTE` | |
| F10 | Marketplace — cards (5 tipos) variante (a) | `[ ] PENDIENTE` | |
| F11 | Revisión global + accesibilidad | `[ ] PENDIENTE` | |

> Las fases F3–F11 heredan automáticamente F0: aplicar `.rd-section`, `.rd-card*`,
> `.rd-icon-circle`, titulares DS.8, botones DS.7. El "qué fondo" deja de ser la pregunta;
> la pregunta es "¿las cards y el espacio siguen el sistema?".

---

## FASE_F0: Fundación CSS — `assets/css/redesign.css`  ⭐ EMPEZAR AQUÍ

ARCHIVOS: nuevo `assets/css/redesign.css` + `index.html` (enlazar **después** de
`tailwind-output.css` y `main.css` para ganar cascada).

CONTENIDO (esqueleto):
```css
:root{
  --rd-canvas:#FFFDF9; --rd-text:#1E1B4B;
  --rd-blue:#5620F6; --rd-purple:#4918AD; --rd-beige:#FFF4E1;
}
/* Ritmo */
.rd-section{padding-block:8rem}
@media(max-width:767px){.rd-section{padding-block:5rem}}
.rd-divide{border-top:1px solid rgb(86 32 246 / .10)}
/* Cards */
.rd-card{background:#fff;border:1px solid rgb(86 32 246 / .10);
  border-radius:2rem;box-shadow:0 10px 30px -12px rgb(86 32 246 / .08);
  transition:transform .4s,box-shadow .4s,border-color .4s}
.rd-card-hover:hover{transform:translateY(-.5rem);
  box-shadow:0 24px 48px -16px rgb(86 32 246 / .18);border-color:rgb(86 32 246 / .30)}
.rd-card-accent{position:relative;overflow:hidden}
.rd-card-accent::before{content:"";position:absolute;left:0;top:0;width:.5rem;height:100%;
  background:var(--rd-blue);opacity:.85}
.rd-accent-purple::before{background:var(--rd-purple);opacity:.4}
.rd-card-tint{background:rgb(255 244 225 / .35)}
.rd-card-tint-blue{background:rgb(86 32 246 / .05)}
.rd-pad{padding:2.5rem}
/* Icono en círculo beige */
.rd-icon-circle{width:4rem;height:4rem;border-radius:9999px;background:var(--rd-beige);
  display:flex;align-items:center;justify-content:center;
  box-shadow:inset 0 2px 6px rgb(73 24 173 / .08)}
/* Hero */
.rd-hero-gradient{background:linear-gradient(135deg,#4918AD,#521DE2 55%,#5620F6)}
/* Nav píldora (DS.6) */
.rd-navpill{border-radius:9999px;background:var(--rd-purple);
  padding:.5rem 1.75rem;display:flex;align-items:center;gap:2.5rem}
/* Escala tipográfica editorial (de vanilla-fixes.css, acotada) */
.rd-section h2{font-size:2.625rem;line-height:1.1;letter-spacing:-.02em;
  font-weight:800;color:var(--rd-purple)}
```
(Refinar valores al integrar; los anteriores son punto de partida fiel al prototipo.)

VERIFICACION_F0: cargar la web; nada debe romperse (las clases `rd-*` aún sin usar no afectan).
Confirmar que `redesign.css` carga después de los otros dos CSS (orden en `<head>`).
COMMIT: `style(css): add redesign.css design system (modelo AI-STEAM-MIGRATION)`

---

## FASE_F1: Body background → canvas #FFFDF9

ARCHIVOS: `index.html`. El viejo F0 dejó `bg-eu-yellow` (Sand Beige fuerte) en `<body>`.
CAMBIO: `<body>` → fondo `var(--rd-canvas)` (vía clase `.rd-canvas` definida en F0, o
`style="background:#FFFDF9"`). El Sand Beige fuerte se libera para usarse SOLO como acento.
VERIFICACION: fondo global cálido casi-blanco, no beige saturado.
COMMIT: `style(shell): body bg → canvas #FFFDF9 (Sand Beige liberado a acento)`

---

## FASE_F1b: Nav píldora editorial AI-SECRETT  (DS.6)

ARCHIVOS: `assets/js/components/header.js`.
ESTADO ACTUAL: barra `nav.bg-eu-blue h-12` con botones `border-b-[3px]` (subrayado). Mayúsculas
ya aplicadas (viejo F1). FALTA el formato píldora + espaciado grande + presencia editorial.

CAMBIOS:
1. Envolver las entradas desktop en un contenedor `.rd-navpill` (píldora morada) centrado,
   en lugar de la barra `bg-eu-blue` a sangre. Gap amplio (`gap-10`).
2. Entradas: quitar `border-b-[3px]`; usar realce por color/peso. `text-sm font-bold uppercase
   tracking-wider text-white/90`; activa `text-white` (+ subrayado fino opcional).
3. CTA(s) (Aules/ConsensUE) → píldora clara DS.5 a la derecha si encaja en el layout actual.
4. Conservar idiomas ES/EN/VA, focus ring, min 44px, y todo el mobile dropdown.
5. Verificar que no desborda a 1024px con ES/EN/VA (textos más largos).
VERIFICACION: comparar contra la captura de aisecrett.eu (tamaño de entradas + espaciado +
píldora). Responsive y multilingüe sin desbordes.
COMMIT: `style(nav): píldora editorial estilo AI-SECRETT (DS.6)`

---

## FASE_F2: Home — modelo MIGRATION  ⭐ (reintento, estrategia nueva)

ARCHIVOS: `assets/js/views/home.js`. Bloques en `render()`:
Hero → IsNot → Enred → Ecosystem → Sectors → DualFocus → LatestChallenges → Partners.

> CLAVE: a diferencia de v2, **NO** vamos a pelear con el color de fondo de cada sección.
> Todas las secciones usan `.rd-section` sobre el canvas (alternancia mínima canvas↔blanco
> opcional, casi imperceptible). El cambio visible viene de cards, espacio, iconos y tipografía.

CAMBIOS (mapeados al prototipo App.tsx):
1. **Wrappers de sección** → `.rd-section` (+ `.rd-divide` arriba). Quitar `bg-eu-bg` gris y
   divisores gris. Alternancia opcional `#FFFDF9`↔`#fff` (sutil; si en duda, todo canvas).
2. **Hero** (`renderHeroBlock`) → `.rd-hero-gradient`; titular en Sand Beige; eyebrow píldora
   `tracking-[0.2em]`; si hay stats → grid glassmórfico DS.5; botones hero DS.5.
3. **IsNot** ("Es / No es") → dos cards variante (b) `.rd-card-accent`: "Es" con barra azul +
   icono Check en círculo; "No es" `.rd-accent-purple` + icono X. Conservar tono semántico
   verde/rojo si se decide, pero el prototipo los DESATURA a azul/morado (preferido).
4. **Ecosystem** → 3 cards `.rd-card .rd-card-hover .rd-pad`, radio grande; la activa con
   `.rd-card-tint` (Sand Beige) + borde `eu-blue`; avatar en `.rd-icon-circle` o gradiente.
5. **Sectors** (home) → menú de iconos en `.rd-icon-circle` (beige + icono azul), grid 7 col.
6. **DualFocus** → 2 mega-cards `.rd-card .rd-pad` radio `3rem`; avatar gradiente; bullets.
   CONSERVAR los degradados pastel existentes (on-brand).
7. **LatestChallenges** → cards de reto variante (a) blancas, hover-lift, badge de estado en
   píldora `eu-blue/5`, tag sector en chip Sand Beige (`bg-eu-yellow/60 text-eu-purple`).
8. **Partners** → grid de logos/cards `.rd-card` suaves.
9. **Titulares** de todas las secciones → DS.8 (h2 morado `text-4xl font-extrabold`).
10. PRESERVAR colores semánticos (PRESERVAR_INTACTO).

VERIFICACION: scroll completo se siente como el prototipo de :3003 (espacio, radios, cards con
acento, iconos beige), SIN bandas de color. 375/1440. ES/EN/VA. AA.
COMMIT: `style(home): F2 modelo MIGRATION — cards/espacio/iconos/tipografía, sin bandas`

---

## FASES F3–F11 (resumen — aplican el mismo sistema)

Cada fase: leer el view entero; envolver secciones en `.rd-section`; convertir cards al
patrón DS.3 (item→(a) blanca; informativa→(b)/(c)); iconos a `.rd-icon-circle`; titulares
DS.8; botones DS.7; **preservar** los colores semánticos de cada sección. Hero de sección:
un único bloque de color sólido arriba (`bg-eu-blue` o `bg-eu-purple` según tabla), NO bandas.

| Fase | Archivo | Hero | Específico a preservar |
|---|---|---|---|
| F3 Sectores | `sectors.js` | `bg-eu-blue` | 7 gradientes de sector |
| F4 Formación | `training.js` | `bg-eu-purple` | badges modalidad/nivel; course cards (a) |
| F5 Actualidad | `news.js` | `bg-eu-blue` | news cards (a); featured opcional card tint |
| F6 Gobernanza | `governance.js` | `bg-eu-purple` | 5 colores de órganos |
| F7 Conocimiento | `knowledge.js` | `bg-eu-blue` | nodos de flujo; buscador OER input blanco |
| F8 Red | `network.js` | `bg-eu-purple` | 4 colores Cuádruple Hélice; form |
| F9 Marketplace shell | `marketplace.js` | `bg-eu-blue` | tabs + chips filtro (semánticos) |
| F10 Marketplace cards | `marketplace.js` | — | 5 tipos card (a); detalle inline; chips |
| F11 Revisión global | todos | — | checklist abajo |

COMMITS: `style(<área>): F<n> modelo MIGRATION — cards/espacio/tipografía`

---

## FASE_F11: Revisión global + accesibilidad

CHECKLIST:
- [ ] `redesign.css` cargado después de los otros CSS; utilidades `rd-*` aplicadas coherentemente.
- [ ] Ninguna sección diferenciada por banda de color de fondo (solo espacio + hairline).
- [ ] Sand Beige aparece SOLO como acento (iconos/cards/badges/titular hero), nunca como fondo de sección.
- [ ] Color saturado SOLO en heroes y footer.
- [ ] Cards: radio grande, padding amplio, hover-lift, acento de color donde corresponde (DS.3).
- [ ] Iconos de presentación en círculo Sand Beige (DS.4).
- [ ] Nav píldora editorial (DS.6) en todas las páginas; sin desbordes ES/EN/VA.
- [ ] Titulares h2 en Deep Purple, escala editorial (DS.8).
- [ ] Botones DS.7 homogéneos; focus visible; iconos SVG.
- [ ] Colores semánticos intactos (sectores, gobernanza, hélice, chips marketplace, is/is-not).
- [ ] Footer intacto (`eu-footer`).
- [ ] Contraste AA (DS.9); sin texto gris sobre color.
- [ ] Responsive 375/768/1024/1440; ES/EN/VA; `prefers-reduced-motion` respetado.
COMMIT: `style(global): cierre visual overhaul — modelo AI-STEAM-MIGRATION`

---

## CONVENCIONES_PARA_AGENTES_LLM

1. Fuente de verdad estética: **el prototipo `D:\CEICE\AI-STEAM-MIGRATION` (App.tsx, :3003)**.
   Ante duda, abrir el prototipo y replicar su tratamiento de cards/espacio/acentos.
2. NO editar `tailwind-output.css` ni `main.css`. Las utilidades nuevas van en `redesign.css`.
   Para casos puntuales, `style=""` inline (patrón ya usado en el proyecto).
3. Antes de tocar un view, LEERLO entero; localizar wrappers de sección y cards.
4. PRESERVAR colores semánticos (PRESERVAR_INTACTO). REGLA_4: cards de ítem siempre blancas.
5. Una fase = un commit (`style(<área>): …` + `Co-Authored-By: Claude …`). PARAR para revisión.
6. Verificar con `npx serve -l 3000` + scroll completo ANTES de marcar EN_REVISION.
7. Repo objetivo: `D:\CEICE\AI-STEAM-VANILLA`. No tocar AI-STEAM-CONTENT.
8. Push SOLO con autorización humana.

---

## ARCHIVOS_CRITICOS

| Archivo | Rol | Fases |
|---|---|---|
| `assets/css/redesign.css` (NUEVO) | design system v3 | F0 (y todas) |
| `index.html` | enlazar redesign.css + body canvas | F0, F1 |
| `assets/js/components/header.js` | nav píldora editorial | F1b |
| `assets/js/views/home.js` | modelo MIGRATION | F2 |
| `assets/js/views/{sectors,training,news,governance,knowledge,network}.js` | cards/espacio | F3–F8 |
| `assets/js/views/marketplace.js` | shell + cards | F9, F10 |
| `assets/css/tailwind-output.css` · `assets/css/main.css` | NO EDITAR | — |

---

## REFERENCIAS

- Prototipo aprobado: `D:\CEICE\AI-STEAM-MIGRATION` (App.tsx) — corre en `npm run dev` → :3003.
- Variables tipográficas/cálidas: `D:\CEICE\AI-STEAM-MIGRATION\assets\css\vanilla-fixes.css`.
- Email origen (punto 2): Belén Cascales 2026-06-02 — ver
  `AI-STEAM-CONTENT/docs/Re_ Revisión de AI-STEAM-NETWORK - Alineación apariencia gráfica.eml`.
- Menú AI-SECRETT: captura aportada por el responsable (2026-06-05) + https://aisecrett.eu/
- Plan anterior (obsoleto): `PLAN_VISUAL_REDESIGN_2026-06-04.md` (v2.0, F2 rechazado ×2).
