import { BaseRepository } from "./BaseRepository";
import { CartItem } from "../models/CartItem";
import { ICartItemRepository } from "./interfaces/ICartItemRepository";

export class CartItemRepository extends BaseRepository<CartItem> implements ICartItemRepository {
  constructor() {
    super(CartItem);
  }

  async getByCartIdAsync(cartId: number): Promise<CartItem[]> {
    return await this.findAll({ where: { CartId: cartId } });
  }

  async getByCartAndMenuItemAsync(cartId: number, menuItemId: number): Promise<CartItem | null> {
    return await this.findOne({ where: { CartId: cartId, MenuItemId: menuItemId } });
  }

  async deleteByCartIdAsync(cartId: number): Promise<boolean> {
    const deletedCount = await this.model.destroy({ where: { CartId: cartId } as any });
    return deletedCount > 0;
  }
}

export default new CartItemRepository();
