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

const handleNibssError = (error) => {
  if (error.response) {
    const apiError = new Error(
      error.response.data?.message || "NibssByPhoenix API returned an error",
    );

    apiError.statusCode = error.response.status;
    throw apiError;
  }
  if (error.request) {
    const apiError = new Error("No response received from NibssByPhoenix API");
    apiError.statusCode = 503;
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
    handleNibssError(error);
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
    handleNibssError(error);
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
    handleNibssError(error);
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
    handleNibssError(error);
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
};
