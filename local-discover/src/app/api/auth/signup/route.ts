import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signupSchema } from "@/lib/validations";
import { logAuthSignup } from "@/lib/security-logger";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate input with Zod
    const parsed = signupSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { name, email, password, role } = parsed.data;

    // Check for existing user — use generic message to prevent user enumeration
    const existing = await prisma.user.findUnique({
      where: { email },
    });
    if (existing) {
      return NextResponse.json(
        { error: "If this email is not already registered, check your inbox for next steps." },
        { status: 200 }
      );
    }

    // Hash password with strong cost factor
    const hashed = await bcrypt.hash(password, 14);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
        role: role === "business" ? "BUSINESS" : "CUSTOMER",
      },
    });

    logAuthSignup(req.headers.get("x-forwarded-for") || "unknown", "/api/auth/signup");

    return NextResponse.json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
