import { BaseRepository } from "./BaseRepository";
import { Category } from "../models/Category";
import { ICategoryRepository } from "./interfaces/ICategoryRepository";

export class CategoryRepository extends BaseRepository<Category> implements ICategoryRepository {
  constructor() {
    super(Category);
  }

  async getActiveAsync(): Promise<Category[]> {
    return await this.findAll({ where: { IsActive: true } });
  }
}

export default new CategoryRepository();
