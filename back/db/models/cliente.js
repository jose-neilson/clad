const Sequelize = require("sequelize");
const DataTypes = Sequelize.DataTypes;
const sequelize = require("../../server/connection");

class Cliente extends Sequelize.Model {}

Cliente.init(
  {
    nome: {
      type: DataTypes.STRING(100),
      set(value) {
        const nome = value.replace(/[0-9]/g, "");
        this.setDataValue("nome", nome);
      },
    },
    cpf: {
      type: DataTypes.STRING(11),
      set(value) {
        const cpf = value.replace(".", "").replace(".", "").replace("-", "");
        this.setDataValue("cpf", cpf);
      },
    },
    cep: {
      type: DataTypes.STRING(8),
      set(value) {
        const cep = value.replace("-", "");
        this.setDataValue("cep", cep);
      },
    },
    data_nasc: DataTypes.DATE(),
    uf: DataTypes.CHAR(2),
    cidade: DataTypes.STRING(40),
    bairro: DataTypes.STRING(30),
    endereço: DataTypes.STRING(80),
    numero_rua: DataTypes.STRING(6),
    complemento: DataTypes.STRING(20),
    ativo: DataTypes.BOOLEAN,
  },
  {
    sequelize,
    tableName: "Clientes",
    paranoid: true,
    timestamps: true,
  }
);

module.exports = Cliente;
