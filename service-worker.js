const CACHE_NAME = "english-arabic-cache-v1";
const FILES_TO_CACHE = [
  "/Learn-English-in-Arabic-/",
  "/Learn-English-in-Arabic-/index.html",
  "/Learn-English-in-Arabic-/style.css",
  "/Learn-English-in-Arabic-/manifest.json",
  "/Learn-English-in-Arabic-/icons/icon-192.png",
  "/Learn-English-in-Arabic-/icons/icon-512.png",
  "/Learn-English-in-Arabic-/icons/icon-192-maskable.png",
  "/Learn-English-in-Arabic-/icons/icon-512-maskable.png",
  "/Learn-English-in-Arabic-/الدروس.html",
  "/Learn-English-in-Arabic-/القواعد.html",
  "/Learn-English-in-Arabic-/المقالات.html",
  "/Learn-English-in-Arabic-/الشروط.html",
  "/Learn-English-in-Arabic-/الخصوصية.html"
];

// التثبيت
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

// التفعيل
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// الفetch: نجيب من النت أولاً ثم الكاش
self.addEventListener("fetch", event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        const resClone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, resClone));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
