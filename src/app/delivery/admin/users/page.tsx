"use client";
import { useState, useEffect, useMemo } from "react";
import { userService } from "@/services/user.service";
import { IUser, ICreateUser, IUpdateUser } from "@/interfaces/user.interface";
import { getErrorMessage } from "@/utils/errorHandling";

type FormMode = "create" | "edit";

export default function AdminUsers() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<FormMode | null>(null);
  const [editEmail, setEditEmail] = useState<string | null>(null);
  const [form, setForm] = useState<ICreateUser>({ email: "", name: "", password: "", role: "User", phoneNumber: "" });
  const [deleteTarget, setDeleteTarget] = useState<IUser | null>(null);
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const fetchUsers = () => {
    setLoading(true);
    userService
      .getAll()
      .then((res) => setUsers(res.data))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const filtered = useMemo(
    () => users.filter((u) =>
      u.email.toLowerCase().includes(searchText.toLowerCase()) ||
      u.name.toLowerCase().includes(searchText.toLowerCase())
    ),
    [users, searchText]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = useMemo(
    () => filtered.slice((page - 1) * pageSize, page * pageSize),
    [filtered, page, pageSize]
  );

  useEffect(() => { if (page > totalPages) setPage(totalPages); }, [totalPages, page]);

  const openCreate = () => {
    setMode("create");
    setEditEmail(null);
    setForm({ email: "", name: "", password: "", role: "User", phoneNumber: "" });
  };

  const openEdit = (u: IUser) => {
    setMode("edit");
    setEditEmail(u.email);
    setForm({ email: u.email, name: u.name, password: "", role: u.role, phoneNumber: u.phoneNumber });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (mode === "create") {
        await userService.create(form);
      } else if (editEmail) {
        const update: IUpdateUser = { name: form.name, role: form.role, phoneNumber: form.phoneNumber, isActive: true };
        await userService.update(editEmail, update);
      }
      setMode(null);
      fetchUsers();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await userService.delete(deleteTarget.email);
      setDeleteTarget(null);
      fetchUsers();
    } catch (err) {
      setError(getErrorMessage(err));
      setDeleteTarget(null);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  if (loading) return <div className="container mt-4"><div className="spinner-border"></div></div>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Manage Users</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <button className="btn btn-primary mb-3" onClick={openCreate}>Create User</button>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          style={{ width: "auto" }}
          placeholder="Search by email or name..."
          value={searchText}
          onChange={(e) => { setSearchText(e.target.value); setPage(1); }}
        />
      </div>

      {mode && (
        <div className="card mb-4 p-3">
          <h5>{mode === "create" ? "Create" : "Edit"} User</h5>
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-4 mb-2">
                <input type="email" name="email" className="form-control" placeholder="Email" value={form.email} onChange={handleChange} required disabled={mode === "edit"} />
              </div>
              <div className="col-md-4 mb-2">
                <input type="text" name="name" className="form-control" placeholder="Name" value={form.name} onChange={handleChange} required />
              </div>
              <div className="col-md-4 mb-2">
                <input type={mode === "create" ? "password" : "text"} name="password" className="form-control" placeholder={mode === "create" ? "Password" : "New password (leave blank)"} value={form.password} onChange={handleChange} required={mode === "create"} />
              </div>
              <div className="col-md-4 mb-2">
                <input type="text" name="phoneNumber" className="form-control" placeholder="Phone" value={form.phoneNumber} onChange={handleChange} required />
              </div>
              <div className="col-md-4 mb-2">
                <select name="role" className="form-select" value={form.role} onChange={handleChange}>
                  <option value="User">User</option>
                  <option value="Admin">Admin</option>
                </select>
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
              <th>Email</th>
              <th>Name</th>
              <th>Role</th>
              <th>Phone</th>
              <th>Active</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {paged.map((u) => (
              <tr key={u.email}>
                <td>{u.email}</td>
                <td>{u.name}</td>
                <td>{u.role}</td>
                <td>{u.phoneNumber}</td>
                <td>{u.isActive ? "Yes" : "No"}</td>
                <td>
                  <button className="btn btn-sm btn-warning me-1" onClick={() => openEdit(u)}>Edit</button>
                  <button className="btn btn-sm btn-danger" onClick={() => setDeleteTarget(u)}>Delete</button>
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
              {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, filtered.length)} of {filtered.length} users
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
