import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST /api/vendors/[id]/market-checkin — Check in to a market
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const vendor = await prisma.vendor.findUnique({ where: { id } });
    if (!vendor) {
      return NextResponse.json({ error: "Vendor not found" }, { status: 404 });
    }

    if (vendor.ownerId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { marketId } = body;

    if (!marketId) {
      return NextResponse.json({ error: "marketId is required" }, { status: 400 });
    }

    // Verify market exists and is active
    const market = await prisma.market.findUnique({ where: { id: marketId } });
    if (!market || !market.active) {
      return NextResponse.json({ error: "Market not found or inactive" }, { status: 404 });
    }

    // Atomic transaction: checkout old market → check in to new → update vendor location
    await prisma.$transaction([
      prisma.marketCheckIn.updateMany({
        where: { vendorId: id, checkedOutAt: null },
        data: { checkedOutAt: new Date() },
      }),
      prisma.marketCheckIn.create({
        data: { vendorId: id, marketId },
      }),
      prisma.vendor.update({
        where: { id },
        data: { lat: market.lat, lng: market.lng, isPopUp: true, currentMarketId: marketId },
      }),
    ]);

    const createdCheckIn = await prisma.marketCheckIn.findFirst({
      where: { vendorId: id, marketId, checkedOutAt: null },
      include: { market: true },
    });
    return NextResponse.json({ checkIn: createdCheckIn }, { status: 201 });
  } catch (error) {
    console.error("Market check-in error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/vendors/[id]/market-checkin — Check out of current market
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

    const vendor = await prisma.vendor.findUnique({ where: { id } });
    if (!vendor) {
      return NextResponse.json({ error: "Vendor not found" }, { status: 404 });
    }

    if (vendor.ownerId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Atomic checkout: close check-in + reset vendor location
    await prisma.$transaction([
      prisma.marketCheckIn.updateMany({
        where: { vendorId: id, checkedOutAt: null },
        data: { checkedOutAt: new Date() },
      }),
      prisma.vendor.update({
        where: { id },
        data: { isPopUp: false, currentMarketId: null },
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Market check-out error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
