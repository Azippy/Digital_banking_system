const express = require("express");
const protect = require("../Middleware/auth.middleware.js");
const {
  transfer,
  getMyTransactions,
  checkTransactionStatus,
} = require("../Controller/transaction.controller.js");

const route = express.Router();

route.post("/transfer", protect, transfer);
route.get("/", protect, getMyTransactions);
route.get("/:reference/status", protect, checkTransactionStatus);

module.exports = route;
