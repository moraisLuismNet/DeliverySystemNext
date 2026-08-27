export interface AuthResponseDTO {
  token: string;
  expiresAt: Date;
  email: string;
  name: string;
  role: string;
}
