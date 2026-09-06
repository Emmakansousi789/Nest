import { memo } from "react";
import Link from "next/link";
import { Vendor } from "@/types";
import { getAverageRating } from "@/data/store";
import FavoriteButton from "./FavoriteButton";
import ShareButton from "./ShareButton";
import { isOpenNow } from "@/data/vendors";
import Image from "next/image";

// Real photos by category — sourced from Unsplash (royalty-free)
const categoryPhotos: Record<string, string> = {
  "farmers-market": "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=600&h=600&fit=crop&q=80",
  "food-producer": "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=600&fit=crop&q=80",
  "maker": "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=600&h=600&fit=crop&q=80",
  "retail": "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=600&fit=crop&q=80",
  "services": "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=600&h=600&fit=crop&q=80",
  "artisan": "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=600&h=600&fit=crop&q=80",
  "wellness": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=600&fit=crop&q=80",
};

interface VendorCardProps {
  vendor: Vendor;
  distance?: number;
}

function VendorCardInner({ vendor, distance }: VendorCardProps) {
  const avgRating = getAverageRating(vendor.id);
  const open = isOpenNow(vendor);
  const photoUrl = categoryPhotos[vendor.category] || categoryPhotos.services;

  return (
    <Link
      href={`/vendor/${vendor.id}`}
      className="group block card-interactive focus-ring rounded-2xl"
    >
      {/* Image area */}
      <div className="relative aspect-square overflow-hidden rounded-2xl mb-3">
        <Image
          src={photoUrl}
          alt={vendor.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          priority={vendor.featured}
        />

        {/* Favorite button — top right */}
        <div className="absolute top-3 right-3 z-10">
          <FavoriteButton vendorId={vendor.id} />
        </div>

        {/* Share button — top right next to favorite */}
        <div className="absolute top-3 right-14 z-10">
          <ShareButton vendor={vendor} />
        </div>

        {/* Badge — top left */}
        {vendor.featured && (
          <div className="absolute top-3 left-3 z-10">
            <span className="badge bg-white text-charcoal shadow-sm">
              Guest favorite
            </span>
          </div>
        )}

        {/* Open/Closed — bottom left */}
        <div className="absolute bottom-3 left-3 z-10">
          <span className={`badge ${open ? "bg-white text-sage" : "bg-white text-stone"}`}>
            {open ? "Open" : "Closed"}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="px-0.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-[15px] font-semibold text-charcoal leading-snug truncate">
            {vendor.name}
          </h3>
          {avgRating > 0 && (
            <div className="flex items-center gap-1 shrink-0">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              <span className="text-sm font-medium">{avgRating.toFixed(2)}</span>
            </div>
          )}
        </div>
        <p className="text-sm text-stone mt-0.5">{vendor.city}</p>
        {distance !== undefined && (
          <p className="text-sm text-stone">{distance.toFixed(1)} miles away</p>
        )}
        <p className="text-sm text-stone mt-0.5 line-clamp-1">{vendor.tagline}</p>
      </div>
    </Link>
  );
}

export default memo(VendorCardInner);
