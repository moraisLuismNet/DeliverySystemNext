import { Cart } from "../../models/Cart";
import { IBaseRepository } from "./IBaseRepository";

export interface ICartRepository extends IBaseRepository<Cart> {
  getCartByUserIdAsync(userId: string): Promise<Cart | null>;
  getCartWithItemsAsync(cartId: number): Promise<Cart | null>;
}
