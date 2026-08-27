"use client";
import { useState, useEffect, useMemo } from "react";
import { restaurantService } from "@/services/restaurant.service";
import { IRestaurant, ICreateRestaurant } from "@/interfaces/restaurant.interface";
import { getErrorMessage } from "@/utils/errorHandling";

type FormMode = "create" | "edit";

export default function AdminRestaurants() {
  const [restaurants, setRestaurants] = useState<IRestaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<FormMode | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<ICreateRestaurant>({
    name: "", description: "", address: "", phone: "", imageUrl: "",
  });
  const [deleteTarget, setDeleteTarget] = useState<IRestaurant | null>(null);
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const fetchRestaurants = () => {
    setLoading(true);
    restaurantService
      .getAll()
      .then((res) => setRestaurants(res.data))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchRestaurants(); }, []);

  const filtered = useMemo(
    () => restaurants.filter((r) => r.name.toLowerCase().includes(searchText.toLowerCase())),
    [restaurants, searchText]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = useMemo(
    () => filtered.slice((page - 1) * pageSize, page * pageSize),
    [filtered, page, pageSize]
  );

  useEffect(() => { if (page > totalPages) setPage(totalPages); }, [totalPages, page]);

  const openCreate = () => {
    setMode("create");
    setEditId(null);
    setForm({ name: "", description: "", address: "", phone: "", imageUrl: "" });
  };

  const openEdit = (r: IRestaurant) => {
    setMode("edit");
    setEditId(r.id);
    setForm({ name: r.name, description: r.description, address: r.address, phone: r.phone, imageUrl: r.imageUrl });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (mode === "create") {
        await restaurantService.create(form);
      } else if (editId) {
        await restaurantService.update(editId, { ...form, isActive: true });
      }
      setMode(null);
      fetchRestaurants();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await restaurantService.delete(deleteTarget.id);
      setDeleteTarget(null);
      fetchRestaurants();
    } catch (err) {
      setError(getErrorMessage(err));
      setDeleteTarget(null);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  if (loading) return <div className="container mt-4"><div className="spinner-border"></div></div>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Manage Restaurants</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <button className="btn btn-primary mb-3" onClick={openCreate}>Create Restaurant</button>

      <div className="mb-3">
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
          <h5>{mode === "create" ? "Create" : "Edit"} Restaurant</h5>
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-2">
                <input type="text" name="name" className="form-control" placeholder="Name" value={form.name} onChange={handleChange} required />
              </div>
              <div className="col-md-6 mb-2">
                <input type="text" name="address" className="form-control" placeholder="Address" value={form.address} onChange={handleChange} required />
              </div>
              <div className="col-md-6 mb-2">
                <input type="text" name="phone" className="form-control" placeholder="Phone" value={form.phone} onChange={handleChange} required />
              </div>
              <div className="col-md-6 mb-2">
                <input type="text" name="imageUrl" className="form-control" placeholder="Image URL" value={form.imageUrl} onChange={handleChange} />
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
              <th>Address</th>
              <th>Phone</th>
              <th>Active</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {paged.map((r) => (
              <tr key={r.id}>
                <td>
                  <img
                    src={r.imageUrl || "https://imgur.com/Zemqvh3.png"}
                    alt={r.name}
                    style={{ width: 60, height: 40, objectFit: "cover", borderRadius: 4 }}
                  />
                </td>
                <td>{r.name}</td>
                <td>{r.address}</td>
                <td>{r.phone}</td>
                <td>{r.isActive ? "Yes" : "No"}</td>
                <td>
                  <button className="btn btn-sm btn-warning me-1" onClick={() => openEdit(r)}>Edit</button>
                  <button className="btn btn-sm btn-danger" onClick={() => setDeleteTarget(r)}>Delete</button>
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
              {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, filtered.length)} of {filtered.length} restaurants
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
