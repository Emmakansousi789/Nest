"use client";

import { useState } from "react";
import StarRating from "./StarRating";

interface Review {
  id: string;
  vendorId: string;
  authorName: string;
  rating: number;
  text: string;
  date: string;
  response?: {
    text: string;
    date: string;
  };
}

interface ReviewListProps {
  reviews: Review[];
}

function ReportButton({ targetType, targetId }: { targetType: string; targetId: string }) {
  const [reported, setReported] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleReport = async (reason: string) => {
    try {
      await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetType, targetId, reason }),
      });
      setReported(true);
      setShowMenu(false);
    } catch {
      // silently fail
    }
  };

  if (reported) {
    return (
      <span className="text-[10px] text-stone">Reported</span>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="p-1 text-clay hover:text-charcoal transition-colors"
        aria-label="Report this review"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5" />
        </svg>
      </button>
      {showMenu && (
        <div className="absolute right-0 top-8 z-10 bg-white border border-parchment rounded-xl shadow-lg py-1 min-w-[140px]">
          {[
            { value: "offensive", label: "Offensive" },
            { value: "spam", label: "Spam" },
            { value: "inaccurate", label: "Inaccurate" },
            { value: "other", label: "Other" },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleReport(opt.value)}
              className="w-full text-left px-3 py-2 text-xs text-charcoal hover:bg-ecru transition-colors"
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ReviewList({ reviews }: ReviewListProps) {
  if (reviews.length === 0) return null;

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review.id} className="border-b border-parchment pb-6 last:border-0 last:pb-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="text-sm font-medium text-charcoal">{review.authorName}</p>
              <StarRating value={review.rating} size="sm" readOnly />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-clay">{review.date}</span>
              <ReportButton targetType="review" targetId={review.id} />
            </div>
          </div>
          <p className="text-sm text-graphite leading-relaxed mb-3">{review.text}</p>
          {review.response && (
            <div className="ml-4 border-l-2 border-terracotta/30 pl-4">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-terracotta mb-1">
                Business Response
              </p>
              <p className="text-sm text-graphite leading-relaxed">{review.response.text}</p>
              <span className="text-[11px] text-clay mt-1 block">{review.response.date}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
