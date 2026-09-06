"use client";

import { useState, useEffect, useCallback } from "react";
import type { Review } from "@/data/reviews";
import { getReviewsForVendor as getSeedReviews } from "@/data/store";

interface UseReviewsResult {
  reviews: Review[];
  loading: boolean;
  refresh: () => Promise<void>;
}

export function useReviews(vendorId: string | undefined): UseReviewsResult {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = useCallback(async () => {
    if (!vendorId) {
      setReviews([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/reviews?vendorId=${encodeURIComponent(vendorId)}`);
      if (!res.ok) throw new Error("API unavailable");
      const data = await res.json();
      setReviews(data.reviews || []);
    } catch {
      // Fallback to seed reviews
      setReviews(getSeedReviews(vendorId));
    } finally {
      setLoading(false);
    }
  }, [vendorId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  return { reviews, loading, refresh: fetchReviews };
}
