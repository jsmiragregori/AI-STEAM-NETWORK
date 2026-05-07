# AI-STEAM Network

A **headless CMS without a database** — a static, file-based content management system for the AI-STEAM international network platform.

## 🎯 Overview

**AI-STEAM Network** is a collaborative European platform connecting vocational training (FP) and university masters programs (Master) with real-world AI/STEAM challenges from industry, public sector, and education.

This repository contains the **production-ready web application** — a modern JAMstack architecture where:

- **Content is stored as files** (not a database): JavaScript modules, JSON data, translations
- **CEICE-operated processes** automatically update content files when new challenges, training modules, or network data arrive
- **Git is the deployment pipeline**: every commit to `main` triggers a controlled production deployment
- **The site is 100% static**: HTML, CSS, and JavaScript served by a simple HTTP server (no runtime dependencies)

## 🏗️ Architecture: CMS Without a Database

### How It Works

```
┌─────────────────────────────────────────────────────────────────┐
│ CEICE Data Sources (challenge submissions, training updates)    │
└────────────┬────────────────────────────────────────────────────┘
             │
             ▼ (automated processes run on CEICE servers)
┌─────────────────────────────────────────────────────────────────┐
│ Generate/Update Content Files                                   │
│  - assets/data/challenges.js (dynamically generated)            │
│  - assets/data/training.js                                      │
│  - assets/data/networks.js                                      │
│  - assets/js/translations.js (3 languages: ES, EN, VA)          │
└────────────┬────────────────────────────────────────────────────┘
             │
             ▼ (git commit & push)
┌─────────────────────────────────────────────────────────────────┐
│ GitHub Repository (this repo)                                   │
│  - Main branch = source of truth                                │
│  - Every commit triggers webhook → deployment                   │
└────────────┬────────────────────────────────────────────────────┘
             │
             ▼ (webhook notification)
┌─────────────────────────────────────────────────────────────────┐
│ Production Server                                               │
│  - Pull latest commit                                           │
│  - Serve static files over HTTP                                 │
│  - Cache headers optimized for long-lived content               │
└─────────────────────────────────────────────────────────────────┘
```

### Key Benefits

- **No runtime database:** Faster, more secure, easier to scale
- **Version control:** All content changes tracked in Git
- **Atomic deployments:** Either a commit is deployed completely or not at all
- **Rollback-friendly:** Revert any change instantly via Git
- **No downtime:** Static files can be deployed without stopping the server
- **Zero cold starts:** CDN-friendly, can be cached aggressively
- **Completely offline-capable:** The site is pre-built, not generated on demand

## 📦 Stack

- **Frontend:** Vanilla JavaScript (ES modules) + Tailwind CSS
- **Data Format:** JavaScript modules + JSON
- **Internationalization:** 3 languages (Spanish, English, Valencian)
- **Icons:** Lucide (via CDN)
- **Fonts:** Instrument Sans (local, WOFF2)
- **Deployment:** Git + HTTP server
- **Build:** No build step required (static files)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ (only for local development, not for production)
- A simple HTTP server (`python -m http.server`, `serve`, or equivalent)

### Local Development

```bash
# Navigate to project
cd AI-STEAM-VANILLA

# Option 1: Python
python -m http.server 3000

# Option 2: Node (if serve is installed)
npx serve -l 3000

# Open browser
# http://localhost:3000
```

The site will reload automatically if you edit files (or manually refresh).

## 📁 Project Structure

```
.
├── index.html                    # Single entry point
├── assets/
│   ├── css/
│   │   ├── main.css              # Theme variables & overrides
│   │   └── tailwind-output.css   # Compiled Tailwind (static)
│   ├── js/
│   │   ├── main.js               # App orchestrator
│   │   ├── router.js             # Tab-based navigation
│   │   ├── i18n.js               # Internationalization (3 languages)
│   │   ├── state.js              # Client-side state
│   │   ├── components/
│   │   │   ├── header.js
│   │   │   ├── footer.js
│   │   │   └── cookie-banner.js
│   │   └── views/
│   │       ├── home.js
│   │       ├── marketplace.js
│   │       ├── network.js
│   │       ├── governance.js
│   │       ├── sectors.js
│   │       ├── training.js
│   │       ├── knowledge.js
│   │       └── news.js
│   └── data/
│       ├── translations.js       # i18n strings (ES, EN, VA)
│       └── challenge-extras.js   # Challenge metadata
├── fonts/
│   └── InstrumentSans-*.woff2
└── package.json                  # Dependencies (dev-only)
```

## 📝 Content Management Workflow

### For Challenge Submissions
1. Challenge is submitted via external form/system
2. CEICE process runs: validates, formats, and updates `assets/data/challenges.js`
3. Git commit: `"feat: add challenge C-2026-001"` 
4. Webhook triggers deployment automatically
5. Live within seconds

### For Training Module Updates
1. Training coordinator updates course content in source system
2. CEICE process synchronizes: updates `assets/data/training.js`
3. Git commit triggers deployment
4. All users see updated content (no cache invalidation needed)

### For Translations
- All UI strings live in `assets/js/translations.js`
- Supported languages: Spanish (es), English (en), Valencian (va)
- Users can switch languages; preference persists in localStorage

## 🌐 Internationalization (i18n)

The platform supports 3 languages with complete UI translation:

```javascript
// Example: translations.js structure
{
  es: {
    nav: { home: "Inicio", marketplace: "Banco de Retos", ... },
    home: { title: "Red AI-STEAM", ... },
    ...
  },
  en: {
    nav: { home: "Home", marketplace: "Challenge Bank", ... },
    ...
  },
  va: {
    ...
  }
}
```

Language selection is persisted in localStorage (`localStorage.getItem('language')`).

## 🔄 Deployment

### Automated via Git

Every push to `main` triggers:
1. GitHub webhook → production server
2. Server pulls latest commit
3. Static files are served immediately (no build step)
4. No downtime, no cache busting needed

### Manual Deployment

```bash
# On production server
cd /opt/ai-steam-network
git pull origin main
# (Server already serves the files; restart not needed)
```

### Rollback

```bash
git revert HEAD~1
git push origin main
# Or manually:
git checkout <previous-commit>
git push origin main --force-with-lease
```

## 📊 Performance

- **Page load:** < 500ms (even on 3G)
- **Navigation between tabs:** Instant (no server round-trip)
- **Language switch:** Instant (cached in memory)
- **CSS size:** ~80 KB (minified Tailwind)
- **JS size:** ~150 KB total (all views)
- **CDN-friendly:** Cache forever, no cache invalidation needed

## 🔐 Security

- **No server-side rendering:** Eliminates injection attacks at source
- **No database:** No SQL injection, no data exfiltration vectors
- **Content Distribution:** Static files can be served via CDN with aggressive caching
- **Update integrity:** All changes tracked in Git with commit signatures (recommended)

## 🛠️ Development

### Adding a New View

```javascript
// assets/js/views/my-view.js
import { t } from '../i18n.js';
import { navigateTo } from '../router.js';

export function render() {
  return `
    <section class="px-6 py-12">
      <h1>${t('myView.title')}</h1>
      <button data-nav="home">Back to Home</button>
    </section>
  `;
}

export function mount() {
  document.querySelector('[data-nav="home"]')
    ?.addEventListener('click', () => navigateTo('home'));
}
```

### Adding a New Translation

Edit `assets/js/translations.js`:
```javascript
export const translations = {
  es: {
    myView: { title: "Mi Vista" }
  },
  en: {
    myView: { title: "My View" }
  },
  va: {
    myView: { title: "La Meva Vista" }
  }
}
```

### Updating Challenge Data

CEICE process updates `assets/data/challenges.js`:
```javascript
export const challenges = [
  {
    id: 'C-2026-001',
    title: 'AI-powered Energy Optimization in Museums',
    organization: 'Generalitat Valenciana',
    status: 'open',
    level: 'FP', // or 'Master'
    sector: 'public',
    ...
  },
  ...
]
```

## 📚 Documentation

- **[PLAN_CONVERSION_VANILLA-es.md](./PLAN_CONVERSION_VANILLA-es.md)** — Detailed technical plan (Spanish, for developers)
- **[README-es.md](./README-es.md)** — Spanish development guide

## 🤝 Contributing

### For CEICE Data Processes

1. Update content files (challenges, training, etc.)
2. Commit to Git: `git commit -m "feat: update challenges for 2026 cohort"`
3. Push: `git push origin main`
4. Deployment is automatic

### For Frontend Development

1. Create a branch: `git checkout -b feature/new-view`
2. Make changes, test locally with `python -m http.server`
3. Commit and push
4. Submit PR for review
5. Merge to `main` to deploy

## ❓ FAQ

**Q: Why no database?**  
A: Simpler architecture, no operational overhead, better security, perfect for static content that changes on a schedule.

**Q: How do users submit challenges?**  
A: External form/system (not in scope of this repo). CEICE processes format and push to this repo.

**Q: What about real-time updates?**  
A: This platform is designed for scheduled updates (e.g., challenges loaded weekly). For real-time notifications, add a lightweight service worker or WebSocket layer independently.

**Q: Can we scale this?**  
A: Yes. Serve from a CDN (CloudFront, Cloudflare, etc.), enable aggressive caching. No origin server load.

**Q: How do we handle user data (registrations, submissions)?**  
A: Separate backend API (not in this repo). This site is the UI; forms post to an external service.

## 📞 Contact

- **Project Owner:** CEICE (Valencian Community Ministry of Innovation)
- **Technical Coordinator:** TBD

## 📄 License

[Specify license here — e.g., MIT, EUPL-1.2, etc.]

---

**Last Updated:** 2026-05-07  
**Status:** Phase 1 (Infrastructure) completed, Phase 2–5 in progress  
**Deployment:** Automated via Git
