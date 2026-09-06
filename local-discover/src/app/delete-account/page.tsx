"use client";

import Link from "next/link";
import { useState } from "react";

/**
 * Web-accessible account deletion page.
 * Users can request account deletion without opening the app.
 * This URL should be declared in Google Play Console Data Safety
 * and App Store Connect Notes for Review.
 */
export default function DeleteAccountPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/auth/account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "request-deletion", email }),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    }
  };

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

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="font-serif text-3xl font-bold text-charcoal mb-4">
          Delete Your Account
        </h1>

        <div className="space-y-6">
          {/* What gets deleted */}
          <section className="bg-cream rounded-2xl border border-parchment p-6">
            <h2 className="text-lg font-semibold text-charcoal mb-3">
              What gets deleted
            </h2>
            <ul className="space-y-2 text-sm text-stone">
              {[
                "Your account and profile information",
                "All reviews you have posted",
                "All messages you have sent or received",
                "Your favorites and saved businesses",
                "Any business listings you own",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-terracotta mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {submitted ? (
            <section className="bg-cream rounded-2xl border border-parchment p-6 text-center">
              <svg className="w-12 h-12 mx-auto mb-3 text-sage" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2 className="text-lg font-semibold text-charcoal mb-2">Request received</h2>
              <p className="text-sm text-stone">
                If an account exists with that email, you will receive a
                confirmation link shortly. Check your inbox.
              </p>
            </section>
          ) : (
            <section className="bg-cream rounded-2xl border border-parchment p-6">
              <h2 className="text-lg font-semibold text-charcoal mb-3">
                Request account deletion
              </h2>
              <p className="text-sm text-stone mb-4">
                Enter the email address associated with your account. We will send a
                confirmation link to verify your identity before processing the deletion.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="text-xs font-semibold text-stone uppercase tracking-wider mb-1.5 block">
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-4 py-2.5 bg-ecru border border-parchment rounded-xl text-sm text-charcoal placeholder-clay focus:border-terracotta focus:outline-none transition-colors"
                  />
                </div>

                {error && (
                  <p className="text-sm text-red-600">{error}</p>
                )}

                <button
                  type="submit"
                  className="w-full py-3 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 transition-colors"
                >
                  Request Account Deletion
                </button>
              </form>
            </section>
          )}

          {/* Help */}
          <section className="text-center text-sm text-stone space-y-1">
            <p>
              Need help? Contact us at{" "}
              <a href="mailto:hello@localdiscover.com" className="text-terracotta hover:text-terracotta-dark">
                hello@localdiscover.com
              </a>
            </p>
            <p>
              You can also delete your account from within the app under{" "}
              <strong>Profile → Settings → Account Ownership and Control</strong>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
