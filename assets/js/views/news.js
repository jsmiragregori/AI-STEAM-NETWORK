import { t } from '../i18n.js';
import { getState, setState } from '../state.js';
import { NEWS_CONFIG } from '../../data/news.js';

function getLang() { return localStorage.getItem('language') || 'es'; }
function pickLang(value, fallback = '') {
  const lang = getLang();
  if (value && typeof value === 'object') return value[lang] || value.es || fallback;
  return fallback;
}

function getTypeColor(type) {
  const map = {
    'Presencial': 'bg-blue-100 text-blue-700',
    'Online': 'bg-green-100 text-green-700',
    'Híbrido': 'bg-purple-100 text-purple-700',
    'In-person': 'bg-blue-100 text-blue-700',
    'En-person': 'bg-blue-100 text-blue-700',
    'Hybrid': 'bg-purple-100 text-purple-700',
    'En línia': 'bg-green-100 text-green-700',
    'Híbrid': 'bg-purple-100 text-purple-700',
  };
  return map[type] || 'bg-gray-100 text-gray-800';
}

function getCategoryColor(category) {
  const map = {
    'Institucional': 'text-blue-700', 'Institutional': 'text-blue-700',
    'Formación': 'text-purple-700', 'Training': 'text-purple-700', 'Formació': 'text-purple-700',
    'Eventos': 'text-eu-teal', 'Events': 'text-eu-teal',
    'Retos': 'text-eu-orange', 'Challenges': 'text-eu-orange', 'Reptes': 'text-eu-orange',
    'Recursos': 'text-green-700', 'Resources': 'text-green-700',
    'ENRED': 'text-eu-purple',
    'FP/VET': 'text-yellow-700', 'VET/FP': 'text-yellow-700',
    'Form. Docent': 'text-pink-700', 'Teacher Training': 'text-pink-700',
    'Stakeholders': 'text-blue-700',
    'Retos y Casos': 'text-eu-orange', 'Reptes i Casos': 'text-eu-orange', 'Challenges & Cases': 'text-eu-orange',
  };
  return map[category] || 'text-gray-700';
}

function getNewsAndEvents(newsT) {
  const newsItemsObj = newsT?.newsItems || {};
  const eventsObj    = newsT?.events || {};

  const news = Object.values(newsItemsObj).map((item, idx) => ({
    id:       idx + 1,
    title:    item.title,
    date:     item.date,
    category: item.category,
    excerpt:  item.excerpt,
    sector:   item.sector,
    partner:  item.partner,
    featured: item.featured,
    isOfficial: item.isOfficial,
  }));

  const events = Object.values(eventsObj).map((item, idx) => ({
    id:         idx + 1,
    dateNum:    item.dateNum,
    dateMonth:  item.dateMonth,
    title:      item.title,
    location:   item.location,
    type:       item.type,
    register:   item.register,
  }));

  return { news, events };
}

const CATEGORY_KEYS = [
  'categoryAll', 'categoryENRED', 'categoryFPVET', 'categoryTeacherTraining',
  'categoryStakeholders', 'categoryChallengesCases', 'categoryEvents',
];

function getCategoryList(newsT) {
  return CATEGORY_KEYS.map(k => newsT?.[k] || k);
}

export function render() {
  const newsT        = t('news') || {};
  const categoryList = getCategoryList(newsT);
  const storedFilter = getState('newsCategoryFilter');
  const activeFilter = (storedFilter && categoryList.includes(storedFilter)) ? storedFilter : categoryList[0];
  const selectedId   = getState('selectedNewsId');

  if (selectedId !== null && selectedId !== undefined) {
    return renderDetail(newsT);
  }

  const { news, events } = getNewsAndEvents(newsT);

  const firstCat = categoryList[0];
  const filtered = activeFilter === firstCat ? news : news.filter(n => n.category === activeFilter);
  const featured = news.find(n => n.featured);
  const rest     = filtered.filter(n => !n.featured || activeFilter !== firstCat);

  const categoryTabsHtml = categoryList.map(cat => `
    <button data-cat="${cat}" class="px-3 py-1.5 rounded-full text-xs font-bold cursor-pointer border transition-colors ${
      activeFilter === cat
        ? 'bg-eu-blue text-white border-eu-blue'
        : 'bg-white text-eu-text border-eu-border hover:border-eu-blue'
    }">${cat}</button>
  `).join('');

  const featuredHtml = (activeFilter === firstCat && featured) ? `
    <article class="bg-eu-blue text-white p-7 rounded-xl mb-5 hover:bg-eu-purple transition-colors cursor-pointer" data-news-id="${featured.id}">
      <div class="flex items-center gap-2 mb-3">
        <span class="text-xs font-bold bg-eu-yellow/20 text-eu-yellow px-2 py-0.5 rounded uppercase tracking-wide">${newsT?.featured || ''}</span>
        <span class="text-xs text-white/60 flex items-center gap-1"><i data-lucide="calendar" class="w-3 h-3"></i>${featured.date}</span>
      </div>
      <h2 class="text-xl font-extrabold mb-3 leading-tight">${featured.title}</h2>
      <p class="text-white/80 text-sm mb-4">${featured.excerpt}</p>
      <div class="flex items-center justify-between">
        <span class="text-xs font-semibold text-white/60">${featured.partner || ''}</span>
        <button data-news-id="${featured.id}" class="inline-flex items-center text-eu-yellow font-bold text-sm hover:underline cursor-pointer">
          ${newsT?.readMore || ''} <i data-lucide="arrow-right" class="ml-1 w-4 h-4"></i>
        </button>
      </div>
    </article>
  ` : '';

  const newsListHtml = rest.map(item => `
    <article class="bg-white p-5 rounded-xl border border-eu-border shadow-sm hover:border-eu-blue transition-colors cursor-pointer" data-news-id="${item.id}">
      <div class="flex items-center justify-between mb-2">
        <div class="flex items-center gap-2">
          <span class="text-xs font-bold uppercase tracking-wider ${getCategoryColor(item.category)}">${item.category}</span>
          ${item.sector ? `<span class="flex items-center gap-1 text-xs text-gray-500 font-semibold"><i data-lucide="tag" class="w-2.5 h-2.5"></i>${item.sector}</span>` : ''}
        </div>
        <div class="flex items-center gap-2">
          ${item.isOfficial !== undefined ? `
            <span class="text-xs font-bold px-2 py-0.5 rounded ${item.isOfficial ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-700'}">
              ${item.isOfficial ? (newsT?.officialBadge || 'Oficial') : (newsT?.demoBadge || 'Demo')}
            </span>` : ''}
          <span class="text-xs text-gray-500 flex items-center gap-1"><i data-lucide="calendar" class="w-3 h-3"></i>${item.date}</span>
        </div>
      </div>
      <h3 class="text-base font-bold text-eu-text mb-2 hover:text-eu-blue transition-colors leading-snug">${item.title}</h3>
      <p class="text-sm text-gray-600 mb-3 line-clamp-2">${item.excerpt}</p>
      <div class="flex items-center justify-between">
        ${item.partner ? `<span class="text-sm text-gray-500 font-semibold">${item.partner}</span>` : '<span></span>'}
        <span class="inline-flex items-center text-sm font-bold text-eu-blue hover:underline ml-auto">
          ${newsT?.readMore || ''} <i data-lucide="arrow-right" class="ml-1 w-3.5 h-3.5"></i>
        </span>
      </div>
    </article>
  `).join('');

  const emptyHtml = filtered.length === 0 ? `
    <div class="text-center py-12 text-gray-500">
      <p class="font-semibold">${newsT?.noNews || ''}</p>
    </div>` : '';

  const eventsHtml = events.map(event => `
    <li class="p-4 hover:bg-eu-bg transition-colors">
      <div class="flex items-start gap-3">
        <div class="bg-eu-blue text-white rounded-lg p-2 text-center min-w-12 shrink-0">
          <span class="block text-lg font-extrabold leading-none">${event.dateNum}</span>
          <span class="block text-xs font-semibold uppercase mt-0.5">${event.dateMonth}</span>
        </div>
        <div class="flex-1 min-w-0">
          <h4 class="font-bold text-sm text-eu-text mb-1 leading-snug">${event.title}</h4>
          <p class="text-xs text-gray-500 flex items-center gap-1 mb-1.5">
            <i data-lucide="map-pin" class="w-3 h-3 shrink-0"></i>${event.location}
          </p>
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold px-1.5 py-0.5 rounded ${getTypeColor(event.type)}">${event.type}</span>
            ${event.register ? `<a href="#" class="text-xs font-bold text-eu-blue hover:underline flex items-center gap-0.5">${newsT?.register || ''} <i data-lucide="external-link" class="w-2.5 h-2.5"></i></a>` : ''}
          </div>
        </div>
      </div>
    </li>
  `).join('');

  const socialLinks = [
    { key: 'linkedin',  label: newsT?.socialLinks?.linkedin },
    { key: 'twitter',   label: newsT?.socialLinks?.twitter  },
    { key: 'youtube',   label: newsT?.socialLinks?.youtube  },
    { key: 'substack',  label: newsT?.socialLinks?.substack },
  ].filter(l => l.label).map(l => `
    <a href="#" class="flex items-center gap-2 text-sm text-eu-blue hover:underline font-medium">
      <i data-lucide="external-link" class="w-3.5 h-3.5 shrink-0"></i>${l.label}
    </a>
  `).join('');

  const heroBlock  = NEWS_CONFIG?.heroBlock || {};
  const heroVisible = heroBlock.visible !== false;
  const heroStats  = Array.isArray(heroBlock.stats) ? heroBlock.stats : [];
  const notice     = pickLang(heroBlock.notice, '');
  const ctaButton  = heroBlock.ctaButton || {};

  return `
    <div>
      ${heroVisible ? `
      <!-- Header -->
      <div class="bg-eu-blue text-white px-6 py-12">
        <div class="max-w-7xl mx-auto flex flex-wrap items-start justify-between gap-6">
          <div>
            <h1 class="text-3xl font-extrabold mb-2">${pickLang(heroBlock.title, newsT?.title || '')}</h1>
            <p class="text-white/80 max-w-2xl text-sm">${pickLang(heroBlock.description, newsT?.description || '')}</p>
            ${notice ? `<p class="text-xs text-eu-yellow/80 italic mt-2">${notice}</p>` : ''}
            ${heroStats.length > 0 ? `
            <div class="flex flex-wrap gap-4 mt-6">
              ${heroStats.map(s => `
              <div class="bg-white/10 rounded-xl px-5 py-3 text-center">
                <p class="text-2xl font-extrabold text-eu-yellow">${s.value}</p>
                <p class="text-xs text-white/70 font-semibold uppercase mt-1">${pickLang(s.label)}</p>
              </div>`).join('')}
            </div>` : ''}
          </div>
          ${ctaButton.visible !== false ? `
          <button class="flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-colors text-white px-4 py-2 rounded-lg font-bold text-sm border border-white/20 cursor-pointer min-h-11">
            <i data-lucide="rss" class="w-4 h-4"></i>${pickLang(ctaButton.label, newsT?.subscribeButton || '')}
          </button>` : ''}
        </div>
      </div>` : ''}

      <!-- Content -->
      <div class="max-w-7xl mx-auto px-6 py-8">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Main feed -->
          <div class="lg:col-span-2">
            <div class="flex flex-wrap gap-2 mb-6">${categoryTabsHtml}</div>
            ${featuredHtml}
            <div class="space-y-4">${newsListHtml}</div>
            ${emptyHtml}
          </div>

          <!-- Sidebar -->
          <div class="space-y-6">
            <!-- Events -->
            <div>
              <h2 class="text-lg font-bold text-eu-text mb-4">${newsT?.upcomingEvents || ''}</h2>
              <div class="bg-white rounded-xl border border-eu-border shadow-sm overflow-hidden">
                <ul class="divide-y divide-eu-border">${eventsHtml}</ul>
                <div class="p-3 bg-eu-bg border-t border-eu-border text-center">
                  <a href="#" class="text-sm font-bold text-eu-blue hover:underline">${newsT?.viewFullCalendar || ''}</a>
                </div>
              </div>
            </div>

            <!-- Newsletter -->
            <div class="bg-linear-to-br from-eu-purple to-eu-blue rounded-xl p-6 text-white shadow-sm">
              <h3 class="font-bold text-lg mb-2 text-eu-yellow">${newsT?.newsletterTitle || ''}</h3>
              <p class="text-sm text-white mb-4">${newsT?.newsletterDesc || ''}</p>
              <form id="newsletter-form" class="space-y-2">
                <input id="newsletter-email" type="email"
                  placeholder="${newsT?.newsletterPlaceholder || ''}"
                  class="w-full rounded-md px-3 py-2 text-sm text-eu-text bg-white border border-white/70 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-eu-yellow" />
                <button type="submit" class="w-full bg-eu-yellow text-eu-purple font-bold rounded-md py-2 text-sm hover:bg-white transition-colors cursor-pointer border border-eu-yellow">
                  ${newsT?.newsletterSubscribe || ''}
                </button>
              </form>
            </div>

            <!-- Social links -->
            <div class="bg-white rounded-xl border border-eu-border shadow-sm p-5">
              <h3 class="font-bold text-eu-text mb-3">${newsT?.followUs || ''}</h3>
              <div class="space-y-2">${socialLinks}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderDetail(newsT) {
  const detail = newsT?.newsDetail;
  if (!detail) return '<div class="p-12 text-center text-gray-400">No detail available</div>';

  // Overlay the clicked article's own title/category/date/partner onto the detail hero,
  // so each card opens with the right header even though body content is shared demo data.
  const { news } = getNewsAndEvents(newsT);
  const selectedId = getState('selectedNewsId');
  const article = news.find(n => n.id === selectedId) || {};
  const heroTitle    = article.title    || detail.title    || '';
  const heroCategory = article.category || detail.category || '';
  const heroDate     = article.date     || detail.date     || '';
  const heroPartner  = article.partner  || detail.author   || '';

  const sectionsHtml = (detail.sections || []).map((section, idx) => `
    <article class="scroll-mt-20">
      <h2 class="text-2xl font-bold text-eu-text mb-4 flex items-center gap-3">
        <span class="w-10 h-10 bg-eu-blue/10 rounded-full flex items-center justify-center text-eu-blue font-bold shrink-0">${idx + 1}</span>
        ${section.title}
      </h2>
      <p class="text-gray-700 leading-relaxed whitespace-pre-wrap">${section.content}</p>
    </article>
  `).join('');

  const relatedHtml = (detail.related_news || []).length > 0 ? `
    <div class="pt-8 border-t border-eu-border">
      <h3 class="text-2xl font-bold text-eu-text mb-6 flex items-center gap-2">
        <i data-lucide="tag" class="w-5 h-5"></i>${newsT?.relatedNews || 'Noticias Relacionadas'}
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        ${(detail.related_news || []).map(related => `
          <div class="text-left p-4 bg-white border border-eu-border rounded-lg hover:border-eu-blue hover:bg-eu-bg transition-colors">
            <p class="font-bold text-eu-text hover:text-eu-blue transition-colors leading-snug">${related}</p>
          </div>
        `).join('')}
      </div>
    </div>` : '';

  return `
    <div>
      <!-- Hero -->
      <div class="bg-gradient-to-b from-eu-blue to-blue-900 text-white px-6 py-16">
        <div class="max-w-4xl mx-auto">
          <button id="news-back-btn" class="flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-6 font-bold text-sm cursor-pointer">
            <i data-lucide="arrow-left" class="w-4 h-4"></i>${newsT?.backToNews || 'Volver a Noticias'}
          </button>
          <div class="flex items-center gap-2 mb-4">
            <span class="text-xs font-bold bg-eu-yellow/20 text-eu-yellow px-3 py-1 rounded-full uppercase tracking-wide">${heroCategory}</span>
          </div>
          <h1 class="text-3xl md:text-4xl font-extrabold mb-4 leading-tight">${heroTitle}</h1>
          <p class="text-lg text-white/90 mb-6 max-w-3xl leading-relaxed">${detail.hero_subtitle || ''}</p>
          <div class="flex flex-wrap items-center gap-6 text-white/70 text-sm">
            <div class="flex items-center gap-2"><i data-lucide="calendar" class="w-4 h-4"></i><span>${heroDate}</span></div>
            <div class="flex items-center gap-2"><i data-lucide="user" class="w-4 h-4"></i><span>${heroPartner}</span></div>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="max-w-4xl mx-auto px-6 py-12">
        <div class="mb-12 pb-12 border-b border-eu-border">
          <p class="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap">${detail.intro || ''}</p>
        </div>
        <div class="space-y-12 mb-12">${sectionsHtml}</div>

        <!-- CTA -->
        <div class="bg-gradient-to-r from-eu-blue/5 to-eu-teal/5 border border-eu-border rounded-2xl p-8 mb-12 text-center">
          <h3 class="text-2xl font-bold text-eu-text mb-3">${newsT?.detailCtaTitle || '¿Listo para unirte a la red?'}</h3>
          <p class="text-gray-600 mb-6 max-w-2xl mx-auto">${newsT?.detailCtaDesc || ''}</p>
          <a href="${detail.cta_link || '#'}"
             class="inline-flex items-center gap-2 bg-eu-blue text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-800 transition-colors">
            ${detail.cta_button || ''}
          </a>
        </div>

        ${relatedHtml}

        <!-- Share -->
        <div class="mt-12 pt-8 border-t border-eu-border">
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-500 font-semibold">${newsT?.shareArticle || 'Compartir esta noticia'}</span>
            <div class="flex items-center gap-3">
              <button class="p-3 bg-eu-blue/10 hover:bg-eu-blue/20 text-eu-blue rounded-lg transition-colors">
                <i data-lucide="share-2" class="w-4 h-4"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function rerender() {
  const main = document.getElementById('main-root');
  main.innerHTML = render();
  mount();
  if (window.lucide) window.lucide.createIcons();
}

function goToDetail(id) {
  setState('selectedNewsId', id);
  history.pushState({ newsDetail: id }, '');
  window.scrollTo(0, 0);
  rerender();
}

function goBackToList() {
  setState('selectedNewsId', null);
  window.scrollTo(0, 0);
  rerender();
}

let _popstateAttached = false;

export function mount() {
  // Category filter
  document.querySelectorAll('[data-cat]').forEach(btn => {
    btn.addEventListener('click', () => {
      setState('newsCategoryFilter', btn.dataset.cat);
      rerender();
    });
  });

  // News item click → detail
  document.querySelectorAll('[data-news-id]').forEach(el => {
    el.addEventListener('click', () => goToDetail(parseInt(el.dataset.newsId)));
  });

  // In-page back button
  document.getElementById('news-back-btn')?.addEventListener('click', () => {
    history.back();
  });

  // Newsletter form
  document.getElementById('newsletter-form')?.addEventListener('submit', e => e.preventDefault());

  // Browser back/forward — attach once per page load
  if (!_popstateAttached) {
    _popstateAttached = true;
    window.addEventListener('popstate', () => {
      if (getState('selectedNewsId') !== null) {
        goBackToList();
      }
    });
  }
}
