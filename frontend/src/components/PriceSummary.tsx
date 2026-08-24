import type { Pricing } from "../services/api";

interface PriceSummaryProps {
  pricing: Pricing | null;
}

export default function PriceSummary({
  pricing,
}: PriceSummaryProps) {
  if (!pricing) {
    return null;
  }

  return (
    <div>
      <h2>Price Summary</h2>

      <p>Zone: {pricing.zoneType}</p>

      <p>
        Volumetric Weight: {pricing.volumetricWeight} kg
      </p>

      <p>
        Chargeable Weight: {pricing.chargeableWeight} kg
      </p>

      <p>
        Rate: ₹{pricing.ratePerKg}/kg
      </p>

      <p>
        Base Charge: ₹{pricing.baseCharge}
      </p>

      <p>
        COD Surcharge: ₹{pricing.codSurcharge}
      </p>

      <hr />

      <h3>Total: ₹{pricing.totalCharge}</h3>
    </div>
  );
}