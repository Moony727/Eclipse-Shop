// Service Worker for Eclipse Shop
// Handles offline functionality and caching strategies
// Safe: no inline scripts, CSP-compliant

const CACHE_NAME = 'eclipse-shop-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.svg',
];

// Install event: cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .catch(() => {
        // Gracefully handle cache failures
        console.warn('Failed to cache static assets');
      })
  );
  self.skipWaiting();
});

// Activate event: clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
          return Promise.resolve();
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event: serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  const url = new URL(event.request.url);

  // Skip intercepting requests to Google domains to avoid CSP issues
  if (url.hostname === 'www.google.com' || url.hostname === 'apis.google.com' || url.hostname === 'www.gstatic.com' || url.hostname === 'recaptcha.google.com' || url.hostname === 'challenge.cloudflare.com') {
    return;
  }

  event.respondWith(
    caches
      .match(event.request)
      .then((response) => {
        // Return cached response if available
        if (response) {
          return response;
        }

        // Otherwise fetch from network
        return fetch(event.request)
          .then((networkResponse) => {
            // Cache successful responses from supported schemes (http/https only)
            const url = new URL(event.request.url);
            const isSupportedScheme = url.protocol === 'http:' || url.protocol === 'https:';
            
            // Don't cache external resources like Cloudinary images
            const isExternalResource = !url.hostname.includes(new URL(self.location).hostname) && 
                                       url.hostname !== 'res.cloudinary.com';
            
            if (networkResponse && networkResponse.status === 200 && isSupportedScheme && !isExternalResource) {
              const responseToCache = networkResponse.clone();
              caches
                .open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, responseToCache);
                })
                .catch((err) => {
                  console.warn('Failed to cache response:', err);
                });
            }
            return networkResponse;
          })
          .catch(() => {
            // Offline fallback: return a basic offline page if available
            return caches.match('/');
          });
      })
  );
});
