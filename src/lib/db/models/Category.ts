import { DataTypes, Model, Optional } from "sequelize";
import { getSequelize } from "../database";

export interface ICategoryAttributes {
  Id: number;
  Name: string;
  Description: string | null;
  IsActive: boolean;
  CreatedAt: Date;
  UpdatedAt: Date | null;
}

export type CategoryCreationAttributes = Optional<ICategoryAttributes, "Id" | "Description" | "CreatedAt" | "UpdatedAt">;

export class Category extends Model<ICategoryAttributes, CategoryCreationAttributes> implements ICategoryAttributes {
  public Id!: number;
  public Name!: string;
  public Description!: string | null;
  public IsActive!: boolean;
  public CreatedAt!: Date;
  public UpdatedAt!: Date | null;
}

Category.init(
  {
    Id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    Description: {
      type: DataTypes.STRING(500),
      allowNull: true,
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
    tableName: "Categories",
    timestamps: true,
    createdAt: "CreatedAt",
    updatedAt: "UpdatedAt",
    sequelize: getSequelize(),
    modelName: "Category",
  }
);

export default Category;
