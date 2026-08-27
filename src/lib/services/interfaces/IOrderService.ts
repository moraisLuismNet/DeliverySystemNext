import { OrderDTO } from "../../dtos/Order/OrderDTO";
import { CreateOrderDTO } from "../../dtos/Order/CreateOrderDTO";

export interface IOrderService {
  getAllAsync(): Promise<OrderDTO[]>;
  getByIdAsync(id: number): Promise<OrderDTO | null>;
  getByUserAsync(userId: string): Promise<OrderDTO[]>;
  createAsync(userId: string, dto: CreateOrderDTO): Promise<OrderDTO>;
  confirmAsync(id: number): Promise<OrderDTO>;
  updateStatusAsync(id: number, status: string): Promise<OrderDTO>;
  cancelAsync(id: number): Promise<void>;
}
