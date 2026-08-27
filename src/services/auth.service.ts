import { fetchApi } from "../utils/fetch-api";
import { IApiResponse } from "../interfaces/api-response.interface";
import { ILogin, ILoginResponse } from "../interfaces/login.interface";
import { IRegister } from "../interfaces/register.interface";

export const authService = {
  login: (data: ILogin) =>
    fetchApi.post<IApiResponse<ILoginResponse>>("auth/login", data),

  register: (data: IRegister) =>
    fetchApi.post<IApiResponse<string>>("auth/register", data),
};
