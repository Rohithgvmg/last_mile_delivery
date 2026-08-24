//testing orderService 

import { OrderType, PaymentType } from "../generated/prisma/client";
import { createOrder } from "../services/orderService";

async function test() {
  try {
    const order = await createOrder({
      userId: 1,

      // Vijayawada -> Guntur, both are Zone 1
      pickupAreaId: 1,
      dropAreaId: 2,

      length: 5,
      breadth: 2,
      height: 3,
      actualWeight: 20,

      orderType: OrderType.B2C,
      paymentType: PaymentType.COD,
    });

    console.log("Order created successfully:");
    console.log(order);
  } catch (error) {
    console.error("Order creation failed:", error);
  }
}

test();

