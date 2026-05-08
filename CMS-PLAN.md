# Plan de Implementación CMS Estático — AI-STEAM Network

**Versión:** 2.0  
**Fecha:** 2026-05-08  
**Estado:** Plan revisado (NO implementado)  
**Repositorios:**
- `AI-STEAM-VANILLA` → web pública (GitHub público) — solo recibe archivos generados
- `AI-STEAM-CONTENT` → contenidos + scripts (GitHub privado) — aquí trabaja el editor

---

## Índice

1. [Principios de diseño](#1-principios-de-diseño)
2. [Arquitectura de dos repositorios](#2-arquitectura-de-dos-repositorios)
3. [Formatos de archivo elegidos](#3-formatos-de-archivo-elegidos)
4. [Estructura de AI-STEAM-CONTENT](#4-estructura-de-ai-steam-content)
5. [Diseño de contenidos por sección](#5-diseño-de-contenidos-por-sección)
6. [Sistema de visibilidad](#6-sistema-de-visibilidad)
7. [Arquitectura de scripts](#7-arquitectura-de-scripts)
8. [Orquestador CLI](#8-orquestador-cli)
9. [Flujo de trabajo diario del editor](#9-flujo-de-trabajo-diario-del-editor)
10. [Plantillas de contenido](#10-plantillas-de-contenido)
11. [Cambios necesarios en AI-STEAM-VANILLA](#11-cambios-necesarios-en-ai-steam-vanilla)
12. [Fases de implementación](#12-fases-de-implementación)
13. [Consideraciones técnicas](#13-consideraciones-técnicas)

---

## 1. Principios de diseño

El CMS se rige por estos principios en orden de prioridad:

1. **El editor no escribe código** — Solo edita archivos familiares (Excel, Word/Markdown, texto plano).
2. **Un comando por sección** — Nada de procesos complejos ni encadenamiento manual.
3. **El repositorio web no expone la gestión** — `AI-STEAM-VANILLA` solo tiene lo que ve el usuario.
4. **Formatos que cualquiera puede abrir** — Excel para listas, Markdown para textos, nada de JSON puro.
5. **Errores claros, no silenciosos** — Si algo falla, el script lo dice con nombre de archivo y línea.
6. **Plantillas siempre disponibles** — Cada sección tiene un archivo de ejemplo que se copia y rellena.

---

## 2. Arquitectura de dos repositorios

```
D:\CEICE\
├── AI-STEAM-CONTENT/     ← Repo PRIVADO (GitHub private)
│   │                        Editor trabaja aquí
│   ├── content/             Archivos fuente (Excel, Markdown, etc.)
│   ├── scripts/             Scripts Node.js de carga
│   ├── plantillas/          Archivos de ejemplo para copiar
│   └── docs/                Guías de uso (en español)
│
└── AI-STEAM-VANILLA/     ← Repo PÚBLICO (GitHub public)
    │                        Solo el sitio web final
    ├── assets/
    │   ├── data/            ← Los scripts escriben aquí (archivos .js generados)
    │   └── js/views/        Los scripts NO tocan esto
    └── index.html
```

### Flujo entre repos

```
AI-STEAM-CONTENT/content/   →  scripts/  →  AI-STEAM-VANILLA/assets/data/
     (edita el editor)           (Node)         (generado automáticamente)
                                                        ↓
                                               git push → sitio web
```

### Lo que se commitea en cada repo

**AI-STEAM-CONTENT** (privado):
```bash
git add content/ plantillas/
git commit -m "cms: actualizar noticias mayo 2026"
git push  # → repo privado
```

**AI-STEAM-VANILLA** (público):
```bash
git add assets/data/
git commit -m "cms: publicar noticias mayo 2026"
git push  # → repo público → sitio en producción
```

### Configuración de rutas

`AI-STEAM-CONTENT/scripts/config.js`:
```javascript
export const CONFIG = {
  contentDir: '../AI-STEAM-CONTENT/content',   // relativo al script
  outputDir:  '../AI-STEAM-VANILLA/assets/data', // donde escribe los .js
  mediaDir:   '../AI-STEAM-VANILLA/assets/media', // donde copia media
};
```

---

## 3. Formatos de archivo elegidos

### Criterio de selección

| Tipo de contenido | Formato elegido | Por qué |
|---|---|---|
| Listas y tablas | **Excel (.xlsx) / CSV** | Cualquiera sabe usar una hoja de cálculo |
| Textos editoriales | **Markdown (.md)** | Legible sin herramientas, muchos editores gratuitos |
| Configuración simple | **YAML (.yml)** | Mucho más legible que JSON, sin llaves ni comas |
| Textos UI cortos | **Excel con columnas por idioma** | El editor ve las 3 versiones a la vez en columnas |
| Adjuntos | **PDF / Word / Excel / imágenes** | El archivo tal cual, sin conversión |

### Lo que NO se usa

- ❌ **JSON** como formato editable — difícil para humanos (comas, llaves, comillas)
- ❌ **Bases de datos** — no es necesario para este sistema
- ❌ **Formularios web** — fuera del alcance de esta fase

### Herramientas necesarias para el editor

| Herramienta | Para qué | Gratuita |
|---|---|---|
| Excel o LibreOffice Calc | Editar listas (socios, retos, cursos...) | LibreOffice sí |
| VS Code o Typora o Obsidian | Editar Markdown | Todas gratuitas |
| Cualquier explorador de archivos | Gestionar carpetas y adjuntos | Sí |
| Node.js ≥ 18 | Ejecutar scripts de carga | Sí |
| Git | Sincronizar repos | Sí |

---

## 4. Estructura de AI-STEAM-CONTENT

```
AI-STEAM-CONTENT/
│
├── content/
│   ├── _ui/                          Textos de interfaz (3 archivos YAML)
│   ├── noticias/                     Noticias y eventos
│   ├── retos/                        Banco de retos
│   ├── socios/                       Red: socios y stakeholders
│   ├── sectores/                     Los 7 sectores
│   ├── formacion/                    Cursos FP, docente, máster
│   ├── conocimiento/                 Recursos y plantillas
│   ├── gobernanza/                   Documentos de gobernanza
│   └── media/                        Imágenes y documentos
│
├── scripts/
│   ├── cms.js                        CLI orquestador (un solo punto de entrada)
│   ├── config.js                     Rutas de entrada y salida
│   ├── loaders/
│   │   ├── ui.js
│   │   ├── noticias.js
│   │   ├── retos.js
│   │   ├── socios.js
│   │   ├── sectores.js
│   │   ├── formacion.js
│   │   ├── conocimiento.js
│   │   ├── gobernanza.js
│   │   └── media.js
│   └── utils/
│       ├── excel.js                  Lector de .xlsx → arrays de objetos
│       ├── markdown.js               Parser: frontmatter + cuerpo → HTML
│       ├── yaml.js                   Lector de .yml → objeto JS
│       ├── writer.js                 Generador de archivos .js en assets/data/
│       ├── validator.js              Valida campos obligatorios
│       └── logger.js                 Mensajes de consola claros
│
├── plantillas/
│   ├── NOTICIA-plantilla.md
│   ├── RETO-detalle-plantilla.md
│   ├── SECTOR-contenido-plantilla.md
│   ├── RECURSO-plantilla.md
│   └── GOBERNANZA-doc-plantilla.md
│
├── docs/
│   ├── INICIO-RAPIDO.md              Primeros pasos para el editor
│   ├── NOTICIAS.md
│   ├── RETOS.md
│   ├── SOCIOS.md
│   ├── SECTORES.md
│   ├── FORMACION.md
│   ├── CONOCIMIENTO.md
│   ├── GOBERNANZA.md
│   ├── MEDIA.md
│   └── TEXTOS-UI.md
│
├── package.json
└── README.md
```

---

## 5. Diseño de contenidos por sección

### 5.1 Textos de interfaz (`content/_ui/`)

**Archivos:**
```
content/_ui/
├── es.yml
├── en.yml
└── va.yml
```

**Formato YAML** (legible, sin llaves ni comillas):

```yaml
# es.yml
header:
  title: Red AI-STEAM
  subtitle: Innovación educativa con IA
  language: Idioma

nav:
  inicio: Inicio
  red: La Red
  sectores: Sectores
  bancoRetos: Banco de Retos

home:
  heroTitle: Transformando la educación profesional con IA
  heroSubtitle: Una red de innovación educativa
  stats:
    partners: Socios
    challenges: Retos activos
```

**Ventaja frente a JSON:** Sin llaves `{}`, sin comillas `""`, sin comas `,`. Se lee como un documento normal.

---

### 5.2 Noticias (`content/noticias/`)

```
content/noticias/
├── _PLANTILLA/                  Copiar esta carpeta para crear una noticia nueva
│   ├── es.md
│   ├── en.md
│   └── va.md
├── 2026-001-energia-museos/
│   ├── es.md
│   ├── en.md
│   └── va.md
├── 2026-002-nuevo-socio/
│   └── ...
└── eventos.xlsx                 Todos los eventos en una sola hoja Excel
```

**Formato del artículo** (`es.md`):

```markdown
---
id: 2026-001
fecha: 2026-05-10
categoria: reto
sector: Energía y Medioambiente
socio: CEICE
destacado: si
oficial: no
visible: si
imagen: noticias/energia-museos.jpg
---

# IA para optimización energética en museos públicos

Breve descripción que aparece en la lista de noticias (primer párrafo).

El resto del texto es el artículo completo. Puede incluir **negrita**,
*cursiva*, [enlaces](https://...) y listas:

- Punto 1
- Punto 2
```

**Reglas:**
- La cabecera (`---`) es el "formulario" de la noticia.
- El texto tras la cabecera es el artículo completo.
- `visible: no` → no aparece en el sitio.
- El nombre de la carpeta es libre pero tiene que ser único.

**Formato del Excel de eventos** (`eventos.xlsx`):

| id | dia | mes_es | mes_en | mes_va | titulo_es | titulo_en | titulo_va | lugar | tipo | enlace | visible |
|----|-----|--------|--------|--------|-----------|-----------|-----------|-------|------|--------|---------|
| ev001 | 15 | Mayo | May | Maig | Webinar inaugural | Inaugural webinar | Webinar inaugural | Online | webinar | https://... | si |
| ev002 | 22 | Junio | June | Juny | Jornada FP | FP Day | Jornada FP | Valencia | presencial | | si |

---

### 5.3 Banco de retos (`content/retos/`)

```
content/retos/
├── _PLANTILLA/
│   ├── es.md
│   ├── en.md
│   └── va.md
├── retos.xlsx                   Datos de todos los retos (una fila por reto)
├── r01/
│   ├── es.md                    Descripción completa del reto en español
│   ├── en.md
│   └── va.md
├── r02/
│   └── ...
└── ...
```

**Excel `retos.xlsx`** (datos estructurados de todos los retos):

| id | entidad | tipo_entidad | nivel | estado | sector | fecha_pub | fecha_limite | equipos | pais | tipo_contribucion | ruta | madurez_evidencia | visible |
|----|---------|-------------|-------|--------|--------|-----------|--------------|---------|------|------------------|------|------------------|---------|
| r01 | CEICE | Administración | FP | Abierto | Energía | 2026-03-10 | 2026-06-30 | 0 | ES | Reto | FP/VET | validated | si |
| r02 | UVEG | Universidad | Máster | Resolución | Salud | 2026-02-01 | 2026-05-31 | 3 | ES | Caso | Master Bridge | inPilot | si |

Y columnas de texto por idioma (título, descripción corta, etiquetas, evidencia esperada):

| titulo_es | titulo_en | titulo_va | descripcion_es | descripcion_en | descripcion_va | etiquetas_es | etiquetas_en | etiquetas_va |
|-----------|-----------|-----------|----------------|----------------|----------------|--------------|--------------|--------------|
| Optimización energética... | Energy optimization... | Optimització energètica... | Desarrollo de un modelo... | Development of a model... | Desenvolupament... | HVAC;ML;IoT | HVAC;ML;IoT | HVAC;ML;IoT |

> Las etiquetas se separan con punto y coma `;` dentro de la celda.

**Markdown por reto** (`r01/es.md`) — todo el detalle editorial:

```markdown
---
id: r01
visible: si
---

## Descripción completa

Texto largo explicando el reto con todo el detalle necesario.

## Contexto

Por qué es importante este reto, qué problema resuelve...

## Objetivos

- Desarrollar un modelo predictivo de consumo HVAC
- Reducir el consumo energético en al menos un 15%
- Documentar el proceso de implementación

## Requisitos de participación

- Equipos de 2 a 5 estudiantes de FP
- Nivel: CFGS (ciclo formativo de grado superior)
- Conocimientos básicos de Python

## Datos disponibles

| Dataset | Formato | Tamaño |
|---------|---------|--------|
| Consumo energético histórico | CSV | 2,3 GB |
| Planos del edificio | PDF | 45 MB |

## Herramientas recomendadas

Python, TensorFlow, Grafana, InfluxDB

## Entregables

- Informe técnico (PDF, máx. 20 páginas)
- Código fuente documentado (repositorio Git)
- Presentación ejecutiva (10 min)

## Criterios de evaluación

| Criterio | Peso | Descripción |
|----------|------|-------------|
| Precisión del modelo | 40% | Error MAPE < 10% |
| Calidad del código | 25% | Documentación y tests |
| Impacto real | 35% | Reducción medible |

## Hitos del reto

- **2026-04-01** — Kick-off y presentación de equipos ✓
- **2026-05-01** — Entrega del prototipo inicial
- **2026-06-30** — Entrega final y presentaciones

## Mentores

- **Nombre Apellido** — Ingeniero Senior — CEICE
- **Otra Persona** — Investigadora IA — UVEG

## Reconocimientos

- Certificado de participación firmado por CEICE y UVEG
- Publicación del proyecto en la web AI-STEAM
- Posibilidad de implementación real en museos de la GVA

## Preguntas frecuentes

**¿Hay premio económico?**
No, el reconocimiento es académico y profesional.

**¿Puede participar un equipo de fuera de la Comunitat Valenciana?**
Sí, siempre que el centro esté adscrito al proyecto AI-STEAM.
```

---

### 5.4 Socios y stakeholders (`content/socios/`)

```
content/socios/
├── socios.xlsx
└── stakeholders.xlsx
```

**Socios** (`socios.xlsx`) — una fila por socio:

| id | nombre | acronimo | pais | ciudad | categoria | rol | sectores | visible |
|----|--------|----------|------|--------|-----------|-----|----------|---------|
| uveg | Universitat de València | UVEG | ES | Valencia | universidad | coordinador | Educación;Industria | si |
| ceice | Conselleria d'Educació | CEICE | ES | Valencia | administracion | coordinador | Educación | si |
| firm | Firma-Tech S.L. | FIRM | ES | Alicante | empresa | beneficiario | Industria;IA | si |

> `categoria` valores: `universidad`, `empresa`, `administracion`, `sociedad`  
> `rol` valores: `coordinador`, `beneficiario`, `certificacion`, `asociado`  
> `sectores` separados con `;`

**Stakeholders** (`stakeholders.xlsx`) — una fila por stakeholder:

| id | nombre | acronimo | pais | ciudad | categoria | sectores | descripcion_es | descripcion_en | descripcion_va | visible |
|----|--------|----------|------|--------|-----------|----------|----------------|----------------|----------------|---------|
| s001 | Cámara de Comercio | CAMARA | ES | Valencia | empresa | Industria;Comercio | Descripción en español | Description in English | Descripció en valencià | si |

---

### 5.5 Sectores (`content/sectores/`)

```
content/sectores/
├── sectores-config.xlsx         Configuración visual y estadísticas de los 7 sectores
├── 01-energia/
│   ├── es.md
│   ├── en.md
│   └── va.md
├── 02-salud/
│   └── ...
└── ...
```

**Excel `sectores-config.xlsx`** — una fila por sector:

| id | orden | emoji | nombre_es | nombre_en | nombre_va | color_desde | color_hasta | retos | socios | cursos | stakeholders | socios_destacados | visible |
|----|-------|-------|-----------|-----------|-----------|-------------|-------------|-------|--------|--------|--------------|------------------|---------|
| energia | 1 | ⚡ | Energía y Medioambiente | Energy and Environment | Energia i Medi Ambient | yellow-400 | orange-500 | 3 | 5 | 4 | 8 | CEICE;UVEG;VALGESTA | si |

**Markdown por sector** (`01-energia/es.md`):

```markdown
---
id: energia
visible: si
---

## Descripción

El sector energético valenciano concentra un creciente interés en la
aplicación de inteligencia artificial para la optimización de recursos...

## Palabras clave

IA predictiva, IoT industrial, Eficiencia energética, Gestión de redes, Energías renovables

## Tipos de stakeholders

Empresas energéticas, Administraciones locales, Centros de investigación

## Módulos FP relacionados

- Automatización industrial
- Sistemas de control y regulación
- Eficiencia energética en instalaciones

## Puentes al Máster

- Machine Learning aplicado a energía
- Sistemas IoT y sensorización industrial

## Cadena de transferencia

1. Identificación del reto energético con la empresa
2. Diseño de la solución IA en el aula FP
3. Implementación del prototipo en entorno real
4. Validación de resultados con el socio industrial
5. Transferencia y escalado al sector
```

---

### 5.6 Formación (`content/formacion/`)

```
content/formacion/
├── cursos-fp.xlsx
├── cursos-docente.xlsx
├── modulos-master.xlsx
└── credenciales.xlsx
```

**`cursos-fp.xlsx`** — una fila por curso:

| id | titulo_es | titulo_en | titulo_va | horas | inscritos | valoracion | modalidad | socios | sector | visible |
|----|-----------|-----------|-----------|-------|-----------|------------|-----------|--------|--------|---------|
| fp01 | IA aplicada a la industria | AI in industry | IA aplicada a la indústria | 40 | 120 | 4.8 | online | UVEG;CEICE | Industria | si |

---

### 5.7 Conocimiento (`content/conocimiento/`)

```
content/conocimiento/
├── _PLANTILLA/
│   ├── es.md
│   └── ...
├── recursos.xlsx                Metadatos de todos los recursos (guías, datasets, vídeos)
├── plantillas.xlsx              Metadatos de las plantillas descargables
├── casos.xlsx                   Metadatos de los casos de uso
└── contenido/
    ├── res-001-guia-ia-fps/
    │   ├── es.md
    │   ├── en.md
    │   └── va.md
    └── ...
```

**`recursos.xlsx`** — una fila por recurso:

| id | tipo | sector | formato | archivo_adjunto | fecha | etiquetas | visible |
|----|------|--------|---------|-----------------|-------|-----------|---------|
| res001 | guia | Educación | pdf | documentos/guia-ia-fps.pdf | 2026-03-15 | IA;FP;Docentes | si |
| res002 | video | Industria | video | https://youtube.com/... | 2026-04-01 | IoT;Manufactura | si |

**Markdown del recurso** (`res-001-guia-ia-fps/es.md`):

```markdown
---
id: res001
visible: si
---

# Guía de IA para centros FP

## Resumen

Esta guía proporciona a los docentes de FP un marco práctico...

## Contenido

- Introducción a la IA aplicada a FP
- Casos de uso por sector
- Recursos y herramientas gratuitas
- Propuestas de proyectos para el aula
```

---

### 5.8 Gobernanza (`content/gobernanza/`)

```
content/gobernanza/
├── estructura.yml               Estructura de nodos y roles (formato YAML)
├── cuerpos.xlsx                 Cuerpos de gobernanza (tabla)
├── participacion.yml            Texto de cómo participar (YAML con texto)
├── documentos.xlsx              Lista de documentos publicables
└── adjuntos/                    Los documentos reales (PDF, Word, etc.)
    ├── reglamento-v1.pdf
    ├── acta-fundacional.docx
    └── ...
```

**`documentos.xlsx`** — una fila por documento:

| id | titulo_es | titulo_en | titulo_va | tipo | fecha | archivo | visible |
|----|-----------|-----------|-----------|------|-------|---------|---------|
| doc001 | Reglamento de gobernanza | Governance regulation | Reglament de governança | pdf | 2026-01-15 | adjuntos/reglamento-v1.pdf | si |

**`estructura.yml`** — legible sin herramientas especiales:

```yaml
coordinadores:
  - nombre: Nombre Coordinador
    rol: Coordinador General
    org: CEICE

grupos:
  - nombre: Comité de Innovación
    responsable: UVEG
    miembros:
      - CEICE
      - FIRM
      - UVEG
```

---

### 5.9 Media (`content/media/`)

```
content/media/
├── imagenes/
│   ├── noticias/
│   ├── socios/        (logos)
│   ├── sectores/
│   └── general/
└── documentos/
    ├── gobernanza/
    ├── plantillas/
    └── recursos/
```

Los archivos de imagen y documentos se copian tal cual a `AI-STEAM-VANILLA/assets/media/`.  
No hace falta ningún metadato: el nombre del archivo es su identificador.

**Formatos soportados:**
- Imágenes: `.jpg`, `.jpeg`, `.png`, `.webp`, `.svg`, `.gif`
- Documentos: `.pdf`, `.docx`, `.xlsx`, `.pptx`, `.odt`, `.ods`

---

## 6. Sistema de visibilidad

### Cómo funciona

Cada ítem de contenido tiene un campo `visible` que controla si aparece en el sitio.

| Formato | Campo | Valores |
|---------|-------|---------|
| Excel | Columna `visible` | `si` / `no` |
| Markdown (cabecera) | `visible:` | `si` / `no` |
| YAML | `visible:` | `si` / `no` |

> Se usa `si`/`no` (no `true`/`false`) para máxima legibilidad humana. Los scripts lo convierten internamente.

### Casos de uso comunes

**Ocultar un reto temporalmente:**
1. Abrir `content/retos/retos.xlsx`
2. Cambiar `si` → `no` en la columna `visible` de la fila del reto
3. `node scripts/cms.js retos`
4. Commit + push

**Preparar una noticia sin publicar:**
1. Crear la carpeta con los `.md`
2. Poner `visible: no` en la cabecera
3. Cargar cuando se desee publicar cambiando a `si`

**Ocultar un socio:**
1. Abrir `content/socios/socios.xlsx`
2. Cambiar `visible` a `no`
3. `node scripts/cms.js socios`

---

## 7. Arquitectura de scripts

### Tecnología

- **Runtime:** Node.js ≥ 18
- **Dependencias mínimas:**
  - `xlsx` — leer archivos Excel (sin necesidad de Office instalado)
  - `marked` — convertir Markdown a HTML
  - `js-yaml` — leer archivos YAML
  - `gray-matter` — leer frontmatter de los Markdown
- **Sin framework** — scripts puros en Node.js, fáciles de mantener

```json
// package.json en AI-STEAM-CONTENT
{
  "name": "ai-steam-content",
  "type": "module",
  "scripts": {
    "cms": "node scripts/cms.js",
    "ui":          "node scripts/cms.js ui",
    "noticias":    "node scripts/cms.js noticias",
    "retos":       "node scripts/cms.js retos",
    "socios":      "node scripts/cms.js socios",
    "sectores":    "node scripts/cms.js sectores",
    "formacion":   "node scripts/cms.js formacion",
    "conocimiento":"node scripts/cms.js conocimiento",
    "gobernanza":  "node scripts/cms.js gobernanza",
    "media":       "node scripts/cms.js media",
    "todo":        "node scripts/cms.js todo"
  },
  "dependencies": {
    "xlsx": "^0.18.5",
    "marked": "^12.0.0",
    "js-yaml": "^4.1.0",
    "gray-matter": "^4.0.3"
  }
}
```

### Utilidades compartidas (`scripts/utils/`)

| Utilidad | Qué hace |
|----------|---------|
| `excel.js` | Lee `.xlsx`, devuelve array de objetos con las cabeceras como claves |
| `markdown.js` | Lee `.md`, extrae frontmatter y convierte cuerpo a HTML |
| `yaml.js` | Lee `.yml`, devuelve objeto JavaScript |
| `writer.js` | Escribe el archivo `.js` generado en `assets/data/` |
| `validator.js` | Comprueba campos obligatorios, avisa pero no bloquea |
| `logger.js` | Mensajes de consola con colores y claridad |

**Ejemplo de salida del logger:**
```
[noticias] Leyendo artículos...
[noticias] ✓ 2026-001-energia-museos (es/en/va)
[noticias] ✓ 2026-002-nuevo-socio (es/en/va)
[noticias] ⚠ 2026-003-pendiente → visible: no, omitido
[noticias] ✓ eventos.xlsx → 4 eventos cargados
[noticias] → Escrito: AI-STEAM-VANILLA/assets/data/news.js
[noticias] Total: 2 artículos, 4 eventos publicados
```

### Convención de cada loader

```javascript
// scripts/loaders/noticias.js
import { readExcel } from '../utils/excel.js';
import { readMarkdown } from '../utils/markdown.js';
import { writeDataFile } from '../utils/writer.js';
import { log } from '../utils/logger.js';
import { CONFIG } from '../config.js';

export async function cargarNoticias() {
  // 1. Leer archivos desde content/noticias/
  // 2. Filtrar visible: no
  // 3. Validar campos obligatorios (avisar, no bloquear)
  // 4. Transformar al formato que espera la vista
  // 5. Escribir assets/data/news.js
}
```

---

## 8. Orquestador CLI

**Un solo punto de entrada:** `node scripts/cms.js [sección]`

```bash
# Cargar una sección
node scripts/cms.js noticias
node scripts/cms.js retos
node scripts/cms.js socios

# Cargar varias
node scripts/cms.js noticias retos

# Cargar todo
node scripts/cms.js todo

# O con npm (atajos definidos en package.json)
npm run noticias
npm run retos
npm run todo
```

**Salida al ejecutar `npm run todo`:**
```
╔══════════════════════════════════════╗
║   AI-STEAM CMS — Carga completa      ║
╚══════════════════════════════════════╝

[ui]           ✓ Traducciones cargadas (3 idiomas)
[noticias]     ✓ 5 artículos, 4 eventos
[retos]        ✓ 11 retos visibles (2 ocultos)
[socios]       ✓ 23 socios, 14 stakeholders
[sectores]     ✓ 7 sectores
[formacion]    ✓ 12 cursos FP, 8 docente, 6 máster
[conocimiento] ✓ 18 recursos, 6 plantillas, 4 casos
[gobernanza]   ✓ 3 documentos publicados
[media]        ✓ 24 imágenes, 8 documentos copiados

══════════════════════════════════════
✓ Todo listo. Revisa el sitio en local:
  cd ../AI-STEAM-VANILLA && npx serve -l 3000
══════════════════════════════════════
```

---

## 9. Flujo de trabajo diario del editor

### Publicar una noticia nueva

```
1. Copiar carpeta:  content/noticias/_PLANTILLA → 2026-005-titulo-noticia/
2. Editar:          2026-005-titulo-noticia/es.md  (y en.md, va.md)
3. Añadir imagen:   content/media/imagenes/noticias/titulo.jpg  (opcional)
4. Ejecutar:        npm run noticias
5. Verificar:       http://localhost:3000  (con npx serve en AI-STEAM-VANILLA)
6. Publicar:
   → En AI-STEAM-CONTENT:
      git add content/noticias/ content/media/
      git commit -m "noticia: energía en museos"
      git push
   → En AI-STEAM-VANILLA:
      git add assets/data/news.js assets/media/
      git commit -m "cms: publicar noticia energía museos"
      git push
```

### Añadir un nuevo reto

```
1. Abrir:    content/retos/retos.xlsx
2. Añadir:   Nueva fila con todos los datos del reto
3. Copiar:   content/retos/_PLANTILLA → r14/
4. Editar:   r14/es.md, r14/en.md, r14/va.md
5. Ejecutar: npm run retos
6. Publicar: (igual que arriba, sección retos)
```

### Ocultar contenido

```
1. Excel:    Cambiar columna "visible" de "si" a "no"
   Markdown: Cambiar "visible: si" a "visible: no" en la cabecera
2. Ejecutar: npm run [sección]
3. Publicar
```

### Actualizar un texto de interfaz

```
1. Abrir:    content/_ui/es.yml  (y en.yml, va.yml)
2. Editar:   La línea correspondiente
3. Ejecutar: npm run ui
4. Publicar: assets/data/translations.js
```

### Actualización mensual completa

```
1. Hacer todos los cambios en content/
2. Ejecutar: npm run todo
3. Revisar el sitio localmente
4. Publicar ambos repos
```

---

## 10. Plantillas de contenido

Cada plantilla está en `plantillas/` con instrucciones dentro del propio archivo.

### `NOTICIA-plantilla.md`

```markdown
---
# INSTRUCCIONES: Rellena los campos entre comillas. 
# Para "si/no" escribe exactamente si o no.
# Borra estas líneas de instrucciones antes de guardar.

id: 2026-XXX                 # Número correlativo: 2026-001, 2026-002...
fecha: AAAA-MM-DD            # Formato: 2026-05-15
categoria: reto              # Opciones: reto, socio, evento, formacion, logro, general
sector: Energía              # Opcional. Sector al que pertenece la noticia
socio: CEICE                 # Opcional. Siglas del socio protagonista
destacado: no                # si = aparece en portada
oficial: no                  # si = comunicado oficial de la red
visible: si                  # no = borrador, no aparece en el sitio
imagen:                      # Ruta desde media/: noticias/nombre-imagen.jpg (opcional)
---

# Título de la noticia aquí

Primer párrafo: este es el resumen que aparece en la lista de noticias.
Sé conciso (2-3 frases).

El resto del documento es el artículo completo. Puedes usar:

**Texto en negrita** e *texto en cursiva*.

## Un subtítulo de sección

Listas de puntos:
- Punto 1
- Punto 2

[Un enlace](https://ejemplo.com)
```

### `RETO-detalle-plantilla.md`

```markdown
---
id: rXX                      # Debe coincidir con la columna id del Excel retos.xlsx
visible: si
---

## Descripción completa

[Escribe aquí una descripción detallada del reto, 3-5 párrafos]

## Contexto

[Por qué existe este reto, qué problema resuelve en el sector]

## Objetivos

- [Objetivo 1]
- [Objetivo 2]
- [Objetivo 3]

## Requisitos de participación

- [Perfil de los participantes]
- [Conocimientos mínimos]
- [Tamaño del equipo]

## Datos disponibles

| Dataset | Formato | Tamaño |
|---------|---------|--------|
| [Nombre del dataset] | CSV | [tamaño] |

## Herramientas recomendadas

[Lista separada por comas: Python, TensorFlow, ...]

## Entregables

- [Entregable 1 con formato]
- [Entregable 2 con formato]

## Criterios de evaluación

| Criterio | Peso | Descripción breve |
|----------|------|-------------------|
| [Criterio 1] | XX% | [Descripción] |

## Hitos del reto

- **AAAA-MM-DD** — [Descripción del hito]
- **AAAA-MM-DD** — [Siguiente hito]

## Mentores

- **Nombre Apellido** — Rol — Organización

## Reconocimientos

- [Reconocimiento 1]
- [Reconocimiento 2]

## Preguntas frecuentes

**[Pregunta 1]**
[Respuesta 1]

**[Pregunta 2]**
[Respuesta 2]
```

---

## 11. Cambios necesarios en AI-STEAM-VANILLA

### Qué cambia en las vistas

Las vistas JS actualmente tienen los datos **hardcodeados**. Pasarán a **importarlos** desde `assets/data/`:

| Vista | Array/objeto actual | Nuevo import |
|-------|-------------------|--------------|
| `marketplace.js` | `const CHALLENGES = [...]` inline | `import { CHALLENGES } from '../../data/challenges.js'` |
| `network.js` | `const PARTNERS = [...]` inline | `import { PARTNERS, STAKEHOLDERS } from '../../data/partners.js'` |
| `sectors.js` | `const SECTORS_META = [...]` inline | `import { SECTORS_META } from '../../data/sectors.js'` |
| `training.js` | Arrays de cursos inline | `import { FP_COURSES, ... } from '../../data/training.js'` |
| `news.js` | Arrays de noticias inline | `import { NEWS_ARTICLES, NEWS_EVENTS } from '../../data/news.js'` |
| `knowledge.js` | Recursos inline | `import { RESOURCES, ... } from '../../data/knowledge.js'` |
| `governance.js` | Documentos inline | `import { DOCS, ... } from '../../data/governance.js'` |

### Lo que NO cambia

- `router.js` — sin cambios
- `state.js` — sin cambios
- `i18n.js` — sin cambios (sigue leyendo `translations.js`)
- `main.js` — sin cambios
- `header.js`, `footer.js`, `cookie-banner.js` — sin cambios
- CSS — sin cambios

### Nuevos archivos en `assets/data/`

Todos generados automáticamente por los scripts. El equipo web no los edita a mano:

```
assets/data/
├── translations.js       ← Generado desde content/_ui/*.yml
├── challenges.js         ← NUEVO: datos básicos de retos
├── challenge-extras.js   ← Generado desde content/retos/r*/
├── partners.js           ← NUEVO: socios y stakeholders
├── sectors.js            ← NUEVO: metadata de sectores
├── news.js               ← NUEVO: artículos y eventos
├── training.js           ← NUEVO: cursos
├── knowledge.js          ← NUEVO: recursos de conocimiento
└── governance.js         ← NUEVO: documentos y estructura
```

### `.gitignore` en AI-STEAM-VANILLA

Nada que añadir. Los archivos generados **sí se commitean** en el repo público (son el producto final del CMS). El repo privado no está en AI-STEAM-VANILLA.

---

## 12. Fases de implementación

Las fases A, B, C son trabajo técnico (desarrollador).  
Las fases D, E son trabajo editorial (operador de contenidos).

### Fase A — Infraestructura (desarrollador, ~2-3 días)

| # | Tarea | Entregable |
|---|-------|-----------|
| A.1 | Crear estructura de carpetas en AI-STEAM-CONTENT | Directorios `content/`, `scripts/`, `plantillas/`, `docs/` |
| A.2 | Configurar `package.json` con dependencias | `xlsx`, `marked`, `js-yaml`, `gray-matter` instalados |
| A.3 | Implementar `scripts/utils/` (excel, markdown, yaml, writer, validator, logger) | Utilidades probadas |
| A.4 | Implementar `scripts/cms.js` (orquestador) | CLI funcional aunque los loaders estén vacíos |
| A.5 | Crear plantillas en `plantillas/` | 5 archivos `.md` de plantilla listos |

### Fase B — Migración de datos existentes (desarrollador, ~3-5 días)

Convertir datos hardcodeados actuales a los nuevos archivos de contenido:

| # | Origen | Destino | Herramienta |
|---|--------|---------|-------------|
| B.1 | `translations.js` (3 idiomas) | `content/_ui/es.yml`, `en.yml`, `va.yml` | Script de migración one-shot |
| B.2 | `CHALLENGES` array en `marketplace.js` | `content/retos/retos.xlsx` | Manual + script |
| B.3 | `challengeExtras` en `challenge-extras.js` | `content/retos/r*/es.md`... | Manual |
| B.4 | `PARTNERS` en `network.js` | `content/socios/socios.xlsx` | Manual |
| B.5 | `STAKEHOLDERS` en `network.js` | `content/socios/stakeholders.xlsx` | Manual |
| B.6 | `SECTORS_META` en `sectors.js` | `content/sectores/sectores-config.xlsx` + `*/es.md` | Manual |
| B.7 | Datos cursos en `training.js` | `content/formacion/*.xlsx` | Manual |
| B.8 | Noticias en `news.js` | `content/noticias/` | Manual |

> La migración manual consiste en copiar datos de los arrays JS actuales y pegarlos en el Excel o Markdown correspondiente. Se hace una sola vez.

### Fase C — Scripts de carga (desarrollador, ~3-4 días)

| # | Script | Lee | Escribe |
|---|--------|-----|---------|
| C.1 | `loaders/ui.js` | `content/_ui/*.yml` | `assets/data/translations.js` |
| C.2 | `loaders/retos.js` | `content/retos/retos.xlsx` + `r*/es.md`... | `assets/data/challenges.js` + `challenge-extras.js` |
| C.3 | `loaders/socios.js` | `content/socios/*.xlsx` | `assets/data/partners.js` |
| C.4 | `loaders/sectores.js` | `content/sectores/sectores-config.xlsx` + `*/es.md`... | `assets/data/sectors.js` |
| C.5 | `loaders/noticias.js` | `content/noticias/` + `eventos.xlsx` | `assets/data/news.js` |
| C.6 | `loaders/formacion.js` | `content/formacion/*.xlsx` | `assets/data/training.js` |
| C.7 | `loaders/conocimiento.js` | `content/conocimiento/` | `assets/data/knowledge.js` |
| C.8 | `loaders/gobernanza.js` | `content/gobernanza/` | `assets/data/governance.js` |
| C.9 | `loaders/media.js` | `content/media/` | `assets/media/` |

**Criterio de aceptación por script:** `npm run todo` produce archivos `.js` funcionalmente idénticos a los originales hardcodeados.

### Fase D — Refactorizar vistas (desarrollador, ~1-2 días)

Modificar los 7 archivos de vista para importar datos desde `assets/data/` en lugar de tenerlos hardcodeados. Las vistas siguen funcionando igual que antes.

**Criterio de aceptación:** El sitio web funciona exactamente igual que antes del CMS. Todas las vistas, filtros, traducciones y navegación operan sin cambios.

### Fase E — Documentación y formación del editor (desarrollador + editor, ~1 día)

| # | Tarea |
|---|-------|
| E.1 | Redactar `docs/INICIO-RAPIDO.md` (instalación de Node, clonar repos, primer uso) |
| E.2 | Redactar guías de uso para cada sección (9 documentos) |
| E.3 | Sesión de formación con el editor de contenidos |
| E.4 | Prueba de aceptación: el editor publica una noticia real de principio a fin |

---

## 13. Consideraciones técnicas

### Rutas relativas entre repos

Los scripts asumen que `AI-STEAM-CONTENT` y `AI-STEAM-VANILLA` están en la misma carpeta padre (`D:\CEICE\`). Si la estructura cambia, solo hay que actualizar `scripts/config.js`.

### Sin instalación en producción

Las dependencias npm (`xlsx`, `marked`, etc.) solo se usan en local para ejecutar los scripts. El sitio publicado (`AI-STEAM-VANILLA`) no necesita Node.js ni ninguna dependencia en producción.

### Orden de ejecución de scripts

No hay dependencias entre scripts. Se pueden ejecutar en cualquier orden. La excepción es `media`, que debe ejecutarse antes de cargar secciones que referencian imágenes, para que los archivos existan.

### Gestión de errores

Los scripts **no bloquean** si falta un archivo de idioma opcional. Emiten un `WARNING` y usan el español como fallback. Solo bloquean (`ERROR`) si falta el archivo principal de datos (el Excel de la sección o el Markdown principal).

### Control de versiones

- `content/` → Todo se commitea (es la fuente de verdad)
- `scripts/` → Todo se commitea
- `assets/data/*.js` en AI-STEAM-VANILLA → Todo se commitea (son el resultado del CMS)
- `assets/media/` en AI-STEAM-VANILLA → Se commitea (archivos binarios)

> Si los archivos de media son muy grandes, considerar `.gitattributes` con Git LFS.

---

**Fin del plan.**  
**Última actualización:** 2026-05-08 (versión 2.0 — repositorios separados + formatos humanos)
