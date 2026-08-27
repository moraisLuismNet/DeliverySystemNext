"use client";
import { useState, useEffect, useMemo } from "react";
import { cartService } from "@/services/cart.service";
import { ICart } from "@/interfaces/cart.interface";
import { getErrorMessage } from "@/utils/errorHandling";

export default function AdminCarts() {
  const [carts, setCarts] = useState<ICart[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  useEffect(() => {
    cartService
      .adminGetAllCarts()
      .then((res) => setCarts(res.data))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (!searchText) return carts;
    const q = searchText.toLowerCase();
    return carts.filter((c) => c.userId.toLowerCase().includes(q));
  }, [carts, searchText]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => { setPage(1); }, [searchText]);

  if (loading) return <div className="container mt-4"><div className="spinner-border"></div></div>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Manage Carts</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          style={{ width: 280 }}
          placeholder="Search by user..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>User</th>
              <th>Items</th>
              <th>Total</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {paged.map((c) => (
              <tr key={c.id}>
                <td>{c.userId}</td>
                <td>{c.items?.length || 0}</td>
                <td>{c.totalAmount.toFixed(2)}€</td>
                <td>
                  <button className="btn btn-sm btn-outline-secondary" onClick={() => setExpanded(expanded === c.id ? null : c.id)}>
                    {expanded === c.id ? "Hide" : "Items"}
                  </button>
                </td>
              </tr>
            ))}
            {expanded && carts.find((c) => c.id === expanded) && (
              <tr>
                <td colSpan={4}>
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
                      {carts.find((c) => c.id === expanded)!.items.map((item) => (
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
            <select className="form-select" style={{ width: "auto" }} value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}>
              <option value={5}>5</option>
              <option value={10}>10</option>
            </select>
            <span className="text-muted">
              {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, filtered.length)} of {filtered.length}
            </span>
          </div>
          <div className="d-flex gap-1">
            <button className="btn btn-sm btn-outline-primary" disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</button>
            <button className="btn btn-sm btn-outline-primary" disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</button>
          </div>
        </div>
      )}
    </div>
  );
}
