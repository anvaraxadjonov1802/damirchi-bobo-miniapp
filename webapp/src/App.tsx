import React, { useState, useEffect, useMemo } from 'react';
import AppHeader from './components/AppHeader';
import LoadingScreen from './components/LoadingScreen';
import ErrorState from './components/ErrorState';
import ProductDetailsModal from './components/ProductDetailsModal';

// Pages
import MenuPage from './pages/MenuPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import SuccessPage from './pages/SuccessPage';

// APIs & Telegram Integration
import { client } from './api/client';
import { initTelegramApp, hapticFeedback, showAlert, configureBackButton } from './telegram/telegram';

const CART_STORAGE_KEY = 'damirchi_bobo_cart_v1';

const DEFAULT_RESTAURANT_SETTINGS = {
  restaurant_name: 'Damirchi BOBO',
  tagline: 'Mazali taomlar, tezkor buyurtma',
  phone: '+998 XX XXX XX XX',
  address: 'Toshkent, Sergeli',
  delivery_price: 15000,
  min_order_amount: 0,
  is_open: true,
  open_time: null,
  close_time: null,
  instagram_url: null,
  telegram_url: null
};

function loadStoredCart() {
  if (typeof window === 'undefined') return {};

  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (error) {
    return {};
  }
}

function saveStoredCart(cart) {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (error) {
    // Storage can be unavailable in some embedded browsers; cart still works in memory.
  }
}

function clearStoredCart() {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.removeItem(CART_STORAGE_KEY);
  } catch (error) {
    // Ignore storage cleanup errors.
  }
}

export default function App() {
  // Screen Router state: 'menu' | 'cart' | 'checkout' | 'success'
  const [currentScreen, setCurrentScreen] = useState('menu');
  
  // Data State API
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [restaurantSettings, setRestaurantSettings] = useState(DEFAULT_RESTAURANT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cart State: { [productId]: { product, quantity } }
  const [cart, setCart] = useState<any>(() => loadStoredCart());

  // Menu Search & Filter variables
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal selection
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Completed successful order detail holder
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [completedOrderDetails, setCompletedOrderDetails] = useState(null);

  // Initial Bootup Sequence
  useEffect(() => {
    initTelegramApp();
    fetchInitialMenu();
  }, []);

  const fetchInitialMenu = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [cats, prods, settings] = await Promise.all([
        client.getCategories(),
        client.getProducts(),
        client.getSettings()
      ]);
      setCategories(cats);
      setProducts(prods);
      setRestaurantSettings(settings || DEFAULT_RESTAURANT_SETTINGS);
    } catch (err) {
      console.error("Menu fetch exception:", err);
      setError("Damirchi BOBO menyusini yuklashda xatolik yuz berdi. Iltimos, qayta urinib ko‘ring.");
    } finally {
      setIsLoading(false);
    }
  };

  // Cart Operations
  const addToCart = (product) => {
    setCart(prev => {
      if (prev[product.id]) {
        return {
          ...prev,
          [product.id]: {
            ...prev[product.id],
            quantity: prev[product.id].quantity + 1
          }
        };
      }
      return {
        ...prev,
        [product.id]: { product, quantity: 1 }
      };
    });
  };

  const increaseQuantity = (productId) => {
    setCart(prev => {
      if (!prev[productId]) return prev;
      return {
        ...prev,
        [productId]: {
          ...prev[productId],
          quantity: prev[productId].quantity + 1
        }
      };
    });
  };

  const decreaseQuantity = (productId) => {
    setCart(prev => {
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
          quantity: currentQty - 1
        }
      };
    });
  };

  const removeFromCart = (productId) => {
    setCart(prev => {
      const copy = { ...prev };
      delete copy[productId];
      return copy;
    });
  };

  const clearCart = () => {
    clearStoredCart();
    setCart({});
  };

  const handleUpdateProductQuantity = (product, quantity) => {
    if (quantity <= 0) {
      removeFromCart(product.id);
    } else {
      setCart(prev => ({
        ...prev,
        [product.id]: { product, quantity }
      }));
    }
  };

  // Safe Back Button controller for Telegram / UI Headers
  const handleGoBack = () => {
    if (currentScreen === 'cart') {
      setCurrentScreen('menu');
    } else if (currentScreen === 'checkout') {
      setCurrentScreen('cart');
    } else if (currentScreen === 'success') {
      handleGoHome();
    }
  };

  const handleGoHome = () => {
    clearStoredCart();
    setCart({});
    setCompletedOrderDetails(null);
    setCurrentScreen('menu');
  };

  // Order Submission Orchestration
  const handleSubmitOrder = async (orderPayload) => {
    setSubmittingOrder(true);
    try {
      const response = await client.createOrder(orderPayload);
      hapticFeedback('success');
      
      // Save completed results, clear form / cart, route to success
      setCompletedOrderDetails(response);
      clearStoredCart();
      setCart({});
      setCurrentScreen('success');
    } catch (err) {
      console.error("Order submission failure:", err);
      hapticFeedback('error');
      showAlert(err?.message || "Buyurtmani yuborishda xatolik yuz berdi. Iltimos, qayta urinib ko‘ring.");
    } finally {
      setSubmittingOrder(false);
    }
  };

  // Calculate cart counts
  const totalCartCount = useMemo(() => {
    return Object.values(cart).reduce((sum: number, item: any) => sum + item.quantity, 0);
  }, [cart]);

  // Loading indicator guard
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Network error state guard
  if (error && categories.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        <ErrorState message={error} onRetry={fetchInitialMenu} />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full select-none bg-[#120E0B] text-[#F5EFE6] overflow-x-hidden flex justify-center">
      
      {/* Maximum width constraint framing for Desktop centering */}
      <div className="w-full max-w-[480px] bg-[#120E0B] flex flex-col min-h-screen border-x border-[#D99A2B]/10 relative shadow-sm">
        
        {/* Dynamic header navigation */}
        <AppHeader
          cartCount={totalCartCount}
          onCartClick={() => setCurrentScreen('cart')}
          currentScreen={currentScreen}
          onBackClick={handleGoBack}
          settings={restaurantSettings}
        />

        {/* Dynamic Screen switching routers */}
        <main className="flex-1 w-full pb-8">
          {currentScreen === 'menu' && (
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
              onViewCart={() => setCurrentScreen('cart')}
              settings={restaurantSettings}
            />
          )}

          {currentScreen === 'cart' && (
            <CartPage
              cart={cart}
              onIncreaseQuantity={increaseQuantity}
              onDecreaseQuantity={decreaseQuantity}
              onRemoveFromCart={removeFromCart}
              onClearCart={clearCart}
              onGoToMenu={() => setCurrentScreen('menu')}
              onProceedToCheckout={() => setCurrentScreen('checkout')}
              settings={restaurantSettings}
            />
          )}

          {currentScreen === 'checkout' && (
            <CheckoutPage
              cart={cart}
              onSubmitOrder={handleSubmitOrder}
              isSubmitting={submittingOrder}
              onGoBack={handleGoBack}
              settings={restaurantSettings}
            />
          )}

          {currentScreen === 'success' && (
            <SuccessPage
              orderDetails={completedOrderDetails}
              onGoHome={handleGoHome}
            />
          )}
        </main>

        {/* Product Bottom Details Modal Sheet container */}
        {selectedProduct && (
          <ProductDetailsModal
            product={selectedProduct}
            currentQuantity={cart[selectedProduct.id]?.quantity || 0}
            onClose={() => setSelectedProduct(null)}
            onUpdateQuantity={handleUpdateProductQuantity}
          />
        )}
      </div>
    </div>
  );
}
