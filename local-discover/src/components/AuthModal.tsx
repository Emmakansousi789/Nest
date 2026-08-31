"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [role, setRole] = useState<"customer" | "business">("customer");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const validateFields = () => {
    const errors: Record<string, string> = {};
    if (mode === "signup" && !name.trim()) errors.name = "Name is required";
    if (!email.trim()) errors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Enter a valid email";
    if (!password) errors.password = "Password is required";
    else if (password.length < 6) errors.password = "At least 6 characters";
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

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 btn-primary mt-6 justify-center"
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
