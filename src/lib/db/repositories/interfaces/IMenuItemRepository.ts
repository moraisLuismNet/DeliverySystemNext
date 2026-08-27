import { MenuItem } from "../../models/MenuItem";
import { IBaseRepository } from "./IBaseRepository";

export interface IMenuItemRepository extends IBaseRepository<MenuItem> {
  getByRestaurantIdAsync(restaurantId: number): Promise<MenuItem[]>;
  getAvailableByRestaurantIdAsync(restaurantId: number): Promise<MenuItem[]>;
}
