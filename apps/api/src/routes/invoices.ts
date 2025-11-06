import express from 'express';
import { z } from 'zod';
import { AppDataSource } from '../data-source.js';
import { Invoice } from '../entities/Invoice.js';
import { InvoiceItem } from '../entities/InvoiceItem.js';
import { requireAuth } from '../middleware/clerk.js';

export const invoicesRouter = express.Router();

// Zod schemas
const invoiceItemSchema = z.object({
  description: z.string().min(1).max(255),
  quantity: z.number().int().min(1),
  unit_price: z.number().min(0),
  total: z.number().min(0),
});

const createInvoiceSchema = z.object({
  client_id: z.number().int(),
  invoice_number: z.string().min(1).max(50),
  status: z.enum(['draft', 'sent', 'paid', 'overdue', 'cancelled']).optional(),
  issue_date: z.string().optional().nullable(),
  due_date: z.string().optional().nullable(),
  paid_amount: z.number().min(0).optional(),
  notes: z.string().optional().nullable(),
  items: z.array(invoiceItemSchema).optional(),
});

// GET /api/invoices
invoicesRouter.get('/', requireAuth, async (req, res, next) => {
  try {
    const userId = (req as any).userId;
    const invoiceRepo = AppDataSource.getRepository(Invoice);

    const invoices = await invoiceRepo.find({
      where: { user_id: userId },
      relations: ['client', 'items'],
      order: { created_at: 'DESC' },
    });

    res.json({ data: invoices });
  } catch (error) {
    next(error);
  }
});

// GET /api/invoices/:id
invoicesRouter.get('/:id', requireAuth, async (req, res, next) => {
  try {
    const userId = (req as any).userId;
    const invoiceId = parseInt(req.params.id);
    const invoiceRepo = AppDataSource.getRepository(Invoice);

    const invoice = await invoiceRepo.findOne({
      where: { id: invoiceId, user_id: userId },
      relations: ['client', 'items'],
    });

    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    res.json({ data: invoice });
  } catch (error) {
    next(error);
  }
});

// POST /api/invoices
invoicesRouter.post('/', requireAuth, async (req, res, next) => {
  try {
    const userId = (req as any).userId;

    const result = createInvoiceSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: result.error.flatten()
      });
    }

    const invoiceRepo = AppDataSource.getRepository(Invoice);
    const { items, ...invoiceData } = result.data;

    // Calculate total
    const total = items?.reduce((sum, item) => sum + item.total, 0) || 0;

    const invoice = invoiceRepo.create({
      ...invoiceData,
      user_id: userId,
      total,
      paid_amount: invoiceData.paid_amount || 0,
      items: items?.map(item => ({ ...item })),
    });

    await invoiceRepo.save(invoice);

    // Fetch with relations
    const savedInvoice = await invoiceRepo.findOne({
      where: { id: invoice.id },
      relations: ['client', 'items'],
    });

    res.status(201).json({ data: savedInvoice });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/invoices/:id
invoicesRouter.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const userId = (req as any).userId;
    const invoiceId = parseInt(req.params.id);
    const invoiceRepo = AppDataSource.getRepository(Invoice);

    const result = await invoiceRepo.delete({
      id: invoiceId,
      user_id: userId,
    });

    if (result.affected === 0) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});
