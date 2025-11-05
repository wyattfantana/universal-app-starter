import express from 'express';
import { getAllEstimates, getEstimateById } from '@repo/database/schema';

export const estimatesRouter = express.Router();

estimatesRouter.get('/', async (req, res) => {
  try {
    const estimates = await getAllEstimates();
    res.json({ data: estimates });
  } catch (error) {
    console.error('Failed to fetch estimates:', error);
    res.status(500).json({ error: 'Failed to fetch estimates' });
  }
});

estimatesRouter.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid estimate ID' });
    }

    const estimate = await getEstimateById(id);
    if (!estimate) {
      return res.status(404).json({ error: 'Estimate not found' });
    }

    res.json({ data: estimate });
  } catch (error) {
    console.error('Failed to fetch estimate:', error);
    res.status(500).json({ error: 'Failed to fetch estimate' });
  }
});
