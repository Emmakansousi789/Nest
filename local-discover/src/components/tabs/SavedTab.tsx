"use client";

import { useState, useEffect, useCallback } from "react";
import VendorCard from "@/components/VendorCard";
import { getVendors } from "@/data/store";
import { getFavorites } from "@/lib/favorites";
import PullToRefresh from "@/components/PullToRefresh";
import { HeartOutline } from "@/components/icons";

export default function SavedTab() {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setFavoriteIds(getFavorites());
    const handleChange = () => setFavoriteIds(getFavorites());
    window.addEventListener("favorites-changed", handleChange);
    return () => window.removeEventListener("favorites-changed", handleChange);
  }, []);

  const savedVendors = getVendors().filter((v) => favoriteIds.includes(v.id));

  const handleRefresh = useCallback(() => {
    return new Promise<void>((resolve) => {
      setFavoriteIds(getFavorites());
      setTimeout(resolve, 500);
    });
  }, []);

  if (!mounted) {
    return (
      <div className="flex-1 flex items-center justify-center py-20">
        <div className="w-12 h-12 rounded-full bg-terracotta/10 flex items-center justify-center animate-pulse">
          <HeartOutline size={24} className="text-terracotta" />
        </div>
      </div>
    );
  }

  if (savedVendors.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-20 px-4">
        <div className="w-16 h-16 rounded-2xl bg-terracotta/10 flex items-center justify-center mb-4">
          <HeartOutline size={32} className="text-terracotta" />
        </div>
        <h3 className="text-lg font-semibold text-charcoal mb-2">
          No saved businesses yet
        </h3>
        <p className="text-sm text-stone max-w-sm text-center">
          Tap the heart icon on any business card to save it here for later.
        </p>
      </div>
    );
  }

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <div className="p-2 pb-24">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-1.5">
          {savedVendors.map((vendor) => (
            <VendorCard key={vendor.id} vendor={vendor} />
          ))}
        </div>
      </div>
    </PullToRefresh>
  );
}
