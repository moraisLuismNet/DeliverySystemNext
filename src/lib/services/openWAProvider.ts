const axios = require("axios");
import { IWhatsAppProvider } from "./interfaces/IWhatsAppProvider";

export class OpenWAWhatsAppProvider implements IWhatsAppProvider {
  private baseUrl: string;
  private apiKey: string;
  private sessionName: string;

  constructor() {
    this.baseUrl = process.env.OPENWA_BASE_URL || "http://localhost:2785/api";
    this.apiKey = process.env.OPENWA_API_KEY || "";
    this.sessionName = process.env.OPENWA_SESSION_ID || "delivery-session";
  }

  private async resolveSessionId(): Promise<string> {
    const response = await axios.get(`${this.baseUrl}/sessions`, {
      headers: { "X-API-Key": this.apiKey },
    });
    const sessions: Array<{ id: string; name: string; status: string }> =
      response.data;
    const match = sessions.find(
      (s) => s.name === this.sessionName && s.status === "ready",
    );
    if (!match)
      throw new Error(`Session '${this.sessionName}' not found or not ready`);
    return match.id;
  }

  async sendMessageAsync(phoneNumber: string, message: string): Promise<void> {
    try {
      const sessionId = await this.resolveSessionId();
      const chatId =
        phoneNumber.replace("+", "").replace(/-/g, "").replace(/ /g, "") +
        "@c.us";
      await axios.post(
        `${this.baseUrl}/sessions/${sessionId}/messages/send-text`,
        { chatId, text: message },
        {
          headers: {
            "X-API-Key": this.apiKey,
            "Content-Type": "application/json",
          },
        },
      );
    } catch (error: any) {
      console.error("Error sending WhatsApp via OpenWA:", error.message);
      throw error;
    }
  }
}

export default new OpenWAWhatsAppProvider();
