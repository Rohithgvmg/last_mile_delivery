

//for finding price of the order 


// step A: find the areas
// if both areas zone id is same, then INTRA
// diff zone id, then INTER

// step B: find the rate card from table

// step C: Calculate the weight considering both actual and volumetric weight

// step D: Calculate base charge =
// (weight * rate Per Kg from rate card)

// step E: Apply COD surcharge if opted COD

// finally return total charge of the product


import { prisma } from "../lib/prisma";
import { OrderType, PaymentType, ZoneType } from "../generated/prisma/client";
import {
  calculateVolumetricWeight,
  calculateChargeableWeight,
} from "../utils/weightCalculator";

interface PricingInput {
  pickupAreaId: number;
  dropAreaId: number;

  length: number;
  breadth: number;
  height: number;
  actualWeight: number;

  orderType: OrderType;
  paymentType: PaymentType;
}

interface PricingResult {
  zoneType: ZoneType;

  volumetricWeight: number;
  chargeableWeight: number;

  ratePerKg: number;
  baseCharge: number;
  codSurcharge: number;
  totalCharge: number;
}

export async function calculatePrice(
  input: PricingInput
): Promise<PricingResult> {
  const {
    pickupAreaId,
    dropAreaId,
    length,
    breadth,
    height,
    actualWeight,
    orderType,
    paymentType,
  } = input;

  //validation 
  if (length <= 0 || breadth <= 0 || height <= 0) {
    throw new Error("Package dimensions must be greater than zero");
  }

  if (actualWeight <= 0) {
    throw new Error("Actual weight must be greater than zero");
  }

 
  // finding pickup and drop area names and their zone details using areaId 
  const [pickupArea, dropArea] = await Promise.all([
    prisma.area.findUnique({
      where: {
        id: pickupAreaId,
      },
      include: {
        zone: true,
      },
    }),

    prisma.area.findUnique({
      where: {
        id: dropAreaId,
      },
      include: {
        zone: true,
      },
    }),
  ]);

  if (!pickupArea) {
    throw new Error("Pickup area not found");
  }

  if (!dropArea) {
    throw new Error("Drop area not found");
  }

  //determining inter or intra zone using zoneId
  const zoneType =
    pickupArea.zoneId === dropArea.zoneId
      ? ZoneType.INTRA
      : ZoneType.INTER;

 
  // finding applicable rate card relevant to order type 
  const rateCard = await prisma.rateCard.findUnique({
    where: {
      orderType_zoneType: {
        orderType,
        zoneType,
      },
    },
  });

  if (!rateCard) {
    throw new Error(
      `Rate card not found for ${orderType} ${zoneType}`
    );
  }

 
  const volumetricWeight = calculateVolumetricWeight(
    length,
    breadth,
    height
  );

  //taking the max of actual and volumetric weight 
  const chargeableWeight = calculateChargeableWeight(
    actualWeight,
    volumetricWeight
  );

  //calculating baseCharge 
  const ratePerKg = Number(rateCard.ratePerKg);

  const baseCharge = chargeableWeight * ratePerKg;

  //applying COD surcharge if opted for COD 
  const codSurcharge =
    paymentType === PaymentType.COD
      ? Number(rateCard.codSurcharge)
      : 0;

  //final total charge 
  const totalCharge = baseCharge + codSurcharge;

  return {
    zoneType,
    volumetricWeight,
    chargeableWeight,
    ratePerKg,
    baseCharge,
    codSurcharge,
    totalCharge,
  };
}

