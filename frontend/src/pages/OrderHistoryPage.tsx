import { useEffect, useState } from "react";

import {
  getOrderHistory,
  type OrderHistory,
} from "../services/api";

interface OrderHistoryPageProps {
  onNewOrder: () => void;
}

export default function OrderHistoryPage({
  onNewOrder,
}: OrderHistoryPageProps) {
  const [orders, setOrders] = useState<OrderHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadHistory() {
      try {
        setLoading(true);
        setError("");

        const result = await getOrderHistory();

        setOrders(result);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load order history"
        );
      } finally {
        setLoading(false);
      }
    }

    loadHistory();
  }, []);

  function formatDate(timestamp: string) {
    return new Date(timestamp).toLocaleString();
  }

  if (loading) {
    return (
      <main className="history-page">
        <div className="history-header">
          <h1>Order History</h1>
          <p>Loading your orders...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="history-page">

      <div className="history-header">

        <div>
          <h1>Order History</h1>

          <p>
            Track the current status and status updates
            of your orders.
          </p>
        </div>

        <button
          className="history-new-order-button"
          onClick={onNewOrder}
        >
          + New Order
        </button>

      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {!error && orders.length === 0 && (
        <div className="empty-history-card">
          <h2>No orders yet</h2>

          <p>
            Create your first delivery order to see
            its status history here.
          </p>

          <button
            className="primary-button"
            onClick={onNewOrder}
          >
            Create Your First Order
          </button>
        </div>
      )}

      <div className="history-list">

        {orders.map((order) => (

          <div
            className="history-order-card"
            key={order.orderId}
          >

            <div className="history-order-header">

              <div>
                <div className="history-order-label">
                  Order
                </div>

                <h2>
                  #{order.orderId}
                </h2>
              </div>

              <div
                className={`status-badge status-${order.currentStatus.toLowerCase()}`}
              >
                {order.currentStatus.replaceAll("_", " ")}
              </div>

            </div>


            <div className="history-section">

              <h3>Status History</h3>

              <div className="status-timeline">

                {order.statusHistory.map(
                  (entry, index) => (

                    <div
                      className="timeline-item"
                      key={`${entry.timestamp}-${index}`}
                    >

                      <div className="timeline-dot" />

                      <div className="timeline-content">

                        <strong>
                          {entry.status.replaceAll(
                            "_",
                            " "
                          )}
                        </strong>

                        <span>
                          {formatDate(
                            entry.timestamp
                          )}
                        </span>

                      </div>

                    </div>

                  )
                )}

              </div>

            </div>

          </div>

        ))}

      </div>

    </main>
  );
}