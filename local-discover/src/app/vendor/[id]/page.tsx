import { notFound } from "next/navigation";
import { vendors, categories, isOpenNow } from "@/data/vendors";
import { getVendors, getReviewsForVendor, getAverageRating, getReviewCount } from "@/data/store";
import StarRating from "@/components/StarRating";
import FavoriteButton from "@/components/FavoriteButton";
import DirectionsButton from "@/components/DirectionsButton";
import MessageButton from "@/components/MessageButton";
import WriteReviewButton from "@/components/WriteReviewButton";
import ReviewList from "@/components/ReviewList";
import VendorProfileClient from "@/components/VendorProfileClient";

export function generateStaticParams() {
  return vendors.map((v) => ({ id: v.id }));
}

export default async function VendorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const allVendors = getVendors();
  const vendor = allVendors.find((v) => v.id === id);
  if (!vendor) notFound();

  const category = categories.find((c) => c.value === vendor.category);
  const reviews = getReviewsForVendor(vendor.id);
  const avgRating = getAverageRating(vendor.id);
  const reviewCount = getReviewCount(vendor.id);
  const open = isOpenNow(vendor);

  return (
    <div className="min-h-screen bg-linen">
      {/* Header bar */}
      <div className="sticky top-0 z-40 bg-linen/90 backdrop-blur-sm border-b border-parchment">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 text-stone hover:text-charcoal transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            <span className="text-sm font-medium">Back</span>
          </a>
          <div className="flex items-center gap-2">
            <FavoriteButton vendorId={vendor.id} size="md" />
          </div>
        </div>
      </div>

      <VendorProfileClient
        photos={vendor.photos}
        category={vendor.category}
        vendorName={vendor.name}
      >
      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Hero */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-terracotta">
              {category?.label || vendor.category}
            </span>
            {vendor.verified && (
              <span className="text-[10px] font-semibold uppercase tracking-widest text-sage">✓ Verified</span>
            )}
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-charcoal leading-tight mb-2">
            {vendor.name}
          </h1>
          <p className="text-base text-stone leading-relaxed">{vendor.tagline}</p>

          <div className="flex items-center gap-3 mt-4 text-sm text-graphite">
            {avgRating > 0 && (
              <>
                <span className="flex items-center gap-1">
                  <StarRating value={Math.round(avgRating)} size="sm" readOnly />
                  <span className="font-medium text-charcoal">{avgRating.toFixed(1)}</span>
                </span>
                <span className="text-clay">·</span>
                <span>{reviewCount} review{reviewCount !== 1 ? "s" : ""}</span>
                <span className="text-clay">·</span>
              </>
            )}
            <span>{open ? "Open now" : "Closed"}</span>
          </div>
        </div>

        <div className="editorial-divider mb-8" />

        {/* Story */}
        <section className="mb-10">
          <h2 className="font-serif text-xl font-semibold text-charcoal mb-3">Our Story</h2>
          <p className="text-sm text-graphite leading-relaxed whitespace-pre-line">{vendor.story}</p>
        </section>

        {/* Products */}
        {vendor.products.length > 0 && (
          <section className="mb-10">
            <h2 className="font-serif text-xl font-semibold text-charcoal mb-4">What We Offer</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-parchment/50">
              {vendor.products.map((product) => (
                <div key={product.id} className="bg-cream p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-clay mb-1">
                        {product.category}
                      </p>
                      <h3 className="text-sm font-medium text-charcoal">{product.name}</h3>
                    </div>
                    {product.price && (
                      <span className="text-sm font-medium text-terracotta">{product.price}</span>
                    )}
                  </div>
                  <p className="text-xs text-stone leading-relaxed">{product.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Details */}
        <section className="mb-10">
          <h2 className="font-serif text-xl font-semibold text-charcoal mb-4">Details</h2>
          <div className="space-y-4">
            {/* Address */}
            <div className="flex items-start gap-3">
              <svg className="w-4 h-4 text-stone mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              <div>
                <p className="text-sm text-charcoal">{vendor.address}</p>
                <p className="text-xs text-stone">{vendor.city}, {vendor.state} {vendor.zip}</p>
                <div className="mt-1">
                  <DirectionsButton address={vendor.address} city={vendor.city} state={vendor.state} zip={vendor.zip} lat={vendor.lat} lng={vendor.lng} />
                </div>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-3">
              <svg className="w-4 h-4 text-stone shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
              <a href={`tel:${vendor.phone}`} className="text-sm text-terracotta hover:text-terracotta-dark">
                {vendor.phone}
              </a>
            </div>

            {/* Email */}
            <div className="flex items-center gap-3">
              <svg className="w-4 h-4 text-stone shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              <a href={`mailto:${vendor.email}`} className="text-sm text-terracotta hover:text-terracotta-dark">
                {vendor.email}
              </a>
            </div>

            {/* Website */}
            {vendor.website && (
              <div className="flex items-center gap-3">
                <svg className="w-4 h-4 text-stone shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                </svg>
                <a href={vendor.website} target="_blank" rel="noopener noreferrer" className="text-sm text-terracotta hover:text-terracotta-dark">
                  {vendor.website.replace(/^https?:\/\//, "")}
                </a>
              </div>
            )}

            {/* Instagram */}
            {vendor.instagram && (
              <div className="flex items-center gap-3">
                <span className="w-4 h-4 text-stone shrink-0 text-center text-xs">📸</span>
                <span className="text-sm text-graphite">{vendor.instagram}</span>
              </div>
            )}
          </div>
        </section>

        {/* Hours */}
        <section className="mb-10">
          <h2 className="font-serif text-xl font-semibold text-charcoal mb-4">Hours</h2>
          <div className="border border-parchment">
            {Object.entries(vendor.hours).map(([day, hours]) => (
              <div key={day} className="flex items-center justify-between px-4 py-2.5 border-b border-parchment last:border-0">
                <span className="text-sm text-charcoal font-medium">{day}</span>
                <span className="text-sm text-stone">
                  {hours.closed ? "Closed" : `${hours.open} – ${hours.close}`}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Tags */}
        {vendor.tags.length > 0 && (
          <section className="mb-10">
            <h2 className="font-serif text-xl font-semibold text-charcoal mb-4">Identity & Values</h2>
            <div className="flex flex-wrap gap-2">
              {vendor.tags.map((tag) => (
                <span key={tag} className="px-3 py-1.5 text-xs font-medium text-graphite bg-ecru border border-parchment">
                  {tag.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Actions */}
        <section className="mb-10 flex gap-3">
          <MessageButton vendorId={vendor.id} vendorName={vendor.name} />
          <WriteReviewButton vendorName={vendor.name} />
        </section>

        {/* Reviews */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-xl font-semibold text-charcoal">Reviews</h2>
            {avgRating > 0 && (
              <div className="flex items-center gap-2">
                <StarRating value={Math.round(avgRating)} size="sm" readOnly />
                <span className="text-sm font-medium text-charcoal">{avgRating.toFixed(1)}</span>
                <span className="text-xs text-stone">({reviewCount})</span>
              </div>
            )}
          </div>
          <ReviewList reviews={reviews} />
        </section>
      </article>
      </VendorProfileClient>
    </div>
  );
}
