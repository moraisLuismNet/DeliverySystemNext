import { DataTypes, Model, Optional } from "sequelize";
import { getSequelize } from "../database";
import { OrderStatus } from "./OrderStatus";

export interface IOrderAttributes {
  Id: number;
  UserId: string;
  RestaurantId: number;
  RestaurantName: string;
  Status: string;
  TotalAmount: number;
  DeliveryAddress: string;
  Reference: string;
  Origin: string;
  ConfirmedAt: Date | null;
  DeliveredAt: Date | null;
  CreatedAt: Date;
  UpdatedAt: Date | null;
}

export type OrderCreationAttributes = Optional<IOrderAttributes, "Id" | "Status" | "ConfirmedAt" | "DeliveredAt" | "CreatedAt" | "UpdatedAt">;

export class Order extends Model<IOrderAttributes, OrderCreationAttributes> implements IOrderAttributes {
  public Id!: number;
  public UserId!: string;
  public RestaurantId!: number;
  public RestaurantName!: string;
  public Status!: string;
  public TotalAmount!: number;
  public DeliveryAddress!: string;
  public Reference!: string;
  public Origin!: string;
  public ConfirmedAt!: Date | null;
  public DeliveredAt!: Date | null;
  public CreatedAt!: Date;
  public UpdatedAt!: Date | null;
}

Order.init(
  {
    Id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    UserId: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    RestaurantId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    RestaurantName: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    Status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: OrderStatus.Pending,
    },
    TotalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    DeliveryAddress: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    Reference: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    Origin: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    ConfirmedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    DeliveredAt: {
      type: DataTypes.DATE,
      allowNull: true,
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
    tableName: "Orders",
    timestamps: true,
    createdAt: "CreatedAt",
    updatedAt: "UpdatedAt",
    sequelize: getSequelize(),
    modelName: "Order",
  }
);

export default Order;
