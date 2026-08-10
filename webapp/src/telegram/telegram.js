/** Telegram Web App helpers with safe browser fallback. */

const BRAND_DARK = "#FAF7F0";
let advancedUiScheduled = false;

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

function scheduleAdvancedTelegramUi(tg) {
  if (!tg || advancedUiScheduled || typeof window === "undefined") return;
  advancedUiScheduled = true;

  const run = () => {
    try {
      if (supportsTelegramVersion(tg, "8.0")) {
        tg.requestFullscreen?.();
        try {
          tg.lockOrientation?.();
        } catch {}
      }

      if (supportsTelegramVersion(tg, "7.7")) {
        tg.disableVerticalSwipes?.();
      }
    } catch (error) {
      console.warn("Telegram advanced UI warning:", error);
    }
  };

  if (window.requestIdleCallback) {
    window.requestIdleCallback(run, { timeout: 1200 });
  } else {
    window.setTimeout(run, 700);
  }
}

export function initTelegramApp() {
  const tg = getWindowTelegramApp();
  if (!tg) {
    // The SDK is loaded with defer. Retry once after document scripts finish.
    if (typeof window !== "undefined") {
      window.setTimeout(() => {
        const delayedTg = getWindowTelegramApp();
        if (delayedTg) initTelegramApp();
      }, 120);
    }
    return null;
  }

  try {
    tg.ready?.();
    tg.expand?.();

    const applyTelegramSafeArea = () => {
      const topInset = tg?.safeAreaInset?.top || tg?.contentSafeAreaInset?.top || 0;
      document.documentElement.style.setProperty("--tg-safe-top", `${topInset}px`);
    };

    applyTelegramSafeArea();
    tg.onEvent?.("safeAreaChanged", applyTelegramSafeArea);
    tg.onEvent?.("contentSafeAreaChanged", applyTelegramSafeArea);
    tg.onEvent?.("viewportChanged", applyTelegramSafeArea);

    if (supportsTelegramVersion(tg, "6.1")) {
      tg.setHeaderColor?.(BRAND_DARK);
      tg.setBackgroundColor?.(BRAND_DARK);
    }

    scheduleAdvancedTelegramUi(tg);
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
      fullName: [user.first_name, user.last_name].filter(Boolean).join(" ") || "Telegram foydalanuvchisi",
      username: user.username || "",
      firstName: user.first_name || "",
      lastName: user.last_name || "",
      languageCode: user.language_code || "",
      photoUrl: user.photo_url || "",
    };
  }

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
    } catch {}
  }
  alert(message);
}

export function showConfirm(message, callback) {
  const tg = getWindowTelegramApp();
  if (tg?.showConfirm) {
    try {
      tg.showConfirm(message, callback);
      return;
    } catch {}
  }
  callback?.(confirm(message));
}

export function openExternalLink(url) {
  if (!url || typeof window === "undefined") return false;
  const tg = getWindowTelegramApp();
  if (tg?.openLink) {
    try {
      tg.openLink(url);
      return true;
    } catch {}
  }
  try {
    return Boolean(window.open(url, "_blank", "noopener,noreferrer"));
  } catch {
    return false;
  }
}

export function hapticFeedback(type = "light") {
  const haptic = getWindowTelegramApp()?.HapticFeedback;
  if (!haptic) return;
  try {
    if (["success", "error", "warning"].includes(type)) {
      haptic.notificationOccurred(type);
      return;
    }
    haptic.impactOccurred(type === "medium" ? "medium" : "light");
  } catch {}
}

export function getTelegramApp() {
  return getWindowTelegramApp();
}

export function configureBackButton(visible, onClick) {
  const backButton = getTelegramApp()?.BackButton;
  if (!backButton) return () => {};

  try {
    if (visible) {
      backButton.show();
      if (onClick) backButton.onClick(onClick);
    } else {
      backButton.hide();
    }

    return () => {
      try {
        if (onClick) backButton.offClick(onClick);
        if (!visible) backButton.hide();
      } catch {}
    };
  } catch {
    return () => {};
  }
}

export function closeTelegramApp() {
  try {
    getTelegramApp()?.close?.();
  } catch {}
}
