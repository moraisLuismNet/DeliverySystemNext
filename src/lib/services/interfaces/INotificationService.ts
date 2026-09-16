export interface INotificationService {
  scheduleDeliveryNotificationAsync(orderId: number, phoneNumber: string, customerName: string): Promise<void>;
  getAllWhatsAppAsync(): Promise<any[]>;
  getAllEmailsAsync(): Promise<any[]>;
  processPendingWhatsAppAsync(): Promise<{ processed: number; sent: number; failed: number }>;
}
