import { Model, ModelStatic, Identifier, Attributes } from "sequelize";
import { IBaseRepository } from "./interfaces/IBaseRepository";

export abstract class BaseRepository<T extends Model> implements IBaseRepository<T> {
  public model: ModelStatic<T>;

  constructor(model: ModelStatic<T>) {
    this.model = model;
  }

  async getById(id: number | string, options?: any): Promise<T | null> {
    return await this.model.findByPk(id as Identifier, options);
  }

  async getAll(options?: any): Promise<T[]> {
    return await this.model.findAll(options);
  }

  async count(options?: any): Promise<number> {
    return await this.model.count(options) as any as number;
  }

  async findAll(options?: any): Promise<T[]> {
    return await this.model.findAll(options);
  }

  async findOne(options?: any): Promise<T | null> {
    return await this.model.findOne(options);
  }

  async create(data: any, options?: any): Promise<T> {
    const result = await this.model.create(data, options);
    return result as T;
  }

  async update(id: number | string, data: Partial<Attributes<T>>, options?: any): Promise<T> {
    const [affectedCount] = await this.model.update(data as any, {
      where: { [this.model.primaryKeyAttribute]: id } as any,
      ...options,
    });

    if (affectedCount === 0) {
      throw new Error(`Record with id ${id} not found or no changes made`);
    }

    const fetchOptions = { ...options };
    delete fetchOptions.transaction;
    const updatedRecord = await this.model.findByPk(id as Identifier, fetchOptions);
    return updatedRecord!;
  }

  async delete(id: number | string): Promise<boolean> {
    const deletedCount = await this.model.destroy({
      where: { [this.model.primaryKeyAttribute]: id } as any,
    });
    return deletedCount > 0;
  }

  async exists(id: number | string): Promise<boolean> {
    const count = await this.model.count({
      where: { [this.model.primaryKeyAttribute]: id } as any,
    });
    return count > 0;
  }
}
