import { z } from "zod";

// ─── Sanitize helper: strip dangerous characters from user text ───
function sanitizeString(maxLen: number) {
  return z
    .string()
    .min(1, "Required")
    .max(maxLen)
    .transform((s) =>
      s
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#x27;")
        .trim()
    );
}

// ─── Auth ───

export const signupSchema = z.object({
  name: sanitizeString(100),
  email: z
    .string()
    .min(1, "Email is required")
    .max(255)
    .email("Invalid email address")
    .transform((s) => s.toLowerCase().trim()),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must be at most 128 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  role: z.enum(["customer", "business"]).default("customer"),
  businessName: sanitizeString(200).optional(),
});

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address")
    .transform((s) => s.toLowerCase().trim()),
  password: z.string().min(1, "Password is required").max(128),
});

// ─── Vendor Submission ───

export const submitVendorSchema = z.object({
  name: sanitizeString(200),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email")
    .transform((s) => s.toLowerCase().trim()),
  city: sanitizeString(100),
  description: sanitizeString(2000),
});

// ─── Reviews ───

export const createReviewSchema = z.object({
  vendorId: z.string().min(1).max(100),
  authorId: z.string().min(1).max(100),
  authorName: sanitizeString(100),
  rating: z.number().int().min(0).max(5),
  text: sanitizeString(2000),
});

export const respondReviewSchema = z.object({
  reviewId: z.string().min(1).max(100),
  responseText: sanitizeString(2000),
});

// ─── Messages ───

export const sendMessageSchema = z.object({
  vendorId: z.string().min(1).max(100),
  senderId: z.string().min(1).max(100),
  senderName: sanitizeString(100),
  text: sanitizeString(2000),
});

export const respondMessageSchema = z.object({
  messageId: z.string().min(1).max(100),
  responseText: sanitizeString(2000),
});

// ─── Vendor Update (IDOR-protected) ───

export const updateVendorSchema = z.object({
  id: z.string().min(1).max(100),
  name: sanitizeString(200).optional(),
  tagline: sanitizeString(500).optional(),
  story: sanitizeString(5000).optional(),
  category: z
    .enum([
      "farmers-market",
      "food-producer",
      "maker",
      "retail",
      "services",
      "artisan",
      "wellness",
    ])
    .optional(),
  tags: z.array(z.string().max(50)).max(20).optional(),
  address: sanitizeString(300).optional(),
  city: sanitizeString(100).optional(),
  state: sanitizeString(50).optional(),
  zip: sanitizeString(20).optional(),
  phone: sanitizeString(30).optional(),
  email: z
    .string()
    .email("Invalid email")
    .transform((s) => s.toLowerCase().trim())
    .optional(),
  website: z.string().url("Invalid URL").max(500).optional().nullable(),
  instagram: sanitizeString(100).optional().nullable(),
});

// ─── Type exports ───

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type SubmitVendorInput = z.infer<typeof submitVendorSchema>;
export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type RespondReviewInput = z.infer<typeof respondReviewSchema>;
export type SendMessageInput = z.infer<typeof sendMessageSchema>;
export type RespondMessageInput = z.infer<typeof respondMessageSchema>;
export type UpdateVendorInput = z.infer<typeof updateVendorSchema>;
