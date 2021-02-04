"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn("Clientes", "estado", "uf");
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn("Clientes", "uf", "estado");
  },
};
