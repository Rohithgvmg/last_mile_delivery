import { prisma } from "../lib/prisma";
import {
  OrderType,
  PaymentType,
  DeliveryStatus,
} from "../generated/prisma/client";

import { calculatePrice } from "./pricingService";

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

  // 2. Create Order + initial status history atomically
  const order = await prisma.$transaction(async (tx) => {
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

    await tx.orderStatusHistory.create({
      data: {
        orderId: newOrder.id,
        status: DeliveryStatus.CREATED,
        actorId: input.userId,
      },
    });

    return newOrder;
  });

  return order;
}
