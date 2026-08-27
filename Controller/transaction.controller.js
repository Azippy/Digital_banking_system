const dotenv = require("dotenv");
const Account = require("../Model/account.model.js");
const Transaction = require("../Model/transaction.model.js");
const {
  nameEnquiry,
  getAccountBalance,
  transferMoney,
  checkTransactionStatusService,
} = require("../Services/nibss.service.js");
const generateTransactionReference = require("../utility/generate.transactionreference.js");

const tranfer = async (req, res) => {
  try {
    const { to, amount, bankCode } = req.body;
    if (!to || !amount || !bankCode) {
      return res
        .status(400)
        .json({ message: "Recipient, Amount,and Bank Code are required" });
    }
    const transferAmount = Number(amount);
    if (Number.isNaN(transferAmount) || transferAmount <= 0) {
      return res
        .status(400)
        .json({ message: "Amount Must be greater than zero" });
    }
    const senderAccount = await Account.findOne({ customer: req.user._id });
    if (!senderAccount) {
      return res.status(404).json({ message: "Sender account not found" });
    }
    if (senderAccount.accountNumber === to) {
      return res
        .status(400)
        .json({ message: "You can not transfer money to your own account" });
    }
    const transferType = bankCode === "726" ? "INTRA_BANK" : "INTER_BANK";
    const recipient = await nameEnquiry(to);
    if (!recipient.accountName) {
      return res
        .status(404)
        .json({ message: "Recipient could not be verified" });
    }
    const balanceData = await getAccountBalance(senderAccount.accountNumber);
    if (Number(balanceData.balance) < transferAmount) {
      return res.status(400).json({ message: "Insufficient Balance" });
    }
    const refrence = generateTransactionReference();
    const transaction = await Transaction.create({
      customer: req.user._id,
      senderAccount: senderAccount.accountNumber,
      senderName: req.user.fullName,
      receiverAccount: to,
      receiverName: recipient.accountName,
      bankName: process.env.BANK_NAME,
      bankCode,
      tranferType: transferType,
      amount: transferAmount,
      refrence,
      status: "PENDING",
    });
    const transferResponse = await transferMoney(
      senderAccount.accountNumber,
      to,
      transferAmount,
      bankCode,
    );
    const providerData = transferResponse?.data || transferResponse;
    transaction.status = providerData?.status || "PENDING";
    transaction.externalReference =
      providerData?.transactionId ||
      providerData?.reference ||
      providerData?.refrence ||
      providerData?.id;
    if (!transaction.externalReference) {
      transaction.status = "FAILED";
      transaction.failureReason =
        "NIBSS transfer response did not include a provider reference";
      await transaction.save();
      return res.status(502).json({
        message: transaction.failureReason,
        transactionReference: transaction.refrence,
      });
    }
    await transaction.save();
    return res.status(200).json({
      message: "Transfer Successful",
      refrence: transaction.refrence,
      externalReference: transaction.externalReference,
      senderAccount: transaction.senderAccount,
      receiverAccount: transaction.receiverAccount,
      receiverName: transaction.receiverName,
      amount: transaction.amount,
      transferType: transaction.tranferType,
      status: transaction.status,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt,
    });
  } catch (error) {
    console.error("Transfer Error:", error);
    return res.status(error.statusCode || 500).json({
      message: error.message || "Transfer failed",
      ...(error.details ? { details: error.details } : {}),
    });
  }
};

const getMyTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      customer: req.user._id,
    }).sort({ createdAt: -1 });
    return res.status(200).json({ count: transactions.length, transactions });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Unable to get transactions" });
  }
};

const checkTransactionStatus = async (req, res) => {
  try {
    const { reference } = req.params;
    const transaction = await Transaction.findOne({
      customer: req.user._id,
      $or: [{ refrence: reference }, { externalReference: reference }],
    });
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    if (!transaction.externalReference) {
      return res.status(409).json({
        message: "Transaction has no provider reference for status lookup",
      });
    }
    const statusResponse = await checkTransactionStatusService(
      transaction.externalReference,
    );
    const providerData = statusResponse?.data || statusResponse;
    transaction.status = providerData.status;
    await transaction.save();
    return res.status(200).json({
      transactionId: providerData.transactionId,
      refrence: transaction.refrence,
      status: transaction.status,
      amount: providerData.amount,
      from: providerData.from,
      senderName: transaction.senderName,
      to: providerData.to,
      receiverName: transaction.receiverName,
      bankName: transaction.bankName,
      bankCode: transaction.bankCode,
      transferType: transaction.tranferType,
      timestamp: providerData.timestamp,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || "Unable to check transaction status",
      ...(error.details ? { details: error.details } : {}),
    });
  }
};

module.exports = {
  transfer: tranfer,
  getMyTransactions,
  checkTransactionStatus,
};
