import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { rateLimit, getClientIp, rateLimitHeaders, RATE_LIMITS } from "@/lib/rate-limit";
import { logCsrfBlock, logRateLimit, logBodyTooLarge } from "@/lib/security-logger";

// Routes that need CSRF protection (state-changing, no auth token in body)
const CSRF_PROTECTED_ROUTES = ["/api/submit-vendor"];

// Routes that need rate limiting
const AUTH_ROUTES = ["/api/auth/signup", "/api/auth/login"];
const SUBMISSION_ROUTES = ["/api/submit-vendor"];
const CREATION_ROUTES = ["/api/reviews", "/api/messages"];

function checkCsrf(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  const host = request.headers.get("host");

  if (request.method === "GET" || request.method === "HEAD") return true;

  if (origin) {
    try {
      const originHost = new URL(origin).host;
      if (originHost === host) return true;
    } catch {
      return false;
    }
  }

  if (referer) {
    try {
      const refererHost = new URL(referer).host;
      if (refererHost === host) return true;
    } catch {
      return false;
    }
  }

  if (!origin && !referer) return true;
  return false;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const clientIp = getClientIp(request as unknown as Request);

  // CSRF protection for state-changing routes
  if (CSRF_PROTECTED_ROUTES.some((route) => pathname.startsWith(route))) {
    if (!checkCsrf(request)) {
      logCsrfBlock(clientIp, pathname);
      return NextResponse.json(
        { error: "Forbidden: Invalid request origin" },
        { status: 403 }
      );
    }
  }

  // Body size limit: 1MB max for state-changing API routes
  const BODY_LIMIT = 1024 * 1024;
  if (request.method === "POST" || request.method === "PUT" || request.method === "PATCH") {
    const contentLength = request.headers.get("content-length");
    const contentLengthBytes = contentLength ? parseInt(contentLength, 10) : 0;
    if (contentLengthBytes > BODY_LIMIT) {
      logBodyTooLarge(clientIp, pathname, contentLengthBytes);
      return NextResponse.json(
        { error: "Request body too large. Maximum size is 1MB." },
        { status: 413 }
      );
    }
  }

  // Apply rate limiting based on route type
  let rateLimitConfig;
  let routeType;

  if (AUTH_ROUTES.some((route) => pathname.startsWith(route))) {
    rateLimitConfig = RATE_LIMITS.auth;
    routeType = "auth";
  } else if (SUBMISSION_ROUTES.some((route) => pathname.startsWith(route))) {
    rateLimitConfig = RATE_LIMITS.submission;
    routeType = "submission";
  } else if (CREATION_ROUTES.some((route) => pathname.startsWith(route))) {
    rateLimitConfig = RATE_LIMITS.creation;
    routeType = "creation";
  } else if (pathname.startsWith("/api/")) {
    rateLimitConfig = RATE_LIMITS.api;
    routeType = "api";
  }

  // Apply rate limiting (now async for Upstash support)
  if (rateLimitConfig) {
    const identifier = `${clientIp}:${routeType}`;
    const result = await rateLimit(identifier, rateLimitConfig);

    if (!result.success) {
      logRateLimit(clientIp, pathname);
      return NextResponse.json(
        {
          error: "Too many requests",
          message: "Rate limit exceeded. Try again later.",
          retryAfter: Math.ceil((result.resetTime - Date.now()) / 1000),
        },
        {
          status: 429,
          headers: {
            ...rateLimitHeaders(result.remaining, result.resetTime),
            "Retry-After": Math.ceil(
              (result.resetTime - Date.now()) / 1000
            ).toString(),
          },
        }
      );
    }

    const response = NextResponse.next();
    const headers = rateLimitHeaders(result.remaining, result.resetTime);
    for (const [key, value] of Object.entries(headers)) {
      response.headers.set(key, value);
    }
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};
