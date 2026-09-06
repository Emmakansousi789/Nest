import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createReviewSchema, respondReviewSchema } from "@/lib/validations";
import { prisma } from "@/lib/prisma";
import { moderateContent } from "@/lib/moderation";
import { reviews as seedReviews } from "@/data/reviews";

// GET /api/reviews?vendorId=xxx — Get reviews for a vendor (with seed fallback)
export async function GET(req: Request) {
  const url = new URL(req.url);
  const vendorId = url.searchParams.get("vendorId");
  if (!vendorId) {
    return NextResponse.json({ error: "vendorId required" }, { status: 400 });
  }

  try {
    const dbReviews = await prisma.review.findMany({
      where: { vendorId },
      orderBy: { createdAt: "desc" },
    });
    if (dbReviews.length > 0) {
      return NextResponse.json({
        reviews: dbReviews.map((r) => ({
          id: r.id,
          vendorId: r.vendorId,
          authorName: r.authorName,
          rating: r.rating,
          text: r.text,
          date: r.createdAt.toISOString().split("T")[0],
          response: (r.response as { text: string; date: string }) || undefined,
        })),
        source: "database",
      });
    }
  } catch {
    // DB unavailable
  }

  return NextResponse.json({ reviews: seedReviews.filter((r) => r.vendorId === vendorId), source: "seed" });
}

// POST /api/reviews — Create a new review
export async function POST(req: Request) {
  try {
    const session = await auth();

    // Require authentication
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    // Validate input with Zod
    const parsed = createReviewSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { vendorId, authorId, authorName, rating, text } = parsed.data;

    // IDOR Protection: Verify the authenticated user is the author
    if (session.user.id !== authorId) {
      return NextResponse.json(
        { error: "Forbidden: Cannot create review as another user" },
        { status: 403 }
      );
    }

    // Content moderation — filter profanity and inappropriate content
    const moderation = moderateContent(text);
    if (!moderation.clean) {
      return NextResponse.json(
        { error: moderation.blockedReason },
        { status: 400 }
      );
    }

    // Verify the vendor exists
    const vendor = await prisma.vendor.findUnique({
      where: { id: vendorId },
    });
    if (!vendor) {
      return NextResponse.json(
        { error: "Vendor not found" },
        { status: 404 }
      );
    }

    // Create the review
    const review = await prisma.review.create({
      data: {
        vendorId,
        authorId,
        authorName,
        rating,
        text,
      },
    });

    return NextResponse.json({ review }, { status: 201 });
  } catch (error) {
    console.error("Create review error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH /api/reviews — Respond to a review (IDOR-protected: only vendor owner can respond)
export async function PATCH(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    // Validate input with Zod
    const parsed = respondReviewSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { reviewId, responseText } = parsed.data;

    // Find the review
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      include: { vendor: true },
    });
    if (!review) {
      return NextResponse.json(
        { error: "Review not found" },
        { status: 404 }
      );
    }

    // IDOR Protection: Verify the authenticated user owns the vendor
    if (review.vendor.ownerId !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden: Only the vendor owner can respond to reviews" },
        { status: 403 }
      );
    }

    // Update the review with the response
    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: {
        response: {
          text: responseText,
          date: new Date().toISOString(),
        },
      },
    });

    return NextResponse.json({ review: updatedReview });
  } catch (error) {
    console.error("Respond to review error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
