const express = require("express");
const {
  onboardWithBvn,
  validateCustomerBvn,
  onboardWithNin,
} = require("../Controller/onboarding.controller.js");
const protect = require("../Middleware/auth.middleware.js");
const router = express.Router();

router.post("/bvn", protect, onboardWithBvn);
router.post("/bvn/validate", protect, validateCustomerBvn);
router.post("/nin", protect, onboardWithNin);

module.exports = router;
