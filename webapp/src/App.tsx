import React, {
  Suspense,
  lazy,
  startTransition,
  useEffect,
  useMemo,
  useState,
} from "react";

import AppHeader from "./components/AppHeader";
import BottomNavbar from "./components/BottomNavbar";
import MenuPage from "./pages/MenuPage";

import { client } from "./api/client";
import {
  initTelegramApp,
  hapticFeedback,
  configureBackButton,
} from "./telegram/telegram";
import { useToast } from "./components/ToastProvider";

const loadCartPage = () => import("./pages/CartPage");
const loadCheckoutPage = () => import("./pages/CheckoutPage");
const loadSuccessPage = () => import("./pages/SuccessPage");
const loadOrdersPage = () => import("./pages/OrdersPage");
const loadProfilePage = () => import("./pages/ProfilePage");
const loadProductDetails = () => import("./components/ProductDetailsModal");
const loadNotificationModal = () => import("./components/NotificationModal");

const CartPage = lazy(loadCartPage);
const CheckoutPage = lazy(loadCheckoutPage);
const SuccessPage = lazy(loadSuccessPage);
const OrdersPage = lazy(loadOrdersPage);
const ProfilePage = lazy(loadProfilePage);
const ProductDetailsModal = lazy(loadProductDetails);
const NotificationModal = lazy(loadNotificationModal);

const CART_STORAGE_KEY = "damirchi_cart_v1";
const ORDER_TYPE_STORAGE_KEY = "damirchi_order_type_v1";
const ORDER_HISTORY_STORAGE_KEY = "damirchi_order_history_v1";

const DEFAULT_RESTAURANT_SETTINGS = {
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

const INITIAL_MENU = client.getCachedMenu();
const INITIAL_SETTINGS = client.getCachedSettings();

function readStorage(key: string, fallback: any) {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function loadStoredOrderHistory() {
  const parsed = readStorage(ORDER_HISTORY_STORAGE_KEY, []);
  return Array.isArray(parsed) ? parsed : [];
}

function saveStoredOrderHistory(orders: any[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(ORDER_HISTORY_STORAGE_KEY, JSON.stringify(orders));
  } catch {}
}

function loadStoredOrderType() {
  if (typeof window === "undefined") return "delivery";
  try {
    return window.localStorage.getItem(ORDER_TYPE_STORAGE_KEY) === "pickup"
      ? "pickup"
      : "delivery";
  } catch {
    return "delivery";
  }
}

function saveStoredOrderType(orderType: string) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(ORDER_TYPE_STORAGE_KEY, orderType);
  } catch {}
}

function loadStoredCart() {
  return readStorage(CART_STORAGE_KEY, {});
}

function saveStoredCart(cart: any) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch {}
}

function clearStoredCart() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(CART_STORAGE_KEY);
  } catch {}
}

function ScreenFallback() {
  return (
    <div className="px-4 py-5" aria-hidden="true">
      <div className="h-24 animate-pulse rounded-[22px] bg-white/75" />
      <div className="mt-3 h-40 animate-pulse rounded-[22px] bg-white/60" />
    </div>
  );
}

function smoothTop() {
  if (typeof window === "undefined") return;
  requestAnimationFrame(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

export default function App() {
  const { showToast } = useToast();
  const [currentScreen, setCurrentScreen] = useState("menu");

  const [categories, setCategories] = useState<any[]>(
    () => INITIAL_MENU?.categories || []
  );
  const [products, setProducts] = useState<any[]>(
    () => INITIAL_MENU?.products || []
  );
  const [restaurantSettings, setRestaurantSettings] = useState(
    () => INITIAL_SETTINGS || DEFAULT_RESTAURANT_SETTINGS
  );
  const [isLoading, setIsLoading] = useState(!INITIAL_MENU);
  const [error, setError] = useState<string | null>(null);

  const [cart, setCart] = useState<any>(() => loadStoredCart());
  const [activeCategoryId, setActiveCategoryId] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [completedOrderDetails, setCompletedOrderDetails] = useState<any>(null);
  const [orderHistory, setOrderHistory] = useState<any[]>(() =>
    loadStoredOrderHistory()
  );
  const [orderType, setOrderType] = useState(() => loadStoredOrderType());
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([
    {
      id: "welcome",
      type: "info",
      title: "Damirchiga xush kelibsiz",
      message: "Buyurtma statuslari va muhim xabarlar shu yerda ko‘rinadi.",
      time: "Hozir",
      read: false,
    },
  ]);

  useEffect(() => {
    initTelegramApp();
    fetchInitialMenu();

    const idle = window.requestIdleCallback || ((callback: any) => window.setTimeout(callback, 1800));
    const idleId = idle(() => {
      loadCartPage();
      loadOrdersPage();
      loadProfilePage();
      loadProductDetails();
      loadNotificationModal();
    });

    return () => {
      if (window.cancelIdleCallback && typeof idleId === "number") {
        window.cancelIdleCallback(idleId);
      }
    };
  }, []);

  useEffect(() => saveStoredCart(cart), [cart]);
  useEffect(() => saveStoredOrderHistory(orderHistory), [orderHistory]);
  useEffect(() => saveStoredOrderType(orderType), [orderType]);

  const fetchInitialMenu = async () => {
    const hasCachedMenu = categories.length > 0 || products.length > 0;
    if (!hasCachedMenu) setIsLoading(true);
    setError(null);

    client.getSettings().then((settings) => {
      setRestaurantSettings(settings || DEFAULT_RESTAURANT_SETTINGS);
    });

    try {
      const menu = await client.getMenu();
      startTransition(() => {
        setCategories(menu.categories || []);
        setProducts(menu.products || []);
      });
    } catch (err) {
      console.error("Menu fetch exception:", err);
      if (!hasCachedMenu) {
        setError(
          "Damirchi menyusini yuklashda xatolik yuz berdi. Iltimos, qayta urinib ko‘ring."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const navigate = (screen: string) => {
    setCurrentScreen(screen);
    smoothTop();
  };

  const handleGoHome = () => {
    clearStoredCart();
    setCart({});
    setCompletedOrderDetails(null);
    navigate("menu");
  };

  const handleGoBack = () => {
    if (currentScreen === "cart") return navigate("menu");
    if (currentScreen === "checkout") return navigate("cart");
    if (currentScreen === "orders" || currentScreen === "profile") return navigate("menu");
    if (currentScreen === "success") handleGoHome();
  };

  useEffect(() => {
    const shouldShowBackButton = currentScreen !== "menu";
    return configureBackButton(shouldShowBackButton, handleGoBack);
  }, [currentScreen]);

  const addToCart = (product: any) => {
    hapticFeedback("light");
    setCart((prev: any) => ({
      ...prev,
      [product.id]: {
        product,
        quantity: (prev[product.id]?.quantity || 0) + 1,
      },
    }));
  };

  const increaseQuantity = (productId: any) => {
    hapticFeedback("light");
    setCart((prev: any) => {
      if (!prev[productId]) return prev;
      return {
        ...prev,
        [productId]: {
          ...prev[productId],
          quantity: prev[productId].quantity + 1,
        },
      };
    });
  };

  const decreaseQuantity = (productId: any) => {
    hapticFeedback("light");
    setCart((prev: any) => {
      if (!prev[productId]) return prev;
      const currentQty = prev[productId].quantity;
      if (currentQty <= 1) {
        const copy = { ...prev };
        delete copy[productId];
        return copy;
      }
      return {
        ...prev,
        [productId]: { ...prev[productId], quantity: currentQty - 1 },
      };
    });
  };

  const removeFromCart = (productId: any) => {
    hapticFeedback("medium");
    setCart((prev: any) => {
      const copy = { ...prev };
      delete copy[productId];
      return copy;
    });
    showToast("Mahsulot savatdan olib tashlandi.", "info");
  };

  const clearCart = () => {
    hapticFeedback("medium");
    clearStoredCart();
    setCart({});
    showToast("Savat tozalandi.", "info");
  };

  const handleUpdateProductQuantity = (product: any, quantity: number) => {
    if (quantity <= 0) return removeFromCart(product.id);
    hapticFeedback("light");
    setCart((prev: any) => ({
      ...prev,
      [product.id]: { product, quantity },
    }));
  };

  const handleSubmitOrder = async (orderPayload: any) => {
    setSubmittingOrder(true);
    try {
      const response = await client.createOrder(orderPayload);
      const currentCartItems = Object.values(cart).map((item: any) => ({
        product_id: item.product.id,
        name_uz: item.product.name_uz,
        price: Number(item.product.price || 0),
        quantity: Number(item.quantity || 0),
      }));
      const subtotal = currentCartItems.reduce(
        (total: number, item: any) => total + item.price * item.quantity,
        0
      );
      const localOrder = {
        ...response,
        id: response?.id ?? Date.now(),
        status: response?.status ?? "new",
        created_at: response?.created_at ?? new Date().toISOString(),
        order_type: response?.order_type ?? orderPayload.order_type,
        payment_type: response?.payment_type ?? orderPayload.payment_type,
        phone: response?.phone ?? orderPayload.phone,
        address: response?.address ?? orderPayload.address,
        delivery_price: response?.delivery_price ?? Number(orderPayload.delivery_price || 0),
        total_price: response?.total_price ?? subtotal + Number(orderPayload.delivery_price || 0),
        items:
          Array.isArray(response?.items) && response.items.length > 0
            ? response.items
            : currentCartItems,
      };
      setOrderHistory((previousOrders) => [
        localOrder,
        ...previousOrders.filter((order) => String(order?.id) !== String(localOrder.id)),
      ].slice(0, 50));
      hapticFeedback("success");
      showToast("Buyurtma qabul qilindi ✅", "success");
      setNotifications((prev) => [
        {
          id: `order-${Date.now()}`,
          type: "order",
          title: "Buyurtma qabul qilindi",
          message: "Buyurtmangiz operatorga yuborildi. Status o‘zgarsa, sizga xabar beramiz.",
          time: "Hozir",
          read: false,
        },
        ...prev,
      ]);
      setCompletedOrderDetails(response);
      clearStoredCart();
      setCart({});
      navigate("success");
    } catch (err: any) {
      console.error("Order submission failure:", err);
      hapticFeedback("error");
      showToast(
        err?.message || "Buyurtmani yuborishda xatolik yuz berdi. Iltimos, qayta urinib ko‘ring.",
        "error"
      );
    } finally {
      setSubmittingOrder(false);
    }
  };

  const totalCartCount = useMemo(
    () => Object.values(cart).reduce((sum: number, item: any) => sum + item.quantity, 0),
    [cart]
  );
  const unreadNotificationCount = useMemo(
    () => notifications.filter((notification) => !notification.read).length,
    [notifications]
  );

  const handleOpenNotifications = () => {
    hapticFeedback("light");
    setIsNotificationModalOpen(true);
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })));
  };

  const handleBottomNavigate = (screen: string) => {
    if (screen === currentScreen) {
      smoothTop();
      return;
    }
    navigate(screen);
  };

  return (
    <div className="app-viewport flex min-h-[100dvh] w-full justify-center overflow-x-hidden bg-[#F7F3EB] text-[#221816] select-none">
      <div className="relative flex min-h-[100dvh] w-full max-w-[480px] flex-col bg-[#F7F3EB]">
        <AppHeader
          cartCount={totalCartCount}
          notificationCount={unreadNotificationCount}
          onNotificationClick={handleOpenNotifications}
          currentScreen={currentScreen}
          onBackClick={handleGoBack}
          settings={restaurantSettings}
        />

        <main className="w-full flex-1 pb-[92px]">
          {currentScreen === "menu" && (
            error && categories.length === 0 && !isLoading ? (
              <div className="mx-4 mt-6 rounded-[22px] border border-red-100 bg-white p-5 text-center">
                <p className="text-sm font-bold text-[#776B60]">{error}</p>
                <button
                  type="button"
                  onClick={fetchInitialMenu}
                  className="mt-4 rounded-[15px] bg-[#C89438] px-4 py-2.5 text-sm font-black text-white"
                >
                  Qayta urinish
                </button>
              </div>
            ) : (
              <MenuPage
                products={products}
                categories={categories}
                cart={cart}
                activeCategoryId={activeCategoryId}
                setActiveCategoryId={setActiveCategoryId}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onAddToCart={addToCart}
                onIncreaseQuantity={increaseQuantity}
                onDecreaseQuantity={decreaseQuantity}
                onOpenDetails={setSelectedProduct}
                settings={restaurantSettings}
                orderType={orderType}
                onOrderTypeChange={setOrderType}
                isLoading={isLoading}
              />
            )
          )}

          <Suspense fallback={<ScreenFallback />}>
            {currentScreen === "cart" && (
              <CartPage
                cart={cart}
                onIncreaseQuantity={increaseQuantity}
                onDecreaseQuantity={decreaseQuantity}
                onRemoveFromCart={removeFromCart}
                onClearCart={clearCart}
                onGoToMenu={() => navigate("menu")}
                onProceedToCheckout={() => {
                  loadCheckoutPage();
                  navigate("checkout");
                }}
                settings={restaurantSettings}
                orderType={orderType}
              />
            )}
            {currentScreen === "orders" && (
              <OrdersPage orders={orderHistory} onGoToMenu={() => navigate("menu")} />
            )}
            {currentScreen === "profile" && (
              <ProfilePage
                settings={restaurantSettings}
                orderType={orderType}
                orderCount={orderHistory.length}
                onGoToOrders={() => navigate("orders")}
              />
            )}
            {currentScreen === "checkout" && (
              <CheckoutPage
                cart={cart}
                onSubmitOrder={handleSubmitOrder}
                isSubmitting={submittingOrder}
                settings={restaurantSettings}
                orderType={orderType}
                onOrderTypeChange={setOrderType}
                initialOrderType={orderType}
              />
            )}
            {currentScreen === "success" && (
              <SuccessPage orderDetails={completedOrderDetails} onGoHome={handleGoHome} />
            )}
            {selectedProduct && (
              <ProductDetailsModal
                product={selectedProduct}
                currentQuantity={cart[selectedProduct.id]?.quantity || 0}
                onClose={() => setSelectedProduct(null)}
                onUpdateQuantity={handleUpdateProductQuantity}
              />
            )}
            {isNotificationModalOpen && (
              <NotificationModal
                isOpen={isNotificationModalOpen}
                onClose={() => setIsNotificationModalOpen(false)}
                notifications={notifications}
              />
            )}
          </Suspense>
        </main>

        {currentScreen !== "checkout" && currentScreen !== "success" && (
          <BottomNavbar
            active={
              currentScreen === "cart"
                ? "cart"
                : currentScreen === "orders"
                  ? "orders"
                  : currentScreen === "profile"
                    ? "profile"
                    : "menu"
            }
            cartCount={totalCartCount}
            onNavigate={handleBottomNavigate}
          />
        )}
      </div>
    </div>
  );
}
