const API_BASE_URL = "https://last-mile-delivery-063b.onrender.com/api";

export interface StatusHistoryEntry {
  status: string;
  timestamp: string;
}

export interface OrderHistory {
  orderId: number;
  currentStatus: string;
  statusHistory: StatusHistoryEntry[];
} 


export interface PricePreviewInput {
  pickupAreaId: number;
  dropAreaId: number;
  length: number;
  breadth: number;
  height: number;
  actualWeight: number;
  orderType: "B2C" | "B2B";
  paymentType: "COD" | "PREPAID";
}

export interface Pricing {
  zoneType: string;
  volumetricWeight: number;
  chargeableWeight: number;
  ratePerKg: number;
  baseCharge: number;
  codSurcharge: number;
  totalCharge: number;
}

export interface CreateOrderResult {
  order: {
    id: number;
    status: string;
    agentId: number | null;
    totalCharge: number;
  };

  assignment: {
    agent: {
      id: number;
      userId: number;
      latitude: number | null;
      longitude: number | null;
    } | null;
    distance: number | null;
  } | null;
}

export async function createOrder(
  input: PricePreviewInput
): Promise<CreateOrderResult> {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_BASE_URL}/orders`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify(input),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to create order"
    );
  }

  return data;
}



export async function previewPrice(
  input: PricePreviewInput
): Promise<Pricing> {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_BASE_URL}/pricing/preview`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify(input),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to calculate price"
    );
  }

  return data.pricing;
}

export async function getOrderHistory(): Promise<OrderHistory[]> {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_BASE_URL}/orders/history`,
    {
      method: "GET",

      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch order history"
    );
  }

  return data;
}