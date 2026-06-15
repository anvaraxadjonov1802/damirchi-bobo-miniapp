import React, { useEffect, useMemo, useState } from "react";

import AppHeader from "./components/AppHeader";
import LoadingScreen from "./components/LoadingScreen";
import ErrorState from "./components/ErrorState";
import ProductDetailsModal from "./components/ProductDetailsModal";
import BottomNavbar from "./components/BottomNavbar";
import NotificationModal from "./components/NotificationModal";

import MenuPage from "./pages/MenuPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import SuccessPage from "./pages/SuccessPage";

import { client } from "./api/client";
import {
  initTelegramApp,
  hapticFeedback,
  configureBackButton,
} from "./telegram/telegram";
import { useToast } from "./components/ToastProvider";

const CART_STORAGE_KEY = "damirchi_cart_v1";

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

function loadStoredCart() {
  if (typeof window === "undefined") return {};

  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveStoredCart(cart: any) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch {
    // Storage can be unavailable in some embedded browsers.
  }
}

function clearStoredCart() {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.removeItem(CART_STORAGE_KEY);
  } catch {
    // Ignore storage cleanup errors.
  }
}

export default function App() {
  const { showToast } = useToast();

  const [currentScreen, setCurrentScreen] = useState("menu");

  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [restaurantSettings, setRestaurantSettings] = useState(
    DEFAULT_RESTAURANT_SETTINGS
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [cart, setCart] = useState<any>(() => loadStoredCart());

  const [activeCategoryId, setActiveCategoryId] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [completedOrderDetails, setCompletedOrderDetails] = useState<any>(null);

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
  }, []);

  useEffect(() => {
    saveStoredCart(cart);
  }, [cart]);

  const fetchInitialMenu = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [cats, prods, settings] = await Promise.all([
        client.getCategories(),
        client.getProducts(),
        client.getSettings(),
      ]);

      setCategories(cats);
      setProducts(prods);
      setRestaurantSettings(settings || DEFAULT_RESTAURANT_SETTINGS);
    } catch (err) {
      console.error("Menu fetch exception:", err);
      setError(
        "Damirchi menyusini yuklashda xatolik yuz berdi. Iltimos, qayta urinib ko‘ring."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoHome = () => {
    clearStoredCart();
    setCart({});
    setCompletedOrderDetails(null);
    setCurrentScreen("menu");
  };

  const handleGoBack = () => {
    if (currentScreen === "cart") {
      setCurrentScreen("menu");
      return;
    }

    if (currentScreen === "checkout") {
      setCurrentScreen("cart");
      return;
    }

    if (currentScreen === "success") {
      handleGoHome();
    }
  };

  useEffect(() => {
    const shouldShowBackButton = currentScreen !== "menu";
    return configureBackButton(shouldShowBackButton, handleGoBack);
  }, [currentScreen]);

  const addToCart = (product: any) => {
    hapticFeedback("light");

    setCart((prev: any) => {
      if (prev[product.id]) {
        return {
          ...prev,
          [product.id]: {
            ...prev[product.id],
            quantity: prev[product.id].quantity + 1,
          },
        };
      }

      return {
        ...prev,
        [product.id]: { product, quantity: 1 },
      };
    });
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
        [productId]: {
          ...prev[productId],
          quantity: currentQty - 1,
        },
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
    if (quantity <= 0) {
      removeFromCart(product.id);
      return;
    }

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

      hapticFeedback("success");
      showToast("Buyurtma qabul qilindi ✅", "success");

      setNotifications((prev) => [
        {
          id: `order-${Date.now()}`,
          type: "order",
          title: "Buyurtma qabul qilindi",
          message:
            "Buyurtmangiz operatorga yuborildi. Status o‘zgarsa, sizga xabar beramiz.",
          time: "Hozir",
          read: false,
        },
        ...prev,
      ]);

      setCompletedOrderDetails(response);
      clearStoredCart();
      setCart({});
      setCurrentScreen("success");
    } catch (err: any) {
      console.error("Order submission failure:", err);

      hapticFeedback("error");
      showToast(
        err?.message ||
          "Buyurtmani yuborishda xatolik yuz berdi. Iltimos, qayta urinib ko‘ring.",
        "error"
      );
    } finally {
      setSubmittingOrder(false);
    }
  };

  const totalCartCount = useMemo(() => {
    return Object.values(cart).reduce(
      (sum: number, item: any) => sum + item.quantity,
      0
    );
  }, [cart]);

  const unreadNotificationCount = useMemo(() => {
    return notifications.filter((notification) => !notification.read).length;
  }, [notifications]);

  const handleOpenNotifications = () => {
    hapticFeedback("light");
    setIsNotificationModalOpen(true);

    setNotifications((prev) =>
      prev.map((notification) => ({
        ...notification,
        read: true,
      }))
    );
  };

  const handleBottomNavigate = (screen: string) => {
    if (screen === "menu") {
      setCurrentScreen("menu");
      return;
    }

    if (screen === "cart") {
      setCurrentScreen("cart");
      return;
    }

    if (screen === "orders") {
      showToast("Buyurtmalar bo‘limi tez orada qo‘shiladi.", "info");
      return;
    }

    if (screen === "profile") {
      showToast("Profil bo‘limi tez orada qo‘shiladi.", "info");
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error && categories.length === 0) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-[#F6F6F7] px-4">
        <ErrorState message={error} onRetry={fetchInitialMenu} />
      </div>
    );
  }

  return (
    <div className="flex min-h-[100dvh] w-full justify-center overflow-x-hidden bg-[#F6F6F7] text-[#221816] select-none">
      <div className="relative flex min-h-[100dvh] w-full max-w-[480px] flex-col bg-[#F6F6F7] shadow-sm">
        <AppHeader
          cartCount={totalCartCount}
          notificationCount={unreadNotificationCount}
          onNotificationClick={handleOpenNotifications}
          currentScreen={currentScreen}
          onBackClick={handleGoBack}
          settings={restaurantSettings}
        />

        <main className="w-full flex-1 pb-24">
          {currentScreen === "menu" && (
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
              onViewCart={() => setCurrentScreen("cart")}
              settings={restaurantSettings}
            />
          )}

          {currentScreen === "cart" && (
            <CartPage
              cart={cart}
              onIncreaseQuantity={increaseQuantity}
              onDecreaseQuantity={decreaseQuantity}
              onRemoveFromCart={removeFromCart}
              onClearCart={clearCart}
              onGoToMenu={() => setCurrentScreen("menu")}
              onProceedToCheckout={() => setCurrentScreen("checkout")}
              settings={restaurantSettings}
            />
          )}

          {currentScreen === "checkout" && (
            <CheckoutPage
              cart={cart}
              onSubmitOrder={handleSubmitOrder}
              isSubmitting={submittingOrder}
              onGoBack={handleGoBack}
              settings={restaurantSettings}
            />
          )}

          {currentScreen === "success" && (
            <SuccessPage
              orderDetails={completedOrderDetails}
              onGoHome={handleGoHome}
            />
          )}
        </main>

        {selectedProduct && (
          <ProductDetailsModal
            product={selectedProduct}
            currentQuantity={cart[selectedProduct.id]?.quantity || 0}
            onClose={() => setSelectedProduct(null)}
            onUpdateQuantity={handleUpdateProductQuantity}
          />
        )}

        <NotificationModal
          isOpen={isNotificationModalOpen}
          onClose={() => setIsNotificationModalOpen(false)}
          notifications={notifications}
        />

        {currentScreen !== "checkout" && currentScreen !== "success" && (
          <BottomNavbar
            active={currentScreen === "cart" ? "cart" : "menu"}
            cartCount={totalCartCount}
            onNavigate={handleBottomNavigate}
          />
        )}
      </div>
    </div>
  );
}