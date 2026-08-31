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
      <div className="w-full h-full rounded-2xl overflow-hidden bg-gradient-to-br from-primary-light via-emerald-100 to-emerald-200 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-2">🗺️</div>
          <p className="text-sm font-medium text-terracotta-dark/60">Loading map…</p>
        </div>
      </div>
    );
  }

  return <MapComponent vendors={vendors} center={center} zoom={zoom} radiusMiles={radiusMiles} centerLocation={centerLocation} />;
}
