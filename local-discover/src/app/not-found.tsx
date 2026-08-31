import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-linen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-6">🔍</div>
        <h1 className="text-3xl font-bold text-charcoal mb-3">
          Business not found
        </h1>
        <p className="text-stone mb-8">
          We couldn&apos;t find the business you&apos;re looking for. It may have been moved or doesn&apos;t exist yet.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-terracotta text-white rounded-xl font-medium hover:bg-terracotta-dark transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to Discover
        </Link>
      </div>
    </div>
  );
}
