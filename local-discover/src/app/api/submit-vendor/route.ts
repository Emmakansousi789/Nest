import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, city, description } = body;

    if (!name || !email || !city || !description) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    // MVP: log to console. In production, this would save to a database.
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
