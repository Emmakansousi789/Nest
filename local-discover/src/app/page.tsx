"use client";

import { useState, useMemo, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Header from "@/components/Header";
import MapView from "@/components/MapView";
import VendorCard from "@/components/VendorCard";
import SkeletonCard from "@/components/SkeletonCard";
import FilterSheet from "@/components/FilterSheet";
import SearchOverlay from "@/components/SearchOverlay";
import SellerDashboard from "@/components/SellerDashboard";
import MapTab from "@/components/tabs/MapTab";
import SavedTab from "@/components/tabs/SavedTab";
import ProfileTab from "@/components/tabs/ProfileTab";
import { filterVendors } from "@/data/vendors";
import { getVendors } from "@/data/store";
import { searchLocations } from "@/data/locations";
import { BusinessCategory, BusinessTag } from "@/types";
import { categories } from "@/data/vendors";

type TabMode = "discover" | "map" | "saved" | "list";
type ViewMode = "map" | "list";
type SortMode = "featured" | "newest" | "alpha" | "distance";

function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 3959;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function DiscoverPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [locationQuery, setLocationQuery] = useState(searchParams.get("loc") || "");
  const [locDropdownOpen, setLocDropdownOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
    name: string;
  } | null>(() => {
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

  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [activeCategory, setActiveCategory] = useState<
    BusinessCategory | "all"
  >((searchParams.get("cat") as BusinessCategory | "all") || "all");
  const [activeTags, setActiveTags] = useState<BusinessTag[]>(
    (searchParams.get("tags")?.split(",").filter(Boolean) as BusinessTag[]) ||
      []
  );
  const [viewMode, setViewMode] = useState<ViewMode>("map");
  const [mapExpanded, setMapExpanded] = useState(true);
  const [sortMode, setSortMode] = useState<SortMode>("featured");

  const [activeTab, setActiveTab] = useState<TabMode>("discover");
  const [viewPersona, setViewPersona] = useState<"shopper" | "seller">(
    "shopper"
  );

  const [filterOpen, setFilterOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const isInitialMount = useRef(true);
  const routerRef = useRef(router);
  routerRef.current = router;
  const pathnameRef = useRef(pathname);
  pathnameRef.current = pathname;
  const locBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!locDropdownOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (locBarRef.current && !locBarRef.current.contains(e.target as Node)) {
        setLocDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [locDropdownOpen]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
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
    routerRef.current.replace(qs ? `${pathnameRef.current}?${qs}` : pathnameRef.current, {
      scroll: false,
    });
  }, [searchQuery, activeCategory, activeTags, selectedLocation, radius]);

  const filteredVendors = useMemo(() => {
    let results = [...getVendors()];
    if (selectedLocation) {
      results = results.filter((v) => {
        const dist = haversineDistance(
          selectedLocation.lat,
          selectedLocation.lng,
          v.lat,
          v.lng
        );
        return dist <= radius;
      });
    }
    results = filterVendors(results, activeCategory, activeTags, searchQuery);
    switch (sortMode) {
      case "featured":
        results.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
      case "newest":
        results.sort(
          (a, b) =>
            new Date(b.joinedDate).getTime() - new Date(a.joinedDate).getTime()
        );
        break;
      case "alpha":
        results.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "distance":
        if (selectedLocation) {
          results.sort(
            (a, b) =>
              haversineDistance(
                selectedLocation.lat,
                selectedLocation.lng,
                a.lat,
                a.lng
              ) -
              haversineDistance(
                selectedLocation.lat,
                selectedLocation.lng,
                b.lat,
                b.lng
              )
          );
        }
        break;
    }
    return results;
  }, [selectedLocation, radius, activeCategory, activeTags, searchQuery, sortMode]);

  const mapCenter: [number, number] = selectedLocation
    ? [selectedLocation.lat, selectedLocation.lng]
    : [33.749, -84.388];

  const handleLocationSelect = (loc: {
    lat: number;
    lng: number;
    name: string;
    state?: string;
  }) => {
    setSelectedLocation({ lat: loc.lat, lng: loc.lng, name: loc.name });
    setLocationQuery(loc.state ? `${loc.name}, ${loc.state}` : loc.name);
  };

  const handleCategoryChange = (cat: BusinessCategory | "all") => {
    setActiveCategory(cat);
  };

  const handleTagToggle = (tag: BusinessTag) => {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const clearAll = () => {
    setActiveTags([]);
    setActiveCategory("all");
    setSearchQuery("");
    setLocationQuery("");
    setSelectedLocation(null);
    setRadius(25);
    setSortMode("featured");
    router.replace(pathname, { scroll: false });
  };

  const hasActiveFilters = !!(
    activeTags.length > 0 ||
    activeCategory !== "all" ||
    searchQuery ||
    selectedLocation
  );
  const filterCount =
    (activeCategory !== "all" ? 1 : 0) +
    activeTags.length +
    (selectedLocation ? 1 : 0) +
    (searchQuery ? 1 : 0);

  // Seller view
  if (viewPersona === "seller") {
    return (
      <div className="flex flex-col min-h-screen bg-linen">
        <Header
          onSearchOpen={() => {}}
          onFilterOpen={() => {}}
          filterCount={0}
          viewMode={viewPersona}
          onViewModeChange={setViewPersona}
        />
        <SellerDashboard />
        {/* Seller bottom nav — Instagram floating pill */}
        <nav
          className="mobile-nav md:hidden"
          aria-label="Seller navigation"
        >
          <div className="flex items-center justify-around">
            {/* Shop (switch to consumer) */}
            <button
              onClick={() => {
                setViewPersona("shopper");
                setActiveTab("discover");
              }}
              className=""
              aria-label="Shop"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
                <polyline points="9 21 9 14 15 14 15 21"/>
              </svg>
              <span className="nav-label">Shop</span>
            </button>
            {/* Dashboard */}
            <button className="active" aria-label="Dashboard">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" rx="1"/>
                <rect x="14" y="3" width="7" height="7" rx="1"/>
                <rect x="3" y="14" width="7" height="7" rx="1"/>
                <rect x="14" y="14" width="7" height="7" rx="1"/>
              </svg>
              <span className="nav-label">Dashboard</span>
            </button>
            {/* Messages */}
            <button className="" aria-label="Messages">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
              </svg>
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-terracotta rounded-full" />
              <span className="nav-label">Messages</span>
            </button>
            {/* Settings / Profile */}
            <button className="" aria-label="Account">
              <div className="w-6 h-6 rounded-full overflow-hidden border-2 border-white/30">
                <div className="w-full h-full bg-gradient-to-br from-[#C84B31] to-[#9A3412] flex items-center justify-center">
                  <span className="text-white text-[10px] font-bold">B</span>
                </div>
              </div>
              <span className="nav-label">Account</span>
            </button>
          </div>
        </nav>
      </div>
    );
  }

  // Main shopper view
  return (
    <div className="flex flex-col min-h-screen bg-linen">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-charcoal focus:text-cream focus:text-sm"
      >
        Skip to content
      </a>

      <Header
        onSearchOpen={() => setSearchOpen(true)}
        onFilterOpen={() => setFilterOpen(true)}
        filterCount={filterCount}
        viewMode={viewPersona}
        onViewModeChange={setViewPersona}
      />

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
        onSortChange={(s) => setSortMode(s as SortMode)}
        viewMode={viewMode}
        onViewChange={(v) => setViewMode(v as ViewMode)}
        onClearAll={clearAll}
        hasActiveFilters={hasActiveFilters}
        filterCount={filterCount}
      />

      {activeTab === "discover" && (
        <>
          {locDropdownOpen && (
            <div
              className="fixed inset-0 z-10"
              onClick={() => setLocDropdownOpen(false)}
            />
          )}

          {/* Location bar — editorial underline style */}
          <div className="border-b border-parchment bg-linen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
              <div className="flex items-center gap-3">
                <div className="relative flex-1" ref={locBarRef}>
                  <input
                    type="text"
                    value={locationQuery}
                    onChange={(e) => {
                      setLocationQuery(e.target.value);
                      setLocDropdownOpen(e.target.value.length >= 2);
                      if (e.target.value === "") setSelectedLocation(null);
                    }}
                    onFocus={() => {
                      if (locationQuery.length >= 2) setLocDropdownOpen(true);
                    }}
                    placeholder="Where are you looking?"
                    className="w-full bg-transparent border-b border-charcoal/20 focus:border-charcoal py-1.5 text-sm text-charcoal placeholder:text-clay outline-none transition-colors font-sans"
                  />
                  {locDropdownOpen && locationQuery.length >= 2 && (
                    <div
                      className="absolute top-full left-0 right-0 mt-1 bg-cream border border-parchment shadow-lg z-20"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {searchLocations(locationQuery)
                        .slice(0, 5)
                        .map((loc) => (
                          <button
                            key={`${loc.name}-${loc.state}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLocationSelect(loc);
                              setLocDropdownOpen(false);
                            }}
                            className="w-full text-left px-4 py-2.5 hover:bg-ecru transition-colors text-sm flex items-center gap-2"
                          >
                            <span className="text-stone text-xs">→</span>
                            <span className="font-medium text-charcoal">
                              {loc.name}
                            </span>
                            <span className="text-clay">, {loc.state}</span>
                          </button>
                        ))}
                      {searchLocations(locationQuery).length === 0 && (
                        <div className="px-4 py-2.5 text-sm text-clay">
                          No locations found
                        </div>
                      )}
                    </div>
                  )}
                </div>
                {selectedLocation && (
                  <select
                    value={radius}
                    onChange={(e) => setRadius(Number(e.target.value))}
                    className="text-xs border border-parchment bg-transparent text-graphite px-2 py-1.5 outline-none cursor-pointer"
                  >
                    <option value={1}>1 mi</option>
                    <option value={3}>3 mi</option>
                    <option value={5}>5 mi</option>
                    <option value={10}>10 mi</option>
                    <option value={25}>25 mi</option>
                    <option value={50}>50 mi</option>
                    <option value={9999}>Any</option>
                  </select>
                )}
              </div>
            </div>
          </div>

          {/* Category pills + result count */}
          <div className="border-b border-parchment bg-linen">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center gap-2 px-4 sm:px-6 py-3 overflow-x-auto scrollbar-none">
                <button
                  onClick={() => handleCategoryChange("all")}
                  className={`shrink-0 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest transition-colors ${
                    activeCategory === "all"
                      ? "text-charcoal border-b-2 border-charcoal"
                      : "text-clay hover:text-graphite"
                  }`}
                >
                  All
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => handleCategoryChange(cat.value)}
                    className={`shrink-0 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest transition-colors flex items-center gap-1.5 ${
                      activeCategory === cat.value
                        ? "text-charcoal border-b-2 border-charcoal"
                        : "text-clay hover:text-graphite"
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3 px-4 sm:px-6 pb-3">
                <span className="text-xs text-stone">
                  <span className="font-semibold text-charcoal">
                    {filteredVendors.length}
                  </span>{" "}
                  business{filteredVendors.length !== 1 ? "es" : ""}
                  {selectedLocation && (
                    <span className="ml-1">
                      within{" "}
                      {radius >= 9999 ? "any distance" : `${radius} mi`} of{" "}
                      {selectedLocation.name}
                    </span>
                  )}
                </span>
                {hasActiveFilters && (
                  <button
                    onClick={clearAll}
                    className="text-xs text-terracotta hover:text-terracotta-dark font-medium"
                  >
                    × Clear
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Active filter chips */}
          {hasActiveFilters && (
            <div className="bg-ecru border-b border-parchment">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center gap-2 overflow-x-auto scrollbar-none">
                {selectedLocation && (
                  <button
                    onClick={() => {
                      setSelectedLocation(null);
                      setLocationQuery("");
                    }}
                    className="shrink-0 flex items-center gap-1 px-3 py-1 bg-terracotta/10 text-terracotta text-xs font-medium hover:bg-terracotta/20 transition-colors"
                  >
                    📍 {selectedLocation.name} (
                    {radius >= 9999 ? "Any" : `${radius} mi`})
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="shrink-0 flex items-center gap-1 px-3 py-1 bg-terracotta/10 text-terracotta text-xs font-medium hover:bg-terracotta/20 transition-colors"
                  >
                    &ldquo;{searchQuery}&rdquo;
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
                {activeTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleTagToggle(tag)}
                    className="shrink-0 flex items-center gap-1 px-3 py-1 bg-terracotta/10 text-terracotta text-xs font-medium hover:bg-terracotta/20 transition-colors"
                  >
                    {tag
                      .replace(/-/g, " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                ))}
                <button
                  onClick={clearAll}
                  className="shrink-0 text-xs text-stone hover:text-charcoal font-medium ml-1"
                >
                  Clear all
                </button>
              </div>
            </div>
          )}

          {/* Main content */}
          <main id="main-content" className="flex-1 pb-24">
            {filteredVendors.length === 0 ? (
              <div className="text-center py-24 px-4">
                <div className="text-5xl mb-4 opacity-40">🔍</div>
                <h3 className="font-serif text-xl font-semibold text-charcoal mb-2">
                  No businesses found
                </h3>
                <p className="text-sm text-stone max-w-sm mx-auto mb-5">
                  {selectedLocation
                    ? `No businesses found within ${radius >= 9999 ? "any distance" : `${radius} miles`} of ${selectedLocation.name}. Try expanding your radius.`
                    : "Try adjusting your filters or search for something else."}
                </p>
                <button
                  onClick={clearAll}
                  className="px-6 py-2.5 bg-charcoal text-cream text-sm font-medium hover:bg-graphite transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="max-w-7xl mx-auto">
                {/* Map toggle */}
                {viewMode === "map" && (
                  <div className="px-4 sm:px-6 pt-4">
                    <button
                      onClick={() => setMapExpanded(!mapExpanded)}
                      className="sm:hidden w-full flex items-center justify-center gap-2 py-2 text-xs font-medium text-stone hover:text-charcoal transition-colors mb-2 uppercase tracking-widest"
                    >
                      <svg
                        className={`w-4 h-4 transition-transform ${mapExpanded ? "rotate-180" : ""}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                        />
                      </svg>
                      {mapExpanded ? "Hide map" : "Show map"}
                    </button>
                    <div
                      className={`w-full overflow-hidden border border-parchment transition-all duration-300 ${
                        mapExpanded
                          ? "h-[300px] sm:h-[400px]"
                          : "h-0 border-0"
                      }`}
                    >
                      <Suspense
                        fallback={
                          <div className="w-full h-full bg-ecru animate-pulse flex items-center justify-center">
                            <span className="text-stone text-xs uppercase tracking-widest">
                              Loading map…
                            </span>
                          </div>
                        }
                      >
                        <MapView
                          vendors={filteredVendors}
                          center={mapCenter}
                          zoom={selectedLocation ? 11 : 5}
                          radiusMiles={radius}
                          centerLocation={selectedLocation}
                        />
                      </Suspense>
                    </div>
                  </div>
                )}
                {/* Grid — staggered editorial layout */}
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-px bg-parchment/50 p-px stagger-grid">
                  {filteredVendors.map((vendor) => (
                    <VendorCard
                      key={vendor.id}
                      vendor={vendor}
                      distance={
                        selectedLocation
                          ? haversineDistance(
                              selectedLocation.lat,
                              selectedLocation.lng,
                              vendor.lat,
                              vendor.lng
                            )
                          : undefined
                      }
                    />
                  ))}
                </div>
              </div>
            )}
          </main>
        </>
      )}

      {activeTab === "map" && <MapTab />}
      {activeTab === "saved" && <SavedTab />}
      {activeTab === "list" && <ProfileTab />}

      {/* Bottom nav — Instagram-style floating pill */}
      <nav
        className={`mobile-nav md:hidden ${searchOpen || filterOpen ? "hidden" : ""}`}
        aria-label="Main navigation"
      >
        <div className="flex items-center justify-around">
          {/* Discover / Home */}
          <button
            onClick={() => setActiveTab("discover")}
            className={activeTab === "discover" ? "active" : ""}
            aria-label="Discover"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
              <polyline points="9 21 9 14 15 14 15 21"/>
            </svg>
            <span className="nav-label">Discover</span>
          </button>
          {/* Map */}
          <button
            onClick={() => setActiveTab("map")}
            className={activeTab === "map" ? "active" : ""}
            aria-label="Map"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
              <line x1="8" y1="2" x2="8" y2="18"/>
              <line x1="16" y1="6" x2="16" y2="22"/>
            </svg>
            <span className="nav-label">Map</span>
          </button>
          {/* Saved */}
          <button
            onClick={() => setActiveTab("saved")}
            className={activeTab === "saved" ? "active" : ""}
            aria-label="Saved"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
            </svg>
            <span className="nav-label">Saved</span>
          </button>
          {/* Profile */}
          <button
            onClick={() => setActiveTab("list")}
            className={activeTab === "list" ? "active" : ""}
            aria-label="Profile"
          >
            <div className="w-6 h-6 rounded-full overflow-hidden border-2 border-white/30">
              <div className="w-full h-full bg-gradient-to-br from-[#C84B31] to-[#9A3412] flex items-center justify-center">
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
        <div className="min-h-screen bg-linen">
          <div className="max-w-7xl mx-auto px-4 pt-20">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-px bg-parchment/50 p-px">
              {Array.from({ length: 6 }).map((_, i) => (
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
