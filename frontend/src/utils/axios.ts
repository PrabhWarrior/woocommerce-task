import axios from "axios";

export const productService = axios.create({
  baseURL: "http://localhost:3001/",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const segmentService = axios.create({
  baseURL: "http://localhost:3002/",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});
