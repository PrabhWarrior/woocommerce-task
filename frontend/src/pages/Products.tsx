import { useEffect, useState, useRef } from "react";
import Product from "../components/Product";
import { productService } from "../utils/axios";
import type { ProductProps } from "../types";

const Products = () => {
  const [fallback, setFallback] = useState("Loading Products...");
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchProducts = async () => {
    setError(null);
    setFallback("Loading Products...");
    abortControllerRef.current?.abort(); // Abort any ongoing request
    const controller = new AbortController();
    abortControllerRef.current = controller;
    try {
      const response = await productService.get("/products", {
        signal: controller.signal,
      });
      setProducts(response.data);
      if (response.data.length === 0) {
        setFallback("No Products Found");
      }
    } catch (err: any) {
      if (err.name === "CanceledError" || err.name === "AbortError") {
        return;
      }
      setError("Failed to load products.");
      setProducts([]);
      setFallback("No Products Found");
    }
  };

  useEffect(() => {
    fetchProducts();
    return () => {
      abortControllerRef.current?.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="p-4 rounded-xl flex justify-between mt-10">
        <h1 className="text-5xl font-bold">Products</h1>
        <button
          className="btn btn-outline"
          onClick={async (event) => {
            const button = event.currentTarget;
            button.querySelector("#button-content")?.classList.add("loading");
            await fetchProducts();
            button
              .querySelector("#button-content")
              ?.classList.remove("loading");
          }}
        >
          <span id="button-content" className="flex items-center gap-2">
            <span className="material-symbols-outlined">autorenew</span> Load
            Products
          </span>
        </button>
      </div>
      <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(25em,1fr))] mt-5">
        {error && (
          <div className="col-span-full text-center text-xl font-semibold text-red-500">
            {error}
          </div>
        )}
        {!error && products.length === 0 && (
          <div className="col-span-full text-center text-xl font-semibold">
            {fallback}
          </div>
        )}
        {products.map((product) => (
          <Product key={product.id} {...product} />
        ))}
      </div>
    </>
  );
};

export default Products;
