export interface ILogin {
  email: string;
  password: string;
}
export interface ILoginResponse {
  token: string;
  email: string;
  name: string;
  role: string;
  expiresAt: string;
}
export interface IUserSession {
  email: string;
  token: string;
  role: string;
  name: string;
}
