export interface Location {
  name: string;
  state: string;
  lat: number;
  lng: number;
}

export const locations: Location[] = [
  // Alabama
  { name: "Birmingham", state: "AL", lat: 33.5186, lng: -86.8104 },
  { name: "Montgomery", state: "AL", lat: 32.3668, lng: -86.3 },
  { name: "Huntsville", state: "AL", lat: 34.7304, lng: -86.5861 },
  { name: "Mobile", state: "AL", lat: 30.6954, lng: -88.0399 },
  // Arkansas
  { name: "Little Rock", state: "AR", lat: 34.7465, lng: -92.2896 },
  { name: "Fayetteville", state: "AR", lat: 36.0626, lng: -94.1574 },
  // Arizona
  { name: "Phoenix", state: "AZ", lat: 33.4484, lng: -112.074 },
  { name: "Tucson", state: "AZ", lat: 32.2226, lng: -110.9747 },
  { name: "Scottsdale", state: "AZ", lat: 33.4942, lng: -111.9261 },
  // California
  { name: "Los Angeles", state: "CA", lat: 34.0522, lng: -118.2437 },
  { name: "San Francisco", state: "CA", lat: 37.7749, lng: -122.4194 },
  { name: "San Diego", state: "CA", lat: 32.7157, lng: -117.1611 },
  { name: "Sacramento", state: "CA", lat: 38.5816, lng: -121.4944 },
  { name: "Oakland", state: "CA", lat: 37.8044, lng: -122.2712 },
  { name: "San Jose", state: "CA", lat: 37.3382, lng: -121.8863 },
  // Colorado
  { name: "Denver", state: "CO", lat: 39.7392, lng: -104.9903 },
  { name: "Boulder", state: "CO", lat: 40.015, lng: -105.2705 },
  { name: "Colorado Springs", state: "CO", lat: 38.8339, lng: -104.8214 },
  // Connecticut
  { name: "Hartford", state: "CT", lat: 41.7658, lng: -72.6734 },
  { name: "New Haven", state: "CT", lat: 41.3083, lng: -72.9279 },
  // Delaware
  { name: "Wilmington", state: "DE", lat: 39.7391, lng: -75.5398 },
  // Florida
  { name: "Miami", state: "FL", lat: 25.7617, lng: -80.1918 },
  { name: "Orlando", state: "FL", lat: 28.5383, lng: -81.3792 },
  { name: "Tampa", state: "FL", lat: 27.9506, lng: -82.4572 },
  { name: "Jacksonville", state: "FL", lat: 30.3322, lng: -81.6557 },
  { name: "Tallahassee", state: "FL", lat: 30.4383, lng: -84.2807 },
  // Georgia
  { name: "Atlanta", state: "GA", lat: 33.749, lng: -84.388 },
  { name: "Savannah", state: "GA", lat: 32.0809, lng: -81.0912 },
  { name: "Augusta", state: "GA", lat: 33.4735, lng: -81.9748 },
  { name: "Athens", state: "GA", lat: 33.9519, lng: -83.3576 },
  // Hawaii
  { name: "Honolulu", state: "HI", lat: 21.3069, lng: -157.8583 },
  // Idaho
  { name: "Boise", state: "ID", lat: 43.615, lng: -116.2023 },
  // Illinois
  { name: "Chicago", state: "IL", lat: 41.8781, lng: -87.6298 },
  { name: "Springfield", state: "IL", lat: 39.7817, lng: -89.6501 },
  // Indiana
  { name: "Indianapolis", state: "IN", lat: 39.7684, lng: -86.1581 },
  { name: "Bloomington", state: "IN", lat: 39.1653, lng: -86.5264 },
  // Iowa
  { name: "Des Moines", state: "IA", lat: 41.5868, lng: -93.625 },
  // Kansas
  { name: "Kansas City", state: "KS", lat: 39.0997, lng: -94.5786 },
  { name: "Wichita", state: "KS", lat: 37.6872, lng: -97.3301 },
  // Kentucky
  { name: "Louisville", state: "KY", lat: 38.2527, lng: -85.7585 },
  { name: "Lexington", state: "KY", lat: 38.0406, lng: -84.5037 },
  // Louisiana
  { name: "New Orleans", state: "LA", lat: 29.9511, lng: -90.0715 },
  { name: "Baton Rouge", state: "LA", lat: 30.4515, lng: -91.1871 },
  { name: "Shreveport", state: "LA", lat: 32.5252, lng: -93.7502 },
  // Maine
  { name: "Portland", state: "ME", lat: 43.6591, lng: -70.2568 },
  // Maryland
  { name: "Baltimore", state: "MD", lat: 39.2904, lng: -76.6122 },
  { name: "Annapolis", state: "MD", lat: 38.9784, lng: -76.4922 },
  // Massachusetts
  { name: "Boston", state: "MA", lat: 42.3601, lng: -71.0589 },
  { name: "Cambridge", state: "MA", lat: 42.3736, lng: -71.1097 },
  // Michigan
  { name: "Detroit", state: "MI", lat: 42.3314, lng: -83.0458 },
  { name: "Ann Arbor", state: "MI", lat: 42.2808, lng: -83.743 },
  // Minnesota
  { name: "Minneapolis", state: "MN", lat: 44.9778, lng: -93.265 },
  { name: "St. Paul", state: "MN", lat: 44.9537, lng: -93.09 },
  // Mississippi
  { name: "Jackson", state: "MS", lat: 32.2988, lng: -90.1848 },
  // Missouri
  { name: "St. Louis", state: "MO", lat: 38.627, lng: -90.1994 },
  { name: "Kansas City", state: "MO", lat: 39.0997, lng: -94.5786 },
  // Montana
  { name: "Missoula", state: "MT", lat: 46.8721, lng: -113.994 },
  // Nebraska
  { name: "Omaha", state: "NE", lat: 41.2565, lng: -95.9345 },
  // Nevada
  { name: "Las Vegas", state: "NV", lat: 36.1699, lng: -115.1398 },
  // New Hampshire
  { name: "Manchester", state: "NH", lat: 42.9956, lng: -71.4548 },
  // New Jersey
  { name: "Newark", state: "NJ", lat: 40.7357, lng: -74.1724 },
  { name: "Jersey City", state: "NJ", lat: 40.7178, lng: -74.0431 },
  // New Mexico
  { name: "Albuquerque", state: "NM", lat: 35.0844, lng: -106.6504 },
  { name: "Santa Fe", state: "NM", lat: 35.687, lng: -105.9378 },
  // New York
  { name: "New York", state: "NY", lat: 40.7128, lng: -74.006 },
  { name: "Brooklyn", state: "NY", lat: 40.6782, lng: -73.9442 },
  { name: "Buffalo", state: "NY", lat: 42.8864, lng: -78.8784 },
  { name: "Albany", state: "NY", lat: 42.6526, lng: -73.7562 },
  // North Carolina
  { name: "Charlotte", state: "NC", lat: 35.2271, lng: -80.8431 },
  { name: "Durham", state: "NC", lat: 35.994, lng: -78.8986 },
  { name: "Raleigh", state: "NC", lat: 35.7796, lng: -78.6382 },
  { name: "Asheville", state: "NC", lat: 35.5951, lng: -82.5515 },
  // Ohio
  { name: "Columbus", state: "OH", lat: 39.9612, lng: -82.9988 },
  { name: "Cincinnati", state: "OH", lat: 39.1031, lng: -84.512 },
  { name: "Cleveland", state: "OH", lat: 41.4993, lng: -81.6944 },
  // Oklahoma
  { name: "Oklahoma City", state: "OK", lat: 35.4676, lng: -97.5164 },
  { name: "Tulsa", state: "OK", lat: 36.154, lng: -95.9928 },
  // Oregon
  { name: "Portland", state: "OR", lat: 45.5152, lng: -122.6784 },
  { name: "Eugene", state: "OR", lat: 44.0521, lng: -123.0868 },
  // Pennsylvania
  { name: "Philadelphia", state: "PA", lat: 39.9526, lng: -75.1652 },
  { name: "Pittsburgh", state: "PA", lat: 40.4406, lng: -79.9959 },
  // Rhode Island
  { name: "Providence", state: "RI", lat: 41.824, lng: -71.4128 },
  // South Carolina
  { name: "Charleston", state: "SC", lat: 32.7765, lng: -79.9311 },
  { name: "Columbia", state: "SC", lat: 34.0007, lng: -81.0348 },
  { name: "Greenville", state: "SC", lat: 34.8526, lng: -82.394 },
  // Tennessee
  { name: "Nashville", state: "TN", lat: 36.1627, lng: -86.7816 },
  { name: "Memphis", state: "TN", lat: 35.1495, lng: -90.049 },
  { name: "Knoxville", state: "TN", lat: 35.9606, lng: -83.9207 },
  { name: "Chattanooga", state: "TN", lat: 35.0456, lng: -85.3097 },
  // Texas
  { name: "Austin", state: "TX", lat: 30.2672, lng: -97.7431 },
  { name: "Houston", state: "TX", lat: 29.7604, lng: -95.3698 },
  { name: "Dallas", state: "TX", lat: 32.7767, lng: -96.797 },
  { name: "San Antonio", state: "TX", lat: 29.4241, lng: -98.4936 },
  { name: "Fort Worth", state: "TX", lat: 32.7555, lng: -97.3308 },
  { name: "El Paso", state: "TX", lat: 31.7619, lng: -106.485 },
  { name: "San Marcos", state: "TX", lat: 29.8833, lng: -97.9414 },
  // Utah
  { name: "Salt Lake City", state: "UT", lat: 40.7608, lng: -111.891 },
  // Vermont
  { name: "Burlington", state: "VT", lat: 44.4759, lng: -73.2121 },
  // Virginia
  { name: "Richmond", state: "VA", lat: 37.5407, lng: -77.436 },
  { name: "Virginia Beach", state: "VA", lat: 36.8529, lng: -75.978 },
  { name: "Norfolk", state: "VA", lat: 36.8508, lng: -76.2859 },
  // Washington
  { name: "Seattle", state: "WA", lat: 47.6062, lng: -122.3321 },
  { name: "Spokane", state: "WA", lat: 47.6588, lng: -117.426 },
  // West Virginia
  { name: "Charleston", state: "WV", lat: 38.3498, lng: -81.6326 },
  // Wisconsin
  { name: "Milwaukee", state: "WI", lat: 43.0389, lng: -87.9065 },
  { name: "Madison", state: "WI", lat: 43.0731, lng: -89.4012 },
  // Wyoming
  { name: "Jackson", state: "WY", lat: 43.4799, lng: -110.7624 },
];

export function searchLocations(query: string): Location[] {
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  // Three tiers: city starts-with, city contains, state match
  const cityStartsWith = locations.filter((l) => l.name.toLowerCase().startsWith(q));
  const cityContains = locations.filter(
    (l) => !l.name.toLowerCase().startsWith(q) && l.name.toLowerCase().includes(q)
  );
  const stateMatches = locations.filter(
    (l) => !l.name.toLowerCase().includes(q) && l.state.toLowerCase().includes(q)
  );
  return [...cityStartsWith, ...cityContains, ...stateMatches].slice(0, 8);
}
