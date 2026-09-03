# AI-STEAM Network Vanilla

Versión HTML/CSS/JS puro del mockup de AI-STEAM Network (conversión desde React/Vite).

## 🚀 Inicio Rápido (Próxima Sesión)

### 1. Cambiar contexto de trabajo
```powershell
# En VSCode: abre la carpeta D:\CEICE (padre, no la subcarpeta)
# Esto te da acceso a:
#   - ./AI-STEAM-MOCKUP/ (original React)
#   - ./AI-STEAM-VANILLA/ (este directorio, destino)
```

### 2. Ejecutar inicialización
```powershell
cd D:\CEICE\AI-STEAM-VANILLA
.\init-fase1.ps1
```

### 3. Compilar CSS
```powershell
npx tailwindcss -i ..\AI-STEAM-MOCKUP\src\index.css -o .\assets\css\tailwind-output.css --minify
```

### 4. Arrancar servidor local
```powershell
python -m http.server 8000
# Abrir en navegador: http://localhost:8000
```

---

## 📖 Documentación

| Archivo | Propósito |
|---------|-----------|
| **AGENTS.md** | Puntero al repositorio privado, donde vive toda la documentación |
| **init-fase1.ps1** | Script que prepara estructura base (directorios, placeholders) |
| **README.md** | Este archivo, guía rápida |

---

## 🏗️ Estructura Resultado Final

```
D:\CEICE\AI-STEAM-VANILLA/
├── index.html
├── assets/
│   ├── css/
│   │   ├── main.css (variables tema)
│   │   └── tailwind-output.css (compilado estático)
│   ├── js/
│   │   ├── main.js
│   │   ├── router.js
│   │   ├── i18n.js
│   │   ├── state.js
│   │   ├── components/
│   │   │   ├── header.js
│   │   │   ├── footer.js
│   │   │   └── cookie-banner.js
│   │   └── views/
│   │       ├── home.js
│   │       ├── marketplace.js
│   │       ├── ... (8 views total)
│   └── data/
│       ├── translations.js (3 idiomas)
│       └── challenge-extras.js
└── fonts/
    └── InstrumentSans-*.woff2
```

---

## 🎯 Fases de Desarrollo

### Fase 1: Infraestructura
✅ Artefactos preparados  
⏳ **Esperando:** Implementación (header, router, i18n, state)

### Fase 2: Views Simples
⏳ Home, Training, Sectors, News

### Fase 3: Views Complejas
⏳ Governance, Knowledge, Network

### Fase 4: Marketplace + ChallengeDetail
⏳ Los dos componentes más complejos

### Fase 5: QA + Optimización
⏳ Tests responsive, localStorage, minificación

---

## 💡 Lo que Hace Especial este Proyecto

- **Cero dependencias en producción:** Solo HTML, CSS, JS estático
- **Vanilla JavaScript puro:** Sin frameworks, sin build tools
- **Multilingüe:** ES, EN, VA (sistema i18n completamente funcional)
- **Routing sin URLs:** Basado en tabs en memoria (como el original React)
- **Diseño idéntico:** Tailwind compilado, variables CSS custom, look/feel exacto
- **Datos estáticos:** Traducción de 2.692 líneas de TypeScript a JS puro

---

## 🔗 Referencia: Proyecto Original

Proyecto React/Vite original en `D:\CEICE\AI-STEAM-MOCKUP`:
- **src/translations.ts** — 2.692 líneas, 3 idiomas (copiar → translations.js)
- **src/challengeExtras.ts** — Datos de retos (copiar → challenge-extras.js)
- **src/components/views/*.tsx** — 10 componentes a convertir
- **src/context/LanguageContext.tsx** — Reemplazar con i18n.js

---

## ⚡ Comandos Rápidos

```powershell
# Setup (una sola vez)
.\init-fase1.ps1
npx tailwindcss -i ..\AI-STEAM-MOCKUP\src\index.css -o .\assets\css\tailwind-output.css --minify

# Desarrollo
python -m http.server 8000

# Producción (Fase 5)
npx esbuild ./assets/js/main.js --bundle --minify --outfile=./assets/js/main.min.js
```

---

## ⚠️ Importante

- **HTTP obligatorio:** No funciona con `file://`. Requiere servidor HTTP.
- **ES modules:** Usar `import/export` nativos, navegadores modernos lo soportan.
- **Lucide:** Llamar `lucide.createIcons()` tras cada render completo.
- **localStorage:** Persiste idioma y cookies entre sesiones.

---

## 📝 Próximos Pasos

1. **Próxima sesión:** Abre contexto en `D:\CEICE`
2. **Ejecuta:** `.\init-fase1.ps1`
3. **Lee:** `../AI-STEAM-CONTENT/AGENTS.md` y `../AI-STEAM-CONTENT/docs/agents/ESTADO.md`
4. **Consulta:** los planes y la memoria en `../AI-STEAM-CONTENT/docs/agents/vanilla/`
5. **Implementa:** Fase 1 según el plan

---

**Estado:** Artefactos preparados, esperando inicio de Fase 1  
**Fecha:** 2026-05-07  
**Estimado total:** 20-25 horas de trabajo (5 fases)
