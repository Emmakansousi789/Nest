"use client";

import { ReactNode, useState, useEffect } from "react";
import { SessionProvider } from "next-auth/react";
import { AuthProvider } from "@/contexts/AuthContext";
import ConsentScreen from "@/components/ConsentScreen";
import { initAnalytics, hasConsent } from "@/lib/analytics";

const CONSENT_SHOWN_KEY = "ld-consent-shown";

export default function Providers({ children }: { children: ReactNode }) {
  const [consentReady, setConsentReady] = useState(false);
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    // Initialize analytics consent state from storage
    initAnalytics();

    // Check if consent screen has been shown before
    const alreadyShown = localStorage.getItem(CONSENT_SHOWN_KEY);
    if (!alreadyShown && !hasConsent()) {
      setShowConsent(true);
    } else {
      setConsentReady(true);
    }
  }, []);

  const handleConsentComplete = () => {
    localStorage.setItem(CONSENT_SHOWN_KEY, "true");
    setShowConsent(false);
    setConsentReady(true);
  };

  // Show consent screen before anything else
  if (showConsent) {
    return <ConsentScreen onConsentComplete={handleConsentComplete} />;
  }

  // Don't render app until consent is handled
  if (!consentReady) {
    return (
      <div className="min-h-screen bg-linen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-terracotta/30 border-t-terracotta rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <SessionProvider>
      <AuthProvider>{children}</AuthProvider>
    </SessionProvider>
  );
}
