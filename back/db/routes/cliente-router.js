const express = require("express");
const router = express.Router();
const ClienteController = require("../controllers/ClienteController");

router.get("/clientes/", ClienteController.show);

router.get("/clientes/:id", ClienteController.find);

router.post("/clientes/", ClienteController.store);

router.put("/clientes/:id", ClienteController.update);

router.delete("/clientes/:id", ClienteController.delete);

module.exports = router;
