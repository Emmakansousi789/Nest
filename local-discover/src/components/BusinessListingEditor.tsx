"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getVendorByOwner, updateVendor } from "@/data/store";
import { categories, allTags } from "@/data/vendors";
import { Vendor, VendorPhoto } from "@/types";
import PhotoManager from "./PhotoManager";

export default function BusinessListingEditor() {
  const { user } = useAuth();
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [saved, setSaved] = useState(false);

  const [availableMarkets, setAvailableMarkets] = useState<{ id: string; name: string; date: string }[]>([]);
  const [checkingIn, setCheckingIn] = useState(false);

  useEffect(() => {
    if (user) {
      const v = getVendorByOwner(user.id);
      if (v) setVendor({ ...v });
    }
  }, [user]);

  // Fetch available markets for the check-in dropdown
  useEffect(() => {
    async function fetchMarkets() {
      try {
        const res = await fetch("/api/markets");
        if (res.ok) {
          const data = await res.json();
          setAvailableMarkets(
            (data.markets || []).map((m: Record<string, unknown>) => ({
              id: m.id as string,
              name: m.name as string,
              date: m.activeDate as string,
            }))
          );
        }
      } catch { /* optional */ }
    }
    fetchMarkets();
  }, []);

  if (!vendor) {
    return (
      <div className="text-center py-16">
        <div className="state-icon state-icon-terracotta">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 9.75l1.5-4.5h15l1.5 4.5M3 9.75v9a1.5 1.5 0 001.5 1.5h15a1.5 1.5 0 001.5-1.5v-9M3 9.75h18M8.25 21v-6a1.5 1.5 0 011.5-1.5h4.5a1.5 1.5 0 011.5 1.5v6" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-charcoal mb-2">No listing yet</h3>
        <p className="text-sm text-stone max-w-sm mx-auto">
          Complete the onboarding to create your business listing.
        </p>
      </div>
    );
  }

  const handleSave = () => {
    updateVendor(vendor.id, vendor);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const update = (field: string, value: unknown) => {
    setVendor((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const dayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-charcoal">Edit Listing</h2>
        <button
          onClick={handleSave}
          className="btn-primary pressable"
        >
          {saved ? (
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              Saved!
            </span>
          ) : "Save Changes"}
        </button>
      </div>

      {/* Basic Info */}
      <section className="bg-cream rounded-2xl border border-parchment p-5 space-y-4">
        <h3 className="font-semibold text-charcoal text-sm">Basic Information</h3>
        <div>
          <label className="text-xs font-semibold text-stone uppercase tracking-wider mb-1.5 block">Business Name</label>
          <input
            type="text" value={vendor.name} onChange={(e) => update("name", e.target.value)}
            className="w-full px-4 py-2.5 input-field"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-stone uppercase tracking-wider mb-1.5 block">Tagline</label>
          <input
            type="text" value={vendor.tagline} onChange={(e) => update("tagline", e.target.value)}
            className="w-full px-4 py-2.5 input-field"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-stone uppercase tracking-wider mb-1.5 block">Story</label>
          <textarea
            value={vendor.story} onChange={(e) => update("story", e.target.value)} rows={4}
            className="w-full px-4 py-2.5 input-field resize-none"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-stone uppercase tracking-wider mb-1.5 block">Category</label>
          <select
            value={vendor.category} onChange={(e) => update("category", e.target.value)}
            className="w-full px-4 py-2.5 input-field"
          >
            {categories.map((c) => (
              <option key={c.value} value={c.value}>{c.icon} {c.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-stone uppercase tracking-wider mb-2 block">Tags</label>
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <button
                key={tag.value}
                type="button"
                onClick={() => {
                  const tags = vendor.tags.includes(tag.value)
                    ? vendor.tags.filter((t) => t !== tag.value)
                    : [...vendor.tags, tag.value];
                  update("tags", tags);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  vendor.tags.includes(tag.value) ? "bg-terracotta text-white" : "bg-ecru text-stone hover:bg-parchment"
                }`}
              >
                {tag.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Location Mode */}
      <section className="bg-cream rounded-2xl border border-parchment p-5 space-y-4">
        <h3 className="font-semibold text-charcoal text-sm">Location Mode</h3>
        <div className="flex gap-3">
          <button
            onClick={() => update("isPopUp", false)}
            className={`flex-1 p-4 rounded-xl border-2 transition-all ${
              !vendor.isPopUp ? "border-terracotta bg-terracotta/5" : "border-parchment bg-white hover:border-clay"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                !vendor.isPopUp ? "bg-terracotta text-white" : "bg-ecru text-stone"
              }`}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-medium text-charcoal text-sm">Permanent Storefront</p>
                <p className="text-xs text-stone">Fixed business location</p>
              </div>
            </div>
          </button>
          <button
            onClick={() => update("isPopUp", true)}
            className={`flex-1 p-4 rounded-xl border-2 transition-all ${
              vendor.isPopUp ? "border-terracotta bg-terracotta/5" : "border-parchment bg-white hover:border-clay"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                vendor.isPopUp ? "bg-terracotta text-white" : "bg-ecru text-stone"
              }`}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-medium text-charcoal text-sm">Pop-Up / Market</p>
                <p className="text-xs text-stone">Vendor at events</p>
              </div>
            </div>
          </button>
        </div>
      </section>

      {/* Location & Contact */}
      <section className="bg-cream rounded-2xl border border-parchment p-5 space-y-4">
        <h3 className="font-semibold text-charcoal text-sm">Location & Contact</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-stone uppercase tracking-wider mb-1.5 block">Address</label>
            <input type="text" value={vendor.address} onChange={(e) => update("address", e.target.value)}
              className="w-full px-4 py-2.5 input-field" />
          </div>
          <div>
            <label className="text-xs font-semibold text-stone uppercase tracking-wider mb-1.5 block">City</label>
            <input type="text" value={vendor.city} onChange={(e) => update("city", e.target.value)}
              className="w-full px-4 py-2.5 input-field" />
          </div>
          <div>
            <label className="text-xs font-semibold text-stone uppercase tracking-wider mb-1.5 block">Phone</label>
            <input type="tel" value={vendor.phone} onChange={(e) => update("phone", e.target.value)}
              className="w-full px-4 py-2.5 input-field" />
          </div>
          <div>
            <label className="text-xs font-semibold text-stone uppercase tracking-wider mb-1.5 block">Email</label>
            <input type="email" value={vendor.email} onChange={(e) => update("email", e.target.value)}
              className="w-full px-4 py-2.5 input-field" />
          </div>
          <div>
            <label className="text-xs font-semibold text-stone uppercase tracking-wider mb-1.5 block">Website</label>
            <input type="url" value={vendor.website || ""} onChange={(e) => update("website", e.target.value)}
              className="w-full px-4 py-2.5 input-field" />
          </div>
          <div>
            <label className="text-xs font-semibold text-stone uppercase tracking-wider mb-1.5 block">Instagram</label>
            <input type="text" value={vendor.instagram || ""} onChange={(e) => update("instagram", e.target.value)}
              placeholder="@username"
              className="w-full px-4 py-2.5 input-field" />
          </div>
        </div>
      </section>

      {/* Hours */}
      <section className="bg-cream rounded-2xl border border-parchment p-5 space-y-3">
        <h3 className="font-semibold text-charcoal text-sm">Hours</h3>
        {dayOrder.map((day) => {
          const hours = vendor.hours[day] || { open: "9:00 AM", close: "5:00 PM", closed: false };
          return (
            <div key={day} className="flex items-center gap-3 text-sm">
              <span className="w-24 text-stone font-medium">{day}</span>
              <label className="flex items-center gap-1.5 text-xs text-stone">
                <input
                  type="checkbox" checked={!!hours.closed}
                  onChange={(e) => {
                    const newHours = { ...vendor.hours, [day]: { ...hours, closed: e.target.checked } };
                    update("hours", newHours);
                  }}
                  className="rounded"
                />
                Closed
              </label>
              {!hours.closed && (
                <>
                  <input type="text" value={hours.open} onChange={(e) => {
                    const newHours = { ...vendor.hours, [day]: { ...hours, open: e.target.value } };
                    update("hours", newHours);
                  }} className="input-field !w-24 text-xs py-1 px-2" />
                  <span className="text-stone">–</span>
                  <input type="text" value={hours.close} onChange={(e) => {
                    const newHours = { ...vendor.hours, [day]: { ...hours, close: e.target.value } };
                    update("hours", newHours);
                  }} className="input-field !w-24 text-xs py-1 px-2" />
                </>
              )}
            </div>
          );
        })}
      </section>

      {/* Market Check-In (only shown for pop-up vendors) */}
      {vendor.isPopUp && (
        <section className="bg-cream rounded-2xl border border-parchment p-5 space-y-4">
          <h3 className="font-semibold text-charcoal text-sm">Market Check-In</h3>
          <p className="text-xs text-stone">
            Check in to a live market to broadcast your temporary location on the map.
          </p>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-stone uppercase tracking-wider block">Active Market</label>
            <select
              value={vendor.currentMarketId || ""}
              onChange={async (e) => {
                const marketId = e.target.value || null;
                setCheckingIn(true);
                try {
                  if (marketId) {
                    // Check in via API
                    const res = await fetch(`/api/vendors/${vendor.id}/market-checkin`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ marketId }),
                    });
                    if (res.ok) {
                      update("currentMarketId", marketId);
                      // Also update coordinates from the market
                      const market = availableMarkets.find((m) => m.id === marketId);
                      if (market) {
                        update("isPopUp", true);
                      }
                    }
                  } else {
                    // Check out via API
                    const res = await fetch(`/api/vendors/${vendor.id}/market-checkin`, {
                      method: "DELETE",
                    });
                    if (res.ok) {
                      update("currentMarketId", null);
                      update("isPopUp", false);
                    }
                  }
                } catch { /* network error — silently fail */ }
                setCheckingIn(false);
              }}
              disabled={checkingIn}
              className="w-full px-4 py-2.5 input-field"
            >
              <option value="">Not checked in</option>
              {availableMarkets.map((m) => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
            {checkingIn && (
              <p className="text-xs text-clay">Updating location…</p>
            )}
          </div>
          {vendor.currentMarketId && (
            <div className="flex items-center gap-2 p-3 bg-sage/10 rounded-xl">
              <div className="w-2 h-2 bg-sage rounded-full animate-pulse" />
              <span className="text-sm text-sage font-medium">Currently broadcasting at market</span>
            </div>
          )}
        </section>
      )}

      {/* Photos */}
      <section className="bg-cream rounded-2xl border border-parchment p-5 space-y-3">
        <h3 className="font-semibold text-charcoal text-sm">Photos ({vendor.photos.length})</h3>
        <p className="text-xs text-stone">
          Upload photos of your business, storefront, or products. First photo appears as the cover.
        </p>
        <PhotoManager
          vendorId={vendor.id}
          photos={vendor.photos}
          onPhotosChange={(photos: VendorPhoto[]) => update("photos", photos)}
        />
      </section>

      {/* Products */}
      <section className="bg-cream rounded-2xl border border-parchment p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-charcoal text-sm">Products ({vendor.products.length})</h3>
          <button
            onClick={() => {
              const newProduct = {
                id: `p-${Date.now()}`,
                name: "New Product",
                description: "Description",
                price: "",
                imageUrl: "",
                category: "General",
              };
              update("products", [...vendor.products, newProduct]);
            }}
            className="text-xs text-terracotta font-medium hover:text-terracotta-dark"
          >
            + Add Product
          </button>
        </div>
        {vendor.products.map((product, idx) => (
          <div key={product.id} className="flex gap-3 p-3 bg-ecru rounded-xl">
            <div className="flex-1 space-y-2">
              <input type="text" value={product.name}
                onChange={(e) => {
                  const products = [...vendor.products];
                  products[idx] = { ...products[idx], name: e.target.value };
                  update("products", products);
                }}
                className="w-full px-3 py-1.5 input-field" />
              <input type="text" value={product.description}
                onChange={(e) => {
                  const products = [...vendor.products];
                  products[idx] = { ...products[idx], description: e.target.value };
                  update("products", products);
                }}
                className="w-full px-3 py-1.5 input-field" />
              <div className="flex gap-2">
                <input type="text" value={product.price || ""} placeholder="Price"
                  onChange={(e) => {
                    const products = [...vendor.products];
                    products[idx] = { ...products[idx], price: e.target.value };
                    update("products", products);
                  }}
                  className="w-24 px-3 py-1.5 input-field text-xs" />
                <input type="text" value={product.category} placeholder="Category"
                  onChange={(e) => {
                    const products = [...vendor.products];
                    products[idx] = { ...products[idx], category: e.target.value };
                    update("products", products);
                  }}
                  className="flex-1 px-3 py-1.5 input-field text-xs" />
              </div>
            </div>
            <button
              onClick={() => {
                const products = vendor.products.filter((_, i) => i !== idx);
                update("products", products);
              }}
              className="self-start p-1 text-clay hover:text-red-500 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </section>
    </div>
  );
}
