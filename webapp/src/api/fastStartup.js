const DEFAULT_BACKEND_URL = import.meta.env.PROD
  ? "https://damirchi-bobo-api.onrender.com"
  : "http://127.0.0.1:8000";

function normalizeApiUrl(value) {
  const clean = String(value || `${DEFAULT_BACKEND_URL}/api`).replace(/\/+$/, "");
  return clean.endsWith("/api") ? clean : `${clean}/api`;
}

const API_URL = normalizeApiUrl(import.meta.env.VITE_API_URL);
const MENU_CACHE_KEY = "damirchi_fast_menu_v1";
const SETTINGS_CACHE_KEY = "damirchi_fast_settings_v1";
const MAX_MENU_CACHE_AGE = 24 * 60 * 60 * 1000;

function readJson(key) {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeJson(key, value) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Embedded WebViews may restrict storage; startup still works without it.
  }
}

function readCachedMenu() {
  const cached = readJson(MENU_CACHE_KEY);
  if (!cached || !Array.isArray(cached.categories) || !Array.isArray(cached.products)) {
    return null;
  }

  const age = Date.now() - Number(cached.savedAt || 0);
  if (!Number.isFinite(age) || age > MAX_MENU_CACHE_AGE) return null;
  return cached;
}

async function fetchMenuBootstrap() {
  const response = await fetch(`${API_URL}/menu/`, {
    headers: { Accept: "application/json" },
    cache: "default",
  });

  if (!response.ok) {
    throw new Error(`Menu bootstrap failed: ${response.status}`);
  }

  const payload = await response.json();
  const menu = {
    categories: Array.isArray(payload?.categories) ? payload.categories : [],
    products: Array.isArray(payload?.products) ? payload.products : [],
    savedAt: Date.now(),
  };

  writeJson(MENU_CACHE_KEY, menu);
  return menu;
}

export function enableFastStartup(client) {
  if (!client || client.__fastStartupEnabled) return;
  client.__fastStartupEnabled = true;

  const originalGetCategories = client.getCategories.bind(client);
  const originalGetProducts = client.getProducts.bind(client);
  const originalGetSettings = client.getSettings.bind(client);

  const cachedMenu = readCachedMenu();
  let sharedMenuPromise = null;

  const getFreshMenu = () => {
    if (!sharedMenuPromise) {
      sharedMenuPromise = fetchMenuBootstrap().catch(async () => {
        // Compatibility fallback if backend deploy has not reached /api/menu/ yet.
        const [categories, products] = await Promise.all([
          originalGetCategories(),
          originalGetProducts(),
        ]);
        const fallback = { categories, products, savedAt: Date.now() };
        writeJson(MENU_CACHE_KEY, fallback);
        return fallback;
      });
    }
    return sharedMenuPromise;
  };

  if (cachedMenu) {
    // Refresh silently for the next launch; never block this launch on network.
    window.setTimeout(() => {
      getFreshMenu().catch(() => {});
    }, 700);
  }

  client.getCategories = async () => {
    if (cachedMenu) return cachedMenu.categories;
    return (await getFreshMenu()).categories;
  };

  client.getProducts = async () => {
    if (cachedMenu) return cachedMenu.products;
    return (await getFreshMenu()).products;
  };

  const cachedSettings = readJson(SETTINGS_CACHE_KEY);
  client.getSettings = async () => {
    if (cachedSettings?.value) {
      originalGetSettings()
        .then((value) => writeJson(SETTINGS_CACHE_KEY, { value, savedAt: Date.now() }))
        .catch(() => {});
      return cachedSettings.value;
    }

    // Settings must not keep the whole app on a fullscreen loader during a
    // Render cold start. Continue with App defaults after a short grace period.
    const settingsPromise = originalGetSettings()
      .then((value) => {
        writeJson(SETTINGS_CACHE_KEY, { value, savedAt: Date.now() });
        return value;
      })
      .catch(() => null);

    return Promise.race([
      settingsPromise,
      new Promise((resolve) => window.setTimeout(() => resolve(null), 650)),
    ]);
  };
}
