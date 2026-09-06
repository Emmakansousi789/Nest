/**
 * Unified secure storage abstraction.
 * - On native (iOS/Android): Uses Keychain (iOS) or EncryptedSharedPreferences (Android)
 *   via @aparajita/capacitor-secure-storage. Data is encrypted at rest.
 * - On web: Falls back to localStorage (unencrypted, but acceptable for web MVP).
 *
 * This replaces all direct localStorage.getItem/setItem calls for user-linked data.
 */

import { Capacitor } from "@capacitor/core";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let secureStoragePlugin: any = null;
let storageReady = false;

async function getSecureStorage() {
  if (storageReady) return secureStoragePlugin;
  try {
    const mod = await import("@aparajita/capacitor-secure-storage");
    secureStoragePlugin = mod.SecureStorage;
    storageReady = true;
    return secureStoragePlugin;
  } catch {
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
  if (typeof window !== "undefined") {
    localStorage.setItem(key, value);
  }
}

/**
 * Retrieve a value securely.
 */
export async function secureGet(key: string): Promise<string | null> {
  if (Capacitor.isNativePlatform()) {
    const storage = await getSecureStorage();
    if (storage) {
      const result = await storage.get(key);
      return result ?? null;
    }
  }
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
