"use client";

import { getFavorites, toggleFavorite } from "@/lib/favorites";
import { useState } from "react";

interface FavoriteButtonProps {
  vendorId: string;
  size?: "sm" | "md";
}

export default function FavoriteButton({ vendorId, size = "sm" }: FavoriteButtonProps) {
  const favorites = getFavorites();
  const isFav = favorites.includes(vendorId);
  const [animating, setAnimating] = useState(false);
  const iconSize = size === "sm" ? "w-4 h-4" : "w-5 h-5";

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setAnimating(true);
    toggleFavorite(vendorId);
    setTimeout(() => setAnimating(false), 300);
  };

  return (
    <button
      onClick={handleClick}
      className={`w-full h-full flex items-center justify-center transition-transform duration-200 ${animating ? "scale-125" : "scale-100"}`}
      aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
    >
      <svg
        className={iconSize}
        fill={isFav ? "#C84B31" : "none"}
        viewBox="0 0 24 24"
        stroke={isFav ? "#C84B31" : "#1C1917"}
        strokeWidth={1.5}
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
