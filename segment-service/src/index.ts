import express, { Express } from "express";
import mongoose from "mongoose";
import cors from "cors";
import segmentRoutes from "./routes/segments";
import { connectDB } from "./config/db";
import dotenv from "dotenv";

dotenv.config();

const app: Express = express();
app.use(cors());
app.use(express.json());
app.use("/segments", segmentRoutes);

connectDB();

const PORT: string | number = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`Segment Service running on port ${PORT}`));
