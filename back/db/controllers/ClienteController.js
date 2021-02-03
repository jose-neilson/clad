const { Op, fn } = require("sequelize");
const Cliente = require("../models/cliente");

module.exports = {
  async show(req, res) {
    try {
      const cliente = await Cliente.findByPk(req.params.id);
      return res.json(cliente);
    } catch (err) {
      console.log(err);
    }
  },

  async index(req, res) {
    try {
      const { chave, value, pagina, limit, ativo } = req.query;
      let offset = (pagina - 1) * limit;
      let a = {};
      a[chave] = { [Op.like]: `%${value}%` };
      const cliente = await Cliente.findAndCountAll({ where: { ...a, ativo }, order: [["id", "ASC"]], offset, limit });
      return res.json(cliente);
    } catch (err) {
      console.log(err);
    }
  },

  async store(req, res) {
    try {
      const { data } = req.body;
      // const { nome, ...resto } = data;
      const cliente = await Cliente.create({ ...data });
      console.log(cliente);
      return res.json(cliente);
    } catch (err) {
      console.log(err);
    }
  },

  async update(req, res) {
    try {
      const { data } = req.body;
      const cliente = await Cliente.findByPk(req.params.id);
      if (cliente) {
        return res.json(await cliente.update({ ...data }));
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
