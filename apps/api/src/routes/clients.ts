import express from 'express';
import { z } from 'zod';
import { AppDataSource } from '../data-source.js';
import { Client } from '../entities/Client.js';
import { requireAuth } from '../middleware/auth.js';
import { parsePaginationParams, createPaginationMeta } from '../types/pagination.js';

export const clientsRouter = express.Router();

// Zod schemas for validation (Issue #7)
const createClientSchema = z.object({
  name: z.string().min(1).max(255),
  email: z.string().email().optional().nullable(),
  phone: z.string().max(50).optional().nullable(),
  address: z.string().optional().nullable(),
  company: z.string().max(255).optional().nullable(),
});

const updateClientSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  email: z.string().email().optional().nullable(),
  phone: z.string().max(50).optional().nullable(),
  address: z.string().optional().nullable(),
  company: z.string().max(255).optional().nullable(),
});

// GET /api/clients - List all clients for authenticated user (with pagination)
clientsRouter.get('/', requireAuth, async (req, res, next) => {
  try {
    const userId = (req as any).userId;
    const clientRepo = AppDataSource.getRepository(Client);

    // Parse pagination parameters
    const { page, limit } = parsePaginationParams(req.query);
    const skip = (page - 1) * limit;

    // Multi-tenancy: Only get clients for this user (Issue #2)
    const [clients, total] = await clientRepo.findAndCount({
      where: { user_id: userId },
      order: { created_at: 'DESC' },
      skip,
      take: limit,
    });

    res.json({
      data: clients,
      pagination: createPaginationMeta(page, limit, total),
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/clients/:id - Get single client
clientsRouter.get('/:id', requireAuth, async (req, res, next) => {
  try {
    const userId = (req as any).userId;
    const clientId = parseInt(req.params.id);
    const clientRepo = AppDataSource.getRepository(Client);

    const client = await clientRepo.findOne({
      where: { id: clientId, user_id: userId }, // Multi-tenancy check
    });

    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    res.json({ data: client });
  } catch (error) {
    next(error);
  }
});

// POST /api/clients - Create new client
clientsRouter.post('/', requireAuth, async (req, res, next) => {
  try {
    const userId = (req as any).userId;

    // Validate input (Issue #7)
    const result = createClientSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: result.error.flatten()
      });
    }

    const clientRepo = AppDataSource.getRepository(Client);
    const client = clientRepo.create({
      ...result.data,
      user_id: userId, // Multi-tenancy (Issue #2)
    });

    await clientRepo.save(client);
    res.status(201).json({ data: client });
  } catch (error) {
    next(error);
  }
});

// PUT /api/clients/:id - Update client
clientsRouter.put('/:id', requireAuth, async (req, res, next) => {
  try {
    const userId = (req as any).userId;
    const clientId = parseInt(req.params.id);

    // Validate input (Issue #7)
    const result = updateClientSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: result.error.flatten()
      });
    }

    const clientRepo = AppDataSource.getRepository(Client);

    // Multi-tenancy: Only update if client belongs to user (Issue #2)
    const client = await clientRepo.findOne({
      where: { id: clientId, user_id: userId },
    });

    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    // TypeORM handles updates safely (no SQL injection - Issue #3 fixed)
    Object.assign(client, result.data);
    await clientRepo.save(client);

    res.json({ data: client });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/clients/:id - Delete client
clientsRouter.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const userId = (req as any).userId;
    const clientId = parseInt(req.params.id);
    const clientRepo = AppDataSource.getRepository(Client);

    // Multi-tenancy: Only delete if client belongs to user (Issue #2)
    const result = await clientRepo.delete({
      id: clientId,
      user_id: userId,
    });

    if (result.affected === 0) {
      return res.status(404).json({ error: 'Client not found' });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});
