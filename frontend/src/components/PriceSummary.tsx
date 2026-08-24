import type { Pricing } from "../services/api";

interface PriceSummaryProps {
  pricing: Pricing | null;
}

export default function PriceSummary({
  pricing,
}: PriceSummaryProps) {

  if (!pricing) {
    return (
      <div className="summary-card">
        <h2 className="section-title">
          Price Summary
        </h2>

        <p className="section-description">
          Calculate the price to see your delivery estimate.
        </p>
      </div>
    );
  }

  return (
    <div className="summary-card">

      <h2 className="section-title">
        Price Summary
      </h2>

      <div className="price-row">
        <span>Delivery Zone</span>
        <strong>{pricing.zoneType}</strong>
      </div>

      <div className="price-row">
        <span>Volumetric Weight</span>
        <strong>
          {pricing.volumetricWeight} kg
        </strong>
      </div>

      <div className="price-row">
        <span>Chargeable Weight</span>
        <strong>
          {pricing.chargeableWeight} kg
        </strong>
      </div>

      <div className="price-row">
        <span>Rate</span>
        <strong>
          ₹{pricing.ratePerKg}/kg
        </strong>
      </div>

      <div className="price-row">
        <span>Base Charge</span>
        <strong>
          ₹{pricing.baseCharge}
        </strong>
      </div>

      <div className="price-row">
        <span>COD Surcharge</span>
        <strong>
          ₹{pricing.codSurcharge}
        </strong>
      </div>

      <div className="price-total">
        <span>Total</span>

        <span>
          ₹{pricing.totalCharge}
        </span>
      </div>

    </div>
  );
}