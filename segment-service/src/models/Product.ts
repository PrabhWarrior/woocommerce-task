import mongoose, { Schema, Document } from 'mongoose';
import { Product } from '../types/product';

interface ProductDocument extends Product, Document {
  _id: mongoose.Types.ObjectId; 
  id: number; 
}

const productSchema: Schema = new Schema<ProductDocument>({
  id: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  price: {
    type: Number,
    required: false,
    set: (value: any) => {
      if (typeof value === 'string') {
        const parsed = parseFloat(value);
        return isNaN(parsed) ? undefined : parsed;
      }
      return value;
    }
  },
  stock_status: { type: String, required: true },
  stock_quantity: { type: Number, default: null },
  category: { type: String, required: true },
  tags: { type: [String], default: [] },
  on_sale: { type: Boolean, default: false },
  created_at: { type: String, required: true }
});

export default mongoose.model<ProductDocument>('Product', productSchema);
