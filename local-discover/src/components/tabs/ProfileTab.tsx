"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { getVendors } from "@/data/store";
import { getAllReviews } from "@/data/store";
import { getFavorites } from "@/lib/favorites";
import { categories } from "@/data/vendors";
import StarRating from "@/components/StarRating";
import PullToRefresh from "@/components/PullToRefresh";
import { HeartOutline, PersonOutline, StarOutline, ChevronRight, SettingsOutline, SignOutOutline } from "@/components/icons";

type ProfileView = "main" | "settings";

export default function ProfileTab() {
  const { user, logout } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [myReviews, setMyReviews] = useState<ReturnType<typeof getAllReviews>>([]);
  const [view, setView] = useState<ProfileView>("main");

  useEffect(() => {
    setMounted(true);
    setSavedIds(getFavorites());
    if (user) {
      const allReviews = getAllReviews();
      setMyReviews(allReviews.slice(0, 3));
    }
  }, [user]);

  const handleRefresh = useCallback(() => {
    return new Promise<void>((resolve) => {
      setSavedIds(getFavorites());
      if (user) {
        setMyReviews(getAllReviews().slice(0, 3));
      }
      setTimeout(resolve, 500);
    });
  }, [user]);

  if (!mounted) return null;

  // Settings view
  if (view === "settings") {
    return (
      <div className="flex-1 overflow-y-auto min-h-0 px-4 py-6 pb-24">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => setView("main")}
            className="w-8 h-8 rounded-xl bg-ecru flex items-center justify-center hover:bg-parchment transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1C1917" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <h2 className="font-serif text-xl font-semibold text-charcoal">Settings</h2>
        </div>

        <div className="space-y-3">
          {/* Account info */}
          <div className="bg-cream rounded-2xl border border-parchment p-5">
            <h3 className="text-sm font-semibold text-charcoal mb-4">Account</h3>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-semibold uppercase tracking-widest text-stone mb-1.5 block">Name</label>
                <input
                  type="text"
                  value={user?.name || "Demo User"}
                  readOnly
                  className="input-field"
                />
              </div>
              <div>
                <label className="text-[10px] font-semibold uppercase tracking-widest text-stone mb-1.5 block">Email</label>
                <input
                  type="email"
                  value={user?.email || "demo@localdiscover.com"}
                  readOnly
                  className="input-field"
                />
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-cream rounded-2xl border border-parchment p-5">
            <h3 className="text-sm font-semibold text-charcoal mb-4">Notifications</h3>
            <div className="space-y-3">
              {[
                { label: "New reviews on saved businesses", defaultChecked: true },
                { label: "Business updates from saved vendors", defaultChecked: true },
                { label: "Weekly discovery digest", defaultChecked: false },
              ].map((pref) => (
                <label key={pref.label} className="flex items-center justify-between py-1">
                  <span className="text-sm text-graphite">{pref.label}</span>
                  <div className="relative">
                    <input
                      type="checkbox"
                      defaultChecked={pref.defaultChecked}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-6 bg-parchment rounded-full peer-checked:bg-terracotta transition-colors" />
                    <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform peer-checked:translate-x-4" />
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Sign out */}
          <button
            onClick={logout}
            className="w-full bg-cream rounded-2xl border border-parchment p-4 flex items-center gap-3 text-left hover:bg-ecru transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-terracotta/10 flex items-center justify-center">
              <SignOutOutline size={20} className="text-terracotta" />
            </div>
            <span className="text-sm font-medium text-charcoal">Sign Out</span>
          </button>
        </div>
      </div>
    );
  }

  // Main profile view — not logged in
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <div className="w-16 h-16 rounded-2xl bg-ecru flex items-center justify-center mb-4">
          <PersonOutline size={32} className="text-charcoal" />
        </div>
        <h3 className="text-lg font-semibold text-charcoal mb-2">Your Profile</h3>
        <p className="text-sm text-stone text-center max-w-sm mb-5">
          Sign in to save favorites, leave reviews, and message businesses.
        </p>
        <p className="text-xs text-clay">
          Use the &ldquo;Sign In&rdquo; button in the header to get started.
        </p>
      </div>
    );
  }

  // Main profile view — logged in
  const savedVendors = getVendors().filter((v) => savedIds.includes(v.id));

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <div className="flex-1 overflow-y-auto min-h-0 px-4 py-6 space-y-6 pb-24">
        {/* User info */}
        <div className="bg-cream rounded-2xl border border-parchment p-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-terracotta/10 flex items-center justify-center text-xl font-bold text-terracotta">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-charcoal">{user.name}</h2>
              <p className="text-sm text-stone">{user.email}</p>
              <span className="inline-block mt-1 px-2 py-0.5 bg-terracotta/10 text-terracotta text-[10px] font-semibold rounded-full">
                {user.role === "business" ? "🏪 Business Owner" : "🛒 Customer"}
              </span>
            </div>
          </div>
        </div>

        {/* Saved businesses */}
        <section>
          <h3 className="text-sm font-semibold text-charcoal mb-3">
            Saved Businesses ({savedVendors.length})
          </h3>
          {savedVendors.length === 0 ? (
            <div className="text-center py-8 bg-cream rounded-2xl border border-parchment">
              <div className="w-12 h-12 mx-auto rounded-xl bg-terracotta/10 flex items-center justify-center mb-3">
                <HeartOutline size={24} className="text-terracotta" />
              </div>
              <p className="text-sm text-stone">No saved businesses yet. Tap the heart on any listing to save it.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {savedVendors.map((vendor) => {
                const cat = categories.find((c) => c.value === vendor.category);
                return (
                  <Link
                    key={vendor.id}
                    href={`/vendor/${vendor.id}`}
                    className="flex items-center gap-3 p-3 bg-cream rounded-2xl border border-parchment hover:border-terracotta/20 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-xl bg-ecru flex items-center justify-center text-lg shrink-0">
                      {cat?.icon || "🏪"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-semibold text-charcoal truncate">{vendor.name}</h4>
                      <p className="text-xs text-stone truncate">{vendor.city}, {vendor.state}</p>
                    </div>
                    <svg className="w-4 h-4 text-terracotta shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                    </svg>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* Recent activity */}
        <section>
          <h3 className="text-sm font-semibold text-charcoal mb-3">Recent Reviews</h3>
          {myReviews.length === 0 ? (
            <div className="text-center py-8 bg-cream rounded-2xl border border-parchment">
              <div className="w-12 h-12 mx-auto rounded-xl bg-terracotta/10 flex items-center justify-center mb-3">
                <StarOutline size={24} className="text-terracotta" />
              </div>
              <p className="text-sm text-stone">No reviews yet. Visit a business to leave one.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {myReviews.map((review) => (
                <div key={review.id} className="p-3 bg-cream rounded-2xl border border-parchment">
                  <div className="flex items-center gap-2 mb-1">
                    <StarRating value={review.rating} size="sm" readOnly />
                    <span className="text-xs text-stone">{new Date(review.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                  </div>
                  <p className="text-sm text-stone line-clamp-2">{review.text}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Settings entry */}
        <button
          onClick={() => setView("settings")}
          className="w-full bg-cream rounded-2xl border border-parchment p-4 flex items-center gap-3 text-left hover:bg-ecru transition-colors"
        >
          <div className="w-10 h-10 rounded-xl bg-ecru flex items-center justify-center">
            <SettingsOutline size={20} className="text-charcoal" />
          </div>
          <span className="flex-1 text-sm font-medium text-charcoal">Settings</span>
          <ChevronRight size={16} className="text-clay" />
        </button>
      </div>
    </PullToRefresh>
  );
}
