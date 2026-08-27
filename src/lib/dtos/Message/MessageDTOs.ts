export interface WhatsAppMessageDTO {
  id: number;
  phoneNumber: string;
  message: string;
  orderId: number;
  status: string;
  retryCount: number;
  errorMessage?: string;
  createdAt: Date;
  sentAt?: Date;
  scheduledAt: Date;
}

export interface EmailMessageDTO {
  id: number;
  toEmail: string;
  subject: string;
  body: string;
  status: string;
  retryCount: number;
  errorMessage?: string;
  createdAt: Date;
  sentAt?: Date;
}

export interface MessageListDTO {
  whatsAppMessages: WhatsAppMessageDTO[];
  emailMessages: EmailMessageDTO[];
}

export interface SendMessageDTO {
  orderId: number;
  phoneNumber: string;
  customerName: string;
}
