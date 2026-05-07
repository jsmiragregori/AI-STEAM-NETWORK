import * as home       from './home.js';
import * as sectors    from './sectors.js';
import * as training   from './training.js';
import * as news       from './news.js';
import * as governance from './governance.js';
import * as knowledge  from './knowledge.js';
import * as network    from './network.js';

const placeholder = (label) => ({
  render: () => `<div class="flex items-center justify-center min-h-screen text-gray-400 text-lg">${label} — próximamente</div>`,
  mount: () => {},
});

export const inicio       = home;
export const red          = network;
export const sectores     = sectors;
export const bancoRetos   = placeholder('Marketplace');
export const formacion    = training;
export const conocimiento = knowledge;
export const gobernanza   = governance;
export const actualidad   = news;
