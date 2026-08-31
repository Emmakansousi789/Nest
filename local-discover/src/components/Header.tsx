"use client";

interface HeaderProps {
  onSearchOpen: () => void;
  onFilterOpen: () => void;
  filterCount: number;
}

export default function Header({
  onSearchOpen,
  onFilterOpen,
  filterCount,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-linen/90 backdrop-blur-sm border-b border-parchment">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 pressable focus-ring rounded-lg">
          <span className="font-serif text-xl font-semibold tracking-tight text-charcoal">
            LD
          </span>
        </a>

        {/* Center: Search trigger */}
        <button
          onClick={onSearchOpen}
          className="flex-1 max-w-md mx-4 flex items-center gap-2 text-stone hover:text-charcoal hover:bg-ecru/60 transition-all duration-200 text-sm px-3 py-2 rounded-xl focus-ring"
        >
          <svg
            className="w-4 h-4 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
          <span className="hidden sm:inline">Search businesses…</span>
        </button>

        {/* Right: Filter */}
        <button
          onClick={onFilterOpen}
          className="relative flex items-center gap-1.5 px-3 py-2 text-sm text-stone hover:text-charcoal hover:bg-ecru/60 transition-all duration-200 rounded-xl focus-ring pressable"
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
              d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z"
            />
          </svg>
          <span className="hidden sm:inline text-sm">Filters</span>
          {filterCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-terracotta text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              {filterCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
