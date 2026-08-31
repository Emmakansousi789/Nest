export default function SkeletonCard() {
  return (
    <div className="bg-cream border border-parchment rounded-2xl overflow-hidden">
      <div className="aspect-[4/3] skeleton" />
      <div className="p-3.5 space-y-2">
        <div className="h-2 w-16 skeleton rounded-full" />
        <div className="h-4 w-3/4 skeleton rounded-full" />
        <div className="h-3 w-full skeleton rounded-full" />
        <div className="h-2 w-1/2 skeleton rounded-full" />
      </div>
    </div>
  );
}
