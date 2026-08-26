const Customer = require("../Model/customer.model.js");
const bcrypt = require("bcryptjs");
const generateToken = require("../utility/generateToken.js");

const registerCustomer = async (req, res) => {
  try {
    const { fullName, email, password, phoneNumber } = req.body;

    if (!fullName || !email || !password || !phoneNumber) {
      return res.status(400).json({ message: "Please provide all the field" });
    }

    const existingUser = await Customer.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User Already registered" });
    }
    const existingPhoneNumber = await Customer.findOne({ phoneNumber });
    if (existingPhoneNumber) {
      return res.status(409).json({ message: "PhoneNumber already exist" });
    }
    const hashPassword = await bcrypt.hash(password, 10);

    const customer = await Customer.create({
      fullName,
      email,
      password: hashPassword,
      phoneNumber,
    });
    const token = generateToken(customer._id);
    return res.status(201).json({
      success: true,
      message: "Customer Registered Successfully",
      token,
      customer,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const loginCustomer = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Please provide all field" });
    }
    const customer = await Customer.findOne({ email }).select("+password");
    if (!customer) {
      return res.status(404).json({ message: "user does not exist" });
    }
    const isPasswordCorrect = await bcrypt.compare(password, customer.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "incorrect password" });
    }
    const token = generateToken(customer._id);
    return res.status(200).json({
      success: true,
      message: "Logging Successfully",
      customer,
      token,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal Server error" });
  }
};

module.exports = { registerCustomer, loginCustomer };
