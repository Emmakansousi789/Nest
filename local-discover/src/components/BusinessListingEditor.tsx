"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getVendorByOwner, updateVendor } from "@/data/store";
import { categories, allTags } from "@/data/vendors";
import { Vendor, BusinessCategory, BusinessTag } from "@/types";

export default function BusinessListingEditor() {
  const { user } = useAuth();
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user) {
      const v = getVendorByOwner(user.id);
      if (v) setVendor({ ...v });
    }
  }, [user]);

  if (!vendor) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-3">🏪</div>
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
          className="px-5 py-2 bg-terracotta text-white rounded-xl text-sm font-medium hover:bg-terracotta-dark transition-colors"
        >
          {saved ? "✓ Saved!" : "Save Changes"}
        </button>
      </div>

      {/* Basic Info */}
      <section className="bg-cream rounded-2xl border border-parchment p-5 space-y-4">
        <h3 className="font-semibold text-charcoal text-sm">Basic Information</h3>
        <div>
          <label className="text-xs font-semibold text-stone uppercase tracking-wider mb-1.5 block">Business Name</label>
          <input
            type="text" value={vendor.name} onChange={(e) => update("name", e.target.value)}
            className="w-full px-4 py-2.5 bg-gray-100 rounded-xl text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-stone uppercase tracking-wider mb-1.5 block">Tagline</label>
          <input
            type="text" value={vendor.tagline} onChange={(e) => update("tagline", e.target.value)}
            className="w-full px-4 py-2.5 bg-gray-100 rounded-xl text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-stone uppercase tracking-wider mb-1.5 block">Story</label>
          <textarea
            value={vendor.story} onChange={(e) => update("story", e.target.value)} rows={4}
            className="w-full px-4 py-2.5 bg-gray-100 rounded-xl text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-stone uppercase tracking-wider mb-1.5 block">Category</label>
          <select
            value={vendor.category} onChange={(e) => update("category", e.target.value)}
            className="w-full px-4 py-2.5 bg-gray-100 rounded-xl text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-primary/20"
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
                  vendor.tags.includes(tag.value) ? "bg-terracotta text-white" : "bg-gray-100 text-stone hover:bg-gray-200"
                }`}
              >
                {tag.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Location & Contact */}
      <section className="bg-cream rounded-2xl border border-parchment p-5 space-y-4">
        <h3 className="font-semibold text-charcoal text-sm">Location & Contact</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-stone uppercase tracking-wider mb-1.5 block">Address</label>
            <input type="text" value={vendor.address} onChange={(e) => update("address", e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-100 rounded-xl text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
          <div>
            <label className="text-xs font-semibold text-stone uppercase tracking-wider mb-1.5 block">City</label>
            <input type="text" value={vendor.city} onChange={(e) => update("city", e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-100 rounded-xl text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
          <div>
            <label className="text-xs font-semibold text-stone uppercase tracking-wider mb-1.5 block">Phone</label>
            <input type="tel" value={vendor.phone} onChange={(e) => update("phone", e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-100 rounded-xl text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
          <div>
            <label className="text-xs font-semibold text-stone uppercase tracking-wider mb-1.5 block">Email</label>
            <input type="email" value={vendor.email} onChange={(e) => update("email", e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-100 rounded-xl text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
          <div>
            <label className="text-xs font-semibold text-stone uppercase tracking-wider mb-1.5 block">Website</label>
            <input type="url" value={vendor.website || ""} onChange={(e) => update("website", e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-100 rounded-xl text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
          <div>
            <label className="text-xs font-semibold text-stone uppercase tracking-wider mb-1.5 block">Instagram</label>
            <input type="text" value={vendor.instagram || ""} onChange={(e) => update("instagram", e.target.value)}
              placeholder="@username"
              className="w-full px-4 py-2.5 bg-gray-100 rounded-xl text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-primary/20" />
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
                  className="w-24 px-3 py-1.5 bg-white rounded-lg text-xs text-charcoal border border-gray-200 focus:outline-none" />
                <input type="text" value={product.category} placeholder="Category"
                  onChange={(e) => {
                    const products = [...vendor.products];
                    products[idx] = { ...products[idx], category: e.target.value };
                    update("products", products);
                  }}
                  className="flex-1 px-3 py-1.5 bg-white rounded-lg text-xs text-charcoal border border-gray-200 focus:outline-none" />
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
