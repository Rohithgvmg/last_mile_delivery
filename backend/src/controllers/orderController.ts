import { Request, Response } from "express";
import { createOrder,getOrderHistory } from "../services/orderService";
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

export async function getOrderHistoryController(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const userId = req.user!.userId;

    const history = await getOrderHistory(userId);

    return res.status(200).json(history);
  } catch (error) {
    console.error("Get order history failed:", error);

    return res.status(500).json({
      message: "Failed to fetch order history",
    });
  }
}


