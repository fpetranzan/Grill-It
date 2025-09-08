// Simple Service Worker for caching static assets
const CACHE_NAME = 'grill-it-landing-v1';
const urlsToCache = [
    '/',
    '/style.css',
    '/script.js',
    '/img/grill_it.svg',
    '/img/home.jpg',
    '/img/home_filter.jpg',
    '/img/location_details.jpg',
    '/img/favorites.jpg',
    '/img/report_form.jpg'
];

// Install event - cache resources
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                return cache.addAll(urlsToCache);
            })
    );
});

// Fetch event - serve cached resources
self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                // Return cached resource if available, otherwise fetch from network
                if (response) {
                    return response;
                }
                return fetch(event.request);
            }
        )
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});