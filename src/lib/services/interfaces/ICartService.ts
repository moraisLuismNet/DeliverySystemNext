import { CartDTO } from "../../dtos/Cart/CartDTO";
import { AddToCartDTO } from "../../dtos/Cart/AddToCartDTO";
import { UpdateCartItemDTO } from "../../dtos/Cart/UpdateCartItemDTO";
import { CartCheckoutDTO } from "../../dtos/Cart/CartCheckoutDTO";

export interface ICartService {
  getCartAsync(userId: string): Promise<CartDTO>;
  getAllCartsAsync(): Promise<CartDTO[]>;
  addItemAsync(userId: string, dto: AddToCartDTO): Promise<CartDTO>;
  updateItemAsync(userId: string, dto: UpdateCartItemDTO): Promise<CartDTO>;
  removeItemAsync(userId: string, cartItemId: number): Promise<void>;
  clearCartAsync(userId: string, restoreStock?: boolean): Promise<void>;
  checkoutAsync(userId: string, dto: CartCheckoutDTO): Promise<{ url: string }>;
}
