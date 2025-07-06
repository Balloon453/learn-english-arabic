const CACHE_NAME = 'learn-english-v1';
const OFFLINE_URL = 'index.html';

const ASSETS_TO_CACHE = [
  'index.html',
  'style.css',
  'manifest.json',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/icon-192-maskable.png',
  'icons/icon-512-maskable.png',
  'الدروس.html',
  'القواعد.html',
  'المقالات.html',
  'الخصوصية.html',
  'الشروط.html',
  // أضف أي ملفات صوت أو صور تستخدمها هنا
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // ❌ تجاهل الإعلانات نهائيًا (ما تتحمل في الكاش)
  if (url.hostname.includes('googlesyndication.com') || url.hostname.includes('googleads.g.doubleclick.net')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      return (
        cached ||
        fetch(event.request).catch(() => {
          if (event.request.mode === 'navigate') {
            return caches.match(OFFLINE_URL);
          }
        })
      );
    })
  );
});
