import UserModel from "./user.js";
import { sequelize } from "../config/config.js";

const User = UserModel(sequelize);
await sequelize.sync();

export { User };
