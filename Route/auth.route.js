const express = require("express");
const {
  registerCustomer,
  loginCustomer,
} = require("../Controller/auth.controller.js");
const router = express.Router();

router.post("/login", loginCustomer);
router.post("/register", registerCustomer);

module.exports = router;
