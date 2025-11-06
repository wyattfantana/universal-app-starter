# QuoteMaster - TODO List

Items to implement later as the project scales.

---

## ✅ Completed (Critical & High Priority)

All critical and high-priority features and security issues have been addressed:

### Core Architecture
- ✅ **Express REST API** - Replaced tRPC with traditional REST endpoints
- ✅ **TypeORM** - Complete ORM setup with decorators and migrations
- ✅ **pg-boss Worker** - Background job processing using PostgreSQL
- ✅ **Combined Server** - Single server serving both API and web app
- ✅ **Tauri Desktop** - Native desktop app fully configured and tested

### Security & Data
- ✅ **Multi-tenancy** - All entities have `user_id`, all queries filter by user
- ✅ **Authentication** - Clerk middleware on all routes with `requireAuth`
- ✅ **SQL Injection** - TypeORM uses parameterized queries
- ✅ **Error Handling** - Stack traces hidden in production
- ✅ **Environment Validation** - Required vars checked on startup
- ✅ **Sentry** - Error tracking initialized
- ✅ **Input Validation** - Zod schemas on all endpoints
- ✅ **CORS** - Multi-origin support for web + desktop + mobile
- ✅ **Connection Pooling** - TypeORM configured with limits
- ✅ **Database Indexes** - Added on frequently queried columns
- ✅ **Graceful Shutdown** - Database connections closed properly
- ✅ **Database Migrations** - TypeORM migration system in place

---

## 📋 Medium Priority - To Implement Later

### #16: Logging Infrastructure
**Status:** Not Implemented
**Priority:** Medium
**When:** After 50+ users or when debugging becomes difficult

**Recommendation:** Install `pino` for structured JSON logging

```bash
npm install pino pino-pretty --workspace=api
```

```typescript
import pino from 'pino';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: process.env.NODE_ENV === 'development' ? {
    target: 'pino-pretty',
  } : undefined,
});

// Usage
logger.info({ userId, action: 'create_client' }, 'Client created');
logger.error({ err, userId }, 'Failed to create client');
```

---

### #17: TypeScript Strict Mode
**Status:** Not Enabled
**Priority:** Medium
**When:** After core features stabilize

**Action:** Add to all `tsconfig.json` files:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true
  }
}
```

**Impact:** Will require fixing ~20-50 type errors initially, but prevents bugs long-term.

---

### #18: Complete Type Definitions
**Status:** Partial
**Priority:** Medium
**When:** Ongoing as you write code

**Action:** Remove all `any` types, add proper return types to functions:

```typescript
// Bad
function getClients(): any {
  return clientRepo.find();
}

// Good
function getClients(): Promise<Client[]> {
  return clientRepo.find();
}
```

---

### #19: Enhanced Health Check
**Status:** Basic health check exists
**Priority:** Medium
**When:** Before production deployment

**Current:** Only checks database
**Needed:** Check all critical dependencies

```typescript
app.get('/health', async (req, res) => {
  const checks = {
    database: await checkDatabase(),
    clerk: await checkClerk(),
    sentry: checkSentry(),
    redis: await checkRedis(), // if using rate limiting
  };

  const isHealthy = Object.values(checks).every(check => check.healthy);

  res.status(isHealthy ? 200 : 503).json({
    status: isHealthy ? 'healthy' : 'unhealthy',
    checks,
    timestamp: new Date().toISOString(),
  });
});
```

---

### #20: Consistent Error Handling
**Status:** Partial
**Priority:** Medium
**When:** Refactor in next sprint

**Current:** Mix of `try/catch` and error throwing
**Goal:** Standardize on custom error classes

```typescript
// Create custom errors
class NotFoundError extends Error {
  statusCode = 404;
}

class ValidationError extends Error {
  statusCode = 400;
}

// Use in routes
if (!client) {
  throw new NotFoundError('Client not found');
}

// Global handler catches them
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({ error: err.message });
});
```

---

### #21: API Versioning
**Status:** Not Implemented
**Priority:** Medium
**When:** Before making any breaking changes to API

**Action:** Add version prefix to routes:

```typescript
// Instead of: /api/clients
// Use: /api/v1/clients

app.use('/api/v1/clients', clientsRouter);
app.use('/api/v1/products', productsRouter);
```

**Benefit:** Can release v2 without breaking existing integrations

---

### #22: Pagination
**Status:** Not Implemented
**Priority:** Medium
**When:** When lists exceed 100 items

**Action:** Add pagination to all `.list()` endpoints:

```typescript
// Add to query params
const page = parseInt(req.query.page) || 1;
const limit = parseInt(req.query.limit) || 20;
const skip = (page - 1) * limit;

const [clients, total] = await clientRepo.findAndCount({
  where: { user_id: userId },
  skip,
  take: limit,
  order: { created_at: 'DESC' },
});

res.json({
  data: clients,
  pagination: {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  },
});
```

---

### #23: Soft Deletes
**Status:** Not Implemented
**Priority:** Medium
**When:** After first accidental deletion incident

**Action:** Add `deleted_at` column to important entities:

```typescript
@Entity()
export class Client {
  @DeleteDateColumn()
  deleted_at?: Date;
}

// TypeORM will automatically filter soft-deleted records
// To include deleted:
clientRepo.find({ withDeleted: true });

// To restore:
clientRepo.restore(id);
```

---

### #25: Desktop App .env.example
**Status:** Missing
**Priority:** Low
**When:** Before building desktop app

**Action:** Create `apps/desktop/.env.example`:

```bash
# API Configuration
VITE_API_URL=http://localhost:3001

# Clerk (if different keys needed for desktop)
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...

# Sentry
VITE_SENTRY_DSN=https://...

# Analytics
VITE_POSTHOG_KEY=phc_...
```

---

## 🔐 Deferred Security Features

See `SECURITY.md` for details on:

- **Rate Limiting** (Issue #9) - Implement when traffic exceeds 1000 req/day
- **Request ID Tracking** (Issue #15) - Implement when debugging becomes complex

---

## 🚀 Future Enhancements

### Email Functionality
- [ ] Welcome email on user signup
- [ ] Estimate sent email notification
- [ ] Invoice payment confirmation
- [ ] Overdue invoice reminders

### Stripe Integration
- [ ] Invoice payment processing
- [ ] Subscription management (if offering SaaS)
- [ ] Webhook handlers for payment events

### Admin Features
- [ ] User management dashboard
- [ ] Analytics and reporting
- [ ] Export data (CSV, PDF)
- [ ] Bulk operations

### Mobile App
- [ ] iOS app via Tauri Mobile
- [ ] Android app via Tauri Mobile
- [ ] Offline support
- [ ] Push notifications

### Testing
- [ ] Write unit tests for all entities
- [ ] Integration tests for API endpoints
- [ ] E2E tests for critical user flows
- [ ] Load testing for production readiness

---

## 📅 Roadmap

### Phase 1 (Current) - MVP
- ✅ Core CRUD operations
- ✅ Authentication & Authorization
- ✅ Multi-tenancy
- ✅ Security basics

### Phase 2 (Next Month) - Polish
- [ ] Logging infrastructure (#16)
- [ ] Pagination (#22)
- [ ] Enhanced health checks (#19)
- [ ] API versioning (#21)

### Phase 3 (Month 3) - Scale
- [ ] Rate limiting (SECURITY.md #9)
- [ ] Request ID tracking (SECURITY.md #15)
- [ ] Soft deletes (#23)
- [ ] Performance optimization

### Phase 4 (Month 4+) - Features
- [ ] Email system fully integrated
- [ ] Stripe payments working
- [ ] Analytics dashboard
- [ ] Mobile apps

---

**Last Updated:** 2025-11-06
**Status:** Core MVP Complete (REST API + TypeORM + Worker)
**Next Priority:** Logging infrastructure (#16) or Pagination (#22)
