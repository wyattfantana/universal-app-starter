# Production Setup Guide

This guide covers the configuration of production-ready tools installed in QuoteMaster.

## 📦 What's Been Installed

### ✅ Phase 1: Essential Upgrades (COMPLETED)

1. **tRPC** - Type-safe API (✅ CONFIGURED)
2. **shadcn/ui utilities** - UI component helpers (✅ CONFIGURED)
3. **React Hook Form** - Form management
4. **Clerk** - Authentication (requires configuration)
5. **CASL** - Authorization (requires configuration)
6. **Sentry** - Error tracking (requires configuration)

### 📦 Phase 2: Production Features (INSTALLED)

7. **Resend + React Email** - Email system
8. **Stripe** - Payments
9. **PostHog** - Analytics
10. **Vitest + Playwright** - Testing

### 🚀 Phase 3: Optimization (INSTALLED)

11. **Uploadthing** - File uploads
12. **Development tools** - type-fest, ts-reset

---

## ✅ 1. tRPC - Type-Safe API (CONFIGURED)

tRPC is fully configured and ready to use!

### What's Been Set Up

**API Server (`apps/api/`):**
- ✅ tRPC router at `/trpc` endpoint
- ✅ Context creation (`src/trpc/context.ts`)
- ✅ Clients router with full CRUD (`src/trpc/routers/clients.ts`)
- ✅ Express middleware integration

**Web App (`apps/web/`):**
- ✅ tRPC client configuration (`src/lib/trpc.ts`)
- ✅ React Query integration in `App.tsx`
- ✅ Example usage in `Clients.tsx`

### Usage Example

```typescript
// In any component
import { trpc } from '../lib/trpc';

function MyComponent() {
  // Query - GET data
  const { data, isLoading } = trpc.clients.list.useQuery();

  // Mutation - POST/PUT/DELETE data
  const createClient = trpc.clients.create.useMutation({
    onSuccess: () => {
      // Invalidate and refetch
      trpc.useContext().clients.list.invalidate();
    }
  });

  const handleCreate = () => {
    createClient.mutate({
      name: 'John Doe',
      email: 'john@example.com',
    });
  };

  return <div>...</div>;
}
```

### Adding New Endpoints

1. Create a new router in `apps/api/src/trpc/routers/`:

```typescript
// apps/api/src/trpc/routers/products.ts
import { z } from 'zod';
import { router, publicProcedure } from '../init';
import { getAllProducts } from '@repo/database/schema';

export const productsRouter = router({
  list: publicProcedure.query(async () => {
    return await getAllProducts();
  }),
});
```

2. Add to app router in `apps/api/src/trpc/router.ts`:

```typescript
import { productsRouter } from './routers/products';

export const appRouter = router({
  clients: clientsRouter,
  products: productsRouter, // ← Add here
});
```

3. Use in web app (autocomplete works!):

```typescript
const { data } = trpc.products.list.useQuery();
```

**Benefits:**
- ✅ Full TypeScript autocomplete
- ✅ Type safety from API to UI
- ✅ No need to write API types manually
- ✅ Runtime validation with Zod

---

## 2. Clerk - Authentication

Clerk provides production-ready authentication with minimal setup.

### Environment Variables

**`apps/api/.env`:**
```bash
CLERK_SECRET_KEY=sk_test_...
CLERK_PUBLISHABLE_KEY=pk_test_...
```

**`apps/web/.env`:**
```bash
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
```

### API Setup (`apps/api/`)

```typescript
// src/index.ts
import { clerkMiddleware } from '@clerk/express';

app.use(clerkMiddleware());

// Protected tRPC context
// src/trpc/context.ts
import { getAuth } from '@clerk/express';

export const createContext = ({ req, res }: { req: Request; res: Response }) => {
  const auth = getAuth(req);
  return {
    req,
    res,
    userId: auth.userId,
  };
};

// src/trpc/init.ts - Add protected procedure
const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.userId) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({
    ctx: {
      userId: ctx.userId,
    },
  });
});

export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);
```

### Web Setup (`apps/web/`)

```typescript
// src/main.tsx
import { ClerkProvider } from '@clerk/clerk-react';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
    <App />
  </ClerkProvider>
);

// src/App.tsx - Add protected routes
import { SignIn, SignUp, UserButton, useAuth } from '@clerk/clerk-react';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) return <div>Loading...</div>;
  if (!isSignedIn) return <Navigate to="/sign-in" />;

  return <>{children}</>;
}

// In your routes
<Route path="/sign-in" element={<SignIn routing="path" path="/sign-in" />} />
<Route path="/sign-up" element={<SignUp routing="path" path="/sign-up" />} />
<Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
  {/* Protected routes */}
</Route>
```

**Docs:** https://clerk.com/docs

---

## 3. CASL - Authorization

CASL provides flexible, role-based access control.

### Define Abilities

```typescript
// apps/web/src/lib/ability.ts
import { AbilityBuilder, Ability } from '@casl/ability';

type Actions = 'create' | 'read' | 'update' | 'delete';
type Subjects = 'Client' | 'Estimate' | 'Invoice' | 'all';

export type AppAbility = Ability<[Actions, Subjects]>;

export function defineAbilitiesFor(user: { role: string }) {
  const { can, cannot, build } = new AbilityBuilder<AppAbility>(Ability);

  if (user.role === 'admin') {
    can('manage', 'all'); // Can do everything
  } else if (user.role === 'user') {
    can('read', 'all');
    can('create', 'Client');
    can('update', 'Client');
    cannot('delete', 'Client'); // But cannot delete
  } else {
    can('read', 'all'); // Viewer role
  }

  return build();
}
```

### Use in Components

```typescript
import { useAbility } from '@casl/react';
import { AbilityContext } from '../lib/ability-context';

function ClientActions() {
  const ability = useAbility(AbilityContext);

  return (
    <div>
      {ability.can('create', 'Client') && (
        <Button>+ Add Client</Button>
      )}
      {ability.can('delete', 'Client') && (
        <Button variant="danger">Delete</Button>
      )}
    </div>
  );
}
```

**Docs:** https://casl.js.org/

---

## 4. Sentry - Error Tracking

### API Setup (`apps/api/`)

```typescript
// src/index.ts
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});

// Add error handler
app.use(Sentry.Handlers.errorHandler());
```

### Web Setup (`apps/web/`)

```typescript
// src/main.tsx
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});
```

**Get DSN:** https://sentry.io

---

## 5. Resend + React Email

Send beautiful emails with React components.

### Setup

```typescript
// apps/api/src/lib/email.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendInvoiceEmail(to: string, invoice: Invoice) {
  const { data, error } = await resend.emails.send({
    from: 'invoices@yourdomain.com',
    to,
    subject: `Invoice #${invoice.id}`,
    react: InvoiceEmail({ invoice }),
  });

  if (error) throw error;
  return data;
}
```

### Create Email Template

```typescript
// apps/api/src/emails/invoice.tsx
import { Html, Button, Text } from '@react-email/components';

export function InvoiceEmail({ invoice }: { invoice: Invoice }) {
  return (
    <Html>
      <Text>Your invoice is ready!</Text>
      <Button href={`https://app.example.com/invoices/${invoice.id}`}>
        View Invoice
      </Button>
    </Html>
  );
}
```

**Docs:** https://resend.com/docs

---

## 6. Stripe - Payments

### Setup

```typescript
// apps/api/src/lib/stripe.ts
import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

// Create payment intent
export async function createPaymentIntent(amount: number) {
  return await stripe.paymentIntents.create({
    amount: amount * 100, // Convert to cents
    currency: 'usd',
  });
}
```

### Frontend

```typescript
// apps/web/src/components/CheckoutForm.tsx
import { Elements, PaymentElement } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export function CheckoutForm() {
  return (
    <Elements stripe={stripePromise}>
      <PaymentElement />
      <button>Pay</button>
    </Elements>
  );
}
```

**Docs:** https://docs.stripe.com

---

## 7. PostHog - Analytics

### Setup

```typescript
// apps/web/src/lib/analytics.ts
import posthog from 'posthog-js';

posthog.init(import.meta.env.VITE_POSTHOG_KEY, {
  api_host: 'https://app.posthog.com',
});

// Track events
posthog.capture('client_created', {
  client_id: client.id,
  client_name: client.name,
});

// Identify users
posthog.identify(userId, {
  email: user.email,
  name: user.name,
});
```

**Get API Key:** https://posthog.com

---

## 8. Testing

### Vitest (Unit Tests)

```typescript
// apps/web/src/lib/utils.test.ts
import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('cn utility', () => {
  it('merges class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });
});
```

Run tests: `npm run test`

### Playwright (E2E Tests)

```typescript
// apps/web/tests/clients.spec.ts
import { test, expect } from '@playwright/test';

test('create client', async ({ page }) => {
  await page.goto('http://localhost:5173/clients');
  await page.click('text=+ Add Client');
  await page.fill('input[name="name"]', 'John Doe');
  await page.click('button[type="submit"]');
  await expect(page.locator('text=John Doe')).toBeVisible();
});
```

Run E2E tests: `npx playwright test`

---

## 9. Uploadthing - File Uploads

For product images, company logos, invoice attachments.

### API Setup

```typescript
// apps/api/src/lib/uploadthing.ts
import { createUploadthing } from 'uploadthing/express';

const f = createUploadthing();

export const uploadRouter = {
  imageUploader: f({ image: { maxFileSize: '4MB' } })
    .onUploadComplete(({ file }) => {
      console.log('Upload complete:', file.url);
    }),
};
```

**Docs:** https://docs.uploadthing.com

---

## Environment Variables Summary

### `apps/api/.env`
```bash
# Database
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=quotemaster
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password

# Authentication
CLERK_SECRET_KEY=sk_test_...
CLERK_PUBLISHABLE_KEY=pk_test_...

# Error Tracking
SENTRY_DSN=https://...@sentry.io/...

# Email
RESEND_API_KEY=re_...

# Payments
STRIPE_SECRET_KEY=sk_test_...

# Analytics
POSTHOG_API_KEY=phc_...

# File Upload
UPLOADTHING_SECRET=sk_live_...
UPLOADTHING_APP_ID=...
```

### `apps/web/.env`
```bash
# API
VITE_API_URL=http://localhost:3001

# Authentication
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...

# Error Tracking
VITE_SENTRY_DSN=https://...@sentry.io/...

# Payments
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Analytics
VITE_POSTHOG_KEY=phc_...
```

---

## Next Steps

1. ✅ tRPC is configured - start using it!
2. Sign up for Clerk and add authentication
3. Configure CASL for authorization rules
4. Set up Sentry for error tracking
5. Configure email with Resend
6. Add Stripe for payments (if needed)
7. Set up PostHog analytics
8. Write tests with Vitest and Playwright

---

## Resources

- [tRPC Docs](https://trpc.io)
- [Clerk Docs](https://clerk.com/docs)
- [CASL Docs](https://casl.js.org)
- [Sentry Docs](https://docs.sentry.io)
- [Resend Docs](https://resend.com/docs)
- [Stripe Docs](https://docs.stripe.com)
- [PostHog Docs](https://posthog.com/docs)
- [Vitest Docs](https://vitest.dev)
- [Playwright Docs](https://playwright.dev)
