#!/bin/bash

echo "🚀 Installing production dependencies for QuoteMaster (Vite + Express architecture)..."
echo ""

# Navigate to root
cd "$(dirname "$0")/.."

echo "📦 Phase 1: Essential Upgrades"
echo "================================"

# Authentication (Clerk for Vite)
echo "→ Installing Clerk authentication..."
npm install @clerk/clerk-react --workspace=web
npm install @clerk/express --workspace=api

# Authorization (CASL)
echo "→ Installing CASL authorization..."
npm install @casl/ability @casl/react --workspace=web

# Forms & Validation (already have Zod)
echo "→ Installing React Hook Form..."
npm install react-hook-form @hookform/resolvers --workspace=web

# UI Components & Icons
echo "→ Installing UI dependencies..."
npm install class-variance-authority clsx tailwind-merge --workspace=web
npm install lucide-react --workspace=web
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-label @radix-ui/react-slot --workspace=web

# Error Tracking (Sentry)
echo "→ Installing Sentry..."
npm install @sentry/react @sentry/vite-plugin --workspace=web
npm install @sentry/node @sentry/profiling-node --workspace=api

echo ""
echo "📦 Phase 2: Production Features"
echo "================================"

# Email System
echo "→ Installing Resend + React Email..."
npm install resend react-email @react-email/components --workspace=api

# Payments (Stripe)
echo "→ Installing Stripe..."
npm install stripe --workspace=api
npm install @stripe/stripe-js @stripe/react-stripe-js --workspace=web

# Analytics (PostHog)
echo "→ Installing PostHog..."
npm install posthog-js --workspace=web

# Testing
echo "→ Installing Vitest + Playwright..."
npm install -D vitest @vitest/ui @testing-library/react @testing-library/user-event jsdom --workspace=web
npm install -D @playwright/test --workspace=web

echo ""
echo "📦 Phase 3: Optimization"
echo "================================"

# Type-safe API (tRPC)
echo "→ Installing tRPC..."
npm install @trpc/server @trpc/client @trpc/react-query --workspace=api
npm install @trpc/client @trpc/react-query --workspace=web

# File Upload
echo "→ Installing Uploadthing..."
npm install uploadthing --workspace=api
npm install @uploadthing/react uploadthing --workspace=web

# Development Tools
echo "→ Installing development tools..."
npm install -D @total-typescript/ts-reset type-fest

echo ""
echo "✅ All production dependencies installed!"
echo ""
echo "📋 Next Steps:"
echo "1. Configure Clerk authentication (apps/web + apps/api)"
echo "2. Set up CASL authorization rules"
echo "3. Configure Sentry error tracking"
echo "4. Set up shadcn/ui components"
echo "5. Configure tRPC for type-safe API"
echo ""
echo "See PRODUCTION_SETUP.md for detailed configuration steps."
