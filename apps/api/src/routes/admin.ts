import express from 'express';
import { adminLogin, requireAdmin, adminLogout } from '../middleware/admin-auth.js';
import { AppDataSource } from '../data-source.js';
import { Client } from '../entities/Client.js';
import { logger } from '../logger.js';

export const adminRouter = express.Router();

// Admin login (no auth required)
adminRouter.post('/login', adminLogin);

// Admin logout
adminRouter.post('/logout', adminLogout);

// Admin-only routes (all require admin auth)

// Get all users' data (admin only)
adminRouter.get('/users', requireAdmin, async (req, res, next) => {
  try {
    const clientRepo = AppDataSource.getRepository(Client);

    // Get all clients across all users
    const clients = await clientRepo
      .createQueryBuilder('client')
      .select('client.user_id', 'user_id')
      .addSelect('COUNT(client.id)', 'client_count')
      .groupBy('client.user_id')
      .getRawMany();

    logger.info({ admin: (req.session as any)?.adminUsername }, 'Admin viewed user list');

    res.json({ data: clients });
  } catch (error) {
    next(error);
  }
});

// System stats (admin only)
adminRouter.get('/stats', requireAdmin, async (req, res, next) => {
  try {
    const clientRepo = AppDataSource.getRepository(Client);

    const totalClients = await clientRepo.count();
    const uniqueUsers = await clientRepo
      .createQueryBuilder('client')
      .select('COUNT(DISTINCT client.user_id)', 'count')
      .getRawOne();

    logger.info({ admin: (req.session as any)?.adminUsername }, 'Admin viewed system stats');

    res.json({
      data: {
        totalClients,
        totalUsers: parseInt(uniqueUsers.count),
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
});
