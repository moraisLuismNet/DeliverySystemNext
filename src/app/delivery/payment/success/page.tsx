"use client";
import { Suspense, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { cartService } from "@/services/cart.service";
import { orderService } from "@/services/order.service";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const setItems = useCartStore((s) => s.setItems);

  useEffect(() => {
    if (sessionId) {
      orderService.paymentSuccess(sessionId).catch(() => {});
    }
    cartService
      .clearCart(false)
      .then(() => cartService.getCart())
      .then((res) => setItems(res.data.items || [], res.data.totalAmount || 0))
      .catch(() => setItems([], 0));
  }, []);

  return (
    <div className="container mt-5 text-center">
      <div className="card shadow-sm p-5">
        <i className="pi pi-check-circle text-success" style={{ fontSize: "4rem" }}></i>
        <h2 className="mt-3">Payment Successful!</h2>
        <p className="text-muted">Your order has been placed successfully.</p>
        <div className="mt-4">
          <Link href="/delivery/orders" className="btn btn-primary me-2">View My Orders</Link>
          <Link href="/delivery/restaurants" className="btn btn-outline-secondary">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccess() {
  return (
    <Suspense fallback={<div className="container mt-5 text-center"><div className="spinner-border"></div></div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
