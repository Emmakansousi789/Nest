export type BusinessCategory =
  | "farmers-market"
  | "food-producer"
  | "maker"
  | "retail"
  | "services"
  | "artisan"
  | "wellness";

export type BusinessTag =
  | "family-farmers"
  | "black-owned"
  | "latine-owned"
  | "asian-owned"
  | "indigenous-owned"
  | "women-owned"
  | "lgbtq-owned"
  | "veteran-owned"
  | "local-maker"
  | "organic"
  | "sustainable"
  | "fair-trade"
  | "vegan"
  | "gluten-free"
  | "handmade"
  | "vintage"
  | "cooperative";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "customer" | "business";
  vendorId?: string; // linked vendor listing for business users
}

export interface Message {
  id: string;
  vendorId: string;
  senderId: string;
  senderName: string;
  text: string;
  date: string;
  read: boolean;
  response?: {
    text: string;
    date: string;
  };
}

export interface Vendor {
  id: string;
  name: string;
  tagline: string;
  story: string;
  category: BusinessCategory;
  tags: BusinessTag[];
  address: string;
  city: string;
  state: string;
  zip: string;
  lat: number;
  lng: number;
  phone: string;
  email: string;
  website?: string;
  instagram?: string;
  hours: OperatingHours;
  photos: VendorPhoto[];
  products: Product[];
  featured: boolean;
  verified: boolean;
  isPopUp?: boolean; // pop-up / market vendor mode
  currentMarketId?: string | null; // currently checked-in market
  joinedDate: string;
  ownerId?: string;
  activeCheckIn?: MarketCheckIn | null; // current market check-in
}

export interface Market {
  id: string;
  name: string;
  description?: string;
  lat: number;
  lng: number;
  radius: number; // meters
  startTime?: string;
  endTime?: string;
  activeDate: string;
  active: boolean;
}

export interface MarketCheckIn {
  id: string;
  vendorId: string;
  marketId: string;
  market?: Market;
  checkedInAt: string;
  checkedOutAt?: string;
}

export interface OperatingHours {
  [key: string]: {
    open: string;
    close: string;
    closed?: boolean;
  };
}

export interface VendorPhoto {
  url: string;
  alt: string;
  caption?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price?: string;
  imageUrl: string;
  category: string;
}

export interface SearchFilters {
  city: string;
  category: BusinessCategory | "all";
  tags: BusinessTag[];
  searchQuery: string;
}

export interface City {
  name: string;
  state: string;
  lat: number;
  lng: number;
}
