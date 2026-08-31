export default function VendorLoading() {
  return (
    <div className="min-h-screen bg-linen animate-pulse">
      {/* Back nav skeleton */}
      <div className="sticky top-0 z-40 bg-cream/90 backdrop-blur-xl border-b border-parchment">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center">
          <div className="h-4 skeleton rounded w-32" />
        </div>
      </div>

      {/* Hero banner skeleton */}
      <div className="h-56 sm:h-72 skeleton" />

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-16 relative z-10 pb-12">
        {/* Profile card skeleton */}
        <div className="bg-cream rounded-2xl border border-parchment p-6 sm:p-8 shadow-sm mb-6">
          <div className="flex flex-col sm:flex-row sm:items-start gap-4">
            <div className="w-20 h-20 rounded-2xl skeleton shrink-0" />
            <div className="flex-1 space-y-3">
              <div className="h-8 skeleton rounded w-3/4" />
              <div className="h-4 skeleton rounded w-1/2" />
              <div className="h-4 skeleton rounded w-2/3" />
            </div>
          </div>
          <div className="flex gap-2 mt-5 pt-5 border-t border-gray-100">
            <div className="h-6 skeleton rounded-full w-20" />
            <div className="h-6 skeleton rounded-full w-24" />
            <div className="h-6 skeleton rounded-full w-16" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Story skeleton */}
            <div className="bg-cream rounded-2xl border border-parchment p-6">
              <div className="h-5 skeleton rounded w-32 mb-4" />
              <div className="space-y-2">
                <div className="h-3 skeleton rounded w-full" />
                <div className="h-3 skeleton rounded w-5/6" />
                <div className="h-3 skeleton rounded w-4/5" />
              </div>
            </div>
            {/* Products skeleton */}
            <div className="bg-cream rounded-2xl border border-parchment p-6">
              <div className="h-5 skeleton rounded w-40 mb-4" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                    <div className="w-14 h-14 rounded-lg skeleton shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 skeleton rounded w-3/4" />
                      <div className="h-3 skeleton rounded w-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-6">
            {/* Hours skeleton */}
            <div className="bg-cream rounded-2xl border border-parchment p-6">
              <div className="h-5 skeleton rounded w-20 mb-4" />
              <div className="space-y-2">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <div className="h-3 skeleton rounded w-20" />
                    <div className="h-3 skeleton rounded w-28" />
                  </div>
                ))}
              </div>
            </div>
            {/* Contact skeleton */}
            <div className="bg-cream rounded-2xl border border-parchment p-6">
              <div className="h-5 skeleton rounded w-24 mb-4" />
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg skeleton" />
                    <div className="h-3 skeleton rounded w-32" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
