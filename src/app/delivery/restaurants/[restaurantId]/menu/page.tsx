"use client";
import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { menuItemService } from "@/services/menu-item.service";
import { restaurantService } from "@/services/restaurant.service";
import { IMenuItem } from "@/interfaces/menu-item.interface";
import { IRestaurant } from "@/interfaces/restaurant.interface";
import { useCart } from "@/hooks/useCart";
import { useAuthStore } from "@/store/authStore";
import { getErrorMessage } from "@/utils/errorHandling";

const PAGE_SIZE = 6;

export default function MenuItems() {
  const params = useParams();
  const restaurantId = params.restaurantId as string;
  const { isAuthenticated, isAdmin } = useAuthStore();
  const { items: cartItems, addToCart, updateQuantity, removeItem } = useCart();

  const [menuItems, setMenuItems] = useState<IMenuItem[]>([]);
  const [restaurant, setRestaurant] = useState<IRestaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adding, setAdding] = useState<number | null>(null);
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(
    () => menuItems.filter((i) => i.name.toLowerCase().includes(searchText.toLowerCase())),
    [menuItems, searchText]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = useMemo(
    () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filtered, page]
  );

  useEffect(() => {
    if (!restaurantId) return;
    const id = Number(restaurantId);
    Promise.all([
      menuItemService.getAvailableByRestaurant(id),
      restaurantService.getById(id),
    ])
      .then(([menuRes, restRes]) => {
        setMenuItems(menuRes.data);
        setRestaurant(restRes.data);
      })
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [restaurantId]);

  useEffect(() => { setPage(1); }, [searchText]);

  const handleAddToCart = async (menuItemId: number) => {
    setAdding(menuItemId);
    try {
      await addToCart({ menuItemId, quantity: 1 });
    } catch {
      // handled by hook
    } finally {
      setAdding(null);
    }
  };

  const cartItem = (menuItemId: number) => cartItems.find((i) => i.menuItemId === menuItemId);

  const availableStock = (menuItemId: number): number => {
    const item = menuItems.find((i) => i.id === menuItemId);
    return item ? item.stock : 0;
  };

  if (loading) return <div className="container mt-4"><div className="spinner-border"></div></div>;
  if (error) return <div className="container mt-4"><div className="alert alert-danger">{error}</div></div>;

  return (
    <div className="bg-white">
      <div className="bg-dark text-white" style={{ paddingTop: "2rem", paddingBottom: "1.5rem" }}>
        <div className="container text-center">
          <h1 className="display-4 fw-bold mb-3">{restaurant?.name || "Menu Items"}</h1>
          <p className="lead mx-auto" style={{ maxWidth: 600 }}>
            {restaurant?.description || "Explore our menu selection"}
          </p>
        </div>
      </div>

      <div className="container-fluid mt-4 px-5">
        <Link href="/delivery/restaurants" className="btn btn-outline-secondary mb-3">
          Back to Restaurants
        </Link>

        <div className="mb-4">
          <h2 className="fw-bold mb-3">Available Menus</h2>
          <div className="col-md-4 px-0">
            <input
              type="text"
              className="form-control"
              placeholder="Search by menu name..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
        </div>

        <div className="row">
          {paged.map((item) => {
            const ci = cartItem(item.id);
            return (
              <div key={item.id} className="col-md-4 mb-4">
                <div className="card h-100 shadow-sm">
                  <img
                    src={item.imageUrl || "https://imgur.com/Zemqvh3.png"}
                    className="card-img-top"
                    alt={item.name}
                    style={{ maxHeight: 150, objectFit: "cover" }}
                  />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{item.name}</h5>
                    <p className="card-text small text-muted">{item.categoryName} - {item.price.toFixed(2)}€</p>
                    <p className="card-text text-muted flex-grow-1">{item.description}</p>
                    {isAuthenticated && !isAdmin ? (
                      <div className="d-flex flex-column align-items-start gap-2">
                        {availableStock(item.id) > 0 ? (
                          <button
                            className="btn btn-outline-primary"
                            disabled={adding === item.id}
                            onClick={() => handleAddToCart(item.id)}
                          >
                            <i className="pi pi-shopping-cart me-1"></i>
                            {adding === item.id ? "Adding..." : "Add to Cart"}
                          </button>
                        ) : (
                          <span className="text-danger small">Out of stock</span>
                        )}
                        {ci && (
                          <button className="btn btn-outline-danger btn-sm" onClick={() => {
                            if (ci.quantity > 1) {
                              updateQuantity(ci.id, ci.quantity - 1);
                            } else {
                              removeItem(ci.id);
                            }
                          }}>
                            <i className="pi pi-trash me-1"></i>Remove
                          </button>
                        )}
                      </div>
                    ) : !isAuthenticated ? (
                      <p className="text-muted small mb-0 mt-auto">
                        <Link href="/auth/login">Login</Link> or <Link href="/auth/register">register</Link> to add items to cart
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {totalPages > 0 && (
          <div className="mt-4 mb-5 d-flex justify-content-center">
            <nav className="d-flex align-items-center gap-2">
              <button className="btn btn-outline-secondary" onClick={() => setPage(page - 1)} disabled={page === 1}>
                Previous
              </button>
              <div className="d-flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    className="btn btn-outline-secondary"
                    style={{ fontWeight: page === i + 1 ? "bold" : "normal" }}
                    onClick={() => setPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button className="btn btn-outline-secondary" onClick={() => setPage(page + 1)} disabled={page === totalPages}>
                Next
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}
