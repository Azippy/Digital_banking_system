const express = require("express");
const { loginNibss } = require("../Controller/nibss.controller");

const route = express.Router();

route.post("/login", loginNibss);

module.exports = route;
