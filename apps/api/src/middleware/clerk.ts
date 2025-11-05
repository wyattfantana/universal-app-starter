import { clerkMiddleware, getAuth } from '@clerk/express';
import type { Request, Response, NextFunction } from 'express';

// Clerk middleware for Express
export const clerk = clerkMiddleware();

// Helper to get authenticated user
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const auth = getAuth(req);

  if (!auth.userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Add userId to request for easy access
  (req as any).userId = auth.userId;
  next();
}
