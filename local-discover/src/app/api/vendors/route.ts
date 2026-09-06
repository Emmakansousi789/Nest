import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { vendors as seedVendors } from "@/data/vendors";
import type { Prisma } from "@prisma/client";

const vendorSelect = {
  id: true, name: true, tagline: true, story: true, category: true,
  tags: true, address: true, city: true, state: true, zip: true,
  lat: true, lng: true, phone: true, email: true, website: true,
  instagram: true, hours: true, featured: true, verified: true,
  isPopUp: true, currentMarketId: true, joinedDate: true, ownerId: true,
  photos: { select: { url: true, alt: true, caption: true }, orderBy: { order: "asc" as const } },
  products: true,
} satisfies Prisma.VendorSelect;

// GET /api/vendors — returns all vendors (from DB or seed fallback)
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const ownerId = url.searchParams.get("ownerId");

    let dbVendors;
    if (ownerId) {
      const v = await prisma.vendor.findFirst({
        where: { ownerId },
        select: vendorSelect,
      });
      dbVendors = v ? [v] : [];
    } else {
      dbVendors = await prisma.vendor.findMany({
        select: vendorSelect,
        orderBy: [{ featured: "desc" }, { name: "asc" }],
      });
    }

    if (dbVendors.length > 0) {
      const vendors = dbVendors.map((v) => ({
        ...v,
        hours: v.hours as Record<string, { open: string; close: string; closed: boolean }>,
        photos: v.photos.map((p) => ({
          url: p.url,
          alt: p.alt,
          caption: p.caption || undefined,
        })),
        products: v.products as { id: string; name: string; description: string; price: string; imageUrl: string; category: string }[],
        joinedDate: v.joinedDate instanceof Date
          ? v.joinedDate.toISOString().split("T")[0]
          : String(v.joinedDate),
      }));
      return NextResponse.json({ vendors, source: "database" });
    }
  } catch (e) {
    console.warn("[api/vendors] DB unavailable, using seed data:", e);
  }

  // Seed data fallback
  const vendorsWithDates = seedVendors.map((v) => ({
    ...v,
    joinedDate: typeof v.joinedDate === "string" ? v.joinedDate : new Date(v.joinedDate).toISOString().split("T")[0],
  }));

  // If ownerId filter was requested, filter seed data too
  const ownerIdFilter = new URL(req.url).searchParams.get("ownerId");
  if (ownerIdFilter) {
    const filtered = vendorsWithDates.filter((v) => v.ownerId === ownerIdFilter);
    return NextResponse.json({ vendors: filtered, source: "seed" });
  }

  return NextResponse.json({ vendors: vendorsWithDates, source: "seed" });
}

// POST /api/vendors — create a new vendor
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, tagline, story, category, tags, address, city, state, zip, lat, lng, phone, email, website, instagram, hours, products, ownerId } = body;

    const vendor = await prisma.vendor.create({
      data: {
        id: `v-${Date.now()}`,
        name: name || "New Vendor",
        tagline: tagline || "",
        story: story || "",
        category: category || "services",
        tags: tags || [],
        address: address || "",
        city: city || "",
        state: state || "",
        zip: zip || "",
        lat: lat || 0,
        lng: lng || 0,
        phone: phone || "",
        email: email || "",
        website: website || null,
        instagram: instagram || null,
        hours: hours || {},
        products: products || [],
        ownerId: ownerId || null,
      },
    });

    return NextResponse.json({ vendor }, { status: 201 });
  } catch (error) {
    console.error("Create vendor error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
