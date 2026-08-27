import { fetchApi } from "../utils/fetch-api";
import { IApiResponse } from "../interfaces/api-response.interface";
import { IRestaurant, ICreateRestaurant, IUpdateRestaurant } from "../interfaces/restaurant.interface";

export const restaurantService = {
  getAll: () =>
    fetchApi.get<IApiResponse<IRestaurant[]>>("restaurants"),

  getById: (id: number) =>
    fetchApi.get<IApiResponse<IRestaurant>>(`restaurants/${id}`),

  getAvailable: () =>
    fetchApi.get<IApiResponse<IRestaurant[]>>("restaurants/active"),

  create: (data: ICreateRestaurant) =>
    fetchApi.post<IApiResponse<IRestaurant>>("restaurants", data),

  update: (id: number, data: IUpdateRestaurant) =>
    fetchApi.put<IApiResponse<IRestaurant>>(`restaurants/${id}`, data),

  delete: (id: number) =>
    fetchApi.delete<IApiResponse<string>>(`restaurants/${id}`),
};
