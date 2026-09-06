"use client";

import { useEffect } from "react";

export default function SavedError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
      <svg className="w-12 h-12 mb-4 text-terracotta" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
      <h2 className="font-serif text-xl font-semibold text-charcoal mb-2">Couldn&apos;t load wishlists</h2>
      <p className="text-sm text-stone max-w-sm mb-6">Something went wrong loading your saved businesses. Give it another try.</p>
      <button onClick={reset} className="px-5 py-2.5 bg-terracotta text-white rounded-xl text-sm font-medium hover:bg-terracotta-dark transition-colors">
        Try again
      </button>
    </div>
  );
}
