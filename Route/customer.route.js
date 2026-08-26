const express = require("express");
const protect = require("../Middleware/auth.middleware.js");
const getMyProfile = require("../Controller/customer.controller.js");
const router = express.Router();

router.get("/me", protect, getMyProfile);

module.exports = router;
