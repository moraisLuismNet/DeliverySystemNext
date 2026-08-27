export interface CartItemDTO {
  id: number;
  menuItemId: number;
  menuItemName: string;
  imageUrl?: string;
  stock: number;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface CartDTO {
  id: number;
  userId: string;
  items: CartItemDTO[];
  totalAmount: number;
}
