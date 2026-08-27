import { BaseRepository } from "./BaseRepository";
import { User } from "../models/User";
import { IUserRepository } from "./interfaces/IUserRepository";

export class UserRepository extends BaseRepository<User> implements IUserRepository {
  constructor() {
    super(User);
  }

  async getByEmailAsync(email: string): Promise<User | null> {
    return await this.getById(email);
  }

  async isEmailUniqueAsync(email: string): Promise<boolean> {
    const user = await this.getByEmailAsync(email);
    return user === null;
  }

  async getAllUsers(): Promise<User[]> {
    return await this.getAll();
  }
}

export default new UserRepository();
