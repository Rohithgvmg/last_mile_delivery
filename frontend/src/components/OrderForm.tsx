import { useState } from "react";
import {
  previewPrice,
  createOrder,
  type Pricing,
  type PricePreviewInput,
  type CreateOrderResult,
} from "../services/api";

import PriceSummary from "./PriceSummary";



export default function OrderForm() {
  
  const [form, setForm] = useState<PricePreviewInput>({
    pickupAreaId: 1,
    dropAreaId: 2,
    length: 50,
    breadth: 40,
    height: 30,
    actualWeight: 4,
    orderType: "B2C",
    paymentType: "COD",
  });

  const [pricing, setPricing] = useState<Pricing | null>(null);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
const [createdOrder, setCreatedOrder] =
  useState<CreateOrderResult | null>(null);
  const [error, setError] = useState("");

  function handleChange(
    field: keyof PricePreviewInput,
    value: string
  ) {
    setForm((previous) => ({
      ...previous,
      [field]:
        field === "orderType" || field === "paymentType"
          ? value
          : Number(value),
    }));
  }

  async function handlePreview() {
    try {
      setLoading(true);
      setError("");

      const result = await previewPrice(form);

      setPricing(result);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateOrder() {
  try {
    setCreating(true);
    setError("");

    const result = await createOrder(form);

    setCreatedOrder(result);
  } catch (error) {
    setError(
      error instanceof Error
        ? error.message
        : "Failed to create order"
    );
  } finally {
    setCreating(false);
  }
}

  return (
    <div>
      <h1>Create Delivery Order</h1>

      <div>
        <label>Pickup Area ID</label>
        <input
          type="number"
          value={form.pickupAreaId}
          onChange={(e) =>
            handleChange("pickupAreaId", e.target.value)
          }
        />
      </div>

      <div>
        <label>Drop Area ID</label>
        <input
          type="number"
          value={form.dropAreaId}
          onChange={(e) =>
            handleChange("dropAreaId", e.target.value)
          }
        />
      </div>

      <div>
        <label>Length (cm)</label>
        <input
          type="number"
          value={form.length}
          onChange={(e) =>
            handleChange("length", e.target.value)
          }
        />
      </div>

      <div>
        <label>Breadth (cm)</label>
        <input
          type="number"
          value={form.breadth}
          onChange={(e) =>
            handleChange("breadth", e.target.value)
          }
        />
      </div>

      <div>
        <label>Height (cm)</label>
        <input
          type="number"
          value={form.height}
          onChange={(e) =>
            handleChange("height", e.target.value)
          }
        />
      </div>

      <div>
        <label>Actual Weight (kg)</label>
        <input
          type="number"
          value={form.actualWeight}
          onChange={(e) =>
            handleChange("actualWeight", e.target.value)
          }
        />
      </div>

      <div>
        <label>Order Type</label>

        <select
          value={form.orderType}
          onChange={(e) =>
            handleChange("orderType", e.target.value)
          }
        >
          <option value="B2C">B2C</option>
          <option value="B2B">B2B</option>
        </select>
      </div>

      <div>
        <label>Payment Type</label>

        <select
          value={form.paymentType}
          onChange={(e) =>
            handleChange("paymentType", e.target.value)
          }
        >
          <option value="COD">COD</option>
          <option value="PREPAID">PREPAID</option>
        </select>
      </div>

      <br />

      <button onClick={handlePreview} disabled={loading}>
  {loading ? "Calculating..." : "Calculate Price"}
</button>

{error && <p>{error}</p>}

<PriceSummary pricing={pricing} />

{pricing && !createdOrder && (
  <div>
    <button
      onClick={handleCreateOrder}
      disabled={creating}
    >
      {creating ? "Creating Order..." : "Confirm & Create Order"}
    </button>
  </div>
)}
    
    {createdOrder && (
  <div>
    <h2>Order Created Successfully</h2>

    <p>
      Order ID: {createdOrder.order.id}
    </p>

    <p>
      Status: {createdOrder.order.status}
    </p>

    <p>
      Total: ₹{createdOrder.order.totalCharge}
    </p>

    {createdOrder.assignment?.agent && (
      <>
        <h3>Agent Assigned</h3>

        <p>
          Agent ID: {createdOrder.assignment.agent.id}
        </p>

        {createdOrder.assignment.distance !== null && (
          <p>
            Distance:{" "}
            {createdOrder.assignment.distance.toFixed(2)} km
          </p>
        )}
      </>
    )}
  </div>
)}

    </div>
    
    

  );
  
}