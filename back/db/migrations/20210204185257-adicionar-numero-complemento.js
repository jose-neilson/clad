"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    Promise.all([
      await queryInterface.addColumn("Clientes", "numero_rua", {
        type: Sequelize.STRING(6),
      }),
      await queryInterface.addColumn("Clientes", "complemento", {
        type: Sequelize.STRING(20),
      }),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    Promise.all([await queryInterface.removeColumn("Clientes", "numero_rua"), await queryInterface.removeColumn("Clientes", "complemento")]);
  },
};
