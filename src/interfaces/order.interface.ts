export interface IOrder {
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
  createdAt: string;
  confirmedAt: string | null;
  deliveredAt: string | null;
  items: IOrderItem[];
}
export interface IOrderItem {
  id: number;
  menuItemId: number;
  menuItemName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}
export interface ICreateOrder {
  restaurantId: number;
  deliveryAddress: string;
  reference: string;
  origin: string;
}
