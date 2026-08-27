export interface UpdateMenuItemDTO {
  restaurantId?: number;
  name?: string;
  description?: string;
  price?: number;
  categoryId?: number;
  isAvailable?: boolean;
  stock?: number;
  imageUrl?: string;
}
