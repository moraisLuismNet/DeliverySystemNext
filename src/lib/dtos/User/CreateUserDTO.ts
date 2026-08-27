export interface CreateUserDTO {
  email: string;
  phoneNumber: string;
  name: string;
  password: string;
  role?: string;
}
