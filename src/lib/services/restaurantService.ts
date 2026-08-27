import restaurantRepository from "../db/repositories/RestaurantRepository";
import { RestaurantDTO } from "../dtos/Restaurant/RestaurantDTO";
import { CreateRestaurantDTO } from "../dtos/Restaurant/CreateRestaurantDTO";
import { UpdateRestaurantDTO } from "../dtos/Restaurant/UpdateRestaurantDTO";
import { IRestaurantService } from "./interfaces/IRestaurantService";

export class RestaurantService implements IRestaurantService {
  async getAllAsync(): Promise<RestaurantDTO[]> {
    const restaurants = await restaurantRepository.getAll();
    return restaurants.map((r) => this.toDTO(r));
  }

  async getActiveAsync(): Promise<RestaurantDTO[]> {
    const restaurants = await restaurantRepository.getActiveAsync();
    return restaurants.map((r) => this.toDTO(r));
  }

  async getByIdAsync(id: number): Promise<RestaurantDTO | null> {
    const restaurant = await restaurantRepository.getById(id);
    return restaurant ? this.toDTO(restaurant) : null;
  }

  async createAsync(dto: CreateRestaurantDTO): Promise<RestaurantDTO> {
    const restaurant = await restaurantRepository.create({
      Name: dto.name,
      Description: dto.description,
      Address: dto.address,
      Phone: dto.phone,
      ImageUrl: dto.imageUrl || null,
      IsActive: true,
    });
    return this.toDTO(restaurant);
  }

  async updateAsync(id: number, dto: UpdateRestaurantDTO): Promise<RestaurantDTO> {
    const existing = await restaurantRepository.getById(id);
    if (!existing) throw new Error("Restaurant not found");

    const updateData: any = { UpdatedAt: new Date() };
    if (dto.name !== undefined) updateData.Name = dto.name;
    if (dto.description !== undefined) updateData.Description = dto.description;
    if (dto.address !== undefined) updateData.Address = dto.address;
    if (dto.phone !== undefined) updateData.Phone = dto.phone;
    if (dto.imageUrl !== undefined) updateData.ImageUrl = dto.imageUrl;
    if (dto.isActive !== undefined) updateData.IsActive = dto.isActive;

    const updated = await restaurantRepository.update(id, updateData);
    return this.toDTO(updated);
  }

  async deleteAsync(id: number): Promise<void> {
    const existing = await restaurantRepository.getById(id);
    if (!existing) throw new Error("Restaurant not found");
    await restaurantRepository.update(id, { IsActive: false, UpdatedAt: new Date() } as any);
  }

  private toDTO(r: any): RestaurantDTO {
    return {
      id: r.Id,
      name: r.Name,
      description: r.Description,
      address: r.Address,
      phone: r.Phone,
      imageUrl: r.ImageUrl,
      isActive: r.IsActive,
    };
  }
}

export default new RestaurantService();
