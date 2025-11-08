import type { Request, Response, NextFunction } from 'express';
import { auth } from '../auth.js';

// Helper to get authenticated user using Better Auth
export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    // Get session from Better Auth
    const session = await auth.api.getSession({
      headers: req.headers as Headers,
    });

    if (!session?.user) {
      return res.status(401).json({ error: 'Unauthorized - Please sign in' });
    }

    // Add userId and user to request for easy access
    (req as any).userId = session.user.id;
    (req as any).user = session.user;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized - Invalid session' });
  }
}
