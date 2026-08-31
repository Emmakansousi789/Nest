"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import ReviewForm from "./ReviewForm";
import AuthModal from "./AuthModal";

export default function WriteReviewButton({ vendorName }: { vendorName: string }) {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  const handleClick = () => {
    if (!user) {
      setAuthOpen(true);
      return;
    }
    setIsOpen(true);
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="w-full py-3 bg-terracotta/10 text-terracotta rounded-xl font-medium text-sm hover:bg-terracotta/20 transition-colors flex items-center justify-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
        </svg>
        {user ? "Write a Review" : "Sign up to Review"}
      </button>
      <ReviewForm isOpen={isOpen} onClose={() => setIsOpen(false)} vendorName={vendorName} />
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
