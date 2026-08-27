import axios from "axios";

interface SessionDto {
  id: string;
  name: string;
  status: string;
  phone?: string;
}

interface QrResponse {
  qrCode: string;
  status: string;
}

class OpenWASessionService {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.baseUrl = process.env.OPENWA_BASE_URL || "http://localhost:2785/api";
    this.apiKey = process.env.OPENWA_API_KEY || "";
  }

  private get http() {
    return axios.create({
      baseURL: this.baseUrl,
      headers: { "X-API-Key": this.apiKey, "Content-Type": "application/json" },
      timeout: 10000,
    });
  }

  async getSessionStatusAsync(sessionName: string): Promise<{ id: string; name: string; status: string; phone?: string } | null> {
    try {
      const res = await this.http.get<SessionDto[]>("/sessions");
      const match = res.data.find((s) => s.name === sessionName);
      return match ? { id: match.id, name: match.name, status: match.status, phone: match.phone } : null;
    } catch {
      return null;
    }
  }

  async ensureSessionActiveAsync(sessionName: string): Promise<string | null> {
    try {
      const sessionsRes = await this.http.get<SessionDto[]>("/sessions");
      const existing = sessionsRes.data.find((s) => s.name === sessionName);

      if (existing) {
        if (existing.status === "ready") return existing.id;
        try {
          await this.http.post(`/sessions/${existing.id}/start`);
          return existing.id;
        } catch {
          await this.http.delete(`/sessions/${existing.id}`);
        }
      }

      const safeName = sessionName.replace(/_/g, "-");
      const createRes = await this.http.post("/sessions", { name: safeName });
      const session = createRes.data as SessionDto;
      if (!session) return null;

      await this.http.post(`/sessions/${session.id}/start`);
      return session.id;
    } catch {
      return null;
    }
  }

  async getQrImageAsync(sessionId: string): Promise<Buffer | null> {
    try {
      const sessionsRes = await this.http.get<SessionDto[]>("/sessions");
      const match = sessionsRes.data.find((s) => s.id === sessionId || s.name === sessionId);
      const resolvedId = match?.id || sessionId;

      const qrRes = await this.http.get<QrResponse>(`/sessions/${resolvedId}/qr`);
      if (!qrRes.data.qrCode) return null;

      const prefix = "data:image/png;base64,";
      if (!qrRes.data.qrCode.startsWith(prefix)) return null;

      const base64Data = qrRes.data.qrCode.substring(prefix.length);
      return Buffer.from(base64Data, "base64");
    } catch {
      return null;
    }
  }

  async deleteSessionAsync(sessionUuid: string): Promise<void> {
    try {
      await this.http.delete(`/sessions/${sessionUuid}`);
    } catch {
      // ignore
    }
  }
}

export default new OpenWASessionService();
