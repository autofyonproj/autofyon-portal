const CACHE = 'almostashar-media-manager-v20';
const SHELL = [
  '/media-manager/index.html',
  '/media-manager/manifest.webmanifest',
  '/media-manager/icon-192.png',
  '/media-manager/icon-512.png',
  '/media-manager/icon-maskable-512.png',
  '/media-manager/apple-touch-icon.png',
  '/media-manager/brand-almostashar.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) =>
      (key.startsWith('almostashar-media-manager-') || key.startsWith('autofyon-media-manager-')) && key !== CACHE
    ).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;
  event.respondWith(
    caches.match(request).then((cached) => cached || fetch(request).then((response) => {
      if (response.ok && new URL(request.url).pathname.startsWith('/media-manager/')) {
        const copy = response.clone();
        caches.open(CACHE).then((cache) => cache.put(request, copy));
      }
      return response;
    }).catch((error) => {
      if (request.mode === 'navigate') return caches.match('/media-manager/index.html');
      throw error;
    })),
  );
});
