import express from 'express';
import { z } from 'zod';
import { AppDataSource } from '../data-source.js';
import { Estimate } from '../entities/Estimate.js';
import { EstimateItem } from '../entities/EstimateItem.js';
import { requireAuth } from '../middleware/clerk.js';

export const estimatesRouter = express.Router();

// Zod schemas
const estimateItemSchema = z.object({
  description: z.string().min(1).max(255),
  quantity: z.number().int().min(1),
  unit_price: z.number().min(0),
  total: z.number().min(0),
});

const createEstimateSchema = z.object({
  client_id: z.number().int(),
  estimate_number: z.string().min(1).max(50),
  status: z.enum(['draft', 'sent', 'accepted', 'rejected']).optional(),
  issue_date: z.string().optional().nullable(),
  expiry_date: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  items: z.array(estimateItemSchema).optional(),
});

// GET /api/estimates
estimatesRouter.get('/', requireAuth, async (req, res, next) => {
  try {
    const userId = (req as any).userId;
    const estimateRepo = AppDataSource.getRepository(Estimate);

    const estimates = await estimateRepo.find({
      where: { user_id: userId },
      relations: ['client', 'items'],
      order: { created_at: 'DESC' },
    });

    res.json({ data: estimates });
  } catch (error) {
    next(error);
  }
});

// GET /api/estimates/:id
estimatesRouter.get('/:id', requireAuth, async (req, res, next) => {
  try {
    const userId = (req as any).userId;
    const estimateId = parseInt(req.params.id);
    const estimateRepo = AppDataSource.getRepository(Estimate);

    const estimate = await estimateRepo.findOne({
      where: { id: estimateId, user_id: userId },
      relations: ['client', 'items'],
    });

    if (!estimate) {
      return res.status(404).json({ error: 'Estimate not found' });
    }

    res.json({ data: estimate });
  } catch (error) {
    next(error);
  }
});

// POST /api/estimates
estimatesRouter.post('/', requireAuth, async (req, res, next) => {
  try {
    const userId = (req as any).userId;

    const result = createEstimateSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: result.error.flatten()
      });
    }

    const estimateRepo = AppDataSource.getRepository(Estimate);
    const { items, ...estimateData } = result.data;

    // Calculate total
    const total = items?.reduce((sum, item) => sum + item.total, 0) || 0;

    const estimate = estimateRepo.create({
      ...estimateData,
      user_id: userId,
      total,
      items: items?.map(item => ({ ...item })),
    });

    await estimateRepo.save(estimate);

    // Fetch with relations
    const savedEstimate = await estimateRepo.findOne({
      where: { id: estimate.id },
      relations: ['client', 'items'],
    });

    res.status(201).json({ data: savedEstimate });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/estimates/:id
estimatesRouter.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const userId = (req as any).userId;
    const estimateId = parseInt(req.params.id);
    const estimateRepo = AppDataSource.getRepository(Estimate);

    const result = await estimateRepo.delete({
      id: estimateId,
      user_id: userId,
    });

    if (result.affected === 0) {
      return res.status(404).json({ error: 'Estimate not found' });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});
