#!/bin/bash
# Build static web assets for Capacitor native builds
# Temporarily moves API routes and middleware out of the way since they
# require a server and can't be statically exported.

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
cd "$ROOT_DIR"

API_DIR="src/app/api"
MIDDLEWARE_FILE="src/middleware.ts"
MARKET_DETAIL_DIR="src/app/markets/[id]"
API_BACKUP=".api-backup"
MIDDLEWARE_BACKUP=".middleware-backup"
MARKET_DETAIL_BACKUP=".market-detail-backup"

cleanup() {
  if [ -d "$API_BACKUP" ]; then
    rm -rf "$API_DIR"
    mv "$API_BACKUP" "$API_DIR"
    echo "✓ Restored API routes"
  fi
  if [ -f "$MIDDLEWARE_BACKUP" ]; then
    rm -f "$MIDDLEWARE_FILE"
    mv "$MIDDLEWARE_BACKUP" "$MIDDLEWARE_FILE"
    echo "✓ Restored middleware"
  fi
  if [ -d "$MARKET_DETAIL_BACKUP" ]; then
    rm -rf "$MARKET_DETAIL_DIR"
    mv "$MARKET_DETAIL_BACKUP" "$MARKET_DETAIL_DIR"
    echo "✓ Restored market detail page"
  fi
}
trap cleanup EXIT

echo "📦 Building static assets for Capacitor..."

# Move server-only files out of the way
if [ -d "$API_DIR" ]; then
  mv "$API_DIR" "$API_BACKUP"
  echo "  → Temporarily disabled API routes"
fi
if [ -f "$MIDDLEWARE_FILE" ]; then
  mv "$MIDDLEWARE_FILE" "$MIDDLEWARE_BACKUP"
  echo "  → Temporarily disabled middleware"
fi
if [ -d "$MARKET_DETAIL_DIR" ]; then
  mv "$MARKET_DETAIL_DIR" "$MARKET_DETAIL_BACKUP"
  echo "  → Temporarily excluded /markets/[id] (needs DB at build time)"
fi

# Run the static export build
EXPORT_STATIC=true npx next build

echo ""
echo "✅ Static assets built to ./out/"
echo "   Syncing with native projects..."
npx cap sync
echo ""
echo "✅ Done! Open native projects with:"
echo "   iOS:     npx cap open ios"
echo "   Android: npx cap open android"
