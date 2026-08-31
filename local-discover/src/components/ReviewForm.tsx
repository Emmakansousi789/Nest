"use client";

import { useState } from "react";
import StarRating from "./StarRating";
import { CheckCircleOutline } from "./icons";

interface ReviewFormProps {
  isOpen: boolean;
  onClose: () => void;
  vendorName: string;
}

export default function ReviewForm({
  isOpen,
  onClose,
  vendorName,
}: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0 || !name.trim() || !text.trim()) return;
    setSubmitted(true);
    setTimeout(() => {
      onClose();
      setSubmitted(false);
      setRating(0);
      setName("");
      setText("");
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 sheet-backdrop" />
      <div
        className="relative bg-cream rounded-t-3xl sm:rounded-2xl shadow-xl w-full sm:max-w-md max-h-[85vh] overflow-y-auto border border-parchment"
        onClick={(e) => e.stopPropagation()}
      >
        {submitted ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-sage/10 flex items-center justify-center mb-4">
              <CheckCircleOutline size={36} className="text-sage" />
            </div>
            <h3 className="text-lg font-semibold text-charcoal mb-2">
              Review submitted!
            </h3>
            <p className="text-sm text-stone">
              Thank you for reviewing {vendorName}.
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-5 pb-3">
              <h3 className="text-lg font-semibold text-charcoal">
                Review {vendorName}
              </h3>
              <button
                onClick={onClose}
                className="p-1 text-stone hover:text-charcoal"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-5 pb-5 space-y-5">
              {/* Rating */}
              <div>
                <label className="text-xs font-semibold text-stone uppercase tracking-wider mb-2 block">
                  Rating
                </label>
                <StarRating value={rating} onChange={setRating} />
              </div>

              {/* Name */}
              <div>
                <label className="text-xs font-semibold text-stone uppercase tracking-wider mb-2 block">
                  Your name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="How should we display your name?"
                  className="input-field"
                  required
                />
              </div>

              {/* Review text */}
              <div>
                <label className="text-xs font-semibold text-stone uppercase tracking-wider mb-2 block">
                  Your review
                </label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Share your experience — what did you love, what could be better?"
                  rows={4}
                  className="input-field resize-none"
                  required
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={rating === 0 || !name.trim() || !text.trim()}
                className="w-full py-3 bg-terracotta text-cream rounded-xl font-medium text-sm hover:bg-terracotta-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Review
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
