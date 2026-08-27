import { OrderItem } from "../../models/OrderItem";
import { IBaseRepository } from "./IBaseRepository";

export interface IOrderItemRepository extends IBaseRepository<OrderItem> {
  getByOrderIdAsync(orderId: number): Promise<OrderItem[]>;
}
