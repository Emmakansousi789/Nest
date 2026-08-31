import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — Local Discover",
  description: "Learn about Local Discover's mission to connect communities with independent businesses.",
};

const values = [
  {
    icon: "🏘️",
    title: "Community First",
    description: "We believe the best businesses are the ones your neighbors run. Local Discover exists to make them easier to find.",
  },
  {
    icon: "⚖️",
    title: "Equity & Representation",
    description: "We center businesses owned by Black, Latine, Indigenous, Asian, LGBTQ+, and women founders — because representation matters in who gets discovered.",
  },
  {
    icon: "🌿",
    title: "Sustainability",
    description: "We champion businesses that prioritize the planet: organic, sustainable, handmade, and low-waste practices.",
  },
  {
    icon: "🤝",
    title: "Mutual Support",
    description: "When you discover a local business, you're investing in your neighborhood. Every dollar stays closer to home.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-linen">
      {/* Back nav */}
      <div className="sticky top-0 z-40 bg-cream/90 backdrop-blur-xl border-b border-gray-100/80">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-stone hover:text-charcoal transition-colors group"
          >
            <svg
              className="w-4 h-4 transition-transform group-hover:-translate-x-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
              />
            </svg>
            Back to Discover
          </Link>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-b from-emerald-50 to-background pt-16 pb-12 sm:pt-24 sm:pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-charcoal mb-4">
            Discover the people behind the businesses
          </h1>
          <p className="text-lg text-stone max-w-xl mx-auto">
            Local Discover is a free platform that helps you find independent businesses,
            makers, and vendors — the ones that make your neighborhood worth living in.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-charcoal mb-6">
            Our Mission
          </h2>
          <div className="text-stone max-w-none space-y-4 text-stone text-base leading-relaxed">
            <p>
              Big-box stores and algorithm-driven marketplaces have made it easy to buy
              anything — but harder to buy from someone you know. Local Discover flips that
              by putting independent businesses at the center of the search experience.
            </p>
            <p>
              We started in the American South because this region has some of the richest
              traditions of small business, family farming, and community-driven commerce in
              the country. From Black-owned farms in Atlanta to Latine-owned mills in
              Charlotte, from Indigenous herbalists in New Orleans to Asian-owned provisioners
              in Savannah — these businesses carry stories that deserve to be told.
            </p>
            <p>
              Local Discover is not a marketplace. We don&apos;t process payments or take
              commissions. We simply help people find the businesses that already exist in
              their communities, and we give those businesses a digital home that reflects
              the quality of what they do.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 sm:py-20 bg-cream border-y border-parchment">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-charcoal mb-12">
            What We Believe
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {values.map((value, i) => (
              <div key={i} className="flex gap-4">
                <div className="text-3xl shrink-0">{value.icon}</div>
                <div>
                  <h3 className="font-semibold text-charcoal mb-1">
                    {value.title}
                  </h3>
                  <p className="text-sm text-stone">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Credits / Contact */}
      <section className="py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-charcoal mb-6">
            Built With Care
          </h2>
          <p className="text-stone mb-4">
            Local Discover was designed and built to serve communities that are
            often overlooked by mainstream platforms. Every vendor story, every
            product listing, every map pin represents a real business doing real work
            in their neighborhood.
          </p>
          <p className="text-stone mb-8">
            Want to get involved, suggest a business, or just say hello?
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="mailto:hello@localdiscover.com"
              className="px-5 py-2.5 bg-terracotta text-white rounded-xl text-sm font-medium hover:bg-terracotta-dark transition-colors"
            >
              Email Us
            </a>
            <Link
              href="/for-vendors"
              className="px-5 py-2.5 bg-cream border border-parchment text-charcoal rounded-xl text-sm font-medium hover:border-primary/30 transition-colors"
            >
              List Your Business
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
