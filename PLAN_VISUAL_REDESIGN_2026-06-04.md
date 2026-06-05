> ⛔ OBSOLETO (2026-06-05). Este plan (v2.0) quedó SUPERSEDIDO por
> `PLAN_VISUAL_REDESIGN_2026-06-05.md` (v3.0), que toma como fuente de verdad el prototipo
> AI-STEAM-MIGRATION. Su F2 (alternancia de fondos) se rechazó dos veces. Conservado solo
> como referencia histórica de ERRORES_APRENDIDOS. NO ejecutar las fases de este archivo.

# PLAN: Visual Redesign AI-STEAM-VANILLA
# Alineación Paleta + Lenguaje Visual AI-SECRETT — Punto 2 (Belén Cascales, 2026-06-02)
# Generado: 2026-06-04 | Versión: 2.0 (reescritura granular)

> CAMBIO v1→v2: La v1 sólo cambiaba el `<body>` y dejaba cada sección con su fondo
> blanco/gris, por lo que NO se percibía cambio. La v2 implementa el modelo real del
> email + AI-SECRETT: **secciones como bloques de color sólido a sangre completa que
> alternan Electric Blue / Deep Purple, con Sand Beige para zonas de descanso**, cards
> internas según regla de elevación, botones editoriales y titulares editoriales.
> Decisiones de diseño validadas con el skill `ui-ux-pro-max` (ver DESIGN_SYSTEM).

---

## ⚠️ ERRORES_APRENDIDOS — LEER ANTES DE EJECUTAR F2

### Error F2-v1 (2026-06-04): bloques de color saturados alternos — RECHAZADO

**Qué se intentó:** convertir cada sección de la Home en un bloque de color sólido a sangra
completa (morado/beige/azul/beige/morado/beige/azul). Inspirado en una lectura literal de
"intercalar Electric Blue y Deep Purple" del email de Belén Cascales.

**Por qué falló:** el resultado fue una colección de bandas de color intenso que "hace sufrir
a la vista" (palabras del responsable). Demasiado agresivo visualmente. Los colores #5620F6
y #4918AD son muy saturados; 8 secciones alternas a pantalla completa es sobrecarga visual.

### Error F2-v3 (2026-06-04): alternancia beige/blanco — TAMBIÉN RECHAZADO

**Qué se intentó:** corrección conservadora — solo alternancia sutil Sand Beige ↔ blanco,
eliminando el gris frío `bg-eu-bg`. Color fuerte solo en hero. "Sin bandas".

**Por qué falló:** el resultado también dio sensación de "bandas y bandas". El usuario no
lo encontró fino. Incluso el cambio sutil de tono entre secciones resultó perceptible y
repetitivo. No se aprobó ninguna versión de F2.

### Estado de home.js a 2026-06-04 EOD

`home.js` está en el estado **original pre-F2** (igual que al inicio del proyecto, a salvo
de los cambios de nav F1 que son en `header.js`). Los commits 91a1bc9 y c59ca58 existen
en el historial pero su contenido fue revertido.

### PREGUNTA SIN RESPUESTA para la siguiente sesión

¿Cómo debe verse la Home? Antes de ejecutar F2, el responsable debe aclarar:

1. **¿Qué tiene que cambiar visualmente en la Home respecto al estado original?**
   El estado actual (gris claro `bg-eu-bg` entre secciones) tampoco era el objetivo.
   Pero ninguna propuesta de sustitución ha gustado. Necesario: ver un mockup o una
   referencia visual concreta de AI-SECRETT u otro sitio que muestre el estilo deseado.

2. **Las secciones de la Home ¿deben tener fondo visible diferente entre sí?**
   Si sí → ¿qué tono/intensidad es aceptable? Si no → ¿solo dividirlas con espacio/línea?

3. **¿Dónde exactamente quiere el responsable ver los colores de la paleta (Electric Blue,
   Deep Purple, Sand Beige) en el cuerpo de la página?** Solo en tarjetas/chips/botones,
   o también en fondos de sección.

**RECOMENDACIÓN:** antes de ejecutar F2 de nuevo, hacer una reunión breve (o intercambio
de capturas de referencia) con Belén Cascales o el responsable para alinear criterio visual.
Las indicaciones del email son orientativas pero insuficientes para guiar la implementación
sin feedback iterativo.

---

## RESUMEN_EJECUTIVO

Adaptar AI-STEAM-VANILLA para que se perciba como parte de la plataforma AI-SECRETT,
no como una marca independiente. Continuidad visual: al pasar de aisecrett.eu a esta web
no debe sentirse un salto de "mundos distintos".

Directrices del email (punto 2), traducidas a acciones concretas:
1. Trabajar con la paleta corporativa: Electric Blue #5620F6, Deep Purple #4918AD, Sand Beige #FFF4E1.
2. Home y bloques principales: **intercalar Electric Blue y Deep Purple** como bloques sólidos.
3. Sand Beige para secciones de apoyo, bloques informativos, cards de formación y zonas de descanso.
4. **Eliminar blanco y gris como separadores** de sección; sustituirlos por color de paleta.
   "Lo que ahora es blanco podría ser nuestro Sand Beige."
5. Cards-caja-de-información: pueden ser lilas/degradados/beige de la paleta.
6. Navegación en MAYÚSCULAS, con presencia editorial (como el menú de AI-SECRETT).
7. Consistencia tipográfica acercada a AI-SECRETT (titulares editoriales).

Lenguaje visual de AI-SECRETT observado en aisecrett.eu:
- Bloques de color **sólido** a sangre completa que se alternan (no degradados en secciones).
- Navegación en mayúsculas, blanca sobre color.
- Titulares grandes, bold, editoriales.
- Botones minimalistas, casi cuadrados, sobrios.
- Sensación: institucional-editorial, limp­io, contenido primero.

Alcance: SOLO AI-STEAM-VANILLA. No se tocan loaders ni YAMLs de AI-STEAM-CONTENT.

---

## DESIGN_SYSTEM  (CANÓNICO — fuente de verdad para todos los agentes)

### DS.1 — Paleta y roles

```
--color-eu-blue   = #5620F6  Electric Blue   → bloques primarios, CTAs sobre claro, acentos
--color-eu-purple = #4918AD  Deep Purple     → bloques alternos, hover de CTAs
--color-eu-yellow = #FFF4E1  Sand Beige      → fondo de descanso, cards sobre color, body bg
--color-eu-text   = #111827  Near-black      → texto sobre fondos claros (beige/blanco)
--color-eu-footer = #24324A  Navy            → footer (NO TOCAR)
blanco #FFFFFF                               → cards sobre beige, texto sobre color
```

Aliases existentes (no usar para texto pequeño): eu-teal == eu-blue, eu-orange == eu-purple.

NUNCA editar `tailwind-output.css` ni `main.css`. Todo se hace con clases utilitarias.

### DS.2 — Color como ANCLA, no como banda  ⚠️ CORREGIDO 2026-06-04

DECISIÓN HUMANA (2026-06-04): el modelo de **bloques de color saturados alternos a sangre
completa** en el cuerpo (probado en F2 v1) se **RECHAZÓ por agresivo y cansado para la vista**.
Modelo correcto, editorial y sobrio (validado con skill ui-ux-pro-max → estilo editorial/magazine:
fondos claros + un acento de color + espacio en blanco):

- **Color fuerte (Electric Blue / Deep Purple) SOLO en ANCLAS**: hero (degradado), barra de
  navegación y footer. NUNCA secciones de cuerpo saturadas alternas.
- **Cuerpo de página**: fondos claros y cálidos con alternancia **SUTIL** Sand Beige
  (`bg-eu-yellow`) ↔ blanco (`bg-white`). Se elimina el gris frío (`bg-eu-bg`). La separación
  se logra con el cambio sutil de tono + espacio + sombras de card, no con bandas de color.
- **La marca vive en las CARDS y los acentos**: tintes suaves, bordes superiores de color
  (`border-t-4 border-eu-*`), iconos de color, eyebrows y botones en color. (Email: "las cards
  pueden ser lilas/degradados de la paleta".)
- Los HEROES de sección (Sectores, Formación, etc.) sí son un bloque de color sólido: es un
  único ancla superior, no una banda alterna → aceptable.

### DS.3 — Cards (tonos de marca como acento)

Las cards son donde vive el color de la paleta en el cuerpo. NO aplanarlas a un solo color.

- Sobre sección clara (beige/blanco): card `bg-white` o **tinte suave de marca** (`bg-eu-blue/5`,
  pastel) con acento: `border-t-4 border-eu-blue|eu-purple`, icono de color y sombra suave.
- **Mantener** los degradados pastel suaves existentes (dualFocus) y los bordes de tono
  (ecosystem): son elegantes y on-brand. NO sustituirlos por beige plano.
- Radio `rounded-xl`; sombra `shadow-sm`/`shadow-md`; `hover:shadow-lg` si es interactiva + `cursor-pointer`.
- Cards de ítems Marketplace/course/news/partner: `bg-white` (REGLA_4).
- NO usar `bg-white/10` translúcido (anti-patrón del skill: ilegible).

> DS.4 (texto sobre color) aplica SOLO dentro de las anclas (heroes/nav/footer), no en el cuerpo.

### DS.4 — Texto sobre fondo de color (oscuro)

Al convertir una sección a `bg-eu-blue` o `bg-eu-purple`:

| Elemento | Antes (sobre claro) | Después (sobre color) |
|---|---|---|
| Titular h2 | `text-eu-text` | `text-white` |
| Eyebrow / label | `text-gray-500` | `text-eu-yellow` |
| Descripción/cuerpo | `text-gray-600` / `text-gray-700` | `text-white/85` |
| Enlaces "ver todo" | `text-eu-blue` | `text-eu-yellow` (hover `text-white`) |
| Iconos sueltos | `text-eu-blue` | `text-eu-yellow` |
| Bordes divisores | `border-eu-border` | quitar, o `border-white/20` |

### DS.5 — Botones editoriales (decisión humana: estilo AI-SECRETT)

Forma común: `rounded-sm px-6 py-3 text-sm font-bold uppercase tracking-wide transition-colors duration-200`
(esquinas casi rectas, mayúsculas, peso fuerte, sobrio). Mínimo táctil 44px alto → `py-3` cumple.

| Contexto | Primario | Secundario |
|---|---|---|
| Sobre bloque de color (oscuro) | `bg-eu-yellow text-eu-purple hover:bg-white` | `border-2 border-white/60 text-white hover:bg-white/10` |
| Sobre Sand Beige (claro) | `bg-eu-blue text-white hover:bg-eu-purple` | `border-2 border-eu-blue text-eu-blue hover:bg-eu-blue hover:text-white` |

Mantener siempre el `focus:outline-none focus:ring-2 focus:ring-eu-blue focus:ring-offset-2`
(o `focus:ring-white` sobre color) por accesibilidad. Iconos Lucide dentro del botón, NO emojis.

### DS.6 — Tipografía editorial

Fuente: Instrument Sans (ya cargada). NO introducir serif — AI-SECRETT es sans. Mantener continuidad.

| Rol | Clases |
|---|---|
| Eyebrow (etiqueta superior) | `text-xs font-bold uppercase tracking-[0.2em]` + color de acento (eu-yellow sobre color / eu-blue sobre claro) |
| Titular de sección (h2) | `text-3xl md:text-4xl font-extrabold tracking-tight leading-tight` (sube desde el actual `text-2xl font-bold`) |
| Subtítulo de sección | `text-base md:text-lg` + color de cuerpo según fondo |
| Card title (h3) | `text-lg font-bold` |
| Cuerpo | `text-sm`/`text-base leading-relaxed` |
| Nav (hecho en F1) | `text-xs font-bold uppercase tracking-wider` |

### DS.7 — Accesibilidad (WCAG AA, ratios verificados)

| Combinación | Ratio | AA |
|---|---|---|
| blanco sobre Electric Blue #5620F6 | ~5.9:1 | ✅ |
| blanco sobre Deep Purple #4918AD | ~6.2:1 | ✅ |
| #111827 sobre Sand Beige #FFF4E1 | ~16.5:1 | ✅ |
| eu-blue #5620F6 sobre Sand Beige | ~5.0:1 | ✅ (texto/enlaces) |
| eu-purple #4918AD sobre Sand Beige | ~6.0:1 | ✅ |
| Sand Beige sobre Electric Blue | ~4.7:1 | ✅ sólo texto grande/bold o fills |

Reglas duras:
- Nunca `text-gray-5xx` sobre bloque de color (contraste insuficiente) → usar `text-white/85`.
- Beige como color de TEXTO sólo en tamaños grandes/bold; para fills (cards, botones) sin límite.
- `prefers-reduced-motion` ya respetado en main.css → no añadir animaciones que lo ignoren.
- `cursor-pointer` + focus ring en todo elemento interactivo. Iconos = SVG Lucide, nunca emoji.
  (Excepción tolerada: los emoji de sector ya existentes en home `sectorsBlock` son contenido, fuera de alcance.)

### DS.8 — Principios AI-SECRETT a respetar siempre

- Secciones = bloques de color **sólido** a sangre completa (degradado SÓLO en hero Home).
- Quitar líneas divisorias gris (`border-b border-eu-border` entre secciones) — el cambio de
  color de bloque ya separa visualmente. Mantener bordes sólo dentro de cards.
- Editorial, sobrio, contenido primero. Sin estridencia: el beige da respiro entre colores.

---

## PRESERVAR_INTACTO (colores semánticos — REGLA_2)

No tocar estos sistemas de color porque codifican significado funcional:
- 7 gradientes de sector (sectors.js): manufacturing, services/IA, agriculture, tourism, digital, energy, mobility.
- 5 colores de órganos de gobernanza (governance.js): GA, SC, AB, SN, SB.
- 4 colores del Cuádruple Hélice (network.js): higher-ed (purple), business (blue), public (green), civil (pink).
- Chips/badges del Marketplace (sector, ODS, competencias, tipo, estado, etapa) — son filtros y categorías.
- Tonos de estado de cards is/is-not (verde positivo / rojo negativo) en home `isNotBlock` — son semánticos.

Sobre un bloque de color, estos elementos viven DENTRO de cards Beige/blancas, así que conservan su fondo claro y siguen legibles.

---

## PATRON_HEROES_POR_SECCION

| Sección | Hero objetivo | Notas |
|---|---|---|
| Home | degradado `from-eu-blue to-eu-purple` | firma visual (decisión humana: mantener) |
| Sectores | `bg-eu-blue` sólido | continuidad |
| Formación | `bg-eu-purple` sólido | alternación editorial |
| Actualidad | `bg-eu-blue` sólido | |
| Gobernanza | `bg-eu-purple` sólido | |
| Conocimiento | `bg-eu-blue` sólido | |
| Red | `bg-eu-purple` sólido | |
| Marketplace | `bg-eu-blue` sólido | punto de acción principal |

---

## PROGRESO_GLOBAL

INSTRUCCION_HUMANO: indicador de estado. Consultar al inicio de cada sesión.
INSTRUCCION_LLM: al terminar el trabajo de una fase → `[~] EN_REVISION`. Tras aprobación humana
→ `[x] APROBADA` + commit local. Push sólo con autorización. UNA FASE = UN COMMIT. PARAR tras
cada fase para revisión humana.

| ID | Nombre | Estado | Aprobada |
|---|---|---|---|
| F0 | Fundación — body bg Sand Beige | `[~] EN_REVISION` | — |
| F1 | Navegación — MAYÚSCULAS editorial | `[~] EN_REVISION` | — |
| F2 | Home — bloques de color + cards + botones + tipografía | `[ ] PENDIENTE` ⚠️ VER ERRORES | — |
| F3 | Sectores | `[ ] PENDIENTE` | — |
| F4 | Formación (Training) | `[ ] PENDIENTE` | — |
| F5 | Actualidad (News) | `[ ] PENDIENTE` | — |
| F6 | Gobernanza | `[ ] PENDIENTE` | — |
| F7 | Conocimiento | `[ ] PENDIENTE` | — |
| F8 | Red (Network) | `[ ] PENDIENTE` | — |
| F9 | Marketplace — hero, tabs, filtros | `[ ] PENDIENTE` | — |
| F10 | Marketplace — cards | `[ ] PENDIENTE` | — |
| F11 | Revisión global + accesibilidad | `[ ] PENDIENTE` | — |

NOTA sobre F0/F1: son la FUNDACIÓN. El cambio de body bg (F0) casi no se percibe por sí solo
porque las secciones tienen su propio fondo; la transformación VISIBLE empieza en F2. F1 (nav
mayúsculas) ya es visible. Ambas quedan correctas como base; no requieren más trabajo salvo que
la revisión humana lo pida.

---

## FASE_F0: Fundación — body background Sand Beige  [HECHO, EN_REVISION]

ARCHIVOS: `index.html`
APLICADO: `<body class="… bg-eu-bg …">` → `bg-eu-yellow`.
ROL: capa de seguridad bajo las secciones. Verificación real combinada con F2.
COMMIT: `style(shell): body background bg-eu-bg → bg-eu-yellow (Sand Beige)`  [ya commiteado en ee60c0c]

---

## FASE_F1: Navegación — MAYÚSCULAS editorial  [HECHO, EN_REVISION]

ARCHIVOS: `assets/js/components/header.js`
APLICADO:
- Nav desktop: `text-sm font-medium` → `text-xs font-bold uppercase tracking-wider`.
- Nav mobile: `font-medium` → `font-bold uppercase tracking-wider`.
PENDIENTE_VERIFICACIÓN visual (no desborde en 1024px, legibilidad ES/EN/VA).
COMMIT: `style(nav): nav → MAYÚSCULAS presencia editorial`  [ya commiteado en ee60c0c]

OPCIONAL (sólo si la revisión humana lo pide): revisar la barra superior blanca del header
(logo) para acercarla más a AI-SECRETT; de momento se conserva.

---

## FASE_F2: Home — alineación sutil (modelo v3)  ⭐

STATUS: `[~] EN_REVISION`  (v3 aplicada 2026-06-04; verificada por captura a 1440px en :3000)
DEPENDENCIAS: F0, F1
ARCHIVOS: `assets/js/views/home.js`

HISTORIAL: v1 usaba bloques de color saturados alternos → RECHAZADO por agresivo (ver DS.2).
v3 (actual) = alineación sutil: color sólo en hero (ancla); cuerpo en alternancia cálida
Sand Beige ↔ blanco; cards conservan sus tonos de marca; titulares y botones editoriales.

CONTEXTO: la Home tiene 8 bloques. Orden real en `render()`:
Hero → IsNot → Enred → Ecosystem → Sectors → DualFocus → LatestChallenges → Partners.

ASIGNACIÓN_DE_FONDO (v3 — sutil; alternancia cálida, sin bandas de color):

| # | Bloque | Función | Fondo v3 |
|---|---|---|---|
| 1 | Hero | `renderHeroBlock` | degradado `from-eu-blue to-eu-purple` (ancla; mantener) |
| 2 | IsNot | `renderIsNotBlock` | `bg-eu-yellow` (Sand Beige) |
| 3 | Enred | `renderEnredBlock` | `bg-white` |
| 4 | Ecosystem | `renderEcosystemBlock` | `bg-eu-yellow` |
| 5 | Sectors | `renderSectorsBlock` | `bg-white` |
| 6 | DualFocus | `renderDualFocusBlock` | `bg-eu-yellow` |
| 7 | LatestChallenges | `renderLatestChallengesBlock` | `bg-white` |
| 8 | Partners | `renderConsortiumBlock` | `bg-eu-yellow` |

Secuencia: hero degradado → beige → blanco → beige → blanco → beige → blanco → beige → footer navy.

CAMBIOS APLICADOS (v3):
- Fondos: se eliminó el gris frío `bg-eu-bg` y los divisores `border-b/t border-eu-border`;
  alternancia Sand Beige ↔ blanco (sutil, cálida).
- Hero (ancla, mantiene degradado):
  - Botones editoriales: primario `bg-eu-yellow text-eu-purple … rounded-sm uppercase tracking-wide`
    (+ focus ring); secundario `border-2 border-white/60 … rounded-sm uppercase tracking-wide`.
  - Badge eyebrow `tracking-widest` → `tracking-[0.2em]`. Stat boxes `bg-white/10` → `bg-white/15`.
- Titulares de sección: `text-2xl font-bold` → `text-3xl md:text-4xl font-extrabold tracking-tight`
  (todos `text-eu-text`, porque el cuerpo es claro).
- Eyebrow de Partners: `text-gray-500 tracking-widest` → `text-eu-purple tracking-[0.2em]`.
- CARDS: se CONSERVAN sus tonos de marca originales (ecosystem `border-t-4` de tono + icono color;
  enred `thematic` borde morado; dualFocus degradados pastel; isNot neutral azul). NO se aplanaron.

PENDIENTE / posibles iteraciones (a decisión humana):
- Reforzar (si se quiere más marca) los tintes de card: p.ej. neutral isNot → `bg-eu-purple/5`.
- Suavizar aún más la alternancia (todo Sand Beige con cards elevadas) si el blanco contrasta mucho.

VERIFICACION (F2 v3):
1. Scroll completo: alternancia cálida sutil, sin bandas de color que cansen. Color sólo en hero/footer.
2. Sin `bg-eu-bg` ni divisores gris en el cuerpo.
3. Cards con sus tonos de marca, legibles; tonos verde/rojo is/is-not intactos.
4. Botones del hero editoriales con foco visible.
5. 375px y 1440px; ES/EN/VA; contraste AA.

COMMIT: `style(home): F2 v3 — alineación sutil (color sólo en hero, cuerpo beige/blanco, cards con tono de marca)`

---

## FASE_F3: Sectores

STATUS: `[ ] PENDIENTE` · ARCHIVOS: `assets/js/views/sectors.js`
INSTRUCCION_PREVIA: leer sectors.js y localizar hero + wrappers de sección.

OBJETIVO: hero `bg-eu-blue` sólido; cuerpo mayormente Sand Beige (sección de apoyo); un posible
bloque de refuerzo en color si la composición lo pide (opcional, sin saturar). Gradientes de
sector PRESERVADOS (DS / PRESERVAR_INTACTO).

CAMBIOS:
1. Hero: asegurar `bg-eu-blue` sólido (si fuera degradado, dejar sólido aquí). Botones hero → DS.5 (sobre color).
2. Todo wrapper de sección con `bg-white`/`bg-eu-bg` → `bg-eu-yellow`. Quitar `border-b/t border-eu-border` divisores.
3. Cadena de transferencia: wrapper → `bg-eu-yellow`; contenido interno intacto.
4. Sector cards (con gradiente propio) → SIN CAMBIO.
5. Titulares de sección → editorial (DS.6). Texto sobre beige se mantiene.
6. Eyebrows/labels → DS.6.

VERIFICACION: hero azul; gradientes de sector intactos (expandir 2-3); cuerpo Beige; cadena legible; AA; responsive.
COMMIT: `style(sectors): hero azul sólido + cuerpo Sand Beige, gradientes semánticos intactos`

---

## FASE_F4: Formación (Training)

STATUS: `[ ] PENDIENTE` · ARCHIVOS: `assets/js/views/training.js`
INSTRUCCION_PREVIA: leer training.js.

OBJETIVO: hero `bg-eu-purple`. Cursos sobre Sand Beige con course-cards blancas (caso de uso
explícito del email: "cards de formación" → Beige/blanco). Tabs en color de marca.

CAMBIOS:
1. Hero: `bg-eu-blue` → `bg-eu-purple`. Stats `text-eu-yellow` mantener. Botón CTA hero → DS.5 (sobre color).
2. Tab bar (FP/Docentes/Máster): tab activo `border-eu-blue text-eu-blue` → `border-eu-purple text-eu-purple`.
   Wrapper de tabs `bg-white`/`bg-eu-bg` → `bg-eu-yellow`. Tab inactivo: mantener.
3. Sección de cursos: wrapper → `bg-eu-yellow`. Course cards → `bg-white` (REGLA_4 / DS.3).
4. Badges modalidad/sector/nivel → mantener (semánticos).
5. Titulares editoriales (DS.6).

VERIFICACION: hero morado; 3 tabs ok; cursos Beige con cards blancas; badges legibles; AA; responsive.
COMMIT: `style(training): hero morado + cursos Sand Beige, tabs en paleta`

---

## FASE_F5: Actualidad (News)

STATUS: `[ ] PENDIENTE` · ARCHIVOS: `assets/js/views/news.js`
INSTRUCCION_PREVIA: leer news.js.

OBJETIVO: hero `bg-eu-blue`. Layout de noticias Sand Beige; news cards blancas. Featured opcional en color.

CAMBIOS:
1. Hero: mantener/asegurar `bg-eu-blue` sólido.
2. Layout de artículos: wrapper `bg-white`/`bg-eu-bg` → `bg-eu-yellow`. Quitar divisores gris.
3. News cards → `bg-white` (REGLA_4).
4. Sidebar (categorías/filtros): wrapper → `bg-eu-yellow`; items de filtro mantienen su estilo.
5. Featured/destacado: opción elegante → bloque `bg-eu-purple` (un único acento de color en el cuerpo) con card interna Beige; o conservador `bg-eu-yellow`. Elegir según composición y documentar en commit.
6. Vista de detalle de noticia: aplicar mismas reglas (wrappers de color, cuerpo legible).
7. Titulares editoriales; "ver todo"/enlaces según fondo.

VERIFICACION: hero azul; noticias sobre Beige; cards blancas legibles; filtros funcionales; detalle ok; AA; responsive.
COMMIT: `style(news): layout Sand Beige + (featured acento), cards blancas`

---

## FASE_F6: Gobernanza

STATUS: `[ ] PENDIENTE` · ARCHIVOS: `assets/js/views/governance.js`
INSTRUCCION_PREVIA: leer governance.js. Órganos GA/SC/AB/SN/SB son SEMÁNTICOS (PRESERVAR).

OBJETIVO: hero `bg-eu-purple`. Cuerpo de tabs Sand Beige. Colores de órganos intactos.

CAMBIOS:
1. Hero: `bg-eu-blue` → `bg-eu-purple`.
2. Tab bar (5 tabs): activo `border-eu-blue text-eu-blue` → `border-eu-purple text-eu-purple`. Wrapper → `bg-eu-yellow`.
3. Paneles de contenido bajo tabs: `bg-white`/`bg-eu-bg` → `bg-eu-yellow`. Quitar divisores gris.
4. Governance body cards (GA/SC/AB/SN/SB): PRESERVAR sus colores; sólo verificar contraste sobre Beige.
5. Lista de documentos: wrapper → `bg-eu-yellow`; document items mantienen `bg-white`.
6. Titulares editoriales.

VERIFICACION: hero morado; 5 órganos con color semántico intacto; cuerpo Beige; 5 tabs ok; AA; responsive.
COMMIT: `style(governance): hero morado + cuerpo Sand Beige, órganos preservados`

---

## FASE_F7: Conocimiento

STATUS: `[ ] PENDIENTE` · ARCHIVOS: `assets/js/views/knowledge.js`
INSTRUCCION_PREVIA: leer knowledge.js.

OBJETIVO: hero `bg-eu-blue`. 5 tabs con cuerpo Sand Beige; cards de recursos/evidencias/plantillas blancas.

CAMBIOS:
1. Hero: mantener/asegurar `bg-eu-blue` sólido.
2. Paneles de los 5 tabs: wrapper → `bg-eu-yellow`. Quitar divisores gris.
3. Cards OER/evidencias/plantillas → `bg-white` (REGLA_4).
4. Transfer cycle/flujo: wrapper → `bg-eu-yellow`; colores semánticos de nodos/pasos preservados.
5. Buscador OER: wrapper → `bg-eu-yellow`; input siempre `bg-white`.
6. Titulares editoriales.

VERIFICACION: hero azul; 5 tabs Beige; cards blancas; buscador funcional; AA; responsive.
COMMIT: `style(knowledge): cuerpo Sand Beige, cards blancas`

---

## FASE_F8: Red (Network)

STATUS: `[ ] PENDIENTE` · ARCHIVOS: `assets/js/views/network.js`
INSTRUCCION_PREVIA: leer network.js. Cuádruple Hélice (4 colores) SEMÁNTICO (PRESERVAR).

OBJETIVO: hero `bg-eu-purple`. Cuerpo (socios/stakeholders) Sand Beige. Hélice intacta.

CAMBIOS:
1. Hero: `bg-eu-blue` → `bg-eu-purple`.
2. Tab socios + tab stakeholders: wrappers → `bg-eu-yellow`. Quitar divisores gris.
3. Cuádruple Hélice: PRESERVAR los 4 colores; verificar contraste sobre Beige.
4. Partner/Stakeholder cards → `bg-white` (REGLA_4).
5. Formulario de participación: wrapper → `bg-eu-yellow`; inputs `bg-white`; botón submit → DS.5 (sobre claro).
6. Filtros país/categoría: mantener funcional. Titulares editoriales.

VERIFICACION: hero morado; 4 hélices con color intacto; cuerpo Beige; filtros ok; form ok; AA; responsive.
COMMIT: `style(network): hero morado + cuerpo Sand Beige, Hélice preservada`

---

## FASE_F9: Marketplace — hero, tabs y filtros

STATUS: `[ ] PENDIENTE` · ARCHIVOS: `assets/js/views/marketplace.js`
INSTRUCCION_PREVIA: leer la zona de hero/tabs/filtros de marketplace.js (render del shell).

OBJETIVO: hero `bg-eu-blue` (punto de acción). Tab bar + filtros + fondo de la grid en Sand Beige.

CAMBIOS:
1. Hero: mantener/asegurar `bg-eu-blue` sólido. Eyebrow `text-eu-yellow tracking-[0.2em]` (ya parecido).
2. Tab bar (Retos/Casos/Pilotos/Validaciones/Mentorías): wrapper `bg-white`/`bg-eu-bg` → `bg-eu-yellow`.
   Tab activo `border-eu-blue text-eu-blue` → mantener (paleta correcta). Inactivo → mantener.
3. Barra de filtros + buscador: wrapper → `bg-eu-yellow`. Chips/pills e input → mantener (funcionales).
4. Wrapper de la grid de cards: `bg-eu-bg`/`bg-white` → `bg-eu-yellow`.
5. Active filter chips: verificar legibilidad sobre Beige (sin cambio esperado).
6. Botones de acción del shell (si los hay) → DS.5.

VERIFICACION: hero azul; tab bar sobre Beige con activo/inactivo correcto; filtros funcionales (clic filtra); grid sobre Beige; AA; responsive.
COMMIT: `style(marketplace-shell): hero azul + tabs/filtros/grid en Sand Beige`

---

## FASE_F10: Marketplace — cards (todos los tipos)

STATUS: `[ ] PENDIENTE` · DEPENDENCIAS: F9 · ARCHIVOS: `assets/js/views/marketplace.js`

OBJETIVO: coherencia card-por-card sobre el nuevo fondo Beige. Card shells blancas (REGLA_4).

CAMBIOS:
1. `renderCardShell`: `bg-white border-eu-border shadow-sm hover:border-eu-blue` → MANTENER (blanco sobre Beige = elevación correcta).
2. `renderCardCallout` (callouts `bg-eu-bg`): dentro de card blanca, el gris suave es correcto → MANTENER.
   OPCIONAL elegante: `bg-eu-bg` → `bg-eu-yellow/40` para un matiz cálido coherente. Documentar decisión.
3. `renderCardMiniMeta` (`bg-white border-eu-border`): MANTENER.
4. Challenge detail (inline): secciones separadoras `bg-white`/`bg-eu-bg` → `bg-eu-yellow`; cabeceras de sección
   internas: opción `bg-eu-purple` para estructura (evaluar). Cards de contenido del detalle → blancas.
5. Chips/badges (sector/ODS/especialidad/tipo/estado) → MANTENER (semánticos).
6. Botones/CTA de card → DS.5 si procede (mantener "Ver X" como enlace con icono).

VERIFICACION: 5 tipos de card legibles sobre Beige; detalle de reto coherente; chips clicables; mobile 375px; AA.
COMMIT: `style(marketplace-cards): coherencia de cards sobre Sand Beige`

---

## FASE_F11: Revisión global + accesibilidad

STATUS: `[ ] PENDIENTE` · DEPENDENCIAS: F0–F10 · ARCHIVOS: todos los views + header/footer

CHECKLIST_GLOBAL:
- [ ] Ningún `border-b/t border-eu-border` separando secciones (el color de bloque separa).
- [ ] Ningún `bg-white`/`bg-gray-*`/`bg-eu-bg` usado como SEPARADOR de sección (sí permitido en cards/inputs).
- [ ] Alternación de color perceptible y rítmica; beige intercala (DS.2); sin dos colores adyacentes.
- [ ] Patrón de heroes correcto (tabla PATRON_HEROES_POR_SECCION).
- [ ] Regla de elevación de cards consistente (DS.3) en toda la web.
- [ ] Botones editoriales (DS.5) homogéneos; foco visible; iconos SVG (no emoji nuevos).
- [ ] Titulares editoriales (DS.6) coherentes entre secciones.
- [ ] Nav MAYÚSCULAS legible en todas las páginas; header sin desbordes.
- [ ] Footer intacto (`bg-eu-footer`).
- [ ] Colores semánticos intactos: sectores, gobernanza, hélice, chips marketplace, tonos is/is-not.
- [ ] Contraste AA (DS.7) en todas las combinaciones; sin texto gris sobre color.
- [ ] Responsive 375 / 768 / 1024 / 1440; ES / EN / VA sin desbordes ni ilegibilidad.
- [ ] `prefers-reduced-motion` respetado; transiciones 150–300ms.

PUSH_RECOMENDADO: tras aprobar F11, sugerir push a origin/master. Decide el humano.
COMMIT: `style(global): cierre visual overhaul — consistencia paleta/lenguaje AI-SECRETT`

---

## CONVENCIONES_PARA_AGENTES_LLM

1. SOLO clases Tailwind; nunca editar `tailwind-output.css`/`main.css`.
2. Antes de editar un view, LEERLO entero y localizar wrappers de sección y cards.
3. Aplicar DESIGN_SYSTEM (DS.1–DS.8) como fuente de verdad. Ante duda estética, priorizar:
   email punto 2 → DS → elegancia/accesibilidad (skill ui-ux-pro-max).
4. PRESERVAR colores semánticos (sección PRESERVAR_INTACTO).
5. REGLA_4: cards de ítems (challenge/case/pilot/validation/mentoring/course/news/partner) SIEMPRE `bg-white`.
6. Una fase = un commit. No mezclar fases. No commitear cambios no pedidos.
7. Verificar con `npx serve` + scroll completo ANTES de marcar EN_REVISION. PARAR para revisión humana.
8. Commits locales tras aprobación; push SÓLO con autorización humana.
9. Repo objetivo: D:\CEICE\AI-STEAM-VANILLA. No tocar AI-STEAM-CONTENT salvo indicación explícita.
10. Mensajes de commit: prefijo `style(<área>): …`; terminar con `Co-Authored-By: Claude …`.

---

## ARCHIVOS_CRITICOS

| Archivo | Rol | Fases |
|---|---|---|
| `index.html` | body bg | F0 |
| `assets/js/components/header.js` | nav editorial | F1 |
| `assets/js/components/footer.js` | verificar (sin cambios) | F11 |
| `assets/js/views/home.js` | bloques de color + cards + botones | F2 |
| `assets/js/views/sectors.js` | hero azul + cuerpo Beige | F3 |
| `assets/js/views/training.js` | hero morado + cursos Beige | F4 |
| `assets/js/views/news.js` | cuerpo Beige | F5 |
| `assets/js/views/governance.js` | hero morado + cuerpo Beige | F6 |
| `assets/js/views/knowledge.js` | cuerpo Beige | F7 |
| `assets/js/views/network.js` | hero morado + cuerpo Beige | F8 |
| `assets/js/views/marketplace.js` | hero + tabs + cards | F9, F10 |
| `assets/css/tailwind-output.css` | NO EDITAR | — |

---

## REFERENCIA_EMAIL_ORIGEN

Remitente: Belén Cascales (belencg20@gmail.com) · Fecha: 2026-06-02
Asunto: Re: Revisión de AI-STEAM-NETWORK - Alineación apariencia gráfica
Archivo: AI-STEAM-CONTENT/docs/Re_ Revisión de AI-STEAM-NETWORK - Alineación apariencia gráfica.eml

Extracto clave (punto 2, decodificado de base64):
> "A nivel visual, propondría acercar más AI-STEAM Network a la identidad principal de AI-SECRETT,
> para que se perciba claramente como una plataforma vinculada al proyecto y no como una marca independiente.
> La propuesta sería trabajar principalmente con la paleta corporativa ya definida:
> Electric Blue: #5620F6, Deep Purple: #4918AD y Sand Beige: #FFF4E1.
> Para la Home y los bloques principales, propondría utilizar de forma intercalada los colores
> Electric Blue y Deep Purple, siguiendo la línea visual de AI-SECRETT.
> El Sand Beige podría reservarse para secciones de apoyo, bloques informativos, cards de formación
> o zonas que necesiten más descanso visual.
> Esto implica que quizá sería conveniente eliminar los colores blanco y gris para dividir un
> apartado de otro y sustituirlo por colores de la paleta.
> Lo que ahora es blanco podría ser nuestro Sand Beige.
> Las cards que actúan a modo de cajas de información podrían ser cualquiera de los lilas o
> degradados que tenemos en la paleta.
> También revisaría la consistencia tipográfica y el tratamiento del menú para acercarlo más a la
> web principal de AI-SECRETT. … si en la web oficial las secciones del menú van en mayúsculas y con
> una presencia más editorial, podría replicarse ese criterio también aquí para reforzar
> continuidad visual entre ambas páginas."

REFERENCIA_VISUAL: https://aisecrett.eu/ (bloques de color sólido alternos, nav mayúsculas, titulares editoriales, botones sobrios).
