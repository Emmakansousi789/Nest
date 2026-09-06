# Local Discover

A hyper-local discovery platform that helps customers find small, independent businesses and local vendors in their community. Think Airbnb for local makers, farmers, artisans, and independent retailers.

## Features

### Customer-Side (Shopper)
- **Search & Discovery** — Search any city, county, or state with server-side geocoding (Nominatim proxy with caching). Filter by category, tags, and radius.
- **Interactive Map** — Esri World Light Gray basemap with custom category-colored markers, popup business cards, and radius visualization.
- **Market Hotspots** — Pulsating radial overlays on the map showing active farmers markets and vendor density zones. Click for details.
- **Markets & Events** — Browse upcoming farmers markets, art walks, and food festivals by date with a dedicated calendar view (`/markets`).
- **Vendor Storefronts** — Dedicated profile pages with photo gallery, business story, hours, contact info, products, and reviews.
- **Pop-Up Vendor Badges** — Vendors checked into live markets show a "Currently at: [Market Name]" badge on their profile.
- **Reviews & Ratings** — Leave 1–5 star reviews with comments. Vendors can respond publicly.
- **Favorites / Wishlists** — Save businesses to revisit later. Stored in encrypted secure storage (Keychain on iOS, EncryptedSharedPreferences on Android) via `secure-storage.ts`.
- **Share** — Share vendor listings via native Web Share API (iMessage, Instagram, WhatsApp) or copy to clipboard.
- **Pull-to-Refresh** — Native-feeling pull-to-refresh on the discover feed, map, saved, and profile tabs.
- **Photo Carousel** — Swipeable full-width photo gallery on vendor profiles with touch gestures.

### Business-Side (Seller)
- **Seller Dashboard** — Switchable seller view with business listing management, photo uploads, and product catalog.
- **Business Listing Editor** — Edit name, tagline, story, category, tags, hours, location, contact info, and products.
- **Location Mode Toggle** — Switch between Permanent Storefront and Pop-Up / Market Vendor modes.
- **Market Check-In** — Check into active market events to broadcast temporary location on the map.
- **Photo Management** — Upload, reorder, and delete business photos with drag-and-drop support.
- **Review Responses** — View and respond to customer reviews.

### Platform
- **Dual Persona** — Seamless shopper ↔ seller view switching from the Profile tab.
- **Market Management** — Create and manage market events from the seller dashboard. Hotspot overlays render on the map in real-time.
- **PWA Support** — Service worker for offline caching, push notification infrastructure, and installable web app.
- **Real-Time Polling** — Reviews, messages, and favorites update automatically via tab-visibility-aware polling.
- **Analytics** — Lightweight event tracking (vendor views, searches, shares, favorites). Fully consent-gated — zero events fire until the user grants tracking permission via the first-launch consent screen.
- **Share** — Native Web Share API with clipboard fallback for viral distribution.
- **Apple App Store Compliance** — iOS PrivacyInfo.xcprivacy, ATT consent flow, Sign in with Apple, account deletion (in-app + web), content reporting, UGC moderation, Privacy Policy, Terms of Use, and demo login for App Review.
- **Google Play Compliance** — Data Safety-ready, Android backup exclusion rules, network security config, account deletion URL (/delete-account).
- **Security** — Zod validation on all API inputs, HTML escaping for XSS prevention, bcrypt password hashing (cost factor 14), rate limiting (Upstash Redis in production, in-memory fallback), CSRF token validation, secure cookie flags, and structured security event logging.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | PostgreSQL via Prisma ORM (Supabase-hosted) |
| Authentication | NextAuth v5 (Credentials provider) |
| Map | Leaflet + Esri World Light Gray tiles |
| Geocoding | Nominatim (OpenStreetMap) via server-side proxy with caching |
| Testing | Vitest |
| CI/CD | GitHub Actions |
| Storage | Supabase Storage (photo uploads) |
| Rate Limiting | Upstash Redis (production) / In-memory (dev) |
| Fonts | Newsreader (serif) + Plus Jakarta Sans (sans) |

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database (or Supabase)

### Installation

```bash
git clone https://github.com/Emmakansousi789/Nest.git
cd Nest/local-discover
npm install
```

### Environment Variables

Copy the example and fill in your values:

```bash
cp .env.example .env.local
```

**Required:**
```
DATABASE_URL=postgresql://...
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<generate with: openssl rand -base64 32>
```

**Optional (production):**
```
# Supabase Storage — enables cloud photo uploads (falls back to local filesystem)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Upstash Redis — enables distributed rate limiting (falls back to in-memory)
UPSTASH_REDIS_REST_URL=https://your-instance.upstash.io
UPSTASH_REDIS_REST_TOKEN=AXXX...
```

### Database Setup

```bash
npx prisma generate
npx prisma db push
```

### Seed Database

Push the 12 demo vendors and 25 reviews into PostgreSQL:

```bash
npm run seed
```

### Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Running Tests

```bash
npm test          # Run all tests
npm run test:watch  # Watch mode
```

### Demo Account

Demo credentials for App Review are served via the `/api/auth/demo` endpoint, which reads from server-side environment variables (`DEMO_EMAIL` / `DEMO_PASSWORD`). No credentials are hardcoded in the client bundle.

To configure demo credentials:

```bash
# In .env.local
DEMO_EMAIL=demo@localdiscover.com
DEMO_PASSWORD=YourSecureReviewPassword
```

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Main discover/search page
│   ├── layout.tsx            # Root layout with fonts & metadata
│   ├── globals.css           # Design system & custom styles
│   ├── error.tsx             # Global error boundary
│   ├── vendor/[id]/          # Vendor storefront pages + error boundary + loading skeleton
│   ├── markets/              # Market calendar/list view
│   ├── for-vendors/          # Vendor onboarding page
│   ├── about/                # About page
│   ├── privacy/              # Privacy Policy
│   ├── terms/                # Terms of Use
│   ├── accessibility/        # WCAG 2.1 AA accessibility statement
│   ├── delete-account/       # Web-accessible account deletion page
│   ├── saved/                # Saved favorites page
│   ├── api/                  # API routes
│   │   ├── auth/             # NextAuth + signup + account deletion + demo credentials
│   │   ├── vendors/          # Vendor CRUD + photo uploads + market check-in
│   │   ├── markets/          # Market event management
│   │   ├── geocode/          # Server-side geocoding proxy with caching
│   │   ├── reviews/          # Review submission
│   │   ├── messages/         # Messaging
│   │   ├── favorites/        # Favorite toggling
│   │   ├── reports/          # Content reporting
│   │   └── submit-vendor/    # Vendor self-registration
│   └── not-found.tsx         # Custom 404
├── components/
│   ├── AuthModal.tsx         # Sign in / Sign up modal (Apple Sign In + email/password)
│   ├── BusinessListingEditor.tsx # Listing editor with location mode toggle
│   ├── CategoryIllustration.tsx # Category SVG illustrations
│   ├── DirectionsButton.tsx  # Apple/Google Maps directions
│   ├── BlockUserButton.tsx   # Block/unblock users
│   ├── ConsentScreen.tsx     # First-launch data collection consent
│   ├── FavoriteButton.tsx    # Heart toggle (encrypted storage)
│   ├── FilterSheet.tsx       # Search filter bottom sheet
│   ├── MapView.tsx           # Map container with loading
│   ├── MapViewInner.tsx      # Leaflet map + market hotspot overlays
│   ├── MessageButton.tsx     # Contact vendor
│   ├── PhotoCarousel.tsx     # Swipeable photo gallery
│   ├── PhotoManager.tsx      # Photo upload/reorder/delete
│   ├── Providers.tsx         # SessionProvider + consent gate + analytics init
│   ├── MarketCreationForm.tsx # Create market events from seller dashboard
│   ├── PullToRefresh.tsx     # Pull-to-refresh gesture
│   ├── ReviewForm.tsx        # Review submission form
│   ├── ReviewList.tsx        # Reviews with reporting
│   ├── SearchOverlay.tsx     # Full-screen search
│   ├── SellerDashboard.tsx   # Seller view wrapper
│   ├── ServiceWorkerRegister.tsx # PWA service worker registration
│   ├── ShareButton.tsx       # Share vendor via Web Share API / clipboard
│   ├── SkeletonCard.tsx      # Loading skeleton
│   ├── StarRating.tsx        # Star rating display/input
│   ├── SwipeBack.tsx         # Swipe-to-go-back gesture
│   ├── VendorCard.tsx        # Business card for grid/list
│   ├── VendorProfileClient.tsx # Vendor storefront client + market badge
│   ├── WriteReviewButton.tsx # Review trigger button
│   ├── icons.tsx             # Shared SVG icons
│   ├── MarketDetailClient.tsx # Market detail client component
│   ├── PhotoManager.tsx      # Photo upload/reorder/delete
│   ├── ServiceWorkerRegister.tsx # PWA service worker registration
│   ├── ShareButton.tsx       # Share vendor via Web Share API / clipboard
│   └── tabs/
│       ├── MapTab.tsx        # Map tab with geocoding
│       ├── SavedTab.tsx      # Saved/favorited businesses
│       └── ProfileTab.tsx    # Profile + settings + auth
├── contexts/
│   └── AuthContext.tsx        # Auth state (real API only)
├── __tests__/
│   ├── api.test.ts           # API & data integrity tests
│   └── store.test.ts         # Vitest smoke tests
├── data/
│   ├── vendors.ts            # Seed vendor data
│   ├── reviews.ts            # Seed review data
│   ├── markets.ts            # Seed market data (Capacitor offline)
│   └── store.ts              # Bridge data layer (Prisma + localStorage fallback)
├── lib/
│   ├── auth.ts               # NextAuth config + credentials provider
│   ├── distance.ts           # Haversine distance calc
│   ├── analytics.ts          # Consent-gated event tracking
│   ├── favorites.ts          # Encrypted favorites (secure-storage)
│   ├── geocode.ts            # Nominatim geocoding
│   ├── moderation.ts         # UGC content filtering (profanity, spam)
│   ├── notifications.ts      # Push notification registration
│   ├── realtime.ts           # Tab-visibility-aware polling hook
│   ├── share.ts              # Web Share API + clipboard fallback
│   ├── storage.ts            # Supabase Storage for photo uploads
│   ├── secure-storage.ts     # Keychain/EncryptedSharedPrefs abstraction
│   ├── prisma.ts             # Prisma client singleton
│   ├── rate-limit.ts         # Upstash Redis / in-memory rate limiting
│   ├── security-logger.ts    # Security event logging
│   └── validations.ts        # Zod schemas for API inputs
├── public/
│   ├── manifest.json         # PWA manifest
│   ├── sw.js                 # Service worker (offline caching + push)
│   ├── offline.html          # Offline fallback page
│   ├── icon-192.png          # PWA icon
│   ├── icon-512.png          # PWA icon
│   └── opengraph-image.png   # Social sharing preview
├── .github/
│   └── workflows/
│       └── ci.yml            # GitHub Actions CI pipeline
├── prisma/
│   ├── schema.prisma         # Database schema (User, Vendor, Market, MarketCheckIn, Review, Message, Favorite, Report)
│   └── seed.ts               # Database seed script (vendors + reviews)
└── types/
    └── index.ts              # Shared TypeScript types
```

## Design System

| Token | Value | Usage |
|-------|-------|-------|
| Linen | `#FBF9F5` | Page background |
| Ecru | `#F3F0EA` | Card backgrounds, secondary surfaces |
| Parchment | `#E8E3DA` | Borders, dividers |
| Charcoal | `#1C1917` | Primary text |
| Stone | `#78716C` | Secondary text |
| Clay | `#A8A29E` | Tertiary text, icons |
| Terracotta | `#C84B31` | Primary accent, CTAs |
| Sage | `#4A6B5B` | Success states, farmers category |
| Rust | `#9A3412` | Artisan category |
| Cream | `#FEFDFB` | Popup backgrounds |

**Fonts:** Newsreader (serif headings) + Plus Jakarta Sans (sans-serif body)

## API Routes

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/signup` | Create account |
| POST | `/api/auth/callback/credentials` | Sign in |
| DELETE | `/api/auth/account` | Delete account + cascade data |
| GET | `/api/geocode` | Server-side geocoding proxy (cached) |
| GET/POST | `/api/vendors` | List / create vendors |
| PATCH | `/api/vendors/[id]` | Update vendor |
| POST | `/api/vendors/[id]/photos` | Upload photo |
| PATCH | `/api/vendors/[id]/photos` | Reorder photos |
| DELETE | `/api/vendors/[id]/photos/[photoId]` | Delete photo |
| POST | `/api/vendors/[id]/market-checkin` | Check in/out of market |
| DELETE | `/api/vendors/[id]/market-checkin` | Check out of market |
| GET/POST | `/api/markets` | List / create market events |
| POST | `/api/reviews` | Submit review |
| POST | `/api/messages` | Send message |
| POST | `/api/favorites` | Toggle favorite |
| POST | `/api/reports` | Report content |
| POST | `/api/submit-vendor` | Vendor self-registration |

## Code Quality

- **TypeScript Strict Mode** — `strict: true` with `noUnusedLocals` and `noUnusedParameters` enabled
- **Dead Code Elimination** — Zero unused imports, orphaned components, or dead functions
- **Zero `any` Types** — Only 1 acceptable `any` (Leaflet icon prototype workaround)
- **Memoized Components** — `VendorCard` wrapped in `React.memo` to prevent unnecessary recomputation on scroll
- **Test Suite** — 24 Vitest tests covering utility functions, data integrity, filter edge cases, search across fields, and tag OR logic
- **CI/CD** — GitHub Actions runs lint, typecheck, build, and tests on every push/PR
- **Clean Build** — `tsc --noEmit` and `npm run build` pass with zero errors or warnings
- **SEO** — Dynamic `generateMetadata` on vendor profile pages with Open Graph tags
- **Error Boundaries** — Route-level error boundaries on `/vendor/[id]`, `/saved`, `/markets`, and root
- **Accessibility** — Skip-to-content link, ARIA labels on interactive elements, `focus-ring` keyboard navigation styles

## Security

- **Input Validation** — Zod schemas on all API payloads with HTML entity sanitization transforms
- **XSS Prevention** — HTML entity escaping in Leaflet popups, map markers, and all user-supplied text rendered as HTML
- **IDOR Protection** — Server-side ownership checks on all vendor/review/message mutations
- **Rate Limiting** — Upstash Redis in production (distributed, survives cold starts) with in-memory fallback in dev. Limits: auth (5/15min), API (60/min), submissions (3/hr), creation (10/min)
- **Request Body Limits** — 1MB max enforced via middleware on all POST/PUT/PATCH routes
- **Security Headers** — HSTS, X-Frame-Options: DENY, X-Content-Type-Options: nosniff, Referrer-Policy, X-XSS-Protection
- **Session Security** — httpOnly, secure (production), sameSite: lax cookies via NextAuth with CSRF token validation on login
- **Password Policy** — Minimum 8 characters, requires uppercase, lowercase, and digit
- **Anti-Enumeration** — Generic auth error messages ("Invalid email or password")
- **CSRF Protection** — Real CSRF token fetched from NextAuth before login submission; origin/referrer validation on custom API routes
- **Atomic Transactions** — Market check-in/out wrapped in `prisma.$transaction()` to prevent race conditions
- **Security Event Logging** — Auth failures, signups, rate limit hits, CSRF blocks, IDOR attempts logged with IP and path
- **Photo Upload Sanitization** — Alt text and captions sanitized (HTML entities escaped, length-capped) before storage
- **Content Moderation** — Profanity/harassment filtering on reviews and messages via `moderation.ts`. Contact info blocked in reviews.
- **User Blocking** — Block/unblock users via encrypted storage. Blocked users' content is hidden.
- **Production Safety** — No debug features in codebase; Prisma errors logged without leaking connection strings
- **Account Lockout** — Not yet implemented; revisit when auth is fully enabled for production

## Deployment

### Pre-Launch Checklist

Before deploying to production, complete these steps:

1. **Create Supabase Storage bucket** — In the Supabase dashboard, create a storage bucket named `vendor-photos` (public read access). Set the env vars listed above.
2. **Create Upstash Redis instance** — Free tier at [upstash.com](https://upstash.com). Set the env vars listed above.
3. **Seed the database** — Run `npm run seed` against your production PostgreSQL to populate the 12 demo vendors and 25 reviews.
4. **Configure demo credentials** — Set `DEMO_EMAIL` and `DEMO_PASSWORD` in `.env.local` (served via `/api/auth/demo` endpoint).
5. **Generate NEXTAUTH_SECRET** — `openssl rand -base64 32`
6. **Set NEXTAUTH_URL** — Your production domain (e.g., `https://localdiscover.app`)

### Post-Deployment Verification

- [ ] Vendor cards show real category photos (not emoji placeholders)
- [ ] Photo upload succeeds and persists after page reload
- [ ] Rate limiting returns 429 after exceeding limits
- [ ] Sign up → login → session persists → logout cycle works end-to-end
- [ ] Market creation form creates a market that appears on the map
- [ ] Share button copies link or opens native share sheet
- [ ] PWA installs on mobile (add to home screen)
- [ ] Offline page loads when network is disconnected

## Supabase Configuration (Outside App Code)

- **Row-Level Security (RLS)** — Configure in Supabase dashboard. Not in app code since Prisma connects directly to PostgreSQL, bypassing Supabase GoTrue `auth.uid()`. Application-level authorization is enforced in API routes instead.
- **Account Lockout** — Not yet implemented in app code. When auth is fully enabled for production, add lockout after N failed attempts.
- **Photo Storage** — Supabase Storage integration is implemented (`src/lib/storage.ts`). Create a `vendor-photos` bucket in the Supabase dashboard. Falls back to local `public/uploads/` if not configured.

## Apple App Store & Google Play Compliance

- ✅ iOS PrivacyInfo.xcprivacy (data types, required-reason APIs, tracking domains)
- ✅ ATT consent flow — gating all analytics before user permission
- ✅ Sign in with Apple (equally prominent alongside email/password)
- ✅ Account deletion — in-app flow + web page at `/delete-account`
- ✅ Content reporting (reviews, vendors) via `/api/reports`
- ✅ UGC moderation — profanity/harassment filtering on reviews and messages
- ✅ User blocking via encrypted storage
- ✅ Privacy Policy page (`/privacy`)
- ✅ Terms of Use page (`/terms`)
- ✅ Accessibility statement page (`/accessibility`) — WCAG 2.1 AA
- ✅ Reduced motion support (`prefers-reduced-motion`)
- ✅ Demo login for App Review (credentials via server-side env vars)
- ✅ Contact developer in Settings
- ✅ Android backup exclusion rules (dataExtractionRules + fullBackupContent)
- ✅ Android network security config (cleartext disabled)
- ✅ Encrypted storage for user-linked data (Keychain / EncryptedSharedPreferences)
- ✅ Consent screen before any data collection

### Still Required in App Store Connect / Play Console (Not Code)

These items cannot be completed from the codebase — they require manual action in the store dashboards:

1. **DSA Trader Status** — Declare trader/developer identity in App Store Connect for EU distribution (required since Feb 2025)
2. **Privacy Nutrition Labels** — Fill out App Privacy section in App Store Connect: Data Linked to User (name, email, location), Usage Data (analytics), Contact Info
3. **App Store Review Notes** — Document: demo account flow (via `/api/auth/demo`), app purpose (local business directory), no IAP, geocoding via Nominatim, shopper/seller persona toggle
4. **Data Safety Form** — Complete Google Play Data Safety declaration matching runtime data collection
5. **Account Deletion URL** — Declare `/delete-account` in Play Console Data Safety settings
6. **Age Rating** — Complete IARC content rating questionnaire in both stores
7. **App Icon** — Replace placeholder icon with proper 1024×1024 (iOS) / 512×512 (Android) app icon

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run seed` | Seed database with demo vendors + reviews |
| `npm test` | Run test suite |
| `npm run test:watch` | Run tests in watch mode |
| `npm run build:app` | Build static export for Capacitor native app |
| `npm run cap:sync` | Sync web assets to iOS + Android projects |
| `npm run cap:ios` | Open iOS project in Xcode |
| `npm run cap:android` | Open Android project in Android Studio |

## Post-Testing Pre-Launch Reminders

The following items should be completed after testing but before public launch:

- [ ] **i18n (Internationalization)** — Add multi-language support when targeting non-English markets
- [ ] **Geocoding rate limit** — Currently uses Nominatim (free, 1 req/sec). Route through server API with caching or switch to paid geocoder (Mapbox/Google Places) when traffic grows
- [ ] **Error monitoring** — Add Sentry or similar for structured error tracking once real users generate errors
- [ ] **SEO** — Add `sitemap.xml`, `robots.txt`, and structured data (JSON-LD) once organic traffic is being targeted
- [ ] **Admin panel** — Build a moderation dashboard for reviewing reports, managing vendor listings, and approving content
- [ ] **A/B testing** — Add experiment infrastructure when traffic is sufficient to measure statistical significance
- [ ] **Email notifications** — Send email digests for reviews, messages, and account events
- [ ] **Geocoding client-side rate limit** — Server-side proxy handles Nominatim limits; add client-side debounce for heavy search usage
- [ ] **Individual vendor photos** — Category photos are shared across all vendors in the same category. Add unique per-vendor photography to make each listing feel distinct
- [ ] **Dashboard analytics** — Seller dashboard stats (views, saves, clicks) are hardcoded. Wire to real event tracking once analytics infrastructure is in place
- [ ] **Geocoding cache** — In-memory geocoding cache resets per serverless instance. Move to Redis-backed cache for persistent caching across cold starts
- [ ] **Mobile app shell** — PWA manifest and service worker exist but lack an install prompt, splash screen, and app-like chrome. Add for native-feeling install experience

## License

Private — All rights reserved.
