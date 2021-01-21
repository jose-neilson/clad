const express = require("express");
const app = express();
const router = require("../db/routes/router");
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use(router);

app.listen(3000, () => {
  console.log("Server is running at http://localhost:3000");
});
