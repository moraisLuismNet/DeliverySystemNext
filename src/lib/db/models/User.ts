import { DataTypes, Model, Optional } from "sequelize";
import { getSequelize } from "../database";
import { UserRole } from "./enums";

export interface IUserAttributes {
  Email: string;
  PhoneNumber: string;
  Name: string;
  PasswordHash: string;
  Role: string;
  IsActive: boolean;
}

export type UserCreationAttributes = Optional<IUserAttributes, "IsActive">;

export class User extends Model<IUserAttributes, UserCreationAttributes> implements IUserAttributes {
  public Email!: string;
  public PhoneNumber!: string;
  public Name!: string;
  public PasswordHash!: string;
  public Role!: string;
  public IsActive!: boolean;
}

User.init(
  {
    Email: {
      type: DataTypes.STRING(255),
      primaryKey: true,
      allowNull: false,
    },
    PhoneNumber: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    Name: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    PasswordHash: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    Role: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: UserRole.Customer,
    },
    IsActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: "Users",
    timestamps: false,
    sequelize: getSequelize(),
    modelName: "User",
    indexes: [
      { fields: ["PhoneNumber"] },
    ],
  }
);

export default User;
