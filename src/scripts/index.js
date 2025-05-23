import '../styles/styles.css'
import { getToken, clearToken } from '../scripts/utils/auth.js';
import { syncStories } from './utils/offlineData.js';

function updateNav() {
  const hash = window.location.hash || '#/';
  const loggedIn = Boolean(getToken());
  const isAuthPage = hash === '#/login' || hash === '#/register';

  document.getElementById('nav-login').style.display = isAuthPage ? 'block' : 'none';
  document.getElementById('nav-register').style.display = isAuthPage ? 'block' : 'none';

  if (!isAuthPage) {
    document.getElementById('nav-home').style.display = loggedIn ? 'block' : 'none';
    document.getElementById('nav-add').style.display = loggedIn ? 'block' : 'none';
    document.getElementById('nav-settings').style.display = loggedIn ? 'block' : 'none';
    document.getElementById('nav-logout').style.display = loggedIn ? 'block' : 'none';
  } else {
    document.getElementById('nav-home').style.display = 'none';
    document.getElementById('nav-add').style.display = 'none';
    document.getElementById('nav-settings').style.display = 'none';
    document.getElementById('nav-logout').style.display = 'none';
  }
}

updateNav();

import './router.js'

const btn = document.getElementById('logout-btn');
if (btn) {
  btn.addEventListener('click', () => {
    clearToken();
    window.location.hash = '#/login';
    updateNav();
  });
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const reg = await navigator.serviceWorker.register('/sw.js');
      console.log('SW registered with scope:', reg.scope);
    } catch (err) {
      console.error('SW registration failed:', err);
    }
  });
}

window.addEventListener('hashchange', updateNav);

window.addEventListener('online', () => {
  console.log('Koneksi online, mulai sinkronisasi data...');
  syncStories();
});