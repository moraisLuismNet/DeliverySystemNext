import { CartItem } from "../../models/CartItem";
import { IBaseRepository } from "./IBaseRepository";

export interface ICartItemRepository extends IBaseRepository<CartItem> {
  getByCartIdAsync(cartId: number): Promise<CartItem[]>;
  getByCartAndMenuItemAsync(cartId: number, menuItemId: number): Promise<CartItem | null>;
  deleteByCartIdAsync(cartId: number): Promise<boolean>;
}
