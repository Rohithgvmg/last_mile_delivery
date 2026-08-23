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

      length: 50,
      breadth: 40,
      height: 30,
      actualWeight: 4,

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

