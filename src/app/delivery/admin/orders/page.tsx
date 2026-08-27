"use client";
import { useState, useEffect, useMemo } from "react";
import { orderService } from "@/services/order.service";
import { IOrder } from "@/interfaces/order.interface";
import { getErrorMessage } from "@/utils/errorHandling";

export default function AdminOrders() {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const fetchOrders = () => {
    setLoading(true);
    orderService
      .getAll()
      .then((res) => setOrders(res.data))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (
    id: number,
    action: "confirm" | "cancel" | "deliver",
  ) => {
    try {
      switch (action) {
        case "confirm":
          await orderService.confirm(id);
          break;
        case "cancel":
          await orderService.cancel(id);
          break;
        case "deliver":
          await orderService.deliver(id);
          break;
      }
      fetchOrders();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const filtered = useMemo(() => {
    if (!searchText) return orders;
    const q = searchText.toLowerCase();
    return orders.filter(
      (o) =>
        o.userName.toLowerCase().includes(q) ||
        new Date(o.createdAt).toLocaleDateString().includes(q),
    );
  }, [orders, searchText]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    setPage(1);
  }, [searchText]);

  if (loading)
    return (
      <div className="container mt-4">
        <div className="spinner-border"></div>
      </div>
    );

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Manage Orders</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          style={{ width: 280 }}
          placeholder="Search by user or date..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>User</th>
              <th>Restaurant</th>
              <th>Order</th>
              <th>Date</th>
              <th>Total</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {paged.map((o) => (
              <tr key={o.id}>
                <td>{o.userName}</td>
                <td>{o.restaurantName}</td>
                <td>{o.id}</td>
                <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                <td>{o.totalAmount.toFixed(2)}€</td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => setExpanded(expanded === o.id ? null : o.id)}
                  >
                    {expanded === o.id ? "Hide" : "Items"}
                  </button>
                </td>
              </tr>
            ))}
            {expanded && orders.find((o) => o.id === expanded) && (
              <tr>
                <td colSpan={6}>
                  <table className="table table-sm table-borderless mb-0">
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th>Qty</th>
                        <th>Unit Price</th>
                        <th>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders
                        .find((o) => o.id === expanded)!
                        .items.map((item) => (
                          <tr key={item.id}>
                            <td>{item.menuItemName}</td>
                            <td>{item.quantity}</td>
                            <td>{item.unitPrice.toFixed(2)}€</td>
                            <td>{item.subtotal.toFixed(2)}€</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 0 && (
        <div className="d-flex justify-content-between align-items-center mt-3">
          <div className="d-flex align-items-center gap-2">
            <span>Rows per page:</span>
            <select
              className="form-select"
              style={{ width: "auto" }}
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
            </select>
            <span className="text-muted">
              {(page - 1) * pageSize + 1} to{" "}
              {Math.min(page * pageSize, filtered.length)} of {filtered.length}
            </span>
          </div>
          <div className="d-flex gap-1">
            <button
              className="btn btn-sm btn-outline-primary"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </button>
            <button
              className="btn btn-sm btn-outline-primary"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
