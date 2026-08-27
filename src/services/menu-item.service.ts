import { fetchApi } from "../utils/fetch-api";
import { IApiResponse } from "../interfaces/api-response.interface";
import { IMenuItem, ICreateMenuItem, IUpdateMenuItem } from "../interfaces/menu-item.interface";

export const menuItemService = {
  getAll: () =>
    fetchApi.get<IApiResponse<IMenuItem[]>>("menuitems"),

  getById: (id: number) =>
    fetchApi.get<IApiResponse<IMenuItem>>(`menuitems/${id}`),

  getByRestaurant: (restaurantId: number) =>
    fetchApi.get<IApiResponse<IMenuItem[]>>(`menuitems/restaurant/${restaurantId}`),

  getAvailableByRestaurant: (restaurantId: number) =>
    fetchApi.get<IApiResponse<IMenuItem[]>>(`menuitems/restaurant/${restaurantId}/available`),

  create: (data: ICreateMenuItem) =>
    fetchApi.post<IApiResponse<IMenuItem>>("menuitems", data),

  update: (id: number, data: IUpdateMenuItem) =>
    fetchApi.put<IApiResponse<IMenuItem>>(`menuitems/${id}`, data),

  delete: (id: number) =>
    fetchApi.delete<IApiResponse<string>>(`menuitems/${id}`),
};
