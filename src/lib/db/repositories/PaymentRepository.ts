import { BaseRepository } from "./BaseRepository";
import { Payment } from "../models/Payment";
import { IPaymentRepository } from "./interfaces/IPaymentRepository";

export class PaymentRepository extends BaseRepository<Payment> implements IPaymentRepository {
  constructor() {
    super(Payment);
  }

  async getByOrderIdAsync(orderId: number): Promise<Payment | null> {
    return await this.findOne({ where: { OrderId: orderId } });
  }

  async getBySessionIdAsync(sessionId: string): Promise<Payment | null> {
    return await this.findOne({ where: { StripeSessionId: sessionId } });
  }
}

export default new PaymentRepository();
