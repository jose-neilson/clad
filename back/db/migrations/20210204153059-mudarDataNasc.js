"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("Clientes", "data_nasc", {
      type: Sequelize.DATEONLY(),
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("Clientes", "data_nasc", {
      type: Sequelize.DATE(),
    });
  },
};
