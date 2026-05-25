/**
 * Damirchi BOBO Django REST API Client
 * Real API first. Mock data is available only when VITE_USE_MOCK_DATA=true.
 */

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000";
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === "true";

const FALLBACK_IMAGES = {
  category_shashlik: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=900&auto=format&fit=crop&q=85",
  category_somsa: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=900&auto=format&fit=crop&q=85",
  category_osh: "https://images.unsplash.com/photo-1604152135912-04a022e23696?w=900&auto=format&fit=crop&q=85",
  category_soup: "https://images.unsplash.com/photo-1547592180-85f173990554?w=900&auto=format&fit=crop&q=85",
  category_drink: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=900&auto=format&fit=crop&q=85",
  shashlik_beef: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=900&auto=format&fit=crop&q=85",
  shashlik_chicken: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=900&auto=format&fit=crop&q=85",
  qozon_kabob: "https://images.unsplash.com/photo-1544025162-d76694265947?w=900&auto=format&fit=crop&q=85",
  osh: "https://images.unsplash.com/photo-1604152135912-04a022e23696?w=900&auto=format&fit=crop&q=85",
  somsa: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=900&auto=format&fit=crop&q=85",
  lagmon: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=900&auto=format&fit=crop&q=85",
  non: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=900&auto=format&fit=crop&q=85",
  tea_green: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=900&auto=format&fit=crop&q=85",
  paxlava: "https://images.unsplash.com/photo-1519676867240-f03562e64548?w=900&auto=format&fit=crop&q=85",
  default_food: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=900&auto=format&fit=crop&q=85"
};

const MOCK_CATEGORIES = [
  { id: 1, name_uz: "Shashliklar", name_ru: "Шашлыки", image: FALLBACK_IMAGES.category_shashlik, sort_order: 1 },
  { id: 2, name_uz: "Quyuq taomlar", name_ru: "Вторые блюда", image: FALLBACK_IMAGES.category_osh, sort_order: 2 },
  { id: 3, name_uz: "Suyuq taomlar", name_ru: "Супы", image: FALLBACK_IMAGES.category_soup, sort_order: 3 },
  { id: 4, name_uz: "Somsa & nonlar", name_ru: "Самса и хлеб", image: FALLBACK_IMAGES.category_somsa, sort_order: 4 },
  { id: 5, name_uz: "Ichimliklar", name_ru: "Напитки", image: FALLBACK_IMAGES.category_drink, sort_order: 5 }
];

const MOCK_PRODUCTS = [
  {
    id: 1,
    category: 1,
    category_name: "Shashliklar",
    name_uz: "Mol go‘shti shashlik",
    name_ru: "Шашлык из говядины",
    description_uz: "Sershira mol go‘shti, piyoz va Damirchi BOBO maxsus ziravorlari bilan pishirilgan premium shashlik.",
    price: 35000,
    image: FALLBACK_IMAGES.shashlik_beef,
    is_available: true,
    sort_order: 1
  },
  {
    id: 2,
    category: 1,
    category_name: "Shashliklar",
    name_uz: "Tovuq shashlik",
    description_uz: "Maxsus marinadda yumshatilgan tovuq go‘shti, ko‘mirda shirador qilib pishiriladi.",
    price: 28000,
    image: FALLBACK_IMAGES.shashlik_chicken,
    is_available: true,
    sort_order: 2
  },
  {
    id: 3,
    category: 2,
    category_name: "Quyuq taomlar",
    name_uz: "Haqiqiy Toshkent palovi",
    description_uz: "Sarxil go‘sht, sariq sabzi, no‘xat va zira ifori bilan damlangan bayramona palov.",
    price: 40000,
    image: FALLBACK_IMAGES.osh,
    is_available: true,
    sort_order: 1
  },
  {
    id: 4,
    category: 2,
    category_name: "Quyuq taomlar",
    name_uz: "Qozon kabob",
    description_uz: "Lahm go‘sht va tillarang kartoshka qozonda dimlanib, xushbo‘y ziravorlar bilan tortiladi.",
    price: 55000,
    image: FALLBACK_IMAGES.qozon_kabob,
    is_available: true,
    sort_order: 2
  },
  {
    id: 5,
    category: 3,
    category_name: "Suyuq taomlar",
    name_uz: "Uyg‘ur lag‘moni",
    description_uz: "Qo‘lda cho‘zilgan xamir, qovurilgan mol go‘shti va sharqona sabzavotlar bilan.",
    price: 38000,
    image: FALLBACK_IMAGES.lagmon,
    is_available: true,
    sort_order: 1
  },
  {
    id: 6,
    category: 4,
    category_name: "Somsa & nonlar",
    name_uz: "Gijduvon tandir somsasi",
    description_uz: "Lahm go‘sht, piyoz va dumba yog‘i bilan tandirda qarsildoq qilib pishiriladi.",
    price: 18000,
    image: FALLBACK_IMAGES.somsa,
    is_available: true,
    sort_order: 1
  },
  {
    id: 7,
    category: 5,
    category_name: "Ichimliklar",
    name_uz: "Ko‘k choy novvot bilan",
    description_uz: "Choynakda damlangan ko‘k choy, novvot va limon bilan.",
    price: 8000,
    image: FALLBACK_IMAGES.tea_green,
    is_available: true,
    sort_order: 1
  }
];


const DEFAULT_SETTINGS = {
  restaurant_name: "Damirchi BOBO",
  tagline: "Mazali taomlar, tezkor buyurtma",
  phone: "+998 XX XXX XX XX",
  address: "Toshkent, Sergeli",
  delivery_price: 15000,
  min_order_amount: 0,
  is_open: true,
  open_time: null,
  close_time: null,
  instagram_url: null,
  telegram_url: null
};

function normalizeListResponse(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.results)) return data.results;
  return [];
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
  const data = contentType.includes("application/json") ? await response.json() : null;

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
  async getSettings() {
    try {
      const data = await request("/settings/");
      return { ...DEFAULT_SETTINGS, ...(data || {}) };
    } catch (error) {
      if (USE_MOCK_DATA) return DEFAULT_SETTINGS;
      console.warn("Restaurant settings endpoint not available, using safe defaults:", error);
      return DEFAULT_SETTINGS;
    }
  },

  async getCategories() {
    try {
      const data = await request("/categories/");
      const list = normalizeListResponse(data).sort((a, b) => (a.sort_order ?? 999) - (b.sort_order ?? 999));
      if (list.length > 0) return list;
      if (USE_MOCK_DATA) return MOCK_CATEGORIES;
      return [];
    } catch (error) {
      if (USE_MOCK_DATA) return MOCK_CATEGORIES;
      throw new Error("Kategoriyalarni yuklab bo‘lmadi. Backend ishlayotganini tekshiring.");
    }
  },

  async getProducts() {
    try {
      const data = await request("/products/");
      const list = normalizeListResponse(data).sort((a, b) => (a.sort_order ?? 999) - (b.sort_order ?? 999));
      if (list.length > 0) return list;
      if (USE_MOCK_DATA) return MOCK_PRODUCTS;
      return [];
    } catch (error) {
      if (USE_MOCK_DATA) return MOCK_PRODUCTS;
      throw new Error("Menyuni yuklab bo‘lmadi. Backend API manzilini tekshiring.");
    }
  },

  async createOrder(payload) {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 800));
      return {
        id: Math.floor(100000 + Math.random() * 900000),
        status: "new",
        total_price: payload.__total_price || 0,
        payment_type: payload.payment_type,
        created_at: new Date().toISOString()
      };
    }

    const cleanPayload = { ...payload };
    delete cleanPayload.__total_price;

    const initData = cleanPayload.telegram_init_data || "";

    return request("/orders/", {
      method: "POST",
      headers: initData ? { "X-Telegram-Init-Data": initData } : {},
      body: JSON.stringify(cleanPayload)
    });
  },

  getImageUrl(path) {
    if (!path) return FALLBACK_IMAGES.default_food;
    if (path.startsWith("http://") || path.startsWith("https://")) return path;

    const cleanBase = BACKEND_URL.endsWith("/") ? BACKEND_URL.slice(0, -1) : BACKEND_URL;
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${cleanBase}${cleanPath}`;
  }
};
