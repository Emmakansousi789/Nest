import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { sendMessageSchema, respondMessageSchema } from "@/lib/validations";
import { prisma } from "@/lib/prisma";
import { moderateMessage } from "@/lib/moderation";
import { getMessagesForVendor as getSeedMessages } from "@/data/store";

// GET /api/messages?vendorId=xxx — Get messages for a vendor (with seed fallback)
export async function GET(req: Request) {
  const url = new URL(req.url);
  const vendorId = url.searchParams.get("vendorId");
  if (!vendorId) {
    return NextResponse.json({ error: "vendorId required" }, { status: 400 });
  }

  try {
    const dbMessages = await prisma.message.findMany({
      where: { vendorId },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({
      messages: dbMessages.map((m) => ({
        id: m.id,
        vendorId: m.vendorId,
        senderId: m.senderId,
        senderName: m.senderName,
        text: m.text,
        date: m.createdAt.toISOString(),
        read: m.read,
        response: (m.response as { text: string; date: string }) || undefined,
      })),
      source: "database",
    });
  } catch {
    return NextResponse.json({ messages: getSeedMessages(vendorId), source: "seed" });
  }
}

// POST /api/messages — Send a message to a vendor
export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    // Validate input with Zod
    const parsed = sendMessageSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { vendorId, senderId, senderName, text } = parsed.data;

    // IDOR Protection: Verify the authenticated user is the sender
    if (session.user.id !== senderId) {
      return NextResponse.json(
        { error: "Forbidden: Cannot send message as another user" },
        { status: 403 }
      );
    }

    // Content moderation — filter profanity and harassment
    const moderation = moderateMessage(text);
    if (!moderation.clean) {
      return NextResponse.json(
        { error: moderation.blockedReason },
        { status: 400 }
      );
    }

    // Verify the vendor exists
    const vendor = await prisma.vendor.findUnique({
      where: { id: vendorId },
    });
    if (!vendor) {
      return NextResponse.json(
        { error: "Vendor not found" },
        { status: 404 }
      );
    }

    // Create the message
    const message = await prisma.message.create({
      data: {
        vendorId,
        senderId,
        senderName,
        text,
      },
    });

    return NextResponse.json({ message }, { status: 201 });
  } catch (error) {
    console.error("Send message error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH /api/messages — Respond to a message (IDOR-protected: only vendor owner can respond)
export async function PATCH(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    // Validate input with Zod
    const parsed = respondMessageSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { messageId, responseText } = parsed.data;

    // Find the message
    const message = await prisma.message.findUnique({
      where: { id: messageId },
      include: { vendor: true },
    });
    if (!message) {
      return NextResponse.json(
        { error: "Message not found" },
        { status: 404 }
      );
    }

    // IDOR Protection: Verify the authenticated user owns the vendor
    if (message.vendor.ownerId !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden: Only the vendor owner can respond to messages" },
        { status: 403 }
      );
    }

    // Update the message with the response
    const updatedMessage = await prisma.message.update({
      where: { id: messageId },
      data: {
        response: {
          text: responseText,
          date: new Date().toISOString(),
        },
        read: true,
      },
    });

    return NextResponse.json({ message: updatedMessage });
  } catch (error) {
    console.error("Respond to message error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
