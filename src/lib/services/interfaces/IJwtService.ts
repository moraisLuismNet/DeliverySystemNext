import { User } from "../../db/models/User";

export interface IJwtService {
  generateToken(user: User): { token: string; expiresAt: Date };
  validateToken(token: string): any;
}
