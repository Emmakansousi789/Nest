"use client";

import { useEffect, useRef, useCallback, useState } from "react";

/**
 * Polls a fetcher function at a fixed interval while the tab is visible.
 * Pauses when the tab is hidden, resumes when visible.
 * Returns a refresh function to trigger an immediate refetch.
 */
export function usePolling<T>(
  fetcher: () => Promise<T>,
  intervalMs: number = 15000,
  enabled: boolean = true
): { refresh: () => Promise<void>; data: T | null } {
  const [data, setData] = useState<T | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const mountedRef = useRef(true);

  const fetchData = useCallback(async () => {
    if (!mountedRef.current) return;
    try {
      const result = await fetcher();
      if (mountedRef.current) {
        setData(result);
      }
    } catch {
      // Silently fail — next poll will retry
    }
  }, [fetcher]);

  const refresh = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  useEffect(() => {
    mountedRef.current = true;

    if (!enabled) return;

    // Initial fetch
    fetchData();

    // Set up polling
    const startPolling = () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(fetchData, intervalMs);
    };

    const stopPolling = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    startPolling();

    // Pause when tab is hidden, resume when visible
    const handleVisibility = () => {
      if (document.hidden) {
        stopPolling();
      } else {
        fetchData(); // Immediate refetch on tab focus
        startPolling();
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      mountedRef.current = false;
      stopPolling();
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [fetchData, intervalMs, enabled]);

  return { refresh, data };
}
