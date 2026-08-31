"use client";

export default function ViewToggle({
  mode,
  onChange,
}: {
  mode: "shopper" | "seller";
  onChange: (mode: "shopper" | "seller") => void;
}) {
  return (
    <div className="flex items-center bg-ecru rounded-full p-0.5 border border-parchment">
      <button
        onClick={() => onChange("shopper")}
        className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
          mode === "shopper"
            ? "bg-charcoal text-cream shadow-sm"
            : "text-stone hover:text-charcoal"
        }`}
      >
        🛒 Shop
      </button>
      <button
        onClick={() => onChange("seller")}
        className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
          mode === "seller"
            ? "bg-charcoal text-cream shadow-sm"
            : "text-stone hover:text-charcoal"
        }`}
      >
        📊 Business
      </button>
    </div>
  );
}
