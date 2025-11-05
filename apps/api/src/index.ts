import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { appRouter } from './trpc/router.js';
import { createContext } from './trpc/context.js';
import { clientsRouter } from './routes/clients.js';
import { estimatesRouter } from './routes/estimates.js';
import { invoicesRouter } from './routes/invoices.js';
import { productsRouter } from './routes/products.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// tRPC endpoint
app.use('/trpc', createExpressMiddleware({
  router: appRouter,
  createContext,
}));

// Health check
app.get('/health', async (req, res) => {
  try {
    // Test database connection
    const { getPool } = await import('@repo/database');
    const pool = getPool();
    const result = await pool.query('SELECT NOW()');

    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
      db_time: result.rows[0].now,
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

// API Routes
app.use('/api/clients', clientsRouter);
app.use('/api/estimates', estimatesRouter);
app.use('/api/invoices', invoicesRouter);
app.use('/api/products', productsRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message,
  });
});

app.listen(PORT, () => {
  console.log(`🚀 API server running on http://localhost:${PORT}`);
});
