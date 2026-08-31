"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { User } from "@/types";

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
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);

  // Sync NextAuth session to our User type
  const user: User | null = session?.user
    ? {
        id: (session.user as { id?: string }).id || "",
        name: session.user.name || "",
        email: session.user.email || "",
        role: (session.user as { role?: string }).role === "BUSINESS" ? "business" : "customer",
      }
    : null;

  useEffect(() => {
    setLoading(status === "loading");
  }, [status]);

  const login = useCallback(async (email: string, password: string) => {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (result?.error) {
      return { error: "Invalid email or password" };
    }
    return {};
  }, []);

  const signup = useCallback(async (data: {
    name: string;
    email: string;
    password: string;
    role: "customer" | "business";
    businessName?: string;
  }) => {
    // Call our signup API
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (result.error) {
      return { error: result.error };
    }
    // Auto-login after signup
    const loginResult = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });
    if (loginResult?.error) {
      return { error: "Account created but login failed" };
    }
    return {};
  }, []);

  const logout = useCallback(() => {
    signOut();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
