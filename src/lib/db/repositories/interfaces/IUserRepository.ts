import { User } from "../../models/User";
import { IBaseRepository } from "./IBaseRepository";

export interface IUserRepository extends IBaseRepository<User> {
  getByEmailAsync(email: string): Promise<User | null>;
  isEmailUniqueAsync(email: string): Promise<boolean>;
  getAllUsers(): Promise<User[]>;
}
