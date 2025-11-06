import 'reflect-metadata';
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import * as Sentry from '@sentry/node';
import { clerkMiddleware } from '@clerk/express';
import { AppDataSource } from './data-source.js';
import { clientsRouter } from './routes/clients.js';
import { estimatesRouter } from './routes/estimates.js';
import { invoicesRouter } from './routes/invoices.js';
import { productsRouter } from './routes/products.js';

// =========================================
// ENVIRONMENT VARIABLE VALIDATION (Issue #5)
// =========================================
const REQUIRED_VARS = ['POSTGRES_HOST', 'POSTGRES_DB', 'POSTGRES_USER', 'POSTGRES_PASSWORD'];
const OPTIONAL_VARS = ['CLERK_SECRET_KEY', 'SENTRY_DSN', 'RESEND_API_KEY', 'STRIPE_SECRET_KEY'];

console.log('🔍 Validating environment variables...');
let hasErrors = false;

REQUIRED_VARS.forEach(varName => {
  if (!process.env[varName]) {
    console.error(`❌ Missing required environment variable: ${varName}`);
    hasErrors = true;
  }
});

if (hasErrors) {
  console.error('\n⛔ Cannot start server without required environment variables');
  console.error('Please check your .env file and ensure all required variables are set.');
  process.exit(1);
}

OPTIONAL_VARS.forEach(varName => {
  if (!process.env[varName]) {
    console.warn(`⚠️  Optional environment variable not set: ${varName}`);
  }
});

console.log('✅ Environment variables validated\n');

// =========================================
// SENTRY INITIALIZATION (Issue #6)
// =========================================
const SENTRY_DSN = process.env.SENTRY_DSN;
if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    environment: process.env.NODE_ENV || 'development',
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  });
  console.log('✅ Sentry initialized');
} else {
  console.warn('⚠️  Sentry not configured (SENTRY_DSN missing)');
}

const app = express();
const PORT = process.env.PORT || 3001;

// =========================================
// SECURITY MIDDLEWARE
// =========================================

// Sentry request handler (must be first)
if (SENTRY_DSN) {
  app.use(Sentry.Handlers.requestHandler());
  app.use(Sentry.Handlers.tracingHandler());
}

// Helmet for security headers (Issue #26)
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
}));

// Multi-origin CORS (Issue #12)
const ALLOWED_ORIGINS = [
  'http://localhost:3001',           // Combined web + API server (same origin)
  'http://localhost:5173',           // Web dev (separate)
  'http://localhost:3000',           // Desktop dev
  'tauri://localhost',                // Tauri desktop
  'https://tauri.localhost',          // Tauri desktop (alternative)
  process.env.CORS_ORIGIN,            // Custom override
  process.env.PRODUCTION_URL,         // Production web
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);

    if (ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`⚠️  CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json());

// Clerk authentication middleware (Issue #1)
// This adds auth context to all requests
const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;
if (CLERK_SECRET_KEY) {
  app.use(clerkMiddleware());
  console.log('✅ Clerk middleware initialized');
} else {
  console.warn('⚠️  Clerk not configured - authentication disabled');
}

// =========================================
// HEALTH CHECK (no auth required)
// =========================================
app.get('/health', async (req, res) => {
  try {
    // Test database connection
    await AppDataSource.query('SELECT NOW()');

    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
      typeorm: AppDataSource.isInitialized ? 'initialized' : 'not initialized',
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// =========================================
// API ROUTES (all require authentication via requireAuth middleware)
// =========================================
app.use('/api/clients', clientsRouter);
app.use('/api/estimates', estimatesRouter);
app.use('/api/invoices', invoicesRouter);
app.use('/api/products', productsRouter);

// =========================================
// STATIC FILE SERVING (Combined Web + API Server)
// =========================================
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from public directory (built web app)
app.use(express.static(path.join(__dirname, '../public')));

// SPA fallback: serve index.html for all non-API routes
app.get('*', (req, res) => {
  // Don't serve index.html for API routes
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }

  const indexPath = path.join(__dirname, '../public/index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(404).json({ error: 'Web app not built yet. Run: npm run build:web' });
    }
  });
});

// =========================================
// ERROR HANDLERS
// =========================================

// Sentry error handler (must be before other error handlers)
if (SENTRY_DSN) {
  app.use(Sentry.Handlers.errorHandler());
}

// Global error handler (Issue #4 - hide stack traces in production)
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  // Log full error server-side
  console.error('❌ Error:', err);

  const isDevelopment = process.env.NODE_ENV !== 'production';

  // Only send detailed errors in development
  res.status(500).json({
    error: 'Internal server error',
    ...(isDevelopment && {
      message: err.message,
      stack: err.stack,
    }),
  });
});

// =========================================
// GRACEFUL SHUTDOWN (Issue #27)
// =========================================
process.on('SIGTERM', async () => {
  console.log('\n🛑 SIGTERM received, shutting down gracefully...');

  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
    console.log('✅ Database connection closed');
  }

  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('\n🛑 SIGINT received, shutting down gracefully...');

  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
    console.log('✅ Database connection closed');
  }

  process.exit(0);
});

// =========================================
// START SERVER
// =========================================
async function bootstrap() {
  try {
    console.log('🔌 Connecting to database...');
    await AppDataSource.initialize();
    console.log('✅ Database connected (TypeORM initialized)');

    app.listen(PORT, () => {
      console.log(`\n🚀 API server running on http://localhost:${PORT}`);
      console.log(`📚 Health check: http://localhost:${PORT}/health\n`);

      // Show security status
      console.log('🔐 Security Status:');
      console.log(`  - Authentication: ${CLERK_SECRET_KEY ? '✅ Enabled' : '❌ Disabled'}`);
      console.log(`  - Error Tracking: ${SENTRY_DSN ? '✅ Enabled' : '⚠️  Disabled'}`);
      console.log(`  - CORS Origins: ${ALLOWED_ORIGINS.length} configured`);
      console.log(`  - Environment: ${process.env.NODE_ENV || 'development'}\n`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

bootstrap();
