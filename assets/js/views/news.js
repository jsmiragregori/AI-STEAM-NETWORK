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
    <button data-cat="${cat}" class="px-4 py-2 rounded-full text-xs font-bold cursor-pointer border transition-all ${
      activeFilter === cat
        ? 'bg-eu-blue text-white border-eu-blue shadow-sm'
        : 'bg-white text-eu-text border-eu-blue/10 hover:border-eu-blue/30 hover:bg-eu-blue/5'
    }">${cat}</button>
  `).join('');

  const featuredHtml = (activeFilter === firstCat && featured) ? `
    <article class="rd-card rd-card-hover rd-pad mb-6 cursor-pointer relative overflow-hidden group border-none shadow-xl text-white" style="background:#4918AD" data-news-id="${featured.id}">
      <div class="absolute -right-10 -top-10 w-40 h-40 bg-white/5 rounded-full blur-xl"></div>
      
      <div class="flex items-center gap-3 mb-4 relative z-10">
        <span class="rd-badge-beige">${newsT?.featured || ''}</span>
        <span class="text-sm text-white/70 flex items-center gap-1.5"><i data-lucide="calendar" class="w-4 h-4"></i>${featured.date}</span>
      </div>
      <h2 class="text-3xl font-extrabold mb-4 group-hover:text-white transition-colors leading-tight relative z-10" style="color:#FFF4E1">${featured.title}</h2>
      <p class="text-lg text-white/85 mb-6 leading-relaxed relative z-10">${featured.excerpt}</p>
      <div class="flex items-center justify-between mt-6 pt-4 border-t border-white/10 relative z-10">
        <span class="text-xs font-bold text-white/60 uppercase tracking-wider">${featured.partner || ''}</span>
        <button data-news-id="${featured.id}" class="inline-flex items-center font-bold text-sm hover:text-white transition-colors cursor-pointer border-none bg-transparent p-0" style="color:#FFF4E1">
          ${newsT?.readMore || ''} <i data-lucide="arrow-right" class="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1"></i>
        </button>
      </div>
    </article>
  ` : '';

  const newsListHtml = rest.map(item => `
    <article class="rd-card rd-card-hover rd-pad bg-white cursor-pointer group flex flex-col justify-between" data-news-id="${item.id}">
      <div>
        <div class="flex items-center justify-between mb-4">
          <div class="flex flex-wrap items-center gap-2">
            <span class="text-xs font-bold uppercase tracking-wider ${getCategoryColor(item.category)}">${item.category}</span>
            ${item.sector ? `<span class="flex items-center gap-1.5 text-sm text-gray-400 font-semibold"><i data-lucide="tag" class="w-3 h-3"></i>${item.sector}</span>` : ''}
          </div>
          <div class="flex items-center gap-2">
            ${item.isOfficial !== undefined ? `
              <span class="text-xs font-bold px-2 py-0.5 rounded ${item.isOfficial ? 'bg-green-50 text-green-700' : 'bg-purple-50 text-purple-700'}">
                ${item.isOfficial ? (newsT?.officialBadge || 'Oficial') : (newsT?.demoBadge || 'Demo')}
              </span>` : ''}
            <span class="text-sm text-gray-400 flex items-center gap-1.5"><i data-lucide="calendar" class="w-3.5 h-3.5"></i>${item.date}</span>
          </div>
        </div>
        <h3 class="text-2xl font-extrabold text-eu-purple mb-4 group-hover:text-eu-blue transition-colors leading-snug">${item.title}</h3>
        <p class="text-base text-gray-500 mb-6 line-clamp-3 leading-relaxed">${item.excerpt}</p>
      </div>
      <div class="flex items-center justify-between border-t border-eu-blue/5 pt-4 mt-auto">
        ${item.partner ? `<span class="text-xs font-bold text-gray-400 uppercase tracking-wider">${item.partner}</span>` : '<span></span>'}
        <span class="inline-flex items-center text-sm font-bold text-eu-blue hover:text-eu-purple transition-colors ml-auto">
          ${newsT?.readMore || ''} <i data-lucide="arrow-right" class="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1"></i>
        </span>
      </div>
    </article>
  `).join('');

  const emptyHtml = filtered.length === 0 ? `
    <div class="text-center py-12 text-gray-505">
      <p class="font-semibold">${newsT?.noNews || ''}</p>
    </div>` : '';

  const eventsHtml = events.map(event => `
    <li class="p-5 hover:bg-eu-blue/5 transition-colors first:rounded-t-2xl last:rounded-b-2xl">
      <div class="flex items-start gap-4">
        <div class="bg-eu-purple/5 border border-eu-purple/10 text-eu-purple rounded-2xl p-2.5 text-center min-w-[3.5rem] shrink-0">
          <span class="block text-xl font-extrabold leading-none">${event.dateNum}</span>
          <span class="block text-[0.65rem] font-bold uppercase tracking-wider mt-1 opacity-80">${event.dateMonth}</span>
        </div>
        <div class="flex-1 min-w-0">
          <h4 class="font-extrabold text-sm text-eu-text mb-1 leading-snug hover:text-eu-blue transition-colors cursor-pointer">${event.title}</h4>
          <p class="text-xs text-gray-400 flex items-center gap-1 mb-2">
            <i data-lucide="map-pin" class="w-3.5 h-3.5 shrink-0"></i>${event.location}
          </p>
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${getTypeColor(event.type)}">${event.type}</span>
            ${event.register ? `<a href="#" class="text-xs font-bold text-eu-blue hover:text-eu-purple transition-colors flex items-center gap-1">${newsT?.register || ''} <i data-lucide="external-link" class="w-3 h-3"></i></a>` : ''}
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
    <a href="#" class="flex items-center gap-2 p-2.5 rounded-xl bg-eu-blue/5 border border-eu-blue/5 text-xs text-eu-blue hover:text-eu-purple hover:bg-eu-blue/10 hover:border-eu-blue/20 transition-all font-bold">
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
      <div class="rd-hero-gradient text-white px-6 py-20 relative overflow-hidden">
        <!-- Accent circles -->
        <div class="absolute -right-20 -bottom-20 w-80 h-80 bg-white/5 rounded-full blur-2xl"></div>
        <div class="absolute left-10 top-5 w-40 h-40 bg-eu-yellow/5 rounded-full blur-xl"></div>
        
        <div class="max-w-7xl mx-auto relative z-10">
          <div class="max-w-3xl">
            <span class="inline-block bg-white/10 border border-white/20 font-bold text-xs uppercase tracking-widest px-4 py-1.5 rounded-full mb-6" style="color:#FFF4E1;backdrop-filter:blur(8px)">
              ${newsT?.eyebrow || 'Actualidad'}
            </span>
            <h1 class="font-extrabold mb-6" style="color:#FFF4E1;letter-spacing:-.025em;font-size:clamp(2.5rem,5vw,3.75rem);line-height:1.05;max-width:20ch">${pickLang(heroBlock.title, newsT?.title || '')}</h1>
            <p class="text-lg mb-6 leading-relaxed" style="color:rgba(255,255,255,.9)">${pickLang(heroBlock.description, newsT?.description || '')}</p>
            ${notice ? `<p class="text-sm text-eu-yellow/90 italic mt-3 flex items-center gap-1.5 mb-6"><i data-lucide="info" class="w-4 h-4"></i>${notice}</p>` : ''}
            
            ${ctaButton.visible !== false ? `
            <div class="flex flex-wrap gap-4 mb-8">
              <button class="flex items-center gap-2 rounded-full font-bold transition-all hover:scale-105 hover:bg-white hover:text-eu-purple border-none cursor-pointer shadow-lg" style="background:#FFF4E1;color:#4918AD;padding:1rem 2.5rem">
                <i data-lucide="rss" class="w-4 h-4"></i>${pickLang(ctaButton.label, newsT?.subscribeButton || '')}
              </button>
            </div>` : ''}

            ${heroStats.length > 0 ? `
            <div class="flex flex-wrap gap-4 mt-8">
              ${heroStats.map((s, i) => `
              <div class="${i % 2 === 0 ? 'rd-hero-stat' : 'rd-hero-stat-alt'} px-6 py-4 text-center">
                <p class="text-3xl font-extrabold text-white leading-none">${s.value}</p>
                <p class="text-xs font-bold uppercase tracking-wider mt-1.5" style="color:rgba(255,244,225,.75)">${pickLang(s.label)}</p>
              </div>`).join('')}
            </div>` : ''}
          </div>
        </div>
      </div>` : ''}

      <!-- Content -->
      <div class="rd-canvas rd-section py-16">
        <div class="max-w-7xl mx-auto px-6">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <!-- Main feed -->
            <div class="lg:col-span-2">
              <div class="flex flex-wrap gap-2 mb-8">${categoryTabsHtml}</div>
              ${featuredHtml}
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">${newsListHtml}</div>
              ${emptyHtml}
            </div>

            <!-- Sidebar -->
            <div class="space-y-8">
              <!-- Events -->
              <div class="rd-card bg-white border border-eu-blue/10">
                <div class="p-6 pb-2">
                  <h3 class="text-xl font-extrabold text-eu-purple flex items-center gap-2">
                    <i data-lucide="calendar" class="w-5 h-5 text-eu-blue"></i>${newsT?.upcomingEvents || ''}
                  </h3>
                </div>
                <ul class="divide-y divide-eu-blue/5">${eventsHtml}</ul>
                <div class="p-4 bg-eu-blue/5 rounded-b-[2rem] text-center border-t border-eu-blue/5">
                  <a href="#" class="text-sm font-bold text-eu-blue hover:text-eu-purple transition-colors">${newsT?.viewFullCalendar || ''}</a>
                </div>
              </div>

              <!-- Newsletter -->
              <div class="rd-hero-gradient rounded-[2rem] p-8 text-white shadow-lg relative overflow-hidden">
                <!-- Accent blob -->
                <div class="absolute -right-8 -top-8 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
                <h3 class="font-extrabold text-xl mb-2 text-eu-yellow">${newsT?.newsletterTitle || ''}</h3>
                <p class="text-sm text-white/80 mb-6 leading-relaxed">${newsT?.newsletterDesc || ''}</p>
                <form id="newsletter-form" class="space-y-3">
                  <input id="newsletter-email" type="email"
                    placeholder="${newsT?.newsletterPlaceholder || ''}"
                    class="w-full rounded-full px-4 py-3 text-sm text-eu-text bg-white/95 border border-white/20 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-eu-yellow transition-all" />
                  <button type="submit" class="w-full bg-eu-yellow text-eu-purple font-bold rounded-full py-3 text-sm hover:bg-white hover:text-eu-purple transition-all cursor-pointer border-none shadow-md">
                    ${newsT?.newsletterSubscribe || ''}
                  </button>
                </form>
              </div>

              <!-- Social links -->
              <div class="rd-card bg-white p-6">
                <h3 class="font-extrabold text-lg text-eu-purple mb-4 flex items-center gap-2">
                  <i data-lucide="share-2" class="w-5 h-5 text-eu-blue"></i>${newsT?.followUs || ''}
                </h3>
                <div class="grid grid-cols-2 gap-3">${socialLinks}</div>
              </div>
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

  const { news } = getNewsAndEvents(newsT);
  const selectedId = getState('selectedNewsId');
  const article = news.find(n => n.id === selectedId) || {};
  const heroTitle    = article.title    || detail.title    || '';
  const heroCategory = article.category || detail.category || '';
  const heroDate     = article.date     || detail.date     || '';
  const heroPartner  = article.partner  || detail.author   || '';

  const sectionsHtml = (detail.sections || []).map((section, idx) => `
    <article class="scroll-mt-20">
      <h2 class="text-2xl font-extrabold text-eu-purple mb-4 flex items-center gap-4">
        <span class="rd-icon-circle bg-eu-yellow text-eu-purple text-lg font-extrabold shrink-0 shadow-sm">${idx + 1}</span>
        ${section.title}
      </h2>
      <p class="text-lg text-gray-650 leading-relaxed whitespace-pre-wrap">${section.content}</p>
    </article>
  `).join('');

  const relatedHtml = (detail.related_news || []).length > 0 ? `
    <div class="pt-12 border-t border-eu-blue/10">
      <h3 class="text-2xl font-extrabold text-eu-purple mb-6 flex items-center gap-2">
        <i data-lucide="tag" class="w-5 h-5 text-eu-blue"></i>${newsT?.relatedNews || 'Noticias Relacionadas'}
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        ${(detail.related_news || []).map(related => `
          <div class="text-left p-6 bg-white border border-eu-blue/10 rounded-2xl hover:border-eu-blue/30 hover:-translate-y-0.5 transition-all shadow-sm cursor-pointer group">
            <p class="font-bold text-eu-text group-hover:text-eu-blue transition-colors leading-snug">${related}</p>
          </div>
        `).join('')}
      </div>
    </div>` : '';

  return `
    <div>
      <!-- Hero -->
      <div class="rd-hero-gradient text-white px-6 py-20 relative overflow-hidden">
        <div class="absolute -right-20 -bottom-20 w-80 h-80 bg-white/5 rounded-full blur-2xl"></div>
        <div class="max-w-4xl mx-auto relative z-10">
          <button id="news-back-btn" class="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-all text-white px-4 py-2 rounded-full font-bold text-xs border border-white/20 mb-6 cursor-pointer">
            <i data-lucide="arrow-left" class="w-3.5 h-3.5"></i>${newsT?.backToNews || 'Volver a Noticias'}
          </button>
          <div class="flex items-center gap-2 mb-4">
            <span class="rd-badge-beige">${heroCategory}</span>
          </div>
          <h1 class="text-3xl md:text-5xl font-extrabold mb-4 leading-tight tracking-tight">${heroTitle}</h1>
          <p class="text-xl text-white/85 mb-8 max-w-3xl leading-relaxed font-medium">${detail.hero_subtitle || ''}</p>
          <div class="flex flex-wrap items-center gap-6 text-white/70 text-sm">
            <div class="flex items-center gap-2"><i data-lucide="calendar" class="w-4.5 h-4.5"></i><span>${heroDate}</span></div>
            <div class="flex items-center gap-2"><i data-lucide="user" class="w-4.5 h-4.5"></i><span>${heroPartner}</span></div>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="rd-canvas py-16">
        <div class="max-w-4xl mx-auto px-6">
          <div class="mb-12 pb-12 border-b border-eu-blue/10">
            <p class="text-xl text-gray-700 leading-relaxed whitespace-pre-wrap font-medium">${detail.intro || ''}</p>
          </div>
          <div class="space-y-12 mb-12">${sectionsHtml}</div>

          <!-- CTA -->
          <div class="rd-card rd-card-tint-purple rd-pad mb-12 text-center relative overflow-hidden border border-eu-purple/10">
            <h3 class="text-2xl font-extrabold text-eu-purple mb-3">${newsT?.detailCtaTitle || '¿Listo para unirte a la red?'}</h3>
            <p class="text-gray-650 text-base mb-6 max-w-2xl mx-auto leading-relaxed">${newsT?.detailCtaDesc || ''}</p>
            <a href="${detail.cta_link || '#'}"
               class="inline-flex items-center gap-2 bg-eu-blue text-white px-8 py-3.5 rounded-full font-bold hover:bg-eu-purple transition-all shadow-md">
              ${detail.cta_button || ''} <i data-lucide="arrow-right" class="w-4 h-4"></i>
            </a>
          </div>

          ${relatedHtml}

          <!-- Share -->
          <div class="mt-12 pt-8 border-t border-eu-blue/10">
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-400 font-bold uppercase tracking-wider">${newsT?.shareArticle || 'Compartir esta noticia'}</span>
              <div class="flex items-center gap-3">
                <button class="p-3 bg-eu-blue/5 hover:bg-eu-blue/10 text-eu-blue rounded-full transition-all border border-eu-blue/10 cursor-pointer">
                  <i data-lucide="share-2" class="w-4.5 h-4.5"></i>
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
