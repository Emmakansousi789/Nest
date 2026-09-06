"use client";

import { useState, useEffect, useCallback } from "react";
import VendorCard from "@/components/VendorCard";
import { useVendors } from "@/hooks/useVendors";
import { getFavorites } from "@/lib/favorites";
import PullToRefresh from "@/components/PullToRefresh";

export default function SavedTab() {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);
  const { vendors: allVendors } = useVendors();

  useEffect(() => {
    setMounted(true);
    getFavorites().then(setFavoriteIds);
    const handleChange = () => getFavorites().then(setFavoriteIds);
    window.addEventListener("favorites-changed", handleChange);
    return () => window.removeEventListener("favorites-changed", handleChange);
  }, []);

  const savedVendors = allVendors.filter((v) => favoriteIds.includes(v.id));

  const handleRefresh = useCallback(() => {
    return new Promise<void>((resolve) => {
      getFavorites().then(setFavoriteIds);
      setTimeout(resolve, 500);
    });
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <div className="min-h-screen bg-white px-4 sm:px-6 pb-28">
        {/* Title */}
        <div className="flex items-center justify-between pt-4 mb-6">
          <h1 className="text-[28px] font-bold text-charcoal tracking-tight">Wishlists</h1>
          {savedVendors.length > 0 && (
            <button className="px-4 py-2 text-sm font-medium text-charcoal border border-gray-200 rounded-full hover:bg-ecru transition-colors">
              Edit
            </button>
          )}
        </div>

        {savedVendors.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto rounded-full bg-ecru flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-stone" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-charcoal mb-2">No saved businesses yet</h3>
            <p className="text-sm text-stone max-w-sm mx-auto">
              Tap the heart icon on any business card to save it here for later.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {savedVendors.map((vendor) => (
              <VendorCard key={vendor.id} vendor={vendor} />
            ))}
          </div>
        )}
      </div>
    </PullToRefresh>
  );
}
