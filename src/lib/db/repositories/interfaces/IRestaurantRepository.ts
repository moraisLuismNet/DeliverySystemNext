import { Restaurant } from "../../models/Restaurant";
import { IBaseRepository } from "./IBaseRepository";

export interface IRestaurantRepository extends IBaseRepository<Restaurant> {
  getActiveAsync(): Promise<Restaurant[]>;
  getByNameAsync(name: string): Promise<Restaurant | null>;
}
