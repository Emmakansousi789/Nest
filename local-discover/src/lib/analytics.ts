/**
 * Lightweight analytics event tracking.
 * Stores events in localStorage for now; swap for a real analytics provider
 * (PostHog, Mixpanel, Amplitude) when ready for production analytics.
 */

type EventName =
  | "vendor_view"
  | "vendor_search"
  | "vendor_favorite"
  | "vendor_unfavorite"
  | "vendor_directions"
  | "review_created"
  | "message_sent"
  | "market_view"
  | "market_checkin"
  | "market_checkout"
  | "share_vendor"
  | "signup"
  | "login"
  | "logout";

interface AnalyticsEvent {
  name: EventName;
  properties?: Record<string, string | number | boolean>;
  timestamp: number;
  sessionId: string;
}

const SESSION_KEY = "ld-analytics-session";
const EVENTS_KEY = "ld-analytics-events";
const MAX_EVENTS = 500; // Keep last 500 events in localStorage

function getSessionId(): string {
  if (typeof window === "undefined") return "server";
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

/**
 * Track an analytics event.
 * Safe to call from any component — no-ops on server side.
 */
export function trackEvent(
  name: EventName,
  properties?: Record<string, string | number | boolean>
): void {
  if (typeof window === "undefined") return;

  const event: AnalyticsEvent = {
    name,
    properties,
    timestamp: Date.now(),
    sessionId: getSessionId(),
  };

  try {
    const stored = localStorage.getItem(EVENTS_KEY);
    const events: AnalyticsEvent[] = stored ? JSON.parse(stored) : [];
    events.push(event);

    // Trim to max events
    if (events.length > MAX_EVENTS) {
      events.splice(0, events.length - MAX_EVENTS);
    }

    localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
  } catch {
    // localStorage full or unavailable — silently drop
  }
}

/**
 * Get all stored analytics events (for admin/debug view).
 */
export function getStoredEvents(): AnalyticsEvent[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(EVENTS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

/**
 * Clear stored analytics events.
 */
export function clearEvents(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(EVENTS_KEY);
}

/**
 * Get event counts by name (for quick analytics dashboard).
 */
export function getEventCounts(): Record<EventName, number> {
  const events = getStoredEvents();
  const counts: Record<string, number> = {};
  for (const event of events) {
    counts[event.name] = (counts[event.name] || 0) + 1;
  }
  return counts as Record<EventName, number>;
}
