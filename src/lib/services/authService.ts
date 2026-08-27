import bcrypt from "bcryptjs";
import userRepository from "../db/repositories/UserRepository";
import { AuthResponseDTO } from "../dtos/Auth/AuthResponseDTO";
import { LoginDTO } from "../dtos/Auth/LoginDTO";
import { RegisterDTO } from "../dtos/Auth/RegisterDTO";
import { ChangePasswordDTO } from "../dtos/Auth/ChangePasswordDTO";
import { IAuthService } from "./interfaces/IAuthService";
import { IJwtService } from "./interfaces/IJwtService";
import jwtService from "./jwtService";
import { UserRole } from "../db/models/enums";

export class AuthService implements IAuthService {
  private jwtService: IJwtService;

  constructor() {
    this.jwtService = jwtService;
  }

  async loginAsync(dto: LoginDTO): Promise<AuthResponseDTO> {
    const user = await userRepository.getByEmailAsync(dto.email);
    if (!user || !bcrypt.compareSync(dto.password, user.PasswordHash)) {
      throw new Error("Invalid credentials");
    }

    if (!user.IsActive) {
      throw new Error("Account is disabled");
    }

    return this.generateAuthResponse(user);
  }

  async registerAsync(dto: RegisterDTO): Promise<AuthResponseDTO> {
    const exists = await userRepository.getByEmailAsync(dto.email);
    if (exists) {
      throw new Error("Email already registered");
    }

    const hashedPassword = bcrypt.hashSync(dto.password, 10);

    const user = await userRepository.create({
      Email: dto.email,
      PhoneNumber: dto.phoneNumber,
      Name: dto.name,
      PasswordHash: hashedPassword,
      Role: UserRole.Customer,
      IsActive: true,
    });

    return this.generateAuthResponse(user);
  }

  async changePasswordAsync(userId: string, dto: ChangePasswordDTO): Promise<void> {
    const user = await userRepository.getByEmailAsync(userId);
    if (!user) throw new Error("User not found");

    if (!bcrypt.compareSync(dto.currentPassword, user.PasswordHash)) {
      throw new Error("Current password is incorrect");
    }

    user.PasswordHash = bcrypt.hashSync(dto.newPassword, 10);
    await userRepository.update(userId, { PasswordHash: user.PasswordHash });
  }

  private generateAuthResponse(user: any): AuthResponseDTO {
    const { token, expiresAt } = this.jwtService.generateToken(user);

    return {
      token,
      expiresAt,
      email: user.Email,
      name: user.Name,
      role: user.Role,
    };
  }
}

export default new AuthService();
