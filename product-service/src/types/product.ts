export interface Product {
    id: number;
    title: string;
    price: number;
    stock_status: string;
    stock_quantity: number | null;
    category: string;
    tags: string[];
    on_sale: boolean;
    created_at: string;
  }