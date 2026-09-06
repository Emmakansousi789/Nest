import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Delete Account — Local Discover",
  description: "Request permanent deletion of your Local Discover account and all associated data.",
};

/**
 * Web-accessible account deletion page.
 * Users can request account deletion without opening the app.
 * This URL should be declared in:
 * - Google Play Console (Data Safety → Account deletion URL)
 * - App Store Connect (Notes for Review)
 * - The app's Privacy Policy
 *
 * For the actual deletion, users submit their email and we process it server-side.
 */
export default function DeleteAccountPage() {
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
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-terracotta mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                Your account and profile information
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-terracotta mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                All reviews you have posted
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-terracotta mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                All messages you have sent or received
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-terracotta mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                Your favorites and saved businesses
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-terracotta mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                Any business listings you own
              </li>
            </ul>
          </section>

          {/* Deletion form */}
          <section className="bg-cream rounded-2xl border border-parchment p-6">
            <h2 className="text-lg font-semibold text-charcoal mb-3">
              Request account deletion
            </h2>
            <p className="text-sm text-stone mb-4">
              Enter the email address associated with your account. We will send a
              confirmation link to verify your identity before processing the deletion.
            </p>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const emailInput = form.elements.namedItem("email") as HTMLInputElement;
                const email = emailInput.value.trim();

                if (!email) return;

                try {
                  const res = await fetch("/api/auth/account", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      action: "request-deletion",
                      email,
                    }),
                  });

                  if (res.ok) {
                    alert("If an account exists with that email, you will receive a deletion confirmation link shortly.");
                    emailInput.value = "";
                  } else {
                    alert("Something went wrong. Please try again or contact support.");
                  }
                } catch {
                  alert("Something went wrong. Please try again.");
                }
              }}
              className="space-y-4"
            >
              <div>
                <label htmlFor="email" className="text-xs font-semibold text-stone uppercase tracking-wider mb-1.5 block">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="w-full px-4 py-2.5 bg-ecru border border-parchment rounded-xl text-sm text-charcoal placeholder-clay focus:border-terracotta focus:outline-none transition-colors"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 transition-colors"
              >
                Request Account Deletion
              </button>
            </form>
          </section>

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
