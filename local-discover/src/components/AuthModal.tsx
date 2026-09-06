"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { AppleSignIn, SignInScope } from "@capawesome/capacitor-apple-sign-in";
import { Capacitor } from "@capacitor/core";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "signin" | "signup";
}

export default function AuthModal({ isOpen, onClose, initialMode = "signin" }: AuthModalProps) {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">(initialMode);
  const [role, setRole] = useState<"customer" | "business">("customer");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [agreed, setAgreed] = useState(false);

  // Reset mode when modal opens with a specific initial mode
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setError("");
      setFieldErrors({});
      setEmail("");
      setPassword("");
      setName("");
      setBusinessName("");
      setAgreed(false);
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  const validateFields = () => {
    const errors: Record<string, string> = {};
    if (mode === "signup" && !name.trim()) errors.name = "Name is required";
    if (!email.trim()) errors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Enter a valid email";
    if (!password) errors.password = "Password is required";
    else if (password.length < 6) errors.password = "At least 6 characters";
    if (mode === "signup" && !agreed) errors.terms = "You must agree to the Terms of Use";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!validateFields()) return;
    setLoading(true);

    if (mode === "signin") {
      const result = await login(email, password);
      if (result.error) {
        setError(result.error);
        setLoading(false);
        return;
      }
    } else {
      const result = await signup({ name, email, password, role, businessName });
      if (result.error) {
        setError(result.error);
        setLoading(false);
        return;
      }
    }
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center sheet-backdrop" onClick={onClose}>
      <div
        className="bg-cream w-full max-w-md mx-4 rounded-2xl border border-parchment shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-2xl font-semibold text-charcoal">
              {mode === "signin" ? "Welcome back" : "Join Local Discover"}
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full text-clay hover:text-charcoal hover:bg-ecru transition-all duration-200 pressable focus-ring"
            >
              ×
            </button>
          </div>

          {/* Tab navigation */}
          <div className="flex gap-0 mb-6 border-b border-parchment">
            <button
              onClick={() => { setMode("signin"); setError(""); setFieldErrors({}); }}
              className={`flex-1 pb-3 text-sm font-medium transition-all duration-200 focus-ring ${
                mode === "signin"
                  ? "text-charcoal border-b-2 border-charcoal"
                  : "text-clay hover:text-graphite"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setMode("signup"); setError(""); setFieldErrors({}); }}
              className={`flex-1 pb-3 text-sm font-medium transition-all duration-200 focus-ring ${
                mode === "signup"
                  ? "text-charcoal border-b-2 border-charcoal"
                  : "text-clay hover:text-graphite"
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Error banner */}
            {error && (
              <div className="flex items-center gap-2 text-xs text-error bg-error-light p-3 rounded-xl">
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                {error}
              </div>
            )}

            {/* Sign in with Apple — equally prominent, shown above email for both modes */}
            {mode === "signin" && (
              <button
                type="button"
                onClick={async () => {
                  setLoading(true);
                  setError("");
                  try {
                    if (Capacitor.isNativePlatform()) {
                      const result = await AppleSignIn.signIn({
                        scopes: [SignInScope.Email, SignInScope.FullName],
                      });
                      // On native, send the identity token to our auth endpoint
                      const res = await fetch("/api/auth/native-apple", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          token: result.idToken,
                        }),
                      });
                      if (res.ok) {
                        const sessionRes = await fetch("/api/auth/session");
                        const sessionData = await sessionRes.json();
                        if (sessionData?.user) {
                          onClose();
                          window.location.reload();
                          return;
                        }
                      }
                      setError("Apple Sign In failed. Please try again.");
                    } else {
                      // Web: Apple Sign In is not configured yet — show helpful message
                      setError("Apple Sign In is not available on web yet. Please use email/password or the demo account.");
                      setLoading(false);
                      return;
                    }
                  } catch (err) {
                    if ((err as Error)?.message?.includes("cancelled")) {
                      // User cancelled — no error needed
                    } else {
                      setError("Apple Sign In failed. Please try again.");
                    }
                  } finally {
                    setLoading(false);
                  }
                }}
                className="w-full py-3 bg-black text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
                Sign in with Apple
              </button>
            )}

            {/* Divider */}
            {mode === "signin" && (
              <div className="flex items-center gap-3 my-1">
                <div className="flex-1 border-t border-parchment" />
                <span className="text-[10px] text-clay uppercase tracking-wider">or</span>
                <div className="flex-1 border-t border-parchment" />
              </div>
            )}

            {mode === "signup" && (
              <>
                {/* Role toggle */}
                <div>
                  <label className="text-[10px] font-semibold uppercase tracking-widest text-stone mb-1.5 block">
                    I am a
                  </label>
                  <div className="flex gap-0 border border-parchment rounded-xl overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setRole("customer")}
                      className={`flex-1 py-2.5 text-sm font-medium transition-all duration-200 pressable ${
                        role === "customer"
                          ? "bg-charcoal text-cream"
                          : "bg-transparent text-graphite hover:bg-ecru"
                      }`}
                    >
                      Customer
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole("business")}
                      className={`flex-1 py-2.5 text-sm font-medium transition-all duration-200 border-l border-parchment pressable ${
                        role === "business"
                          ? "bg-charcoal text-cream"
                          : "bg-transparent text-graphite hover:bg-ecru"
                      }`}
                    >
                      Business Owner
                    </button>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="text-[10px] font-semibold uppercase tracking-widest text-stone mb-1.5 block">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => { setName(e.target.value); setFieldErrors((p) => ({ ...p, name: "" })); }}
                    className={`input-field ${fieldErrors.name ? "input-error" : ""}`}
                  />
                  {fieldErrors.name && (
                    <p className="input-error-message">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                      </svg>
                      {fieldErrors.name}
                    </p>
                  )}
                </div>

                {role === "business" && (
                  <div>
                    <label className="text-[10px] font-semibold uppercase tracking-widest text-stone mb-1.5 block">
                      Business Name
                    </label>
                    <input
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="input-field"
                    />
                  </div>
                )}
              </>
            )}

            {/* Email */}
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-widest text-stone mb-1.5 block">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setFieldErrors((p) => ({ ...p, email: "" })); }}
                className={`input-field ${fieldErrors.email ? "input-error" : ""}`}
              />
              {fieldErrors.email && (
                <p className="input-error-message">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                  {fieldErrors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-widest text-stone mb-1.5 block">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setFieldErrors((p) => ({ ...p, password: "" })); }}
                className={`input-field ${fieldErrors.password ? "input-error" : ""}`}
              />
              {fieldErrors.password && (
                <p className="input-error-message">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                  {fieldErrors.password}
                </p>
              )}
            </div>

            {/* Legal agreement (signup only) */}
            {mode === "signup" && (
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => { setAgreed(e.target.checked); setFieldErrors((p) => ({ ...p, terms: "" })); }}
                  className="mt-0.5 rounded border-parchment text-terracotta focus:ring-terracotta"
                />
                <span className="text-xs text-stone leading-relaxed">
                  I agree to the{' '}
                  <Link href="/terms" target="_blank" className="text-terracotta hover:text-terracotta-dark underline">Terms of Use</Link>
                  {' '}and{' '}
                  <Link href="/privacy" target="_blank" className="text-terracotta hover:text-terracotta-dark underline">Privacy Policy</Link>
                </span>
              </div>
            )}
            {fieldErrors.terms && (
              <p className="input-error-message">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                {fieldErrors.terms}
              </p>
            )}

            {/* Demo login for App Review */}
            {mode === "signin" && (
              <button
                type="button"
                onClick={async () => {
                  setLoading(true);
                  setError("");
                  try {
                    // Fetch ephemeral demo credentials from server — never hardcoded in client
                    const res = await fetch("/api/auth/demo", { method: "POST" });
                    const creds = await res.json();
                    if (creds?.email && creds?.password) {
                      await login(creds.email, creds.password);
                      onClose();
                    } else {
                      setError("Demo account unavailable. Please create an account.");
                    }
                  } catch {
                    setError("Demo account unavailable. Please create an account.");
                  } finally {
                    setLoading(false);
                  }
                }}
                className="w-full py-2.5 bg-ecru border border-parchment text-charcoal rounded-xl text-sm font-medium hover:bg-parchment transition-colors"
              >
                Try Demo Account
              </button>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 btn-primary mt-4 justify-center"
            >
              {loading ? (
                <div className="spinner !w-5 !h-5 !border-2 !border-white/30 !border-t-white" />
              ) : mode === "signin" ? "Sign In" : "Create Account"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
