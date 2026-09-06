import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// DELETE /api/auth/account — Delete user account and all associated data
export async function DELETE() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Delete in order to respect foreign key constraints
    // 1. Delete favorites
    await prisma.favorite.deleteMany({ where: { userId } });

    // 2. Delete reviews authored by user
    await prisma.review.deleteMany({ where: { authorId: userId } });

    // 3. Delete messages sent by user
    await prisma.message.deleteMany({ where: { senderId: userId } });

    // 4. Delete vendor photos and vendors owned by user
    const ownedVendors = await prisma.vendor.findMany({
      where: { ownerId: userId },
      select: { id: true },
    });
    for (const vendor of ownedVendors) {
      await prisma.vendorPhoto.deleteMany({ where: { vendorId: vendor.id } });
    }
    await prisma.vendor.deleteMany({ where: { ownerId: userId } });

    // 5. Delete reports filed by user
    await prisma.report.deleteMany({ where: { reporterId: userId } });

    // 6. Delete sessions and accounts
    await prisma.session.deleteMany({ where: { userId } });
    await prisma.account.deleteMany({ where: { userId } });

    // 7. Delete the user
    await prisma.user.delete({ where: { id: userId } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Account deletion error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
