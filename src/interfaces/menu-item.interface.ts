export interface IMenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  categoryId: number;
  categoryName: string;
  imageUrl: string;
  isAvailable: boolean;
  stock: number;
  restaurantId: number;
  restaurantName: string;
  createdAt: string;
}
export interface ICreateMenuItem {
  restaurantId: number;
  name: string;
  description: string;
  price: number;
  categoryId: number;
  imageUrl: string;
  stock: number;
}
export interface IUpdateMenuItem {
  restaurantId: number;
  name: string;
  description: string;
  price: number;
  categoryId: number;
  imageUrl: string;
  isAvailable: boolean;
  stock: number;
}
