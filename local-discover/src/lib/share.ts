"use client";

import { trackEvent } from "@/lib/analytics";

interface ShareData {
  vendorId: string;
  vendorName: string;
  vendorCity: string;
  vendorTagline: string;
}

/**
 * Native Web Share API with fallback to clipboard copy.
 * Used to share vendor listings via iMessage, Instagram, WhatsApp, etc.
 */
export async function shareVendor(data: ShareData): Promise<boolean> {
  const url = typeof window !== "undefined"
    ? `${window.location.origin}/vendor/${data.vendorId}`
    : "";
  const text = `Check out ${data.vendorName} in ${data.vendorCity} — ${data.vendorTagline}`;

  trackEvent("share_vendor", { vendorId: data.vendorId, method: "init" });

  // Try native Web Share API (mobile browsers, Safari, Chrome)
  if (typeof navigator !== "undefined" && navigator.share) {
    try {
      await navigator.share({
        title: data.vendorName,
        text,
        url,
      });
      trackEvent("share_vendor", { vendorId: data.vendorId, method: "native" });
      return true;
    } catch (err) {
      // User cancelled or share failed — fall through to clipboard
      if ((err as Error).name === "AbortError") return false;
    }
  }

  // Fallback: copy to clipboard
  try {
    await navigator.clipboard.writeText(`${text}\n${url}`);
    trackEvent("share_vendor", { vendorId: data.vendorId, method: "clipboard" });
    return true;
  } catch {
    return false;
  }
}
