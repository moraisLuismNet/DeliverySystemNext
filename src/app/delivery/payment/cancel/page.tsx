"use client";
import Link from "next/link";

export default function PaymentCancel() {
  return (
    <div className="container mt-5 text-center">
      <div className="card shadow-sm p-5">
        <i className="pi pi-times-circle text-danger" style={{ fontSize: "4rem" }}></i>
        <h2 className="mt-3">Payment Cancelled</h2>
        <p className="text-muted">Your payment was cancelled. Please try again.</p>
        <div className="mt-4">
          <Link href="/delivery/cart" className="btn btn-primary me-2">Return to Cart</Link>
          <Link href="/delivery/restaurants" className="btn btn-outline-secondary">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}
