"use client";

import { useEffect, useState } from "react";
import { Vendor } from "@/types";

interface MapViewProps {
  vendors: Vendor[];
  center: [number, number];
  zoom?: number;
  radiusMiles?: number;
  centerLocation?: { lat: number; lng: number } | null;
}

export default function MapView({
  vendors,
  center,
  zoom = 12,
  radiusMiles,
  centerLocation,
}: MapViewProps) {
  const [mounted, setMounted] = useState(false);
  const [MapComponent, setMapComponent] = useState<React.ComponentType<MapViewProps> | null>(null);

  useEffect(() => {
    setMounted(true);
    import("./MapViewInner").then((mod) => {
      setMapComponent(() => mod.default);
    });
  }, []);

  if (!mounted || !MapComponent) {
    return (
      <div className="w-full h-full rounded-2xl overflow-hidden bg-ecru flex items-center justify-center">
        <div className="text-center">
          <svg className="w-8 h-8 mx-auto mb-2 text-stone" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75L3 9v11.25l6-2.25m0-11.25l6 2.25m-6-2.25v11.25m6-9L21 6v11.25l-6 2.25m0-11.25l-6 2.25m6 9V9" />
          </svg>
          <p className="text-sm font-medium text-stone">Loading map…</p>
        </div>
      </div>
    );
  }

  return <MapComponent vendors={vendors} center={center} zoom={zoom} radiusMiles={radiusMiles} centerLocation={centerLocation} />;
}
