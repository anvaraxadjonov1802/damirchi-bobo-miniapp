/** Telegram Web App helpers with safe browser fallback. */

const BRAND_DARK = "#120E0B";
const BRAND_CARD = "#1C1511";

export function initTelegramApp() {
  if (typeof window === "undefined" || !window.Telegram?.WebApp) return null;

  const tg = window.Telegram.WebApp;

  try {
    tg.ready();
    tg.expand();
    tg.setHeaderColor?.(BRAND_DARK);
    tg.setBackgroundColor?.(BRAND_DARK);
    tg.disableVerticalSwipes?.();
  } catch (error) {
    console.warn("Telegram Mini App init warning:", error);
  }

  return tg;
}

export function getTelegramInitData() {
  const tg = typeof window !== "undefined" ? window.Telegram?.WebApp : null;
  return tg?.initData || "";
}

export function isTelegramEnvironment() {
  return Boolean(getTelegramInitData());
}

export function getTelegramUser() {
  const user = typeof window !== "undefined" ? window.Telegram?.WebApp?.initDataUnsafe?.user : null;

  if (user?.id) {
    return {
      id: user.id,
      fullName: [user.first_name, user.last_name].filter(Boolean).join(" ") || "Telegram foydalanuvchisi",
      username: user.username || ""
    };
  }

  return {
    id: 123456789,
    fullName: "Test User",
    username: "test_user"
  };
}

export function showAlert(message) {
  const tg = typeof window !== "undefined" ? window.Telegram?.WebApp : null;
  if (tg?.showAlert) {
    tg.showAlert(message);
    return;
  }
  alert(message);
}

export function hapticFeedback(type = "light") {
  const haptic = typeof window !== "undefined" ? window.Telegram?.WebApp?.HapticFeedback : null;
  if (!haptic) return;

  try {
    if (type === "success") haptic.notificationOccurred("success");
    else if (type === "error") haptic.notificationOccurred("error");
    else haptic.impactOccurred(type === "medium" ? "medium" : "light");
  } catch (error) {
    // Haptic support differs across Telegram clients; silently ignore.
  }
}

export function getTelegramApp() {
  if (typeof window === "undefined") return null;
  return window.Telegram?.WebApp || null;
}

export function configureBackButton(visible, onClick) {
  const tg = getTelegramApp();
  const backButton = tg?.BackButton;
  if (!backButton) return () => {};

  try {
    if (visible) backButton.show();
    else backButton.hide();

    if (onClick) backButton.onClick(onClick);

    return () => {
      try {
        if (onClick) backButton.offClick(onClick);
      } catch (error) {
        // Telegram client support can differ; ignore cleanup failures.
      }
    };
  } catch (error) {
    return () => {};
  }
}

export function closeTelegramApp() {
  const tg = typeof window !== "undefined" ? window.Telegram?.WebApp : null;
  tg?.close?.();
}
