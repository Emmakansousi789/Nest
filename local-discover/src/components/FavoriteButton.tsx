"use client";

import { useState, useEffect } from "react";
import { secureGet, secureSet } from "@/lib/secure-storage";

const FAVORITES_KEY = "ld-favorites";

interface FavoriteButtonProps {
  vendorId: string;
}

export default function FavoriteButton({ vendorId }: FavoriteButtonProps) {
  const [isFav, setIsFav] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    // Load favorites from encrypted storage
    secureGet(FAVORITES_KEY).then((stored) => {
      try {
        const favorites: string[] = stored ? JSON.parse(stored) : [];
        setIsFav(favorites.includes(vendorId));
      } catch {
        setIsFav(false);
      }
    });
  }, [vendorId, mounted]);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setAnimating(true);
    const next = !isFav;
    setIsFav(next);
    try {
      const stored = await secureGet(FAVORITES_KEY);
      const favorites: string[] = stored ? JSON.parse(stored) : [];
      const updated = next
        ? [...favorites, vendorId]
        : favorites.filter((id: string) => id !== vendorId);
      await secureSet(FAVORITES_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event("favorites-changed"));
    } catch { /* ignore */ }
    setTimeout(() => setAnimating(false), 300);
  };

  return (
    <button
      onClick={handleClick}
      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${isFav ? "bg-terracotta/10" : "bg-white/80 backdrop-blur-sm shadow-sm hover:bg-white"}`}
      aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
    >
      <svg
        className={`w-5 h-5 transition-transform duration-200 ${animating ? "scale-125" : "scale-100"}`}
        fill={mounted && isFav ? "#E31C5F" : "none"}
        viewBox="0 0 24 24"
        stroke={mounted && isFav ? "#E31C5F" : "#222222"}
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"
        />
      </svg>
    </button>
  );
}
