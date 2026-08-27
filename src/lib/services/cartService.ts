import cartRepository from "../db/repositories/CartRepository";
import cartItemRepository from "../db/repositories/CartItemRepository";
import menuItemRepository from "../db/repositories/MenuItemRepository";
import restaurantRepository from "../db/repositories/RestaurantRepository";
import orderRepository from "../db/repositories/OrderRepository";
import orderItemRepository from "../db/repositories/OrderItemRepository";
import paymentService from "./paymentService";
import emailQueueRepository from "../db/repositories/EmailQueueRepository";
import { getSequelize } from "../db/database";
import { CartDTO, CartItemDTO } from "../dtos/Cart/CartDTO";
import { AddToCartDTO } from "../dtos/Cart/AddToCartDTO";
import { UpdateCartItemDTO } from "../dtos/Cart/UpdateCartItemDTO";
import { CartCheckoutDTO } from "../dtos/Cart/CartCheckoutDTO";
import { ICartService } from "./interfaces/ICartService";

export class CartService implements ICartService {
  async getCartAsync(userId: string): Promise<CartDTO> {
    let cart = await cartRepository.getCartByUserIdAsync(userId);
    if (!cart) {
      cart = await cartRepository.create({ UserId: userId });
    }
    const items = await cartItemRepository.getByCartIdAsync(cart.Id);
    return this.toDTO(cart, items);
  }

  async getAllCartsAsync(): Promise<CartDTO[]> {
    const carts = await cartRepository.getAll();
    const result: CartDTO[] = [];
    for (const cart of carts) {
      const items = await cartItemRepository.getByCartIdAsync(cart.Id);
      result.push(this.toDTO(cart, items));
    }
    return result;
  }

  async addItemAsync(userId: string, dto: AddToCartDTO): Promise<CartDTO> {
    const menuItem = await menuItemRepository.getById(dto.menuItemId);
    if (!menuItem) throw new Error("Menu item not found");
    if (!menuItem.IsAvailable) throw new Error("Menu item not available");
    if (menuItem.Stock < dto.quantity) throw new Error("Insufficient stock");

    let cart = await cartRepository.getCartByUserIdAsync(userId);
    if (!cart) {
      cart = await cartRepository.create({ UserId: userId });
    }

    await menuItemRepository.update(dto.menuItemId, {
      Stock: menuItem.Stock - dto.quantity,
      UpdatedAt: new Date(),
    });
    await this.checkLowStockAndAlertAsync(menuItem.Name, menuItem.Stock - dto.quantity);

    const existingItem = await cartItemRepository.getByCartAndMenuItemAsync(cart.Id, dto.menuItemId);
    if (existingItem) {
      const newQty = existingItem.Quantity + dto.quantity;
      await cartItemRepository.update(existingItem.Id, { Quantity: newQty, UpdatedAt: new Date() });
    } else {
      await cartItemRepository.create({
        CartId: cart.Id,
        MenuItemId: dto.menuItemId,
        MenuItemName: menuItem.Name,
        ImageUrl: menuItem.ImageUrl,
        Stock: menuItem.Stock,
        Quantity: dto.quantity,
        UnitPrice: menuItem.Price,
      });
    }

    const items = await cartItemRepository.getByCartIdAsync(cart.Id);
    return this.toDTO(cart, items);
  }

  async updateItemAsync(userId: string, dto: UpdateCartItemDTO): Promise<CartDTO> {
    const cart = await cartRepository.getCartByUserIdAsync(userId);
    if (!cart) throw new Error("Cart not found");

    const item = await cartItemRepository.getById(dto.cartItemId);
    if (!item || item.CartId !== cart.Id) throw new Error("Item not found in cart");

    const menuItem = await menuItemRepository.getById(item.MenuItemId);
    if (!menuItem) throw new Error("Menu item not found");

    if (dto.quantity > menuItem.Stock) throw new Error("Insufficient stock");

    const diff = dto.quantity - item.Quantity;
    await menuItemRepository.update(item.MenuItemId, {
      Stock: menuItem.Stock - diff,
      UpdatedAt: new Date(),
    });
    if (dto.quantity > item.Quantity) {
      await this.checkLowStockAndAlertAsync(menuItem.Name, menuItem.Stock - diff);
    }

    if (dto.quantity <= 0) {
      await cartItemRepository.delete(dto.cartItemId);
    } else {
      await cartItemRepository.update(dto.cartItemId, { Quantity: dto.quantity, UpdatedAt: new Date() });
    }

    const items = await cartItemRepository.getByCartIdAsync(cart.Id);
    return this.toDTO(cart, items);
  }

  async removeItemAsync(userId: string, cartItemId: number): Promise<void> {
    const cart = await cartRepository.getCartByUserIdAsync(userId);
    if (!cart) throw new Error("Cart not found");

    const item = await cartItemRepository.getById(cartItemId);
    if (!item || item.CartId !== cart.Id) throw new Error("Item not found in cart");

    const menuItem = await menuItemRepository.getById(item.MenuItemId);
    if (menuItem) {
      await menuItemRepository.update(item.MenuItemId, {
        Stock: menuItem.Stock + item.Quantity,
        UpdatedAt: new Date(),
      });
    }

    await cartItemRepository.delete(cartItemId);
  }

  async clearCartAsync(userId: string, restoreStock: boolean = true): Promise<void> {
    const cart = await cartRepository.getCartByUserIdAsync(userId);
    if (!cart) return;

    if (restoreStock) {
      const items = await cartItemRepository.getByCartIdAsync(cart.Id);
      for (const item of items) {
        const menuItem = await menuItemRepository.getById(item.MenuItemId);
        if (menuItem) {
          await menuItemRepository.update(item.MenuItemId, {
            Stock: menuItem.Stock + item.Quantity,
            UpdatedAt: new Date(),
          });
        }
      }
    }

    await cartItemRepository.deleteByCartIdAsync(cart.Id);
  }

  async checkoutAsync(userId: string, dto: CartCheckoutDTO): Promise<{ url: string }> {
    const cart = await cartRepository.getCartByUserIdAsync(userId);
    if (!cart) throw new Error("Cart not found");

    const items = await cartItemRepository.getByCartIdAsync(cart.Id);
    if (items.length === 0) throw new Error("Cart is empty");

    const firstItem = items[0];
    const menuItem = await menuItemRepository.getById(firstItem.MenuItemId);
    if (!menuItem) throw new Error("Menu item not found");
    const restaurant = await restaurantRepository.getById(menuItem.RestaurantId);

    const totalAmount = items.reduce((sum, item) => sum + parseFloat(item.UnitPrice.toString()) * item.Quantity, 0);

    const sequelize = getSequelize();
    const transaction = await sequelize.transaction();
    try {
      const order = await orderRepository.create({
        UserId: userId,
        RestaurantId: menuItem.RestaurantId,
        RestaurantName: restaurant?.Name || "",
        Status: "Pending",
        TotalAmount: totalAmount,
        DeliveryAddress: dto.deliveryAddress,
        Reference: dto.reference,
        Origin: dto.origin || "Web",
      }, { transaction });

      for (const item of items) {
        await orderItemRepository.create({
          OrderId: order.Id,
          MenuItemId: item.MenuItemId,
          MenuItemName: item.MenuItemName,
          Quantity: item.Quantity,
          UnitPrice: item.UnitPrice,
        }, { transaction });
      }

      await transaction.commit();

      const session = await paymentService.createCheckoutSessionAsync({ orderId: order.Id });
      return { url: session.sessionUrl };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  private toDTO(cart: any, items: any[]): CartDTO {
    return {
      id: cart.Id,
      userId: cart.UserId,
      items: items.map((i) => ({
        id: i.Id,
        menuItemId: i.MenuItemId,
        menuItemName: i.MenuItemName,
        imageUrl: i.ImageUrl || undefined,
        stock: i.Stock,
        quantity: i.Quantity,
        unitPrice: parseFloat(i.UnitPrice),
        subtotal: parseFloat(i.UnitPrice) * i.Quantity,
      })),
      totalAmount: items.reduce((sum, i) => sum + parseFloat(i.UnitPrice) * i.Quantity, 0),
    };
  }

  private async checkLowStockAndAlertAsync(itemName: string, newStock: number): Promise<void> {
    const threshold = 5;
    if (newStock >= threshold) return;

    const adminEmail = process.env.EMAIL_ADMIN_EMAIL;
    if (!adminEmail) return;

    const subject = `Low Stock Alert: ${itemName}`;
    const body = `
      <div style="font-family:Arial,sans-serif;padding:20px;border:1px solid #ccc;border-radius:5px;">
        <h2 style="color:#d9534f;">Low Stock Warning</h2>
        <p>The stock for the following menu item has dropped below ${threshold} units:</p>
        <ul>
          <li><strong>Name:</strong> ${itemName}</li>
          <li><strong>Remaining Stock:</strong> ${newStock}</li>
        </ul>
        <p>Please restock soon.</p>
      </div>`;

    await emailQueueRepository.create({
      ToEmail: adminEmail,
      Subject: subject,
      Body: body,
      Status: "Pending",
      RetryCount: 0,
      CreatedAt: new Date(),
    });

    console.warn(`Low stock alert queued for ${itemName} (stock: ${newStock})`);
  }
}

export default new CartService();
