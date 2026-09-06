"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface MarketCreationFormProps {
  onCreated?: () => void;
}

export default function MarketCreationForm({ onCreated }: MarketCreationFormProps) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    address: "",
    city: "",
    radius: "500",
    activeDate: "",
    startTime: "08:00",
    endTime: "14:00",
  });
  const [error, setError] = useState("");

  if (!user || user.role !== "business") return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      // Geocode the address to get lat/lng
      const geoRes = await fetch(
        `/api/geocode?q=${encodeURIComponent(`${form.address}, ${form.city}`)}`
      );
      const geoData = await geoRes.json();
      const place = geoData.results?.[0];

      if (!place) {
        setError("Could not find that address. Try a more specific location.");
        setSaving(false);
        return;
      }

      const res = await fetch("/api/markets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          lat: place.lat,
          lng: place.lng,
          radius: parseInt(form.radius) || 500,
          activeDate: form.activeDate,
          startTime: form.startTime,
          endTime: form.endTime,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to create market");
        setSaving(false);
        return;
      }

      // Reset form
      setForm({ name: "", description: "", address: "", city: "", radius: "500", activeDate: "", startTime: "08:00", endTime: "14:00" });
      setOpen(false);
      onCreated?.();
    } catch {
      setError("Network error — try again");
    } finally {
      setSaving(false);
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full bg-cream border border-parchment rounded-2xl p-4 flex items-center gap-3 text-left hover:bg-ecru transition-colors"
      >
        <div className="w-10 h-10 bg-terracotta/10 rounded-xl flex items-center justify-center">
          <svg className="w-5 h-5 text-terracotta" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-charcoal">Create a Market Event</p>
          <p className="text-xs text-stone">Set up a farmers market, art walk, or food festival</p>
        </div>
      </button>
    );
  }

  return (
    <div className="bg-cream rounded-2xl border border-parchment p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-charcoal text-sm">New Market Event</h3>
        <button onClick={() => setOpen(false)} className="text-xs text-stone hover:text-charcoal">
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="text-xs font-semibold text-stone uppercase tracking-wider mb-1 block">Market Name</label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            placeholder="e.g., Ponce City Farmers Market"
            className="w-full px-4 py-2.5 input-field"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-stone uppercase tracking-wider mb-1 block">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            placeholder="What makes this market special?"
            rows={2}
            className="w-full px-4 py-2.5 input-field resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-stone uppercase tracking-wider mb-1 block">Address</label>
            <input
              type="text"
              required
              value={form.address}
              onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
              placeholder="Street address"
              className="w-full px-4 py-2.5 input-field"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-stone uppercase tracking-wider mb-1 block">City</label>
            <input
              type="text"
              required
              value={form.city}
              onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))}
              placeholder="City"
              className="w-full px-4 py-2.5 input-field"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-semibold text-stone uppercase tracking-wider mb-1 block">Date</label>
            <input
              type="date"
              required
              value={form.activeDate}
              onChange={(e) => setForm((p) => ({ ...p, activeDate: e.target.value }))}
              className="w-full px-4 py-2.5 input-field"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-stone uppercase tracking-wider mb-1 block">Start</label>
            <input
              type="time"
              value={form.startTime}
              onChange={(e) => setForm((p) => ({ ...p, startTime: e.target.value }))}
              className="w-full px-4 py-2.5 input-field"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-stone uppercase tracking-wider mb-1 block">End</label>
            <input
              type="time"
              value={form.endTime}
              onChange={(e) => setForm((p) => ({ ...p, endTime: e.target.value }))}
              className="w-full px-4 py-2.5 input-field"
            />
          </div>
        </div>

        {error && <p className="text-xs text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={saving || !form.name || !form.address || !form.city || !form.activeDate}
          className="w-full py-2.5 bg-terracotta text-white rounded-xl text-sm font-medium hover:bg-terracotta-dark transition-colors disabled:opacity-50"
        >
          {saving ? "Creating…" : "Create Market"}
        </button>
      </form>
    </div>
  );
}
