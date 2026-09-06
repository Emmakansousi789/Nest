import { NextResponse } from "next/server";

// In-memory cache (resets on server restart — fine for MVP)
const cache = new Map<string, { data: unknown; expiry: number }>();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes
const MAX_CACHE_SIZE = 200;

// Sliding window for Nominatim rate limiting (1 req/sec)
let lastRequestTime = 0;

function getCached(key: string) {
  const entry = cache.get(key);
  if (entry && entry.expiry > Date.now()) return entry.data;
  cache.delete(key);
  return null;
}

function setCache(key: string, data: unknown) {
  if (cache.size >= MAX_CACHE_SIZE) {
    // Evict oldest entry
    const firstKey = cache.keys().next().value;
    if (firstKey) cache.delete(firstKey);
  }
  cache.set(key, { data, expiry: Date.now() + CACHE_TTL });
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q")?.trim();

    if (!query || query.length < 2) {
      return NextResponse.json({ results: [] });
    }

    // Check cache first
    const cacheKey = query.toLowerCase();
    const cached = getCached(cacheKey);
    if (cached) {
      return NextResponse.json({ results: cached, cached: true });
    }

    // Rate limit: Nominatim asks for max 1 req/sec
    // Use sliding window — only wait if needed, don't block the event loop
    const timeSinceLastRequest = Date.now() - lastRequestTime;
    if (timeSinceLastRequest < 1100) {
      await new Promise((r) => setTimeout(r, 1100 - timeSinceLastRequest));
    }
    lastRequestTime = Date.now();

    const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=6&countrycodes=us&q=${encodeURIComponent(query)}`;
    const res = await fetch(url, {
      headers: { Accept: "application/json", "User-Agent": "LocalDiscover/1.0" },
    });

    if (!res.ok) {
      return NextResponse.json({ results: [] }, { status: 502 });
    }

    const data = await res.json();

    const results = data.map((item: Record<string, unknown>) => {
      const addr = (item.address || {}) as Record<string, string>;
      const place = addr.city || addr.town || addr.village || addr.county || addr.state || String(item.display_name).split(",")[0];
      return {
        name: place,
        state: addr.state,
        lat: parseFloat(String(item.lat)),
        lng: parseFloat(String(item.lon)),
      };
    });

    // Deduplicate by name+state
    const deduped = results.filter(
      (r: { name: string; state?: string }, i: number) =>
        results.findIndex((x: { name: string; state?: string }) => x.name === r.name && x.state === r.state) === i
    );

    setCache(cacheKey, deduped);

    return NextResponse.json({ results: deduped, cached: false });
  } catch (error) {
    console.error("Geocoding error:", error);
    return NextResponse.json({ results: [] }, { status: 500 });
  }
}
