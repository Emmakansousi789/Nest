"use client";

import Link from "next/link";
import { useState, useCallback } from "react";

interface MarketVendor {
  id: string;
  name: string;
  tagline: string;
  category: string;
  tags: string[];
  city: string;
  productCount: number;
  checkedInAt: string;
}

interface Market {
  id: string;
  name: string;
  description?: string;
  lat: number;
  lng: number;
  radius: number;
  startTime?: string;
  endTime?: string;
  activeDate: string;
  active: boolean;
}

export default function MarketDetailClient({
  market,
  checkedInVendors,
}: {
  market: Market;
  checkedInVendors: MarketVendor[];
}) {
  const [viewMap, setViewMap] = useState(false);

  const formatDate = useCallback((dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
      {/* Market Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-terracotta/10 text-terracotta rounded-full">
            Market Event
          </span>
          {market.active && (
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-sage/10 text-sage rounded-full">
              <span className="w-1.5 h-1.5 bg-sage rounded-full animate-pulse" />
              Active
            </span>
          )}
        </div>
        <h2 className="font-serif text-3xl font-bold text-charcoal mb-2">
          {market.name}
        </h2>
        {market.description && (
          <p className="text-sm text-stone leading-relaxed">
            {market.description}
          </p>
        )}
      </div>

      {/* Market Details Card */}
      <div className="bg-cream rounded-2xl border border-parchment p-5 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-semibold text-stone uppercase tracking-wider mb-1">
              Date
            </p>
            <p className="text-sm font-medium text-charcoal">
              {formatDate(market.activeDate)}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-stone uppercase tracking-wider mb-1">
              Time
            </p>
            <p className="text-sm font-medium text-charcoal">
              {market.startTime || "—"} – {market.endTime || "—"}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-stone uppercase tracking-wider mb-1">
              Location
            </p>
            <p className="text-sm font-medium text-charcoal">
              {market.lat.toFixed(4)}, {market.lng.toFixed(4)}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-stone uppercase tracking-wider mb-1">
              Vendors Checked In
            </p>
            <p className="text-sm font-medium text-charcoal">
              {checkedInVendors.length}
            </p>
          </div>
        </div>
      </div>

      {/* Map Toggle */}
      <button
        onClick={() => setViewMap(!viewMap)}
        className="w-full mb-6 py-3 bg-cream border border-parchment rounded-xl text-sm font-medium text-charcoal hover:bg-ecru transition-colors flex items-center justify-center gap-2"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 6.75L3 9v11.25l6-2.25m0-11.25l6 2.25m-6-2.25v11.25m6-9L21 6v11.25l-6 2.25m0-11.25l-6 2.25m6 9V9"
          />
        </svg>
        {viewMap ? "Hide Map" : "Show on Map"}
      </button>

      {viewMap && (
        <div className="mb-6 h-[250px] rounded-2xl overflow-hidden border border-parchment">
          <iframe
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${market.lng - 0.01},${market.lat - 0.007},${market.lng + 0.01},${market.lat + 0.007}&layer=mapnik&marker=${market.lat},${market.lng}`}
            className="w-full h-full border-0"
            loading="lazy"
          />
        </div>
      )}

      {/* Checked-In Vendors */}
      <div>
        <h3 className="font-serif text-xl font-semibold text-charcoal mb-4">
          Vendors at this Market
        </h3>
        {checkedInVendors.length === 0 ? (
          <div className="text-center py-12 bg-cream rounded-2xl border border-parchment">
            <svg
              className="w-10 h-10 mx-auto mb-3 text-stone"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
              />
            </svg>
            <p className="text-sm text-stone">
              No vendors checked in yet. Check back closer to the event!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {checkedInVendors.map((vendor) => (
              <Link
                key={vendor.id}
                href={`/vendor/${vendor.id}`}
                className="block bg-cream rounded-2xl border border-parchment p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-serif text-base font-semibold text-charcoal truncate">
                        {vendor.name}
                      </h4>
                      <span className="flex items-center gap-1 px-2 py-0.5 bg-sage/10 text-sage text-[10px] font-semibold rounded-full">
                        <span className="w-1 h-1 bg-sage rounded-full animate-pulse" />
                        Live
                      </span>
                    </div>
                    <p className="text-xs text-stone mb-2 line-clamp-1">
                      {vendor.tagline}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-clay">
                      <span className="capitalize">
                        {vendor.category.replace(/-/g, " ")}
                      </span>
                      <span>·</span>
                      <span>{vendor.city}</span>
                      <span>·</span>
                      <span>
                        {vendor.productCount} product
                        {vendor.productCount !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                  <svg
                    className="w-4 h-4 text-clay shrink-0 mt-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.25 4.5l7.5 7.5-7.5 7.5"
                    />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
