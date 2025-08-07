import axios from "axios";

export const productService = axios.create({
  baseURL: import.meta.env.VITE_PRODUCT_SERVICE_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

export const segmentService = axios.create({
  baseURL: import.meta.env.VITE_SEGMENT_SERVICE_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});
