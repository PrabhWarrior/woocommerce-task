import { Router, Request, Response } from "express";
import { evaluateSegment } from "../services/segmentEvaluator";

const router = Router();

router.post("/evaluate", async (req, res) => {
  try {
    const { segment, filter } = req.body;
    console.log("Received segment input:", req.body);
    const input = segment || filter;
    if (!input || typeof input !== "string") {
      return res
        .status(400)
        .json({ error: "Invalid or missing segment input" });
    }
    const conditions = input
      .split("\n")
      .map((c: string) => c.trim())
      .filter(Boolean);
    const products = await evaluateSegment(conditions);

    res.json(products);
  } catch (error) {
    console.error("API error:", error);
    res.status(500).json({ error: "Failed to evaluate segment" });
  }
});

export default router;
