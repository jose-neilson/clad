"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Clientes",
      [
        {
          nome: "John Doe",
          cpf: "11111111111",
          cep: "50248751",
          uf: "CE",
          cidade: "Fortaleza",
          bairro: "Aldeota",
          endereço: "Rua Comum",
          data_nasc: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("People", null, {});
  },
};
