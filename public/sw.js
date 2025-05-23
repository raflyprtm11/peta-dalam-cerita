self.addEventListener('push', event => {
    const data = event.data?.json() || { title: 'Notifikasi', options: { body: 'Anda mendapat notifikasi baru.' } };
    event.waitUntil(
        self.registration.showNotification(data.title, data.options)
    );
});

self.addEventListener('notificationclick', event => {
    event.notification.close();
    event.waitUntil(clients.openWindow('/'));
});

const CACHE_NAME = 'app-shell-v1';
const DATA_CACHE_NAME = 'data-cache-v1';

const URLS_TO_CACHE = [
    '/',
    '/index.html',
    '/styles/styles.css',
    '/scripts/index.js',
    '/icons/icon-192.png',
    '/icons/icon-512.png',
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(URLS_TO_CACHE))
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => Promise.all(
            keys.filter(key => key !== CACHE_NAME && key !== DATA_CACHE_NAME)
                .map(key => caches.delete(key))
        ))
    );
});

self.addEventListener('fetch', event => {
    const requestUrl = new URL(event.request.url);

    if (requestUrl.pathname.startsWith('/api/')) {
        event.respondWith(
            caches.open(DATA_CACHE_NAME).then(cache =>
                fetch(event.request)
                    .then(response => {
                        cache.put(event.request, response.clone());
                        return response;
                    })
                    .catch(() => cache.match(event.request))
            )
        );
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});
