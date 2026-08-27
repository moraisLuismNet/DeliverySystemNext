import { fetchApi } from "../utils/fetch-api";
import { IApiResponse } from "../interfaces/api-response.interface";
import { ICart, IAddToCart, IUpdateCartItem } from "../interfaces/cart.interface";

export const cartService = {
  getCart: () =>
    fetchApi.get<IApiResponse<ICart>>("cart"),

  getCartById: (id: number) =>
    fetchApi.get<IApiResponse<ICart>>(`cart/${id}`),

  adminGetAllCarts: () =>
    fetchApi.get<IApiResponse<ICart[]>>("cart/admin"),

  addToCart: (data: IAddToCart) =>
    fetchApi.post<IApiResponse<ICart>>("cart/items", data),

  updateItem: (data: IUpdateCartItem) =>
    fetchApi.put<IApiResponse<ICart>>("cart/items", data),

  removeItem: (cartItemId: number) =>
    fetchApi.delete<IApiResponse<ICart>>(`cart/items/${cartItemId}`),

  clearCart: (restoreStock?: boolean) =>
    fetchApi.delete<IApiResponse<string>>(`cart${restoreStock !== undefined ? `?restoreStock=${restoreStock}` : ""}`),

  checkout: (data: { deliveryAddress: string; reference: string; origin: string }) =>
    fetchApi.post<IApiResponse<{ url: string }>>("cart/checkout", data),
};
