const Cliente = require("../models/cliente");

module.exports = {
  async find(req, res) {
    try {
      const cliente = await Cliente.findByPk(req.params.id);
      return res.json(cliente);
    } catch (err) {
      console.log(err);
    }
  },

  async show(req, res) {
    try {
      const { offset, limit } = req.query;
      const cliente = await Cliente.findAndCountAll({ order: [["id", "ASC"]], offset, limit });
      console.log(offset);
      return res.json(cliente);
    } catch (err) {
      console.log(err);
    }
  },

  async store(req, res) {
    try {
      const { nome, cidade, estado, endereço, cpf } = req.body;
      const cliente = await Cliente.create({ nome, cidade, estado, endereço, cpf });
      return res.json(cliente);
    } catch (err) {
      console.log(err);
    }
  },

  async update(req, res) {
    try {
      const { nome, cidade, estado, endereço, cpf } = req.body;
      const cliente = await Cliente.findByPk(req.params.id);
      if (cliente) {
        return res.json(await cliente.update({ nome, cidade, estado, endereço, cpf }));
      } else {
        console.log(cliente);
      }
    } catch (err) {
      console.log(err);
    }
  },

  async delete(req, res) {
    try {
      const cliente = await Cliente.findByPk(req.params.id);
      if (cliente) {
        await cliente.destroy();
        return res.json(cliente);
      } else {
        console.log(cliente);
      }
    } catch (err) {
      console.log(err);
    }
  },
};
