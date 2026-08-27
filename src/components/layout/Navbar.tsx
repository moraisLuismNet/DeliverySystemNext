"use client";
import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../store/authStore";
import { useCartStore } from "../../store/cartStore";
import { cartService } from "../../services/cart.service";

export function Navbar() {
  const { isAuthenticated, isAdmin, user } = useAuthStore();
  const { itemCount, totalAmount } = useCartStore();
  const setItems = useCartStore((s) => s.setItems);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && !isAdmin && pathname !== "/delivery/payment/success") {
      cartService
        .getCart()
        .then((res) => setItems(res.data.items || [], res.data.totalAmount || 0))
        .catch(() => setItems([], 0));
    }
  }, [isAuthenticated]);
  const isRestaurants = pathname === "/delivery/restaurants";
  const isOrders = pathname === "/delivery/orders";
  const isLogin = pathname === "/auth/login";
  const isRegister = pathname === "/auth/register";
  const isCart = pathname === "/delivery/cart";
  const isAdminCategories = pathname === "/delivery/admin/categories";
  const isAdminRestaurants = pathname === "/delivery/admin/restaurants";
  const isAdminMenuItems = pathname === "/delivery/admin/menu-items";
  const isAdminCarts = pathname === "/delivery/admin/carts";
  const isAdminOrders = pathname === "/delivery/admin/orders";
  const isAdminMails = pathname === "/delivery/admin/mails";
  const isAdminMessages = pathname === "/delivery/admin/messages";
  const isAdminUsers = pathname === "/delivery/admin/users";

  const handleLogout = () => {
    useAuthStore.getState().logout();
    useCartStore.getState().clearCart();
    router.push("/auth/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
      <div className="container">
        <Link className="navbar-brand" href="/delivery/restaurants">
          <img src="/DeliverySystem.png" alt="DeliverySystem" height="30" className="d-inline-block align-text-top me-2" />
          DeliverySystem
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            {isAdmin && !isAdminCategories && (
              <li className="nav-item"><Link className="nav-link" href="/delivery/admin/categories">Categories</Link></li>
            )}
            {isAdmin && !isAdminRestaurants && (
              <li className="nav-item"><Link className="nav-link" href="/delivery/admin/restaurants">Restaurants</Link></li>
            )}
            {isAdmin && !isAdminMenuItems && (
              <li className="nav-item"><Link className="nav-link" href="/delivery/admin/menu-items">Menu Items</Link></li>
            )}
            {!isRestaurants && (
              <li className="nav-item">
                <Link className="nav-link" href="/delivery/restaurants">
                  List Restaurants
                </Link>
              </li>
            )}
            {isAdmin && !isAdminCarts && (
              <li className="nav-item"><Link className="nav-link" href="/delivery/admin/carts">Carts</Link></li>
            )}
            {isAdmin && !isAdminOrders && (
              <li className="nav-item"><Link className="nav-link" href="/delivery/admin/orders">Orders</Link></li>
            )}
            {isAdmin && !isAdminMails && (
              <li className="nav-item"><Link className="nav-link" href="/delivery/admin/mails">Mails</Link></li>
            )}
            {isAdmin && !isAdminMessages && (
              <li className="nav-item"><Link className="nav-link" href="/delivery/admin/messages">Messages</Link></li>
            )}
            {isAdmin && !isAdminUsers && (
              <li className="nav-item"><Link className="nav-link" href="/delivery/admin/users">Users</Link></li>
            )}
            {isAuthenticated && !isOrders && !isAdmin && (
              <li className="nav-item">
                <Link className="nav-link" href="/delivery/orders">
                  My Orders
                </Link>
              </li>
            )}
          </ul>
          <ul className="navbar-nav">
            {isAuthenticated ? (
              <>
                <li className="nav-item">
                  <span className="nav-link text-light">{user?.name}</span>
                </li>
                <li className="nav-item">
                  <button className="btn btn-outline-light btn-sm mt-1" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
                {!isAdmin && (
                  <li className="nav-item">
                    {isCart || itemCount === 0 ? (
                      <span className="nav-link">
                        <i className="pi pi-shopping-cart me-1"></i>
                        {itemCount > 0 && <span className="badge bg-primary me-1">{itemCount}</span>}
                        {totalAmount > 0 && <span>{totalAmount.toFixed(2)}€</span>}
                      </span>
                    ) : (
                      <Link className="nav-link" href="/delivery/cart">
                        <i className="pi pi-shopping-cart me-1"></i>
                        {itemCount > 0 && <span className="badge bg-primary me-1">{itemCount}</span>}
                        {totalAmount > 0 && <span>{totalAmount.toFixed(2)}€</span>}
                      </Link>
                    )}
                  </li>
                )}
              </>
            ) : (
              <>
                {!isLogin && (
                  <li className="nav-item">
                    <Link className="nav-link" href="/auth/login">Login</Link>
                  </li>
                )}
                {!isRegister && (
                  <li className="nav-item">
                    <Link className="nav-link" href="/auth/register">Register</Link>
                  </li>
                )}
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
