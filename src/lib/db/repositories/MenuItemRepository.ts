import { BaseRepository } from "./BaseRepository";
import { MenuItem } from "../models/MenuItem";
import { Category } from "../models/Category";
import { IMenuItemRepository } from "./interfaces/IMenuItemRepository";

const categoryInclude = () => [{ model: Category, as: "Category" }];

export class MenuItemRepository extends BaseRepository<MenuItem> implements IMenuItemRepository {
  constructor() {
    super(MenuItem);
  }

  async getAll(options?: any): Promise<MenuItem[]> {
    return await super.getAll({ ...options, include: categoryInclude() });
  }

  async getById(id: number | string, options?: any): Promise<MenuItem | null> {
    return await super.getById(id, { ...options, include: categoryInclude() });
  }

  async getByRestaurantIdAsync(restaurantId: number): Promise<MenuItem[]> {
    return await this.findAll({
      where: { RestaurantId: restaurantId },
      include: categoryInclude(),
    });
  }

  async getAvailableByRestaurantIdAsync(restaurantId: number): Promise<MenuItem[]> {
    return await this.findAll({
      where: { RestaurantId: restaurantId, IsAvailable: true },
      include: categoryInclude(),
    });
  }
}

export default new MenuItemRepository();
