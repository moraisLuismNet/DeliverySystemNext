import Cart from "./Cart";
import CartItem from "./CartItem";
import Order from "./Order";
import OrderItem from "./OrderItem";
import MenuItem from "./MenuItem";
import Category from "./Category";
import Payment from "./Payment";
import EmailQueue from "./EmailQueue";
import NotificationQueue from "./NotificationQueue";

export function setupAssociations() {
  Cart.hasMany(CartItem, {
    foreignKey: "CartId",
    as: "Items",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  CartItem.belongsTo(Cart, {
    foreignKey: "CartId",
    as: "Cart",
  });

  Order.hasMany(OrderItem, {
    foreignKey: "OrderId",
    as: "Items",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  OrderItem.belongsTo(Order, {
    foreignKey: "OrderId",
    as: "Order",
  });

  Order.hasMany(Payment, {
    foreignKey: "OrderId",
    as: "Payments",
  });

  Payment.belongsTo(Order, {
    foreignKey: "OrderId",
    as: "Order",
  });

  Order.hasMany(EmailQueue, {
    foreignKey: "OrderId",
    as: "Emails",
  });

  EmailQueue.belongsTo(Order, {
    foreignKey: "OrderId",
    as: "Order",
  });

  Order.hasMany(NotificationQueue, {
    foreignKey: "OrderId",
    as: "Notifications",
  });

  NotificationQueue.belongsTo(Order, {
    foreignKey: "OrderId",
    as: "Order",
  });

  MenuItem.belongsTo(Category, {
    foreignKey: "CategoryId",
    as: "Category",
  });

  Category.hasMany(MenuItem, {
    foreignKey: "CategoryId",
    as: "MenuItems",
  });
}
