import { Router, Request, Response } from 'express';
import Product from '../models/Product';
import { fetchProducts } from '../services/wooCommerceService';
import mongoose from 'mongoose';
import cron from 'node-cron';

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
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const products = await fetchProducts();
    console.log('products', products);

    await Product.deleteMany({}, { session });
    await Product.insertMany(products, { session });

    await session.commitTransaction();
    res.json({
      message: 'Products ingested successfully',
      count: products.length,
    });
  } catch (error: any) {
    await session.abortTransaction();
    res.status(500).json({ error: 'Failed to ingest products' });
  } finally {
    session.endSession();
  }
});

cron.schedule('0 3 * * *', async () => {
  console.log('Starting scheduled product ingestion at 3 a.m.');
  try {
    const response = await fetch(
      `${process.env.PRODUCT_SERVICE_URL}/products/ingest`,
      {
        method: 'POST',
      }
    );
    const result = await response.json();
    console.log('Scheduled ingestion result:', result);
  } catch (error) {
    console.error('Scheduled ingestion failed:', error);
  }
});

export default router;
