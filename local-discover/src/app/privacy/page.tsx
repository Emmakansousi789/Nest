import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Local Discover",
  description: "Local Discover Privacy Policy",
};

export default function PrivacyPage() {
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
        <h1 className="font-serif text-3xl font-bold text-charcoal mb-2">Privacy Policy</h1>
        <p className="text-sm text-stone mb-8">Last updated: September 1, 2026</p>

        <div className="prose prose-sm max-w-none space-y-6 text-graphite leading-relaxed">
          <section>
            <h2 className="font-serif text-xl font-semibold text-charcoal mb-3">1. Information We Collect</h2>
            <p>When you create an account, we collect your name, email address, and password (stored securely as a bcrypt hash). When you use the app, we collect browsing behavior, saved favorites, reviews, and messages you send to vendors.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-charcoal mb-3">2. How We Use Your Information</h2>
            <p>We use your information to provide and improve the Local Discover platform, display your reviews and profile to other users, and send you essential account-related communications. We do not sell your personal data to third parties.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-charcoal mb-3">3. Data Sharing</h2>
            <p>Your name and reviews are visible to other users as part of the platform experience. Your email address is not shared with other users or third parties. We may share anonymized, aggregated data for analytics purposes.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-charcoal mb-3">4. Data Storage & Security</h2>
            <p>Your data is stored on secure servers provided by Supabase (PostgreSQL). We use industry-standard encryption for data in transit (HTTPS/TLS) and at rest. Passwords are hashed with bcrypt (cost factor 14). Session tokens are stored as httpOnly, secure cookies.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-charcoal mb-3">5. Your Rights</h2>
            <p>You can access, update, or delete your account at any time through the app&apos;s Settings page. Account deletion removes all your data permanently, including reviews, messages, favorites, and any vendor listings you own.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-charcoal mb-3">6. Children&apos;s Privacy</h2>
            <p>Local Discover is not intended for users under 13 years of age. We do not knowingly collect personal information from children under 13.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-charcoal mb-3">7. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the &quot;Last updated&quot; date.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-charcoal mb-3">8. Contact Us</h2>
            <p>If you have questions about this Privacy Policy, contact us at <a href="mailto:hello@localdiscover.com" className="text-terracotta hover:text-terracotta-dark">hello@localdiscover.com</a>.</p>
          </section>
        </div>
      </article>
    </div>
  );
}
