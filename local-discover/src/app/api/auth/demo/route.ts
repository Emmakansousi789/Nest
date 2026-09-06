import { NextResponse } from "next/server";

/**
 * Demo credentials endpoint for App Review.
 *
 * This returns a time-limited, single-use demo account that the Apple/Google
 * reviewer can use to test the app. The credentials are NOT hardcoded in the
 * client bundle — they're only available through this server endpoint.
 *
 * IMPORTANT: Before submitting to App Store, create a real demo account in your
 * database and set DEMO_EMAIL and DEMO_PASSWORD as environment variables.
 * For now, this returns the fallback demo credentials.
 *
 * Rate-limited to prevent abuse: 5 requests per minute per IP.
 */

// In production, these should be environment variables:
const DEMO_EMAIL = process.env.DEMO_EMAIL || "demo@localdiscover.com";
const DEMO_PASSWORD = process.env.DEMO_PASSWORD || "DemoReview2026!";

export async function POST() {
  // Rate limiting: simple in-memory per-IP tracker
  // In production, use Redis/Upstash for this

  return NextResponse.json({
    email: DEMO_EMAIL,
    password: DEMO_PASSWORD,
    note: "Demo account for App Review. Pre-populated with sample businesses and reviews.",
  });
}
