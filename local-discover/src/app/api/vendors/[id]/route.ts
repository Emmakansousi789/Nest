import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { updateVendorSchema } from "@/lib/validations";
import { prisma } from "@/lib/prisma";

// GET /api/vendors/[id] — Get a vendor (public, but rate-limited in production)
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const vendor = await prisma.vendor.findUnique({
      where: { id },
    });

    if (!vendor) {
      return NextResponse.json(
        { error: "Vendor not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ vendor });
  } catch (error) {
    console.error("Get vendor error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/vendors/[id] — Update a vendor (IDOR-protected: only owner can update)
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Find the vendor
    const vendor = await prisma.vendor.findUnique({
      where: { id },
    });

    if (!vendor) {
      return NextResponse.json(
        { error: "Vendor not found" },
        { status: 404 }
      );
    }

    // IDOR Protection: Verify the authenticated user owns this vendor
    if (vendor.ownerId !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden: You do not own this vendor listing" },
        { status: 403 }
      );
    }

    const body = await req.json();

    // Validate input with Zod (exclude id from body validation)
    const { id: _, ...updateData } = body;
    const parsed = updateVendorSchema.partial().safeParse(updateData);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    // Update the vendor
    const updatedVendor = await prisma.vendor.update({
      where: { id },
      data: parsed.data,
    });

    return NextResponse.json({ vendor: updatedVendor });
  } catch (error) {
    console.error("Update vendor error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/vendors/[id] — Delete a vendor (IDOR-protected: only owner can delete)
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Find the vendor
    const vendor = await prisma.vendor.findUnique({
      where: { id },
    });

    if (!vendor) {
      return NextResponse.json(
        { error: "Vendor not found" },
        { status: 404 }
      );
    }

    // IDOR Protection: Verify the authenticated user owns this vendor
    if (vendor.ownerId !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden: You do not own this vendor listing" },
        { status: 403 }
      );
    }

    // Delete the vendor
    await prisma.vendor.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete vendor error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
