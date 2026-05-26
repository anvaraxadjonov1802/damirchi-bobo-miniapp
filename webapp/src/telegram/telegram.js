/** Telegram Web App helpers with safe browser fallback. */

const BRAND_DARK = "#120E0B";

function getWindowTelegramApp() {
  if (typeof window === "undefined") return null;
  return window.Telegram?.WebApp || null;
}

function supportsTelegramVersion(tg, requiredVersion) {
  if (!tg?.isVersionAtLeast) return false;

  try {
    return tg.isVersionAtLeast(requiredVersion);
  } catch {
    return false;
  }
}

export function initTelegramApp() {
  const tg = getWindowTelegramApp();

  if (!tg) return null;

  try {
    tg.ready?.();
    tg.expand?.();

    if (supportsTelegramVersion(tg, "6.1")) {
      tg.setHeaderColor?.(BRAND_DARK);
      tg.setBackgroundColor?.(BRAND_DARK);
    }

    // Yangi Telegram clientlarda Mini App fullscreen bo‘lib ochiladi.
    if (supportsTelegramVersion(tg, "8.0")) {
      tg.requestFullscreen?.();

      try {
        tg.lockOrientation?.();
      } catch {
        // Orientation lock hamma clientda ishlamasligi mumkin.
      }
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
  const tg = getWindowTelegramApp();
  return tg?.initData || "";
}

export function isTelegramEnvironment() {
  return Boolean(getTelegramInitData());
}

export function getTelegramUser() {
  const tg = getWindowTelegramApp();
  const user = tg?.initDataUnsafe?.user || null;

  if (user?.id) {
    return {
      id: user.id,
      fullName:
        [user.first_name, user.last_name].filter(Boolean).join(" ") ||
        "Telegram foydalanuvchisi",
      username: user.username || "",
      firstName: user.first_name || "",
      lastName: user.last_name || "",
      languageCode: user.language_code || "",
      photoUrl: user.photo_url || "",
    };
  }

  // Browser fallback. Production order CheckoutPage’da initData yo‘q bo‘lsa bloklanadi.
  return {
    id: 123456789,
    fullName: "Test User",
    username: "test_user",
    firstName: "Test",
    lastName: "User",
    languageCode: "",
    photoUrl: "",
  };
}

export function showAlert(message) {
  const tg = getWindowTelegramApp();

  if (tg?.showAlert) {
    try {
      tg.showAlert(message);
      return;
    } catch {
      // Browser alert fallbackga tushadi.
    }
  }

  alert(message);
}

export function showConfirm(message, callback) {
  const tg = getWindowTelegramApp();

  if (tg?.showConfirm) {
    try {
      tg.showConfirm(message, callback);
      return;
    } catch {
      // Browser confirm fallbackga tushadi.
    }
  }

  const result = confirm(message);
  callback?.(result);
}

export function hapticFeedback(type = "light") {
  const haptic = getWindowTelegramApp()?.HapticFeedback;

  if (!haptic) return;

  try {
    if (type === "success") {
      haptic.notificationOccurred("success");
      return;
    }

    if (type === "error") {
      haptic.notificationOccurred("error");
      return;
    }

    if (type === "warning") {
      haptic.notificationOccurred("warning");
      return;
    }

    haptic.impactOccurred(type === "medium" ? "medium" : "light");
  } catch {
    // Telegram client support can differ; ignore haptic errors.
  }
}

export function getTelegramApp() {
  return getWindowTelegramApp();
}

export function configureBackButton(visible, onClick) {
  const tg = getTelegramApp();
  const backButton = tg?.BackButton;

  if (!backButton) return () => {};

  try {
    if (visible) {
      backButton.show();

      if (onClick) {
        backButton.onClick(onClick);
      }
    } else {
      backButton.hide();
    }

    return () => {
      try {
        if (onClick) {
          backButton.offClick(onClick);
        }

        if (!visible) {
          backButton.hide();
        }
      } catch {
        // Ignore cleanup failures.
      }
    };
  } catch {
    return () => {};
  }
}

export function closeTelegramApp() {
  const tg = getTelegramApp();

  try {
    tg?.close?.();
  } catch {
    // Ignore close failures.
  }
}