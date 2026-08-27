"use client";
import { useState, useEffect, useMemo } from "react";
import { categoryService } from "@/services/category.service";
import { menuItemService } from "@/services/menu-item.service";
import { ICategory, ICreateCategory } from "@/interfaces/category.interface";
import { IMenuItem } from "@/interfaces/menu-item.interface";
import { getErrorMessage } from "@/utils/errorHandling";

type FormMode = "create" | "edit";

export default function AdminCategories() {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [menuItems, setMenuItems] = useState<IMenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<FormMode | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<ICreateCategory>({ name: "", description: "" });
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [deleteTarget, setDeleteTarget] = useState<ICategory | null>(null);

  const fetchData = () => {
    setLoading(true);
    Promise.all([categoryService.getAll(), menuItemService.getAll()])
      .then(([catRes, menuRes]) => {
        setCategories(catRes.data);
        setMenuItems(menuRes.data);
      })
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const usedCategories = useMemo(
    () => new Set(menuItems.map((mi) => mi.categoryId)),
    [menuItems]
  );

  const filtered = useMemo(
    () => categories.filter((c) => c.name.toLowerCase().includes(searchText.toLowerCase())),
    [categories, searchText]
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
    setForm({ name: "", description: "" });
  };

  const openEdit = (c: ICategory) => {
    setMode("edit");
    setEditId(c.id);
    setForm({ name: c.name, description: c.description || "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (mode === "create") {
        await categoryService.create(form);
      } else if (editId) {
        await categoryService.update(editId, { ...form, isActive: true });
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
      await categoryService.delete(deleteTarget.id);
      setDeleteTarget(null);
      fetchData();
    } catch (err) {
      setError(getErrorMessage(err));
      setDeleteTarget(null);
    }
  };

  if (loading) return <div className="container mt-4"><div className="spinner-border"></div></div>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Manage Categories</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <button className="btn btn-primary mb-3" onClick={openCreate}>Create Category</button>

      {mode && (
        <div className="card mb-4 p-3">
          <h5>{mode === "create" ? "Create" : "Edit"} Category</h5>
          <form onSubmit={handleSubmit}>
            <div className="mb-2">
              <input type="text" name="name" className="form-control" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="mb-2">
              <input type="text" name="description" className="form-control" placeholder="Description" value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <button type="submit" className="btn btn-success me-2">Save</button>
            <button type="button" className="btn btn-secondary" onClick={() => setMode(null)}>Cancel</button>
          </form>
        </div>
      )}

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

      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Active</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {paged.map((c) => {
              const hasItems = usedCategories.has(c.id);
              return (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td>{c.description}</td>
                  <td>{c.isActive ? "Yes" : "No"}</td>
                  <td>
                    <button className="btn btn-sm btn-warning me-1" onClick={() => openEdit(c)}>Edit</button>
                    <button
                      className="btn btn-sm btn-danger"
                      disabled={hasItems}
                      title={hasItems ? "Has menu items using this category" : ""}
                      onClick={() => setDeleteTarget(c)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {totalPages > 0 && (
        <div className="d-flex justify-content-between align-items-center mt-3">
          <div className="d-flex align-items-center gap-2">
            <span className="text-muted small">
              {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, filtered.length)} of {filtered.length} categories
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
