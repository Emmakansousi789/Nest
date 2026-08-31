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

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
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
        className="bg-cream w-full max-w-md mx-4 border border-parchment shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-2xl font-semibold text-charcoal">
              {mode === "signin" ? "Welcome back" : "Join Local Discover"}
            </h2>
            <button onClick={onClose} className="text-clay hover:text-charcoal text-xl leading-none">
              ×
            </button>
          </div>

          <div className="flex gap-0 mb-6 border-b border-parchment">
            <button
              onClick={() => { setMode("signin"); setError(""); }}
              className={`flex-1 pb-3 text-sm font-medium transition-colors ${
                mode === "signin"
                  ? "text-charcoal border-b-2 border-charcoal"
                  : "text-clay hover:text-graphite"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setMode("signup"); setError(""); }}
              className={`flex-1 pb-3 text-sm font-medium transition-colors ${
                mode === "signup"
                  ? "text-charcoal border-b-2 border-charcoal"
                  : "text-clay hover:text-graphite"
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <p className="text-xs text-terracotta bg-terracotta/5 p-3">{error}</p>
            )}

            {mode === "signup" && (
              <>
                <div>
                  <label className="text-[10px] font-semibold uppercase tracking-widest text-stone mb-1.5 block">
                    I am a
                  </label>
                  <div className="flex gap-0 border border-parchment">
                    <button
                      type="button"
                      onClick={() => setRole("customer")}
                      className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                        role === "customer"
                          ? "bg-charcoal text-cream"
                          : "bg-transparent text-graphite hover:bg-ecru"
                      }`}
                    >
                      🛒 Customer
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole("business")}
                      className={`flex-1 py-2.5 text-sm font-medium transition-colors border-l border-parchment ${
                        role === "business"
                          ? "bg-charcoal text-cream"
                          : "bg-transparent text-graphite hover:bg-ecru"
                      }`}
                    >
                      🏪 Business Owner
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-semibold uppercase tracking-widest text-stone mb-1.5 block">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="input-field"
                  />
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

            <div>
              <label className="text-[10px] font-semibold uppercase tracking-widest text-stone mb-1.5 block">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-field"
              />
            </div>
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-widest text-stone mb-1.5 block">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input-field"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-charcoal text-cream text-sm font-medium hover:bg-graphite transition-colors disabled:opacity-50 mt-6"
            >
              {loading ? "..." : mode === "signin" ? "Sign In" : "Create Account"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
