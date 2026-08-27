const axios = require("axios");
const nibssAuthApi = axios.create({
  baseURL: process.env.NIBSS_AUTH_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const nibssApi = axios.create({
  baseURL: process.env.NIBSS_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const handleNibssError = (error, operation = "NIBSS request") => {
  if (error.response) {
    const responseData = error.response.data;
    const providerMessage =
      responseData?.message || responseData?.error || "No provider message";
    const apiError = new Error(
      `${operation} failed: ${providerMessage} (HTTP ${error.response.status})`,
    );

    apiError.statusCode = error.response.status;
    apiError.details = responseData;
    throw apiError;
  }
  if (error.request) {
    const networkCode = error.code ? ` (${error.code})` : "";
    const apiError = new Error(
      `${operation} failed: No response received from NibssByPhoenix API${networkCode}`,
    );
    apiError.statusCode = 503;
    apiError.code = error.code;
    throw apiError;
  }
  throw error;
};

const loginToNibss = async () => {
  try {
    const response = await nibssApi.post("/api/auth/token", {
      apiKey: process.env.NIBSS_API_KEY,
      apiSecret: process.env.NIBSS_API_SECRET,
    });
    return response.data;
  } catch (error) {
    handleNibssError(error, "NIBSS login");
  }
};
const getNibssToken = async () => {
  const data = await loginToNibss();
  return data.token;
};

const createBvn = async (bvnData) => {
  try {
    const token = await getNibssToken();
    const response = await nibssApi.post("/api/insertBvn", bvnData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    handleNibssError(error);
  }
};

const validatBvn = async (bvn) => {
  try {
    const token = await getNibssToken();
    const response = await nibssApi.post(
      "/api/validateBvn",
      { bvn },
      { headers: { Authorization: `Bearer ${token}` } },
    );
    return response.data;
  } catch (error) {
    handleNibssError(error, "BVN validation");
  }
};

const createAccount = async (accountData) => {
  try {
    const token = await getNibssToken();
    const response = await nibssApi.post("/api/account/create", accountData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    handleNibssError(error, "Account creation");
  }
};

const getNibssAccounts = async () => {
  try {
    const token = await getNibssToken();

    // const config = { headers: { Authorization: `Bearer ${token}` } };
    // console.log("Token Received:", token);

    const response = await nibssApi.get("/api/accounts", {
      header: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    //console.log("NIBSS Response:", error.Response?.data);
    handleNibssError(error, "Account retrieval");
  }
};

const getAccountBalance = async (accountNumber) => {
  try {
    const token = await getNibssToken();
    const response = await nibssApi.get(
      `/api/account/balance/${accountNumber}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    handleNibssError(error, "Balance lookup");
  }
};

const nameEnquiry = async (accountNumber) => {
  try {
    const token = await getNibssToken();
    const response = await nibssApi.get(
      `/api/account/name-enquiry/${accountNumber}`,
      { headers: { Authorization: `Bearer ${token}` } },
    );
    return response.data;
  } catch (error) {
    handleNibssError(error, "Name enquiry");
  }
};

const transferMoney = async (from, to, amount, bankCode) => {
  try {
    const token = await getNibssToken();
    const response = await nibssApi.post(
      "/api/transfer",
      { from, to, amount, bankCode },
      { headers: { Authorization: `Bearer ${token}` } },
    );
    return response.data;
  } catch (error) {
    handleNibssError(error, "Money transfer");
  }
};
const checkTransactionStatusService = async (transactionId) => {
  try {
    const token = await getNibssToken();
    const response = await nibssApi.get(`/api/transaction/${transactionId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    handleNibssError(error, "Transaction status lookup");
  }
};

module.exports = {
  nibssApi,
  nibssAuthApi,
  handleNibssError,
  loginToNibss,
  getNibssToken,
  createBvn,
  validatBvn,
  createAccount,
  getNibssAccounts,
  getAccountBalance,
  nameEnquiry,
  transferMoney,
  checkTransactionStatusService,
};
