import { RestaurantDTO } from "../../dtos/Restaurant/RestaurantDTO";
import { CreateRestaurantDTO } from "../../dtos/Restaurant/CreateRestaurantDTO";
import { UpdateRestaurantDTO } from "../../dtos/Restaurant/UpdateRestaurantDTO";

export interface IRestaurantService {
  getAllAsync(): Promise<RestaurantDTO[]>;
  getActiveAsync(): Promise<RestaurantDTO[]>;
  getByIdAsync(id: number): Promise<RestaurantDTO | null>;
  createAsync(dto: CreateRestaurantDTO): Promise<RestaurantDTO>;
  updateAsync(id: number, dto: UpdateRestaurantDTO): Promise<RestaurantDTO>;
  deleteAsync(id: number): Promise<void>;
}
