const CACHE_NAME = 'taskturtle-v2';

// Only pre-cache truly static, public assets
const STATIC_ASSETS = [
    '/manifest.json',
    '/icons/icon-192.png',
    '/icons/icon-512.png',
];

// Install: pre-cache static assets only
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
    );
    self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
        )
    );
    self.clients.claim();
});

// Fetch: network-first for everything (safe for authenticated apps)
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET, cross-origin, and auth endpoints
    if (
        request.method !== 'GET' ||
        url.origin !== self.location.origin ||
        url.pathname.startsWith('/api/auth')
    ) {
        return;
    }

    // Network-first: try network, fall back to cache for offline support
    event.respondWith(
        fetch(request)
            .then((res) => {
                // Only cache successful, non-redirect responses
                if (res.ok && !res.redirected) {
                    const clone = res.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
                }
                return res;
            })
            .catch(() => caches.match(request))
    );
});
