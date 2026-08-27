import { DataTypes, Model, Optional } from "sequelize";
import { getSequelize } from "../database";

export interface ICartAttributes {
  Id: number;
  UserId: string;
  CreatedAt: Date;
  UpdatedAt: Date | null;
}

export type CartCreationAttributes = Optional<ICartAttributes, "Id" | "CreatedAt" | "UpdatedAt">;

export class Cart extends Model<ICartAttributes, CartCreationAttributes> implements ICartAttributes {
  public Id!: number;
  public UserId!: string;
  public CreatedAt!: Date;
  public UpdatedAt!: Date | null;
}

Cart.init(
  {
    Id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    UserId: {
      type: DataTypes.STRING(255),
      allowNull: false,
      references: { model: "Users", key: "Email" },
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
    tableName: "Carts",
    timestamps: true,
    createdAt: "CreatedAt",
    updatedAt: "UpdatedAt",
    sequelize: getSequelize(),
    modelName: "Cart",
  }
);

export default Cart;
