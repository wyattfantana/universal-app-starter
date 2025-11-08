import express from 'express';
import { auth } from '../auth.js';

export const authRouter = express.Router();

// Better Auth handles all auth routes through a single handler
// Routes: /api/auth/sign-up, /api/auth/sign-in, /api/auth/sign-out, etc.
authRouter.all('*', async (req, res) => {
  // Better Auth's handler works with Node.js request/response
  return auth.handler(req, res);
});
