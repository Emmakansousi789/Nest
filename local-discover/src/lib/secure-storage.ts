/**
 * Unified secure storage abstraction.
 * - On native (iOS/Android): Uses Keychain (iOS) or EncryptedSharedPreferences (Android)
 *   via @aparajita/capacitor-secure-storage. Data is encrypted at rest.
 * - On web: Falls back to localStorage (unencrypted, but acceptable for web MVP).
 *
 * This replaces all direct localStorage.getItem/setItem calls for user-linked data.
 */

import { Capacitor } from "@capacitor/core";

let secureStorage: Awaited<ReturnType<typeof import("@aparajita/capacitor-secure-storage").SecureStorage.clear>> | null = null;
let storageReady = false;

async function getSecureStorage() {
  if (storageReady) return secureStorage;
  try {
    const { SecureStorage } = await import("@aparajita/capacitor-secure-storage");
    secureStorage = SecureStorage;
    storageReady = true;
    return secureStorage;
  } catch {
    // Plugin not available (web or not installed) — fall back to localStorage
    storageReady = true;
    return null;
  }
}

/**
 * Store a value securely.
 * On native: encrypted at rest in Keychain/EncryptedSharedPreferences.
 * On web: localStorage fallback.
 */
export async function secureSet(key: string, value: string): Promise<void> {
  if (Capacitor.isNativePlatform()) {
    const storage = await getSecureStorage();
    if (storage) {
      await storage.set(key, value);
      return;
    }
  }
  // Web fallback
  if (typeof window !== "undefined") {
    localStorage.setItem(key, value);
  }
}

/**
 * Retrieve a value securely.
 * On native: reads from Keychain/EncryptedSharedPreferences.
 * On web: localStorage fallback.
 */
export async function secureGet(key: string): Promise<string | null> {
  if (Capacitor.isNativePlatform()) {
    const storage = await getSecureStorage();
    if (storage) {
      const result = await storage.get(key);
      return result ?? null;
    }
  }
  // Web fallback
  if (typeof window !== "undefined") {
    return localStorage.getItem(key);
  }
  return null;
}

/**
 * Remove a value from secure storage.
 */
export async function secureRemove(key: string): Promise<void> {
  if (Capacitor.isNativePlatform()) {
    const storage = await getSecureStorage();
    if (storage) {
      await storage.remove(key);
      return;
    }
  }
  if (typeof window !== "undefined") {
    localStorage.removeItem(key);
  }
}

/**
 * Clear all values from secure storage.
 */
export async function secureClear(): Promise<void> {
  if (Capacitor.isNativePlatform()) {
    const storage = await getSecureStorage();
    if (storage) {
      await storage.clear();
      return;
    }
  }
  if (typeof window !== "undefined") {
    localStorage.clear();
  }
}

/**
 * Synchronous localStorage read for non-sensitive data that must be
 * available immediately on mount (consent shown flag, etc.).
 * Use secureGet/secureSet for anything user-linked or identity-tied.
 */
export function syncGet(key: string): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(key);
}

export function syncSet(key: string, value: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, value);
}

export function syncRemove(key: string): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(key);
}
