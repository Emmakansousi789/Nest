"use client";

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { User } from "@/types";

// ⚡ DEVELOPMENT BYPASS — set to true to auto-login as a demo business user
// Flip this to false before deploying to production
const DEV_AUTH_BYPASS = false;

// Build-time assertion to prevent shipping with bypass enabled
if (DEV_AUTH_BYPASS && process.env.NODE_ENV === "production") {
  throw new Error("CRITICAL: DEV_AUTH_BYPASS must be false in production");
}

const DEV_USER: User = {
  id: "dev-user-001",
  name: "Dev User",
  email: "dev@localdiscover.com",
  role: "business",
};

interface AuthState {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  signup: (data: {
    name: string;
    email: string;
    password: string;
    role: "customer" | "business";
    businessName?: string;
  }) => Promise<{ error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch current session on mount
  useEffect(() => {
    if (DEV_AUTH_BYPASS) {
      // Skip API — auto-login as dev user
      setUser(DEV_USER);
      setLoading(false);
      return;
    }

    async function fetchSession() {
      try {
        const res = await fetch("/api/auth/session");
        const data = await res.json();
        if (data?.user) {
          setUser({
            id: data.user.id,
            name: data.user.name || "User",
            email: data.user.email || "",
            role: data.user.role === "BUSINESS" ? "business" : "customer",
          });
        }
      } catch {
        // Not logged in — that's fine
      } finally {
        setLoading(false);
      }
    }
    fetchSession();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    if (DEV_AUTH_BYPASS) {
      setUser(DEV_USER);
      return {};
    }

    try {
      // Fetch CSRF token from NextAuth before submitting
      const csrfRes = await fetch("/api/auth/csrf");
      const { csrfToken } = await csrfRes.json();

      const res = await fetch("/api/auth/callback/credentials", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          email,
          password,
          csrfToken,
          callbackUrl: "/",
          json: "true",
        }),
      });

      if (res.ok) {
        const sessionRes = await fetch("/api/auth/session");
        const sessionData = await sessionRes.json();
        if (sessionData?.user) {
          setUser({
            id: sessionData.user.id,
            name: sessionData.user.name || "User",
            email: sessionData.user.email || "",
            role: sessionData.user.role === "BUSINESS" ? "business" : "customer",
          });
          return {};
        }
      }

      return { error: "Invalid email or password" };
    } catch {
      return { error: "Something went wrong. Please try again." };
    }
  }, []);

  const signup = useCallback(async (data: {
    name: string;
    email: string;
    password: string;
    role: "customer" | "business";
    businessName?: string;
  }) => {
    if (DEV_AUTH_BYPASS) {
      setUser(DEV_USER);
      return {};
    }

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok && result.user) {
        return await login(data.email, data.password);
      }

      return { error: result.error || "Signup failed" };
    } catch {
      return { error: "Something went wrong. Please try again." };
    }
  }, [login]);

  const logout = useCallback(async () => {
    if (DEV_AUTH_BYPASS) {
      setUser(null);
      return;
    }

    try {
      await fetch("/api/auth/signout", { method: "POST" });
    } finally {
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
