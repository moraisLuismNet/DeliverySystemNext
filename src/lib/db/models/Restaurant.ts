import { DataTypes, Model, Optional } from "sequelize";
import { getSequelize } from "../database";

export interface IRestaurantAttributes {
  Id: number;
  Name: string;
  Description: string;
  Address: string;
  Phone: string;
  ImageUrl: string | null;
  IsActive: boolean;
  CreatedAt: Date;
  UpdatedAt: Date | null;
}

export type RestaurantCreationAttributes = Optional<IRestaurantAttributes, "Id" | "ImageUrl" | "CreatedAt" | "UpdatedAt">;

export class Restaurant extends Model<IRestaurantAttributes, RestaurantCreationAttributes> implements IRestaurantAttributes {
  public Id!: number;
  public Name!: string;
  public Description!: string;
  public Address!: string;
  public Phone!: string;
  public ImageUrl!: string | null;
  public IsActive!: boolean;
  public CreatedAt!: Date;
  public UpdatedAt!: Date | null;
}

Restaurant.init(
  {
    Id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Name: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    Description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    Address: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    Phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    ImageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "https://imgur.com/Zemqvh3.png",
    },
    IsActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
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
    tableName: "Restaurants",
    timestamps: true,
    createdAt: "CreatedAt",
    updatedAt: "UpdatedAt",
    sequelize: getSequelize(),
    modelName: "Restaurant",
  }
);

export default Restaurant;
