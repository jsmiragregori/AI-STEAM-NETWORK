import { t } from '../i18n.js';

export function renderFooter() {
  return `
    <footer class="bg-eu-footer text-white border-t-4 border-eu-blue mt-auto">
      <div class="px-4 sm:px-6 py-6 sm:py-4">
        <div class="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-8">
          <div class="flex items-center gap-3 sm:gap-5">
            <div class="w-7.5 h-5 bg-eu-blue shrink-0"></div>
            <div class="text-xs sm:text-sm">
              ${t('footer.fundedBy')}<br/>
              <strong>${t('footer.europeanUnion')}</strong>
            </div>
          </div>
          <div class="text-xs sm:text-sm hidden sm:block">
            Generalitat Valenciana<br/>CEICE
          </div>
          <div class="flex flex-wrap gap-3 sm:gap-6 sm:ml-auto text-xs sm:text-sm">
            <a href="#" class="text-white hover:text-eu-yellow transition-colors font-medium">${t('footer.accessibility')}</a>
            <a href="#" class="text-white hover:text-eu-yellow transition-colors font-medium">${t('footer.privacy')}</a>
            <a href="#" class="text-white hover:text-eu-yellow transition-colors font-medium">${t('footer.sitemap')}</a>
          </div>
        </div>
      </div>
    </footer>
  `;
}

export function mountFooter() {
  // Footer estático, sin event listeners
}
