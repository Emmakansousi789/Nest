/**
 * Push notification infrastructure.
 * Registers a service worker and manages notification permissions.
 * Currently shows local notifications — integrate with a push service
 * (Firebase Cloud Messaging, OneSignal, etc.) for server-initiated pushes.
 */

/**
 * Check if push notifications are supported in this browser.
 */
export function isPushSupported(): boolean {
  if (typeof window === "undefined") return false;
  return "Notification" in window && "serviceWorker" in navigator;
}

/**
 * Get current notification permission state.
 */
export function getPermissionState(): NotificationPermission | "unsupported" {
  if (!isPushSupported()) return "unsupported";
  return Notification.permission;
}

/**
 * Request notification permission from the user.
 * Returns the resulting permission state.
 */
export async function requestPermission(): Promise<NotificationPermission> {
  if (!isPushSupported()) return "denied";
  return await Notification.requestPermission();
}

/**
 * Show a local notification (no server push needed).
 * Used for in-app events like new messages, review responses, etc.
 */
export function showLocalNotification(
  title: string,
  options?: NotificationOptions
): void {
  if (!isPushSupported() || Notification.permission !== "granted") return;

  try {
    new Notification(title, {
      icon: "/icon-192.png",
      badge: "/icon-192.png",
      ...options,
    });
  } catch {
    // Service worker not ready or notification blocked
  }
}

/**
 * Register a service worker for push notifications.
 * Call this once on app mount.
 */
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!isPushSupported()) return null;

  try {
    const registration = await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
    });
    return registration;
  } catch {
    console.warn("Service worker registration failed");
    return null;
  }
}
