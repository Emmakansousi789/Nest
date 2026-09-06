import Link from "next/link";
import { notFound } from "next/navigation";
import MarketDetailClient from "@/components/MarketDetailClient";

export default async function MarketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let market: Record<string, unknown> | null = null;

  try {
    const { prisma } = await import("@/lib/prisma");
    market = await prisma.market.findUnique({
      where: { id },
      include: {
        checkIns: {
          where: { checkedOutAt: null },
          include: {
            vendor: {
              select: {
                id: true,
                name: true,
                tagline: true,
                category: true,
                tags: true,
                city: true,
                products: true,
              },
            },
          },
        },
      },
    });
  } catch {
    // DB unavailable
  }

  if (!market) notFound();

  const checkIns = (market.checkIns ?? []) as Array<{
    checkedInAt: Date;
    vendor: {
      id: string;
      name: string;
      tagline: string;
      category: string;
      tags: string[];
      city: string;
      products: unknown[];
    };
  }>;

  return (
    <div className="min-h-screen bg-linen">
      <div className="sticky top-0 z-40 bg-linen/90 backdrop-blur-sm border-b border-parchment">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link
            href="/markets"
            className="flex items-center gap-2 text-stone hover:text-charcoal transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            <span className="text-sm font-medium">Markets</span>
          </Link>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
        <MarketDetailClient
          market={{
            id: market.id as string,
            name: market.name as string,
            description: (market.description as string) ?? undefined,
            lat: market.lat as number,
            lng: market.lng as number,
            radius: market.radius as number,
            startTime: (market.startTime as string) ?? undefined,
            endTime: (market.endTime as string) ?? undefined,
            activeDate: market.activeDate as string,
            active: market.active as boolean,
          }}
          checkedInVendors={checkIns.map((ci) => ({
            id: ci.vendor.id,
            name: ci.vendor.name,
            tagline: ci.vendor.tagline,
            category: ci.vendor.category,
            tags: ci.vendor.tags,
            city: ci.vendor.city,
            productCount: ci.vendor.products.length,
            checkedInAt: ci.checkedInAt.toISOString(),
          }))}
        />
      </div>
    </div>
  );
}
