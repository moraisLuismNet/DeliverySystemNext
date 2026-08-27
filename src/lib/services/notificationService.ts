import notificationQueueRepository from "../db/repositories/NotificationQueueRepository";
import emailQueueRepository from "../db/repositories/EmailQueueRepository";
import { INotificationService } from "./interfaces/INotificationService";

export class NotificationService implements INotificationService {
  async scheduleDeliveryNotificationAsync(orderId: number, phoneNumber: string, customerName: string): Promise<void> {
    const now = new Date();
    const delayMinutes = parseInt(process.env.DELIVERY_DELAY_MINUTES || "0");
    const scheduledAt = new Date(now.getTime() + delayMinutes * 60000);

    await notificationQueueRepository.create({
      PhoneNumber: phoneNumber,
      Message: `Hello ${customerName}, your order #${orderId} has been delivered!`,
      OrderId: orderId,
      Status: "Pending",
      CreatedAt: now,
      ScheduledAt: scheduledAt,
    });
  }

  async getAllWhatsAppAsync(): Promise<any[]> {
    const notifications = await notificationQueueRepository.getAll({ order: [["CreatedAt", "DESC"]] });
    return notifications.map((n) => ({
      id: n.Id,
      phoneNumber: n.PhoneNumber,
      message: n.Message,
      orderId: n.OrderId,
      status: n.Status,
      retryCount: n.RetryCount,
      errorMessage: n.ErrorMessage,
      createdAt: n.CreatedAt,
      sentAt: n.SentAt,
      scheduledAt: n.ScheduledAt,
    }));
  }

  async getAllEmailsAsync(): Promise<any[]> {
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
}

export default new NotificationService();
