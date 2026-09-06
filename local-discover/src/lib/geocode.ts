export interface GeoResult {
  name: string;
  state?: string;
  lat: number;
  lng: number;
}

export async function searchPlaces(query: string): Promise<GeoResult[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  try {
    const res = await fetch(`/api/geocode?q=${encodeURIComponent(trimmed)}`);
    if (!res.ok) return [];
    const data = await res.json();
    return data.results || [];
  } catch {
    return [];
  }
}
