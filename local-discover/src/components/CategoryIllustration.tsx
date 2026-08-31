"use client";

import { BusinessCategory } from "@/types";
import React from "react";

const illustrations: Record<BusinessCategory, (size: number) => React.JSX.Element> = {
  "farmers-market": (size) => (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <circle cx="60" cy="60" r="56" fill="#E8F0EB" />
      <path d="M30 75 Q40 55 50 70 Q60 50 70 70 Q80 55 90 75" stroke="#4A6B5B" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M50 70 L50 45 Q55 35 60 45" stroke="#4A6B5B" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <circle cx="50" cy="40" r="6" fill="#4A6B5B" opacity="0.4" />
      <circle cx="65" cy="38" r="5" fill="#4A6B5B" opacity="0.3" />
      <circle cx="42" cy="42" r="4" fill="#4A6B5B" opacity="0.25" />
      <path d="M35 80 L85 80" stroke="#4A6B5B" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
    </svg>
  ),
  "food-producer": (size) => (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <circle cx="60" cy="60" r="56" fill="#F3F0EA" />
      <ellipse cx="60" cy="68" rx="30" ry="18" fill="#C84B31" opacity="0.15" />
      <path d="M40 65 Q45 50 60 48 Q75 50 80 65" stroke="#C84B31" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M42 68 L78 68" stroke="#C84B31" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      <circle cx="60" cy="42" r="8" fill="#C84B31" opacity="0.2" />
      <circle cx="52" cy="55" r="3" fill="#C84B31" opacity="0.3" />
      <circle cx="68" cy="53" r="2.5" fill="#C84B31" opacity="0.25" />
    </svg>
  ),
  maker: (size) => (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <circle cx="60" cy="60" r="56" fill="#F3F0EA" />
      <rect x="38" y="45" width="44" height="35" rx="4" fill="#9A3412" opacity="0.15" stroke="#9A3412" strokeWidth="2" />
      <path d="M38 55 L82 55" stroke="#9A3412" strokeWidth="1.5" opacity="0.3" />
      <circle cx="48" cy="65" r="4" fill="#9A3412" opacity="0.25" />
      <circle cx="60" cy="65" r="4" fill="#9A3412" opacity="0.2" />
      <circle cx="72" cy="65" r="4" fill="#9A3412" opacity="0.15" />
      <path d="M55 35 L65 35 L62 45 L58 45 Z" fill="#9A3412" opacity="0.25" />
    </svg>
  ),
  retail: (size) => (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <circle cx="60" cy="60" r="56" fill="#F3F0EA" />
      <path d="M35 50 L60 35 L85 50 L85 80 L35 80 Z" fill="#44403C" opacity="0.1" stroke="#44403C" strokeWidth="2" />
      <rect x="50" y="62" width="20" height="18" rx="2" fill="#44403C" opacity="0.15" stroke="#44403C" strokeWidth="1.5" />
      <path d="M42 50 L60 38 L78 50" stroke="#44403C" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  services: (size) => (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <circle cx="60" cy="60" r="56" fill="#F3F0EA" />
      <path d="M45 40 L55 40 L58 55 L68 55" stroke="#78716C" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M58 55 L55 75" stroke="#78716C" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="55" cy="80" r="5" fill="#78716C" opacity="0.2" stroke="#78716C" strokeWidth="1.5" />
      <path d="M70 45 L80 45 L83 60 L73 60" stroke="#78716C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
    </svg>
  ),
  artisan: (size) => (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <circle cx="60" cy="60" r="56" fill="#E8F0EB" />
      <path d="M45 80 Q45 50 60 40 Q75 50 75 80" stroke="#4A6B5B" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M48 75 Q48 55 60 46 Q72 55 72 75" fill="#4A6B5B" opacity="0.1" />
      <circle cx="60" cy="42" r="6" fill="#4A6B5B" opacity="0.2" />
      <path d="M55 38 Q60 30 65 38" stroke="#4A6B5B" strokeWidth="2" fill="none" strokeLinecap="round" />
      <circle cx="52" cy="60" r="2" fill="#4A6B5B" opacity="0.3" />
      <circle cx="68" cy="58" r="2.5" fill="#4A6B5B" opacity="0.2" />
    </svg>
  ),
  wellness: (size) => (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <circle cx="60" cy="60" r="56" fill="#E8F0EB" />
      <path d="M60 30 Q40 50 45 70 Q50 85 60 90 Q70 85 75 70 Q80 50 60 30Z" fill="#4A6B5B" opacity="0.12" stroke="#4A6B5B" strokeWidth="2" />
      <path d="M60 45 L60 75" stroke="#4A6B5B" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
      <path d="M60 55 Q50 50 48 58" stroke="#4A6B5B" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.4" />
      <path d="M60 62 Q70 57 72 65" stroke="#4A6B5B" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.4" />
      <circle cx="60" cy="38" r="4" fill="#4A6B5B" opacity="0.3" />
    </svg>
  ),
};

const categoryBgs: Record<BusinessCategory, string> = {
  "farmers-market": "bg-sage-light",
  "food-producer": "bg-ecru",
  maker: "bg-[#F3F0EA]",
  retail: "bg-[#F3F0EA]",
  services: "bg-[#F3F0EA]",
  artisan: "bg-sage-light",
  wellness: "bg-sage-light",
};

export function getGradient(category: BusinessCategory): string {
  return categoryBgs[category] || categoryBgs.services;
}

export default function CategoryIllustration({
  category,
  size = 120,
  className = "",
}: {
  category: BusinessCategory;
  size?: number;
  className?: string;
}) {
  const render = illustrations[category] || illustrations.services;
  return (
    <div className={`flex items-center justify-center ${className}`}>
      {render(size)}
    </div>
  );
}
