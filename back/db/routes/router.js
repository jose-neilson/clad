const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");

router.get("/users/", UserController.show);

router.get("/users/:id", UserController.index);

router.post("/users/", UserController.store);

router.put("/users/:id", UserController.update);

router.delete("/users/:id", UserController.delete);

module.exports = router;
