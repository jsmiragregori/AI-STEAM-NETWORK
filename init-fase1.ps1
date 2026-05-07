# Script de Inicialización - Fase 1: Infraestructura Base
# Uso: .\init-fase1.ps1 (ejecutar desde D:\CEICE\AI-STEAM-VANILLA)
# Propósito: Crear estructura de directorios y copiar datos base

Write-Host "=== Inicialización Fase 1: Infraestructura Base ===" -ForegroundColor Cyan

$targetDir = Get-Location
$sourceDir = "..\AI-STEAM-MOCKUP"

# Verificar acceso a proyecto origen
if (-not (Test-Path $sourceDir)) {
  Write-Host "❌ ERROR: No se encuentra $sourceDir" -ForegroundColor Red
  Write-Host "   Asegúrate de ejecutar desde D:\CEICE\AI-STEAM-VANILLA" -ForegroundColor Yellow
  exit 1
}

Write-Host "✅ Proyecto origen encontrado: $sourceDir" -ForegroundColor Green

# 1. Crear estructura de directorios
Write-Host "`n[1/6] Creando estructura de directorios..." -ForegroundColor Yellow

$dirs = @(
  "assets/css",
  "assets/js/components",
  "assets/js/views",
  "assets/data",
  "fonts"
)

foreach ($dir in $dirs) {
  if (-not (Test-Path $dir)) {
    New-Item -ItemType Directory -Path $dir -Force | Out-Null
    Write-Host "  ✓ $dir" -ForegroundColor Green
  } else {
    Write-Host "  → $dir (ya existe)" -ForegroundColor Gray
  }
}

# 2. Copiar datos estáticos (translations.ts y challengeExtras.ts)
Write-Host "`n[2/6] Copiando datos estáticos..." -ForegroundColor Yellow

$sourceTrans = "$sourceDir\src\translations.ts"
$sourceChallenges = "$sourceDir\src\challengeExtras.ts"

if (Test-Path $sourceTrans) {
  Copy-Item $sourceTrans "assets/data/translations.ts" -Force
  Write-Host "  ✓ translations.ts copiado" -ForegroundColor Green
  Write-Host "  ⚠️  IMPORTANTE: Renombrar manualmente a translations.js y eliminar tipos TypeScript" -ForegroundColor Yellow
} else {
  Write-Host "  ❌ translations.ts no encontrado en $sourceTrans" -ForegroundColor Red
}

if (Test-Path $sourceChallenges) {
  Copy-Item $sourceChallenges "assets/data/challenge-extras.ts" -Force
  Write-Host "  ✓ challengeExtras.ts copiado" -ForegroundColor Green
  Write-Host "  ⚠️  IMPORTANTE: Renombrar manualmente a challenge-extras.js y eliminar tipos TypeScript" -ForegroundColor Yellow
} else {
  Write-Host "  ❌ challengeExtras.ts no encontrado en $sourceChallenges" -ForegroundColor Red
}

# 3. Copiar fuente Instrument Sans (si existe en proyecto origen)
Write-Host "`n[3/6] Buscando fuentes locales..." -ForegroundColor Yellow

$fontSource = "$sourceDir\public\fonts"
if (Test-Path $fontSource) {
  Copy-Item "$fontSource\*" "fonts\" -Force -Recurse
  Write-Host "  ✓ Fuentes copiadas desde $fontSource" -ForegroundColor Green
} else {
  Write-Host "  ℹ️  No se encontraron fuentes en $fontSource" -ForegroundColor Gray
  Write-Host "  → Descargar fuentes Instrument Sans de Google Fonts manualmente después" -ForegroundColor Gray
}

# 4. Crear archivo .gitignore
Write-Host "`n[4/6] Creando .gitignore..." -ForegroundColor Yellow

$gitignore = @"
# Node modules (si usas npm locally)
node_modules/
npm-debug.log*

# IDE
.vscode/
.idea/
*.swp
*.swo

# Sistema
.DS_Store
Thumbs.db

# Build artifacts (si usas build tools)
dist/
build/

# Logs
*.log
"@

$gitignore | Set-Content ".gitignore" -Encoding UTF8
Write-Host "  ✓ .gitignore creado" -ForegroundColor Green

# 5. Mostrar próximos pasos
Write-Host "`n[5/6] Próximos pasos manuales:" -ForegroundColor Yellow
Write-Host @"
  1. Renombrar manualmente:
     - assets/data/translations.ts → assets/data/translations.js
     - assets/data/challenge-extras.ts → assets/data/challenge-extras.js

  2. Eliminar tipos TypeScript de ambos archivos (ej: `: TranslationStructure`)

  3. Compilar CSS con Tailwind CLI:
     npx tailwindcss -i ..\AI-STEAM-MOCKUP\src\index.css -o .\assets\css\tailwind-output.css --minify

  4. Crear archivos base:
     - index.html (shell con mount points)
     - assets/css/main.css (variables CSS custom)
     - assets/js/main.js
     - assets/js/router.js
     - assets/js/i18n.js
     - assets/js/state.js
     - assets/js/components/header.js
     - assets/js/components/footer.js
     - assets/js/components/cookie-banner.js

  5. Descargar Lucide vanilla:
     npm install lucide (o copiar lucide.min.js manualmente)

"@ -ForegroundColor Cyan

# 6. Crear estructura de ficheros vacíos como placeholder
Write-Host "[6/6] Creando ficheros placeholder..." -ForegroundColor Yellow

$placeholders = @{
  "index.html" = @"
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI-STEAM Network</title>
  <link rel="stylesheet" href="./assets/css/main.css">
  <link rel="stylesheet" href="./assets/css/tailwind-output.css">
  <script src="./assets/js/lucide.min.js" defer></script>
</head>
<body>
  <div id="header-root"></div>
  <main id="main-root"></main>
  <div id="footer-root"></div>

  <script type="module" src="./assets/js/main.js"></script>
</body>
</html>
"@

  "assets/css/main.css" = @"
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

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: var(--font-sans), sans-serif;
  color: var(--color-eu-text);
  background-color: var(--color-eu-bg);
}

#main-root {
  min-height: calc(100vh - 200px);
  margin-top: 4rem;
}
"@

  "assets/js/main.js" = @"
// Punto de entrada principal
// TODO: Implementar en Fase 1

console.log('AI-STEAM Network Vanilla - Inicializado');
"@

  "assets/js/router.js" = @"
// Sistema de routing basado en tabs
// TODO: Implementar en Fase 1

export const VIEWS = ['inicio','red','sectores','banco-retos','formacion','conocimiento','gobernanza','actualidad'];
export let activeView = 'inicio';
export let viewParams = {};

export function navigateTo(view, params = {}) {
  activeView = view;
  viewParams = params;
  window.scrollTo(0, 0);
  // TODO: llamar a renderApp()
}
"@

  "assets/js/i18n.js" = @"
// Sistema de traducciones (i18n)
// TODO: Implementar en Fase 1

export let currentLang = localStorage.getItem('language') || 'es';

export function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('language', lang);
  // TODO: llamar a renderApp()
}

export function t(key) {
  // TODO: implementar acceso a translations[currentLang][key]
  return key;
}
"@

  "assets/js/state.js" = @"
// Estado global minimal
// TODO: Implementar en Fase 1

const appState = {
  cookiesAccepted: localStorage.getItem('cookies-accepted') === 'true',
  mobileMenuOpen: false,
  marketplaceFilters: { type: 'all', route: 'all', status: 'all', sector: 'all', search: '' },
};

export function getState(key) { return appState[key]; }
export function setState(key, value) { appState[key] = value; }
"@
}

foreach ($file in $placeholders.Keys) {
  if (-not (Test-Path $file)) {
    $placeholders[$file] | Set-Content $file -Encoding UTF8
    Write-Host "  ✓ $file creado" -ForegroundColor Green
  } else {
    Write-Host "  → $file (ya existe)" -ForegroundColor Gray
  }
}

Write-Host "`n✅ Fase 1 - Inicialización completada" -ForegroundColor Green
Write-Host "   Próximo paso: Implementar los módulos JS base según PLAN_CONVERSION_VANILLA.md" -ForegroundColor Cyan
