import { AuthResponseDTO } from "../../dtos/Auth/AuthResponseDTO";
import { LoginDTO } from "../../dtos/Auth/LoginDTO";
import { RegisterDTO } from "../../dtos/Auth/RegisterDTO";
import { ChangePasswordDTO } from "../../dtos/Auth/ChangePasswordDTO";

export interface IAuthService {
  loginAsync(dto: LoginDTO): Promise<AuthResponseDTO>;
  registerAsync(dto: RegisterDTO): Promise<AuthResponseDTO>;
  changePasswordAsync(userId: string, dto: ChangePasswordDTO): Promise<void>;
}
