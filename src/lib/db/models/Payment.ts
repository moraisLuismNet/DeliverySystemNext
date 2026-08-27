import { DataTypes, Model, Optional } from "sequelize";
import { getSequelize } from "../database";
import { PaymentStatus } from "./PaymentStatus";

export interface IPaymentAttributes {
  Id: number;
  OrderId: number;
  StripeSessionId: string;
  StripePaymentIntentId: string;
  Status: string;
  Amount: number;
  Currency: string;
  PaidAt: Date | null;
  CreatedAt: Date;
  UpdatedAt: Date | null;
}

export type PaymentCreationAttributes = Optional<IPaymentAttributes, "Id" | "StripePaymentIntentId" | "PaidAt" | "CreatedAt" | "UpdatedAt">;

export class Payment extends Model<IPaymentAttributes, PaymentCreationAttributes> implements IPaymentAttributes {
  public Id!: number;
  public OrderId!: number;
  public StripeSessionId!: string;
  public StripePaymentIntentId!: string;
  public Status!: string;
  public Amount!: number;
  public Currency!: string;
  public PaidAt!: Date | null;
  public CreatedAt!: Date;
  public UpdatedAt!: Date | null;
}

Payment.init(
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
    StripeSessionId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    StripePaymentIntentId: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "",
    },
    Status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: PaymentStatus.Pending,
    },
    Amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    Currency: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: "usd",
    },
    PaidAt: {
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
    tableName: "Payments",
    timestamps: true,
    createdAt: "CreatedAt",
    updatedAt: "UpdatedAt",
    sequelize: getSequelize(),
    modelName: "Payment",
  }
);

export default Payment;
