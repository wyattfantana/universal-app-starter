# Universal App Starter

**A production-ready, full-stack monorepo template for building web, desktop, and mobile applications.**

This template provides a complete starting point with authentication, database, API, and UI components already configured and working.

## 🚀 What's Included

### **Applications**
- **Web App** - React + Vite + TypeScript + Tailwind CSS
- **Desktop App** - Tauri (Rust) with offline database support
- **API Server** - Express + TypeORM + PostgreSQL + Better Auth
- **Mobile** - iOS & Android via Tauri Mobile (ready to build)

### **Authentication** (Better Auth)
- ✅ Email/password authentication
- ✅ Google OAuth (configurable)
- ✅ Facebook OAuth (configurable)
- ✅ Session management (7-day expiry)
- ✅ Custom sign-up/sign-in pages
- ✅ Protected routes
- ✅ User profile management
- ✅ Separate admin authentication system

### **Infrastructure**
- ✅ Structured logging with Pino
- ✅ Pagination on all list endpoints
- ✅ API versioning (/api/v1/*)
- ✅ Enhanced health check monitoring
- ✅ Multi-origin CORS support
- ✅ Helmet security headers
- ✅ Database migrations with TypeORM

### **Database**
- PostgreSQL with TypeORM
- Better Auth tables (user, session, account, verification, organization, member, invitation)
- Sample entities (Client, Estimate, Invoice, Product, Settings)
- Automated migrations

## 📋 Prerequisites

- **Node.js** >= 20.0.0
- **npm** >= 10.0.0
- **PostgreSQL** >= 14
- **Rust** (for desktop/mobile builds)

## 🏁 Quick Start

### 1. Clone and Install

\`\`\`bash
git clone https://github.com/YOUR_USERNAME/YOUR_PROJECT_NAME.git
cd YOUR_PROJECT_NAME
npm install
\`\`\`

### 2. Database Setup

\`\`\`bash
# Create PostgreSQL database
createdb your_app_name

# Run Better Auth migration
cd apps/api
npx tsx src/scripts/migrate-better-auth.ts
\`\`\`

### 3. Environment Variables

Copy \`.env.example\` files and configure:

**apps/api/.env:**
\`\`\`bash
# Database
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=your_app_name
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password

# Server
PORT=3001
NODE_ENV=development

# Better Auth (Optional OAuth)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FACEBOOK_CLIENT_ID=your_facebook_app_id
FACEBOOK_CLIENT_SECRET=your_facebook_app_secret

# Admin Authentication
ADMIN_USERNAME=admin_secure_random
ADMIN_PASSWORD=your_strong_password
SESSION_SECRET=your_session_secret
\`\`\`

**apps/web/.env:**
\`\`\`bash
VITE_API_URL=http://localhost:3001
\`\`\`

### 4. Run Development Servers

\`\`\`bash
# Start all services
npm run dev

# Or start individually:
npm run dev:api      # API server on http://localhost:3001
npm run dev:web      # Web app on http://localhost:5173
npm run dev:desktop  # Desktop app
\`\`\`

## 🔐 Authentication

### User Authentication
- **Sign Up**: \`/sign-up\` - Email/password + OAuth options
- **Sign In**: \`/sign-in\` - Email/password + OAuth options
- **Profile**: \`/profile\` - View account info and sign out

### Admin Authentication (Separate System)
- **Admin Login**: \`/system/control\` - Hardcoded credentials
- **Admin Dashboard**: \`/system/dashboard\` - Admin panel
- Rate limited (3 attempts / 15 min)
- 30-minute session timeout

## 📚 API Documentation

- **Health Check**: \`GET /health\`
- **Auth Routes**: \`POST /api/auth/sign-up\`, \`/api/auth/sign-in\`, etc.
- **API v1**: \`/api/v1/clients\`, \`/api/v1/products\`, etc.
- **Pagination**: All list endpoints support \`?page=1&limit=20\`

## 🏗️ Customization

### Remove Sample Entities
The template includes sample entities (Client, Estimate, Invoice, Product). To remove them:

1. Delete entity files in \`apps/api/src/entities/\`
2. Delete corresponding route files in \`apps/api/src/routes/\`
3. Remove route imports from \`apps/api/src/index.ts\`
4. Delete frontend pages referencing these entities

### Add Your Own Features
1. Create new entities in \`apps/api/src/entities/\`
2. Add routes in \`apps/api/src/routes/\`
3. Build frontend pages in \`apps/web/src/pages/\`

## 🔒 Security Features

- ✅ Better Auth session management
- ✅ Helmet security headers
- ✅ CORS configuration
- ✅ SQL injection prevention (TypeORM)
- ✅ Input validation (Zod schemas)
- ✅ Password hashing (Better Auth)
- ✅ Rate limiting on admin login
- ✅ Production error handling

## 📦 Deployment

### Web App
\`\`\`bash
npm run build:web
# Deploy apps/web/dist directory
\`\`\`

### API Server
\`\`\`bash
npm run build:api
# Deploy apps/api directory
\`\`\`

### Desktop App
\`\`\`bash
npm run build:desktop
# Find installers in apps/desktop/src-tauri/target/release/bundle/
\`\`\`

## 📄 License

MIT - feel free to use this template for any project!

---

**Built with:** Better Auth • TypeORM • React • Tauri • Turborepo • Vite
