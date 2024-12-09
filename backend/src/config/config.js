import { Sequelize } from "sequelize";

export const SECRET_KEY = process.env.SECRET_KEY || "your-secret-key";

export const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite",
});
