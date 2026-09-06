"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { getVendors, getAllReviews } from "@/data/store";
import { getFavorites } from "@/lib/favorites";
import PullToRefresh from "@/components/PullToRefresh";
import AuthModal from "@/components/AuthModal";

type ProfileView =
  | "main"
  | "settings"
  | "account-settings"
  | "personal-info"
  | "privacy"
  | "notifications"
  | "login-security"
  | "help"
  | "account-deletion";

// ─── Toggle switch ───
function Toggle({
  enabled,
  onToggle,
}: {
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className={`relative w-[51px] h-[31px] rounded-full transition-colors duration-200 shrink-0 ${
        enabled ? "bg-charcoal" : "bg-gray-300"
      }`}
    >
      <span
        className={`absolute top-[2px] left-[2px] w-[27px] h-[27px] bg-white rounded-full shadow-sm transition-transform duration-200 flex items-center justify-center ${
          enabled ? "translate-x-[20px]" : "translate-x-0"
        }`}
      >
        {enabled && (
          <svg
            className="w-3 h-3 text-charcoal"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>
        )}
      </span>
    </button>
  );
}

// ─── Back header ───
function BackHeader({
  title,
  onBack,
}: {
  title: string;
  onBack: () => void;
}) {
  return (
    <div className="sticky top-0 z-40 bg-white border-b border-gray-100 px-4 py-3.5">
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-ecru transition-colors"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#222"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <h1 className="text-base font-semibold text-charcoal">{title}</h1>
      </div>
    </div>
  );
}

// ─── Reusable row ───
function SettingsRow({
  icon,
  label,
  subtitle,
  value,
  onClick,
  href,
  danger,
}: {
  icon: React.ReactNode;
  label: string;
  subtitle?: string;
  value?: string;
  onClick?: () => void;
  href?: string;
  danger?: boolean;
}) {
  const content = (
    <div className="flex items-center gap-3.5 py-3.5 px-4">
      <div className="w-8 h-8 rounded-lg bg-ecru flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-medium ${danger ? "text-red-500" : "text-charcoal"}`}
        >
          {label}
        </p>
        {subtitle && (
          <p className="text-xs text-stone mt-0.5">{subtitle}</p>
        )}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {value && <span className="text-xs text-stone">{value}</span>}
        <svg
          className="w-4 h-4 text-clay"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 4.5l7.5 7.5-7.5 7.5"
          />
        </svg>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        target="_blank"
        className="block hover:bg-ecru/50 transition-colors"
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      className="w-full text-left hover:bg-ecru/50 transition-colors"
    >
      {content}
    </button>
  );
}

// ─── Section wrapper ───
function SettingsSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h3 className="text-xs font-semibold uppercase tracking-wider text-stone mb-2 px-1">
        {title}
      </h3>
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden divide-y divide-gray-100">
        {children}
      </div>
    </section>
  );
}

// ─── Main Component ───
export default function ProfileTab() {
  const { user, logout } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [view, setView] = useState<ProfileView>("main");
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");

  // Personal info state
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [nameSaved, setNameSaved] = useState(false);

  // Privacy toggles — persisted to encrypted storage
  type PrivacyState = { readReceipts: boolean; listingInSearch: boolean; showCity: boolean; showTripType: boolean; showLength: boolean; showServices: boolean };
  const defaultPrivacy: PrivacyState = { readReceipts: true, listingInSearch: true, showCity: true, showTripType: true, showLength: true, showServices: true };
  const [privacy, setPrivacy] = useState<PrivacyState>(defaultPrivacy);

  // Load privacy from encrypted storage on mount
  useEffect(() => {
    import("@/lib/secure-storage").then(({ secureGet }) => {
      secureGet("ld-privacy").then((saved) => {
        if (saved) {
          try { setPrivacy(JSON.parse(saved) as PrivacyState); } catch { /* ignore */ }
        }
      });
    });
  }, []);

  // Persist privacy to encrypted storage on change
  useEffect(() => {
    import("@/lib/secure-storage").then(({ secureSet }) => {
      secureSet("ld-privacy", JSON.stringify(privacy));
    });
  }, [privacy]);

  // Deletion state
  const [deleteRegion, setDeleteRegion] = useState("");
  const [deleteReason, setDeleteReason] = useState("");

  // Loading state for tab transitions
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleViewChange = (newView: ProfileView) => {
    setIsTransitioning(true);
    requestAnimationFrame(() => {
      setView(newView);
      setIsTransitioning(false);
    });
  };

  useEffect(() => {
    setMounted(true);
    getFavorites().then(setSavedIds);
  }, []);

  useEffect(() => {
    if (view === "personal-info" && user) {
      setEditName(user.name);
      setEditEmail(user.email);
    }
  }, [view, user]);

  const handleRefresh = useCallback(() => {
    return new Promise<void>((resolve) => {
      getFavorites().then(setSavedIds);
      setTimeout(resolve, 500);
    });
  }, []);

  if (!mounted) return null;

  // Transition wrapper for view changes
  if (isTransitioning) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="spinner" />
      </div>
    );
  }

  const savedVendors = getVendors().filter((v) => savedIds.includes(v.id));
  const allReviews = user ? getAllReviews() : [];

  // ─── Notifications ───
  if (view === "notifications") {
    return (
      <div className="min-h-screen bg-white">
        <BackHeader title="Notifications" onBack={() => handleViewChange("settings")} />
        <div className="px-5 py-5 pb-28">
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto rounded-full bg-ecru flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-stone" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-charcoal mb-2">No notifications yet</h3>
            <p className="text-sm text-stone max-w-sm mx-auto">
              When you get notifications, they&apos;ll show up here.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ─── Login & Security ───
  if (view === "login-security") {
    return (
      <div className="min-h-screen bg-white">
        <BackHeader title="Login & security" onBack={() => handleViewChange("account-settings")} />
        <div className="px-5 py-5 pb-28">
          <div className="space-y-6">
            {/* Email */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-stone mb-1.5 block">Email</label>
              <div className="flex items-center gap-3">
                <input
                  type="email"
                  value={user?.email || ""}
                  readOnly
                  className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-charcoal"
                />
                <button className="px-4 py-3 bg-ecru text-charcoal text-sm font-medium rounded-xl border border-parchment hover:bg-parchment transition-colors">
                  Edit
                </button>
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-stone mb-1.5 block">Phone number</label>
              <div className="flex items-center gap-3">
                <input
                  type="tel"
                  placeholder="Add phone number"
                  className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-charcoal"
                />
                <button className="px-4 py-3 bg-ecru text-charcoal text-sm font-medium rounded-xl border border-parchment hover:bg-parchment transition-colors">
                  Add
                </button>
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-stone mb-1.5 block">Password</label>
              <div className="flex items-center gap-3">
                <input
                  type="password"
                  value="••••••••"
                  readOnly
                  className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-charcoal"
                />
                <button className="px-4 py-3 bg-ecru text-charcoal text-sm font-medium rounded-xl border border-parchment hover:bg-parchment transition-colors">
                  Update
                </button>
              </div>
            </div>

            {/* Social logins */}
            <div className="pt-4">
              <h3 className="text-base font-bold text-charcoal mb-4">Social accounts</h3>
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden divide-y divide-gray-100">
                <div className="flex items-center justify-between py-3.5 px-4">
                  <span className="text-sm font-medium text-charcoal">Google</span>
                  <button className="px-3 py-1.5 text-xs font-medium text-terracotta border border-terracotta/30 rounded-lg hover:bg-terracotta/5 transition-colors">
                    Connect
                  </button>
                </div>
                <div className="flex items-center justify-between py-3.5 px-4">
                  <span className="text-sm font-medium text-charcoal">Apple</span>
                  <button className="px-3 py-1.5 text-xs font-medium text-terracotta border border-terracotta/30 rounded-lg hover:bg-terracotta/5 transition-colors">
                    Connect
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── Help ───
  if (view === "help") {
    return (
      <div className="min-h-screen bg-white">
        <BackHeader title="Get help" onBack={() => handleViewChange("settings")} />
        <div className="px-5 py-5 pb-28">
          <div className="space-y-6">
            <p className="text-sm text-stone leading-relaxed">
              Need help with something? Reach out and we&apos;ll get back to you as soon as possible.
            </p>

            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden divide-y divide-gray-100">
              <button
                onClick={() => { window.open("mailto:hello@localdiscover.com", "_self"); }}
                className="w-full flex items-center gap-3.5 py-4 px-4 text-left hover:bg-ecru/50 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-ecru flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-charcoal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-charcoal">Contact support</p>
                  <p className="text-xs text-stone">hello@localdiscover.com</p>
                </div>
                <svg className="w-4 h-4 text-clay" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>

              <Link
                href="/privacy"
                className="flex items-center gap-3.5 py-4 px-4 hover:bg-ecru/50 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-ecru flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-charcoal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-charcoal">Privacy Policy</p>
                </div>
                <svg className="w-4 h-4 text-clay" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </Link>

              <Link
                href="/terms"
                className="flex items-center gap-3.5 py-4 px-4 hover:bg-ecru/50 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-ecru flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-charcoal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-charcoal">Terms of Use</p>
                </div>
                <svg className="w-4 h-4 text-clay" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </Link>
            </div>

            <div className="text-center pt-4">
              <p className="text-xs text-stone">Local Discover v1.0</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── Account Deletion (full flow) ───
  if (view === "account-deletion") {
    return (
      <div className="min-h-screen bg-white">
        <BackHeader title="" onBack={() => handleViewChange("privacy")} />
        <div className="px-5 py-4 pb-28">
          <h1 className="text-[26px] font-bold text-charcoal mb-3">
            Delete your account
          </h1>
          <p className="text-sm text-stone leading-relaxed mb-5">
            Before we delete your data, we&apos;ll just need you to answer a few
            questions. To confirm you&apos;re the true owner of this account, we
            may also contact you at{" "}
            <span className="text-charcoal font-medium">
              {user?.email || "your email"}
            </span>
            .
          </p>
          <a
            href="/terms"
            target="_blank"
            className="text-sm text-charcoal underline font-medium mb-8 block"
          >
            Learn more about account deletion requests.
          </a>

          <div className="space-y-6">
            <div>
              <label className="text-sm font-semibold text-charcoal mb-2 block">
                Where do you reside?
              </label>
              <select
                value={deleteRegion}
                onChange={(e) => setDeleteRegion(e.target.value)}
                className="w-full px-4 py-3.5 border border-gray-300 rounded-xl text-sm text-charcoal bg-white appearance-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23222' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 12px center",
                }}
              >
                <option value="">Country/Region</option>
                <option value="US">United States</option>
                <option value="CA">Canada</option>
                <option value="GB">United Kingdom</option>
                <option value="AU">Australia</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold text-charcoal mb-2 block">
                Why are you deleting your account?
              </label>
              <select
                value={deleteReason}
                onChange={(e) => setDeleteReason(e.target.value)}
                className="w-full px-4 py-3.5 border border-gray-300 rounded-xl text-sm text-charcoal bg-white appearance-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23222' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 12px center",
                }}
              >
                <option value="">Select reason (optional)</option>
                <option value="not-using">I&apos;m not using this account</option>
                <option value="privacy">Privacy concerns</option>
                <option value="duplicate">I have a duplicate account</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="mt-12">
            <button
              onClick={async () => {
                try {
                  await fetch("/api/auth/account", { method: "DELETE" });
                  logout();
                } catch {
                  // handle error
                }
              }}
              disabled={!deleteRegion}
              className={`w-full py-3.5 rounded-xl text-sm font-semibold transition-colors ${
                deleteRegion
                  ? "bg-charcoal text-white hover:bg-graphite"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              Delete account
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Privacy settings ───
  if (view === "privacy") {
    return (
      <div className="min-h-screen bg-white">
        <BackHeader
          title="Privacy"
          onBack={() => handleViewChange("account-settings")}
        />
        <div className="px-5 py-5 pb-28">
          <p className="text-sm text-stone leading-relaxed mb-8">
            Control how your information is used and shared with others on Local
            Discover.
          </p>

          {/* Read receipts */}
          <h2 className="text-base font-bold text-charcoal mb-4">
            Read receipts
          </h2>
          <div className="flex items-center justify-between py-4 border-b border-gray-100">
            <div className="flex-1 mr-4">
              <p className="text-sm font-medium text-charcoal">
                Show people when I&apos;ve read their messages.
              </p>
            </div>
            <Toggle
              enabled={privacy.readReceipts}
              onToggle={() =>
                setPrivacy((p: PrivacyState) => ({ ...p, readReceipts: !p.readReceipts }))
              }
            />
          </div>

          {/* Listings */}
          <h2 className="text-base font-bold text-charcoal mb-4 mt-8">
            Listings
          </h2>
          <div className="flex items-center justify-between py-4 border-b border-gray-100">
            <div className="flex-1 mr-4">
              <p className="text-sm font-medium text-charcoal">
                Include my listing(s) in search engines
              </p>
              <p className="text-xs text-stone mt-1">
                Turning this on means search engines, like Google, will display
                your listing page(s) in search results.
              </p>
            </div>
            <Toggle
              enabled={privacy.listingInSearch}
              onToggle={() =>
                setPrivacy((p: PrivacyState) => ({
                  ...p,
                  listingInSearch: !p.listingInSearch,
                }))
              }
            />
          </div>

          {/* Reviews */}
          <h2 className="text-base font-bold text-charcoal mb-2 mt-8">
            Reviews
          </h2>
          <p className="text-xs text-stone leading-relaxed mb-4">
            Choose what&apos;s shared when you write a review.
          </p>

          {[
            {
              key: "showCity" as const,
              label: "Show my home city and country",
              sub: "Ex: City and country",
            },
            {
              key: "showTripType" as const,
              label: "Show my trip type",
              sub: "Ex: Stayed with kids or pets",
            },
            {
              key: "showLength" as const,
              label: "Show my length of stay",
              sub: "Ex: A few nights, about a week, etc.",
            },
            {
              key: "showServices" as const,
              label: "Show my booked services",
              sub: "Ex: Gourmet brunch or tasting menu",
            },
          ].map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between py-4 border-b border-gray-100"
            >
              <div className="flex-1 mr-4">
                <p className="text-sm font-medium text-charcoal">
                  {item.label}
                </p>
                <p className="text-xs text-stone mt-0.5">{item.sub}</p>
              </div>
              <Toggle
                enabled={privacy[item.key]}
                onToggle={() =>
                  setPrivacy((p: PrivacyState) => ({ ...p, [item.key]: !p[item.key] }))
                }
              />
            </div>
          ))}

          {/* Data privacy */}
          <h2 className="text-base font-bold text-charcoal mb-4 mt-8">
            Data privacy
          </h2>
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-4 py-4">
              <p className="text-sm font-medium text-charcoal">
                Request my personal data
              </p>
            </div>
          </div>

          {/* Delete account */}
          <div className="mt-8">
            <button
              onClick={() => handleViewChange("account-deletion")}
              className="w-full bg-white rounded-2xl border border-gray-100 px-4 py-4 text-left"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-charcoal">
                  Delete my account
                </p>
                <svg
                  className="w-4 h-4 text-clay"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 4.5l7.5 7.5-7.5 7.5"
                  />
                </svg>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Personal Information ───
  if (view === "personal-info") {
    return (
      <div className="min-h-screen bg-white">
        <BackHeader
          title="Personal information"
          onBack={() => handleViewChange("account-settings")}
        />
        <div className="px-5 py-5 pb-28">
          <p className="text-sm text-stone leading-relaxed mb-6">
            This is the information associated with your account.
          </p>

          <div className="space-y-5">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-stone mb-1.5 block">
                Legal name
              </label>
              <input
                type="text"
                value={editName}
                onChange={(e) => {
                  setEditName(e.target.value);
                  setNameSaved(false);
                }}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-charcoal focus:border-charcoal focus:ring-1 focus:ring-charcoal outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-stone mb-1.5 block">
                Email
              </label>
              <input
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-charcoal focus:border-charcoal focus:ring-1 focus:ring-charcoal outline-none"
              />
            </div>
          </div>

          <button
            onClick={() => setNameSaved(true)}
            className="w-full py-3.5 bg-charcoal text-white rounded-xl text-sm font-semibold mt-8 hover:bg-graphite transition-colors"
          >
            {nameSaved ? "✓ Saved!" : "Save"}
          </button>

          {nameSaved && (
            <p className="text-xs text-stone text-center mt-3">
              Your changes have been saved.
            </p>
          )}
        </div>
      </div>
    );
  }

  // ─── Account Settings (sub-page) ───
  if (view === "account-settings") {
    return (
      <div className="min-h-screen bg-white">
        <BackHeader
          title="Account settings"
          onBack={() => handleViewChange("settings")}
        />
        <div className="px-4 py-5 pb-28 space-y-6">
          <SettingsSection title="">
            <SettingsRow
              icon={
                <svg
                  className="w-4 h-4 text-charcoal"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                  />
                </svg>
              }
              label="Personal information"
              onClick={() => handleViewChange("personal-info")}
            />
            <SettingsRow
              icon={
                <svg
                  className="w-4 h-4 text-charcoal"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                  />
                </svg>
              }
              label="Login &amp; security"
              onClick={() => handleViewChange("login-security")}
            />
          </SettingsSection>

          <SettingsSection title="">
            <SettingsRow
              icon={
                <svg
                  className="w-4 h-4 text-charcoal"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z"
                  />
                </svg>
              }
              label="Privacy"
              onClick={() => handleViewChange("privacy")}
            />
            <SettingsRow
              icon={
                <svg
                  className="w-4 h-4 text-charcoal"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
                  />
                </svg>
              }
              label="Notifications"
              onClick={() => handleViewChange("notifications")}
            />
          </SettingsSection>

          <SettingsSection title="">
            <SettingsRow
              icon={
                <svg
                  className="w-4 h-4 text-charcoal"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z"
                  />
                </svg>
              }
              label="Legal"
              href="/terms"
            />
          </SettingsSection>
        </div>
      </div>
    );
  }



  // ─── Settings View ───
  if (view === "settings") {
    return (
      <div className="min-h-screen bg-white">
        <BackHeader title="Profile" onBack={() => handleViewChange("main")} />
        <div className="px-4 py-5 pb-28">
          {/* Become a vendor CTA */}
          <Link
            href="/for-vendors"
            className="block bg-ecru rounded-2xl p-5 mb-8"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-white flex items-center justify-center shrink-0">
                <svg
                  className="w-7 h-7 text-charcoal"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016A3.001 3.001 0 0021 9.349"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-bold text-charcoal">
                  Become a vendor
                </h3>
                <p className="text-sm text-stone">
                  It&apos;s easy to start listing and earn extra income.
                </p>
              </div>
            </div>
          </Link>

          {/* Settings list */}
          <div className="space-y-5">
            <SettingsSection title="">
              <SettingsRow
                icon={
                  <svg
                    className="w-4 h-4 text-charcoal"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                }
              label="Account settings"
              onClick={() => handleViewChange("account-settings")}
              />
              <SettingsRow
                icon={
                  <svg
                    className="w-4 h-4 text-charcoal"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
                    />
                  </svg>
                }
              label="Get help"
              onClick={() => handleViewChange("help")}
              />
              <SettingsRow
                icon={
                  <svg
                    className="w-4 h-4 text-charcoal"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                    />
                  </svg>
                }
              label="View profile"
              onClick={() => handleViewChange("main")}
              />
              <SettingsRow
                icon={
                  <svg
                    className="w-4 h-4 text-charcoal"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z"
                    />
                  </svg>
                }
              label="Privacy"
              onClick={() => handleViewChange("privacy")}
            />
          </SettingsSection>

          <SettingsSection title="">
            <SettingsRow
              icon={
                <svg
                  className="w-4 h-4 text-charcoal"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                  />
                </svg>
              }
              label="Legal"
              href="/terms"
            />
          </SettingsSection>

          <SettingsSection title="">
            <SettingsRow
              icon={
                <svg
                  className="w-4 h-4 text-charcoal"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                  />
                </svg>
              }
              label="Log out"
              onClick={logout}
            />
          </SettingsSection>
          </div>
        </div>
      </div>
    );
  }

  // ─── Main Profile View ───
  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <div className="min-h-screen bg-white px-4 sm:px-6 pb-28">
        {/* Title */}
        <div className="flex items-center justify-between pt-4 mb-6">
          <h1 className="text-[28px] font-bold text-charcoal tracking-tight">
            Profile
          </h1>
          {user && (
            <button
              onClick={() => handleViewChange("settings")}
              className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-ecru transition-colors"
            >
              <svg
                className="w-5 h-5 text-charcoal"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Profile card */}
        {user ? (
          <div className="bg-white rounded-3xl border border-gray-100 p-6 mb-6 shadow-sm">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#E31C5F] to-[#C1124A] flex items-center justify-center text-2xl font-bold text-white shrink-0">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-center">
                    <p className="text-xl font-bold text-charcoal">
                      {savedVendors.length}
                    </p>
                    <p className="text-xs text-stone">Saved</p>
                  </div>
                  <div className="w-px h-8 bg-gray-200" />
                  <div className="text-center">
                    <p className="text-xl font-bold text-charcoal">
                      {allReviews.length}
                    </p>
                    <p className="text-xs text-stone">Reviews</p>
                  </div>
                </div>
                <h2 className="text-lg font-bold text-charcoal">
                  {user.name}
                </h2>
                <p className="text-sm text-stone">{user.email}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-gray-100 p-6 mb-6 shadow-sm">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-full bg-ecru flex items-center justify-center shrink-0">
                <svg
                  className="w-8 h-8 text-stone"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-bold text-charcoal mb-1">
                  Your Profile
                </h2>
                <p className="text-sm text-stone mb-3">
                  Sign in to save favorites and leave reviews.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setAuthMode("signin");
                      setAuthOpen(true);
                    }}
                    className="px-4 py-2 bg-charcoal text-white text-sm font-medium rounded-xl hover:bg-graphite transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      setAuthMode("signup");
                      setAuthOpen(true);
                    }}
                    className="px-4 py-2 bg-ecru text-charcoal text-sm font-medium rounded-xl border border-parchment hover:bg-parchment transition-colors"
                  >
                    Sign Up
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Feature cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          <div className="bg-ecru rounded-2xl p-4 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center mb-2">
              <svg
                className="w-6 h-6 text-charcoal"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                />
              </svg>
            </div>
            <span className="text-sm font-medium text-charcoal">
              Saved businesses
            </span>
          </div>
          <div className="bg-ecru rounded-2xl p-4 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center mb-2">
              <svg
                className="w-6 h-6 text-charcoal"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                />
              </svg>
            </div>
            <span className="text-sm font-medium text-charcoal">Reviews</span>
          </div>
        </div>

        {/* Settings entry */}
        {user && (
          <button
            onClick={() => setView("settings")}
            className="w-full flex items-center justify-between py-4 border-b border-gray-100"
          >
            <div className="flex items-center gap-4">
              <svg
                className="w-5 h-5 text-charcoal"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className="text-sm font-medium text-charcoal">
                Settings
              </span>
            </div>
            <svg
              className="w-4 h-4 text-clay"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          </button>
        )}

        {/* Non-logged-in: show sign in/up buttons */}
        {!user && (
          <div className="space-y-3">
            <button
              onClick={() => {
                setAuthMode("signin");
                setAuthOpen(true);
              }}
              className="w-full py-3.5 bg-charcoal text-white rounded-2xl text-sm font-semibold hover:bg-graphite transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setAuthMode("signup");
                setAuthOpen(true);
              }}
              className="w-full py-3.5 bg-ecru text-charcoal border border-parchment rounded-2xl text-sm font-semibold hover:bg-parchment transition-colors"
            >
              Create Account
            </button>
          </div>
        )}
      </div>

      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        initialMode={authMode}
      />
    </PullToRefresh>
  );
}
