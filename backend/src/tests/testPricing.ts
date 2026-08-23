import { calculatePrice } from "../services/pricingService";
import { OrderType, PaymentType } from "../generated/prisma/client";

async function test() {
  try {
    const result = await calculatePrice({
      pickupAreaId: 1,
      dropAreaId: 2,

      length: 50,
      breadth: 40,
      height: 30,

      actualWeight: 4,

      orderType: OrderType.B2C,
      paymentType: PaymentType.COD,
    });

    console.log(result);
  } catch (error) {
    console.error("Pricing failed:", error);
  }
}

test();
