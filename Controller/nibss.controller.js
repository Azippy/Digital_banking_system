const { loginToNibss } = require("../Services/nibss.service.js");
const loginNibss = async (req, res) => {
  try {
    const data = await loginToNibss();
    return res.status(200).json({
      message: "Successfully connected to NibssByPhoenix",
      data,
    });
  } catch (error) {
    return res
      .status(500)
      .json({
        message: "failed to login to NibssByPhoenix",
        error: error.response?.data || error.message,
      });
  }
};

module.exports= {loginNibss}
