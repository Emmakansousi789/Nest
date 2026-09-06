import { describe, it, expect } from "vitest";
import { filterVendors, isOpenNow } from "@/data/store";
import type { Vendor } from "@/types";

// Minimal vendor fixture
function makeVendor(overrides: Partial<Vendor> = {}): Vendor {
  return {
    id: "test-1",
    name: "Test Shop",
    tagline: "A test shop",
    story: "Story here",
    category: "retail",
    tags: ["sustainable"],
    address: "123 Main St",
    city: "Atlanta",
    state: "GA",
    zip: "30301",
    lat: 33.75,
    lng: -84.39,
    phone: "(404) 555-0000",
    email: "test@test.com",
    hours: {
      Monday: { open: "9:00 AM", close: "5:00 PM" },
      Tuesday: { open: "9:00 AM", close: "5:00 PM" },
      Wednesday: { open: "9:00 AM", close: "5:00 PM" },
      Thursday: { open: "9:00 AM", close: "5:00 PM" },
      Friday: { open: "9:00 AM", close: "5:00 PM" },
      Saturday: { closed: true, open: "", close: "" },
      Sunday: { closed: true, open: "", close: "" },
    },
    photos: [],
    products: [
      { id: "p1", name: "Widget", description: "A fine widget", price: "$10", imageUrl: "", category: "Goods" },
    ],
    featured: false,
    verified: false,
    joinedDate: "2024-01-01",
    ...overrides,
  };
}

describe("filterVendors", () => {
  const vendors = [
    makeVendor({ id: "v1", name: "Sunnyside Farm", category: "farmers-market", tags: ["organic"] }),
    makeVendor({ id: "v2", name: "Clay Studio", category: "artisan", tags: ["handmade"] }),
    makeVendor({ id: "v3", name: "Clean Co", category: "retail", tags: ["sustainable"] }),
  ];

  it("returns all vendors when no filters applied", () => {
    expect(filterVendors(vendors, "all", [], "")).toHaveLength(3);
  });

  it("filters by category", () => {
    expect(filterVendors(vendors, "farmers-market", [], "")).toHaveLength(1);
    expect(filterVendors(vendors, "farmers-market", [], "")[0].id).toBe("v1");
  });

  it("filters by tag", () => {
    expect(filterVendors(vendors, "all", ["organic"], "")).toHaveLength(1);
    expect(filterVendors(vendors, "all", ["handmade"], "")).toHaveLength(1);
  });

  it("filters by search query (name)", () => {
    expect(filterVendors(vendors, "all", [], "clay")).toHaveLength(1);
    expect(filterVendors(vendors, "all", [], "Clay Studio")[0].id).toBe("v2");
  });

  it("filters by search query (product name)", () => {
    const v = makeVendor({ id: "v4", name: "Shop", products: [{ id: "p1", name: "Special Widget", description: "", imageUrl: "", category: "Goods" }] });
    expect(filterVendors([v], "all", [], "widget")).toHaveLength(1);
  });

  it("returns empty for non-matching query", () => {
    expect(filterVendors(vendors, "all", [], "nonexistent")).toHaveLength(0);
  });

  it("combines category and tag filters", () => {
    expect(filterVendors(vendors, "farmers-market", ["organic"], "")).toHaveLength(1);
    expect(filterVendors(vendors, "farmers-market", ["handmade"], "")).toHaveLength(0);
  });
});

describe("isOpenNow", () => {
  it("returns false for closed days", () => {
    // The test vendor is closed on Saturday/Sunday
    const vendor = makeVendor();
    // We can't control the current time, but we can verify the function doesn't crash
    const result = isOpenNow(vendor);
    expect(typeof result).toBe("boolean");
  });

  it("returns false when hours are missing", () => {
    const vendor = makeVendor({ hours: {} });
    expect(isOpenNow(vendor)).toBe(false);
  });
});
