"use client";

import { Suspense, useEffect, useState } from "react";
import MapView from "@/components/MapView";
import { vendors } from "@/data/vendors";
import { seedMarkets } from "@/data/markets";
import { searchPlaces, type GeoResult } from "@/lib/geocode";
import { haversineDistance } from "@/lib/distance";

const DEFAULT_RADIUS_MILES = 25;

interface MarketHotspot {
  id: string;
  name: string;
  lat: number;
  lng: number;
  radius: number;
  checkInCount?: number;
}

export default function MapTab() {
  const [locationQuery, setLocationQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<GeoResult | null>(null);
  const [locResults, setLocResults] = useState<GeoResult[]>([]);
  const [locSearching, setLocSearching] = useState(false);
  const [markets, setMarkets] = useState<MarketHotspot[]>(seedMarkets);

  useEffect(() => {
    if (locationQuery.trim().length < 2) {
      setLocResults([]);
      return;
    }
    setLocSearching(true);
    const handle = setTimeout(async () => {
      const results = await searchPlaces(locationQuery);
      setLocResults(results);
      setLocSearching(false);
    }, 350);
    return () => clearTimeout(handle);
  }, [locationQuery]);

  // Fetch active markets — falls back to seed data when API is unavailable (Capacitor)
  useEffect(() => {
    async function fetchMarkets() {
      try {
        const params = selectedLocation
          ? `?lat=${selectedLocation.lat}&lng=${selectedLocation.lng}&radius=${DEFAULT_RADIUS_MILES}`
          : "";
        const res = await fetch(`/api/markets${params}`);
        if (res.ok) {
          const data = await res.json();
          setMarkets(
            (data.markets || []).map((m: Record<string, unknown>) => ({
              id: m.id as string,
              name: m.name as string,
              lat: m.lat as number,
              lng: m.lng as number,
              radius: m.radius as number,
              checkInCount: Array.isArray(m.checkIns) ? (m.checkIns as unknown[]).length : 0,
            }))
          );
        }
      } catch {
        // Markets are optional — map still works without them
      }
    }
    fetchMarkets();
  }, [selectedLocation]);

  const center: [number, number] = selectedLocation
    ? [selectedLocation.lat, selectedLocation.lng]
    : [33.749, -84.388];

  const nearbyVendors = selectedLocation
    ? vendors.filter(
        (v) =>
          haversineDistance(selectedLocation.lat, selectedLocation.lng, v.lat, v.lng) <=
          DEFAULT_RADIUS_MILES
      )
    : vendors;

  return (
    <div className="flex flex-col h-full pb-16">
      {/* Search bar */}
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
        {locSearching && (
          <div className="mt-2 text-sm text-clay px-1">Searching…</div>
        )}
        {!locSearching && locResults.length > 0 && (
          <div className="mt-2 bg-cream rounded-xl border border-parchment shadow-sm overflow-hidden">
            {locResults.map((loc) => (
              <button
                key={`${loc.name}-${loc.state}`}
                onClick={() => {
                  setSelectedLocation(loc);
                  setLocationQuery(loc.state ? `${loc.name}, ${loc.state}` : loc.name);
                  setLocResults([]);
                }}
                className="w-full text-left px-4 py-2.5 hover:bg-ecru transition-colors text-sm border-b border-parchment last:border-0"
              >
                <span className="font-medium text-charcoal">{loc.name}</span>
                {loc.state && <span className="text-stone ml-1">, {loc.state}</span>}
              </button>
            ))}
          </div>
        )}
        {!locSearching && locationQuery.length >= 2 && locResults.length === 0 && (
          <div className="mt-2 text-sm text-clay px-1">No locations found — try a different spelling</div>
        )}
      </div>

      {/* Map */}
      <div className="flex-1 min-h-0 relative">
        <Suspense
          fallback={
            <div className="w-full h-full bg-ecru animate-pulse flex items-center justify-center">
              <span className="text-stone text-sm">Loading map…</span>
            </div>
          }
        >
          <MapView vendors={nearbyVendors} center={center} zoom={selectedLocation ? 11 : 5} markets={markets} />
        </Suspense>

        {selectedLocation && nearbyVendors.length === 0 && (
          <div className="absolute bottom-4 left-4 right-4 bg-cream/95 backdrop-blur-sm border border-parchment rounded-xl shadow-md px-4 py-2.5 flex items-center justify-between gap-3 z-[1000]">
            <p className="text-sm text-charcoal">
              <span className="font-medium">Nothing in {selectedLocation.name} yet.</span>{" "}
              <span className="text-stone">Try another area.</span>
            </p>
          </div>
        )}

        {/* Business count badge */}
        <div className="absolute bottom-4 left-4 z-[1000]">
          <div className="bg-white px-3 py-1.5 rounded-full shadow-md border border-parchment">
            <span className="text-xs font-medium text-charcoal">{nearbyVendors.length} businesses</span>
          </div>
        </div>
      </div>
    </div>
  );
}
