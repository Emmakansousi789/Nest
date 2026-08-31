"use client";

import { useState } from "react";
import { searchLocations } from "@/data/locations";
import { categories, allTags } from "@/data/vendors";
import { BusinessCategory, BusinessTag } from "@/types";

interface FilterSheetProps {
  isOpen: boolean;
  onClose: () => void;
  locationQuery: string;
  onLocationQueryChange: (q: string) => void;
  onLocationSelect: (loc: { lat: number; lng: number; name: string; state?: string }) => void;
  selectedLocation: { lat: number; lng: number; name: string } | null;
  radius: number;
  onRadiusChange: (r: number) => void;
  activeCategory: BusinessCategory | "all";
  onCategoryChange: (c: BusinessCategory | "all") => void;
  activeTags: BusinessTag[];
  onTagToggle: (t: BusinessTag) => void;
  sortMode: string;
  onSortChange: (s: string) => void;
  viewMode: string;
  onViewChange: (v: string) => void;
  onClearAll: () => void;
  hasActiveFilters: boolean;
  filterCount: number;
}

export default function FilterSheet({
  isOpen,
  onClose,
  locationQuery,
  onLocationQueryChange,
  onLocationSelect,
  selectedLocation,
  radius,
  onRadiusChange,
  activeCategory,
  onCategoryChange,
  activeTags,
  onTagToggle,
  sortMode,
  onSortChange,
  onClearAll,
  hasActiveFilters,
}: FilterSheetProps) {
  const [locQuery, setLocQuery] = useState(locationQuery);
  const locResults = locQuery.length >= 2 ? searchLocations(locQuery).slice(0, 5) : [];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 sheet-backdrop flex items-end sm:items-center justify-center" onClick={onClose}>
      <div
        className="bg-cream w-full max-w-lg sm:mx-4 max-h-[85vh] overflow-y-auto border border-parchment rounded-t-2xl sm:rounded-2xl shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-cream border-b border-parchment px-6 py-4 flex items-center justify-between rounded-t-2xl sm:rounded-t-2xl">
          <h3 className="font-serif text-lg font-semibold text-charcoal">Filters</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-clay hover:text-charcoal hover:bg-ecru transition-all duration-200 pressable focus-ring"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Location */}
          <div>
            <label className="text-[10px] font-semibold uppercase tracking-widest text-stone mb-2 block">
              Location
            </label>
            <input
              type="text"
              value={locQuery}
              onChange={(e) => {
                setLocQuery(e.target.value);
                onLocationQueryChange(e.target.value);
              }}
              placeholder="Search city or state..."
              className="input-field"
            />
            {locResults.length > 0 && (
              <div className="mt-2 border border-parchment rounded-xl overflow-hidden">
                {locResults.map((loc) => (
                  <button
                    key={`${loc.name}-${loc.state}`}
                    onClick={() => {
                      onLocationSelect(loc);
                      setLocQuery(`${loc.name}, ${loc.state}`);
                    }}
                    className="w-full text-left px-4 py-2.5 hover:bg-ecru active:bg-parchment transition-colors text-sm flex items-center gap-2 border-b border-parchment last:border-0 pressable"
                  >
                    <span className="text-stone text-xs">→</span>
                    <span className="font-medium text-charcoal">{loc.name}</span>
                    <span className="text-clay">, {loc.state}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Radius */}
            {selectedLocation && (
              <div className="mt-4">
                <label className="text-[10px] font-semibold uppercase tracking-widest text-stone mb-2 block">
                  Radius
                </label>
                <div className="flex gap-0 border border-parchment rounded-xl overflow-hidden">
                  {[1, 3, 5, 10, 25, 50, 9999].map((r) => (
                    <button
                      key={r}
                      onClick={() => onRadiusChange(r)}
                      className={`flex-1 py-2 text-xs font-medium transition-all duration-200 pressable ${
                        radius === r
                          ? "bg-charcoal text-cream"
                          : "bg-transparent text-graphite hover:bg-ecru"
                      } border-r border-parchment last:border-r-0`}
                    >
                      {r >= 9999 ? "Any" : `${r}`}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="text-[10px] font-semibold uppercase tracking-widest text-stone mb-2 block">
              Category
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => onCategoryChange("all")}
                className={`px-3.5 py-1.5 text-xs font-medium transition-all duration-200 border rounded-full pressable ${
                  activeCategory === "all"
                    ? "bg-charcoal text-cream border-charcoal"
                    : "bg-transparent text-graphite border-parchment hover:border-charcoal/30"
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => onCategoryChange(cat.value)}
                  className={`px-3.5 py-1.5 text-xs font-medium transition-all duration-200 border rounded-full flex items-center gap-1 pressable ${
                    activeCategory === cat.value
                      ? "bg-charcoal text-cream border-charcoal"
                      : "bg-transparent text-graphite border-parchment hover:border-charcoal/30"
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="text-[10px] font-semibold uppercase tracking-widest text-stone mb-2 block">
              Identity & Values
            </label>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <button
                  key={tag.value}
                  onClick={() => onTagToggle(tag.value)}
                  className={`px-3.5 py-1.5 text-xs font-medium transition-all duration-200 border rounded-full pressable ${
                    activeTags.includes(tag.value)
                      ? "bg-terracotta text-white border-terracotta"
                      : "bg-transparent text-graphite border-parchment hover:border-charcoal/30"
                  }`}
                >
                  {tag.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sort */}
          <div>
            <label className="text-[10px] font-semibold uppercase tracking-widest text-stone mb-2 block">
              Sort By
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { value: "featured", label: "Featured" },
                { value: "newest", label: "Newest" },
                { value: "alpha", label: "A–Z" },
                { value: "distance", label: "Distance" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => onSortChange(opt.value)}
                  className={`px-3.5 py-1.5 text-xs font-medium transition-all duration-200 border rounded-full pressable ${
                    sortMode === opt.value
                      ? "bg-charcoal text-cream border-charcoal"
                      : "bg-transparent text-graphite border-parchment hover:border-charcoal/30"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-cream border-t border-parchment px-6 py-4 flex items-center gap-3 rounded-b-2xl sm:rounded-b-2xl">
          {hasActiveFilters && (
            <button
              onClick={() => { onClearAll(); setLocQuery(""); }}
              className="btn-ghost text-terracotta hover:text-terracotta-dark"
            >
              Clear all
            </button>
          )}
          <button
            onClick={onClose}
            className="flex-1 py-2.5 btn-primary justify-center"
          >
            Show results
          </button>
        </div>
      </div>
    </div>
  );
}
