import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use — Local Discover",
  description: "Local Discover Terms of Use",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-linen">
      <div className="sticky top-0 z-40 bg-cream/90 backdrop-blur-xl border-b border-gray-100/80">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-stone hover:text-charcoal transition-colors group"
          >
            <svg className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back
          </Link>
        </div>
      </div>

      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12 pb-28">
        <h1 className="font-serif text-3xl font-bold text-charcoal mb-2">Terms of Use</h1>
        <p className="text-sm text-stone mb-8">Last updated: September 1, 2026</p>

        <div className="prose prose-sm max-w-none space-y-6 text-graphite leading-relaxed">
          <section>
            <h2 className="font-serif text-xl font-semibold text-charcoal mb-3">1. Acceptance of Terms</h2>
            <p>By accessing or using Local Discover, you agree to be bound by these Terms of Use. If you do not agree to these terms, do not use the app.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-charcoal mb-3">2. Description of Service</h2>
            <p>Local Discover is a discovery platform that helps users find independent businesses and local vendors. We do not process payments, facilitate transactions, or guarantee the quality of any business listed on the platform.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-charcoal mb-3">3. User Accounts</h2>
            <p>You must be at least 13 years old to create an account. You are responsible for maintaining the security of your account credentials. You may delete your account at any time through the Settings page, which will permanently remove all your data.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-charcoal mb-3">4. User-Generated Content</h2>
            <p>You retain ownership of content you submit (reviews, messages, business listings). By submitting content, you grant Local Discover a non-exclusive license to display, distribute, and promote your content within the platform. You must not submit content that is illegal, defamatory, or infringes on third-party rights.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-charcoal mb-3">5. Content Moderation</h2>
            <p>We reserve the right to remove content that violates these terms. Users can report offensive content through the in-app reporting feature. We review all reports and take appropriate action, which may include content removal or account suspension.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-charcoal mb-3">6. Prohibited Conduct</h2>
            <p>You may not: use the app for any illegal purpose; attempt to access other users&apos; accounts; submit false or misleading business information; use automated tools to scrape or collect data; or interfere with the app&apos;s operation.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-charcoal mb-3">7. Limitation of Liability</h2>
            <p>Local Discover is provided &quot;as is&quot; without warranties. We are not liable for any damages arising from your use of the platform, including but not limited to interactions with listed businesses or reliance on business information.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-charcoal mb-3">8. Changes to Terms</h2>
            <p>We may update these terms from time to time. Continued use of the app after changes constitutes acceptance of the new terms.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-charcoal mb-3">9. Contact Us</h2>
            <p>For questions about these Terms of Use, contact us at <a href="mailto:hello@localdiscover.com" className="text-terracotta hover:text-terracotta-dark">hello@localdiscover.com</a>.</p>
          </section>
        </div>
      </article>
    </div>
  );
}
