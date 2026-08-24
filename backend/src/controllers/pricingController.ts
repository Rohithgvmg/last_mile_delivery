import { Request, Response } from "express";
import { OrderType, PaymentType } from "../generated/prisma/client";
import { calculatePrice } from "../services/pricingService";

export async function previewPrice(req: Request, res: Response) {
    try {
        const {
            pickupAreaId,
            dropAreaId,
            length,
            breadth,
            height,
            actualWeight,
            orderType,
            paymentType,
        } = req.body;

        const pricing = await calculatePrice({
            pickupAreaId: Number(pickupAreaId),
            dropAreaId: Number(dropAreaId),

            length: Number(length),
            breadth: Number(breadth),
            height: Number(height),
            actualWeight: Number(actualWeight),

            orderType: orderType as OrderType,
            paymentType: paymentType as PaymentType,
        });

        return res.status(200).json({
            message: "Price calculated successfully",
            pricing,
        });
    } catch (error) {
        console.error("Price calculation failed:", error);

        return res.status(400).json({
            message:
                error instanceof Error
                    ? error.message
                    : "Unable to calculate price",
        });
    }
}
