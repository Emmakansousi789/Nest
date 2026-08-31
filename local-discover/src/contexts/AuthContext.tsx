"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
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

// Demo user for testing — auth is disabled
const DEMO_BUSINESS_USER: User = {
  id: "demo-business-1",
  name: "Demo Business Owner",
  email: "demo@localdiscover.com",
  role: "business",
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(DEMO_BUSINESS_USER);
  const [loading] = useState(false);

  const login = useCallback(async (_email: string, _password: string) => {
    // Auth disabled — always succeed
    return {};
  }, []);

  const signup = useCallback(async (_data: {
    name: string;
    email: string;
    password: string;
    role: "customer" | "business";
    businessName?: string;
  }) => {
    // Auth disabled — always succeed
    return {};
  }, []);

  const logout = useCallback(() => {
    // Auth disabled — just toggle to customer view
    setUser((prev) =>
      prev?.role === "business"
        ? { ...prev, role: "customer", name: "Demo Customer" }
        : DEMO_BUSINESS_USER
    );
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
