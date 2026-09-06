# TODO

Outstanding work, known limitations, and pre-launch checklist items. All content below was extracted from README.md — nothing new has been added.

---

## Before Testing

- [ ] **Seed the database** — Run `npm run seed` against your PostgreSQL to populate the 12 demo vendors, 25 reviews, and 5 markets
- [ ] **Configure demo credentials** — Set `DEMO_EMAIL` and `DEMO_PASSWORD` in `.env.local` (served via `/api/auth/demo` endpoint)
- [ ] **Generate NEXTAUTH_SECRET** — `openssl rand -base64 32`
- [ ] **Set NEXTAUTH_URL** — Your production domain (e.g., `https://localdiscover.app`)

## Before Launch

### Infrastructure Setup

1. **Create Supabase Storage bucket** — In the Supabase dashboard, create a storage bucket named `vendor-photos` (public read access). Set the env vars listed in README.md.
2. **Create Upstash Redis instance** — Free tier at [upstash.com](https://upstash.com). Set the env vars listed in README.md.
3. **Account Lockout** — Not yet implemented in app code. When auth is fully enabled for production, add lockout after N failed login attempts.

### Post-Deployment Verification

- [ ] Vendor cards show real category photos (not emoji placeholders)
- [ ] Photo upload succeeds and persists after page reload
- [ ] Rate limiting returns 429 after exceeding limits
- [ ] Sign up → login → session persists → logout cycle works end-to-end
- [ ] Market creation form creates a market that appears on the map
- [ ] Share button copies link or opens native share sheet
- [ ] PWA installs on mobile (add to home screen)
- [ ] Offline page loads when network is disconnected

### App Store Connect / Play Console (Not Code)

These items cannot be completed from the codebase — they require manual action in the store dashboards:

1. **DSA Trader Status** — Declare trader/developer identity in App Store Connect for EU distribution (required since Feb 2025)
2. **Privacy Nutrition Labels** — Fill out App Privacy section in App Store Connect: Data Linked to User (name, email, location), Usage Data (analytics), Contact Info
3. **App Store Review Notes** — Document: demo account flow (via `/api/auth/demo`), app purpose (local business directory), no IAP, geocoding via Nominatim, shopper/seller persona toggle
4. **Data Safety Form** — Complete Google Play Data Safety declaration matching runtime data collection
5. **Account Deletion URL** — Declare `/delete-account` in Play Console Data Safety settings
6. **Age Rating** — Complete IARC content rating questionnaire in both stores
7. **App Icon** — Replace placeholder icon with proper 1024×1024 (iOS) / 512×512 (Android) app icon

### Supabase Configuration (Outside App Code)

- **Row-Level Security (RLS)** — Configure in Supabase dashboard. Not in app code since Prisma connects directly to PostgreSQL, bypassing Supabase GoTrue `auth.uid()`. Application-level authorization is enforced in API routes instead.
- **Photo Storage** — Supabase Storage integration is implemented (`src/lib/storage.ts`). Create a `vendor-photos` bucket in the Supabase dashboard. Falls back to local `public/uploads/` if not configured.

## Known Issues

- **Old photos column dropped** — During `npx prisma db push`, the legacy `photos` JSON column on the Vendor table was dropped (`--accept-data-loss`). It contained only placeholder URLs (e.g. `/placeholder-farm-1.jpg`), no real uploaded photos. The new `VendorPhoto` relation model replaced it. If any real vendor photos were uploaded before the schema migration, they are lost.
- **Photo uploads don't persist** — `PhotoManager.tsx` and `/api/vendors/[id]/photos` exist but have no cloud storage backend wired up. Photos are saved as URLs to the database but the actual files are never stored. On Vercel, `public/uploads/` doesn't persist between deploys. Won't work until Supabase Storage bucket `vendor-photos` is created (see Before Launch).
- **Dashboard analytics** — Seller dashboard stats (views, saves, clicks) are hardcoded placeholder values. Wire to real event tracking once analytics infrastructure is in place.
- **Individual vendor photos** — Category photos are shared across all vendors in the same category. Add unique per-vendor photography to make each listing feel distinct.
- **Geocoding cache** — In-memory geocoding cache resets per serverless instance. Move to Redis-backed cache for persistent caching across cold starts.
- **Mobile app shell** — PWA manifest and service worker exist but lack an install prompt, splash screen, and app-like chrome. Add for native-feeling install experience.

## Post-Testing Pre-Launch Reminders

- [ ] **i18n (Internationalization)** — Add multi-language support when targeting non-English markets
- [ ] **Geocoding rate limit** — Currently uses Nominatim (free, 1 req/sec). Route through server API with caching or switch to paid geocoder (Mapbox/Google Places) when traffic grows
- [ ] **Error monitoring** — Add Sentry or similar for structured error tracking once real users generate errors
- [ ] **SEO** — Add `sitemap.xml`, `robots.txt`, and structured data (JSON-LD) once organic traffic is being targeted
- [ ] **Admin panel** — Build a moderation dashboard for reviewing reports, managing vendor listings, and approving content
- [ ] **A/B testing** — Add experiment infrastructure when traffic is sufficient to measure statistical significance
- [ ] **Email notifications** — Send email digests for reviews, messages, and account events
