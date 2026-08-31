import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import { auth } from "@/lib/auth";

// ─── Auth ───

export async function signupUser(data: {
  name: string;
  email: string;
  password: string;
  role: "customer" | "business";
  businessName?: string;
}) {
  const existing = await prisma.user.findUnique({
    where: { email: data.email.toLowerCase() },
  });
  if (existing) return { error: "An account with this email already exists" };

  const hashed = await bcrypt.hash(data.password, 12);
  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email.toLowerCase(),
      password: hashed,
      role: data.role === "business" ? "BUSINESS" : "CUSTOMER",
    },
  });

  return { user: { id: user.id, name: user.name, email: user.email, role: user.role } };
}

// ─── Favorites ───

export async function getFavorites() {
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id;
  if (!userId) return [];

  const favorites = await prisma.favorite.findMany({
    where: { userId },
    select: { vendorId: true },
  });
  return favorites.map((f) => f.vendorId);
}

export async function toggleFavorite(vendorId: string) {
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id;
  if (!userId) return { error: "You must be signed in to save favorites" };

  const existing = await prisma.favorite.findUnique({
    where: { userId_vendorId: { userId, vendorId } },
  });

  if (existing) {
    await prisma.favorite.delete({ where: { id: existing.id } });
    return { favorited: false };
  } else {
    await prisma.favorite.create({ data: { userId, vendorId } });
    return { favorited: true };
  }
}

// ─── Reviews ───

export async function getReviewsForVendor(vendorId: string) {
  const reviews = await prisma.review.findMany({
    where: { vendorId },
    orderBy: { createdAt: "desc" },
  });
  return reviews.map((r) => ({
    id: r.id,
    vendorId: r.vendorId,
    authorName: r.authorName,
    rating: r.rating,
    text: r.text,
    date: r.createdAt.toISOString().split("T")[0],
    response: r.response as { text: string; date: string } | null,
  }));
}

export async function addReview(data: {
  vendorId: string;
  authorName: string;
  rating: number;
  text: string;
}) {
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id;
  if (!userId) return { error: "You must be signed in to leave a review" };

  const review = await prisma.review.create({
    data: {
      vendorId: data.vendorId,
      authorId: userId,
      authorName: data.authorName,
      rating: data.rating,
      text: data.text,
    },
  });
  return {
    review: {
      id: review.id,
      vendorId: review.vendorId,
      authorName: review.authorName,
      rating: review.rating,
      text: review.text,
      date: review.createdAt.toISOString().split("T")[0],
      response: null as any,
    },
  };
}

export async function addReviewResponse(reviewId: string, text: string) {
  const review = await prisma.review.update({
    where: { id: reviewId },
    data: { response: { text, date: new Date().toISOString() } },
  });
  return {
    id: review.id,
    vendorId: review.vendorId,
    authorName: review.authorName,
    rating: review.rating,
    text: review.text,
    date: review.createdAt.toISOString().split("T")[0],
    response: review.response as { text: string; date: string } | null,
  };
}

// ─── Messages ───

export async function getMessagesForVendor(vendorId: string) {
  const messages = await prisma.message.findMany({
    where: { vendorId },
    orderBy: { createdAt: "desc" },
  });
  return messages.map((m) => ({
    id: m.id,
    vendorId: m.vendorId,
    senderName: m.senderName,
    text: m.text,
    date: m.createdAt.toISOString(),
    read: m.read,
    response: m.response as { text: string; date: string } | null,
  }));
}

export async function addMessage(data: {
  vendorId: string;
  senderName: string;
  text: string;
}) {
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id;
  if (!userId) return { error: "You must be signed in to message a business" };

  const message = await prisma.message.create({
    data: {
      vendorId: data.vendorId,
      senderId: userId,
      senderName: data.senderName,
      text: data.text,
    },
  });
  return {
    message: {
      id: message.id,
      vendorId: message.vendorId,
      senderName: message.senderName,
      text: message.text,
      date: message.createdAt.toISOString(),
      read: message.read,
      response: null as any,
    },
  };
}

export async function addMessageResponse(messageId: string, text: string) {
  const message = await prisma.message.update({
    where: { id: messageId },
    data: {
      response: { text, date: new Date().toISOString() } as any,
      read: true,
    },
  });
  return {
    id: message.id,
    vendorId: message.vendorId,
    senderName: message.senderName,
    text: message.text,
    date: message.createdAt.toISOString(),
    read: message.read,
    response: message.response as { text: string; date: string } | null,
  };
}

export async function getUnreadMessageCount(vendorId: string) {
  return prisma.message.count({
    where: { vendorId, read: false, response: { equals: Prisma.DbNull } },
  });
}
