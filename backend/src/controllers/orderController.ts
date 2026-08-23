import { Request, Response } from "express";
import { createOrder } from "../services/orderService";
import { AuthenticatedRequest } from "../middleware/authMiddleware";

export async function createOrderController(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const userId=req.user!.userId;
    const order = await createOrder({...req.body,userId});

    return res.status(201).json(order);
  } catch (error) {
    console.error("Create order failed:", error);

    return res.status(500).json({
      message: "Failed to create order",
    });
  }
}


