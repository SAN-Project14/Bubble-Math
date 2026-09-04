// Bubble Math - Service Worker (Production-Ready PWA)
const CACHE_NAME = 'bubble-math-v1';

// Core static assets to precache on installation for immediate offline availability
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/manifest.webmanifest',
  '/favicon.ico',
  '/favicon.png',
  '/icon.svg',
  '/icon-maskable.svg',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/icon-maskable-512.png',
  '/pwa-192x192.png',
  '/pwa-512x512.png',
  '/screenshots/bubble-math-desktop.png',
  '/screenshots/bubble-math-mobile.png',
  '/screenshots/bubble-math-tablet.png',
];

// Install event: Precache core application shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        // Use cache.addAll with graceful fallback for resilience
        return Promise.all(
          PRECACHE_ASSETS.map((url) => {
            return cache.add(url).catch((err) => {
              console.warn('[SW] Could not precache resource:', url, err);
            });
          })
        );
      })
      .then(() => {
        // Activate worker immediately without waiting for existing tabs to close
        return self.skipWaiting();
      })
  );
});

// Activate event: Clean up old cache versions and claim clients
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cache) => {
            if (cache !== CACHE_NAME) {
              console.log('[SW] Purging outdated cache:', cache);
              return caches.delete(cache);
            }
          })
        );
      })
      .then(() => {
        // Take control of all pages within scope immediately
        return self.clients.claim();
      })
  );
});

// Fetch event: Intelligent routing strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Only handle GET requests and ignore chrome-extension / non-http(s) schemes
  if (request.method !== 'GET' || !request.url.startsWith('http')) {
    return;
  }

  const url = new URL(request.url);

  // Never intercept requests to the service worker itself
  if (url.pathname === '/sw.js') {
    return;
  }

  const isSameOrigin = url.origin === self.location.origin;

  // 1. Navigation requests (HTML pages): Network-first with cache fallback
  // Ensures user always gets the latest deployed version when online, but can play offline
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(async () => {
          // Fallback to cached index.html when offline
          const cachedResponse = await caches.match(request);
          if (cachedResponse) return cachedResponse;
          const fallbackIndex = await caches.match('/index.html');
          if (fallbackIndex) return fallbackIndex;
          const rootFallback = await caches.match('/');
          if (rootFallback) return rootFallback;
          return new Response('Offline - Bubble Math shell not yet cached', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: { 'Content-Type': 'text/plain' },
          });
        })
    );
    return;
  }

  // 2. Same-origin static assets (/assets/, /icons/, /screenshots/, fonts, etc.):
  // Stale-While-Revalidate strategy for ultra-fast load + background freshness
  if (isSameOrigin) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        const fetchPromise = fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const responseClone = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, responseClone);
              });
            }
            return networkResponse;
          })
          .catch((err) => {
            // Network failure is expected when offline
            return null;
          });

        return cachedResponse || fetchPromise.then((response) => {
          if (response) return response;
          return new Response(null, { status: 404 });
        });
      })
    );
    return;
  }

  // 3. Third-party fonts (Google Fonts / gstatic): Cache-first with network fallback
  if (url.hostname.includes('fonts.googleapis.com') || url.hostname.includes('fonts.gstatic.com')) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) return cachedResponse;
        return fetch(request)
          .then((networkResponse) => {
            if (networkResponse && (networkResponse.status === 200 || networkResponse.type === 'opaque')) {
              const responseClone = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, responseClone);
              });
            }
            return networkResponse;
          })
          .catch(() => {
            return new Response('', { status: 408, headers: { 'Content-Type': 'text/css' } });
          });
      })
    );
    return;
  }

  // Default network pass-through for any other requests
  event.respondWith(fetch(request));
});

// Support manual skipWaiting trigger from clients
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
