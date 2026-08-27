import { CheckoutSessionResponseDTO } from "../../dtos/Payment/CheckoutSessionResponseDTO";
import { CreateCheckoutSessionDTO } from "../../dtos/Payment/CreateCheckoutSessionDTO";
import { ConfirmPaymentDTO } from "../../dtos/Payment/ConfirmPaymentDTO";

export interface IPaymentService {
  createCheckoutSessionAsync(dto: CreateCheckoutSessionDTO): Promise<CheckoutSessionResponseDTO>;
  confirmPaymentAsync(dto: ConfirmPaymentDTO): Promise<void>;
}
