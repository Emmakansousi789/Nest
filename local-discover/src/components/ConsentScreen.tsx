"use client";

import { useState } from "react";
import { setConsent } from "@/lib/analytics";

interface ConsentScreenProps {
  onConsentComplete: () => void;
}

/**
 * First-launch consent screen shown before any data collection.
 * Must be completed before analytics, geocoding, or any third-party calls.
 * Satisfies Apple 5.1.2(i), Google Play User Data disclosure, and ePrivacy.
 */
export default function ConsentScreen({ onConsentComplete }: ConsentScreenProps) {
  const [expanded, setExpanded] = useState(false);

  const handleAccept = () => {
    setConsent(true);
    onConsentComplete();
  };

  const handleDecline = () => {
    setConsent(false);
    onConsentComplete();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-linen">
      <div className="bg-cream w-full max-w-md mx-4 rounded-2xl border border-parchment shadow-xl p-6">
        {/* App icon */}
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-2xl bg-terracotta flex items-center justify-center">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
          </div>
        </div>

        <h2 className="font-serif text-xl font-semibold text-charcoal text-center mb-2">
          Welcome to Local Discover
        </h2>
        <p className="text-sm text-stone text-center mb-6">
          We help you find amazing local businesses near you.
        </p>

        {/* Data collection disclosure */}
        <div className="bg-ecru rounded-xl p-4 mb-4 space-y-3">
          <p className="text-xs font-semibold text-charcoal uppercase tracking-wider">
            What we collect
          </p>
          <div className="space-y-2">
            <DataItem
              icon="👤"
              title="Account info"
              description="Name and email for your account"
            />
            <DataItem
              icon="📍"
              title="Location"
              description="To show businesses near you (only when you search)"
            />
            <DataItem
              icon="📊"
              title="Usage analytics"
              description="Helps us improve the app experience"
            />
          </div>

          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-terracotta font-medium flex items-center gap-1 mt-2"
          >
            {expanded ? "Hide details" : "See full details"}
            <svg
              className={`w-3 h-3 transition-transform ${expanded ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </button>

          {expanded && (
            <div className="text-xs text-stone space-y-1 pt-2 border-t border-parchment">
              <p>We do <strong>not</strong> sell your data to third parties.</p>
              <p>Location is processed on-device for search and never stored on our servers.</p>
              <p>Analytics events are stored locally on your device only.</p>
              <p>You can withdraw consent anytime in Settings.</p>
              <p>
                Read our{" "}
                <a href="/privacy" className="text-terracotta underline" target="_blank" rel="noopener noreferrer">
                  Privacy Policy
                </a>{" "}
                for full details.
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <button
            onClick={handleAccept}
            className="w-full py-3 bg-charcoal text-cream rounded-xl text-sm font-medium hover:bg-graphite transition-colors"
          >
            Allow & Continue
          </button>
          <button
            onClick={handleDecline}
            className="w-full py-3 bg-transparent text-stone rounded-xl text-sm font-medium hover:bg-ecru transition-colors"
          >
            Continue Without Tracking
          </button>
        </div>

        <p className="text-[10px] text-clay text-center mt-4 leading-relaxed">
          By continuing, you agree to our{" "}
          <a href="/terms" className="underline" target="_blank" rel="noopener noreferrer">Terms of Use</a>
          {" "}and{" "}
          <a href="/privacy" className="underline" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
}

function DataItem({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="flex items-start gap-2">
      <span className="text-sm mt-0.5">{icon}</span>
      <div>
        <p className="text-xs font-medium text-charcoal">{title}</p>
        <p className="text-[11px] text-stone">{description}</p>
      </div>
    </div>
  );
}
