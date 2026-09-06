import { secureGet, secureSet } from "@/lib/secure-storage";

const STORAGE_KEY = "ld-favorites";

export async function getFavorites(): Promise<string[]> {
  try {
    const stored = await secureGet(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export async function toggleFavorite(id: string): Promise<string[]> {
  const current = await getFavorites();
  const next = current.includes(id)
    ? current.filter((i) => i !== id)
    : [...current, id];
  await secureSet(STORAGE_KEY, JSON.stringify(next));
  // Force re-render by dispatching a storage event
  window.dispatchEvent(new Event("storage"));
  return next;
}
