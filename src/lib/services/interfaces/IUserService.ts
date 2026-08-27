import { UserDTO } from "../../dtos/User/UserDTO";
import { CreateUserDTO } from "../../dtos/User/CreateUserDTO";
import { UpdateUserDTO } from "../../dtos/User/UpdateUserDTO";

export interface IUserService {
  getAllAsync(): Promise<UserDTO[]>;
  getByIdAsync(id: string): Promise<UserDTO | null>;
  createAsync(dto: CreateUserDTO): Promise<UserDTO>;
  updateAsync(id: string, dto: UpdateUserDTO): Promise<UserDTO>;
  deleteAsync(id: string): Promise<void>;
}
