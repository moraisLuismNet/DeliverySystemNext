import menuItemRepository from "../db/repositories/MenuItemRepository";
import restaurantRepository from "../db/repositories/RestaurantRepository";
import categoryRepository from "../db/repositories/CategoryRepository";
import { MenuItemDTO } from "../dtos/MenuItem/MenuItemDTO";
import { CreateMenuItemDTO } from "../dtos/MenuItem/CreateMenuItemDTO";
import { UpdateMenuItemDTO } from "../dtos/MenuItem/UpdateMenuItemDTO";
import { IMenuItemService } from "./interfaces/IMenuItemService";

export class MenuItemService implements IMenuItemService {
  async getAllAsync(): Promise<MenuItemDTO[]> {
    const items = await menuItemRepository.getAll();
    return this.toDTOList(items);
  }

  async getByIdAsync(id: number): Promise<MenuItemDTO | null> {
    const item = await menuItemRepository.getById(id);
    return item ? this.toDTO(item) : null;
  }

  async getByRestaurantIdAsync(restaurantId: number): Promise<MenuItemDTO[]> {
    const items = await menuItemRepository.getByRestaurantIdAsync(restaurantId);
    return this.toDTOList(items);
  }

  async getAvailableByRestaurantIdAsync(restaurantId: number): Promise<MenuItemDTO[]> {
    const items = await menuItemRepository.getAvailableByRestaurantIdAsync(restaurantId);
    return this.toDTOList(items);
  }

  async createAsync(dto: CreateMenuItemDTO): Promise<MenuItemDTO> {
    const restaurant = await restaurantRepository.getById(dto.restaurantId);
    if (!restaurant) throw new Error("Restaurant not found");

    const category = await categoryRepository.getById(dto.categoryId);
    if (!category) throw new Error("Category not found");

    const item = await menuItemRepository.create({
      RestaurantId: dto.restaurantId,
      Name: dto.name,
      Description: dto.description,
      Price: dto.price,
      CategoryId: dto.categoryId,
      ImageUrl: dto.imageUrl || null,
      Stock: dto.stock,
      IsAvailable: true,
    });

    return this.toDTO(item, restaurant.Name, category.Name);
  }

  async updateAsync(id: number, dto: UpdateMenuItemDTO): Promise<MenuItemDTO> {
    const existing = await menuItemRepository.getById(id);
    if (!existing) throw new Error("Menu item not found");

    if (dto.restaurantId !== undefined) {
      const rest = await restaurantRepository.getById(dto.restaurantId);
      if (!rest) throw new Error("Restaurant not found");
    }
    if (dto.categoryId !== undefined) {
      const cat = await categoryRepository.getById(dto.categoryId);
      if (!cat) throw new Error("Category not found");
    }

    const updateData: any = { UpdatedAt: new Date() };
    if (dto.restaurantId !== undefined) updateData.RestaurantId = dto.restaurantId;
    if (dto.name !== undefined) updateData.Name = dto.name;
    if (dto.description !== undefined) updateData.Description = dto.description;
    if (dto.price !== undefined) updateData.Price = dto.price;
    if (dto.categoryId !== undefined) updateData.CategoryId = dto.categoryId;
    if (dto.isAvailable !== undefined) updateData.IsAvailable = dto.isAvailable;
    if (dto.imageUrl !== undefined) updateData.ImageUrl = dto.imageUrl;
    if (dto.stock !== undefined) updateData.Stock = dto.stock;

    const updated = await menuItemRepository.update(id, updateData);
    return this.toDTO(updated);
  }

  async deleteAsync(id: number): Promise<void> {
    const existing = await menuItemRepository.getById(id);
    if (!existing) throw new Error("Menu item not found");
    await menuItemRepository.delete(id);
  }

  private async toDTOList(items: any[]): Promise<MenuItemDTO[]> {
    return Promise.all(items.map((item) => this.toDTO(item)));
  }

  private async toDTO(item: any, restaurantName?: string, categoryName?: string): Promise<MenuItemDTO> {
    if (!restaurantName && item.RestaurantId) {
      const rest = await restaurantRepository.getById(item.RestaurantId);
      restaurantName = rest?.Name || "";
    }
    if (!categoryName) {
      categoryName = item.Category?.Name || "";
    }
    return {
      id: item.Id,
      restaurantId: item.RestaurantId,
      restaurantName: restaurantName || "",
      name: item.Name,
      description: item.Description,
      price: parseFloat(item.Price),
      categoryId: item.CategoryId,
      categoryName: categoryName || "",
      isAvailable: item.IsAvailable,
      imageUrl: item.ImageUrl || undefined,
      stock: item.Stock,
    };
  }
}

export default new MenuItemService();
