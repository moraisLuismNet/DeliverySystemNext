export interface CheckoutSessionResponseDTO {
  sessionId: string;
  sessionUrl: string;
  paymentIntentId?: string;
}
