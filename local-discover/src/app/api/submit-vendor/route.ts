import { NextResponse } from "next/server";
import { submitVendorSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate input with Zod
    const parsed = submitVendorSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { name, email, city, description } = parsed.data;

    // MVP: log to console. In production, save to database.
    console.log("[Vendor Submission]", {
      name,
      email,
      city,
      description,
      submittedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: "Thanks! We'll be in touch to set up your listing.",
    });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }
}
