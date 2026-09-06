"use client";

import { useState, useEffect, useCallback } from "react";
import { Vendor } from "@/types";
import { getVendors } from "@/data/store";

interface UseVendorsResult {
  vendors: Vendor[];
  loading: boolean;
  source: "database" | "seed" | "loading";
  refresh: () => Promise<void>;
}

export function useVendors(options?: { ownerId?: string }): UseVendorsResult {
  const ownerId = options?.ownerId;
  const seedData = getVendors();
  const initial = ownerId
    ? seedData.filter((v) => v.ownerId === ownerId)
    : seedData;
  const [vendors, setVendors] = useState<Vendor[]>(initial);
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState<"database" | "seed">("seed");

  useEffect(() => {
    let cancelled = false;
    async function fetchVendors() {
      setLoading(true);
      try {
        const params = ownerId ? `?ownerId=${encodeURIComponent(ownerId)}` : "";
        const res = await fetch(`/api/vendors${params}`);
        if (!res.ok) throw new Error("API unavailable");
        const data = await res.json();
        if (!cancelled && data.vendors && data.vendors.length > 0) {
          setVendors(data.vendors);
          setSource(data.source || "database");
        }
      } catch {
        // API unavailable — keep seed data
        if (!cancelled) setSource("seed");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchVendors();
    return () => { cancelled = true; };
  }, [ownerId]);

  const refresh = useCallback(async () => {
    const params = ownerId ? `?ownerId=${encodeURIComponent(ownerId)}` : "";
    try {
      const res = await fetch(`/api/vendors${params}`);
      if (res.ok) {
        const data = await res.json();
        if (data.vendors && data.vendors.length > 0) {
          setVendors(data.vendors);
          setSource(data.source || "database");
        }
      }
    } catch { /* keep current data */ }
  }, [ownerId]);

  return { vendors, loading, source, refresh };
}
