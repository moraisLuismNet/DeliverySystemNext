import { fetchApi } from "../utils/fetch-api";
import { IApiResponse } from "../interfaces/api-response.interface";
import { IUser, ICreateUser, IUpdateUser } from "../interfaces/user.interface";

export const userService = {
  getAll: () =>
    fetchApi.get<IApiResponse<IUser[]>>("users"),

  getByEmail: (email: string) =>
    fetchApi.get<IApiResponse<IUser>>(`users/${email}`),

  create: (data: ICreateUser) =>
    fetchApi.post<IApiResponse<IUser>>("users", data),

  update: (email: string, data: IUpdateUser) =>
    fetchApi.put<IApiResponse<IUser>>(`users/${email}`, data),

  delete: (email: string) =>
    fetchApi.delete<IApiResponse<string>>(`users/${email}`),
};
