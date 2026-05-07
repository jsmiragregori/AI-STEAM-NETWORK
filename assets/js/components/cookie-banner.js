import { t } from '../i18n.js';
import { getState, setState } from '../state.js';

export function renderCookieBanner() {
  if (getState('cookiesAccepted')) return '';
  return `
    <div id="cookie-banner" class="fixed bottom-0 left-0 right-0 bg-[rgba(0,0,0,0.85)] text-white p-3 px-6 flex justify-between items-center z-50">
      <div>
        <strong>${t('cookieBanner.legal')}</strong> ${t('cookieBanner.text')}
      </div>
      <button id="cookie-accept" class="bg-eu-teal text-white border-none px-3 py-1.5 rounded font-semibold cursor-pointer hover:bg-eu-purple ml-4 whitespace-nowrap transition-colors">
        ${t('cookieBanner.accept')}
      </button>
    </div>
  `;
}

export function mountCookieBanner() {
  document.getElementById('cookie-accept')?.addEventListener('click', () => {
    setState('cookiesAccepted', true);
    localStorage.setItem('cookies-accepted', 'true');
    document.getElementById('cookie-banner')?.remove();
  });
}
