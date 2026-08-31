export default function SkeletonCard() {
  return (
    <div className="bg-cream border border-parchment rounded-2xl overflow-hidden">
      {/* Image skeleton — matches real card aspect ratio */}
      <div className="aspect-[4/3] skeleton relative">
        {/* Badge skeleton */}
        <div className="absolute top-3 left-3 flex gap-1.5">
          <div className="h-4 w-14 skeleton rounded-full" />
          <div className="h-4 w-10 skeleton rounded-full" />
        </div>
        {/* Favorite button skeleton */}
        <div className="absolute top-3 right-3 w-9 h-9 skeleton rounded-full" />
        {/* Category pill skeleton */}
        <div className="absolute bottom-3 left-3 h-4 w-20 skeleton rounded-full" />
      </div>
      <div className="p-3.5 space-y-2">
        {/* Name */}
        <div className="h-4 w-3/4 skeleton rounded-md" />
        {/* Tagline */}
        <div className="h-3 w-full skeleton rounded-md" />
        <div className="h-3 w-2/3 skeleton rounded-md" />
        {/* Meta line */}
        <div className="h-2.5 w-1/2 skeleton rounded-md mt-3" />
        {/* Tags */}
        <div className="flex gap-1 mt-2">
          <div className="h-5 w-16 skeleton rounded-full" />
          <div className="h-5 w-12 skeleton rounded-full" />
        </div>
      </div>
    </div>
  );
}
