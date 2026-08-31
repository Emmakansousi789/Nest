import { Vendor, Message } from "@/types";
import { vendors as seedVendors } from "./vendors";
import { reviews as seedReviews, Review } from "./reviews";

// ─── Client-side store (localStorage) ───
// This is the migration bridge: keeps working without a DB,
// but when Prisma is connected, server actions handle persistence.

const VENDORS_KEY = "ld-vendors";
const REVIEWS_KEY = "ld-reviews";
const MESSAGES_KEY = "ld-messages";

function load<T>(key: string, seed: T): T {
  if (typeof window === "undefined") return seed;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : seed;
  } catch {
    return seed;
  }
}

function save<T>(key: string, data: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(data));
}

// ─── Vendors ───

export function getVendors(): Vendor[] {
  const stored = load<Vendor[]>(VENDORS_KEY, []);
  const seedIds = new Set(seedVendors.map((v) => v.id));
  const userVendors = stored.filter((v) => !seedIds.has(v.id));
  return [...seedVendors, ...userVendors];
}

export function getVendorById(id: string): Vendor | undefined {
  return getVendors().find((v) => v.id === id);
}

export function getVendorByOwner(userId: string): Vendor | undefined {
  return getVendors().find((v) => v.ownerId === userId);
}

export function addVendor(vendor: Vendor): void {
  const vendors = getVendors();
  vendors.push(vendor);
  save(VENDORS_KEY, vendors);
}

export function updateVendor(id: string, updates: Partial<Vendor>): void {
  const vendors = getVendors();
  const idx = vendors.findIndex((v) => v.id === id);
  if (idx !== -1) {
    vendors[idx] = { ...vendors[idx], ...updates };
    save(VENDORS_KEY, vendors);
  }
}

// ─── Reviews ───

export function getReviewsForVendor(vendorId: string): Review[] {
  const stored = load<Review[]>(REVIEWS_KEY, seedReviews);
  return stored.filter((r) => r.vendorId === vendorId);
}

export function getAllReviews(): Review[] {
  return load<Review[]>(REVIEWS_KEY, seedReviews);
}

export function getAverageRating(vendorId: string): number {
  const r = getReviewsForVendor(vendorId);
  if (r.length === 0) return 0;
  return r.reduce((sum, rev) => sum + rev.rating, 0) / r.length;
}

export function getReviewCount(vendorId: string): number {
  return getReviewsForVendor(vendorId).length;
}

export function addReview(review: Review): void {
  const reviews = load<Review[]>(REVIEWS_KEY, seedReviews);
  reviews.push(review);
  save(REVIEWS_KEY, reviews);
}

export function addReviewResponse(
  reviewId: string,
  response: { text: string; date: string }
): void {
  const reviews = load<Review[]>(REVIEWS_KEY, seedReviews);
  const idx = reviews.findIndex((r) => r.id === reviewId);
  if (idx !== -1) {
    reviews[idx].response = response;
    save(REVIEWS_KEY, reviews);
  }
}

// ─── Messages ───

export function getMessagesForVendor(vendorId: string): Message[] {
  const messages = load<Message[]>(MESSAGES_KEY, []);
  return messages.filter((m) => m.vendorId === vendorId);
}

export function getMessagesByUser(userId: string): Message[] {
  const messages = load<Message[]>(MESSAGES_KEY, []);
  return messages.filter((m) => m.senderId === userId);
}

export function addMessage(message: Message): void {
  const messages = load<Message[]>(MESSAGES_KEY, []);
  messages.push(message);
  save(MESSAGES_KEY, messages);
}

export function markMessageRead(messageId: string): void {
  const messages = load<Message[]>(MESSAGES_KEY, []);
  const idx = messages.findIndex((m) => m.id === messageId);
  if (idx !== -1) {
    messages[idx].read = true;
    save(MESSAGES_KEY, messages);
  }
}

export function addMessageResponse(
  messageId: string,
  response: { text: string; date: string }
): void {
  const messages = load<Message[]>(MESSAGES_KEY, []);
  const idx = messages.findIndex((m) => m.id === messageId);
  if (idx !== -1) {
    messages[idx].response = response;
    messages[idx].read = true;
    save(MESSAGES_KEY, messages);
  }
}

export function getUnreadMessageCount(vendorId: string): number {
  return getMessagesForVendor(vendorId).filter((m) => !m.read && !m.response).length;
}
