"use client";

import { useEffect, useRef } from "react";
import { Vendor } from "@/types";
import { categories } from "@/data/vendors";

interface MapViewProps {
  vendors: Vendor[];
  center: [number, number];
  zoom?: number;
  radiusMiles?: number;
  centerLocation?: { lat: number; lng: number } | null;
}

export default function MapViewInner({
  vendors,
  center,
  zoom = 12,
  radiusMiles,
  centerLocation,
}: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<unknown>(null);
  const versionRef = useRef(0);

  useEffect(() => {
    const el = mapRef.current;
    if (!el) return;

    if (mapInstanceRef.current) {
      (mapInstanceRef.current as { remove: () => void }).remove();
      mapInstanceRef.current = null;
    }

    const myVersion = ++versionRef.current;

    async function initMap() {
      const L = (await import("leaflet")).default;
      if (myVersion !== versionRef.current) return;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });

      const map = L.map(el!, {
        center,
        zoom,
        scrollWheelZoom: false,
        zoomControl: false,
      });

      L.control.zoom({ position: "bottomright" }).addTo(map);

      // Clean, warm-toned cartography (CartoDB Positron — no desaturation hack needed)
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
        {
          attribution:
            '&copy; <a href="https://openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
          maxZoom: 19,
          subdomains: "abcd",
        }
      ).addTo(map);

      // Minimalist pin marker
      const createPin = (color: string, label: string) =>
        L.divIcon({
          html: `<div style="display:flex;flex-direction:column;align-items:center">
            <div style="width:12px;height:12px;border-radius:50%;background:${color};border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.25)"></div>
            <div style="width:1px;height:6px;background:${color};opacity:0.4"></div>
            <div style="font-family:var(--font-sans);font-size:10px;font-weight:600;color:#1C1917;white-space:nowrap;max-width:90px;overflow:hidden;text-overflow:ellipsis;letter-spacing:0.02em">${label}</div>
          </div>`,
          className: "",
          iconSize: [100, 40],
          iconAnchor: [50, 36],
          popupAnchor: [0, -20],
        });

      // Category → color mapping (muted, editorial)
      const catColors: Record<string, string> = {
        "farmers-market": "#4A6B5B",
        "food-producer": "#C84B31",
        maker: "#9A3412",
        retail: "#44403C",
        services: "#78716C",
        artisan: "#C84B31",
        wellness: "#4A6B5B",
      };

      vendors.forEach((vendor) => {
        const category = categories.find((c) => c.value === vendor.category);
        const color = catColors[vendor.category] || "#44403C";
        const pin = createPin(color, vendor.name);

        const marker = L.marker([vendor.lat, vendor.lng], { icon: pin }).addTo(
          map
        );

        const tagBadges = vendor.tags
          .slice(0, 2)
          .map(
            (t) =>
              `<span style="font-family:var(--font-sans);font-size:9px;letter-spacing:0.05em;text-transform:uppercase;color:#78716C;border:1px solid #E8E3DA;padding:1px 5px;display:inline-block;margin:1px">${t.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}</span>`
          )
          .join("");

        const productCount = vendor.products.length;

        marker.bindPopup(
          `<div style="padding:0;min-width:200px;max-width:260px;background:#FEFDFB;border:1px solid #E8E3DA">
            <div style="padding:14px 14px 12px">
              <div style="font-family:var(--font-sans);font-size:9px;letter-spacing:0.1em;text-transform:uppercase;color:#C84B31;font-weight:600;margin-bottom:4px">${category?.label || vendor.category}</div>
              <div style="font-family:var(--font-serif);font-size:16px;font-weight:600;color:#1C1917;margin-bottom:2px;line-height:1.3">${vendor.name}</div>
              <div style="font-family:var(--font-sans);font-size:11px;color:#78716C;margin-bottom:8px;line-height:1.4">${vendor.tagline}</div>
              <div style="margin-bottom:8px">${tagBadges}</div>
              <div style="display:flex;justify-content:space-between;align-items:center;padding-top:8px;border-top:1px solid #E8E3DA">
                <span style="font-family:var(--font-sans);font-size:11px;color:#A8A29E">${productCount} product${productCount !== 1 ? "s" : ""} · ${vendor.city}</span>
                <a href="/vendor/${vendor.id}" style="font-family:var(--font-sans);font-size:11px;font-weight:600;color:#C84B31;text-decoration:none">View →</a>
              </div>
            </div>
          </div>`,
          { closeButton: false, maxWidth: 280, className: "vendor-map-popup" }
        );
      });

      // Radius circle
      if (centerLocation && radiusMiles && radiusMiles < 9999) {
        const radiusMeters = radiusMiles * 1609.34;
        L.circle([centerLocation.lat, centerLocation.lng], {
          radius: radiusMeters,
          color: "#C84B31",
          fillColor: "#C84B31",
          fillOpacity: 0.04,
          weight: 1.5,
          dashArray: "4, 4",
        }).addTo(map);

        const centerIcon = L.divIcon({
          html: `<div style="width:10px;height:10px;border-radius:50%;background:#C84B31;border:2px solid white;box-shadow:0 1px 6px rgba(0,0,0,0.3)"></div>`,
          className: "",
          iconSize: [10, 10],
          iconAnchor: [5, 5],
        });
        L.marker([centerLocation.lat, centerLocation.lng], {
          icon: centerIcon,
        }).addTo(map);

        const circleBounds = L.circle(
          [centerLocation.lat, centerLocation.lng],
          { radius: radiusMeters }
        ).getBounds();
        map.fitBounds(circleBounds, { padding: [40, 40], maxZoom: 14 });
      } else if (vendors.length > 0) {
        const bounds = L.latLngBounds(
          vendors.map((v) => [v.lat, v.lng] as [number, number])
        );
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
      }

      mapInstanceRef.current = map;
    }

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        (mapInstanceRef.current as { remove: () => void }).remove();
        mapInstanceRef.current = null;
      }
    };
  }, [vendors, center, zoom, radiusMiles, centerLocation]);

  return (
    <div
      ref={mapRef}
      className="w-full h-full min-h-[300px]"
      style={{ zIndex: 0 }}
    />
  );
}
