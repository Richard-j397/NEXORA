const CACHE_NAME = "nexora-v1";

const FILES_TO_CACHE = [
  "./",
  "./public.html",
  "./public.css",
  "./public.js",
  "./admin.html",
  "./admin.css",
  "./admin.js",
  "./client.html",
  "./client.css",
  "./client.js",
  "./partenaire.html",
  "./partenaire.css",
  "./partenaire.js",
  "./manifest.json"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      cache.addAll(FILES_TO_CACHE)
    )
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  if (url.origin !== self.location.origin) return;

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) =>
              cache.put(event.request, copy)
            );
          }
          return response;
        })
        .catch(async () => {
          return (
            (await caches.match(event.request)) ||
            (await caches.match("./public.html"))
          );
        })
    );
  } else {
    event.respondWith(
      caches.match(event.request).then(
        (cached) => cached || fetch(event.request)
      )
    );
  }
});
