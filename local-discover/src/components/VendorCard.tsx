import Link from "next/link";
import { Vendor } from "@/types";
import { categories } from "@/data/vendors";
import { getAverageRating, getReviewCount } from "@/data/store";
import FavoriteButton from "./FavoriteButton";
import { isOpenNow } from "@/data/vendors";

interface VendorCardProps {
  vendor: Vendor;
  distance?: number;
}

export default function VendorCard({ vendor, distance }: VendorCardProps) {
  const category = categories.find((c) => c.value === vendor.category);
  const avgRating = getAverageRating(vendor.id);
  const reviewCount = getReviewCount(vendor.id);
  const open = isOpenNow(vendor);

  return (
    <Link
      href={`/vendor/${vendor.id}`}
      className="group block bg-cream border border-parchment rounded-2xl overflow-hidden card-interactive focus-ring"
    >
      {/* Image area — full-width, Airbnb style */}
      <div className="relative aspect-[4/3] overflow-hidden bg-ecru">
        {/* Category illustration fills entire top */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-5xl opacity-40 group-hover:scale-110 group-hover:opacity-60 transition-all duration-300">
            {category?.icon || "🏪"}
          </span>
        </div>

        {/* Category pill — bottom-left over image */}
        <div className="absolute bottom-3 left-3">
          <span className="inline-block bg-charcoal/80 backdrop-blur-sm text-white text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full">
            {category?.label || vendor.category}
          </span>
        </div>

        {/* Favorite — circular white button top-right with press feedback */}
        <div className="absolute top-3 right-3">
          <div className="w-9 h-9 bg-white/85 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm border border-white/50 hover:bg-white hover:shadow-md transition-all duration-200 pressable">
            <FavoriteButton vendorId={vendor.id} />
          </div>
        </div>

        {/* Badges — top-left */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          {vendor.featured && (
            <span className="badge text-white bg-charcoal/80 backdrop-blur-sm border-0 rounded-full">
              Curated
            </span>
          )}
          <span
            className={`badge border-0 rounded-full backdrop-blur-sm ${
              open
                ? "text-white bg-sage/85"
                : "text-white bg-stone/70"
            }`}
          >
            {open ? "Open" : "Closed"}
          </span>
        </div>
      </div>

      {/* Content — strict typographic hierarchy */}
      <div className="p-3.5">
        {/* Name — serif, semibold, largest */}
        <h3 className="font-serif text-[15px] font-semibold text-charcoal leading-snug mb-0.5 group-hover:text-terracotta transition-colors duration-200">
          {vendor.name}
        </h3>

        {/* Tagline — sans, regular weight, muted */}
        <p className="text-xs text-stone leading-relaxed mb-2.5 line-clamp-2">
          {vendor.tagline}
        </p>

        {/* Meta line — small, muted, dot-separated */}
        <div className="flex items-center gap-1.5 text-[11px] text-clay">
          {avgRating > 0 && (
            <>
              <span className="text-charcoal font-semibold">{avgRating.toFixed(1)}</span>
              <svg className="w-3 h-3 text-terracotta" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              <span>{reviewCount} review{reviewCount !== 1 ? "s" : ""}</span>
              <span className="text-parchment">·</span>
            </>
          )}
          <span>{vendor.city}</span>
          {distance !== undefined && (
            <>
              <span className="text-parchment">·</span>
              <span>{distance.toFixed(1)} mi</span>
            </>
          )}
        </div>

        {/* Tags — small pills */}
        {vendor.tags.length > 0 && (
          <div className="mt-2.5 flex flex-wrap gap-1">
            {vendor.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-medium text-graphite bg-ecru px-2 py-0.5 rounded-full"
              >
                {tag
                  .replace(/-/g, " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase())}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
