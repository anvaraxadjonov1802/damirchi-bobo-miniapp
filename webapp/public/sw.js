const IMAGE_CACHE = "damirchi-imgbb-images-v3";
const IMAGE_HOSTS = new Set(["i.ibb.co"]);
const PRODUCTS_API = "https://damirchi-bobo-api.onrender.com/api/products/";

let prewarmStarted = false;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function cacheImageUrl(cache, url) {
  if (!url) return;

  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return;
  }

  if (!IMAGE_HOSTS.has(parsed.hostname)) return;

  const request = new Request(url, {
    mode: "no-cors",
    credentials: "omit",
    cache: "force-cache",
  });

  const existing = await cache.match(request);
  if (existing) return;

  try {
    const response = await fetch(request);
    if (response.ok || response.type === "opaque") {
      await cache.put(request, response.clone());
    }
  } catch {
    // Background prewarm is best-effort only.
  }
}

async function prewarmMenuImages() {
  // Give above-the-fold eager images time to win the first network slots.
  await sleep(1400);

  let products;
  try {
    const response = await fetch(PRODUCTS_API, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    if (!response.ok) return;
    products = await response.json();
  } catch {
    return;
  }

  const list = Array.isArray(products) ? products : products?.results || [];
  const urls = [
    ...new Set(
      list
        .map((product) => product?.image)
        .filter((url) => typeof url === "string" && url.includes("i.ibb.co"))
    ),
  ];

  if (!urls.length) return;

  const cache = await caches.open(IMAGE_CACHE);

  // Small concurrency avoids fighting with the images currently visible.
  const workers = Array.from({ length: Math.min(3, urls.length) }, async (_, workerIndex) => {
    for (let index = workerIndex; index < urls.length; index += 3) {
      await cacheImageUrl(cache, urls[index]);
    }
  });

  await Promise.all(workers);
}

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter(
            (key) =>
              key.startsWith("damirchi-imgbb-images-") && key !== IMAGE_CACHE
          )
          .map((key) => caches.delete(key))
      );

      await self.clients.claim();
    })()
  );
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

  if (!prewarmStarted) {
    prewarmStarted = true;
    event.waitUntil(prewarmMenuImages());
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
