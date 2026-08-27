import { fetchApi } from "../utils/fetch-api";
import { IApiResponse } from "../interfaces/api-response.interface";
import { IOrder, ICreateOrder } from "../interfaces/order.interface";

export const orderService = {
  getAll: () =>
    fetchApi.get<IApiResponse<IOrder[]>>("orders"),

  getById: (id: number) =>
    fetchApi.get<IApiResponse<IOrder>>(`orders/${id}`),

  getByUser: () =>
    fetchApi.get<IApiResponse<IOrder[]>>("orders/my"),

  create: (data: ICreateOrder) =>
    fetchApi.post<IApiResponse<IOrder>>("orders", data),

  confirm: (id: number) =>
    fetchApi.post<IApiResponse<IOrder>>(`orders/${id}/confirm`),

  cancel: (id: number) =>
    fetchApi.delete<IApiResponse<IOrder>>(`orders/${id}`),

  deliver: (id: number) =>
    fetchApi.put<IApiResponse<IOrder>>(`orders/${id}/status`, { status: "Delivered" }),

  delete: (id: number) =>
    fetchApi.delete<IApiResponse<string>>(`orders/${id}`),

  paymentSuccess: (sessionId: string) =>
    fetchApi.get<IApiResponse<string>>(`orders/payment-success?session_id=${sessionId}`),
};
