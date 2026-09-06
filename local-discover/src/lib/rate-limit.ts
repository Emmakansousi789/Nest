// Rate limiter with Upstash Redis support and in-memory fallback.
// Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN in .env.local
// to enable distributed rate limiting in production.

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory fallback (development / no Redis configured)
const rateLimitMap = new Map<string, RateLimitEntry>();

// Guard cleanup interval against hot-reload leaks
const cleanupKey = Symbol.for("rate-limit-cleanup");
if (!(globalThis as Record<string | symbol, unknown>)[cleanupKey]) {
  (globalThis as Record<string | symbol, unknown>)[cleanupKey] = true;
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateLimitMap.entries()) {
      if (now > entry.resetTime) {
        rateLimitMap.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

// Default rate limits for different route types
export const RATE_LIMITS = {
  auth: { windowMs: 15 * 60 * 1000, maxRequests: 5 },
  api: { windowMs: 60 * 1000, maxRequests: 60 },
  submission: { windowMs: 60 * 60 * 1000, maxRequests: 3 },
  creation: { windowMs: 60 * 1000, maxRequests: 10 },
} as const;

// Check if Upstash Redis is configured
function isUpstashConfigured(): boolean {
  return !!(
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  );
}

// Upstash-based rate limiting (production)
async function upstashRateLimit(
  identifier: string,
  config: RateLimitConfig
): Promise<{ success: boolean; remaining: number; resetTime: number }> {
  const { Ratelimit } = await import("@upstash/ratelimit");
  const { Redis } = await import("@upstash/redis");

  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });

  const ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(config.maxRequests, `${config.windowMs} ms`),
    analytics: false,
    prefix: `ld:${identifier}`,
  });

  const result = await ratelimit.limit(identifier);
  return {
    success: result.success,
    remaining: result.remaining,
    resetTime: result.reset,
  };
}

// In-memory rate limiting (development fallback)
function memoryRateLimit(
  identifier: string,
  config: RateLimitConfig
): { success: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(identifier);

  if (!entry || now > entry.resetTime) {
    const resetTime = now + config.windowMs;
    rateLimitMap.set(identifier, { count: 1, resetTime });
    return { success: true, remaining: config.maxRequests - 1, resetTime };
  }

  entry.count++;
  if (entry.count > config.maxRequests) {
    return { success: false, remaining: 0, resetTime: entry.resetTime };
  }
  return { success: true, remaining: config.maxRequests - entry.count, resetTime: entry.resetTime };
}

// Main rate limit function — auto-selects Upstash or memory
export async function rateLimit(
  identifier: string,
  config: RateLimitConfig
): Promise<{ success: boolean; remaining: number; resetTime: number }> {
  if (isUpstashConfigured()) {
    try {
      return await upstashRateLimit(identifier, config);
    } catch {
      // Fall back to memory if Redis fails
      console.warn("Upstash rate limit failed, falling back to in-memory");
      return memoryRateLimit(identifier, config);
    }
  }
  return memoryRateLimit(identifier, config);
}

// Helper to get client IP from request
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp;
  return "unknown";
}

// Helper to create rate limit response headers
export function rateLimitHeaders(
  remaining: number,
  resetTime: number
): Record<string, string> {
  return {
    "X-RateLimit-Remaining": remaining.toString(),
    "X-RateLimit-Reset": Math.ceil(resetTime / 1000).toString(),
  };
}
