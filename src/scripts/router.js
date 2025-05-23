// src/scripts/router.js
import routes from './routes/routes.js';
import { getToken } from './utils/auth.js';
import { stopActiveStream } from './camera.js';

const router = async () => {
  stopActiveStream();

  const hash = window.location.hash || '#/';
  console.log('🔄 router hit with hash =', hash, ' token=', getToken());

  if (!getToken() && hash !== '#/register' && hash !== '#/login') {
    console.warn('⛔ no token, redirect to login');
    window.location.hash = '#/login';
    return;
  }
  if (getToken() && (hash === '#/register' || hash === '#/login')) {
    console.warn('✅ have token, redirect to home');
    window.location.hash = '#/';
    return;
  }

  const PageClass = routes[hash] || routes['#/'];
  const page = new PageClass();

  if (document.startViewTransition) {
    document.startViewTransition(async () => {
      const html = await page.render();
      document.getElementById('main-content').innerHTML = html;
      await page.afterRender();
    });
  } else {
    const html = await page.render();
    document.getElementById('main-content').innerHTML = html;
    await page.afterRender();
  }

  console.log('🚀 afterRender done');
};

window.addEventListener('hashchange', router);
window.addEventListener('DOMContentLoaded', router);