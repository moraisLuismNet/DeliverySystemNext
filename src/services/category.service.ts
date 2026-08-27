import { fetchApi } from "../utils/fetch-api";
import { IApiResponse } from "../interfaces/api-response.interface";
import { ICategory, ICreateCategory, IUpdateCategory } from "../interfaces/category.interface";

export const categoryService = {
  getAll: () =>
    fetchApi.get<IApiResponse<ICategory[]>>("categories"),

  getById: (id: number) =>
    fetchApi.get<IApiResponse<ICategory>>(`categories/${id}`),

  create: (data: ICreateCategory) =>
    fetchApi.post<IApiResponse<ICategory>>("categories", data),

  update: (id: number, data: IUpdateCategory) =>
    fetchApi.put<IApiResponse<ICategory>>(`categories/${id}`, data),

  delete: (id: number) =>
    fetchApi.delete<IApiResponse<string>>(`categories/${id}`),
};
