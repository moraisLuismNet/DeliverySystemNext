export interface RestaurantDTO {
  id: number;
  name: string;
  description: string;
  address: string;
  phone: string;
  imageUrl: string | null;
  isActive: boolean;
}
