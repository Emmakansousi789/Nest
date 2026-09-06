export default function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden">
      <div className="aspect-square skeleton rounded-2xl mb-3 relative">
        <div className="absolute top-3 right-3 w-8 h-8 skeleton rounded-full" />
      </div>
      <div className="space-y-2 px-0.5">
        <div className="h-4 w-3/4 skeleton rounded-md" />
        <div className="h-3 w-1/2 skeleton rounded-md" />
        <div className="h-3 w-2/3 skeleton rounded-md" />
      </div>
    </div>
  );
}
