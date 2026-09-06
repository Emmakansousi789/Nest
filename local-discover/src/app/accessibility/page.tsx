"use client";

import Link from "next/link";

/**
 * Accessibility Statement — WCAG 2.1 AA Compliance
 * Required by the European Accessibility Act (in force 28 June 2025)
 * and recommended by Apple/Google for App Store submission.
 */
export default function AccessibilityPage() {
  return (
    <div className="min-h-screen bg-linen">
      <div className="sticky top-0 z-40 bg-cream/80 backdrop-blur-md border-b border-parchment">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 h-14 flex items-center">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-stone hover:text-charcoal transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to Local Discover
          </Link>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        <div>
          <h1 className="font-serif text-3xl font-bold text-charcoal mb-2">
            Accessibility Statement
          </h1>
          <p className="text-sm text-stone">
            Last updated: September 2026
          </p>
        </div>

        <section className="bg-cream rounded-2xl border border-parchment p-6 space-y-4">
          <h2 className="text-lg font-semibold text-charcoal">Our Commitment</h2>
          <p className="text-sm text-stone leading-relaxed">
            Local Discover is committed to ensuring digital accessibility for people with
            disabilities. We are continually improving the user experience for everyone and
            applying the relevant accessibility standards to ensure we provide equal access
            to all users.
          </p>
        </section>

        <section className="bg-cream rounded-2xl border border-parchment p-6 space-y-4">
          <h2 className="text-lg font-semibold text-charcoal">Conformance Status</h2>
          <p className="text-sm text-stone leading-relaxed">
            We aim to conform to the{" "}
            <strong>Web Content Accessibility Guidelines (WCAG) 2.1 Level AA</strong>{" "}
            standard. These guidelines explain how to make web content more accessible for
            people with disabilities and more user-friendly for everyone.
          </p>
          <div className="flex items-center gap-2 bg-sage/10 text-sage px-4 py-3 rounded-xl text-sm font-medium">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Partially conformant — WCAG 2.1 Level AA (working toward full conformance)
          </div>
        </section>

        <section className="bg-cream rounded-2xl border border-parchment p-6 space-y-4">
          <h2 className="text-lg font-semibold text-charcoal">Measures Taken</h2>
          <ul className="space-y-3 text-sm text-stone">
            <li className="flex items-start gap-2">
              <svg className="w-4 h-4 text-terracotta mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              <span><strong>Semantic HTML:</strong> All pages use proper heading hierarchy (h1→h2→h3), landmark regions, and semantic elements.</span>
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-4 h-4 text-terracotta mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              <span><strong>ARIA labels:</strong> All interactive elements (buttons, links, form inputs) have descriptive aria-labels.</span>
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-4 h-4 text-terracotta mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              <span><strong>Keyboard navigation:</strong> All interactive elements are focusable and operable via keyboard. Focus rings are visible.</span>
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-4 h-4 text-terracotta mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              <span><strong>Skip navigation:</strong> A &ldquo;Skip to content&rdquo; link is provided for screen reader users to bypass navigation.</span>
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-4 h-4 text-terracotta mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              <span><strong>Color contrast:</strong> Text meets WCAG AA contrast ratios (4.5:1 for normal text, 3:1 for large text).</span>
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-4 h-4 text-terracotta mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              <span><strong>Reduced motion:</strong> Animations respect the user&apos;s <code>prefers-reduced-motion</code> OS setting.</span>
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-4 h-4 text-terracotta mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              <span><strong>Form validation:</strong> All form inputs have visible labels, error messages, and inline validation.</span>
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-4 h-4 text-terracotta mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              <span><strong>Image alt text:</strong> All meaningful images have descriptive alt text. Decorative images are hidden from screen readers.</span>
            </li>
          </ul>
        </section>

        <section className="bg-cream rounded-2xl border border-parchment p-6 space-y-4">
          <h2 className="text-lg font-semibold text-charcoal">Known Limitations</h2>
          <ul className="space-y-2 text-sm text-stone list-disc pl-5">
            <li>The interactive map uses a third-party library (Leaflet) which may have some accessibility gaps in screen reader navigation.</li>
            <li>Some vendor photos may not yet have complete alt text descriptions.</li>
            <li>We are working toward full Dynamic Type / text scaling support across all screens.</li>
          </ul>
        </section>

        <section className="bg-cream rounded-2xl border border-parchment p-6 space-y-4">
          <h2 className="text-lg font-semibold text-charcoal">Feedback</h2>
          <p className="text-sm text-stone leading-relaxed">
            We welcome your feedback on the accessibility of Local Discover. If you
            encounter accessibility barriers or have suggestions for improvement, please
            contact us:
          </p>
          <div className="space-y-2 text-sm">
            <p className="text-stone">
              Email:{" "}
              <a href="mailto:accessibility@localdiscover.com" className="text-terracotta hover:text-terracotta-dark">
                accessibility@localdiscover.com
              </a>
            </p>
            <p className="text-stone">
              General support:{" "}
              <a href="mailto:hello@localdiscover.com" className="text-terracotta hover:text-terracotta-dark">
                hello@localdiscover.com
              </a>
            </p>
          </div>
          <p className="text-sm text-stone leading-relaxed">
            We aim to respond to accessibility feedback within 5 business days.
          </p>
        </section>

        <section className="bg-cream rounded-2xl border border-parchment p-6 space-y-4">
          <h2 className="text-lg font-semibold text-charcoal">Formal Compliance</h2>
          <p className="text-sm text-stone leading-relaxed">
            This accessibility statement was last updated on September 2026. We assess
            accessibility through automated testing, manual testing with screen readers
            (VoiceOver on iOS, TalkBack on Android), and keyboard-only navigation testing.
          </p>
          <p className="text-sm text-stone leading-relaxed">
            This statement is provided in accordance with the{" "}
            <strong>European Accessibility Act</strong> (Directive 2019/882, in force
            28 June 2025) and the{" "}
            <strong>EN 301 549</strong> standard for digital accessibility.
          </p>
        </section>
      </div>
    </div>
  );
}
