const jwt = require("jsonwebtoken");
const Customer = require("../Model/customer.model.js");
const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.toLowerCase().startsWith("bearer")) {
      return res
        .status(401)
        .json({ message: "Token not found, Authorization denied" });
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ message: "Invalid Token, No Authorization" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const customer = await Customer.findById(decoded.id);
    if (!customer) {
      return res.status(404).json({ message: "Customer no longer exists" });
    }

    req.user = customer;
    next();
  } catch (err) {
    console.error(err.message);
    return res.status(401).json({ message: "Invalid Token || Token expired" });
  }
};

module.exports = protect;
