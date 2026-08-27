import emailQueueRepository from "../db/repositories/EmailQueueRepository";
import { IEmailQueueService } from "./interfaces/IEmailQueueService";

export class EmailQueueService implements IEmailQueueService {
  async enqueueEmailAsync(toEmail: string, subject: string, body: string): Promise<void> {
    await emailQueueRepository.create({
      ToEmail: toEmail,
      Subject: subject,
      Body: body,
      Status: "Pending",
      RetryCount: 0,
      CreatedAt: new Date(),
    });
  }

  async getAllAsync(): Promise<any[]> {
    const emails = await emailQueueRepository.getAll({ order: [["CreatedAt", "DESC"]] });
    return emails.map((e) => ({
      id: e.Id,
      toEmail: e.ToEmail,
      subject: e.Subject,
      body: e.Body,
      status: e.Status,
      retryCount: e.RetryCount,
      errorMessage: e.ErrorMessage,
      createdAt: e.CreatedAt,
      sentAt: e.SentAt,
    }));
  }

  async deleteAsync(id: number): Promise<void> {
    const email = await emailQueueRepository.getById(id);
    if (!email) throw new Error("Email not found");
    await emailQueueRepository.delete(id);
  }
}

export default new EmailQueueService();
