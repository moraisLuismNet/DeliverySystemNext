import categoryRepository from "../db/repositories/CategoryRepository";
import { CategoryDTO } from "../dtos/Category/CategoryDTO";
import { CreateCategoryDTO } from "../dtos/Category/CreateCategoryDTO";
import { UpdateCategoryDTO } from "../dtos/Category/UpdateCategoryDTO";
import { ICategoryService } from "./interfaces/ICategoryService";

export class CategoryService implements ICategoryService {
  async getAllAsync(): Promise<CategoryDTO[]> {
    const categories = await categoryRepository.getAll();
    return categories.map((c) => this.toDTO(c));
  }

  async getActiveAsync(): Promise<CategoryDTO[]> {
    const categories = await categoryRepository.getActiveAsync();
    return categories.map((c) => this.toDTO(c));
  }

  async getByIdAsync(id: number): Promise<CategoryDTO | null> {
    const category = await categoryRepository.getById(id);
    return category ? this.toDTO(category) : null;
  }

  async createAsync(dto: CreateCategoryDTO): Promise<CategoryDTO> {
    const category = await categoryRepository.create({
      Name: dto.name,
      Description: dto.description || null,
      IsActive: true,
    });
    return this.toDTO(category);
  }

  async updateAsync(id: number, dto: UpdateCategoryDTO): Promise<CategoryDTO> {
    const existing = await categoryRepository.getById(id);
    if (!existing) throw new Error("Category not found");

    const updated = await categoryRepository.update(id, {
      Name: dto.name,
      Description: dto.description !== undefined ? dto.description : existing.Description,
      IsActive: dto.isActive,
      UpdatedAt: new Date(),
    } as any);

    return this.toDTO(updated);
  }

  async deleteAsync(id: number): Promise<void> {
    const existing = await categoryRepository.getById(id);
    if (!existing) throw new Error("Category not found");
    await categoryRepository.update(id, { IsActive: false, UpdatedAt: new Date() } as any);
  }

  private toDTO(c: any): CategoryDTO {
    return {
      id: c.Id,
      name: c.Name,
      description: c.Description || undefined,
      isActive: c.IsActive,
      createdAt: c.CreatedAt,
    };
  }
}

export default new CategoryService();
