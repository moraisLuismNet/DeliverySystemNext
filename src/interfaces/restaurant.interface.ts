export interface IRestaurant {
  id: number;
  name: string;
  description: string;
  address: string;
  phone: string;
  imageUrl: string;
  isActive: boolean;
  createdAt: string;
}
export interface ICreateRestaurant {
  name: string;
  description: string;
  address: string;
  phone: string;
  imageUrl: string;
}
export interface IUpdateRestaurant {
  name: string;
  description: string;
  address: string;
  phone: string;
  imageUrl: string;
  isActive: boolean;
}
