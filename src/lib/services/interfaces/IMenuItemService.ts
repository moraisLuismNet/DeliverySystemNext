import { MenuItemDTO } from "../../dtos/MenuItem/MenuItemDTO";
import { CreateMenuItemDTO } from "../../dtos/MenuItem/CreateMenuItemDTO";
import { UpdateMenuItemDTO } from "../../dtos/MenuItem/UpdateMenuItemDTO";

export interface IMenuItemService {
  getAllAsync(): Promise<MenuItemDTO[]>;
  getByIdAsync(id: number): Promise<MenuItemDTO | null>;
  getByRestaurantIdAsync(restaurantId: number): Promise<MenuItemDTO[]>;
  getAvailableByRestaurantIdAsync(restaurantId: number): Promise<MenuItemDTO[]>;
  createAsync(dto: CreateMenuItemDTO): Promise<MenuItemDTO>;
  updateAsync(id: number, dto: UpdateMenuItemDTO): Promise<MenuItemDTO>;
  deleteAsync(id: number): Promise<void>;
}
