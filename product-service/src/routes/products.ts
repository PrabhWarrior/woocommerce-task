import { Router, Request, Response } from 'express';
import Product from '../models/Product';
import { fetchProducts } from '../services/wooCommerceService';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

router.post('/ingest', async (_req: Request, res: Response) => {
  try {
    const products = await fetchProducts();
    console.log("products", products)
    await Product.deleteMany({});
    await Product.insertMany(products);
    res.json({ message: 'Products ingested successfully', count: products.length });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to ingest products' });
  }
});

export default router;