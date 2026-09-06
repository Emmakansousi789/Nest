import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const VALID_TARGETS = ["review", "vendor", "message"];
const VALID_REASONS = ["spam", "offensive", "inaccurate", "other"];

// POST /api/reports — Submit a content report
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { targetType, targetId, reason, description } = body;

    // Validate
    if (!VALID_TARGETS.includes(targetType)) {
      return NextResponse.json({ error: "Invalid target type" }, { status: 400 });
    }
    if (!targetId || typeof targetId !== "string") {
      return NextResponse.json({ error: "Target ID required" }, { status: 400 });
    }
    if (!VALID_REASONS.includes(reason)) {
      return NextResponse.json({ error: "Invalid reason" }, { status: 400 });
    }

    // Check for duplicate report from same user on same target
    const existing = await prisma.report.findFirst({
      where: {
        reporterId: session.user.id,
        targetType,
        targetId,
      },
    });
    if (existing) {
      return NextResponse.json(
        { error: "You have already reported this content" },
        { status: 409 }
      );
    }

    const report = await prisma.report.create({
      data: {
        reporterId: session.user.id,
        targetType,
        targetId,
        reason,
        description: description || null,
      },
    });

    return NextResponse.json({ report }, { status: 201 });
  } catch (error) {
    console.error("Report submission error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
