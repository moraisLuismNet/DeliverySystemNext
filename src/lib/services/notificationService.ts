import notificationQueueRepository from "../db/repositories/NotificationQueueRepository";
import emailQueueRepository from "../db/repositories/EmailQueueRepository";
import { QueueStatus } from "../db/models/QueueStatus";
import openWAProvider from "./openWAProvider";
import brevoEmailProvider from "./brevoEmailProvider";
import { INotificationService } from "./interfaces/INotificationService";

export class NotificationService implements INotificationService {
  private static readonly maxRetries = 5;

  async processPendingWhatsAppAsync(): Promise<{ processed: number; sent: number; failed: number }> {
    const now = new Date();
    const pending = await notificationQueueRepository.getPendingAsync();
    const result = { processed: pending.length, sent: 0, failed: 0 };

    for (const notification of pending) {
      if (notification.RetryCount >= NotificationService.maxRetries) {
        await notificationQueueRepository.update(notification.Id, {
          Status: QueueStatus.Failed,
          RetryCount: notification.RetryCount + 1,
          ErrorMessage: "Exceeded maximum retry attempts",
          ScheduledAt: now,
        });
        result.failed += 1;
        continue;
      }

      try {
        await openWAProvider.sendMessageAsync(notification.PhoneNumber, notification.Message);
        await notificationQueueRepository.update(notification.Id, {
          Status: QueueStatus.Sent,
          SentAt: now,
          ErrorMessage: null,
          ScheduledAt: now,
        });
        result.sent += 1;
      } catch (error: any) {
        const retryCount = (notification.RetryCount || 0) + 1;
        const backoffMinutes = Math.min(retryCount * 5, 60);
        await notificationQueueRepository.update(notification.Id, {
          RetryCount: retryCount,
          ErrorMessage: (error?.message || "Unknown error").slice(0, 1000),
          ScheduledAt: new Date(now.getTime() + backoffMinutes * 60000),
        });
        result.failed += 1;
      }
    }

    return result;
  }

  async processPendingEmailsAsync(): Promise<{ processed: number; sent: number; failed: number }> {
    const now = new Date();
    const pending = await emailQueueRepository.getPendingAsync();
    const result = { processed: pending.length, sent: 0, failed: 0 };

    for (const email of pending) {
      if (email.RetryCount >= NotificationService.maxRetries) {
        await emailQueueRepository.update(email.Id, {
          Status: QueueStatus.Failed,
          RetryCount: email.RetryCount + 1,
          ErrorMessage: "Exceeded maximum retry attempts",
        });
        result.failed += 1;
        continue;
      }

      try {
        await brevoEmailProvider.sendEmailAsync(email.ToEmail, email.Subject || "", email.Body || "");
        await emailQueueRepository.update(email.Id, {
          Status: QueueStatus.Sent,
          SentAt: now,
          ErrorMessage: null,
        });
        result.sent += 1;
      } catch (error: any) {
        await emailQueueRepository.update(email.Id, {
          RetryCount: (email.RetryCount || 0) + 1,
          ErrorMessage: (error?.message || "Unknown error").slice(0, 1000),
        });
        result.failed += 1;
      }
    }

    return result;
  }
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
