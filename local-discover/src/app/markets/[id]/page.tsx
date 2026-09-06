import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import MarketDetailClient from "@/components/MarketDetailClient";

export default async function MarketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let market: {
    id: string;
    name: string;
    description: string | null;
    lat: number;
    lng: number;
    radius: number;
    startTime: string | null;
    endTime: string | null;
    activeDate: Date;
    active: boolean;
    checkIns: {
      id: string;
      vendorId: string;
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
    }[];
  } | null = null;

  try {
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
          orderBy: { checkedInAt: "asc" },
        },
      },
    });
  } catch {
    notFound();
  }

  if (!market) notFound();

  return (
    <div className="min-h-screen bg-linen">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-linen/90 backdrop-blur-sm border-b border-parchment">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link
            href="/markets"
            className="flex items-center gap-2 text-stone hover:text-charcoal transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
              />
            </svg>
            <span className="text-sm font-medium">Markets</span>
          </Link>
          <h1 className="font-serif text-lg font-semibold text-charcoal truncate max-w-[200px]">
            {market.name}
          </h1>
          <div className="w-12" />
        </div>
      </div>

      <MarketDetailClient
        market={{
          id: market.id,
          name: market.name,
          description: market.description || undefined,
          lat: market.lat,
          lng: market.lng,
          radius: market.radius,
          startTime: market.startTime || undefined,
          endTime: market.endTime || undefined,
          activeDate: market.activeDate.toISOString(),
          active: market.active,
        }}
        checkedInVendors={market.checkIns.map((ci) => ({
          id: ci.vendor.id,
          name: ci.vendor.name,
          tagline: ci.vendor.tagline,
          category: ci.vendor.category,
          tags: ci.vendor.tags,
          city: ci.vendor.city,
          productCount: Array.isArray(ci.vendor.products)
            ? ci.vendor.products.length
            : 0,
          checkedInAt: ci.checkedInAt.toISOString(),
        }))}
      />
    </div>
  );
}
