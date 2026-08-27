import { DataTypes, Model, Optional } from "sequelize";
import { getSequelize } from "../database";

export interface ICartItemAttributes {
  Id: number;
  CartId: number;
  MenuItemId: number;
  MenuItemName: string;
  ImageUrl: string | null;
  Stock: number;
  Quantity: number;
  UnitPrice: number;
  CreatedAt: Date;
  UpdatedAt: Date | null;
}

export type CartItemCreationAttributes = Optional<ICartItemAttributes, "Id" | "ImageUrl" | "CreatedAt" | "UpdatedAt">;

export class CartItem extends Model<ICartItemAttributes, CartItemCreationAttributes> implements ICartItemAttributes {
  public Id!: number;
  public CartId!: number;
  public MenuItemId!: number;
  public MenuItemName!: string;
  public ImageUrl!: string | null;
  public Stock!: number;
  public Quantity!: number;
  public UnitPrice!: number;
  public CreatedAt!: Date;
  public UpdatedAt!: Date | null;
}

CartItem.init(
  {
    Id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    CartId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "Carts", key: "Id" },
    },
    MenuItemId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    MenuItemName: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    ImageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    Stock: {
      type: DataTypes.INTEGER,
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
    tableName: "CartItems",
    timestamps: true,
    createdAt: "CreatedAt",
    updatedAt: "UpdatedAt",
    sequelize: getSequelize(),
    modelName: "CartItem",
  }
);

export default CartItem;
