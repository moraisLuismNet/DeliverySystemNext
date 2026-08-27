"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import { cartService } from "@/services/cart.service";
import { getErrorMessage } from "@/utils/errorHandling";

const PAGE_SIZE = 10;

export default function Cart() {
  const { items, totalAmount, loading, addToCart, updateQuantity, removeItem, clearCart } = useCart();
  const [error, setError] = useState<string | null>(null);
  const [paying, setPaying] = useState(false);
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const paged = useMemo(
    () => items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [items, page]
  );

  const handleAddOne = async (menuItemId: number) => {
    try {
      await addToCart({ menuItemId, quantity: 1 });
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleRemoveOne = async (item: { id: number; quantity: number }) => {
    try {
      const newQty = item.quantity - 1;
      if (newQty <= 0) {
        await removeItem(item.id);
      } else {
        await updateQuantity(item.id, newQty);
      }
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handlePay = async () => {
    setPaying(true);
    setError(null);
    try {
      const res = await cartService.checkout({ deliveryAddress: "", reference: "", origin: "Web" });
      if (res.data?.url) {
        window.location.href = res.data.url;
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setPaying(false);
    }
  };

  const handleClear = async () => {
    try {
      await clearCart();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  if (loading) return <div className="container mt-4"><div className="spinner-border"></div></div>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">Cart Details</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {items.length === 0 ? (
        <>
          <p className="text-muted text-center">Your cart is empty.</p>
          <div className="text-center">
            <Link href="/delivery/restaurants" className="btn btn-outline-primary">Browse Restaurants</Link>
          </div>
        </>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table" style={{ minWidth: "50rem" }}>
              <thead>
                <tr>
                  <th></th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Subtotal</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {paged.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="d-flex align-items-center gap-3">
                        <img
                          src={item.imageUrl || "https://imgur.com/Zemqvh3.png"}
                          alt={item.menuItemName}
                          style={{ width: 60, height: 40, objectFit: "cover", borderRadius: 4 }}
                        />
                        <span>{item.menuItemName}</span>
                      </div>
                    </td>
                    <td>{item.unitPrice.toFixed(2)}€</td>
                    <td>{item.quantity}</td>
                    <td>{item.subtotal.toFixed(2)}€</td>
                    <td>
                      <div className="d-flex gap-2">
                        {item.stock > 0 && (
                          <button className="btn btn-outline-primary btn-sm" onClick={() => handleAddOne(item.menuItemId)}>
                            <i className="pi pi-shopping-cart me-1"></i>Add to Cart
                          </button>
                        )}
                        <button className="btn btn-outline-danger btn-sm" onClick={() => handleRemoveOne(item)}>
                          <i className="pi pi-trash me-1"></i>Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="mt-3 d-flex justify-content-center">
              <nav className="d-flex align-items-center gap-2">
                <button className="btn btn-outline-secondary btn-sm" onClick={() => setPage(page - 1)} disabled={page === 1}>Previous</button>
                <div className="d-flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i + 1}
                      className="btn btn-outline-secondary btn-sm"
                      style={{ fontWeight: page === i + 1 ? "bold" : "normal" }}
                      onClick={() => setPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button className="btn btn-outline-secondary btn-sm" onClick={() => setPage(page + 1)} disabled={page === totalPages}>Next</button>
              </nav>
            </div>
          )}
          <div className="text-center mt-4">
            <h4 className="fw-bold">Total: {totalAmount.toFixed(2)}€</h4>
            <div className="d-flex justify-content-center gap-2 mt-3">
              <button className="btn btn-success" disabled={paying} onClick={handlePay}>
                <i className="pi pi-credit-card me-1"></i>{paying ? "Processing..." : "Pay"}
              </button>
              <button className="btn btn-danger" onClick={handleClear}>
                <i className="pi pi-trash me-1"></i>Clear Cart
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
