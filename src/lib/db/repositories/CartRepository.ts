import { Cart } from "../models/Cart";
import CartItem from "../models/CartItem";
import { BaseRepository } from "./BaseRepository";
import { ICartRepository } from "./interfaces/ICartRepository";

export class CartRepository extends BaseRepository<Cart> implements ICartRepository {
  constructor() {
    super(Cart);
  }

  async getCartByUserIdAsync(userId: string): Promise<Cart | null> {
    return await this.findOne({ where: { UserId: userId } });
  }

  async getCartWithItemsAsync(cartId: number): Promise<Cart | null> {
    return await this.findOne({
      where: { Id: cartId },
      include: [{ model: CartItem, as: "Items" }],
    });
  }
}

export default new CartRepository();
