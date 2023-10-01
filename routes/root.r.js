const { handleRefreshToken } = require("../controllers/tokens.c");

const Route = require("express").Router();

Route.get("/", (req, res) => {
  res.json({ message: "root route" });
});

Route.get("/refresh-token", handleRefreshToken);

module.exports = Route;
