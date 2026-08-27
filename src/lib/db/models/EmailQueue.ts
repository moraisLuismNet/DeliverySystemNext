import { DataTypes, Model, Optional } from "sequelize";
import { getSequelize } from "../database";
import { QueueStatus } from "./QueueStatus";

export interface IEmailQueueAttributes {
  Id: number;
  OrderId: number;
  ToEmail: string;
  Subject: string;
  Body: string;
  Status: string;
  RetryCount: number;
  ErrorMessage: string | null;
  CreatedAt: Date;
  SentAt: Date | null;
}

export type EmailQueueCreationAttributes = Optional<IEmailQueueAttributes, "Id" | "OrderId" | "Status" | "RetryCount" | "ErrorMessage" | "CreatedAt">;

export class EmailQueue extends Model<IEmailQueueAttributes, EmailQueueCreationAttributes> implements IEmailQueueAttributes {
  public Id!: number;
  public OrderId!: number;
  public ToEmail!: string;
  public Subject!: string;
  public Body!: string;
  public Status!: string;
  public RetryCount!: number;
  public ErrorMessage!: string | null;
  public CreatedAt!: Date;
  public SentAt!: Date | null;
}

EmailQueue.init(
  {
    Id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    OrderId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      references: { model: "Orders", key: "Id" },
    },
    ToEmail: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    Subject: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    Body: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    Status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: QueueStatus.Pending,
    },
    RetryCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    ErrorMessage: {
      type: DataTypes.STRING(1000),
      allowNull: true,
    },
    CreatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    SentAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "EmailQueues",
    timestamps: false,
    sequelize: getSequelize(),
    modelName: "EmailQueue",
  }
);

export default EmailQueue;
