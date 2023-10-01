const { login, signup, logout, browseUser } = require("../controllers/users.c");
const { authenticate } = require("../middlewares/authenticate");

const Route = require("express").Router();

Route.get("/", authenticate, browseUser);

Route.post("/signup", signup);

Route.post("/login", login);

Route.delete("/logout", logout);

module.exports = Route;
