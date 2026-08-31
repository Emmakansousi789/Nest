"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import VendorCard from "@/components/VendorCard";
import { vendors } from "@/data/vendors";
import { getFavorites } from "@/lib/favorites";

export default function SavedPage() {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setFavoriteIds(getFavorites());

    const handleChange = () => setFavoriteIds(getFavorites());
    window.addEventListener("favorites-changed", handleChange);
    return () => window.removeEventListener("favorites-changed", handleChange);
  }, []);

  const savedVendors = vendors.filter((v) => favoriteIds.includes(v.id));

  return (
    <div className="min-h-screen bg-linen">
      <div className="sticky top-0 z-40 bg-cream/80 backdrop-blur-md border-b border-parchment">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-stone hover:text-charcoal transition-colors group"
          >
            <svg
              className="w-4 h-4 transition-transform group-hover:-translate-x-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
              />
            </svg>
            Back to Discover
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-charcoal mb-2">
          Saved Businesses
        </h1>
        <p className="text-stone text-sm mb-8">
          Your bookmarked local businesses, all in one place.
        </p>

        {!mounted ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">⏳</div>
            <p className="text-stone">Loading your saves…</p>
          </div>
        ) : savedVendors.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">💝</div>
            <h3 className="text-lg font-semibold text-charcoal mb-2">
              No saved businesses yet
            </h3>
            <p className="text-sm text-stone max-w-md mx-auto mb-6">
              Tap the heart icon on any business card to save it here for later.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-terracotta text-white rounded-xl font-medium hover:bg-terracotta-dark transition-colors"
            >
              Discover Businesses
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedVendors.map((vendor) => (
              <VendorCard key={vendor.id} vendor={vendor} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
