"use client";
import { useState, useEffect, useMemo } from "react";
import { menuItemService } from "@/services/menu-item.service";
import { IMenuItem, ICreateMenuItem } from "@/interfaces/menu-item.interface";
import { IRestaurant } from "@/interfaces/restaurant.interface";
import { ICategory } from "@/interfaces/category.interface";
import { restaurantService } from "@/services/restaurant.service";
import { categoryService } from "@/services/category.service";
import { getErrorMessage } from "@/utils/errorHandling";

type FormMode = "create" | "edit";

export default function AdminMenuItems() {
  const [items, setItems] = useState<IMenuItem[]>([]);
  const [restaurants, setRestaurants] = useState<IRestaurant[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<FormMode | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [categoryFilter, setCategoryFilter] = useState(0);
  const [deleteTarget, setDeleteTarget] = useState<IMenuItem | null>(null);
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [form, setForm] = useState<ICreateMenuItem>({
    name: "", description: "", price: 0, categoryId: 0, imageUrl: "", stock: 0, restaurantId: 0,
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [itemsRes, restRes, catRes] = await Promise.all([menuItemService.getAll(), restaurantService.getAll(), categoryService.getAll()]);
      setItems(itemsRes.data);
      setRestaurants(restRes.data);
      setCategories(catRes.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => {
    setMode("create");
    setEditId(null);
    setForm({ name: "", description: "", price: 0, categoryId: 0, imageUrl: "", stock: 0, restaurantId: restaurants[0]?.id || 0 });
  };

  const openEdit = (item: IMenuItem) => {
    setMode("edit");
    setEditId(item.id);
    setForm({
      name: item.name,
      description: item.description,
      price: item.price,
      categoryId: item.categoryId,
      imageUrl: item.imageUrl,
      stock: item.stock,
      restaurantId: item.restaurantId,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (mode === "create") {
        await menuItemService.create(form);
      } else if (editId) {
        await menuItemService.update(editId, { ...form, isAvailable: true });
      }
      setMode(null);
      fetchData();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await menuItemService.delete(deleteTarget.id);
      setDeleteTarget(null);
      fetchData();
    } catch (err) {
      setError(getErrorMessage(err));
      setDeleteTarget(null);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const name = e.target.name as keyof ICreateMenuItem;
    const numericFields: (keyof ICreateMenuItem)[] = ["price", "stock", "restaurantId", "categoryId"];
    const value = numericFields.includes(name) ? Number(e.target.value) || 0 : e.target.value;
    setForm({ ...form, [name]: value });
  };

  const filteredItems = useMemo(() => {
    const byCategory = categoryFilter ? items.filter((i) => i.categoryId === categoryFilter) : items;
    return byCategory.filter((i) => i.name.toLowerCase().includes(searchText.toLowerCase()));
  }, [items, categoryFilter, searchText]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / pageSize));
  const paged = useMemo(
    () => filteredItems.slice((page - 1) * pageSize, page * pageSize),
    [filteredItems, page, pageSize]
  );

  useEffect(() => { if (page > totalPages) setPage(totalPages); }, [totalPages, page]);

  if (loading) return <div className="container mt-4"><div className="spinner-border"></div></div>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Manage Menu Items</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <button className="btn btn-primary mb-3" onClick={openCreate}>Create Menu Item</button>

      <div className="mb-3 d-flex gap-2">
        <select className="form-select" style={{ width: "auto" }} value={categoryFilter} onChange={(e) => { setCategoryFilter(Number(e.target.value)); setPage(1); }}>
          <option value={0}>All categories</option>
          {categories.filter((c) => c.isActive).map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <input
          type="text"
          className="form-control"
          style={{ width: "auto" }}
          placeholder="Search by name..."
          value={searchText}
          onChange={(e) => { setSearchText(e.target.value); setPage(1); }}
        />
      </div>

      {mode && (
        <div className="card mb-4 p-3">
          <h5>{mode === "create" ? "Create" : "Edit"} Menu Item</h5>
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-4 mb-2">
                <input type="text" name="name" className="form-control" placeholder="Name" value={form.name} onChange={handleChange} required />
              </div>
              <div className="col-md-4 mb-2">
                <input type="number" name="price" className="form-control" placeholder="Price" value={form.price ?? 0} onChange={handleChange} required />
              </div>
              <div className="col-md-4 mb-2">
                <select name="categoryId" className="form-select" value={form.categoryId || ""} onChange={handleChange} required>
                  <option value={0}>Select Category</option>
                  {categories.filter((c) => c.isActive).map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-4 mb-2">
                <input type="number" name="stock" className="form-control" placeholder="Stock" value={form.stock ?? 0} onChange={handleChange} required />
              </div>
              <div className="col-md-4 mb-2">
                <input type="text" name="imageUrl" className="form-control" placeholder="Image URL" value={form.imageUrl} onChange={handleChange} />
              </div>
              <div className="col-md-4 mb-2">
                <select name="restaurantId" className="form-select" value={form.restaurantId || ""} onChange={handleChange} required>
                  <option value="">Select Restaurant</option>
                  {restaurants.map((r) => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>
              <div className="col-12 mb-2">
                <textarea name="description" className="form-control" placeholder="Description" value={form.description} onChange={handleChange} required />
              </div>
            </div>
            <button type="submit" className="btn btn-success me-2">Save</button>
            <button type="button" className="btn btn-secondary" onClick={() => setMode(null)}>Cancel</button>
          </form>
        </div>
      )}

      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Restaurant</th>
              <th>Price</th>
              <th>Category</th>
              <th>Stock</th>
              <th>Available</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {paged.map((item) => (
              <tr key={item.id}>
                <td>
                  <img
                    src={item.imageUrl || "https://imgur.com/Zemqvh3.png"}
                    alt={item.name}
                    style={{ width: 60, height: 40, objectFit: "cover", borderRadius: 4 }}
                  />
                </td>
                <td>{item.name}</td>
                <td>{item.restaurantName}</td>
                <td>{item.price.toFixed(2)}€</td>
                <td>{item.categoryName}</td>
                <td>{item.stock}</td>
                <td>{item.isAvailable ? "Yes" : "No"}</td>
                <td>
                  <button className="btn btn-sm btn-warning me-1" onClick={() => openEdit(item)}>Edit</button>
                  <button className="btn btn-sm btn-danger" onClick={() => setDeleteTarget(item)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 0 && (
        <div className="d-flex justify-content-between align-items-center mt-3">
          <div className="d-flex align-items-center gap-2">
            <span className="text-muted small">
              {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, filteredItems.length)} of {filteredItems.length} items
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
      {deleteTarget && (
        <div className="modal d-block" tabIndex={-1} style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm</h5>
                <button type="button" className="btn-close" onClick={() => setDeleteTarget(null)}></button>
              </div>
              <div className="modal-body">
                <i className="pi pi-exclamation-triangle text-warning me-2"></i>
                Are you sure you want to delete <strong>{deleteTarget.name}</strong>?
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setDeleteTarget(null)}>No</button>
                <button className="btn btn-danger" onClick={confirmDelete}>Yes</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
