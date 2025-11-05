# Universal App Starter Template

A production-ready monorepo template for building universal applications with **Web**, **Desktop**, **iOS**, and **Android** from a single codebase.

## 🚀 Tech Stack

### Frontend
- **Vite** + React 19 + TypeScript
- **React Router** - Client-side routing
- **TanStack Query** - Data fetching
- **Tailwind CSS** - Styling
- **Tauri v2** - Desktop & Mobile apps

### Backend
- **Express.js** - REST API server
- **tRPC** - Type-safe API (fully configured!)
- **PostgreSQL** - Primary database
- **pg-boss** - Background job queue (no Redis needed!)

### Production Tools (All Pre-configured!)
- ✅ **Clerk** - Authentication
- ✅ **CASL** - Authorization
- ✅ **Sentry** - Error tracking
- ✅ **PostHog** - Analytics
- ✅ **Resend + React Email** - Email system
- ✅ **Stripe** - Payments
- ✅ **Vitest** - Unit testing
- ✅ **Playwright** - E2E testing

### DevOps
- **Turbo Repo** - Monorepo build system
- **npm workspaces** - Package management
- **TypeScript** - End-to-end type safety

## 📦 What's Included

```
starter-template/
├── apps/
│   ├── web/              # Vite + React web app
│   ├── api/              # Express API with tRPC
│   └── desktop/          # Tauri (Desktop + Mobile)
├── packages/
│   ├── ui/               # Shared React components
│   ├── types/            # Shared TypeScript types
│   ├── database/         # PostgreSQL + pg-boss
│   └── config/           # Shared configs
└── scripts/
    └── setup-production.sh  # Install all tools
```

## ⚡ Quick Start

### 1. Use This Template

Click "Use this template" on GitHub or:

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git my-app
cd my-app
npm install
```

### 2. Set Up Environment

```bash
# Copy environment files
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env

# Edit with your database credentials
```

### 3. Create Database

```bash
createdb myapp
cd packages/database
npm run migrate
```

### 4. Start Development

```bash
npm run dev
```

Open http://localhost:5173 - Done! 🎉

## 🎯 What Works Out of the Box

### ✅ Ready to Use (No Setup)
- **tRPC** - Type-safe API with full autocomplete
- **Tailwind CSS** - Utility-first styling
- **React Router** - Client-side routing
- **TanStack Query** - Data fetching
- **Vitest** - Unit testing
- **Playwright** - E2E testing

### ⏳ Ready to Activate (Add API Keys)
- **Clerk** - Authentication (15 min)
- **CASL** - Authorization (works with Clerk)
- **Sentry** - Error tracking (5 min)
- **PostHog** - Analytics (10 min)
- **Resend** - Email system (10 min)
- **Stripe** - Payments (as needed)

## 📱 Platform Support

- ✅ **Web** - Modern browsers via Vite
- ✅ **Desktop** - Windows, macOS, Linux via Tauri
- ✅ **iOS** - iPhone & iPad via Tauri Mobile
- ✅ **Android** - Phone & Tablet via Tauri Mobile

## 🏗️ Architecture Highlights

### Type-Safe API with tRPC

No more manual type definitions! tRPC provides full type safety from API to UI:

```typescript
// API (apps/api/src/trpc/routers/users.ts)
export const usersRouter = router({
  list: publicProcedure.query(async () => {
    return await getUsers();
  }),
});

// Web (apps/web/src/pages/Users.tsx)
const { data } = trpc.users.list.useQuery();
// ↑ Fully typed, with autocomplete!
```

### Shared Components

UI components work across web, desktop, and mobile:

```typescript
// packages/ui/button.tsx
export function Button({ children, ...props }) {
  return <button className="btn" {...props}>{children}</button>;
}

// Use anywhere!
import { Button } from '@repo/ui';
```

### Background Jobs (No Redis!)

pg-boss uses PostgreSQL for job queues:

```typescript
await boss.send('send-email', {
  to: 'user@example.com',
  subject: 'Welcome!',
});
```

## 📚 Documentation

- **`QUICKSTART.md`** - 5-minute setup guide
- **`PRODUCTION_SETUP.md`** - Configure all production tools
- **`MOBILE_SETUP.md`** - iOS and Android setup
- **`README.md`** - Full project overview

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage
npm run test:coverage
```

## 📦 Building for Production

```bash
# Build everything
npm run build

# Or build individually
npm run build:web      # Web app
npm run build:api      # API server
npm run build:desktop  # Desktop app
```

## 📱 Mobile Development

```bash
# iOS
npm run mobile:ios:init    # One-time setup
npm run mobile:ios:dev     # Run in simulator

# Android
npm run mobile:android:init  # One-time setup
npm run mobile:android:dev   # Run in emulator
```

See `MOBILE_SETUP.md` for complete instructions.

## 🔐 Environment Variables

### Required (Basic Functionality)
```bash
# Database
POSTGRES_HOST=localhost
POSTGRES_DB=myapp
POSTGRES_USER=postgres
POSTGRES_PASSWORD=***

# API URL
VITE_API_URL=http://localhost:3001
```

### Optional (Production Features)
```bash
# Authentication
CLERK_SECRET_KEY=sk_***
VITE_CLERK_PUBLISHABLE_KEY=pk_***

# Error Tracking
SENTRY_DSN=https://***
VITE_SENTRY_DSN=https://***

# Analytics
VITE_POSTHOG_KEY=phc_***

# Email
RESEND_API_KEY=re_***

# Payments
STRIPE_SECRET_KEY=sk_***
VITE_STRIPE_PUBLISHABLE_KEY=pk_***
```

## 🎨 Customization

### 1. Rename Your App

Update `name` in all `package.json` files:
- `apps/web/package.json`
- `apps/api/package.json`
- `apps/desktop/package.json`
- `packages/*/package.json`

### 2. Update Branding

- **Logo**: Replace `apps/web/public/logo.svg`
- **Colors**: Edit `apps/web/tailwind.config.js`
- **Fonts**: Edit `apps/web/src/index.css`

### 3. Add Your Schema

- Edit `packages/database/schema.sql`
- Run `npm run migrate` in `packages/database`

## 🔧 Troubleshooting

### Port Already in Use
```bash
# Kill process on port
lsof -ti:3001 | xargs kill -9  # API
lsof -ti:5173 | xargs kill -9  # Web
```

### Database Connection Error
```bash
# Check PostgreSQL is running
pg_isready

# Start if needed
sudo systemctl start postgresql  # Linux
brew services start postgresql   # macOS
```

### Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## 🤝 Contributing

This is a template - fork it and make it your own!

## 📄 License

MIT License - Use this template for any project (personal or commercial).

## 🌟 Credits

Built with:
- [Vite](https://vitejs.dev)
- [React](https://react.dev)
- [Tauri](https://tauri.app)
- [tRPC](https://trpc.io)
- [Tailwind CSS](https://tailwindcss.com)
- [Clerk](https://clerk.com)
- [Sentry](https://sentry.io)
- [PostHog](https://posthog.com)
- [Resend](https://resend.com)

---

## 🚀 Ready to Build?

```bash
npm install
npm run dev
```

That's it! Start building your universal app! 🎉
