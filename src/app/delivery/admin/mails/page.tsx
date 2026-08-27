"use client";
import { useState, useEffect, useMemo } from "react";
import { messageService } from "@/services/sms.service";
import { IEmailMessage } from "@/interfaces/message.interface";
import { getErrorMessage } from "@/utils/errorHandling";

export default function AdminMails() {
  const [mails, setMails] = useState<IEmailMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const fetchMails = () => {
    setLoading(true);
    messageService
      .getEmailMessages()
      .then((res) => setMails(res.data))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchMails(); }, []);

  const filtered = useMemo(() => {
    if (!searchText) return mails;
    const q = searchText.toLowerCase();
    return mails.filter((m) =>
      m.toEmail.toLowerCase().includes(q) ||
      m.subject.toLowerCase().includes(q)
    );
  }, [mails, searchText]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => { setPage(1); }, [searchText]);

  if (loading) return <div className="container mt-4"><div className="spinner-border"></div></div>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Emails</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          style={{ width: 280 }}
          placeholder="Search by email or subject..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>To</th>
              <th>Subject</th>
              <th>Status</th>
              <th>Retries</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((m) => (
              <tr key={m.id}>
                <td>{m.toEmail}</td>
                <td>{m.subject}</td>
                <td>{m.status}</td>
                <td>{m.retryCount}</td>
                <td>{new Date(m.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 0 && (
        <div className="d-flex justify-content-between align-items-center mt-3">
          <div className="d-flex align-items-center gap-2">
            <span>Rows per page:</span>
            <select className="form-select" style={{ width: "auto" }} value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}>
              <option value={5}>5</option>
              <option value={10}>10</option>
            </select>
            <span className="text-muted">
              {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, filtered.length)} of {filtered.length}
            </span>
          </div>
          <div className="d-flex gap-1">
            <button className="btn btn-sm btn-outline-primary" disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</button>
            <button className="btn btn-sm btn-outline-primary" disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</button>
          </div>
        </div>
      )}
    </div>
  );
}
