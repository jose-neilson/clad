"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    Promise.all([
      await queryInterface.changeColumn("Clientes", "nome", {
        type: Sequelize.STRING(100),
      }),
      await queryInterface.changeColumn("Clientes", "cpf", {
        type: Sequelize.STRING(11),
      }),
      await queryInterface.changeColumn("Clientes", "estado", {
        type: Sequelize.CHAR(2),
      }),
      await queryInterface.changeColumn("Clientes", "cidade", {
        type: Sequelize.STRING(40),
      }),
      await queryInterface.changeColumn("Clientes", "endereço", {
        type: Sequelize.STRING(80),
      }),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    Promise.all([
      await queryInterface.changeColumn("Clientes", "nome", {
        type: Sequelize.STRING(),
      }),
      await queryInterface.changeColumn("Clientes", "cpf", {
        type: Sequelize.STRING(),
      }),
      await queryInterface.changeColumn("Clientes", "estado", {
        type: Sequelize.STRING(),
      }),
      await queryInterface.changeColumn("Clientes", "cidade", {
        type: Sequelize.STRING(),
      }),
      await queryInterface.changeColumn("Clientes", "endereço", {
        type: Sequelize.STRING(),
      }),
    ]);
  },
};
