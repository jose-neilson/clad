const Sequelize = require("sequelize");
const DataTypes = Sequelize.DataTypes;
const sequelize = require("../../server/connection");

class Cliente extends Sequelize.Model {}

Cliente.init(
  {
    nome: DataTypes.STRING,
    cidade: DataTypes.STRING,
    estado: DataTypes.STRING,
    endereço: DataTypes.STRING,
    cpf: DataTypes.STRING,
  },
  {
    sequelize,
    tableName: "Clientes",
    paranoid: true,
    timestamps: true,
  }
);

module.exports = Cliente;
