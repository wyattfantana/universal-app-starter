# QuoteMaster

Professional estimate and invoice management system with universal app support (web + desktop + mobile).

**Architecture:** Express REST API + TypeORM + React + Tauri

---

## 🏗️ Architecture

QuoteMaster is built as a **Turbo Repo monorepo** with maximum code reuse:

```
quotemaster/
├── apps/
│   ├── web/              # Vite + React web application
│   ├── api/              # Express.js REST API with TypeORM
│   └── desktop/          # Tauri v2 (Windows, macOS, Linux, iOS, Android)
├── packages/
│   ├── ui/               # Shared React components
│   ├── types/            # Shared TypeScript types
│   └── config/           # Shared configs (TypeScript, Tailwind)
└── turbo.json            # Monorepo build pipeline
```

### Platform Support

- ✅ **Web** - Browser-based application (Vite + React)
- ✅ **Desktop** - Native Windows, macOS, Linux (Tauri)
- ✅ **Mobile** - iOS and Android (Tauri Mobile)
- ✅ **API** - RESTful API with full authentication

---

## ✨ Features

### Core Functionality
- **Client Management** - Track clients with full contact details
- **Estimates** - Create professional estimates with line items
- **Invoices** - Generate invoices and monitor payments
- **Product Catalog** - Maintain reusable products/services
- **Multi-tenancy** - Complete user isolation (your data stays yours)

### Security & Authentication
- **Clerk Authentication** - Secure user management
- **CASL Authorization** - Role-based permissions (admin, user, viewer)
- **Multi-tenancy** - Every record belongs to a specific user
- **Input Validation** - Zod schemas on all endpoints
- **SQL Injection Protection** - TypeORM parameterized queries

### Production Ready
- **Sentry** - Error tracking and session replay
- **PostHog** - Privacy-focused analytics
- **Resend + React Email** - Transactional email system
- **Stripe** - Payment processing
- **Database Migrations** - Version-controlled schema changes
- **Graceful Shutdown** - Clean database connection handling

---

## 🛠️ Tech Stack

### Frontend
- **Web**: Vite + React 19 + TypeScript
- **Routing**: React Router v7
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form + Zod validation
- **State**: TanStack Query for server state
- **Desktop/Mobile**: Tauri v2

### Backend
- **API**: Express.js + TypeScript
- **ORM**: TypeORM
- **Database**: PostgreSQL 16+
- **Validation**: Zod
- **Authentication**: Clerk
- **Authorization**: CASL

### Security
- **Helmet** - Security headers
- **CORS** - Multi-origin support (web, desktop, mobile)
- **CSRF Protection** - Built into Clerk
- **Error Handling** - Production-safe (no stack traces leaked)

### DevOps
- **Monorepo**: Turbo Repo
- **Package Manager**: npm workspaces
- **Database Migrations**: TypeORM CLI
- **Testing**: Vitest (unit) + Playwright (E2E)
- **Hosting**: Hetzner VPS (Germany - GDPR compliant)

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 20+ and npm 10+
- **PostgreSQL** 16+
- **Rust** 1.91+ (for Tauri desktop/mobile apps)

**For mobile development (optional):**
- **iOS**: macOS + Xcode 14+
- **Android**: Android Studio + SDK (API 24+)

See [MOBILE_SETUP.md](./MOBILE_SETUP.md) for mobile setup.

### 1. Clone and Install

```bash
cd /home/dwdec/Projects/quotemaster
npm install
```

This installs all dependencies using npm workspaces.

### 2. Database Setup

Create PostgreSQL database:

```bash
createdb quotemaster
```

### 3. Configure Environment Variables

**API Server** (`apps/api/.env`):

```bash
# Required - Database
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=quotemaster
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password

# Optional - Authentication (highly recommended!)
CLERK_SECRET_KEY=sk_test_...

# Optional - Error Tracking
SENTRY_DSN=https://...@sentry.io/...

# Optional - Email
RESEND_API_KEY=re_...

# Optional - Payments
STRIPE_SECRET_KEY=sk_test_...
```

**Web App** (`apps/web/.env`):

```bash
# API URL
VITE_API_URL=http://localhost:3001

# Optional - Authentication (matches API)
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...

# Optional - Error Tracking
VITE_SENTRY_DSN=https://...@sentry.io/...

# Optional - Analytics
VITE_POSTHOG_KEY=phc_...
```

Copy example files:

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
# Edit the files with your actual values
```

### 4. Run Database Migrations

```bash
cd apps/api
npm run migration:run
```

This creates all tables with proper indexes and multi-tenancy support.

### 5. Start Development Servers

```bash
# From root directory
npm run dev
```

This starts:
- **API**: http://localhost:3001
- **Web**: http://localhost:5173

Or run individually:

```bash
npm run dev:api    # API server only
npm run dev:web    # Web app only
npm run dev:desktop # Desktop app
```

### 6. Verify Everything Works

Visit http://localhost:5173 in your browser.

Check API health: http://localhost:3001/health

---

## 📚 API Documentation

### Base URL

```
http://localhost:3001/api
```

### Authentication

All API endpoints require authentication via Clerk. The web app automatically sends auth tokens in cookies.

### Endpoints

#### Clients

```
GET    /api/clients       - List all clients
GET    /api/clients/:id   - Get single client
POST   /api/clients       - Create client
PUT    /api/clients/:id   - Update client
DELETE /api/clients/:id   - Delete client
```

#### Products

```
GET    /api/products?search=keyword  - List/search products
GET    /api/products/:id             - Get single product
POST   /api/products                 - Create product
PUT    /api/products/:id             - Update product
DELETE /api/products/:id             - Delete product
```

#### Estimates

```
GET    /api/estimates     - List all estimates
GET    /api/estimates/:id - Get estimate with items
POST   /api/estimates     - Create estimate with items
DELETE /api/estimates/:id - Delete estimate
```

#### Invoices

```
GET    /api/invoices      - List all invoices
GET    /api/invoices/:id  - Get invoice with items
POST   /api/invoices      - Create invoice with items
DELETE /api/invoices/:id  - Delete invoice
```

### Request/Response Format

**Create Client Example:**

```bash
curl -X POST http://localhost:3001/api/clients \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Acme Corp",
    "email": "contact@acme.com",
    "phone": "+1-555-0100",
    "company": "Acme Corporation"
  }'
```

**Response:**

```json
{
  "data": {
    "id": 1,
    "user_id": "user_abc123",
    "name": "Acme Corp",
    "email": "contact@acme.com",
    "phone": "+1-555-0100",
    "company": "Acme Corporation",
    "created_at": "2025-11-06T10:00:00.000Z",
    "updated_at": "2025-11-06T10:00:00.000Z"
  }
}
```

**Error Response:**

```json
{
  "error": "Validation failed",
  "details": {
    "fieldErrors": {
      "email": ["Invalid email address"]
    }
  }
}
```

---

## 🔐 Security Features

### Multi-Tenancy
Every database record includes `user_id` field. All queries automatically filter by the authenticated user - you can't access other users' data.

### Authentication
- Clerk handles user authentication
- `requireAuth` middleware on all routes
- HTTP-only cookies for session management

### Input Validation
- Zod schemas validate all request bodies
- Type-safe validation with helpful error messages
- Prevents invalid data from entering the database

### SQL Injection Protection
- TypeORM uses parameterized queries exclusively
- No raw SQL concatenation
- Safe by default

### Error Handling
- Stack traces hidden in production
- Detailed errors only in development
- All errors logged to Sentry

### CORS Protection
- Only whitelisted origins allowed
- Supports web, desktop, and mobile apps
- Credentials (cookies) properly handled

---

## 🗄️ Database

### Schema

QuoteMaster uses **PostgreSQL** with **TypeORM** for type-safe database access.

**Main Tables:**
- `clients` - Customer information
- `estimates` + `estimate_items` - Estimates with line items
- `invoices` + `invoice_items` - Invoices with line items
- `products` - Reusable products/services catalog
- `revenue` - Revenue tracking
- `settings` - User-specific settings

All tables include:
- `user_id` (multi-tenancy)
- Indexes on frequently queried columns
- Proper foreign key constraints
- Timestamps (`created_at`, `updated_at`)

### Migrations

**Create a new migration:**

```bash
cd apps/api
npm run migration:generate -- src/migrations/MigrationName
```

**Run pending migrations:**

```bash
npm run migration:run
```

**Revert last migration:**

```bash
npm run migration:revert
```

### Direct Database Access

```bash
psql quotemaster
```

---

## 🧪 Testing

### Unit Tests (Vitest)

```bash
npm run test              # All tests
npm run test:coverage     # With coverage report
npm run test:ui           # Visual test UI
```

### E2E Tests (Playwright)

```bash
npm run test:e2e          # Run all E2E tests
npm run test:e2e:ui       # Visual E2E UI
```

---

## 📦 Building for Production

### Build All Apps

```bash
npm run build
```

### Build Individually

```bash
npm run build:api      # API server
npm run build:web      # Web app
npm run build:desktop  # Desktop app
```

### Run Production Server

```bash
cd apps/api
npm run start  # Runs compiled dist/index.js
```

### Deploy

1. **Database**: Run migrations in production
2. **API**: Deploy to Hetzner VPS or similar
3. **Web**: Deploy to Vercel, Netlify, or static hosting
4. **Desktop**: Build and distribute .exe, .dmg, .AppImage

---

## 📱 Desktop & Mobile Apps

### Desktop Development

```bash
npm run dev:desktop
```

Builds native apps for:
- Windows (.exe)
- macOS (.dmg, .app)
- Linux (.AppImage, .deb)

### Mobile Development

See [MOBILE_SETUP.md](./MOBILE_SETUP.md) for complete setup instructions.

**iOS:**

```bash
npm run mobile:ios:init   # First time setup
npm run mobile:ios:dev    # Run in simulator
```

**Android:**

```bash
npm run mobile:android:init  # First time setup
npm run mobile:android:dev   # Run in emulator
```

---

## 🔧 Development Commands

```bash
# Development
npm run dev              # Start all (API + web)
npm run dev:api          # API server only
npm run dev:web          # Web app only
npm run dev:desktop      # Desktop app

# Building
npm run build            # Build all apps
npm run build:api        # Build API
npm run build:web        # Build web
npm run build:desktop    # Build desktop

# Database
npm run migration:generate  # Create new migration
npm run migration:run       # Run migrations
npm run migration:revert    # Undo last migration

# Testing
npm run test             # Unit tests
npm run test:e2e         # E2E tests
npm run test:coverage    # Coverage report

# Linting
npm run lint             # Lint all packages
npm run lint:fix         # Auto-fix lint issues
```

---

## 📖 Documentation

- **[QUICKSTART.md](./QUICKSTART.md)** - 5-minute getting started guide
- **[TODO.md](./TODO.md)** - Future features and roadmap
- **[MOBILE_SETUP.md](./MOBILE_SETUP.md)** - iOS and Android setup

---

## 🎯 Project Status

### ✅ Completed
- Core CRUD operations (clients, products, estimates, invoices)
- Authentication with Clerk
- Multi-tenancy (complete user isolation)
- Input validation (Zod)
- Database migrations (TypeORM)
- Error tracking (Sentry)
- Security hardening (CORS, helmet, error handling)
- Database indexes
- Connection pooling
- Graceful shutdown

### 🚧 In Progress
- Email system integration (Resend + React Email)
- Payment processing (Stripe)
- Analytics dashboard (PostHog)

### 📋 Planned (see TODO.md)
- Pagination for large lists
- Logging infrastructure (Pino)
- API versioning
- Soft deletes
- Rate limiting
- Request ID tracking

---

## 🤝 Contributing

This is a template project - fork it and make it your own!

To contribute improvements back to the template:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

MIT License - Use this for any project (personal or commercial).

---

## 🌟 Built With

- [Vite](https://vitejs.dev) - Lightning-fast frontend build tool
- [React](https://react.dev) - UI library
- [Tauri](https://tauri.app) - Desktop and mobile framework
- [TypeORM](https://typeorm.io) - TypeScript ORM for Node.js
- [Express.js](https://expressjs.com) - Web framework
- [PostgreSQL](https://www.postgresql.org) - Relational database
- [Clerk](https://clerk.com) - Authentication
- [CASL](https://casl.js.org) - Authorization
- [Sentry](https://sentry.io) - Error tracking
- [PostHog](https://posthog.com) - Analytics
- [Resend](https://resend.com) - Email delivery
- [Stripe](https://stripe.com) - Payments
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS

---

## 🆘 Troubleshooting

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

# Start if needed (Linux)
sudo systemctl start postgresql

# Start if needed (macOS)
brew services start postgresql
```

### Migration Failed

```bash
# Revert last migration
npm run migration:revert

# Fix the migration file
# Then run again
npm run migration:run
```

### Module Not Found

```bash
# Reinstall all dependencies
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors

```bash
# Rebuild all packages
npm run build

# Clean turbo cache
rm -rf .turbo
npm run build
```

---

## 💡 Tips

1. **Authentication**: Set up Clerk early - it's required for multi-user support
2. **Database**: Always run migrations in production (never use `synchronize: true`)
3. **Environment**: Never commit `.env` files - use `.env.example` for documentation
4. **Testing**: Write tests before deployment
5. **Monitoring**: Set up Sentry for production error tracking

---

**Ready to build?** Start with `npm install && npm run dev` 🚀
