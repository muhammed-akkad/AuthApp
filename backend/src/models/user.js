import { DataTypes } from "sequelize";

export default (sequelize) => {
  const User = sequelize.define("User", {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
  });
  return User;
};
