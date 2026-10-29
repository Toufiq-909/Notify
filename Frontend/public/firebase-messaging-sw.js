// The production build injects its version and complete app-shell asset list.
// This file also retains the existing Firebase push notification handler.
const PRECACHE_URLS = [];
const CACHE_NAME = 'notify-shell-development';
const APP_SHELL = '/index.html';

self.addEventListener('install', event => {
  if (!PRECACHE_URLS.length) return;
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE_URLS)));
  // Do not skipWaiting: an old tab must keep its matching HTML and JS version.
});

self.addEventListener('activate', event => {
  if (!PRECACHE_URLS.length) return;
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter(name => name.startsWith('notify-shell-') && name !== CACHE_NAME).map(name => caches.delete(name)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  if (!PRECACHE_URLS.length || event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  const navigation = event.request.mode === 'navigate';
  if (!navigation && !PRECACHE_URLS.includes(url.pathname)) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const key = navigation ? APP_SHELL : url.pathname;
    const saved = await cache.match(key);
    if (saved) return saved;
    // If browser storage was evicted, try the network without caching API data.
    return fetch(event.request);
  })());
});

self.addEventListener('push', event => {
  if (!event.data) return;
  let payload;
  try { payload = event.data.json(); } catch { return; }
  const notification = payload.notification;
  if (!notification?.title) return;
  event.waitUntil(self.registration.showNotification(notification.title, notification));
});
