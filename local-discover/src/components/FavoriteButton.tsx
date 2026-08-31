"use client";

import { getFavorites, toggleFavorite } from "@/lib/favorites";

interface FavoriteButtonProps {
  vendorId: string;
  size?: "sm" | "md";
}

export default function FavoriteButton({ vendorId, size = "sm" }: FavoriteButtonProps) {
  const favorites = getFavorites();
  const isFav = favorites.includes(vendorId);
  const iconSize = size === "sm" ? "w-4 h-4" : "w-5 h-5";

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(vendorId);
      }}
      className="w-full h-full flex items-center justify-center"
      aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
    >
      <svg
        className={iconSize}
        fill={isFav ? "#1C1917" : "none"}
        viewBox="0 0 24 24"
        stroke="#1C1917"
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
