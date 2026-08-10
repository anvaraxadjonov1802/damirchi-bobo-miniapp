/** Damirchi Django REST API client optimized for instant Mini App startup. */

const DEFAULT_BACKEND_URL = import.meta.env.PROD
  ? "https://damirchi-bobo-api.onrender.com"
  : "http://127.0.0.1:8000";

function normalizeBackendUrl(value) {
  return String(value || DEFAULT_BACKEND_URL).replace(/\/+$/, "");
}

function normalizeApiUrl(value) {
  const clean = String(value || `${DEFAULT_BACKEND_URL}/api`).replace(/\/+$/, "");
  return clean.endsWith("/api") ? clean : `${clean}/api`;
}

const API_URL = normalizeApiUrl(import.meta.env.VITE_API_URL);
const BACKEND_URL = normalizeBackendUrl(
  import.meta.env.VITE_BACKEND_URL || API_URL.replace(/\/api$/, "")
);
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === "true";

const MENU_CACHE_KEY = "damirchi_fast_menu_v2";
const SETTINGS_CACHE_KEY = "damirchi_settings_v1";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=420&auto=format&fit=crop&q=70";

const DEFAULT_SETTINGS = {
  restaurant_name: "Damirchi",
  tagline: "Mazali taomlar, tezkor buyurtma",
  phone: "+998 XX XXX XX XX",
  address: "Toshkent, Sergeli",
  delivery_price: 15000,
  min_order_amount: 0,
  is_open: true,
  open_time: null,
  close_time: null,
  instagram_url: null,
  telegram_url: null,
};

const MOCK_MENU = {
  categories: [
    { id: 1, name_uz: "Shashliklar", sort_order: 1 },
    { id: 2, name_uz: "Asosiy taomlar", sort_order: 2 },
  ],
  products: [
    {
      id: 1,
      category: 1,
      category_name: "Shashliklar",
      name_uz: "Mol go‘shti shashlik",
      price: 35000,
      image: FALLBACK_IMAGE,
      is_available: true,
      sort_order: 1,
    },
  ],
};

function readStorage(key) {
  if (typeof window === "undefined") return null;
  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

function writeStorage(key, value) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Embedded browsers can restrict storage; network still works.
  }
}

function sortMenu(menu) {
  const categories = Array.isArray(menu?.categories) ? [...menu.categories] : [];
  const products = Array.isArray(menu?.products) ? [...menu.products] : [];

  categories.sort((a, b) => (a.sort_order ?? 999) - (b.sort_order ?? 999));
  products.sort((a, b) => (a.sort_order ?? 999) - (b.sort_order ?? 999));

  return { categories, products };
}

async function request(endpoint, options = {}) {
  const { headers: customHeaders = {}, ...restOptions } = options;
  const isNgrokApi = API_URL.includes("ngrok-free.app");

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...restOptions,
    headers: {
      Accept: "application/json",
      ...(restOptions.body ? { "Content-Type": "application/json" } : {}),
      ...(isNgrokApi ? { "ngrok-skip-browser-warning": "1" } : {}),
      ...customHeaders,
    },
  });

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : null;

  if (!response.ok) {
    const apiMessage =
      data?.detail ||
      data?.message ||
      data?.items ||
      data?.non_field_errors ||
      JSON.stringify(data || {});

    throw new Error(apiMessage || `API xatolik: ${response.status}`);
  }

  return data;
}

export const client = {
  getCachedMenu() {
    const cached = readStorage(MENU_CACHE_KEY);
    if (!cached) return null;

    const menu = sortMenu(cached);
    return menu.categories.length || menu.products.length ? menu : null;
  },

  getCachedSettings() {
    const cached = readStorage(SETTINGS_CACHE_KEY);
    return cached ? { ...DEFAULT_SETTINGS, ...cached } : DEFAULT_SETTINGS;
  },

  async getMenu() {
    if (USE_MOCK_DATA) return sortMenu(MOCK_MENU);

    const data = await request("/menu/", { cache: "default" });
    const menu = sortMenu(data);
    writeStorage(MENU_CACHE_KEY, menu);
    return menu;
  },

  async getSettings() {
    try {
      const data = await request("/settings/", { cache: "default" });
      const settings = { ...DEFAULT_SETTINGS, ...(data || {}) };
      writeStorage(SETTINGS_CACHE_KEY, settings);
      return settings;
    } catch (error) {
      console.warn("Settings refresh failed, cached/default settings are used:", error);
      return this.getCachedSettings();
    }
  },

  async getCategories() {
    return (await this.getMenu()).categories;
  },

  async getProducts() {
    return (await this.getMenu()).products;
  },

  async createOrder(payload) {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return {
        id: Math.floor(100000 + Math.random() * 900000),
        status: "new",
        total_price: payload.__total_price || 0,
        payment_type: payload.payment_type,
        created_at: new Date().toISOString(),
      };
    }

    const cleanPayload = { ...payload };
    delete cleanPayload.__total_price;

    const initData = cleanPayload.telegram_init_data || "";

    return request("/orders/", {
      method: "POST",
      headers: initData ? { "X-Telegram-Init-Data": initData } : {},
      body: JSON.stringify(cleanPayload),
    });
  },

  getImageUrl(path) {
    if (!path) return FALLBACK_IMAGE;
    if (path.startsWith("http://") || path.startsWith("https://")) return path;

    const cleanBase = BACKEND_URL.endsWith("/")
      ? BACKEND_URL.slice(0, -1)
      : BACKEND_URL;
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${cleanBase}${cleanPath}`;
  },
};
