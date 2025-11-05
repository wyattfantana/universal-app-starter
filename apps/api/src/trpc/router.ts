import { router } from './init';
import { clientsRouter } from './routers/clients';

export const appRouter = router({
  clients: clientsRouter,
  // Add more routers here:
  // estimates: estimatesRouter,
  // invoices: invoicesRouter,
  // products: productsRouter,
});

export type AppRouter = typeof appRouter;
