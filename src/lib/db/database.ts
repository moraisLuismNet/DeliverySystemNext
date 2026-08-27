import { Sequelize } from "sequelize";
import pg from "pg";

let sequelizeInstance: Sequelize | null = null;

export let databaseInitError: string | null = null;

export function getSequelize(): Sequelize {
  if (databaseInitError) {
    throw new Error(databaseInitError);
  }

  if (!sequelizeInstance) {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      databaseInitError = "DATABASE_URL environment variable is not set";
      throw new Error(databaseInitError);
    }

    try {
      sequelizeInstance = new Sequelize(databaseUrl, {
        dialect: "postgres",
        dialectModule: pg as any,
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
    } catch (error: any) {
      databaseInitError = `Database initialization failed: ${error?.message || String(error)}`;
      throw new Error(databaseInitError);
    }
  }

  return sequelizeInstance;
}
