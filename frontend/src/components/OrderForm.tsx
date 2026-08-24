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

  function validateForm(): string | null {
    if (
      !Number.isInteger(form.pickupAreaId) ||
      form.pickupAreaId < 1
    ) {
      return "Pickup area must be a valid area ID.";
    }

    if (
      !Number.isInteger(form.dropAreaId) ||
      form.dropAreaId < 1
    ) {
      return "Drop area must be a valid area ID.";
    }

    if (form.pickupAreaId === form.dropAreaId) {
      return "Pickup and drop areas must be different.";
    }

    if (!Number.isFinite(form.length) || form.length <= 0) {
      return "Length must be greater than 0.";
    }

    if (!Number.isFinite(form.breadth) || form.breadth <= 0) {
      return "Breadth must be greater than 0.";
    }

    if (!Number.isFinite(form.height) || form.height <= 0) {
      return "Height must be greater than 0.";
    }

    if (
      !Number.isFinite(form.actualWeight) ||
      form.actualWeight <= 0
    ) {
      return "Actual weight must be greater than 0.";
    }

    return null;
  }

  async function handlePreview() {
    setError("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);

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
    setError("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setCreating(true);

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

  function handleNewOrder() {
  setCreatedOrder(null);
  setPricing(null);
  setError("");

  setForm({
    pickupAreaId: 1,
    dropAreaId: 2,
    length: 50,
    breadth: 40,
    height: 30,
    actualWeight: 4,
    orderType: "B2C",
    paymentType: "COD",
  });
}

  return (
  <main className="order-page">

    <div className="page-header">
      <h1>Create Delivery Order</h1>

      <p className="section-description">
        Enter your package details and get an instant
        delivery estimate.
      </p>
    </div>


    {/* SUCCESS CARD — SHOW FIRST AFTER ORDER CREATION */}

    {createdOrder && (
      <div className="success-card">

        <div className="success-header">

          <span className="success-icon">
            ✓
          </span>

          Order Created Successfully

        </div>


        <div className="order-info-grid">

          <div className="info-box">
            <div className="info-label">
              Order ID
            </div>

            <div className="info-value">
              #{createdOrder.order.id}
            </div>
          </div>


          <div className="info-box">
            <div className="info-label">
              Status
            </div>

            <div className="info-value">
              {createdOrder.order.status}
            </div>
          </div>


          <div className="info-box">
            <div className="info-label">
              Total
            </div>

            <div className="info-value">
              ₹{createdOrder.order.totalCharge}
            </div>
          </div>

        </div>


        {createdOrder.assignment?.agent && (
          <div className="agent-card">

            <div className="agent-title">
              🚚 Agent Assigned
            </div>

            <p>
              Agent #{createdOrder.assignment.agent.id}
            </p>

            {createdOrder.assignment.distance !== null && (
              <p>
                Distance from pickup:{" "}
                <strong>
                  {createdOrder.assignment.distance.toFixed(2)} km
                </strong>
              </p>
            )}

          </div>
        )}

      </div>
    )}


    {/* FORM + PRICE SUMMARY */}

    <div className="order-form">

      {/* LEFT SIDE */}

      <div className="form-card">

        <h2 className="section-title">
          Delivery Details
        </h2>

        <div className="form-field">
          <label>Pickup Area</label>

          <input
            type="text"
            inputMode="numeric"
            value={form.pickupAreaId}
            onFocus={(e) => e.currentTarget.select()}
            onChange={(e) =>
              handleChange(
                "pickupAreaId",
                e.target.value
              )
            }
          />
        </div>


        <div className="form-field">
          <label>Drop Area</label>

          <input
            type="text"
            inputMode="numeric"
            value={form.dropAreaId}
            onFocus={(e) => e.currentTarget.select()}
            onChange={(e) =>
              handleChange(
                "dropAreaId",
                e.target.value
              )
            }
          />
        </div>


        <h2 className="section-title">
          Package Details
        </h2>


        <div className="form-field">
          <label>Length (cm)</label>

          <input
            type="text"
            inputMode="decimal"
            value={form.length}
            onFocus={(e) => e.currentTarget.select()}
            onChange={(e) =>
              handleChange(
                "length",
                e.target.value
              )
            }
          />
        </div>


        <div className="form-field">
          <label>Breadth (cm)</label>

          <input
            type="text"
            inputMode="decimal"
            value={form.breadth}
            onFocus={(e) => e.currentTarget.select()}
            onChange={(e) =>
              handleChange(
                "breadth",
                e.target.value
              )
            }
          />
        </div>


        <div className="form-field">
          <label>Height (cm)</label>

          <input
            type="text"
            inputMode="decimal"
            value={form.height}
            onFocus={(e) => e.currentTarget.select()}
            onChange={(e) =>
              handleChange(
                "height",
                e.target.value
              )
            }
          />
        </div>


        <div className="form-field">
          <label>Actual Weight (kg)</label>

          <input
            type="text"
            inputMode="decimal"
            value={form.actualWeight}
            onFocus={(e) => e.currentTarget.select()}
            onChange={(e) =>
              handleChange(
                "actualWeight",
                e.target.value
              )
            }
          />
        </div>


        <h2 className="section-title">
          Order Preferences
        </h2>


        <div className="form-field">
          <label>Order Type</label>

          <select
            value={form.orderType}
            onChange={(e) =>
              handleChange(
                "orderType",
                e.target.value
              )
            }
          >
            <option value="B2C">B2C</option>
            <option value="B2B">B2B</option>
          </select>
        </div>


        <div className="form-field">
          <label>Payment Type</label>

          <select
            value={form.paymentType}
            onChange={(e) =>
              handleChange(
                "paymentType",
                e.target.value
              )
            }
          >
            <option value="COD">
              Cash on Delivery
            </option>

            <option value="PREPAID">
              Prepaid
            </option>
          </select>
        </div>


        {error && (
          <div className="error-message">
            {error}
          </div>
        )}


        <button
          className="primary-button"
          onClick={handlePreview}
          disabled={loading}
        >
          {loading
            ? "Calculating..."
            : "Calculate Delivery Price"}
        </button>

      </div>


      {/* RIGHT SIDE */}

      <div className="order-summary-column">

        <div className="sticky-summary">

          <PriceSummary pricing={pricing} />

         {pricing && !createdOrder && (
  <button
    className="create-order-button"
    onClick={handleCreateOrder}
    disabled={creating}
  >
    {creating
      ? "Creating Order..."
      : "Confirm & Create Order"}
  </button>
)}

{createdOrder && (
  <button
    className="create-order-button new-order-button"
    onClick={handleNewOrder}
  >
    Create New Order
  </button>
)}

        </div>

      </div>

    </div>

  </main>
);
}