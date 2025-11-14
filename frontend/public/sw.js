const CACHE_NAME = 'biblenotes-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  // We can't know the exact names of the JS and CSS files because Vite hashes them.
  // A more advanced setup would use a tool like `vite-plugin-pwa` to generate this list.
  // For now, we will cache the main entry points. The browser will cache the rest.
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Clone the request because it's a one-time-use stream
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          response => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response because it's also a one-time-use stream
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
    );
});

// This is a basic cache-first strategy.
// A more advanced strategy would be needed for API calls (e.g., network-first).
