# Security Implementation

## Security Architecture

This application uses **NextAuth v5** for authentication and **Prisma** for all database access. Authorization is enforced at the application layer within API routes and Prisma queries — not at the database level via Row-Level Security (RLS).

> **Why not Supabase RLS?** Prisma connects to PostgreSQL using a direct connection string, bypassing Supabase's GoTrue auth system. RLS policies that rely on `auth.uid()` would never receive the authenticated user's ID from Prisma, making them ineffective. All authorization must therefore be enforced in application code before queries execute.

---

## Security Controls

### 1. Application-Level Authorization (IDOR / BOLA Prevention)

Every protected API route performs two checks before any data mutation:

1. **Authentication** — `const session = await auth()` returns the JWT session; if `session?.user?.id` is missing, return 401.
2. **Ownership** — The authenticated user's ID is compared against the resource's owner/author field before allowing the operation.

| Route | Operation | Authorization Check |
|-------|-----------|---------------------|
| `PUT /api/vendors/[id]` | Update vendor | `vendor.ownerId === session.user.id` |
| `DELETE /api/vendors/[id]` | Delete vendor | `vendor.ownerId === session.user.id` |
| `POST /api/reviews` | Create review | `session.user.id === authorId` (client-supplied, verified server-side) |
| `PATCH /api/reviews` | Respond to review | `review.vendor.ownerId === session.user.id` |
| `POST /api/messages` | Send message | `session.user.id === senderId` (client-supplied, verified server-side) |
| `PATCH /api/messages` | Respond to message | `message.vendor.ownerId === session.user.id` |
| `GET /api/vendors/[id]` | Read vendor | Public (intentional — discovery app) |

All unauthorized access attempts return **403 Forbidden** with a descriptive error.

### 2. Prisma Query Safety

All Prisma queries that write data are scoped to the authenticated user:

```typescript
// Example: vendor update — Prisma only touches the row the user owns
await prisma.vendor.update({
  where: { id },  // id validated above
  data: parsed.data,  // Zod-validated input
});
```

The `where: { id }` clause is always preceded by an ownership check (see §1). There are no `findFirst`, `findMany`, or `updateMany` calls that skip user-scoping on protected resources.

**Public reads** (`GET /api/vendors/[id]`, vendor listing queries) intentionally return data without user-scoping — this is a discovery app where business listings are public.

### 3. Authentication

- **Provider**: NextAuth v5 with Credentials provider (email + password)
- **Session strategy**: JWT (not database sessions)
- **Password hashing**: bcrypt with cost factor 14
- **Session duration**: 30 days

### 4. Input Validation & Sanitization

All API inputs are validated with Zod schemas before processing:

| Schema | Route | Fields |
|--------|-------|--------|
| `signupSchema` | `/api/auth/signup` | name, email, password, role |
| `loginSchema` | NextAuth authorize() | email, password |
| `submitVendorSchema` | `/api/submit-vendor` | name, email, city, description |
| `createReviewSchema` | `POST /api/reviews` | vendorId, authorId, authorName, rating, text |
| `respondReviewSchema` | `PATCH /api/reviews` | reviewId, responseText |
| `sendMessageSchema` | `POST /api/messages` | vendorId, senderId, senderName, text |
| `respondMessageSchema` | `PATCH /api/messages` | messageId, responseText |
| `updateVendorSchema` | `PUT /api/vendors/[id]` | All vendor fields (partial) |

**XSS prevention**: All user-supplied text is sanitized on input (HTML entities for `<`, `>`, `"`, `'`). Additionally, `MapViewInner.tsx` uses an `escapeHtml()` helper for any vendor fields interpolated into raw HTML strings (Leaflet popups/divIcons).

### 5. Secure Cookie Flags

| Cookie | httpOnly | secure (prod) | sameSite | Prefix (prod) |
|--------|----------|---------------|----------|---------------|
| session-token | ✅ true | ✅ true | lax | `__Secure-` |
| callback-url | ✅ true | ✅ true | lax | `__Secure-` |
| csrf-token | ✅ true | ✅ true | lax | `__Host-` |

### 6. Rate Limiting

Implemented in middleware, keyed by client IP:

| Route Type | Limit | Window |
|------------|-------|--------|
| Auth (signup/login) | 5 requests | 15 minutes |
| Vendor submission | 3 requests | 1 hour |
| Reviews/messages | 10 requests | 1 minute |
| General API | 60 requests | 1 minute |

Returns 429 with `Retry-After` header and structured error response.

### 7. Request Body Size Limits

- 1MB maximum on all state-changing API routes (POST/PUT/PATCH)
- Enforced in middleware via `Content-Length` header inspection
- Returns 413 if exceeded

### 8. CORS Restrictions

- `Access-Control-Allow-Origin: same-origin` on all API responses
- OPTIONS preflight handled with 24h max-age
- Only `Content-Type`, `Authorization`, `X-CSRF-Token` headers allowed

### 9. Security Headers

| Header | Value | Purpose |
|--------|-------|---------|
| `X-Frame-Options` | DENY | Prevents clickjacking |
| `X-Content-Type-Options` | nosniff | Prevents MIME-type sniffing |
| `Referrer-Policy` | strict-origin-when-cross-origin | Controls referrer leakage |
| `X-XSS-Protection` | 1; mode=block | Legacy XSS filter |
| `Strict-Transport-Security` | max-age=31536000; includeSubDomains | Forces HTTPS |
| `Permissions-Policy` | camera=(), microphone=(), geolocation=() | Disables sensitive APIs |

### 10. CSRF Protection

- Custom API routes (`/api/submit-vendor`) validate Origin/Referer headers against the host
- NextAuth handles CSRF internally for its own routes
- Returns 403 on origin mismatch

### 11. Security Event Logging

All security-relevant events are logged with `[SECURITY]` prefix:

| Event Type | What's Logged |
|------------|---------------|
| `auth_signup` | New account creation with IP |
| `auth_login_failure` | Failed login attempt with IP and reason |
| `rate_limit_exceeded` | Rate-limited request with IP and path |
| `csrf_blocked` | CSRF validation failure with IP and path |
| `body_too_large` | Oversized payload with IP, path, and size |
| `idor_attempt` | Unauthorized access attempt with IP, path, and user ID |

### 12. User Enumeration Prevention

- Signup returns generic message regardless of email existence: `"If this email is not already registered, check your inbox for next steps."`
- Login returns null on failure — NextAuth shows generic "Could not sign in" message
- No differentiated error messages between "user not found" and "wrong password"

---

## Database Security Notes

### Supabase Dashboard Configuration

Even though RLS policies are not enforced by the application (Prisma bypasses GoTrue), the following database-level protections should be configured in the Supabase dashboard:

1. **Restrict the database role used by Prisma** — Use a dedicated role with minimum required permissions (SELECT, INSERT, UPDATE, DELETE on app tables only — no `ALTER`, `DROP`, or `TRUNCATE`)
2. **Enable SSL for the connection string** — Ensure `sslmode=require` in the `DATABASE_URL`
3. **Restrict network access** — Use Supabase's IP allowlisting to restrict which IPs can connect to the database
4. **Enable database audit logging** — Supabase provides `pg_stat_statements` for query logging
5. **Rotate connection credentials** — Use Supabase's credential rotation feature periodically

### Prisma Schema Safety

The Prisma schema uses:
- `@default(cuid())` for all IDs — prevents sequential ID enumeration
- `@unique` constraints on email — prevents duplicate accounts
- `@relation` with `onDelete: Cascade` — prevents orphaned records
- `@@index` on frequently queried fields — prevents slow-query DoS

---

## Items Deferred (Not Yet Applicable)

| Item | Reason Deferred |
|------|----------------|
| Reset sessions on password change | No password-reset flow exists yet |
| Expire reset links / Rate limit resets | No reset flow exists yet |
| Whitelist upload types | No file upload feature exists yet |
| Verify payment webhooks | No payment processing in this app |
| Set prices server-side | No payment processing in this app |
| Block prompt injection / Cap AI usage | No AI/chat features in this app |
| Remove default admin route | No admin panel exists |
| Disable directory listing | Not applicable on Vercel/similar hosting |
