import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/markets — List active markets (optionally filtered by location)
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const lat = url.searchParams.get("lat");
    const lng = url.searchParams.get("lng");
    const radius = parseFloat(url.searchParams.get("radius") || "50");

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Get all active markets for today (and future)
    const markets = await prisma.market.findMany({
      where: {
        active: true,
        activeDate: { gte: today },
      },
      include: {
        checkIns: {
          where: { checkedOutAt: null },
          include: { vendor: { select: { id: true, name: true, category: true } } },
        },
      },
      orderBy: { activeDate: "asc" },
    });

    // If lat/lng provided, filter by distance
    if (lat && lng) {
      const centerLat = parseFloat(lat);
      const centerLng = parseFloat(lng);
      const radiusKm = radius * 1.60934; // miles to km

      const filtered = markets.filter((m) => {
        const dist = haversine(centerLat, centerLng, m.lat, m.lng);
        return dist <= radiusKm;
      });

      return NextResponse.json({ markets: filtered });
    }

    return NextResponse.json({ markets });
  } catch (error) {
    console.error("Get markets error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/markets — Create a new market event (authenticated)
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, description, lat, lng, radius, startTime, endTime, activeDate } = body;

    if (!name || lat == null || lng == null || !activeDate) {
      return NextResponse.json(
        { error: "Missing required fields: name, lat, lng, activeDate" },
        { status: 400 }
      );
    }

    const market = await prisma.market.create({
      data: {
        name,
        description: description || null,
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        radius: radius ? parseFloat(radius) : 500,
        startTime: startTime || null,
        endTime: endTime || null,
        activeDate: new Date(activeDate),
      },
    });

    return NextResponse.json({ market }, { status: 201 });
  } catch (error) {
    console.error("Create market error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
