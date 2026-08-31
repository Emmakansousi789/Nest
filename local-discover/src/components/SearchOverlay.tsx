"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { getVendors } from "@/data/store";
import { categories } from "@/data/vendors";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const results =
    query.length >= 2
      ? getVendors().filter((v) => {
          const q = query.toLowerCase();
          return (
            v.name.toLowerCase().includes(q) ||
            v.tagline.toLowerCase().includes(q) ||
            v.story.toLowerCase().includes(q) ||
            v.city.toLowerCase().includes(q) ||
            v.category.toLowerCase().includes(q) ||
            v.tags.some((t) => t.toLowerCase().includes(q)) ||
            v.products.some(
              (p) =>
                p.name.toLowerCase().includes(q) ||
                p.description.toLowerCase().includes(q) ||
                p.category.toLowerCase().includes(q)
            )
          );
        })
      : [];

  const popular = getVendors().slice(0, 6);

  return (
    <div className="fixed inset-0 z-50 bg-linen flex flex-col">
      {/* Search bar */}
      <div className="border-b border-parchment px-4 sm:px-6 py-4 flex items-center gap-3">
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-full text-stone hover:text-charcoal hover:bg-ecru transition-all duration-200 pressable focus-ring"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search businesses, products, cities..."
          className="flex-1 bg-transparent border-b-2 border-charcoal/15 focus:border-charcoal py-1.5 text-base text-charcoal placeholder:text-clay outline-none transition-colors font-sans"
        />
        {query.length > 0 && (
          <button
            onClick={() => setQuery("")}
            className="w-6 h-6 flex items-center justify-center rounded-full bg-parchment text-stone hover:bg-charcoal/10 transition-colors pressable"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        {query.length < 2 ? (
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-stone mb-4">
              Popular businesses
            </p>
            <div className="space-y-0">
              {popular.map((vendor) => {
                const category = categories.find((c) => c.value === vendor.category);
                return (
                  <Link
                    key={vendor.id}
                    href={`/vendor/${vendor.id}`}
                    onClick={onClose}
                    className="flex items-center gap-3 py-3 border-b border-parchment hover:bg-ecru/50 active:bg-ecru transition-colors -mx-4 px-4 pressable"
                  >
                    <span className="text-lg">{category?.icon || "🏪"}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-charcoal truncate">{vendor.name}</p>
                      <p className="text-xs text-stone truncate">{vendor.tagline}</p>
                    </div>
                    <span className="text-xs text-clay shrink-0">{vendor.city}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ) : results.length > 0 ? (
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-stone mb-4">
              {results.length} result{results.length !== 1 ? "s" : ""}
            </p>
            <div className="space-y-0">
              {results.map((vendor) => {
                const category = categories.find((c) => c.value === vendor.category);
                return (
                  <Link
                    key={vendor.id}
                    href={`/vendor/${vendor.id}`}
                    onClick={onClose}
                    className="flex items-center gap-3 py-3 border-b border-parchment hover:bg-ecru/50 active:bg-ecru transition-colors -mx-4 px-4 pressable"
                  >
                    <span className="text-lg">{category?.icon || "🏪"}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-charcoal truncate">{vendor.name}</p>
                      <p className="text-xs text-stone truncate">{vendor.tagline}</p>
                    </div>
                    <span className="text-xs text-clay shrink-0">{vendor.city}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="state-icon state-icon-stone mx-auto">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-charcoal mb-1">No results found</p>
            <p className="text-xs text-stone">No businesses match &ldquo;{query}&rdquo;</p>
          </div>
        )}
      </div>
    </div>
  );
}
