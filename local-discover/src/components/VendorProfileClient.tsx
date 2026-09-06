"use client";

import { useRouter } from "next/navigation";
import SwipeBack from "./SwipeBack";
import PhotoCarousel from "./PhotoCarousel";
import type { VendorPhoto, Market } from "@/types";

interface VendorProfileClientProps {
  children: React.ReactNode;
  photos: VendorPhoto[];
  category: string;
  vendorName: string;
  currentMarket?: Market | null;
}

export default function VendorProfileClient({
  children,
  photos,
  category,
  vendorName,
  currentMarket,
}: VendorProfileClientProps) {
  const router = useRouter();

  return (
    <SwipeBack onBack={() => router.push("/")}>
      {/* Photo carousel at top */}
      <PhotoCarousel
        photos={photos}
        category={category}
        vendorName={vendorName}
      />
      
      {/* Market check-in badge */}
      {currentMarket && (
        <div className="mx-4 -mt-2 mb-4 bg-terracotta/10 border border-terracotta/20 rounded-xl px-4 py-3 flex items-center gap-3">
          <div className="relative">
            <div className="w-3 h-3 bg-terracotta rounded-full" />
            <div className="absolute inset-0 w-3 h-3 bg-terracotta rounded-full animate-ping opacity-75" />
          </div>
          <div>
            <p className="text-sm font-medium text-charcoal">
              Currently at: <span className="text-terracotta">{currentMarket.name}</span>
            </p>
            <p className="text-xs text-stone">Live market event</p>
          </div>
        </div>
      )}
      
      {children}
    </SwipeBack>
  );
}
