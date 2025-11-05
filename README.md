# QuoteMaster

Professional estimate and invoice management system with universal app support (web + desktop).

## 🏗️ Architecture

QuoteMaster is built as a **Turbo Repo monorepo** with shared packages for maximum code reuse across platforms:

```
quotemaster/
├── apps/
│   ├── web/              # Vite + React web application
│   ├── api/              # Express.js REST API server
│   └── desktop/          # Tauri v2 (Windows, macOS, Linux, iOS, Android)
├── packages/
│   ├── ui/               # Shared React components
│   ├── types/            # Shared TypeScript types
│   ├── config/           # Shared configuration (TS, Tailwind)
│   └── database/         # PostgreSQL client + pg-boss job queue
└── turbo.json            # Monorepo build pipeline
```

### Platform Support

- ✅ **Web** - Browser-based (Vite + React)
- ✅ **API** - RESTful API (Express.js)
- ✅ **Desktop** - Windows, macOS, Linux (Tauri)
- ✅ **Mobile** - iOS and Android (Tauri Mobile)

## ✨ Features

- **Client Management** - Track clients with contact details
- **Smart Estimates** - Create professional estimates with line items
- **Invoice Tracking** - Generate invoices and monitor payments
- **Product Catalog** - Maintain products with web scraping support
- **Background Jobs** - Email sending, PDF generation, web scraping (pg-boss)
- **Revenue Analytics** - Dashboard with charts and insights
- **Universal Apps** - Same codebase for web, desktop, and mobile

## 🛠️ Tech Stack

### Frontend
- **Web**: Vite + React 19 + TypeScript + React Router
- **Desktop/Mobile**: Tauri v2 + React 19 + Vite
- **Styling**: Tailwind CSS
- **State**: Zustand + TanStack Query

### Backend
- **API**: Express.js + TypeScript
- **Database**: PostgreSQL 16+
- **Job Queue**: pg-boss (PostgreSQL-based, no Redis needed!)
- **ORM**: Custom query helpers with `pg`

### DevOps
- **Monorepo**: Turbo Repo
- **Package Manager**: npm workspaces
- **Hosting**: Hetzner VPS (Germany - GDPR compliant)

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ and npm 10+
- PostgreSQL 16+
- Rust 1.91+ (for Tauri apps)

**For mobile development (optional):**
- iOS: macOS + Xcode 14+
- Android: Android Studio + SDK (API 24+)
- See [MOBILE_SETUP.md](./MOBILE_SETUP.md) for details

### 1. Clone and Install

```bash
cd /home/dwdec/Projects/quotemaster
npm install
```

This installs dependencies for all apps and packages using npm workspaces.

### 2. Database Setup

Create a PostgreSQL database:

```bash
createdb quotemaster
```

Set environment variables:

**For API server** (create `.env` in `apps/api/`):
```bash
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=quotemaster
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password
```

**For web app** (create `.env` in `apps/web/`):
```bash
VITE_API_URL=http://localhost:3001
```

Run migrations:

```bash
cd packages/database
npm run migrate
```

### 3. Start Development

**Option A: Run everything (recommended)**

```bash
npm run dev
```

This starts:
- Web app on `http://localhost:5173` (Vite)
- API server on `http://localhost:3001` (Express)
- Desktop app (Tauri)
- All in watch mode with hot reload

**Option B: Run web only**

```bash
npm run dev:web
```

**Option C: Run API server only**

```bash
npm run dev:api
```

**Option D: Run desktop only**

```bash
npm run dev:desktop
```

### 4. Start Background Worker (Optional)

For background jobs (emails, PDF generation, web scraping):

```bash
cd packages/database
npm run worker
```

## 📦 Project Structure

### Apps

#### `apps/web` - Vite React Web App
- Production-ready web application
- Built with Vite + React + TypeScript
- React Router for client-side routing
- Calls the Express API server
- TanStack Query for data fetching

#### `apps/api` - Express REST API
- TypeScript-based REST API server
- Connects to PostgreSQL database
- pg-boss job queue integration
- CORS-enabled for web and desktop clients
- Health check and monitoring endpoints

#### `apps/desktop` - Tauri Universal App
- Native desktop application (Windows, macOS, Linux)
- **Mobile apps** (iOS and Android) from the same codebase
- Calls the Express API server
- Uses shared UI components
- Local-first option available (with SQLite)

### Packages

#### `@repo/ui`
Shared React components used across web and desktop:
- `Button`, `Input`, `Modal`, `TextArea`
- Consistent styling with Tailwind CSS

#### `@repo/types`
TypeScript types for:
- Database models (Client, Estimate, Invoice, Product, etc.)
- API request/response types
- Job queue payloads

#### `@repo/database`
PostgreSQL client and utilities:
- Connection pooling (`pg`)
- Query helpers and schema functions
- pg-boss job queue integration
- Migration scripts

#### `@repo/config`
Shared configuration:
- TypeScript config (`tsconfig.base.json`)
- Tailwind config with brand colors

## 🎯 Key Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start all apps in development mode |
| `npm run build` | Build all apps for production |
| `npm run dev:web` | Start web app only (port 5173) |
| `npm run dev:api` | Start API server only (port 3001) |
| `npm run dev:desktop` | Start desktop app only |
| `npm run lint` | Lint all packages |
| `npm run clean` | Clean build artifacts |

### Mobile Commands

| Command | Description |
|---------|-------------|
| `npm run mobile:ios:init` | Initialize iOS project (one-time) |
| `npm run mobile:ios:dev` | Run iOS app in simulator |
| `npm run mobile:ios:build` | Build iOS app for release |
| `npm run mobile:android:init` | Initialize Android project (one-time) |
| `npm run mobile:android:dev` | Run Android app in emulator |
| `npm run mobile:android:build` | Build Android APK for release |

See [MOBILE_SETUP.md](./MOBILE_SETUP.md) for complete mobile development guide.

## 🔧 Database Operations

```bash
# Run migrations
cd packages/database
npm run migrate

# Start background worker
npm run worker

# Check API health
curl http://localhost:3001/health

# Check clients endpoint
curl http://localhost:3001/api/clients
```

## 🌐 Deployment

### Web App + API (VPS)

1. Set up PostgreSQL on Hetzner VPS (Germany)
2. Set environment variables for API and web
3. Build and deploy API server:

```bash
cd apps/api
npm run build
npm start
```

4. Build and serve web app:

```bash
cd apps/web
npm run build
# Serve the dist folder with nginx or a static file server
```

5. Run background worker as a service:

```bash
cd packages/database
npm run worker
```

Use PM2 or systemd to keep processes running. Configure nginx as a reverse proxy for the API.

### Desktop App

Build platform-specific binaries:

```bash
cd apps/desktop
npm run tauri build
```

Binaries will be in `src-tauri/target/release/bundle/`.

### Mobile Apps

See [MOBILE_SETUP.md](./MOBILE_SETUP.md) for iOS and Android setup and deployment.

## 📚 API Documentation

API server runs on `http://localhost:3001` in development.

### Health Check
```
GET /health
```

### Clients
```
GET    /api/clients          # Get all clients
GET    /api/clients/:id      # Get client by ID
POST   /api/clients          # Create new client
PATCH  /api/clients/:id      # Update client
DELETE /api/clients/:id      # Delete client
```

### Estimates
```
GET    /api/estimates        # Get all estimates
GET    /api/estimates/:id    # Get estimate by ID
```

### Invoices
```
GET    /api/invoices         # Get all invoices
GET    /api/invoices/:id     # Get invoice by ID
```

### Products
```
GET    /api/products         # Get all products
GET    /api/products/search?q=term  # Search products
```

## 🛡️ Security & GDPR

- Customer data stored in EU (Hetzner Germany)
- PostgreSQL with proper access controls
- Environment variables for sensitive config
- HTTPS required in production

## 📞 Support

For issues or questions, open an issue in the repository.
