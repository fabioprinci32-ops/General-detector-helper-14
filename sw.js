// Versione cache PWA
const SW_VERSION = 'v1.0.0';
const CACHE_NAME = `gd-helper-${SW_VERSION}`;
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-gd-192.png',
  './icon-gd-512.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((c) => c.addAll(ASSETS)).then(()=>self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k.startsWith('gd-helper-') && k !== CACHE_NAME)
          .map(k => caches.delete(k))
    )).then(()=> self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  e.respondWith(
    caches.match(req).then(res => res || fetch(req).catch(() => caches.match('./')))
  );
});
