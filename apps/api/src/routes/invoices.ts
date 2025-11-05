import express from 'express';
import { getAllInvoices, getInvoiceById } from '@repo/database/schema';

export const invoicesRouter = express.Router();

invoicesRouter.get('/', async (req, res) => {
  try {
    const invoices = await getAllInvoices();
    res.json({ data: invoices });
  } catch (error) {
    console.error('Failed to fetch invoices:', error);
    res.status(500).json({ error: 'Failed to fetch invoices' });
  }
});

invoicesRouter.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid invoice ID' });
    }

    const invoice = await getInvoiceById(id);
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    res.json({ data: invoice });
  } catch (error) {
    console.error('Failed to fetch invoice:', error);
    res.status(500).json({ error: 'Failed to fetch invoice' });
  }
});
