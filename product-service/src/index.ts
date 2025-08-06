import express, { Express } from 'express';
import cors from 'cors';
import productRoutes from './routes/products';
import { connectDB } from './config/db';
import dotenv from 'dotenv';

dotenv.config();


const app: Express = express();
app.use(cors());
app.use(express.json());
app.use('/products', productRoutes);

connectDB();

const PORT: string | number = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Product Service running on port ${PORT}`));