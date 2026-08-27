export interface ICart {
  id: number;
  userId: string;
  items: ICartItem[];
  totalAmount: number;
  createdAt: string;
}
export interface ICartItem {
  id: number;
  menuItemId: number;
  menuItemName: string;
  imageUrl?: string;
  stock: number;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}
export interface IAddToCart {
  menuItemId: number;
  quantity: number;
}
export interface IUpdateCartItem {
  cartItemId: number;
  quantity: number;
}
