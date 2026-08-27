const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    bvn: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    onboardingMethod: {
      type: String,
      enum: ["BVN", "NIN", null],
      default: null,
    },
    onboardingStatus: {
      type: String,
      enum: ["NOT_STARTED", "PENDING", "VERIFIED", "FAILED"],
      default: "NOT_STARTED",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const Customer = mongoose.model("Customer", customerSchema);

module.exports = Customer;
