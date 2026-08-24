import { Router } from "express";
import { authenticate } from "../middleware/authMiddleware";
import { createOrderController,getOrderHistoryController } from "../controllers/orderController";

const router = Router();

router.post(
    "/",
    authenticate,
    createOrderController
);

router.get(
  "/history",
  authenticate,
  getOrderHistoryController
);

export default router;

