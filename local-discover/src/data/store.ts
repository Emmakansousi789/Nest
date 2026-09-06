import { Vendor, Message, BusinessCategory, BusinessTag } from "@/types";
import { prisma } from "@/lib/prisma";
import { vendors as seedVendors } from "./vendors";
import { reviews as seedReviews, Review } from "./reviews";
import type { Prisma } from "@prisma/client";

// ─── Bridge layer: tries Prisma first, falls back to seed/localStorage ───
// Server components get real DB data. Client components get seed data as fallback.

const vendorSelect = {
  id: true, name: true, tagline: true, story: true, category: true,
  tags: true, address: true, city: true, state: true, zip: true,
  lat: true, lng: true, phone: true, email: true, website: true,
  instagram: true, hours: true, featured: true, verified: true,
  isPopUp: true, currentMarketId: true, joinedDate: true, ownerId: true,
  photos: { select: { url: true, alt: true, caption: true }, orderBy: { order: "asc" as const } },
  products: true,
} satisfies Prisma.VendorSelect;

function mapDbVendor(v: Record<string, unknown>): Vendor {
  return {
    id: v.id as string, name: v.name as string, tagline: v.tagline as string,
    story: v.story as string, category: v.category as BusinessCategory,
    tags: v.tags as BusinessTag[], address: v.address as string,
    city: v.city as string, state: v.state as string, zip: v.zip as string,
    lat: v.lat as number, lng: v.lng as number, phone: v.phone as string,
    email: v.email as string, website: (v.website as string) || undefined,
    instagram: (v.instagram as string) || undefined,
    hours: v.hours as Vendor["hours"],
    photos: Array.isArray(v.photos)
      ? (v.photos as { url: string; alt: string; caption: string | null }[]).map((p) => ({
          url: p.url, alt: p.alt, caption: p.caption || undefined,
        }))
      : [],
    products: (v.products as Vendor["products"]) || [],
    featured: v.featured as boolean, verified: v.verified as boolean,
    isPopUp: (v.isPopUp as boolean) || false,
    currentMarketId: (v.currentMarketId as string) || null,
    joinedDate: v.joinedDate instanceof Date
      ? v.joinedDate.toISOString().split("T")[0] : String(v.joinedDate),
    ownerId: (v.ownerId as string) || undefined,
  };
}

// ─── Client-side localStorage helpers (for browser fallback) ───
const VENDORS_KEY = "ld-vendors";
const REVIEWS_KEY = "ld-reviews";
const MESSAGES_KEY = "ld-messages";

function loadClient<T>(key: string, seed: T): T {
  if (typeof window === "undefined") return seed;
  try { return JSON.parse(localStorage.getItem(key) || "") || seed; } catch { return seed; }
}
function saveClient<T>(key: string, data: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(data));
}

// ─── Vendors ───

export function getVendors(): Vendor[] {
  // In server context, return seed data (server components use async version)
  if (typeof window === "undefined") return seedVendors;
  // In browser, merge seed + user-created vendors from localStorage
  const stored = loadClient<Vendor[]>(VENDORS_KEY, []);
  const seedIds = new Set(seedVendors.map((v) => v.id));
  const userVendors = stored.filter((v) => !seedIds.has(v.id));
  return [...seedVendors, ...userVendors];
}

// Async version for server components — uses Prisma
export async function getVendorsAsync(): Promise<Vendor[]> {
  try {
    const dbVendors = await prisma.vendor.findMany({
      select: vendorSelect,
      orderBy: [{ featured: "desc" }, { name: "asc" }],
    });
    if (dbVendors.length > 0) return dbVendors.map((v) => mapDbVendor(v as Record<string, unknown>));
  } catch (e) { console.warn("[store] getVendorsAsync: DB unavailable, using seed data", e); }
  return seedVendors;
}

export function getVendorById(id: string): Vendor | undefined {
  return getVendors().find((v) => v.id === id);
}

export async function getVendorByIdAsync(id: string): Promise<Vendor | undefined> {
  try {
    const v = await prisma.vendor.findUnique({ where: { id }, select: vendorSelect });
    if (v) return mapDbVendor(v as Record<string, unknown>);
  } catch (e) { console.warn("[store] getVendorByIdAsync: DB unavailable", e); }
  return seedVendors.find((v) => v.id === id);
}

export function getVendorByOwner(userId: string): Vendor | undefined {
  return getVendors().find((v) => v.ownerId === userId);
}

export async function getVendorByOwnerAsync(userId: string): Promise<Vendor | undefined> {
  try {
    const v = await prisma.vendor.findFirst({ where: { ownerId: userId }, select: vendorSelect });
    if (v) return mapDbVendor(v as Record<string, unknown>);
  } catch (e) { console.warn("[store] getVendorByOwnerAsync: DB unavailable", e); }
  return getVendors().find((v) => v.ownerId === userId);
}

export function addVendor(vendor: Vendor): void {
  const vendors = getVendors();
  vendors.push(vendor);
  saveClient(VENDORS_KEY, vendors);
}

export async function addVendorAsync(vendor: Vendor): Promise<void> {
  try {
    const { photos, products, ...rest } = vendor;
    await prisma.vendor.create({
      data: {
        ...rest,
        hours: rest.hours as unknown as Prisma.InputJsonValue,
        products: products as unknown as Prisma.InputJsonValue[],
        photos: { create: photos.map((p, i) => ({ url: p.url, alt: p.alt, caption: p.caption || null, order: i })) },
      },
    });
  } catch { addVendor(vendor); }
}

export function updateVendor(id: string, updates: Partial<Vendor>): void {
  const vendors = getVendors();
  const idx = vendors.findIndex((v) => v.id === id);
  if (idx !== -1) { vendors[idx] = { ...vendors[idx], ...updates }; saveClient(VENDORS_KEY, vendors); }
}

export async function updateVendorAsync(id: string, updates: Partial<Vendor>): Promise<void> {
  try {
    const { photos, products, ...rest } = updates;
    const data: Record<string, unknown> = { ...rest };
    if (products) data.products = products as unknown as Prisma.InputJsonValue[];
    if (rest.hours) data.hours = rest.hours as unknown as Prisma.InputJsonValue;
    for (const [key, val] of Object.entries(data)) { if (val === undefined) delete data[key]; }
    await prisma.vendor.update({ where: { id }, data: data as Prisma.VendorUpdateInput });
  } catch { updateVendor(id, updates); }
}

// ─── Reviews ───

export function getReviewsForVendor(vendorId: string): Review[] {
  const stored = loadClient<Review[]>(REVIEWS_KEY, seedReviews);
  return stored.filter((r) => r.vendorId === vendorId);
}

export async function getReviewsForVendorAsync(vendorId: string) {
  try {
    const reviews = await prisma.review.findMany({ where: { vendorId }, orderBy: { createdAt: "desc" } });
    if (reviews.length > 0) return reviews.map((r) => ({
      id: r.id, vendorId: r.vendorId, authorName: r.authorName, rating: r.rating,
      text: r.text, date: r.createdAt.toISOString().split("T")[0],
      response: (r.response as { text: string; date: string }) || undefined,
    }));
  } catch { /* fall through */ }
  return getReviewsForVendor(vendorId);
}

export function getAllReviews(): Review[] { return loadClient<Review[]>(REVIEWS_KEY, seedReviews); }

export function getAverageRating(vendorId: string): number {
  const r = getReviewsForVendor(vendorId);
  if (r.length === 0) return 0;
  return r.reduce((sum, rev) => sum + rev.rating, 0) / r.length;
}

export async function getAverageRatingAsync(vendorId: string): Promise<number> {
  try {
    const result = await prisma.review.aggregate({ where: { vendorId }, _avg: { rating: true } });
    if (result._avg.rating) return result._avg.rating;
  } catch { /* fall through */ }
  return getAverageRating(vendorId);
}

export function getReviewCount(vendorId: string): number {
  return getReviewsForVendor(vendorId).length;
}

export async function getReviewCountAsync(vendorId: string): Promise<number> {
  try { return await prisma.review.count({ where: { vendorId } }); }
  catch { return getReviewCount(vendorId); }
}

export function addReview(review: Review): void {
  const reviews = loadClient<Review[]>(REVIEWS_KEY, seedReviews);
  reviews.push(review);
  saveClient(REVIEWS_KEY, reviews);
}

export async function addReviewAsync(review: { id: string; vendorId: string; authorId: string; authorName: string; rating: number; text: string }): Promise<void> {
  try {
    await prisma.review.create({ data: { ...review, response: undefined } });
  } catch { addReview({ ...review, date: new Date().toISOString() }); }
}

export function addReviewResponse(reviewId: string, response: { text: string; date: string }): void {
  const reviews = loadClient<Review[]>(REVIEWS_KEY, seedReviews);
  const idx = reviews.findIndex((r) => r.id === reviewId);
  if (idx !== -1) { reviews[idx].response = response; saveClient(REVIEWS_KEY, reviews); }
}

export async function addReviewResponseAsync(reviewId: string, response: { text: string; date: string }): Promise<void> {
  try { await prisma.review.update({ where: { id: reviewId }, data: { response: response as unknown as Prisma.InputJsonValue } }); }
  catch { addReviewResponse(reviewId, response); }
}

// ─── Messages ───

export function getMessagesForVendor(vendorId: string): Message[] {
  const messages = loadClient<Message[]>(MESSAGES_KEY, []);
  return messages.filter((m) => m.vendorId === vendorId);
}

export async function getMessagesForVendorAsync(vendorId: string): Promise<Message[]> {
  try {
    const msgs = await prisma.message.findMany({ where: { vendorId }, orderBy: { createdAt: "desc" } });
    return msgs.map((m) => ({
      id: m.id, vendorId: m.vendorId, senderId: m.senderId, senderName: m.senderName,
      text: m.text, date: m.createdAt.toISOString(), read: m.read,
      response: (m.response as { text: string; date: string }) || undefined,
    }));
  } catch { return getMessagesForVendor(vendorId); }
}

export function addMessage(message: Message): void {
  const messages = loadClient<Message[]>(MESSAGES_KEY, []);
  messages.push(message);
  saveClient(MESSAGES_KEY, messages);
}

export async function addMessageAsync(message: Message): Promise<void> {
  try {
    await prisma.message.create({
      data: { id: message.id, vendorId: message.vendorId, senderId: message.senderId,
              senderName: message.senderName, text: message.text, read: message.read },
    });
  } catch { addMessage(message); }
}

export function markMessageRead(messageId: string): void {
  const messages = loadClient<Message[]>(MESSAGES_KEY, []);
  const idx = messages.findIndex((m) => m.id === messageId);
  if (idx !== -1) { messages[idx].read = true; saveClient(MESSAGES_KEY, messages); }
}

export function addMessageResponse(messageId: string, response: { text: string; date: string }): void {
  const messages = loadClient<Message[]>(MESSAGES_KEY, []);
  const idx = messages.findIndex((m) => m.id === messageId);
  if (idx !== -1) { messages[idx].response = response; messages[idx].read = true; saveClient(MESSAGES_KEY, messages); }
}

export async function addMessageResponseAsync(messageId: string, response: { text: string; date: string }): Promise<void> {
  try {
    await prisma.message.update({ where: { id: messageId }, data: { response: response as unknown as Prisma.InputJsonValue, read: true } });
  } catch { addMessageResponse(messageId, response); }
}

export function getUnreadMessageCount(vendorId: string): number {
  return getMessagesForVendor(vendorId).filter((m) => !m.read && !m.response).length;
}

export async function getUnreadMessageCountAsync(vendorId: string): Promise<number> {
  try { return await prisma.message.count({ where: { vendorId, read: false, response: { equals: undefined } } }); }
  catch { return getUnreadMessageCount(vendorId); }
}

// ─── Client-side pure functions ───

export function filterVendors(
  vendorList: Vendor[], category: BusinessCategory | "all", tags: BusinessTag[], query: string
): Vendor[] {
  return vendorList.filter((v) => {
    if (category !== "all" && v.category !== category) return false;
    if (tags.length > 0 && !tags.some((t) => v.tags.includes(t))) return false;
    if (query) {
      const q = query.toLowerCase();
      return v.name.toLowerCase().includes(q) || v.tagline.toLowerCase().includes(q) ||
        v.story.toLowerCase().includes(q) || v.city.toLowerCase().includes(q) ||
        v.category.toLowerCase().includes(q) || v.tags.some((t) => t.toLowerCase().includes(q)) ||
        v.products.some((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    }
    return true;
  });
}

export function isOpenNow(vendor: Vendor): boolean {
  const now = new Date();
  const dayName = now.toLocaleDateString("en-US", { weekday: "long" });
  const hours = vendor.hours[dayName];
  if (!hours || hours.closed) return false;
  const parseTime = (t: string): number => {
    const [time, period] = t.split(" ");
    let [h, m] = time.split(":").map(Number);
    if (period === "PM" && h !== 12) h += 12;
    if (period === "AM" && h === 12) h = 0;
    return h * 60 + m;
  };
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  return currentMinutes >= parseTime(hours.open) && currentMinutes < parseTime(hours.close);
}
