import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { submitVendorSchema } from "@/lib/validations";
import type { Prisma } from "@prisma/client";

export async function POST(request: Request) {
  try {
    // Require authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user already owns a vendor
    const existingVendor = await prisma.vendor.findFirst({
      where: { ownerId: session.user.id },
    });
    if (existingVendor) {
      return NextResponse.json(
        { error: "You already have a vendor listing", vendorId: existingVendor.id },
        { status: 409 }
      );
    }

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

    const data = parsed.data;
    const vendorId = `v-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    // Create vendor in database with real ownerId
    const vendor = await prisma.vendor.create({
      data: {
        id: vendorId,
        name: data.name,
        tagline: data.tagline,
        story: data.story,
        category: data.category,
        tags: data.tags,
        address: data.address,
        city: data.city,
        state: data.state,
        zip: data.zip,
        lat: data.lat,
        lng: data.lng,
        phone: data.phone,
        email: data.email,
        website: data.website || null,
        instagram: data.instagram || null,
        hours: (data.hours || {}) as unknown as Prisma.InputJsonValue,
        products: [],
        ownerId: session.user.id,
      },
    });

    return NextResponse.json({
      success: true,
      vendor,
      message: "Your business listing has been created!",
    }, { status: 201 });
  } catch (error) {
    console.error("Submit vendor error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
