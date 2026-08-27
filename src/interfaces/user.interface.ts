export interface IUser {
  email: string;
  name: string;
  role: string;
  phoneNumber: string;
  isActive: boolean;
  createdAt: string;
}
export interface ICreateUser {
  email: string;
  name: string;
  password: string;
  role: string;
  phoneNumber: string;
}
export interface IUpdateUser {
  name: string;
  role: string;
  phoneNumber: string;
  isActive: boolean;
}
