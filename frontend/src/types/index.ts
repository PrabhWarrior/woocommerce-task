export type ProductProps = {
  id: number;
  title: string;
  price: string;
  stock_status: string;
  stock_quantity: number | null;
  category: string;
  tags: string[];
  on_sale: boolean;
  created_at: string;
};
