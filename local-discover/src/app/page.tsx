"use client";

import { useState, useMemo, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import VendorCard from "@/components/VendorCard";
import SkeletonCard from "@/components/SkeletonCard";
import FilterSheet from "@/components/FilterSheet";
import SearchOverlay from "@/components/SearchOverlay";
import SellerDashboard from "@/components/SellerDashboard";
import MapTab from "@/components/tabs/MapTab";
import SavedTab from "@/components/tabs/SavedTab";
import ProfileTab from "@/components/tabs/ProfileTab";
import { filterVendors, categories } from "@/data/vendors";
import { useVendors } from "@/hooks/useVendors";
import { haversineDistance } from "@/lib/distance";
import { BusinessCategory, BusinessTag } from "@/types";

type TabMode = "discover" | "map" | "saved" | "list";
type SellerTab = "dashboard" | "listing" | "reviews" | "messages";

function DiscoverPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [locationQuery, setLocationQuery] = useState(searchParams.get("loc") || "");
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number; name: string } | null>(() => {
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");
    const name = searchParams.get("loc");
    if (lat && lng && name) return { lat: +lat, lng: +lng, name };
    return null;
  });
  const [radius, setRadius] = useState<number>(() => {
    const r = searchParams.get("r");
    return r ? Number(r) : 25;
  });
  const [searchQuery] = useState(searchParams.get("q") || "");
  const [activeCategory, setActiveCategory] = useState<BusinessCategory | "all">(
    (searchParams.get("cat") as BusinessCategory | "all") || "all"
  );
  const [activeTags, setActiveTags] = useState<BusinessTag[]>(
    (searchParams.get("tags")?.split(",").filter(Boolean) as BusinessTag[]) || []
  );
  const [activeTab, setActiveTab] = useState<TabMode>("discover");
  const [viewPersona, setViewPersona] = useState<"shopper" | "seller">("shopper");
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [sortMode] = useState<"featured">("featured");
  const [profileTab, setProfileTab] = useState(0);
  const [sellerTab, setSellerTab] = useState<SellerTab>("dashboard");

  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) { isInitialMount.current = false; return; }
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (activeCategory !== "all") params.set("cat", activeCategory);
    if (activeTags.length > 0) params.set("tags", activeTags.join(","));
    if (selectedLocation && selectedLocation.lat !== 0) {
      params.set("loc", selectedLocation.name);
      params.set("lat", String(selectedLocation.lat));
      params.set("lng", String(selectedLocation.lng));
    }
    if (radius !== 25) params.set("r", String(radius));
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [searchQuery, activeCategory, activeTags, selectedLocation, radius, router, pathname]);

  const { vendors: allVendors } = useVendors();

  const filteredVendors = useMemo(() => {
    let results = [...allVendors];
    if (selectedLocation) {
      results = results.filter((v) => {
        const dist = haversineDistance(selectedLocation.lat, selectedLocation.lng, v.lat, v.lng);
        return dist <= radius;
      });
    }
    results = filterVendors(results, activeCategory, activeTags, searchQuery);
    results.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    return results;
  }, [allVendors, selectedLocation, radius, activeCategory, activeTags, searchQuery]);



  const handleLocationSelect = (loc: { lat: number; lng: number; name: string; state?: string }) => {
    setSelectedLocation({ lat: loc.lat, lng: loc.lng, name: loc.name });
    setLocationQuery(loc.state ? `${loc.name}, ${loc.state}` : loc.name);
  };

  const handleCategoryChange = (cat: BusinessCategory | "all") => setActiveCategory(cat);

  const handleTagToggle = (tag: BusinessTag) => {
    setActiveTags((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]);
  };

  const clearAll = () => {
    setActiveTags([]);
    setActiveCategory("all");
    setLocationQuery("");
    setSelectedLocation(null);
    setRadius(25);
    router.replace(pathname, { scroll: false });
  };

  const hasActiveFilters = !!(activeTags.length > 0 || activeCategory !== "all" || searchQuery || selectedLocation);
  const filterCount = (activeCategory !== "all" ? 1 : 0) + activeTags.length + (selectedLocation ? 1 : 0) + (searchQuery ? 1 : 0);

  const featuredVendors = filteredVendors.filter((v) => v.featured);

  // Seller view
  if (viewPersona === "seller") {
    return (
      <div className="min-h-screen bg-white">
        <SellerDashboard activeSellerTab={sellerTab} onSellerTabChange={setSellerTab} />
        <nav className="mobile-nav">
          <div className="mobile-nav-inner">
            <button onClick={() => setViewPersona("shopper")} className="" aria-label="Shop">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
              </svg>
              <span className="nav-label">Explore</span>
            </button>
            <button onClick={() => setSellerTab("dashboard")} className={sellerTab === "dashboard" ? "active" : ""} aria-label="Dashboard">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
                <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
              </svg>
              <span className="nav-label">Dashboard</span>
            </button>
            <button onClick={() => setSellerTab("messages")} className={sellerTab === "messages" ? "active" : ""} aria-label="Messages">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
              </svg>
              <span className="nav-label">Messages</span>
            </button>
            <button onClick={() => setSellerTab("reviews")} className={sellerTab === "reviews" ? "active" : ""} aria-label="Reviews">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
              <span className="nav-label">Reviews</span>
            </button>
          </div>
        </nav>
      </div>
    );
  }

  // Main shopper view
  return (
    <div className="min-h-screen bg-white">
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <FilterSheet
        isOpen={filterOpen}
        onClose={() => setFilterOpen(false)}
        locationQuery={locationQuery}
        onLocationQueryChange={setLocationQuery}
        onLocationSelect={handleLocationSelect}
        selectedLocation={selectedLocation}
        radius={radius}
        onRadiusChange={setRadius}
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
        activeTags={activeTags}
        onTagToggle={handleTagToggle}
        sortMode={sortMode}
        onSortChange={() => {}}
        viewMode="map"
        onViewChange={() => {}}
        onClearAll={clearAll}
        hasActiveFilters={hasActiveFilters}
        filterCount={filterCount}
      />

      {/* Content — conditionally render based on active tab */}
      {activeTab === "discover" && (
      <main className="pb-24">
        {/* Search pill bar — Airbnb style */}
        <div className="sticky top-0 z-40 bg-white pt-3 pb-2 px-4 sm:px-6">
          <div className="search-pill w-full">
            <button onClick={() => setSearchOpen(true)} className="flex items-center gap-3 flex-1 text-left">
              <svg className="w-5 h-5 text-charcoal shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <div>
                <div className="text-sm font-semibold text-charcoal">Start your search</div>
                {selectedLocation && (
                  <div className="text-xs text-stone">{selectedLocation.name} · {radius >= 9999 ? "Any distance" : `${radius} mi`}</div>
                )}
              </div>
            </button>
            <button
              onClick={() => setFilterOpen(true)}
              className="w-8 h-8 rounded-full border border-parchment flex items-center justify-center hover:bg-ecru transition-colors shrink-0"
            >
              <svg className="w-4 h-4 text-charcoal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Category tabs */}
        <div className="border-b border-gray-100">
          <div className="flex items-center gap-2 sm:gap-4 px-4 sm:px-6 overflow-x-auto scrollbar-none category-tabs-wrap">
            <button
              onClick={() => handleCategoryChange("all")}
              className={`category-tab ${activeCategory === "all" ? "active" : ""}`}
            >
              <div className="w-6 h-6 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                </svg>
              </div>
              <span className="cat-label">All</span>
            </button>
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => handleCategoryChange(cat.value)}
                className={`category-tab ${activeCategory === cat.value ? "active" : ""}`}
              >
                <div className="w-6 h-6 flex items-center justify-center text-lg">{cat.icon}</div>
                <span className="cat-label">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Active filter chips */}
        {hasActiveFilters && (
          <div className="px-4 sm:px-6 py-3 flex items-center gap-2 overflow-x-auto scrollbar-none border-b border-gray-100">
            {selectedLocation && (
              <button onClick={() => { setSelectedLocation(null); setLocationQuery(""); }}
                className="shrink-0 flex items-center gap-1 px-3 py-1.5 bg-charcoal text-white text-xs font-medium rounded-full">
                {selectedLocation.name} ({radius >= 9999 ? "Any" : `${radius} mi`})
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            {activeTags.map((tag) => (
              <button key={tag} onClick={() => handleTagToggle(tag)}
                className="shrink-0 flex items-center gap-1 px-3 py-1.5 bg-charcoal text-white text-xs font-medium rounded-full">
                {tag.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            ))}
            <button onClick={clearAll} className="shrink-0 text-xs text-stone font-medium ml-1">Clear all</button>
          </div>
        )}

        {filteredVendors.length === 0 ? (
          <div className="text-center py-24 px-5">
            <div className="state-icon state-icon-stone">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </div>
            <h3 className="section-title mb-2">No businesses found</h3>
            <p className="text-sm text-stone max-w-sm mx-auto mb-5">
              {selectedLocation
                ? `No businesses found within ${radius >= 9999 ? "any distance" : `${radius} miles`} of ${selectedLocation.name}. Try expanding your radius.`
                : "Try adjusting your filters or search for something else."}
            </p>
            <button onClick={clearAll} className="btn-primary pressable">Clear all filters</button>
          </div>
        ) : (
          <>
            {/* Featured section — horizontal scroll */}
            {featuredVendors.length > 0 && (
              <section className="mt-5">
                <div className="flex items-center justify-between px-4 sm:px-6 mb-4">
                  <h2 className="section-title">Featured businesses</h2>
                </div>
                <div className="scroll-row">
                  {featuredVendors.map((vendor) => (
                    <div key={vendor.id} className="card-horizontal">
                      <VendorCard vendor={vendor} distance={selectedLocation ? haversineDistance(selectedLocation.lat, selectedLocation.lng, vendor.lat, vendor.lng) : undefined} />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Markets & Events link */}
            <section className="mt-5 px-4 sm:px-6">
              <Link
                href="/markets"
                className="flex items-center justify-between p-4 bg-terracotta/5 border border-terracotta/10 rounded-2xl hover:bg-terracotta/10 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-terracotta/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-terracotta" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-charcoal">Markets & Events</p>
                    <p className="text-xs text-stone">Browse upcoming farmers markets and food festivals</p>
                  </div>
                </div>
                <svg className="w-4 h-4 text-clay" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </Link>
            </section>

            {/* All businesses — grid */}
            <section className="mt-8">
              <div className="flex items-center justify-between px-4 sm:px-6 mb-4">
                <h2 className="section-title">
                  {selectedLocation ? `Near ${selectedLocation.name}` : "All businesses"}
                </h2>
                <span className="text-sm text-stone">{filteredVendors.length} results</span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 px-4 sm:px-6">
                {filteredVendors.map((vendor) => (
                  <VendorCard
                    key={vendor.id}
                    vendor={vendor}
                    distance={selectedLocation ? haversineDistance(selectedLocation.lat, selectedLocation.lng, vendor.lat, vendor.lng) : undefined}
                  />
                ))}
              </div>
            </section>
          </>
        )}
      </main>
      )}

      {activeTab === "saved" && <SavedTab />}
      {activeTab === "map" && (
  <div className="h-screen">
    <MapTab />
  </div>
)}
      {activeTab === "list" && <ProfileTab key={profileTab} />}

      {/* Bottom nav */}
      <nav className="mobile-nav">
        <div className="mobile-nav-inner">
          <button onClick={() => setActiveTab("discover")} className={activeTab === "discover" ? "active" : ""} aria-label="Explore">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
            </svg>
            <span className="nav-label">Explore</span>
          </button>
          <button onClick={() => setActiveTab("saved")} className={activeTab === "saved" ? "active" : ""} aria-label="Wishlists">
            <svg width="24" height="24" viewBox="0 0 24 24" fill={activeTab === "saved" ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
            </svg>
            <span className="nav-label">Wishlists</span>
          </button>
          <button onClick={() => setActiveTab("map")} className={activeTab === "map" ? "active" : ""} aria-label="Map">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
              <line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/>
            </svg>
            <span className="nav-label">Map</span>
          </button>
          <button onClick={() => { setActiveTab("list"); setProfileTab((k) => k + 1); }} className={activeTab === "list" ? "active" : ""} aria-label="Profile">
            <div className="w-6 h-6 rounded-full overflow-hidden border-2 border-current">
              <div className="w-full h-full bg-gradient-to-br from-[#E31C5F] to-[#C1124A] flex items-center justify-center">
                <span className="text-white text-[10px] font-bold">J</span>
              </div>
            </div>
            <span className="nav-label">Profile</span>
          </button>
        </div>
      </nav>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white">
          <div className="px-5 pt-5 pb-24">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          </div>
        </div>
      }
    >
      <DiscoverPage />
    </Suspense>
  );
}
