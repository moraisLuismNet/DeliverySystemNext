import { Order } from "../models/Order";
import OrderItem from "../models/OrderItem";
import { BaseRepository } from "./BaseRepository";
import { IOrderRepository } from "./interfaces/IOrderRepository";

export class OrderRepository extends BaseRepository<Order> implements IOrderRepository {
  constructor() {
    super(Order);
  }

  async getAllWithItemsAsync(orderOptions?: any): Promise<Order[]> {
    return await this.findAll({
      ...orderOptions,
      include: [{ model: OrderItem, as: "Items" }],
    });
  }

  async getByUserAsync(userId: string): Promise<Order[]> {
    return await this.findAll({
      where: { UserId: userId },
      order: [["CreatedAt", "DESC"]],
      include: [{ model: OrderItem, as: "Items" }],
    });
  }

  async getOrderWithItemsAsync(orderId: number): Promise<Order | null> {
    return await this.findOne({
      where: { Id: orderId },
      include: [{ model: OrderItem, as: "Items" }],
    });
  }
}

export default new OrderRepository();
