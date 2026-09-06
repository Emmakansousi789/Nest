import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/auth/native-apple
 *
 * Handles Apple Sign In from the Capacitor native app.
 * The native AppleSignIn plugin returns an idToken (JWT) directly.
 * This route decodes it, finds or creates the user, and creates a session.
 *
 * TODO: Add proper JWT signature verification against Apple's public keys
 * (https://appleid.apple.com/auth/keys) before production launch.
 */
export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();

    if (!token || typeof token !== "string") {
      return NextResponse.json({ error: "Missing Apple token" }, { status: 400 });
    }

    // Decode the Apple idToken (JWT) to extract user info
    // Apple's idToken format: header.payload.signature (base64url)
    const parts = token.split(".");
    if (parts.length !== 3) {
      return NextResponse.json({ error: "Invalid Apple token format" }, { status: 400 });
    }

    let payload: Record<string, unknown>;
    try {
      const decoded = JSON.parse(Buffer.from(parts[1], "base64url").toString("utf-8"));
      payload = decoded;
    } catch {
      return NextResponse.json({ error: "Could not decode Apple token" }, { status: 400 });
    }

    const email = payload.email as string | undefined;
    const appleId = payload.sub as string | undefined;

    if (!email || !appleId) {
      return NextResponse.json(
        { error: "Apple token missing email or user ID" },
        { status: 400 }
      );
    }

    // Check if user already exists by email or by appleId in name field
    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      // Create new user from Apple Sign In
      const nameParts = [payload.given_name, payload.family_name].filter(Boolean);
      user = await prisma.user.create({
        data: {
          email,
          name: nameParts.join(" ") || email.split("@")[0],
          role: "CUSTOMER",
          // Store appleId in a way we can reference later
          // (no dedicated appleId column yet — use name metadata if needed)
        },
      });
    }

    // Use NextAuth's JWT encoder to create a session token
    const { encode } = await import("next-auth/jwt");

    const sessionToken = await encode({
      token: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      secret: process.env.NEXTAUTH_SECRET!,
      salt: process.env.NEXTAUTH_SECRET!.slice(0, 16),
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    // Set the session cookie in the response
    const isProduction = process.env.NODE_ENV === "production";
    const cookieName = isProduction
      ? "__Secure-next-auth.session-token"
      : "next-auth.session-token";

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

    response.cookies.set(cookieName, sessionToken, {
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
