const Customer = require("../Model/customer.model.js");
const { createBvn, validatBvn } = require("../Services/nibss.service.js");

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
    if (!nibssResponse) {
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
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "NIN Onboarding Failed" });
  }
};

module.exports = { onboardWithBvn, validateCustomerBvn, onboardWithNin };
