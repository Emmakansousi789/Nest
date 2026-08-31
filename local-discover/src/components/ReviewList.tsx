import StarRating from "./StarRating";

interface Review {
  id: string;
  vendorId: string;
  authorName: string;
  rating: number;
  text: string;
  date: string;
  response?: {
    text: string;
    date: string;
  };
}

interface ReviewListProps {
  reviews: Review[];
}

export default function ReviewList({ reviews }: ReviewListProps) {
  if (reviews.length === 0) return null;

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review.id} className="border-b border-parchment pb-6 last:border-0 last:pb-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="text-sm font-medium text-charcoal">{review.authorName}</p>
              <StarRating value={review.rating} size="sm" readOnly />
            </div>
            <span className="text-[11px] text-clay">{review.date}</span>
          </div>
          <p className="text-sm text-graphite leading-relaxed mb-3">{review.text}</p>
          {review.response && (
            <div className="ml-4 border-l-2 border-terracotta/30 pl-4">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-terracotta mb-1">
                Business Response
              </p>
              <p className="text-sm text-graphite leading-relaxed">{review.response.text}</p>
              <span className="text-[11px] text-clay mt-1 block">{review.response.date}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
