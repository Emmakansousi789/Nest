"use client";

import { useEffect, useRef } from "react";
import { Vendor } from "@/types";
import { categories } from "@/data/vendors";

/** HTML-escape vendor-supplied text to prevent stored XSS via Leaflet popups/divIcons */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

interface MarketHotspot {
  id: string;
  name: string;
  lat: number;
  lng: number;
  radius: number;
  checkInCount?: number;
}

interface MapViewProps {
  vendors: Vendor[];
  center: [number, number];
  zoom?: number;
  radiusMiles?: number;
  centerLocation?: { lat: number; lng: number } | null;
  markets?: MarketHotspot[];
}

export default function MapViewInner({
  vendors,
  center,
  zoom = 12,
  radiusMiles,
  centerLocation,
  markets = [],
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

      // Esri World Light Gray Canvas — free, no API key required
      L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}",
        {
          attribution: "Tiles &copy; Esri — Esri, DeLorme, NAVTEQ",
          maxZoom: 16,
        }
      ).addTo(map);

      // Labels layer (city/road names) on top of the base
      L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}",
        { maxZoom: 16 }
      ).addTo(map);

      // Minimalist pin marker — label only shows once zoomed in far enough to avoid overlap
      const createPin = (color: string, label: string) =>
        L.divIcon({
          html: `<div style="display:flex;flex-direction:column;align-items:center">
            <div style="width:12px;height:12px;border-radius:50%;background:${color};border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.25)"></div>
            <div style="width:1px;height:6px;background:${color};opacity:0.4"></div>
            <div class="marker-label" style="display:none;font-family:var(--font-sans);font-size:10px;font-weight:600;color:#1C1917;white-space:nowrap;max-width:90px;overflow:hidden;text-overflow:ellipsis;letter-spacing:0.02em">${label}</div>
          </div>`,
          className: "",
          iconSize: [100, 40],
          iconAnchor: [50, 36],
          popupAnchor: [0, -20],
        });

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
        const pin = createPin(color, escapeHtml(vendor.name));

        const marker = L.marker([vendor.lat, vendor.lng], { icon: pin }).addTo(map);

        const tagBadges = vendor.tags
          .slice(0, 2)
          .map(
            (t) =>
              `<span style="font-family:var(--font-sans);font-size:9px;letter-spacing:0.05em;text-transform:uppercase;color:#78716C;border:1px solid #E8E3DA;padding:1px 5px;display:inline-block;margin:1px">${escapeHtml(t.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()))}</span>`
          )
          .join("");

        const productCount = vendor.products.length;

        marker.bindPopup(
          `<div style="padding:0;min-width:200px;max-width:260px;background:#FEFDFB;border:1px solid #E8E3DA">
            <div style="padding:14px 14px 12px">
              <div style="font-family:var(--font-sans);font-size:9px;letter-spacing:0.1em;text-transform:uppercase;color:#C84B31;font-weight:600;margin-bottom:4px">${escapeHtml(category?.label || vendor.category)}</div>
              <div style="font-family:var(--font-serif);font-size:16px;font-weight:600;color:#1C1917;margin-bottom:2px;line-height:1.3">${escapeHtml(vendor.name)}</div>
              <div style="font-family:var(--font-sans);font-size:11px;color:#78716C;margin-bottom:8px;line-height:1.4">${escapeHtml(vendor.tagline)}</div>
              <div style="margin-bottom:8px">${tagBadges}</div>
              <div style="display:flex;justify-content:space-between;align-items:center;padding-top:8px;border-top:1px solid #E8E3DA">
                <span style="font-family:var(--font-sans);font-size:11px;color:#A8A29E">${productCount} product${productCount !== 1 ? "s" : ""} · ${escapeHtml(vendor.city)}</span>
                <a href="/vendor/${escapeHtml(vendor.id)}" style="font-family:var(--font-sans);font-size:11px;font-weight:600;color:#C84B31;text-decoration:none">View →</a>
              </div>
            </div>
          </div>`,
          { closeButton: false, maxWidth: 280, className: "vendor-map-popup" }
        );
      });

      // ─── Market Hotspot Overlays ───
      markets.forEach((market) => {
        const checkIns = market.checkInCount || 0;
        const pulseRadius = Math.max(200, Math.min(600, market.radius + checkIns * 50));

        // Glowing pulsating circle
        const hotspotCircle = L.circle([market.lat, market.lng], {
          radius: pulseRadius,
          color: "#C84B31",
          fillColor: "#C84B31",
          fillOpacity: 0.08 + Math.min(checkIns * 0.02, 0.12),
          weight: 1.5,
          dashArray: "6, 4",
          className: "market-hotspot-pulse",
        }).addTo(map);

        // Inner glow ring
        L.circle([market.lat, market.lng], {
          radius: pulseRadius * 0.5,
          color: "#C84B31",
          fillColor: "#C84B31",
          fillOpacity: 0.12 + Math.min(checkIns * 0.03, 0.15),
          weight: 1,
          opacity: 0.5,
        }).addTo(map);

        // Market label icon
        const marketIcon = L.divIcon({
          html: `<div style="display:flex;flex-direction:column;align-items:center;pointer-events:none">
            <div style="background:#C84B31;color:white;font-family:var(--font-sans);font-size:9px;font-weight:700;letter-spacing:0.05em;padding:3px 8px;border-radius:999px;white-space:nowrap;box-shadow:0 2px 8px rgba(200,75,49,0.35)">${escapeHtml(market.name)}</div>
            ${checkIns > 0 ? `<div style="font-family:var(--font-sans);font-size:9px;color:#C84B31;font-weight:600;margin-top:2px">${checkIns} vendor${checkIns !== 1 ? "s" : ""} here</div>` : ""}
          </div>`,
          className: "",
          iconSize: [120, 30],
          iconAnchor: [60, 15],
        });
        L.marker([market.lat, market.lng], { icon: marketIcon, interactive: false }).addTo(map);

        // Popup for market
        hotspotCircle.bindPopup(
          `<div style="padding:12px;min-width:180px;background:#FEFDFB;border:1px solid #E8E3DA">
            <div style="font-family:var(--font-sans);font-size:9px;letter-spacing:0.1em;text-transform:uppercase;color:#C84B31;font-weight:600;margin-bottom:4px">📍 Market Hotspot</div>
            <div style="font-family:var(--font-serif);font-size:15px;font-weight:600;color:#1C1917;margin-bottom:4px">${escapeHtml(market.name)}</div>
            <div style="font-family:var(--font-sans);font-size:11px;color:#78716C">${checkIns} vendor${checkIns !== 1 ? "s" : ""} checked in</div>
          </div>`,
          { closeButton: false, maxWidth: 240, className: "vendor-map-popup" }
        );
      });

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
        L.marker([centerLocation.lat, centerLocation.lng], { icon: centerIcon }).addTo(map);

        const circleBounds = L.circle([centerLocation.lat, centerLocation.lng], {
          radius: radiusMeters,
        }).getBounds();
        map.fitBounds(circleBounds, { padding: [40, 40], maxZoom: 14 });
      } else if (vendors.length > 0) {
        const bounds = L.latLngBounds(vendors.map((v) => [v.lat, v.lng] as [number, number]));
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
      }

      const updateLabelVisibility = () => {
        const show = map.getZoom() >= 8;
        el!.querySelectorAll<HTMLElement>(".marker-label").forEach((n) => {
          n.style.display = show ? "block" : "none";
        });
      };
      map.on("zoomend", updateLabelVisibility);
      updateLabelVisibility();

      mapInstanceRef.current = map;
    }

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        (mapInstanceRef.current as { remove: () => void }).remove();
        mapInstanceRef.current = null;
      }
    };
  }, [vendors, center, zoom, radiusMiles, centerLocation, markets]);

  return <div ref={mapRef} className="w-full h-full min-h-[300px]" style={{ zIndex: 0 }} />;
}
