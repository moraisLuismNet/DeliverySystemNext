export interface CreateMenuItemDTO {
  restaurantId: number;
  stock: number;
  name: string;
  description: string;
  price: number;
  categoryId: number;
  imageUrl?: string;
}
