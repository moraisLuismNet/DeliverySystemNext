"use client";
import { useState, useEffect, useMemo, useRef } from "react";
import { messageService } from "@/services/sms.service";
import { IWhatsAppMessage } from "@/interfaces/message.interface";
import { getErrorMessage } from "@/utils/errorHandling";

export default function AdminMessages() {
  const [messages, setMessages] = useState<IWhatsAppMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const [sessionStatus, setSessionStatus] = useState("unknown");
  const [sessionPhone, setSessionPhone] = useState<string | null>(null);
  const [showQr, setShowQr] = useState(false);
  const [qrImage, setQrImage] = useState<string | null>(null);
  const [linking, setLinking] = useState(false);
  const [pollCount, setPollCount] = useState(0);
  const pollingRef = useRef(false);
  const pollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchMessages = () => {
    setLoading(true);
    messageService
      .getWhatsAppMessages()
      .then((res) => setMessages(res.data))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMessages();
    checkSessionStatus();
    return () => { if (pollTimerRef.current) clearInterval(pollTimerRef.current); };
  }, []);

  const checkSessionStatus = () => {
    messageService.getSessionStatus().then((res) => {
      setSessionStatus(res.data.status);
      setSessionPhone(res.data.phone);
      if (res.data.status === "ready") {
        setShowQr(false);
        stopPolling();
      }
    }).catch(() => {});
  };

  const linkWhatsApp = () => {
    setLinking(true);
    messageService.getQrImage().then((res) => {
      setLinking(false);
      const d = res.data;
      if (d.status === "ready") {
        setSessionStatus("ready");
        setSessionPhone(d.phone || null);
        setShowQr(false);
      } else if (d.qrImage) {
        setSessionStatus(d.status);
        setShowQr(true);
        setQrImage(`data:image/png;base64,${d.qrImage}`);
        startPolling();
      } else {
        setSessionStatus(d.status);
        setShowQr(false);
      }
    }).catch(() => {
      setLinking(false);
    });
  };

  const startPolling = () => {
    if (pollingRef.current) return;
    pollingRef.current = true;
    setPollCount(0);
    pollTimerRef.current = setInterval(() => {
      messageService.getSessionStatus().then((res) => {
        setPollCount((c) => c + 1);
        if (res.data.status === "ready") {
          setSessionStatus("ready");
          setSessionPhone(res.data.phone);
          setShowQr(false);
          stopPolling();
        }
      }).catch(() => {});
    }, 3000);
  };

  const stopPolling = () => {
    pollingRef.current = false;
    if (pollTimerRef.current) {
      clearInterval(pollTimerRef.current);
      pollTimerRef.current = null;
    }
  };

  const filtered = useMemo(() => {
    if (!searchText) return messages;
    const q = searchText.toLowerCase();
    return messages.filter((m) => m.phoneNumber.toLowerCase().includes(q));
  }, [messages, searchText]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => { setPage(1); }, [searchText]);

  if (loading) return <div className="container mt-4"><div className="spinner-border"></div></div>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">WhatsApp Messages</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card mb-4 p-3">
        <div className="d-flex align-items-center gap-3">
          <strong>WhatsApp Connection:</strong>
          {sessionStatus === "ready" ? (
            <span className="text-success">✓ Linked to {sessionPhone}</span>
          ) : showQr && qrImage ? (
            <div className="text-center">
              <p className="text-muted mb-2">Scan this QR with WhatsApp to link the session</p>
              <img src={qrImage} alt="WhatsApp QR" style={{ width: 256, height: 256 }} />
              <p className="text-muted mt-2"><small>Waiting for scan... ({pollCount}s)</small></p>
            </div>
          ) : (
            <button className="btn btn-success" onClick={linkWhatsApp} disabled={linking}>
              {linking ? <span className="spinner-border spinner-border-sm me-1" /> : <i className="pi pi-whatsapp me-1" />}
              Link WhatsApp
            </button>
          )}
        </div>
      </div>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          style={{ width: 280 }}
          placeholder="Search by phone..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Phone</th>
              <th>Message</th>
              <th>Order</th>
              <th>Status</th>
              <th>Retries</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((m) => (
              <tr key={m.id}>
                <td>{m.phoneNumber}</td>
                <td style={{ maxWidth: 300, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={m.message}>{m.message.substring(0, 50)}</td>
                <td>{m.orderId}</td>
                <td>
                  <span className={`badge bg-${m.status === "Sent" ? "success" : m.status === "Failed" ? "danger" : "warning"}`}>
                    {m.status}
                  </span>
                </td>
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
