import orderRepository from "../db/repositories/OrderRepository";
import orderItemRepository from "../db/repositories/OrderItemRepository";
import { OrderDTO, OrderItemDTO } from "../dtos/Order/OrderDTO";
import { CreateOrderDTO } from "../dtos/Order/CreateOrderDTO";
import { IOrderService } from "./interfaces/IOrderService";

export class OrderService implements IOrderService {
  async getAllAsync(): Promise<OrderDTO[]> {
    const orders = await orderRepository.getAllWithItemsAsync({ order: [["CreatedAt", "DESC"]] });
    return this.toDTOList(orders);
  }

  async getByIdAsync(id: number): Promise<OrderDTO | null> {
    const order = await orderRepository.getOrderWithItemsAsync(id);
    return order ? this.toDTO(order) : null;
  }

  async getByUserAsync(userId: string): Promise<OrderDTO[]> {
    const orders = await orderRepository.getByUserAsync(userId);
    return this.toDTOList(orders);
  }

  async createAsync(userId: string, dto: CreateOrderDTO): Promise<OrderDTO> {
    const order = await orderRepository.create({
      UserId: userId,
      RestaurantId: dto.restaurantId,
      RestaurantName: "",
      Status: "Pending",
      TotalAmount: 0,
      DeliveryAddress: dto.deliveryAddress,
      Reference: dto.reference,
      Origin: dto.origin,
    });

    return this.toDTO(order);
  }

  async confirmAsync(id: number): Promise<OrderDTO> {
    const order = await orderRepository.getById(id);
    if (!order) throw new Error("Order not found");
    if (order.Status !== "Pending") throw new Error("Order already confirmed");

    const updated = await orderRepository.update(id, {
      Status: "Confirmed",
      ConfirmedAt: new Date(),
      UpdatedAt: new Date(),
    } as any);

    return this.toDTO(updated);
  }

  async updateStatusAsync(id: number, status: string): Promise<OrderDTO> {
    const order = await orderRepository.getById(id);
    if (!order) throw new Error("Order not found");

    const updateData: any = { Status: status, UpdatedAt: new Date() };
    if (status === "Delivered") updateData.DeliveredAt = new Date();

    const updated = await orderRepository.update(id, updateData);
    return this.toDTO(updated);
  }

  async cancelAsync(id: number): Promise<void> {
    const order = await orderRepository.getById(id);
    if (!order) throw new Error("Order not found");
    await orderRepository.update(id, { Status: "Cancelled", UpdatedAt: new Date() } as any);
  }

  private async toDTOList(orders: any[]): Promise<OrderDTO[]> {
    return Promise.all(orders.map((o) => this.toDTO(o)));
  }

  private async toDTO(order: any): Promise<OrderDTO> {
    let items: OrderItemDTO[] = [];
    if (order.Items) {
      items = order.Items.map((i: any) => ({
        id: i.Id,
        menuItemId: i.MenuItemId,
        menuItemName: i.MenuItemName,
        quantity: i.Quantity,
        unitPrice: parseFloat(i.UnitPrice),
        subtotal: parseFloat(i.UnitPrice) * i.Quantity,
      }));
    }

    return {
      id: order.Id,
      userId: order.UserId,
      userName: order.UserId,
      restaurantId: order.RestaurantId,
      restaurantName: order.RestaurantName,
      status: order.Status,
      totalAmount: parseFloat(order.TotalAmount),
      deliveryAddress: order.DeliveryAddress,
      reference: order.Reference,
      origin: order.Origin,
      createdAt: order.CreatedAt,
      confirmedAt: order.ConfirmedAt || undefined,
      deliveredAt: order.DeliveredAt || undefined,
      items,
    };
  }
}

export default new OrderService();
