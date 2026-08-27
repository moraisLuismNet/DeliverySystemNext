import { Order } from "../../models/Order";
import { IBaseRepository } from "./IBaseRepository";

export interface IOrderRepository extends IBaseRepository<Order> {
  getAllWithItemsAsync(orderOptions?: any): Promise<Order[]>;
  getByUserAsync(userId: string): Promise<Order[]>;
  getOrderWithItemsAsync(orderId: number): Promise<Order | null>;
}
