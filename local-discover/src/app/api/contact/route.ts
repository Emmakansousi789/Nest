import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  subject: z.string().min(1).max(200),
  message: z.string().min(10).max(2000),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid form data", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, email, subject, message } = parsed.data;

    // Basic content moderation — reject obvious spam
    const spamPatterns = [/viagra/i, /casino/i, /crypto.*invest/i, /click here now/i];
    if (spamPatterns.some((p) => p.test(message) || p.test(subject))) {
      return NextResponse.json(
        { error: "Your message was flagged as potential spam. Please try again." },
        { status: 400 }
      );
    }

    // In production, this would send an email via Resend/SendGrid or store in DB.
    // For now, log it so you can see submissions during development.
    console.log("📬 Contact form submission:", {
      name,
      email,
      subject,
      message,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
