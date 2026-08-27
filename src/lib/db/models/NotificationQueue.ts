import { DataTypes, Model, Optional } from "sequelize";
import { getSequelize } from "../database";
import { QueueStatus } from "./QueueStatus";

export interface INotificationQueueAttributes {
  Id: number;
  PhoneNumber: string;
  Message: string;
  OrderId: number;
  Status: string;
  RetryCount: number;
  ErrorMessage: string | null;
  CreatedAt: Date;
  SentAt: Date | null;
  ScheduledAt: Date;
}

export type NotificationQueueCreationAttributes = Optional<INotificationQueueAttributes, "Id" | "Status" | "RetryCount" | "ErrorMessage" | "CreatedAt">;

export class NotificationQueue extends Model<INotificationQueueAttributes, NotificationQueueCreationAttributes> implements INotificationQueueAttributes {
  public Id!: number;
  public PhoneNumber!: string;
  public Message!: string;
  public OrderId!: number;
  public Status!: string;
  public RetryCount!: number;
  public ErrorMessage!: string | null;
  public CreatedAt!: Date;
  public SentAt!: Date | null;
  public ScheduledAt!: Date;
}

NotificationQueue.init(
  {
    Id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    PhoneNumber: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    Message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    OrderId: {
      type: DataTypes.INTEGER,
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
    ScheduledAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: "NotificationQueues",
    timestamps: false,
    sequelize: getSequelize(),
    modelName: "NotificationQueue",
  }
);

export default NotificationQueue;
