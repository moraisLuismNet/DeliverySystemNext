export interface OrderItemDTO {
  id: number;
  menuItemId: number;
  menuItemName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface OrderDTO {
  id: number;
  userId: string;
  userName: string;
  restaurantId: number;
  restaurantName: string;
  status: string;
  totalAmount: number;
  deliveryAddress: string;
  reference: string;
  origin: string;
  createdAt: Date;
  confirmedAt?: Date;
  deliveredAt?: Date;
  items: OrderItemDTO[];
}
