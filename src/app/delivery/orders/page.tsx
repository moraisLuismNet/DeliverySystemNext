"use client";
import { useState, useEffect, useMemo, Fragment } from "react";
import { orderService } from "@/services/order.service";
import { IOrder } from "@/interfaces/order.interface";
import { getErrorMessage } from "@/utils/errorHandling";

export default function Orders() {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState("");
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  useEffect(() => {
    orderService
      .getByUser()
      .then((res) => setOrders(res.data))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  const filteredOrders = useMemo(() => {
    if (!searchText) return orders;
    const q = searchText.toLowerCase();
    return orders.filter((o) =>
      new Date(o.createdAt).toLocaleDateString().toLowerCase().includes(q)
    );
  }, [orders, searchText]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / pageSize));
  const pagedOrders = filteredOrders.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  const toggleOrder = (id: number) => {
    setExpandedOrderId((prev) => (prev === id ? null : id));
  };

  if (loading) return <div className="container mt-4"><div className="spinner-border"></div></div>;
  if (error) return <div className="container mt-4"><div className="alert alert-danger">{error}</div></div>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">My Orders</h2>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by date"
          value={searchText}
          onChange={(e) => { setSearchText(e.target.value); setPage(1); }}
        />
      </div>

      {filteredOrders.length === 0 ? (
        <div className="alert alert-info">No orders found</div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th style={{ width: 40 }}></th>
                  <th>Date</th>
                  <th>Restaurant</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {pagedOrders.map((o) => (
                  <Fragment key={o.id}><tr>
                    <td>
                      <button
                        className="btn btn-sm"
                        style={{ cursor: "pointer" }}
                        onClick={() => toggleOrder(o.id)}
                      >
                        <i className={`pi ${expandedOrderId === o.id ? "pi-chevron-up" : "pi-chevron-down"}`}></i>
                      </button>
                    </td>
                    <td>{new Date(o.createdAt).toLocaleString()}</td>
                    <td>{o.restaurantName}</td>
                    <td>{o.totalAmount.toFixed(2)}€</td>
                  </tr>
                  {expandedOrderId === o.id && (
                    <tr key={`detail-${o.id}`}>
                      <td colSpan={4} className="p-0">
                        <div className="p-3">
                          <h6>Items:</h6>
                          <table className="table table-sm table-bordered mb-0">
                            <thead className="table-light">
                              <tr>
                                <th>Item</th>
                                <th>Unit Price</th>
                                <th>Qty</th>
                                <th>Subtotal</th>
                              </tr>
                            </thead>
                            <tbody>
                              {o.items.map((item) => (
                                <tr key={item.id}>
                                  <td>{item.menuItemName}</td>
                                  <td>{item.unitPrice.toFixed(2)}€</td>
                                  <td>{item.quantity}</td>
                                  <td>{item.subtotal.toFixed(2)}€</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  )}
                  </Fragment>)
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 0 && (
            <div className="d-flex justify-content-between align-items-center mt-3">
              <div className="d-flex align-items-center gap-2">
                <span className="text-muted small">
                  {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, filteredOrders.length)} of {filteredOrders.length} orders
                </span>
                <select
                  className="form-select form-select-sm"
                  style={{ width: "auto" }}
                  value={pageSize}
                  onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                </select>
              </div>
              <nav>
                <ul className="pagination pagination-sm mb-0">
                  <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                    <button className="page-link" onClick={() => setPage(page - 1)}>Previous</button>
                  </li>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <li key={p} className={`page-item ${p === page ? "active" : ""}`}>
                      <button className="page-link" onClick={() => setPage(p)}>{p}</button>
                    </li>
                  ))}
                  <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
                    <button className="page-link" onClick={() => setPage(page + 1)}>Next</button>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
}
