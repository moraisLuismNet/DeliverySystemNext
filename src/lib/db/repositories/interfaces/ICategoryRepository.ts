import { Category } from "../../models/Category";
import { IBaseRepository } from "./IBaseRepository";

export interface ICategoryRepository extends IBaseRepository<Category> {
  getActiveAsync(): Promise<Category[]>;
}
