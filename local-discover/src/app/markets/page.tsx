import Link from "next/link";
import { prisma } from "@/lib/prisma";

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

function getDaysUntil(date: Date) {
  const now = new Date();
  const target = new Date(date);
  const diff = Math.ceil(
    (target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  if (diff < 7) return `In ${diff} days`;
  return `In ${Math.ceil(diff / 7)} weeks`;
}

export default async function MarketsPage() {
  let markets: {
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
    checkIns: { id: string; vendorId: string; vendor: { name: string } }[];
  }[] = [];

  try {
    markets = await prisma.market.findMany({
      where: { active: true },
      include: {
        checkIns: {
          where: { checkedOutAt: null },
          include: { vendor: { select: { id: true, name: true } } },
        },
      },
      orderBy: { activeDate: "asc" },
    });
  } catch {
    // DB not connected — show empty state
  }

  return (
    <div className="min-h-screen bg-linen">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-linen/90 backdrop-blur-sm border-b border-parchment">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link
            href="/"
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
            <span className="text-sm font-medium">Back</span>
          </Link>
          <h1 className="font-serif text-lg font-semibold text-charcoal">
            Markets & Events
          </h1>
          <div className="w-12" />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
        {/* Intro */}
        <div className="mb-8">
          <h2 className="font-serif text-2xl font-semibold text-charcoal mb-2">
            Upcoming Markets
          </h2>
          <p className="text-sm text-stone">
            Discover local farmers markets, art walks, and food festivals near
            you. Vendors check in live so you can see who&apos;s there.
          </p>
        </div>

        {markets.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-ecru flex items-center justify-center">
              <svg
                className="w-8 h-8 text-stone"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-charcoal mb-2">
              No markets yet
            </h3>
            <p className="text-sm text-stone max-w-sm mx-auto">
              Market events will appear here once they&apos;re created by
              vendors or organizers.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {markets.map((market) => (
              <Link
                key={market.id}
                href={`/markets/${market.id}`}
                className="block bg-cream rounded-2xl border border-parchment p-5 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-terracotta/10 text-terracotta rounded-full">
                        Market
                      </span>
                      <span className="text-[10px] font-medium text-sage">
                        {getDaysUntil(market.activeDate)}
                      </span>
                    </div>
                    <h3 className="font-serif text-lg font-semibold text-charcoal mb-1">
                      {market.name}
                    </h3>
                    {market.description && (
                      <p className="text-sm text-stone mb-3 line-clamp-2">
                        {market.description}
                      </p>
                    )}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-clay">
                      <span className="flex items-center gap-1">
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                          />
                        </svg>
                        {formatDate(market.activeDate)}
                      </span>
                      {(market.startTime || market.endTime) && (
                        <span className="flex items-center gap-1">
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.5}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          {market.startTime || "—"} – {market.endTime || "—"}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-ecru flex items-center justify-center mb-1">
                      <span className="text-lg font-bold text-charcoal">
                        {market.checkIns.length}
                      </span>
                    </div>
                    <span className="text-[10px] text-stone">
                      {market.checkIns.length === 1 ? "vendor" : "vendors"}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
