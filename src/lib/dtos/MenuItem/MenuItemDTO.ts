export interface MenuItemDTO {
  id: number;
  restaurantId: number;
  restaurantName: string;
  name: string;
  description: string;
  price: number;
  categoryId: number;
  categoryName: string;
  isAvailable: boolean;
  imageUrl?: string;
  stock: number;
}
