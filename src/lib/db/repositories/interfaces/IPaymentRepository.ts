import { Payment } from "../../models/Payment";
import { IBaseRepository } from "./IBaseRepository";

export interface IPaymentRepository extends IBaseRepository<Payment> {
  getByOrderIdAsync(orderId: number): Promise<Payment | null>;
  getBySessionIdAsync(sessionId: string): Promise<Payment | null>;
}
