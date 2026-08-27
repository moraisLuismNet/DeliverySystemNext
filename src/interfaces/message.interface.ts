export interface IWhatsAppMessage {
  id: number;
  phoneNumber: string;
  message: string;
  orderId: number;
  status: string;
  retryCount: number;
  errorMessage: string | null;
  createdAt: string;
  sentAt: string | null;
  scheduledAt: string;
}
export interface IEmailMessage {
  id: number;
  toEmail: string;
  subject: string;
  body: string;
  status: string;
  retryCount: number;
  errorMessage: string | null;
  createdAt: string;
  sentAt: string | null;
}
export interface IMessageList {
  whatsAppMessages: IWhatsAppMessage[];
  emailMessages: IEmailMessage[];
}
