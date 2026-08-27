const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    senderAccount: {
      type: String,
      required: true,
    },
    senderName: {
      type: String,
      required: true,
    },
    bankName: {
      type: String,
      required: true,
    },
    receiverAccount: {
      type: String,
      required: true,
    },
    receiverName: {
      type: String,
      required: true,
    },
    bankCode: {
      type: String,
      required: true,
    },
    tranferType: {
      type: String,
      enum: ["INTRA_BANK", "INTER_BANK"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    refrence: {
      type: String,
      required: true,
      unique: true,
    },
    externalReference: {
      type: String,
    },
    status: {
      type: String,
      enum: ["PENDING", "SUCCESS", "FAILED"],
      default: "PENDING",
    },
    failureReason: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
);

const Transaction = mongoose.model("Transaction", transactionSchema);
module.exports = Transaction;
