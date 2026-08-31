"use client";

import { useEffect } from "react";

export default function GlobalError({
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
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0 3.75h.007M12 21a9 9 0 100-18 9 9 0 000 18z" />
      </svg>
      <h2 className="font-serif text-xl font-semibold text-charcoal mb-2">Something went wrong</h2>
      <p className="text-sm text-stone max-w-sm mb-6">We hit an unexpected error loading this page. Give it another try.</p>
      <button onClick={reset} className="px-5 py-2.5 bg-terracotta text-white rounded-xl text-sm font-medium hover:bg-terracotta-dark transition-colors">
        Try again
      </button>
    </div>
  );
}
