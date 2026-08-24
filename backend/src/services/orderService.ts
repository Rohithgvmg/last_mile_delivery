import { prisma } from "../lib/prisma";
import {
  OrderType,
  PaymentType,
  DeliveryStatus,
} from "../generated/prisma/client";

import { calculatePrice } from "./pricingService";
import { assignOrder } from "./assignmentService";

interface CreateOrderInput {
  userId: number;

  pickupAreaId: number;
  dropAreaId: number;

  length: number;
  breadth: number;
  height: number;
  actualWeight: number;

  orderType: OrderType;
  paymentType: PaymentType;
}

export async function createOrder(input: CreateOrderInput) {
  // 1. Calculate price first
  const pricing = await calculatePrice({
    pickupAreaId: input.pickupAreaId,
    dropAreaId: input.dropAreaId,

    length: input.length,
    breadth: input.breadth,
    height: input.height,
    actualWeight: input.actualWeight,

    orderType: input.orderType,
    paymentType: input.paymentType,
  });

  // 2. Create Order + initial status history  + auto assigns agent + status history atomically
  const result = await prisma.$transaction(async (tx) => {
    const newOrder = await tx.order.create({
      data: {
        userId: input.userId,

        pickupAreaId: input.pickupAreaId,
        dropAreaId: input.dropAreaId,

        length: input.length,
        breadth: input.breadth,
        height: input.height,
        actualWeight: input.actualWeight,

        volumetricWeight: pricing.volumetricWeight,
        chargeableWeight: pricing.chargeableWeight,

        orderType: input.orderType,
        paymentType: input.paymentType,

        ratePerKg: pricing.ratePerKg,
        baseCharge: pricing.baseCharge,
        codSurcharge: pricing.codSurcharge,
        totalCharge: pricing.totalCharge,

        status: DeliveryStatus.CREATED,
      },
    });
    //initial history as order created 
    await tx.orderStatusHistory.create({
      data: {
        orderId: newOrder.id,
        status: DeliveryStatus.CREATED,
        actorId: input.userId,
      },
    });

     // Automatically try to assign an available agent
    const assignment = await assignOrder(tx, {
        orderId: newOrder.id,
        pickupAreaId: input.pickupAreaId,
    });

    return {
        order: assignment?.order ?? newOrder,
        assignment,
    };
    
  });

  return result;
}
