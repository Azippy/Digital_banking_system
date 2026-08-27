const Account = require("../Model/account.model.js");
const Transaction = require("../Model/transaction.model.js");
const {
  createAccount,
  getNibssAccounts,
  getAccountBalance,
  nameEnquiry,
  transferMoney,
} = require("../Services/nibss.service.js");
const generateTransactionReference = require("../utility/generate.transactionreference.js");

const createCustomerAccount = async (req, res) => {
  try {
    if (!req.user.isVerified) {
      return res.status(403).json({
        message:
          "Account Creation is Allowed Only After Onboarding And Verification",
      });
    }
    const existingAccount = await Account.findOne({ customer: req.user._id });
    if (existingAccount) {
      return res
        .status(409)
        .json({ message: "Customer Already Has An Account" });
    }
    const { kycID, dob } = req.body;
    if (!kycID || !dob) {
      return res.status(400).json({ message: "kycID and dob are required" });
    }

    const kycType = req.user.onboardingMethod.toLowerCase();

    const accountData = {
      kycType,
      kycID,
      dob,
    };
    const nibssResponse = await createAccount(accountData);

    if (!nibssResponse || !nibssResponse.account) {
      return res.status(400).json({
        message: "NIBSS did not return account information",
        data: nibssResponse,
      });
    }
    console.log(nibssResponse);

    const nibssAccount = nibssResponse.account;
    console.log(nibssAccount.accountNumber);
    const account = await Account.create({
      customer: req.user._id,
      accountNumber: nibssAccount.accountNumber,
      accountName: nibssAccount.accountName,
      bankCode: nibssAccount.bankCode,
      fintechId: nibssAccount.fintechId,
      kycType: nibssAccount.kycType,
      kycID: nibssAccount.kycID,
      balance: nibssAccount.balance,
    });
    return res
      .status(201)
      .json({ message: "Account Created Successfully", account });
  } catch (error) {
    console.error("Local account save failed:", error);
    return res.status(500).json({
      message:
        "Account was created successfully on NIBSS, but failed to save locally, please synchronize ,Account Creation Failed",
    });
  }
};

const getMyAccount = async (req, res) => {
  try {
    const account = await Account.findOne({ customer: req.user._id });
    if (!account) {
      return res.status(404).json({ message: "Account Not Found" });
    }
    return res
      .status(200)
      .json({ message: "Account Retrieved Successfully", account });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Failed To Retrieve Account" });
  }
};

const syncMyAccount = async (req, res) => {
  try {
    const existingAccount = await Account.findOne({ customer: req.user._id });
    if (existingAccount) {
      return res
        .status(409)
        .json({ message: "Account Already in Local Database" });
    }
    const nibssResponse = await getNibssAccounts();
    console.log("NIBSS Account:", nibssResponse);
    const nibssAccount = nibssResponse.accounts.find(
      (account) =>
        account.kycID === req.body.kycID &&
        account.kycType.toLowerCase() ===
          req.user.onboardingMethod.toLowerCase(),
    );
    if (!nibssAccount) {
      return res.status(404).json({
        message: "No Account Found on Nibss for this Customer's KYC verified",
      });
    }
    const account = await Account.create({
      customer: req.user._id,
      accountNumber: nibssAccount.accountNumber,
      accountName: nibssAccount.accountName,
      bankCode: nibssAccount.bankCode,
      fintechId: nibssAccount.fintechId,
      kycType: nibssAccount.kycType,
      kycID: nibssAccount.kycID,
      balance: nibssAccount.balance,
    });
    return res.status(201).json({
      message: "Existing NIBSS account synchronized Successfully",
      account,
    });
  } catch (error) {
    console.error("Account synchronization Error:", error);
    return res.status(500).json({ message: "Failed to synchronize" });
  }
};

const checkMyBalance = async (req, res) => {
  try {
    const account = await Account.findOne({ customer: req.user._id });
    if (!account) {
      return res.status(404).json({ message: "Account Not Found" });
    }
    const balanceData = await getAccountBalance(account.accountNumber);
    account.balance = balanceData.balance;
    await account.save();

    return res.status(200).json({
      message: "Balance Retrieved Successfully",
      accountName: balanceData.accountName,
      accountNumber: balanceData.accountNumber,
    });
  } catch (error) {
    console.error("Balance Check Error:", error);
    return res
      .status(500)
      .json({ message: "Failed To retrieve account Balance" });
  }
};

const nameEnquiryController = async (req, res) => {
  try {
    const { accountNumber } = req.params;
    if (!accountNumber) {
      return res.status(400).json({ message: "Account number is required" });
    }
    const senderAccount = await Account.findOne({ customer: req.user._id });
    if (senderAccount?.accountNumber === accountNumber) {
      return res.status(400).json({
        message: " You can not perform name enquiry on your own account",
      });
    }

    const recipient = await nameEnquiry(accountNumber);
    return res
      .status(200)
      .json({ message: "Name Enquiry Successful", recipient });
  } catch (error) {
    console.error("Name Enquiry Error:", error);
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Failed To Perform Name Enquiry" });
  }
};

module.exports = {
  createCustomerAccount,
  getMyAccount,
  syncMyAccount,
  checkMyBalance,
  nameEnquiryController,
};
