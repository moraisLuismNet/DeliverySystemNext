import { CategoryDTO } from "../../dtos/Category/CategoryDTO";
import { CreateCategoryDTO } from "../../dtos/Category/CreateCategoryDTO";
import { UpdateCategoryDTO } from "../../dtos/Category/UpdateCategoryDTO";

export interface ICategoryService {
  getAllAsync(): Promise<CategoryDTO[]>;
  getActiveAsync(): Promise<CategoryDTO[]>;
  getByIdAsync(id: number): Promise<CategoryDTO | null>;
  createAsync(dto: CreateCategoryDTO): Promise<CategoryDTO>;
  updateAsync(id: number, dto: UpdateCategoryDTO): Promise<CategoryDTO>;
  deleteAsync(id: number): Promise<void>;
}
