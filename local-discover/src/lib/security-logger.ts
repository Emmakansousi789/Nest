// Security event logger for tracking auth events, failed attempts, and suspicious activity
// In production, pipe these to a logging service (Datadog, Logflare, etc.)

type SecurityEvent = {
  timestamp: string;
  type: "auth_signup" | "auth_login_success" | "auth_login_failure" | "rate_limit_exceeded" | "csrf_blocked" | "body_too_large" | "idor_attempt" | "validation_failure";
  ip?: string;
  path?: string;
  detail?: string;
};

const LOG_PREFIX = "[SECURITY]";

export function logSecurityEvent(event: SecurityEvent) {
  // Always log in development; in production, send to external service
  if (process.env.NODE_ENV === "development") {
    console.warn(
      `${LOG_PREFIX} ${event.type} | ${event.timestamp} | IP: ${event.ip || "unknown"} | Path: ${event.path || "n/a"}${event.detail ? ` | ${event.detail}` : ""}`
    );
  }

  // In production, you could send to an external logging service:
  // await fetch("https://your-logging-endpoint.com/security", { method: "POST", body: JSON.stringify(event) });
}

export function logAuthFailure(ip: string, path: string, reason: string) {
  logSecurityEvent({
    timestamp: new Date().toISOString(),
    type: "auth_login_failure",
    ip,
    path,
    detail: reason,
  });
}

export function logAuthSignup(ip: string, path: string) {
  logSecurityEvent({
    timestamp: new Date().toISOString(),
    type: "auth_signup",
    ip,
    path,
  });
}

export function logRateLimit(ip: string, path: string) {
  logSecurityEvent({
    timestamp: new Date().toISOString(),
    type: "rate_limit_exceeded",
    ip,
    path,
  });
}

export function logCsrfBlock(ip: string, path: string) {
  logSecurityEvent({
    timestamp: new Date().toISOString(),
    type: "csrf_blocked",
    ip,
    path,
    detail: "Invalid origin/referer",
  });
}

export function logIdorAttempt(ip: string, path: string, userId: string) {
  logSecurityEvent({
    timestamp: new Date().toISOString(),
    type: "idor_attempt",
    ip,
    path,
    detail: `User ${userId} attempted unauthorized access`,
  });
}

export function logBodyTooLarge(ip: string, path: string, size: number) {
  logSecurityEvent({
    timestamp: new Date().toISOString(),
    type: "body_too_large",
    ip,
    path,
    detail: `Body size: ${size} bytes`,
  });
}

export function logValidationFailure(ip: string, path: string, errors: string[]) {
  logSecurityEvent({
    timestamp: new Date().toISOString(),
    type: "validation_failure",
    ip,
    path,
    detail: `Errors: ${errors.join(", ")}`,
  });
}
