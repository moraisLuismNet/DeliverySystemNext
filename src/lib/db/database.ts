import { Sequelize } from "sequelize";

let sequelizeInstance: Sequelize | null = null;

export function getSequelize(): Sequelize {
  if (!sequelizeInstance) {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error("DATABASE_URL environment variable is not set");
    }

    sequelizeInstance = new Sequelize(databaseUrl, {
      dialect: "postgres",
      logging: false,
      define: { timestamps: false, freezeTableName: true, underscored: false },
      pool: { max: 5, min: 0, acquire: 30000, idle: 10000 },
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
    });
  }

  return sequelizeInstance;
}
