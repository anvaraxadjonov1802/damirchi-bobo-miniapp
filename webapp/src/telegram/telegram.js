/** Telegram Web App helpers with safe browser fallback. */

const BRAND_DARK = "#120E0B";

function supportsTelegramVersion(tg, requiredVersion) {
  if (!tg?.isVersionAtLeast) return false;

  try {
    return tg.isVersionAtLeast(requiredVersion);
  } catch {
    return false;
  }
}

export function initTelegramApp() {
  if (typeof window === "undefined" || !window.Telegram?.WebApp) return null;

  const tg = window.Telegram.WebApp;

  try {
    tg.ready();
    tg.expand();

    if (supportsTelegramVersion(tg, "6.1")) {
      tg.setHeaderColor?.(BRAND_DARK);
      tg.setBackgroundColor?.(BRAND_DARK);
    }

    if (supportsTelegramVersion(tg, "7.7")) {
      tg.disableVerticalSwipes?.();
    }
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
  const user =
    typeof window !== "undefined"
      ? window.Telegram?.WebApp?.initDataUnsafe?.user
      : null;

  if (user?.id) {
    return {
      id: user.id,
      fullName:
        [user.first_name, user.last_name].filter(Boolean).join(" ") ||
        "Telegram foydalanuvchisi",
      username: user.username || "",
    };
  }

  return {
    id: 123456789,
    fullName: "Test User",
    username: "test_user",
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
  const haptic =
    typeof window !== "undefined"
      ? window.Telegram?.WebApp?.HapticFeedback
      : null;

  if (!haptic) return;

  try {
    if (type === "success") haptic.notificationOccurred("success");
    else if (type === "error") haptic.notificationOccurred("error");
    else haptic.impactOccurred(type === "medium" ? "medium" : "light");
  } catch {
    // Telegram client support can differ; ignore haptic errors.
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
      } catch {
        // Ignore cleanup failures.
      }
    };
  } catch {
    return () => {};
  }
}

export function closeTelegramApp() {
  const tg = typeof window !== "undefined" ? window.Telegram?.WebApp : null;
  tg?.close?.();
}