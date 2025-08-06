import axios from "axios";
import { Product } from "../types/product";

export const fetchProducts = async (): Promise<Product[]> => {
  const baseUrl = "https://wp-multisite.convertcart.com/wp-json/wc/v3/products";
  const consumerKey = process.env.WOOCOMMERCE_CONSUMER_KEY as string;
  const consumerSecret = process.env.WOOCOMMERCE_CONSUMER_SECRET as string;

  if (!consumerKey || !consumerSecret) {
    throw new Error("Missing WooCommerce consumer key or secret");
  }

  try {
    const response = await axios.get(baseUrl, {
      auth: {
        username: consumerKey,
        password: consumerSecret,
      },
    });

    return response.data.map(
      (product: any): Product => ({
        id: product.id,
        title: product.name,
        price: product.price === "" ? 0 : parseFloat(product.price),
        stock_status: product.stock_status,
        stock_quantity: product.stock_quantity ?? null,
        category: product.categories[0]?.name ?? "",
        tags: product.tags.map((tag: any) => tag.name) ?? [],
        on_sale: product.on_sale,
        created_at: product.date_created,
      })
    );
  } catch (error: any) {
    console.error("Error fetching products:", error.message);
    throw error;
  }
};
