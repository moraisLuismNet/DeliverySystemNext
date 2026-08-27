import { CheckoutSessionResponseDTO } from "../../dtos/Payment/CheckoutSessionResponseDTO";
import { CreateCheckoutSessionDTO } from "../../dtos/Payment/CreateCheckoutSessionDTO";

export interface IStripeProvider {
  createCheckoutSessionAsync(dto: CreateCheckoutSessionDTO): Promise<CheckoutSessionResponseDTO>;
  confirmPaymentAsync(sessionId: string): Promise<{ paymentIntentId: string; status: string }>;
}
