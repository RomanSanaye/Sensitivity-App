const CACHE_NAME = "pubg-sensitivity-v1";

const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/app.js",
  "/data.js",
  "/style.css",
  "/manifest.json",
  "/icons/launchericon-192x192.png",
  "/icons/launchericon-512x512.png"
];

// =====================
// INSTALL (SAFE VERSION)
// =====================
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.all(
        FILES_TO_CACHE.map((file) =>
          cache.add(file).catch((err) => {
            console.log("Cache failed:", file, err);
          })
        )
      );
    })
  );

  self.skipWaiting();
});

// =====================
// ACTIVATE (CLEAN OLD CACHE)
// =====================
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );

  self.clients.claim();
});

// =====================
// FETCH (OFFLINE-FIRST SAFE)
// =====================
self.addEventListener("fetch", (event) => {
  if (!event.request.url.startsWith(self.location.origin)) return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();

            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(() => cached);

      return (
        cached ||
        fetchPromise ||
        new Response("Offline mode active", {
          status: 200,
          headers: { "Content-Type": "text/plain" }
        })
      );
    })
  );
});