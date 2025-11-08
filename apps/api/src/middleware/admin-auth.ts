import type { Request, Response, NextFunction } from 'express';
import { logger } from '../logger.js';

// Admin credentials from environment (NOT in database - avoid SQL injection)
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
  logger.warn('Admin credentials not configured. Admin login will not work. Set ADMIN_USERNAME and ADMIN_PASSWORD in .env');
}

// Rate limiting storage (in-memory for now, use Redis in production)
const loginAttempts = new Map<string, { count: number; resetAt: number }>();

const MAX_ATTEMPTS = 3;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds

/**
 * Check if IP is rate limited
 */
function isRateLimited(ip: string): boolean {
  const attempt = loginAttempts.get(ip);

  if (!attempt) return false;

  // Reset if lockout period has expired
  if (Date.now() > attempt.resetAt) {
    loginAttempts.delete(ip);
    return false;
  }

  return attempt.count >= MAX_ATTEMPTS;
}

/**
 * Record a failed login attempt
 */
function recordFailedAttempt(ip: string): void {
  const attempt = loginAttempts.get(ip);

  if (!attempt) {
    loginAttempts.set(ip, {
      count: 1,
      resetAt: Date.now() + LOCKOUT_DURATION,
    });
  } else {
    attempt.count++;
    attempt.resetAt = Date.now() + LOCKOUT_DURATION;
  }
}

/**
 * Clear login attempts for an IP (on successful login)
 */
function clearAttempts(ip: string): void {
  loginAttempts.delete(ip);
}

/**
 * Admin login endpoint
 */
export async function adminLogin(req: Request, res: Response) {
  const { username, password } = req.body;
  const ip = req.ip || req.socket.remoteAddress || 'unknown';

  // Check rate limiting
  if (isRateLimited(ip)) {
    logger.warn({ ip, username }, 'Admin login blocked - too many attempts');
    return res.status(429).json({
      error: 'Too many login attempts. Please try again in 15 minutes.',
    });
  }

  // Validate credentials
  if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
    logger.error('Admin credentials not configured');
    return res.status(500).json({ error: 'Admin authentication not configured' });
  }

  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    recordFailedAttempt(ip);
    const attemptsLeft = MAX_ATTEMPTS - (loginAttempts.get(ip)?.count || 0);

    logger.warn({ ip, username, attemptsLeft }, 'Failed admin login attempt');

    return res.status(401).json({
      error: 'Invalid credentials',
      attemptsLeft: Math.max(0, attemptsLeft),
    });
  }

  // Successful login
  clearAttempts(ip);
  logger.info({ ip, username }, 'Successful admin login');

  // Create admin session
  if (req.session) {
    req.session.isAdmin = true;
    req.session.adminUsername = username;
    req.session.loginAt = new Date().toISOString();
  }

  res.json({
    success: true,
    message: 'Login successful',
  });
}

/**
 * Middleware to require admin authentication
 */
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const session = req.session as any;

  if (!session?.isAdmin) {
    logger.warn({ ip: req.ip, path: req.path }, 'Unauthorized admin access attempt');
    return res.status(403).json({ error: 'Admin access required' });
  }

  // Check session timeout (30 minutes)
  const SESSION_TIMEOUT = 30 * 60 * 1000;
  const loginTime = session.loginAt ? new Date(session.loginAt).getTime() : 0;
  const now = Date.now();

  if (now - loginTime > SESSION_TIMEOUT) {
    logger.info({ username: session.adminUsername }, 'Admin session expired');
    req.session.destroy(() => {});
    return res.status(401).json({ error: 'Session expired. Please login again.' });
  }

  next();
}

/**
 * Admin logout endpoint
 */
export function adminLogout(req: Request, res: Response) {
  const session = req.session as any;
  const username = session?.adminUsername;

  req.session.destroy((err) => {
    if (err) {
      logger.error({ err }, 'Error destroying admin session');
      return res.status(500).json({ error: 'Logout failed' });
    }

    logger.info({ username }, 'Admin logged out');
    res.json({ success: true, message: 'Logged out successfully' });
  });
}
