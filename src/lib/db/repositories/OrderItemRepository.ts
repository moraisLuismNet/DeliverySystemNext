import { BaseRepository } from "./BaseRepository";
import { OrderItem } from "../models/OrderItem";
import { IOrderItemRepository } from "./interfaces/IOrderItemRepository";

export class OrderItemRepository extends BaseRepository<OrderItem> implements IOrderItemRepository {
  constructor() {
    super(OrderItem);
  }

  async getByOrderIdAsync(orderId: number): Promise<OrderItem[]> {
    return await this.findAll({ where: { OrderId: orderId } });
  }
}

export default new OrderItemRepository();
