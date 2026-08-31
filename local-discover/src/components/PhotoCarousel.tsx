"use client";

import { useState, useRef, useCallback } from "react";
import { LoadingSpinner } from "./icons";

interface Photo {
  url: string;
  alt: string;
  caption?: string;
}

interface PhotoCarouselProps {
  photos: Photo[];
  category?: string;
  vendorName?: string;
}

export default function PhotoCarousel({ photos, category, vendorName }: PhotoCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchDelta, setTouchDelta] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Use category-based placeholder if no real photos
  const placeholderColors: Record<string, { bg: string; emoji: string }> = {
    "farmers-market": { bg: "bg-[#E8F0EB]", emoji: "🌱" },
    "food-producer": { bg: "bg-[#FEF3C7]", emoji: "🍳" },
    maker: { bg: "bg-[#EDE9FE]", emoji: "🎨" },
    retail: { bg: "bg-[#FCE7F3]", emoji: "🛍️" },
    services: { bg: "bg-[#F1F5F9]", emoji: "🔧" },
    artisan: { bg: "bg-[#ECFDF5]", emoji: "✨" },
    wellness: { bg: "bg-[#F0FDF4]", emoji: "🧘" },
  };

  const displayPhotos = photos.length > 0
    ? photos
    : Array.from({ length: 3 }, (_, i) => ({
        url: "",
        alt: `${vendorName || "Business"} photo ${i + 1}`,
      }));

  const placeholder = category ? placeholderColors[category] || placeholderColors.services : placeholderColors.services;

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
    setIsDragging(true);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (touchStart === null) return;
    setTouchDelta(e.touches[0].clientX - touchStart);
  }, [touchStart]);

  const handleTouchEnd = useCallback(() => {
    if (Math.abs(touchDelta) > 50) {
      if (touchDelta < 0 && currentIndex < displayPhotos.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else if (touchDelta > 0 && currentIndex > 0) {
        setCurrentIndex((prev) => prev - 1);
      }
    }
    setTouchStart(null);
    setTouchDelta(0);
    setIsDragging(false);
  }, [touchDelta, currentIndex, displayPhotos.length]);

  if (displayPhotos.length === 0) return null;

  return (
    <div className="relative w-full overflow-hidden" ref={containerRef}>
      {/* Photo viewport */}
      <div
        className="relative aspect-[16/10] overflow-hidden touch-pan-y"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex h-full transition-transform"
          style={{
            transform: `translateX(calc(-${currentIndex * 100}% + ${isDragging ? touchDelta : 0}px))`,
            transition: isDragging ? "none" : "transform 0.3s ease",
          }}
        >
          {displayPhotos.map((photo, i) => (
            <div
              key={i}
              className={`relative w-full h-full flex-shrink-0 ${placeholder.bg} flex items-center justify-center`}
            >
              {photo.url ? (
                <img
                  src={photo.url}
                  alt={photo.alt}
                  className="w-full h-full object-cover"
                  loading={i === 0 ? "eager" : "lazy"}
                />
              ) : (
                <div className="flex flex-col items-center gap-2 text-center px-8">
                  <span className="text-5xl opacity-40">{placeholder.emoji}</span>
                  <span className="text-xs text-stone/60 font-medium">{photo.alt}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Photo count pill */}
        {displayPhotos.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-charcoal/70 backdrop-blur-sm text-white text-[11px] font-medium px-2.5 py-1 rounded-full">
            {currentIndex + 1} / {displayPhotos.length}
          </div>
        )}
      </div>

      {/* Dot indicators */}
      {displayPhotos.length > 1 && displayPhotos.length <= 8 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
          {displayPhotos.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`rounded-full transition-all duration-200 ${
                i === currentIndex
                  ? "w-5 h-1.5 bg-white"
                  : "w-1.5 h-1.5 bg-white/50"
              }`}
              aria-label={`Go to photo ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* Left/right arrow buttons (desktop) */}
      {displayPhotos.length > 1 && (
        <>
          {currentIndex > 0 && (
            <button
              onClick={() => setCurrentIndex((prev) => prev - 1)}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors hidden sm:flex"
              aria-label="Previous photo"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1C1917" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
          )}
          {currentIndex < displayPhotos.length - 1 && (
            <button
              onClick={() => setCurrentIndex((prev) => prev + 1)}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors hidden sm:flex"
              aria-label="Next photo"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1C1917" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          )}
        </>
      )}
    </div>
  );
}
