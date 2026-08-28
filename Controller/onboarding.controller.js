const { BaseConnection } = require("mongoose");
const Customer = require("../Model/customer.model.js");
const {
  createBvn,
  validatBvn,
  createNin,
  validateNin,
} = require("../Services/nibss.service.js");

const onboardWithBvn = async (req, res) => {
  try {
    const { bvn, firstName, lastName, dob, phone } = req.body;
    if (!bvn || !firstName || !lastName || !dob || !phone) {
      return res
        .status(400)
        .json({ message: "Please provide all the required field" });
    }
    const bvnData = { bvn, firstName, lastName, dob, phone };
    const nibssResponse = await createBvn(bvnData);
    return res
      .status(201)
      .json({ message: "BVN Created Successfully", bvn: nibssResponse.data });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "BVN Creation Failed" });
  }
};

const validateCustomerBvn = async (req, res) => {
  try {
    const { bvn } = req.body;
    if (!bvn) {
      return res.status(400).json({ message: "BVN is Required" });
    }
    const nibssResponse = await validatBvn(bvn);
    if (!nibssResponse.success) {
      return res.status(400).json({ message: "BVN Validation Failed" });
    }
    req.user.onboardingMethod = "BVN";
    req.user.onboardingStatus = "VERIFIED";
    req.user.isVerified = true;
    req.user.bvn = bvn;
    await req.user.save();
    return res.status(200).json({
      message: "BVN Validated Successfully, Customer is Verified",
      data: nibssResponse.data,
    });
  } catch (error) {
    console.error(error.message);
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "BVN Validation Failed" });
  }
};

const onboardWithNin = async (req, res) => {
  try {
    const { nin, firstName, lastName, dob } = req.body;
    if (!nin || !firstName || !lastName || !dob) {
      return res
        .status(400)
        .json({ message: "Please provide all required field" });
    }
    const ninData = { nin, firstName, lastName, dob };
    const nibssResponse = await createNin(ninData);
    return res
      .status(201)
      .json({ message: "NIN Created successfully", data: nibssResponse });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "NIN Onboarding Failed" });
  }
};

const validateCustomerNin = async (req, res) => {
  try {
    const { nin } = req.body;

    if (!nin) {
      return res.status(400).json({
        message: "NIN is required",
      });
    }

    const nibssResponse = await validateNin(nin);

    console.log("NIN Response:", nibssResponse);

    if (!nibssResponse.response) {
      return res.status(400).json({
        message: "NIN validation failed",
      });
    }

    req.user.onboardingMethod = "NIN";
    req.user.onboardingStatus = "VERIFIED";
    req.user.isVerified = true;

    await req.user.save();

    return res.status(200).json({
      message: "NIN validated successfully. Customer is now verified.",
      data: {
        nin: nibssResponse.response.nin,
        firstName: nibssResponse.response.firstName,
        lastName: nibssResponse.response.lastName,
        dob: nibssResponse.response.dob,
      },
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || "NIN validation failed",
    });
  }
};

module.exports = {
  onboardWithBvn,
  validateCustomerBvn,
  onboardWithNin,
  validateCustomerNin,
};
