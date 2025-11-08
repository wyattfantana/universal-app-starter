import express from 'express';
import { z } from 'zod';
import { AppDataSource } from '../data-source.js';
import { Product } from '../entities/Product.js';
import { requireAuth } from '../middleware/auth.js';
import { ILike } from 'typeorm';
import { parsePaginationParams, createPaginationMeta } from '../types/pagination.js';

export const productsRouter = express.Router();

// Zod schemas
const createProductSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional().nullable(),
  sku: z.string().max(100).optional().nullable(),
  price: z.number().min(0),
  category: z.string().max(50).optional().nullable(),
});

const updateProductSchema = createProductSchema.partial();

// GET /api/products - List products with optional search (with pagination)
productsRouter.get('/', requireAuth, async (req, res, next) => {
  try {
    const userId = (req as any).userId;
    const search = req.query.search as string | undefined;
    const productRepo = AppDataSource.getRepository(Product);

    // Parse pagination parameters
    const { page, limit } = parsePaginationParams(req.query);
    const skip = (page - 1) * limit;

    let where: any = { user_id: userId };

    // Search functionality
    if (search) {
      where = [
        { user_id: userId, name: ILike(`%${search}%`) },
        { user_id: userId, description: ILike(`%${search}%`) },
      ];
    }

    const [products, total] = await productRepo.findAndCount({
      where,
      order: { created_at: 'DESC' },
      skip,
      take: limit,
    });

    res.json({
      data: products,
      pagination: createPaginationMeta(page, limit, total),
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/products/:id
productsRouter.get('/:id', requireAuth, async (req, res, next) => {
  try {
    const userId = (req as any).userId;
    const productId = parseInt(req.params.id);
    const productRepo = AppDataSource.getRepository(Product);

    const product = await productRepo.findOne({
      where: { id: productId, user_id: userId },
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ data: product });
  } catch (error) {
    next(error);
  }
});

// POST /api/products
productsRouter.post('/', requireAuth, async (req, res, next) => {
  try {
    const userId = (req as any).userId;

    const result = createProductSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: result.error.flatten()
      });
    }

    const productRepo = AppDataSource.getRepository(Product);
    const product = productRepo.create({
      ...result.data,
      user_id: userId,
    });

    await productRepo.save(product);
    res.status(201).json({ data: product });
  } catch (error) {
    next(error);
  }
});

// PUT /api/products/:id
productsRouter.put('/:id', requireAuth, async (req, res, next) => {
  try {
    const userId = (req as any).userId;
    const productId = parseInt(req.params.id);

    const result = updateProductSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: result.error.flatten()
      });
    }

    const productRepo = AppDataSource.getRepository(Product);
    const product = await productRepo.findOne({
      where: { id: productId, user_id: userId },
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    Object.assign(product, result.data);
    await productRepo.save(product);

    res.json({ data: product });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/products/:id
productsRouter.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const userId = (req as any).userId;
    const productId = parseInt(req.params.id);
    const productRepo = AppDataSource.getRepository(Product);

    const result = await productRepo.delete({
      id: productId,
      user_id: userId,
    });

    if (result.affected === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});
