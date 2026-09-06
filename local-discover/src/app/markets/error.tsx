"use client";

import { useEffect } from "react";

export default function MarketsError({
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
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
      </svg>
      <h2 className="font-serif text-xl font-semibold text-charcoal mb-2">Couldn&apos;t load markets</h2>
      <p className="text-sm text-stone max-w-sm mb-6">Something went wrong loading market events. Give it another try.</p>
      <button onClick={reset} className="px-5 py-2.5 bg-terracotta text-white rounded-xl text-sm font-medium hover:bg-terracotta-dark transition-colors">
        Try again
      </button>
    </div>
  );
}
