const IMAGE_CACHE = "damirchi-imgbb-images-v1";
const IMAGE_HOSTS = new Set(["i.ibb.co"]);

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key.startsWith("damirchi-imgbb-images-") && key !== IMAGE_CACHE)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;

  if (request.method !== "GET" || request.destination !== "image") {
    return;
  }

  let url;
  try {
    url = new URL(request.url);
  } catch {
    return;
  }

  if (!IMAGE_HOSTS.has(url.hostname)) {
    return;
  }

  event.respondWith(
    caches.open(IMAGE_CACHE).then(async (cache) => {
      const cached = await cache.match(request);
      if (cached) {
        return cached;
      }

      const response = await fetch(request);

      if (response.ok || response.type === "opaque") {
        cache.put(request, response.clone()).catch(() => {});
      }

      return response;
    })
  );
});
