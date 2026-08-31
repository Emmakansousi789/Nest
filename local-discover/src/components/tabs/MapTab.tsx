"use client";

import { Suspense, useCallback } from "react";
import MapView from "@/components/MapView";
import { vendors } from "@/data/vendors";
import { searchLocations } from "@/data/locations";
import { useState } from "react";
import PullToRefresh from "@/components/PullToRefresh";

export default function MapTab() {
  const [locationQuery, setLocationQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
    name: string;
  } | null>(null);

  const suggestions =
    locationQuery.length >= 2 ? searchLocations(locationQuery) : [];

  const center: [number, number] = selectedLocation
    ? [selectedLocation.lat, selectedLocation.lng]
    : [33.749, -84.388];

  const handleRefresh = useCallback(() => {
    return new Promise<void>((resolve) => {
      setTimeout(resolve, 800);
    });
  }, []);

  return (
    <PullToRefresh onRefresh={handleRefresh} className="flex flex-col h-full pb-16">
      {/* Location search */}
      <div className="px-4 py-3 border-b border-parchment bg-cream/60 backdrop-blur-sm">
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-clay"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
          </svg>
          <input
            type="text"
            value={locationQuery}
            onChange={(e) => {
              setLocationQuery(e.target.value);
              if (e.target.value === "") setSelectedLocation(null);
            }}
            placeholder="Search location…"
            className="input-field pl-10"
          />
        </div>
        {suggestions.length > 0 && (
          <div className="mt-2 bg-cream rounded-xl border border-parchment shadow-sm overflow-hidden">
            {suggestions.map((loc) => (
              <button
                key={`${loc.name}-${loc.state}`}
                onClick={() => {
                  setSelectedLocation(loc);
                  setLocationQuery(`${loc.name}, ${loc.state}`);
                }}
                className="w-full text-left px-4 py-2.5 hover:bg-ecru transition-colors text-sm border-b border-parchment last:border-0"
              >
                <span className="font-medium text-charcoal">{loc.name}</span>
                <span className="text-stone ml-1">, {loc.state}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Map */}
      <div className="flex-1 min-h-0">
        <Suspense
          fallback={
            <div className="w-full h-full bg-ecru animate-pulse flex items-center justify-center rounded-2xl">
              <span className="text-stone text-sm">Loading map…</span>
            </div>
          }
        >
          <MapView vendors={vendors} center={center} zoom={selectedLocation ? 11 : 5} />
        </Suspense>
      </div>
    </PullToRefresh>
  );
}
