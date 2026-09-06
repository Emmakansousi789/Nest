import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createRemoteJWKSet, jwtVerify, JWTPayload } from "jose";

/**
 * Apple's JWKS endpoint — public keys for verifying idTokens.
 * Fetched and cached automatically by jose's createRemoteJWKSet.
 */
const APPLE_JWKS = createRemoteJWKSet(
  new URL("https://appleid.apple.com/auth/keys")
);

/**
 * Apple's issuer URL — all valid Apple idTokens must have this as `iss`.
 */
const APPLE_ISSUER = "https://appleid.apple.com";

/**
 * The expected audience — your Apple Service ID (configured in Apple Developer Console).
 * For now we accept any audience since the Service ID isn't configured yet.
 * TODO: Set APPLE_SERVICE_ID env var and validate against it.
 */
const EXPECTED_AUDIENCE = process.env.APPLE_SERVICE_ID || undefined;

interface AppleIdTokenPayload extends JWTPayload {
  email?: string;
  sub?: string;
  given_name?: string;
  family_name?: string;
}

/**
 * POST /api/auth/native-apple
 *
 * Handles Apple Sign In from the Capacitor native app.
 * The native AppleSignIn plugin returns an idToken (JWT).
 * This route:
 *   1. Verifies the JWT signature against Apple's public JWKS keys
 *   2. Validates standard claims (iss, aud, exp)
 *   3. Finds or creates the user in the database
 *   4. Creates a NextAuth session cookie
 */
export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();

    if (!token || typeof token !== "string") {
      return NextResponse.json(
        { error: "Missing Apple token" },
        { status: 400 }
      );
    }

    // ─── Step 1: Verify JWT signature against Apple's JWKS ───
    let payload: AppleIdTokenPayload;
    try {
      const verification = await jwtVerify(token, APPLE_JWKS, {
        issuer: APPLE_ISSUER,
        // Only validate audience if APPLE_SERVICE_ID is configured.
        // Without it, we skip audience check to avoid rejecting all tokens.
        ...(EXPECTED_AUDIENCE ? { audience: EXPECTED_AUDIENCE } : {}),
      });
      payload = verification.payload as AppleIdTokenPayload;
    } catch (err) {
      const reason =
        err instanceof Error ? err.message : "Unknown verification error";
      console.error("Apple idToken verification failed:", reason);
      return NextResponse.json(
        { error: "Invalid or expired Apple token" },
        { status: 401 }
      );
    }

    // ─── Step 2: Extract user info from verified claims ───
    const email = payload.email;
    const appleId = payload.sub;

    if (!email || !appleId) {
      return NextResponse.json(
        { error: "Apple token missing email or user ID" },
        { status: 400 }
      );
    }

    // ─── Step 3: Find or create user ───
    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      const nameParts = [payload.given_name, payload.family_name].filter(
        Boolean
      );
      user = await prisma.user.create({
        data: {
          email,
          name: nameParts.join(" ") || email.split("@")[0],
          role: "CUSTOMER",
        },
      });
    }

    // ─── Step 4: Create NextAuth session ───
    const { encode } = await import("next-auth/jwt");
    const isProduction = process.env.NODE_ENV === "production";
    const sessionCookieName = isProduction
      ? "__Secure-next-auth.session-token"
      : "next-auth.session-token";

    const sessionToken = await encode({
      token: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      secret: process.env.NEXTAUTH_SECRET!,
      salt: sessionCookieName,
      maxAge: 30 * 24 * 60 * 60,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

    response.cookies.set(sessionCookieName, sessionToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error("Apple Sign In error:", error);
    return NextResponse.json(
      { error: "Apple Sign In failed" },
      { status: 500 }
    );
  }
}
