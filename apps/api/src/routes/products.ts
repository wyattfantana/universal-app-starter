import express from 'express';
import { getAllProducts, getProductById, searchProducts } from '@repo/database/schema';

export const productsRouter = express.Router();

productsRouter.get('/', async (req, res) => {
  try {
    const { search } = req.query;

    if (search && typeof search === 'string') {
      const products = await searchProducts(search);
      return res.json({ data: products });
    }

    const products = await getAllProducts();
    res.json({ data: products });
  } catch (error) {
    console.error('Failed to fetch products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

productsRouter.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid product ID' });
    }

    const product = await getProductById(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ data: product });
  } catch (error) {
    console.error('Failed to fetch product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});
