import * as home     from './home.js';
import * as sectors  from './sectors.js';
import * as training from './training.js';
import * as news     from './news.js';

const placeholder = (label) => ({
  render: () => `<div class="flex items-center justify-center min-h-screen text-gray-400 text-lg">${label} — próximamente</div>`,
  mount: () => {},
});

export const inicio       = home;
export const red          = placeholder('Network');
export const sectores     = sectors;
export const bancoRetos   = placeholder('Marketplace');
export const formacion    = training;
export const conocimiento = placeholder('Knowledge');
export const gobernanza   = placeholder('Governance');
export const actualidad   = news;
