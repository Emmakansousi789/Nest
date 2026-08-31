"use client";

import { useState } from "react";

interface DirectionsButtonProps {
  address: string;
  city: string;
  state: string;
  zip: string;
  lat: number;
  lng: number;
}

export default function DirectionsButton({
  address,
  city,
  state,
  zip,
  lat,
  lng,
}: DirectionsButtonProps) {
  const [open, setOpen] = useState(false);
  const fullAddress = `${address}, ${city}, ${state} ${zip}`;
  const encodedAddress = encodeURIComponent(fullAddress);

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}&travelmode=driving`;
  const appleMapsUrl = `https://maps.apple.com/?daddr=${encodedAddress}&dirflg=d`;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-3 text-sm text-stone hover:text-terracotta transition-colors w-full"
      >
        <div className="w-8 h-8 rounded-lg bg-linen border border-parchment flex items-center justify-center shrink-0">
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 6.75V15m6-6v8.25m.503 4.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z"
            />
          </svg>
        </div>
        <span>{fullAddress}</span>
      </button>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div
            className="relative bg-cream rounded-2xl shadow-xl max-w-sm w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-5 pt-5 pb-3">
              <h3 className="text-base font-semibold text-charcoal">
                Get Directions
              </h3>
              <p className="text-xs text-stone mt-1">
                {fullAddress}
              </p>
            </div>

            {/* Options */}
            <div className="px-3 pb-3 space-y-1">
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-medium text-charcoal">Google Maps</div>
                  <div className="text-xs text-stone">Open in browser</div>
                </div>
              </a>

              <a
                href={appleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.33-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.88 3.29.88 1.35 0 2.43-.92 3.97-.87 1.35.02 2.72.92 3.57 2.29-3.15 1.93-2.62 6.83.47 8.15 1.46.61 2.55 1.29 3.27 2.25-2.73 2.17-2.08 4.42.26 5.06 1.5.43 2.62-.36 3.52-.87-.66-1.63-1.58-3.33-1.74-4.64-.14-1.14.82-3.41 1.62-4.81z"/>
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-medium text-charcoal">Apple Maps</div>
                  <div className="text-xs text-stone">Open in Maps app</div>
                </div>
              </a>
            </div>

            {/* Close */}
            <div className="px-3 pb-3">
              <button
                onClick={() => setOpen(false)}
                className="w-full py-2.5 text-sm font-medium text-stone hover:text-charcoal rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
