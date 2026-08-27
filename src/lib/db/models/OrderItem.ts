import { DataTypes, Model, Optional } from "sequelize";
import { getSequelize } from "../database";

export interface IOrderItemAttributes {
  Id: number;
  OrderId: number;
  MenuItemId: number;
  MenuItemName: string;
  Quantity: number;
  UnitPrice: number;
  CreatedAt: Date;
  UpdatedAt: Date | null;
}

export type OrderItemCreationAttributes = Optional<IOrderItemAttributes, "Id" | "CreatedAt" | "UpdatedAt">;

export class OrderItem extends Model<IOrderItemAttributes, OrderItemCreationAttributes> implements IOrderItemAttributes {
  public Id!: number;
  public OrderId!: number;
  public MenuItemId!: number;
  public MenuItemName!: string;
  public Quantity!: number;
  public UnitPrice!: number;
  public CreatedAt!: Date;
  public UpdatedAt!: Date | null;
}

OrderItem.init(
  {
    Id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    OrderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "Orders", key: "Id" },
    },
    MenuItemId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    MenuItemName: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    Quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    UnitPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    CreatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    UpdatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "OrderItems",
    timestamps: true,
    createdAt: "CreatedAt",
    updatedAt: "UpdatedAt",
    sequelize: getSequelize(),
    modelName: "OrderItem",
  }
);

export default OrderItem;
