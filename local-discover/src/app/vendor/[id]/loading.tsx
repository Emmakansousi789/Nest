export default function VendorLoading() {
  return (
    <div className="min-h-screen bg-linen animate-pulse">
      {/* Header skeleton */}
      <div className="sticky top-0 z-40 bg-linen/90 backdrop-blur-sm border-b border-parchment">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="w-16 h-4 bg-parchment rounded" />
          <div className="w-8 h-8 bg-parchment rounded-full" />
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Photo carousel skeleton */}
        <div className="w-full aspect-[16/10] bg-parchment rounded-2xl mb-8" />

        {/* Title skeleton */}
        <div className="mb-8">
          <div className="w-20 h-3 bg-parchment rounded mb-3" />
          <div className="w-3/4 h-8 bg-parchment rounded mb-2" />
          <div className="w-1/2 h-4 bg-parchment rounded" />
          <div className="flex gap-3 mt-4">
            <div className="w-24 h-4 bg-parchment rounded" />
            <div className="w-16 h-4 bg-parchment rounded" />
          </div>
        </div>

        <div className="editorial-divider mb-8" />

        {/* Story skeleton */}
        <div className="mb-10">
          <div className="w-32 h-6 bg-parchment rounded mb-3" />
          <div className="space-y-2">
            <div className="w-full h-4 bg-parchment rounded" />
            <div className="w-full h-4 bg-parchment rounded" />
            <div className="w-2/3 h-4 bg-parchment rounded" />
          </div>
        </div>

        {/* Details skeleton */}
        <div className="mb-10">
          <div className="w-24 h-6 bg-parchment rounded mb-4" />
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-4 h-4 bg-parchment rounded" />
                <div className="w-48 h-4 bg-parchment rounded" />
              </div>
            ))}
          </div>
        </div>
      </article>
    </div>
  );
}
