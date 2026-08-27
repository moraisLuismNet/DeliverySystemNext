"use client";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { restaurantService } from "@/services/restaurant.service";
import { menuItemService } from "@/services/menu-item.service";
import { IRestaurant } from "@/interfaces/restaurant.interface";
import { getErrorMessage } from "@/utils/errorHandling";

const PAGE_SIZE = 6;

export default function Restaurants() {
  const [restaurants, setRestaurants] = useState<IRestaurant[]>([]);
  const [hasMenu, setHasMenu] = useState<Record<number, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState("");

  const filtered = useMemo(
    () => restaurants.filter((r) => r.name.toLowerCase().includes(searchText.toLowerCase())),
    [restaurants, searchText]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = useMemo(
    () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filtered, page]
  );

  useEffect(() => {
    restaurantService
      .getAvailable()
      .then(async (res) => {
        const data = res.data;
        setRestaurants(data);
        const itemsRes = await menuItemService.getAll();
        const restaurantIdsWithMenu = new Set(itemsRes.data.map((m) => m.restaurantId));
        const map: Record<number, boolean> = {};
        data.forEach((r) => { map[r.id] = restaurantIdsWithMenu.has(r.id); });
        setHasMenu(map);
      })
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { setPage(1); }, [searchText]);

  if (loading) return <div className="container mt-4"><div className="spinner-border"></div></div>;
  if (error) return <div className="container mt-4"><div className="alert alert-danger">{error}</div></div>;

  return (
    <div className="bg-white">
      <div className="bg-dark text-white" style={{ paddingTop: "2rem", paddingBottom: "1.5rem" }}>
        <div className="container text-center">
          <h1 className="display-4 fw-bold mb-3">Find your favorite restaurants</h1>
          <p className="lead mx-auto" style={{ maxWidth: 600 }}>
            Explore our selection of restaurants and discover our exclusive selection of menus
          </p>
        </div>
      </div>

      <div className="container-fluid mt-4 px-5">
        <div className="row">
          <div className="col-12">
            <div className="mb-4">
              <h2 className="fw-bold mb-3">Available Restaurants</h2>
              <div className="col-md-4 px-0">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by restaurant name..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          {paged.map((r) => (
            <div key={r.id} className="col-md-4 mb-4">
              <div className="card h-100 shadow-sm">
                <img
                  src={r.imageUrl || "https://imgur.com/Zemqvh3.png"}
                  className="card-img-top"
                  alt={r.name}
                  style={{ maxHeight: 150, objectFit: "cover" }}
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{r.name}</h5>
                  <p className="card-text small text-muted">{r.address}</p>
                  <p className="card-text text-muted flex-grow-1">{r.description}</p>
                  <p className="small">Phone: {r.phone}</p>
                  {hasMenu[r.id] ? (
                    <Link href={`/delivery/restaurants/${r.id}/menu`} className="btn btn-outline-primary mt-auto">
                      View Menu
                    </Link>
                  ) : (
                    <button className="btn btn-outline-secondary mt-auto" disabled>
                      No menu available
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
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
