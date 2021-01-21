const User = require("../models/user");

module.exports = {
  async index(req, res) {
    try {
      const user = await User.findByPk(req.params.id);
      return res.json(user);
    } catch (err) {
      console.log(err);
    }
  },

  async show(req, res) {
    try {
      const user = await User.findAll();
      return res.json(user);
    } catch (err) {
      console.log(err);
    }
  },

  async store(req, res) {
    try {
      const { name, email, telephone } = req.body;
      const user = await User.create({ name, email, telephone });
      return res.json(user);
    } catch (err) {
      console.log(err);
    }
  },

  async update(req, res) {
    try {
      const user = await User.findByPk(req.params.id);
      const { name, email, telephone } = req.body;
      if (user) {
        return res.json(await user.update({ name, email, telephone }));
      } else {
        console.log(user);
      }
    } catch (err) {
      console.log(err);
    }
  },

  async delete(req, res) {
    try {
      const user = await User.findByPk(req.params.id);
      if (user) {
        user.destroy();
        return res.json(user);
      }
    } catch (err) {
      console.log(err);
    }
  },
};
