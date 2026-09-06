"use client";

import { useState } from "react";
import { categories, allTags } from "@/data/vendors";
import type { BusinessCategory } from "@/types";

interface VendorOnboardingProps {
  onComplete: () => void;
}

export default function VendorOnboarding({ onComplete }: VendorOnboardingProps) {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [story, setStory] = useState("");
  const [category, setCategory] = useState<BusinessCategory>("services");
  const [tags, setTags] = useState<string[]>([]);
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [instagram, setInstagram] = useState("");

  const steps = [
    { title: "Business basics", subtitle: "Name and describe your business" },
    { title: "Category & identity", subtitle: "Help customers find you" },
    { title: "Location & contact", subtitle: "Where can customers reach you?" },
  ];

  const toggleTag = (tag: string) => {
    setTags((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]);
  };

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/submit-vendor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name, tagline, story, category, tags,
          address, city, state, zip, lat: 0, lng: 0,
          phone, email, website: website || null, instagram: instagram || null,
          hours: {},
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to create listing");
        return;
      }

      onComplete();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const canProceed = () => {
    if (step === 0) return name.trim().length > 0;
    if (step === 1) return true;
    if (step === 2) return city.trim().length > 0 && email.trim().length > 0;
    return false;
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-28">
      {/* Progress */}
      <div className="flex items-center gap-2 mb-8">
        {steps.map((s, i) => (
          <div key={i} className="flex-1">
            <div className={`h-1 rounded-full transition-colors ${i <= step ? "bg-terracotta" : "bg-parchment"}`} />
            <p className={`text-[10px] mt-1 ${i === step ? "text-charcoal font-medium" : "text-stone"}`}>{s.title}</p>
          </div>
        ))}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Step 0: Business basics */}
      {step === 0 && (
        <div className="space-y-5">
          <div>
            <h2 className="text-xl font-bold text-charcoal mb-1">What&apos;s your business called?</h2>
            <p className="text-sm text-stone">This is the name customers will see.</p>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-stone mb-1.5 block">Business name *</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sunnyside Family Farms"
              className="input-field" autoFocus />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-stone mb-1.5 block">Tagline</label>
            <input type="text" value={tagline} onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. Three generations of organic goodness"
              className="input-field" />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-stone mb-1.5 block">Your story</label>
            <textarea value={story} onChange={(e) => setStory(e.target.value)} rows={4}
              placeholder="Tell customers what makes your business special…"
              className="input-field resize-none" />
          </div>
        </div>
      )}

      {/* Step 1: Category & tags */}
      {step === 1 && (
        <div className="space-y-5">
          <div>
            <h2 className="text-xl font-bold text-charcoal mb-1">Category & identity</h2>
            <p className="text-sm text-stone">Help customers discover you.</p>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-stone mb-2 block">Category *</label>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((cat) => (
                <button key={cat.value} type="button" onClick={() => setCategory(cat.value)}
                  className={`flex items-center gap-2 p-3 rounded-xl border text-sm text-left transition-all ${
                    category === cat.value
                      ? "border-terracotta bg-terracotta/5 text-charcoal font-medium"
                      : "border-parchment hover:border-clay text-stone"
                  }`}>
                  <span className="text-lg">{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-stone mb-2 block">Identity tags</label>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <button key={tag.value} type="button" onClick={() => toggleTag(tag.value)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    tags.includes(tag.value)
                      ? "bg-terracotta text-white"
                      : "bg-ecru text-stone hover:bg-parchment"
                  }`}>
                  {tag.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Location & contact */}
      {step === 2 && (
        <div className="space-y-5">
          <div>
            <h2 className="text-xl font-bold text-charcoal mb-1">Location & contact</h2>
            <p className="text-sm text-stone">How can customers find and reach you?</p>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-stone mb-1.5 block">Street address</label>
            <input type="text" value={address} onChange={(e) => setAddress(e.target.value)}
              placeholder="123 Main St" className="input-field" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-stone mb-1.5 block">City *</label>
              <input type="text" value={city} onChange={(e) => setCity(e.target.value)}
                placeholder="Atlanta" className="input-field" />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-stone mb-1.5 block">State</label>
              <input type="text" value={state} onChange={(e) => setState(e.target.value)}
                placeholder="GA" className="input-field" />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-stone mb-1.5 block">ZIP</label>
              <input type="text" value={zip} onChange={(e) => setZip(e.target.value)}
                placeholder="30301" className="input-field" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-stone mb-1.5 block">Phone</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                placeholder="(404) 555-0100" className="input-field" />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-stone mb-1.5 block">Email *</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="hello@business.com" className="input-field" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-stone mb-1.5 block">Website</label>
              <input type="url" value={website} onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://..." className="input-field" />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-stone mb-1.5 block">Instagram</label>
              <input type="text" value={instagram} onChange={(e) => setInstagram(e.target.value)}
                placeholder="@username" className="input-field" />
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-3 mt-8">
        {step > 0 && (
          <button onClick={() => setStep((s) => s - 1)}
            className="px-5 py-3 border border-parchment text-charcoal rounded-xl text-sm font-medium hover:bg-ecru transition-colors">
            Back
          </button>
        )}
        <button
          onClick={() => step < steps.length - 1 ? setStep((s) => s + 1) : handleSubmit()}
          disabled={!canProceed() || loading}
          className="flex-1 px-5 py-3 bg-terracotta text-white rounded-xl text-sm font-medium hover:bg-terracotta-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="spinner !w-4 !h-4 !border-2 !border-white/30 !border-t-white" />
              Creating…
            </span>
          ) : step < steps.length - 1 ? "Continue" : "Create Listing"}
        </button>
      </div>
    </div>
  );
}
