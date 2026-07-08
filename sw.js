// Service Worker for JARVIS AI Assistant
// Provides offline support and caching

const CACHE_NAME = 'jarvis-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/style.css',
    '/script.js',
];

// Install event - cache files
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(urlsToCache).catch(() => {
                // Cache may fail if offline during install, that's okay
                console.log('Partial cache installation completed');
            });
        })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    // Only cache GET requests
    if (event.request.method !== 'GET') {
        return;
    }

    event.respondWith(
        caches.match(event.request).then((response) => {
            // Return cached response if available
            if (response) {
                return response;
            }

            // Otherwise, fetch from network
            return fetch(event.request)
                .then((response) => {
                    // Don't cache if not a success response
                    if (!response || response.status !== 200 || response.type === 'error') {
                        return response;
                    }

                    // Cache successful responses
                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseToCache);
                    });

                    return response;
                })
                .catch(() => {
                    // Return cached response as fallback, or a generic offline page
                    return caches.match('/index.html');
                });
        })
    );
});
