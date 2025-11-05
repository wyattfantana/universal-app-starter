# QuoteMaster - Quick Start Guide

Get up and running with QuoteMaster in 5 minutes!

## Prerequisites

- Node.js 20+ and npm 10+
- PostgreSQL 16+ (running locally or remotely)

## 1. Install Dependencies

```bash
cd /home/dwdec/Projects/quotemaster
npm install
```

This installs all dependencies for the monorepo (web app, API server, desktop app, and shared packages).

## 2. Set Up Environment Variables

### API Server (`apps/api/.env`)

```bash
# Copy the example
cp apps/api/.env.example apps/api/.env

# Edit apps/api/.env and add your values:
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=quotemaster
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password

PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

### Web App (`apps/web/.env`)

```bash
# Copy the example
cp apps/web/.env.example apps/web/.env

# Edit apps/web/.env:
VITE_API_URL=http://localhost:3001
```

**Optional services** (add when ready):
- Clerk keys for authentication
- Sentry DSN for error tracking
- PostHog key for analytics
- Resend API key for emails
- Stripe keys for payments

## 3. Create Database

```bash
# Create the database
createdb quotemaster

# Run migrations
cd packages/database
npm run migrate
```

You should see: ✅ Database migrations completed successfully!

## 4. Start Development Servers

### Option A: Run Everything (Recommended)

```bash
# From project root
npm run dev
```

This starts:
- ✅ API server on http://localhost:3001
- ✅ Web app on http://localhost:5173
- ✅ Desktop app (Tauri)

### Option B: Run Individually

```bash
# Terminal 1 - API Server
npm run dev:api

# Terminal 2 - Web App
npm run dev:web

# Terminal 3 - Desktop App (optional)
npm run dev:desktop
```

## 5. Open Your Browser

Navigate to **http://localhost:5173**

You should see the QuoteMaster dashboard!

---

## 🎯 What's Already Configured

### ✅ Core Features
- **tRPC** - Type-safe API (working out of the box!)
- **React Router** - Client-side routing
- **TanStack Query** - Data fetching and caching
- **Tailwind CSS** - Styling system
- **Shared components** - Reusable UI components

### ✅ Production-Ready Tools (Installed)
- **Clerk** - Authentication (needs API keys)
- **CASL** - Authorization
- **Sentry** - Error tracking (needs DSN)
- **PostHog** - Analytics (needs API key)
- **Resend** - Email system (needs API key)
- **Stripe** - Payments (needs API keys)
- **Vitest** - Unit testing
- **Playwright** - E2E testing

All these tools are **configured and ready** - just add your API keys when you need them!

---

## 📚 Next Steps

### Immediate (Optional)

1. **Add Authentication** (15 min)
   - Sign up at https://clerk.com
   - Add API keys to `.env` files
   - See `PRODUCTION_SETUP.md` for details

2. **Set Up Error Tracking** (5 min)
   - Sign up at https://sentry.io
   - Add DSN to `.env` files

3. **Enable Analytics** (5 min)
   - Sign up at https://posthog.com
   - Add API key to `.env` file

### Development Workflow

**Running Tests:**
```bash
# Unit tests
npm run test --workspace=web

# E2E tests
npm run test:e2e --workspace=web
```

**Building for Production:**
```bash
# Build everything
npm run build

# Or build individually
npm run build:web
npm run build:api
npm run build:desktop
```

**Mobile Development:**
```bash
# iOS
npm run mobile:ios:init    # One-time setup
npm run mobile:ios:dev     # Run in simulator

# Android
npm run mobile:android:init  # One-time setup
npm run mobile:android:dev   # Run in emulator
```

See `MOBILE_SETUP.md` for complete mobile instructions.

---

## 🔍 Project Structure

```
quotemaster/
├── apps/
│   ├── web/           # Vite + React web app (port 5173)
│   ├── api/           # Express API server (port 3001)
│   └── desktop/       # Tauri desktop/mobile app
├── packages/
│   ├── ui/            # Shared React components
│   ├── types/         # Shared TypeScript types
│   ├── database/      # PostgreSQL client + migrations
│   └── config/        # Shared configs
└── scripts/
    └── setup-production.sh  # Install production deps
```

---

## 🚀 Using tRPC (Type-Safe API)

tRPC is already configured! Here's how to use it:

```typescript
// In any component
import { trpc } from '../lib/trpc';

function MyComponent() {
  // Query - automatically typed!
  const { data, isLoading } = trpc.clients.list.useQuery();

  // Mutation
  const createClient = trpc.clients.create.useMutation();

  const handleCreate = () => {
    createClient.mutate({
      name: 'John Doe',
      email: 'john@example.com',
    });
  };

  return (
    <div>
      {data?.map(client => (
        <div key={client.id}>{client.name}</div>
      ))}
    </div>
  );
}
```

**Benefits:**
- ✅ Full TypeScript autocomplete
- ✅ Type safety from API to UI
- ✅ No manual type definitions
- ✅ Runtime validation with Zod

---

## 📖 Documentation

- **`README.md`** - Full project overview
- **`PRODUCTION_SETUP.md`** - Configure all production tools
- **`MOBILE_SETUP.md`** - iOS and Android setup
- **`PRODUCTION_BOILERPLATE_RECOMMENDATIONS.md`** - Tool recommendations

---

## 🐛 Troubleshooting

### Database Connection Error

```bash
# Make sure PostgreSQL is running
pg_isready

# If not, start it:
sudo systemctl start postgresql  # Linux
brew services start postgresql   # macOS
```

### Port Already in Use

```bash
# Kill process on port 3001 (API)
lsof -ti:3001 | xargs kill -9

# Kill process on port 5173 (Web)
lsof -ti:5173 | xargs kill -9
```

### Module Not Found Errors

```bash
# Reinstall dependencies
npm install

# Clear cache
rm -rf node_modules package-lock.json
npm install
```

---

## 🎉 You're All Set!

QuoteMaster is now running. Start building your application!

**Need Help?**
- Check `PRODUCTION_SETUP.md` for detailed configuration
- See `MOBILE_SETUP.md` for mobile development
- Review example code in `apps/web/src/pages/Clients.tsx`

Happy coding! 🚀
