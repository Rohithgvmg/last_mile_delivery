import { Request, Response } from "express";
import { createOrder } from "../services/orderService";

export async function createOrderController(
  req: Request,
  res: Response
) {
  try {
    const order = await createOrder(req.body);

    return res.status(201).json(order);
  } catch (error) {
    console.error("Create order failed:", error);

    return res.status(500).json({
      message: "Failed to create order",
    });
  }
}

