import { Attributes, Model } from "sequelize";

export interface IBaseRepository<T extends Model> {
  getById(id: number | string, options?: any): Promise<T | null>;
  getAll(options?: any): Promise<T[]>;
  count(options?: any): Promise<number>;
  findAll(options?: any): Promise<T[]>;
  findOne(options?: any): Promise<T | null>;
  create(data: any, options?: any): Promise<T>;
  update(id: number | string, data: Partial<Attributes<T>>, options?: any): Promise<T>;
  delete(id: number | string): Promise<boolean>;
  exists(id: number | string): Promise<boolean>;
}
