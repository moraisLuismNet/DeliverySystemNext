import jwt from "jsonwebtoken";
import { IJwtService } from "./interfaces/IJwtService";
import { User } from "../db/models/User";

export class JwtService implements IJwtService {
  private secretKey: string;
  private issuer: string;
  private audience: string;
  private expiryHours: number;

  constructor() {
    this.secretKey = process.env.JWT_KEY || "default_secret_key";
    this.issuer = process.env.JWT_ISSUER || "DeliverySystemApiNode";
    this.audience = process.env.JWT_AUDIENCE || "DeliverySystemApiNode";
    this.expiryHours = parseInt(process.env.JWT_EXPIRY_HOURS || "1");
  }

  generateToken(user: User): { token: string; expiresAt: Date } {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + this.expiryHours);

    const token = jwt.sign(
      {
        email: user.Email,
        name: user.Name,
        role: user.Role,
      },
      this.secretKey,
      {
        expiresIn: `${this.expiryHours}h`,
        issuer: this.issuer,
        audience: this.audience,
      }
    );

    return { token, expiresAt };
  }

  validateToken(token: string): any {
    return jwt.verify(token, this.secretKey, {
      issuer: this.issuer,
      audience: this.audience,
    });
  }
}

export default new JwtService();
