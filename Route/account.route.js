const express = require("express");
const protect = require("../Middleware/auth.middleware.js");
const {
  createCustomerAccount,
  getMyAccount,
  syncMyAccount,
  checkMyBalance,
  nameEnquiryController,
} = require("../Controller/account.controller.js");

const route = express.Router();

route.get("/me", protect, getMyAccount);
route.get("/balance", protect, checkMyBalance);
route.get("/name-enquiry/:accountNumber", protect, nameEnquiryController);
route.post("/sync", protect, syncMyAccount);
route.post("/", protect, createCustomerAccount);

module.exports = route;
