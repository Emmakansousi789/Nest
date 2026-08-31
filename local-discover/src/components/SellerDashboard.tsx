"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getVendorByOwner, getReviewsForVendor, getMessagesForVendor, addReviewResponse, addMessageResponse, getUnreadMessageCount } from "@/data/store";
import StarRating from "./StarRating";
import BusinessListingEditor from "./BusinessListingEditor";
import { ChatBubbleOutline, StarOutline, StorefrontOutline, CheckCircleOutline } from "./icons";
import type { Vendor } from "@/types";
import type { Review } from "@/data/reviews";
import type { Message } from "@/types";

type BizTab = "dashboard" | "listing" | "reviews" | "messages";

interface SellerDashboardProps {
  activeSellerTab?: BizTab;
  onSellerTabChange?: (tab: BizTab) => void;
}

export default function SellerDashboard({ activeSellerTab, onSellerTabChange }: SellerDashboardProps) {
  const { user, logout } = useAuth();
  const [internalTab, setInternalTab] = useState<BizTab>("dashboard");
  const activeTab = activeSellerTab ?? internalTab;
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [reviewResponses, setReviewResponses] = useState<Record<string, string>>({});
  const [messageResponses, setMessageResponses] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) {
      const v = getVendorByOwner(user.id);
      if (v) setVendor(v);
    }
  }, [user]);

  const switchTab = (tab: BizTab) => {
    if (onSellerTabChange) onSellerTabChange(tab);
    else setInternalTab(tab);
    if (vendor) {
      if (tab === "reviews") {
        setReviews(getReviewsForVendor(vendor.id));
      } else if (tab === "messages") {
        const msgs = getMessagesForVendor(vendor.id);
        setMessages(msgs);
        setUnreadCount(getUnreadMessageCount(vendor.id));
      }
    }
  };

  useEffect(() => {
    if (vendor) {
      setReviews(getReviewsForVendor(vendor.id));
      const msgs = getMessagesForVendor(vendor.id);
      setMessages(msgs);
      setUnreadCount(getUnreadMessageCount(vendor.id));
    }
  }, [vendor]);

  // Auth disabled for testing — always show dashboard
  // if (!user || user.role !== "business") { ... }

  const tabs: { id: BizTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: "dashboard", label: "Dashboard", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg> },
    { id: "listing", label: "Listing", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path d="M9 22V12h6v10"/></svg> },
    { id: "reviews", label: "Reviews", icon: <StarOutline size={16} />, badge: reviews.length },
    { id: "messages", label: "Messages", icon: <ChatBubbleOutline size={16} />, badge: unreadCount || undefined },
  ];

  const stats = vendor ? [
    { label: "Profile Views", value: "1,247", change: "+12%", up: true },
    { label: "Saves", value: "89", change: "+8%", up: true },
    { label: "Direction Clicks", value: "203", change: "+23%", up: true },
    { label: "Search Appearances", value: "3,891", change: "+5%", up: true },
  ] : [];

  const avgRating = reviews.length > 0
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : 0;

  const handleReviewResponse = (reviewId: string) => {
    const text = reviewResponses[reviewId];
    if (!text?.trim()) return;
    addReviewResponse(reviewId, { text: text.trim(), date: new Date().toISOString() });
    setReviews(getReviewsForVendor(vendor!.id));
    setReviewResponses((prev) => ({ ...prev, [reviewId]: "" }));
  };

  const handleMessageResponse = (messageId: string) => {
    const text = messageResponses[messageId];
    if (!text?.trim()) return;
    addMessageResponse(messageId, { text: text.trim(), date: new Date().toISOString() });
    const msgs = getMessagesForVendor(vendor!.id);
    setMessages(msgs);
    setUnreadCount(getUnreadMessageCount(vendor!.id));
    setMessageResponses((prev) => ({ ...prev, [messageId]: "" }));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 pb-24 space-y-4 overflow-y-auto">
      {/* Welcome + Switch back */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-charcoal">
            {vendor?.name || "Your Business"}
          </h2>
          <p className="text-sm text-stone">Business Owner Dashboard</p>
        </div>
        <button onClick={logout} className="btn-ghost text-xs pressable focus-ring">
          Sign Out
        </button>
      </div>

      {/* Tab bar — grid, no scroll */}
      <div className="grid grid-cols-4 gap-1 bg-ecru rounded-xl p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => switchTab(tab.id)}
            className={`relative flex items-center justify-center gap-1 px-1 sm:px-2 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 pressable focus-ring ${
              activeTab === tab.id ? "bg-cream text-charcoal shadow-sm" : "text-stone hover:text-charcoal hover:bg-cream/50"
            }`}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
            {tab.badge !== undefined && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-terracotta text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Dashboard Tab */}
      {activeTab === "dashboard" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-cream rounded-2xl border border-parchment p-4 card-interactive">
                <p className="text-xs text-stone mb-1">{stat.label}</p>
                <div className="flex items-end justify-between">
                  <p className="text-2xl font-bold text-charcoal">{stat.value}</p>
                  <span className="text-xs font-medium text-sage">{stat.change}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-cream rounded-2xl border border-parchment p-5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-charcoal">Reviews</h3>
              <div className="flex items-center gap-2">
                <StarRating value={Math.round(avgRating)} size="sm" readOnly />
                <span className="text-sm font-medium">{avgRating.toFixed(1)}</span>
                <span className="text-xs text-stone">({reviews.length})</span>
              </div>
            </div>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={() => switchTab("messages")}
              className="w-full bg-terracotta/5 border border-terracotta/10 rounded-2xl p-4 flex items-center gap-3 text-left"
            >
              <div className="w-10 h-10 bg-terracotta/10 rounded-xl flex items-center justify-center">
                <ChatBubbleOutline size={20} className="text-terracotta" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-charcoal">{unreadCount} unread message{unreadCount !== 1 ? "s" : ""}</p>
                <p className="text-xs text-stone">Tap to view and respond</p>
              </div>
              <svg className="w-4 h-4 text-stone" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          )}

          <div className="bg-terracotta/5 rounded-2xl p-5 border border-terracotta/10">
            <h3 className="font-semibold text-charcoal mb-2">💡 Tip of the Day</h3>
            <p className="text-sm text-stone leading-relaxed">
              Businesses that respond to reviews see 35% more customer engagement.
              Take a moment to thank your reviewers — it builds community trust.
            </p>
          </div>
        </div>
      )}

      {/* Listing Tab */}
      {activeTab === "listing" && <BusinessListingEditor />}

      {/* Reviews Tab */}
      {activeTab === "reviews" && (
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-terracotta/10 flex items-center justify-center mb-3">
                <StarOutline size={28} className="text-terracotta" />
              </div>
              <p className="text-sm text-stone">No reviews yet. They&apos;ll appear here once customers leave them.</p>
            </div>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="bg-cream rounded-2xl border border-parchment p-5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-terracotta/10 flex items-center justify-center text-sm font-semibold text-terracotta">
                      {review.authorName.charAt(0)}
                    </div>
                    <div>
                      <span className="text-sm font-medium text-charcoal">{review.authorName}</span>
                      <StarRating value={review.rating} size="sm" readOnly />
                    </div>
                  </div>
                  <span className="text-[11px] text-clay">
                    {new Date(review.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                </div>
                <p className="text-sm text-stone leading-relaxed ml-10">{review.text}</p>

                {review.response ? (
                  <div className="ml-10 mt-3 pl-4 border-l-2 border-terracotta/30">
                    <span className="text-xs font-semibold text-terracotta">Your response</span>
                    <p className="text-xs text-stone mt-1">{review.response.text}</p>
                  </div>
                ) : (
                  <div className="ml-10 mt-3 flex gap-2">
                    <input
                      type="text" value={reviewResponses[review.id] || ""}
                      onChange={(e) => setReviewResponses((prev) => ({ ...prev, [review.id]: e.target.value }))}
                      placeholder="Write a response…"
                      className="input-field text-xs py-2 px-3 flex-1"
                      onKeyDown={(e) => { if (e.key === "Enter") handleReviewResponse(review.id); }}
                    />
                    <button
                      onClick={() => handleReviewResponse(review.id)}
                      className="px-3 py-2 bg-terracotta text-cream rounded-xl text-xs font-medium hover:bg-terracotta-dark transition-colors"
                    >
                      Reply
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Messages Tab */}
      {activeTab === "messages" && (
        <div className="space-y-3">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-stone/10 flex items-center justify-center mb-3">
                <ChatBubbleOutline size={28} className="text-stone" />
              </div>
              <p className="text-sm text-stone">No messages yet. Customers will message you from your listing.</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className={`bg-cream rounded-2xl border p-5 ${!msg.read ? "border-terracotta/30" : "border-parchment"}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-terracotta/10 flex items-center justify-center text-sm font-semibold text-terracotta">
                      {msg.senderName.charAt(0)}
                    </div>
                    <div>
                      <span className="text-sm font-medium text-charcoal">{msg.senderName}</span>
                      {!msg.read && <span className="ml-2 w-2 h-2 bg-terracotta rounded-full inline-block" />}
                    </div>
                  </div>
                  <span className="text-[11px] text-clay">
                    {new Date(msg.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                </div>
                <p className="text-sm text-stone leading-relaxed ml-10">{msg.text}</p>

                {msg.response ? (
                  <div className="ml-10 mt-3 pl-4 border-l-2 border-terracotta/30">
                    <span className="text-xs font-semibold text-terracotta">Your response</span>
                    <p className="text-xs text-stone mt-1">{msg.response.text}</p>
                  </div>
                ) : (
                  <div className="ml-10 mt-3 flex gap-2">
                    <input
                      type="text" value={messageResponses[msg.id] || ""}
                      onChange={(e) => setMessageResponses((prev) => ({ ...prev, [msg.id]: e.target.value }))}
                      placeholder="Reply…"
                      className="input-field text-xs py-2 px-3 flex-1"
                      onKeyDown={(e) => { if (e.key === "Enter") handleMessageResponse(msg.id); }}
                    />
                    <button
                      onClick={() => handleMessageResponse(msg.id)}
                      className="px-3 py-2 bg-terracotta text-cream rounded-xl text-xs font-medium hover:bg-terracotta-dark transition-colors"
                    >
                      Reply
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
