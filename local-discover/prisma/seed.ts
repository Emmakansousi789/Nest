import { PrismaClient } from "@prisma/client";
import { vendors as seedVendors } from "../src/data/vendors";
import { reviews as seedReviews } from "../src/data/reviews";

const prisma = new PrismaClient();

const seedMarkets = [
  {
    id: "mkt-ponce-city",
    name: "Ponce City Farmers Market",
    description: "Fresh produce, artisan goods, and live music every Saturday morning at Ponce City Market.",
    lat: 33.772,
    lng: -84.367,
    radius: 400,
    startTime: "08:00",
    endTime: "13:00",
    activeDate: new Date("2026-09-06"),
  },
  {
    id: "mkt-l5p-art-walk",
    name: "Little Five Points Art Walk",
    description: "Monthly art walk featuring local artists, live demonstrations, and food vendors along Euclid Avenue.",
    lat: 33.763,
    lng: -84.341,
    radius: 300,
    startTime: "17:00",
    endTime: "21:00",
    activeDate: new Date("2026-09-12"),
  },
  {
    id: "mkt-inman-park",
    name: "Inman Park Food Festival",
    description: "Annual food festival celebrating Atlanta's diverse culinary scene with 40+ local food vendors.",
    lat: 33.775,
    lng: -84.354,
    radius: 500,
    startTime: "11:00",
    endTime: "18:00",
    activeDate: new Date("2026-09-20"),
  },
  {
    id: "mkt-eav-makers",
    name: "East Atlanta Village Makers Market",
    description: "Handmade goods from local crafters, jewelers, and textile artists.",
    lat: 33.753,
    lng: -84.336,
    radius: 350,
    startTime: "10:00",
    endTime: "16:00",
    activeDate: new Date("2026-09-27"),
  },
  {
    id: "mkt-decatur",
    name: "Decatur Farmers Market",
    description: "Year-round farmers market with organic produce, baked goods, and prepared foods.",
    lat: 33.775,
    lng: -84.302,
    radius: 300,
    startTime: "09:00",
    endTime: "13:00",
    activeDate: new Date("2026-10-04"),
  },
];

async function main() {
  console.log("🌱 Seeding database...\n");

  // ─── Seed Markets ───
  console.log(`📍 Seeding ${seedMarkets.length} markets...`);
  for (const market of seedMarkets) {
    await prisma.market.upsert({
      where: { id: market.id },
      update: {},
      create: market,
    });
    console.log(`  ✅ ${market.name}`);
  }

  // ─── Seed Vendors ───
  console.log(`📦 Seeding ${seedVendors.length} vendors...`);
  for (const vendor of seedVendors) {
    const { photos, products, joinedDate, ...rest } = vendor;
    const joinedDateObj = new Date(joinedDate as unknown as string);
    await prisma.vendor.upsert({
      where: { id: vendor.id },
      update: {
        ...rest,
        ownerId: undefined,
        joinedDate: joinedDateObj,
        hours: rest.hours as unknown as Record<string, unknown>,
        products: products as unknown as Record<string, unknown>[],
      },
      create: {
        ...rest,
        ownerId: undefined,
        joinedDate: joinedDateObj,
        hours: rest.hours as unknown as Record<string, unknown>,
        products: products as unknown as Record<string, unknown>[],
        photos: {
          create: photos.map((p, i) => ({
            url: p.url,
            alt: p.alt,
            caption: p.caption || null,
            order: i,
          })),
        },
      },
    });
    console.log(`  ✅ ${vendor.name} (${vendor.city}, ${vendor.state})`);
  }

  // ─── Seed Reviews (requires a demo user) ───
  console.log(`\n⭐ Seeding ${seedReviews.length} reviews...`);

  // Create or find demo user for review authorship
  const demoUser = await prisma.user.upsert({
    where: { email: "demo@localdiscover.com" },
    update: {},
    create: {
      email: "demo@localdiscover.com",
      name: "Demo User",
      role: "BUSINESS",
    },
  });

  for (const review of seedReviews) {
    // Skip if review already exists
    const existing = await prisma.review.findUnique({ where: { id: review.id } });
    if (existing) continue;

    await prisma.review.create({
      data: {
        id: review.id,
        vendorId: review.vendorId,
        authorId: demoUser.id,
        authorName: review.authorName,
        rating: review.rating,
        text: review.text,
        response: review.response || undefined,
      },
    });
    console.log(`  ✅ Review ${review.id} → ${review.vendorId}`);
  }

  console.log("\n🎉 Seed complete!");
  console.log(`   ${seedVendors.length} vendors, ${seedReviews.length} reviews, ${seedMarkets.length} markets`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
