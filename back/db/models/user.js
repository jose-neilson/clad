const Sequelize = require("sequelize");
const DataTypes = Sequelize.DataTypes;
const sequelize = require("../../server/connection");

class User extends Sequelize.Model {}

User.init(
  {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    telephone: DataTypes.STRING,
  },
  {
    sequelize,
    tableName: "Users",
    paranoid: true,
    timestamps: true,
  }
);

module.exports = User;
