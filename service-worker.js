// Radical Red Dex - Service Worker

const CACHE_VERSION = 'cache-v1';

// Static assets to cache
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/manifest.json'
];

// JSON data files to cache
const DATA_FILES = [
  '/data/species.json',
  '/data/moves.json',
  '/data/abilities.json',
  '/data/items.json',
  '/data/trainers.json',
  '/data/tmMoves.json',
  '/data/tutorMoves.json',
  '/data/types.json',
  '/data/areas.json',
  '/data/natures.json',
  '/data/eggGroups.json',
  '/data/splits.json',
  '/data/evolutions.json',
  '/data/scaledLevels.json',
  '/data/caps.json',
  '/data/sprites.json'
];

// All resources to cache
const CACHE_RESOURCES = [...STATIC_ASSETS, ...DATA_FILES];

// Install event - cache all resources
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then((cache) => {
        console.log('Service Worker: Caching files');
        return cache.addAll(CACHE_RESOURCES);
      })
      .then(() => {
        console.log('Service Worker: All files cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker: Cache failed', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_VERSION) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - cache-first strategy with network fallback
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        
        // Not in cache, try network
        return fetch(event.request)
          .then((networkResponse) => {
            // Optionally cache the new response
            if (networkResponse && networkResponse.status === 200) {
              const responseClone = networkResponse.clone();
              caches.open(CACHE_VERSION)
                .then((cache) => {
                  cache.put(event.request, responseClone);
                });
            }
            return networkResponse;
          })
          .catch((error) => {
            console.error('Service Worker: Fetch failed', error);
            throw error;
          });
      })
  );
});
