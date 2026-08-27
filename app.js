const express = require("express");
const app = express();
app.use(express.json());
const authRouter = require("./Route/auth.route.js");
const customerRoute = require("./Route/customer.route.js");
const onboardingRoute = require("./Route/onboarding.routes.js");
const nibssRoute = require("./Route/nibss.route.js");
const accountRoute = require("./Route/account.route.js");
const transactionRoute = require("./Route/transaction.route.js");
app.use("/api", authRouter);
app.use("/api", customerRoute);
app.use("/api", onboardingRoute);
app.use("/api/nibss", nibssRoute);
app.use("/api/accounts", accountRoute);
app.use("/api/transactions", transactionRoute);
app.get("/", (req, res) => {
  res.json({ message: "Digital Banking Api is running" });
});

module.exports = app;
