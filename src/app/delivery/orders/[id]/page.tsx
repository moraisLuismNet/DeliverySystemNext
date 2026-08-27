"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { orderService } from "@/services/order.service";
import { IOrder } from "@/interfaces/order.interface";
import { getErrorMessage } from "@/utils/errorHandling";

export default function OrderDetail() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const [order, setOrder] = useState<IOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    orderService
      .getById(Number(id))
      .then((res) => setOrder(res.data))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [id]);

  const handleCancel = async () => {
    if (!order) return;
    try {
      const res = await orderService.cancel(order.id);
      setOrder(res.data);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  if (loading) return <div className="container mt-4"><div className="spinner-border"></div></div>;
  if (error) return <div className="container mt-4"><div className="alert alert-danger">{error}</div></div>;
  if (!order) return <div className="container mt-4"><div className="alert alert-warning">Order not found</div></div>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Order #{order.id}</h2>
      <div className="card shadow-sm">
        <div className="card-body">
          <p><strong>Restaurant:</strong> {order.restaurantName}</p>
          <p><strong>Status:</strong> <span className={`badge bg-${order.status === "Delivered" ? "success" : order.status === "Cancelled" ? "danger" : "warning"}`}>{order.status}</span></p>
          <p><strong>Total:</strong> {order.totalAmount.toFixed(2)}€</p>
          <p><strong>Delivery Address:</strong> {order.deliveryAddress}</p>
          <p><strong>Reference:</strong> {order.reference}</p>
          <p><strong>Created:</strong> {new Date(order.createdAt).toLocaleString()}</p>
          {order.confirmedAt && <p><strong>Confirmed:</strong> {new Date(order.confirmedAt).toLocaleString()}</p>}
          {order.deliveredAt && <p><strong>Delivered:</strong> {new Date(order.deliveredAt).toLocaleString()}</p>}

          <h5 className="mt-3">Items</h5>
          <ul className="list-group mb-3">
            {order.items.map((item) => (
              <li key={item.id} className="list-group-item d-flex justify-content-between">
                <span>{item.menuItemName} x{item.quantity}</span>
                <span>{item.subtotal.toFixed(2)}€</span>
              </li>
            ))}
          </ul>

          {order.status === "Pending" && (
            <button className="btn btn-danger" onClick={handleCancel}>Cancel Order</button>
          )}
          <button className="btn btn-outline-secondary ms-2" onClick={() => router.push("/delivery/orders")}>Back</button>
        </div>
      </div>
    </div>
  );
}
