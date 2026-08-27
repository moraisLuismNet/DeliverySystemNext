import { DataTypes, Model, Optional } from "sequelize";
import { getSequelize } from "../database";

export interface IMenuItemAttributes {
  Id: number;
  RestaurantId: number;
  Name: string;
  Description: string;
  Price: number;
  CategoryId: number;
  IsAvailable: boolean;
  ImageUrl: string | null;
  Stock: number;
  CreatedAt: Date;
  UpdatedAt: Date | null;
}

export type MenuItemCreationAttributes = Optional<IMenuItemAttributes, "Id" | "ImageUrl" | "IsAvailable" | "CreatedAt" | "UpdatedAt">;

export class MenuItem extends Model<IMenuItemAttributes, MenuItemCreationAttributes> implements IMenuItemAttributes {
  public Id!: number;
  public RestaurantId!: number;
  public Name!: string;
  public Description!: string;
  public Price!: number;
  public CategoryId!: number;
  public IsAvailable!: boolean;
  public ImageUrl!: string | null;
  public Stock!: number;
  public CreatedAt!: Date;
  public UpdatedAt!: Date | null;
}

MenuItem.init(
  {
    Id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    RestaurantId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "Restaurants", key: "Id" },
    },
    Name: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    Description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    Price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    CategoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "Categories", key: "Id" },
    },
    IsAvailable: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    ImageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    Stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
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
    tableName: "MenuItems",
    timestamps: true,
    createdAt: "CreatedAt",
    updatedAt: "UpdatedAt",
    sequelize: getSequelize(),
    modelName: "MenuItem",
  }
);

export default MenuItem;
