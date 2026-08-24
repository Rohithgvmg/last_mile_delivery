import { Router } from "express";
import { previewPrice } from "../controllers/pricingController";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

router.post("/preview", authenticate, previewPrice);

export default router;