const axios = require("axios");
import { IEmailProvider } from "./interfaces/IEmailProvider";

export class BrevoEmailProvider implements IEmailProvider {
  private apiKey: string;
  private fromEmail: string;
  private fromName: string;

  constructor() {
    this.apiKey =
      process.env.BREVO_API_KEY || process.env.EMAIL_BREVO_API_KEY || "";
    this.fromEmail =
      process.env.BREVO_FROM_EMAIL || process.env.EMAIL_FROM_EMAIL || "";
    this.fromName =
      process.env.BREVO_FROM_NAME || process.env.EMAIL_FROM_NAME || "";
  }

  async sendEmailAsync(
    toEmail: string,
    subject: string,
    body: string,
  ): Promise<void> {
    try {
      await axios.post(
        "https://api.brevo.com/v3/smtp/email",
        {
          sender: { email: this.fromEmail, name: this.fromName },
          to: [{ email: toEmail }],
          subject,
          htmlContent: body,
        },
        {
          headers: {
            "api-key": this.apiKey,
            "Content-Type": "application/json",
          },
        },
      );
    } catch (error: any) {
      console.error("Error sending email via Brevo:", error.message);
      throw error;
    }
  }
}

export default new BrevoEmailProvider();
