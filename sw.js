/* =========================================================
   NISRAA — Service Worker (PWA)
   Strategy: Cache-first for static assets, Network-first for pages
   ========================================================= */

const CACHE_NAME = 'nisraa-v1';
const STATIC_CACHE = 'nisraa-static-v1';
const IMAGE_CACHE  = 'nisraa-images-v1';

/* Assets to pre-cache on install */
const PRE_CACHE = [
  '/',
  '/index.html',
  '/shop.html',
  '/cart.html',
  '/about.html',
  '/reviews.html',
  '/why-nisraa.html',
  '/faq.html',
  '/rewards.html',
  '/hair-solutions.html',
  '/affiliate.html',
  '/css/style.css',
  '/js/main.js',
  '/js/cart.js',
  '/manifest.json',
  '/images/logo-nisraa.png',
  '/images/logo-nisraa-original.png',
  '/images/icon-192.png',
  '/images/icon-512.png'
];

/* ── Install: pre-cache all static assets ── */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => cache.addAll(PRE_CACHE.filter(url => !url.includes('icon'))))
      .then(() => self.skipWaiting())
      .catch(err => console.warn('[SW] Pre-cache failed:', err))
  );
});

/* ── Activate: clean up old caches ── */
self.addEventListener('activate', event => {
  const KEEP = [CACHE_NAME, STATIC_CACHE, IMAGE_CACHE];
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => !KEEP.includes(k)).map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

/* ── Fetch: routing strategy ── */
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  /* Skip non-GET & cross-origin non-image requests */
  if (request.method !== 'GET') return;

  /* ── Strategy 1: HTML pages — Network-first, fallback to cache ── */
  if (request.headers.get('Accept') && request.headers.get('Accept').includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          const clone = response.clone();
          caches.open(STATIC_CACHE).then(cache => cache.put(request, clone));
          return response;
        })
        .catch(() => caches.match(request).then(cached => cached || caches.match('/index.html')))
    );
    return;
  }

  /* ── Strategy 2: CSS & JS — Cache-first, update in background ── */
  if (url.pathname.match(/\.(css|js)$/)) {
    event.respondWith(
      caches.open(STATIC_CACHE).then(cache =>
        cache.match(request).then(cached => {
          const networkFetch = fetch(request).then(response => {
            cache.put(request, response.clone());
            return response;
          });
          return cached || networkFetch;
        })
      )
    );
    return;
  }

  /* ── Strategy 3: Images — Cache-first, long-lived ── */
  if (request.destination === 'image' || url.pathname.match(/\.(png|jpg|jpeg|webp|svg|gif|ico)$/)) {
    event.respondWith(
      caches.open(IMAGE_CACHE).then(cache =>
        cache.match(request).then(cached => {
          if (cached) return cached;
          return fetch(request).then(response => {
            if (response.ok) cache.put(request, response.clone());
            return response;
          }).catch(() => cached);
        })
      )
    );
    return;
  }

  /* ── Strategy 4: Everything else — Network with cache fallback ── */
  event.respondWith(
    fetch(request)
      .then(response => {
        if (response.ok) {
          caches.open(CACHE_NAME).then(cache => cache.put(request, response.clone()));
        }
        return response;
      })
      .catch(() => caches.match(request))
  );
});

/* ── Background sync: notify clients of updates ── */
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
