import userRepository from "../db/repositories/UserRepository";
import { UserDTO } from "../dtos/User/UserDTO";
import { CreateUserDTO } from "../dtos/User/CreateUserDTO";
import { UpdateUserDTO } from "../dtos/User/UpdateUserDTO";
import { IUserService } from "./interfaces/IUserService";
import { UserRole } from "../db/models/enums";
import bcrypt from "bcryptjs";

export class UserService implements IUserService {
  async getAllAsync(): Promise<UserDTO[]> {
    const users = await userRepository.getAllUsers();
    return users.map((u) => this.toDTO(u));
  }

  async getByIdAsync(id: string): Promise<UserDTO | null> {
    const user = await userRepository.getByEmailAsync(id);
    return user ? this.toDTO(user) : null;
  }

  async createAsync(dto: CreateUserDTO): Promise<UserDTO> {
    const exists = await userRepository.getByEmailAsync(dto.email);
    if (exists) throw new Error("Email already exists");

    const hashedPassword = bcrypt.hashSync(dto.password, 10);

    const user = await userRepository.create({
      Email: dto.email,
      PhoneNumber: dto.phoneNumber,
      Name: dto.name,
      PasswordHash: hashedPassword,
      Role: dto.role || UserRole.Customer,
      IsActive: true,
    });

    return this.toDTO(user);
  }

  async updateAsync(id: string, dto: UpdateUserDTO): Promise<UserDTO> {
    const user = await userRepository.getByEmailAsync(id);
    if (!user) throw new Error("User not found");

    const updateData: any = {};
    if (dto.name !== undefined) updateData.Name = dto.name;
    if (dto.phoneNumber !== undefined) updateData.PhoneNumber = dto.phoneNumber;
    if (dto.isActive !== undefined) updateData.IsActive = dto.isActive;

    const updated = await userRepository.update(id, updateData);
    return this.toDTO(updated);
  }

  async deleteAsync(id: string): Promise<void> {
    const user = await userRepository.getByEmailAsync(id);
    if (!user) throw new Error("User not found");
    await userRepository.update(id, { IsActive: false } as any);
  }

  private toDTO(user: any): UserDTO {
    return {
      id: user.Email,
      email: user.Email,
      phoneNumber: user.PhoneNumber,
      name: user.Name,
      role: user.Role,
      isActive: user.IsActive,
    };
  }
}

export default new UserService();
