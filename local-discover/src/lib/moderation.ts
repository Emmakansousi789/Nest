/**
 * Content moderation utilities for UGC (reviews, messages).
 * Provides basic profanity/word filtering and content validation.
 * Used by API routes to filter user-submitted text before storage.
 */

// Common profanity and inappropriate words list.
// In production, replace with a service like Perspective API, ContentScale, or Sightengine.
const BLOCKED_PATTERNS = [
  // Profanity (partial list — expand as needed)
  /\b(f+[\W_]*u+[\W_]*c+[\W_]*k+)\b/i,
  /\b(s+[\W_]*h+[\W_]*[i1]+[\W_]*t+)\b/i,
  /\b(a+[\W_]*s+[\W_]*s+)\b/i,
  /\b(b+[\W_]*[i1]+[\W_]*t+[\W_]*c+[\W_]*h+)\b/i,
  /\b(d+[\W_]*a+[\W_]*m+[\W_]*n+)\b/i,
  /\b(c+[\W_]*r+[\W_]*a+[\W_]*p+)\b/i,
  /\b(h+[\W_]*a+[\W_]*t+[\W_]*e+)\b/i,
  // Threats and harassment
  /\b(k+[\W_]*i+[\W_]*l+[\W_]*l+)\b/i,
  /\b(d+[\W_]*e+[\W_]*a+[\W_]*d+)\b/i,
  // Slurs and discriminatory language
  /\b(r+[\W_]*e+[\W_]*t+[\W_]*a+[\W_]*r+[\W_]*d+)\b/i,
  /\b(i+[\W_]*d+[\W_]*[i1]+[\W_]*o+[\W_]*t+)\b/i,
  /\b(s+[\W_]*t+[\W_]*u+[\W_]*p+[\W_]*i+[\W_]*d+)\b/i,
  // Spam patterns
  /\b(b+[\W_]*u+[\W_]*y+\s+n+[\W_]*o+[\W_]*w+)\b/i,
  /\b(f+[\W_]*r+[\W_]*e+[\W_]*e+\s+m+[\W_]*o+[\W_]*n+[\W_]*e+[\W_]*y+)\b/i,
  /\b(c+[\W_]*l+[\W_]*[i1]+[\W_]*c+[\W_]*k+\s+h+[\W_]*e+[\W_]*r+[\W_]*e+)\b/i,
  /\b(w+[\W_]*o+[\W_]*r+[\W_]*k+\s+f+[\W_]*r+[\W_]*o+[\W_]*m+\s+h+[\W_]*o+[\W_]*m+[\W_]*e+)\b/i,
];

// Phone number and email patterns (to prevent sharing contact info in reviews)
const CONTACT_PATTERNS = [
  /\b\d{3}[\s.-]?\d{3}[\s.-]?\d{4}\b/, // Phone numbers
  /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/, // Email addresses
  /\bhttps?:\/\/[^\s]+/i, // URLs
];

export interface ModerationResult {
  clean: boolean;
  filteredText: string;
  blockedReason?: string;
}

/**
 * Check text for inappropriate content and return a filtered version.
 */
export function moderateContent(text: string): ModerationResult {
  const trimmed = text.trim();

  if (trimmed.length === 0) {
    return { clean: false, filteredText: "", blockedReason: "Content cannot be empty" };
  }

  if (trimmed.length > 2000) {
    return { clean: false, filteredText: trimmed, blockedReason: "Content exceeds 2000 characters" };
  }

  // Check for blocked words
  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(trimmed)) {
      return {
        clean: false,
        filteredText: trimmed,
        blockedReason: "Content contains language that violates our community guidelines",
      };
    }
  }

  // Check for contact info in reviews (messages allow it for business communication)
  for (const pattern of CONTACT_PATTERNS) {
    if (pattern.test(trimmed)) {
      return {
        clean: false,
        filteredText: trimmed,
        blockedReason: "Please do not share personal contact information in reviews",
      };
    }
  }

  return { clean: true, filteredText: trimmed };
}

/**
 * Moderate message content (allows contact info for business communication
 * but still blocks profanity and harassment).
 */
export function moderateMessage(text: string): ModerationResult {
  const trimmed = text.trim();

  if (trimmed.length === 0) {
    return { clean: false, filteredText: "", blockedReason: "Message cannot be empty" };
  }

  if (trimmed.length > 2000) {
    return { clean: false, filteredText: trimmed, blockedReason: "Message exceeds 2000 characters" };
  }

  // Only check for profanity/harassment in messages (contact info is allowed)
  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(trimmed)) {
      return {
        clean: false,
        filteredText: trimmed,
        blockedReason: "Message contains language that violates our community guidelines",
      };
    }
  }

  return { clean: true, filteredText: trimmed };
}
