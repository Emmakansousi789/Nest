"use client";

import { useRouter } from "next/navigation";
import SwipeBack from "./SwipeBack";
import PhotoCarousel from "./PhotoCarousel";
import type { VendorPhoto } from "@/types";

interface VendorProfileClientProps {
  children: React.ReactNode;
  photos: VendorPhoto[];
  category: string;
  vendorName: string;
}

export default function VendorProfileClient({
  children,
  photos,
  category,
  vendorName,
}: VendorProfileClientProps) {
  const router = useRouter();

  return (
    <SwipeBack onBack={() => router.push("/")}>
      {/* Photo carousel at top */}
      <PhotoCarousel
        photos={photos}
        category={category}
        vendorName={vendorName}
      />
      {children}
    </SwipeBack>
  );
}
