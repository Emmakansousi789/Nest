import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logIdorAttempt } from "@/lib/security-logger";
import { uploadPhoto, deletePhoto, isStorageConfigured } from "@/lib/storage";
import { writeFile, unlink, mkdir } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const UPLOAD_DIR = join(process.cwd(), "public", "uploads");

async function verifyOwner(vendorId: string, sessionUserId: string) {
  const vendor = await prisma.vendor.findUnique({ where: { id: vendorId } });
  if (!vendor) return { error: "Vendor not found", status: 404 as const };
  if (vendor.ownerId !== sessionUserId) {
    logIdorAttempt(sessionUserId, `/api/vendors/${vendorId}/photos`, sessionUserId);
    return { error: "Forbidden", status: 403 as const };
  }
  return { vendor };
}

// POST /api/vendors/[id]/photos — Upload a photo
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
    const ownerCheck = await verifyOwner(id, session.user.id);
    if ("error" in ownerCheck) {
      return NextResponse.json({ error: ownerCheck.error }, { status: ownerCheck.status });
    }

    const formData = await req.formData();
    const file = formData.get("photo") as File | null;
    const alt = ((formData.get("alt") as string) || "")
      .replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").slice(0, 200);
    const caption = ((formData.get("caption") as string) || "")
      .replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").slice(0, 500);

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Allowed: JPEG, PNG, WebP" },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: `File too large. Maximum size is ${MAX_SIZE / 1024 / 1024}MB` },
        { status: 400 }
      );
    }

    const ext = file.name.split(".").pop() || "jpg";
    const filename = `${id}-${randomUUID()}.${ext}`;
    const bytes = await file.arrayBuffer();
    let photoUrl: string;

    // Try Supabase Storage first, fall back to local filesystem
    if (isStorageConfigured()) {
      const result = await uploadPhoto(id, filename, bytes, file.type);
      if (!result) {
        return NextResponse.json({ error: "Storage upload failed" }, { status: 500 });
      }
      photoUrl = result.url;
    } else {
      // Local filesystem fallback (development only)
      await mkdir(UPLOAD_DIR, { recursive: true });
      const filepath = join(UPLOAD_DIR, filename);
      await writeFile(filepath, Buffer.from(bytes));
      photoUrl = `/uploads/${filename}`;
    }

    // Get current max order
    const maxOrder = await prisma.vendorPhoto.aggregate({
      where: { vendorId: id },
      _max: { order: true },
    });
    const nextOrder = (maxOrder._max.order ?? -1) + 1;

    // Save to database
    const photo = await prisma.vendorPhoto.create({
      data: {
        vendorId: id,
        url: photoUrl,
        alt: alt || file.name,
        caption: caption || null,
        order: nextOrder,
      },
    });

    return NextResponse.json({ photo }, { status: 201 });
  } catch (error) {
    console.error("Photo upload error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/vendors/[id]/photos — Delete a photo
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const ownerCheck = await verifyOwner(id, session.user.id);
    if ("error" in ownerCheck) {
      return NextResponse.json({ error: ownerCheck.error }, { status: ownerCheck.status });
    }

    const { searchParams } = new URL(req.url);
    const photoId = searchParams.get("photoId");
    if (!photoId) {
      return NextResponse.json({ error: "photoId required" }, { status: 400 });
    }

    const photo = await prisma.vendorPhoto.findUnique({ where: { id: photoId } });
    if (!photo || photo.vendorId !== id) {
      return NextResponse.json({ error: "Photo not found" }, { status: 404 });
    }

    // Delete from storage (Supabase or local)
    if (isStorageConfigured() && photo.url.includes("supabase")) {
      // Extract path from Supabase URL
      const urlParts = photo.url.split("/vendor-photos/");
      if (urlParts[1]) {
        await deletePhoto(urlParts[1]);
      }
    } else {
      const filename = photo.url.split("/").pop();
      if (filename) {
        try {
          await unlink(join(UPLOAD_DIR, filename));
        } catch {
          // File may already be deleted
        }
      }
    }

    await prisma.vendorPhoto.delete({ where: { id: photoId } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Photo delete error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH /api/vendors/[id]/photos — Reorder photos
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const ownerCheck = await verifyOwner(id, session.user.id);
    if ("error" in ownerCheck) {
      return NextResponse.json({ error: ownerCheck.error }, { status: ownerCheck.status });
    }

    const body = await req.json();
    const { photoIds } = body as { photoIds: string[] };

    if (!Array.isArray(photoIds) || photoIds.length === 0) {
      return NextResponse.json({ error: "photoIds array required" }, { status: 400 });
    }

    const photos = await prisma.vendorPhoto.findMany({
      where: { vendorId: id },
    });
    const photoIdSet = new Set(photos.map((p) => p.id));
    if (photoIds.some((pid) => !photoIdSet.has(pid))) {
      return NextResponse.json({ error: "Invalid photo IDs" }, { status: 400 });
    }

    await prisma.$transaction(
      photoIds.map((photoId, index) =>
        prisma.vendorPhoto.update({
          where: { id: photoId },
          data: { order: index },
        })
      )
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Photo reorder error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
