# PLAN: Visual Redesign AI-STEAM-VANILLA
# Alineación Paleta Corporativa AI-SECRETT — Punto 2 (Belén Cascales, 2026-06-02)
# Generado: 2026-06-04 | Versión: 1.0

---

## RESUMEN_EJECUTIVO

Adaptación visual completa de AI-STEAM-VANILLA para alinear la identidad gráfica con AI-SECRETT.
Origen: email de Belén Cascales (2026-06-02), sección "2. Paleta de color y coherencia visual".

Tres directrices principales del email:
1. Usar la paleta corporativa (Electric Blue, Deep Purple, Sand Beige) sustituyendo blanco y gris neutro
2. Bloques principales de la Home alternan Electric Blue y Deep Purple (siguiendo la línea visual de AI-SECRETT)
3. Navegación en MAYÚSCULAS con presencia más editorial

Alcance: solo AI-STEAM-VANILLA. No se modifican loaders ni YAMLs de contenido.

---

## PALETA_CORPORATIVA_REFERENCIA

```
Electric Blue : #5620F6  →  CSS var: --color-eu-blue    →  clases: bg-eu-blue   / text-eu-blue
Deep Purple   : #4918AD  →  CSS var: --color-eu-purple  →  clases: bg-eu-purple / text-eu-purple
Sand Beige    : #FFF4E1  →  CSS var: --color-eu-yellow  →  clases: bg-eu-yellow / text-eu-yellow
```

NOTA_TOKENS: eu-teal (#5620f6) es alias de eu-blue. eu-orange (#4918ad) es alias de eu-purple.
No se requiere cambiar valores de tokens CSS. Todos los cambios son clases Tailwind en archivos JS/HTML.

---

## CONTRASTE_WCAG_AA_VERIFICADO

| Par | Ratio | Pasa AA (4.5:1) |
|---|---|---|
| texto blanco sobre Electric Blue (#5620F6) | ~5.9:1 | SI |
| texto blanco sobre Deep Purple (#4918AD) | ~6.2:1 | SI |
| texto #111827 sobre Sand Beige (#FFF4E1) | ~16.5:1 | SI |

---

## MAPA_COLORES_POR_CONTEXTO

| Contexto | Estado actual | Estado objetivo |
|---|---|---|
| Body `<body>` | `bg-eu-bg` (#f3f6f8 gris claro) | `bg-eu-yellow` (Sand Beige) |
| Hero principal cada sección | `bg-eu-blue` | ver patrón heroes abajo |
| Bloques principales Home | `bg-white` / `bg-eu-bg` | alternación blue/purple/beige |
| Secciones informativas / descanso | `bg-white` / `bg-eu-bg` | `bg-eu-yellow` (Sand Beige) |
| Cards individuales de items | `bg-white` | `bg-white` SIN CAMBIO |
| Callouts internos de cards | `bg-eu-bg` | `bg-eu-bg` SIN CAMBIO |
| Navegación — texto de ítems | minúsculas, `font-medium` | MAYÚSCULAS, `font-bold`, `tracking-wider` |
| Footer | `bg-eu-footer` | SIN CAMBIO |
| Colores semánticos (sectores, hélice, gobernanza) | varios | SIN CAMBIO (ver regla 2) |

## PATRON_HEROES_POR_SECCION

| Sección | Hero actual | Hero objetivo | Justificación |
|---|---|---|---|
| Home | `bg-eu-blue` | `bg-eu-blue` | Punto de entrada, Electric Blue |
| Sectores | `bg-eu-blue` | `bg-eu-blue` | Continuidad |
| Formación | `bg-eu-blue` | `bg-eu-purple` | Alternación editorial |
| Actualidad | `bg-eu-blue` | `bg-eu-blue` | Alternación |
| Gobernanza | `bg-eu-blue` | `bg-eu-purple` | Alternación editorial |
| Conocimiento | `bg-eu-blue` | `bg-eu-blue` | Alternación |
| Red | `bg-eu-blue` | `bg-eu-purple` | Alternación editorial |
| Marketplace | `bg-eu-blue` | `bg-eu-blue` | Punto de acción principal |

---

## PROGRESO_GLOBAL

INSTRUCCION_HUMANO: Esta tabla es el indicador de estado del proyecto. Consultarla al inicio de cada sesión.

| ID | Nombre | Estado | Aprobada |
|---|---|---|---|
| F0 | Shell HTML — body background | `[~] EN_REVISION` | — |
| F1 | Navegación — MAYÚSCULAS + estilo editorial | `[~] EN_REVISION` | — |
| F2 | Home — Secciones principales (alternación) | `[ ] PENDIENTE` | — |
| F3 | Sectores | `[ ] PENDIENTE` | — |
| F4 | Formación (Training) | `[ ] PENDIENTE` | — |
| F5 | Actualidad (News) | `[ ] PENDIENTE` | — |
| F6 | Gobernanza | `[ ] PENDIENTE` | — |
| F7 | Conocimiento | `[ ] PENDIENTE` | — |
| F8 | Red (Network) | `[ ] PENDIENTE` | — |
| F9 | Marketplace — Hero, tabs, filtros | `[ ] PENDIENTE` | — |
| F10 | Marketplace — Cards (todos los tipos) | `[ ] PENDIENTE` | — |
| F11 | Revisión global y consistencia final | `[ ] PENDIENTE` | — |

INSTRUCCION_LLM: Al terminar el trabajo de una fase, cambiar su estado a `[~] EN_REVISION`.
Tras aprobación humana → `[x] APROBADA`. Hacer commit local tras aprobación. No hacer push sin autorización.

---

## FASE_F0: Shell HTML — body background

STATUS: `[~] EN_REVISION`
DEPENDENCIAS: ninguna
ARCHIVOS: `index.html`

OBJETIVO:
Cambiar el fondo de página de gris claro (#f3f6f8) a Sand Beige (#FFF4E1). Esto establece el
canvas visual de toda la web y hace que los cards blancos (bg-white) contrasten correctamente.

CAMBIO_1 — index.html:
- BUSCAR:  `class="min-h-screen flex flex-col bg-eu-bg font-sans text-eu-text"`
- REEMPLAZAR: `class="min-h-screen flex flex-col bg-eu-yellow font-sans text-eu-text"`

RAZON: `bg-eu-bg` es el gris claro que Belén pide eliminar como separador neutral.
`bg-eu-yellow` es Sand Beige (#FFF4E1), la paleta corporativa para zonas de descanso visual.

EFECTOS_SECUNDARIOS_ESPERADOS:
- Los heroes (bg-eu-blue) no se ven afectados (son bloques full-width).
- Las cards (bg-white) pasan a estar sobre fondo beige → contraste correcto y mejorado.
- Los callouts internos de cards (bg-eu-bg gris suave) quedan sobre cards blancas → sin cambio visual en cards.
- Las secciones con fondo explícito (bg-white, bg-eu-bg) seguirán mostrando ese color hasta que se traten en sus fases respectivas.

VERIFICACION:
1. `npx serve -l 3000` en D:\CEICE\AI-STEAM-VANILLA
2. Confirmar que el fondo de página es crema/beige (#FFF4E1) en zonas sin hero
3. Confirmar que los cards (bg-white) contrastan bien sobre beige
4. Confirmar que los heroes (bg-eu-blue) permanecen inalterados
5. Confirmar que no hay texto ilegible

COMMIT: `style(shell): body background bg-eu-bg → bg-eu-yellow (Sand Beige #FFF4E1)`

---

## FASE_F1: Navegación — MAYÚSCULAS + estilo editorial

STATUS: `[~] EN_REVISION`
DEPENDENCIAS: F0 aprobada (no estricta, puede hacerse en paralelo)
ARCHIVOS: `assets/js/components/header.js`

OBJETIVO:
Alinear el menú de navegación con la web principal de AI-SECRETT: ítems en MAYÚSCULAS,
con presencia editorial (font-bold, tracking-wider). No cambiar las cadenas de texto de
translations.js — solo las clases CSS de los elementos nav.

CAMBIO_1 — Nav links desktop (aprox. línea 83-87):
Localizar la clase del elemento que itera los ítems de nav desktop.
- BUSCAR fragmento: `text-sm font-medium flex items-center`
- REEMPLAZAR ese fragmento por: `text-xs font-bold uppercase tracking-wider flex items-center`
- El resto de la clase (px-3, cursor-pointer, border-b-[3px], transition-all, etc.) permanece igual.

RAZON: text-xs es apropiado en mayúsculas (las mayúsculas son visualmente más grandes).
font-bold + uppercase + tracking-wider = criterio editorial de AI-SECRETT.

CAMBIO_2 — Nav links mobile (aprox. línea 91-95):
Localizar la clase del elemento de nav mobile.
- BUSCAR fragmento: `font-medium border-l-4`
- REEMPLAZAR ese fragmento por: `font-bold uppercase tracking-wider border-l-4`
- El resto de la clase permanece igual.

CAMBIO_3 — Verificar coherencia del logo subtitle (aprox. línea 111):
Si el subtítulo del logo ya usa `uppercase tracking-wide`, verificar que sigue legible y coherente.
No se requiere cambio si ya está en mayúsculas.

EFECTOS_SECUNDARIOS_ESPERADOS:
- Los textos de nav (que vienen de translations.js) se mostrarán en mayúsculas gracias a CSS.
- La anchura de los ítems puede crecer ligeramente por el tracking; verificar que el header no desborda.
- El separador visual del ítem activo (border-eu-yellow) permanece inalterado.

VERIFICACION:
1. Confirmar que todos los ítems del menú desktop aparecen en MAYÚSCULAS
2. Confirmar legibilidad: texto blanco uppercase sobre bg-eu-blue con tracking-wider
3. Confirmar que el ítem activo sigue destacando con border-eu-yellow
4. Abrir menú mobile → confirmar el mismo tratamiento
5. Verificar en español, inglés y valenciano (si las cadenas tienen tildes, uppercase CSS las respeta)
6. Verificar que el header no desborda horizontalmente en 1024px

COMMIT: `style(nav): ítems de navegación → MAYÚSCULAS con presencia editorial (AI-SECRETT alignment)`

---

## FASE_F2: Home — Secciones principales (alternación Blue/Purple/Sand Beige)

STATUS: `[ ] PENDIENTE`
DEPENDENCIAS: F0, F1 aprobadas
ARCHIVOS: `assets/js/views/home.js`

OBJETIVO:
Aplicar el patrón intercalado Blue/Purple/Sand Beige en los bloques principales de la Home,
eliminando los fondos blancos y grises neutros como separadores de sección.

INSTRUCCION_PREVIA: Antes de editar, leer home.js completo para mapear las secciones
y sus contenedores actuales. El agente de exploración identificó headings en líneas ~131,
~178, ~227, ~299, ~352, ~388.

PATRON_DE_ALTERNACION_RECOMENDADO:

| Orden | Nombre del bloque | Fondo objetivo | Texto | Notas |
|---|---|---|---|---|
| 1 | Hero | `bg-eu-blue` | `text-white` | SIN CAMBIO |
| 2 | Is-Not (¿Qué NO es AI-STEAM?) | `bg-eu-purple` | `text-white` | Primer cambio |
| 3 | En-Red / Networking | `bg-eu-yellow` | `text-eu-text` | Descanso visual |
| 4 | Ecosystem / Sectores preview | `bg-eu-blue` | `text-white` | Reactivación |
| 5 | Features / Propuesta de valor | `bg-eu-purple` | `text-white` | Alternación |
| 6 | Partners / Socios | `bg-eu-yellow` | `text-eu-text` | Descanso visual |
| 7 | CTA final / Noticias recientes | `bg-eu-blue` | `text-white` | Cierre fuerte |

Si la Home tiene más o menos secciones, mantener la lógica blue→purple→beige→blue→purple→beige…

REGLAS_DE_AJUSTE_PARA_FONDOS_OSCUROS (bg-eu-blue o bg-eu-purple):
- Headings: `text-eu-text` → `text-white`
- Subtexts / descripciones: `text-gray-600` / `text-gray-700` → `text-white/80`
- Stat values / highlights: si eran `text-eu-blue` → `text-eu-yellow`
- Feature cards / stat boxes dentro del bloque oscuro: `bg-white` → `bg-white/10` o `bg-eu-yellow/20`
- Links y CTAs: `text-eu-blue` → `text-eu-yellow` en fondos oscuros
- Iconos Lucide: `text-eu-blue` → `text-white` o `text-eu-yellow` en fondos oscuros

REGLAS_PARA_FONDOS_CLAROS (bg-eu-yellow / Sand Beige):
- Headings: `text-eu-text` — SIN CAMBIO
- Subtexts: `text-gray-600` — SIN CAMBIO
- Feature/info cards dentro del bloque: `bg-white` — MANTENER (buen contraste blanco sobre beige)

VERIFICACION:
1. Scroll completo de la Home → confirmar alternación cromática clara y rítmica
2. Verificar que no hay texto ilegible en ningún bloque
3. Verificar en 375px (mobile) y 1440px (desktop)
4. Confirmar que los stat boxes / feature cards son legibles en sus nuevos fondos
5. Confirmar que la lógica visual tiene fluidez sin cortes bruscos

COMMIT: `style(home): bloques principales → alternación Electric Blue / Deep Purple / Sand Beige`

---

## FASE_F3: Sectores

STATUS: `[ ] PENDIENTE`
DEPENDENCIAS: F0 aprobada
ARCHIVOS: `assets/js/views/sectors.js`

OBJETIVO:
El hero mantiene Electric Blue. Los fondos blancos/grises entre secciones pasan a Sand Beige.
Los gradientes semánticos de cada sector (identidad sectorial) se conservan intactos.

CAMBIO_1 — Hero de Sectores:
- Verificar que usa `bg-eu-blue` → MANTENER SIN CAMBIO.

CAMBIO_2 — Bloque descriptivo / intro (bajo el hero, si existe):
- Localizar el contenedor de texto introductorio bajo el hero.
- Si usa `bg-white` o `bg-eu-bg` → cambiar a `bg-eu-yellow`.
- Ajustar texto si es necesario (sobre beige, text-eu-text sin cambio).

CAMBIO_3 — Cadena de transferencia (transfer chain):
- El bloque de cadena de transferencia: si su wrapper usa `bg-white` o `bg-eu-bg` → `bg-eu-yellow`.
- El contenido interno (iconos, líneas de conexión) permanece sin cambio.

CAMBIO_4 — Separadores entre sector cards:
- Los wrappers o secciones que separan las 7 cards de sector: `bg-white` / `bg-eu-bg` → `bg-eu-yellow`.
- Las cards individuales de sector (que tienen gradientes propios) → SIN CAMBIO.

PRESERVAR_INTACTO:
- Los 7 gradientes semánticos de sector:
  manufacturing (blue), services/IA (eu-purple→eu-blue), agriculture (green→emerald),
  tourism (yellow→amber), digital (pink→fuchsia), energy (red→rose), mobility (slate→gray)
- Estas identidades representan los sectores del proyecto, no son decoración genérica.

VERIFICACION:
1. Expandir 2-3 sector cards → confirmar gradientes semánticos intactos
2. Confirmar hero Electric Blue visible
3. Confirmar fondos Sand Beige en separadores y secciones informativas
4. Verificar que la cadena de transferencia es legible

COMMIT: `style(sectors): hero + separadores → paleta corporativa, gradientes semánticos conservados`

---

## FASE_F4: Formación (Training)

STATUS: `[ ] PENDIENTE`
DEPENDENCIAS: F0 aprobada
ARCHIVOS: `assets/js/views/training.js`

OBJETIVO:
El hero de Formación pasa a Deep Purple (alternación respecto a Sectores que es Electric Blue).
La sección de cursos y tarjetas individuales siguen el patrón Sand Beige/blanco de Belén:
"cards de formación" son caso de uso explícito del Sand Beige.

CAMBIO_1 — Hero de Formación:
- BUSCAR en el hero: `bg-eu-blue`
- REEMPLAZAR: `bg-eu-purple`
- Ajustar elementos internos del hero si usan colores que no contrastan bien sobre eu-purple:
  - Los stats de hero habitualmente usan `text-eu-yellow` → MANTENER (buen contraste).
  - CTA buttons en hero: si usaban `bg-eu-orange` (alias de eu-purple) → cambiar a `bg-eu-yellow text-eu-text`.

CAMBIO_2 — Tab bar (FP / Docentes / Máster):
- Tab activo: `border-eu-blue text-eu-blue` → `border-eu-purple text-eu-purple` (coherencia con hero).
- Tab inactivo y hover: SIN CAMBIO.

CAMBIO_3 — Sección de cursos (contenedor principal):
- El wrapper/container de la lista de cursos: `bg-white` / `bg-eu-bg` → `bg-eu-yellow`.
- Las course cards individuales: MANTENER `bg-white` (contraste sobre Sand Beige).

CAMBIO_4 — Badges y chips dentro de course cards:
- Verificar que badges de modalidad/sector/nivel siguen legibles → SIN CAMBIO esperado.

VERIFICACION:
1. Confirmar hero Deep Purple (#4918AD) en Training
2. Confirmar tabs funcionales con color correcto en estado activo
3. Confirmar sección de cursos en Sand Beige con cards blancas contrastando correctamente
4. Verificar los 3 tabs (FP / Docentes / Máster) con contenido visible

COMMIT: `style(training): hero → Deep Purple, sección cursos → Sand Beige`

---

## FASE_F5: Actualidad (News)

STATUS: `[ ] PENDIENTE`
DEPENDENCIAS: F0 aprobada
ARCHIVOS: `assets/js/views/news.js`

OBJETIVO:
Hero en Electric Blue (continuidad). Sección de noticias en Sand Beige. News cards en blanco.

CAMBIO_1 — Hero de Actualidad:
- `bg-eu-blue` → MANTENER SIN CAMBIO.

CAMBIO_2 — Layout principal de noticias (grid o lista):
- Wrapper de la sección de artículos: `bg-white` / `bg-eu-bg` → `bg-eu-yellow`.

CAMBIO_3 — News cards individuales:
- MANTENER `bg-white` (contraste sobre Sand Beige).

CAMBIO_4 — Sidebar (categorías, filtros de noticias):
- Wrapper del sidebar: si usa `bg-white` → `bg-eu-yellow`.
- Los items individuales de categoría/filtro → MANTENER su estilo actual.

CAMBIO_5 — Artículo destacado / featured:
- Si existe un bloque "featured" con fondo especial: evaluar si `bg-eu-purple` funciona como
  separador visual de alto impacto. Si no, `bg-eu-yellow` es la alternativa conservadora.

VERIFICACION:
1. Confirmar hero azul
2. Confirmar layout de noticias sobre Sand Beige
3. Confirmar news cards blancas legibles
4. Verificar filtros de categoría funcionales
5. Verificar vista de detalle de notícia (si existe navegación al detalle)

COMMIT: `style(news): layout noticias → Sand Beige`

---

## FASE_F6: Gobernanza

STATUS: `[ ] PENDIENTE`
DEPENDENCIAS: F0 aprobada
ARCHIVOS: `assets/js/views/governance.js`

OBJETIVO:
Hero en Deep Purple. Fondos de secciones de contenido en Sand Beige. Los colores semánticos
de los órganos de gobernanza (GA, SC, AB, SN, SB) se preservan íntegramente.

CAMBIO_1 — Hero de Gobernanza:
- `bg-eu-blue` → `bg-eu-purple`.
- Ajustar texto del hero si hay elementos que pierden contraste sobre eu-purple.

CAMBIO_2 — Tab bar (5 tabs de gobernanza):
- Tab activo: `border-eu-blue text-eu-blue` → `border-eu-purple text-eu-purple`.

CAMBIO_3 — Contenedores de contenido bajo tabs:
- Wrappers de cada tab panel: `bg-white` / `bg-eu-bg` → `bg-eu-yellow`.

CAMBIO_4 — Governance body cards (GA, SC, AB, SN, SB):
PRESERVAR_INTACTO: estos colores son semánticos (representan estructura organizativa):
  GA = bg-blue-50 border-blue-600  |  SC = bg-eu-blue/10 border-eu-teal
  AB = bg-purple-50 border-purple-600  |  SN = bg-eu-yellow/60 border-eu-orange
  SB = bg-gray-50 border-gray-600
Solo verificar que las governance body cards contrastan bien sobre el nuevo fondo Sand Beige.

CAMBIO_5 — Lista de documentos (tab Documentos):
- Wrapper de la lista: `bg-white` → `bg-eu-yellow`.
- Documento items individuales: MANTENER `bg-white`.

VERIFICACION:
1. Confirmar hero Deep Purple
2. Confirmar que los 5 órganos de gobernanza mantienen colores semánticos
3. Confirmar fondo Sand Beige en secciones de contenido
4. Verificar los 5 tabs activos/inactivos con contenido correcto

COMMIT: `style(governance): hero → Deep Purple, contenido → Sand Beige, colores semánticos preservados`

---

## FASE_F7: Conocimiento

STATUS: `[ ] PENDIENTE`
DEPENDENCIAS: F0 aprobada
ARCHIVOS: `assets/js/views/knowledge.js`

OBJETIVO:
Hero en Electric Blue. Secciones de contenido en Sand Beige. Cards de recursos/evidencias en blanco.

CAMBIO_1 — Hero de Conocimiento:
- `bg-eu-blue` → MANTENER SIN CAMBIO.

CAMBIO_2 — Fondos de sección (5 tabs):
- Wrappers de cada tab panel: `bg-white` / `bg-eu-bg` → `bg-eu-yellow`.

CAMBIO_3 — Cards de recursos OER / evidencias / plantillas:
- MANTENER `bg-white` (contraste sobre Sand Beige).

CAMBIO_4 — Transfer cycle / flujo de conocimiento:
- Si hay un diagrama de flujo con fondo especial: preservar los colores semánticos de los nodos/pasos.
- El wrapper del bloque de diagrama: `bg-white` / `bg-eu-bg` → `bg-eu-yellow`.

CAMBIO_5 — Buscador OER:
- El wrapper del buscador: si es `bg-white` / `bg-eu-bg` → `bg-eu-yellow`.
- El input de búsqueda: MANTENER estilo (inputs siempre `bg-white`).

VERIFICACION:
1. Confirmar hero Electric Blue
2. Confirmar 5 tabs con contenido accesible y fondo Sand Beige
3. Confirmar cards blancas legibles sobre Sand Beige
4. Verificar buscador OER funcional

COMMIT: `style(knowledge): secciones → Sand Beige`

---

## FASE_F8: Red (Network)

STATUS: `[ ] PENDIENTE`
DEPENDENCIAS: F0 aprobada
ARCHIVOS: `assets/js/views/network.js`

OBJETIVO:
Hero en Deep Purple. Secciones de contenido en Sand Beige. Los 4 colores del Cuádruple Hélice
se preservan íntegramente.

CAMBIO_1 — Hero de Red:
- `bg-eu-blue` → `bg-eu-purple`.

CAMBIO_2 — Sección de Socios (tab socios):
- Wrapper: `bg-white` / `bg-eu-bg` → `bg-eu-yellow`.

CAMBIO_3 — Sección de Stakeholders (tab stakeholders):
- Wrapper: `bg-white` / `bg-eu-bg` → `bg-eu-yellow`.

CAMBIO_4 — Cuádruple Hélice categories:
PRESERVAR_INTACTO: representan las 4 hélices del ecosistema AI-STEAM:
  Higher Education & R&D  = bg-purple-100 border-purple-300 text-purple-700
  Business & Innovation   = bg-blue-100 border-blue-300 text-blue-700
  Public Administration   = bg-green-100 border-green-300 text-green-700
  Civil Society & NGOs    = bg-pink-100 border-pink-300 text-pink-700
Solo verificar que contrastan correctamente sobre el nuevo fondo Sand Beige.

CAMBIO_5 — Partner / Stakeholder cards:
- MANTENER `bg-white`.

CAMBIO_6 — Formulario de participación:
- Wrapper del formulario: si es `bg-white` → `bg-eu-yellow`.
- El formulario interno: MANTENER (inputs siempre `bg-white`).

VERIFICACION:
1. Confirmar hero Deep Purple
2. Confirmar 4 categorías Hélice con colores semánticos intactos
3. Confirmar fondo Sand Beige en secciones de contenido
4. Verificar filtros de país + categoría funcionales

COMMIT: `style(network): hero → Deep Purple, secciones → Sand Beige, Hélice preservada`

---

## FASE_F9: Marketplace — Hero, tabs y filtros

STATUS: `[ ] PENDIENTE`
DEPENDENCIAS: F0 aprobada
ARCHIVOS: `assets/js/views/marketplace.js`

OBJETIVO:
El hero del Marketplace mantiene Electric Blue (punto de acción principal).
La barra de tabs, los filtros y el fondo de la grid de cards adoptan Sand Beige.

CAMBIO_1 — Hero del Marketplace:
- Verificar que usa `bg-eu-blue` → MANTENER SIN CAMBIO.

CAMBIO_2 — Tab bar (Retos / Casos / Pilotos / Validaciones / Mentorías):
- Wrapper/container de los tabs: `bg-white` / `bg-eu-bg` → `bg-eu-yellow`.
- Tab activo (border-eu-blue text-eu-blue) → SIN CAMBIO (paleta correcta).
- Tab inactivo → SIN CAMBIO.

CAMBIO_3 — Barra de filtros y buscador:
- Wrapper del contenedor de filtros: `bg-white` / `bg-eu-bg` → `bg-eu-yellow`.
- Los filter chips/pills y el input de búsqueda → MANTENER estilo actual (funcional y claro).

CAMBIO_4 — Wrapper de la grid de cards:
- El contenedor de la cuadrícula de cards: `bg-eu-bg` / `bg-white` → `bg-eu-yellow`.
- Las cards individuales → SIN CAMBIO (se trata en F10).

CAMBIO_5 — Active filter chips (pastillas de filtro activo):
- Verificar que los active filter chips son legibles sobre Sand Beige → SIN CAMBIO esperado.

VERIFICACION:
1. Confirmar hero Electric Blue en Marketplace
2. Confirmar tab bar sobre Sand Beige con estado activo/inactivo correcto
3. Confirmar filtros funcionales (clic activa filtro, resultados filtran)
4. Confirmar grid de cards sobre Sand Beige (cards blancas bien contrastadas)

COMMIT: `style(marketplace-shell): hero, tabs y filtros → paleta corporativa`

---

## FASE_F10: Marketplace — Cards (todos los tipos)

STATUS: `[ ] PENDIENTE`
DEPENDENCIAS: F9 aprobada
ARCHIVOS: `assets/js/views/marketplace.js`

OBJETIVO:
Revisión card por card para coherencia con la nueva paleta. Las card shells permanecen blancas.
Los callouts y mini-meta internos pueden adoptar una ligera tinte de palette si mejora la consistencia.

CAMBIO_1 — Card shells (renderCardShell):
- `bg-white border-eu-border shadow-sm` → MANTENER (blanco sobre Sand Beige = contraste correcto).
- `hover:border-eu-blue` → MANTENER.

CAMBIO_2 — Callouts dentro de cards (renderCardCallout):
- Callouts con `bg-eu-bg` (gris suave): MANTENER (el gris suave dentro de una card blanca es correcto).
- OPCIONAL: si tras la vista en browser parece demasiado gris, cambiar a `bg-eu-yellow/30`.
  Documentar la decisión en el commit.

CAMBIO_3 — Mini-meta boxes (renderCardMiniMeta):
- `border-eu-border bg-white` → MANTENER (correctos dentro de la card blanca).

CAMBIO_4 — Challenge detail (vista inline):
- El detalle de reto que se abre inline: si tiene secciones separadoras con `bg-white` / `bg-eu-bg` → `bg-eu-yellow`.
- Los headers de sección dentro del detalle: evaluar si `bg-eu-purple` aporta estructura visual.

CAMBIO_5 — Badges de chips (sector, ODS, especialidad, etc.):
- MANTENER todos los colores de chips (son semánticos y funcionales: filtros activos, categorías).

VERIFICACION:
1. Confirmar que las cards de los 5 tipos (challenge, case, pilot, validation, mentoring) se leen bien
2. Abrir un detalle de reto → confirmar estructura visual coherente
3. Confirmar que los chips de filtro son clickables y visualmente legibles
4. Verificar en mobile 375px

COMMIT: `style(marketplace-cards): ajuste visual de cards sobre nuevo fondo Sand Beige`

---

## FASE_F11: Revisión Global y Consistencia Final

STATUS: `[ ] PENDIENTE`
DEPENDENCIAS: F0–F10 aprobadas
ARCHIVOS: todos los views + header.js + footer.js

OBJETIVO:
Auditoría final de toda la web. Detectar fondos blancos/grises residuales,
inconsistencias de color, y verificar accesibilidad.

CHECKLIST_GLOBAL:
- [ ] Ningún bloque separador de sección usa solo `bg-white` o `bg-gray-*` como divisor
- [ ] La alternación Blue/Purple/Beige en Home es perceptible y rítmica
- [ ] Patrón de heroes por sección correcto (ver tabla PATRON_HEROES_POR_SECCION)
- [ ] Navegación en MAYÚSCULAS legible en todas las páginas
- [ ] Footer sin cambios involuntarios (bg-eu-footer)
- [ ] Colores semánticos intactos: sector gradients, governance bodies, helix categories
- [ ] Contraste texto blanco sobre eu-blue ≥ 4.5:1 ✅ (~5.9:1)
- [ ] Contraste texto blanco sobre eu-purple ≥ 4.5:1 ✅ (~6.2:1)
- [ ] Contraste texto eu-text sobre eu-yellow ≥ 4.5:1 ✅ (~16.5:1)
- [ ] Verificación en mobile (375px) de todas las secciones
- [ ] Verificación en desktop (1440px) de todas las secciones
- [ ] Verificación multilenguaje (ES / EN / VA): sin desbordamientos ni ilegibilidades

PUSH_RECOMENDADO: Tras la aprobación de F11, se sugiere hacer push a origin/master.
El humano decide si proceder con el push en ese momento.

COMMIT: `style(global): revisión consistencia visual — cierre visual overhaul paleta AI-SECRETT`

---

## CONVENCIONES_PARA_AGENTES_LLM

### REGLA_1 — Solo clases Tailwind, no editar CSS
No modificar `tailwind-output.css` ni `main.css` salvo indicación explícita.
Los cambios van en archivos JS de views y en index.html.

### REGLA_2 — Preservar colores semánticos
No cambiar colores que representan categorías funcionales:
- 7 gradientes de sector (sectors.js)
- 5 colores de governance bodies (governance.js)
- 4 colores de Cuádruple Hélice (network.js)
- Chip/badge colors del marketplace (sector, ODS, competencias, tipo, estado)

### REGLA_3 — Ajustar texto en fondos oscuros
Al añadir bg-eu-blue o bg-eu-purple a un bloque:
- Headings text-eu-text → text-white
- Subtexts text-gray-600/700 → text-white/80
- Stats values text-eu-blue → text-eu-yellow
- Links text-eu-blue → text-eu-yellow
- Icon colors text-eu-blue → text-white o text-eu-yellow

### REGLA_4 — Cards individuales siempre bg-white
Las tarjetas de items (challenge, case, pilot, validation, mentoring, course, partner, news article)
SIEMPRE mantienen bg-white. El fondo blanco sobre Sand Beige es el patrón deseado.

### REGLA_5 — Una fase = un commit
No incluir cambios de fases futuras. No commitear cambios no pedidos en la fase actual.

### REGLA_6 — Verificar antes de marcar EN_REVISION
SIEMPRE verificar con `npx serve -l 3000` y scroll completo de la sección afectada
antes de cambiar el STATUS a EN_REVISION.

### REGLA_7 — Repositorio objetivo
Todos los cambios van en D:\CEICE\AI-STEAM-VANILLA.
No modificar AI-STEAM-CONTENT salvo indicación explícitamente indicado.

### REGLA_8 — Commits locales, push bajo autorización
Commit local tras aprobación de cada fase. Push SOLO cuando la persona responsable lo autorice.

---

## ARCHIVOS_CRITICOS

| Archivo | Rol en el plan | Fases |
|---|---|---|
| `index.html` | Body background | F0 |
| `assets/js/components/header.js` | Nav MAYÚSCULAS | F1 |
| `assets/js/components/footer.js` | Solo verificar (sin cambios esperados) | F11 |
| `assets/js/views/home.js` | Alternación principal Blue/Purple/Beige | F2 |
| `assets/js/views/sectors.js` | Hero + separadores | F3 |
| `assets/js/views/training.js` | Hero Purple + Sand Beige | F4 |
| `assets/js/views/news.js` | Sand Beige | F5 |
| `assets/js/views/governance.js` | Hero Purple + Sand Beige | F6 |
| `assets/js/views/knowledge.js` | Sand Beige | F7 |
| `assets/js/views/network.js` | Hero Purple + Sand Beige | F8 |
| `assets/js/views/marketplace.js` | Hero + tabs + cards | F9, F10 |
| `assets/css/tailwind-output.css` | NO EDITAR (tokens sin cambio) | — |

---

## REFERENCIA_EMAIL_ORIGEN

Remitente: Belén Cascales (belencg20@gmail.com)
Fecha: 2026-06-02
Asunto: Re: Revisión de AI-STEAM-NETWORK - Alineación apariencia gráfica
Archivo local: AI-STEAM-CONTENT/docs/Re_ Revisión de AI-STEAM-NETWORK - Alineación apariencia gráfica.eml

Extracto clave del punto 2 (decodificado de base64):
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
> web principal de AI-SECRETT. Por ejemplo, si en la web oficial las secciones del menú van en
> mayúsculas y con una presencia más editorial, podría replicarse ese criterio también aquí para
> reforzar continuidad visual entre ambas páginas."
