const CACHE_NAME = "ld-v1";
const PRECACHE_URLS = ["/", "/markets", "/offline"];

// Install — precache shell
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

// Activate — clean old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch — network first, fallback to cache for navigation
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  // Skip non-http(s) and API requests
  const url = new URL(event.request.url);
  if (!url.protocol.startsWith("http") || url.pathname.startsWith("/api/")) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache successful responses
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => {
        // Fallback to cache
        return caches.match(event.request).then((cached) => {
          if (cached) return cached;
          // For navigation requests, return offline page
          if (event.request.mode === "navigate") {
            return caches.match("/offline");
          }
          return new Response("Offline", { status: 503 });
        });
      })
  );
});
