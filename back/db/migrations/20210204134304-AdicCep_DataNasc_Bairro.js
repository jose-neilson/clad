"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    Promise.all([
      await queryInterface.addColumn("Clientes", "cep", {
        type: Sequelize.STRING(8),
        allowNull: false,
      }),
      await queryInterface.addColumn("Clientes", "data_nasc", {
        type: Sequelize.DATE(),
      }),
      await queryInterface.addColumn("Clientes", "bairro", {
        type: Sequelize.STRING(30),
      }),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    Promise.all([
      await queryInterface.removeColumn("Clientes", "cep"),
      await queryInterface.removeColumn("Clientes", "data_nasc"),
      await queryInterface.removeColumn("Clientes", "bairro"),
    ]);
  },
};
