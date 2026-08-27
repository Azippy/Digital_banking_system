const express = require("express");
const protect = require("../Middleware/auth.middleware.js");
const {
  createCustomerAccount,
  getMyAccount,
  syncMyAccount,
} = require("../Controller/account.controller.js");

const route = express.Router();

route.post("/", protect, createCustomerAccount);
route.get("/me", protect, getMyAccount);
route.post("/sync", protect, syncMyAccount);

module.exports = route;
