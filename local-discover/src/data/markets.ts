/**
 * Seed market data for the native (Capacitor) app.
 * In the web app, markets come from the database via /api/markets.
 * In the native static export, this fallback ensures the map and
 * markets page show real data even when API routes don't exist.
 */

export interface SeedMarket {
  id: string;
  name: string;
  description: string;
  lat: number;
  lng: number;
  radius: number;
  startTime: string;
  endTime: string;
  activeDate: string;
  active: boolean;
  checkInCount: number;
}

export const seedMarkets: SeedMarket[] = [
  {
    id: "market-ponce",
    name: "Ponce City Farmers Market",
    description:
      "Weekly farmers market at Ponce City Market featuring local produce, baked goods, and artisan products from Atlanta-area vendors.",
    lat: 33.772,
    lng: -84.365,
    radius: 500,
    startTime: "8:00 AM",
    endTime: "1:00 PM",
    activeDate: new Date().toISOString().split("T")[0],
    active: true,
    checkInCount: 4,
  },
  {
    id: "market-l5p",
    name: "Little Five Points Street Market",
    description:
      "Monthly street market in Little Five Points featuring vintage vendors, local artists, food trucks, and live music.",
    lat: 33.764,
    lng: -84.347,
    radius: 400,
    startTime: "10:00 AM",
    endTime: "5:00 PM",
    activeDate: new Date().toISOString().split("T")[0],
    active: true,
    checkInCount: 3,
  },
  {
    id: "market-inman",
    name: "Inman Park Sunday Market",
    description:
      "Sunday morning market in Inman Park with organic produce, prepared foods, and handcrafts from local makers.",
    lat: 33.775,
    lng: -84.358,
    radius: 300,
    startTime: "9:00 AM",
    endTime: "1:00 PM",
    activeDate: new Date().toISOString().split("T")[0],
    active: true,
    checkInCount: 2,
  },
  {
    id: "market-eav",
    name: "East Atlanta Village Market",
    description:
      "Bi-weekly market in EAV featuring local food producers, craft vendors, and community organizations.",
    lat: 33.747,
    lng: -84.344,
    radius: 350,
    startTime: "10:00 AM",
    endTime: "4:00 PM",
    activeDate: new Date().toISOString().split("T")[0],
    active: true,
    checkInCount: 2,
  },
  {
    id: "market-decatur",
    name: "Decatur Farmers Market",
    description:
      "Year-round farmers market in downtown Decatur with certified organic produce, local meats, and artisan foods.",
    lat: 33.775,
    lng: -84.297,
    radius: 300,
    startTime: "9:00 AM",
    endTime: "1:00 PM",
    activeDate: new Date().toISOString().split("T")[0],
    active: true,
    checkInCount: 3,
  },
];
