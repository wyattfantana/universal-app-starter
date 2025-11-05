import type { Request, Response } from 'express';
import { getAuth } from '@clerk/express';

export interface Context {
  req: Request;
  res: Response;
  userId: string | null;
}

export const createContext = ({ req, res }: { req: Request; res: Response }): Context => {
  const auth = getAuth(req);

  return {
    req,
    res,
    userId: auth.userId || null,
  };
};
