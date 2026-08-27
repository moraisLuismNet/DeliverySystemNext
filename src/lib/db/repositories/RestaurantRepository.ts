import { Op } from "sequelize";
import { BaseRepository } from "./BaseRepository";
import { Restaurant } from "../models/Restaurant";
import { IRestaurantRepository } from "./interfaces/IRestaurantRepository";

export class RestaurantRepository extends BaseRepository<Restaurant> implements IRestaurantRepository {
  constructor() {
    super(Restaurant);
  }

  async getActiveAsync(): Promise<Restaurant[]> {
    return await this.findAll({ where: { IsActive: true } });
  }

  async getByNameAsync(name: string): Promise<Restaurant | null> {
    return await this.findOne({ where: { Name: { [Op.iLike]: `%${name}%` } } });
  }
}

export default new RestaurantRepository();
