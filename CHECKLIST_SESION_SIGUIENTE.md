# Checklist para la Próxima Sesión

**Objetivo:** Preparar el entorno y completar Fase 1 (Infraestructura Base)

---

## ✅ ANTES de empezar (validación inicial)

- [ ] Cambiar contexto VSCode a `D:\CEICE` (no `D:\CEICE\AI-STEAM-MOCKUP`)
- [ ] Verificar que se ven ambas carpetas:
  ```powershell
  ls AI-STEAM-MOCKUP/src/  # Debe funcionar
  ls AI-STEAM-VANILLA/     # Debe existir
  ```
- [ ] Leer `AI-STEAM-VANILLA/README.md` (guía rápida, ~2 min)
- [ ] Leer `AI-STEAM-VANILLA/PLAN_CONVERSION_VANILLA.md` (plan detallado, ~10 min)
- [ ] Leer `AI-STEAM-VANILLA/CLAUDE.md` sección "Patrones Clave" (~5 min)

---

## 🚀 SETUP INICIAL (ejecución única)

### Paso 1: Crear estructura de directorios
```powershell
cd D:\CEICE\AI-STEAM-VANILLA
.\init-fase1.ps1
```

**Verifica:**
- [ ] Se crearon directorios: `assets/css`, `assets/js/components`, `assets/js/views`, `assets/data`, `fonts`
- [ ] Se crearon placeholders: `index.html`, `main.css`, `main.js`, `router.js`, `i18n.js`, `state.js`
- [ ] Se copiaron: `assets/data/translations.ts`, `assets/data/challenge-extras.ts`
- [ ] Se creó `.gitignore`

### Paso 2: Convertir archivos de datos TS → JS
```powershell
# Editar manualmente o vía script:
# 1. assets/data/translations.ts → assets/data/translations.js
#    - Eliminar: export const translations: TranslationStructure = 
#    - Cambiar a: export const translations = 
# 2. assets/data/challenge-extras.ts → challenge-extras.js
#    - Eliminar tipos TypeScript
#    - Mantener estructura de datos igual
```

**Verifica:**
- [ ] `assets/data/translations.js` existe y exporta `{ es: {...}, en: {...}, va: {...} }`
- [ ] `assets/data/challenge-extras.js` existe y exporta datos

### Paso 3: Compilar CSS con Tailwind CLI
```powershell
npx tailwindcss -i ..\AI-STEAM-MOCKUP\src\index.css \
  -o .\assets\css\tailwind-output.css --minify
```

**Verifica:**
- [ ] Se creó `assets/css/tailwind-output.css` (~80-120 KB)
- [ ] No hay errores en la compilación

---

## 🔧 FASE 1: INFRAESTRUCTURA BASE

### Step 1: Completar `index.html` shell

**Ubicación:** `index.html` (ya existe como placeholder, completar)

**Contenido esperado:**
```html
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
```

**Verifica:**
- [ ] 3 mount points: `#header-root`, `#main-root`, `#footer-root`
- [ ] CSS cargado: `main.css` (variables) + `tailwind-output.css` (utilities)
- [ ] Lucide JS cargado
- [ ] Script principal: `main.js` como módulo ES

---

### Step 2: Implementar `assets/js/i18n.js`

**Patrón de código:**
```js
import { translations } from './data/translations.js';

let currentLang = localStorage.getItem('language') || 'es';

export function getLanguage() { return currentLang; }

export function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('language', lang);
  renderApp(); // exportado desde main.js
}

export function t(key) {
  const keys = key.split('.');
  let val = translations[currentLang];
  for (const k of keys) {
    val = val?.[k];
    if (val === undefined) return key;
  }
  return val;
}

export function getLangData() {
  return translations[currentLang];
}
```

**Verifica:**
- [ ] `t('home.title')` devuelve string
- [ ] `t('home')` devuelve objeto con propiedades
- [ ] `setLanguage('en')` cambia `currentLang` y persiste en localStorage
- [ ] `getLanguage()` devuelve idioma actual

---

### Step 3: Implementar `assets/js/router.js`

**Patrón de código:**
```js
export const VIEWS = ['inicio', 'red', 'sectores', 'banco-retos', 'formacion', 'conocimiento', 'gobernanza', 'actualidad'];

let activeView = 'inicio';
let viewParams = {};

export function getActiveView() { return activeView; }
export function getViewParams() { return viewParams; }

export function navigateTo(view, params = {}) {
  if (!VIEWS.includes(view)) {
    console.warn(`View ${view} no existe`);
    return;
  }
  activeView = view;
  viewParams = params;
  renderApp(); // importado desde main.js
  window.scrollTo(0, 0);
}
```

**Verifica:**
- [ ] `getActiveView()` devuelve pestaña actual
- [ ] `navigateTo('sectores')` cambia la pestaña activa
- [ ] `navigateTo()` con params guarda viewParams

---

### Step 4: Implementar `assets/js/state.js`

**Patrón de código:**
```js
const appState = {
  cookiesAccepted: localStorage.getItem('cookies-accepted') === 'true',
  mobileMenuOpen: false,
  marketplaceFilters: { type: 'all', route: 'all', status: 'all', sector: 'all', search: '' },
  networkTab: 'consorcio',
  networkCountry: 'all',
  knowledgeTab: 'flow',
  knowledgeSearch: '',
  governanceTab: 'estructura',
  trainingTab: 'fp',
  expandedSector: null,
  newsCategoryFilter: 'all',
};

export function getState(key) { return appState[key]; }
export function setState(key, value) { appState[key] = value; }
```

**Verifica:**
- [ ] `getState('cookiesAccepted')` devuelve booleano
- [ ] `setState('mobileMenuOpen', true)` cambia estado
- [ ] Estado persiste en memoria durante sesión

---

### Step 5: Implementar `assets/js/components/header.js`

**Patrón esperado:**
```js
import { t, getLanguage, setLanguage } from '../i18n.js';
import { getActiveView, navigateTo } from '../router.js';
import { getState, setState } from '../state.js';

export function renderHeader() {
  const lang = getLanguage();
  const active = getActiveView();
  const mobileOpen = getState('mobileMenuOpen');
  
  return `
    <header class="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
      <!-- Desktop nav -->
      <nav class="hidden md:flex ...">
        <button data-view="inicio" class="${active === 'inicio' ? 'active' : ''}">
          ${t('nav.home')}
        </button>
        <!-- Más botones... -->
      </nav>
      
      <!-- Language selector -->
      <select id="lang-selector" class="...">
        <option value="es" ${lang === 'es' ? 'selected' : ''}>ES</option>
        <option value="en" ${lang === 'en' ? 'selected' : ''}>EN</option>
        <option value="va" ${lang === 'va' ? 'selected' : ''}>VA</option>
      </select>
      
      <!-- Mobile hamburger -->
      <button id="mobile-menu-toggle" class="...">☰</button>
    </header>
  `;
}

export function mountHeader() {
  // Tabs navigation
  document.querySelectorAll('[data-view]').forEach(btn => {
    btn.addEventListener('click', () => navigateTo(btn.dataset.view));
  });
  
  // Language selector
  document.getElementById('lang-selector')?.addEventListener('change', (e) => {
    setLanguage(e.target.value);
  });
  
  // Mobile menu toggle
  document.getElementById('mobile-menu-toggle')?.addEventListener('click', () => {
    const isOpen = getState('mobileMenuOpen');
    setState('mobileMenuOpen', !isOpen);
    // Re-render header
    document.getElementById('header-root').innerHTML = renderHeader();
    mountHeader();
  });
}
```

**Verifica:**
- [ ] Header renderiza con tabs de navegación
- [ ] El tab activo tiene clase `active` (resaltado)
- [ ] Language selector tiene 3 opciones (ES, EN, VA)
- [ ] Cambiar idioma ejecuta `setLanguage()`
- [ ] Hamburger menu toggle funciona
- [ ] Los tabs navegan a sus vistas correspondientes

---

### Step 6: Implementar `assets/js/components/footer.js`

**Patrón esperado:**
```js
import { t } from '../i18n.js';

export function renderFooter() {
  return `
    <footer class="bg-eu-footer text-white py-12">
      <div class="max-w-6xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 class="font-bold">${t('footer.company')}</h3>
            <p>${t('footer.description')}</p>
          </div>
          <div>
            <h3 class="font-bold">${t('footer.links')}</h3>
            <ul>
              <li><a href="#">${t('footer.privacy')}</a></li>
              <li><a href="#">${t('footer.accessibility')}</a></li>
            </ul>
          </div>
          <div>
            <h3 class="font-bold">${t('footer.about')}</h3>
            <p>${t('footer.eu')}</p>
          </div>
        </div>
      </div>
    </footer>
  `;
}

export function mountFooter() {
  // Footer no requiere event listeners (es estático)
}
```

**Verifica:**
- [ ] Footer renderiza en los 3 idiomas (ES, EN, VA)
- [ ] Footer tiene links y texto
- [ ] Fondo es color `eu-footer` (gris oscuro)

---

### Step 7: Implementar `assets/js/components/cookie-banner.js`

**Patrón esperado:**
```js
import { t } from '../i18n.js';
import { getState, setState } from '../state.js';

export function renderCookieBanner() {
  const accepted = getState('cookiesAccepted');
  if (accepted) return ''; // No mostrar si ya aceptó
  
  return `
    <div id="cookie-banner" class="fixed bottom-0 left-0 right-0 bg-yellow-100 border-t border-gray-300 p-4 z-40">
      <div class="max-w-6xl mx-auto flex items-center justify-between gap-4">
        <p class="flex-1">${t('cookieBanner.message')}</p>
        <button id="cookie-accept" class="bg-eu-blue text-white px-4 py-2 rounded">
          ${t('cookieBanner.accept')}
        </button>
      </div>
    </div>
  `;
}

export function mountCookieBanner() {
  document.getElementById('cookie-accept')?.addEventListener('click', () => {
    setState('cookiesAccepted', true);
    localStorage.setItem('cookies-accepted', 'true');
    document.getElementById('cookie-banner').remove();
  });
}
```

**Verifica:**
- [ ] Banner aparece en la primera carga
- [ ] Botón "Aceptar" guarda en localStorage y oculta banner
- [ ] En recargas siguientes, banner no aparece
- [ ] Mensaje aparece en ES/EN/VA

---

### Step 8: Implementar `assets/js/main.js` (orquestación)

**Patrón esperado:**
```js
import { renderApp } from './main.js'; // Export de esta función
import { renderHeader, mountHeader } from './components/header.js';
import { renderFooter, mountFooter } from './components/footer.js';
import { renderCookieBanner, mountCookieBanner } from './components/cookie-banner.js';
import { getActiveView } from './router.js';
import * as views from './views/index.js'; // TODO: crear este archivo en Fase 2

export function renderApp() {
  const activeView = getActiveView();
  
  // Render componentes
  document.getElementById('header-root').innerHTML = renderHeader();
  document.getElementById('main-root').innerHTML = views[activeView]?.render?.() || '<p>Cargando...</p>';
  document.getElementById('footer-root').innerHTML = renderFooter();
  
  // Append cookie banner si es necesario
  const bannerHtml = renderCookieBanner();
  if (bannerHtml && !document.getElementById('cookie-banner')) {
    document.body.insertAdjacentHTML('beforeend', bannerHtml);
    mountCookieBanner();
  }
  
  // Mount event listeners
  mountHeader();
  mountFooter();
  views[activeView]?.mount?.();
  
  // Inicializar iconos Lucide
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

// Inicialización en carga de página
document.addEventListener('DOMContentLoaded', () => {
  renderApp();
});
```

**Verifica:**
- [ ] Página carga sin errores en consola
- [ ] 3 mount points se rellenan con contenido
- [ ] Header navega (aunque views aún están vacías)
- [ ] Language selector cambia idioma
- [ ] Cookie banner aparece/desaparece correctamente

---

### Step 9: Crear placeholder `assets/js/views/index.js`

**Contenido temporal para Fase 1:**
```js
// Será poblado en Fase 2 con todas las views
export const views = {};
```

O más sencillo, exportar objetos vacíos:
```js
export const inicio = { render: () => '<p>Home - Fase 2</p>', mount: () => {} };
export const red = { render: () => '<p>Network - Fase 2</p>', mount: () => {} };
export const sectores = { render: () => '<p>Sectors - Fase 2</p>', mount: () => {} };
export const 'banco-retos' = { render: () => '<p>Marketplace - Fase 4</p>', mount: () => {} };
export const formacion = { render: () => '<p>Training - Fase 2</p>', mount: () => {} };
export const conocimiento = { render: () => '<p>Knowledge - Fase 3</p>', mount: () => {} };
export const gobernanza = { render: () => '<p>Governance - Fase 3</p>', mount: () => {} };
export const actualidad = { render: () => '<p>News - Fase 2</p>', mount: () => {} };
```

**Verifica:**
- [ ] Módulo importa sin errores
- [ ] Se puede navegar entre todos los tabs (aunque solo muestren placeholder)

---

## ✅ FASE 1: CRITERIOS DE ÉXITO

Cuando hayas completado los pasos anteriores, valida:

- [ ] `python -m http.server 8000` corre sin errores
- [ ] Abrir `http://localhost:8000` en navegador
- [ ] La página carga (logo, header, footer visibles)
- [ ] **Header:** 8 botones de tab visible (en desktop)
- [ ] **Tab navigation:** Clickear en diferentes tabs cambia el contenido
- [ ] **Tab active:** El tab clickeado se resalta con clase `active`
- [ ] **Language selector:** Dropdown con ES/EN/VA
- [ ] **Cambio de idioma:** Seleccionar EN/VA actualiza texto (header, footer, nav)
- [ ] **Persistencia idioma:** Recargar página (`F5`) mantiene idioma seleccionado
- [ ] **Mobile:** Reducir ventana a 320px, hamburger menu visible
- [ ] **Hamburger:** Click en ☰ abre/cierra menú móvil
- [ ] **Cookie banner:** Aparece en primera carga
- [ ] **Cookie accept:** Clickear "Aceptar" oculta banner y persiste en localStorage
- [ ] **Recarga:** Recargar página no muestra banner nuevamente
- [ ] **Console limpia:** F12 → Console sin errores (solo warnings de Vite si aplica)
- [ ] **ES modules:** DevTools → Network muestra módulos `.js` siendo cargados correctamente

---

## 📋 POST-FASE 1: Preparación para Fase 2

Una vez Fase 1 completada:

- [ ] Actualizar `CLAUDE.md`: marcar Fase 1 como ✅
- [ ] Actualizar `MEMORIA_DESARROLLO.md` con notas de lo completado
- [ ] Crear git commit: "feat(fase1): Infraestructura base, header, footer, routing, i18n"
- [ ] Leer `PLAN_CONVERSION_VANILLA.md` sección "Fase 2"
- [ ] Preparar archivos para Fase 2: `views/home.js`, `views/training.js`, etc.

---

## 🔗 Referencias Rápidas

| Recurso | Ubicación |
|---------|-----------|
| Plan completo | `PLAN_CONVERSION_VANILLA.md` |
| Instrucciones proyecto | `CLAUDE.md` |
| Memoria contexto | `MEMORIA_DESARROLLO.md` |
| Guía rápida | `README.md` |
| Script setup | `init-fase1.ps1` |
| Este checklist | `CHECKLIST_SESION_SIGUIENTE.md` |

---

## 🎯 Estimado de Tiempo (Fase 1)

| Tarea | Duración |
|---|---|
| Setup + compilar CSS | 30 min |
| i18n.js | 30 min |
| router.js | 20 min |
| state.js | 15 min |
| header.js | 45 min |
| footer.js | 20 min |
| cookie-banner.js | 25 min |
| main.js + views/index.js | 30 min |
| Testing + debugging | 45 min |
| **Total** | **~3 horas** |

---

**Estado:** ✅ Artefactos preparados, checklist listo  
**Próxima sesión:** Ejecutar estos pasos cuando se cambie contexto a `D:\CEICE`
