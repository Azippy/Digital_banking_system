const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
      unique: true,
    },
    accountNumber: {
      type: String,
      required: true,
      unique: true,
    },
    accountName: {
      type: String,
      required: true,
    },
    bankCode: {
      type: String,
      required: true,
    },
    fintechId: {
      type: String,
      required: true,
    },
    kycType: {
      type: String,
      enum: ["bvn", "nin"],
      required: true,
    },
    kycID: {
      type: String,
      required: true,
    },
    balance: {
      type: Number,
      default: 15000,
    },
  },
  { timestamps: true },
);

const Account = mongoose.model("Account", accountSchema);

module.exports = Account;
