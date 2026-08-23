import { Router } from "express";
import { authenticate } from "../middleware/authMiddleware";
import { createOrderController } from "../controllers/orderController";

const router = Router();

router.post(
    "/",
    authenticate,
    createOrderController
);

export default router;

