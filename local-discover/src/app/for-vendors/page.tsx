"use client";

import Link from "next/link";

const steps = [
  {
    icon: "📝",
    title: "Submit your business",
    description: "Fill out a simple form with your business name, location, category, and a brief story about what makes you unique.",
  },
  {
    icon: "✅",
    title: "Get verified",
    description: "Our team reviews every listing to ensure quality. Once verified, your badge appears on your profile.",
  },
  {
    icon: "🌍",
    title: "Get discovered",
    description: "Your business appears on the map and in search results for customers looking for exactly what you offer.",
  },
];

const benefits = [
  { icon: "🆓", title: "Free to list", description: "No fees, no commissions. This platform exists to amplify independent businesses." },
  { icon: "📍", title: "Map presence", description: "Your business shows up on our interactive map, helping nearby customers find you." },
  { icon: "📖", title: "Tell your story", description: "Your profile showcases your full story, products, photos, hours, and contact info." },
  { icon: "🏷️", title: "Identity tags", description: "Customers can filter by what matters to them — Black-owned, organic, handmade, and more." },
  { icon: "📱", title: "Mobile-first", description: "Your listing is optimized for mobile browsing, where most local discovery happens." },
  { icon: "🤝", title: "Community", description: "Join a growing network of independent businesses across the American South." },
];

export default function ForVendorsPage() {
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
            Grow your business with community
          </h1>
          <p className="text-lg text-stone max-w-xl mx-auto mb-8">
            Local Discover connects independent businesses with customers who care about
            where their money goes. List your business for free.
          </p>
          <a
            href="#get-started"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-terracotta text-white rounded-xl font-medium hover:bg-terracotta-dark transition-colors text-lg"
          >
            List Your Business
          </a>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-charcoal mb-12">
            How it works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl mb-4">{step.icon}</div>
                <div className="text-sm font-bold text-terracotta mb-2">
                  Step {i + 1}
                </div>
                <h3 className="text-lg font-semibold text-charcoal mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-stone">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 sm:py-20 bg-cream border-y border-parchment">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-charcoal mb-12">
            Why list on Local Discover?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, i) => (
              <div
                key={i}
                className="p-5 rounded-2xl border border-parchment hover:border-primary/30 transition-colors"
              >
                <div className="text-2xl mb-3">{benefit.icon}</div>
                <h3 className="font-semibold text-charcoal mb-1">
                  {benefit.title}
                </h3>
                <p className="text-sm text-stone">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="get-started" className="py-16 sm:py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-charcoal mb-4">
            Ready to get started?
          </h2>
          <p className="text-stone mb-8">
            Fill out a quick form and our team will reach out to set up your listing.
          </p>
          <form
            onSubmit={(e: React.FormEvent) => {
              e.preventDefault();
              alert("Thanks! We'll be in touch to set up your listing.");
            }}
            className="max-w-md mx-auto space-y-4 text-left"
          >
            <div>
              <label htmlFor="biz-name" className="block text-sm font-medium text-charcoal mb-1">
                Business name
              </label>
              <input
                id="biz-name"
                type="text"
                required
                placeholder="Your business name"
                className="w-full px-4 py-2.5 bg-cream border border-parchment rounded-xl text-charcoal placeholder:text-clay focus:outline-none focus:ring-2 focus:ring-terracotta/20 focus:border-terracotta text-sm"
              />
            </div>
            <div>
              <label htmlFor="biz-email" className="block text-sm font-medium text-charcoal mb-1">
                Email
              </label>
              <input
                id="biz-email"
                type="email"
                required
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 bg-cream border border-parchment rounded-xl text-charcoal placeholder:text-clay focus:outline-none focus:ring-2 focus:ring-terracotta/20 focus:border-terracotta text-sm"
              />
            </div>
            <div>
              <label htmlFor="biz-city" className="block text-sm font-medium text-charcoal mb-1">
                City
              </label>
              <input
                id="biz-city"
                type="text"
                required
                placeholder="Atlanta, Nashville, etc."
                className="w-full px-4 py-2.5 bg-cream border border-parchment rounded-xl text-charcoal placeholder:text-clay focus:outline-none focus:ring-2 focus:ring-terracotta/20 focus:border-terracotta text-sm"
              />
            </div>
            <div>
              <label htmlFor="biz-desc" className="block text-sm font-medium text-charcoal mb-1">
                Tell us about your business
              </label>
              <textarea
                id="biz-desc"
                rows={4}
                required
                placeholder="What do you make, grow, or sell? What makes your business special?"
                className="w-full px-4 py-2.5 bg-cream border border-parchment rounded-xl text-charcoal placeholder:text-clay focus:outline-none focus:ring-2 focus:ring-terracotta/20 focus:border-terracotta text-sm resize-none"
              />
            </div>
            <button
              type="submit"
              className="w-full px-6 py-3 bg-terracotta text-white rounded-xl font-medium hover:bg-terracotta-dark transition-colors"
            >
              Submit for Review
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
